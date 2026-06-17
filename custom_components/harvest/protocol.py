"""Shared protocol helpers for building HArvest wire messages.

These pure functions and constants are used both by the live WebSocket
proxy (ws_proxy.py) and by the HTTP preview/probe endpoints (http_views.py).
Keeping them here, in a module that depends on neither, lets both import
them at module scope without a circular import.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .token_manager import EntityAccess


def normalize_forecast(entries: list | None) -> list | None:
    """Ensure forecast entries have temperature/templow keys.

    Some HA integrations return native_temperature/native_templow without
    the converted temperature/templow keys. This adds the fallback so the
    widget always finds the expected keys.
    """
    if not entries:
        return entries
    out = []
    for entry in entries:
        e = dict(entry)
        if "temperature" not in e and "native_temperature" in e:
            e["temperature"] = e["native_temperature"]
        if "templow" not in e and "native_templow" in e:
            e["templow"] = e["native_templow"]
        out.append(e)
    return out


def safe_json_value(val: object) -> object:
    """Convert a value to a JSON-safe type.

    HA entity attributes may contain datetime objects, sets, or other
    non-serializable types. This recursively converts them so
    ws.send_json (which uses stdlib json.dumps) does not raise TypeError.
    """
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, dict):
        return {k: safe_json_value(v) for k, v in val.items()}
    if isinstance(val, (list, tuple)):
        return [safe_json_value(v) for v in val]
    if isinstance(val, (set, frozenset)):
        return [safe_json_value(v) for v in sorted(val, key=str)]
    if isinstance(val, (str, int, float, bool)) or val is None:
        return val
    return str(val)


def round_state(state_val: str, ea: EntityAccess | None) -> str:
    """Round a numeric state value if decimal_places is set in display_hints."""
    if ea is None:
        return state_val
    dp = ea.display_hints.get("decimal_places")
    if dp is None:
        return state_val
    try:
        n = int(dp)
        rounded = round(float(state_val), n)
        if n <= 0:
            return str(int(rounded))
        return f"{rounded:.{n}f}"
    except (ValueError, TypeError, OverflowError):
        return state_val


# Allowed data keys per domain for command forwarding.
# Unknown keys are stripped before the call reaches HA.
ALLOWED_DATA_KEYS: dict[str, set[str]] = {
    "light": {
        "brightness", "brightness_pct", "color_temp", "color_temp_kelvin",
        "rgb_color", "rgbw_color", "rgbww_color", "hs_color", "xy_color",
        "color_mode", "effect", "flash", "transition",
    },
    "fan": {"percentage", "oscillating", "direction", "preset_mode"},
    "cover": {"position", "tilt_position"},
    "climate": {
        "temperature", "target_temp_low", "target_temp_high",
        "hvac_mode", "fan_mode", "preset_mode", "swing_mode", "aux_heat",
    },
    "input_number": {"value"},
    "input_select": {"option"},
    "media_player": {
        "volume_level", "media_content_id", "media_content_type",
        "source", "sound_mode",
    },
    "remote": {"command", "device", "num_repeats", "delay_secs", "hold_secs", "activity"},
}

# HA entity-service schemas accept these selectors alongside service-specific
# data. HArvest always supplies the one authorized entity as the target, so
# client-provided selectors must never be forwarded.
TARGET_SELECTOR_KEYS: frozenset[str] = frozenset({
    "entity_id", "device_id", "area_id", "floor_id", "label_id",
})
