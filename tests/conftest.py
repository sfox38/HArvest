"""Shared fixtures for HArvest integration tests."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.harvest.const import DEFAULTS


@pytest.fixture
def mock_hass():
    """Return a minimal mock HomeAssistant instance sufficient for TokenManager."""
    hass = MagicMock()
    hass.config.config_dir = "/tmp/test_harvest_ha"
    return hass


@pytest.fixture
def harvest_config():
    """Return a copy of the default HArvest config dict."""
    return dict(DEFAULTS)


@pytest.fixture
def mock_store():
    """Return a mock HA Store that starts with no stored tokens."""
    store = AsyncMock()
    store.async_load.return_value = None
    store.async_save = AsyncMock()
    return store
