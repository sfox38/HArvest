"""Shared utility helpers used across multiple modules.

Lives separately from const.py so functions and constants do not mix.
"""
from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN, ERR_TOKEN_INACTIVE


def get_entry_data(hass: HomeAssistant, entry_id: str) -> dict:
    """Return the live integration data dict for the (single) HArvest entry.

    HArvest is single-instance by design: ``config_flow.py`` uses ``DOMAIN``
    as the unique_id and aborts on duplicates. Views and other long-lived
    registrations look up managers through this helper rather than caching
    them as instance fields, so a config-entry reload (which repopulates
    ``hass.data[DOMAIN]``) does not leave them pointing at unloaded
    managers.

    The ``entry_id`` parameter is the entry_id captured at view construction.
    On a normal reload it is still the live key, so we try it first. After
    an uninstall+reinstall, HA assigns a brand-new entry_id and cannot
    unregister the long-lived HTTP/WS views, so the captured entry_id is
    stale forever; we then fall back to whichever live entry data exists.
    Returns ``{}`` during the brief gap between unload and re-setup, or
    when the integration is fully removed, so callers can degrade
    gracefully instead of raising ``KeyError``.
    """
    domain_data = hass.data.get(DOMAIN, {})
    direct = domain_data.get(entry_id)
    if isinstance(direct, dict) and "token_manager" in direct:
        return direct
    # Stale entry_id (post-reinstall) - find the live entry's data dict.
    for value in domain_data.values():
        if isinstance(value, dict) and "token_manager" in value:
            return value
    return {}


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
