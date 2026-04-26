"""Switch platform for HArvest - kill switch and per-token paused switches."""
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
    """Set up HArvest switch entities from a config entry."""
    data = hass.data[DOMAIN][entry.entry_id]
    controls = data["controls"]
    async_add_entities(controls.build_startup_switches())
    controls.set_switch_add_fn(async_add_entities)
