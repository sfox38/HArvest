"""tests/test_http_views.py

Tests for custom_components.harvest.http_views:
  - Serialisation helpers: _token_to_dict, _session_to_dict, _parse_dt,
    _parse_origins, _parse_rate_limits, _parse_session_config,
    _parse_entities, _parse_schedule
  - register_views() - verifies all views are registered
  - View endpoint methods (GET/POST/PATCH/DELETE) via mocked request objects
"""
from __future__ import annotations

from datetime import datetime, timezone
import io
import json
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch
import zipfile

import pytest
from aiohttp import web

from custom_components.harvest.const import DOMAIN
from custom_components.harvest.http_views import (
    HarvestActivityExportView,
    HarvestActivityView,
    HarvestAggregatesView,
    HarvestAliasView,
    HarvestConfigView,
    HarvestLovelaceConfigView,
    HarvestLovelaceDashboardsView,
    HarvestPreviewTokenView,
    HarvestSessionsView,
    HarvestServiceFieldsView,
    HarvestStatsView,
    HarvestThemeCustomFontView,
    HarvestThemeImportView,
    HarvestThemeReloadByIdView,
    HarvestThemeReloadView,
    HarvestTokenDetailView,
    HarvestTokenDuplicateView,
    HarvestTokensView,
    _parse_dt,
    _parse_entities,
    _parse_origins,
    _parse_rate_limits,
    _parse_schedule,
    _parse_session_config,
    _session_to_dict,
    _token_to_dict,
    _validate_display_text,
    register_views,
)
from custom_components.harvest.token_manager import (
    ActiveSchedule,
    ActiveScheduleWindow,
    EntityAccess,
    OriginConfig,
    RateLimitConfig,
    SessionConfig,
    Token,
)
from custom_components.harvest.theme_manager import ThemeDefinition, ThemeManager


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_token(**kwargs) -> Token:
    defaults = dict(
        token_id="hwt_test123",
        token_version=1,
        label="Test Token",
        created_by="user_abc",
        created_at=datetime(2024, 1, 1, tzinfo=timezone.utc),
        expires=None,
        revoked_at=None,
        token_secret="secret123",
        entities=[],
        origins=OriginConfig(allow_any=False, allowed=[], allow_paths=[]),
        rate_limits=RateLimitConfig(max_push_per_second=1, max_commands_per_minute=30, override_defaults=False),
        session=SessionConfig(lifetime_minutes=60, max_lifetime_minutes=1440),
        max_sessions=None,
        active_schedule=None,
        allowed_ips=[],
        status="active",
        revoke_reason=None,
    )
    defaults.update(kwargs)
    return Token(**defaults)


def _make_session(**kwargs) -> MagicMock:
    s = MagicMock()
    s.session_id = "hrs_sess001"
    s.token_id = "hwt_test123"
    s.token_version = 1
    s.issued_at = datetime(2024, 1, 1, tzinfo=timezone.utc)
    s.expires_at = datetime(2024, 1, 2, tzinfo=timezone.utc)
    s.absolute_expires_at = datetime(2024, 1, 4, tzinfo=timezone.utc)
    s.renewal_count = 0
    s.origin_validated = "https://example.com"
    s.referer_validated = None
    s.subscribed_entity_ids = {"light.test"}
    s.last_message_at = datetime(2024, 1, 1, 12, tzinfo=timezone.utc)
    for k, v in kwargs.items():
        setattr(s, k, v)
    return s


def _make_request(body: Any = None, query: dict | None = None, user=...) -> MagicMock:
    req = MagicMock()
    req.json = AsyncMock(return_value=body or {})
    req.query = query or {}
    if user is ...:
        default_user = MagicMock()
        default_user.is_admin = True
        req.get = MagicMock(return_value=default_user)
    else:
        req.get = MagicMock(return_value=user)
    return req


_TEST_ENTRY_ID = "test_entry"


def _make_view(view_cls, *, hass: MagicMock | None = None, **managers):
    """Construct a panel HTTP view for tests.

    Views resolve managers from ``hass.data[DOMAIN][entry_id]`` per request,
    so we populate hass.data with mock managers before construction. Tests
    that read ``view._token_manager`` etc. read the same mocks back via the
    inherited @property accessor.

    Pass any subset of managers as kwargs (token_manager=..., session_manager=...,
    etc.). Unspecified ones default to a fresh MagicMock(). Pass ``hass=...``
    when the test needs a specific hass mock (e.g., for config-entry queries).
    """
    if hass is None:
        hass = MagicMock()
    # sensors and controls default to None to match the old constructor's
    # ``sensors=None, controls=None`` defaults: many existing tests rely on
    # the post-create handler skipping ``await self._sensors.create...`` when
    # sensors is falsy. Tests that need active mocks pass them explicitly.
    defaults = {
        "token_manager": MagicMock(),
        "session_manager": MagicMock(),
        "activity_store": MagicMock(),
        "event_bus": MagicMock(),
        "theme_manager": MagicMock(),
        "renderer_manager": MagicMock(),
        "sensors": None,
        "controls": None,
    }
    defaults.update(managers)
    hass.data = {DOMAIN: {_TEST_ENTRY_ID: defaults}}
    return view_cls(hass, _TEST_ENTRY_ID)


# ---------------------------------------------------------------------------
# _parse_dt()
# ---------------------------------------------------------------------------

class TestParseDt:
    def test_valid_iso_string(self):
        dt = _parse_dt("2024-06-01T12:00:00Z")
        assert dt is not None
        assert dt.tzinfo is not None

    def test_naive_datetime_gets_utc(self):
        dt = _parse_dt("2024-06-01T12:00:00")
        assert dt.tzinfo == timezone.utc

    def test_none_returns_none(self):
        assert _parse_dt(None) is None

    def test_empty_string_returns_none(self):
        assert _parse_dt("") is None

    def test_invalid_string_rejected(self):
        with pytest.raises(ValueError):
            _parse_dt("not-a-date")

    def test_non_string_rejected(self):
        with pytest.raises(ValueError):
            _parse_dt(0)

    def test_aware_datetime_unchanged(self):
        dt = _parse_dt("2024-01-01T00:00:00+05:00")
        assert dt.utcoffset().seconds == 5 * 3600


# ---------------------------------------------------------------------------
# _parse_origins()
# ---------------------------------------------------------------------------

class TestParseOrigins:
    def test_allow_any(self):
        r = _parse_origins({"allow_any": True})
        assert r.allow_any is True

    def test_allowed_list(self):
        r = _parse_origins({"allowed": ["https://a.com", "https://b.com"]})
        assert r.allowed == ["https://a.com", "https://b.com"]

    def test_allow_paths(self):
        r = _parse_origins({"allow_paths": ["/path1"]})
        assert r.allow_paths == ["/path1"]

    def test_empty_dict_defaults(self):
        r = _parse_origins({})
        assert r.allow_any is False
        assert r.allowed == []
        assert r.allow_paths == []

    def test_returns_origin_config(self):
        from custom_components.harvest.token_manager import OriginConfig
        r = _parse_origins({})
        assert isinstance(r, OriginConfig)


# ---------------------------------------------------------------------------
# _parse_rate_limits()
# ---------------------------------------------------------------------------

class TestParseRateLimits:
    def test_max_push_per_second(self):
        r = _parse_rate_limits({"max_push_per_second": 5})
        assert r.max_push_per_second == 5

    def test_max_commands_per_minute(self):
        r = _parse_rate_limits({"max_commands_per_minute": 60})
        assert r.max_commands_per_minute == 60

    def test_override_defaults(self):
        r = _parse_rate_limits({"override_defaults": True})
        assert r.override_defaults is True

    def test_defaults_on_empty(self):
        r = _parse_rate_limits({})
        assert r.max_push_per_second == 1
        assert r.max_commands_per_minute == 30
        assert r.override_defaults is False

    def test_zero_max_commands_rejected(self):
        # max_commands_per_minute = 0 would divide by zero in the rate limiter
        # (refill_rate = 0 / 60.0 = 0, then int(deficit / refill_rate) raises).
        with pytest.raises(ValueError):
            _parse_rate_limits({"max_commands_per_minute": 0})

    def test_negative_max_push_rejected(self):
        with pytest.raises(ValueError):
            _parse_rate_limits({"max_push_per_second": -5})

    def test_non_numeric_max_push_rejected(self):
        with pytest.raises(ValueError):
            _parse_rate_limits({"max_push_per_second": "fast"})

    def test_excessive_max_commands_rejected(self):
        # Cap is 10000/min; reject anything above to prevent admin typos
        # producing absurdly large token buckets.
        with pytest.raises(ValueError):
            _parse_rate_limits({"max_commands_per_minute": 99999999})


# ---------------------------------------------------------------------------
# _parse_session_config()
# ---------------------------------------------------------------------------

class TestParseSessionConfig:
    def test_lifetime_minutes(self):
        r = _parse_session_config({"lifetime_minutes": 30})
        assert r.lifetime_minutes == 30

    def test_max_lifetime_minutes(self):
        r = _parse_session_config({"max_lifetime_minutes": 720})
        assert r.max_lifetime_minutes == 720

    def test_max_renewals_none(self):
        r = _parse_session_config({})
        assert r.max_renewals is None

    def test_max_renewals_set(self):
        r = _parse_session_config({"max_renewals": 3})
        assert r.max_renewals == 3

    def test_absolute_lifetime_hours(self):
        r = _parse_session_config({"absolute_lifetime_hours": 72})
        assert r.absolute_lifetime_hours == 72

    def test_defaults_on_empty(self):
        r = _parse_session_config({})
        assert r.lifetime_minutes == 60
        assert r.max_lifetime_minutes == 1440

    def test_zero_lifetime_rejected(self):
        with pytest.raises(ValueError):
            _parse_session_config({"lifetime_minutes": 0})

    def test_negative_max_lifetime_rejected(self):
        with pytest.raises(ValueError):
            _parse_session_config({"max_lifetime_minutes": -10})

    def test_string_max_renewals_rejected(self):
        # Untyped raw.get("max_renewals") previously stored the string and
        # crashed when ws_proxy compared int >= str at renewal time.
        with pytest.raises(ValueError):
            _parse_session_config({"max_renewals": "five"})

    def test_zero_max_renewals_rejected(self):
        # 0 means "no renewals at all". Use null/None for unlimited rather
        # than accepting an ambiguous 0.
        with pytest.raises(ValueError):
            _parse_session_config({"max_renewals": 0})

    def test_excessive_lifetime_rejected(self):
        # Cap is 1440 minutes (24h); reject typos that would extend a
        # session beyond a day before it must be renewed.
        with pytest.raises(ValueError):
            _parse_session_config({"lifetime_minutes": 99999})


# ---------------------------------------------------------------------------
# _parse_entities()
# ---------------------------------------------------------------------------

class TestParseEntities:
    def test_basic_entity(self):
        entities = _parse_entities([{"entity_id": "light.test", "capabilities": "read-write"}])
        assert len(entities) == 1
        assert entities[0].entity_id == "light.test"
        assert entities[0].capabilities == "read-write"

    def test_defaults_to_read(self):
        entities = _parse_entities([{"entity_id": "light.x"}])
        assert entities[0].capabilities == "read"

    def test_alias_set(self):
        entities = _parse_entities([{"entity_id": "light.x", "alias": "myLight1"}])
        assert entities[0].alias == "myLight1"

    def test_alias_empty_string_becomes_none(self):
        entities = _parse_entities([{"entity_id": "light.x", "alias": ""}])
        assert entities[0].alias is None

    def test_exclude_attributes(self):
        entities = _parse_entities([{"entity_id": "light.x", "exclude_attributes": ["attr1"]}])
        assert entities[0].exclude_attributes == ["attr1"]

    def test_multiple_entities(self):
        entities = _parse_entities([
            {"entity_id": "light.a"},
            {"entity_id": "light.b"},
        ])
        assert len(entities) == 2

    def test_duplicate_entity_rejected(self):
        with pytest.raises(ValueError):
            _parse_entities([{"entity_id": "light.a"}, {"entity_id": "light.a"}])

    def test_invalid_alias_rejected(self):
        with pytest.raises(ValueError):
            _parse_entities([{"entity_id": "light.a", "alias": "short"}])

    def test_service_data_preserved(self):
        entities = _parse_entities([
            {"entity_id": "script.test", "service_data": {"target": "kitchen"}},
        ])
        assert entities[0].service_data == {"target": "kitchen"}

    def test_icon_override_accepts_known_prefixes(self):
        for icon in ("mdi:lightbulb", "fa:bolt", "ph:lightbulb", "tabler:bulb"):
            entities = _parse_entities([{"entity_id": "light.x", "icon_override": icon}])
            assert entities[0].icon_override == icon

    def test_icon_override_rejects_unknown_prefix(self):
        with pytest.raises(ValueError):
            _parse_entities([{"entity_id": "light.x", "icon_override": "fab:x"}])

    def test_icon_override_rejects_bare_name(self):
        with pytest.raises(ValueError):
            _parse_entities([{"entity_id": "light.x", "icon_override": "bolt"}])

    def test_icon_override_rejects_over_64_chars(self):
        with pytest.raises(ValueError):
            _parse_entities([{"entity_id": "light.x", "icon_override": "mdi:" + "a" * 61}])


# ---------------------------------------------------------------------------
# _entities_change_is_display_only()
# ---------------------------------------------------------------------------

class TestEntitiesChangeIsDisplayOnly:
    @staticmethod
    def _check(old_entities, new_entities):
        from custom_components.harvest.http_views import _entities_change_is_display_only
        old_map = {ea.entity_id: ea for ea in old_entities}
        return _entities_change_is_display_only(old_map, new_entities)

    def test_display_only_changes_do_not_terminate(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read-write")]
        new = [EntityAccess(
            entity_id="light.a", capabilities="read-write",
            icon_override="fa:bolt", name_override="Lamp",
            color_scheme="dark", display_hints={"animate": True},
        )]
        assert self._check(old, new) is True

    def test_unchanged_entities_are_display_only(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read")]
        new = [EntityAccess(entity_id="light.a", capabilities="read")]
        assert self._check(old, new) is True

    def test_capability_change_is_access_relevant(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read")]
        new = [EntityAccess(entity_id="light.a", capabilities="read-write")]
        assert self._check(old, new) is False

    def test_added_entity_is_access_relevant(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read")]
        new = [
            EntityAccess(entity_id="light.a", capabilities="read"),
            EntityAccess(entity_id="light.b", capabilities="read"),
        ]
        assert self._check(old, new) is False

    def test_removed_entity_is_access_relevant(self):
        old = [
            EntityAccess(entity_id="light.a", capabilities="read"),
            EntityAccess(entity_id="light.b", capabilities="read"),
        ]
        new = [EntityAccess(entity_id="light.a", capabilities="read")]
        assert self._check(old, new) is False

    def test_alias_change_is_access_relevant(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read", alias="abcd1234")]
        new = [EntityAccess(entity_id="light.a", capabilities="read", alias="zzzz9999")]
        assert self._check(old, new) is False

    def test_exclude_attributes_change_is_access_relevant(self):
        old = [EntityAccess(entity_id="light.a", capabilities="read")]
        new = [EntityAccess(entity_id="light.a", capabilities="read", exclude_attributes=["brightness"])]
        assert self._check(old, new) is False


# ---------------------------------------------------------------------------
# _validate_icon_set()
# ---------------------------------------------------------------------------

class TestValidateIconSet:
    def test_accepts_known_set_ids(self):
        from custom_components.harvest.http_views import _validate_icon_set
        for val in ("fa", "ph", "tabler", "ph-duotone", "ph-thin"):
            assert _validate_icon_set(val) == val

    def test_none_and_empty_mean_default(self):
        from custom_components.harvest.http_views import _validate_icon_set
        assert _validate_icon_set(None) is None
        assert _validate_icon_set("") is None

    def test_normalises_case_and_whitespace(self):
        from custom_components.harvest.http_views import _validate_icon_set
        assert _validate_icon_set(" FA ") == "fa"

    def test_rejects_invalid_slugs(self):
        from custom_components.harvest.http_views import _validate_icon_set
        for bad in ("fa:", "fa bolt", "-fa", "a" * 25):
            with pytest.raises(ValueError):
                _validate_icon_set(bad)


# ---------------------------------------------------------------------------
# _parse_schedule()
# ---------------------------------------------------------------------------

class TestParseSchedule:
    def test_none_returns_none(self):
        assert _parse_schedule(None) is None

    def test_empty_dict_returns_none(self):
        assert _parse_schedule({}) is None

    def test_valid_schedule(self):
        raw = {
            "timezone": "America/New_York",
            "windows": [{"days": ["mon", "tue"], "start": "08:00", "end": "17:00"}],
        }
        s = _parse_schedule(raw)
        assert s is not None
        assert s.timezone == "America/New_York"
        assert len(s.windows) == 1
        assert s.windows[0].days == ["mon", "tue"]
        assert s.windows[0].start == "08:00"
        assert s.windows[0].end == "17:00"

    def test_empty_windows_list(self):
        raw = {"timezone": "UTC", "windows": []}
        s = _parse_schedule(raw)
        assert s.windows == []

    def test_invalid_hour_rejected(self):
        # 24:00 is not a real wall-clock time; reject it. Use 00:00 of the
        # next day or a midnight-crossing window pattern instead.
        raw = {"timezone": "UTC", "windows": [{"days": ["mon"], "start": "24:00", "end": "23:59"}]}
        with pytest.raises(ValueError):
            _parse_schedule(raw)

    def test_impossible_time_rejected(self):
        raw = {"timezone": "UTC", "windows": [{"days": ["mon"], "start": "00:00", "end": "99:99"}]}
        with pytest.raises(ValueError):
            _parse_schedule(raw)

    def test_invalid_minute_rejected(self):
        # Minutes only go 00-59.
        raw = {"timezone": "UTC", "windows": [{"days": ["mon"], "start": "12:60", "end": "13:00"}]}
        with pytest.raises(ValueError):
            _parse_schedule(raw)

    def test_boundary_times_accepted(self):
        # 00:00 and 23:59 are the legitimate extremes.
        raw = {"timezone": "UTC", "windows": [{"days": ["mon"], "start": "00:00", "end": "23:59"}]}
        s = _parse_schedule(raw)
        assert s.windows[0].start == "00:00"
        assert s.windows[0].end == "23:59"


# ---------------------------------------------------------------------------
# _token_to_dict()
# ---------------------------------------------------------------------------

class TestTokenToDict:
    def test_basic_fields_present(self):
        t = _make_token()
        d = _token_to_dict(t)
        assert d["token_id"] == "hwt_test123"
        assert d["label"] == "Test Token"

    def test_created_at_is_isoformat(self):
        t = _make_token()
        d = _token_to_dict(t)
        assert isinstance(d["created_at"], str)
        assert "2024" in d["created_at"]

    def test_expires_none_when_no_expiry(self):
        t = _make_token(expires=None)
        d = _token_to_dict(t)
        assert d["expires"] is None

    def test_expires_isoformat_when_set(self):
        t = _make_token(expires=datetime(2025, 12, 31, tzinfo=timezone.utc))
        d = _token_to_dict(t)
        assert "2025" in d["expires"]

    def test_revoked_at_none_when_not_revoked(self):
        t = _make_token(revoked_at=None)
        d = _token_to_dict(t)
        assert d["revoked_at"] is None

    def test_revoked_at_isoformat_when_revoked(self):
        t = _make_token(revoked_at=datetime(2024, 6, 1, tzinfo=timezone.utc))
        d = _token_to_dict(t)
        assert "2024" in d["revoked_at"]

    def test_token_secret_is_bool_true_when_set(self):
        t = _make_token(token_secret="supersecret")
        d = _token_to_dict(t)
        # Never expose the actual secret value.
        assert d["token_secret"] is True

    def test_token_secret_is_bool_false_when_none(self):
        t = _make_token(token_secret=None)
        d = _token_to_dict(t)
        assert d["token_secret"] is False


# ---------------------------------------------------------------------------
# _session_to_dict()
# ---------------------------------------------------------------------------

class TestSessionToDict:
    def test_session_id_present(self):
        s = _make_session()
        d = _session_to_dict(s)
        assert d["session_id"] == "hrs_sess001"

    def test_token_id_present(self):
        s = _make_session()
        d = _session_to_dict(s)
        assert d["token_id"] == "hwt_test123"

    def test_issued_at_is_isoformat(self):
        s = _make_session()
        d = _session_to_dict(s)
        assert isinstance(d["issued_at"], str)

    def test_subscribed_entity_ids_is_list(self):
        s = _make_session()
        d = _session_to_dict(s)
        assert isinstance(d["subscribed_entity_ids"], list)

    def test_no_websocket_in_dict(self):
        s = _make_session()
        d = _session_to_dict(s)
        # ws should NOT appear in the serialised dict
        assert "ws" not in d


# ---------------------------------------------------------------------------
# register_views()
# ---------------------------------------------------------------------------

class TestRegisterViews:
    def test_registers_correct_number_of_views(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        # Verify register_view was called at least once for each view
        assert hass.http.register_view.call_count >= 10

    def test_registers_tokens_view(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        view_types = [type(call.args[0]) for call in hass.http.register_view.call_args_list]
        assert HarvestTokensView in view_types

    def test_registers_sessions_view(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        view_types = [type(call.args[0]) for call in hass.http.register_view.call_args_list]
        assert HarvestSessionsView in view_types

    def test_registers_activity_view(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        view_types = [type(call.args[0]) for call in hass.http.register_view.call_args_list]
        assert HarvestActivityView in view_types

    def test_registers_stats_view(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        view_types = [type(call.args[0]) for call in hass.http.register_view.call_args_list]
        assert HarvestStatsView in view_types

    def test_registers_alias_view(self):
        hass = MagicMock()
        register_views(hass, _TEST_ENTRY_ID)
        view_types = [type(call.args[0]) for call in hass.http.register_view.call_args_list]
        assert HarvestAliasView in view_types


# ---------------------------------------------------------------------------
# Public theme assets and adversarial theme imports
# ---------------------------------------------------------------------------

def _make_theme_zip(theme_json: dict, **files: bytes) -> bytes:
    """Build an in-memory theme archive for import tests."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as archive:
        archive.writestr("theme.json", json.dumps(theme_json))
        for filename, data in files.items():
            archive.writestr(filename, data)
    return buf.getvalue()


def _make_raw_request(body: bytes) -> MagicMock:
    """Build an authenticated raw-body request for import tests."""
    request = MagicMock()
    user = MagicMock()
    user.id = "admin"
    user.is_admin = True
    request.get = MagicMock(return_value=user)
    request.headers = {"Content-Type": "application/zip"}
    request.query = {}
    request.read = AsyncMock(return_value=body)
    return request


class TestPublicThemeAssets:
    def test_custom_font_view_is_public_and_allows_cors(self):
        assert HarvestThemeCustomFontView.requires_auth is False
        assert HarvestThemeCustomFontView.cors_allowed is True


class TestRuntimeThemeMessages:
    def test_message_includes_all_runtime_fields_and_cache_busted_font_url(self, tmp_path):
        font_path = tmp_path / "inter.woff2"
        font_path.write_bytes(b"wOF2font-data")
        manager = ThemeManager(MagicMock())
        manager.get_custom_font_path = MagicMock(return_value=font_path)
        theme = ThemeDefinition(
            theme_id="custom",
            name="Custom",
            author="",
            version="1.0",
            harvest_version=1,
            variables={"--hrv-color-primary": "#fff"},
            dark_variables={"--hrv-color-primary": "#000"},
            created_at="",
            custom_fonts=[{
                "family": "Inter",
                "file": "inter.woff2",
                "weight": "200 800",
                "style": "italic",
            }],
            icon_set="ph",
        )

        message = manager.build_runtime_message("custom", theme)

        assert message["type"] == "theme"
        assert message["variables"] == theme.variables
        assert message["dark_variables"] == theme.dark_variables
        assert message["icon_set"] == "ph"
        assert message["custom_fonts"] == [{
            "family": "Inter",
            "url": f"/api/harvest/themes/custom/fonts/inter.woff2?v={font_path.stat().st_mtime_ns}",
            "weight": "200 800",
            "style": "italic",
        }]

    def test_reset_message_clears_all_runtime_fields(self):
        manager = ThemeManager(MagicMock())

        assert manager.build_runtime_message("missing", None) == {
            "type": "theme",
            "variables": {},
            "dark_variables": {},
            "icon_set": None,
            "custom_fonts": [],
        }


class TestThemeImportValidation:
    @pytest.mark.asyncio
    async def test_renderer_import_requires_one_use_confirmation_even_after_global_consent(self):
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        response = MagicMock()
        view.json = MagicMock(return_value=response)
        archive = _make_theme_zip(
            {"name": "Renderer Theme", "variables": {}},
            **{"renderer.js": b"window.renderer = true;"},
        )

        result = await view.post(_make_raw_request(archive))

        assert result is response
        view.json.assert_called_once_with(
            {"error": "renderer_consent_required"},
            status_code=409,
        )
        theme_manager.create.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_renderer_import_accepts_one_use_confirmation_after_global_consent(self):
        theme = MagicMock()
        theme.theme_id = "renderer-theme"
        theme.custom_fonts = []
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock(return_value=theme)
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        renderer_manager.update_code = AsyncMock()
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        view.json = MagicMock(return_value=MagicMock())
        archive = _make_theme_zip(
            {"name": "Renderer Theme", "variables": {}},
            **{"renderer.js": b"window.renderer = true;"},
        )
        request = _make_raw_request(archive)
        request.query = {"renderer_confirmed": "true"}

        await view.post(request)

        theme_manager.create.assert_awaited_once()
        renderer_manager.update_code.assert_awaited_once_with(
            "renderer-theme",
            "window.renderer = true;",
        )

    @pytest.mark.asyncio
    async def test_renderer_import_confirmation_does_not_bypass_global_consent(self):
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = False
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        view.json = MagicMock(return_value=MagicMock())
        archive = _make_theme_zip(
            {"name": "Renderer Theme", "variables": {}},
            **{"renderer.js": b"window.renderer = true;"},
        )
        request = _make_raw_request(archive)
        request.query = {"renderer_confirmed": "true"}

        await view.post(request)

        view.json.assert_called_once_with(
            {"error": "renderer_consent_required"},
            status_code=409,
        )
        theme_manager.create.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_valid_font_is_persisted_after_archive_preflight(self):
        theme = MagicMock()
        theme.theme_id = "valid-font"
        theme.custom_fonts = []
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock(return_value=theme)
        theme_manager.save_custom_font = MagicMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        hass = MagicMock()

        async def run_executor(func, *args):
            return func(*args)

        hass.async_add_executor_job = AsyncMock(side_effect=run_executor)
        view = _make_view(
            HarvestThemeImportView,
            hass=hass,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        view.json = MagicMock(return_value=MagicMock())
        archive = _make_theme_zip(
            {
                "name": "Valid Font",
                "variables": {"--hrv-font-family": "Inter"},
                "custom_fonts": [{
                    "family": "Inter",
                    "url": "inter.woff2",
                    "weight": "200 800",
                    "style": "italic",
                }],
            },
            **{"inter.woff2": b"wOF2font-data"},
        )

        await view.post(_make_raw_request(archive))

        theme_manager.create.assert_awaited_once()
        theme_manager.save_custom_font.assert_called_once_with(
            "valid-font",
            "inter.woff2",
            b"wOF2font-data",
        )

    @pytest.mark.asyncio
    async def test_rejects_css_injection_before_persisting_theme(self):
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        archive = _make_theme_zip(
            {
                "name": "Unsafe Font",
                "variables": {"--hrv-font-family": "Unsafe"},
                "custom_fonts": [{
                    "family": "Unsafe",
                    "url": "unsafe.woff2",
                    "weight": "400",
                    "style": "normal;}body{background:red}/*",
                }],
            },
            **{"unsafe.woff2": b"wOF2font-data"},
        )

        with pytest.raises(web.HTTPBadRequest, match="font style"):
            await view.post(_make_raw_request(archive))

        theme_manager.create.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_rejects_invalid_font_before_overwriting_existing_theme(self):
        existing_theme = MagicMock()
        existing_theme.name = "Existing Theme"
        existing_theme.is_bundled = False
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = [existing_theme]
        theme_manager.update = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        archive = _make_theme_zip(
            {
                "name": "Existing Theme",
                "variables": {},
                "custom_fonts": [{
                    "family": "Fake",
                    "url": "fake.woff",
                    "weight": "400",
                    "style": "normal",
                }],
            },
            **{"fake.woff": b"not-a-font"},
        )
        request = _make_raw_request(archive)
        request.query = {"overwrite": "true"}

        with pytest.raises(web.HTTPBadRequest, match="WOFF"):
            await view.post(request)

        theme_manager.update.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_rejects_invalid_renderer_utf8_before_persisting_theme(self):
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        archive = _make_theme_zip(
            {"name": "Invalid Renderer", "variables": {}},
            **{"renderer.js": b"\xff\xfe"},
        )
        request = _make_raw_request(archive)
        request.query = {"renderer_confirmed": "true"}

        with pytest.raises(web.HTTPBadRequest, match="renderer.js"):
            await view.post(request)

        theme_manager.create.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_rejects_font_with_mismatched_binary_signature_before_persisting(self):
        theme_manager = MagicMock()
        theme_manager.get_all.return_value = []
        theme_manager.create = AsyncMock()
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        view = _make_view(
            HarvestThemeImportView,
            theme_manager=theme_manager,
            renderer_manager=renderer_manager,
        )
        archive = _make_theme_zip(
            {
                "name": "Fake Font",
                "variables": {},
                "custom_fonts": [{
                    "family": "Fake",
                    "url": "fake.woff2",
                    "weight": "400",
                    "style": "normal",
                }],
            },
            **{"fake.woff2": b"not-a-font"},
        )

        with pytest.raises(web.HTTPBadRequest, match="WOFF2"):
            await view.post(_make_raw_request(archive))

        theme_manager.create.assert_not_awaited()


class TestRendererConsentPushes:
    @staticmethod
    def _theme(*, bundled: bool = False) -> ThemeDefinition:
        return ThemeDefinition(
            theme_id="custom",
            name="Custom",
            author="",
            version="1.0",
            harvest_version=1,
            variables={},
            dark_variables={},
            created_at="",
            has_renderer=True,
            is_bundled=bundled,
        )

    @staticmethod
    def _session() -> MagicMock:
        session = MagicMock()
        session.ws.closed = False
        session.ws.send_json = AsyncMock()
        return session

    @pytest.mark.asyncio
    async def test_token_theme_change_clears_renderer_when_not_agreed(self, tmp_path):
        renderer_file = tmp_path / "custom.js"
        renderer_file.write_text("window.renderer = true;", "utf-8")
        token = _make_token(theme_url="user:custom", renderer_pack="custom")
        token_manager = MagicMock()
        token_manager.get.return_value = token
        session = self._session()
        session_manager = MagicMock()
        session_manager.get_all_for_token.return_value = [session]
        renderer_manager = MagicMock()
        renderer_manager.agreed = False
        renderer_manager.get_renderer_path.return_value = renderer_file
        view = _make_view(
            HarvestTokenDetailView,
            token_manager=token_manager,
            session_manager=session_manager,
            renderer_manager=renderer_manager,
        )

        await view._push_renderer_to_sessions(token.token_id)

        session.ws.send_json.assert_awaited_once_with(
            {"type": "renderer", "url": ""},
        )
        renderer_manager.get_renderer_path.assert_not_called()

    @pytest.mark.asyncio
    async def test_reload_all_clears_renderer_when_not_agreed(self):
        theme = self._theme(bundled=True)
        theme_manager = MagicMock()
        theme_manager.load = AsyncMock(return_value={"custom": None})
        theme_manager.get.return_value = theme
        theme_manager.build_runtime_message.return_value = {"type": "theme"}
        token = _make_token(theme_url="bundled:custom", renderer_pack="custom")
        token_manager = MagicMock()
        token_manager.get_all.return_value = [token]
        session = self._session()
        session_manager = MagicMock()
        session_manager.get_all_for_token.return_value = [session]
        renderer_manager = MagicMock()
        renderer_manager.agreed = False
        view = _make_view(
            HarvestThemeReloadView,
            theme_manager=theme_manager,
            token_manager=token_manager,
            session_manager=session_manager,
            renderer_manager=renderer_manager,
        )
        view.json = MagicMock(return_value=MagicMock())

        await view.post(_make_request())

        assert session.ws.send_json.await_args_list[-1].args[0] == {
            "type": "renderer",
            "url": "",
        }
        renderer_manager.get_renderer_path.assert_not_called()

    @pytest.mark.asyncio
    async def test_reload_one_clears_renderer_when_not_agreed(self):
        theme = self._theme()
        theme_manager = MagicMock()
        theme_manager.get.return_value = theme
        theme_manager.build_runtime_message.return_value = {"type": "theme"}
        token = _make_token(theme_url="user:custom", renderer_pack="custom")
        token_manager = MagicMock()
        token_manager.get_all.return_value = [token]
        session = self._session()
        session_manager = MagicMock()
        session_manager.get_all_for_token.return_value = [session]
        renderer_manager = MagicMock()
        renderer_manager.agreed = False
        view = _make_view(
            HarvestThemeReloadByIdView,
            theme_manager=theme_manager,
            token_manager=token_manager,
            session_manager=session_manager,
            renderer_manager=renderer_manager,
        )
        view.json = MagicMock(return_value=MagicMock())

        await view.post(_make_request(), "custom")

        assert session.ws.send_json.await_args_list[-1].args[0] == {
            "type": "renderer",
            "url": "",
        }


# ---------------------------------------------------------------------------
# View endpoint tests (mocked request + dependency methods)
# ---------------------------------------------------------------------------

class TestHarvestTokensViewGet:
    @pytest.mark.asyncio
    async def test_get_returns_token_list(self):
        tm = MagicMock()
        sm = MagicMock()
        token = _make_token()
        tm.get_all.return_value = [token]
        sm.count_for_token.return_value = 2

        view = _make_view(HarvestTokensView, token_manager=tm, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request()

        await view.get(req)

        view.json.assert_called_once()
        result = view.json.call_args.args[0]
        assert len(result) == 1
        assert result[0]["active_sessions"] == 2

    @pytest.mark.asyncio
    async def test_get_with_no_tokens(self):
        tm = MagicMock()
        sm = MagicMock()
        tm.get_all.return_value = []
        view = _make_view(HarvestTokensView, token_manager=tm, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request())
        result = view.json.call_args.args[0]
        assert result == []


class TestHarvestTokensViewPost:
    @pytest.mark.asyncio
    async def test_post_no_user_raises_401(self):
        from aiohttp import web
        view = _make_view(HarvestTokensView)
        req = _make_request(user=None)
        with pytest.raises(web.HTTPUnauthorized):
            await view.post(req)

    @pytest.mark.asyncio
    async def test_post_invalid_json_raises_400(self):
        from aiohttp import web
        view = _make_view(HarvestTokensView)
        req = MagicMock()
        req.get = MagicMock(return_value=MagicMock())  # valid user
        req.json = AsyncMock(side_effect=Exception("bad json"))
        with pytest.raises(web.HTTPBadRequest):
            await view.post(req)

    @pytest.mark.asyncio
    async def test_post_creates_token(self):
        from aiohttp import web
        tm = MagicMock()
        token = _make_token()
        tm.create = AsyncMock(return_value=token)
        view = _make_view(HarvestTokensView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock(status=201))

        user = MagicMock(id="admin")
        req = _make_request(body={"label": "My Token", "entities": [], "origins": {}}, user=user)
        req.get = MagicMock(return_value=user)

        await view.post(req)
        tm.create.assert_called_once()


class TestHarvestTokenDetailViewGet:
    @pytest.mark.asyncio
    async def test_get_existing_token(self):
        from aiohttp import web
        tm = MagicMock()
        sm = MagicMock()
        token = _make_token()
        tm.get.return_value = token
        sm.count_for_token.return_value = 1
        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(), "hwt_test123")
        view.json.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_missing_token_raises_404(self):
        from aiohttp import web
        tm = MagicMock()
        tm.get.return_value = None
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        with pytest.raises(web.HTTPNotFound):
            await view.get(_make_request(), "missing_id")


class TestHarvestTokenDetailViewDelete:
    @pytest.mark.asyncio
    async def test_delete_revoke_action(self):
        from aiohttp import web
        tm = MagicMock()
        sm = MagicMock()
        token = _make_token(revoked_at=datetime(2024, 6, 1, tzinfo=timezone.utc))
        tm.revoke = AsyncMock(return_value=token)
        sm.terminate_all_for_token.return_value = []
        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(query={"action": "revoke"})

        await view.delete(req, "hwt_test123")
        tm.revoke.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_permanent_returns_204(self):
        from aiohttp import web
        tm = MagicMock()
        sm = MagicMock()
        tm.delete = AsyncMock()
        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)
        req = _make_request(query={})

        resp = await view.delete(req, "hwt_test123")
        tm.delete.assert_called_once_with("hwt_test123")
        assert resp.status == 204

    @pytest.mark.asyncio
    async def test_delete_missing_token_raises_404(self):
        from aiohttp import web
        tm = MagicMock()
        sm = MagicMock()
        tm.delete = AsyncMock(side_effect=KeyError("not found"))
        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)
        req = _make_request(query={})
        with pytest.raises(web.HTTPNotFound):
            await view.delete(req, "missing")

    @pytest.mark.asyncio
    async def test_delete_active_token_raises_400(self):
        from aiohttp import web
        tm = MagicMock()
        sm = MagicMock()
        tm.delete = AsyncMock(side_effect=ValueError("Cannot delete active token"))
        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)
        req = _make_request(query={})
        with pytest.raises(web.HTTPBadRequest):
            await view.delete(req, "hwt_active")


class TestHarvestSessionsViewGet:
    @pytest.mark.asyncio
    async def test_get_all_sessions(self):
        sm = MagicMock()
        sm.get_all.return_value = [_make_session()]
        view = _make_view(HarvestSessionsView, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={}))
        view.json.assert_called_once()
        result = view.json.call_args.args[0]
        assert len(result) == 1

    @pytest.mark.asyncio
    async def test_get_sessions_filtered_by_token(self):
        sm = MagicMock()
        sm.get_all_for_token.return_value = [_make_session()]
        view = _make_view(HarvestSessionsView, session_manager=sm)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={"token_id": "hwt_abc"}))
        sm.get_all_for_token.assert_called_once_with("hwt_abc")


class TestHarvestActivityViewGet:
    @pytest.mark.asyncio
    async def test_get_activity_default_params(self):
        store = MagicMock()
        store.query_activity = AsyncMock(return_value=([], 0))
        view = _make_view(HarvestActivityView, activity_store=store)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={}))
        store.query_activity.assert_called_once()
        # Verify response includes total and limit keys
        result = view.json.call_args.args[0]
        assert "total" in result
        assert result["limit"] == 50
        assert result["offset"] == 0

    @pytest.mark.asyncio
    async def test_get_activity_with_filters(self):
        store = MagicMock()
        store.query_activity = AsyncMock(return_value=([{"type": "auth"}], 1))
        view = _make_view(HarvestActivityView, activity_store=store)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={
            "token_id": "hwt_x",
            "event_type": "COMMAND",
            "limit": "10",
            "offset": "5",
        }))
        call_kwargs = store.query_activity.call_args.kwargs
        assert call_kwargs["token_id"] == "hwt_x"
        assert call_kwargs["display_type_filter"] == "COMMAND"
        assert call_kwargs["limit"] == 10
        assert call_kwargs["offset"] == 5


class TestHarvestConfigViewGet:
    @pytest.mark.asyncio
    async def test_get_no_entries_returns_empty(self):
        hass = MagicMock()
        hass.config_entries.async_entries.return_value = []
        view = _make_view(HarvestConfigView, hass=hass)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request())
        result = view.json.call_args.args[0]
        assert result == {}

    @pytest.mark.asyncio
    async def test_get_returns_normalized_data_options(self):
        hass = MagicMock()
        entry = MagicMock()
        entry.data = {"auth_timeout_seconds": 15, "unknown": "ignored"}
        entry.options = {"activity_log_retention_days": 90}
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request())
        result = view.json.call_args.args[0]
        assert result["auth_timeout_seconds"] == 15
        assert result["activity_log_retention_days"] == 90
        assert "unknown" not in result
        assert result["entity_hard_cap"] == 250

    @pytest.mark.asyncio
    async def test_patch_no_entries_raises_404(self):
        from aiohttp import web
        hass = MagicMock()
        hass.config_entries.async_entries.return_value = []
        view = _make_view(HarvestConfigView, hass=hass)
        with pytest.raises(web.HTTPNotFound):
            await view.patch(_make_request())

    @pytest.mark.asyncio
    async def test_patch_updates_entry(self):
        hass = MagicMock()
        entry = MagicMock()
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"auth_timeout_seconds": 15})
        await view.patch(req)
        hass.config_entries.async_update_entry.assert_called_once()
        result = view.json.call_args.args[0]
        assert result["entity_hard_cap"] == 250

    @pytest.mark.asyncio
    async def test_patch_rejects_read_only_entity_hard_cap(self):
        from aiohttp import web
        hass = MagicMock()
        entry = MagicMock()
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)
        with pytest.raises(web.HTTPBadRequest):
            await view.patch(_make_request(body={"entity_hard_cap": 100}))

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "trusted_proxies",
        [
            "10.0.0.1",
            [123],
            [""],
            ["not-an-ip"],
            ["10.0.0.1", "10.0.0.1"],
            ["10.0.0.7/8", "10.0.0.8/8"],
        ],
    )
    async def test_patch_rejects_invalid_trusted_proxies(self, trusted_proxies):
        from aiohttp import web

        hass = MagicMock()
        entry = MagicMock()
        entry.data = {}
        entry.options = {}
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)

        with pytest.raises(web.HTTPBadRequest):
            await view.patch(_make_request(body={"trusted_proxies": trusted_proxies}))

        hass.config_entries.async_update_entry.assert_not_called()

    @pytest.mark.asyncio
    async def test_patch_normalizes_trusted_proxies(self):
        hass = MagicMock()
        hass.states.async_all.return_value = []
        hass.services.async_services.return_value = {}
        entry = MagicMock()
        entry.data = {}
        entry.options = {}
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)
        view.json = MagicMock(return_value=MagicMock())

        await view.patch(_make_request(body={
            "trusted_proxies": [" 10.0.0.7/8 ", "2001:0db8::1"],
        }))

        updated = hass.config_entries.async_update_entry.call_args.kwargs["options"]
        assert updated["trusted_proxies"] == ["10.0.0.0/8", "2001:db8::1"]

    @pytest.mark.asyncio
    async def test_patch_waits_for_external_port_before_persisting(self):
        hass = MagicMock()
        hass.config.api.port = 8123
        hass.states.async_all.return_value = []
        hass.services.async_services.return_value = {}
        entry = MagicMock()
        entry.data = {}
        entry.options = {"external_port": 9050}
        hass.config_entries.async_entries.return_value = [entry]
        secondary_server = MagicMock()
        secondary_server.port = 9050
        secondary_server.reconfigure = AsyncMock()
        view = _make_view(HarvestConfigView, hass=hass, secondary_server=secondary_server)
        view.json = MagicMock(return_value=MagicMock())

        with patch(
            "custom_components.harvest.secondary_server.validate_external_port",
            return_value=None,
        ):
            await view.patch(_make_request(body={"external_port": 9051}))

        secondary_server.reconfigure.assert_awaited_once_with(9051)
        hass.config_entries.async_update_entry.assert_called_once()

    @pytest.mark.asyncio
    async def test_patch_does_not_persist_failed_external_port(self):
        from aiohttp import web

        hass = MagicMock()
        hass.config.api.port = 8123
        entry = MagicMock()
        entry.data = {}
        entry.options = {"external_port": 9050}
        hass.config_entries.async_entries.return_value = [entry]
        secondary_server = MagicMock()
        secondary_server.port = 9050
        secondary_server.reconfigure = AsyncMock(side_effect=OSError("bind failed"))
        view = _make_view(HarvestConfigView, hass=hass, secondary_server=secondary_server)

        with (
            patch(
                "custom_components.harvest.secondary_server.validate_external_port",
                return_value=None,
            ),
            pytest.raises(web.HTTPBadRequest, match="Unable to start alternate-port"),
        ):
            await view.patch(_make_request(body={"external_port": 9051}))

        hass.config_entries.async_update_entry.assert_not_called()

    @pytest.mark.asyncio
    async def test_patch_same_external_port_skips_trial_bind_and_reconfigure(self):
        hass = MagicMock()
        hass.states.async_all.return_value = []
        hass.services.async_services.return_value = {}
        entry = MagicMock()
        entry.data = {}
        entry.options = {"external_port": 9050}
        hass.config_entries.async_entries.return_value = [entry]
        secondary_server = MagicMock()
        secondary_server.port = 9050
        secondary_server.reconfigure = AsyncMock()
        view = _make_view(HarvestConfigView, hass=hass, secondary_server=secondary_server)
        view.json = MagicMock(return_value=MagicMock())

        with patch("custom_components.harvest.secondary_server.validate_external_port") as validate:
            await view.patch(_make_request(body={"external_port": 9050}))

        validate.assert_not_called()
        secondary_server.reconfigure.assert_awaited_once_with(9050)


class TestHarvestServiceFieldsView:
    @pytest.mark.asyncio
    async def test_custom_domain_hides_target_selector_fields(self):
        view = _make_view(HarvestServiceFieldsView)
        view.json = MagicMock(return_value=MagicMock())
        descriptions = {
            "vacuum": {
                "start": {
                    "fields": {
                        "fan_speed": {"selector": {"text": {}}},
                        "entity_id": {"selector": {"entity": {}}},
                        "device_id": {"selector": {"device": {}}},
                        "area_id": {"selector": {"area": {}}},
                        "floor_id": {"selector": {"floor": {}}},
                        "label_id": {"selector": {"label": {}}},
                    },
                },
            },
        }

        with (
            patch(
                "custom_components.harvest.http_views.get_entry_data",
                return_value={
                    "custom_domains": [
                        {"domain": "vacuum", "allowed_services": ["start"]},
                    ],
                },
            ),
            patch(
                "homeassistant.helpers.service.async_get_all_descriptions",
                AsyncMock(return_value=descriptions),
            ),
        ):
            await view.get(_make_request(), "vacuum", "start")

        fields = view.json.call_args.args[0]["fields"]
        assert fields == {"fan_speed": {"selector": {"text": {}}}}


class TestHarvestStatsViewGet:
    @pytest.mark.asyncio
    async def test_get_returns_stats(self):
        sensors = MagicMock()
        store = MagicMock()
        store.count_today = AsyncMock(return_value={"commands": 42, "auth_fail": 0})
        store.get_db_size_bytes = AsyncMock(return_value=1024)
        sm = MagicMock()
        sm.count_active.return_value = 3
        tm = MagicMock()
        tm.get_active.return_value = []
        view = _make_view(HarvestStatsView, sensors=sensors, activity_store=store, session_manager=sm, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request())
        result = view.json.call_args.args[0]
        assert result["active_sessions"] == 3
        assert result["commands_today"] == 42
        assert result["db_size_bytes"] == 1024


class TestHarvestAliasViewPost:
    @pytest.mark.asyncio
    async def test_post_returns_alias(self):
        tm = MagicMock()
        tm.generate_alias.return_value = "aBcDeFgH"
        view = _make_view(HarvestAliasView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        await view.post(_make_request())
        result = view.json.call_args.args[0]
        assert result["alias"] == "aBcDeFgH"


class TestHarvestPreviewTokenViewPost:
    @pytest.mark.asyncio
    async def test_post_no_user_raises_403(self):
        from aiohttp import web
        view = _make_view(HarvestPreviewTokenView)
        req = _make_request(user=None)
        with pytest.raises(web.HTTPForbidden):
            await view.post(req)

    @pytest.mark.asyncio
    async def test_post_missing_entity_id_raises_400(self):
        from aiohttp import web
        view = _make_view(HarvestPreviewTokenView)
        user = MagicMock(id="admin")
        req = _make_request(body={})  # missing entity_id
        req.get = MagicMock(return_value=user)
        with pytest.raises(web.HTTPBadRequest):
            await view.post(req)

    @pytest.mark.asyncio
    async def test_post_creates_preview_token(self):
        tm = MagicMock()
        token = _make_token(expires=datetime(2024, 1, 1, 0, 5, tzinfo=timezone.utc))
        tm.create_preview = AsyncMock(return_value=token)
        view = _make_view(HarvestPreviewTokenView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock(status=201))

        user = MagicMock(id="admin")
        req = _make_request(body={"entity_id": "light.test", "capabilities": "read"})
        req.get = MagicMock(return_value=user)

        await view.post(req)
        tm.create_preview.assert_called_once_with(
            entity_id="light.test",
            capabilities="read",
            created_by="admin",
        )


class TestHarvestAggregatesViewGet:
    @pytest.mark.asyncio
    async def test_get_aggregates_default_hours(self):
        store = MagicMock()
        store.query_aggregates = AsyncMock(return_value={"hours": []})
        view = _make_view(HarvestAggregatesView, activity_store=store)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={}))
        call_kwargs = store.query_aggregates.call_args.kwargs
        assert call_kwargs["hours"] == 24

    @pytest.mark.asyncio
    async def test_get_aggregates_custom_hours(self):
        store = MagicMock()
        store.query_aggregates = AsyncMock(return_value={"hours": []})
        view = _make_view(HarvestAggregatesView, activity_store=store)
        view.json = MagicMock(return_value=MagicMock())
        await view.get(_make_request(query={"hours": "48"}))
        call_kwargs = store.query_aggregates.call_args.kwargs
        assert call_kwargs["hours"] == 48


# ---------------------------------------------------------------------------
# HarvestTokenDetailView PATCH (previously uncovered)
# ---------------------------------------------------------------------------

class TestHarvestTokenDetailViewPatch:
    @pytest.mark.asyncio
    async def test_patch_missing_token_raises_404(self):
        from aiohttp import web
        tm = MagicMock()
        tm.get.return_value = None
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        with pytest.raises(web.HTTPNotFound):
            await view.patch(_make_request(), "missing_id")

    @pytest.mark.asyncio
    async def test_patch_invalid_json_raises_400(self):
        from aiohttp import web
        tm = MagicMock()
        tm.get.return_value = _make_token()
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        req = MagicMock()
        req.json = AsyncMock(side_effect=Exception("bad json"))
        with pytest.raises(web.HTTPBadRequest):
            await view.patch(req, "hwt_test123")

    @pytest.mark.asyncio
    async def test_patch_updates_label(self):
        tm = MagicMock()
        original = _make_token()
        updated = _make_token(label="New Label")
        tm.get.return_value = original
        tm.update = AsyncMock(return_value=updated)
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"label": "New Label"})
        await view.patch(req, "hwt_test123")
        call_kwargs = tm.update.call_args
        assert call_kwargs.args[1]["label"] == "New Label"

    @pytest.mark.asyncio
    async def test_patch_updates_origins(self):
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(return_value=_make_token())
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"origins": {"allow_any": True}})
        await view.patch(req, "hwt_test123")
        updates = tm.update.call_args.args[1]
        assert updates["origins"].allow_any is True

    @pytest.mark.asyncio
    async def test_patch_update_raises_bad_request_on_value_error(self):
        from aiohttp import web
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(side_effect=ValueError("bad value"))
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        req = _make_request(body={"label": "x"})
        with pytest.raises(web.HTTPBadRequest):
            await view.patch(req, "hwt_test123")

    @pytest.mark.asyncio
    async def test_patch_updates_max_sessions(self):
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(return_value=_make_token())
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"max_sessions": 5})
        await view.patch(req, "hwt_test123")
        updates = tm.update.call_args.args[1]
        assert updates["max_sessions"] == 5

    @pytest.mark.asyncio
    async def test_patch_updates_allowed_ips(self):
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(return_value=_make_token())
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"allowed_ips": ["1.2.3.4"]})
        await view.patch(req, "hwt_test123")
        updates = tm.update.call_args.args[1]
        assert updates["allowed_ips"] == ["1.2.3.4"]

    @pytest.mark.asyncio
    async def test_patch_updates_entities(self):
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(return_value=_make_token())
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        req = _make_request(body={"entities": [{"entity_id": "light.x"}]})
        await view.patch(req, "hwt_test123")
        updates = tm.update.call_args.args[1]
        assert len(updates["entities"]) == 1

    @pytest.mark.asyncio
    async def test_patch_updates_active_schedule(self):
        tm = MagicMock()
        tm.get.return_value = _make_token()
        tm.update = AsyncMock(return_value=_make_token())
        view = _make_view(HarvestTokenDetailView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock())
        schedule_body = {"timezone": "UTC", "windows": [{"days": ["mon"], "start": "09:00", "end": "17:00"}]}
        req = _make_request(body={"active_schedule": schedule_body})
        await view.patch(req, "hwt_test123")
        updates = tm.update.call_args.args[1]
        assert updates["active_schedule"].timezone == "UTC"


# ---------------------------------------------------------------------------
# HarvestActivityExportView (previously uncovered)
# ---------------------------------------------------------------------------

class TestHarvestActivityExportView:
    @pytest.mark.asyncio
    async def test_get_returns_csv_response(self):
        store = MagicMock()
        store.export_csv = AsyncMock(return_value=b"ts,type\n2024-01-01,auth\n")
        view = _make_view(HarvestActivityExportView, activity_store=store)
        resp = await view.get(_make_request(query={}))
        assert resp.content_type == "text/csv"
        assert b"auth" in resp.body

    @pytest.mark.asyncio
    async def test_get_passes_token_filter(self):
        store = MagicMock()
        store.export_csv = AsyncMock(return_value=b"")
        view = _make_view(HarvestActivityExportView, activity_store=store)
        await view.get(_make_request(query={"token_id": "hwt_x"}))
        assert store.export_csv.call_args.kwargs["token_id"] == "hwt_x"

    @pytest.mark.asyncio
    async def test_get_passes_event_types_filter(self):
        store = MagicMock()
        store.export_csv = AsyncMock(return_value=b"")
        view = _make_view(HarvestActivityExportView, activity_store=store)
        await view.get(_make_request(query={"event_type": "COMMAND"}))
        assert store.export_csv.call_args.kwargs["display_type_filter"] == "COMMAND"

    @pytest.mark.asyncio
    async def test_get_content_disposition_header(self):
        store = MagicMock()
        store.export_csv = AsyncMock(return_value=b"")
        view = _make_view(HarvestActivityExportView, activity_store=store)
        resp = await view.get(_make_request(query={}))
        assert "harvest_activity.csv" in resp.headers.get("Content-Disposition", "")


# ---------------------------------------------------------------------------
# Error paths in HarvestTokensView.post() (previously uncovered lines 201-219)
# ---------------------------------------------------------------------------

class TestHarvestTokensViewPostErrors:
    @pytest.mark.asyncio
    async def test_post_entity_parse_error_raises_400(self):
        from aiohttp import web
        tm = MagicMock()
        view = _make_view(HarvestTokensView, token_manager=tm)
        user = MagicMock(id="admin")
        # Malformed entities list — entity_id key missing will raise KeyError
        req = _make_request(body={"entities": [{"capabilities": "read"}]})  # no entity_id
        req.get = MagicMock(return_value=user)
        with pytest.raises(web.HTTPBadRequest):
            await view.post(req)

    @pytest.mark.asyncio
    async def test_post_token_create_value_error_raises_400(self):
        from aiohttp import web
        tm = MagicMock()
        tm.create = AsyncMock(side_effect=ValueError("duplicate label"))
        view = _make_view(HarvestTokensView, token_manager=tm)
        user = MagicMock(id="admin")
        req = _make_request(body={"label": "Test", "entities": [], "origins": {}})
        req.get = MagicMock(return_value=user)
        with pytest.raises(web.HTTPBadRequest):
            await view.post(req)


# ---------------------------------------------------------------------------
# HarvestConfigView PATCH invalid JSON (previously uncovered)
# ---------------------------------------------------------------------------

class TestHarvestConfigViewPatchErrors:
    @pytest.mark.asyncio
    async def test_patch_invalid_json_raises_400(self):
        from aiohttp import web
        hass = MagicMock()
        entry = MagicMock()
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)
        req = MagicMock()
        req.json = AsyncMock(side_effect=Exception("bad json"))
        with pytest.raises(web.HTTPBadRequest):
            await view.patch(req)

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "body",
        [
            [],
            {"unknown": True},
            {"kill_switch": "false"},
            {"auth_timeout_seconds": 0},
            {"default_session": {"lifetime_minutes": "60"}},
            {"ha_event_bus": {"harvest_token_revoked": "yes"}},
            {"sensitive_domains": {"lock": "yes"}},
        ],
    )
    async def test_patch_rejects_invalid_global_config(self, body):
        from aiohttp import web

        hass = MagicMock()
        entry = MagicMock()
        entry.data = {}
        entry.options = {}
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)

        with pytest.raises(web.HTTPBadRequest):
            await view.patch(_make_request(body=body))

        hass.config_entries.async_update_entry.assert_not_called()

    @pytest.mark.asyncio
    async def test_patch_rejects_invalid_effective_nested_config(self):
        from aiohttp import web

        hass = MagicMock()
        entry = MagicMock()
        entry.data = {}
        entry.options = {
            "default_session": {
                "lifetime_minutes": 120,
                "max_lifetime_minutes": 240,
            },
        }
        hass.config_entries.async_entries.return_value = [entry]
        view = _make_view(HarvestConfigView, hass=hass)

        with pytest.raises(web.HTTPBadRequest):
            await view.patch(_make_request(body={
                "default_session": {"max_lifetime_minutes": 60},
            }))

        hass.config_entries.async_update_entry.assert_not_called()


# ---------------------------------------------------------------------------
# _validate_display_text
#
# offline_text and error_text are user-supplied display strings shown to
# widget visitors. The widget renders them via .textContent (XSS-safe), so
# this server-side validator only blocks length overflow and control
# characters that would corrupt logs / screen readers / copy-paste.
# Earlier revisions blocked HTML punctuation and SQL keywords here, which
# was theatre that broke legitimate English without addressing a real
# threat at this layer.
# ---------------------------------------------------------------------------

class TestValidateDisplayText:
    def test_plain_text_passes(self):
        assert _validate_display_text("Server unreachable.", "offline_text") == "Server unreachable."

    def test_apostrophe_passes(self):
        # Earlier filter blocked apostrophes; legitimate English now allowed.
        assert _validate_display_text("It's offline", "offline_text") == "It's offline"

    def test_double_quote_passes(self):
        assert _validate_display_text('Say "hello"', "error_text") == 'Say "hello"'

    def test_angle_brackets_pass(self):
        assert _validate_display_text("Power < 50%", "offline_text") == "Power < 50%"

    def test_semicolon_and_backslash_pass(self):
        assert _validate_display_text("Try again later;", "offline_text") == "Try again later;"
        assert _validate_display_text("Path C:\\Users", "error_text") == "Path C:\\Users"

    def test_sql_keywords_in_normal_english_pass(self):
        # "Light up the SELECT TV" was blocked by the old SQL-keyword regex.
        assert _validate_display_text("Light up the SELECT TV", "offline_text") == "Light up the SELECT TV"
        assert _validate_display_text("Insert coin", "offline_text") == "Insert coin"
        assert _validate_display_text("Delete cache", "error_text") == "Delete cache"

    def test_unicode_passes(self):
        assert _validate_display_text("Sätze über Geräte", "offline_text") == "Sätze über Geräte"
        assert _validate_display_text("離線", "offline_text") == "離線"

    def test_whitespace_chars_pass(self):
        # Tab, newline, carriage return are allowed.
        assert _validate_display_text("a\tb", "offline_text") == "a\tb"
        assert _validate_display_text("line1\nline2", "offline_text") == "line1\nline2"

    def test_empty_string_passes(self):
        assert _validate_display_text("", "offline_text") == ""

    def test_strips_outer_whitespace(self):
        assert _validate_display_text("  trimmed  ", "offline_text") == "trimmed"

    def test_none_yields_empty(self):
        assert _validate_display_text(None, "offline_text") == ""

    def test_length_overflow_rejected(self):
        from aiohttp import web
        with pytest.raises(web.HTTPBadRequest):
            _validate_display_text("x" * 201, "offline_text")

    def test_max_length_accepted(self):
        assert _validate_display_text("x" * 200, "offline_text") == "x" * 200

    def test_nul_char_rejected(self):
        from aiohttp import web
        with pytest.raises(web.HTTPBadRequest):
            _validate_display_text("hello\x00world", "offline_text")

    def test_bell_char_rejected(self):
        from aiohttp import web
        with pytest.raises(web.HTTPBadRequest):
            _validate_display_text("alert\x07", "offline_text")

    def test_del_char_rejected(self):
        from aiohttp import web
        with pytest.raises(web.HTTPBadRequest):
            _validate_display_text("strange\x7f", "offline_text")

    def test_form_feed_rejected(self):
        from aiohttp import web
        with pytest.raises(web.HTTPBadRequest):
            _validate_display_text("page\x0cbreak", "offline_text")


# ---------------------------------------------------------------------------
# HarvestTokenDuplicateView
# ---------------------------------------------------------------------------

class TestHarvestTokenDuplicateView:
    @pytest.mark.asyncio
    async def test_duplicate_no_user_raises_401(self):
        from aiohttp import web
        view = _make_view(HarvestTokenDuplicateView)
        req = _make_request(user=None)
        with pytest.raises(web.HTTPUnauthorized):
            await view.post(req, "hwt_test123")

    @pytest.mark.asyncio
    async def test_duplicate_non_admin_raises_403(self):
        from aiohttp import web
        user = MagicMock()
        user.is_admin = False
        view = _make_view(HarvestTokenDuplicateView)
        req = _make_request(user=user)
        with pytest.raises(web.HTTPForbidden):
            await view.post(req, "hwt_test123")

    @pytest.mark.asyncio
    async def test_duplicate_missing_token_raises_404(self):
        from aiohttp import web
        tm = MagicMock()
        tm.get.return_value = None
        view = _make_view(HarvestTokenDuplicateView, token_manager=tm)
        with pytest.raises(web.HTTPNotFound):
            await view.post(_make_request(), "hwt_missing")

    @pytest.mark.asyncio
    async def test_duplicate_creates_copy(self):
        source = _make_token(
            label="My Widget",
            entities=[
                EntityAccess(entity_id="light.bed", capabilities="read-write", alias="abcd1234"),
            ],
            theme_url="/api/harvest/themes/glass",
            embed_mode="group",
            entities_block=True,
        )
        new_token = _make_token(token_id="hwt_newcopy456", label="My Widget(1)")
        tm = MagicMock()
        tm.get.return_value = source
        tm.get_all.return_value = [source]
        tm.create = AsyncMock(return_value=new_token)
        tm.update = AsyncMock(return_value=new_token)
        tm.generate_alias.return_value = "newAlias1"
        view = _make_view(HarvestTokenDuplicateView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock(status=201))

        user = MagicMock(id="admin")
        req = _make_request(user=user)
        req.get = MagicMock(return_value=user)

        await view.post(req, "hwt_test123")
        tm.create.assert_called_once()
        call_kwargs = tm.create.call_args
        assert call_kwargs.kwargs["label"] == "My Widget(1)"
        assert call_kwargs.kwargs["embed_mode"] == "group"
        assert call_kwargs.kwargs["entities_block"] is True
        assert call_kwargs.kwargs["theme_url"] == "/api/harvest/themes/glass"
        assert call_kwargs.kwargs["entities"][0].alias == "newAlias1"
        assert call_kwargs.kwargs["expires"] is None
        assert call_kwargs.kwargs["token_secret"] is None

    @pytest.mark.asyncio
    async def test_duplicate_deduplicates_label(self):
        source = _make_token(label="Widget")
        existing_copy = _make_token(token_id="hwt_existing", label="Widget(1)")
        tm = MagicMock()
        tm.get.return_value = source
        tm.get_all.return_value = [source, existing_copy]
        new_token = _make_token(token_id="hwt_new", label="Widget(2)")
        tm.create = AsyncMock(return_value=new_token)
        tm.update = AsyncMock(return_value=new_token)
        view = _make_view(HarvestTokenDuplicateView, token_manager=tm)
        view.json = MagicMock(return_value=MagicMock(status=201))

        user = MagicMock(id="admin")
        req = _make_request(user=user)
        req.get = MagicMock(return_value=user)

        await view.post(req, "hwt_test123")
        call_kwargs = tm.create.call_args
        assert call_kwargs.kwargs["label"] == "Widget(2)"


# ---------------------------------------------------------------------------
# Lovelace views - admin guard (converter wizard is admin-only)
# ---------------------------------------------------------------------------

class TestLovelaceViewsAdminGuard:
    @pytest.mark.asyncio
    async def test_dashboards_rejects_non_admin(self):
        from aiohttp import web
        view = _make_view(HarvestLovelaceDashboardsView)
        non_admin = MagicMock()
        non_admin.is_admin = False
        with pytest.raises(web.HTTPForbidden):
            await view.get(_make_request(user=non_admin))

    @pytest.mark.asyncio
    async def test_dashboards_rejects_anonymous(self):
        from aiohttp import web
        view = _make_view(HarvestLovelaceDashboardsView)
        with pytest.raises(web.HTTPForbidden):
            await view.get(_make_request(user=None))

    @pytest.mark.asyncio
    async def test_config_rejects_non_admin(self):
        from aiohttp import web
        view = _make_view(HarvestLovelaceConfigView)
        non_admin = MagicMock()
        non_admin.is_admin = False
        with pytest.raises(web.HTTPForbidden):
            await view.get(_make_request(user=non_admin, query={"url_path": "lovelace"}))

    @pytest.mark.asyncio
    async def test_config_rejects_anonymous(self):
        from aiohttp import web
        view = _make_view(HarvestLovelaceConfigView)
        with pytest.raises(web.HTTPForbidden):
            await view.get(_make_request(user=None, query={"url_path": "lovelace"}))


# ---------------------------------------------------------------------------
# Edit-push attribute filtering - must match the live ws_proxy path
# ---------------------------------------------------------------------------

class TestFilteredPushAttrs:
    """Regression: a panel edit-triggered state_update push must filter
    attributes exactly like the live path. The full tier applies the token
    denylist + per-entity exclude_attributes AND the global blocklist; the
    reduced tiers use their allowlist.
    """

    def test_full_tier_strips_denylist_exclude_and_global(self):
        from custom_components.harvest.token_manager import TokenManager
        ea = EntityAccess(
            entity_id="sensor.power",
            capabilities="read-write",
            exclude_attributes=["internal_note"],
        )
        token = _make_token(entities=[ea])
        real_tm = TokenManager(MagicMock(), {})
        view = _make_view(HarvestTokenDetailView, token_manager=real_tm)
        attrs = {
            "brightness": 200,         # benign - survives
            "api_key": "leak",         # denylist substring - stripped
            "internal_note": "leak",   # per-entity exclude - stripped
            "supported_features": 7,   # global BLOCKED_ATTRIBUTES - stripped
        }
        out = view._filtered_push_attrs("sensor.power", "full", token, attrs)
        assert out == {"brightness": 200}

    def test_display_tier_uses_allowlist(self):
        ea = EntityAccess(entity_id="sensor.power", capabilities="read")
        token = _make_token(entities=[ea])
        view = _make_view(HarvestTokenDetailView)
        attrs = {"unit_of_measurement": "W", "random": "x"}
        out = view._filtered_push_attrs("sensor.power", "display", token, attrs)
        assert out == {"unit_of_measurement": "W"}

    @pytest.mark.asyncio
    async def test_companion_push_includes_last_updated_and_initial(self):
        """A newly-subscribed companion's state_update must carry last_updated
        and initial so the client's ordering key is a valid Date, matching the
        primary-branch push and the live ws_proxy path.
        """
        primary = EntityAccess(entity_id="light.lamp", capabilities="read-write")
        companion = EntityAccess(
            entity_id="sensor.lamp_power", capabilities="read", companion_of="light.lamp",
        )
        token = _make_token(entities=[primary, companion])

        tm = MagicMock()
        tm.get.return_value = token
        tm.filter_attributes = MagicMock(return_value={"w": 5})

        # Session has the primary subscribed but not yet the companion.
        session = _make_session(
            subscribed_entity_ids={"light.lamp"},
            outgoing_ids={"light.lamp": "light.lamp"},
        )
        session.ws.closed = False
        session.ws.send_json = AsyncMock()
        sm = MagicMock()
        sm.get_all_for_token.return_value = [session]

        view = _make_view(HarvestTokenDetailView, token_manager=tm, session_manager=sm)

        comp_state = MagicMock()
        comp_state.state = "5"
        comp_state.attributes = {"w": 5}
        comp_state.last_updated = datetime(2024, 6, 1, 12, 0, tzinfo=timezone.utc)

        def _states_get(eid):
            return comp_state if eid == "sensor.lamp_power" else None
        view._hass.states.get = MagicMock(side_effect=_states_get)

        with patch(
            "custom_components.harvest.http_views.build_entity_definition",
            return_value={"entity_id": "light.lamp", "domain": "light"},
        ):
            # Restrict the primary push to nothing so only companion reconciliation
            # runs; companions are still subscribed and their state pushed.
            await view._push_entity_definitions_to_sessions("hwt_test123")

        sm.add_subscription.assert_called_once()
        comp_updates = [
            c.args[0] for c in session.ws.send_json.call_args_list
            if c.args[0].get("type") == "state_update"
            and c.args[0].get("entity_id") == "sensor.lamp_power"
        ]
        assert comp_updates, "expected a companion state_update"
        assert comp_updates[0]["last_updated"] == "2024-06-01T12:00:00+00:00"
        assert comp_updates[0]["initial"] is True
