"""Renderer override management for the HArvest integration.

Manages bundled and user-installed renderer overrides. Renderers are JS files
that override built-in widget renderers. The bundled "minimus" renderer ships
with the integration; user renderers are stored as JS files in renderers/user/
with filenames matching their paired theme ID.

Consent state (the AGREE gate) is stored separately so that it persists
across HA restarts and integration reloads.
"""
from __future__ import annotations

import dataclasses
import logging
import re
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

RENDERERS_CONSENT_KEY = "harvest_packs_consent"
RENDERERS_CONSENT_VERSION = 1

_RENDERERS_DIR = Path(__file__).parent / "renderers"
_USER_RENDERERS_DIR = _RENDERERS_DIR / "user"
_RENDERER_ID_RE = re.compile(r"^[a-zA-Z0-9_-]+$")
_MAX_RENDERER_CODE_BYTES = 10 * 1024 * 1024


@dataclasses.dataclass
class RendererDefinition:
    """A renderer override definition."""
    renderer_id: str
    name: str
    description: str
    version: str
    author: str
    is_bundled: bool = False


class RendererManager:
    """Manages renderer override definitions and consent state."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._consent_store: Store = Store(hass, RENDERERS_CONSENT_VERSION, RENDERERS_CONSENT_KEY)
        self._bundled: dict[str, RendererDefinition] = {}
        self._agreed: bool = False

    async def load(self) -> None:
        """Load bundled renderer definitions and consent state."""
        self._bundled["minimus"] = RendererDefinition(
            renderer_id="minimus",
            name="Minimus",
            description="Alternative renderers: dial-based light control and more.",
            version="1.0",
            author="HArvest",
            is_bundled=True,
        )
        self._bundled["shrooms"] = RendererDefinition(
            renderer_id="shrooms",
            name="Shrooms",
            description="Mushroom-inspired renderers: horizontal layout, circular icon shapes, pill sliders.",
            version="1.0",
            author="HArvest",
            is_bundled=True,
        )

        raw = await self._consent_store.async_load()
        if raw:
            self._agreed = bool(raw.get("agreed", False))

    @property
    def agreed(self) -> bool:
        """Whether the admin has consented to running renderer override JS."""
        return self._agreed

    async def set_agreed(self, agreed: bool) -> None:
        """Persist the consent state."""
        self._agreed = agreed
        await self._consent_store.async_save({"agreed": agreed})

    def get(self, renderer_id: str) -> RendererDefinition | None:
        """Return a bundled renderer by ID, or None."""
        return self._bundled.get(renderer_id)

    def get_all(self) -> list[RendererDefinition]:
        """Return all bundled renderers."""
        return list(self._bundled.values())

    def get_renderer_path(self, renderer_id: str) -> Path | None:
        """Return the path to a renderer's JS file, or None if it does not exist.

        Checks bundled renderers first, then user renderers in renderers/user/.
        """
        if ".." in renderer_id or "/" in renderer_id or "\\" in renderer_id:
            return None
        if renderer_id in self._bundled:
            path = _RENDERERS_DIR / f"{renderer_id}.js"
            return path if path.is_file() else None
        path = _USER_RENDERERS_DIR / f"{renderer_id}.js"
        return path if path.is_file() else None

    def has_user_renderer(self, renderer_id: str) -> bool:
        """Check whether a user renderer JS file exists for the given ID."""
        return (_USER_RENDERERS_DIR / f"{renderer_id}.js").is_file()

    def get_code(self, renderer_id: str) -> str | None:
        """Read JS source code for a renderer. Returns None if file not found."""
        path = self.get_renderer_path(renderer_id)
        if path is None:
            return None
        return path.read_text("utf-8")

    async def update_code(self, renderer_id: str, js_code: str) -> None:
        """Write JS source code for a user renderer. Raises ValueError for bundled."""
        if renderer_id in self._bundled:
            raise ValueError("Cannot modify bundled renderer code.")
        self._validate_user_renderer(renderer_id)
        if len(js_code.encode("utf-8")) > _MAX_RENDERER_CODE_BYTES:
            raise ValueError(
                f"Renderer code exceeds {_MAX_RENDERER_CODE_BYTES} bytes."
            )
        await self._hass.async_add_executor_job(self._write_code, renderer_id, js_code)

    async def delete_user_renderer(self, renderer_id: str) -> None:
        """Delete a user renderer's JS file."""
        if renderer_id in self._bundled:
            raise ValueError("Cannot delete a bundled renderer.")
        self._validate_user_renderer(renderer_id)
        await self._hass.async_add_executor_job(self._delete_renderer_file, renderer_id)

    @staticmethod
    def _validate_user_renderer(renderer_id: str) -> None:
        """Reject renderer IDs that could escape the user renderer directory."""
        if not _RENDERER_ID_RE.fullmatch(renderer_id):
            raise ValueError("Invalid renderer ID.")

    @staticmethod
    def _write_code(renderer_id: str, js_code: str) -> None:
        """Write renderer JS to disk (runs in executor)."""
        _USER_RENDERERS_DIR.mkdir(parents=True, exist_ok=True)
        path = _USER_RENDERERS_DIR / f"{renderer_id}.js"
        path.write_text(js_code, "utf-8")

    @staticmethod
    def _delete_renderer_file(renderer_id: str) -> None:
        """Remove a user renderer's JS file (runs in executor)."""
        path = _USER_RENDERERS_DIR / f"{renderer_id}.js"
        if path.is_file():
            path.unlink()


def renderer_to_api_dict(renderer: RendererDefinition) -> dict:
    """Serialise a RendererDefinition for API responses."""
    return {
        "renderer_id": renderer.renderer_id,
        "name": renderer.name,
        "description": renderer.description,
        "version": renderer.version,
        "author": renderer.author,
        "is_bundled": renderer.is_bundled,
    }
