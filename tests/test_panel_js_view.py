"""Tests for HarvestPanelJsView (the panel bundle endpoint).

The bundle is a mutable, non-content-hashed file, so it is served with
`Cache-Control: no-cache` + an ETag. The browser revalidates on every load: an
unchanged bundle gets a 304, and a rebuilt bundle is fetched fresh - no
integration reload or HA restart needed.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.harvest.const import DOMAIN
from custom_components.harvest.http_views import HarvestPanelJsView


_TEST_ENTRY_ID = "test_entry"


def _make_view(panel_js_path: str) -> HarvestPanelJsView:
    hass = MagicMock()
    hass.config.path.return_value = panel_js_path
    # Run the executor function inline so panel_path.stat() / .read_bytes() hit
    # the real temp file.
    hass.async_add_executor_job = AsyncMock(side_effect=lambda fn, *a: fn(*a))
    hass.data = {DOMAIN: {_TEST_ENTRY_ID: {}}}
    return HarvestPanelJsView(hass, _TEST_ENTRY_ID)


def _request(if_none_match: str | None = None) -> MagicMock:
    req = MagicMock()
    req.headers = {} if if_none_match is None else {"If-None-Match": if_none_match}
    return req


@pytest.fixture
def panel_js(tmp_path):
    p = tmp_path / "panel.js"
    p.write_bytes(b"console.log('harvest panel');")
    return p


class TestPanelJsView:
    @pytest.mark.asyncio
    async def test_serves_bundle_with_no_cache_and_etag(self, panel_js):
        view = _make_view(str(panel_js))
        resp = await view.get(_request())
        assert resp.status == 200
        assert resp.body == b"console.log('harvest panel');"
        assert resp.headers["Cache-Control"] == "no-cache"
        assert resp.headers["ETag"]
        assert resp.content_type == "application/javascript"

    @pytest.mark.asyncio
    async def test_matching_if_none_match_returns_304_without_body(self, panel_js):
        view = _make_view(str(panel_js))
        etag = (await view.get(_request())).headers["ETag"]

        resp = await view.get(_request(if_none_match=etag))
        assert resp.status == 304
        assert not resp.body
        assert resp.headers["ETag"] == etag
        assert resp.headers["Cache-Control"] == "no-cache"

    @pytest.mark.asyncio
    async def test_stale_if_none_match_returns_fresh_bundle(self, panel_js):
        view = _make_view(str(panel_js))
        resp = await view.get(_request(if_none_match='"0-0"'))
        assert resp.status == 200
        assert resp.body == b"console.log('harvest panel');"

    @pytest.mark.asyncio
    async def test_etag_changes_when_bundle_changes(self, panel_js):
        view = _make_view(str(panel_js))
        etag_before = (await view.get(_request())).headers["ETag"]

        # Simulate a rebuild: different size (and mtime).
        panel_js.write_bytes(b"console.log('harvest panel v2 - rebuilt');")
        etag_after = (await view.get(_request())).headers["ETag"]

        assert etag_before != etag_after
        # The previously-cached ETag no longer matches, so the browser refetches.
        resp = await view.get(_request(if_none_match=etag_before))
        assert resp.status == 200

    @pytest.mark.asyncio
    async def test_missing_bundle_returns_404(self, tmp_path):
        from aiohttp import web
        view = _make_view(str(tmp_path / "does-not-exist.js"))
        with pytest.raises(web.HTTPNotFound):
            await view.get(_request())
