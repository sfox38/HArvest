"""Tests for session_manager.py.

No HA dependencies - SessionManager is pure Python with no async I/O.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest

from custom_components.harvest.const import DEFAULTS, SESSION_PREFIX
from custom_components.harvest.session_manager import Session, SessionManager
from custom_components.harvest.token_manager import (
    EntityAccess,
    OriginConfig,
    RateLimitConfig,
    SessionConfig,
    Token,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_token(
    token_id: str = "hwt_testToken0000000001",
    max_sessions: int | None = None,
    lifetime_minutes: int = 60,
    max_lifetime_minutes: int = 1440,
    absolute_lifetime_hours: int | None = None,
    entities: list[EntityAccess] | None = None,
) -> Token:
    return Token(
        token_id=token_id,
        token_version=1,
        created_at=datetime.now(tz=timezone.utc),
        created_by="user_123",
        label="Test Token",
        expires=None,
        token_secret=None,
        origins=OriginConfig(allow_any=True),
        entities=entities or [EntityAccess(entity_id="light.test", capabilities="read-write")],
        rate_limits=RateLimitConfig(),
        session=SessionConfig(
            lifetime_minutes=lifetime_minutes,
            max_lifetime_minutes=max_lifetime_minutes,
            absolute_lifetime_hours=absolute_lifetime_hours,
        ),
        max_sessions=max_sessions,
        active_schedule=None,
        allowed_ips=[],
        status="active",
        revoked_at=None,
        revoke_reason=None,
    )


def _make_manager(config: dict | None = None) -> SessionManager:
    return SessionManager(config or dict(DEFAULTS))


def _mock_ws() -> MagicMock:
    return MagicMock()


# ---------------------------------------------------------------------------
# create
# ---------------------------------------------------------------------------

class TestCreate:
    def test_creates_session_with_correct_fields(self):
        sm = _make_manager()
        token = _make_token()
        ws = _mock_ws()
        session = sm.create(
            session_id="hrs_testSession000000001",
            token=token,
            origin="https://example.com",
            referer=None,
            source_ip=None,
            ws=ws,
            entity_ids=["light.test"],
        )

        assert session.session_id == "hrs_testSession000000001"
        assert session.token_id == token.token_id
        assert session.token_version == 1
        assert session.renewal_count == 0
        assert session.origin_validated == "https://example.com"
        assert session.referer_validated is None
        assert "light.test" in session.subscribed_entity_ids
        assert session.ws is ws

    def test_expires_at_set_from_token_lifetime(self):
        sm = _make_manager()
        token = _make_token(lifetime_minutes=30)
        before = datetime.now(tz=timezone.utc)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        after = datetime.now(tz=timezone.utc)

        expected_min = before + timedelta(minutes=30)
        expected_max = after + timedelta(minutes=30)
        assert expected_min <= session.expires_at <= expected_max

    def test_absolute_expires_uses_global_default_when_token_has_none(self):
        sm = _make_manager()
        token = _make_token(absolute_lifetime_hours=None)
        before = datetime.now(tz=timezone.utc)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        after = datetime.now(tz=timezone.utc)

        global_hours = DEFAULTS["absolute_session_lifetime_hours"]
        expected_min = before + timedelta(hours=global_hours)
        expected_max = after + timedelta(hours=global_hours)
        assert expected_min <= session.absolute_expires_at <= expected_max

    def test_absolute_expires_uses_token_override_when_set(self):
        sm = _make_manager()
        token = _make_token(absolute_lifetime_hours=2)
        before = datetime.now(tz=timezone.utc)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        after = datetime.now(tz=timezone.utc)

        assert before + timedelta(hours=2) <= session.absolute_expires_at
        assert session.absolute_expires_at <= after + timedelta(hours=2)

    def test_raises_when_session_limit_reached(self):
        sm = _make_manager()
        token = _make_token(max_sessions=1)

        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])

        with pytest.raises(ValueError, match="Session limit reached"):
            sm.create("hrs_s2", token, "https://a.com", None, None, _mock_ws(), [])

    def test_multiple_sessions_different_tokens_allowed(self):
        sm = _make_manager()
        t1 = _make_token("hwt_tokenAAAAAAAAAAAAAAAA", max_sessions=1)
        t2 = _make_token("hwt_tokenBBBBBBBBBBBBBBBB", max_sessions=1)

        sm.create("hrs_s1", t1, "https://a.com", None, None, _mock_ws(), [])
        sm.create("hrs_s2", t2, "https://a.com", None, None, _mock_ws(), [])

        assert sm.count_active() == 2

    def test_session_appears_in_token_index(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])

        sessions = sm.get_all_for_token(token.token_id)
        assert len(sessions) == 1
        assert sessions[0].session_id == "hrs_s1"


# ---------------------------------------------------------------------------
# get / get_all
# ---------------------------------------------------------------------------

class TestGet:
    def test_returns_session_by_id(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        assert sm.get("hrs_s1") is not None

    def test_returns_none_for_unknown_id(self):
        sm = _make_manager()
        assert sm.get("hrs_nonexistent") is None

    def test_returns_none_for_expired_session(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        # Force expiry by backdating expires_at
        session.expires_at = datetime.now(tz=timezone.utc) - timedelta(seconds=1)
        assert sm.get("hrs_s1") is None

    def test_get_all_excludes_expired(self):
        sm = _make_manager()
        token = _make_token()
        s1 = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        s2 = sm.create("hrs_s2", token, "https://a.com", None, None, _mock_ws(), [])
        s1.expires_at = datetime.now(tz=timezone.utc) - timedelta(seconds=1)

        active = sm.get_all()
        assert len(active) == 1
        assert active[0].session_id == "hrs_s2"


# ---------------------------------------------------------------------------
# renew
# ---------------------------------------------------------------------------

class TestRenew:
    def test_renew_generates_new_session_id(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        old_id = session.session_id

        renewed = sm.renew(session)
        assert renewed.session_id != old_id
        assert renewed.session_id.startswith(SESSION_PREFIX)

    def test_renew_increments_renewal_count(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        assert session.renewal_count == 0

        sm.renew(session)
        assert session.renewal_count == 1

    def test_renew_extends_expiry(self):
        sm = _make_manager()
        token = _make_token(lifetime_minutes=60)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        old_expires = session.expires_at

        sm.renew(session)
        assert session.expires_at > old_expires

    def test_renew_caps_at_absolute_lifetime(self):
        sm = _make_manager()
        # Short absolute lifetime (2 minutes) with long renewal window (60 minutes)
        token = _make_token(lifetime_minutes=60, absolute_lifetime_hours=None)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        # Manually set absolute_expires_at to 1 minute in the future
        session.absolute_expires_at = datetime.now(tz=timezone.utc) + timedelta(minutes=1)

        sm.renew(session)
        assert session.expires_at <= session.absolute_expires_at

    def test_renew_raises_when_absolute_lifetime_passed(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        # Backdating absolute_expires_at past now
        session.absolute_expires_at = datetime.now(tz=timezone.utc) - timedelta(seconds=1)

        with pytest.raises(ValueError, match="absolute lifetime"):
            sm.renew(session)

    def test_renew_caps_at_max_lifetime_minutes(self):
        sm = _make_manager()
        # Renewal window 60 minutes, but per-session max lifetime only 2 minutes
        token = _make_token(lifetime_minutes=60, max_lifetime_minutes=2)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])

        sm.renew(session)
        max_expiry = session.issued_at + timedelta(minutes=session.max_lifetime_minutes)
        assert session.expires_at <= max_expiry

    def test_renew_raises_when_max_lifetime_passed(self):
        sm = _make_manager()
        token = _make_token(max_lifetime_minutes=60)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        # Backdating issued_at so issued_at + max_lifetime is now in the past
        session.issued_at = datetime.now(tz=timezone.utc) - timedelta(minutes=61)

        with pytest.raises(ValueError, match="max_lifetime_minutes"):
            sm.renew(session)

    def test_create_snapshots_max_lifetime_minutes(self):
        sm = _make_manager()
        token = _make_token(max_lifetime_minutes=120)
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        assert session.max_lifetime_minutes == 120

    def test_renewed_session_reachable_by_new_id(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.renew(session)
        new_id = session.session_id

        assert sm.get(new_id) is not None
        assert sm.get("hrs_s1") is None

    def test_renewed_session_in_token_index_under_new_id(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.renew(session)

        sessions = sm.get_all_for_token(token.token_id)
        assert len(sessions) == 1
        assert sessions[0].session_id == session.session_id


# ---------------------------------------------------------------------------
# terminate
# ---------------------------------------------------------------------------

class TestTerminate:
    def test_terminate_removes_session(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.terminate("hrs_s1")

        assert sm.get("hrs_s1") is None
        assert sm.count_active() == 0

    def test_terminate_unknown_id_is_noop(self):
        sm = _make_manager()
        sm.terminate("hrs_nonexistent")  # should not raise

    def test_terminate_removes_from_token_index(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.terminate("hrs_s1")

        assert sm.get_all_for_token(token.token_id) == []

    def test_terminate_cleans_up_empty_token_set(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.terminate("hrs_s1")

        # The token_id set should be removed entirely when the last session goes
        assert token.token_id not in sm._token_sessions

    def test_terminate_all_for_token_returns_ws_objects(self):
        sm = _make_manager()
        token = _make_token()
        ws1 = _mock_ws()
        ws2 = _mock_ws()
        sm.create("hrs_s1", token, "https://a.com", None, None, ws1, [])
        sm.create("hrs_s2", token, "https://a.com", None, None, ws2, [])

        ws_list = sm.terminate_all_for_token(token.token_id)
        assert set(ws_list) == {ws1, ws2}
        assert sm.count_active() == 0


# ---------------------------------------------------------------------------
# Subscriptions
# ---------------------------------------------------------------------------

class TestSubscriptions:
    def test_add_subscription_updates_set(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.add_subscription("hrs_s1", ["light.living_room", "switch.fan"])

        assert "light.living_room" in session.subscribed_entity_ids
        assert "switch.fan" in session.subscribed_entity_ids

    def test_remove_subscription_updates_set(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), ["light.test"])
        sm.remove_subscription("hrs_s1", ["light.test"])

        assert "light.test" not in session.subscribed_entity_ids

    def test_get_sessions_for_entity_returns_subscribed(self):
        sm = _make_manager()
        token = _make_token()
        sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), ["light.kitchen"])
        sm.create("hrs_s2", token, "https://a.com", None, None, _mock_ws(), ["switch.fan"])

        kitchen_sessions = sm.get_sessions_for_entity("light.kitchen")
        assert len(kitchen_sessions) == 1
        assert kitchen_sessions[0].session_id == "hrs_s1"

    def test_get_sessions_for_entity_excludes_expired(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), ["light.test"])
        session.expires_at = datetime.now(tz=timezone.utc) - timedelta(seconds=1)

        assert sm.get_sessions_for_entity("light.test") == []


# ---------------------------------------------------------------------------
# count_active / count_for_token
# ---------------------------------------------------------------------------

class TestCounts:
    def test_count_active_empty(self):
        sm = _make_manager()
        assert sm.count_active() == 0

    def test_count_active_includes_only_non_expired(self):
        sm = _make_manager()
        token = _make_token()
        s = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        sm.create("hrs_s2", token, "https://a.com", None, None, _mock_ws(), [])
        s.expires_at = datetime.now(tz=timezone.utc) - timedelta(seconds=1)

        assert sm.count_active() == 1

    def test_count_for_token(self):
        sm = _make_manager()
        t1 = _make_token("hwt_tokenAAAAAAAAAAAAAAAA")
        t2 = _make_token("hwt_tokenBBBBBBBBBBBBBBBB")
        sm.create("hrs_s1", t1, "https://a.com", None, None, _mock_ws(), [])
        sm.create("hrs_s2", t1, "https://a.com", None, None, _mock_ws(), [])
        sm.create("hrs_s3", t2, "https://a.com", None, None, _mock_ws(), [])

        assert sm.count_for_token(t1.token_id) == 2
        assert sm.count_for_token(t2.token_id) == 1


# ---------------------------------------------------------------------------
# touch
# ---------------------------------------------------------------------------

class TestTouch:
    def test_touch_updates_last_message_at(self):
        sm = _make_manager()
        token = _make_token()
        session = sm.create("hrs_s1", token, "https://a.com", None, None, _mock_ws(), [])
        old_ts = session.last_message_at

        sm.touch("hrs_s1")
        # last_message_at may or may not advance in the same tick, but should not regress
        assert session.last_message_at >= old_ts

    def test_touch_unknown_session_is_noop(self):
        sm = _make_manager()
        sm.touch("hrs_nonexistent")  # should not raise
