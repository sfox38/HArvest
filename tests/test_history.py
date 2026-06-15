"""tests/test_history.py

Tests for the recorder-history path shared by the WebSocket history_request
handler and the panel preview history endpoint:

  - _aggregate_points()    - pure period-bucket aggregation
  - fetch_history_points() - recorder fetch + filtering + aggregation

These cover the server side of the graph feature: the widget only draws a graph
when it receives two or more usable points, so the aggregation and filtering
here are what make the graph appear (or not) on live widgets.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.harvest.ws_proxy import _aggregate_points, fetch_history_points


class _FakeState:
    """Minimal stand-in for a recorder State (only .state + .last_changed)."""

    def __init__(self, state: str, ts: float) -> None:
        self.state = state
        self.last_changed = datetime.fromtimestamp(ts, tz=timezone.utc)


# ---------------------------------------------------------------------------
# _aggregate_points
# ---------------------------------------------------------------------------

def test_aggregate_points_averages_numeric_buckets():
    # Two 10-minute buckets over 20 minutes. First bucket averages 20 and 22.
    raw = [(100.0, 20.0), (200.0, 22.0), (700.0, 30.0)]
    points = _aggregate_points(raw, 0.0, 1200.0, 10)
    assert len(points) == 2
    assert points[0]["s"] == "21.0"
    assert points[1]["s"] == "30.0"
    # Timestamps are ISO strings at the bucket midpoint.
    assert all("t" in p and "s" in p for p in points)


def test_aggregate_points_empty_input():
    assert _aggregate_points([], 0.0, 1200.0, 10) == []


def test_aggregate_points_use_last_carries_state_forward():
    # A single "on" (1.0) early in the window carries through later buckets.
    raw = [(100.0, 1.0)]
    points = _aggregate_points(raw, 0.0, 1200.0, 10, use_last=True)
    assert len(points) == 2
    assert [p["s"] for p in points] == ["1.0", "1.0"]


def test_aggregate_points_skips_discrete_buckets_before_first_value():
    # use_last must not emit points before the first known value.
    raw = [(700.0, 1.0)]
    points = _aggregate_points(raw, 0.0, 1200.0, 10, use_last=True)
    assert len(points) == 1
    assert points[0]["s"] == "1.0"


# ---------------------------------------------------------------------------
# fetch_history_points
# ---------------------------------------------------------------------------

def _hass_with_recorder(loaded: bool = True) -> MagicMock:
    hass = MagicMock()
    hass.config.components = {"recorder"} if loaded else set()
    return hass


def _patch_recorder(states_dict):
    instance = MagicMock()
    instance.async_add_executor_job = AsyncMock(return_value=states_dict)
    return patch(
        "homeassistant.components.recorder.get_instance", return_value=instance
    )


async def test_fetch_history_returns_empty_when_recorder_not_loaded():
    hass = _hass_with_recorder(loaded=False)
    points = await fetch_history_points(hass, "sensor.temp", 24, 10)
    assert points == []


async def test_fetch_history_aggregates_numeric_states():
    now = datetime.now(tz=timezone.utc)
    states = [
        _FakeState("20", (now - timedelta(hours=2)).timestamp()),
        _FakeState("22", (now - timedelta(hours=1)).timestamp()),
    ]
    hass = _hass_with_recorder()
    with _patch_recorder({"sensor.temp": states}):
        points = await fetch_history_points(hass, "sensor.temp", 24, 60)
    assert len(points) >= 2
    assert all("t" in p and "s" in p for p in points)


async def test_fetch_history_filters_non_numeric_states():
    now = datetime.now(tz=timezone.utc)
    states = [
        _FakeState("unavailable", (now - timedelta(hours=2)).timestamp()),
        _FakeState("unknown", (now - timedelta(hours=1, minutes=30)).timestamp()),
        _FakeState("21", (now - timedelta(hours=1)).timestamp()),
    ]
    hass = _hass_with_recorder()
    with _patch_recorder({"sensor.temp": states}):
        points = await fetch_history_points(hass, "sensor.temp", 24, 60)
    # Only the single numeric reading survives.
    assert len(points) == 1
    assert points[0]["s"] == "21.0"


async def test_fetch_history_maps_binary_sensor_on_off():
    now = datetime.now(tz=timezone.utc)
    states = [
        _FakeState("on", (now - timedelta(hours=2)).timestamp()),
        _FakeState("off", (now - timedelta(hours=1)).timestamp()),
    ]
    hass = _hass_with_recorder()
    with _patch_recorder({"binary_sensor.motion": states}):
        points = await fetch_history_points(hass, "binary_sensor.motion", 24, 60)
    assert len(points) >= 2
    assert {p["s"] for p in points} <= {"0.0", "1.0"}


async def test_fetch_history_swallows_recorder_errors():
    hass = _hass_with_recorder()
    with patch(
        "homeassistant.components.recorder.get_instance",
        side_effect=RuntimeError("recorder down"),
    ):
        points = await fetch_history_points(hass, "sensor.temp", 24, 10)
    assert points == []
