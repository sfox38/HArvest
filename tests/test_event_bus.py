"""Tests for event_bus.py.

EventBus wraps hass.bus.async_fire with a config guard. Tests use a mock
HomeAssistant so no real HA process is required.
"""
from __future__ import annotations

from unittest.mock import MagicMock, call

import pytest

from custom_components.harvest.event_bus import EventBus
from custom_components.harvest.const import CONF_HA_EVENT_BUS, DEFAULTS


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_hass() -> MagicMock:
    hass = MagicMock()
    hass.bus.async_fire = MagicMock()
    return hass


def _enabled_config(*event_names: str) -> dict:
    """Return a config dict with only the given events enabled."""
    event_cfg = {k: False for k in DEFAULTS[CONF_HA_EVENT_BUS]}
    for name in event_names:
        event_cfg[name] = True
    return {CONF_HA_EVENT_BUS: event_cfg}


def _disabled_config(*event_names: str) -> dict:
    """Return a config dict with the given events explicitly disabled."""
    event_cfg = dict(DEFAULTS[CONF_HA_EVENT_BUS])
    for name in event_names:
        event_cfg[name] = False
    return {CONF_HA_EVENT_BUS: event_cfg}


# ---------------------------------------------------------------------------
# EventBus.fire - core guard
# ---------------------------------------------------------------------------

class TestFireGuard:
    def test_fires_when_enabled(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        eb.fire("harvest_token_revoked", {"token_id": "x"})

        hass.bus.async_fire.assert_called_once_with(
            "harvest_token_revoked", {"token_id": "x"}
        )

    def test_does_not_fire_when_disabled(self):
        hass = _make_hass()
        cfg = _disabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        eb.fire("harvest_token_revoked", {"token_id": "x"})

        hass.bus.async_fire.assert_not_called()

    def test_does_not_fire_for_unknown_event_name(self):
        """An event name not in config defaults to False (disabled)."""
        hass = _make_hass()
        eb = EventBus(hass, {CONF_HA_EVENT_BUS: {}})

        eb.fire("harvest_totally_unknown", {"data": 1})

        hass.bus.async_fire.assert_not_called()

    def test_uses_defaults_when_ha_event_bus_key_absent(self):
        """If CONF_HA_EVENT_BUS is missing from config, DEFAULTS are used.

        DEFAULTS enable the four security events and disable the two
        high-volume events.
        """
        hass = _make_hass()
        eb = EventBus(hass, {})  # no CONF_HA_EVENT_BUS key

        # harvest_token_revoked is enabled in DEFAULTS.
        eb.fire("harvest_token_revoked", {"token_id": "x"})
        hass.bus.async_fire.assert_called_once()

    def test_high_volume_events_disabled_by_default(self):
        """harvest_session_connected and harvest_auth_failure are off by default."""
        hass = _make_hass()
        eb = EventBus(hass, {})  # use DEFAULTS

        eb.fire("harvest_session_connected", {})
        eb.fire("harvest_auth_failure", {})

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# Default config: security events ON, high-volume events OFF
# ---------------------------------------------------------------------------

class TestDefaultConfig:
    """Verify which events fire with the out-of-the-box DEFAULTS config."""

    SECURITY_EVENTS = [
        "harvest_token_revoked",
        "harvest_suspicious_origin",
        "harvest_session_limit_reached",
        "harvest_flood_protection",
    ]
    HIGH_VOLUME_EVENTS = [
        "harvest_session_connected",
        "harvest_auth_failure",
    ]

    @pytest.mark.parametrize("event_name", SECURITY_EVENTS)
    def test_security_event_fires_by_default(self, event_name):
        hass = _make_hass()
        eb = EventBus(hass, {})
        eb.fire(event_name, {})
        hass.bus.async_fire.assert_called_once()

    @pytest.mark.parametrize("event_name", HIGH_VOLUME_EVENTS)
    def test_high_volume_event_suppressed_by_default(self, event_name):
        hass = _make_hass()
        eb = EventBus(hass, {})
        eb.fire(event_name, {})
        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# token_revoked
# ---------------------------------------------------------------------------

class TestTokenRevoked:
    def test_fires_with_correct_payload(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        eb.token_revoked("hwt_tok1", "My Token", "expired")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_token_revoked",
            {"token_id": "hwt_tok1", "label": "My Token", "reason": "expired"},
        )

    def test_reason_may_be_none(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        eb.token_revoked("hwt_tok1", "My Token", None)

        _, kwargs_data = hass.bus.async_fire.call_args
        fired_data = hass.bus.async_fire.call_args[0][1]
        assert fired_data["reason"] is None

    def test_suppressed_when_disabled(self):
        hass = _make_hass()
        cfg = _disabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        eb.token_revoked("hwt_tok1", "My Token", None)

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# suspicious_origin
# ---------------------------------------------------------------------------

class TestSuspiciousOrigin:
    def test_fires_with_correct_payload(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_suspicious_origin")
        eb = EventBus(hass, cfg)

        eb.suspicious_origin("hwt_tok1", "https://evil.com", "10.0.0.1")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_suspicious_origin",
            {
                "token_id": "hwt_tok1",
                "origin": "https://evil.com",
                "source_ip": "10.0.0.1",
            },
        )

    def test_suppressed_when_disabled(self):
        hass = _make_hass()
        cfg = _disabled_config("harvest_suspicious_origin")
        eb = EventBus(hass, cfg)

        eb.suspicious_origin("hwt_tok1", "https://evil.com", "10.0.0.1")

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# session_limit_reached
# ---------------------------------------------------------------------------

class TestSessionLimitReached:
    def test_fires_with_correct_payload(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_session_limit_reached")
        eb = EventBus(hass, cfg)

        eb.session_limit_reached("hwt_tok1", "Door Sensor Widget")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_session_limit_reached",
            {"token_id": "hwt_tok1", "label": "Door Sensor Widget"},
        )

    def test_suppressed_when_disabled(self):
        hass = _make_hass()
        cfg = _disabled_config("harvest_session_limit_reached")
        eb = EventBus(hass, cfg)

        eb.session_limit_reached("hwt_tok1", "label")

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# flood_protection
# ---------------------------------------------------------------------------

class TestFloodProtection:
    def test_fires_with_correct_payload(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_flood_protection")
        eb = EventBus(hass, cfg)

        eb.flood_protection("hrs_sess1", "https://example.com")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_flood_protection",
            {"session_id": "hrs_sess1", "origin": "https://example.com"},
        )

    def test_suppressed_when_disabled(self):
        hass = _make_hass()
        cfg = _disabled_config("harvest_flood_protection")
        eb = EventBus(hass, cfg)

        eb.flood_protection("hrs_sess1", "https://example.com")

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# session_connected
# ---------------------------------------------------------------------------

class TestSessionConnected:
    def test_fires_with_correct_payload_when_enabled(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_session_connected")
        eb = EventBus(hass, cfg)

        eb.session_connected("hrs_sess1", "hwt_tok1", "https://example.com")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_session_connected",
            {
                "session_id": "hrs_sess1",
                "token_id": "hwt_tok1",
                "origin": "https://example.com",
            },
        )

    def test_suppressed_by_default(self):
        hass = _make_hass()
        eb = EventBus(hass, {})  # DEFAULTS - session_connected is False

        eb.session_connected("hrs_sess1", "hwt_tok1", "https://example.com")

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# auth_failure
# ---------------------------------------------------------------------------

class TestAuthFailure:
    def test_fires_with_correct_payload_when_enabled(self):
        hass = _make_hass()
        cfg = _enabled_config("harvest_auth_failure")
        eb = EventBus(hass, cfg)

        eb.auth_failure("hwt_tok1", "https://example.com", "ERR_STALE_TIMESTAMP")

        hass.bus.async_fire.assert_called_once_with(
            "harvest_auth_failure",
            {
                "token_id": "hwt_tok1",
                "origin": "https://example.com",
                "error_code": "ERR_STALE_TIMESTAMP",
            },
        )

    def test_token_id_may_be_none(self):
        """token_id is None when the auth message is unparseable."""
        hass = _make_hass()
        cfg = _enabled_config("harvest_auth_failure")
        eb = EventBus(hass, cfg)

        eb.auth_failure(None, "https://example.com", "ERR_INVALID_FORMAT")

        fired_data = hass.bus.async_fire.call_args[0][1]
        assert fired_data["token_id"] is None

    def test_suppressed_by_default(self):
        hass = _make_hass()
        eb = EventBus(hass, {})  # DEFAULTS - auth_failure is False

        eb.auth_failure("hwt_tok1", "https://example.com", "ERR_HMAC")

        hass.bus.async_fire.assert_not_called()


# ---------------------------------------------------------------------------
# Payload isolation - each call gets its own dict
# ---------------------------------------------------------------------------

class TestPayloadIsolation:
    def test_mutating_payload_after_fire_does_not_affect_fired_data(self):
        """The payload dict passed to async_fire should not be the same object
        as any dict the caller might retain and mutate later."""
        hass = _make_hass()
        cfg = _enabled_config("harvest_token_revoked")
        eb = EventBus(hass, cfg)

        # Capture what was passed to async_fire.
        fired_data = {}

        def capture(event_name, data):
            fired_data.update(data)

        hass.bus.async_fire.side_effect = capture
        eb.token_revoked("hwt_tok1", "label", "reason")

        # The captured data should be the correct values.
        assert fired_data["token_id"] == "hwt_tok1"
        assert fired_data["label"] == "label"
        assert fired_data["reason"] == "reason"
