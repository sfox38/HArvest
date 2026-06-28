"""Tests for warning dismissal storage and endpoints."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.harvest.const import DOMAIN
from custom_components.harvest.warnings_store import (
    WARNINGS_STORAGE_KEY,
    WARNINGS_STORAGE_VERSION,
    WarningsStore,
)


# ---------------------------------------------------------------------------
# WarningsStore unit tests
# ---------------------------------------------------------------------------

class TestWarningsStoreLoad:
    @pytest.mark.asyncio
    async def test_empty_storage_leaves_field_none(self):
        hass = MagicMock()
        store = WarningsStore(hass)
        store._store = MagicMock()
        store._store.async_load = AsyncMock(return_value=None)
        await store.load()
        assert store.dismissed_at_version is None

    @pytest.mark.asyncio
    async def test_loads_persisted_version(self):
        hass = MagicMock()
        store = WarningsStore(hass)
        store._store = MagicMock()
        store._store.async_load = AsyncMock(return_value={"dismissed_at_version": "0.9.3"})
        await store.load()
        assert store.dismissed_at_version == "0.9.3"

    @pytest.mark.asyncio
    async def test_blank_string_treated_as_no_dismissal(self):
        hass = MagicMock()
        store = WarningsStore(hass)
        store._store = MagicMock()
        store._store.async_load = AsyncMock(return_value={"dismissed_at_version": "   "})
        await store.load()
        assert store.dismissed_at_version is None

    @pytest.mark.asyncio
    async def test_non_string_value_ignored(self):
        # Defensive against corrupted storage.
        hass = MagicMock()
        store = WarningsStore(hass)
        store._store = MagicMock()
        store._store.async_load = AsyncMock(return_value={"dismissed_at_version": 42})
        await store.load()
        assert store.dismissed_at_version is None


class TestWarningsStoreIsDismissed:
    def test_matching_version_is_dismissed(self):
        store = WarningsStore(MagicMock())
        store._dismissed_at_version = "0.9.3"
        assert store.is_dismissed("0.9.3") is True

    def test_different_version_not_dismissed(self):
        # Integration release MUST invalidate dismissal - SPEC option A.
        store = WarningsStore(MagicMock())
        store._dismissed_at_version = "0.9.3"
        assert store.is_dismissed("0.9.4") is False
        assert store.is_dismissed("1.0.0") is False

    def test_no_prior_dismissal(self):
        store = WarningsStore(MagicMock())
        assert store.is_dismissed("0.9.3") is False


class TestWarningsStoreDismiss:
    @pytest.mark.asyncio
    async def test_dismiss_records_version_and_persists(self):
        store = WarningsStore(MagicMock())
        store._store = MagicMock()
        store._store.async_save = AsyncMock()

        await store.dismiss("0.9.3")

        assert store.dismissed_at_version == "0.9.3"
        store._store.async_save.assert_awaited_once_with({"dismissed_at_version": "0.9.3"})

    @pytest.mark.asyncio
    async def test_dismiss_idempotent(self):
        # Posting twice in a row at the same version should be a clean no-op
        # from the user's perspective; the implementation may still write
        # both times, which is fine.
        store = WarningsStore(MagicMock())
        store._store = MagicMock()
        store._store.async_save = AsyncMock()

        await store.dismiss("0.9.3")
        await store.dismiss("0.9.3")

        assert store.dismissed_at_version == "0.9.3"
        assert store._store.async_save.await_count == 2

    @pytest.mark.asyncio
    async def test_dismiss_overwrites_old_version(self):
        # When PLATFORM_VERSION bumps and admin dismisses again, the new
        # value replaces the old one rather than accumulating.
        store = WarningsStore(MagicMock())
        store._store = MagicMock()
        store._store.async_save = AsyncMock()

        await store.dismiss("0.9.3")
        await store.dismiss("0.9.4")

        assert store.dismissed_at_version == "0.9.4"


# ---------------------------------------------------------------------------
# Storage key constants (smoke - guards against accidental rename that
# would orphan existing dismissal records on user installs)
# ---------------------------------------------------------------------------

class TestStorageKey:
    def test_storage_key_is_stable(self):
        assert WARNINGS_STORAGE_KEY == "harvest_dismissed_warnings"

    def test_storage_version_is_one(self):
        assert WARNINGS_STORAGE_VERSION == 1


# ---------------------------------------------------------------------------
# HTTP endpoint tests
# ---------------------------------------------------------------------------

_TEST_ENTRY_ID = "test_entry"


def _make_view(view_cls, *, warnings_store=None, hass=None):
    if hass is None:
        hass = MagicMock()
    if warnings_store is None:
        warnings_store = MagicMock()
        warnings_store.dismissed_at_version = None
        warnings_store.dismiss = AsyncMock()
    hass.data = {DOMAIN: {_TEST_ENTRY_ID: {
        "token_manager": MagicMock(),
        "session_manager": MagicMock(),
        "activity_store": MagicMock(),
        "event_bus": MagicMock(),
        "theme_manager": MagicMock(),
        "renderer_manager": MagicMock(),
        "warnings_store": warnings_store,
    }}}
    return view_cls(hass, _TEST_ENTRY_ID), warnings_store


def _make_admin_request():
    req = MagicMock()
    user = MagicMock()
    user.is_admin = True
    req.get = MagicMock(return_value=user)
    return req


def _make_non_admin_request():
    req = MagicMock()
    user = MagicMock()
    user.is_admin = False
    req.get = MagicMock(return_value=user)
    return req


class TestHarvestWarningsView:
    @pytest.mark.asyncio
    async def test_returns_dismissed_false_when_never_dismissed(self):
        from custom_components.harvest.http_views import HarvestWarningsView
        view, store = _make_view(HarvestWarningsView)
        store.dismissed_at_version = None
        resp = await view.get(_make_admin_request())
        body = resp.body.decode()
        assert '"dismissed":false' in body
        assert '"dismissed_at_version":null' in body
        assert '"current_version"' in body

    @pytest.mark.asyncio
    async def test_returns_dismissed_true_when_versions_match(self, monkeypatch):
        from custom_components.harvest import http_views as hv
        from custom_components.harvest import const as const_mod
        monkeypatch.setattr(const_mod, "PLATFORM_VERSION", "0.9.3")
        view, store = _make_view(hv.HarvestWarningsView)
        store.dismissed_at_version = "0.9.3"
        resp = await view.get(_make_admin_request())
        assert b'"dismissed":true' in resp.body
        assert b'"dismissed_at_version":"0.9.3"' in resp.body

    @pytest.mark.asyncio
    async def test_returns_dismissed_false_when_versions_differ(self, monkeypatch):
        # Integration release case: stored value lags PLATFORM_VERSION.
        from custom_components.harvest import http_views as hv
        from custom_components.harvest import const as const_mod
        monkeypatch.setattr(const_mod, "PLATFORM_VERSION", "0.9.4")
        view, store = _make_view(hv.HarvestWarningsView)
        store.dismissed_at_version = "0.9.3"
        resp = await view.get(_make_admin_request())
        assert b'"dismissed":false' in resp.body

    @pytest.mark.asyncio
    async def test_non_admin_forbidden(self):
        from custom_components.harvest.http_views import HarvestWarningsView
        from aiohttp import web as aiohttp_web
        view, _ = _make_view(HarvestWarningsView)
        with pytest.raises(aiohttp_web.HTTPForbidden):
            await view.get(_make_non_admin_request())

    @pytest.mark.asyncio
    async def test_missing_warnings_store_falls_back_gracefully(self):
        # During the unload/reload gap warnings_store may be None.
        # Endpoint must not crash; returns dismissed=false.
        from custom_components.harvest.http_views import HarvestWarningsView
        hass = MagicMock()
        hass.data = {DOMAIN: {_TEST_ENTRY_ID: {
            "token_manager": MagicMock(),
            "session_manager": MagicMock(),
            "activity_store": MagicMock(),
            "event_bus": MagicMock(),
            "theme_manager": MagicMock(),
            "renderer_manager": MagicMock(),
            # warnings_store deliberately absent
        }}}
        view = HarvestWarningsView(hass, _TEST_ENTRY_ID)
        resp = await view.get(_make_admin_request())
        assert b'"dismissed":false' in resp.body


class TestHarvestWarningsDismissView:
    @pytest.mark.asyncio
    async def test_dismiss_records_at_current_version(self, monkeypatch):
        from custom_components.harvest import http_views as hv
        from custom_components.harvest import const as const_mod
        monkeypatch.setattr(const_mod, "PLATFORM_VERSION", "0.9.3")
        view, store = _make_view(hv.HarvestWarningsDismissView)
        resp = await view.post(_make_admin_request())
        store.dismiss.assert_awaited_once_with("0.9.3")
        assert b'"dismissed":true' in resp.body
        assert b'"dismissed_at_version":"0.9.3"' in resp.body

    @pytest.mark.asyncio
    async def test_non_admin_forbidden(self):
        from custom_components.harvest.http_views import HarvestWarningsDismissView
        from aiohttp import web as aiohttp_web
        view, _ = _make_view(HarvestWarningsDismissView)
        with pytest.raises(aiohttp_web.HTTPForbidden):
            await view.post(_make_non_admin_request())

    @pytest.mark.asyncio
    async def test_missing_store_returns_503(self):
        from custom_components.harvest.http_views import HarvestWarningsDismissView
        from aiohttp import web as aiohttp_web
        hass = MagicMock()
        hass.data = {DOMAIN: {_TEST_ENTRY_ID: {
            "token_manager": MagicMock(),
            "session_manager": MagicMock(),
            "activity_store": MagicMock(),
            "event_bus": MagicMock(),
            "theme_manager": MagicMock(),
            "renderer_manager": MagicMock(),
            # no warnings_store
        }}}
        view = HarvestWarningsDismissView(hass, _TEST_ENTRY_ID)
        with pytest.raises(aiohttp_web.HTTPServiceUnavailable):
            await view.post(_make_admin_request())
