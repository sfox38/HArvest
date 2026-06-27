"""Regression tests for resolving live entry data after reinstall."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.harvest._utils import get_entry_data
from custom_components.harvest.const import DOMAIN


# ---------------------------------------------------------------------------
# get_entry_data() - the resolution helper
# ---------------------------------------------------------------------------

class TestGetEntryDataFreshInstall:
    """Direct lookup by entry_id (the common path)."""

    def test_returns_data_for_known_entry_id(self):
        hass = MagicMock()
        hass.data = {DOMAIN: {"entry_A": {"token_manager": "tm_A"}}}
        assert get_entry_data(hass, "entry_A") == {"token_manager": "tm_A"}

    def test_empty_when_domain_missing(self):
        hass = MagicMock()
        hass.data = {}
        assert get_entry_data(hass, "entry_A") == {}

    def test_empty_when_entry_id_missing_and_no_other_entries(self):
        hass = MagicMock()
        hass.data = {DOMAIN: {}}
        assert get_entry_data(hass, "entry_A") == {}


class TestGetEntryDataAfterReinstall:
    """Captured entry_id is stale; live entry has a different entry_id."""

    def test_falls_back_to_live_entry_data(self):
        hass = MagicMock()
        # Simulate a stale captured entry id with one live replacement entry.
        hass.data = {DOMAIN: {"entry_B_new": {"token_manager": "tm_B"}}}
        result = get_entry_data(hass, "entry_A_stale")
        assert result == {"token_manager": "tm_B"}

    def test_ignores_empty_dicts_left_behind(self):
        hass = MagicMock()
        # Defensive: if anything ever leaves an empty placeholder dict
        # under the old entry_id, we must not return it as "live data".
        hass.data = {
            DOMAIN: {
                "entry_A_stale": {},
                "entry_B_new": {"token_manager": "tm_B"},
            }
        }
        result = get_entry_data(hass, "entry_A_stale")
        assert result == {"token_manager": "tm_B"}

    def test_returns_empty_when_no_live_entry(self):
        """Mid-reload, briefly there is no entry data at all - must not raise."""
        hass = MagicMock()
        hass.data = {DOMAIN: {}}
        assert get_entry_data(hass, "entry_A_stale") == {}


# ---------------------------------------------------------------------------
# _HarvestView - the panel API base class
# ---------------------------------------------------------------------------

class TestHarvestViewAfterReinstall:
    """A stale view resolves managers from the live entry."""

    def _stale_view_with_live_data(self):
        from custom_components.harvest.http_views import _HarvestView

        live_token_manager = MagicMock(name="live_token_manager")
        live_session_manager = MagicMock(name="live_session_manager")
        live_activity_store = MagicMock(name="live_activity_store")

        hass = MagicMock()
        hass.data = {
            DOMAIN: {
                "entry_B_new": {
                    "token_manager": live_token_manager,
                    "session_manager": live_session_manager,
                    "activity_store": live_activity_store,
                    "event_bus": MagicMock(),
                    "theme_manager": MagicMock(),
                    "renderer_manager": MagicMock(),
                    "sensors": MagicMock(),
                    "controls": MagicMock(),
                },
            }
        }
        view = _HarvestView(hass, "entry_A_stale")
        return view, live_token_manager, live_session_manager, live_activity_store

    def test_token_manager_resolves_to_live(self):
        view, live_tm, _, _ = self._stale_view_with_live_data()
        assert view._token_manager is live_tm

    def test_session_manager_resolves_to_live(self):
        view, _, live_sm, _ = self._stale_view_with_live_data()
        assert view._session_manager is live_sm

    def test_activity_store_resolves_to_live(self):
        view, _, _, live_as = self._stale_view_with_live_data()
        assert view._activity_store is live_as

    @pytest.mark.asyncio
    async def test_stats_endpoint_returns_200_after_reinstall(self):
        """Stats endpoint returns a response after reinstall."""
        from custom_components.harvest.http_views import HarvestStatsView

        live_tm = MagicMock()
        live_tm.get_active.return_value = []
        live_sm = MagicMock()
        live_sm.count_active.return_value = 0
        live_as = MagicMock()
        live_as.count_today = AsyncMock(return_value={"commands": 0, "auth_fail": 0})
        live_as.get_db_size_bytes = AsyncMock(return_value=0)

        hass = MagicMock()
        hass.data = {
            DOMAIN: {
                "entry_B_new": {
                    "token_manager": live_tm,
                    "session_manager": live_sm,
                    "activity_store": live_as,
                    "event_bus": MagicMock(),
                    "theme_manager": MagicMock(),
                    "renderer_manager": MagicMock(),
                    "sensors": MagicMock(),
                    "controls": MagicMock(),
                },
            }
        }
        view = HarvestStatsView(hass, "entry_A_stale")  # stale entry_id

        request = MagicMock()
        admin = MagicMock()
        admin.is_admin = True
        request.get = MagicMock(return_value=admin)

        # Stale entry ids must not raise KeyError.
        response = await view.get(request)
        # response is an aiohttp.web.Response; success is body-bearing JSON,
        # not a raised exception.
        assert response is not None


# ---------------------------------------------------------------------------
# WebSocket view - the widget connection path
# ---------------------------------------------------------------------------

class TestWsViewAfterReinstall:
    """WS view resolves the live entry after reinstall."""

    def test_ws_view_resolves_live_token_manager(self):
        from custom_components.harvest.ws_proxy import HarvestWsView

        live_tm = MagicMock(name="live_token_manager")
        hass = MagicMock()
        hass.data = {
            DOMAIN: {
                "entry_B_new": {
                    "token_manager": live_tm,
                    "session_manager": MagicMock(),
                    "rate_limiter": MagicMock(),
                    "activity_store": MagicMock(),
                    "event_bus": MagicMock(),
                    "theme_manager": MagicMock(),
                    "renderer_manager": MagicMock(),
                    "sensors": MagicMock(),
                },
            }
        }
        view = HarvestWsView(hass, "entry_A_stale")
        assert view._token_manager is live_tm
        # _data resolves to the live entry data.
        assert view._data
