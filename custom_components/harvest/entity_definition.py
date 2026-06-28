"""Builds entity_definition messages for the HArvest WebSocket protocol.

Reads HA entity state and registry data, translates supported_features
bitmasks to string lists, and packages everything the widget needs to render
a card - without exposing any HA internals the token owner has not approved.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.climate import ClimateEntityFeature
from homeassistant.components.cover import CoverEntityFeature
from homeassistant.components.fan import FanEntityFeature
from homeassistant.components.light import LightEntityFeature
from homeassistant.components.media_player import MediaPlayerEntityFeature
from homeassistant.components.remote import RemoteEntityFeature
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er

from .const import (
    DATA_TIER_BADGE,
    DATA_TIER_COMPACT,
    DATA_TIER_COMPANION,
    DATA_TIER_COMPANION_RW,
    DATA_TIER_DISPLAY,
    DATA_TIER_FULL,
    DISPLAY_TIER_ATTRIBUTES,
)
from .entity_compatibility import get_renderer_name, get_support_tier

if TYPE_CHECKING:
    from .token_manager import EntityAccess


# ---------------------------------------------------------------------------
# Attribute exclusion helpers
# ---------------------------------------------------------------------------
# When exclude_attributes is set on a token entity, the widget should not see
# features, config ranges, or accept commands for those attributes.
#
# Most feature/data key names match the HA attribute name directly.  The maps
# below cover the known cases where they differ.

# State attribute to feature name it belongs to, only where names differ.
# When any of these attributes is excluded, the mapped feature is suppressed.
_ATTR_TO_FEATURE: dict[str, str] = {
    "color_temp_kelvin": "color_temp",
    "min_mireds": "color_temp",
    "max_mireds": "color_temp",
    "min_color_temp_kelvin": "color_temp",
    "max_color_temp_kelvin": "color_temp",
    "hs_color": "rgb_color",
    "xy_color": "rgb_color",
    "effect_list": "effect",
    "percentage": "set_speed",
    "percentage_step": "set_speed",
    "oscillating": "oscillate",
    "current_position": "set_position",
    "current_tilt_position": "set_tilt_position",
    "temperature": "target_temperature",
    "volume_level": "volume_set",
}

# Command data key to state attribute it controls, only where names differ.
_DATA_KEY_ATTR_NAME: dict[str, str] = {
    "brightness_pct": "brightness",
    "color_temp_kelvin": "color_temp",
    "rgbw_color": "rgb_color",
    "rgbww_color": "rgb_color",
    "hs_color": "rgb_color",
    "xy_color": "rgb_color",
    "target_temp_low": "temperature",
    "target_temp_high": "temperature",
    "position": "current_position",
    "tilt_position": "current_tilt_position",
}

# Attribute to extra feature_config keys to remove, only where the attribute
# name does not appear as a substring of the config key)
_ATTR_EXTRA_CONFIG_KEYS: dict[str, set[str]] = {
    "temperature": {"min_temp", "max_temp", "temp_step"},
    "percentage": {"speed_count"},
}


def _features_to_suppress(exclude_attributes: list[str]) -> set[str]:
    """Compute the set of feature names to remove from supported_features.

    Direct match: attribute name = feature name (covers most cases).
    Reverse lookup: attribute maps to a differently-named feature via _ATTR_TO_FEATURE.
    """
    result: set[str] = set()
    for attr in exclude_attributes:
        result.add(attr)
        mapped = _ATTR_TO_FEATURE.get(attr)
        if mapped:
            result.add(mapped)
    return result


def _is_config_key_excluded(key: str, exclude_attrs: list[str]) -> bool:
    """Check if a feature_config key should be removed."""
    for attr in exclude_attrs:
        if attr in key:
            return True
        extra = _ATTR_EXTRA_CONFIG_KEYS.get(attr)
        if extra and key in extra:
            return True
    return False


def get_blocked_data_keys(exclude_attributes: list[str]) -> set[str]:
    """Return the set of command data keys that should be stripped.

    Direct match: data key name in excluded attributes.
    Forward lookup: data key maps to an excluded attribute via _DATA_KEY_ATTR_NAME.
    Reverse lookup: excluded attribute maps to a feature, and data keys sharing
    that feature name are also blocked.
    """
    exclude_set = set(exclude_attributes)
    blocked: set[str] = set(exclude_attributes)
    suppressed = _features_to_suppress(exclude_attributes)
    for data_key, attr in _DATA_KEY_ATTR_NAME.items():
        if attr in exclude_set or attr in suppressed:
            blocked.add(data_key)
    blocked |= suppressed
    return blocked


# Maps (domain, bitmask_bit) to feature string for translate_supported_features.
FEATURE_FLAGS: dict[str, dict[int, str]] = {
    "light": {
        int(LightEntityFeature.EFFECT): "effect",
        int(LightEntityFeature.FLASH): "flash",
        int(LightEntityFeature.TRANSITION): "transition",
    },
    "fan": {
        int(FanEntityFeature.SET_SPEED): "set_speed",
        int(FanEntityFeature.OSCILLATE): "oscillate",
        int(FanEntityFeature.DIRECTION): "direction",
        int(FanEntityFeature.PRESET_MODE): "preset_mode",
    },
    "cover": {
        int(CoverEntityFeature.OPEN): "open",
        int(CoverEntityFeature.CLOSE): "close",
        int(CoverEntityFeature.SET_POSITION): "set_position",
        int(CoverEntityFeature.STOP): "stop",
        int(CoverEntityFeature.OPEN_TILT): "open_tilt",
        int(CoverEntityFeature.CLOSE_TILT): "close_tilt",
        int(CoverEntityFeature.STOP_TILT): "stop_tilt",
        int(CoverEntityFeature.SET_TILT_POSITION): "set_tilt_position",
    },
    "climate": {
        int(ClimateEntityFeature.TARGET_TEMPERATURE): "target_temperature",
        int(ClimateEntityFeature.TARGET_TEMPERATURE_RANGE): "target_temperature_range",
        int(ClimateEntityFeature.TARGET_HUMIDITY): "target_humidity",
        int(ClimateEntityFeature.FAN_MODE): "fan_mode",
        int(ClimateEntityFeature.PRESET_MODE): "preset_mode",
        int(ClimateEntityFeature.SWING_MODE): "swing_mode",
    },
    "media_player": {
        int(MediaPlayerEntityFeature.PAUSE): "play_pause",
        int(MediaPlayerEntityFeature.PLAY): "play_pause",
        int(MediaPlayerEntityFeature.VOLUME_SET): "volume_set",
        int(MediaPlayerEntityFeature.VOLUME_MUTE): "volume_mute",
        int(MediaPlayerEntityFeature.PREVIOUS_TRACK): "previous_track",
        int(MediaPlayerEntityFeature.NEXT_TRACK): "next_track",
        int(MediaPlayerEntityFeature.TURN_ON): "turn_on",
        int(MediaPlayerEntityFeature.TURN_OFF): "turn_off",
        int(MediaPlayerEntityFeature.VOLUME_STEP): "volume_step",
        int(MediaPlayerEntityFeature.SELECT_SOURCE): "select_source",
    },
    "remote": {
        int(RemoteEntityFeature.LEARN_COMMAND): "learn_command",
        int(RemoteEntityFeature.DELETE_COMMAND): "delete_command",
        int(RemoteEntityFeature.ACTIVITY): "activity",
    },
}

# These feature flags were added after HArvest's minimum supported HA version.
# Decode them when present without preventing startup on older HA releases.
for enum_class, domain, optional_features in (
    (FanEntityFeature, "fan", (("TURN_ON", "turn_on"), ("TURN_OFF", "turn_off"))),
    (ClimateEntityFeature, "climate", (("TURN_ON", "turn_on"), ("TURN_OFF", "turn_off"))),
):
    for member_name, feature_name in optional_features:
        if member := getattr(enum_class, member_name, None):
            FEATURE_FLAGS[domain][int(member)] = feature_name

# Attributes blocked from state_update messages. All other attributes are
# forwarded to the widget. Individual values exceeding MAX_ATTRIBUTE_VALUE_BYTES
# are silently dropped as a safety net against oversized payloads.
BLOCKED_ATTRIBUTES: frozenset[str] = frozenset({
    "supported_features",
    "supported_color_modes",
    "friendly_name",
    "attribution",
    "editable",
    "id",
    # "assumed_state" intentionally NOT blocked: renderer overrides (fan, switch,
    # cover) use it to detect entities whose state is fire-and-forget and
    # adjust their UX accordingly (e.g. suppress data-active button reflection
    # when HA cannot confirm the actual device state).
    # "forecast" -- injected by ws_proxy via weather/subscribe_forecast,
    # not a state attribute in HA 2024.4+.
})

MAX_ATTRIBUTE_VALUE_BYTES = 8192

# Default icon per state for each domain. Used when the entity registry has no
# custom icon set. State key "*" applies to all unlisted states.
_DOMAIN_ICON_DEFAULTS: dict[str, dict[str, str]] = {
    "light": {
        "on": "mdi:lightbulb",
        "*": "mdi:lightbulb-outline",
    },
    "switch": {
        "on": "mdi:toggle-switch",
        "*": "mdi:toggle-switch-off-outline",
    },
    "fan": {
        "on": "mdi:fan",
        "*": "mdi:fan-off",
    },
    "cover": {
        "open":    "mdi:window-shutter-open",
        "opening": "mdi:window-shutter-open",
        "closing": "mdi:window-shutter",
        "*":       "mdi:window-shutter",
    },
    "climate": {
        "*": "mdi:thermostat",
    },
    "media_player": {
        "playing": "mdi:cast-connected",
        "idle":    "mdi:cast",
        "off":     "mdi:cast",
        "*":       "mdi:cast",
    },
    "remote": {
        "on": "mdi:remote",
        "*":  "mdi:remote",
    },
    "input_boolean": {
        "on": "mdi:toggle-switch",
        "*":  "mdi:toggle-switch-off-outline",
    },
    "input_number": {
        "*": "mdi:numeric",
    },
    "number": {
        "*": "mdi:numeric",
    },
    "input_select": {
        "*": "mdi:format-list-bulleted",
    },
    "select": {
        "*": "mdi:format-list-bulleted",
    },
    "sensor": {
        "*": "mdi:gauge",
    },
    "binary_sensor": {
        "on":  "mdi:radiobox-marked",
        "*":   "mdi:radiobox-blank",
    },
    "script": {
        "on": "mdi:script-text",
        "*":  "mdi:script-text-play",
    },
    "automation": {
        "on": "mdi:robot",
        "*":  "mdi:robot-off",
    },
    "button": {
        "*": "mdi:gesture-tap-button",
    },
    "input_button": {
        "*": "mdi:gesture-tap-button",
    },
    "person": {
        "home":     "mdi:account",
        "not_home": "mdi:account-off",
        "*":        "mdi:account",
    },
    "lock": {
        "locked":   "mdi:lock",
        "unlocked": "mdi:lock-open",
        "locking":  "mdi:lock",
        "unlocking":"mdi:lock-open",
        "jammed":   "mdi:lock-alert",
        "*":        "mdi:lock",
    },
    "timer": {
        "active": "mdi:timer",
        "paused": "mdi:timer-pause",
        "*":      "mdi:timer-outline",
    },
    "weather": {
        "sunny":            "mdi:weather-sunny",
        "clear-night":      "mdi:weather-night",
        "partlycloudy":     "mdi:weather-partly-cloudy",
        "cloudy":           "mdi:weather-cloudy",
        "fog":              "mdi:weather-fog",
        "rainy":            "mdi:weather-rainy",
        "pouring":          "mdi:weather-pouring",
        "snowy":            "mdi:weather-snowy",
        "snowy-rainy":      "mdi:weather-snowy-heavy",
        "hail":             "mdi:weather-hail",
        "lightning":        "mdi:weather-lightning",
        "lightning-rainy":  "mdi:weather-lightning-rainy",
        "windy":            "mdi:weather-windy",
        "windy-variant":    "mdi:weather-windy-variant",
        "exceptional":      "mdi:alert-circle-outline",
        "*":                "mdi:weather-cloudy",
    },
}

# Device-class icon overrides for binary_sensor and sensor.
_BINARY_SENSOR_DC_ICONS: dict[str, dict[str, str]] = {
    "motion":       {"on": "mdi:motion-sensor", "*": "mdi:motion-sensor-off"},
    "door":         {"on": "mdi:door-open", "*": "mdi:door-closed"},
    "window":       {"on": "mdi:window-open", "*": "mdi:window-closed"},
    "lock":         {"on": "mdi:lock-open", "*": "mdi:lock"},
    "connectivity": {"on": "mdi:wifi", "*": "mdi:wifi-off"},
    "moisture":     {"on": "mdi:water", "*": "mdi:water-off"},
    "smoke":        {"on": "mdi:smoke-detector-variant-alert", "*": "mdi:smoke-detector-variant"},
    "presence":     {"on": "mdi:home", "*": "mdi:home-outline"},
    "occupancy":    {"on": "mdi:home", "*": "mdi:home-outline"},
    "garage_door":  {"on": "mdi:garage-open", "*": "mdi:garage"},
    "battery":      {"on": "mdi:battery-alert", "*": "mdi:battery"},
    "problem":      {"on": "mdi:alert-circle", "*": "mdi:alert-circle-outline"},
    "plug":         {"on": "mdi:power-plug", "*": "mdi:power-plug-off"},
    "power":        {"on": "mdi:flash", "*": "mdi:flash-off"},
    "running":      {"on": "mdi:play-circle", "*": "mdi:stop-circle"},
    "cold":         {"on": "mdi:snowflake", "*": "mdi:snowflake-off"},
    "heat":         {"on": "mdi:fire", "*": "mdi:fire-off"},
    "vibration":    {"on": "mdi:vibrate", "*": "mdi:vibrate-off"},
    "gas":          {"on": "mdi:gas-cylinder", "*": "mdi:gas-cylinder"},
    "opening":      {"on": "mdi:square-rounded", "*": "mdi:square-rounded-outline"},
    "safety":       {"on": "mdi:shield-check", "*": "mdi:shield-alert"},
    "tamper":       {"on": "mdi:shield-alert", "*": "mdi:shield"},
    "update":       {"on": "mdi:package-up", "*": "mdi:package-variant"},
}

_SENSOR_DC_ICONS: dict[str, str] = {
    "temperature":    "mdi:thermometer",
    "humidity":       "mdi:water-percent",
    "battery":        "mdi:battery",
    "illuminance":    "mdi:brightness-5",
    "pressure":       "mdi:gauge",
    "power":          "mdi:flash",
    "energy":         "mdi:lightning-bolt",
    "voltage":        "mdi:sine-wave",
    "current":        "mdi:current-ac",
    "carbon_dioxide": "mdi:molecule-co2",
    "pm25":           "mdi:air-filter",
}


def resolve_data_tier(
    entities_block: bool, capabilities: str, is_companion: bool = False
) -> str:
    """Determine the data tier from token/entity context.

    Returns one of DATA_TIER_BADGE, DATA_TIER_COMPACT, DATA_TIER_COMPANION,
    DATA_TIER_COMPANION_RW, DATA_TIER_DISPLAY, or DATA_TIER_FULL. Pure
    function with no HA dependencies so both ws_proxy and http_views can
    import it.

    Companions resolve before entities_block: the companion tiers are
    smaller than compact, so the block flag adds nothing for them.
    """
    if capabilities == "badge":
        return DATA_TIER_BADGE
    if is_companion:
        if capabilities == "read-write":
            return DATA_TIER_COMPANION_RW
        return DATA_TIER_COMPANION
    if entities_block:
        return DATA_TIER_COMPACT
    if capabilities == "read":
        return DATA_TIER_DISPLAY
    return DATA_TIER_FULL


def filter_attributes_for_tier(
    domain: str,
    attributes: dict,
    tier: str,
) -> dict:
    """Filter entity state attributes based on the data tier.

    badge/compact/companion/companion_rw: unit_of_measurement only.
    display: unit_of_measurement + domain-specific allowlist.
    full: delegates to the existing blocklist-based filter_attributes().
    """
    if tier in (DATA_TIER_BADGE, DATA_TIER_COMPACT, DATA_TIER_COMPANION, DATA_TIER_COMPANION_RW):
        result: dict = {}
        uom = attributes.get("unit_of_measurement")
        if uom is not None:
            result["unit_of_measurement"] = uom
        return result

    if tier == DATA_TIER_DISPLAY:
        allowed = DISPLAY_TIER_ATTRIBUTES.get(domain, frozenset())
        result = {}
        uom = attributes.get("unit_of_measurement")
        if uom is not None:
            result["unit_of_measurement"] = uom
        for key in allowed:
            if key in attributes:
                result[key] = attributes[key]
        return result

    return filter_attributes(attributes)


def build_entity_definition(
    hass: HomeAssistant,
    entity_id: str,
    entity_access: "EntityAccess",
    companions: list[str] | None = None,
    detail_level: str = DATA_TIER_FULL,
) -> dict | None:
    """Build an entity_definition message dict at the requested detail level.

    detail_level controls which fields are included and which expensive
    computations are skipped:
      badge     - identity, icon, unit, color_scheme, display_hints
      companion - identity and icon only (companion pills consume nothing
                  else; capabilities is injected by the sender). The
                  companion_rw tier currently emits the same fields.
      compact   - badge fields plus renderer and support_tier (no companions)
      display   - compact fields plus unit, display_hints, and companions
      full      - all fields including features, config, gestures, service_data
    """
    state = hass.states.get(entity_id)
    if state is None:
        return None

    domain = entity_id.split(".")[0]
    attrs = state.attributes

    registry = er.async_get(hass)
    entry = registry.async_get(entity_id)

    device_class: str | None = None
    if entry is not None:
        device_class = entry.device_class or entry.original_device_class
    if device_class is None:
        device_class = attrs.get("device_class")

    if entity_access.name_override:
        friendly_name: str = entity_access.name_override
    else:
        friendly_name = attrs.get("friendly_name") or ""
        if not friendly_name and entry is not None:
            friendly_name = entry.name or entry.original_name or entity_id

    if entity_access.icon_override:
        icon_state_map = {"*": entity_access.icon_override}
        current_icon = entity_access.icon_override
    else:
        icon_state_map = build_icon_state_map(domain, state, entry, device_class)
        current_icon = icon_state_map.get(state.state) or icon_state_map.get("*", "mdi:help-circle")

    unit_of_measurement: str | None = attrs.get("unit_of_measurement")

    if detail_level == DATA_TIER_BADGE:
        return {
            "entity_id": entity_id,
            "domain": domain,
            "device_class": device_class,
            "friendly_name": friendly_name,
            "icon": current_icon,
            "icon_state_map": icon_state_map,
            "unit_of_measurement": unit_of_measurement,
            "color_scheme": entity_access.color_scheme,
            "display_hints": entity_access.display_hints or {},
        }

    if detail_level in (DATA_TIER_COMPANION, DATA_TIER_COMPANION_RW):
        return {
            "entity_id": entity_id,
            "domain": domain,
            "device_class": device_class,
            "friendly_name": friendly_name,
            "icon": current_icon,
            "icon_state_map": icon_state_map,
        }

    support_tier = int(get_support_tier(domain))
    renderer = get_renderer_name(domain, device_class)

    if detail_level == DATA_TIER_COMPACT:
        return {
            "entity_id": entity_id,
            "domain": domain,
            "device_class": device_class,
            "friendly_name": friendly_name,
            "icon": current_icon,
            "icon_state_map": icon_state_map,
            "color_scheme": entity_access.color_scheme,
            "renderer": renderer,
            "support_tier": support_tier,
        }

    if detail_level == DATA_TIER_DISPLAY:
        return {
            "entity_id": entity_id,
            "domain": domain,
            "device_class": device_class,
            "friendly_name": friendly_name,
            "icon": current_icon,
            "icon_state_map": icon_state_map,
            "unit_of_measurement": unit_of_measurement,
            "color_scheme": entity_access.color_scheme,
            "display_hints": entity_access.display_hints or {},
            "companions": companions or [],
            "renderer": renderer,
            "support_tier": support_tier,
        }

    # Full tier: compute features, config, gestures, service_data.
    supported_features = decode_supported_features(
        domain, attrs.get("supported_features", 0)
    )

    if domain == "light":
        color_modes = set(attrs.get("supported_color_modes", []))
        dimmable_modes = {"brightness", "color_temp", "hs", "xy", "rgb", "rgbw", "rgbww", "white"}
        if color_modes & dimmable_modes and "brightness" not in supported_features:
            supported_features.append("brightness")
        if "color_temp" in color_modes and "color_temp" not in supported_features:
            supported_features.append("color_temp")
        color_capable_modes = {"hs", "xy", "rgb", "rgbw", "rgbww"}
        if color_modes & color_capable_modes and "rgb_color" not in supported_features:
            supported_features.append("rgb_color")

    if domain == "cover" and {"open", "close"} & set(supported_features):
        supported_features.append("buttons")

    if domain == "weather":
        raw_features = attrs.get("supported_features", 0) or 0
        if raw_features & 1:
            supported_features.append("forecast_daily")
        if raw_features & 2:
            supported_features.append("forecast_hourly")

    feature_config = build_feature_config(domain, state)

    if entity_access.exclude_attributes:
        suppressed = _features_to_suppress(entity_access.exclude_attributes)
        supported_features = [f for f in supported_features if f not in suppressed]
        feature_config = {
            k: v for k, v in feature_config.items()
            if not _is_config_key_excluded(k, entity_access.exclude_attributes)
        }

    return {
        "entity_id": entity_id,
        "domain": domain,
        "device_class": device_class,
        "friendly_name": friendly_name,
        "supported_features": supported_features,
        "feature_config": feature_config,
        "icon": current_icon,
        "icon_state_map": icon_state_map,
        "support_tier": support_tier,
        "renderer": renderer,
        "unit_of_measurement": unit_of_measurement,
        "gesture_config": entity_access.gesture_config or {},
        "color_scheme": entity_access.color_scheme,
        "display_hints": entity_access.display_hints or {},
        "companions": companions or [],
        "service_data": entity_access.service_data or {},
    }


def decode_supported_features(domain: str, bitmask: int) -> list[str]:
    """Translate a HA supported_features bitmask to a list of feature strings.

    Uses FEATURE_FLAGS for the domain. Bits not in the map are ignored.
    Returns an empty list for unknown domains or zero bitmask.
    """
    flags = FEATURE_FLAGS.get(domain, {})
    return list(dict.fromkeys(name for bit, name in flags.items() if bitmask & bit))


def filter_attributes(attributes: dict) -> dict:
    """Filter entity attributes using a blocklist and per-value size cap.

    Removes globally blocked attributes and any individual value whose JSON
    serialization exceeds MAX_ATTRIBUTE_VALUE_BYTES.
    """
    import json

    filtered = {}
    for k, v in attributes.items():
        if k in BLOCKED_ATTRIBUTES:
            continue
        try:
            if len(json.dumps(v, default=str)) > MAX_ATTRIBUTE_VALUE_BYTES:
                continue
        except (TypeError, ValueError):
            continue
        filtered[k] = v
    return filtered


def build_icon_state_map(
    domain: str,
    state: State,
    entry: er.RegistryEntry | None,
    device_class: str | None,
) -> dict[str, str]:
    """Build the icon_state_map for an entity.

    Reads the entity's icon from the entity registry if set (user-customised).
    Falls back to HA's built-in domain/device_class icon conventions.
    Returns a dict of state strings to MDI icon names.

    When the entity has a user-set icon in the registry, all states map to that
    single icon (the user override applies universally). Domain defaults provide
    per-state icons.
    """
    # User-customised icon from entity registry overrides everything.
    user_icon: str | None = (entry.icon or entry.original_icon) if entry is not None else None
    if user_icon:
        # Apply user icon to all known states for this domain plus a "*" fallback.
        known_states = list(_DOMAIN_ICON_DEFAULTS.get(domain, {}).keys())
        return {s: user_icon for s in known_states} | {"*": user_icon}

    # Device-class overrides for binary_sensor.
    if domain == "binary_sensor" and device_class in _BINARY_SENSOR_DC_ICONS:
        return dict(_BINARY_SENSOR_DC_ICONS[device_class])

    # Device-class icon for sensor (single icon, no state split).
    if domain == "sensor" and device_class in _SENSOR_DC_ICONS:
        icon = _SENSOR_DC_ICONS[device_class]
        return {"*": icon}

    # Fall back to domain defaults.
    defaults = _DOMAIN_ICON_DEFAULTS.get(domain)
    if defaults:
        return dict(defaults)

    # Unknown domain - generic fallback.
    return {"*": "mdi:help-circle"}


def build_feature_config(domain: str, state: State) -> dict:
    """Build the feature_config dict for domain-specific range values.

    light:        min_brightness (0), max_brightness (255), min_color_temp,
                  max_color_temp (from state attributes min_mireds/max_mireds)
    fan:          speed_count (derived from percentage_step attribute: 100 / step)
    input_number: min, max, step (from state attributes)
    climate:      min_temp, max_temp, target_temp_step (from state attributes)
    Returns an empty dict for domains with no configurable ranges.
    """
    attrs = state.attributes

    if domain == "light":
        config: dict = {
            "min_brightness": 0,
            "max_brightness": 255,
        }
        if "min_mireds" in attrs:
            config["min_color_temp"] = attrs["min_mireds"]
        if "max_mireds" in attrs:
            config["max_color_temp"] = attrs["max_mireds"]
        return config

    if domain == "fan":
        config = {}
        step = attrs.get("percentage_step")
        if step and step > 0:
            config["percentage_step"] = step
            config["speed_count"] = int(round(100 / step))
        if "preset_modes" in attrs:
            config["preset_modes"] = attrs["preset_modes"]
        return config

    if domain == "input_number":
        config = {}
        for key in ("min", "max", "step"):
            if key in attrs:
                config[key] = attrs[key]
        return config

    if domain == "climate":
        config = {}
        for key in ("min_temp", "max_temp"):
            if key in attrs:
                config[key] = attrs[key]
        if "target_temp_step" in attrs:
            config["temp_step"] = attrs["target_temp_step"]
        for list_key in ("hvac_modes", "fan_modes", "preset_modes", "swing_modes"):
            if list_key in attrs:
                config[list_key] = attrs[list_key]
        return config

    return {}
