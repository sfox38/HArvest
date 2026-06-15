"""Tests for diagnostic_sensors.py.

_slugify() is pure. Individual sensor async_update() methods are tested by
providing mock managers/stores. DiagnosticSensors factory behaviour is tested
without a real HA instance.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.harvest.diagnostic_sensors import (
    DiagnosticSensors,
    HarvestActiveSessionsSensor,
    HarvestActiveTokensSensor,
    HarvestCommandsTodaySensor,
    HarvestDbSizeSensor,
    HarvestErrorsTodaySensor,
    HarvestRunningSensor,
    HarvestTokenCommandsTodaySensor,
    HarvestTokenLastOriginSensor,
    HarvestTokenLastSeenSensor,
    HarvestTokenSessionsSensor,
)
from custom_components.harvest._utils import slugify as _slugify


# ---------------------------------------------------------------------------
# _slugify
# ---------------------------------------------------------------------------

class TestSlugify:
    def test_lowercase(self):
        assert _slugify("Hello") == "hello"

    def test_spaces_become_underscores(self):
        assert _slugify("My Token") == "my_token"

    def test_hyphens_become_underscores(self):
        assert _slugify("front-door") == "front_door"

    def test_non_alphanumeric_removed(self):
        assert _slugify("foo!@#bar") == "foobar"

    def test_leading_trailing_underscores_stripped(self):
        assert _slugify("  token  ") == "token"

    def test_multiple_spaces_become_single_underscore(self):
        assert _slugify("a  b  c") == "a_b_c"

    def test_empty_string_returns_unnamed(self):
        assert _slugify("") == "unnamed"

    def test_all_special_chars_returns_unnamed(self):
        assert _slugify("!@#$%") == "unnamed"

    def test_numbers_preserved(self):
        assert _slugify("Zone 2") == "zone_2"

    def test_mixed_hyphen_space(self):
        assert _slugify("front-door sensor") == "front_door_sensor"


# ---------------------------------------------------------------------------
# HarvestRunningSensor
# ---------------------------------------------------------------------------

class TestHarvestRunningSensor:
    def test_initially_on(self):
        sensor = HarvestRunningSensor()
        assert sensor._attr_is_on is True

    def test_set_running_false(self):
        sensor = HarvestRunningSensor()
        sensor.hass = None  # not registered with HA
        sensor.set_running(False)
        assert sensor._attr_is_on is False

    def test_set_running_true(self):
        sensor = HarvestRunningSensor()
        sensor.hass = None
        sensor.set_running(False)
        sensor.set_running(True)
        assert sensor._attr_is_on is True

    def test_set_running_calls_async_write_ha_state_when_registered(self):
        sensor = HarvestRunningSensor()
        sensor.hass = MagicMock()
        sensor.async_write_ha_state = MagicMock()
        sensor.set_running(False)
        sensor.async_write_ha_state.assert_called_once()

    def test_unique_id(self):
        # Access via instance - HA Entity may shadow _attr_unique_id at class level.
        sensor = HarvestRunningSensor()
        assert sensor.unique_id == "harvest_running"


# ---------------------------------------------------------------------------
# HarvestActiveSessionsSensor
# ---------------------------------------------------------------------------

class TestHarvestActiveSessionsSensor:
    async def test_async_update_reads_count_active(self):
        sm = MagicMock()
        sm.count_active.return_value = 7
        sensor = HarvestActiveSessionsSensor(sm)
        await sensor.async_update()
        assert sensor._attr_native_value == 7

    def test_unique_id(self):
        sm = MagicMock()
        sensor = HarvestActiveSessionsSensor(sm)
        assert sensor._attr_unique_id == "harvest_active_sessions"

    async def test_zero_sessions(self):
        sm = MagicMock()
        sm.count_active.return_value = 0
        sensor = HarvestActiveSessionsSensor(sm)
        await sensor.async_update()
        assert sensor._attr_native_value == 0


# ---------------------------------------------------------------------------
# HarvestActiveTokensSensor
# ---------------------------------------------------------------------------

class TestHarvestActiveTokensSensor:
    async def test_async_update_reads_get_active(self):
        tm = MagicMock()
        tm.get_active.return_value = ["tok1", "tok2", "tok3"]
        sensor = HarvestActiveTokensSensor(tm)
        await sensor.async_update()
        assert sensor._attr_native_value == 3

    def test_unique_id(self):
        sensor = HarvestActiveTokensSensor(MagicMock())
        assert sensor._attr_unique_id == "harvest_active_tokens"


# ---------------------------------------------------------------------------
# HarvestCommandsTodaySensor
# ---------------------------------------------------------------------------

class TestHarvestCommandsTodaySensor:
    async def test_async_update_reads_commands(self):
        store = MagicMock()
        store.count_today = AsyncMock(return_value={"commands": 42, "errors": 1, "auth_ok": 5, "auth_fail": 0})
        sensor = HarvestCommandsTodaySensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == 42

    async def test_returns_zero_when_key_missing(self):
        store = MagicMock()
        store.count_today = AsyncMock(return_value={})
        sensor = HarvestCommandsTodaySensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == 0


# ---------------------------------------------------------------------------
# HarvestErrorsTodaySensor
# ---------------------------------------------------------------------------

class TestHarvestErrorsTodaySensor:
    async def test_sums_auth_fail_and_errors(self):
        store = MagicMock()
        store.count_today = AsyncMock(return_value={
            "commands": 10, "errors": 3, "auth_ok": 5, "auth_fail": 2,
        })
        sensor = HarvestErrorsTodaySensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == 5  # 3 + 2

    async def test_zero_when_no_errors(self):
        store = MagicMock()
        store.count_today = AsyncMock(return_value={"commands": 10, "errors": 0, "auth_ok": 5, "auth_fail": 0})
        sensor = HarvestErrorsTodaySensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == 0


# ---------------------------------------------------------------------------
# HarvestDbSizeSensor
# ---------------------------------------------------------------------------

class TestHarvestDbSizeSensor:
    async def test_converts_bytes_to_mb(self):
        store = MagicMock()
        store.get_db_size_bytes = AsyncMock(return_value=1_048_576)  # exactly 1 MB
        sensor = HarvestDbSizeSensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == pytest.approx(1.0)

    async def test_zero_bytes_gives_zero_mb(self):
        store = MagicMock()
        store.get_db_size_bytes = AsyncMock(return_value=0)
        sensor = HarvestDbSizeSensor(store)
        await sensor.async_update()
        assert sensor._attr_native_value == 0.0

    async def test_rounds_to_two_decimal_places(self):
        store = MagicMock()
        store.get_db_size_bytes = AsyncMock(return_value=1_500_000)
        sensor = HarvestDbSizeSensor(store)
        await sensor.async_update()
        # 1_500_000 / 1024^2 ≈ 1.430511...  rounds to 1.43
        assert sensor._attr_native_value == pytest.approx(1.43, abs=0.01)


# ---------------------------------------------------------------------------
# Per-token sensors
# ---------------------------------------------------------------------------

class TestHarvestTokenSessionsSensor:
    async def test_async_update_reads_count_for_token(self):
        sm = MagicMock()
        sm.count_for_token.return_value = 3
        sensor = HarvestTokenSessionsSensor("hwt_tok1", "bedroom", sm)
        await sensor.async_update()
        assert sensor._attr_native_value == 3
        sm.count_for_token.assert_called_once_with("hwt_tok1")

    def test_unique_id_includes_token_id(self):
        sm = MagicMock()
        sensor = HarvestTokenSessionsSensor("hwt_tok1", "bedroom", sm)
        assert "hwt_tok1" in sensor._attr_unique_id

    def test_name_includes_label_slug(self):
        sm = MagicMock()
        sensor = HarvestTokenSessionsSensor("hwt_tok1", "front_door", sm)
        assert "front_door" in sensor._attr_name


class TestHarvestTokenLastSeenSensor:
    async def test_returns_timestamp_from_most_recent_auth(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(
            return_value=("2024-01-15T12:00:00+00:00", "https://example.com")
        )
        sensor = HarvestTokenLastSeenSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        from datetime import datetime, timezone
        assert sensor._attr_native_value == datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)

    async def test_returns_none_when_no_auth_events(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(return_value=(None, None))
        sensor = HarvestTokenLastSeenSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        assert sensor._attr_native_value is None

    async def test_queries_auth_event_type(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(return_value=(None, None))
        sensor = HarvestTokenLastSeenSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        store.get_last_successful_auth.assert_awaited_once_with("hwt_tok1")


class TestHarvestTokenLastOriginSensor:
    async def test_returns_origin_from_most_recent_auth(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(
            return_value=("2024-01-01T00:00:00+00:00", "https://example.com")
        )
        sensor = HarvestTokenLastOriginSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        assert sensor._attr_native_value == "https://example.com"

    async def test_returns_none_when_no_events(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(return_value=(None, None))
        sensor = HarvestTokenLastOriginSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        assert sensor._attr_native_value is None

    async def test_returns_none_for_empty_origin(self):
        store = MagicMock()
        store.get_last_successful_auth = AsyncMock(
            return_value=("2024-01-01T00:00:00+00:00", None)
        )
        sensor = HarvestTokenLastOriginSensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        assert sensor._attr_native_value is None


class TestHarvestTokenCommandsTodaySensor:
    async def test_async_update_returns_total_count(self):
        store = MagicMock()
        store.count_commands_since = AsyncMock(return_value=15)
        store._hass = MagicMock()
        store._hass.config.time_zone = "UTC"
        sensor = HarvestTokenCommandsTodaySensor("hwt_tok1", "bedroom", store)
        await sensor.async_update()
        assert sensor._attr_native_value == 15


# ---------------------------------------------------------------------------
# DiagnosticSensors factory
# ---------------------------------------------------------------------------

class TestDiagnosticSensorsFactory:
    def _make_ds(self):
        hass = MagicMock()
        # Close any coroutine passed to async_create_task to avoid "never awaited" warnings.
        hass.async_create_task = MagicMock(side_effect=lambda coro: coro.close())
        sm = MagicMock()
        sm.count_active.return_value = 0
        sm.count_for_token.return_value = 0
        store = MagicMock()
        store.count_today = AsyncMock(return_value={"commands": 0, "errors": 0, "auth_ok": 0, "auth_fail": 0})
        store.get_db_size_bytes = AsyncMock(return_value=0)
        store.query_activity = AsyncMock(return_value=([], 0))
        store._hass = hass
        store._hass.config.time_zone = "UTC"
        tm = MagicMock()
        tm.get_active.return_value = []
        return DiagnosticSensors(hass, sm, store, tm), hass, sm, store, tm

    def test_create_global_sensors_returns_six_entities(self):
        ds, *_ = self._make_ds()
        sensors = ds.create_global_sensors()
        assert len(sensors) == 6

    def test_create_global_sensors_includes_running_sensor(self):
        ds, *_ = self._make_ds()
        sensors = ds.create_global_sensors()
        assert any(isinstance(s, HarvestRunningSensor) for s in sensors)

    def test_create_token_sensors_returns_four_entities(self):
        ds, *_ = self._make_ds()
        sensors = ds.create_token_sensors("hwt_tok1", "Bedroom Light")
        assert len(sensors) == 4

    def test_create_token_sensors_registered_in_token_entities(self):
        ds, *_ = self._make_ds()
        ds.create_token_sensors("hwt_tok1", "Bedroom Light")
        assert "hwt_tok1" in ds._token_entities

    def test_create_token_sensors_uses_slugified_label(self):
        ds, *_ = self._make_ds()
        sensors = ds.create_token_sensors("hwt_tok1", "Front Door")
        for s in sensors:
            if hasattr(s, "_label_slug"):
                assert s._label_slug == "front_door"
                break

    def test_remove_token_sensors_clears_registry(self):
        ds, *_ = self._make_ds()
        ds.create_token_sensors("hwt_tok1", "Test Token")
        ds.remove_token_sensors("hwt_tok1")
        assert "hwt_tok1" not in ds._token_entities

    def test_remove_token_sensors_removes_from_entities_list(self):
        ds, *_ = self._make_ds()
        sensors = ds.create_token_sensors("hwt_tok1", "Test Token")
        ds.remove_token_sensors("hwt_tok1")
        for s in sensors:
            assert s not in ds._entities

    def test_remove_nonexistent_token_is_noop(self):
        ds, *_ = self._make_ds()
        # Should not raise.
        ds.remove_token_sensors("hwt_nonexistent")

    def test_multiple_token_registrations_are_independent(self):
        ds, *_ = self._make_ds()
        ds.create_token_sensors("hwt_tok1", "Token A")
        ds.create_token_sensors("hwt_tok2", "Token B")
        ds.remove_token_sensors("hwt_tok1")
        assert "hwt_tok1" not in ds._token_entities
        assert "hwt_tok2" in ds._token_entities

    def test_push_token_update_noop_for_sensors_without_hass(self):
        ds, hass, *_ = self._make_ds()
        ds.create_token_sensors("hwt_tok1", "Test")
        for s in ds._token_entities["hwt_tok1"]:
            s.hass = None  # not attached to HA
        # Should not raise.
        ds.push_token_update("hwt_tok1")
        hass.async_create_task.assert_not_called()

    def test_push_token_update_creates_tasks_when_registered(self):
        ds, hass, *_ = self._make_ds()
        ds.create_token_sensors("hwt_tok1", "Test")
        for s in ds._token_entities["hwt_tok1"]:
            s.hass = MagicMock()  # simulate registered with HA
        ds.push_token_update("hwt_tok1")
        assert hass.async_create_task.call_count == 4  # 4 per-token sensors

    def test_push_token_update_noop_for_unknown_token(self):
        ds, hass, *_ = self._make_ds()
        ds.push_token_update("hwt_nonexistent")
        hass.async_create_task.assert_not_called()

    def test_stop_updates_noop_when_not_started(self):
        ds, *_ = self._make_ds()
        # Should not raise when stop_updates called before schedule_updates.
        ds.stop_updates()
