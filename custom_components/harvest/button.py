"""Button platform for HArvest - close-all-sessions button."""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up HArvest button entities from a config entry."""
    data = hass.data[DOMAIN][entry.entry_id]
    controls = data["controls"]
    async_add_entities(controls.build_startup_buttons())
