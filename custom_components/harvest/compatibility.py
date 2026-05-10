"""Client/server compatibility evaluation.

Pure functions that compare a connecting client's reported version info
against the server's own constants and decide whether to accept, accept
with a soft warning, or reject the connection. See SPEC.md Section 12
(Client/Server Compatibility) and Sections 5.1, 5.2, 5.3.

The evaluator is deliberately separated from ws_proxy so the rules can
be unit-tested exhaustively without spinning up a WebSocket. ws_proxy
calls ``parse_client_block`` to validate the wire payload, then either
``check_protocol_compatibility`` (hard accept/reject) followed by
``evaluate`` (soft warning level).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from .const import (
    BUNDLED_WP_PLUGIN_VERSION,
    MIN_CLIENT_PROTOCOL,
    PLATFORM_VERSION,
    PROTOCOL_VERSION,
)

CompatibilityStatus = Literal["ok", "client_outdated", "server_outdated"]
ClientSource = Literal["wp", "html", "panel", "unknown"]


@dataclass(frozen=True)
class ClientInfo:
    """Parsed `client` block from an auth message."""

    protocol: int
    widget: str | None
    source: ClientSource
    source_version: str | None


@dataclass(frozen=True)
class ServerInfo:
    """Server-side identity for the auth_ok response."""

    protocol: int
    version: str
    min_client_protocol: int


def server_info() -> ServerInfo:
    """Return the live server identity built from const.py constants.

    A function rather than a module-level instance so tests can monkey-
    patch the underlying constants without hitting a frozen object.
    """
    return ServerInfo(
        protocol=PROTOCOL_VERSION,
        version=PLATFORM_VERSION,
        min_client_protocol=MIN_CLIENT_PROTOCOL,
    )


def parse_client_block(raw: object) -> ClientInfo:
    """Coerce the auth message's ``client`` field into a ClientInfo.

    Returns a defaults-only ClientInfo when ``raw`` is missing or
    malformed. The WS protocol treats this as "old widget that doesn't
    know about the handshake" - never as an auth failure - so the
    server should still proceed with auth and skip compatibility
    evaluation for the resulting session (compatibility="ok" with no
    drift comparison possible).
    """
    if not isinstance(raw, dict):
        return ClientInfo(
            protocol=1,
            widget=None,
            source="unknown",
            source_version=None,
        )

    protocol = raw.get("protocol")
    if not isinstance(protocol, int) or protocol < 1:
        protocol = 1

    widget = raw.get("widget")
    if not isinstance(widget, str) or not widget.strip():
        widget = None

    source_raw = raw.get("source")
    source: ClientSource
    if source_raw in ("wp", "html", "panel"):
        source = source_raw  # type: ignore[assignment]
    else:
        source = "unknown"

    source_version = raw.get("source_version")
    if not isinstance(source_version, str) or not source_version.strip():
        source_version = None
    # source_version is meaningful only when source identifies a versioned
    # loader. For html / panel / unknown, drop it even if a client sent one.
    if source != "wp":
        source_version = None

    return ClientInfo(
        protocol=protocol,
        widget=widget,
        source=source,
        source_version=source_version,
    )


def check_protocol_compatibility(
    client: ClientInfo, server: ServerInfo
) -> bool:
    """Return True iff the client's protocol is in the server's accepted range.

    A False result means the connection MUST be rejected with
    HRV_PROTOCOL_INCOMPATIBLE; the server has no way to speak the
    client's protocol. A True result means the handshake may proceed
    to soft-warning evaluation via ``evaluate``.
    """
    return server.min_client_protocol <= client.protocol <= server.protocol


def evaluate(client: ClientInfo, server: ServerInfo) -> CompatibilityStatus:
    """Return the soft-warning status for a session that has passed the
    protocol-compatibility hard check.

    Compares semver values at minor-or-major granularity. Patch
    differences are ignored (patch bumps are reserved for non-protocol
    fixes by release convention). Old clients that omit the client
    block report widget=None; for those we have nothing to compare and
    return "ok" since absence of information is not the same as drift.
    """
    # Old clients that omit the client block carry no version info to
    # compare against. SPEC.md: "Old clients that omit the client field
    # auth normally with compatibility = 'ok'."
    if client.widget is None and client.source == "unknown":
        return "ok"

    # Widget-version drift (always evaluated when widget is reported).
    if client.widget is not None:
        widget_drift = _compare_minor_major(client.widget, server.version)
        if widget_drift == "client_older":
            return "client_outdated"
        if widget_drift == "client_newer":
            return "server_outdated"

    # WordPress-plugin drift, only meaningful when the widget reports
    # source="wp" with a version string.
    if client.source == "wp" and client.source_version is not None:
        wp_drift = _compare_minor_major(client.source_version, BUNDLED_WP_PLUGIN_VERSION)
        if wp_drift == "client_older":
            return "client_outdated"
        if wp_drift == "client_newer":
            return "server_outdated"

    return "ok"


_DriftRelation = Literal["equal", "client_older", "client_newer", "unknown"]


def _compare_minor_major(client_version: str, server_version: str) -> _DriftRelation:
    """Compare two semver strings at minor-or-major granularity.

    Patch differences and any unparseable inputs collapse to "equal" so
    a malformed report from a client never triggers a false drift
    warning. Pre-release suffixes (e.g. "0.9.3-beta.1") are stripped at
    the first "-".
    """
    client_parts = _parse_semver(client_version)
    server_parts = _parse_semver(server_version)
    if client_parts is None or server_parts is None:
        return "unknown"

    # Compare major, then minor. Patch is intentionally ignored.
    client_mm = (client_parts[0], client_parts[1])
    server_mm = (server_parts[0], server_parts[1])
    if client_mm == server_mm:
        return "equal"
    if client_mm < server_mm:
        return "client_older"
    return "client_newer"


def _parse_semver(value: str) -> tuple[int, int, int] | None:
    """Parse a semver string into (major, minor, patch).

    Strips a "-" pre-release suffix before parsing. Returns None for
    anything that doesn't match a strict M.m.p shape with non-negative
    integers.
    """
    if not isinstance(value, str):
        return None
    head = value.split("-", 1)[0].strip()
    parts = head.split(".")
    if len(parts) != 3:
        return None
    try:
        major, minor, patch = (int(p) for p in parts)
    except ValueError:
        return None
    if major < 0 or minor < 0 or patch < 0:
        return None
    return (major, minor, patch)
