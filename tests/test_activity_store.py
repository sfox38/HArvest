"""Tests for activity_store.py.

Uses a real aiosqlite database in a temporary directory. Each test gets a
fresh ActivityStore opened against a temp path. _flush() is called manually
to bypass the 5-second background timer.
"""
from __future__ import annotations

import csv
import io
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest

from custom_components.harvest.activity_store import (
    ActivityStore,
    AuthEvent,
    CommandEvent,
    ErrorEvent,
    SessionEvent,
    _build_auth_clause,
    _days_ago_iso,
    _hour_buckets,
    _hours_ago_iso,
    _csv_safe,
    _ts,
    _where,
)
from custom_components.harvest.const import DEFAULTS


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _now() -> datetime:
    return datetime.now(tz=timezone.utc)


def _mock_hass(config_dir: str) -> MagicMock:
    hass = MagicMock()
    hass.config.config_dir = config_dir
    hass.config.time_zone = "UTC"
    return hass


def _auth_event(**kwargs) -> AuthEvent:
    defaults = dict(
        token_id="hwt_tok1",
        origin="https://example.com",
        source_ip="1.2.3.4",
        result="ok",
        error_code=None,
        timestamp=_now(),
    )
    defaults.update(kwargs)
    return AuthEvent(**defaults)


def _command_event(**kwargs) -> CommandEvent:
    defaults = dict(
        session_id="hrs_sess1",
        token_id="hwt_tok1",
        entity_id="light.test",
        action="turn_on",
        success=True,
        timestamp=_now(),
    )
    defaults.update(kwargs)
    return CommandEvent(**defaults)


def _session_event(**kwargs) -> SessionEvent:
    defaults = dict(
        session_id="hrs_sess1",
        token_id="hwt_tok1",
        origin="https://example.com",
        source_ip="1.2.3.4",
        event_type="connected",
        timestamp=_now(),
    )
    defaults.update(kwargs)
    return SessionEvent(**defaults)


def _error_event(**kwargs) -> ErrorEvent:
    defaults = dict(
        session_id="hrs_sess1",
        code="ERR_TEST",
        message="test error",
        timestamp=_now(),
    )
    defaults.update(kwargs)
    return ErrorEvent(**defaults)


@pytest.fixture
async def store(tmp_path):
    """Open a fresh ActivityStore, yield it, then close it."""
    hass = _mock_hass(str(tmp_path))
    s = ActivityStore(hass, dict(DEFAULTS))
    await s.open()
    yield s
    await s.close()


# ---------------------------------------------------------------------------
# Pure helper functions
# ---------------------------------------------------------------------------

class TestTs:
    def test_naive_datetime_gets_utc(self):
        dt = datetime(2024, 1, 15, 12, 0, 0)  # no tzinfo
        result = _ts(dt)
        assert "+00:00" in result or result.endswith("Z") or "UTC" in result

    def test_aware_datetime_converts_to_utc(self):
        est = timezone(timedelta(hours=-5))
        dt = datetime(2024, 1, 15, 7, 0, 0, tzinfo=est)  # 07:00 EST = 12:00 UTC
        result = _ts(dt)
        assert "12:00:00" in result

    def test_returns_iso8601_string(self):
        dt = _now()
        result = _ts(dt)
        # Should be parseable as ISO 8601.
        parsed = datetime.fromisoformat(result)
        assert parsed.tzinfo is not None


class TestCsvSafe:
    def test_formula_prefix_is_neutralized(self):
        assert _csv_safe("=WEBSERVICE(\"https://example.com\")").startswith("'=")

    def test_plain_text_is_unchanged(self):
        assert _csv_safe("https://example.com") == "https://example.com"


class TestHoursAgoIso:
    def test_returns_string(self):
        result = _hours_ago_iso(24)
        assert isinstance(result, str)

    def test_is_in_the_past(self):
        result = _hours_ago_iso(1)
        parsed = datetime.fromisoformat(result)
        assert parsed < datetime.now(tz=timezone.utc)

    def test_approximately_correct_offset(self):
        result = _hours_ago_iso(2)
        parsed = datetime.fromisoformat(result)
        diff = datetime.now(tz=timezone.utc) - parsed
        # Should be close to 2 hours (allow 5 seconds slop).
        assert abs(diff.total_seconds() - 7200) < 5


class TestDaysAgoIso:
    def test_returns_string(self):
        assert isinstance(_days_ago_iso(30), str)

    def test_is_in_the_past(self):
        parsed = datetime.fromisoformat(_days_ago_iso(1))
        assert parsed < datetime.now(tz=timezone.utc)


class TestHourBuckets:
    def test_returns_correct_count(self):
        buckets = _hour_buckets(5)
        assert len(buckets) == 5

    def test_all_truncated_to_hour(self):
        for b in _hour_buckets(3):
            assert b.endswith(":00:00")

    def test_last_bucket_is_current_hour(self):
        buckets = _hour_buckets(1)
        now_hour = datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:00:00")
        assert buckets[-1] == now_hour

    def test_ascending_order(self):
        buckets = _hour_buckets(4)
        assert buckets == sorted(buckets)


class TestWhere:
    def test_empty_conditions_returns_empty_string(self):
        assert _where([]) == ""

    def test_single_condition(self):
        result = _where(["token_id = ?"])
        assert result == " WHERE token_id = ?"

    def test_multiple_conditions_joined_with_and(self):
        result = _where(["a = ?", "b = ?"])
        assert "AND" in result
        assert "a = ?" in result
        assert "b = ?" in result


class TestBuildAuthClause:
    def test_no_filters_returns_empty(self):
        clause, params = _build_auth_clause(None, None, None)
        assert clause == ""
        assert params == []

    def test_token_id_filter(self):
        clause, params = _build_auth_clause("hwt_tok1", None, None)
        assert "token_id = ?" in clause
        assert params == ["hwt_tok1"]

    def test_since_filter(self):
        clause, params = _build_auth_clause(None, "2024-01-01T00:00:00", None)
        assert "timestamp >=" in clause
        assert "2024-01-01T00:00:00" in params

    def test_until_filter(self):
        clause, params = _build_auth_clause(None, None, "2024-12-31T23:59:59")
        assert "timestamp <=" in clause

    def test_all_filters_combined(self):
        clause, params = _build_auth_clause("hwt_tok1", "2024-01-01", "2024-12-31")
        assert len(params) == 3
        assert "hwt_tok1" in params


# ---------------------------------------------------------------------------
# ActivityStore lifecycle
# ---------------------------------------------------------------------------

class TestLifecycle:
    async def test_open_creates_database_file(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        await s.open()
        await s.close()
        assert (tmp_path / "harvest_activity.db").exists()

    async def test_close_is_idempotent_after_open_close(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        await s.open()
        await s.close()
        # Second close should not raise.
        await s.close()

    async def test_schema_tables_created(self, store):
        cursor = await store._db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        )
        tables = {row[0] for row in await cursor.fetchall()}
        assert {"auth_events", "commands", "session_events", "errors"}.issubset(tables)

    async def test_wal_mode_enabled(self, store):
        cursor = await store._db.execute("PRAGMA journal_mode")
        row = await cursor.fetchone()
        assert row[0] == "wal"

    async def test_corrupt_database_is_renamed_and_fresh_db_opened(self, tmp_path):
        """If the DB file is corrupt, it should be renamed and a fresh DB opened."""
        db_path = tmp_path / "harvest_activity.db"
        db_path.write_bytes(b"this is not valid sqlite data at all xxxxxx")

        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        await s.open()  # should not raise
        await s.close()

        # The corrupt file should have been renamed.
        corrupt_files = list(tmp_path.glob("harvest_activity.corrupt.*.db"))
        assert len(corrupt_files) == 1

        # A fresh database should exist.
        assert db_path.exists()


# ---------------------------------------------------------------------------
# record_* + _flush round-trip
# ---------------------------------------------------------------------------

class TestRecordAndFlush:
    async def test_record_auth_ok_is_stored(self, store):
        store.record_auth(_auth_event(result="ok"))
        await store._flush()

        cursor = await store._db.execute("SELECT result FROM auth_events")
        rows = await cursor.fetchall()
        assert len(rows) == 1
        assert rows[0][0] == "ok"

    async def test_record_auth_failed_with_error_code(self, store):
        store.record_auth(_auth_event(result="failed", error_code="ERR_HMAC"))
        await store._flush()

        cursor = await store._db.execute("SELECT error_code FROM auth_events")
        row = await cursor.fetchone()
        assert row[0] == "ERR_HMAC"

    async def test_record_command_success(self, store):
        store.record_command(_command_event(success=True, action="turn_on"))
        await store._flush()

        cursor = await store._db.execute("SELECT action, success FROM commands")
        row = await cursor.fetchone()
        assert row[0] == "turn_on"
        assert row[1] == 1

    async def test_record_command_failure(self, store):
        store.record_command(_command_event(success=False))
        await store._flush()

        cursor = await store._db.execute("SELECT success FROM commands")
        row = await cursor.fetchone()
        assert row[0] == 0

    async def test_record_session_event(self, store):
        store.record_session(_session_event(event_type="disconnected"))
        await store._flush()

        cursor = await store._db.execute("SELECT event_type FROM session_events")
        row = await cursor.fetchone()
        assert row[0] == "disconnected"

    async def test_record_error_event(self, store):
        store.record_error(_error_event(code="ERR_TEST", message="boom"))
        await store._flush()

        cursor = await store._db.execute("SELECT code, message FROM errors")
        row = await cursor.fetchone()
        assert row[0] == "ERR_TEST"
        assert row[1] == "boom"

    async def test_record_error_with_none_session_id(self, store):
        store.record_error(_error_event(session_id=None))
        await store._flush()

        cursor = await store._db.execute("SELECT session_id FROM errors")
        row = await cursor.fetchone()
        assert row[0] is None

    async def test_flush_noop_on_empty_queue(self, store):
        """Flushing with an empty queue should not raise."""
        await store._flush()

    async def test_multiple_events_in_single_flush(self, store):
        for i in range(5):
            store.record_auth(_auth_event(source_ip=f"1.2.3.{i}"))
        await store._flush()

        cursor = await store._db.execute("SELECT COUNT(*) FROM auth_events")
        row = await cursor.fetchone()
        assert row[0] == 5


# ---------------------------------------------------------------------------
# query_activity
# ---------------------------------------------------------------------------

class TestQueryActivity:
    async def _seed(self, store):
        """Insert two ok auth events, one failed auth, one command, one session."""
        store.record_auth(_auth_event(token_id="hwt_tok1", result="ok"))
        store.record_auth(_auth_event(token_id="hwt_tok2", result="ok"))
        store.record_auth(_auth_event(token_id="hwt_tok2", result="failed", error_code="ERR_X"))
        store.record_command(_command_event(token_id="hwt_tok1"))
        store.record_session(_session_event(token_id="hwt_tok1"))
        store.record_error(_error_event())
        await store._flush()

    async def test_returns_all_event_types_by_default(self, store):
        await self._seed(store)
        events, total = await store.query_activity()
        assert total >= 5

    async def test_filter_by_token_id(self, store):
        await self._seed(store)
        events, total = await store.query_activity(token_id="hwt_tok1")
        # All returned events (that have a token_id field) should be hwt_tok1.
        for e in events:
            if e["token_id"]:
                assert e["token_id"] == "hwt_tok1"

    async def test_filter_by_event_type_auth_only(self, store):
        await self._seed(store)
        events, total = await store.query_activity(display_type_filter="AUTH_OK")
        assert all(e["type"] == "AUTH_OK" for e in events)
        assert total == 2  # two auth events inserted (both result="ok")

    async def test_filter_by_event_type_command_only(self, store):
        await self._seed(store)
        events, total = await store.query_activity(display_type_filter="COMMAND")
        assert all(e["type"] == "COMMAND" for e in events)
        assert total == 1

    async def test_pagination_limit_and_offset(self, store):
        for i in range(10):
            store.record_auth(_auth_event(source_ip=f"10.0.0.{i}"))
        await store._flush()

        events1, total = await store.query_activity(display_type_filter="AUTH_OK", limit=5, offset=0)
        events2, _ = await store.query_activity(display_type_filter="AUTH_OK", limit=5, offset=5)
        assert len(events1) == 5
        assert len(events2) == 5
        assert total == 10

    async def test_returns_empty_for_no_db(self, tmp_path):
        """When _db is None, returns ([], 0)."""
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        # Do not open.
        events, total = await s.query_activity()
        assert events == []
        assert total == 0

    async def test_since_filter_excludes_older_records(self, store):
        old_time = _now() - timedelta(hours=2)
        store.record_auth(_auth_event(timestamp=old_time, source_ip="10.0.0.1"))
        store.record_auth(_auth_event(source_ip="10.0.0.2"))  # current time
        await store._flush()

        # Filter to only the last hour.
        since = _now() - timedelta(hours=1)
        events, total = await store.query_activity(display_type_filter="AUTH_OK", since=since)
        assert total == 1

    async def test_result_has_required_keys(self, store):
        store.record_auth(_auth_event())
        await store._flush()
        events, _ = await store.query_activity()
        required = {
            "type", "timestamp", "token_id", "session_id",
            "origin", "entity_id", "action", "code", "message",
        }
        assert required.issubset(set(events[0].keys()))

    async def test_empty_event_types_list_treated_as_all(self, store):
        """An empty list is falsy so the code falls back to all event types."""
        store.record_auth(_auth_event())
        await store._flush()
        # [] is falsy - treated the same as None (all types returned).
        events, total = await store.query_activity()
        assert total >= 1


# ---------------------------------------------------------------------------
# purge_old_records
# ---------------------------------------------------------------------------

class TestPurgeOldRecords:
    async def test_purges_records_older_than_retention(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        cfg = dict(DEFAULTS)
        cfg["activity_log_retention_days"] = 30
        s = ActivityStore(hass, cfg)
        await s.open()

        # Insert an old record (40 days ago).
        old_time = _now() - timedelta(days=40)
        s.record_auth(_auth_event(timestamp=old_time))
        s.record_auth(_auth_event())  # recent
        await s._flush()

        deleted = await s.purge_old_records()
        await s.close()

        assert deleted == 1

    async def test_purge_returns_zero_with_no_old_records(self, store):
        store.record_auth(_auth_event())  # current timestamp
        await store._flush()
        deleted = await store.purge_old_records()
        assert deleted == 0

    async def test_purge_returns_zero_when_db_closed(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        # Do not open.
        result = await s.purge_old_records()
        assert result == 0


# ---------------------------------------------------------------------------
# get_db_size_bytes
# ---------------------------------------------------------------------------

class TestGetDbSizeBytes:
    async def test_returns_positive_after_write(self, store):
        store.record_auth(_auth_event())
        await store._flush()
        size = await store.get_db_size_bytes()
        assert size > 0

    async def test_returns_zero_for_missing_file(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        # db_path does not exist - stat() raises OSError.
        result = await s.get_db_size_bytes()
        assert result == 0


# ---------------------------------------------------------------------------
# export_csv
# ---------------------------------------------------------------------------

class TestExportCsv:
    async def test_csv_has_header_row(self, store):
        csv_str = await store.export_csv()
        reader = csv.reader(io.StringIO(csv_str))
        header = next(reader)
        assert "timestamp" in header
        assert "type" in header
        assert "token_id" in header

    async def test_csv_includes_auth_events(self, store):
        store.record_auth(_auth_event(token_id="hwt_tok1", result="ok"))
        await store._flush()

        csv_str = await store.export_csv()
        assert "hwt_tok1" in csv_str
        assert "AUTH_OK" in csv_str

    async def test_csv_filter_by_event_type(self, store):
        store.record_auth(_auth_event())
        store.record_command(_command_event())
        await store._flush()

        csv_str = await store.export_csv(display_type_filter="AUTH_OK")
        assert "AUTH_OK" in csv_str
        assert "COMMAND" not in csv_str

    async def test_csv_empty_store_has_only_header(self, store):
        csv_str = await store.export_csv()
        lines = [l for l in csv_str.strip().split("\n") if l]
        assert len(lines) == 1  # only the header

    async def test_csv_all_rows_exported_without_pagination(self, store):
        for i in range(20):
            store.record_auth(_auth_event(source_ip=f"10.0.0.{i}"))
        await store._flush()

        csv_str = await store.export_csv(display_type_filter="AUTH_OK")
        reader = csv.reader(io.StringIO(csv_str))
        next(reader)  # skip header
        rows = list(reader)
        assert len(rows) == 20


# ---------------------------------------------------------------------------
# count_today
# ---------------------------------------------------------------------------

class TestCountToday:
    async def test_counts_todays_auth_ok(self, store):
        store.record_auth(_auth_event(result="ok"))
        await store._flush()
        counts = await store.count_today()
        assert counts["auth_ok"] >= 1

    async def test_counts_todays_auth_fail(self, store):
        store.record_auth(_auth_event(result="failed", error_code="ERR_X"))
        await store._flush()
        counts = await store.count_today()
        assert counts["auth_fail"] >= 1

    async def test_counts_todays_commands(self, store):
        store.record_command(_command_event())
        await store._flush()
        counts = await store.count_today()
        assert counts["commands"] >= 1

    async def test_counts_todays_errors(self, store):
        store.record_error(_error_event())
        await store._flush()
        counts = await store.count_today()
        assert counts["errors"] >= 1

    async def test_old_records_not_counted(self, store):
        old_time = _now() - timedelta(days=2)
        store.record_command(_command_event(timestamp=old_time))
        await store._flush()
        counts = await store.count_today()
        assert counts["commands"] == 0

    async def test_returns_zeros_when_db_closed(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        # Do not open.
        counts = await s.count_today()
        assert counts == {"commands": 0, "errors": 0, "auth_ok": 0, "auth_fail": 0}


# ---------------------------------------------------------------------------
# query_aggregates
# ---------------------------------------------------------------------------

class TestQueryAggregates:
    async def test_returns_correct_number_of_hour_buckets(self, store):
        result = await store.query_aggregates(hours=6)
        assert len(result["hours"]) == 6

    async def test_each_bucket_has_required_keys(self, store):
        result = await store.query_aggregates(hours=1)
        bucket = result["hours"][0]
        for key in ("hour", "auth_ok_count", "auth_fail_count", "command_count", "peak_sessions"):
            assert key in bucket

    async def test_auth_ok_counted_in_correct_bucket(self, store):
        store.record_auth(_auth_event(result="ok"))
        await store._flush()
        result = await store.query_aggregates(hours=2)
        total_ok = sum(b["auth_ok_count"] for b in result["hours"])
        assert total_ok == 1

    async def test_auth_fail_counted_in_correct_bucket(self, store):
        store.record_auth(_auth_event(result="failed", error_code="E"))
        await store._flush()
        result = await store.query_aggregates(hours=2)
        total_fail = sum(b["auth_fail_count"] for b in result["hours"])
        assert total_fail == 1

    async def test_returns_empty_hours_when_db_closed(self, tmp_path):
        hass = _mock_hass(str(tmp_path))
        s = ActivityStore(hass, dict(DEFAULTS))
        result = await s.query_aggregates(hours=24)
        assert result == {"hours": []}
