"""HTTP API views for the HArvest panel.

This is primarily an internal API between the bundled panel JS and the
integration. Management endpoints require HA authentication. A small set of
runtime asset endpoints is public so external widgets can load their files.
All endpoints are prefixed with /api/harvest/.
"""
from __future__ import annotations

import asyncio
import dataclasses
import ipaddress
import logging
import re
import socket
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_LOGGER = logging.getLogger(__name__)

import aiohttp
from aiohttp import web
from aiohttp.abc import AbstractResolver, ResolveResult
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from yarl import URL

from ._utils import close_ws_with_auth_failed as _close_ws_with_auth_failed, get_entry_data, log_send_failure
from .activity_store import ActivityStore, TokenLifecycleEvent
from .const import ALIAS_LENGTH, BASE62_ALPHABET, ICON_NAME_PREFIXES
from .control_entities import ControlEntities
from .diagnostic_sensors import DiagnosticSensors
from .entity_definition import (
    build_entity_definition,
    filter_attributes,
    filter_attributes_for_tier,
    resolve_data_tier,
)
from .event_bus import EventBus
from .protocol import (
    ALLOWED_DATA_KEYS as _ALLOWED_DATA_KEYS,
    TARGET_SELECTOR_KEYS as _TARGET_SELECTOR_KEYS,
    normalize_forecast as _normalize_forecast,
    round_state as _round_state,
)
from .session_manager import SessionManager
from .renderer_manager import RendererManager, renderer_to_api_dict
from .theme_manager import (
    ThemeManager,
    theme_to_api_dict,
    theme_url_to_id,
    validate_custom_font,
)
from .token_manager import (
    ActiveSchedule,
    ActiveScheduleWindow,
    EntityAccess,
    OriginConfig,
    RateLimitConfig,
    SessionConfig,
    Token,
    TokenManager,
)


def register_views(hass: HomeAssistant, entry_id: str) -> None:
    """Register all HTTP API views with HA's HTTP server.

    All views are prefixed with /api/harvest/. All views require HA
    authentication (panel runs in authenticated context) except the public
    renderer-file, custom-font, and panel.js endpoints.

    Each view holds only ``(hass, entry_id)`` and resolves managers per-request
    via ``_HarvestView``'s @property accessors. This avoids stale-manager refs
    across config-entry reloads (HA's HTTP layer has no unregister API, so
    views persist for the lifetime of the HA process).
    """
    views = [
        HarvestTokensView,
        HarvestTokenDetailView,
        HarvestTokenDuplicateView,
        HarvestSessionsView,
        HarvestSessionTerminateView,
        HarvestActivityView,
        HarvestThemesView,
        HarvestThemeImportView,
        HarvestThemeExportView,
        HarvestThemeReloadView,
        HarvestThemeDetailView,
        HarvestThemeReloadByIdView,
        HarvestThemeThumbnailView,
        HarvestThemeCustomFontView,
        HarvestRenderersView,
        HarvestRendererAgreeView,
        HarvestRendererFileView,
        HarvestRendererDetailView,
        HarvestRendererCodeView,
        HarvestConfigView,
        HarvestStatsView,
        HarvestAliasView,
        HarvestPreviewTokenView,
        HarvestActivityExportView,
        HarvestAggregatesView,
        HarvestEntitiesView,
        HarvestEntityDefinitionView,
        HarvestPreviewHistoryView,
        HarvestScriptFieldsView,
        HarvestServiceFieldsView,
        HarvestRegistriesView,
        HarvestPanelJsView,
        HarvestLovelaceDashboardsView,
        HarvestLovelaceConfigView,
        HarvestWarningsView,
        HarvestWarningsDismissView,
        HarvestCheckUrlView,
    ]
    for view_cls in views:
        hass.http.register_view(view_cls(hass, entry_id))


# ---------------------------------------------------------------------------
# Serialisation helpers
# ---------------------------------------------------------------------------

def _require_admin(request: web.Request, *, anon_status: type = web.HTTPForbidden):
    """Return the authenticated admin user or raise.

    Panel HTTP endpoints are admin-only. This centralises the check: it raises
    HTTPForbidden when the user is authenticated but not an admin, and raises
    anon_status (HTTPForbidden by default, HTTPUnauthorized for the token/theme
    mutation endpoints) when no HA user is attached to the request.

    The anon_status split preserves the existing per-endpoint behaviour. Making
    every endpoint return 401 for anonymous would be more correct but is locked
    in by tests; unifying it is a separate, test-touching change.
    """
    user = request.get("hass_user")
    if user is None:
        raise anon_status()
    if not user.is_admin:
        raise web.HTTPForbidden()
    return user


def _token_to_dict(token: Token) -> dict:
    """Serialise a Token to a JSON-safe dict."""
    d = dataclasses.asdict(token)
    d["created_at"] = token.created_at.isoformat()
    d["expires"] = token.expires.isoformat() if token.expires else None
    d["revoked_at"] = token.revoked_at.isoformat() if token.revoked_at else None
    # Never expose token_secret in API responses.
    d["token_secret"] = bool(token.token_secret)  # True/False: secret is set
    return d


def _session_to_dict(session) -> dict:
    """Serialise a Session to a JSON-safe dict (no WebSocket reference).

    Includes the client/server compatibility fields (SPEC.md Section 12)
    so the panel home banner can group sessions by their reported source
    and surface version-drift warnings. Old widgets predating the auth
    `client` block populate the defaults from session_manager.Session
    (protocol=1, source="unknown", compatibility="ok"), which the panel
    treats as "no warning to surface."
    """
    return {
        "session_id": session.session_id,
        "token_id": session.token_id,
        "token_version": session.token_version,
        "issued_at": session.issued_at.isoformat(),
        "expires_at": session.expires_at.isoformat(),
        "absolute_expires_at": session.absolute_expires_at.isoformat(),
        "renewal_count": session.renewal_count,
        "origin": session.origin_validated,
        "referer": session.referer_validated,
        "ip_address": session.source_ip,
        "subscribed_entity_ids": list(session.subscribed_entity_ids),
        "last_message_at": session.last_message_at.isoformat(),
        "client": {
            "protocol": session.client_protocol,
            "widget": session.client_widget_version,
            "source": session.client_source,
            "source_version": session.client_source_version,
        },
        "compatibility": session.compatibility,
    }


def _parse_dt(value: Any) -> datetime | None:
    """Parse an ISO 8601 datetime string, accepting only explicit empty values."""
    if value is None or value == "":
        return None
    if not isinstance(value, str):
        raise ValueError("datetime must be an ISO 8601 string or null.")
    try:
        dt = datetime.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"Invalid ISO 8601 datetime: {value!r}") from exc
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def _parse_origins(raw: dict) -> OriginConfig:
    if not isinstance(raw, dict):
        raise ValueError("origins must be an object.")
    allowed = raw.get("allowed", [])
    allow_paths = raw.get("allow_paths", [])
    if not isinstance(allowed, list) or not all(isinstance(v, str) for v in allowed):
        raise ValueError("origins.allowed must be a list of strings.")
    if not isinstance(allow_paths, list) or not all(isinstance(v, str) for v in allow_paths):
        raise ValueError("origins.allow_paths must be a list of strings.")
    allow_any = raw.get("allow_any", False)
    if not isinstance(allow_any, bool):
        raise ValueError("origins.allow_any must be a boolean.")
    return OriginConfig(
        allow_any=allow_any,
        allowed=allowed,
        allow_paths=allow_paths,
    )


def _coerce_positive_int(raw: object, field_name: str, *, max_value: int) -> int:
    """Coerce raw to a positive int in [1, max_value]. Raises ValueError on bad input.

    Used for rate-limit and session-lifetime fields where a value of zero or
    negative would either divide by zero in the rate limiter (capacity 0 ->
    refill 0 -> ZeroDivisionError) or produce nonsensical session math.
    """
    if not isinstance(raw, int) or isinstance(raw, bool):
        raise ValueError(f"{field_name} must be an integer.")
    n = raw
    if n < 1:
        raise ValueError(f"{field_name} must be >= 1.")
    if n > max_value:
        raise ValueError(f"{field_name} must be <= {max_value}.")
    return n


def _coerce_optional_positive_int(raw: object, field_name: str, *, max_value: int) -> int | None:
    """Like _coerce_positive_int but accepts None (returned as None).

    Used for max_renewals and absolute_lifetime_hours where None means
    'no limit'. String/float values are still rejected.
    """
    if raw is None:
        return None
    return _coerce_positive_int(raw, field_name, max_value=max_value)


def _parse_rate_limits(raw: dict) -> RateLimitConfig:
    from .const import CONF_DEFAULT_RATE_LIMITS, DEFAULTS
    if not isinstance(raw, dict):
        raise ValueError("rate_limits must be an object.")
    rl_defaults = DEFAULTS[CONF_DEFAULT_RATE_LIMITS]
    override_defaults = raw.get("override_defaults", False)
    if not isinstance(override_defaults, bool):
        raise ValueError("override_defaults must be a boolean.")
    return RateLimitConfig(
        max_push_per_second=_coerce_positive_int(
            raw.get("max_push_per_second", rl_defaults["max_push_per_second"]),
            "max_push_per_second",
            max_value=1000,
        ),
        max_commands_per_minute=_coerce_positive_int(
            raw.get("max_commands_per_minute", rl_defaults["max_commands_per_minute"]),
            "max_commands_per_minute",
            max_value=10000,
        ),
        override_defaults=override_defaults,
    )


def _parse_session_config(raw: dict) -> SessionConfig:
    # Caps chosen to match the panel UI: lifetime_minutes up to 24h,
    # max_lifetime_minutes up to 30 days, max_renewals up to 1000,
    # absolute_lifetime_hours up to 1 year.
    if not isinstance(raw, dict):
        raise ValueError("session must be an object.")
    return SessionConfig(
        lifetime_minutes=_coerce_positive_int(
            raw.get("lifetime_minutes", 60), "lifetime_minutes", max_value=1440,
        ),
        max_lifetime_minutes=_coerce_positive_int(
            raw.get("max_lifetime_minutes", 1440), "max_lifetime_minutes", max_value=43200,
        ),
        max_renewals=_coerce_optional_positive_int(
            raw.get("max_renewals"), "max_renewals", max_value=1000,
        ),
        absolute_lifetime_hours=_coerce_optional_positive_int(
            raw.get("absolute_lifetime_hours"), "absolute_lifetime_hours", max_value=8760,
        ),
    )


_VALID_CAPABILITIES = ("badge", "read", "read-write")
_ENTITY_ID_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")


def _parse_gesture_config(raw: dict) -> dict:
    """Validate and normalise a gesture_config dict.

    Shape: { "tap"?: Action, "hold"?: Action, "double_tap"?: Action }
    where Action = { "action": str, "data"?: dict } | null.
    Unknown keys are ignored. Raises ValueError on invalid input.
    """
    if not isinstance(raw, dict):
        raise ValueError("gesture_config must be an object.")
    result: dict = {}
    for key in ("tap", "hold", "double_tap"):
        val = raw.get(key)
        if val is None:
            continue
        if not isinstance(val, dict):
            raise ValueError(f"gesture_config.{key} must be a dict or null.")
        action = val.get("action", "")
        if not isinstance(action, str) or not action:
            raise ValueError(f"gesture_config.{key}.action must be a non-empty string.")
        data = val.get("data")
        if data is not None and not isinstance(data, dict):
            raise ValueError(f"gesture_config.{key}.data must be a dict or absent.")
        entry: dict = {"action": action}
        entity_id = val.get("entity_id")
        if entity_id is not None:
            if not isinstance(entity_id, str) or not entity_id:
                raise ValueError(f"gesture_config.{key}.entity_id must be a non-empty string.")
            entry["entity_id"] = entity_id
        if data:
            entry["data"] = data
        result[key] = entry
    return result


def _parse_entities(
    raw_list: list,
    sensitive_domains: dict | None = None,
    existing_ids: set | None = None,
) -> list[EntityAccess]:
    from .entity_compatibility import (
        COMPANION_INTERACTIVE_DOMAINS,
        get_support_tier,
        is_companion_allowed,
        is_sensitive_domain_blocked,
    )
    if not isinstance(raw_list, list):
        raise ValueError("entities must be a list.")
    entities = []
    seen_ids: set[str] = set()
    seen_aliases: set[str] = set()
    for e in raw_list:
        if not isinstance(e, dict):
            raise ValueError("Each entity must be an object.")
        entity_id = str(e["entity_id"])
        if not _ENTITY_ID_RE.match(entity_id):
            raise ValueError(f"Invalid entity_id {entity_id!r}; must match domain.slug.")
        domain = entity_id.split(".")[0]
        if get_support_tier(domain) == 3:
            raise ValueError(f"Domain '{domain}' is not supported (Tier 3).")
        if sensitive_domains is not None and is_sensitive_domain_blocked(domain, sensitive_domains):
            if existing_ids is None or entity_id not in existing_ids:
                raise ValueError(f"Domain '{domain}' is disabled in global Settings.")
        if entity_id in seen_ids:
            raise ValueError(f"Duplicate entity_id: {entity_id}")
        seen_ids.add(entity_id)
        cap = str(e.get("capabilities", "read"))
        if cap not in _VALID_CAPABILITIES:
            raise ValueError(f"Invalid capabilities {cap!r}; must be one of {_VALID_CAPABILITIES}")
        name_override = e.get("name_override") or None
        if name_override is not None:
            name_override = str(name_override).strip()
            if len(name_override) > 100:
                raise ValueError(f"name_override for {entity_id} exceeds 100 characters.")
            if not name_override:
                name_override = None

        icon_override = e.get("icon_override") or None
        if icon_override is not None:
            icon_override = str(icon_override).strip()
            if not icon_override.startswith(ICON_NAME_PREFIXES) or len(icon_override) > 64:
                prefixes = ", ".join(p + "<name>" for p in ICON_NAME_PREFIXES)
                raise ValueError(
                    f"icon_override for {entity_id} must be a valid icon key ({prefixes})."
                )

        color_scheme = str(e.get("color_scheme", "auto"))
        if color_scheme not in ("auto", "light", "dark"):
            raise ValueError(f"Invalid color_scheme {color_scheme!r} for {entity_id}.")

        display_hints = e.get("display_hints")
        if display_hints is not None:
            if not isinstance(display_hints, dict):
                raise ValueError(f"display_hints for {entity_id} must be a dict.")
            display_hints = dict(display_hints)
        else:
            display_hints = {}

        alias = e.get("alias") or None
        if alias is not None:
            if (
                not isinstance(alias, str)
                or len(alias) != ALIAS_LENGTH
                or any(ch not in BASE62_ALPHABET for ch in alias)
            ):
                raise ValueError(
                    f"alias for {entity_id} must be {ALIAS_LENGTH} base62 characters."
                )
            if alias in seen_aliases:
                raise ValueError(f"Duplicate alias: {alias}")
            seen_aliases.add(alias)

        excluded = e.get("exclude_attributes", [])
        if not isinstance(excluded, list) or not all(isinstance(v, str) for v in excluded):
            raise ValueError(f"exclude_attributes for {entity_id} must be a list of strings.")

        companion_of = e.get("companion_of") or None
        if companion_of is not None and not isinstance(companion_of, str):
            raise ValueError(f"companion_of for {entity_id} must be an entity_id or null.")
        if cap == "badge" and companion_of is not None:
            raise ValueError(f"Badge entity {entity_id} cannot be a companion.")
        if companion_of is not None:
            if not is_companion_allowed(domain):
                raise ValueError(f"Domain '{domain}' is not permitted as a companion.")
            if domain not in COMPANION_INTERACTIVE_DOMAINS:
                cap = "read"

        service_data = e.get("service_data", {})
        if not isinstance(service_data, dict):
            raise ValueError(f"service_data for {entity_id} must be an object.")

        entities.append(EntityAccess(
            entity_id=entity_id,
            capabilities=cap,
            alias=alias,
            exclude_attributes=excluded,
            companion_of=companion_of,
            gesture_config=_parse_gesture_config(e.get("gesture_config", {})),
            name_override=name_override,
            icon_override=icon_override,
            color_scheme=color_scheme,
            display_hints=display_hints,
            service_data=dict(service_data),
        ))
    primaries = {e.entity_id: e for e in entities if e.companion_of is None}
    for entity in entities:
        if entity.companion_of is not None:
            primary = primaries.get(entity.companion_of)
            if primary is None:
                raise ValueError(
                    f"companion_of for {entity.entity_id} does not reference a primary entity."
                )
            if primary.capabilities != "read-write":
                entity.capabilities = "read"
    return entities


def _introduces_or_changes_gestures(
    existing: list[EntityAccess],
    proposed: list[EntityAccess],
) -> bool:
    """Return whether proposed entities add or change a non-empty gesture config.

    Existing gesture configs may pass through unchanged while an entities-block
    token is edited, and clearing a stored gesture config is allowed.
    """
    existing_gestures = {ea.entity_id: ea.gesture_config for ea in existing}
    return any(
        ea.gesture_config
        and ea.gesture_config != existing_gestures.get(ea.entity_id, {})
        for ea in proposed
    )


# EntityAccess fields that only affect how a card LOOKS, never what data or
# control a session has access to. Changes limited to these fields must not
# terminate live sessions; the entity_definition push updates them in place.
_DISPLAY_ONLY_EA_FIELDS = frozenset(
    {"name_override", "icon_override", "color_scheme", "display_hints"}
)


def _entities_change_is_display_only(
    old_map: dict[str, EntityAccess],
    new_entities: list[EntityAccess],
) -> bool:
    """Return True when an entities update changes only display fields.

    Access-relevant on any of: entity added or removed, or a change to any
    field outside _DISPLAY_ONLY_EA_FIELDS (capabilities, exclude_attributes,
    companion_of, alias, gesture_config, service_data).
    """
    new_map = {ea.entity_id: ea for ea in new_entities}
    if set(old_map) != set(new_map):
        return False
    for entity_id, new_ea in new_map.items():
        old_ea = old_map[entity_id]
        for f in dataclasses.fields(new_ea):
            if f.name in _DISPLAY_ONLY_EA_FIELDS:
                continue
            if getattr(old_ea, f.name) != getattr(new_ea, f.name):
                return False
    return True


_LABEL_ILLEGAL = re.compile(r"[\x00-\x1f<>\"&]")


def _validate_label(label: str, token_manager: TokenManager, exclude_token_id: str | None = None) -> str | None:
    """Return an error string if the label is invalid, else None."""
    stripped = label.strip()
    if not stripped:
        return "Name is required."
    if len(stripped) > 100:
        return "Name must be 100 characters or fewer."
    if _LABEL_ILLEGAL.search(stripped):
        return "Name contains invalid characters."
    for t in token_manager.get_all():
        if t.token_id == exclude_token_id:
            continue
        if t.status in ("revoked", "expired"):
            continue
        if t.label.strip().lower() == stripped.lower():
            return "A widget with this name already exists."
    return None


def _deep_merge(base: dict, override: dict) -> dict:
    """Recursively merge override into base, returning a new dict.

    Nested dicts are merged rather than replaced, so partial updates to
    objects like default_session preserve keys not present in override.
    """
    result = dict(base)
    for k, v in override.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = _deep_merge(result[k], v)
        else:
            result[k] = v
    return result


_MIN_SECRET_LENGTH = 16


def _validate_token_secret(raw: Any) -> str | None:
    """Validate and return a token_secret value, or None if empty."""
    if not raw:
        return None
    secret = str(raw)
    if len(secret) < _MIN_SECRET_LENGTH:
        raise ValueError(
            f"token_secret must be at least {_MIN_SECRET_LENGTH} characters."
        )
    return secret


def _validate_max_sessions(raw: Any) -> int | None:
    """Validate and return a max_sessions value, or None if unset."""
    if raw is None:
        return None
    if not isinstance(raw, int) or isinstance(raw, bool) or raw < 1:
        raise ValueError("max_sessions must be a positive integer or null.")
    return raw


def _validate_icon_set(raw: Any) -> str | None:
    """Validate an icon-set id ("fa", "ph-duotone", ...), or None for default.

    Deliberately lenient (slug shape, not a fixed list) so future icon sets
    need no server change; the widget falls back to MDI for unknown ids.
    """
    if raw is None or raw == "":
        return None
    val = str(raw).strip().lower()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,23}", val):
        raise ValueError("icon_set must be a short lowercase slug or null.")
    return val


def _parse_allowed_ips(raw: Any) -> list[str]:
    """Validate an IP/CIDR allowlist without coercing arbitrary values."""
    from ipaddress import ip_network

    if not isinstance(raw, list) or not all(isinstance(entry, str) for entry in raw):
        raise ValueError("allowed_ips must be a list of IP address or CIDR strings.")
    for entry in raw:
        try:
            ip_network(entry, strict=False)
        except ValueError as exc:
            raise ValueError(f"Invalid IP address or CIDR: {entry}") from exc
    return list(raw)


_DISPLAY_TEXT_MAX_LEN = 200
# Reject control characters that would corrupt logs, screen readers, or
# copy-paste. Whitespace (tab/LF/CR) is allowed. All printable Unicode is
# allowed including apostrophes, quotes, angle brackets, semicolons, and
# backslashes - the actual XSS protection lives at the render layer in the
# widget (error-states.js sets text via .textContent, which is HTML-safe).
# Earlier revisions blocked HTML punctuation and SQL keywords here; that was
# theatre that broke legitimate English ("It's offline", "Power < 50%",
# "Light up the SELECT TV") without addressing a real threat at this layer.
_DISPLAY_TEXT_FORBIDDEN_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")


def _validate_display_text(raw: Any, field_name: str) -> str:
    """Validate a user-supplied display text field (offline_text, error_text)."""
    val = str(raw or "").strip()
    if len(val) > _DISPLAY_TEXT_MAX_LEN:
        raise web.HTTPBadRequest(
            reason=f"{field_name} must be {_DISPLAY_TEXT_MAX_LEN} characters or fewer.",
        )
    if val and _DISPLAY_TEXT_FORBIDDEN_RE.search(val):
        raise web.HTTPBadRequest(
            reason=f"{field_name} contains disallowed control characters.",
        )
    return val


_VALID_DAYS = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}
# Reject impossible times like 99:99. Note: 24:00 is also rejected; use
# 00:00 of the next day (or the midnight-crossing window pattern in
# is_schedule_active) to express end-of-day.
_HH_MM_RE = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")


def _parse_schedule(raw: dict | None) -> ActiveSchedule | None:
    from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
    if not raw:
        return None
    tz_str = str(raw["timezone"])
    try:
        ZoneInfo(tz_str)
    except (ZoneInfoNotFoundError, KeyError):
        raise ValueError(f"Invalid timezone: {tz_str!r}")
    windows_raw = raw.get("windows", [])
    if not isinstance(windows_raw, list):
        raise ValueError("active_schedule.windows must be a list.")
    windows = []
    for w in windows_raw:
        if not isinstance(w, dict):
            raise ValueError("Each schedule window must be an object.")
        days = w["days"]
        if not isinstance(days, list) or not all(isinstance(day, str) for day in days):
            raise ValueError("Schedule window days must be a list of strings.")
        for d in days:
            if d not in _VALID_DAYS:
                raise ValueError(f"Invalid day {d!r}; must be one of {sorted(_VALID_DAYS)}.")
        start = str(w["start"])
        end = str(w["end"])
        if not _HH_MM_RE.match(start):
            raise ValueError(f"Invalid start time {start!r}; must be HH:MM.")
        if not _HH_MM_RE.match(end):
            raise ValueError(f"Invalid end time {end!r}; must be HH:MM.")
        windows.append(ActiveScheduleWindow(days=days, start=start, end=end))
    return ActiveSchedule(timezone=tz_str, windows=windows)


# ---------------------------------------------------------------------------
# Base view
# ---------------------------------------------------------------------------

class _HarvestView(HomeAssistantView):
    """Common base for HArvest panel API views.

    The view is registered once per HA process; HA's HTTP layer has no
    unregister API, so views persist across config-entry reloads AND across
    uninstall+reinstall cycles. To avoid stale-manager refs, views hold
    only ``(hass, entry_id)`` and resolve each manager per-request via the
    @property accessors below.

    Manager resolution goes through ``_utils.get_entry_data``, which
    transparently falls back to whichever entry's data is currently live
    if the captured ``entry_id`` is stale (the post-reinstall case, where
    HA has assigned a fresh entry_id but cannot unregister these views).

    Properties raise ``KeyError`` on bracket access when the entry data
    dict is empty (i.e. the brief gap between unload and re-setup, or
    when the integration is fully removed). Individual view methods that
    depend on a specific manager handle that case at the call site -
    typically by raising a 503.
    """
    requires_auth = True

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        self._hass = hass
        self._entry_id = entry_id

    @property
    def _data(self) -> dict:
        return get_entry_data(self._hass, self._entry_id)

    @property
    def _token_manager(self) -> TokenManager:
        return self._data["token_manager"]

    @property
    def _session_manager(self) -> SessionManager:
        return self._data["session_manager"]

    @property
    def _activity_store(self) -> ActivityStore:
        return self._data["activity_store"]

    @property
    def _event_bus(self) -> EventBus | None:
        return self._data.get("event_bus")

    @property
    def _theme_manager(self) -> ThemeManager | None:
        return self._data.get("theme_manager")

    @property
    def _renderer_manager(self) -> RendererManager | None:
        return self._data.get("renderer_manager")

    @property
    def _warnings_store(self):
        # Imported lazily to avoid widening the module-level import surface
        # for a single dot-access; type hint is informational.
        return self._data.get("warnings_store")

    @property
    def _sensors(self) -> DiagnosticSensors | None:
        return self._data.get("sensors")

    @property
    def _controls(self) -> ControlEntities | None:
        return self._data.get("controls")


# ---------------------------------------------------------------------------
# Token views
# ---------------------------------------------------------------------------

class HarvestTokensView(_HarvestView):
    """GET /api/harvest/tokens  - list all tokens.
    POST /api/harvest/tokens - create a new token.
    """

    url = "/api/harvest/tokens"
    name = "api:harvest:tokens"

    async def get(self, request: web.Request) -> web.Response:
        """Return all tokens with their active session counts."""
        _require_admin(request)
        tokens = self._token_manager.get_all()
        result = []
        for t in tokens:
            d = _token_to_dict(t)
            d["active_sessions"] = self._session_manager.count_for_token(t.token_id)
            result.append(d)
        return self.json(result)

    async def post(self, request: web.Request) -> web.Response:
        """Create a new token. Body: full token spec JSON."""
        user = _require_admin(request, anon_status=web.HTTPUnauthorized)

        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")

        try:
            from .entity_compatibility import get_sensitive_domains
            entities = _parse_entities(body.get("entities", []), get_sensitive_domains(self._hass))
            origins = _parse_origins(body.get("origins", {}))
            rate_limits = _parse_rate_limits(body.get("rate_limits", {}))
            session_cfg = _parse_session_config(body.get("session", {}))
            expires = _parse_dt(body.get("expires"))
            schedule = _parse_schedule(body.get("active_schedule"))
            embed_mode = body.get("embed_mode", "single")
            if embed_mode not in ("single", "group", "page"):
                raise ValueError("embed_mode must be single, group, or page.")
            entities_block = body.get("entities_block", False)
            if not isinstance(entities_block, bool):
                raise ValueError("entities_block must be a boolean.")
            if entities_block and any(ea.gesture_config for ea in entities):
                raise ValueError("Gestures cannot be configured in entities block mode.")
        except (KeyError, TypeError, ValueError) as exc:
            raise web.HTTPBadRequest(reason=f"Invalid request body: {exc}")

        raw_label = str(body.get("label", "Unnamed"))
        label_err = _validate_label(raw_label, self._token_manager)
        if label_err:
            raise web.HTTPBadRequest(reason=label_err)

        theme_url = str(body.get("theme_url", ""))
        renderer_pack = ""
        if self._theme_manager:
            theme_id = theme_url_to_id(theme_url)
            theme_def = self._theme_manager.get(theme_id)
            renderer_pack = theme_id if theme_def and theme_def.has_renderer else ""

        try:
            token = await self._token_manager.create(
                label=raw_label.strip(),
                created_by=user.id,
                origins=origins,
                entities=entities,
                expires=expires,
                token_secret=_validate_token_secret(body.get("token_secret")),
                rate_limits=rate_limits,
                session=session_cfg,
                max_sessions=_validate_max_sessions(body.get("max_sessions")),
                active_schedule=schedule,
                allowed_ips=_parse_allowed_ips(body.get("allowed_ips", [])),
                embed_mode=embed_mode,
                entities_block=entities_block,
                theme_url=theme_url,
                renderer_pack=renderer_pack,
                icon_set=_validate_icon_set(body.get("icon_set")),
            )
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))

        self._activity_store.record_token_lifecycle(TokenLifecycleEvent(
            token_id=token.token_id,
            display_type="TOKEN_CREATED",
            reason=None,
            timestamp=datetime.now(timezone.utc),
            label=token.label,
        ))
        if self._sensors:
            await self._sensors.create_and_register_token_sensors(token.token_id, token.label)
        if self._controls:
            await self._controls.create_and_register_token_controls(token.token_id, token.label)
        return self.json(_token_to_dict(token), status_code=201)


class HarvestTokenDetailView(_HarvestView):
    """GET /api/harvest/tokens/{token_id}   - fetch one token.
    PATCH /api/harvest/tokens/{token_id}  - update token fields.
    DELETE /api/harvest/tokens/{token_id} - revoke or delete a token.
    """

    url = "/api/harvest/tokens/{token_id}"
    name = "api:harvest:token_detail"

    async def _push_theme_to_sessions(self, token_id: str) -> None:
        """Push updated theme data to all active sessions for a token."""
        if not self._theme_manager:
            return
        token = self._token_manager.get(token_id)
        if not token:
            return
        theme_id = theme_url_to_id(token.theme_url)
        theme_def = self._theme_manager.get(theme_id)
        msg = self._theme_manager.build_runtime_message(theme_id, theme_def)
        for session in self._session_manager.get_all_for_token(token_id):
            if not session.ws.closed:
                try:
                    await session.ws.send_json(msg)
                except Exception as exc:
                    log_send_failure(exc, "theme update")

    async def _push_renderer_to_sessions(self, token_id: str) -> None:
        """Push renderer URL to all active sessions for a token."""
        token = self._token_manager.get(token_id)
        if not token:
            return
        msg: dict[str, Any] = {"type": "renderer", "url": ""}
        if token.renderer_pack and self._renderer_manager and self._renderer_manager.agreed:
            path = self._renderer_manager.get_renderer_path(token.renderer_pack)
            if path:
                try:
                    mtime = int(path.stat().st_mtime)
                except OSError:
                    mtime = 0
                msg["url"] = f"/api/harvest/renderers/{token.renderer_pack}.js?v={mtime}"
        for session in self._session_manager.get_all_for_token(token_id):
            if not session.ws.closed:
                try:
                    await session.ws.send_json(msg)
                except Exception as exc:
                    log_send_failure(exc, "renderer update")

    def _filtered_push_attrs(
        self,
        real_id: str,
        tier: str,
        token: Token,
        attributes: dict,
    ) -> dict:
        """Filter attributes for a panel-initiated state_update push.

        Mirrors the live ws_proxy path (_build_state_update_message) so an
        edit-triggered push never exposes attributes the live path would
        strip. Badge/compact/companion/display tiers are allowlist-based and
        already safe; the full tier applies the token denylist + per-entity
        exclude_attributes, then the global blocklist + per-value size cap,
        in that order.
        """
        if tier in ("badge", "compact", "companion", "companion_rw", "display"):
            return filter_attributes_for_tier(real_id.split(".")[0], attributes, tier)
        filtered = self._token_manager.filter_attributes(real_id, token, attributes)
        return filter_attributes(filtered)

    async def _push_entity_definitions_to_sessions(
        self,
        token_id: str,
        changed_entity_ids: set[str] | None = None,
    ) -> None:
        """Push updated entity_definition messages to active sessions for a token.

        Called after entity capabilities, graph settings, or exclude_attributes
        change so that connected widgets reflect the new configuration without
        requiring a reconnect. Also reconciles companion subscriptions.

        If changed_entity_ids is provided, only those entities get a definition
        push (companion reconciliation still runs for all). When None, all
        subscribed entities are pushed.
        """
        token = self._token_manager.get(token_id)
        if not token:
            return
        ea_map = {ea.entity_id: ea for ea in token.entities}
        primary_ids = {ea.entity_id for ea in token.entities if ea.companion_of is None}

        sessions = self._session_manager.get_all_for_token(token_id)
        for session in sessions:
            if session.ws.closed:
                continue

            # Compute expected companions for currently subscribed primaries.
            expected_companions: set[str] = set()
            for real_id in session.subscribed_entity_ids:
                if real_id in primary_ids:
                    for ea in token.entities:
                        if ea.companion_of == real_id:
                            expected_companions.add(ea.entity_id)

            current_subs = set(session.subscribed_entity_ids)

            # Subscribe new companions and register their outgoing IDs.
            new_companions = expected_companions - current_subs
            if new_companions:
                self._session_manager.add_subscription(
                    session.session_id, list(new_companions)
                )
                for comp_id in new_companions:
                    if comp_id not in session.outgoing_ids:
                        comp_ea = ea_map.get(comp_id)
                        session.outgoing_ids[comp_id] = (
                            comp_ea.alias or comp_id
                        ) if comp_ea else comp_id

            # Unsubscribe removed companions (only companions, not primaries).
            removed = (current_subs - expected_companions - primary_ids) & {
                ea.entity_id for ea in token.entities if ea.companion_of is not None
            }
            if removed:
                self._session_manager.remove_subscription(
                    session.session_id, list(removed)
                )
                for rem_id in removed:
                    rem_ea = ea_map.get(rem_id)
                    out_id = session.outgoing_ids.get(
                        rem_id, rem_ea.alias if rem_ea and rem_ea.alias else rem_id
                    )
                    try:
                        await session.ws.send_json({
                            "type": "entity_removed",
                            "entity_id": out_id,
                            "msg_id": None,
                        })
                    except Exception as exc:
                        log_send_failure(exc, "entity_removed")

            # Decide which entities to push.
            push_ids = set(session.subscribed_entity_ids)
            if changed_entity_ids is not None:
                push_ids &= changed_entity_ids

            if not push_ids:
                continue

            for real_id in push_ids:
                ea = ea_map.get(real_id)
                if ea is None:
                    continue
                out_id = session.outgoing_ids.get(real_id, ea.alias or real_id)
                tier = resolve_data_tier(
                    token.entities_block, ea.capabilities, ea.companion_of is not None
                )
                if tier in ("badge", "compact", "companion", "companion_rw"):
                    defn = build_entity_definition(self._hass, real_id, ea, detail_level=tier)
                else:
                    companion_refs = [
                        session.outgoing_ids.get(comp_ea.entity_id, comp_ea.alias or comp_ea.entity_id)
                        for comp_ea in token.entities
                        if comp_ea.companion_of == real_id
                    ]
                    defn = build_entity_definition(
                        self._hass, real_id, ea, companions=companion_refs, detail_level=tier
                    )
                if defn is None:
                    continue
                defn = dict(defn)
                defn["type"] = "entity_definition"
                defn["entity_id"] = out_id
                defn["capabilities"] = ea.capabilities
                defn["msg_id"] = None
                try:
                    await session.ws.send_json(defn)
                except Exception as exc:
                    log_send_failure(exc, "entity_definition")

                state = self._hass.states.get(real_id)
                if state is not None:
                    filtered = self._filtered_push_attrs(
                        real_id, tier, token, dict(state.attributes)
                    )
                    if tier not in ("badge", "compact", "companion", "companion_rw") and real_id.startswith("weather.") and ea.display_hints.get("show_forecast") is True:
                        fc = await self._try_fetch_forecast(real_id)
                        if fc:
                            filtered = dict(filtered)
                            if fc.get("daily"):
                                filtered["forecast_daily"] = fc["daily"]
                            if fc.get("hourly"):
                                filtered["forecast_hourly"] = fc["hourly"]
                    try:
                        await session.ws.send_json({
                            "type": "state_update",
                            "entity_id": out_id,
                            "state": _round_state(state.state, ea),
                            "attributes": filtered,
                            "last_updated": state.last_updated.isoformat(),
                            "initial": True,
                            "msg_id": None,
                        })
                    except Exception:
                        pass

            # Send state_update for newly subscribed companions.
            for comp_id in new_companions:
                ea = ea_map.get(comp_id)
                if ea is None:
                    continue
                state = self._hass.states.get(comp_id)
                if state is None:
                    continue
                out_id = ea.alias if ea.alias else comp_id
                tier = resolve_data_tier(token.entities_block, ea.capabilities, True)
                filtered = self._filtered_push_attrs(
                    comp_id, tier, token, dict(state.attributes)
                )
                update: dict[str, Any] = {
                    "type": "state_update",
                    "entity_id": out_id,
                    "state": _round_state(state.state, ea),
                    "attributes": filtered,
                    # last_updated + initial mirror the primary-branch push and
                    # the live ws_proxy path. Without last_updated the client
                    # stores an Invalid Date as this companion's ordering key.
                    "last_updated": state.last_updated.isoformat(),
                    "initial": True,
                    "msg_id": None,
                }
                try:
                    await session.ws.send_json(update)
                except Exception as exc:
                    log_send_failure(exc, "state_update")

    async def _try_fetch_forecast(self, entity_id: str) -> dict[str, list | None] | None:
        """Fetch daily and hourly forecast for a weather entity."""
        try:
            component = self._hass.data.get("weather")
            if component is None:
                return None
            entity = component.get_entity(entity_id)
            if entity is None:
                return None
            from homeassistant.components.weather import WeatherEntityFeature
            features = entity.supported_features or 0
            result: dict[str, list | None] = {}
            if features & WeatherEntityFeature.FORECAST_DAILY:
                result["daily"] = _normalize_forecast(await entity.async_forecast_daily())
            if features & WeatherEntityFeature.FORECAST_HOURLY:
                result["hourly"] = _normalize_forecast(await entity.async_forecast_hourly())
            return result if result else None
        except Exception:
            return None

    def _resolve_token_display(self, token: "Token") -> dict:
        """Resolve effective display values for a token, falling back to global defaults."""
        from .config_validation import normalize_global_config
        from .const import DOMAIN
        entries = self._hass.config_entries.async_entries(DOMAIN)
        gcfg = normalize_global_config(
            entries[0].data if entries else {},
            entries[0].options if entries else {},
        )
        use_custom = token.custom_messages
        return {
            "lang": token.lang if token.lang != "auto" else gcfg.get("default_lang", "auto"),
            "a11y": token.a11y if token.a11y != "standard" else gcfg.get("default_a11y", "standard"),
            "haptics": token.haptics,
            "color_scheme": token.color_scheme,
            "icon_set": token.icon_set,
            "on_offline": token.on_offline if use_custom else gcfg.get("default_on_offline", "last-state"),
            "on_error": token.on_error if use_custom else gcfg.get("default_on_error", "message"),
            "offline_text": token.offline_text if use_custom else gcfg.get("default_offline_text", ""),
            "error_text": token.error_text if use_custom else gcfg.get("default_error_text", ""),
        }

    async def _push_token_config_to_sessions(self, token_id: str) -> None:
        """Push updated token_config to all active sessions for a token."""
        token = self._token_manager.get(token_id)
        if not token:
            return
        display = self._resolve_token_display(token)
        msg = {"type": "token_config", **display}
        for session in self._session_manager.get_all_for_token(token_id):
            if session.ws.closed:
                continue
            try:
                await session.ws.send_json(msg)
            except Exception as exc:
                log_send_failure(exc, "token_config")

    async def get(self, request: web.Request, token_id: str) -> web.Response:
        _require_admin(request)
        token = self._token_manager.get(token_id)
        if token is None:
            raise web.HTTPNotFound(reason=f"Token not found: {token_id}")
        d = _token_to_dict(token)
        d["active_sessions"] = self._session_manager.count_for_token(token_id)
        # Resolve the creator's display name from HA's user registry.
        try:
            user = await self._hass.auth.async_get_user(token.created_by)
            d["created_by_name"] = user.name if user else None
        except Exception:
            d["created_by_name"] = None
        return self.json(d)

    async def patch(self, request: web.Request, token_id: str) -> web.Response:
        """Partially update a token. Accepts any subset of token fields."""
        _require_admin(request)
        token = self._token_manager.get(token_id)
        if token is None:
            raise web.HTTPNotFound(reason=f"Token not found: {token_id}")

        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")

        updates: dict = {}
        if "label" in body:
            raw_label = str(body["label"])
            label_err = _validate_label(raw_label, self._token_manager, exclude_token_id=token_id)
            if label_err:
                raise web.HTTPBadRequest(reason=label_err)
            updates["label"] = raw_label.strip()
        if "origins" in body:
            updates["origins"] = _parse_origins(body["origins"])
        if "entities" in body:
            from .entity_compatibility import get_sensitive_domains
            try:
                existing_ids = {ea.entity_id for ea in token.entities}
                updates["entities"] = _parse_entities(
                    body["entities"], get_sensitive_domains(self._hass), existing_ids
                )
            except (KeyError, TypeError, ValueError) as exc:
                raise web.HTTPBadRequest(reason=f"Invalid request body: {exc}")
        if "rate_limits" in body:
            updates["rate_limits"] = _parse_rate_limits(body["rate_limits"])
        if "session" in body:
            updates["session"] = _parse_session_config(body["session"])
        if "expires" in body:
            updates["expires"] = _parse_dt(body["expires"])
        if "max_sessions" in body:
            try:
                updates["max_sessions"] = _validate_max_sessions(body["max_sessions"])
            except ValueError as exc:
                raise web.HTTPBadRequest(reason=str(exc))
        if "allowed_ips" in body:
            try:
                updates["allowed_ips"] = _parse_allowed_ips(body["allowed_ips"])
            except ValueError as exc:
                raise web.HTTPBadRequest(reason=str(exc))
        if "active_schedule" in body:
            updates["active_schedule"] = _parse_schedule(body["active_schedule"])
        if "paused" in body:
            if not isinstance(body["paused"], bool):
                raise web.HTTPBadRequest(reason="paused must be a boolean.")
            updates["paused"] = body["paused"]
        if "embed_mode" in body:
            if body["embed_mode"] not in ("single", "group", "page"):
                raise web.HTTPBadRequest(reason="embed_mode must be single, group, or page.")
            updates["embed_mode"] = body["embed_mode"]
        if "entities_block" in body:
            if not isinstance(body["entities_block"], bool):
                raise web.HTTPBadRequest(reason="entities_block must be a boolean.")
            updates["entities_block"] = body["entities_block"]
        if "block_label" in body:
            val = body["block_label"]
            if val is not None and not isinstance(val, str):
                raise web.HTTPBadRequest(reason="block_label must be a string or null.")
            updates["block_label"] = str(val).strip()[:100] if val else None
        if "block_icon" in body:
            val = body["block_icon"]
            if val is not None and not isinstance(val, str):
                raise web.HTTPBadRequest(reason="block_icon must be a string or null.")
            updates["block_icon"] = str(val).strip() if val else None
        for bf in ("block_show_label", "block_highlight_rows", "block_show_icons"):
            if bf in body:
                if not isinstance(body[bf], bool):
                    raise web.HTTPBadRequest(reason=f"{bf} must be a boolean.")
                updates[bf] = body[bf]
        if "block_widget_border" in body:
            bwb = body["block_widget_border"]
            if bwb is not None and bwb not in ("inner", "outer", "none"):
                raise web.HTTPBadRequest(reason="block_widget_border must be 'inner', 'outer', 'none', or null.")
            updates["block_widget_border"] = bwb
        _VALID_BLOCK_MODES = {"override", "per_entity"}
        if "block_access_mode" in body:
            bam = body["block_access_mode"]
            if bam not in _VALID_BLOCK_MODES:
                raise web.HTTPBadRequest(reason="block_access_mode must be 'override' or 'per_entity'.")
            updates["block_access_mode"] = bam
        if "block_color_mode" in body:
            bcm = body["block_color_mode"]
            if bcm not in _VALID_BLOCK_MODES:
                raise web.HTTPBadRequest(reason="block_color_mode must be 'override' or 'per_entity'.")
            updates["block_color_mode"] = bcm
        if "theme_url" in body:
            new_theme_url = str(body["theme_url"] or "")
            updates["theme_url"] = new_theme_url
            if self._theme_manager:
                theme_id = theme_url_to_id(new_theme_url)
                theme_def = self._theme_manager.get(theme_id)
                updates["renderer_pack"] = theme_id if theme_def and theme_def.has_renderer else ""

        if "custom_messages" in body:
            if not isinstance(body["custom_messages"], bool):
                raise web.HTTPBadRequest(reason="custom_messages must be a boolean.")
            updates["custom_messages"] = body["custom_messages"]
        _VALID_ON_OFFLINE = {"dim", "hide", "message", "last-state"}
        _VALID_ON_ERROR = {"dim", "hide", "message"}
        if "lang" in body:
            lang_val = str(body["lang"] or "auto").strip().lower()
            if len(lang_val) > 20 or not re.fullmatch(r"auto|[a-z]{2,3}(-[a-zA-Z0-9]{1,8})*", lang_val):
                raise web.HTTPBadRequest(reason="lang must be 'auto' or a BCP 47 language tag.")
            updates["lang"] = lang_val
        if "a11y" in body:
            val = str(body["a11y"])
            if val not in ("standard", "enhanced"):
                raise web.HTTPBadRequest(reason="a11y must be standard or enhanced.")
            updates["a11y"] = val
        if "haptics" in body:
            if not isinstance(body["haptics"], bool):
                raise web.HTTPBadRequest(reason="haptics must be a boolean.")
            updates["haptics"] = body["haptics"]
        if "color_scheme" in body:
            val = str(body["color_scheme"])
            if val not in ("auto", "light", "dark"):
                raise web.HTTPBadRequest(reason="color_scheme must be auto, light, or dark.")
            updates["color_scheme"] = val
        if "icon_set" in body:
            try:
                updates["icon_set"] = _validate_icon_set(body["icon_set"])
            except ValueError as exc:
                raise web.HTTPBadRequest(reason=str(exc))
        if "on_offline" in body:
            val = str(body["on_offline"])
            if val not in _VALID_ON_OFFLINE:
                raise web.HTTPBadRequest(reason=f"on_offline must be one of {_VALID_ON_OFFLINE}.")
            updates["on_offline"] = val
        if "on_error" in body:
            val = str(body["on_error"])
            if val not in _VALID_ON_ERROR:
                raise web.HTTPBadRequest(reason=f"on_error must be one of {_VALID_ON_ERROR}.")
            updates["on_error"] = val
        if "offline_text" in body:
            updates["offline_text"] = _validate_display_text(
                body["offline_text"], "offline_text",
            )
        if "error_text" in body:
            updates["error_text"] = _validate_display_text(
                body["error_text"], "error_text",
            )

        generated_secret: str | None = None
        if "token_secret" in body:
            raw_secret = body["token_secret"]
            if raw_secret == "generate":
                import secrets as _secrets
                generated_secret = _secrets.token_hex(32)
                updates["token_secret"] = generated_secret
            elif raw_secret is None:
                updates["token_secret"] = None
            else:
                raise web.HTTPBadRequest(
                    reason='token_secret must be "generate" or null.'
                )

        effective_entities_block = updates.get("entities_block", token.entities_block)
        if (
            effective_entities_block
            and "entities" in updates
            and _introduces_or_changes_gestures(token.entities, updates["entities"])
        ):
            raise web.HTTPBadRequest(
                reason="Gestures cannot be configured in entities block mode."
            )

        old_ea_map = {ea.entity_id: ea for ea in token.entities} if "entities" in updates else {}

        try:
            token = await self._token_manager.update(token_id, updates)
        except (ValueError, KeyError) as exc:
            raise web.HTTPBadRequest(reason=str(exc))

        security_fields = {
            "paused", "active_schedule", "allowed_ips", "token_secret", "origins",
            "entities", "expires", "rate_limits",
        }
        changed_security = security_fields & updates.keys()
        # An entities update only terminates sessions when it is access-relevant
        # (entities added/removed, capabilities, companions, aliases, excluded
        # attributes, gestures, service data). Display-only edits (icon, name,
        # color scheme, display hints) keep sessions alive and flow through the
        # entity_definition push below instead of forcing every connected
        # widget to reconnect.
        if changed_security == {"entities"} and _entities_change_is_display_only(
            old_ea_map, token.entities
        ):
            changed_security = set()
        if changed_security:
            ws_list = self._session_manager.terminate_all_for_token(token_id)
            for ws in ws_list:
                if not ws.closed:
                    self._hass.async_create_task(_close_ws_with_auth_failed(ws))

        if "entities" in updates:
            changed: set[str] = set()
            new_ea_map = {ea.entity_id: ea for ea in token.entities}
            for eid, new_ea in new_ea_map.items():
                old_ea = old_ea_map.get(eid)
                if old_ea is None or old_ea != new_ea:
                    changed.add(eid)
                    # If this is a companion, also push the primary so its companions list updates.
                    if new_ea.companion_of:
                        changed.add(new_ea.companion_of)
            for old_id in old_ea_map:
                if old_id not in new_ea_map:
                    changed.add(old_id)
                    # If a companion was removed, push the primary too.
                    old_ea = old_ea_map[old_id]
                    if old_ea.companion_of:
                        changed.add(old_ea.companion_of)
            await self._push_entity_definitions_to_sessions(token_id, changed or None)
        elif "entities_block" in updates:
            await self._push_entity_definitions_to_sessions(token_id)

        if "theme_url" in updates:
            await self._push_theme_to_sessions(token_id)
            await self._push_renderer_to_sessions(token_id)

        _TOKEN_CONFIG_FIELDS = {"lang", "a11y", "haptics", "color_scheme", "icon_set", "custom_messages", "on_offline", "on_error", "offline_text", "error_text"}
        if _TOKEN_CONFIG_FIELDS & updates.keys():
            await self._push_token_config_to_sessions(token_id)

        result = _token_to_dict(token)
        if generated_secret is not None:
            result["generated_secret"] = generated_secret
        return self.json(result)

    async def delete(self, request: web.Request, token_id: str) -> web.Response:
        """Revoke a token (POST ?action=revoke) or delete it (DELETE when revoked).

        Query param action=revoke: revokes an active token.
        No action param: deletes a revoked/expired token permanently.
        """
        _require_admin(request, anon_status=web.HTTPUnauthorized)
        action = request.query.get("action")

        if action == "revoke":
            try:
                reason = request.query.get("reason")
                token = await self._token_manager.revoke(token_id, reason)
                # Terminate all active sessions for this token.
                ws_list = self._session_manager.terminate_all_for_token(token_id)
                for ws in ws_list:
                    if not ws.closed:
                        self._hass.async_create_task(ws.close())
                self._activity_store.record_token_lifecycle(TokenLifecycleEvent(
                    token_id=token_id,
                    display_type="TOKEN_REVOKED",
                    reason=reason,
                    timestamp=datetime.now(timezone.utc),
                    label=token.label,
                ))
                self._event_bus.token_revoked(token_id, token.label, reason)
            except KeyError:
                raise web.HTTPNotFound(reason=f"Token not found: {token_id}")
            return self.json(_token_to_dict(token))

        # Permanent delete - record before deleting so the token_id is still known.
        try:
            del_token = self._token_manager.get(token_id)
            self._activity_store.record_token_lifecycle(TokenLifecycleEvent(
                token_id=token_id,
                display_type="TOKEN_DELETED",
                reason=None,
                timestamp=datetime.now(timezone.utc),
                label=del_token.label if del_token else None,
            ))
            await self._token_manager.delete(token_id)
        except KeyError:
            raise web.HTTPNotFound(reason=f"Token not found: {token_id}")
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        if self._sensors:
            self._sensors.remove_token_sensors(token_id)
        if self._controls:
            self._controls.remove_token_controls(token_id)
        return web.Response(status=204)


class HarvestTokenDuplicateView(_HarvestView):
    """POST /api/harvest/tokens/{token_id}/duplicate - duplicate a token."""

    url = "/api/harvest/tokens/{token_id}/duplicate"
    name = "api:harvest:token_duplicate"

    async def post(self, request: web.Request, token_id: str) -> web.Response:
        user = _require_admin(request, anon_status=web.HTTPUnauthorized)

        source = self._token_manager.get(token_id)
        if source is None:
            raise web.HTTPNotFound(reason=f"Token not found: {token_id}")

        base_label = re.sub(r"\(\d+\)$", "", source.label).rstrip()
        label = base_label
        suffix = 1
        while _validate_label(label, self._token_manager) is not None:
            label = f"{base_label}({suffix})"
            suffix += 1
            if suffix > 100:
                raise web.HTTPBadRequest(reason="Too many copies with similar names.")

        new_entities = []
        for ea in source.entities:
            new_alias = self._token_manager.generate_alias() if ea.alias else None
            new_entities.append(dataclasses.replace(ea, alias=new_alias))

        token = await self._token_manager.create(
            label=label,
            created_by=user.id,
            origins=dataclasses.replace(source.origins),
            entities=new_entities,
            expires=None,
            token_secret=None,
            rate_limits=dataclasses.replace(source.rate_limits),
            session=dataclasses.replace(source.session),
            max_sessions=source.max_sessions,
            active_schedule=dataclasses.replace(source.active_schedule) if source.active_schedule else None,
            allowed_ips=list(source.allowed_ips),
            embed_mode=source.embed_mode,
            entities_block=source.entities_block,
            theme_url=source.theme_url,
        )

        display_updates: dict[str, Any] = {}
        for field_name in (
            "block_label", "block_icon", "block_show_label",
            "block_highlight_rows", "block_show_icons", "block_widget_border",
            "block_access_mode", "block_color_mode", "renderer_pack",
            "lang", "a11y", "haptics", "color_scheme", "custom_messages",
            "on_offline", "on_error", "offline_text", "error_text",
        ):
            val = getattr(source, field_name)
            default = getattr(Token, field_name, None)
            if val != default:
                display_updates[field_name] = val
        if display_updates:
            token = await self._token_manager.update(token.token_id, display_updates)

        self._activity_store.record_token_lifecycle(TokenLifecycleEvent(
            token_id=token.token_id,
            display_type="TOKEN_CREATED",
            reason=None,
            timestamp=datetime.now(timezone.utc),
            label=token.label,
        ))
        if self._sensors:
            await self._sensors.create_and_register_token_sensors(token.token_id, token.label)
        if self._controls:
            await self._controls.create_and_register_token_controls(token.token_id, token.label)
        return self.json(_token_to_dict(token), status_code=201)


# ---------------------------------------------------------------------------
# Session views
# ---------------------------------------------------------------------------

class HarvestSessionsView(_HarvestView):
    """GET /api/harvest/sessions - list active sessions, optionally filtered by token_id.
    DELETE /api/harvest/sessions?token_id=X - terminate all sessions for a token.
    """

    url = "/api/harvest/sessions"
    name = "api:harvest:sessions"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        token_id = request.query.get("token_id")
        if token_id:
            sessions = self._session_manager.get_all_for_token(token_id)
        else:
            sessions = self._session_manager.get_all()
        return self.json([_session_to_dict(s) for s in sessions])

    async def delete(self, request: web.Request) -> web.Response:
        """Terminate all sessions, optionally filtered to one token."""
        _require_admin(request)
        token_id = request.query.get("token_id")
        if token_id:
            ws_list = self._session_manager.terminate_all_for_token(token_id)
        else:
            # Terminate every active session.
            all_sessions = self._session_manager.get_all()
            ws_list = []
            for s in all_sessions:
                self._session_manager.terminate(s.session_id)
                ws_list.append(s.ws)
        for ws in ws_list:
            if not ws.closed:
                self._hass.async_create_task(ws.close())
        return web.Response(status=204)


class HarvestSessionTerminateView(_HarvestView):
    """DELETE /api/harvest/sessions/{session_id} - terminate a single session."""

    url = "/api/harvest/sessions/{session_id}"
    name = "api:harvest:sessions:terminate"

    async def delete(self, _request: web.Request, session_id: str) -> web.Response:
        _require_admin(_request)
        session = self._session_manager.get(session_id)
        if session is None:
            raise web.HTTPNotFound(reason=f"Session not found: {session_id}")
        ws = session.ws
        self._session_manager.terminate(session_id)
        if not ws.closed:
            self._hass.async_create_task(ws.close())
        return web.Response(status=204)


# ---------------------------------------------------------------------------
# Activity views
# ---------------------------------------------------------------------------

class HarvestActivityView(_HarvestView):
    """GET /api/harvest/activity - query the activity log with optional filters.

    Query params: token_id, event_types (comma-sep), since (ISO), until (ISO),
                  limit (int, default 50), offset (int, default 0).
    """

    url = "/api/harvest/activity"
    name = "api:harvest:activity"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        token_id = request.query.get("token_id") or None
        # Accept both singular (frontend) and plural (legacy) param names.
        display_type = request.query.get("event_type") or request.query.get("event_types") or None
        search = request.query.get("search") or None
        try:
            since = _parse_dt(request.query.get("since"))
            until = _parse_dt(request.query.get("until"))
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        try:
            limit = max(1, min(500, int(request.query.get("limit", "50"))))
            offset = max(0, int(request.query.get("offset", "0")))
        except ValueError:
            raise web.HTTPBadRequest(reason="limit and offset must be integers.")

        events, total = await self._activity_store.query_activity(
            token_id=token_id,
            display_type_filter=display_type,
            since=since,
            until=until,
            limit=limit,
            offset=offset,
            search=search,
        )

        # Enrich events with token labels (friendly names).
        # Lifecycle events store label at write time; other events look it up.
        label_map = {t.token_id: t.label for t in self._token_manager.get_all()} if self._token_manager else {}
        for ev in events:
            if ev.get("token_id") and not ev.get("token_label"):
                ev["token_label"] = label_map.get(ev["token_id"])

        return self.json({"events": events, "total": total, "limit": limit, "offset": offset})


class HarvestActivityExportView(_HarvestView):
    """GET /api/harvest/activity/export - download activity log as CSV."""

    url = "/api/harvest/activity/export"
    name = "api:harvest:activity_export"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        token_id = request.query.get("token_id") or None
        display_type = request.query.get("event_type") or request.query.get("event_types") or None
        search = request.query.get("search") or None
        try:
            since = _parse_dt(request.query.get("since"))
            until = _parse_dt(request.query.get("until"))
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))

        csv_data = await self._activity_store.export_csv(
            token_id=token_id,
            display_type_filter=display_type,
            since=since,
            until=until,
            search=search,
        )
        return web.Response(
            body=csv_data,
            content_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=harvest_activity.csv"},
        )


class HarvestAggregatesView(_HarvestView):
    """GET /api/harvest/activity/aggregates - hourly aggregate counts for graphs."""

    url = "/api/harvest/activity/aggregates"
    name = "api:harvest:activity_aggregates"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        try:
            hours = max(1, min(8760, int(request.query.get("hours", "24"))))
        except ValueError:
            raise web.HTTPBadRequest(reason="hours must be an integer.")
        token_id = request.query.get("token_id") or None
        data = await self._activity_store.query_aggregates(hours=hours, token_id=token_id)
        buckets = data.get("hours", [])
        return self.json([{
            "hour": b.get("hour", ""),
            "commands": b.get("command_count", 0),
            "sessions": b.get("peak_sessions", 0),
            "auth_failures": b.get("auth_fail_count", 0),
        } for b in buckets])


# ---------------------------------------------------------------------------
# Theme views
# ---------------------------------------------------------------------------

_THEME_NAME_RE = re.compile(r"^[a-zA-Z0-9 \-_'().]+$")
_THEME_NAME_MAX = 64


def _validate_theme_name(name: str) -> str | None:
    """Return an error string if the name is invalid, else None."""
    if not name:
        return "Theme name cannot be empty."
    if len(name) > _THEME_NAME_MAX:
        return f"Theme name must be {_THEME_NAME_MAX} characters or fewer."
    if not _THEME_NAME_RE.match(name):
        return "Theme name may only contain letters, numbers, spaces, hyphens, underscores, apostrophes, parentheses, and periods."
    return None


class HarvestThemesView(_HarvestView):
    """GET /api/harvest/themes  - list all themes.
    POST /api/harvest/themes - create a custom theme.
    """

    url = "/api/harvest/themes"
    name = "api:harvest:themes"

    def _usage_counts(self) -> dict[str, int]:
        counts: dict[str, int] = {}
        for t in self._token_manager.get_all():
            tid = theme_url_to_id(t.theme_url)
            counts[tid] = counts.get(tid, 0) + 1
        return counts

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        counts = self._usage_counts()
        result = []
        for theme in self._theme_manager.get_all():
            _cf_urls = self._theme_manager.build_custom_font_urls(theme.theme_id, theme)
            d = theme_to_api_dict(theme, has_thumbnail=self._theme_manager.has_thumbnail(theme.theme_id), custom_font_urls=_cf_urls)
            d["usage_count"] = counts.get(theme.theme_id, 0)
            if theme.has_renderer and self._renderer_manager is not None:
                d["has_renderer_file"] = self._renderer_manager.get_renderer_path(theme.theme_id) is not None
            else:
                d["has_renderer_file"] = False
            result.append(d)
        return self.json(result)

    async def post(self, request: web.Request) -> web.Response:
        user = _require_admin(request, anon_status=web.HTTPUnauthorized)

        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")

        name = str(body.get("name", "")).strip()
        name_err = _validate_theme_name(name)
        if name_err:
            raise web.HTTPBadRequest(reason=name_err)
        if self._theme_manager.name_exists(name):
            raise web.HTTPConflict(reason=f"A theme named \"{name}\" already exists.")
        variables = body.get("variables")
        if not isinstance(variables, dict):
            raise web.HTTPBadRequest(reason="variables must be an object.")

        raw_cap = body.get("capabilities")
        capabilities = raw_cap if isinstance(raw_cap, dict) else None
        raw_ps = body.get("renderer_settings")
        renderer_settings = list(raw_ps) if isinstance(raw_ps, list) else None
        try:
            icon_set = _validate_icon_set(body.get("icon_set"))
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        theme = await self._theme_manager.create(
            name=name,
            variables=variables,
            dark_variables=body.get("dark_variables"),
            created_by=user.id,
            author=str(body.get("author", "")),
            version=str(body.get("version", "1.0")),
            has_renderer=bool(body.get("has_renderer", False)),
            capabilities=capabilities,
            renderer_settings=renderer_settings,
            description=str(body.get("description", "")),
            icon_set=icon_set,
        )
        d = theme_to_api_dict(theme)
        d["has_renderer"] = False
        return self.json(d, status_code=201)


class HarvestThemeImportView(_HarvestView):
    """POST /api/harvest/themes/import - import a theme from a .zip file.

    Zip format:
        theme.json   (required) - theme definition JSON
        renderer.js  (optional) - custom renderer JS

    Returns the created ThemeDefinition.
    If the zip includes renderer.js and the admin has not confirmed this
    import or has not agreed to run renderer JS, returns 409 with
    {"error": "renderer_consent_required"}.
    """

    url = "/api/harvest/themes/import"
    name = "api:harvest:themes:import"

    _MAX_ZIP_BYTES = 10 * 1024 * 1024  # 10 MB hard cap
    _MAX_EXPANDED_BYTES = 20 * 1024 * 1024
    _MAX_MEMBER_BYTES = 10 * 1024 * 1024
    _MAX_MEMBERS = 4

    async def post(self, request: web.Request) -> web.Response:
        import io
        import json as _json
        import zipfile

        user = _require_admin(request)

        # Read the zip body (multipart or raw bytes).
        ct = request.headers.get("Content-Type", "")
        if ct.startswith("multipart/"):
            reader = await request.multipart()
            field = await reader.next()
            if field is None or field.name != "file":
                raise web.HTTPBadRequest(reason="Expected a 'file' field.")
            chunks: list[bytes] = []
            size = 0
            while True:
                chunk = await field.read_chunk(8192)
                if not chunk:
                    break
                size += len(chunk)
                if size > self._MAX_ZIP_BYTES:
                    raise web.HTTPRequestEntityTooLarge(
                        max_size=self._MAX_ZIP_BYTES, actual_size=size
                    )
                chunks.append(chunk)
            zip_bytes = b"".join(chunks)
        else:
            zip_bytes = await request.read()
            if len(zip_bytes) > self._MAX_ZIP_BYTES:
                raise web.HTTPRequestEntityTooLarge(
                    max_size=self._MAX_ZIP_BYTES, actual_size=len(zip_bytes)
                )

        try:
            zf = zipfile.ZipFile(io.BytesIO(zip_bytes))
        except zipfile.BadZipFile:
            raise web.HTTPBadRequest(reason="File is not a valid zip archive.")
        members = [
            m for m in zf.infolist()
            if not m.filename.startswith("__MACOSX/")
            and not m.filename.startswith(".")
            and not m.filename.endswith("/.DS_Store")
            and not m.filename.endswith("/Thumbs.db")
            and not m.filename.endswith("/desktop.ini")
            and m.filename not in (".DS_Store", "Thumbs.db", "desktop.ini")
        ]
        allowed_top = {
            "theme.json", "renderer.js",
            "thumbnail.png", "thumbnail.jpg", "thumbnail.jpeg",
        }
        _MAX_FONT_FILES = 8
        if len(members) > self._MAX_MEMBERS + _MAX_FONT_FILES:
            raise web.HTTPBadRequest(reason="Zip archive contains too many files.")
        member_names = [info.filename for info in members]
        if len(member_names) != len(set(member_names)):
            raise web.HTTPBadRequest(reason="Zip archive contains duplicate filenames.")
        for info in members:
            if info.filename in allowed_top:
                continue
            font_name = info.filename.removeprefix("fonts/")
            if (
                info.filename in (font_name, f"fonts/{font_name}")
                and "/" not in font_name
                and "\\" not in font_name
                and ".." not in font_name
                and font_name.lower().endswith((".woff2", ".woff"))
            ):
                continue
            if info.filename == "fonts/":
                continue
            raise web.HTTPBadRequest(reason=f"Zip archive contains an unsupported file: {info.filename}")
        if any(info.file_size > self._MAX_MEMBER_BYTES for info in members):
            raise web.HTTPRequestEntityTooLarge(
                max_size=self._MAX_MEMBER_BYTES,
                actual_size=max(info.file_size for info in members),
            )
        expanded_size = sum(info.file_size for info in members)
        if expanded_size > self._MAX_EXPANDED_BYTES:
            raise web.HTTPRequestEntityTooLarge(
                max_size=self._MAX_EXPANDED_BYTES, actual_size=expanded_size
            )

        # Extract theme.json.
        if "theme.json" not in zf.namelist():
            raise web.HTTPBadRequest(reason="Zip archive must contain theme.json.")
        try:
            raw = _json.loads(zf.read("theme.json").decode("utf-8"))
        except Exception:
            raise web.HTTPBadRequest(reason="theme.json is not valid JSON.")
        if not isinstance(raw, dict):
            raise web.HTTPBadRequest(reason="theme.json must contain a JSON object.")

        overwrite = request.query.get("overwrite") == "true"

        name = str(raw.get("name", "")).strip()
        name_err = _validate_theme_name(name)
        if name_err:
            raise web.HTTPBadRequest(reason=name_err)

        existing_theme = next(
            (t for t in self._theme_manager.get_all() if t.name.lower() == name.lower()),
            None,
        )
        if existing_theme is not None and not overwrite:
            return self.json(
                {"error": "theme_already_exists", "theme_id": existing_theme.theme_id, "name": name},
                status_code=409,
            )
        if existing_theme is not None and existing_theme.is_bundled:
            raise web.HTTPConflict(reason="Cannot overwrite a bundled theme.")

        variables = raw.get("variables")
        if not isinstance(variables, dict):
            raise web.HTTPBadRequest(reason="theme.json must contain a 'variables' object.")

        has_renderer_js = "renderer.js" in zf.namelist()
        has_renderer_flag = bool(raw.get("has_renderer", raw.get("renderer_pack", False)))
        renderer_confirmed = request.query.get("renderer_confirmed") == "true"

        if has_renderer_js and (
            self._renderer_manager is None
            or not self._renderer_manager.agreed
            or not renderer_confirmed
        ):
            return self.json({"error": "renderer_consent_required"}, status_code=409)

        raw_cap = raw.get("capabilities")
        capabilities = raw_cap if isinstance(raw_cap, dict) else None
        raw_ps = raw.get("renderer_settings", raw.get("pack_settings"))
        renderer_settings = list(raw_ps) if isinstance(raw_ps, list) else None

        raw_custom_fonts = raw.get("custom_fonts") or []
        custom_fonts: list[dict] = []
        font_data: dict[str, bytes] = {}
        zip_names = set(zf.namelist())
        if not isinstance(raw_custom_fonts, list):
            raise web.HTTPBadRequest(reason="custom_fonts must be an array.")
        if len(raw_custom_fonts) > _MAX_FONT_FILES:
            raise web.HTTPBadRequest(reason=f"custom_fonts may contain at most {_MAX_FONT_FILES} entries.")
        for face in raw_custom_fonts:
            if not isinstance(face, dict):
                raise web.HTTPBadRequest(reason="Each custom_fonts entry must be an object.")
            url = str(face.get("url", ""))
            filename = url.removeprefix("fonts/")
            zip_path = filename if filename in zip_names else f"fonts/{filename}"
            if not url or zip_path not in zip_names:
                raise web.HTTPBadRequest(reason=f"Custom font file not found in archive: {url or '(empty)'}")
            data = zf.read(zip_path)
            try:
                entry = validate_custom_font(
                    filename,
                    data,
                    family=str(face.get("family", "")),
                    weight=str(face.get("weight") or "normal"),
                    style=str(face.get("style") or "normal"),
                )
            except ValueError as exc:
                raise web.HTTPBadRequest(reason=str(exc))
            if filename in font_data:
                raise web.HTTPBadRequest(reason=f"Custom font is referenced more than once: {filename}")
            custom_fonts.append(entry)
            font_data[filename] = data

        renderer_code: str | None = None
        if has_renderer_js:
            try:
                renderer_code = zf.read("renderer.js").decode("utf-8")
            except UnicodeDecodeError:
                raise web.HTTPBadRequest(reason="renderer.js must contain valid UTF-8 JavaScript.")

        try:
            imported_icon_set = _validate_icon_set(raw.get("icon_set"))
        except ValueError:
            imported_icon_set = None  # malformed icon_set in a zip is non-fatal

        if overwrite and existing_theme is not None:
            theme = await self._theme_manager.update(existing_theme.theme_id, {
                "author": str(raw.get("author", "")),
                "version": str(raw.get("version", "1.0")),
                "variables": variables,
                "dark_variables": raw.get("dark_variables") or {},
                "has_renderer": has_renderer_js or has_renderer_flag,
                "capabilities": capabilities,
                "renderer_settings": renderer_settings or [],
                "description": str(raw.get("description", "")),
                "custom_fonts": custom_fonts,
                "icon_set": imported_icon_set,
            })
            status_code = 200
        else:
            theme = await self._theme_manager.create(
                name=name,
                variables=variables,
                dark_variables=raw.get("dark_variables"),
                created_by=user.id,
                author=str(raw.get("author", "")),
                version=str(raw.get("version", "1.0")),
                has_renderer=has_renderer_js or has_renderer_flag,
                capabilities=capabilities,
                renderer_settings=renderer_settings,
                description=str(raw.get("description", "")),
                custom_fonts=custom_fonts,
                icon_set=imported_icon_set,
            )
            status_code = 201

        if renderer_code is not None and self._renderer_manager is not None:
            await self._renderer_manager.update_code(theme.theme_id, renderer_code)

        if custom_fonts:
            self._theme_manager.delete_custom_fonts(theme.theme_id)
            for face in custom_fonts:
                await self._hass.async_add_executor_job(
                    self._theme_manager.save_custom_font,
                    theme.theme_id,
                    face["file"],
                    font_data[face["file"]],
                )

        thumb_file = next(
            (n for n in zip_names if n in ("thumbnail.png", "thumbnail.jpg", "thumbnail.jpeg")),
            None,
        )
        if thumb_file is not None:
            ext = "." + thumb_file.rsplit(".", 1)[-1]
            thumb_bytes = zf.read(thumb_file)
            await self._hass.async_add_executor_job(
                self._theme_manager.save_thumbnail, theme.theme_id, thumb_bytes, ext
            )

        has_thumb = self._theme_manager.has_thumbnail(theme.theme_id)
        _cf_urls = self._theme_manager.build_custom_font_urls(theme.theme_id, theme)
        d = theme_to_api_dict(theme, has_thumbnail=has_thumb, custom_font_urls=_cf_urls)
        d["has_renderer"] = has_renderer_js and self._renderer_manager is not None
        return self.json(d, status_code=status_code)


class HarvestThemeExportView(_HarvestView):
    """GET /api/harvest/themes/{theme_id}/export - export theme as a .zip file.

    Zip format:
        theme.json   - full theme definition
        renderer.js  - renderer JS (only if theme has one and it exists on disk)
    """

    url = "/api/harvest/themes/{theme_id}/export"
    name = "api:harvest:theme_export"

    async def get(self, request: web.Request, theme_id: str) -> web.Response:
        import io
        import json as _json
        import zipfile

        _require_admin(request)

        theme = self._theme_manager.get(theme_id)
        if theme is None:
            raise web.HTTPNotFound(reason=f"Theme not found: {theme_id}")

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
            # Build theme.json - use the same serialisation the API returns
            # but strip runtime-only fields not relevant in an exported zip.
            obj: dict = {
                "name": theme.name,
                "author": theme.author,
                "version": theme.version,
                "harvest_version": 1,
            }
            if theme.description:
                obj["description"] = theme.description
            if theme.has_renderer:
                obj["has_renderer"] = True
            if theme.capabilities:
                obj["capabilities"] = theme.capabilities
            if theme.renderer_settings:
                obj["renderer_settings"] = theme.renderer_settings
            if theme.custom_fonts:
                export_cf = []
                for face in theme.custom_fonts:
                    entry = {"family": face.get("family", ""), "url": face["file"]}
                    if face.get("weight"):
                        entry["weight"] = face["weight"]
                    if face.get("style"):
                        entry["style"] = face["style"]
                    export_cf.append(entry)
                obj["custom_fonts"] = export_cf
            obj["variables"] = theme.variables
            if theme.dark_variables:
                obj["dark_variables"] = theme.dark_variables
            zf.writestr("theme.json", _json.dumps(obj, indent=2))

            # Include renderer.js if the renderer file exists.
            if theme.has_renderer and self._renderer_manager is not None:
                js_path = self._renderer_manager.get_renderer_path(theme_id)
                if js_path is not None:
                    js_bytes = await self._hass.async_add_executor_job(
                        js_path.read_bytes
                    )
                    zf.writestr("renderer.js", js_bytes)

            # Include custom font files.
            for cf_name in self._theme_manager.get_custom_font_files(theme_id):
                cf_path = self._theme_manager.get_custom_font_path(theme_id, cf_name)
                if cf_path is not None:
                    cf_bytes = await self._hass.async_add_executor_job(cf_path.read_bytes)
                    zf.writestr(cf_name, cf_bytes)

            # Include thumbnail if present.
            thumb_path = self._theme_manager.get_thumbnail_path(theme_id)
            if thumb_path is not None:
                thumb_bytes = await self._hass.async_add_executor_job(thumb_path.read_bytes)
                zf.writestr(f"thumbnail{thumb_path.suffix}", thumb_bytes)

        slug = theme.name.lower().replace(" ", "-")
        filename = f"{slug}.zip"
        return web.Response(
            body=buf.getvalue(),
            content_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )


class HarvestThemeReloadView(_HarvestView):
    """POST /api/harvest/themes/reload - reload all bundled themes from disk.

    After reloading, pushes updated theme variables and renderer URLs
    to all active sessions that reference a bundled theme.
    """

    url = "/api/harvest/themes/reload"
    name = "api:harvest:themes:reload"

    async def post(self, request: web.Request) -> web.Response:
        _require_admin(request)
        load_results = await self._theme_manager.load()
        errors = {tid: err for tid, err in load_results.items() if err is not None}
        ts = int(datetime.now(timezone.utc).timestamp())
        for token in self._token_manager.get_all():
            theme_id = theme_url_to_id(token.theme_url)
            theme_def = self._theme_manager.get(theme_id)
            if not theme_def or not theme_def.is_bundled:
                continue
            theme_msg = self._theme_manager.build_runtime_message(theme_id, theme_def)
            renderer_msg: dict[str, Any] = {"type": "renderer", "url": ""}
            if token.renderer_pack and self._renderer_manager and self._renderer_manager.agreed:
                if self._renderer_manager.get_renderer_path(token.renderer_pack):
                    renderer_msg["url"] = f"/api/harvest/renderers/{token.renderer_pack}.js?v={ts}"
            for session in self._session_manager.get_all_for_token(token.token_id):
                if not session.ws.closed:
                    try:
                        await session.ws.send_json(theme_msg)
                        if token.renderer_pack:
                            await session.ws.send_json(renderer_msg)
                    except Exception as exc:
                        log_send_failure(exc, "theme/renderer update")
        if errors:
            return self.json({"status": "partial", "errors": errors})
        return self.json({"status": "ok"})


class HarvestThemeDetailView(_HarvestView):
    """GET /api/harvest/themes/{theme_id}    - get one theme.
    PATCH /api/harvest/themes/{theme_id}  - update a custom theme.
    DELETE /api/harvest/themes/{theme_id} - delete a custom theme.
    """

    url = "/api/harvest/themes/{theme_id}"
    name = "api:harvest:theme_detail"

    async def _push_theme_to_tokens(self, theme_id: str, theme: object) -> None:
        """Push updated theme variables to all active sessions using this theme."""
        msg = self._theme_manager.build_runtime_message(theme_id, theme)
        for token in self._token_manager.get_all():
            if theme_url_to_id(token.theme_url) != theme_id:
                continue
            for session in self._session_manager.get_all_for_token(token.token_id):
                if not session.ws.closed:
                    try:
                        await session.ws.send_json(msg)
                    except Exception as exc:
                        log_send_failure(exc, "theme reload")

    async def get(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)
        theme = self._theme_manager.get(theme_id)
        if theme is None:
            raise web.HTTPNotFound(reason=f"Theme not found: {theme_id}")
        _cf_urls = self._theme_manager.build_custom_font_urls(theme_id, theme)
        d = theme_to_api_dict(theme, has_thumbnail=self._theme_manager.has_thumbnail(theme_id), custom_font_urls=_cf_urls)
        count = sum(
            1 for t in self._token_manager.get_all()
            if theme_url_to_id(t.theme_url) == theme_id
        )
        d["usage_count"] = count
        if theme.has_renderer and self._renderer_manager is not None:
            d["has_renderer_file"] = self._renderer_manager.get_renderer_path(theme_id) is not None
        else:
            d["has_renderer_file"] = False
        return self.json(d)

    async def patch(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)

        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")

        updates: dict = {}
        if "name" in body:
            name = str(body["name"]).strip()
            name_err = _validate_theme_name(name)
            if name_err:
                raise web.HTTPBadRequest(reason=name_err)
            if self._theme_manager.name_exists(name, exclude_id=theme_id):
                raise web.HTTPConflict(reason=f"A theme named \"{name}\" already exists.")
            updates["name"] = name
        if "author" in body:
            updates["author"] = str(body["author"])
        if "version" in body:
            updates["version"] = str(body["version"])
        if "variables" in body:
            if not isinstance(body["variables"], dict):
                raise web.HTTPBadRequest(reason="variables must be an object.")
            updates["variables"] = body["variables"]
        if "dark_variables" in body:
            if not isinstance(body["dark_variables"], dict):
                raise web.HTTPBadRequest(reason="dark_variables must be an object.")
            updates["dark_variables"] = body["dark_variables"]
        if "has_renderer" in body:
            updates["has_renderer"] = bool(body["has_renderer"])
        if "capabilities" in body:
            raw_cap = body["capabilities"]
            updates["capabilities"] = raw_cap if isinstance(raw_cap, dict) else None
        if "renderer_settings" in body:
            raw_ps = body["renderer_settings"]
            updates["renderer_settings"] = list(raw_ps) if isinstance(raw_ps, list) else []
        if "description" in body:
            updates["description"] = str(body["description"])
        if "icon_set" in body:
            try:
                updates["icon_set"] = _validate_icon_set(body["icon_set"])
            except ValueError as exc:
                raise web.HTTPBadRequest(reason=str(exc))

        try:
            theme = await self._theme_manager.update(theme_id, updates)
        except ValueError as exc:
            raise web.HTTPForbidden(reason=str(exc))
        except KeyError:
            raise web.HTTPNotFound(reason=f"Theme not found: {theme_id}")

        if "variables" in updates or "dark_variables" in updates or "icon_set" in updates:
            await self._push_theme_to_tokens(theme_id, theme)

        _cf_urls = self._theme_manager.build_custom_font_urls(theme_id, theme)
        d = theme_to_api_dict(theme, custom_font_urls=_cf_urls)
        if theme.has_renderer and self._renderer_manager is not None:
            d["has_renderer_file"] = self._renderer_manager.get_renderer_path(theme_id) is not None
        else:
            d["has_renderer_file"] = False
        return self.json(d)

    async def delete(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)

        try:
            await self._theme_manager.delete(theme_id)
        except ValueError as exc:
            raise web.HTTPForbidden(reason=str(exc))
        except KeyError:
            pass

        affected_token_ids: list[str] = []
        for token in self._token_manager.get_all():
            if theme_url_to_id(token.theme_url) == theme_id:
                affected_token_ids.append(token.token_id)
                await self._token_manager.update(
                    token.token_id, {"theme_url": "", "renderer_pack": ""},
                )

        for tid in affected_token_ids:
            for session in self._session_manager.get_all_for_token(tid):
                if not session.ws.closed:
                    try:
                        await session.ws.send_json(
                            self._theme_manager.build_runtime_message(theme_id, None)
                        )
                        await session.ws.send_json({"type": "renderer"})
                    except Exception as exc:
                        log_send_failure(exc, "theme delete")

        if self._renderer_manager:
            try:
                await self._renderer_manager.delete_user_renderer(theme_id)
            except Exception:
                pass

        return web.Response(status=204)


class HarvestThemeThumbnailView(_HarvestView):
    """GET /api/harvest/themes/{theme_id}/thumbnail  - serve thumbnail image.
    POST /api/harvest/themes/{theme_id}/thumbnail - upload thumbnail for custom theme.
    DELETE /api/harvest/themes/{theme_id}/thumbnail - remove custom thumbnail.
    """

    url = "/api/harvest/themes/{theme_id}/thumbnail"
    name = "api:harvest:theme_thumbnail"

    async def get(self, request: web.Request, theme_id: str) -> web.Response:
        path = self._theme_manager.get_thumbnail_path(theme_id)
        if path is None:
            path = self._theme_manager.get_fallback_thumbnail_path()
        if not path.is_file():
            raise web.HTTPNotFound()
        suffix = path.suffix.lower()
        ct = "image/png" if suffix == ".png" else "image/jpeg"
        data = await self._hass.async_add_executor_job(path.read_bytes)
        return web.Response(
            body=data,
            content_type=ct,
            headers={"Cache-Control": "no-store"},
        )

    async def post(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)
        reader = await request.multipart()
        field = await reader.next()
        if field is None or field.name != "file":
            raise web.HTTPBadRequest(reason="Expected a 'file' field.")
        filename = field.filename or "upload.png"
        from pathlib import PurePosixPath
        ext = PurePosixPath(filename).suffix.lower()
        max_size = 512 * 1024  # 500 KB
        chunks: list[bytes] = []
        size = 0
        while True:
            chunk = await field.read_chunk(8192)
            if not chunk:
                break
            size += len(chunk)
            if size > max_size:
                raise web.HTTPRequestEntityTooLarge(
                    max_size=max_size, actual_size=size
                )
            chunks.append(chunk)
        data = b"".join(chunks)
        try:
            self._theme_manager.save_thumbnail(theme_id, data, ext)
        except (ValueError, KeyError) as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        return self.json({"ok": True, "has_thumbnail": True})

    async def delete(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)
        self._theme_manager.delete_thumbnail(theme_id)
        return web.Response(status=204)


class HarvestThemeCustomFontView(_HarvestView):
    """GET /api/harvest/themes/{theme_id}/fonts/{filename} - serve a custom font file.

    No authentication required - the widget fetches this unauthenticated.
    """

    url = "/api/harvest/themes/{theme_id}/fonts/{filename}"
    name = "api:harvest:theme_custom_font"
    requires_auth = False
    cors_allowed = True

    async def get(self, request: web.Request, theme_id: str, filename: str) -> web.Response:
        path = self._theme_manager.get_custom_font_path(theme_id, filename)
        if path is None:
            raise web.HTTPNotFound()
        data = await self._hass.async_add_executor_job(path.read_bytes)
        ct = "font/woff2" if filename.lower().endswith(".woff2") else "font/woff"
        return web.Response(
            body=data,
            content_type=ct,
            headers={"Cache-Control": "public, max-age=604800"},
        )


class HarvestThemeReloadByIdView(_HarvestView):
    """POST /api/harvest/themes/{theme_id}/reload - reload one theme.

    For bundled themes, re-reads the JSON from disk. For user themes, pushes
    the current stored variables to active sessions (useful after a manual
    file edit). In both cases, pushes updated theme variables and renderer
    URL to all active sessions that reference the theme.
    """

    url = "/api/harvest/themes/{theme_id}/reload"
    name = "api:harvest:theme_reload_by_id"

    async def post(self, request: web.Request, theme_id: str) -> web.Response:
        _require_admin(request)
        theme = self._theme_manager.get(theme_id)
        if theme is None:
            raise web.HTTPNotFound(reason=f"Theme not found: {theme_id}")

        if theme.is_bundled:
            results = await self._theme_manager.load()
            err = results.get(theme_id)
            if err:
                raise web.HTTPInternalServerError(reason=err)
            theme = self._theme_manager.get(theme_id)

        ts = int(datetime.now(timezone.utc).timestamp())
        theme_msg = self._theme_manager.build_runtime_message(theme_id, theme)
        for token in self._token_manager.get_all():
            if theme_url_to_id(token.theme_url) != theme_id:
                continue
            renderer_url = ""
            if token.renderer_pack and self._renderer_manager and self._renderer_manager.agreed:
                if self._renderer_manager.get_renderer_path(token.renderer_pack):
                    renderer_url = f"/api/harvest/renderers/{token.renderer_pack}.js?v={ts}"
            for session in self._session_manager.get_all_for_token(token.token_id):
                if not session.ws.closed:
                    try:
                        await session.ws.send_json(theme_msg)
                        if token.renderer_pack:
                            await session.ws.send_json({"type": "renderer", "url": renderer_url})
                    except Exception as exc:
                        log_send_failure(exc, "theme reload")

        _cf_urls = self._theme_manager.build_custom_font_urls(theme_id, theme)
        d = theme_to_api_dict(theme, custom_font_urls=_cf_urls)
        if theme.has_renderer and self._renderer_manager is not None:
            d["has_renderer"] = self._renderer_manager.get_renderer_path(theme_id) is not None
        else:
            d["has_renderer"] = False
        return self.json({"status": "ok", "theme": d})


# ---------------------------------------------------------------------------
# Renderer views
# ---------------------------------------------------------------------------


class HarvestRenderersView(_HarvestView):
    """GET /api/harvest/renderers - list bundled renderers + consent state."""

    url = "/api/harvest/renderers"
    name = "api:harvest:renderers"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        renderers = self._renderer_manager.get_all()
        return self.json({
            "agreed": self._renderer_manager.agreed,
            "renderers": [renderer_to_api_dict(r) for r in renderers],
        })


class HarvestRendererAgreeView(_HarvestView):
    """POST /api/harvest/renderers/agree - set renderer consent state."""

    url = "/api/harvest/renderers/agree"
    name = "api:harvest:renderers:agree"

    async def post(self, request: web.Request) -> web.Response:
        _require_admin(request)
        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")
        agreed = bool(body.get("agreed", False))
        await self._renderer_manager.set_agreed(agreed)
        return self.json({"agreed": agreed})


class HarvestRendererFileView(_HarvestView):
    """GET /api/harvest/renderers/{renderer_id}.js - serve a renderer JS file.

    No auth required - the widget on a remote page needs to fetch it.
    """

    url = "/api/harvest/renderers/{renderer_id}.js"
    name = "api:harvest:renderer_file"
    requires_auth = False

    async def get(self, request: web.Request, renderer_id: str) -> web.Response:
        path = self._renderer_manager.get_renderer_path(renderer_id)
        if path is None:
            raise web.HTTPNotFound()
        data = await self._hass.async_add_executor_job(path.read_bytes)
        return web.Response(
            body=data,
            content_type="application/javascript",
            headers={"Cache-Control": "no-store"},
        )


class HarvestRendererDetailView(_HarvestView):
    """GET /api/harvest/renderers/{renderer_id} - get bundled renderer info."""

    url = "/api/harvest/renderers/{renderer_id}"
    name = "api:harvest:renderer_detail"

    async def get(self, request: web.Request, renderer_id: str) -> web.Response:
        _require_admin(request)
        renderer = self._renderer_manager.get(renderer_id)
        if renderer is None:
            raise web.HTTPNotFound(reason=f"Renderer not found: {renderer_id}")
        return self.json(renderer_to_api_dict(renderer))


class HarvestRendererCodeView(_HarvestView):
    """GET/POST /api/harvest/renderers/{renderer_id}/code - view or update renderer JS source.

    POST accepts arbitrary JavaScript from admin users. The code is written
    to disk unsigned and served without auth via the public renderer JS endpoint.
    Connected widgets auto-load new renderer code at next reconnect. This is
    intentional: renderer overrides are admin-authored extensions by design.
    """

    url = "/api/harvest/renderers/{renderer_id}/code"
    name = "api:harvest:renderer_code"

    async def get(self, request: web.Request, renderer_id: str) -> web.Response:
        _require_admin(request)
        if not self._renderer_manager.get_renderer_path(renderer_id):
            raise web.HTTPNotFound()
        code = await self._hass.async_add_executor_job(
            self._renderer_manager.get_code, renderer_id,
        )
        return self.json({"renderer_id": renderer_id, "code": code or ""})

    async def post(self, request: web.Request, renderer_id: str) -> web.Response:
        _require_admin(request)
        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")
        code = body.get("code")
        if code is None or not isinstance(code, str):
            raise web.HTTPBadRequest(reason="'code' field (string) is required.")
        try:
            await self._renderer_manager.update_code(renderer_id, code)
        except ValueError as exc:
            raise web.HTTPForbidden(reason=str(exc))
        except KeyError as exc:
            raise web.HTTPNotFound(reason=str(exc))
        return self.json({"renderer_id": renderer_id, "status": "ok"})


# ---------------------------------------------------------------------------
# Config view
# ---------------------------------------------------------------------------

class HarvestConfigView(_HarvestView):
    """GET /api/harvest/config  - return integration global config.
    PATCH /api/harvest/config - update config (reloads integration entry).
    """

    url = "/api/harvest/config"
    name = "api:harvest:config"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        from .const import DOMAIN, MAX_ENTITIES_HARD_CAP, PLATFORM_VERSION
        entries = self._hass.config_entries.async_entries(DOMAIN)
        if not entries:
            return self.json({})
        entry = entries[0]
        from .config_validation import normalize_global_config
        merged = normalize_global_config(entry.data, entry.options)
        merged.pop("max_entities_per_token", None)
        merged.pop("max_entities_hard_cap", None)
        merged["platform_version"] = PLATFORM_VERSION
        merged["entity_hard_cap"] = MAX_ENTITIES_HARD_CAP
        from .entity_compatibility import TIER1_DOMAINS, TIER3_DOMAINS
        all_domains = {s.domain for s in self._hass.states.async_all()}
        available = sorted(all_domains - set(TIER1_DOMAINS) - set(TIER3_DOMAINS))
        svc_registry = self._hass.services.async_services()
        domain_list = []
        for d in available:
            svc_map = svc_registry.get(d, {})
            domain_list.append({
                "domain": d,
                "has_services": bool(svc_map),
                "services": sorted(svc_map.keys()) if svc_map else [],
            })
        merged["available_domains"] = domain_list
        return self.json(merged)

    async def patch(self, request: web.Request) -> web.Response:
        """Update global config options in-place without reloading the integration.

        A full integration reload is intentionally avoided here because it
        tears down the panel registration and leaves the Settings screen blank.
        Settings take effect on the next relevant action (new connection, etc.).
        """
        _require_admin(request)
        from .const import DOMAIN
        entries = self._hass.config_entries.async_entries(DOMAIN)
        if not entries:
            raise web.HTTPNotFound(reason="HArvest integration not loaded.")

        try:
            body = await request.json()
        except Exception:
            raise web.HTTPBadRequest(reason="Invalid JSON body.")

        entry = entries[0]
        from .config_validation import normalize_global_config, validate_global_config_patch
        try:
            filtered = validate_global_config_patch(body)
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        if not filtered:
            raise web.HTTPBadRequest(reason="No config keys in body.")
        secondary_server = get_entry_data(self._hass, self._entry_id).get("secondary_server")

        # Validate external_port when present.
        if "external_port" in filtered:
            raw_port = filtered["external_port"]
            try:
                ext_port = int(raw_port or 0)
            except (TypeError, ValueError):
                raise web.HTTPBadRequest(reason="Port must be a number.")

            if ext_port and (secondary_server is None or ext_port != secondary_server.port):
                from .secondary_server import validate_external_port
                ha_http_port = self._hass.config.api.port if self._hass.config.api else 8123
                err = validate_external_port(ext_port, ha_http_port)
                if err:
                    raise web.HTTPBadRequest(reason=err)
            filtered["external_port"] = ext_port

        # Deep-merge the incoming partial update over the current full config.
        current = normalize_global_config(entry.data, entry.options)
        current.pop("max_entities_per_token", None)
        current.pop("max_entities_hard_cap", None)
        updated = _deep_merge(current, filtered)
        try:
            updated = validate_global_config_patch(updated)
        except ValueError as exc:
            raise web.HTTPBadRequest(reason=str(exc))
        # Apply alternate-port server changes before persisting the config.
        # A failed bind restores the previous server and leaves config unchanged.
        if "external_port" in filtered:
            from .const import CONF_EXTERNAL_PORT
            if secondary_server:
                new_port = int(updated.get(CONF_EXTERNAL_PORT, 0) or 0)
                try:
                    if new_port:
                        await secondary_server.reconfigure(new_port)
                    else:
                        await secondary_server.stop()
                except Exception:
                    _LOGGER.exception(
                        "Unable to apply alternate-port server setting %s.",
                        new_port,
                    )
                    action = "start" if new_port else "stop"
                    raise web.HTTPBadRequest(
                        reason=f"Unable to {action} alternate-port server."
                    )

        self._hass.config_entries.async_update_entry(entry, options=updated)

        if filtered.get("kill_switch") or "sensitive_domains" in filtered:
            for session in self._session_manager.get_all():
                if not session.ws.closed:
                    self._hass.async_create_task(_close_ws_with_auth_failed(session.ws))

        from .const import MAX_ENTITIES_HARD_CAP, PLATFORM_VERSION
        updated["platform_version"] = PLATFORM_VERSION
        updated["entity_hard_cap"] = MAX_ENTITIES_HARD_CAP
        from .entity_compatibility import TIER1_DOMAINS, TIER3_DOMAINS
        all_domains = {s.domain for s in self._hass.states.async_all()}
        avail = sorted(all_domains - set(TIER1_DOMAINS) - set(TIER3_DOMAINS))
        svc_registry = self._hass.services.async_services()
        updated["available_domains"] = [
            {"domain": d, "has_services": bool(svc_registry.get(d)), "services": sorted(svc_registry.get(d, {}).keys())}
            for d in avail
        ]
        return self.json(updated)


# ---------------------------------------------------------------------------
# Stats view
# ---------------------------------------------------------------------------

class HarvestStatsView(_HarvestView):
    """GET /api/harvest/stats - global stats for the panel home screen.

    Returns the flat PanelStats shape the frontend expects:
      active_sessions, active_tokens, commands_today, errors_today,
      db_size_bytes, is_running.
    """

    url = "/api/harvest/stats"
    name = "api:harvest:stats"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        today = await self._activity_store.count_today()
        db_size = await self._activity_store.get_db_size_bytes()
        return self.json({
            "active_sessions": self._session_manager.count_active(),
            "active_tokens": len(self._token_manager.get_active()),
            "commands_today": today.get("commands", 0),
            "errors_today": today.get("auth_fail", 0),
            "db_size_bytes": db_size,
            "is_running": True,
        })


# ---------------------------------------------------------------------------
# Warnings (drift banner dismissal) - SPEC.md Section 12
# ---------------------------------------------------------------------------

class HarvestWarningsView(_HarvestView):
    """GET  /api/harvest/warnings           - read dismiss state and current version.
    POST /api/harvest/warnings/dismiss     - dismiss banners at current version.

    Combined into a single view class with two URL routes via separate
    sub-views below; this class owns the GET. The POST lives on
    HarvestWarningsDismissView so each route maps to one verb cleanly.
    """

    url = "/api/harvest/warnings"
    name = "api:harvest:warnings"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        from .const import PLATFORM_VERSION
        store = self._warnings_store
        # During the brief gap between unload and re-setup, _warnings_store
        # may be None. Treat as "not dismissed at this version" so the
        # panel falls back to default behavior (show banners if any drift).
        dismissed_at = store.dismissed_at_version if store is not None else None
        return self.json({
            "current_version": PLATFORM_VERSION,
            "dismissed_at_version": dismissed_at,
            "dismissed": dismissed_at == PLATFORM_VERSION,
        })


class HarvestWarningsDismissView(_HarvestView):
    """POST /api/harvest/warnings/dismiss - record a dismissal at the
    server's current PLATFORM_VERSION. Idempotent: posting twice in a
    row is a no-op since the stored value already matches.
    """

    url = "/api/harvest/warnings/dismiss"
    name = "api:harvest:warnings:dismiss"

    async def post(self, request: web.Request) -> web.Response:
        _require_admin(request)
        store = self._warnings_store
        if store is None:
            raise web.HTTPServiceUnavailable(
                reason="HArvest warnings store is not currently loaded."
            )
        from .const import PLATFORM_VERSION
        await store.dismiss(PLATFORM_VERSION)
        return self.json({
            "current_version": PLATFORM_VERSION,
            "dismissed_at_version": PLATFORM_VERSION,
            "dismissed": True,
        })


# ---------------------------------------------------------------------------
# URL reachability probe (panel-side mirror of the WP plugin's AJAX handler)
# ---------------------------------------------------------------------------

_PROBE_REDIRECT_STATUSES = {301, 302, 303, 307, 308}
_PROBE_MAX_REDIRECTS = 3


class _ProbeUrlRejected(ValueError):
    """Raised when a reachability probe destination is not safe to request."""


class _PinnedResolver(AbstractResolver):
    """Resolve one hostname only to addresses validated before connection."""

    def __init__(self, hostname: str, addresses: list[ResolveResult]) -> None:
        self._hostname = hostname.rstrip(".").lower()
        self._addresses = addresses

    async def resolve(
        self,
        host: str,
        port: int = 0,
        family: socket.AddressFamily = socket.AF_INET,
    ) -> list[ResolveResult]:
        """Return validated addresses without another DNS lookup."""
        if host.rstrip(".").lower() != self._hostname:
            raise OSError("Unexpected hostname requested by pinned resolver.")
        return [
            ResolveResult(
                hostname=host,
                host=address["host"],
                port=port,
                family=address["family"],
                proto=address["proto"],
                flags=address["flags"],
            )
            for address in self._addresses
            if family in (socket.AF_UNSPEC, address["family"])
        ]

    async def close(self) -> None:
        """Release resolver resources."""


def _is_public_probe_address(address: str) -> bool:
    """Return whether an IP address is safe for the reachability probe."""
    ip = ipaddress.ip_address(address)
    return ip.is_global and not ip.is_multicast


async def _resolve_public_probe_addresses(url: URL) -> list[ResolveResult]:
    """Resolve and validate every destination address before connecting."""
    if url.scheme not in ("http", "https") or not url.host:
        raise _ProbeUrlRejected("Only full HTTP or HTTPS URLs can be checked.")
    if url.user is not None or url.password is not None:
        raise _ProbeUrlRejected("URLs containing credentials cannot be checked.")

    try:
        port = url.port
    except ValueError as exc:
        raise _ProbeUrlRejected("URL contains an invalid port.") from exc

    host = url.raw_host or url.host
    try:
        literal_ip = ipaddress.ip_address(host)
    except ValueError:
        literal_ip = None

    if literal_ip is not None:
        if not _is_public_probe_address(str(literal_ip)):
            raise _ProbeUrlRejected(
                "Private or internal network URLs cannot be checked."
            )
        family = socket.AF_INET6 if literal_ip.version == 6 else socket.AF_INET
        return [
            ResolveResult(
                hostname=host,
                host=str(literal_ip),
                port=port,
                family=family,
                proto=socket.IPPROTO_TCP,
                flags=socket.AI_NUMERICHOST | socket.AI_NUMERICSERV,
            )
        ]

    infos = await asyncio.get_running_loop().getaddrinfo(
        host,
        port,
        family=socket.AF_UNSPEC,
        type=socket.SOCK_STREAM,
    )
    addresses: list[ResolveResult] = []
    seen: set[tuple[int, str]] = set()
    for family, _socktype, proto, _canonname, sockaddr in infos:
        if family not in (socket.AF_INET, socket.AF_INET6):
            continue
        address = sockaddr[0]
        if not _is_public_probe_address(address):
            raise _ProbeUrlRejected(
                "Private or internal network URLs cannot be checked."
            )
        key = (family, address)
        if key in seen:
            continue
        seen.add(key)
        addresses.append(
            ResolveResult(
                hostname=host,
                host=address,
                port=port,
                family=family,
                proto=proto,
                flags=socket.AI_NUMERICHOST | socket.AI_NUMERICSERV,
            )
        )

    if not addresses:
        raise OSError("DNS lookup returned no usable addresses.")
    return addresses


async def _probe_public_url(raw: str) -> int:
    """Probe a public URL while validating and pinning every redirect target."""
    current = URL(raw)
    timeout = aiohttp.ClientTimeout(total=4)
    from .const import PLATFORM_VERSION

    for redirect_count in range(_PROBE_MAX_REDIRECTS + 1):
        addresses = await _resolve_public_probe_addresses(current)
        connector = aiohttp.TCPConnector(
            resolver=_PinnedResolver(current.raw_host or current.host, addresses),
            use_dns_cache=False,
            force_close=True,
        )
        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            trust_env=False,
        ) as session:
            async with session.head(
                current,
                allow_redirects=False,
                headers={
                    "User-Agent": (
                        f"HArvest/{PLATFORM_VERSION} (URL reachability probe)"
                    )
                },
            ) as response:
                status = response.status
                location = response.headers.get("Location")

        if status not in _PROBE_REDIRECT_STATUSES or not location:
            return status
        if redirect_count >= _PROBE_MAX_REDIRECTS:
            raise aiohttp.TooManyRedirects(request_info=None, history=())
        try:
            current = current.join(URL(location)).with_fragment(None)
        except ValueError as exc:
            raise _ProbeUrlRejected("Redirect target is not a valid URL.") from exc

    raise aiohttp.TooManyRedirects(request_info=None, history=())


class HarvestCheckUrlView(_HarvestView):
    """GET /api/harvest/check_url?url=... - probe a URL from the HA server side.

    Used by the panel Settings page to render live reachability
    indicators for the Override Host field (which determines the
    HA-served snippet URL) and the custom widget_script_url field.
    The browser can't fetch arbitrary cross-origin URLs because of
    CORS; this endpoint proxies the HEAD request from HA so the
    same-origin restriction does not apply.

    The reported reachability is ADVISORY ONLY. A "not reachable"
    result does not necessarily mean visitors will fail to load the
    widget: visitors may be on a different network than HA (LAN-only
    custom hosts, internal proxies). The panel surfaces this nuance
    with prose, not a blocking error. SPEC.md Section 12.

    Response shape (always all four fields):
      {
        ok: bool,        # true on a 2xx HEAD response
        status: int,     # HTTP status code, 0 if no response received
        reason: str,     # "reachable" | "unreachable" | "relative" | "invalid"
        message: str,    # human-readable, suitable for direct display
      }
    """

    url = "/api/harvest/check_url"
    name = "api:harvest:check_url"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)

        raw = (request.query.get("url") or "").strip()
        if not raw:
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "invalid",
                "message": "Empty URL.",
            })

        # Defensive checks mirror the WP plugin's sanitize_custom_url + the
        # AJAX handler so we never make outbound requests for obviously
        # malformed values.
        import re as _re
        if _re.search(r"[\x00-\x1f\x7f]", raw) or _re.search(r'[\s"\'<>`]', raw):
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "invalid",
                "message": "URL contains invalid characters.",
            })
        lowered = raw.lower()
        if lowered.startswith(("javascript:", "data:", "vbscript:")):
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "invalid",
                "message": "URL uses a disallowed scheme.",
            })

        # Relative paths cannot be probed - they only resolve in the
        # visitor's browser, against whatever page they happen to be
        # loading. Return the dedicated "relative" status so the panel
        # can render its own informational indicator (vs. the warn-tone
        # one for actual unreachable URLs).
        if not _re.match(r"^https?://", raw, _re.IGNORECASE):
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "relative",
                "message": (
                    "Relative path - not a full URL. It will work "
                    "relative to wherever your page is hosted, but we can't "
                    "check it from here."
                ),
            })

        try:
            status = await _probe_public_url(raw)
        except _ProbeUrlRejected as exc:
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "invalid",
                "message": str(exc),
            })
        except asyncio.TimeoutError:
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "unreachable",
                "message": (
                    "The URL took too long to respond when checked from Home "
                    "Assistant. Visitors may still be able to load it; save "
                    "anyway if you know the URL is correct."
                ),
            })
        except (aiohttp.ClientError, OSError, ValueError):
            return self.json({
                "ok": False,
                "status": 0,
                "reason": "unreachable",
                "message": (
                    "Could not reach this URL from Home Assistant. Visitors "
                    "may still be able to load it; save anyway if you know "
                    "the URL is correct."
                ),
            })

        ok = 200 <= status < 300
        return self.json({
            "ok": ok,
            "status": status,
            "reason": "reachable" if ok else "unreachable",
            "message": (
                f"URL is reachable (HTTP {status})."
                if ok
                else (
                    f"This URL returned an error (HTTP {status}) when checked "
                    "from Home Assistant. Visitors may still be able to load it."
                )
            ),
        })


# ---------------------------------------------------------------------------
# Entity picker view
# ---------------------------------------------------------------------------

class HarvestEntitiesView(_HarvestView):
    """GET /api/harvest/entities - all HA entity states for the entity picker.

    Returns a flat list of all entities known to HA, used by the panel wizard
    to power the entity autocomplete dropdown in Step 1.

    Each entry carries `icon`: the MDI icon the widget card shows by default
    for the entity's current state, resolved with the same registry /
    device-class / domain-default logic as entity definitions, so panel
    entity lists can match the card.
    """

    url = "/api/harvest/entities"
    name = "api:harvest:entities"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        from homeassistant.helpers import entity_registry as er
        from .entity_compatibility import get_support_tier, get_sensitive_domains, is_sensitive_domain_blocked
        from .entity_definition import build_icon_state_map
        sensitive = get_sensitive_domains(self._hass)
        registry = er.async_get(self._hass)
        result = []
        for s in self._hass.states.async_all():
            if get_support_tier(s.domain) == 3 or is_sensitive_domain_blocked(s.domain, sensitive):
                continue
            entry = registry.async_get(s.entity_id)
            device_class = None
            if entry is not None:
                device_class = entry.device_class or entry.original_device_class
            if device_class is None:
                device_class = s.attributes.get("device_class")
            icon_map = build_icon_state_map(s.domain, s, entry, device_class)
            result.append({
                "entity_id": s.entity_id,
                "friendly_name": s.attributes.get("friendly_name", s.entity_id),
                "domain": s.domain,
                "state": s.state,
                "icon": icon_map.get(s.state) or icon_map.get("*", "mdi:help-circle"),
            })
        return self.json(result)


class HarvestEntityDefinitionView(_HarvestView):
    """GET /api/harvest/preview/definition/{entity_id} - build an entity
    definition using the authoritative server-side logic.

    Used by the panel's EntityPreview to get a pixel-accurate entity
    definition without duplicating bitmask/icon/feature logic in TypeScript.

    Query params (all optional):
      capabilities      - "read" | "read-write" (default "read-write")
      name_override     - friendly name override
      icon_override     - single icon for all states
      color_scheme      - "light" | "dark" | "auto"
      exclude_attributes - comma-separated attribute names
      display_hints     - JSON-encoded dict
      gesture_config    - JSON-encoded dict
      companion_ids     - comma-separated entity IDs
    """

    url = "/api/harvest/preview/definition/{entity_id}"
    name = "api:harvest:preview:definition"

    async def get(self, request: web.Request, entity_id: str) -> web.Response:
        _require_admin(request)

        state = self._hass.states.get(entity_id)
        if state is None:
            raise web.HTTPNotFound(text=f"Entity {entity_id} not found")

        params = request.query
        import json as _json

        exclude_raw = params.get("exclude_attributes", "")
        exclude_list = [a.strip() for a in exclude_raw.split(",") if a.strip()] if exclude_raw else []

        try:
            display_hints = _json.loads(params["display_hints"]) if "display_hints" in params else {}
        except (ValueError, KeyError):
            display_hints = {}

        try:
            gesture_config = _json.loads(params["gesture_config"]) if "gesture_config" in params else {}
        except (ValueError, KeyError):
            gesture_config = {}

        entity_access = EntityAccess(
            entity_id=entity_id,
            capabilities=params.get("capabilities", "read-write"),
            name_override=params.get("name_override") or None,
            icon_override=params.get("icon_override") or None,
            exclude_attributes=exclude_list,
            color_scheme=params.get("color_scheme", "auto"),
            display_hints=display_hints,
            gesture_config=gesture_config,
        )

        companion_raw = params.get("companion_ids", "")
        companion_ids = [c.strip() for c in companion_raw.split(",") if c.strip()] if companion_raw else None

        if entity_access.capabilities == "badge":
            definition = build_entity_definition(self._hass, entity_id, entity_access, detail_level="badge")
        else:
            definition = build_entity_definition(
                self._hass, entity_id, entity_access, companions=companion_ids,
            )
        if definition is None:
            raise web.HTTPNotFound(text=f"Entity {entity_id} not found")

        filtered_attrs = filter_attributes(dict(state.attributes))
        definition["capabilities"] = entity_access.capabilities

        return self.json({
            "definition": definition,
            "state": _round_state(state.state, entity_access),
            "attributes": filtered_attrs,
        })


class HarvestPreviewHistoryView(_HarvestView):
    """GET /api/harvest/preview/history/{entity_id}

    Returns real recorder history for an entity using the same fetch and
    aggregation logic as the live WebSocket history_request handler, so the
    panel preview graph matches what hosted widgets render. Returns an empty
    points list when the recorder is unavailable or the entity has no numeric
    history (the panel then falls back to mock data).

    Query params (optional): hours (1-168, default 24), period (minutes,
    default 10).

    Response: {"entity_id", "hours", "period", "points": [{"t", "s"}, ...]}
    """

    url = "/api/harvest/preview/history/{entity_id}"
    name = "api:harvest:preview:history"

    async def get(self, request: web.Request, entity_id: str) -> web.Response:
        _require_admin(request)

        if self._hass.states.get(entity_id) is None:
            raise web.HTTPNotFound(text=f"Entity {entity_id} not found")

        params = request.query
        try:
            hours = int(params.get("hours", 24))
        except (TypeError, ValueError):
            hours = 24
        hours = max(1, min(hours, 168))
        try:
            period = int(params.get("period", 10))
        except (TypeError, ValueError):
            period = 10
        period = max(1, period)
        if period >= hours * 60:
            period = 10

        from .ws_proxy import fetch_history_points
        points = await fetch_history_points(self._hass, entity_id, hours, period)
        return self.json({
            "entity_id": entity_id,
            "hours": hours,
            "period": period,
            "points": points,
        })


# ---------------------------------------------------------------------------
# Script fields view
# ---------------------------------------------------------------------------

class HarvestScriptFieldsView(_HarvestView):
    """GET /api/harvest/entities/{entity_id}/script_fields

    Returns the HA-defined variable fields for a script entity. The wizard
    uses this to render a configuration form so token authors can bake in
    service_data without exposing the field names to the public widget.

    Response: {"fields": {<field_name>: <field_schema>, ...}}
    Returns an empty fields dict for non-script entities.
    """

    url = "/api/harvest/entities/{entity_id}/script_fields"
    name = "api:harvest:script:fields"

    async def get(self, request: web.Request, entity_id: str) -> web.Response:
        _require_admin(request)

        state = self._hass.states.get(entity_id)
        if state is None:
            raise web.HTTPNotFound(text=f"Entity {entity_id} not found")

        domain = entity_id.split(".")[0]
        if domain != "script":
            return self.json({"entity_id": entity_id, "fields": {}})

        service_name = entity_id.split(".", 1)[1]
        from homeassistant.helpers.service import async_get_all_descriptions
        descriptions = await async_get_all_descriptions(self._hass)
        svc_desc = descriptions.get("script", {}).get(service_name, {})
        fields = svc_desc.get("fields", {})
        return self.json({"entity_id": entity_id, "fields": fields})


class HarvestServiceFieldsView(_HarvestView):
    """GET /api/harvest/services/{domain}/{service}

    Returns the HA-defined field schema for a specific service action.
    Used by the gesture "Perform action" UI to render dynamic input fields
    instead of a raw JSON textarea.

    Response: {"domain": "light", "service": "turn_on", "fields": {...}}
    Fields use HA's selector format (number, boolean, select, text, etc.).
    Only fields whose keys are in _ALLOWED_DATA_KEYS (from ws_proxy) are
    returned, so the UI cannot configure keys the proxy would strip.
    """

    url = "/api/harvest/services/{domain}/{service}"
    name = "api:harvest:service:fields"

    async def get(self, request: web.Request, domain: str, service: str) -> web.Response:
        _require_admin(request)

        from .entity_compatibility import ALLOWED_SERVICES, TIER3_DOMAINS

        # Hard block: Tier 3 domains must never be actionable, even via
        # custom_domains settings (which should not list them either, but
        # belt-and-suspenders).
        if domain in TIER3_DOMAINS:
            raise web.HTTPForbidden(
                text=f"Domain '{domain}' is blocked (Tier 3)."
            )

        allowed_actions = ALLOWED_SERVICES.get(domain)
        custom_domains: list[dict] = []
        try:
            data = get_entry_data(self._hass, self._entry_id)
            if data:
                custom_domains = (
                    data.get("custom_domains")
                    or data.get("options", {}).get("custom_domains", [])
                )
        except Exception:
            pass

        is_allowed = False
        if allowed_actions is not None:
            is_allowed = service in allowed_actions
        else:
            for entry in custom_domains:
                if entry.get("domain") == domain:
                    is_allowed = service in entry.get("allowed_services", [])
                    break

        if not is_allowed:
            raise web.HTTPNotFound(
                text=f"Action {domain}.{service} not in allowlist"
            )

        from homeassistant.helpers.service import async_get_all_descriptions
        descriptions = await async_get_all_descriptions(self._hass)
        svc_desc = descriptions.get(domain, {}).get(service, {})

        raw_fields = svc_desc.get("fields", {})

        allowed_keys = _ALLOWED_DATA_KEYS.get(domain)

        def _filter_fields(fields: dict) -> dict:
            out: dict = {}
            for key, schema in fields.items():
                if key == "advanced_fields":
                    nested = schema.get("fields", {})
                    filtered = _filter_fields(nested)
                    if filtered:
                        out[key] = {**schema, "fields": filtered}
                    continue
                if key in _TARGET_SELECTOR_KEYS:
                    continue
                if allowed_keys is not None and key not in allowed_keys:
                    continue
                out[key] = schema
            return out

        filtered = _filter_fields(raw_fields)

        return self.json({
            "domain": domain,
            "service": service,
            "name": svc_desc.get("name", f"{domain}.{service}"),
            "description": svc_desc.get("description", ""),
            "fields": filtered,
        })


class HarvestRegistriesView(_HarvestView):
    """GET /api/harvest/registries

    Returns HA registry data (areas, floors, devices, labels) for use in
    service-data field selectors. Entities are available via the existing
    /api/harvest/entities endpoint and the panel entity cache.
    """

    url = "/api/harvest/registries"
    name = "api:harvest:registries"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)

        from homeassistant.helpers import (
            area_registry as ar,
            floor_registry as fr,
            device_registry as dr,
            label_registry as lr,
        )

        areas = ar.async_get(self._hass)
        floors = fr.async_get(self._hass)
        devices = dr.async_get(self._hass)
        labels = lr.async_get(self._hass)

        return self.json({
            "areas": [
                {"id": a.id, "name": a.name, "floor_id": a.floor_id}
                for a in areas.async_list_areas()
            ],
            "floors": [
                {"id": f.floor_id, "name": f.name, "level": f.level}
                for f in floors.async_list_floors()
            ],
            "devices": [
                {"id": d.id, "name": d.name_by_user or d.name or d.id, "area_id": d.area_id}
                for d in devices.devices.values()
                if not d.disabled_by
            ],
            "labels": [
                {"id": la.label_id, "name": la.name}
                for la in labels.async_list_labels()
            ],
        })


# ---------------------------------------------------------------------------
# Wizard helper views
# ---------------------------------------------------------------------------

class HarvestAliasView(_HarvestView):
    """POST /api/harvest/alias - generate a random alias for an entity.

    Called by the panel wizard (Step 1) when each entity is selected.
    The alias is stored in wizard session state and persisted on Generate.
    Returns {"alias": "aBcDeFgH"}.
    """

    url = "/api/harvest/alias"
    name = "api:harvest:alias"

    async def post(self, request: web.Request) -> web.Response:
        _require_admin(request)
        try:
            body = await request.json()
            entity_id = str(body.get("entity_id", ""))
        except Exception:
            entity_id = ""
        alias = self._token_manager.generate_alias()
        return self.json({"entity_id": entity_id, "alias": alias})


class HarvestPreviewTokenView(_HarvestView):
    """POST /api/harvest/tokens/preview - create a short-lived wizard preview token.

    Body: {"entity_id": "light.bedroom", "capabilities": "read-write"}
    Called when the wizard reaches Step 5 or Step 6 (appearance / code preview).
    Returns the preview token_id and expiry.
    """

    url = "/api/harvest/tokens/preview"
    name = "api:harvest:token_preview"

    async def post(self, request: web.Request) -> web.Response:
        user = _require_admin(request)

        try:
            body = await request.json()
            entity_id = str(body["entity_id"])
            capabilities = str(body.get("capabilities", "read"))
        except (KeyError, TypeError, Exception):
            raise web.HTTPBadRequest(reason="Requires entity_id and optional capabilities.")

        token = await self._token_manager.create_preview(
            entity_id=entity_id,
            capabilities=capabilities,
            created_by=user.id,
        )
        return self.json({
            "token_id": token.token_id,
            "expires": token.expires.isoformat() if token.expires else None,
            "status": "preview",
        }, status_code=201)


class HarvestLovelaceDashboardsView(_HarvestView):
    """GET /api/harvest/lovelace/dashboards - list HA Lovelace dashboards."""

    url = "/api/harvest/lovelace/dashboards"
    name = "api:harvest:lovelace:dashboards"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        from homeassistant.components.lovelace import LOVELACE_DATA

        lovelace_data = self._hass.data.get(LOVELACE_DATA)
        if lovelace_data is None:
            return self.json([])

        result = []
        for url_path, dashboard in lovelace_data.dashboards.items():
            try:
                info = await dashboard.async_get_info()
            except Exception:
                info = {}
            result.append({
                "url_path": url_path,
                "title": info.get("title") or url_path or "Default dashboard",
                "mode": info.get("mode", "unknown"),
            })
        return self.json(result)


class HarvestLovelaceConfigView(_HarvestView):
    """GET /api/harvest/lovelace/config - fetch raw Lovelace dashboard config."""

    url = "/api/harvest/lovelace/config"
    name = "api:harvest:lovelace:config"

    async def get(self, request: web.Request) -> web.Response:
        _require_admin(request)
        from homeassistant.components.lovelace import LOVELACE_DATA

        lovelace_data = self._hass.data.get(LOVELACE_DATA)
        if lovelace_data is None:
            raise web.HTTPNotFound(text="Lovelace data not available")

        url_path = request.query.get("url_path")
        dashboard = lovelace_data.dashboards.get(url_path)
        if dashboard is None:
            raise web.HTTPNotFound(text=f"Dashboard not found: {url_path}")

        try:
            config = await dashboard.async_load(force=False)
        except Exception as exc:
            _LOGGER.warning("Failed to load Lovelace config for %s: %s", url_path, exc)
            raise web.HTTPInternalServerError(text="Failed to load dashboard config")

        return self.json(config)


class HarvestPanelJsView(_HarvestView):
    """GET /api/harvest/panel.js - serve the panel bundle.

    Served with ``Cache-Control: no-cache`` and an ETag derived from the
    bundle's modification time and size. ``no-cache`` lets the browser keep the
    bundle but forces it to revalidate on every load: an unchanged bundle gets
    a small ``304 Not Modified`` (no re-download), and a rebuilt bundle is
    picked up on the next page load (new ETag, fresh ``200``) with no
    integration reload or Home Assistant restart. This is the right caching
    model for a mutable, non-content-hashed file - unlike an immutable cache,
    which would pin the browser to a stale build until the URL changed.
    """

    url = "/api/harvest/panel.js"
    name = "api:harvest:panel_js"
    requires_auth = False

    async def get(self, request: web.Request) -> web.Response:
        panel_path = Path(self._hass.config.path(
            "custom_components", "harvest", "panel", "panel.js"
        ))
        try:
            stat = await self._hass.async_add_executor_job(panel_path.stat)
        except OSError:
            raise web.HTTPNotFound()
        etag = f'"{stat.st_mtime_ns}-{stat.st_size}"'
        headers = {"ETag": etag, "Cache-Control": "no-cache"}
        # Conditional request: skip the read and body entirely when unchanged.
        if request.headers.get("If-None-Match") == etag:
            return web.Response(status=304, headers=headers)
        try:
            content = await self._hass.async_add_executor_job(panel_path.read_bytes)
        except OSError:
            raise web.HTTPNotFound()
        return web.Response(
            body=content,
            content_type="application/javascript",
            headers=headers,
        )
