"""Renderer pack management for the HArvest integration.

Manages bundled and user-installed renderer packs. Packs are JS files that
override built-in widget renderers. The bundled "examples" pack ships with
the integration; custom packs are uploaded via the panel UI.

Consent state (the AGREE gate) is stored separately from pack definitions
so that it persists across HA restarts and integration reloads.
"""
from __future__ import annotations

import dataclasses
import logging
import secrets
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import BASE62_ALPHABET, PACK_ID_LENGTH, PACK_PREFIX

_LOGGER = logging.getLogger(__name__)

PACKS_CONSENT_KEY = "harvest_packs_consent"
PACKS_CONSENT_VERSION = 1

PACKS_STORAGE_KEY = "harvest_packs"
PACKS_STORAGE_VERSION = 1

_PACKS_DIR = Path(__file__).parent / "packs"
_CUSTOM_PACKS_DIR = _PACKS_DIR / "custom"


@dataclasses.dataclass
class PackDefinition:
    """A renderer pack definition."""
    pack_id: str
    name: str
    description: str
    version: str
    author: str
    is_bundled: bool = False


class PackManager:
    """Manages renderer pack definitions and consent state."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._consent_store: Store = Store(hass, PACKS_CONSENT_VERSION, PACKS_CONSENT_KEY)
        self._packs_store: Store = Store(hass, PACKS_STORAGE_VERSION, PACKS_STORAGE_KEY)
        self._bundled: dict[str, PackDefinition] = {}
        self._custom: dict[str, PackDefinition] = {}
        self._agreed: bool = False

    async def load(self) -> None:
        """Load bundled pack definitions, custom packs, and consent state."""
        self._bundled["examples"] = PackDefinition(
            pack_id="examples",
            name="Examples",
            description="Alternative renderers: dial-based light control and more.",
            version="1.0",
            author="HArvest",
            is_bundled=True,
        )

        raw = await self._consent_store.async_load()
        if raw:
            self._agreed = bool(raw.get("agreed", False))

        packs_raw = await self._packs_store.async_load()
        if packs_raw:
            for item in packs_raw.get("packs", []):
                try:
                    pack = _pack_from_dict(item)
                except (KeyError, TypeError):
                    _LOGGER.warning("HArvest: skipping malformed pack: %s", item)
                    continue
                self._custom[pack.pack_id] = pack

    async def _save(self) -> None:
        """Persist custom pack metadata to HA storage."""
        await self._packs_store.async_save(
            {"packs": [_pack_to_dict(p) for p in self._custom.values()]}
        )

    def _generate_id(self) -> str:
        """Generate a unique pack ID with hpk_ prefix."""
        while True:
            candidate = PACK_PREFIX + "".join(
                secrets.choice(BASE62_ALPHABET) for _ in range(PACK_ID_LENGTH)
            )
            if candidate not in self._custom:
                return candidate

    @property
    def agreed(self) -> bool:
        """Whether the admin has consented to running renderer pack JS."""
        return self._agreed

    async def set_agreed(self, agreed: bool) -> None:
        """Persist the consent state."""
        self._agreed = agreed
        await self._consent_store.async_save({"agreed": agreed})

    def get(self, pack_id: str) -> PackDefinition | None:
        """Return a pack by ID, checking both bundled and custom."""
        return self._bundled.get(pack_id) or self._custom.get(pack_id)

    def get_all(self) -> list[PackDefinition]:
        """Return all available packs, bundled first then custom."""
        return list(self._bundled.values()) + list(self._custom.values())

    def get_pack_path(self, pack_id: str) -> Path | None:
        """Return the path to a pack's JS file, or None if it does not exist."""
        if pack_id in self._bundled:
            path = _PACKS_DIR / f"{pack_id}.js"
            return path if path.is_file() else None
        if pack_id in self._custom:
            path = _CUSTOM_PACKS_DIR / f"{pack_id}.js"
            return path if path.is_file() else None
        return None

    async def create(
        self,
        name: str,
        description: str = "",
        version: str = "1.0",
        author: str = "",
        js_code: str = "",
        pack_id: str = "",
    ) -> PackDefinition:
        """Create a custom pack with optional initial JS code.

        If pack_id is provided it is used as-is (caller must ensure uniqueness);
        otherwise a random hpk_ ID is generated.
        """
        if pack_id:
            if pack_id in self._bundled:
                raise ValueError(f"Pack ID conflicts with a bundled pack: {pack_id}")
            if pack_id in self._custom:
                raise ValueError(f"Pack ID already in use: {pack_id}")
            pid = pack_id
        else:
            pid = self._generate_id()
        pack = PackDefinition(
            pack_id=pid,
            name=name,
            description=description,
            version=version,
            author=author,
            is_bundled=False,
        )
        self._custom[pack.pack_id] = pack
        await self._save()
        if js_code:
            await self._hass.async_add_executor_job(
                self._write_code, pack.pack_id, js_code,
            )
        return pack

    async def update(self, pack_id: str, updates: dict) -> PackDefinition:
        """Update custom pack metadata. Raises ValueError for bundled, KeyError if missing."""
        if pack_id in self._bundled:
            raise ValueError("Cannot modify a bundled pack.")
        pack = self._custom.get(pack_id)
        if pack is None:
            raise KeyError(f"Pack not found: {pack_id}")

        _UPDATABLE = {"name", "description", "version", "author"}
        for field, value in updates.items():
            if field in _UPDATABLE:
                setattr(pack, field, value)

        await self._save()
        return pack

    async def update_code(self, pack_id: str, js_code: str) -> None:
        """Write JS source code for a custom pack. Raises ValueError for bundled."""
        if pack_id in self._bundled:
            raise ValueError("Cannot modify bundled pack code.")
        if pack_id not in self._custom:
            raise KeyError(f"Pack not found: {pack_id}")
        await self._hass.async_add_executor_job(self._write_code, pack_id, js_code)

    def get_code(self, pack_id: str) -> str | None:
        """Read JS source code for a pack. Returns None if file not found."""
        path = self.get_pack_path(pack_id)
        if path is None:
            return None
        return path.read_text("utf-8")

    async def delete(self, pack_id: str) -> None:
        """Delete a custom pack and its JS file. Raises ValueError for bundled."""
        if pack_id in self._bundled:
            raise ValueError("Cannot delete a bundled pack.")
        if pack_id not in self._custom:
            raise KeyError(f"Pack not found: {pack_id}")
        del self._custom[pack_id]
        js_path = _CUSTOM_PACKS_DIR / f"{pack_id}.js"
        if js_path.is_file():
            js_path.unlink()
        await self._save()

    @staticmethod
    def _write_code(pack_id: str, js_code: str) -> None:
        """Write pack JS to disk (runs in executor)."""
        _CUSTOM_PACKS_DIR.mkdir(parents=True, exist_ok=True)
        path = _CUSTOM_PACKS_DIR / f"{pack_id}.js"
        path.write_text(js_code, "utf-8")


def _pack_to_dict(pack: PackDefinition) -> dict:
    """Serialise a PackDefinition to a JSON-compatible dict for storage."""
    return {
        "pack_id": pack.pack_id,
        "name": pack.name,
        "description": pack.description,
        "version": pack.version,
        "author": pack.author,
    }


def _pack_from_dict(d: dict) -> PackDefinition:
    """Deserialise a PackDefinition from a storage dict."""
    return PackDefinition(
        pack_id=d["pack_id"],
        name=d["name"],
        description=d.get("description", ""),
        version=d.get("version", "1.0"),
        author=d.get("author", ""),
        is_bundled=False,
    )


def pack_to_api_dict(pack: PackDefinition) -> dict:
    """Serialise a PackDefinition for API responses."""
    d = _pack_to_dict(pack)
    d["is_bundled"] = pack.is_bundled
    return d
