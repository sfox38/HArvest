"""tests/test_keepalive_pong_guard.py

Regression guard for the aiohttp internal HArvest depends on.

ws_proxy.HarvestWsView.get() sets WebSocketResponse._pong_heartbeat directly
because aiohttp exposes no public parameter for the pong timeout (it derives
it as heartbeat/2). The override is guarded with hasattr() so a future aiohttp
removal degrades gracefully instead of crashing, but a silent degradation
would also mean CONF_KEEPALIVE_TIMEOUT stops being honoured. This test fails
loudly on an aiohttp bump that drops the attribute, so the breakage is caught
in CI rather than in production keepalive behaviour.
"""
from __future__ import annotations

from aiohttp.web import WebSocketResponse


def test_aiohttp_websocketresponse_exposes_pong_heartbeat():
    """aiohttp still exposes the private attribute we override.

    ws_proxy constructs the response with ``heartbeat=keepalive`` (always a
    number), so this mirrors the production path: aiohttp sets _pong_heartbeat
    in __init__ to heartbeat/2 only when heartbeat is not None.
    """
    ws = WebSocketResponse(heartbeat=30)
    assert hasattr(ws, "_pong_heartbeat"), (
        "aiohttp.web.WebSocketResponse no longer exposes _pong_heartbeat; "
        "ws_proxy can no longer honour CONF_KEEPALIVE_TIMEOUT. Revisit the "
        "keepalive override in HarvestWsView.get()."
    )
