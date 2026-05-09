"""Shared utility helpers used across multiple modules.

Lives separately from const.py so functions and constants do not mix.
"""
from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN, ERR_TOKEN_INACTIVE


def get_entry_data(hass: HomeAssistant, entry_id: str) -> dict:
    """Return the live integration data dict for a config entry.

    Views and other long-lived registrations look up managers through this
    helper instead of caching them as instance fields. On config-entry
    reload, ``hass.data[DOMAIN][entry_id]`` is repopulated with fresh
    manager instances; cached refs would otherwise point at the unloaded
    set. Returns an empty dict during the brief gap between unload and
    re-setup so callers can degrade gracefully (return None / 503 / etc.)
    rather than raise KeyError on a transient race.
    """
    return hass.data.get(DOMAIN, {}).get(entry_id, {})


async def close_ws(ws: Any) -> None:
    """Close a WebSocket cleanly. Used when the close itself is the message
    (e.g., HarvestCloseAllSessionsButton, where reconnects are allowed).

    Swallows exceptions so a single ws-already-closed condition does not abort
    a bulk close loop.
    """
    try:
        await ws.close()
    except Exception:
        pass


async def close_ws_with_auth_failed(ws: Any) -> None:
    """Send `auth_failed` with HRV_TOKEN_INACTIVE before closing.

    Used by paths that need the client to enter a permanent failure state
    (HRV_AUTH_FAILED) rather than re-connect transparently. The auth_failed
    frame tells the widget this is an admin-driven rejection, not a network
    blip; without it the widget falls into HRV_OFFLINE backoff and retries
    until the server-side check rejects the next attempt anyway.

    Callers: PATCH on security-relevant token fields, kill switch turning ON
    (both panel-API and switch-entity entry points).
    """
    try:
        await ws.send_json({"type": "auth_failed", "code": ERR_TOKEN_INACTIVE, "msg_id": None})
        await ws.close()
    except Exception:
        pass


def slugify(label: str, fallback: str = "unnamed") -> str:
    """Convert a human-readable label to a slug suitable for entity_id use.

    Lowercases, replaces spaces and hyphens with underscores, removes any
    character that is not alphanumeric or underscore, collapses runs of
    underscores, and strips leading/trailing underscores. Returns ``fallback``
    if the resulting slug is empty.

    Used by diagnostic_sensors.py and control_entities.py for token-derived
    sensor/switch entity IDs (default fallback "unnamed") and by
    harvest_action.py for action-derived virtual entity IDs (fallback "action").
    """
    slug = label.lower().strip()
    slug = re.sub(r"[\s\-]+", "_", slug)
    slug = re.sub(r"[^a-z0-9_]", "", slug)
    slug = re.sub(r"_+", "_", slug).strip("_")
    return slug or fallback
