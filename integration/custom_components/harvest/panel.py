"""Sidebar panel registration for the HArvest integration.

Registers the custom panel with HA's frontend so the HArvest management UI
appears in the HA sidebar.
"""
from __future__ import annotations

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_PATH


def register_panel(hass: HomeAssistant) -> None:
    """Register the HArvest sidebar panel.

    Serves the frontend/dist/ directory as static files.
    Registers the panel in the HA sidebar as 'HArvest' with the mdi:leaf icon.
    """
    hass.http.register_static_path(
        f"/{PANEL_PATH}",
        hass.config.path("custom_components", DOMAIN, "panel"),
        cache_headers=False,
    )

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="HArvest",
        sidebar_icon="mdi:leaf",
        frontend_url_path=PANEL_PATH,
        config={"_panel_custom": {
            "name": "harvest-panel",
            "url_path": PANEL_PATH,
            "embed_iframe": False,
            "trust_external": False,
        }},
        require_admin=False,
    )
