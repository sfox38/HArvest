"""Sidebar panel registration for the HArvest integration.

Registers the custom panel with HA's frontend so the HArvest management UI
appears in the HA sidebar.
"""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel, async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_PATH, PANEL_ASSETS_PATH

_LOGGER = logging.getLogger(__name__)


async def register_panel(hass: HomeAssistant) -> None:
    """Register the HArvest sidebar panel.

    Serves the panel/ directory as static files under /{PANEL_ASSETS_PATH}/.
    The panel UI is registered at /{PANEL_PATH}/ (sidebar URL).
    Using a separate assets path avoids a 403 when the browser makes a direct
    GET to /{PANEL_PATH} on full page reload (directory listing is forbidden).

    panel.js is served via HarvestPanelJsView (Cache-Control: no-store) so
    an updated bundle is picked up on the next page load without an HA restart.
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
        )
    ])

    # Remove any existing panel registration before re-registering.
    try:
        async_remove_panel(hass, PANEL_PATH)
    except Exception:
        pass

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="HArvest",
        sidebar_icon="mdi:leaf",
        frontend_url_path=PANEL_PATH,
        config={"_panel_custom": {
            "name": "ha-panel-harvest",
            "js_url": "/api/harvest/panel.js",
            "embed_iframe": False,
            "trust_external": False,
        }},
        require_admin=True,
    )
