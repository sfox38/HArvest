"""Entity domain compatibility definitions for the HArvest integration.

Defines which entity domains are supported (Tier 1, Tier 2, Tier 3) and
validates actions against the allowed services map.
"""
from __future__ import annotations

from enum import IntEnum

from .const import ERR_ENTITY_INCOMPATIBLE, ERR_PERMISSION_DENIED, CONF_SENSITIVE_DOMAINS


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
    "select":          "InputSelectCard",
    "timer":           "TimerCard",
    "weather":         "WeatherCard",
    "lock":            "LockCard",
    "person":          "PersonCard",
    "button":          "ButtonCard",
    "input_button":    "ButtonCard",
    "number":          "InputNumberCard",
    "script":          "ScriptCard",
    "automation":      "AutomationCard",
}

SENSOR_DEVICE_CLASS_RENDERERS: dict[str, str] = {
    "temperature": "TemperatureSensorCard",
    "humidity":    "HumiditySensorCard",
    "battery":     "BatterySensorCard",
}

TIER3_DOMAINS: dict[str, str] = {
    "alarm_control_panel": "Security-critical. Publicly embeddable alarm control is too high risk.",
    "device_tracker":      "Privacy concern - exposes real-time location. Use person domain instead.",
    "camera":              "Video streaming is out of scope.",
    "scene":               "Could trigger wide device effects. Deferred to v2.",
    "update":              "Triggering firmware updates from a public page is too risky.",
}

ALLOWED_SERVICES: dict[str, set[str]] = {
    "light":          {"turn_on", "turn_off", "toggle"},
    "switch":         {"turn_on", "turn_off", "toggle"},
    "fan":            {"turn_on", "turn_off", "toggle", "set_percentage",
                       "oscillate", "set_direction", "set_preset_mode",
                       "increase_speed", "decrease_speed"},
    "cover":          {"open_cover", "close_cover", "stop_cover", "set_cover_position",
                       "set_cover_tilt_position"},
    "climate":        {"turn_on", "turn_off", "set_temperature", "set_hvac_mode",
                       "set_fan_mode", "set_preset_mode", "set_swing_mode"},
    "input_boolean":  {"turn_on", "turn_off", "toggle"},
    "input_number":   {"set_value"},
    "input_select":   {"select_option"},
    "select":         {"select_option"},
    "timer":          {"start", "pause", "cancel", "finish"},
    "media_player":   {"media_play_pause", "media_next_track", "media_previous_track",
                       "volume_up", "volume_down", "volume_set", "volume_mute",
                       "select_source", "turn_on", "turn_off"},
    "remote":         {"turn_on", "turn_off", "send_command"},
    "lock":           {"lock", "unlock", "open"},
    "button":         {"press"},
    "input_button":   {"press"},
    "number":         {"set_value"},
    "script":         {"turn_on"},
    "automation":     {"trigger", "turn_on", "turn_off"},
    # sensor, binary_sensor, person are intentionally absent: read-only, no HA services.
}

COMPANION_ALLOWED_DOMAINS: frozenset[str] = frozenset({
    "light", "switch", "binary_sensor",
    "input_boolean", "cover", "remote", "fan", "sensor", "lock",
})

# Tier 1 domains that are disabled by default. Admins must explicitly enable
# each one in Settings before tokens can include entities from that domain.
SENSITIVE_DOMAINS: frozenset[str] = frozenset({
    "lock", "script", "automation", "button", "input_button", "cover",
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


def validate_action(
    domain: str,
    action: str,
    custom_domains: list[dict] | None = None,
) -> str | None:
    """Return HRV_PERMISSION_DENIED if action is not allowed for domain, else None."""
    allowed = ALLOWED_SERVICES.get(domain)
    if allowed is not None:
        return None if action in allowed else ERR_PERMISSION_DENIED
    if custom_domains:
        for entry in custom_domains:
            if entry.get("domain") == domain:
                if action in entry.get("allowed_services", []):
                    return None
                return ERR_PERMISSION_DENIED
    return ERR_PERMISSION_DENIED


def is_companion_allowed(domain: str) -> bool:
    """Return True if the domain is permitted as a companion entity."""
    return domain in COMPANION_ALLOWED_DOMAINS


def get_custom_domains(hass) -> list[dict]:
    """Read the custom_domains allowlist from the live config entry."""
    from .const import DOMAIN, DEFAULTS
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        return []
    entry = entries[0]
    merged = {**DEFAULTS, **entry.data, **entry.options}
    return merged.get("custom_domains", [])


def get_blocked_reason(domain: str) -> str | None:
    """Return the human-readable reason a Tier 3 domain is blocked, or None."""
    return TIER3_DOMAINS.get(domain)


def is_sensitive_domain_blocked(domain: str, sensitive_config: dict) -> bool:
    """Return True if domain is sensitive and not enabled in global config."""
    if domain not in SENSITIVE_DOMAINS:
        return False
    return not sensitive_config.get(domain, False)


def get_sensitive_domains(hass) -> dict:
    """Read the sensitive_domains config from the live config entry."""
    from .const import DOMAIN, DEFAULTS
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        return dict(DEFAULTS[CONF_SENSITIVE_DOMAINS])
    entry = entries[0]
    merged = {**DEFAULTS, **entry.data, **entry.options}
    return merged.get(CONF_SENSITIVE_DOMAINS, dict(DEFAULTS[CONF_SENSITIVE_DOMAINS]))
