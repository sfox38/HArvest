# HArvest Integration - Internal Python API

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

This document defines the internal Python module interface for the HArvest HACS custom integration. It covers class definitions, method signatures with type hints, and implementation notes for complex modules. It does not cover the HTTP API between the panel JS and the integration - that API is internal to the bundled panel and intentionally not a public protocol. Third-party conformance requirements apply to the WebSocket protocol defined in SPEC.md, not to the panel HTTP API.

All modules live under `custom_components/harvest/`. The integration runs inside HA Core's async event loop. Methods are left as plain `def` or `async def` at the implementation's discretion unless a specific async requirement is noted.

---

## Table of Contents

1. [const.py](#constpy)
2. [token_manager.py](#token_managerpy)
3. [session_manager.py](#session_managerpy)
4. [entity_compatibility.py](#entity_compatibilitypy)
5. [entity_definition.py](#entity_definitionpy)
6. [harvest_action.py](#harvest_actionpy)
7. [rate_limiter.py](#rate_limiterpy)
8. [ws_proxy.py](#ws_proxypy)
9. [http_views.py](#http_viewspy)
10. [activity_store.py](#activity_storepy)
11. [event_bus.py](#event_buspy)
12. [diagnostic_sensors.py](#diagnostic_sensorspy)
13. [panel.py](#panelpy)
14. [__init__.py](#initpy)
15. [Module Dependency Graph](#module-dependency-graph)

---

## const.py

Simple constants module. No classes, no functions. All other modules import from here.

```python
from __future__ import annotations

DOMAIN = "harvest"
PLATFORM_VERSION = "1.6.3"              # must match SPEC.md version header

# Token and session ID format
TOKEN_PREFIX = "hwt_"
SESSION_PREFIX = "hrs_"
TOKEN_ID_LENGTH = 22        # base62 characters after prefix
SESSION_ID_LENGTH = 22      # base62 characters after prefix
ALIAS_LENGTH = 8            # base62 characters for entity aliases
BASE62_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

# WebSocket endpoint path registered with HA's HTTP server
WS_PATH = "/api/harvest/ws"

# Panel UI path
PANEL_PATH = "harvest"

# SQLite activity store filename
ACTIVITY_DB_FILENAME = "harvest_activity.db"

# Global config option keys (stored in HA's config entry data)
CONF_AUTH_TIMEOUT = "auth_timeout_seconds"
CONF_MAX_ENTITIES_PER_TOKEN = "max_entities_per_token"
CONF_MAX_ENTITIES_HARD_CAP = "max_entities_hard_cap"
CONF_MAX_INBOUND_BYTES = "max_inbound_message_bytes"
CONF_KEEPALIVE_INTERVAL = "keepalive_interval_seconds"
CONF_KEEPALIVE_TIMEOUT = "keepalive_timeout_seconds"
CONF_HEARTBEAT_TIMEOUT = "heartbeat_timeout_seconds"
CONF_ACTIVITY_RETENTION_DAYS = "activity_log_retention_days"
CONF_ABSOLUTE_SESSION_LIFETIME = "absolute_session_lifetime_hours"
CONF_MAX_AUTH_PER_TOKEN = "max_auth_attempts_per_token_per_minute"
CONF_MAX_AUTH_PER_IP = "max_auth_attempts_per_ip_per_minute"
CONF_MAX_CONNECTIONS_PER_MINUTE = "max_connections_per_minute"
CONF_TRUSTED_PROXIES = "trusted_proxies"
CONF_DEFAULT_RATE_LIMITS = "default_rate_limits"
CONF_DEFAULT_SESSION = "default_session"
CONF_HA_EVENT_BUS = "ha_event_bus"

# Default values matching SPEC.md Section 19
DEFAULTS: dict[str, object] = {
    CONF_AUTH_TIMEOUT: 10,
    CONF_MAX_ENTITIES_PER_TOKEN: 50,
    CONF_MAX_ENTITIES_HARD_CAP: 250,
    CONF_MAX_INBOUND_BYTES: 4096,
    CONF_KEEPALIVE_INTERVAL: 30,
    CONF_KEEPALIVE_TIMEOUT: 10,
    CONF_HEARTBEAT_TIMEOUT: 60,
    CONF_ACTIVITY_RETENTION_DAYS: 30,       # matches security.md documented default
    CONF_ABSOLUTE_SESSION_LIFETIME: 72,     # hard cap on total cumulative session age across all renewals
                                            # distinct from max_lifetime_minutes which bounds individual sessions
    CONF_MAX_AUTH_PER_TOKEN: 10,
    CONF_MAX_AUTH_PER_IP: 20,
    CONF_MAX_CONNECTIONS_PER_MINUTE: 100,
    CONF_TRUSTED_PROXIES: [],
    CONF_DEFAULT_RATE_LIMITS: {
        "max_push_per_second": 1,
        "max_commands_per_minute": 30,
    },
    CONF_DEFAULT_SESSION: {
        "lifetime_minutes": 60,             # initial session lifetime before first renewal required
        "max_lifetime_minutes": 1440,       # ceiling any single session can reach via renewals (24h)
                                            # absolute_session_lifetime_hours (72h) caps the total
                                            # cumulative time before full re-auth is needed
    },
    CONF_HA_EVENT_BUS: {
        # Security-critical events - enabled by default
        "harvest_token_revoked": True,
        "harvest_suspicious_origin": True,
        "harvest_session_limit_reached": True,
        "harvest_flood_protection": True,
        # High-volume events - disabled by default to avoid logbook noise on busy installs
        # Enable these for detailed monitoring or debugging
        "harvest_session_connected": False,
        "harvest_auth_failure": False,
    },
}

# Attribute denylist - keys containing these strings are stripped from state_updates.
# This is KEY-LEVEL substring matching (the substring appears in the key name itself).
# Example: "access_token" strips keys like "access_token" and "oauth_access_token"
# but NOT "access_token_hidden" if "hidden" is not in the substring list.
# Note: exclude_attributes in EntityAccess is EXACT key matching, not substring.
# The two mechanisms are complementary: denylist covers sensitive key patterns
# globally; exclude_attributes allows per-entity exact exclusions.
ATTRIBUTE_DENYLIST_SUBSTRINGS: tuple[str, ...] = (
    "access_token", "api_key", "password", "token",
    "secret", "credentials", "private_key",
)

# Error codes (subset used server-side; full list in SPEC.md Section 6)
ERR_TOKEN_INVALID = "HRV_TOKEN_INVALID"
ERR_TOKEN_EXPIRED = "HRV_TOKEN_EXPIRED"
ERR_TOKEN_REVOKED = "HRV_TOKEN_REVOKED"
ERR_TOKEN_INACTIVE = "HRV_TOKEN_INACTIVE"
ERR_ORIGIN_DENIED = "HRV_ORIGIN_DENIED"
ERR_IP_DENIED = "HRV_IP_DENIED"
ERR_ENTITY_NOT_IN_TOKEN = "HRV_ENTITY_NOT_IN_TOKEN"
ERR_ENTITY_INCOMPATIBLE = "HRV_ENTITY_INCOMPATIBLE"
ERR_SESSION_LIMIT_REACHED = "HRV_SESSION_LIMIT_REACHED"
ERR_SIGNATURE_INVALID = "HRV_SIGNATURE_INVALID"
ERR_AUTH_FAILED = "HRV_AUTH_FAILED"
ERR_ENTITY_MISSING = "HRV_ENTITY_MISSING"
ERR_ENTITY_REMOVED = "HRV_ENTITY_REMOVED"
ERR_PERMISSION_DENIED = "HRV_PERMISSION_DENIED"
ERR_RATE_LIMITED = "HRV_RATE_LIMITED"
ERR_SESSION_EXPIRED = "HRV_SESSION_EXPIRED"
ERR_BAD_REQUEST = "HRV_BAD_REQUEST"
ERR_MESSAGE_TOO_LARGE = "HRV_MESSAGE_TOO_LARGE"
ERR_SERVER_ERROR = "HRV_SERVER_ERROR"
```

---

## token_manager.py

Responsible for all token lifecycle operations: creation, retrieval, validation, revocation, and deletion. Tokens are stored in HA's storage via `homeassistant.helpers.storage.Store`. No direct database access - that is `activity_store.py`'s responsibility.

```python
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import BASE62_ALPHABET, TOKEN_PREFIX, TOKEN_ID_LENGTH

if TYPE_CHECKING:
    from .session_manager import SessionManager

STORAGE_KEY = "harvest_tokens"
STORAGE_VERSION = 1


@dataclass
class EntityAccess:
    entity_id: str
    capabilities: str                       # "read" or "read-write"
    alias: str | None = None                # 8-char base62 alias; None means entity_id is used directly.
                                            # Generated at entity selection time in the wizard UI (Step 1),
                                            # stored in wizard session state, persisted to the token on Generate.
                                            # Random base62, not derived from entity_id. entity= takes
                                            # priority over alias= on the client; the server stores both.
    exclude_attributes: list[str] = field(default_factory=list)


@dataclass
class OriginConfig:
    allow_any: bool = False
    allowed: list[str] = field(default_factory=list)
    allow_paths: list[str] = field(default_factory=list)


@dataclass
class RateLimitConfig:
    max_push_per_second: int = 1
    max_commands_per_minute: int = 30
    override_defaults: bool = False         # False = merge with global DEFAULTS (token values cap global values).
                                            # True = use token values exclusively, ignoring global defaults.
                                            # The token-level values always cap the global defaults when override_defaults
                                            # is False - a token cannot grant more permissive limits than the global config.


@dataclass
class SessionConfig:
    lifetime_minutes: int = 60
    max_lifetime_minutes: int = 1440
    max_renewals: int | None = None         # None = unlimited renewals
    absolute_lifetime_hours: int | None = None  # None = defer to global CONF_ABSOLUTE_SESSION_LIFETIME (72h)


@dataclass
class ActiveScheduleWindow:
    days: list[str]                         # "mon", "tue", etc.
    start: str                              # "HH:MM" 24-hour local time
    end: str                                # "HH:MM" 24-hour local time


@dataclass
class ActiveSchedule:
    timezone: str                           # IANA timezone string
    windows: list[ActiveScheduleWindow]


@dataclass
class Token:
    token_id: str
    token_version: int
    created_at: datetime
    created_by: str                         # HA user ID
    label: str
    expires: datetime | None               # None means never expires
    token_secret: str | None               # None means HMAC disabled.
                                            # When set, the plaintext secret is stored in HA's .storage/
                                            # harvest_tokens file (local filesystem only, included in HA
                                            # backups). The secret is NOT hashed - it must be retrievable
                                            # for HMAC verification. Security claim: the secret is not
                                            # embedded in public HTML, not that it is never stored.
    origins: OriginConfig
    entities: list[EntityAccess]
    rate_limits: RateLimitConfig
    session: SessionConfig
    max_sessions: int | None               # None means unlimited
    active_schedule: ActiveSchedule | None
    allowed_ips: list[str]                 # CIDR notation, empty means all IPs
    status: str                            # "active", "revoked", "expired", "preview"
    revoked_at: datetime | None
    revoke_reason: str | None


class TokenManager:
    """Manages token persistence and lifecycle. One instance per integration entry."""

    def __init__(self, hass: HomeAssistant, config: dict) -> None:
        self._hass = hass
        self._config = config
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._tokens: dict[str, Token] = {}

    def generate_token_id(self) -> str:
        """Generate a unique base62 token ID with hwt_ prefix.

        Uses secrets.choice for cryptographic randomness.
        Checks for collision against existing tokens before returning.
        """

    def generate_session_id(self) -> str:
        """Generate a unique base62 session ID with hrs_ prefix."""

    async def load(self) -> None:
        """Load all tokens from HA storage into the in-memory cache.

        Called once during integration setup. Marks tokens as expired if
        their expires datetime has passed.
        """

    async def save(self) -> None:
        """Persist the current in-memory token cache to HA storage."""

    async def create(
        self,
        label: str,
        created_by: str,
        origins: OriginConfig,
        entities: list[EntityAccess],
        expires: datetime | None,
        token_secret: str | None,
        rate_limits: RateLimitConfig,
        session: SessionConfig,
        max_sessions: int | None,
        active_schedule: ActiveSchedule | None,
        allowed_ips: list[str],
    ) -> Token:
        """Create, persist, and return a new token.

        Validates entity count against hard cap before creating.
        Raises ValueError if entity count exceeds max_entities_hard_cap.
        Validates allow_paths entries (must start with /, no .., no query string or
        fragment, max 512 chars). Query strings in allow_paths entries are rejected
        at save time since they would never match after Referer normalisation.
        Raises ValueError for invalid path entries.
        """

    def get(self, token_id: str) -> Token | None:
        """Return a token by ID from the in-memory cache, or None if not found.

        Does not distinguish between not-found and malformed token_id.
        Both return None, mapping to HRV_TOKEN_INVALID at the call site.
        """

    def get_all(self) -> list[Token]:
        """Return all tokens, including expired and revoked."""

    def get_active(self) -> list[Token]:
        """Return only tokens with status 'active' and not past their expiry."""

    async def create_preview(
        self,
        entity_id: str,
        capabilities: str,
        created_by: str,
    ) -> Token:
        """Create a short-lived preview token for the wizard appearance step.

        Preview tokens have status 'preview', expire after 5 minutes, allow
        any origin (allow_any: True), are read-write or read-only matching the
        capabilities of the token being created, and are scoped to a single entity.

        Preview tokens do NOT appear in the token list returned by get_all() or
        get_active(). They are stored in a separate in-memory dict and are never
        persisted to HA storage. They are cleaned up automatically on expiry via
        a scheduled task. Revoking a preview token removes it immediately.

        Called by the panel HTTP views when the wizard reaches Step 5 or Step 6.
        """

    async def cleanup_expired_previews(self) -> None:
        """Remove all preview tokens that have passed their 5-minute expiry.

        Called by a scheduled task every 60 seconds. Preview tokens are
        in-memory only so no storage write is needed.
        """

    async def revoke(self, token_id: str, reason: str | None = None) -> Token:
        """Mark a token as revoked and persist.

        Sets status to 'revoked', revoked_at to now, revoke_reason to reason.
        Raises KeyError if token_id not found.
        Does not terminate active sessions - caller handles that via SessionManager.
        """

    async def delete(self, token_id: str) -> None:
        """Permanently remove a token from storage.

        Only callable on tokens with status 'expired' or 'revoked'.
        Raises ValueError if token is active.
        Raises KeyError if token_id not found.
        """

    async def update(self, token_id: str, updates: dict) -> Token:
        """Apply field updates to an existing token and persist.

        Accepts a dict of field names to new values. Only fields present
        in the dict are updated. Validates updated fields using the same
        rules as create(). Returns the updated Token.
        """

    def validate_auth(
        self,
        token_id: str,
        origin: str,
        referer: str | None,
        source_ip: str,
        entity_refs: list[str],             # real entity IDs, aliases, or a mix
        timestamp: int | None,
        nonce: str | None,
        signature: str | None,
    ) -> tuple[Token, str | None]:
        """Validate an incoming auth request against a token.

        Returns (token, error_code). If error_code is None, auth succeeded.

        entity_refs contains whatever strings the client sent. Each value is
        either a real entity ID (sent from a card using entity=) or an alias
        (sent from a card using alias=). A page with mixed cards produces a
        mixed list - this is valid. Companion entity references in the auth
        message are included in entity_refs alongside primary entity refs, and
        follow the same entity/alias convention as the card they belong to.

        Resolution for each ref: check alias lookup first (EntityAccess.alias == ref),
        then real entity ID lookup (EntityAccess.entity_id == ref). Unknown refs
        return HRV_ENTITY_NOT_IN_TOKEN.

        Checks in order:
        1. Token exists (HRV_TOKEN_INVALID if not)
        2. Token status is active (HRV_TOKEN_REVOKED or HRV_TOKEN_EXPIRED)
        3. Token not past expires datetime (HRV_TOKEN_EXPIRED)
        4. active_schedule permits current time (HRV_TOKEN_INACTIVE)
        5. source_ip in allowed_ips if set (HRV_IP_DENIED)
        6. Origin in allowed list if allow_any is False (HRV_ORIGIN_DENIED)
        7. Referer matches allow_paths if set and referer present (HRV_ORIGIN_DENIED).
           Referer is normalised before matching: the path component is extracted and
           query string and fragment are stripped. Matching is exact path-only comparison.
           Implement as a discrete _normalise_referer_path(referer: str) -> str function
           to allow future extension to prefix/wildcard matching without interface changes.
        8. All entity_refs resolve to known entities (HRV_ENTITY_NOT_IN_TOKEN)
        9. All resolved entities compatible (not Tier 3) (HRV_ENTITY_INCOMPATIBLE)
        10. HMAC signature valid if token_secret set (HRV_SIGNATURE_INVALID)

        Does not check session count - caller checks via SessionManager.
        """

    def is_schedule_active(self, token: Token) -> bool:
        """Return True if the token's active_schedule permits the current time.

        Always returns True if active_schedule is None.
        Uses the schedule's timezone for local time comparison.
        """

    def filter_attributes(
        self,
        entity_id: str,
        token: Token,
        attributes: dict,
    ) -> tuple[dict, dict]:
        """Split and filter entity attributes before sending in state_update.

        Returns (standard_attributes, extended_attributes).
        Applies ATTRIBUTE_DENYLIST_SUBSTRINGS first, then per-entity
        exclude_attributes from the token.
        """

    def verify_hmac(
        self,
        token_secret: str,
        token_id: str,
        timestamp: int,
        nonce: str,
        signature: str,
    ) -> bool:
        """Verify an HMAC-SHA256 signature.

        Computes HMAC-SHA256 of '{token_id}:{timestamp}:{nonce}' using
        token_secret as the key. The token_secret passed here is the stored
        plaintext secret retrieved from HA's storage. The widget also uses
        the plaintext to sign. Comparison uses hmac.compare_digest to prevent
        timing attacks. Validates that timestamp is within 60 seconds of
        server time to prevent replay attacks.

        Note: the secret is stored as plaintext in HA's local .storage/ file.
        Previous documentation claiming it was stored as a hash was incorrect -
        HMAC verification is impossible without the original secret.
        """
```

### Implementation Notes

**Storage:** tokens are serialised to JSON via `dataclasses.asdict()` and stored using HA's `Store` helper, which writes to `.storage/harvest_tokens` in the HA config directory. This file is included in HA's standard backup.

**Preview tokens:** preview tokens use `status = "preview"` and are kept in a separate in-memory dict (`_preview_tokens`) that is never persisted. They do not appear in the main `_tokens` dict and are invisible to `get_all()` and `get_active()`. The `validate_auth()` method checks both dicts. A scheduled task calls `cleanup_expired_previews()` every 60 seconds. Preview tokens are used exclusively by the wizard appearance step and Step 6 live preview.

**In-memory cache:** all token lookups use the in-memory dict for speed. The cache is the source of truth during a run. `save()` is called after every mutation.

**Expiry checking:** tokens are not automatically moved to `expired` status on a timer. `get_active()` filters them dynamically and `validate_auth()` checks `expires` explicitly. This avoids needing a background task just for expiry.

**HMAC replay protection:** the timestamp check in `verify_hmac()` rejects signatures older than 60 seconds. The nonce is not stored server-side (stateless validation). A signature can technically be replayed within the 60-second window, which is an acceptable tradeoff for a stateless check.

---

## session_manager.py

Manages the lifecycle of active WebSocket sessions. Sessions are in-memory only and not persisted. Restarting HA terminates all sessions; clients reconnect automatically.

```python
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aiohttp.web import WebSocketResponse
    from .token_manager import Token, EntityAccess


@dataclass
class Session:
    session_id: str
    token_id: str
    token_version: int
    issued_at: datetime
    expires_at: datetime
    absolute_expires_at: datetime
    renewal_count: int
    origin_validated: str
    referer_validated: str | None
    allowed_entities: list["EntityAccess"]
    ws: "WebSocketResponse"
    subscribed_entity_ids: set[str]
    last_message_at: datetime
    last_sent_attributes: dict[str, dict] = field(default_factory=dict)


class SessionManager:
    """Manages in-memory session state. One instance per integration entry."""

    def __init__(self, config: dict) -> None:
        self._config = config
        self._sessions: dict[str, Session] = {}
        self._token_sessions: dict[str, set[str]] = {}

    def create(
        self,
        session_id: str,
        token: "Token",
        origin: str,
        referer: str | None,
        ws: "WebSocketResponse",
        entity_ids: list[str],
    ) -> Session:
        """Create and register a new session.

        Computes expires_at from token.session.lifetime_minutes.
        Computes absolute_expires_at from token or global config.
        Raises ValueError if token.max_sessions is set and already reached.
        """

    def get(self, session_id: str) -> Session | None:
        """Return a session by ID, or None if not found or expired."""

    def get_all_for_token(self, token_id: str) -> list[Session]:
        """Return all active sessions for a given token."""

    def get_all(self) -> list[Session]:
        """Return all active sessions across all tokens."""

    def renew(self, session: Session) -> Session:
        """Issue a new session_id for an existing session and extend expiry.

        Increments renewal_count. Raises ValueError if max_renewals exceeded.
        Raises ValueError if new expiry would exceed absolute_expires_at.
        Updates both _sessions and _token_sessions indexes.
        """

    def touch(self, session_id: str) -> None:
        """Update last_message_at for a session. Called on every received message."""

    def terminate(self, session_id: str) -> None:
        """Remove a session from both indexes.

        Does not close the WebSocket - caller is responsible for that.
        """

    def terminate_all_for_token(self, token_id: str) -> list["WebSocketResponse"]:
        """Remove all sessions for a token and return their WebSocket objects.

        Caller closes each WebSocket with an auth_failed message.
        """

    def add_subscription(self, session_id: str, entity_ids: list[str]) -> None:
        """Add entity IDs to a session's subscribed set."""

    def remove_subscription(self, session_id: str, entity_ids: list[str]) -> None:
        """Remove entity IDs from a session's subscribed set."""

    def get_sessions_for_entity(self, entity_id: str) -> list[Session]:
        """Return all sessions subscribed to a given entity ID.

        Used by ws_proxy.py to fan out state updates. O(n) in session count.
        """

    def is_expired(self, session: Session) -> bool:
        """Return True if the session's expires_at has passed."""

    def count_active(self) -> int:
        """Return the total count of active sessions."""

    def count_for_token(self, token_id: str) -> int:
        """Return the count of active sessions for a specific token."""
```

### Implementation Notes

**No persistence:** sessions are in-memory only. HA restart loses all sessions. Clients reconnect via the widget's automatic reconnection logic.

**Dual index:** `_sessions` indexes by session_id for O(1) lookup. `_token_sessions` indexes by token_id for O(1) token-level operations. Both must be kept in sync on create and terminate.

**Entity fanout:** `get_sessions_for_entity()` is O(n) in session count. Acceptable for typical deployments. A reverse index can be added if needed in a future version.

**last_sent_attributes:** stored on the session so `ws_proxy.py` can compute `attributes_delta` on subsequent state updates by comparing current attributes to the last-sent version.

---

## entity_compatibility.py

Defines which entity domains are supported (Tier 1, Tier 2, Tier 3) and validates actions against the allowed services map.

```python
from __future__ import annotations

from enum import IntEnum
from .const import ERR_ENTITY_INCOMPATIBLE, ERR_PERMISSION_DENIED


class SupportTier(IntEnum):
    FULLY_SUPPORTED = 1
    GENERIC = 2
    BLOCKED = 3


TIER1_DOMAINS: dict[str, str] = {
    "light":           "LightCard",
    "switch":          "SwitchCard",
    "fan":             "FanCard",
    "climate":         "ClimateCard",
    "cover":           "CoverCard",
    "media_player":    "MediaPlayerCard",
    "remote":          "RemoteCard",
    "sensor":          "GenericSensorCard",
    "binary_sensor":   "BinarySensorCard",
    "input_boolean":   "InputBooleanCard",
    "input_number":    "InputNumberCard",
    "input_select":    "InputSelectCard",
    "harvest_action":  "HarvestActionCard",
}

SENSOR_DEVICE_CLASS_RENDERERS: dict[str, str] = {
    "temperature": "TemperatureSensorCard",
    "humidity":    "HumiditySensorCard",
    "battery":     "BatterySensorCard",
}

TIER3_DOMAINS: dict[str, str] = {
    "alarm_control_panel": "Security-critical. Publicly embeddable alarm control is too high risk.",
    "lock":                "Physical security risk.",
    "person":              "Exposes real-time location data of named individuals.",
    "device_tracker":      "Same privacy concern as person.",
    "camera":              "Video streaming is out of scope.",
    "script":              "Use harvest_action instead.",
    "automation":          "Same concern as script.",
    "scene":               "Could trigger wide device effects. Deferred to v2.",
    "update":              "Triggering firmware updates from a public page is too risky.",
    "button":              "Use harvest_action instead.",
}

ALLOWED_SERVICES: dict[str, set[str]] = {
    "light":          {"turn_on", "turn_off", "toggle"},
    "switch":         {"turn_on", "turn_off", "toggle"},
    "fan":            {"turn_on", "turn_off", "toggle", "set_percentage",
                       "oscillate", "set_direction"},
    "cover":          {"open_cover", "close_cover", "stop_cover", "set_cover_position"},
    "climate":        {"turn_on", "turn_off", "set_temperature", "set_hvac_mode",
                       "set_fan_mode", "set_preset_mode"},
    "input_boolean":  {"turn_on", "turn_off", "toggle"},
    "input_number":   {"set_value"},
    "input_select":   {"select_option"},
    "media_player":   {"media_play_pause", "media_next_track", "media_previous_track",
                       "volume_up", "volume_down", "volume_set", "turn_on", "turn_off"},
    "remote":         {"turn_on", "turn_off", "send_command"},
    "harvest_action": {"trigger"},
    # sensor and binary_sensor are intentionally absent: read-only domains with no HA
    # services. They never send commands so they never reach this check. Not an omission.
}

COMPANION_ALLOWED_DOMAINS: frozenset[str] = frozenset({
    "light", "switch", "lock", "binary_sensor",
    "input_boolean", "cover", "remote",
})


def get_support_tier(domain: str) -> SupportTier:
    """Return the support tier for a given entity domain."""
    if domain in TIER3_DOMAINS:
        return SupportTier.BLOCKED
    if domain in TIER1_DOMAINS:
        return SupportTier.FULLY_SUPPORTED
    return SupportTier.GENERIC


def get_renderer_name(domain: str, device_class: str | None) -> str:
    """Return the widget renderer class name for a domain and device_class.

    For sensor domain, checks SENSOR_DEVICE_CLASS_RENDERERS first.
    Falls back to TIER1_DOMAINS lookup, then 'GenericCard'.
    """
    if domain == "sensor" and device_class:
        if device_class in SENSOR_DEVICE_CLASS_RENDERERS:
            return SENSOR_DEVICE_CLASS_RENDERERS[device_class]
    return TIER1_DOMAINS.get(domain, "GenericCard")


def validate_entity(domain: str) -> str | None:
    """Return HRV_ENTITY_INCOMPATIBLE for Tier 3 domains, or None if allowed."""
    if domain in TIER3_DOMAINS:
        return ERR_ENTITY_INCOMPATIBLE
    return None


def validate_action(domain: str, action: str) -> str | None:
    """Return HRV_PERMISSION_DENIED if action is not allowed for domain, else None."""
    allowed = ALLOWED_SERVICES.get(domain, set())
    if action not in allowed:
        return ERR_PERMISSION_DENIED
    return None


def is_companion_allowed(domain: str) -> bool:
    """Return True if the domain is permitted as a companion entity."""
    return domain in COMPANION_ALLOWED_DOMAINS


def get_blocked_reason(domain: str) -> str | None:
    """Return the human-readable reason a Tier 3 domain is blocked, or None."""
    return TIER3_DOMAINS.get(domain)
```

---

## entity_definition.py

Builds `entity_definition` messages by reading HA's entity registry and state machine. Translates HA's internal bitmask representations into the clean string arrays the widget expects.

```python
from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er

from .entity_compatibility import get_support_tier, get_renderer_name

if TYPE_CHECKING:
    from .token_manager import EntityAccess


FEATURE_FLAGS: dict[str, dict[int, str]] = {
    "light": {
        1: "brightness", 2: "color_temp", 4: "effect",
        16: "flash", 64: "transition", 128: "rgb_color", 1024: "white_value",
    },
    "fan": {1: "set_speed", 2: "oscillate", 4: "direction"},
    "cover": {4: "set_position", 128: "set_tilt_position", 8: "stop"},
    "climate": {
        1: "target_temperature", 2: "target_temperature_range",
        4: "fan_mode", 8: "preset_mode", 16: "swing_mode", 32: "aux_heat",
    },
    "media_player": {
        1: "play_pause", 2: "next_track", 4: "previous_track",
        8: "volume_set", 16: "volume_step", 128: "turn_on", 256: "turn_off",
    },
    "remote": {1: "learn_command", 2: "delete_command"},
}

STANDARD_ATTRIBUTES: dict[str, frozenset[str]] = {
    "light": frozenset({
        "brightness", "color_temp", "color_mode", "supported_color_modes",
        "min_mireds", "max_mireds", "effect_list", "effect",
    }),
    "fan": frozenset({
        "percentage", "percentage_step", "oscillating",
        "direction", "preset_mode", "preset_modes",
    }),
    "cover": frozenset({"current_position", "current_tilt_position"}),
    "climate": frozenset({
        "current_temperature", "target_temp_high", "target_temp_low",
        "temperature", "hvac_modes", "hvac_action", "fan_modes", "fan_mode",
        "preset_modes", "preset_mode", "swing_modes", "swing_mode",
        "min_temp", "max_temp", "target_temp_step",
    }),
    "sensor": frozenset({
        "unit_of_measurement", "device_class", "state_class", "last_reset",
    }),
    "binary_sensor": frozenset({"device_class"}),
    "media_player": frozenset({
        "media_title", "media_artist", "media_album_name",
        "media_duration", "media_position", "media_content_type",
        "source", "source_list", "volume_level", "is_volume_muted",
    }),
    "remote": frozenset({"current_activity", "activity_list"}),
    "input_number": frozenset({"min", "max", "step", "mode", "unit_of_measurement"}),
    "input_select": frozenset({"options"}),
}


def build_entity_definition(
    hass: HomeAssistant,
    entity_id: str,
    entity_access: "EntityAccess",
) -> dict | None:
    """Build a complete entity_definition message dict for a given entity.

    Reads current state and entity registry entry from HA.
    Translates supported_features bitmask to string list.
    Builds icon and icon_state_map from entity registry and domain defaults.
    Builds feature_config with domain-specific range values.
    Returns None if the entity does not exist in HA's state machine.
    """


def decode_supported_features(domain: str, bitmask: int) -> list[str]:
    """Translate a HA supported_features bitmask to a list of feature strings.

    Uses FEATURE_FLAGS for the domain. Bits not in the map are ignored.
    Returns an empty list for unknown domains or zero bitmask.
    """
    flags = FEATURE_FLAGS.get(domain, {})
    return [name for bit, name in flags.items() if bitmask & bit]


def split_attributes(domain: str, attributes: dict) -> tuple[dict, dict]:
    """Split entity attributes into standard and extended dicts.

    Standard attributes are those in STANDARD_ATTRIBUTES for the domain.
    All others go to extended_attributes.
    friendly_name is excluded from both (delivered in entity_definition separately).
    """
    standard_keys = STANDARD_ATTRIBUTES.get(domain, frozenset())
    standard = {k: v for k, v in attributes.items()
                if k in standard_keys and k != "friendly_name"}
    extended = {k: v for k, v in attributes.items()
                if k not in standard_keys and k != "friendly_name"}
    return standard, extended


def build_icon_state_map(domain: str, state: State) -> dict[str, str]:
    """Build the icon_state_map for an entity.

    Reads the entity's icon from the entity registry if set (user-customised).
    Falls back to HA's built-in domain/device_class icon conventions.
    Returns a dict of state strings to MDI icon names.
    """


def build_feature_config(domain: str, state: State) -> dict:
    """Build the feature_config dict for domain-specific range values.

    light: min_brightness, max_brightness, min_color_temp, max_color_temp
    fan: speed_count (from percentage_step attribute)
    input_number: min, max, step
    climate: min_temp, max_temp, target_temp_step
    Returns an empty dict for domains with no configurable ranges.
    """
```

---

## harvest_action.py

Implements the `harvest_action` virtual entity domain. This is the most architecturally unique module in the integration.

### Concept

A `harvest_action` is a named, server-side action definition stored by the integration. It has a friendly name, an entity ID of the form `harvest_action.{slug}`, and a list of HA service calls to execute when triggered. The public widget sends only `action: "trigger"` and has no knowledge of what services will be called.

This lets the token owner expose a button-like interaction from a public widget without revealing any HA internals. The widget shows a button labelled "Welcome Home". The integration executes `light.turn_on`, `media_player.play_media`, and `notify.mobile` when triggered.

```python
from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

if TYPE_CHECKING:
    from .session_manager import Session

ACTIONS_STORAGE_KEY = "harvest_actions"
ACTIONS_STORAGE_VERSION = 1


@dataclass
class ServiceCall:
    """A single HA service call to execute as part of a harvest_action."""
    domain: str
    service: str
    data: dict


@dataclass
class HarvestActionDefinition:
    """A named, pre-approved action exposed as a virtual HA entity."""
    action_id: str
    label: str
    icon: str                               # MDI icon name
    service_calls: list[ServiceCall]
    created_by: str
    created_at: str                         # ISO 8601


class HarvestActionManager:
    """Manages harvest_action virtual entity definitions and execution."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store = Store(hass, ACTIONS_STORAGE_VERSION, ACTIONS_STORAGE_KEY)
        self._actions: dict[str, HarvestActionDefinition] = {}

    async def load(self) -> None:
        """Load action definitions from storage and register HA entities."""

    async def create(
        self,
        label: str,
        icon: str,
        service_calls: list[ServiceCall],
        created_by: str,
    ) -> HarvestActionDefinition:
        """Create a new harvest_action definition and register it as a HA entity.

        Generates a slug from the label (lowercase, spaces to underscores,
        non-alphanumeric removed). Ensures uniqueness by appending a numeric
        suffix if needed. Registers the entity with HA's entity registry
        under the 'harvest_action' domain. Saves to storage.
        """

    async def delete(self, action_id: str) -> None:
        """Remove a harvest_action definition and unregister its HA entity.

        Raises KeyError if action_id not found.
        """

    async def trigger(self, action_id: str, session: "Session") -> None:
        """Execute the service calls for a harvest_action.

        Raises KeyError if action_id not found.
        Executes each ServiceCall in order using hass.services.async_call().
        Fire-and-forget: returns immediately without waiting for service completion.
        Logs each call at debug level with the session origin for audit.
        """

    def get(self, action_id: str) -> HarvestActionDefinition | None:
        """Return an action definition by ID, or None."""

    def get_all(self) -> list[HarvestActionDefinition]:
        """Return all defined actions."""

    def get_entity_id(self, action_id: str) -> str:
        """Return the HA entity_id for a given action_id.

        Format: 'harvest_action.{action_id}'
        """

    def build_entity_definition_payload(self, action_id: str) -> dict | None:
        """Build the entity_definition message payload for a harvest_action.

        Returns a dict with all required fields:
        - entity_id: "harvest_action.{action_id}"
        - domain: "harvest_action"
        - device_class: None
        - friendly_name: the action's label
        - supported_features: []
        - feature_config: {}
        - icon: the action's MDI icon name
        - icon_state_map: {"idle": icon, "triggered": icon}
        - support_tier: 1
        - renderer: "HarvestActionCard"
        - unit_of_measurement: None

        Returns None if action_id not found.
        """
```

### Implementation Notes

**Virtual entity registration:** `harvest_action` entities are registered in HA's entity registry using the platform API. They appear in HA's UI like any other entity and can trigger HA automations via the standard `state_changed` event. They are registered with `platform="harvest"` and no device info.

**State machine:** the entity's state briefly transitions to `"triggered"` when `trigger()` is called, then back to `"idle"` after 200ms. This allows HA automations to react using standard `state_changed` triggers. The widget's `HarvestActionCard` renderer treats both states identically visually.

**Service call ordering:** calls execute in order but fire-and-forget using `hass.async_create_task()`. The trigger command returns `ack: success` immediately without waiting for service completion. If a service call fails, it is logged but does not affect subsequent calls.

**Token access:** `harvest_action` entities appear in the token entity list like any other entity. The token must include `harvest_action.{action_id}` with `"read-write"` capability for the widget to send a trigger. A read-only token sees the button but cannot trigger it.

---

## rate_limiter.py

Token bucket rate limiter for per-entity push rate, per-session command rate, per-token auth rate, and per-IP connection rate.

```python
from __future__ import annotations

import time
from dataclasses import dataclass, field


@dataclass
class TokenBucket:
    capacity: int
    refill_rate: float                      # tokens per second
    tokens: float = field(init=False)
    last_refill: float = field(init=False)

    def __post_init__(self) -> None:
        self.tokens = float(self.capacity)
        self.last_refill = time.monotonic()

    def consume(self, count: int = 1) -> bool:
        """Attempt to consume count tokens. Returns True if allowed."""
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
        if self.tokens >= count:
            self.tokens -= count
            return True
        return False


class RateLimiter:
    """Manages all rate limiting for the integration. One instance per entry."""

    def __init__(self, config: dict) -> None:
        self._config = config
        self._push_buckets: dict[tuple[str, str], TokenBucket] = {}
        self._command_buckets: dict[str, TokenBucket] = {}
        self._auth_token_counters: dict[str, tuple[int, float]] = {}
        self._ip_counters: dict[str, tuple[int, float]] = {}

    def check_push(self, session_id: str, entity_id: str, rate: int) -> bool:
        """Check and consume from the push bucket for a session/entity pair.

        Returns True if the push is allowed, False if rate limited.
        Creates a new bucket on first use for this pair.
        """

    def check_command(self, session_id: str, max_per_minute: int) -> tuple[bool, int]:
        """Check and consume from the command bucket for a session.

        Returns (allowed, retry_after_seconds).
        retry_after_seconds is 0 when allowed.
        """

    def check_auth_for_token(self, token_id: str) -> bool:
        """Return True if the token is under its auth attempt limit."""

    def record_auth_attempt(self, token_id: str) -> None:
        """Record a failed auth attempt for a token.

        Only failed attempts count toward the limit.
        """

    def check_ip(self, ip: str) -> bool:
        """Return True if the IP is under its connection attempt limit.

        Called before WebSocket upgrade is accepted.
        """

    def cleanup_session(self, session_id: str) -> None:
        """Remove all rate limit buckets for a closed session."""
```

---

## ws_proxy.py

The WebSocket handler registered with HA's HTTP server at `WS_PATH`. Manages connection lifecycle, auth flow, message processing, state fan-out, and keepalive.

```python
from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from aiohttp.web import Request, WebSocketResponse
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, callback

from .const import WS_PATH
from .token_manager import TokenManager
from .session_manager import SessionManager
from .rate_limiter import RateLimiter
from .activity_store import ActivityStore
from .event_bus import EventBus
from .harvest_action import HarvestActionManager

if TYPE_CHECKING:
    from .token_manager import Token

_LOGGER = logging.getLogger(__name__)

FLOOD_LIMIT = 10
FLOOD_WINDOW_SECONDS = 5


class HarvestWsView(HomeAssistantView):
    """WebSocket endpoint. requires_auth = False (uses its own token-based auth)."""

    url = WS_PATH
    name = "api:harvest:ws"
    requires_auth = False

    def __init__(
        self,
        hass: HomeAssistant,
        token_manager: TokenManager,
        session_manager: SessionManager,
        rate_limiter: RateLimiter,
        activity_store: ActivityStore,
        event_bus: EventBus,
        action_manager: HarvestActionManager,
        config: dict,
    ) -> None: ...

    async def get(self, request: Request) -> WebSocketResponse:
        """Handle incoming WebSocket upgrade.

        Checks per-IP rate limit before accepting. Returns HTTP 429 if limited.
        Accepts the WebSocket upgrade and delegates to _handle_connection().
        """

    async def _handle_connection(
        self,
        ws: WebSocketResponse,
        request: Request,
    ) -> None:
        """Manage the full lifecycle of a single WebSocket connection.

        1. Wait for auth message within auth_timeout_seconds. Close silently if none.
        2. Validate auth via token_manager.validate_auth().
        3. On success: call session_manager.create() to establish the session.
           If session_manager.create() raises ValueError (token.max_sessions reached),
           catch it and send auth_failed with HRV_SESSION_LIMIT_REACHED before closing.
        4. Send auth_ok, send interleaved entity_definition + state_update pairs,
           register state_changed listeners.
        5. On auth failure: send auth_failed and close.
        6. Enter message loop.
        7. On exit: clean up session, unregister listeners, free rate buckets.
        """

    async def _send_initial_state(
        self,
        ws: WebSocketResponse,
        session_id: str,
        entity_ids: list[str],
        token: "Token",
    ) -> None:
        """Send interleaved entity_definition and state_update for each entity.

        For each entity_id:
        1. Build and send entity_definition
        2. Fetch current state from hass.states.get()
        3. Build and send state_update (full attributes, initial=True)
        If entity does not exist, send entity_removed instead.
        """

    async def _message_loop(
        self,
        ws: WebSocketResponse,
        session_id: str,
        token: "Token",
    ) -> None:
        """Process incoming messages until the connection closes.

        Validates message size (close if exceeded).
        Parses JSON (log warn and continue on parse error).
        Tracks flood protection counter.
        Dispatches to appropriate handler by message type.
        Note: unsubscribe is fire-and-forget - no ack or response is sent.
        Touches session and resets heartbeat on every message.
        """

    async def _handle_command(
        self,
        ws: WebSocketResponse,
        msg: dict,
        session_id: str,
        token: "Token",
    ) -> None:
        """Process a command message.

        Validates session_id, entity_id scope, capability (read-write required),
        action against ALLOWED_SERVICES, and command rate limit.
        Strips unknown keys from data payload before forwarding.
        Calls hass.services.async_call() or action_manager.trigger().
        Sends ack. Records command in activity_store.
        """

    async def _handle_subscribe(
        self,
        ws: WebSocketResponse,
        msg: dict,
        session_id: str,
        token: "Token",
    ) -> None:
        """Process a subscribe message.

        Validates entity_ids against token. Adds to session subscriptions.
        Registers state_changed listeners. Sends subscribe_ok.
        Sends interleaved entity_definition + state_update for each new entity.
        """

    async def _handle_unsubscribe(
        self,
        ws: WebSocketResponse,
        msg: dict,
        session_id: str,
    ) -> None:
        """Process an unsubscribe message.

        Removes entity_ids from session subscriptions.
        Unregisters state_changed listeners if no other session needs them.
        No response is sent.
        """

    async def _handle_renew(
        self,
        ws: WebSocketResponse,
        msg: dict,
        session_id: str,
        token: "Token",
    ) -> None:
        """Process a renew message.

        Calls session_manager.renew(). Sends new auth_ok.
        Resends interleaved entity_definition + state_update for all subscribed entities.
        On ValueError from renew (limits exceeded): send auth_failed and close.
        """

    @callback
    def _on_state_changed(self, event, entity_id: str) -> None:
        """HA event callback for state_changed events.

        Finds all sessions subscribed to this entity.
        For each session: checks push rate limit, builds state_update delta,
        enqueues send via asyncio.ensure_future() to avoid blocking the event loop.
        """

    def _build_state_update_message(
        self,
        entity_id: str,
        state,
        token: "Token",
        is_initial: bool,
        session: "Session | None" = None,
    ) -> dict:
        """Build a state_update message dict.

        For initial=True: full attributes and extended_attributes.
        For initial=False: computes attributes_delta by comparing to
        session.last_sent_attributes[entity_id]. Omits attributes_delta
        if only state changed and no attributes changed.
        Applies token_manager.filter_attributes() before building.
        Updates session.last_sent_attributes after building.
        """

    def _get_source_ip(self, request: Request) -> str:
        """Extract the real client IP.

        Reads X-Forwarded-For if connection is from a trusted proxy.
        Falls back to connection peer name otherwise.
        """
```

### Implementation Notes

**State listener registration:** one `hass.bus.async_listen()` per entity per session. The listener is unregistered using the returned unsubscribe callable when the session ends or entity is unsubscribed.

**Alias resolution:** the `entity_refs` list in an auth message may contain real entity IDs, aliases, or a mix - one per card depending on which attribute the card uses (`entity=` or `alias=`). Companion entity references in the list follow the same convention as the primary entity of the card they belong to. The integration resolves each ref by alias lookup first (matching `EntityAccess.alias`), then real entity ID lookup (matching `EntityAccess.entity_id`). Once resolved, the session stores both the alias and the real entity_id for each subscribed entity. On fan-out, outgoing messages use the alias as `entity_id` for sessions where an alias was used, so the widget never sees the real HA entity ID.

**Message sending:** `ws.send_json()` must be awaited. The `_on_state_changed` callback is synchronous (HA requirement). It uses `asyncio.ensure_future()` to schedule the send without blocking the event loop.

**Interleaved delivery:** `_send_initial_state()` sends definition then state for entity 1, then definition then state for entity 2, and so on. This lets the widget start rendering the first card before all definitions have arrived.

---

## http_views.py

Registers the HTTP endpoints the panel JS calls for token management, session data, and activity log queries. This is an internal API between the bundled panel and the integration - it is not a public protocol and third parties are not expected to implement it. Endpoint shapes are implementation details.

```python
from __future__ import annotations

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .token_manager import TokenManager
from .session_manager import SessionManager
from .activity_store import ActivityStore
from .harvest_action import HarvestActionManager
from .diagnostic_sensors import DiagnosticSensors


def register_views(
    hass: HomeAssistant,
    token_manager: TokenManager,
    session_manager: SessionManager,
    activity_store: ActivityStore,
    action_manager: HarvestActionManager,
    sensors: DiagnosticSensors,
) -> None:
    """Register all HTTP API views with HA's HTTP server.

    All views are prefixed with /api/harvest/.
    All views require HA authentication (panel runs in authenticated context).
    Endpoint shapes are determined during implementation.
    """
    hass.http.register_view(HarvestTokensView(token_manager, session_manager))
    hass.http.register_view(HarvestTokenDetailView(token_manager, session_manager))
    hass.http.register_view(HarvestSessionsView(session_manager))
    hass.http.register_view(HarvestActivityView(activity_store))
    hass.http.register_view(HarvestActionsView(action_manager))
    hass.http.register_view(HarvestConfigView(hass))
    hass.http.register_view(HarvestStatsView(sensors, activity_store, session_manager))
```

---

## activity_store.py

Manages the SQLite activity log with batched writes, WAL mode, crash recovery, and scheduled purge.

```python
from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import NamedTuple

import aiosqlite
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)
DB_SCHEMA_VERSION = 1


class AuthEvent(NamedTuple):
    token_id: str
    origin: str
    source_ip: str
    result: str                             # "ok", "failed", "rate_limited"
    error_code: str | None
    timestamp: datetime


class CommandEvent(NamedTuple):
    session_id: str
    token_id: str
    entity_id: str
    action: str
    success: bool
    timestamp: datetime


class SessionEvent(NamedTuple):
    session_id: str
    token_id: str
    origin: str
    source_ip: str
    event_type: str                         # "connected", "disconnected", "terminated"
    timestamp: datetime


class ErrorEvent(NamedTuple):
    session_id: str | None
    code: str
    message: str
    timestamp: datetime


class ActivityStore:
    """Async SQLite activity log with batched writes. One instance per entry."""

    def __init__(self, hass: HomeAssistant, config: dict) -> None:
        self._hass = hass
        self._config = config
        self._db_path: Path = Path(hass.config.config_dir) / "harvest_activity.db"
        self._db: aiosqlite.Connection | None = None
        self._write_queue: asyncio.Queue = asyncio.Queue()
        self._flush_task: asyncio.Task | None = None
        self._retention_days: int = config.get("activity_log_retention_days", 30)

    async def open(self) -> None:
        """Open the database, run integrity check, apply schema, start flush loop.

        Enables WAL mode and NORMAL synchronous.
        On integrity_check failure: renames corrupt file to
        harvest_activity.corrupt.{timestamp}.db and creates fresh database.
        """

    async def close(self) -> None:
        """Flush all pending writes and close the database connection."""

    def record_auth(self, event: AuthEvent) -> None:
        """Enqueue an auth event. Non-blocking."""

    def record_command(self, event: CommandEvent) -> None:
        """Enqueue a command event. Non-blocking."""

    def record_session(self, event: SessionEvent) -> None:
        """Enqueue a session event. Non-blocking."""

    def record_error(self, event: ErrorEvent) -> None:
        """Enqueue an error event. Non-blocking."""

    async def query_activity(
        self,
        token_id: str | None = None,
        event_types: list[str] | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[dict], int]:
        """Query the activity log with optional filters.

        Returns (events, total_count) for pagination support.
        total_count reflects the full matching set regardless of limit/offset.
        """

    async def query_aggregates(
        self,
        hours: int = 24,
        token_id: str | None = None,
    ) -> dict:
        """Return hourly aggregate counts for dashboard graphs.

        Returns hourly buckets for the past `hours` hours covering:
        auth_ok_count, auth_fail_count, command_count, peak_sessions per hour.
        """

    async def count_today(self) -> dict[str, int]:
        """Return today's totals for diagnostic sensors.

        Returns: commands, errors, auth_ok, auth_fail counts.
        'Today' is midnight in HA's configured timezone.
        """

    async def purge_old_records(self) -> int:
        """Delete records older than retention_days. Returns count deleted.

        Runs PRAGMA wal_checkpoint(PASSIVE) after purge.
        """

    async def get_db_size_bytes(self) -> int:
        """Return the current database file size in bytes."""

    async def export_csv(
        self,
        token_id: str | None = None,
        event_types: list[str] | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
    ) -> str:
        """Export activity log entries as a CSV string.

        Accepts the same filter parameters as query_activity() but returns
        all matching rows (no pagination limit) formatted as CSV with a
        header row. Column order: timestamp, event_type, token_id, origin,
        source_ip, entity_id, action, result, error_code.

        Empty columns are represented as empty strings, not NULL.
        Called by the HTTP views layer when the panel requests a CSV download.
        """

    async def _flush_loop(self) -> None:
        """Background task flushing the write queue every 5 seconds."""

    async def _flush(self) -> None:
        """Drain the write queue and commit all pending writes in one transaction."""

    async def _apply_schema(self) -> None:
        """Create tables and indexes if they do not exist. Idempotent."""
```

### Implementation Notes

**Schema:**

```sql
CREATE TABLE IF NOT EXISTS auth_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_id TEXT NOT NULL,
    origin TEXT NOT NULL,
    source_ip TEXT NOT NULL,
    result TEXT NOT NULL,
    error_code TEXT,
    timestamp TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    token_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    success INTEGER NOT NULL,
    timestamp TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS session_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    token_id TEXT NOT NULL,
    origin TEXT NOT NULL,
    source_ip TEXT NOT NULL,
    event_type TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    code TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_token ON auth_events(token_id);
CREATE INDEX IF NOT EXISTS idx_auth_timestamp ON auth_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_commands_token ON commands(token_id);
CREATE INDEX IF NOT EXISTS idx_commands_timestamp ON commands(timestamp);
CREATE INDEX IF NOT EXISTS idx_session_token ON session_events(token_id);
```

**Write queue:** all `record_*` methods are synchronous and non-blocking, placing events on an `asyncio.Queue`. The flush loop drains it every 5 seconds in a single transaction. Up to 5 seconds of writes may be lost in a crash, which is acceptable for an activity log.

**Timestamps:** stored as ISO 8601 strings in UTC for correct lexicographic ordering in range queries.

---

## event_bus.py

Publishes selected events to HA's event bus based on user configuration.

```python
from __future__ import annotations

from homeassistant.core import HomeAssistant
from .const import CONF_HA_EVENT_BUS


class EventBus:
    """Publishes HArvest security events to the HA event bus. One instance per entry."""

    def __init__(self, hass: HomeAssistant, config: dict) -> None:
        self._hass = hass
        self._event_config: dict[str, bool] = config.get(CONF_HA_EVENT_BUS, {})

    def fire(self, event_name: str, data: dict) -> None:
        """Fire an event if it is enabled in config. Does nothing if disabled."""

    def token_revoked(self, token_id: str, label: str, reason: str | None) -> None:
        """Fire harvest_token_revoked if enabled.

        Payload:
            token_id:  str   - the revoked token's ID
            label:     str   - the token's human-readable label
            reason:    str | None - the revocation reason, or None if not provided
        """

    def suspicious_origin(self, token_id: str, origin: str, source_ip: str) -> None:
        """Fire harvest_suspicious_origin if enabled.

        Fired when an auth attempt arrives from an origin not in the token's allowed list.

        Payload:
            token_id:   str  - the token ID the request was attempting to use
            origin:     str  - the Origin header value from the request
            source_ip:  str  - the client IP address (resolved via trusted_proxies if set)
        """

    def session_limit_reached(self, token_id: str, label: str) -> None:
        """Fire harvest_session_limit_reached if enabled.

        Fired when a new auth attempt is rejected because max_sessions is already reached.

        Payload:
            token_id:  str  - the token that is at its session limit
            label:     str  - the token's human-readable label
        """

    def flood_protection(self, session_id: str, origin: str) -> None:
        """Fire harvest_flood_protection if enabled.

        Fired when a session is closed due to receiving too many malformed messages.

        Payload:
            session_id:  str  - the terminated session ID
            origin:      str  - the Origin header of the terminated session
        """

    def session_connected(self, session_id: str, token_id: str, origin: str) -> None:
        """Fire harvest_session_connected if enabled (off by default).

        Fired each time a new session is successfully authenticated.

        Payload:
            session_id:  str  - the new session ID
            token_id:    str  - the token used to authenticate
            origin:      str  - the Origin header of the connecting browser
        """

    def auth_failure(
        self, token_id: str | None, origin: str, error_code: str
    ) -> None:
        """Fire harvest_auth_failure if enabled (off by default).

        Fired on every failed authentication attempt.

        Payload:
            token_id:    str | None  - the token ID from the request, or None if not parseable
            origin:      str         - the Origin header from the request
            error_code:  str         - the HRV_* error code that caused the failure
        """
```

---

## diagnostic_sensors.py

Creates and manages the HA sensor entities that surface HArvest metrics.

```python
from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant

from .session_manager import SessionManager
from .activity_store import ActivityStore


class DiagnosticSensors:
    """Factory and registry for HArvest diagnostic sensor entities."""

    def __init__(
        self,
        hass: HomeAssistant,
        session_manager: SessionManager,
        activity_store: ActivityStore,
    ) -> None:
        self._hass = hass
        self._session_manager = session_manager
        self._activity_store = activity_store
        self._entities: list[SensorEntity | BinarySensorEntity] = []

    def create_global_sensors(self) -> list[SensorEntity | BinarySensorEntity]:
        """Return global diagnostic sensor entities to register with HA.

        Creates: HarvestActiveSessionsSensor, HarvestActiveTokensSensor,
        HarvestCommandsTodaySensor, HarvestErrorsTodaySensor,
        HarvestRunningSensor (binary, device_class=connectivity - not "running"
        which is not a valid BinarySensorDeviceClass).
        """

    def create_token_sensors(self, token_id: str, label: str) -> list[SensorEntity]:
        """Create per-token sensor entities for a newly created token.

        Creates: sessions, last_seen, last_origin, commands_today sensors.
        Entity IDs follow the pattern: sensor.harvest_{label}_{metric}
        where {label} is the token label slugified.
        """

    def remove_token_sensors(self, token_id: str) -> None:
        """Unregister and remove per-token sensor entities when a token is deleted."""

    def schedule_updates(self) -> None:
        """Schedule periodic sensor state updates.

        Global sensors update every 30 seconds.
        Per-token sensors update on relevant events rather than on a fixed schedule.
        """
```

---

## panel.py

Registers the HArvest custom sidebar panel with HA's frontend.

```python
from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.components.frontend import async_register_built_in_panel

from .const import PANEL_PATH, DOMAIN


def register_panel(hass: HomeAssistant) -> None:
    """Register the HArvest sidebar panel.

    Serves the frontend/dist/ directory as static files.
    Registers the panel in the HA sidebar as 'HArvest' with the mdi:leaf icon.
    """
    hass.http.register_static_path(
        f"/{PANEL_PATH}",
        hass.config.path("custom_components", DOMAIN, "panel"),
        cache_headers=False,
    )

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="HArvest",
        sidebar_icon="mdi:leaf",
        frontend_url_path=PANEL_PATH,
        config={"_panel_custom": {
            "name": "harvest-panel",
            "url_path": PANEL_PATH,
            "embed_iframe": False,
            "trust_external": False,
        }},
        require_admin=False,
    )
```

---

## __init__.py

Integration entry point. Called by HA during setup and teardown.

```python
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval

from .const import DOMAIN, DEFAULTS
from .token_manager import TokenManager
from .session_manager import SessionManager
from .harvest_action import HarvestActionManager
from .rate_limiter import RateLimiter
from .ws_proxy import HarvestWsView
from .http_views import register_views
from .activity_store import ActivityStore
from .event_bus import EventBus
from .diagnostic_sensors import DiagnosticSensors
from .panel import register_panel

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HArvest from a config entry.

    Merges DEFAULTS with config entry data and options.
    Instantiates all managers in dependency order.
    Loads tokens and actions from storage.
    Opens activity store.
    Registers WebSocket view, HTTP views, panel, and diagnostic sensors.
    Schedules daily activity log purge.
    Stores all managers in hass.data[DOMAIN][entry.entry_id].
    """
    config = {**DEFAULTS, **entry.data, **entry.options}

    activity_store = ActivityStore(hass, config)
    await activity_store.open()

    token_manager = TokenManager(hass, config)
    await token_manager.load()

    session_manager = SessionManager(config)
    rate_limiter = RateLimiter(config)
    event_bus = EventBus(hass, config)

    action_manager = HarvestActionManager(hass)
    await action_manager.load()

    sensors = DiagnosticSensors(hass, session_manager, activity_store)

    ws_view = HarvestWsView(
        hass, token_manager, session_manager,
        rate_limiter, activity_store, event_bus,
        action_manager, config,
    )
    hass.http.register_view(ws_view)

    register_views(hass, token_manager, session_manager,
                   activity_store, action_manager, sensors)
    register_panel(hass)
    sensors.schedule_updates()

    async_track_time_interval(
        hass,
        lambda _: hass.async_create_task(activity_store.purge_old_records()),
        timedelta(hours=24),
    )

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "token_manager":   token_manager,
        "session_manager": session_manager,
        "rate_limiter":    rate_limiter,
        "activity_store":  activity_store,
        "event_bus":       event_bus,
        "action_manager":  action_manager,
        "sensors":         sensors,
    }

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry.

    Closes the activity store (flushing pending writes).
    Closes all active WebSocket sessions.
    Removes hass.data entry.
    """
    data = hass.data[DOMAIN].pop(entry.entry_id, {})

    if activity_store := data.get("activity_store"):
        await activity_store.close()

    if session_manager := data.get("session_manager"):
        for session in session_manager.get_all():
            await session.ws.close()

    return True
```

---

## 15. Module Dependency Graph

```
__init__.py
  |
  +-- const.py                          (no internal dependencies)
  |
  +-- token_manager.py
  |     +-- const.py
  |
  +-- session_manager.py
  |     +-- token_manager.py            (type hints only)
  |
  +-- entity_compatibility.py
  |     +-- const.py
  |
  +-- entity_definition.py
  |     +-- entity_compatibility.py
  |
  +-- harvest_action.py
  |     +-- const.py
  |     +-- session_manager.py          (type hints only)
  |
  +-- rate_limiter.py                   (no internal dependencies)
  |
  +-- ws_proxy.py
  |     +-- token_manager.py
  |     +-- session_manager.py
  |     +-- entity_compatibility.py
  |     +-- entity_definition.py
  |     +-- harvest_action.py
  |     +-- rate_limiter.py
  |     +-- activity_store.py
  |     +-- event_bus.py
  |     +-- const.py
  |
  +-- http_views.py
  |     +-- token_manager.py
  |     +-- session_manager.py
  |     +-- activity_store.py
  |     +-- harvest_action.py
  |     +-- diagnostic_sensors.py
  |
  +-- activity_store.py
  |     +-- const.py
  |
  +-- event_bus.py
  |     +-- const.py
  |
  +-- diagnostic_sensors.py
  |     +-- session_manager.py
  |     +-- activity_store.py
  |
  +-- panel.py
        +-- const.py
```

No circular dependencies. `ws_proxy.py` is the most complex module with the most dependencies. `const.py` and `entity_compatibility.py` are widely imported and must remain free of circular references.
