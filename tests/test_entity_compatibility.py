"""Tests for entity_compatibility.py.

No HA dependencies - all functions are pure Python.
"""
from __future__ import annotations

import pytest

from custom_components.harvest.const import ERR_ENTITY_INCOMPATIBLE, ERR_PERMISSION_DENIED
from custom_components.harvest.entity_compatibility import (
    ALLOWED_SERVICES,
    COMPANION_ALLOWED_DOMAINS,
    TIER1_DOMAINS,
    TIER3_DOMAINS,
    SupportTier,
    get_blocked_reason,
    get_renderer_name,
    get_support_tier,
    is_companion_allowed,
    validate_action,
    validate_entity,
)


# ---------------------------------------------------------------------------
# get_support_tier
# ---------------------------------------------------------------------------

class TestGetSupportTier:
    def test_tier1_domains_return_fully_supported(self):
        for domain in TIER1_DOMAINS:
            assert get_support_tier(domain) == SupportTier.FULLY_SUPPORTED

    def test_tier3_domains_return_blocked(self):
        for domain in TIER3_DOMAINS:
            assert get_support_tier(domain) == SupportTier.BLOCKED

    def test_unknown_domain_returns_generic(self):
        assert get_support_tier("todo") == SupportTier.GENERIC
        assert get_support_tier("calendar") == SupportTier.GENERIC

    def test_tier3_takes_priority_over_tier1(self):
        # None of the Tier 3 domains should be in Tier 1
        overlap = set(TIER3_DOMAINS) & set(TIER1_DOMAINS)
        assert not overlap, f"Tier 3 / Tier 1 overlap: {overlap}"

    def test_light_is_tier1(self):
        assert get_support_tier("light") == SupportTier.FULLY_SUPPORTED

    def test_alarm_control_panel_is_blocked(self):
        assert get_support_tier("alarm_control_panel") == SupportTier.BLOCKED

    def test_lock_is_tier1(self):
        assert get_support_tier("lock") == SupportTier.FULLY_SUPPORTED

    def test_person_is_tier1(self):
        assert get_support_tier("person") == SupportTier.FULLY_SUPPORTED

    def test_button_is_tier1(self):
        assert get_support_tier("button") == SupportTier.FULLY_SUPPORTED

    def test_number_is_tier1(self):
        assert get_support_tier("number") == SupportTier.FULLY_SUPPORTED


# ---------------------------------------------------------------------------
# validate_entity
# ---------------------------------------------------------------------------

class TestValidateEntity:
    def test_tier3_domain_returns_error(self):
        assert validate_entity("alarm_control_panel") == ERR_ENTITY_INCOMPATIBLE
        assert validate_entity("camera") == ERR_ENTITY_INCOMPATIBLE

    def test_tier1_domain_returns_none(self):
        assert validate_entity("light") is None
        assert validate_entity("switch") is None
        assert validate_entity("lock") is None
        assert validate_entity("person") is None
        assert validate_entity("button") is None
        assert validate_entity("number") is None

    def test_tier2_domain_returns_none(self):
        assert validate_entity("weather") is None
        assert validate_entity("todo") is None


# ---------------------------------------------------------------------------
# validate_action
# ---------------------------------------------------------------------------

class TestValidateAction:
    def test_allowed_action_returns_none(self):
        assert validate_action("light", "turn_on") is None
        assert validate_action("light", "turn_off") is None
        assert validate_action("light", "toggle") is None

    def test_disallowed_action_returns_error(self):
        assert validate_action("light", "delete") == ERR_PERMISSION_DENIED
        assert validate_action("light", "set_hvac_mode") == ERR_PERMISSION_DENIED

    def test_unknown_domain_rejects_all_actions(self):
        assert validate_action("weather", "update") == ERR_PERMISSION_DENIED
        assert validate_action("todo", "add_item") == ERR_PERMISSION_DENIED

    def test_sensor_has_no_allowed_actions(self):
        # sensor intentionally absent from ALLOWED_SERVICES (read-only)
        assert "sensor" not in ALLOWED_SERVICES
        assert validate_action("sensor", "turn_on") == ERR_PERMISSION_DENIED

    def test_lock_actions(self):
        assert validate_action("lock", "lock") is None
        assert validate_action("lock", "unlock") is None
        assert validate_action("lock", "open") is None
        assert validate_action("lock", "turn_on") == ERR_PERMISSION_DENIED

    def test_button_actions(self):
        assert validate_action("button", "press") is None
        assert validate_action("button", "turn_on") == ERR_PERMISSION_DENIED

    def test_number_actions(self):
        assert validate_action("number", "set_value") is None
        assert validate_action("number", "turn_on") == ERR_PERMISSION_DENIED

    def test_person_has_no_allowed_actions(self):
        # person is read-only - no service calls permitted
        assert "person" not in ALLOWED_SERVICES
        assert validate_action("person", "turn_on") == ERR_PERMISSION_DENIED

    def test_cover_actions(self):
        assert validate_action("cover", "open_cover") is None
        assert validate_action("cover", "close_cover") is None
        assert validate_action("cover", "stop_cover") is None
        assert validate_action("cover", "set_cover_position") is None
        assert validate_action("cover", "turn_on") == ERR_PERMISSION_DENIED

    def test_climate_actions(self):
        assert validate_action("climate", "set_temperature") is None
        assert validate_action("climate", "set_hvac_mode") is None
        assert validate_action("climate", "turn_on") is None
        assert validate_action("climate", "turn_off") is None
        assert validate_action("climate", "toggle") == ERR_PERMISSION_DENIED

    def test_media_player_actions(self):
        assert validate_action("media_player", "media_play_pause") is None
        assert validate_action("media_player", "volume_set") is None
        assert validate_action("media_player", "seek") == ERR_PERMISSION_DENIED

    def test_fan_actions(self):
        assert validate_action("fan", "set_percentage") is None
        assert validate_action("fan", "oscillate") is None
        assert validate_action("fan", "set_direction") is None
        assert validate_action("fan", "set_speed") == ERR_PERMISSION_DENIED


# ---------------------------------------------------------------------------
# is_companion_allowed
# ---------------------------------------------------------------------------

class TestIsCompanionAllowed:
    def test_allowed_companion_domains(self):
        for domain in COMPANION_ALLOWED_DOMAINS:
            assert is_companion_allowed(domain), f"{domain} should be companion-allowed"

    def test_sensor_is_companion_allowed(self):
        # sensor is companion-allowed: useful for displaying readings (e.g. a
        # temperature sensor next to a climate card). Read-only by nature.
        assert is_companion_allowed("sensor")

    def test_fan_is_companion_allowed(self):
        # fan is companion-allowed: shown as a compact toggle indicator.
        assert is_companion_allowed("fan")

    def test_climate_not_companion_allowed(self):
        assert not is_companion_allowed("climate")

    def test_media_player_not_companion_allowed(self):
        assert not is_companion_allowed("media_player")

    def test_weather_is_companion_allowed(self):
        # weather is companion-allowed read-only: shows outdoor temperature and
        # condition alongside a climate card.
        assert is_companion_allowed("weather")

    def test_lock_is_companion_allowed(self):
        # lock is Tier 1 and companion-allowed: useful as a status indicator
        # alongside a door or switch card.
        assert is_companion_allowed("lock")
        assert get_support_tier("lock") == SupportTier.FULLY_SUPPORTED

    def test_person_is_companion_allowed(self):
        # person is companion-allowed read-only: home/away presence indicator
        # alongside a lock or light card.
        assert is_companion_allowed("person")

    def test_button_is_companion_allowed(self):
        assert is_companion_allowed("button")


# ---------------------------------------------------------------------------
# get_renderer_name
# ---------------------------------------------------------------------------

class TestGetRendererName:
    def test_sensor_temperature_device_class(self):
        assert get_renderer_name("sensor", "temperature") == "TemperatureSensorCard"

    def test_sensor_humidity_device_class(self):
        assert get_renderer_name("sensor", "humidity") == "HumiditySensorCard"

    def test_sensor_battery_device_class(self):
        assert get_renderer_name("sensor", "battery") == "BatterySensorCard"

    def test_sensor_unknown_device_class_falls_back_to_tier1(self):
        assert get_renderer_name("sensor", "power") == "GenericSensorCard"

    def test_sensor_no_device_class_falls_back_to_tier1(self):
        assert get_renderer_name("sensor", None) == "GenericSensorCard"

    def test_tier1_domain_returns_correct_renderer(self):
        assert get_renderer_name("light", None) == "LightCard"
        assert get_renderer_name("switch", None) == "SwitchCard"
        assert get_renderer_name("fan", None) == "FanCard"
        assert get_renderer_name("climate", None) == "ClimateCard"
        assert get_renderer_name("lock", None) == "LockCard"
        assert get_renderer_name("person", None) == "PersonCard"
        assert get_renderer_name("button", None) == "ButtonCard"
        assert get_renderer_name("number", None) == "InputNumberCard"

    def test_unknown_domain_returns_generic_card(self):
        assert get_renderer_name("todo", None) == "GenericCard"
        assert get_renderer_name("calendar", None) == "GenericCard"


# ---------------------------------------------------------------------------
# get_blocked_reason
# ---------------------------------------------------------------------------

class TestGetBlockedReason:
    def test_tier3_domain_returns_reason(self):
        reason = get_blocked_reason("alarm_control_panel")
        assert reason is not None
        assert isinstance(reason, str)
        assert len(reason) > 0

    def test_tier1_domain_returns_none(self):
        assert get_blocked_reason("light") is None

    def test_unknown_domain_returns_none(self):
        assert get_blocked_reason("weather") is None
