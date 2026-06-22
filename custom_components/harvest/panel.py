"""Sidebar panel registration for the HArvest integration.

Registers the custom panel with HA's frontend so the HArvest management UI
appears in the HA sidebar.
"""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import (
    DATA_PANELS,
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_PATH, PANEL_ASSETS_PATH

_LOGGER = logging.getLogger(__name__)


def _read_panel_version(panel_dir: str) -> str:
    """Return the panel build number written by the frontend build.

    The frontend build writes panel_version.txt next to panel.js (see
    frontend/scripts/increment-build.js). It is used to cache-bust js_url.
    Returns "" when the file is missing (e.g. an unbuilt checkout).
    """
    try:
        return (Path(panel_dir) / "panel_version.txt").read_text().strip()
    except OSError:
        return ""


async def register_panel(hass: HomeAssistant) -> None:
    """Register the HArvest sidebar panel.

    Serves the panel/ directory as static files under /{PANEL_ASSETS_PATH}/.
    The panel UI is registered at /{PANEL_PATH}/ (sidebar URL).
    Using a separate assets path avoids a 403 when the browser makes a direct
    GET to /{PANEL_PATH} on full page reload (directory listing is forbidden).

    js_url carries the build number (panel_version.txt) as a ?v= query so the
    bundle can be cached hard by the browser: HarvestPanelJsView serves a
    versioned request with long immutable caching. The URL is recomputed each
    time the panel is registered, so a new build (new version) is picked up
    when the integration reloads on update or restart. Without a version (an
    unbuilt checkout) the view falls back to no-store.
    """
    panel_dir = hass.config.path("custom_components", DOMAIN, "panel")
    panel_js = Path(panel_dir) / "panel.js"
    if not panel_js.is_file():
        # Surface this in HA logs at startup so admins notice immediately
        # rather than discovering it as a 404 in the browser console after
        # clicking the sidebar entry. We register the panel anyway so the
        # integration's other endpoints (WebSocket, panel API, diagnostic
        # entities) remain functional - only the sidebar UI is broken.
        _LOGGER.warning(
            "HArvest panel.js not found at %s. The HArvest sidebar panel "
            "will load with a 404 until the bundle is built (run "
            "`npm run build` from the frontend/ directory). Other "
            "integration endpoints continue to work normally.",
            panel_js,
        )

    await hass.http.async_register_static_paths([
        StaticPathConfig(
            f"/{PANEL_ASSETS_PATH}",
            panel_dir,
            cache_headers=False,
        ),
    ])

    # Cache-bust the bundle URL with the build number written by the frontend
    # build, so the browser can cache panel.js across panel opens yet still
    # pick up a new build (the version, and thus the URL, changes).
    panel_version = await hass.async_add_executor_job(_read_panel_version, panel_dir)
    js_url = "/api/harvest/panel.js"
    if panel_version:
        js_url = f"{js_url}?v={panel_version}"

    # Remove any existing panel registration before re-registering (e.g. on
    # integration reload). Skipped on fresh startup: calling async_remove_panel
    # for a panel that is not registered logs a "Removing unknown panel"
    # warning rather than raising.
    if PANEL_PATH in hass.data.get(DATA_PANELS, {}):
        async_remove_panel(hass, PANEL_PATH)

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="HArvest",
        sidebar_icon="mdi:leaf",
        frontend_url_path=PANEL_PATH,
        config={"_panel_custom": {
            "name": "ha-panel-harvest",
            "js_url": js_url,
            "embed_iframe": False,
            "trust_external": False,
        }},
        require_admin=True,
    )
