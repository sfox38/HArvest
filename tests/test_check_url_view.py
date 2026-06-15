"""Tests for HarvestCheckUrlView (the panel-side URL reachability probe).

Mirrors the WP plugin's ajax_check_url. Same response shape, same
defensive checks, same advisory-only semantics. SPEC.md Section 12.
"""
from __future__ import annotations

import asyncio
import json
import socket
from contextlib import contextmanager
from unittest.mock import ANY
from unittest.mock import AsyncMock, MagicMock, patch

import aiohttp
import pytest

from custom_components.harvest.const import DOMAIN
from custom_components.harvest.http_views import HarvestCheckUrlView


_TEST_ENTRY_ID = "test_entry"


def _make_view(hass=None) -> HarvestCheckUrlView:
    if hass is None:
        hass = MagicMock()
    hass.data = {DOMAIN: {_TEST_ENTRY_ID: {
        "token_manager":   MagicMock(),
        "session_manager": MagicMock(),
        "activity_store":  MagicMock(),
        "event_bus":       MagicMock(),
        "theme_manager":   MagicMock(),
        "renderer_manager":    MagicMock(),
    }}}
    return HarvestCheckUrlView(hass, _TEST_ENTRY_ID)


def _admin_request(url: str | None) -> MagicMock:
    req = MagicMock()
    req.query = {} if url is None else {"url": url}
    user = MagicMock()
    user.is_admin = True
    req.get = MagicMock(return_value=user)
    return req


def _non_admin_request(url: str = "https://example.com/x.js") -> MagicMock:
    req = MagicMock()
    req.query = {"url": url}
    user = MagicMock()
    user.is_admin = False
    req.get = MagicMock(return_value=user)
    return req


def _body(resp) -> dict:
    return json.loads(resp.body.decode())


# ---------------------------------------------------------------------------
# Auth gate
# ---------------------------------------------------------------------------

class TestAuthGate:
    @pytest.mark.asyncio
    async def test_non_admin_forbidden(self):
        from aiohttp import web
        view = _make_view()
        with pytest.raises(web.HTTPForbidden):
            await view.get(_non_admin_request())

    @pytest.mark.asyncio
    async def test_no_user_forbidden(self):
        from aiohttp import web
        view = _make_view()
        req = MagicMock()
        req.query = {"url": "https://example.com/x.js"}
        req.get = MagicMock(return_value=None)
        with pytest.raises(web.HTTPForbidden):
            await view.get(req)


# ---------------------------------------------------------------------------
# Input validation - never makes outbound requests for bad input
# ---------------------------------------------------------------------------

class TestInputValidation:
    @pytest.mark.asyncio
    async def test_missing_url_returns_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request(None)))
        assert body["reason"] == "invalid"
        assert body["ok"] is False

    @pytest.mark.asyncio
    async def test_empty_url_returns_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("")))
        assert body["reason"] == "invalid"

    @pytest.mark.asyncio
    async def test_javascript_scheme_returns_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("javascript:alert(1)")))
        assert body["reason"] == "invalid"

    @pytest.mark.asyncio
    async def test_data_scheme_returns_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("data:text/javascript,alert(1)")))
        assert body["reason"] == "invalid"

    @pytest.mark.asyncio
    async def test_vbscript_scheme_returns_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("vbscript:msgbox")))
        assert body["reason"] == "invalid"

    @pytest.mark.asyncio
    async def test_control_chars_return_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("https://example.com/\x00bad.js")))
        assert body["reason"] == "invalid"

    @pytest.mark.asyncio
    async def test_attribute_breaker_chars_return_invalid(self):
        view = _make_view()
        body = _body(await view.get(_admin_request('https://example.com/x.js" onerror=alert(1)')))
        assert body["reason"] == "invalid"


# ---------------------------------------------------------------------------
# Relative paths - cannot be probed
# ---------------------------------------------------------------------------

class TestRelativePaths:
    @pytest.mark.asyncio
    async def test_bare_filename_returns_relative(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("harvest.min.js")))
        assert body["reason"] == "relative"
        assert body["ok"] is False
        assert "Relative path" in body["message"]

    @pytest.mark.asyncio
    async def test_absolute_path_returns_relative(self):
        # /harvest.min.js is absolute on the embed page's host, not ours.
        view = _make_view()
        body = _body(await view.get(_admin_request("/harvest.min.js")))
        assert body["reason"] == "relative"

    @pytest.mark.asyncio
    async def test_dot_relative_path_returns_relative(self):
        view = _make_view()
        body = _body(await view.get(_admin_request("./harvest.min.js")))
        assert body["reason"] == "relative"


# ---------------------------------------------------------------------------
# Outbound HEAD - happy and unhappy paths
#
# We patch aiohttp.ClientSession on the http_views module so the real
# network is never touched. The mocked session's __aenter__ returns
# itself, .head() returns an async context manager whose __aenter__
# yields a response with the configured status.
# ---------------------------------------------------------------------------

_PUBLIC_DNS_RESULT = [
    (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 443)),
]


@contextmanager
def _mock_aiohttp_with_status(status: int, *, headers: dict | None = None, dns_result=None):
    """Build a patched aiohttp.ClientSession that yields a response with
    the given status from session.head(). Returns the patcher; use as
    `with _mock_aiohttp_with_status(200) as session_cls: ...`.
    """
    response = MagicMock()
    response.status = status
    response.headers = headers or {}
    response.__aenter__ = AsyncMock(return_value=response)
    response.__aexit__ = AsyncMock(return_value=None)

    session = MagicMock()
    session.head = MagicMock(return_value=response)
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)

    session_cls = MagicMock(return_value=session)
    loop = asyncio.get_running_loop()
    with (
        patch("aiohttp.ClientSession", session_cls),
        patch.object(
            loop,
            "getaddrinfo",
            AsyncMock(return_value=dns_result or _PUBLIC_DNS_RESULT),
        ),
    ):
        yield session_cls


@contextmanager
def _mock_aiohttp_raises(exc: BaseException):
    session = MagicMock()
    session.head = MagicMock(side_effect=exc)
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)
    session_cls = MagicMock(return_value=session)
    loop = asyncio.get_running_loop()
    with (
        patch("aiohttp.ClientSession", session_cls),
        patch.object(loop, "getaddrinfo", AsyncMock(return_value=_PUBLIC_DNS_RESULT)),
    ):
        yield session_cls


def _mock_response(status: int, headers: dict | None = None):
    response = MagicMock()
    response.status = status
    response.headers = headers or {}
    response.__aenter__ = AsyncMock(return_value=response)
    response.__aexit__ = AsyncMock(return_value=None)
    return response


class TestOutboundHead:
    @pytest.mark.asyncio
    async def test_200_returns_reachable(self):
        view = _make_view()
        with _mock_aiohttp_with_status(200):
            body = _body(await view.get(_admin_request("https://example.com/harvest.min.js")))
        assert body["ok"] is True
        assert body["reason"] == "reachable"
        assert body["status"] == 200

    @pytest.mark.asyncio
    async def test_204_is_also_reachable(self):
        view = _make_view()
        with _mock_aiohttp_with_status(204):
            body = _body(await view.get(_admin_request("https://example.com/harvest.min.js")))
        assert body["ok"] is True
        assert body["reason"] == "reachable"

    @pytest.mark.asyncio
    async def test_404_returns_unreachable(self):
        view = _make_view()
        with _mock_aiohttp_with_status(404):
            body = _body(await view.get(_admin_request("https://example.com/harvest.min.js")))
        assert body["ok"] is False
        assert body["reason"] == "unreachable"
        assert body["status"] == 404
        assert "404" in body["message"]

    @pytest.mark.asyncio
    async def test_500_returns_unreachable(self):
        view = _make_view()
        with _mock_aiohttp_with_status(500):
            body = _body(await view.get(_admin_request("https://example.com/harvest.min.js")))
        assert body["reason"] == "unreachable"

    @pytest.mark.asyncio
    async def test_timeout_returns_unreachable(self):
        view = _make_view()
        with _mock_aiohttp_raises(asyncio.TimeoutError()):
            body = _body(await view.get(_admin_request("https://timeout.example.com/x.js")))
        assert body["ok"] is False
        assert body["reason"] == "unreachable"
        assert body["status"] == 0
        # Always advisory.
        assert "Visitors may still" in body["message"]

    @pytest.mark.asyncio
    async def test_connection_error_returns_unreachable(self):
        view = _make_view()
        with _mock_aiohttp_raises(aiohttp.ClientConnectionError("connection refused")):
            body = _body(await view.get(_admin_request("https://refused.example.com/x.js")))
        assert body["ok"] is False
        assert body["reason"] == "unreachable"

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "url",
        [
            "http://127.0.0.1/x.js",
            "http://10.0.0.1/x.js",
            "http://169.254.169.254/latest/meta-data/",
            "http://0.0.0.0/x.js",
            "http://224.0.0.1/x.js",
            "http://[::1]/x.js",
            "http://[fe80::1]/x.js",
        ],
    )
    async def test_internal_ip_literal_is_rejected_without_request(self, url):
        view = _make_view()
        with _mock_aiohttp_with_status(200) as session_cls:
            body = _body(await view.get(_admin_request(url)))
        assert body["ok"] is False
        assert body["reason"] == "invalid"
        assert "internal" in body["message"].lower()
        session_cls.assert_not_called()

    @pytest.mark.asyncio
    async def test_hostname_resolving_to_private_ip_is_rejected_without_request(self):
        view = _make_view()
        private_dns = [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("192.168.1.10", 443)),
        ]
        with _mock_aiohttp_with_status(200, dns_result=private_dns) as session_cls:
            body = _body(await view.get(_admin_request("https://private.example.com/x.js")))
        assert body["reason"] == "invalid"
        session_cls.assert_not_called()

    @pytest.mark.asyncio
    async def test_mixed_public_and_private_dns_answers_are_rejected(self):
        view = _make_view()
        mixed_dns = [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 443)),
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("10.0.0.1", 443)),
        ]
        with _mock_aiohttp_with_status(200, dns_result=mixed_dns) as session_cls:
            body = _body(await view.get(_admin_request("https://mixed.example.com/x.js")))
        assert body["reason"] == "invalid"
        session_cls.assert_not_called()

    @pytest.mark.asyncio
    async def test_redirect_to_private_ip_is_rejected_without_second_request(self):
        view = _make_view()
        with _mock_aiohttp_with_status(
            302,
            headers={"Location": "http://127.0.0.1/admin"},
        ) as session_cls:
            body = _body(await view.get(_admin_request("https://example.com/x.js")))
        assert body["reason"] == "invalid"
        session = session_cls.return_value
        session.head.assert_called_once()

    @pytest.mark.asyncio
    async def test_redirect_hostname_resolving_private_is_rejected(self):
        view = _make_view()
        response = _mock_response(
            302,
            {"Location": "https://private.example.com/admin"},
        )
        session = MagicMock()
        session.head = MagicMock(return_value=response)
        session.__aenter__ = AsyncMock(return_value=session)
        session.__aexit__ = AsyncMock(return_value=None)
        session_cls = MagicMock(return_value=session)
        loop = asyncio.get_running_loop()
        dns = AsyncMock(side_effect=[
            _PUBLIC_DNS_RESULT,
            [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("10.0.0.1", 443))],
        ])

        with (
            patch("aiohttp.ClientSession", session_cls),
            patch.object(loop, "getaddrinfo", dns),
        ):
            body = _body(await view.get(_admin_request("https://example.com/x.js")))

        assert body["reason"] == "invalid"
        session.head.assert_called_once()

    @pytest.mark.asyncio
    async def test_public_redirect_is_followed_after_revalidation(self):
        view = _make_view()
        first = _mock_response(302, {"Location": "https://cdn.example.com/x.js"})
        second = _mock_response(200)
        session = MagicMock()
        session.head = MagicMock(side_effect=[first, second])
        session.__aenter__ = AsyncMock(return_value=session)
        session.__aexit__ = AsyncMock(return_value=None)
        session_cls = MagicMock(return_value=session)
        loop = asyncio.get_running_loop()
        dns = AsyncMock(side_effect=[_PUBLIC_DNS_RESULT, _PUBLIC_DNS_RESULT])

        with (
            patch("aiohttp.ClientSession", session_cls),
            patch.object(loop, "getaddrinfo", dns),
        ):
            body = _body(await view.get(_admin_request("https://example.com/x.js")))

        assert body["ok"] is True
        assert body["status"] == 200
        assert session.head.call_count == 2

    @pytest.mark.asyncio
    async def test_public_destination_uses_pinned_resolver_and_manual_redirects(self):
        view = _make_view()
        with _mock_aiohttp_with_status(200) as session_cls:
            body = _body(await view.get(_admin_request("https://example.com/x.js")))
        assert body["ok"] is True
        connector = session_cls.call_args.kwargs["connector"]
        assert connector._resolver.__class__.__name__ == "_PinnedResolver"
        session_cls.return_value.head.assert_called_once_with(
            ANY,
            allow_redirects=False,
            headers=ANY,
        )


# ---------------------------------------------------------------------------
# Response shape (every field always present)
# ---------------------------------------------------------------------------

class TestResponseShape:
    @pytest.mark.asyncio
    async def test_all_branches_return_full_shape(self):
        view = _make_view()
        # Empty
        body = _body(await view.get(_admin_request("")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
        # Invalid (javascript:)
        body = _body(await view.get(_admin_request("javascript:alert(1)")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
        # Relative
        body = _body(await view.get(_admin_request("harvest.min.js")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
        # Reachable
        with _mock_aiohttp_with_status(200):
            body = _body(await view.get(_admin_request("https://example.com/x.js")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
        # Unreachable (status code)
        with _mock_aiohttp_with_status(404):
            body = _body(await view.get(_admin_request("https://example.com/x.js")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
        # Unreachable (network error)
        with _mock_aiohttp_raises(aiohttp.ClientConnectionError("x")):
            body = _body(await view.get(_admin_request("https://example.com/x.js")))
        for key in ("ok", "status", "reason", "message"):
            assert key in body
