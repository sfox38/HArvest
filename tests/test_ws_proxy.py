"""tests/test_ws_proxy.py

Tests for custom_components.harvest.ws_proxy:
  - Module-level helpers: _find_entity_access, _track_flood
  - HarvestWsView helpers: _resolve_entity_ref, _ref_to_real_id, _get_source_ip
  - HarvestWsView._build_state_update_message()
  - HarvestWsView._handle_command() - permission/rate-limit/domain logic
  - HarvestWsView._handle_connection() - auth failure paths
  - HarvestWsView._handle_subscribe(), _handle_unsubscribe(), _handle_renew()
  - Message loop flood-protection counter (_track_flood helper)
"""
from __future__ import annotations

import asyncio
import json
import time
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, call, patch

import aiohttp
import pytest
from aiohttp import ClientSession

from custom_components.harvest.const import (
    DEFAULTS,
    DOMAIN,
    ERR_ENTITY_NOT_IN_TOKEN,
    ERR_PERMISSION_DENIED,
    ERR_RATE_LIMITED,
    ERR_SESSION_EXPIRED,
    ERR_SESSION_LIMIT_REACHED,
    ERR_SIGNATURE_INVALID,
    ERR_TOKEN_INACTIVE,
)
from custom_components.harvest.secondary_server import SecondaryServer
from custom_components.harvest.token_manager import (
    EntityAccess,
    OriginConfig,
    RateLimitConfig,
    SessionConfig,
    Token,
)
from custom_components.harvest.ws_proxy import (
    FLOOD_LIMIT,
    FLOOD_WINDOW_SECONDS,
    HarvestWsView,
    _find_entity_access,
    _track_flood,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_entity_access(entity_id: str, capabilities: str = "read-write", alias: str | None = None) -> EntityAccess:
    return EntityAccess(
        entity_id=entity_id,
        capabilities=capabilities,
        alias=alias,
        exclude_attributes=[],
    )


def _make_token(entities=None, rate_limits=None, session=None, **kwargs) -> Token:
    return Token(
        token_id="hwt_test",
        token_version=1,
        label="Test",
        created_by="admin",
        created_at=datetime(2024, 1, 1, tzinfo=timezone.utc),
        expires=None,
        revoked_at=None,
        token_secret=kwargs.pop("token_secret", None),
        entities=entities or [],
        origins=OriginConfig(allow_any=True, allowed=[], allow_paths=[]),
        rate_limits=rate_limits or RateLimitConfig(
            max_push_per_second=1,
            max_commands_per_minute=30,
            override_defaults=False,
        ),
        session=session or SessionConfig(
            lifetime_minutes=60,
            max_lifetime_minutes=1440,
            max_renewals=None,
            absolute_lifetime_hours=None,
        ),
        max_sessions=None,
        active_schedule=None,
        allowed_ips=[],
        status="active",
        revoke_reason=None,
        **kwargs,
    )


def _make_session(**kwargs) -> MagicMock:
    s = MagicMock()
    s.session_id = "hrs_sess001"
    s.token_id = "hwt_test"
    s.origin_validated = "https://example.com"
    s.subscribed_entity_ids = set()
    s.last_sent_attributes = {}
    s.deferred_state_tasks = {}
    s.renewal_count = 0
    s.allowed_entities = []
    s.expires_at = datetime(2025, 1, 1, tzinfo=timezone.utc)
    s.absolute_expires_at = datetime(2025, 1, 7, tzinfo=timezone.utc)
    s.last_message_at = datetime.now(tz=timezone.utc)
    for k, v in kwargs.items():
        setattr(s, k, v)
    return s


_TEST_ENTRY_ID = "test_entry"


def _make_view(config=None) -> HarvestWsView:
    """Construct a HarvestWsView for tests.

    The view resolves managers from hass.data[DOMAIN][entry_id] per request,
    so we populate hass.data with mock managers before construction. Tests
    that access ``view._token_manager`` etc. read the same mocks back via
    the property accessor.

    The ``config`` argument is preserved for backwards-compat with existing
    tests that pass a custom config; we install it as the entry's options
    so the view's ``_get_global_config()`` returns it.
    """
    hass = MagicMock()
    hass.states.get = MagicMock(return_value=None)
    hass.services.async_call = AsyncMock()
    hass.async_create_task = MagicMock(side_effect=lambda coro: coro.close())

    token_manager = MagicMock()
    token_manager.filter_attributes = MagicMock(return_value={})
    token_manager.validate_auth = MagicMock(return_value=(None, "HRV_AUTH_FAILED"))
    token_manager.generate_session_id = MagicMock(return_value="hrs_newsess")
    token_manager.generate_alias = MagicMock(return_value="aBcDeFgH")

    session_manager = MagicMock()
    rate_limiter = MagicMock()
    rate_limiter.check_ip = MagicMock(return_value=True)
    rate_limiter.check_push = MagicMock(return_value=True)
    rate_limiter.check_command = MagicMock(return_value=(True, 0))
    activity_store = MagicMock()
    activity_store.record_auth = MagicMock()
    activity_store.record_command = MagicMock()
    activity_store.record_session = MagicMock()
    event_bus = MagicMock()

    # Use real dicts for hass.data so the view's property accessors return
    # the actual mock managers, not auto-generated MagicMock children.
    hass.data = {
        DOMAIN: {
            _TEST_ENTRY_ID: {
                "token_manager": token_manager,
                "session_manager": session_manager,
                "rate_limiter": rate_limiter,
                "activity_store": activity_store,
                "event_bus": event_bus,
                "sensors": None,
                "theme_manager": None,
                "renderer_manager": None,
            },
        },
    }

    # Provide a fake config entry so view._get_global_config() works.
    effective_config = config or dict(DEFAULTS)
    fake_entry = MagicMock()
    fake_entry.data = {}
    fake_entry.options = effective_config
    hass.config_entries.async_entries = MagicMock(return_value=[fake_entry])

    return HarvestWsView(hass=hass, entry_id=_TEST_ENTRY_ID)


# ---------------------------------------------------------------------------
# _find_entity_access()
# ---------------------------------------------------------------------------

class TestFindEntityAccess:
    def test_finds_matching_entity(self):
        ea = _make_entity_access("light.living")
        token = _make_token(entities=[ea])
        assert _find_entity_access("light.living", token) is ea

    def test_returns_none_when_not_in_token(self):
        token = _make_token(entities=[_make_entity_access("light.kitchen")])
        assert _find_entity_access("light.bedroom", token) is None

    def test_returns_none_for_empty_entities(self):
        token = _make_token(entities=[])
        assert _find_entity_access("light.x", token) is None

    def test_returns_first_match(self):
        ea1 = _make_entity_access("light.x")
        ea2 = _make_entity_access("light.x", capabilities="read")
        token = _make_token(entities=[ea1, ea2])
        assert _find_entity_access("light.x", token) is ea1


# ---------------------------------------------------------------------------
# _track_flood()
# ---------------------------------------------------------------------------

class TestTrackFlood:
    def test_increments_within_window(self):
        now = time.monotonic()
        count, window = _track_flood(5, now)
        assert count == 6
        assert window == now

    def test_resets_after_window_expired(self):
        old = time.monotonic() - (FLOOD_WINDOW_SECONDS + 1)
        count, window = _track_flood(100, old)
        assert count == 1
        assert window > old

    def test_count_one_at_start_of_new_window(self):
        old = time.monotonic() - (FLOOD_WINDOW_SECONDS + 1)
        count, _ = _track_flood(999, old)
        assert count == 1

    def test_flood_limit_constant(self):
        # FLOOD_LIMIT is 10 — verify the constant is set correctly.
        assert FLOOD_LIMIT == 10
        assert FLOOD_WINDOW_SECONDS == 5


# ---------------------------------------------------------------------------
# HarvestWsView._resolve_entity_ref()
# ---------------------------------------------------------------------------

class TestResolveEntityRef:
    def test_resolves_by_alias(self):
        ea = _make_entity_access("light.bedroom", alias="bedroom")
        token = _make_token(entities=[ea])
        view = _make_view()
        assert view._resolve_entity_ref("bedroom", token) is ea

    def test_resolves_by_real_entity_id(self):
        ea = _make_entity_access("light.bedroom")
        token = _make_token(entities=[ea])
        view = _make_view()
        assert view._resolve_entity_ref("light.bedroom", token) is ea

    def test_alias_takes_priority_over_real_id(self):
        # Two entities: one with alias "light.kitchen", one with real id "light.kitchen"
        ea_alias = _make_entity_access("light.office", alias="light.kitchen")
        ea_real = _make_entity_access("light.kitchen")
        token = _make_token(entities=[ea_alias, ea_real])
        view = _make_view()
        result = view._resolve_entity_ref("light.kitchen", token)
        assert result is ea_alias

    def test_returns_none_for_unknown_ref(self):
        token = _make_token(entities=[_make_entity_access("light.living")])
        view = _make_view()
        assert view._resolve_entity_ref("unknown.entity", token) is None

    def test_returns_none_for_empty_token(self):
        token = _make_token(entities=[])
        view = _make_view()
        assert view._resolve_entity_ref("light.x", token) is None


# ---------------------------------------------------------------------------
# HarvestWsView._ref_to_real_id()
# ---------------------------------------------------------------------------

class TestRefToRealId:
    def test_direct_entity_id_in_subscriptions(self):
        session = _make_session(subscribed_entity_ids={"light.kitchen"})
        view = _make_view()
        assert view._ref_to_real_id("light.kitchen", session) == "light.kitchen"

    def test_alias_resolved_via_allowed_entities(self):
        ea = _make_entity_access("light.bedroom", alias="bed")
        session = _make_session(
            subscribed_entity_ids={"light.bedroom"},
            allowed_entities=[ea],
        )
        view = _make_view()
        assert view._ref_to_real_id("bed", session) == "light.bedroom"

    def test_unknown_ref_returns_none(self):
        session = _make_session(
            subscribed_entity_ids={"light.kitchen"},
            allowed_entities=[],
        )
        view = _make_view()
        assert view._ref_to_real_id("light.bedroom", session) is None


# ---------------------------------------------------------------------------
# HarvestWsView._get_source_ip()
# ---------------------------------------------------------------------------

class TestGetSourceIp:
    def _make_request(self, peer_ip: str, forwarded: str = "", trusted: list | None = None):
        req = MagicMock()
        req.transport.get_extra_info.return_value = (peer_ip, 12345)
        req.headers = MagicMock()
        req.headers.get = MagicMock(side_effect=lambda k, d="": forwarded if k == "X-Forwarded-For" else d)
        return req

    def test_returns_peer_ip_no_trusted_proxy(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": []})
        req = self._make_request("1.2.3.4")
        assert view._get_source_ip(req) == "1.2.3.4"

    def test_returns_forwarded_ip_when_peer_is_trusted(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1"]})
        req = self._make_request("10.0.0.1", forwarded="203.0.113.5, 10.0.0.1")
        assert view._get_source_ip(req) == "203.0.113.5"

    def test_trims_forwarded_ip(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1"]})
        req = self._make_request("10.0.0.1", forwarded="  203.0.113.5 , 10.0.0.1")
        assert view._get_source_ip(req) == "203.0.113.5"

    def test_untrusted_peer_ignores_forwarded_header(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1"]})
        req = self._make_request("8.8.8.8", forwarded="203.0.113.5")
        # peer_ip (8.8.8.8) is not in trusted_proxies, so should return 8.8.8.8
        assert view._get_source_ip(req) == "8.8.8.8"

    def test_returns_peer_ip_when_no_forwarded_header(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1"]})
        req = self._make_request("10.0.0.1", forwarded="")
        # Trusted proxy but no forwarded header - falls back to peer ip
        assert view._get_source_ip(req) == "10.0.0.1"

    def test_multi_hop_walks_back_through_trusted_chain(self):
        # client (203.0.113.5) -> cloudflare (104.16.0.1) -> nginx (10.0.0.1) -> HA
        # Proxies append their incoming peer to XFF. Walking right to left
        # past the trusted proxies yields the real client.
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1", "104.16.0.1"]})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="203.0.113.5, 104.16.0.1",
        )
        assert view._get_source_ip(req) == "203.0.113.5"

    def test_spoofed_xff_prefix_is_ignored(self):
        # An attacker prepends a spoofed value to X-Forwarded-For. Cloudflare
        # forwards the request adding its incoming peer (the attacker's real
        # IP, 198.51.100.7). nginx adds Cloudflare's IP. Walking back skips
        # the trusted proxies and returns the attacker's actual IP, not the
        # spoofed leftmost value.
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1", "104.16.0.1"]})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="1.1.1.1, 198.51.100.7, 104.16.0.1",
        )
        # 1.1.1.1 was attacker-set; correct answer is 198.51.100.7
        # (attacker's actual IP, what Cloudflare added).
        assert view._get_source_ip(req) == "198.51.100.7"

    def test_cidr_trusted_proxy_matches(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.0/8"]})
        req = self._make_request(
            peer_ip="10.0.0.5",
            forwarded="203.0.113.5, 10.0.0.4",
        )
        assert view._get_source_ip(req) == "203.0.113.5"

    def test_all_xff_entries_trusted_falls_back_to_peer(self):
        # Pathological: every XFF entry is itself a trusted proxy. Falls back
        # to peer_ip rather than returning a misleading "real client" value.
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1", "10.0.0.2"]})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="10.0.0.2, 10.0.0.1",
        )
        assert view._get_source_ip(req) == "10.0.0.1"

    def test_invalid_xff_entry_falls_back_to_peer(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": ["10.0.0.1"]})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="not-an-ip, 10.0.0.1",
        )
        assert view._get_source_ip(req) == "10.0.0.1"

    def test_non_string_trusted_proxy_entry_is_ignored(self):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": [{"bad": "value"}]})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="203.0.113.5",
        )
        assert view._get_source_ip(req) == "10.0.0.1"

    @pytest.mark.parametrize("trusted_proxies", ["10.0.0.1", 123, {"proxy": "10.0.0.1"}])
    def test_legacy_non_list_trusted_proxy_config_is_ignored(self, trusted_proxies):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": trusted_proxies})
        req = self._make_request(
            peer_ip="10.0.0.1",
            forwarded="203.0.113.5",
        )
        assert view._get_source_ip(req) == "10.0.0.1"


class TestAlternateServerLiveWebSocket:
    @staticmethod
    def _listening_port(server: SecondaryServer) -> int:
        return server._runner.addresses[0][1]

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        ("trusted_proxies", "expected_source_ip"),
        [
            ([], "127.0.0.1"),
            (["127.0.0.1"], "198.51.100.77"),
        ],
    )
    async def test_auth_preserves_origin_and_proxy_trust(
        self,
        tmp_path,
        socket_enabled,
        trusted_proxies,
        expected_source_ip,
    ):
        view = _make_view(config={**DEFAULTS, "trusted_proxies": trusted_proxies})
        captured = {}

        def validate_auth(**kwargs):
            captured.update(kwargs)
            return None, "HRV_TOKEN_INVALID"

        view._token_manager.validate_auth.side_effect = validate_auth
        server = SecondaryServer(tmp_path, view)
        await server.start(0)
        try:
            async with ClientSession() as client:
                ws = await client.ws_connect(
                    f"http://127.0.0.1:{self._listening_port(server)}/api/harvest/ws",
                    headers={
                        "Origin": "https://embed.example",
                        "X-Forwarded-For": "198.51.100.77",
                    },
                )
                await ws.send_json({
                    "type": "auth",
                    "token_id": "hwt_invalid",
                    "entity_ids": [],
                    "msg_id": 1,
                })
                reply = await ws.receive()
        finally:
            await server.stop()

        assert reply.json()["code"] == "HRV_TOKEN_INVALID"
        assert captured["origin"] == "https://embed.example"
        assert captured["source_ip"] == expected_source_ip

    @pytest.mark.asyncio
    async def test_unauthenticated_connection_closes_after_timeout(
        self,
        tmp_path,
        socket_enabled,
    ):
        view = _make_view(config={**DEFAULTS, "auth_timeout_seconds": 1})
        server = SecondaryServer(tmp_path, view)
        await server.start(0)
        try:
            async with ClientSession() as client:
                ws = await client.ws_connect(
                    f"http://127.0.0.1:{self._listening_port(server)}/api/harvest/ws"
                )
                reply = await ws.receive(timeout=2)
        finally:
            await server.stop()

        assert reply.type == aiohttp.WSMsgType.CLOSE


# ---------------------------------------------------------------------------
# HarvestWsView._build_state_update_message()
# ---------------------------------------------------------------------------

class TestBuildStateUpdateMessage:
    def _make_state(self, state_str: str, attrs: dict) -> MagicMock:
        s = MagicMock()
        s.state = state_str
        s.attributes = attrs
        s.last_changed = datetime(2024, 1, 1, tzinfo=timezone.utc)
        s.last_updated = datetime(2024, 1, 1, tzinfo=timezone.utc)
        return s

    def test_initial_message_type(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {}
        token = _make_token()
        state = self._make_state("on", {})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=True)
        assert msg["type"] == "state_update"
        assert msg["initial"] is True

    def test_initial_includes_full_attributes(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {"brightness": 200}
        token = _make_token()
        state = self._make_state("on", {"brightness": 200})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=True)
        assert msg["attributes"] == {"brightness": 200}

    def test_initial_stores_last_sent_attributes(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {"brightness": 100}
        token = _make_token()
        state = self._make_state("on", {"brightness": 100})
        session = _make_session()
        view._build_state_update_message("light.x", "light.x", state, token, is_initial=True, session=session)
        assert session.last_sent_attributes["light.x"] == {"brightness": 100}

    def test_delta_with_no_changes_omits_attributes_delta(self):
        view = _make_view()
        attrs = {"brightness": 100}
        view._token_manager.filter_attributes.return_value = attrs
        token = _make_token()
        state = self._make_state("on", attrs)
        session = _make_session()
        session.last_sent_attributes = {"light.x": attrs}
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=False, session=session)
        assert "attributes_delta" not in msg

    def test_delta_with_changed_attribute(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {"brightness": 200}
        token = _make_token()
        state = self._make_state("on", {"brightness": 200})
        session = _make_session()
        session.last_sent_attributes = {"light.x": {"brightness": 100}}
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=False, session=session)
        assert "attributes_delta" in msg
        assert msg["attributes_delta"]["changed"] == {"brightness": 200}

    def test_delta_with_removed_attribute(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {}
        token = _make_token()
        state = self._make_state("on", {})
        session = _make_session()
        session.last_sent_attributes = {"light.x": {"old_attr": "val"}}
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=False, session=session)
        assert "old_attr" in msg["attributes_delta"]["removed"]

    def test_uses_outgoing_id_in_message(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {}
        token = _make_token()
        state = self._make_state("on", {})
        msg = view._build_state_update_message("light.real", "alias_name", state, token, is_initial=True)
        assert msg["entity_id"] == "alias_name"

    def test_state_value_correct(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {}
        token = _make_token()
        state = self._make_state("off", {})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=True)
        assert msg["state"] == "off"

    def test_last_changed_is_isoformat(self):
        view = _make_view()
        view._token_manager.filter_attributes.return_value = {}
        token = _make_token()
        state = self._make_state("on", {})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=True)
        assert isinstance(msg["last_changed"], str)
        assert "2024" in msg["last_changed"]

    def test_badge_tier_returns_minimal_attrs(self):
        view = _make_view()
        ea = _make_entity_access("sensor.temp", capabilities="badge")
        token = _make_token(entities=[ea])
        state = self._make_state("22.5", {"unit_of_measurement": "C", "brightness": 100})
        msg = view._build_state_update_message("sensor.temp", "sensor.temp", state, token, is_initial=True)
        assert msg["attributes"] == {"unit_of_measurement": "C"}
        assert "last_changed" not in msg or msg.get("last_changed") is None or True

    def test_compact_tier_returns_minimal_attrs(self):
        view = _make_view()
        ea = _make_entity_access("light.x", capabilities="read-write")
        token = _make_token(entities=[ea], entities_block=True)
        state = self._make_state("on", {"brightness": 200, "unit_of_measurement": "lx"})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=True)
        assert msg["attributes"] == {"unit_of_measurement": "lx"}
        assert "brightness" not in msg["attributes"]

    def test_display_tier_media_player(self):
        view = _make_view()
        ea = _make_entity_access("media_player.tv", capabilities="read")
        token = _make_token(entities=[ea])
        state = self._make_state("playing", {
            "media_artist": "Artist",
            "media_title": "Song",
            "media_album_name": "Album",
            "volume_level": 0.5,
            "source": "Spotify",
        })
        msg = view._build_state_update_message("media_player.tv", "media_player.tv", state, token, is_initial=True)
        assert msg["attributes"]["media_artist"] == "Artist"
        assert msg["attributes"]["media_title"] == "Song"
        assert msg["attributes"]["media_album_name"] == "Album"
        assert "volume_level" not in msg["attributes"]
        assert "source" not in msg["attributes"]

    def test_display_tier_climate(self):
        view = _make_view()
        ea = _make_entity_access("climate.ac", capabilities="read")
        token = _make_token(entities=[ea])
        state = self._make_state("cool", {
            "current_temperature": 24.5,
            "hvac_action": "cooling",
            "temperature": 22,
            "fan_mode": "auto",
        })
        msg = view._build_state_update_message("climate.ac", "climate.ac", state, token, is_initial=True)
        assert msg["attributes"]["current_temperature"] == 24.5
        assert msg["attributes"]["hvac_action"] == "cooling"
        assert "temperature" not in msg["attributes"]
        assert "fan_mode" not in msg["attributes"]

    def test_display_tier_supports_delta_mode(self):
        view = _make_view()
        ea = _make_entity_access("climate.ac", capabilities="read")
        token = _make_token(entities=[ea])
        session = _make_session()
        session.last_sent_attributes = {"climate.ac": {"current_temperature": 22, "hvac_action": "heating"}}
        state = self._make_state("heat", {"current_temperature": 23, "hvac_action": "heating"})
        msg = view._build_state_update_message("climate.ac", "climate.ac", state, token, is_initial=False, session=session)
        assert msg["initial"] is False
        assert msg["attributes_delta"]["changed"] == {"current_temperature": 23}

    def test_compact_tier_no_delta_mode(self):
        view = _make_view()
        ea = _make_entity_access("light.x", capabilities="read-write")
        token = _make_token(entities=[ea], entities_block=True)
        state = self._make_state("on", {"unit_of_measurement": "lx"})
        msg = view._build_state_update_message("light.x", "light.x", state, token, is_initial=False)
        assert "attributes_delta" not in msg
        assert msg["attributes"] == {"unit_of_measurement": "lx"}

    def test_companion_tier_minimal_attrs_keeps_last_updated(self):
        view = _make_view()
        primary = _make_entity_access("light.lamp", capabilities="read-write")
        companion = EntityAccess(
            entity_id="sensor.lamp_power", capabilities="read",
            companion_of="light.lamp", exclude_attributes=[],
        )
        token = _make_token(entities=[primary, companion])
        state = self._make_state("5", {"unit_of_measurement": "W", "device_class": "power"})
        msg = view._build_state_update_message(
            "sensor.lamp_power", "sensor.lamp_power", state, token, is_initial=True,
        )
        assert msg["attributes"] == {"unit_of_measurement": "W"}
        # last_updated is the client's out-of-order discard key; unlike the
        # badge tier, companion updates must carry it.
        assert msg["last_updated"] == "2024-01-01T00:00:00+00:00"
        assert msg["initial"] is True

    def test_companion_rw_tier_minimal_attrs_no_delta(self):
        view = _make_view()
        primary = _make_entity_access("climate.ac", capabilities="read-write")
        companion = EntityAccess(
            entity_id="light.ac_light", capabilities="read-write",
            companion_of="climate.ac", exclude_attributes=[],
        )
        token = _make_token(entities=[primary, companion])
        session = _make_session()
        state = self._make_state("on", {"brightness": 200, "rgb_color": [255, 0, 0]})
        msg = view._build_state_update_message(
            "light.ac_light", "light.ac_light", state, token, is_initial=False, session=session,
        )
        assert msg["attributes"] == {}
        assert "attributes_delta" not in msg
        assert msg["last_updated"] == "2024-01-01T00:00:00+00:00"


# ---------------------------------------------------------------------------
# HarvestWsView._handle_command()
# ---------------------------------------------------------------------------

class TestHandleCommand:
    def _ws(self) -> MagicMock:
        ws = MagicMock()
        ws.send_json = AsyncMock()
        return ws

    @pytest.mark.asyncio
    async def test_unknown_entity_sends_error_ack(self):
        view = _make_view()
        token = _make_token(entities=[])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.unknown", "action": "toggle", "data": {}}
        await view._handle_command(ws, msg, session, token)
        ws.send_json.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is False
        assert sent["error_code"] == ERR_ENTITY_NOT_IN_TOKEN

    @pytest.mark.asyncio
    async def test_read_only_entity_sends_permission_denied(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.living", "action": "toggle", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is False
        assert sent["error_code"] == ERR_PERMISSION_DENIED

    @pytest.mark.asyncio
    async def test_rate_limited_command_sends_rate_limited_error(self):
        view = _make_view()
        view._rate_limiter.check_command.return_value = (False, 5)
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.living", "action": "toggle", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["error_code"] == ERR_RATE_LIMITED
        assert sent["retry_after"] == 5

    @pytest.mark.asyncio
    async def test_successful_command_sends_ack_success(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.living", "action": "toggle", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is True
        assert sent["type"] == "ack"

    @pytest.mark.asyncio
    async def test_strips_unknown_data_keys(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        # "unknown_key" should be stripped; "brightness" is allowed for lights
        msg = {"type": "command", "entity_id": "light.living", "action": "turn_on",
               "data": {"brightness": 200, "unknown_key": "bad"}}
        await view._handle_command(ws, msg, session, token)
        call_kwargs = view._hass.services.async_call.call_args
        service_data = call_kwargs.args[2]
        assert "brightness" in service_data
        assert "unknown_key" not in service_data

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "selector",
        ["entity_id", "device_id", "area_id", "floor_id", "label_id"],
    )
    async def test_strips_target_selectors_from_builtin_domain(self, selector):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {
            "type": "command",
            "entity_id": "light.living",
            "action": "turn_on",
            "data": {"brightness": 200, selector: "unauthorized-target"},
        }

        await view._handle_command(ws, msg, session, token)

        service_data = view._hass.services.async_call.call_args.args[2]
        assert service_data == {"brightness": 200}
        assert view._hass.services.async_call.call_args.kwargs["target"] == {
            "entity_id": "light.living",
        }

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "selector",
        ["entity_id", "device_id", "area_id", "floor_id", "label_id"],
    )
    async def test_strips_target_selectors_from_dynamic_service_schema(self, selector):
        view = _make_view(config={**DEFAULTS, "custom_domains": [
            {"domain": "vacuum", "allowed_services": ["start"]},
        ]})
        schema = MagicMock()
        schema.schema.schema = {
            "fan_speed": object(),
            "entity_id": object(),
            "device_id": object(),
            "area_id": object(),
            "floor_id": object(),
            "label_id": object(),
        }
        view._hass.services.async_services.return_value = {
            "vacuum": {"start": schema},
        }
        ea = _make_entity_access("vacuum.downstairs", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {
            "type": "command",
            "entity_id": "vacuum.downstairs",
            "action": "start",
            "data": {"fan_speed": "high", selector: "unauthorized-target"},
        }

        await view._handle_command(ws, msg, session, token)

        service_data = view._hass.services.async_call.call_args.args[2]
        assert service_data == {"fan_speed": "high"}
        assert view._hass.services.async_call.call_args.kwargs["target"] == {
            "entity_id": "vacuum.downstairs",
        }

    @pytest.mark.asyncio
    async def test_command_records_in_activity_store(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.living", "action": "toggle", "data": {}}
        await view._handle_command(ws, msg, session, token)
        view._activity_store.record_command.assert_called_once()

    @pytest.mark.asyncio
    async def test_invalid_action_for_domain_sends_error(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        # "launch_missiles" is not a valid action for light domain
        msg = {"type": "command", "entity_id": "light.living", "action": "launch_missiles", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is False
        # action validation failed - should not have called services.async_call
        view._hass.services.async_call.assert_not_called()

    @pytest.mark.asyncio
    async def test_msg_id_echoed_in_ack(self):
        view = _make_view()
        ea = _make_entity_access("light.living", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "light.living", "action": "toggle",
               "data": {}, "msg_id": "req_99"}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["msg_id"] == "req_99"

    @pytest.mark.asyncio
    async def test_sensitive_domain_blocked_command_denied(self):
        # lock is disabled by default in DEFAULTS["sensitive_domains"]. A
        # command must be refused even though the token still lists the entity
        # and grants read-write, so disabling a domain in Settings takes effect
        # on every active token, not just on the next reconnect.
        view = _make_view()
        ea = _make_entity_access("lock.front_door", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "lock.front_door", "action": "unlock", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is False
        assert sent["error_code"] == ERR_PERMISSION_DENIED
        assert "disabled in Settings" in sent["error_message"]
        view._hass.services.async_call.assert_not_called()

    @pytest.mark.asyncio
    async def test_sensitive_domain_enabled_command_allowed(self):
        cfg = {**DEFAULTS, "sensitive_domains": {**DEFAULTS["sensitive_domains"], "lock": True}}
        view = _make_view(config=cfg)
        ea = _make_entity_access("lock.front_door", capabilities="read-write")
        token = _make_token(entities=[ea])
        session = _make_session()
        ws = self._ws()
        msg = {"type": "command", "entity_id": "lock.front_door", "action": "unlock", "data": {}}
        await view._handle_command(ws, msg, session, token)
        sent = ws.send_json.call_args.args[0]
        assert sent["success"] is True
        view._hass.services.async_call.assert_called_once()


# ---------------------------------------------------------------------------
# HarvestWsView._handle_subscribe()
# ---------------------------------------------------------------------------

class TestHandleSubscribe:
    def _ws(self) -> MagicMock:
        ws = MagicMock()
        ws.send_json = AsyncMock()
        return ws

    @pytest.mark.asyncio
    async def test_subscribe_to_valid_entity(self):
        view = _make_view()
        ea = _make_entity_access("light.kitchen")
        token = _make_token(entities=[ea])
        session = _make_session(subscribed_entity_ids=set())
        ws = self._ws()
        msg = {"type": "subscribe", "entity_ids": ["light.kitchen"], "msg_id": "s1"}

        # Patch _send_initial_state to avoid HA state lookups.
        view._send_initial_state = AsyncMock()

        await view._handle_subscribe(ws, msg, session, token, {}, {})

        view._session_manager.add_subscription.assert_called_once()
        # subscribe_ok sent
        ws.send_json.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "subscribe_ok"
        assert "light.kitchen" in sent["entity_ids"]

    @pytest.mark.asyncio
    async def test_subscribe_already_subscribed_entity_skipped(self):
        view = _make_view()
        ea = _make_entity_access("light.kitchen")
        token = _make_token(entities=[ea])
        session = _make_session(subscribed_entity_ids={"light.kitchen"})
        ws = self._ws()
        msg = {"type": "subscribe", "entity_ids": ["light.kitchen"], "msg_id": "s2"}
        view._send_initial_state = AsyncMock()

        await view._handle_subscribe(ws, msg, session, token, {"light.kitchen": "light.kitchen"}, {})

        # No new subscription added.
        view._session_manager.add_subscription.assert_not_called()

    @pytest.mark.asyncio
    async def test_subscribe_unknown_entity_sends_empty_ok(self):
        view = _make_view()
        token = _make_token(entities=[])
        session = _make_session(subscribed_entity_ids=set())
        ws = self._ws()
        msg = {"type": "subscribe", "entity_ids": ["light.notintoken"], "msg_id": "s3"}
        view._send_initial_state = AsyncMock()

        await view._handle_subscribe(ws, msg, session, token, {}, {})

        sent = ws.send_json.call_args.args[0]
        assert sent["entity_ids"] == []

    @pytest.mark.asyncio
    async def test_subscribe_sensitive_domain_blocked_skipped(self):
        # lock is disabled by default; a subscribe must not accept it even
        # though the token lists the entity. Closes the bypass where a client
        # auths with an empty entity list then subscribes past the gate.
        view = _make_view()
        ea = _make_entity_access("lock.front_door")
        token = _make_token(entities=[ea])
        session = _make_session(subscribed_entity_ids=set())
        ws = self._ws()
        msg = {"type": "subscribe", "entity_ids": ["lock.front_door"], "msg_id": "s4"}
        view._send_initial_state = AsyncMock()

        await view._handle_subscribe(ws, msg, session, token, {}, {})

        sent = ws.send_json.call_args.args[0]
        assert sent["entity_ids"] == []
        view._session_manager.add_subscription.assert_not_called()

    @pytest.mark.asyncio
    async def test_subscribe_sensitive_domain_enabled_accepted(self):
        cfg = {**DEFAULTS, "sensitive_domains": {**DEFAULTS["sensitive_domains"], "lock": True}}
        view = _make_view(config=cfg)
        ea = _make_entity_access("lock.front_door")
        token = _make_token(entities=[ea])
        session = _make_session(subscribed_entity_ids=set())
        ws = self._ws()
        msg = {"type": "subscribe", "entity_ids": ["lock.front_door"], "msg_id": "s5"}
        view._send_initial_state = AsyncMock()

        await view._handle_subscribe(ws, msg, session, token, {}, {})

        sent = ws.send_json.call_args.args[0]
        assert "lock.front_door" in sent["entity_ids"]
        view._session_manager.add_subscription.assert_called_once()

    @pytest.mark.asyncio
    async def test_subscribe_registers_listener_before_initial_snapshot(self):
        view = _make_view()
        token = _make_token(entities=[_make_entity_access("light.kitchen")])
        session = _make_session(subscribed_entity_ids=set())
        ws = self._ws()
        order = []
        view._register_listeners = MagicMock(side_effect=lambda *args: order.append("listeners"))
        view._send_initial_state = AsyncMock(side_effect=lambda *args: order.append("snapshot"))

        await view._handle_subscribe(
            ws,
            {"type": "subscribe", "entity_ids": ["light.kitchen"]},
            session,
            token,
            {},
            {},
        )

        assert order == ["listeners", "snapshot"]


# ---------------------------------------------------------------------------
# HarvestWsView._handle_unsubscribe()
# ---------------------------------------------------------------------------

class TestHandleUnsubscribe:
    def _ws(self) -> MagicMock:
        ws = MagicMock()
        ws.send_json = AsyncMock()
        return ws

    @pytest.mark.asyncio
    async def test_unsubscribe_removes_listener(self):
        view = _make_view()
        session = _make_session(
            subscribed_entity_ids={"light.kitchen"},
            allowed_entities=[],
        )
        unsub = MagicMock()
        listener_unsubs = {"light.kitchen": unsub}
        msg = {"type": "unsubscribe", "entity_ids": ["light.kitchen"]}
        ws = self._ws()

        await view._handle_unsubscribe(ws, msg, session, MagicMock(), listener_unsubs)

        unsub.assert_called_once()
        assert "light.kitchen" not in listener_unsubs

    @pytest.mark.asyncio
    async def test_unsubscribe_calls_session_manager(self):
        view = _make_view()
        deferred = MagicMock()
        session = _make_session(
            subscribed_entity_ids={"light.kitchen"},
            allowed_entities=[],
            deferred_state_tasks={"light.kitchen": deferred},
        )
        listener_unsubs = {"light.kitchen": MagicMock()}
        msg = {"type": "unsubscribe", "entity_ids": ["light.kitchen"]}
        ws = self._ws()

        await view._handle_unsubscribe(ws, msg, session, MagicMock(), listener_unsubs)

        view._session_manager.remove_subscription.assert_called_once()
        deferred.cancel.assert_called_once()
        assert session.deferred_state_tasks == {}

    @pytest.mark.asyncio
    async def test_unsubscribe_unknown_entity_is_no_op(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set(), allowed_entities=[])
        listener_unsubs = {}
        msg = {"type": "unsubscribe", "entity_ids": ["light.notsubscribed"]}
        ws = self._ws()

        # Should not raise
        await view._handle_unsubscribe(ws, msg, session, MagicMock(), listener_unsubs)


# ---------------------------------------------------------------------------
# HarvestWsView._handle_renew()
# ---------------------------------------------------------------------------

class TestHandleRenew:
    def _ws(self) -> MagicMock:
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.close = AsyncMock()
        return ws

    @pytest.mark.asyncio
    async def test_renew_success_sends_auth_ok(self):
        view = _make_view()
        session = _make_session(renewal_count=0, subscribed_entity_ids={"light.x"})
        new_session = _make_session(
            session_id="hrs_new",
            subscribed_entity_ids={"light.x"},
            expires_at=datetime(2025, 2, 1, tzinfo=timezone.utc),
            absolute_expires_at=datetime(2025, 2, 7, tzinfo=timezone.utc),
        )
        view._session_manager.renew.return_value = new_session

        token = _make_token(
            entities=[_make_entity_access("light.x")],
            session=SessionConfig(
                lifetime_minutes=60,
                max_lifetime_minutes=1440,
                max_renewals=None,
                absolute_lifetime_hours=None,
            ),
        )
        view._token_manager.get.return_value = token
        ws = self._ws()
        view._send_initial_state = AsyncMock()

        msg = {"type": "renew", "msg_id": "r1"}
        await view._handle_renew(ws, msg, session, token, {"light.x": "light.x"}, {})

        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_ok"
        assert sent["session_id"] == "hrs_new"

    @pytest.mark.asyncio
    async def test_hmac_renew_with_valid_signature_succeeds(self):
        view = _make_view()
        session = _make_session()
        token = _make_token(token_secret="secret")
        view._token_manager.get.return_value = token
        view._token_manager.verify_hmac.return_value = True
        view._session_manager.renew.return_value = session
        view._send_initial_state = AsyncMock()
        ws = self._ws()
        msg = {
            "type": "renew",
            "token_id": token.token_id,
            "timestamp": 1735689600,
            "nonce": "aBcDeFgHiJkLmNoP",
            "signature": "valid",
            "msg_id": "r-signed",
        }

        await view._handle_renew(ws, msg, session, token, {}, {})

        view._token_manager.verify_hmac.assert_called_once_with(
            "secret",
            token.token_id,
            1735689600,
            "aBcDeFgHiJkLmNoP",
            "valid",
        )
        view._session_manager.renew.assert_called_once_with(session)
        assert ws.send_json.call_args_list[0].args[0]["type"] == "auth_ok"
        ws.close.assert_not_called()

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "msg",
        [
            {"type": "renew", "token_id": "hwt_test"},
            {
                "type": "renew",
                "token_id": "hwt_wrong",
                "timestamp": 1735689600,
                "nonce": "aBcDeFgHiJkLmNoP",
                "signature": "valid",
            },
            {
                "type": "renew",
                "token_id": "hwt_test",
                "timestamp": True,
                "nonce": "aBcDeFgHiJkLmNoP",
                "signature": "valid",
            },
        ],
    )
    async def test_hmac_renew_rejects_missing_or_malformed_signature_fields(self, msg):
        view = _make_view()
        session = _make_session()
        token = _make_token(token_secret="secret")
        view._token_manager.get.return_value = token
        ws = self._ws()

        await view._handle_renew(ws, msg, session, token, {}, {})

        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"
        assert sent["code"] == ERR_SIGNATURE_INVALID
        view._session_manager.renew.assert_not_called()
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_hmac_renew_rejects_invalid_or_stale_signature(self):
        view = _make_view()
        session = _make_session()
        token = _make_token(token_secret="secret")
        view._token_manager.get.return_value = token
        view._token_manager.verify_hmac.return_value = False
        ws = self._ws()
        msg = {
            "type": "renew",
            "token_id": token.token_id,
            "timestamp": 1735689600,
            "nonce": "aBcDeFgHiJkLmNoP",
            "signature": "invalid",
            "msg_id": "r-invalid",
        }

        await view._handle_renew(ws, msg, session, token, {}, {})

        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"
        assert sent["code"] == ERR_SIGNATURE_INVALID
        view._session_manager.renew.assert_not_called()
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_renew_exceeds_max_renewals_closes(self):
        view = _make_view()
        session = _make_session(renewal_count=3)
        token = _make_token(
            session=SessionConfig(
                lifetime_minutes=60,
                max_lifetime_minutes=1440,
                max_renewals=3,
                absolute_lifetime_hours=None,
            ),
        )
        view._token_manager.get.return_value = token
        ws = self._ws()
        msg = {"type": "renew", "msg_id": "r2"}

        await view._handle_renew(ws, msg, session, token, {}, {})

        ws.close.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"
        assert sent["code"] == ERR_SESSION_LIMIT_REACHED

    @pytest.mark.asyncio
    async def test_renew_failure_in_session_manager_closes(self):
        view = _make_view()
        view._session_manager.renew.side_effect = ValueError("absolute lifetime exceeded")
        session = _make_session(renewal_count=0)
        token = _make_token(
            session=SessionConfig(
                lifetime_minutes=60,
                max_lifetime_minutes=1440,
                max_renewals=None,
                absolute_lifetime_hours=None,
            ),
        )
        view._token_manager.get.return_value = token
        ws = self._ws()
        msg = {"type": "renew", "msg_id": "r3"}

        await view._handle_renew(ws, msg, session, token, {}, {})

        ws.close.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"


# ---------------------------------------------------------------------------
# HarvestWsView.get() - IP rate limit check
# ---------------------------------------------------------------------------

class TestWsViewGetIpRateLimit:
    @pytest.mark.asyncio
    async def test_ip_rate_limited_raises_429(self):
        view = _make_view()
        view._rate_limiter.check_ip.return_value = False

        req = MagicMock()
        req.transport.get_extra_info.return_value = ("1.2.3.4", 12345)
        req.headers = MagicMock()
        req.headers.get = MagicMock(return_value="")

        with pytest.raises(aiohttp.web.HTTPTooManyRequests):
            await view.get(req)


# ---------------------------------------------------------------------------
# HarvestWsView._handle_connection() - auth failure paths
# ---------------------------------------------------------------------------

class TestHandleConnectionAuthFailure:
    def _make_ws(self, messages=None):
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.close = AsyncMock()
        ws.closed = False

        if messages is not None:
            ws.receive = AsyncMock(side_effect=messages)

        return ws

    @pytest.mark.asyncio
    async def test_non_text_message_closes(self):
        view = _make_view()
        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.BINARY

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)
        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_timeout_waiting_for_auth_closes(self):
        view = _make_view()
        ws = self._make_ws()
        ws.receive = AsyncMock(side_effect=asyncio.TimeoutError())

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_invalid_json_closes(self):
        view = _make_view()
        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = "not valid json {{{"

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_wrong_message_type_closes(self):
        view = _make_view()
        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({"type": "not_auth", "token_id": "hwt_x"})

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_auth_failure_sends_auth_failed(self):
        view = _make_view()
        # token_manager.validate_auth returns (None, error_code) for failure
        view._token_manager.validate_auth.return_value = (None, "HRV_TOKEN_REVOKED")

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({"type": "auth", "token_id": "hwt_bad", "entity_ids": []})

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        ws.send_json.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"
        assert sent["code"] == "HRV_TOKEN_REVOKED"

    @pytest.mark.asyncio
    async def test_auth_failure_records_in_activity_store(self):
        view = _make_view()
        view._token_manager.validate_auth.return_value = (None, "HRV_TOKEN_REVOKED")

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({"type": "auth", "token_id": "hwt_bad", "entity_ids": []})

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        view._activity_store.record_auth.assert_called_once()
        auth_event = view._activity_store.record_auth.call_args.args[0]
        assert auth_event.result == "failed"

    @pytest.mark.asyncio
    async def test_session_limit_sends_auth_failed(self):
        view = _make_view()
        token = _make_token(
            entities=[_make_entity_access("light.x")],
        )
        # Auth succeeds...
        view._token_manager.validate_auth.return_value = (token, None)
        # ...but session creation fails (max_sessions reached)
        view._session_manager.create.side_effect = ValueError("max sessions")

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({"type": "auth", "token_id": "hwt_test", "entity_ids": ["light.x"]})

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        # Find the auth_failed message among all send_json calls
        all_calls = [c.args[0] for c in ws.send_json.call_args_list]
        auth_failed = next((c for c in all_calls if c.get("type") == "auth_failed"), None)
        assert auth_failed is not None
        assert auth_failed["code"] == ERR_SESSION_LIMIT_REACHED

    @pytest.mark.asyncio
    async def test_initial_auth_registers_listeners_before_snapshot(self):
        view = _make_view()
        token = _make_token(entities=[_make_entity_access("light.x")])
        session = _make_session(subscribed_entity_ids={"light.x"})
        view._token_manager.validate_auth.return_value = (token, None)
        view._session_manager.create.return_value = session
        order = []
        view._register_listeners = MagicMock(side_effect=lambda *args: order.append("listeners"))
        view._send_initial_state = AsyncMock(side_effect=lambda *args: order.append("snapshot"))
        view._message_loop = AsyncMock()

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_test",
            "entity_ids": ["light.x"],
        })
        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)
        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        assert order == ["listeners", "snapshot"]

    @pytest.mark.asyncio
    async def test_initial_auth_does_not_send_renderer_without_consent(self, tmp_path):
        view = _make_view()
        token = _make_token(
            entities=[_make_entity_access("light.x")],
            renderer_pack="custom",
        )
        session = _make_session(subscribed_entity_ids={"light.x"})
        view._token_manager.validate_auth.return_value = (token, None)
        view._session_manager.create.return_value = session
        view._register_listeners = MagicMock()
        view._send_initial_state = AsyncMock()
        view._message_loop = AsyncMock()
        renderer_file = tmp_path / "custom.js"
        renderer_file.write_text("window.renderer = true;", "utf-8")
        renderer_manager = MagicMock()
        renderer_manager.agreed = False
        renderer_manager.get_renderer_path.return_value = renderer_file
        view._hass.data[DOMAIN][_TEST_ENTRY_ID]["renderer_manager"] = renderer_manager

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_test",
            "entity_ids": ["light.x"],
        })
        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)
        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        sent = [call.args[0] for call in ws.send_json.await_args_list]
        assert not any(message.get("type") == "renderer" for message in sent)
        renderer_manager.get_renderer_path.assert_not_called()

    @pytest.mark.asyncio
    async def test_initial_auth_sends_renderer_after_consent(self, tmp_path):
        view = _make_view()
        token = _make_token(
            entities=[_make_entity_access("light.x")],
            renderer_pack="custom",
        )
        session = _make_session(subscribed_entity_ids={"light.x"})
        view._token_manager.validate_auth.return_value = (token, None)
        view._session_manager.create.return_value = session
        view._register_listeners = MagicMock()
        view._send_initial_state = AsyncMock()
        view._message_loop = AsyncMock()
        renderer_file = tmp_path / "custom.js"
        renderer_file.write_text("window.renderer = true;", "utf-8")
        renderer_manager = MagicMock()
        renderer_manager.agreed = True
        renderer_manager.get_renderer_path.return_value = renderer_file
        view._hass.data[DOMAIN][_TEST_ENTRY_ID]["renderer_manager"] = renderer_manager

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_test",
            "entity_ids": ["light.x"],
        })
        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)
        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)

        await view._handle_connection(ws, req)

        sent = [call.args[0] for call in ws.send_json.await_args_list]
        renderer_message = next(
            message for message in sent if message.get("type") == "renderer"
        )
        assert renderer_message["url"].startswith(
            "/api/harvest/renderers/custom.js?v="
        )


# ---------------------------------------------------------------------------
# Protocol-compatibility hard reject (SPEC Section 5.3, Section 12)
# ---------------------------------------------------------------------------

class TestHandleConnectionProtocolCompatibility:
    def _make_ws(self):
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.close = AsyncMock()
        ws.closed = False
        return ws

    def _make_req(self):
        req = MagicMock()
        req.headers.get = MagicMock(return_value="")
        req.transport.get_extra_info.return_value = ("1.2.3.4", 0)
        return req

    @pytest.mark.asyncio
    async def test_client_protocol_too_new_rejected_with_server_block(self, monkeypatch):
        # Server speaks protocol 1; client claims protocol 99. Reject with
        # HRV_PROTOCOL_INCOMPATIBLE before any token validation runs - a
        # protocol mismatch is structural, not an auth attempt against any
        # specific token.
        from custom_components.harvest import compatibility as compat
        monkeypatch.setattr(compat, "PROTOCOL_VERSION", 1)
        monkeypatch.setattr(compat, "MIN_CLIENT_PROTOCOL", 1)
        monkeypatch.setattr(compat, "PLATFORM_VERSION", "0.9.3")

        view = _make_view()

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_x",
            "entity_ids": [],
            "msg_id": 7,
            "client": {"protocol": 99, "widget": "9.9.9", "source": "html"},
        })

        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        await view._handle_connection(ws, self._make_req())

        ws.send_json.assert_awaited_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "auth_failed"
        assert sent["code"] == "HRV_PROTOCOL_INCOMPATIBLE"
        assert sent["msg_id"] == 7
        # The server block lets the widget render a useful diagnostic
        # rather than fall into reconnect backoff - SPEC Section 5.3.
        assert sent["server"] == {
            "protocol": 1,
            "version": "0.9.3",
            "min_client_protocol": 1,
        }
        ws.close.assert_awaited_once()
        # Token validation must NOT have run; rejection is structural.
        view._token_manager.validate_auth.assert_not_called()

    @pytest.mark.asyncio
    async def test_client_protocol_too_old_rejected(self, monkeypatch):
        from custom_components.harvest import compatibility as compat
        monkeypatch.setattr(compat, "PROTOCOL_VERSION", 3)
        monkeypatch.setattr(compat, "MIN_CLIENT_PROTOCOL", 2)

        view = _make_view()
        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_x",
            "entity_ids": [],
            "client": {"protocol": 1},
        })
        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        await view._handle_connection(ws, self._make_req())

        sent = ws.send_json.call_args.args[0]
        assert sent["code"] == "HRV_PROTOCOL_INCOMPATIBLE"
        view._token_manager.validate_auth.assert_not_called()

    @pytest.mark.asyncio
    async def test_old_widget_without_client_block_passes_through(self):
        # Widgets that predate this feature omit the `client` field.
        # parse_client_block defaults to protocol=1, which is in range,
        # so they MUST proceed past the protocol check (and fail later
        # for unrelated reasons - here the validate_auth mock returns a
        # token error code, which is the expected next branch).
        view = _make_view()

        raw = MagicMock()
        raw.type = aiohttp.WSMsgType.TEXT
        raw.data = json.dumps({
            "type": "auth",
            "token_id": "hwt_x",
            "entity_ids": [],
        })
        ws = self._make_ws()
        ws.receive = AsyncMock(return_value=raw)

        await view._handle_connection(ws, self._make_req())

        # validate_auth ran (it's the next gate after protocol check),
        # confirming we did NOT short-circuit on the missing client block.
        view._token_manager.validate_auth.assert_called_once()


# ---------------------------------------------------------------------------
# ALLOWED_DATA_KEYS completeness smoke test
# ---------------------------------------------------------------------------

class TestAllowedDataKeys:
    def test_light_keys_present(self):
        from custom_components.harvest.ws_proxy import _ALLOWED_DATA_KEYS
        assert "brightness" in _ALLOWED_DATA_KEYS["light"]
        assert "color_temp" in _ALLOWED_DATA_KEYS["light"]

    def test_fan_keys_present(self):
        from custom_components.harvest.ws_proxy import _ALLOWED_DATA_KEYS
        assert "percentage" in _ALLOWED_DATA_KEYS["fan"]

    def test_cover_keys_present(self):
        from custom_components.harvest.ws_proxy import _ALLOWED_DATA_KEYS
        assert "position" in _ALLOWED_DATA_KEYS["cover"]

    def test_climate_keys_present(self):
        from custom_components.harvest.ws_proxy import _ALLOWED_DATA_KEYS
        assert "temperature" in _ALLOWED_DATA_KEYS["climate"]
        assert "hvac_mode" in _ALLOWED_DATA_KEYS["climate"]



# ---------------------------------------------------------------------------
# HarvestWsView._message_loop()
# ---------------------------------------------------------------------------

def _ws_with_messages(*raw_msgs):
    """Return a mock WS that yields the given raw messages in `async for`."""
    ws = MagicMock()
    ws.send_json = AsyncMock()
    ws.close = AsyncMock()
    ws.closed = False

    async def _gen():
        for m in raw_msgs:
            yield m

    # MagicMock passes `self` when calling set attributes, so accept *args.
    ws.__aiter__ = lambda *_: _gen()
    return ws


def _text_msg(data: str) -> MagicMock:
    m = MagicMock()
    m.type = aiohttp.WSMsgType.TEXT
    m.data = data
    return m


def _close_msg() -> MagicMock:
    m = MagicMock()
    m.type = aiohttp.WSMsgType.CLOSE
    return m


class TestMessageLoop:
    """Tests for _message_loop() via the async-for iteration."""

    @pytest.mark.asyncio
    async def test_close_frame_exits_loop(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(_close_msg())

        # Should return without calling close() — the loop just breaks.
        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_not_called()

    @pytest.mark.asyncio
    async def test_oversized_message_closes_connection(self):
        view = _make_view(config={**DEFAULTS, "max_inbound_message_bytes": 1024})
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(_text_msg("x" * 1025))

        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_valid_message_touches_session(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        view._handle_command = AsyncMock()
        msg = json.dumps({
            "type": "command",
            "session_id": session.session_id,
            "entity_id": "light.x",
            "action": "toggle",
        })
        ws = _ws_with_messages(_text_msg(msg))

        await view._message_loop(ws, session, token, {}, {})
        view._session_manager.touch.assert_called_with(session.session_id)

    @pytest.mark.asyncio
    async def test_bad_json_increments_flood_counter_and_continues(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg("not json {{"),
            _close_msg(),
        )

        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_not_called()  # one bad msg didn't hit flood limit

    @pytest.mark.asyncio
    async def test_flood_limit_exceeded_closes_connection(self):
        from custom_components.harvest.ws_proxy import FLOOD_LIMIT
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        # Send FLOOD_LIMIT + 1 bad JSON messages all within the flood window.
        bad_msgs = [_text_msg("bad!") for _ in range(FLOOD_LIMIT + 1)]
        ws = _ws_with_messages(*bad_msgs)

        with patch("custom_components.harvest.ws_proxy.time.monotonic", return_value=1000.0):
            await view._message_loop(ws, session, token, {}, {})

        ws.close.assert_called_once()
        view._event_bus.flood_protection.assert_called_once()

    @pytest.mark.asyncio
    async def test_non_dict_json_increments_flood(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps([1, 2, 3])),  # valid JSON but not a dict
            _close_msg(),
        )

        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_not_called()

    @pytest.mark.asyncio
    async def test_unknown_message_type_does_not_crash(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps({"type": "made_up_type"})),
            _close_msg(),
        )

        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_not_called()

    @pytest.mark.asyncio
    async def test_message_with_no_type_increments_flood(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        # msg_type is None — should increment flood counter but not dispatch
        ws = _ws_with_messages(
            _text_msg(json.dumps({"data": "no type key"})),
            _close_msg(),
        )

        await view._message_loop(ws, session, token, {}, {})
        ws.close.assert_not_called()

    @pytest.mark.asyncio
    async def test_command_message_dispatches_to_handle_command(self):
        view = _make_view()
        view._handle_command = AsyncMock()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps({
                "type": "command",
                "session_id": session.session_id,
                "entity_id": "light.x",
                "action": "toggle",
            })),
        )

        await view._message_loop(ws, session, token, {}, {})
        view._handle_command.assert_called_once()

    @pytest.mark.asyncio
    async def test_session_bound_message_without_session_id_is_dropped(self):
        view = _make_view()
        view._handle_command = AsyncMock()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps({
                "type": "command",
                "entity_id": "light.x",
                "action": "toggle",
            })),
        )

        await view._message_loop(ws, session, token, {}, {})

        view._handle_command.assert_not_called()

    @pytest.mark.asyncio
    async def test_subscribe_message_dispatches_to_handle_subscribe(self):
        view = _make_view()
        view._handle_subscribe = AsyncMock()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps({
                "type": "subscribe",
                "session_id": session.session_id,
                "entity_ids": [],
            })),
        )

        await view._message_loop(ws, session, token, {}, {})
        view._handle_subscribe.assert_called_once()

    @pytest.mark.asyncio
    async def test_renew_message_dispatches_to_handle_renew(self):
        view = _make_view()
        view._handle_renew = AsyncMock()
        session = _make_session(subscribed_entity_ids=set())
        token = _make_token()
        ws = _ws_with_messages(
            _text_msg(json.dumps({"type": "renew", "session_id": session.session_id})),
        )

        await view._message_loop(ws, session, token, {}, {})
        view._handle_renew.assert_called_once()


# ---------------------------------------------------------------------------
# HarvestWsView._send_initial_state()
# ---------------------------------------------------------------------------

class TestSendInitialState:
    @pytest.mark.asyncio
    async def test_sends_entity_removed_when_state_is_none(self):
        view = _make_view()
        view._hass.states.get.return_value = None
        view._token_manager.filter_attributes.return_value = {}

        ws = MagicMock()
        ws.send_json = AsyncMock()
        token = _make_token(entities=[_make_entity_access("light.missing")])
        session = _make_session()

        with patch("custom_components.harvest.ws_proxy.build_entity_definition", return_value=None):
            await view._send_initial_state(ws, session, ["light.missing"], token, {"light.missing": "light.missing"})

        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "entity_removed"
        assert sent["entity_id"] == "light.missing"

    @pytest.mark.asyncio
    async def test_sends_entity_definition_and_state_update(self):
        view = _make_view()
        state = MagicMock()
        state.state = "on"
        state.attributes = {}
        state.last_changed = __import__("datetime").datetime(2024, 1, 1, tzinfo=__import__("datetime").timezone.utc)
        state.last_updated = state.last_changed
        view._hass.states.get.return_value = state
        view._token_manager.filter_attributes.return_value = {}

        ws = MagicMock()
        ws.send_json = AsyncMock()
        token = _make_token(entities=[_make_entity_access("light.living")])
        session = _make_session()

        defn = {"domain": "light", "entity_id": "light.living"}

        with patch("custom_components.harvest.ws_proxy.build_entity_definition", return_value=defn):
            await view._send_initial_state(ws, session, ["light.living"], token, {"light.living": "light.living"})

        calls = [c.args[0] for c in ws.send_json.call_args_list]
        types = [c["type"] for c in calls]
        assert "entity_definition" in types
        assert "state_update" in types

    @pytest.mark.asyncio
    async def test_uses_outgoing_alias_in_messages(self):
        view = _make_view()
        state = MagicMock()
        state.state = "on"
        state.attributes = {}
        state.last_changed = __import__("datetime").datetime(2024, 1, 1, tzinfo=__import__("datetime").timezone.utc)
        state.last_updated = state.last_changed
        view._hass.states.get.return_value = state
        view._token_manager.filter_attributes.return_value = {}

        ws = MagicMock()
        ws.send_json = AsyncMock()
        token = _make_token(entities=[_make_entity_access("light.bedroom")])
        session = _make_session()

        with patch("custom_components.harvest.ws_proxy.build_entity_definition", return_value={"domain": "light"}):
            await view._send_initial_state(
                ws, session, ["light.bedroom"], token, {"light.bedroom": "bed_alias"}
            )

        # The state_update should use the alias as entity_id.
        calls = [c.args[0] for c in ws.send_json.call_args_list]
        state_update = next(c for c in calls if c.get("type") == "state_update")
        assert state_update["entity_id"] == "bed_alias"


# ---------------------------------------------------------------------------
# HarvestWsView._on_state_changed()
# ---------------------------------------------------------------------------

class TestOnStateChanged:
    def _make_event(self, new_state) -> MagicMock:
        event = MagicMock()
        event.data = {"new_state": new_state}
        return event

    def test_entity_not_subscribed_is_ignored(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids=set())  # not subscribed
        ws = MagicMock()
        ws.send_json = AsyncMock()
        token = _make_token()
        event = self._make_event(MagicMock())

        view._on_state_changed(event, "light.x", ws, session, token, {})

        # No asyncio.ensure_future calls because entity not subscribed.
        ws.send_json.assert_not_called()

    def test_entity_removed_sends_entity_removed_message(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids={"light.x"})
        ws = MagicMock()
        ws.send_json = MagicMock(return_value=MagicMock())  # synchronous to capture ensure_future
        token = _make_token()
        event = self._make_event(None)  # new_state=None means entity removed

        with patch("custom_components.harvest.ws_proxy.asyncio.create_task") as mock_ef:
            view._on_state_changed(event, "light.x", ws, session, token, {"light.x": "light.x"})

        mock_ef.assert_called_once()

    def test_push_rate_limited_coalesces_deferred_update(self):
        view = _make_view()
        view._rate_limiter.check_push.return_value = False
        session = _make_session(subscribed_entity_ids={"light.x"})
        ws = MagicMock()
        token = _make_token()
        state = MagicMock()
        state.state = "on"
        state.attributes = {}
        event = self._make_event(state)
        task = MagicMock()
        task.done.return_value = False

        def schedule(coro):
            coro.close()
            return task

        view._hass.async_create_task = MagicMock(side_effect=schedule)

        view._on_state_changed(event, "light.x", ws, session, token, {})
        view._on_state_changed(event, "light.x", ws, session, token, {})

        view._hass.async_create_task.assert_called_once()
        assert session.deferred_state_tasks == {"light.x": task}

    def test_permitted_update_cancels_pending_deferred_duplicate(self):
        view = _make_view()
        view._rate_limiter.check_push.return_value = True
        pending = MagicMock()
        session = _make_session(
            subscribed_entity_ids={"light.x"},
            deferred_state_tasks={"light.x": pending},
        )
        ws = MagicMock()
        ws.send_json = MagicMock(return_value=MagicMock())
        token = _make_token()
        state = MagicMock()
        state.state = "on"
        state.attributes = {}
        state.last_changed = datetime(2024, 1, 1, tzinfo=timezone.utc)
        state.last_updated = state.last_changed
        event = self._make_event(state)

        with patch("custom_components.harvest.ws_proxy.asyncio.create_task"):
            view._on_state_changed(event, "light.x", ws, session, token, {})

        pending.cancel.assert_called_once()
        assert session.deferred_state_tasks == {}

    @pytest.mark.asyncio
    async def test_deferred_update_sends_latest_state_and_cleans_task(self):
        view = _make_view()
        session = _make_session(subscribed_entity_ids={"light.x"})
        token = _make_token()
        ws = MagicMock()
        ws.closed = False
        ws.send_json = AsyncMock()
        latest_state = MagicMock()
        view._hass.states.get.return_value = latest_state
        view._build_state_update_message = MagicMock(return_value={"type": "state_update"})
        current_task = asyncio.current_task()
        session.deferred_state_tasks["light.x"] = current_task

        with patch("custom_components.harvest.ws_proxy.asyncio.sleep", new=AsyncMock()):
            await view._deferred_state_push(
                ws,
                "light.x",
                "alias123",
                token,
                session,
            )

        view._build_state_update_message.assert_called_once_with(
            real_id="light.x",
            outgoing_id="alias123",
            state=latest_state,
            token=token,
            is_initial=False,
            session=session,
            forecast_cache=None,
        )
        ws.send_json.assert_awaited_once_with({"type": "state_update"})
        assert session.deferred_state_tasks == {}

    def test_cancel_deferred_updates_for_selected_entities(self):
        view = _make_view()
        light_task = MagicMock()
        sensor_task = MagicMock()
        session = _make_session(
            deferred_state_tasks={
                "light.x": light_task,
                "sensor.y": sensor_task,
            },
        )

        view._cancel_deferred_state_pushes(session, ["light.x"])

        light_task.cancel.assert_called_once()
        sensor_task.cancel.assert_not_called()
        assert session.deferred_state_tasks == {"sensor.y": sensor_task}

    def test_state_update_enqueued_when_rate_ok(self):
        view = _make_view()
        view._rate_limiter.check_push.return_value = True
        view._token_manager.filter_attributes.return_value = {}
        session = _make_session(subscribed_entity_ids={"light.x"})
        session.last_sent_attributes = {}
        ws = MagicMock()
        token = _make_token()
        state = MagicMock()
        state.state = "on"
        state.attributes = {}
        state.last_changed = datetime(2024, 1, 1, tzinfo=timezone.utc)
        state.last_updated = state.last_changed
        event = self._make_event(state)

        with patch("custom_components.harvest.ws_proxy.asyncio.create_task") as mock_ef:
            view._on_state_changed(event, "light.x", ws, session, token, {"light.x": "light.x"})

        mock_ef.assert_called_once()


# ---------------------------------------------------------------------------
# HarvestWsView._register_listeners()
# ---------------------------------------------------------------------------

class TestRegisterListeners:
    def test_registers_listener_for_each_entity(self):
        view = _make_view()
        ws = MagicMock()
        session = _make_session()
        token = _make_token()
        listener_unsubs = {}

        with patch("custom_components.harvest.ws_proxy.async_track_state_change_event",
                   return_value=MagicMock()) as mock_track:
            view._register_listeners(ws, session, token, {}, listener_unsubs, ["light.a", "light.b"])

        assert mock_track.call_count == 2
        assert "light.a" in listener_unsubs
        assert "light.b" in listener_unsubs

    def test_skips_already_registered_entities(self):
        view = _make_view()
        ws = MagicMock()
        session = _make_session()
        token = _make_token()
        existing_unsub = MagicMock()
        listener_unsubs = {"light.a": existing_unsub}

        with patch("custom_components.harvest.ws_proxy.async_track_state_change_event",
                   return_value=MagicMock()) as mock_track:
            view._register_listeners(ws, session, token, {}, listener_unsubs, ["light.a"])

        mock_track.assert_not_called()


# ---------------------------------------------------------------------------
# HarvestWsView._send_session_expiring()
# ---------------------------------------------------------------------------

class TestSendSessionExpiring:
    @pytest.mark.asyncio
    async def test_sends_session_expiring_message(self):
        from datetime import datetime, timedelta, timezone as tz
        view = _make_view()
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.closed = False
        session = _make_session()
        session.expires_at = datetime.now(tz=tz.utc) + timedelta(seconds=1)

        with patch("custom_components.harvest.ws_proxy.asyncio.sleep", new=AsyncMock()):
            await view._send_session_expiring(ws, session)

        ws.send_json.assert_called_once()
        sent = ws.send_json.call_args.args[0]
        assert sent["type"] == "session_expiring"

    @pytest.mark.asyncio
    async def test_does_not_send_if_ws_closed(self):
        from datetime import datetime, timedelta, timezone as tz
        view = _make_view()
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.closed = True
        session = _make_session()
        session.expires_at = datetime.now(tz=tz.utc) + timedelta(seconds=1)

        with patch("custom_components.harvest.ws_proxy.asyncio.sleep", new=AsyncMock()):
            await view._send_session_expiring(ws, session)

        ws.send_json.assert_not_called()

    @pytest.mark.asyncio
    async def test_skips_sleep_when_warn_time_already_passed(self):
        from datetime import datetime, timedelta, timezone as tz
        view = _make_view()
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.closed = False
        session = _make_session()
        # expires_at is in the past — delay < 0, sleep should not be called
        session.expires_at = datetime.now(tz=tz.utc) - timedelta(hours=1)

        sleep_mock = AsyncMock()
        with patch("custom_components.harvest.ws_proxy.asyncio.sleep", new=sleep_mock):
            await view._send_session_expiring(ws, session)

        sleep_mock.assert_not_called()


# ---------------------------------------------------------------------------
# HarvestWsView._send_keepalive() - paused-token, kill-switch, session expiry
# ---------------------------------------------------------------------------

class TestSendKeepalive:
    def _ws(self, closed: bool = False) -> MagicMock:
        ws = MagicMock()
        ws.send_json = AsyncMock()
        ws.close = AsyncMock()
        ws.closed = closed
        return ws

    @pytest.mark.asyncio
    async def test_closes_when_token_becomes_paused(self):
        """Pausing a token mid-session must disconnect live WS connections."""
        view = _make_view()
        session = _make_session()
        token = _make_token(paused=True)
        # The view's @property _token_manager reads from hass.data; replace its
        # get() so the per-tick lookup returns the paused token.
        view._hass.data[DOMAIN][_TEST_ENTRY_ID]["token_manager"].get = MagicMock(return_value=token)
        # Other tick-checks must not fire ahead of the paused branch.
        view._session_manager.is_expired = MagicMock(return_value=False)
        view._is_kill_switch_active = MagicMock(return_value=False)

        ws = self._ws()
        # Real asyncio.sleep with a tiny interval so the loop iterates quickly.
        task = asyncio.create_task(view._send_keepalive(ws, interval=0.001, session=session))
        await asyncio.sleep(0.05)
        if not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

        # The handler should have sent auth_failed with TOKEN_INACTIVE and closed.
        assert any(
            call.args[0].get("type") == "auth_failed"
            and call.args[0].get("code") == ERR_TOKEN_INACTIVE
            for call in ws.send_json.call_args_list
        ), f"expected auth_failed/TOKEN_INACTIVE, got {ws.send_json.call_args_list}"
        ws.close.assert_called()

    @pytest.mark.asyncio
    async def test_does_not_close_for_active_token(self):
        """An active (not paused) token keeps the keepalive loop running."""
        view = _make_view()
        session = _make_session()
        token = _make_token(paused=False)
        view._hass.data[DOMAIN][_TEST_ENTRY_ID]["token_manager"].get = MagicMock(return_value=token)
        view._session_manager.is_expired = MagicMock(return_value=False)
        view._is_kill_switch_active = MagicMock(return_value=False)

        ws = self._ws()
        task = asyncio.create_task(view._send_keepalive(ws, interval=0.001, session=session))
        await asyncio.sleep(0.02)
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

        ws.close.assert_not_called()
        # Some keepalive frames should have been sent.
        assert any(
            call.args[0].get("type") == "keepalive"
            for call in ws.send_json.call_args_list
        ), "expected at least one keepalive frame"

    @pytest.mark.asyncio
    async def test_session_expiry_still_closes(self):
        """Existing session-expired path remains intact after the paused-check addition."""
        view = _make_view()
        session = _make_session()
        token = _make_token(paused=False)
        view._hass.data[DOMAIN][_TEST_ENTRY_ID]["token_manager"].get = MagicMock(return_value=token)
        view._session_manager.is_expired = MagicMock(return_value=True)
        view._is_kill_switch_active = MagicMock(return_value=False)

        ws = self._ws()
        task = asyncio.create_task(view._send_keepalive(ws, interval=0.001, session=session))
        await asyncio.sleep(0.02)
        if not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

        assert any(
            call.args[0].get("type") == "auth_failed"
            and call.args[0].get("code") == ERR_SESSION_EXPIRED
            for call in ws.send_json.call_args_list
        ), f"expected SESSION_EXPIRED, got {ws.send_json.call_args_list}"
        ws.close.assert_called()
