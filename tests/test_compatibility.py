"""tests/test_compatibility.py

Pure-function tests for the client/server compatibility evaluator.
Covers SPEC.md Section 12 (Client/Server Compatibility) rules:
  - protocol-range hard accept/reject
  - widget-version drift comparison at minor-or-major granularity
  - WordPress-plugin-version drift (only when source == "wp")
  - graceful degradation for old / malformed clients
"""
from __future__ import annotations

import pytest

from custom_components.harvest import compatibility as compat
from custom_components.harvest.compatibility import (
    ClientInfo,
    ServerInfo,
    check_protocol_compatibility,
    evaluate,
    parse_client_block,
)


def _server(protocol: int = 1, version: str = "0.9.3", min_protocol: int = 1) -> ServerInfo:
    return ServerInfo(protocol=protocol, version=version, min_client_protocol=min_protocol)


def _client(
    protocol: int = 1,
    widget: str | None = "0.9.3",
    source: str = "html",
    source_version: str | None = None,
) -> ClientInfo:
    return ClientInfo(
        protocol=protocol,
        widget=widget,
        source=source,  # type: ignore[arg-type]
        source_version=source_version,
    )


# ---------------------------------------------------------------------------
# parse_client_block()
# ---------------------------------------------------------------------------

class TestParseClientBlock:
    def test_missing_returns_unknown_defaults(self):
        c = parse_client_block(None)
        assert c == ClientInfo(protocol=1, widget=None, source="unknown", source_version=None)

    def test_non_dict_returns_unknown_defaults(self):
        c = parse_client_block("not a dict")
        assert c.source == "unknown"
        assert c.protocol == 1

    def test_full_valid_block(self):
        c = parse_client_block({
            "protocol": 1,
            "widget": "0.9.3",
            "source": "wp",
            "source_version": "0.9.3",
        })
        assert c == ClientInfo(protocol=1, widget="0.9.3", source="wp", source_version="0.9.3")

    def test_html_source_drops_source_version(self):
        # source_version is meaningful only for source="wp"
        c = parse_client_block({
            "protocol": 1,
            "widget": "0.9.3",
            "source": "html",
            "source_version": "9.9.9",
        })
        assert c.source_version is None

    def test_panel_source_drops_source_version(self):
        c = parse_client_block({
            "protocol": 1,
            "widget": "0.9.3",
            "source": "panel",
            "source_version": "9.9.9",
        })
        assert c.source_version is None

    def test_unknown_source_value_collapses_to_unknown(self):
        c = parse_client_block({"protocol": 1, "source": "made_up"})
        assert c.source == "unknown"

    def test_invalid_protocol_falls_back_to_one(self):
        # Server must not let a malformed protocol number bypass the range
        # check by being non-numeric. Coerce to 1 (the baseline).
        c = parse_client_block({"protocol": "v1"})
        assert c.protocol == 1
        c2 = parse_client_block({"protocol": -3})
        assert c2.protocol == 1
        c3 = parse_client_block({"protocol": 0})
        assert c3.protocol == 1

    def test_blank_widget_treated_as_missing(self):
        c = parse_client_block({"widget": "  "})
        assert c.widget is None


# ---------------------------------------------------------------------------
# check_protocol_compatibility()
# ---------------------------------------------------------------------------

class TestCheckProtocolCompatibility:
    def test_equal_versions_accepted(self):
        assert check_protocol_compatibility(_client(protocol=1), _server(protocol=1)) is True

    def test_client_within_range_accepted(self):
        # Server accepts [1, 3]; client speaks 2.
        s = _server(protocol=3, min_protocol=1)
        assert check_protocol_compatibility(_client(protocol=2), s) is True

    def test_client_at_lower_bound_accepted(self):
        s = _server(protocol=3, min_protocol=2)
        assert check_protocol_compatibility(_client(protocol=2), s) is True

    def test_client_below_minimum_rejected(self):
        s = _server(protocol=3, min_protocol=2)
        assert check_protocol_compatibility(_client(protocol=1), s) is False

    def test_client_above_server_rejected(self):
        # Client newer than server can speak. Server must reject so the
        # widget surfaces HRV_INCOMPATIBLE rather than crash mid-session.
        s = _server(protocol=1, min_protocol=1)
        assert check_protocol_compatibility(_client(protocol=2), s) is False


# ---------------------------------------------------------------------------
# evaluate() - widget version drift
# ---------------------------------------------------------------------------

class TestEvaluateWidgetDrift:
    def test_matching_versions_ok(self):
        assert evaluate(_client(widget="0.9.3"), _server(version="0.9.3")) == "ok"

    def test_patch_difference_ignored(self):
        # 0.9.3 vs 0.9.4: same minor, just patch. SPEC: patch-only drift
        # is "ok" because patch bumps are reserved for non-protocol fixes.
        assert evaluate(_client(widget="0.9.4"), _server(version="0.9.3")) == "ok"
        assert evaluate(_client(widget="0.9.0"), _server(version="0.9.99")) == "ok"

    def test_minor_older_client_outdated(self):
        assert evaluate(_client(widget="0.8.5"), _server(version="0.9.3")) == "client_outdated"

    def test_major_older_client_outdated(self):
        assert evaluate(_client(widget="0.9.3"), _server(version="1.0.0")) == "client_outdated"

    def test_minor_newer_server_outdated(self):
        assert evaluate(_client(widget="0.10.0"), _server(version="0.9.3")) == "server_outdated"

    def test_major_newer_server_outdated(self):
        assert evaluate(_client(widget="2.0.0"), _server(version="1.5.0")) == "server_outdated"

    def test_pre_release_suffix_stripped(self):
        # "0.9.3-beta.1" should compare as 0.9.3.
        assert evaluate(_client(widget="0.9.3-beta.1"), _server(version="0.9.3")) == "ok"
        assert evaluate(_client(widget="0.9.3-rc.2"), _server(version="0.10.0")) == "client_outdated"

    def test_malformed_widget_version_collapses_to_ok(self):
        # A garbage version must NOT trigger a false drift warning.
        # Better silent than spurious banner.
        assert evaluate(_client(widget="not-a-version"), _server(version="0.9.3")) == "ok"
        assert evaluate(_client(widget="0.9"), _server(version="0.9.3")) == "ok"
        assert evaluate(_client(widget=""), _server(version="0.9.3")) == "ok"


# ---------------------------------------------------------------------------
# evaluate() - WP plugin drift
# ---------------------------------------------------------------------------

class TestEvaluateWpPluginDrift:
    def test_wp_plugin_in_sync_ok(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = _client(widget="0.9.3", source="wp", source_version="0.9.3")
        assert evaluate(c, _server(version="0.9.3")) == "ok"

    def test_wp_plugin_minor_outdated(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = _client(widget="0.9.3", source="wp", source_version="0.8.0")
        assert evaluate(c, _server(version="0.9.3")) == "client_outdated"

    def test_wp_plugin_newer_than_server(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = _client(widget="0.9.3", source="wp", source_version="0.10.0")
        assert evaluate(c, _server(version="0.9.3")) == "server_outdated"

    def test_wp_plugin_patch_diff_ignored(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = _client(widget="0.9.3", source="wp", source_version="0.9.4")
        assert evaluate(c, _server(version="0.9.3")) == "ok"

    def test_widget_drift_dominates_over_wp_drift(self, monkeypatch):
        # Both the widget AND the WP plugin are stale. Either alone would
        # trigger client_outdated; together they still report client_outdated.
        # (No special "doubly_outdated" status; one banner suffices.)
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = _client(widget="0.8.0", source="wp", source_version="0.8.0")
        assert evaluate(c, _server(version="0.9.3")) == "client_outdated"

    def test_html_source_skips_wp_check(self, monkeypatch):
        # source_version is dropped at parse time for source != "wp", but
        # also defend against direct ClientInfo construction with stale data.
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        c = ClientInfo(protocol=1, widget="0.9.3", source="html", source_version="0.1.0")
        # source != "wp" -> source_version is ignored regardless.
        assert evaluate(c, _server(version="0.9.3")) == "ok"


# ---------------------------------------------------------------------------
# evaluate() - old clients (no client block)
# ---------------------------------------------------------------------------

class TestEvaluateOldClient:
    def test_old_client_no_client_block_is_ok(self):
        # Old widget that predates the handshake reports nothing.
        # SPEC: "Old clients that omit the client field auth normally
        # with compatibility = ok."
        c = ClientInfo(protocol=1, widget=None, source="unknown", source_version=None)
        assert evaluate(c, _server(version="0.9.3")) == "ok"

    def test_unknown_source_with_widget_still_compares_widget(self):
        # Edge case: client sent widget but source was unrecognized.
        # We still compare widget since that's actionable info.
        c = ClientInfo(protocol=1, widget="0.8.0", source="unknown", source_version=None)
        assert evaluate(c, _server(version="0.9.3")) == "client_outdated"


# ---------------------------------------------------------------------------
# Integration: parse + check + evaluate together (mirrors ws_proxy flow)
# ---------------------------------------------------------------------------

class TestEndToEndAuthFlow:
    def test_modern_wp_in_sync(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        raw = {"protocol": 1, "widget": "0.9.3", "source": "wp", "source_version": "0.9.3"}
        client = parse_client_block(raw)
        server = _server(version="0.9.3")
        assert check_protocol_compatibility(client, server) is True
        assert evaluate(client, server) == "ok"

    def test_modern_wp_outdated_plugin(self, monkeypatch):
        monkeypatch.setattr(compat, "BUNDLED_WP_PLUGIN_VERSION", "0.9.3")
        raw = {"protocol": 1, "widget": "0.9.3", "source": "wp", "source_version": "0.7.0"}
        client = parse_client_block(raw)
        server = _server(version="0.9.3")
        assert check_protocol_compatibility(client, server) is True
        assert evaluate(client, server) == "client_outdated"

    def test_protocol_too_old_rejected_at_check(self):
        raw = {"protocol": 1}
        client = parse_client_block(raw)
        server = _server(protocol=2, min_protocol=2)
        assert check_protocol_compatibility(client, server) is False
        # If we were to call evaluate anyway it would not crash; just verify.
        assert evaluate(client, server) == "ok"

    def test_protocol_too_new_rejected_at_check(self):
        raw = {"protocol": 5}
        client = parse_client_block(raw)
        server = _server(protocol=1, min_protocol=1)
        assert check_protocol_compatibility(client, server) is False

    def test_no_client_block_proceeds_with_ok(self):
        client = parse_client_block(None)
        server = _server(version="0.9.3")
        assert check_protocol_compatibility(client, server) is True
        assert evaluate(client, server) == "ok"
