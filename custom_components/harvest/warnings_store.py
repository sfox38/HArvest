"""Persistent storage for the panel's drift-warning dismiss state.

Tracks a single field, ``dismissed_at_version``, which records the
``PLATFORM_VERSION`` an admin was running when they last dismissed the
home-screen drift banner. The banner is hidden iff this value equals
the current ``PLATFORM_VERSION``; any integration release invalidates
the dismissal so the next admin to load the panel re-evaluates the
deployment with the new release in mind.

Per SPEC.md Section 12 (Client/Server Compatibility), the dismiss is
intentionally global within a server version (option A). There is no
per-banner or per-origin dismissal; one click hides everything until
the next release. This prevents accidentally-permanent silence after a
one-time dismiss.
"""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

WARNINGS_STORAGE_KEY = "harvest_dismissed_warnings"
WARNINGS_STORAGE_VERSION = 1


class WarningsStore:
    """Persists the single ``dismissed_at_version`` field."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store = Store(hass, WARNINGS_STORAGE_VERSION, WARNINGS_STORAGE_KEY)
        self._dismissed_at_version: str | None = None

    async def load(self) -> None:
        """Read the dismissal state from disk. Safe to call repeatedly."""
        raw = await self._store.async_load()
        if not isinstance(raw, dict):
            return
        value = raw.get("dismissed_at_version")
        if isinstance(value, str) and value.strip():
            self._dismissed_at_version = value

    @property
    def dismissed_at_version(self) -> str | None:
        return self._dismissed_at_version

    def is_dismissed(self, current_version: str) -> bool:
        """Return True iff the banner should be hidden at this version.

        Equality with the current ``PLATFORM_VERSION`` is the only test;
        any integration release (which bumps PLATFORM_VERSION) makes the
        comparison false and the banner reappears.
        """
        return self._dismissed_at_version == current_version

    async def dismiss(self, current_version: str) -> None:
        """Record a dismissal at the given version and persist."""
        self._dismissed_at_version = current_version
        await self._store.async_save({"dismissed_at_version": current_version})

    async def clear(self) -> None:
        """Forget any prior dismissal. Used by tests; no UI exposure."""
        self._dismissed_at_version = None
        await self._store.async_save({})
