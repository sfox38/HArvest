"""tests/test_panel.py

Tests for custom_components.harvest.panel:
  - register_panel()

We verify the correct calls are made to hass.http.async_register_static_paths()
and homeassistant.components.frontend.async_register_built_in_panel().
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.harvest.const import DOMAIN, PANEL_ASSETS_PATH, PANEL_PATH
from custom_components.harvest.panel import register_panel


def _mock_hass(config_dir: str = "/tmp/ha") -> MagicMock:
    hass = MagicMock()
    hass.config.path.return_value = f"{config_dir}/custom_components/{DOMAIN}/panel"
    hass.http.async_register_static_paths = AsyncMock()
    hass.async_add_executor_job = AsyncMock(return_value="0")
    return hass


class TestRegisterPanel:
    """Tests for register_panel()."""

    @pytest.mark.asyncio
    async def test_registers_static_path(self):
        hass = _mock_hass()
        with patch("custom_components.harvest.panel.async_register_built_in_panel"), \
             patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        hass.http.async_register_static_paths.assert_called_once()
        static_configs = hass.http.async_register_static_paths.call_args.args[0]
        assert len(static_configs) == 1
        assert static_configs[0].url_path == f"/{PANEL_ASSETS_PATH}"
        assert static_configs[0].cache_headers is False

    @pytest.mark.asyncio
    async def test_static_path_uses_hass_config_path(self):
        hass = _mock_hass()
        with patch("custom_components.harvest.panel.async_register_built_in_panel"), \
             patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        hass.config.path.assert_any_call("custom_components", DOMAIN, "panel")

    @pytest.mark.asyncio
    async def test_registers_built_in_panel(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        mock_panel.assert_called_once()

    @pytest.mark.asyncio
    async def test_panel_sidebar_title(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        assert kwargs["sidebar_title"] == "HArvest"

    @pytest.mark.asyncio
    async def test_panel_sidebar_icon(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        assert kwargs["sidebar_icon"] == "mdi:leaf"

    @pytest.mark.asyncio
    async def test_panel_frontend_url_path(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        assert kwargs["frontend_url_path"] == PANEL_PATH

    @pytest.mark.asyncio
    async def test_panel_component_name_custom(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        assert kwargs["component_name"] == "custom"

    @pytest.mark.asyncio
    async def test_panel_require_admin_true(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        assert kwargs.get("require_admin") is True

    @pytest.mark.asyncio
    async def test_panel_config_contains_custom_name(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        panel_config = kwargs["config"]
        assert "ha-panel-harvest" in str(panel_config)

    @pytest.mark.asyncio
    async def test_panel_config_embed_iframe_false(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        _, kwargs = mock_panel.call_args
        panel_config = kwargs["config"]["_panel_custom"]
        assert panel_config["embed_iframe"] is False

    @pytest.mark.asyncio
    async def test_panel_hass_passed_first_arg(self):
        hass = _mock_hass()
        with patch(
            "custom_components.harvest.panel.async_register_built_in_panel"
        ) as mock_panel, patch("custom_components.harvest.panel.async_remove_panel"):
            await register_panel(hass)

        args, _ = mock_panel.call_args
        assert args[0] is hass
