"""secondary_server.py - Optional alternate-port aiohttp HTTP server.

When external_port is set in config, HArvest starts a second aiohttp
application on 0.0.0.0:<port>. It serves the widget JS, theme assets,
and WebSocket endpoint with CORS Access-Control-Allow-Origin: * so that
pages on any origin can load the widget without touching HA's main port.

Settings changes take effect immediately on Save - no HA restart needed.
"""
from __future__ import annotations

import asyncio
import logging
import socket
from pathlib import Path
from typing import TYPE_CHECKING

from aiohttp import web

if TYPE_CHECKING:
    from .ws_proxy import HarvestWsView

_LOGGER = logging.getLogger(__name__)

BIND_HOST = "0.0.0.0"

_CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


@web.middleware
async def _cors_middleware(
    request: web.Request,
    handler,
) -> web.Response:
    if request.method == "OPTIONS":
        return web.Response(headers=_CORS_HEADERS)
    try:
        response = await handler(request)
    except web.HTTPException as exc:
        exc.headers.update(_CORS_HEADERS)
        raise
    response.headers.update(_CORS_HEADERS)
    return response


class SecondaryServer:
    """Manages the lifecycle of the optional alternate-port aiohttp server.

    Instantiated in async_setup_entry, stored as "secondary_server" in
    hass.data[DOMAIN][entry_id]. Config PATCH handler calls reconfigure()
    or stop() when external_port changes.
    """

    def __init__(
        self,
        widget_dir: Path,
        themes_dir: Path,
        ws_view: "HarvestWsView",
    ) -> None:
        self._widget_dir = widget_dir
        self._themes_dir = themes_dir
        self._ws_view = ws_view
        self._runner: web.AppRunner | None = None
        self._port: int | None = None

    @property
    def is_running(self) -> bool:
        return self._runner is not None

    async def start(self, port: int) -> None:
        """Start the server on 0.0.0.0:<port>."""
        await self.stop()

        if port <= 1023:
            _LOGGER.warning(
                "external_port %s is a privileged port (<= 1023). "
                "This may require root/admin privileges.",
                port,
            )

        app = web.Application(middlewares=[_cors_middleware])
        app.router.add_get("/harvest.min.js", self._serve_widget)
        app.router.add_get(r"/harvest.min.{hash:[a-f0-9]+}.js", self._serve_widget)
        app.router.add_get("/themes/{path:.+}", self._serve_theme)
        app.router.add_get("/harvest/ws", self._serve_ws)
        app.router.add_get("/ws", self._serve_ws)

        self._runner = web.AppRunner(app, access_log=None)
        await self._runner.setup()
        site = web.TCPSite(self._runner, BIND_HOST, port)
        await site.start()

        self._port = port
        _LOGGER.info("HArvest alternate-port server started on %s:%s", BIND_HOST, port)

    async def stop(self) -> None:
        """Stop the server if running."""
        if self._runner is not None:
            try:
                await self._runner.cleanup()
            except Exception:  # noqa: BLE001
                pass
            self._runner = None
            _LOGGER.info(
                "HArvest alternate-port server stopped (was port %s).",
                self._port,
            )
            self._port = None

    async def reconfigure(self, port: int) -> None:
        """Stop (if running) then start on the new port."""
        await self.stop()
        await self.start(port)

    # --- Route handlers ---

    async def _serve_widget(self, request: web.Request) -> web.Response:
        widget_file = self._widget_dir / "harvest.min.js"
        if not widget_file.is_file():
            raise web.HTTPNotFound()
        body = await asyncio.to_thread(widget_file.read_bytes)
        return web.Response(
            body=body,
            content_type="application/javascript",
            headers={"Cache-Control": "public, max-age=3600"},
        )

    async def _serve_theme(self, request: web.Request) -> web.Response:
        rel = request.match_info["path"]
        try:
            resolved_base = self._themes_dir.resolve()
            target = (self._themes_dir / rel).resolve()
            target.relative_to(resolved_base)  # raises ValueError on traversal
        except (ValueError, Exception):
            raise web.HTTPForbidden()
        if not target.is_file():
            raise web.HTTPNotFound()
        suffix = target.suffix.lower()
        ctype_map = {
            ".json":  "application/json",
            ".js":    "application/javascript",
            ".woff2": "font/woff2",
            ".woff":  "font/woff",
            ".png":   "image/png",
        }
        ctype = ctype_map.get(suffix, "application/octet-stream")
        body = await asyncio.to_thread(target.read_bytes)
        return web.Response(
            body=body,
            content_type=ctype,
            headers={"Cache-Control": "public, max-age=3600"},
        )

    async def _serve_ws(self, request: web.Request) -> web.Response:
        return await self._ws_view.get(request)


def validate_external_port(port: int, ha_http_port: int) -> str | None:
    """Validate external_port for the alternate-port server.

    Returns an error reason string or None if valid.
    Does NOT start the server - only validates inputs.
    """
    if not (1 <= port <= 65535):
        return "Port must be between 1 and 65535."

    if port == ha_http_port:
        return f"Port {port} is already used by Home Assistant's main HTTP server."

    # Trial bind to check port availability.
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind((BIND_HOST, port))
    except OSError as exc:
        strerror = exc.strerror or str(exc)
        if "Address" in strerror and "in use" in strerror.lower():
            return f"Port {port} is already in use. Choose a different port."
        if "Permission" in strerror or "denied" in strerror.lower():
            return f"Permission denied binding to port {port}. Ports below 1024 require elevated privileges."
        return f"Cannot bind to port {port} - {strerror}."
    except Exception as exc:  # noqa: BLE001
        return f"Cannot bind to port {port} - {exc}"

    return None
