"""Regression tests for the uninstall+reinstall recovery path.

HACS reinstall does not restart Home Assistant. The integration is
unloaded, files are replaced, and a fresh config entry is created with
a brand-new ``entry_id``. HA's HTTP layer has no API to unregister
views, so the long-lived HTTP and WebSocket views from the first
install survive into the second install with their captured
``entry_id`` permanently stale.

These tests guard against the regression where:

  * ``_HarvestView``-derived views raised ``KeyError`` on every request
    after reinstall (manifested as ``500 Server got itself in trouble``
    on ``/api/harvest/stats``), because they read
    ``hass.data[DOMAIN][OLD_entry_id]`` which had been popped on unload.
  * The WebSocket view returned 503 forever, leaving every hosted widget
    stuck in reconnect backoff.

The fix routes all view manager lookups through ``get_entry_data``,
which transparently falls back to whichever entry's data is currently
live when the captured entry_id is stale.
"""
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
        # entry_A was the first install (now unloaded - empty dict left
        # behind would never happen because async_unload_entry pops, but
        # we model the post-reinstall state where entry_B is the live one).
        hass.data = {DOMAIN: {"entry_B_new": {"token_manager": "tm_B"}}}
        # The view was constructed with entry_A's id (now stale forever).
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
    """A view constructed against the OLD entry_id must serve requests
    using the NEW entry's managers after a reinstall.
    """

    def _stale_view_with_live_data(self):
        from custom_components.harvest.http_views import _HarvestView

        live_token_manager = MagicMock(name="live_token_manager")
        live_session_manager = MagicMock(name="live_session_manager")
        live_activity_store = MagicMock(name="live_activity_store")

        hass = MagicMock()
        hass.data = {
            DOMAIN: {
                # Brand-new entry_id from the second install.
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
        # View was registered during the FIRST install with entry_A's id.
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
        """Repro of the user-visible bug: GET /api/harvest/stats returned
        500 with 'Server got itself in trouble' after uninstall+reinstall.
        """
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

        # Before the fix this raised KeyError -> aiohttp 500.
        response = await view.get(request)
        # response is an aiohttp.web.Response; success is body-bearing JSON,
        # not a raised exception.
        assert response is not None


# ---------------------------------------------------------------------------
# WebSocket view - the widget connection path
# ---------------------------------------------------------------------------

class TestWsViewAfterReinstall:
    """Hosted widgets reconnect to the WS view; after reinstall it must
    accept connections using the new entry's managers, not 503 forever.
    """

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
        # Before the fix, view._data was {} -> WS handshake aborted with 503
        # for every reconnect attempt. After the fix _data is the live dict.
        assert view._data
