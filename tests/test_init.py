"""tests/test_init.py

Tests for custom_components.harvest.__init__:
  - async_setup_entry(): wiring, storage, periodic tasks
  - async_unload_entry(): teardown, WS close, activity flush
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch, call

import pytest

from custom_components.harvest.const import DOMAIN


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_entry(data: dict | None = None, options: dict | None = None) -> MagicMock:
    entry = MagicMock()
    entry.entry_id = "entry_001"
    entry.data = data or {}
    entry.options = options or {}
    return entry


def _make_hass() -> MagicMock:
    hass = MagicMock()
    hass.data = {}
    hass.http = MagicMock()
    hass.config.config_dir = "/tmp/ha"
    hass.config.path = MagicMock(return_value="/tmp/ha/custom_components/harvest/panel")
    hass.async_create_task = MagicMock(side_effect=lambda coro: coro.close())
    hass.config_entries.async_forward_entry_setups = AsyncMock()
    hass.config_entries.async_unload_platforms = AsyncMock(return_value=True)
    return hass


# ---------------------------------------------------------------------------
# async_setup_entry()
# ---------------------------------------------------------------------------

class TestAsyncSetupEntry:
    """Tests for the integration setup entry point."""

    @pytest.mark.asyncio
    async def test_returns_true_on_success(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches():
            result = await async_setup_entry(hass, entry)

        assert result is True

    @pytest.mark.asyncio
    async def test_opens_activity_store(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        mocks["ActivityStore"].return_value.open.assert_called_once()

    @pytest.mark.asyncio
    async def test_loads_token_manager(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        mocks["TokenManager"].return_value.load.assert_called_once()

    @pytest.mark.asyncio
    async def test_registers_ws_view(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches():
            await async_setup_entry(hass, entry)

        hass.http.register_view.assert_called()

    @pytest.mark.asyncio
    async def test_calls_register_views(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        mocks["register_views"].assert_called_once()

    @pytest.mark.asyncio
    async def test_calls_register_panel(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        mocks["register_panel"].assert_called_once()

    @pytest.mark.asyncio
    async def test_stores_managers_in_hass_data(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches():
            await async_setup_entry(hass, entry)

        assert DOMAIN in hass.data
        assert entry.entry_id in hass.data[DOMAIN]
        stored = hass.data[DOMAIN][entry.entry_id]
        assert "token_manager" in stored
        assert "session_manager" in stored
        assert "rate_limiter" in stored
        assert "activity_store" in stored
        assert "event_bus" in stored
        assert "sensors" in stored

    @pytest.mark.asyncio
    async def test_schedules_two_periodic_tasks(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        # async_track_time_interval called twice: purge + preview cleanup
        assert mocks["async_track_time_interval"].call_count == 2

    @pytest.mark.asyncio
    async def test_config_merges_defaults_data_options(self):
        """entry.options should override entry.data which overrides DEFAULTS."""
        from custom_components.harvest import async_setup_entry
        from custom_components.harvest.const import CONF_AUTH_TIMEOUT

        hass = _make_hass()
        entry = _make_entry(data={CONF_AUTH_TIMEOUT: 5}, options={CONF_AUTH_TIMEOUT: 3})

        captured_config = {}

        def capture_activity_store(h, cfg):
            captured_config.update(cfg)
            inst = MagicMock()
            inst.open = AsyncMock()
            inst.close = AsyncMock()
            inst.purge_old_records = AsyncMock()
            inst.count_today = AsyncMock(return_value=0)
            inst.get_db_size_bytes = AsyncMock(return_value=0)
            return inst

        with _all_patches() as mocks:
            mocks["ActivityStore"].side_effect = capture_activity_store
            await async_setup_entry(hass, entry)

        assert captured_config[CONF_AUTH_TIMEOUT] == 3  # options wins

    @pytest.mark.asyncio
    async def test_schedules_sensor_updates(self):
        from custom_components.harvest import async_setup_entry

        hass = _make_hass()
        entry = _make_entry()

        with _all_patches() as mocks:
            await async_setup_entry(hass, entry)

        mocks["DiagnosticSensors"].return_value.schedule_updates.assert_called_once()


# ---------------------------------------------------------------------------
# async_unload_entry()
# ---------------------------------------------------------------------------

class TestAsyncUnloadEntry:
    """Tests for the integration teardown entry point."""

    def _store_data(self, hass: MagicMock, entry: MagicMock, **overrides) -> dict:
        """Pre-populate hass.data with mock managers."""
        session_manager = MagicMock()
        session_manager.get_all.return_value = []

        activity_store = MagicMock()
        activity_store.close = AsyncMock()

        sensors = MagicMock()
        sensors.get_entities.return_value = []
        sensors.stop_updates = MagicMock()

        data = {
            "token_manager": MagicMock(),
            "session_manager": session_manager,
            "rate_limiter": MagicMock(),
            "activity_store": activity_store,
            "event_bus": MagicMock(),
            "sensors": sensors,
            **overrides,
        }
        hass.data = {DOMAIN: {entry.entry_id: data}}
        return data

    @pytest.mark.asyncio
    async def test_returns_true_on_success(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()
        self._store_data(hass, entry)

        result = await async_unload_entry(hass, entry)
        assert result is True

    @pytest.mark.asyncio
    async def test_closes_activity_store(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()
        data = self._store_data(hass, entry)

        await async_unload_entry(hass, entry)

        data["activity_store"].close.assert_called_once()

    @pytest.mark.asyncio
    async def test_stops_sensor_updates(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()
        data = self._store_data(hass, entry)

        await async_unload_entry(hass, entry)

        data["sensors"].stop_updates.assert_called_once()

    @pytest.mark.asyncio
    async def test_removes_entry_from_hass_data(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()
        self._store_data(hass, entry)

        await async_unload_entry(hass, entry)

        assert entry.entry_id not in hass.data.get(DOMAIN, {})

    @pytest.mark.asyncio
    async def test_closes_open_websocket_sessions(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        ws = MagicMock()
        ws.closed = False
        ws.close = AsyncMock()

        session = MagicMock()
        session.ws = ws

        session_manager = MagicMock()
        session_manager.get_all.return_value = [session]

        self._store_data(hass, entry, session_manager=session_manager)

        await async_unload_entry(hass, entry)

        ws.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_skips_already_closed_websockets(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        ws = MagicMock()
        ws.closed = True
        ws.close = AsyncMock()

        session = MagicMock()
        session.ws = ws

        session_manager = MagicMock()
        session_manager.get_all.return_value = [session]

        self._store_data(hass, entry, session_manager=session_manager)

        await async_unload_entry(hass, entry)

        ws.close.assert_not_called()

    @pytest.mark.asyncio
    async def test_handles_missing_hass_data_gracefully(self):
        """Unloading when entry_id is not in hass.data should not raise."""
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()
        hass.data = {}  # no entry in hass.data

        result = await async_unload_entry(hass, entry)
        assert result is True

    @pytest.mark.asyncio
    async def test_calls_set_running_false_on_running_sensor(self):
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        running_entity = MagicMock()
        running_entity.set_running = MagicMock()
        running_entity.hass = None  # skip async_remove branch (covered separately)

        sensors = MagicMock()
        sensors.get_entities.return_value = [running_entity]
        sensors.stop_updates = MagicMock()

        self._store_data(hass, entry, sensors=sensors)

        await async_unload_entry(hass, entry)

        running_entity.set_running.assert_called_once_with(False)

    @pytest.mark.asyncio
    async def test_removes_entities_from_state_machine(self):
        """Diagnostic entities must be removed on unload so the next setup
        (e.g. after HACS reinstall, no HA restart) can re-add sensors with
        the same unique_ids without hitting _entity_id_already_exists.
        """
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        e1 = MagicMock()
        e1.hass = MagicMock()  # entity is loaded into HA
        e1.async_remove = AsyncMock()
        e2 = MagicMock()
        e2.hass = MagicMock()
        e2.async_remove = AsyncMock()

        sensors = MagicMock()
        sensors.get_entities.return_value = [e1, e2]
        sensors.stop_updates = MagicMock()

        self._store_data(hass, entry, sensors=sensors)

        await async_unload_entry(hass, entry)

        e1.async_remove.assert_called_once()
        e2.async_remove.assert_called_once()

    @pytest.mark.asyncio
    async def test_skips_remove_for_unmounted_entities(self):
        """Entities that were never added (entity.hass is None) should be
        skipped - calling async_remove on an unmounted entity is a no-op
        in HA but the mock would treat the missing AsyncMock as a sync
        call, so guard at the call site.
        """
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        e = MagicMock()
        e.hass = None
        e.async_remove = MagicMock()  # not AsyncMock - would fail if awaited

        sensors = MagicMock()
        sensors.get_entities.return_value = [e]
        sensors.stop_updates = MagicMock()

        self._store_data(hass, entry, sensors=sensors)

        await async_unload_entry(hass, entry)

        e.async_remove.assert_not_called()

    @pytest.mark.asyncio
    async def test_remove_failure_does_not_break_unload(self):
        """A failed entity removal must not block teardown - other cleanup
        (activity store close, ws close, hass.data pop) must still run.
        """
        from custom_components.harvest import async_unload_entry

        hass = _make_hass()
        entry = _make_entry()

        e = MagicMock()
        e.hass = MagicMock()
        e.async_remove = AsyncMock(side_effect=RuntimeError("boom"))

        sensors = MagicMock()
        sensors.get_entities.return_value = [e]
        sensors.stop_updates = MagicMock()

        data = self._store_data(hass, entry, sensors=sensors)

        result = await async_unload_entry(hass, entry)

        assert result is True
        data["activity_store"].close.assert_called_once()
        assert entry.entry_id not in hass.data.get(DOMAIN, {})


# ---------------------------------------------------------------------------
# Context manager that patches all heavy dependencies
# ---------------------------------------------------------------------------

from contextlib import contextmanager


@contextmanager
def _all_patches():
    """Patch all HA dependencies used by async_setup_entry."""
    base = "custom_components.harvest"

    mock_activity = MagicMock()
    mock_activity.open = AsyncMock()
    mock_activity.close = AsyncMock()
    mock_activity.purge_old_records = AsyncMock()

    mock_token = MagicMock()
    mock_token.load = AsyncMock()
    mock_token.cleanup_expired_previews = AsyncMock()

    mock_sensors = MagicMock()
    mock_sensors.create_global_sensors.return_value = []
    mock_sensors.schedule_updates = MagicMock()

    mock_theme = MagicMock()
    mock_theme.load = AsyncMock()

    mock_pack = MagicMock()
    mock_pack.load = AsyncMock()

    mock_warnings = MagicMock()
    mock_warnings.load = AsyncMock()

    mock_register_panel = AsyncMock()

    mocks = {}

    with patch(f"{base}.ActivityStore", return_value=mock_activity) as p_as, \
         patch(f"{base}.TokenManager", return_value=mock_token) as p_tm, \
         patch(f"{base}.SessionManager") as p_sm, \
         patch(f"{base}.RateLimiter") as p_rl, \
         patch(f"{base}.EventBus") as p_eb, \
         patch(f"{base}.ThemeManager", return_value=mock_theme) as p_thm, \
         patch(f"{base}.RendererManager", return_value=mock_pack) as p_pm, \
         patch(f"{base}.WarningsStore", return_value=mock_warnings) as p_ws_store, \
         patch(f"{base}.ControlEntities") as p_ce, \
         patch(f"{base}.DiagnosticSensors", return_value=mock_sensors) as p_ds, \
         patch(f"{base}.HarvestWsView") as p_ws, \
         patch(f"{base}.register_views") as p_rv, \
         patch(f"{base}.register_panel", mock_register_panel) as p_rp, \
         patch(f"{base}.async_track_time_interval") as p_tti, \
         patch(f"{base}.EntityComponent") as p_ec:

        p_ec.return_value.async_add_entities = AsyncMock()

        mocks["ActivityStore"] = p_as
        mocks["TokenManager"] = p_tm
        mocks["SessionManager"] = p_sm
        mocks["RateLimiter"] = p_rl
        mocks["EventBus"] = p_eb
        mocks["ThemeManager"] = p_thm
        mocks["RendererManager"] = p_pm
        mocks["WarningsStore"] = p_ws_store
        mocks["ControlEntities"] = p_ce
        mocks["DiagnosticSensors"] = p_ds
        mocks["HarvestWsView"] = p_ws
        mocks["register_views"] = p_rv
        mocks["register_panel"] = p_rp
        mocks["async_track_time_interval"] = p_tti
        mocks["EntityComponent"] = p_ec

        yield mocks
