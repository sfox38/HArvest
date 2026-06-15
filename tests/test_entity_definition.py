"""Tests for entity_definition.py.

The pure helper functions (decode_supported_features, build_feature_config)
need no HA dependencies. build_icon_state_map needs a minimal State mock.
build_entity_definition needs a mock hass with states and entity registry.
"""
from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from homeassistant.components.climate import ClimateEntityFeature
from homeassistant.components.light import LightEntityFeature
from homeassistant.components.media_player import MediaPlayerEntityFeature

from custom_components.harvest.const import (
    DATA_TIER_BADGE,
    DATA_TIER_COMPACT,
    DATA_TIER_COMPANION,
    DATA_TIER_COMPANION_RW,
    DATA_TIER_DISPLAY,
    DATA_TIER_FULL,
)
from custom_components.harvest.entity_definition import (
    FEATURE_FLAGS,
    build_entity_definition,
    build_feature_config,
    build_icon_state_map,
    decode_supported_features,
    filter_attributes_for_tier,
    resolve_data_tier,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _state(entity_id: str, state: str = "on", attributes: dict | None = None):
    """Return a minimal mock State object."""
    s = MagicMock()
    s.entity_id = entity_id
    s.state = state
    s.attributes = attributes or {}
    return s


def _registry_entry(icon: str | None = None, device_class: str | None = None,
                    original_device_class: str | None = None,
                    name: str | None = None, original_name: str | None = None,
                    original_icon: str | None = None):
    entry = MagicMock()
    entry.icon = icon
    entry.original_icon = original_icon
    entry.device_class = device_class
    entry.original_device_class = original_device_class
    entry.name = name
    entry.original_name = original_name
    return entry


def _entity_access():
    """Return an EntityAccess-like mock with overrides disabled."""
    ea = MagicMock()
    ea.name_override = None
    ea.icon_override = None
    ea.exclude_attributes = []
    return ea


def _mock_hass(entity_id: str, state_obj, registry_entry=None):
    """Return a mock HomeAssistant that returns state_obj and optionally a registry entry."""
    hass = MagicMock()
    hass.states.get.return_value = state_obj

    registry = MagicMock()
    registry.async_get.return_value = registry_entry
    with patch(
        "custom_components.harvest.entity_definition.er.async_get",
        return_value=registry,
    ):
        yield hass, registry


# ---------------------------------------------------------------------------
# decode_supported_features
# ---------------------------------------------------------------------------

class TestDecodeSupportedFeatures:
    def test_returns_empty_for_zero_bitmask(self):
        assert decode_supported_features("light", 0) == []

    def test_returns_empty_for_unknown_domain(self):
        assert decode_supported_features("unknown_domain", 0xFF) == []

    def test_single_bit_light(self):
        result = decode_supported_features("light", int(LightEntityFeature.EFFECT))
        assert result == ["effect"]

    def test_multiple_bits_light(self):
        result = decode_supported_features(
            "light",
            int(LightEntityFeature.EFFECT | LightEntityFeature.TRANSITION),
        )
        assert set(result) == {"effect", "transition"}

    def test_all_fan_features(self):
        # set_speed (1) | oscillate (2) | direction (4)
        result = decode_supported_features("fan", 1 | 2 | 4)
        assert set(result) == {"set_speed", "oscillate", "direction"}

    def test_cover_features(self):
        result = decode_supported_features("cover", 4 | 128)
        assert set(result) == {"set_position", "set_tilt_position"}

    def test_climate_features(self):
        result = decode_supported_features(
            "climate",
            int(
                ClimateEntityFeature.TARGET_TEMPERATURE
                | ClimateEntityFeature.FAN_MODE
                | ClimateEntityFeature.PRESET_MODE
            ),
        )
        assert set(result) == {"target_temperature", "fan_mode", "preset_mode"}

    def test_media_player_features(self):
        result = decode_supported_features(
            "media_player",
            int(
                MediaPlayerEntityFeature.PAUSE
                | MediaPlayerEntityFeature.VOLUME_SET
                | MediaPlayerEntityFeature.VOLUME_MUTE
                | MediaPlayerEntityFeature.PREVIOUS_TRACK
                | MediaPlayerEntityFeature.NEXT_TRACK
                | MediaPlayerEntityFeature.VOLUME_STEP
                | MediaPlayerEntityFeature.SELECT_SOURCE
            ),
        )
        assert set(result) == {
            "play_pause",
            "volume_set",
            "volume_mute",
            "previous_track",
            "next_track",
            "volume_step",
            "select_source",
        }

    def test_media_player_play_and_pause_collapse_to_one_feature(self):
        result = decode_supported_features(
            "media_player",
            int(MediaPlayerEntityFeature.PAUSE | MediaPlayerEntityFeature.PLAY),
        )
        assert result == ["play_pause"]

    def test_unknown_bits_are_ignored(self):
        """Bits not in the map do not appear in the output."""
        # bit 999999 is not in any feature map
        result = decode_supported_features("light", 999999)
        # result should only contain bits that ARE in the map
        known_bits = set(FEATURE_FLAGS["light"].values())
        assert all(f in known_bits for f in result)

    def test_returns_list_not_set(self):
        result = decode_supported_features("light", 1)
        assert isinstance(result, list)


# ---------------------------------------------------------------------------
# build_feature_config
# ---------------------------------------------------------------------------

class TestBuildFeatureConfig:
    def test_light_has_brightness_range(self):
        state = _state("light.test", attributes={})
        config = build_feature_config("light", state)
        assert config["min_brightness"] == 0
        assert config["max_brightness"] == 255

    def test_light_includes_color_temp_when_present(self):
        state = _state("light.test", attributes={"min_mireds": 153, "max_mireds": 500})
        config = build_feature_config("light", state)
        assert config["min_color_temp"] == 153
        assert config["max_color_temp"] == 500

    def test_light_omits_color_temp_when_absent(self):
        state = _state("light.test", attributes={})
        config = build_feature_config("light", state)
        assert "min_color_temp" not in config
        assert "max_color_temp" not in config

    def test_fan_speed_count_from_percentage_step(self):
        state = _state("fan.test", attributes={"percentage_step": 25.0})
        config = build_feature_config("fan", state)
        assert config["speed_count"] == 4  # 100 / 25

    def test_fan_returns_empty_when_no_percentage_step(self):
        state = _state("fan.test", attributes={})
        config = build_feature_config("fan", state)
        assert config == {}

    def test_fan_returns_empty_for_zero_step(self):
        state = _state("fan.test", attributes={"percentage_step": 0})
        config = build_feature_config("fan", state)
        assert config == {}

    def test_input_number_includes_min_max_step(self):
        state = _state("input_number.test", attributes={"min": 0, "max": 100, "step": 1})
        config = build_feature_config("input_number", state)
        assert config == {"min": 0, "max": 100, "step": 1}

    def test_input_number_omits_missing_keys(self):
        state = _state("input_number.test", attributes={"min": 0, "max": 50})
        config = build_feature_config("input_number", state)
        assert "step" not in config
        assert config["min"] == 0

    def test_climate_includes_temp_range(self):
        state = _state("climate.test", attributes={
            "min_temp": 16, "max_temp": 30, "target_temp_step": 0.5,
            "hvac_modes": ["off", "heat", "cool"],
        })
        config = build_feature_config("climate", state)
        assert config["min_temp"] == 16
        assert config["max_temp"] == 30
        assert config["temp_step"] == 0.5
        assert config["hvac_modes"] == ["off", "heat", "cool"]

    def test_unknown_domain_returns_empty(self):
        state = _state("switch.test", attributes={})
        config = build_feature_config("switch", state)
        assert config == {}

    def test_sensor_returns_empty(self):
        state = _state("sensor.test", attributes={})
        assert build_feature_config("sensor", state) == {}


# ---------------------------------------------------------------------------
# build_icon_state_map
# ---------------------------------------------------------------------------

class TestBuildIconStateMap:
    def test_light_has_on_and_wildcard(self):
        state = _state("light.test", "on")
        result = build_icon_state_map("light", state, None, None)
        assert "on" in result
        assert "*" in result
        assert result["on"] == "mdi:lightbulb"

    def test_user_registry_icon_overrides_all_states(self):
        state = _state("light.test", "on")
        entry = _registry_entry(icon="mdi:custom-icon")
        result = build_icon_state_map("light", state, entry, None)
        # Every key should map to the user's custom icon.
        assert all(v == "mdi:custom-icon" for v in result.values())
        assert "*" in result

    def test_binary_sensor_motion_device_class(self):
        state = _state("binary_sensor.test", "off")
        result = build_icon_state_map("binary_sensor", state, None, "motion")
        assert result["on"] == "mdi:motion-sensor"
        assert result["*"] == "mdi:motion-sensor-off"

    def test_binary_sensor_unknown_device_class_uses_domain_defaults(self):
        state = _state("binary_sensor.test", "off")
        result = build_icon_state_map("binary_sensor", state, None, "unknown_dc")
        # Falls back to _DOMAIN_ICON_DEFAULTS for binary_sensor.
        assert "*" in result

    def test_sensor_temperature_device_class(self):
        state = _state("sensor.test", "22.5")
        result = build_icon_state_map("sensor", state, None, "temperature")
        assert result == {"*": "mdi:thermometer"}

    def test_sensor_humidity_device_class(self):
        state = _state("sensor.test", "55")
        result = build_icon_state_map("sensor", state, None, "humidity")
        assert result == {"*": "mdi:water-percent"}

    def test_sensor_no_device_class_uses_domain_default(self):
        state = _state("sensor.test", "42")
        result = build_icon_state_map("sensor", state, None, None)
        assert "*" in result
        assert result["*"] == "mdi:gauge"

    def test_unknown_domain_returns_help_circle_fallback(self):
        state = _state("custom.test", "on")
        result = build_icon_state_map("custom", state, None, None)
        assert result == {"*": "mdi:help-circle"}

    def test_cover_has_multiple_state_icons(self):
        state = _state("cover.test", "open")
        result = build_icon_state_map("cover", state, None, None)
        assert "open" in result
        assert "opening" in result
        assert "*" in result

    def test_no_registry_entry_uses_defaults(self):
        """Passing None for entry should not raise and falls back to domain defaults."""
        state = _state("switch.test", "off")
        result = build_icon_state_map("switch", state, None, None)
        assert "*" in result

    def test_registry_entry_with_no_icon_uses_defaults(self):
        """An entry with icon=None should fall back to domain defaults."""
        state = _state("light.test", "off")
        entry = _registry_entry(icon=None)
        result = build_icon_state_map("light", state, entry, None)
        assert result["on"] == "mdi:lightbulb"


# ---------------------------------------------------------------------------
# build_entity_definition
# ---------------------------------------------------------------------------

class TestBuildEntityDefinition:
    def _make_hass(self, entity_id: str, state_obj, registry_entry=None):
        hass = MagicMock()
        hass.states.get.return_value = state_obj
        registry = MagicMock()
        registry.async_get.return_value = registry_entry
        return hass, registry

    def test_returns_none_when_entity_missing(self):
        hass = MagicMock()
        hass.states.get.return_value = None
        with patch("custom_components.harvest.entity_definition.er.async_get"):
            result = build_entity_definition(hass, "light.missing", _entity_access())
        assert result is None

    def test_basic_light_entity(self):
        state = _state("light.bedroom", "on", {
            "brightness": 200,
            "friendly_name": "Bedroom Light",
            "supported_features": 0,
            "supported_color_modes": ["color_temp"],
        })
        hass, registry = self._make_hass("light.bedroom", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.bedroom", _entity_access())

        assert result is not None
        assert result["entity_id"] == "light.bedroom"
        assert result["domain"] == "light"
        assert result["friendly_name"] == "Bedroom Light"
        assert "brightness" in result["supported_features"]
        assert "color_temp" in result["supported_features"]
        assert result["icon"] == "mdi:lightbulb"  # current state is "on"
        assert "min_brightness" in result["feature_config"]

    def test_entity_definition_includes_required_keys(self):
        state = _state("switch.fan", "off", {"friendly_name": "Fan"})
        hass, registry = self._make_hass("switch.fan", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "switch.fan", _entity_access())

        required_keys = {
            "entity_id", "domain", "device_class", "friendly_name",
            "supported_features", "feature_config", "icon",
            "icon_state_map", "support_tier", "renderer", "unit_of_measurement",
        }
        assert required_keys.issubset(set(result.keys()))

    def test_device_class_from_state_attributes(self):
        """When no registry entry, device_class comes from state attributes."""
        state = _state("sensor.temp", "22.5", {
            "device_class": "temperature",
            "unit_of_measurement": "°C",
        })
        hass, registry = self._make_hass("sensor.temp", state)
        registry.async_get.return_value = None  # no registry entry

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "sensor.temp", _entity_access())

        assert result["device_class"] == "temperature"
        assert result["unit_of_measurement"] == "°C"

    def test_device_class_from_registry_overrides_attribute(self):
        """Registry device_class takes priority over state attribute."""
        state = _state("binary_sensor.door", "off", {
            "device_class": "motion",  # wrong - registry should override
        })
        hass, registry = self._make_hass("binary_sensor.door", state)
        entry = _registry_entry(device_class="door")
        registry.async_get.return_value = entry

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "binary_sensor.door", _entity_access())

        assert result["device_class"] == "door"

    def test_friendly_name_falls_back_to_registry_original_name(self):
        """When state attributes have no friendly_name, use registry original_name."""
        state = _state("light.test", "off", {})
        hass, registry = self._make_hass("light.test", state)
        entry = _registry_entry(original_name="Test Light")
        registry.async_get.return_value = entry

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.test", _entity_access())

        assert result["friendly_name"] == "Test Light"

    def test_icon_reflects_current_state(self):
        """Icon in result should match the entity's current state."""
        state = _state("light.test", "off", {})
        hass, registry = self._make_hass("light.test", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.test", _entity_access())

        # Light off maps to mdi:lightbulb-outline via "*" wildcard
        assert result["icon"] == "mdi:lightbulb-outline"

    def test_unit_of_measurement_none_when_absent(self):
        state = _state("light.test", "on", {})
        hass, registry = self._make_hass("light.test", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.test", _entity_access())

        assert result["unit_of_measurement"] is None

    def test_support_tier_is_integer(self):
        state = _state("light.test", "on", {})
        hass, registry = self._make_hass("light.test", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.test", _entity_access())

        assert isinstance(result["support_tier"], int)
        assert result["support_tier"] == 1  # light is Tier 1

    def test_renderer_for_temperature_sensor(self):
        state = _state("sensor.temp", "21.0", {"device_class": "temperature"})
        hass, registry = self._make_hass("sensor.temp", state)
        entry = _registry_entry(device_class="temperature")
        registry.async_get.return_value = entry

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "sensor.temp", _entity_access())

        # TemperatureSensorCard renderer
        assert "temperature" in result["renderer"].lower() or "sensor" in result["renderer"].lower()

    def test_no_registry_entry_does_not_raise(self):
        """Entities without a registry entry (synthetic) are handled gracefully."""
        state = _state("button.doorbell", "idle", {})
        hass, registry = self._make_hass("button.doorbell", state)
        registry.async_get.return_value = None

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "button.doorbell", _entity_access())

        assert result is not None
        assert result["domain"] == "button"

    def test_badge_tier_returns_minimal_fields(self):
        state = _state("sensor.temp", "22.5", {"friendly_name": "Temp", "unit_of_measurement": "C"})
        hass, registry = self._make_hass("sensor.temp", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "sensor.temp", _entity_access(), detail_level=DATA_TIER_BADGE)

        assert result is not None
        assert set(result.keys()) == {
            "entity_id", "domain", "device_class", "friendly_name",
            "icon", "icon_state_map", "unit_of_measurement",
            "color_scheme", "display_hints",
        }
        assert "supported_features" not in result
        assert "feature_config" not in result
        assert "companions" not in result
        assert "service_data" not in result

    def test_companion_tier_returns_identity_and_icon_only(self):
        state = _state("sensor.power", "5", {"friendly_name": "Power", "unit_of_measurement": "W"})
        hass, registry = self._make_hass("sensor.power", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(
                hass, "sensor.power", _entity_access(), detail_level=DATA_TIER_COMPANION,
            )

        assert result is not None
        assert set(result.keys()) == {
            "entity_id", "domain", "device_class", "friendly_name",
            "icon", "icon_state_map",
        }

    def test_companion_rw_tier_matches_companion(self):
        state = _state("light.x", "on", {
            "friendly_name": "Light",
            "supported_features": int(LightEntityFeature.EFFECT),
            "supported_color_modes": ["brightness"],
        })
        hass, registry = self._make_hass("light.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            companion = build_entity_definition(
                hass, "light.x", _entity_access(), detail_level=DATA_TIER_COMPANION,
            )
            companion_rw = build_entity_definition(
                hass, "light.x", _entity_access(), detail_level=DATA_TIER_COMPANION_RW,
            )

        assert companion == companion_rw
        assert "supported_features" not in companion_rw
        assert "feature_config" not in companion_rw
        assert "gesture_config" not in companion_rw
        assert "service_data" not in companion_rw
        assert "companions" not in companion_rw
        assert "renderer" not in companion_rw

    def test_compact_tier_includes_renderer_no_companions(self):
        state = _state("light.x", "on", {"friendly_name": "Light", "supported_features": 0})
        hass, registry = self._make_hass("light.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "light.x", _entity_access(), detail_level=DATA_TIER_COMPACT)

        assert result is not None
        assert "renderer" in result
        assert "support_tier" in result
        assert "companions" not in result
        assert "supported_features" not in result
        assert "feature_config" not in result
        assert "gesture_config" not in result
        assert "display_hints" not in result

    def test_display_tier_includes_companions_no_features(self):
        state = _state("light.x", "on", {"friendly_name": "Light", "supported_features": 0})
        hass, registry = self._make_hass("light.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(
                hass, "light.x", _entity_access(),
                companions=["sensor.power"], detail_level=DATA_TIER_DISPLAY,
            )

        assert result is not None
        assert result["companions"] == ["sensor.power"]
        assert "display_hints" in result
        assert "renderer" in result
        assert "supported_features" not in result
        assert "feature_config" not in result
        assert "gesture_config" not in result
        assert "service_data" not in result

    def test_full_tier_includes_all_fields(self):
        ea = _entity_access()
        ea.gesture_config = {"tap": "toggle"}
        ea.service_data = {"brightness_pct": 50}
        ea.color_scheme = "auto"
        ea.display_hints = {}
        state = _state("light.x", "on", {"friendly_name": "Light", "supported_features": 0})
        hass, registry = self._make_hass("light.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(
                hass, "light.x", ea, companions=["sensor.x"], detail_level=DATA_TIER_FULL,
            )

        assert result is not None
        for key in ("supported_features", "feature_config", "gesture_config",
                    "companions", "service_data", "display_hints", "renderer", "support_tier"):
            assert key in result, f"Missing key: {key}"

    def test_default_detail_level_is_full(self):
        state = _state("switch.x", "off", {"friendly_name": "Switch"})
        hass, registry = self._make_hass("switch.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            result = build_entity_definition(hass, "switch.x", _entity_access())

        assert "supported_features" in result
        assert "gesture_config" in result

    def test_badge_compact_skip_expensive_features(self):
        state = _state("light.x", "on", {
            "friendly_name": "Light",
            "supported_features": int(LightEntityFeature.EFFECT),
            "supported_color_modes": ["brightness", "color_temp"],
        })
        hass, registry = self._make_hass("light.x", state)

        with patch("custom_components.harvest.entity_definition.er.async_get",
                   return_value=registry):
            badge = build_entity_definition(hass, "light.x", _entity_access(), detail_level=DATA_TIER_BADGE)
            compact = build_entity_definition(hass, "light.x", _entity_access(), detail_level=DATA_TIER_COMPACT)

        assert "supported_features" not in badge
        assert "supported_features" not in compact
        assert "feature_config" not in badge
        assert "feature_config" not in compact


# ---------------------------------------------------------------------------
# resolve_data_tier
# ---------------------------------------------------------------------------

class TestResolveDataTier:
    def test_badge_capability(self):
        assert resolve_data_tier(False, "badge") == DATA_TIER_BADGE

    def test_badge_overrides_entities_block(self):
        assert resolve_data_tier(True, "badge") == DATA_TIER_BADGE

    def test_entities_block_returns_compact(self):
        assert resolve_data_tier(True, "read-write") == DATA_TIER_COMPACT

    def test_entities_block_overrides_read(self):
        assert resolve_data_tier(True, "read") == DATA_TIER_COMPACT

    def test_read_capability_returns_display(self):
        assert resolve_data_tier(False, "read") == DATA_TIER_DISPLAY

    def test_read_write_returns_full(self):
        assert resolve_data_tier(False, "read-write") == DATA_TIER_FULL

    def test_read_companion_returns_companion(self):
        assert resolve_data_tier(False, "read", True) == DATA_TIER_COMPANION

    def test_read_write_companion_returns_companion_rw(self):
        assert resolve_data_tier(False, "read-write", True) == DATA_TIER_COMPANION_RW

    def test_companion_overrides_entities_block(self):
        assert resolve_data_tier(True, "read", True) == DATA_TIER_COMPANION
        assert resolve_data_tier(True, "read-write", True) == DATA_TIER_COMPANION_RW

    def test_badge_wins_over_companion(self):
        # Badge companions are rejected at validation; defensive check that
        # badge capability still wins if one ever slips through.
        assert resolve_data_tier(False, "badge", True) == DATA_TIER_BADGE

    def test_is_companion_defaults_to_false(self):
        assert resolve_data_tier(False, "read") == DATA_TIER_DISPLAY
        assert resolve_data_tier(False, "read-write") == DATA_TIER_FULL


# ---------------------------------------------------------------------------
# filter_attributes_for_tier
# ---------------------------------------------------------------------------

class TestFilterAttributesForTier:
    def test_badge_returns_only_uom(self):
        attrs = {"brightness": 200, "unit_of_measurement": "lx", "color_temp": 350}
        result = filter_attributes_for_tier("light", attrs, DATA_TIER_BADGE)
        assert result == {"unit_of_measurement": "lx"}

    def test_compact_returns_only_uom(self):
        attrs = {"brightness": 200, "unit_of_measurement": "lx"}
        result = filter_attributes_for_tier("light", attrs, DATA_TIER_COMPACT)
        assert result == {"unit_of_measurement": "lx"}

    def test_badge_without_uom_returns_empty(self):
        attrs = {"brightness": 200, "color_temp": 350}
        result = filter_attributes_for_tier("light", attrs, DATA_TIER_BADGE)
        assert result == {}

    def test_companion_returns_only_uom(self):
        attrs = {"brightness": 200, "unit_of_measurement": "lx", "color_temp": 350}
        result = filter_attributes_for_tier("light", attrs, DATA_TIER_COMPANION)
        assert result == {"unit_of_measurement": "lx"}

    def test_companion_rw_returns_only_uom(self):
        attrs = {"current_temperature": 22.5, "unit_of_measurement": "C", "hvac_action": "heating"}
        result = filter_attributes_for_tier("climate", attrs, DATA_TIER_COMPANION_RW)
        assert result == {"unit_of_measurement": "C"}

    def test_display_media_player(self):
        attrs = {
            "media_artist": "Artist",
            "media_title": "Song",
            "media_album_name": "Album",
            "volume_level": 0.5,
            "source": "Spotify",
            "unit_of_measurement": None,
        }
        result = filter_attributes_for_tier("media_player", attrs, DATA_TIER_DISPLAY)
        assert result == {
            "media_artist": "Artist",
            "media_title": "Song",
            "media_album_name": "Album",
        }

    def test_display_climate(self):
        attrs = {
            "current_temperature": 22.5,
            "hvac_action": "heating",
            "temperature": 24,
            "fan_mode": "auto",
        }
        result = filter_attributes_for_tier("climate", attrs, DATA_TIER_DISPLAY)
        assert result == {"current_temperature": 22.5, "hvac_action": "heating"}

    def test_display_weather(self):
        attrs = {
            "temperature": 18,
            "humidity": 65,
            "wind_speed": 12,
            "pressure": 1013,
            "condition": "sunny",
        }
        result = filter_attributes_for_tier("weather", attrs, DATA_TIER_DISPLAY)
        assert "temperature" in result
        assert "humidity" in result
        assert "wind_speed" in result
        assert "pressure" in result
        assert "condition" not in result

    def test_display_sensor_returns_uom(self):
        attrs = {"unit_of_measurement": "W", "last_reset": "2024-01-01"}
        result = filter_attributes_for_tier("sensor", attrs, DATA_TIER_DISPLAY)
        assert result == {"unit_of_measurement": "W"}

    def test_display_unknown_domain_returns_only_uom(self):
        attrs = {"brightness": 200, "unit_of_measurement": "lx"}
        result = filter_attributes_for_tier("custom_domain", attrs, DATA_TIER_DISPLAY)
        assert result == {"unit_of_measurement": "lx"}

    def test_display_timer(self):
        attrs = {"remaining": "0:05:00", "duration": "0:10:00", "finishes_at": "2024-01-01T12:00:00"}
        result = filter_attributes_for_tier("timer", attrs, DATA_TIER_DISPLAY)
        assert result == {"remaining": "0:05:00", "duration": "0:10:00", "finishes_at": "2024-01-01T12:00:00"}

    def test_full_delegates_to_filter_attributes(self):
        attrs = {"brightness": 200, "friendly_name": "Test", "unit_of_measurement": "lx"}
        result = filter_attributes_for_tier("light", attrs, DATA_TIER_FULL)
        assert "brightness" in result
        assert "unit_of_measurement" in result
        assert "friendly_name" not in result
