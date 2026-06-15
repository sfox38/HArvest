"""Tests for custom renderer consent persistence."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.harvest.renderer_manager import RendererManager


@pytest.mark.asyncio
async def test_load_restores_renderer_consent() -> None:
    """The integration-wide renderer gate remains accepted after reload."""
    store = MagicMock()
    store.async_load = AsyncMock(return_value={"agreed": True})

    with patch("custom_components.harvest.renderer_manager.Store", return_value=store):
        manager = RendererManager(MagicMock())
        await manager.load()

    assert manager.agreed is True


@pytest.mark.asyncio
async def test_set_agreed_persists_renderer_consent() -> None:
    """Accepting the renderer gate writes the integration-wide state."""
    store = MagicMock()
    store.async_save = AsyncMock()

    with patch("custom_components.harvest.renderer_manager.Store", return_value=store):
        manager = RendererManager(MagicMock())
        await manager.set_agreed(True)

    assert manager.agreed is True
    store.async_save.assert_awaited_once_with({"agreed": True})
