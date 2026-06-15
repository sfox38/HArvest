"""Tests for secondary_server.py.

Tests cover port validation, lifecycle rollback, and exposed routes.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from aiohttp import ClientSession, web

from custom_components.harvest.secondary_server import SecondaryServer, validate_external_port


# ---------------------------------------------------------------------------
# validate_external_port
# ---------------------------------------------------------------------------

class TestValidateExternalPort:
    def test_port_out_of_range_low(self):
        err = validate_external_port(-1, 8123)
        assert err is not None
        assert "65535" in err

    def test_port_out_of_range_high(self):
        err = validate_external_port(99999, 8123)
        assert err is not None
        assert "65535" in err

    def test_port_conflicts_with_ha_port(self):
        err = validate_external_port(8123, 8123)
        assert err is not None
        assert "8123" in err

    def test_port_1_is_valid_range(self):
        mock_sock = MagicMock()
        mock_sock.__enter__ = MagicMock(return_value=mock_sock)
        mock_sock.__exit__ = MagicMock(return_value=False)
        with patch("socket.socket", return_value=mock_sock):
            err = validate_external_port(1, 8123)
        assert err is None

    def test_valid_port_trial_bind_succeeds(self):
        mock_sock = MagicMock()
        mock_sock.__enter__ = MagicMock(return_value=mock_sock)
        mock_sock.__exit__ = MagicMock(return_value=False)
        with patch("socket.socket", return_value=mock_sock):
            err = validate_external_port(9050, 8123)
        assert err is None
        mock_sock.bind.assert_called_once_with(("0.0.0.0", 9050))

    def test_port_in_use_returns_error(self):
        mock_sock = MagicMock()
        mock_sock.__enter__ = MagicMock(return_value=mock_sock)
        mock_sock.__exit__ = MagicMock(return_value=False)
        mock_sock.bind.side_effect = OSError(98, "Address already in use")
        with patch("socket.socket", return_value=mock_sock):
            err = validate_external_port(9050, 8123)
        assert err is not None
        assert "9050" in err or "already in use" in err.lower()

    def test_port_65535_is_valid(self):
        mock_sock = MagicMock()
        mock_sock.__enter__ = MagicMock(return_value=mock_sock)
        mock_sock.__exit__ = MagicMock(return_value=False)
        with patch("socket.socket", return_value=mock_sock):
            err = validate_external_port(65535, 8123)
        assert err is None

    def test_different_ha_port_does_not_conflict(self):
        mock_sock = MagicMock()
        mock_sock.__enter__ = MagicMock(return_value=mock_sock)
        mock_sock.__exit__ = MagicMock(return_value=False)
        with patch("socket.socket", return_value=mock_sock):
            err = validate_external_port(9050, 9051)
        assert err is None

    def test_custom_ha_port_conflict_detected(self):
        err = validate_external_port(9050, 9050)
        assert err is not None
        assert "9050" in err


# ---------------------------------------------------------------------------
# SecondaryServer class structure
# ---------------------------------------------------------------------------

class TestSecondaryServerStructure:
    """Verify the SecondaryServer class has the expected API surface."""

    def test_has_start_method(self):
        from custom_components.harvest.secondary_server import SecondaryServer
        assert callable(SecondaryServer.start)

    def test_has_stop_method(self):
        from custom_components.harvest.secondary_server import SecondaryServer
        assert callable(SecondaryServer.stop)

    def test_has_reconfigure_method(self):
        from custom_components.harvest.secondary_server import SecondaryServer
        assert callable(SecondaryServer.reconfigure)

    def test_is_running_false_before_start(self, tmp_path):
        from custom_components.harvest.secondary_server import SecondaryServer
        ws_view = MagicMock()
        server = SecondaryServer(tmp_path, ws_view)
        assert server.is_running is False


class TestSecondaryServerLifecycle:
    @pytest.mark.asyncio
    async def test_start_failure_cleans_runner_and_reports_not_running(self, tmp_path):
        runner = MagicMock()
        runner.setup = AsyncMock()
        runner.cleanup = AsyncMock()
        site = MagicMock()
        site.start = AsyncMock(side_effect=OSError("bind failed"))
        server = SecondaryServer(tmp_path, MagicMock())

        with (
            patch("custom_components.harvest.secondary_server.web.AppRunner", return_value=runner),
            patch("custom_components.harvest.secondary_server.web.TCPSite", return_value=site),
            pytest.raises(OSError, match="bind failed"),
        ):
            await server.start(9050)

        runner.cleanup.assert_awaited_once()
        assert server.is_running is False
        assert server.port is None

    @pytest.mark.asyncio
    async def test_reconfigure_restores_previous_port_on_failure(self, tmp_path):
        server = SecondaryServer(tmp_path, MagicMock())
        server._port = 9050
        server._runner = MagicMock()
        server._runner.cleanup = AsyncMock()
        server._start = AsyncMock(side_effect=[OSError("bind failed"), None])

        with pytest.raises(OSError, match="bind failed"):
            await server.reconfigure(9051)

        assert server._start.await_args_list[0].args == (9051,)
        assert server._start.await_args_list[1].args == (9050,)

    @pytest.mark.asyncio
    async def test_same_port_reconfigure_is_noop(self, tmp_path):
        server = SecondaryServer(tmp_path, MagicMock())
        server._port = 9050
        server.stop = AsyncMock()
        server._start = AsyncMock()

        await server.reconfigure(9050)

        server.stop.assert_not_awaited()
        server._start.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_exposes_complete_transport_routes(self, tmp_path):
        captured_app = None
        runner = MagicMock()
        runner.setup = AsyncMock()
        runner.cleanup = AsyncMock()
        site = MagicMock()
        site.start = AsyncMock()

        def make_runner(app, **_kwargs):
            nonlocal captured_app
            captured_app = app
            return runner

        server = SecondaryServer(tmp_path, MagicMock())
        with (
            patch("custom_components.harvest.secondary_server.web.AppRunner", side_effect=make_runner),
            patch("custom_components.harvest.secondary_server.web.TCPSite", return_value=site),
        ):
            await server.start(9050)

        paths = {route.resource.canonical for route in captured_app.router.routes()}
        assert "/harvest.min.js" in paths
        assert "/harvest_assets/harvest.min.js" in paths
        assert "/api/harvest/ws" in paths
        assert "/harvest_assets/icon-sets/{filename}" in paths
        assert "/api/harvest/themes/{theme_id}/fonts/{filename}" in paths
        assert "/api/harvest/renderers/{renderer_id}.js" in paths
        assert "/ws" not in paths
        assert "/harvest/ws" not in paths


class TestSecondaryServerSecurityHeaders:
    @staticmethod
    def _listening_port(server: SecondaryServer) -> int:
        return server._runner.addresses[0][1]

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        ("method", "create_widget", "expected_status"),
        [
            ("GET", True, 200),
            ("GET", False, 404),
            ("OPTIONS", False, 200),
        ],
    )
    async def test_responses_apply_security_headers_without_server_disclosure(
        self,
        tmp_path,
        socket_enabled,
        method,
        create_widget,
        expected_status,
    ):
        if create_widget:
            (tmp_path / "harvest.min.js").write_text("window.harvest = true;", "utf-8")

        server = SecondaryServer(tmp_path, MagicMock())
        await server.start(0)
        try:
            async with ClientSession() as client:
                response = await client.request(
                    method,
                    f"http://127.0.0.1:{self._listening_port(server)}/harvest.min.js",
                )
        finally:
            await server.stop()

        assert response.status == expected_status
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert response.headers["Referrer-Policy"] == "no-referrer"
        assert "Server" not in response.headers
        assert response.headers["Access-Control-Allow-Origin"] == "*"

    @pytest.mark.asyncio
    async def test_websocket_handshake_applies_security_headers_without_server_disclosure(
        self,
        tmp_path,
        socket_enabled,
    ):
        ws_view = MagicMock()

        async def open_websocket(request):
            response = web.WebSocketResponse()
            await response.prepare(request)
            await response.close()
            return response

        ws_view.get = open_websocket
        server = SecondaryServer(tmp_path, ws_view)
        await server.start(0)
        try:
            async with ClientSession() as client:
                websocket = await client.ws_connect(
                    f"http://127.0.0.1:{self._listening_port(server)}/api/harvest/ws",
                )
                headers = websocket._response.headers
                await websocket.close()
        finally:
            await server.stop()

        assert headers["X-Content-Type-Options"] == "nosniff"
        assert headers["Referrer-Policy"] == "no-referrer"
        assert "Server" not in headers


class TestSecondaryServerAssets:
    @pytest.mark.asyncio
    async def test_icon_set_rejects_traversal(self, tmp_path):
        server = SecondaryServer(tmp_path, MagicMock())
        request = MagicMock()
        request.match_info = {"filename": "../secret.js"}

        with pytest.raises(web.HTTPNotFound):
            await server._serve_icon_set(request)

    @pytest.mark.asyncio
    async def test_renderer_uses_renderer_manager_path(self, tmp_path):
        renderer_file = tmp_path / "custom.js"
        renderer_file.write_text("window.testRenderer = true;", "utf-8")
        renderer_manager = MagicMock()
        renderer_manager.get_renderer_path.return_value = renderer_file
        server = SecondaryServer(
            tmp_path,
            MagicMock(),
            renderer_manager=renderer_manager,
        )
        request = MagicMock()
        request.match_info = {"renderer_id": "custom"}

        response = await server._serve_renderer(request)

        assert response.body == b"window.testRenderer = true;"
        renderer_manager.get_renderer_path.assert_called_once_with("custom")

    @pytest.mark.asyncio
    async def test_custom_font_uses_theme_manager_path(self, tmp_path):
        font_file = tmp_path / "custom.woff2"
        font_file.write_bytes(b"font")
        theme_manager = MagicMock()
        theme_manager.get_custom_font_path.return_value = font_file
        server = SecondaryServer(
            tmp_path,
            MagicMock(),
            theme_manager=theme_manager,
        )
        request = MagicMock()
        request.match_info = {"theme_id": "custom", "filename": "custom.woff2"}

        response = await server._serve_custom_font(request)

        assert response.body == b"font"
        assert response.content_type == "font/woff2"
        theme_manager.get_custom_font_path.assert_called_once_with(
            "custom",
            "custom.woff2",
        )


# ---------------------------------------------------------------------------
# const.py has the port key
# ---------------------------------------------------------------------------

class TestConstKeys:
    def test_conf_external_port_defined(self):
        from custom_components.harvest.const import CONF_EXTERNAL_PORT
        assert CONF_EXTERNAL_PORT == "external_port"

    def test_defaults_include_external_port(self):
        from custom_components.harvest.const import DEFAULTS, CONF_EXTERNAL_PORT
        assert CONF_EXTERNAL_PORT in DEFAULTS
        assert DEFAULTS[CONF_EXTERNAL_PORT] == 0
