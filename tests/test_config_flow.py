"""tests/test_config_flow.py

Tests for custom_components.harvest.config_flow:
  - HarvestConfigFlow.async_step_user()
  - HarvestOptionsFlow.async_step_init()
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.harvest.config_flow import HarvestConfigFlow, HarvestOptionsFlow
from custom_components.harvest.const import DOMAIN


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_flow() -> HarvestConfigFlow:
    """Return a HarvestConfigFlow with the minimum HA plumbing mocked."""
    flow = HarvestConfigFlow()
    # HA requires hass to be set on the flow object.
    flow.hass = MagicMock()
    flow.context = {}
    flow._unique_id = None

    # Stub the methods ConfigFlow uses internally.
    flow.async_set_unique_id = AsyncMock()
    flow._abort_if_unique_id_configured = MagicMock()
    flow.async_create_entry = MagicMock(return_value={"type": "create_entry", "title": "HArvest", "data": {}})
    flow.async_show_form = MagicMock(return_value={"type": "form", "step_id": "user"})

    return flow


def _make_options_flow(options: dict | None = None) -> HarvestOptionsFlow:
    """Return a HarvestOptionsFlow with a stub config entry."""
    entry = MagicMock()
    entry.options = options or {}
    flow = HarvestOptionsFlow(entry)
    flow.async_create_entry = MagicMock(
        return_value={"type": "create_entry", "title": "", "data": entry.options}
    )
    flow.async_show_form = MagicMock(return_value={"type": "form", "step_id": "init"})
    return flow


# ---------------------------------------------------------------------------
# HarvestConfigFlow.async_step_user()
# ---------------------------------------------------------------------------

class TestHarvestConfigFlow:
    """Tests for the initial config flow step."""

    @pytest.mark.asyncio
    async def test_first_visit_shows_form(self):
        flow = _make_flow()
        result = await flow.async_step_user(user_input=None)
        flow.async_show_form.assert_called_once()
        assert result["type"] == "form"

    @pytest.mark.asyncio
    async def test_form_step_id_is_user(self):
        flow = _make_flow()
        await flow.async_step_user(user_input=None)
        _, kwargs = flow.async_show_form.call_args
        assert kwargs["step_id"] == "user"

    @pytest.mark.asyncio
    async def test_form_schema_is_empty(self):
        import voluptuous as vol
        flow = _make_flow()
        await flow.async_step_user(user_input=None)
        _, kwargs = flow.async_show_form.call_args
        # data_schema should be an empty vol.Schema
        schema = kwargs["data_schema"]
        assert isinstance(schema, vol.Schema)
        # Applying the schema to an empty dict should return {}
        assert schema({}) == {}

    @pytest.mark.asyncio
    async def test_submit_creates_entry(self):
        flow = _make_flow()
        result = await flow.async_step_user(user_input={})
        flow.async_create_entry.assert_called_once()
        assert result["type"] == "create_entry"

    @pytest.mark.asyncio
    async def test_entry_title_is_harvest(self):
        flow = _make_flow()
        await flow.async_step_user(user_input={})
        _, kwargs = flow.async_create_entry.call_args
        assert kwargs["title"] == "HArvest"

    @pytest.mark.asyncio
    async def test_entry_data_is_empty_dict(self):
        flow = _make_flow()
        await flow.async_step_user(user_input={})
        _, kwargs = flow.async_create_entry.call_args
        assert kwargs["data"] == {}

    @pytest.mark.asyncio
    async def test_sets_unique_id_to_domain(self):
        flow = _make_flow()
        await flow.async_step_user(user_input=None)
        flow.async_set_unique_id.assert_called_once_with(DOMAIN)

    @pytest.mark.asyncio
    async def test_aborts_if_already_configured(self):
        flow = _make_flow()
        # Simulate an existing entry: _abort_if_unique_id_configured raises AbortFlow.
        from homeassistant.exceptions import HomeAssistantError
        flow._abort_if_unique_id_configured = MagicMock(side_effect=Exception("already_configured"))
        with pytest.raises(Exception, match="already_configured"):
            await flow.async_step_user(user_input=None)

    def test_version_is_1(self):
        assert HarvestConfigFlow.VERSION == 1

    def test_async_get_options_flow_returns_options_flow(self):
        entry = MagicMock()
        result = HarvestConfigFlow.async_get_options_flow(entry)
        assert isinstance(result, HarvestOptionsFlow)

    def test_async_get_options_flow_passes_entry(self):
        entry = MagicMock()
        result = HarvestConfigFlow.async_get_options_flow(entry)
        # The entry should be stored on the flow.
        assert result._config_entry is entry


# ---------------------------------------------------------------------------
# HarvestOptionsFlow.async_step_init()
# ---------------------------------------------------------------------------

class TestHarvestOptionsFlow:
    """Tests for the options flow step."""

    @pytest.mark.asyncio
    async def test_first_visit_shows_form(self):
        flow = _make_options_flow()
        result = await flow.async_step_init(user_input=None)
        flow.async_show_form.assert_called_once()
        assert result["type"] == "form"

    @pytest.mark.asyncio
    async def test_form_step_id_is_init(self):
        flow = _make_options_flow()
        await flow.async_step_init(user_input=None)
        _, kwargs = flow.async_show_form.call_args
        assert kwargs["step_id"] == "init"

    @pytest.mark.asyncio
    async def test_form_includes_panel_url_placeholder(self):
        flow = _make_options_flow()
        await flow.async_step_init(user_input=None)
        _, kwargs = flow.async_show_form.call_args
        placeholders = kwargs.get("description_placeholders", {})
        assert "panel_url" in placeholders
        assert placeholders["panel_url"] == "/harvest"

    @pytest.mark.asyncio
    async def test_submit_creates_entry(self):
        flow = _make_options_flow(options={"key": "value"})
        result = await flow.async_step_init(user_input={})
        flow.async_create_entry.assert_called_once()
        assert result["type"] == "create_entry"

    @pytest.mark.asyncio
    async def test_submit_preserves_existing_options(self):
        opts = {"existing_key": "existing_value"}
        flow = _make_options_flow(options=opts)
        await flow.async_step_init(user_input={})
        _, kwargs = flow.async_create_entry.call_args
        assert kwargs["data"] == opts

    @pytest.mark.asyncio
    async def test_form_schema_is_empty_vol_schema(self):
        import voluptuous as vol
        flow = _make_options_flow()
        await flow.async_step_init(user_input=None)
        _, kwargs = flow.async_show_form.call_args
        schema = kwargs["data_schema"]
        assert isinstance(schema, vol.Schema)
        assert schema({}) == {}
