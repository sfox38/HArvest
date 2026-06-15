"""Tests for token_manager.py.

Uses a mocked HA Store to avoid real filesystem I/O.
"""
from __future__ import annotations

import hashlib
import hmac
import time
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.harvest.const import (
    ALIAS_LENGTH,
    BASE62_ALPHABET,
    DEFAULTS,
    ERR_ENTITY_NOT_IN_TOKEN,
    ERR_ENTITY_INCOMPATIBLE,
    ERR_IP_DENIED,
    ERR_ORIGIN_DENIED,
    ERR_SIGNATURE_INVALID,
    ERR_TOKEN_EXPIRED,
    ERR_TOKEN_INVALID,
    ERR_TOKEN_REVOKED,
    MAX_ENTITIES_HARD_CAP,
    SESSION_ID_LENGTH,
    SESSION_PREFIX,
    TOKEN_ID_LENGTH,
    TOKEN_PREFIX,
)
from custom_components.harvest.token_manager import (
    ActiveSchedule,
    ActiveScheduleWindow,
    EntityAccess,
    OriginConfig,
    RateLimitConfig,
    SessionConfig,
    Token,
    TokenManager,
    _normalise_page_path,
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_hass():
    hass = MagicMock()
    hass.config.config_dir = "/tmp/test_harvest"
    return hass


@pytest.fixture
async def tm(mock_hass):
    """Return a TokenManager with a mock Store starting with no stored data."""
    with patch("custom_components.harvest.token_manager.Store") as MockStore:
        store_instance = AsyncMock()
        store_instance.async_load.return_value = None
        store_instance.async_save = AsyncMock()
        MockStore.return_value = store_instance
        manager = TokenManager(mock_hass, dict(DEFAULTS))
        await manager.load()
        yield manager


def _make_token_in_manager(tm: TokenManager, **kwargs) -> Token:
    """Synchronously insert a pre-built Token into the manager's in-memory cache."""
    defaults = dict(
        token_id=tm.generate_token_id(),
        token_version=1,
        created_at=datetime.now(tz=timezone.utc),
        created_by="user_1",
        label="Test",
        expires=None,
        token_secret=None,
        origins=OriginConfig(allow_any=True),
        entities=[EntityAccess(entity_id="light.test", capabilities="read-write")],
        rate_limits=RateLimitConfig(),
        session=SessionConfig(),
        max_sessions=None,
        active_schedule=None,
        allowed_ips=[],
        status="active",
        revoked_at=None,
        revoke_reason=None,
    )
    defaults.update(kwargs)
    token = Token(**defaults)
    tm._tokens[token.token_id] = token
    return token


# ---------------------------------------------------------------------------
# ID / alias generation
# ---------------------------------------------------------------------------

class TestIdGeneration:
    def test_generate_token_id_format(self, tm):
        tid = tm.generate_token_id()
        assert tid.startswith(TOKEN_PREFIX)
        assert len(tid) == len(TOKEN_PREFIX) + TOKEN_ID_LENGTH

    def test_generate_token_id_chars_are_base62(self, tm):
        tid = tm.generate_token_id()
        suffix = tid[len(TOKEN_PREFIX):]
        assert all(c in BASE62_ALPHABET for c in suffix)

    def test_generate_token_id_is_unique(self, tm):
        ids = {tm.generate_token_id() for _ in range(100)}
        assert len(ids) == 100

    def test_generate_session_id_format(self, tm):
        sid = tm.generate_session_id()
        assert sid.startswith(SESSION_PREFIX)
        assert len(sid) == len(SESSION_PREFIX) + SESSION_ID_LENGTH

    def test_generate_alias_length(self, tm):
        alias = tm.generate_alias()
        assert len(alias) == ALIAS_LENGTH

    def test_generate_alias_chars_are_base62(self, tm):
        alias = tm.generate_alias()
        assert all(c in BASE62_ALPHABET for c in alias)


# ---------------------------------------------------------------------------
# create
# ---------------------------------------------------------------------------

class TestCreate:
    async def test_create_returns_token_with_active_status(self, tm):
        token = await tm.create(
            label="My Widget",
            created_by="user_1",
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.bedroom", "read-write")],
            expires=None,
            token_secret=None,
            rate_limits=RateLimitConfig(),
            session=SessionConfig(),
            max_sessions=None,
            active_schedule=None,
            allowed_ips=[],
        )
        assert token.status == "active"
        assert token.label == "My Widget"
        assert token.token_id.startswith(TOKEN_PREFIX)
        assert token.expires is None

    async def test_create_adds_to_internal_cache(self, tm):
        token = await tm.create(
            label="Test",
            created_by="user_1",
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.test", "read")],
            expires=None,
            token_secret=None,
            rate_limits=RateLimitConfig(),
            session=SessionConfig(),
            max_sessions=None,
            active_schedule=None,
            allowed_ips=[],
        )
        assert tm.get(token.token_id) is token

    async def test_create_calls_save(self, tm):
        with patch.object(tm, "save", new_callable=AsyncMock) as mock_save:
            await tm.create(
                label="Test",
                created_by="u",
                origins=OriginConfig(allow_any=True),
                entities=[EntityAccess("light.test", "read")],
                expires=None, token_secret=None,
                rate_limits=RateLimitConfig(), session=SessionConfig(),
                max_sessions=None, active_schedule=None, allowed_ips=[],
            )
            mock_save.assert_called_once()

    async def test_create_raises_when_entity_count_exceeds_hard_cap(self, tm):
        hard_cap = MAX_ENTITIES_HARD_CAP
        entities = [
            EntityAccess(f"light.test_{i}", "read") for i in range(hard_cap + 1)
        ]
        with pytest.raises(ValueError, match="hard cap"):
            await tm.create(
                label="Too many",
                created_by="u",
                origins=OriginConfig(allow_any=True),
                entities=entities,
                expires=None, token_secret=None,
                rate_limits=RateLimitConfig(), session=SessionConfig(),
                max_sessions=None, active_schedule=None, allowed_ips=[],
            )

    async def test_create_raises_for_invalid_allow_path_no_leading_slash(self, tm):
        with pytest.raises(ValueError, match="must start with /"):
            await tm.create(
                label="Bad path",
                created_by="u",
                origins=OriginConfig(allowed=["https://example.com"], allow_paths=["no-slash"]),
                entities=[EntityAccess("light.test", "read")],
                expires=None, token_secret=None,
                rate_limits=RateLimitConfig(), session=SessionConfig(),
                max_sessions=None, active_schedule=None, allowed_ips=[],
            )

    async def test_create_raises_for_allow_path_with_dotdot(self, tm):
        with pytest.raises(ValueError, match="must not contain"):
            await tm.create(
                label="Bad path",
                created_by="u",
                origins=OriginConfig(allowed=["https://example.com"], allow_paths=["/../etc"]),
                entities=[EntityAccess("light.test", "read")],
                expires=None, token_secret=None,
                rate_limits=RateLimitConfig(), session=SessionConfig(),
                max_sessions=None, active_schedule=None, allowed_ips=[],
            )

    async def test_create_raises_for_allow_path_with_query_string(self, tm):
        with pytest.raises(ValueError, match="query string"):
            await tm.create(
                label="Bad path",
                created_by="u",
                origins=OriginConfig(allowed=["https://example.com"], allow_paths=["/embed?foo=bar"]),
                entities=[EntityAccess("light.test", "read")],
                expires=None, token_secret=None,
                rate_limits=RateLimitConfig(), session=SessionConfig(),
                max_sessions=None, active_schedule=None, allowed_ips=[],
            )

    async def test_create_accepts_valid_allow_paths(self, tm):
        token = await tm.create(
            label="Good paths",
            created_by="u",
            origins=OriginConfig(
                allowed=["https://example.com"],
                allow_paths=["/embed/lights", "/dashboard"],
            ),
            entities=[EntityAccess("light.test", "read")],
            expires=None, token_secret=None,
            rate_limits=RateLimitConfig(), session=SessionConfig(),
            max_sessions=None, active_schedule=None, allowed_ips=[],
        )
        assert token.status == "active"


# ---------------------------------------------------------------------------
# get / get_all / get_active
# ---------------------------------------------------------------------------

class TestGet:
    def test_get_returns_none_for_unknown_id(self, tm):
        assert tm.get("hwt_notarealtokeniiiiiiiiii") is None

    def test_get_returns_token_by_id(self, tm):
        token = _make_token_in_manager(tm)
        assert tm.get(token.token_id) is token

    def test_get_all_excludes_preview_tokens(self, tm):
        _make_token_in_manager(tm)
        preview = Token(
            token_id=tm.generate_token_id(),
            token_version=1,
            created_at=datetime.now(tz=timezone.utc),
            created_by="u",
            label="[preview]",
            expires=datetime.now(tz=timezone.utc) + timedelta(minutes=5),
            token_secret=None,
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.test", "read")],
            rate_limits=RateLimitConfig(),
            session=SessionConfig(),
            max_sessions=1,
            active_schedule=None,
            allowed_ips=[],
            status="preview",
            revoked_at=None,
            revoke_reason=None,
        )
        tm._preview_tokens[preview.token_id] = preview

        all_tokens = tm.get_all()
        assert all(t.status != "preview" for t in all_tokens)

    def test_get_active_excludes_revoked(self, tm):
        active = _make_token_in_manager(tm, status="active")
        revoked = _make_token_in_manager(tm, status="revoked")

        active_list = tm.get_active()
        ids = [t.token_id for t in active_list]
        assert active.token_id in ids
        assert revoked.token_id not in ids

    def test_get_active_excludes_expired_by_datetime(self, tm):
        past = datetime.now(tz=timezone.utc) - timedelta(hours=1)
        expired = _make_token_in_manager(tm, status="active", expires=past)
        active = _make_token_in_manager(tm)

        active_list = tm.get_active()
        ids = [t.token_id for t in active_list]
        assert active.token_id in ids
        assert expired.token_id not in ids


# ---------------------------------------------------------------------------
# revoke
# ---------------------------------------------------------------------------

class TestRevoke:
    async def test_revoke_sets_status_and_revoked_at(self, tm):
        token = _make_token_in_manager(tm)
        before = datetime.now(tz=timezone.utc)
        await tm.revoke(token.token_id, reason="test revoke")
        after = datetime.now(tz=timezone.utc)

        assert token.status == "revoked"
        assert token.revoke_reason == "test revoke"
        assert before <= token.revoked_at <= after

    async def test_revoke_raises_for_unknown_id(self, tm):
        with pytest.raises(KeyError):
            await tm.revoke("hwt_doesnotexistaaaaaaaaa")

    async def test_revoke_preview_token_removes_it(self, tm):
        preview_id = tm.generate_token_id()
        preview = Token(
            token_id=preview_id, token_version=1,
            created_at=datetime.now(tz=timezone.utc),
            created_by="u", label="[preview]",
            expires=datetime.now(tz=timezone.utc) + timedelta(minutes=5),
            token_secret=None, origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.test", "read")],
            rate_limits=RateLimitConfig(), session=SessionConfig(),
            max_sessions=1, active_schedule=None, allowed_ips=[],
            status="preview", revoked_at=None, revoke_reason=None,
        )
        tm._preview_tokens[preview_id] = preview

        await tm.revoke(preview_id)
        assert tm.get(preview_id) is None
        assert preview_id not in tm._preview_tokens


# ---------------------------------------------------------------------------
# delete
# ---------------------------------------------------------------------------

class TestDelete:
    async def test_delete_removes_revoked_token(self, tm):
        token = _make_token_in_manager(tm, status="revoked")
        await tm.delete(token.token_id)
        assert tm.get(token.token_id) is None

    async def test_delete_removes_expired_token(self, tm):
        token = _make_token_in_manager(tm, status="expired")
        await tm.delete(token.token_id)
        assert tm.get(token.token_id) is None

    async def test_delete_raises_for_active_token(self, tm):
        token = _make_token_in_manager(tm, status="active")
        with pytest.raises(ValueError, match="Revoke it first"):
            await tm.delete(token.token_id)

    async def test_delete_raises_for_unknown_id(self, tm):
        with pytest.raises(KeyError):
            await tm.delete("hwt_doesnotexistaaaaaaaaa")


# ---------------------------------------------------------------------------
# update
# ---------------------------------------------------------------------------

class TestUpdate:
    async def test_update_applies_field_changes(self, tm):
        token = _make_token_in_manager(tm)
        updated = await tm.update(token.token_id, {"label": "New Label"})
        assert updated.label == "New Label"

    async def test_update_increments_token_version(self, tm):
        token = _make_token_in_manager(tm)
        original_version = token.token_version
        await tm.update(token.token_id, {"label": "v2"})
        assert token.token_version == original_version + 1

    async def test_update_raises_for_unknown_id(self, tm):
        with pytest.raises(KeyError):
            await tm.update("hwt_doesnotexistaaaaaaaaa", {"label": "x"})


# ---------------------------------------------------------------------------
# validate_auth
# ---------------------------------------------------------------------------

class TestValidateAuth:
    def _valid_auth_args(self, token: Token) -> dict:
        return dict(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None,
            nonce=None,
            signature=None,
        )

    def test_valid_auth_returns_no_error(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allowed=["https://example.com"]),
        )
        _, err = tm.validate_auth(**self._valid_auth_args(token))
        assert err is None

    def test_unknown_token_returns_token_invalid(self, tm):
        _, err = tm.validate_auth(
            token_id="hwt_doesnotexistaaaaaaaaa",
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_TOKEN_INVALID

    def test_revoked_token_returns_token_revoked(self, tm):
        token = _make_token_in_manager(
            tm,
            status="revoked",
            origins=OriginConfig(allowed=["https://example.com"]),
        )
        _, err = tm.validate_auth(**self._valid_auth_args(token))
        assert err == ERR_TOKEN_REVOKED

    def test_expired_status_returns_token_expired(self, tm):
        token = _make_token_in_manager(
            tm,
            status="expired",
            origins=OriginConfig(allowed=["https://example.com"]),
        )
        _, err = tm.validate_auth(**self._valid_auth_args(token))
        assert err == ERR_TOKEN_EXPIRED

    def test_past_expires_datetime_returns_token_expired(self, tm):
        past = datetime.now(tz=timezone.utc) - timedelta(hours=1)
        token = _make_token_in_manager(
            tm,
            status="active",
            expires=past,
            origins=OriginConfig(allowed=["https://example.com"]),
        )
        _, err = tm.validate_auth(**self._valid_auth_args(token))
        assert err == ERR_TOKEN_EXPIRED

    def test_disallowed_origin_returns_origin_denied(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=False, allowed=["https://allowed.com"]),
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://notallowed.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_ORIGIN_DENIED

    def test_allow_any_origin_accepts_any_origin(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://anywhere.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None

    def test_unknown_entity_ref_returns_entity_not_in_token(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.bedroom", "read-write")],
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["light.living_room"],  # not in token
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_ENTITY_NOT_IN_TOKEN

    def test_alias_resolves_correctly(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("light.bedroom", "read-write", alias="abcd1234")],
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["abcd1234"],  # alias, not real entity_id
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None

    def test_tier3_entity_returns_entity_incompatible(self, tm):
        # alarm_control_panel is Tier 3 - should fail even if it somehow got into a token
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            entities=[EntityAccess("alarm_control_panel.home", "read")],
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["alarm_control_panel.home"],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_ENTITY_INCOMPATIBLE

    def test_ip_denied_when_source_ip_not_in_allowlist(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            allowed_ips=["192.168.1.0/24"],
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="10.0.0.1",  # outside allowed CIDR
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_IP_DENIED

    def test_ip_allowed_when_in_cidr_range(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            allowed_ips=["192.168.1.0/24"],
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="192.168.1.50",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None

    def test_hmac_required_when_token_secret_set(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            token_secret="my_secret",
        )
        # No signature provided
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_SIGNATURE_INVALID

    def test_valid_hmac_signature_passes(self, tm):
        secret = "test_hmac_secret"
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            token_secret=secret,
        )
        ts = int(time.time())
        nonce = "abc123"
        message = f"{token.token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=ts,
            nonce=nonce,
            signature=sig,
        )
        assert err is None

    def test_bad_hmac_signature_returns_signature_invalid(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            token_secret="my_secret",
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=int(time.time()),
            nonce="abc",
            signature="wrong_signature",
        )
        assert err == ERR_SIGNATURE_INVALID

    def test_bad_hmac_runs_before_entity_resolution(self, tm):
        """HMAC tokens must verify the signature before checking entity refs.

        Otherwise an attacker with the token ID (no secret) could probe
        entity scope: a guess that matches a configured entity returns
        HRV_SIGNATURE_INVALID, while a non-matching one returns
        HRV_ENTITY_NOT_IN_TOKEN, leaking which entities are configured.
        Both refs (configured and non-configured) must return the same
        error: HRV_SIGNATURE_INVALID.
        """
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            token_secret="my_secret",
        )
        configured_ref = token.entities[0].entity_id
        unknown_ref = "light.does_not_exist"
        ts = int(time.time())
        # Configured ref + bad signature → SIGNATURE_INVALID (not None).
        _, err_with_known = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[configured_ref],
            timestamp=ts, nonce="n", signature="bad",
        )
        # Unknown ref + bad signature → also SIGNATURE_INVALID, NOT
        # ENTITY_NOT_IN_TOKEN. Same error means same code path means no
        # oracle.
        _, err_with_unknown = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[unknown_ref],
            timestamp=ts, nonce="n", signature="bad",
        )
        assert err_with_known == ERR_SIGNATURE_INVALID
        assert err_with_unknown == ERR_SIGNATURE_INVALID

    def test_page_path_check_when_allow_paths_set(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(
                allowed=["https://example.com"],
                allow_paths=["/embed/lights"],
            ),
        )
        # Correct path
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path="/embed/lights",
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None

        # Wrong path
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path="/other-page",
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err == ERR_ORIGIN_DENIED

    def test_missing_page_path_skips_path_check(self, tm):
        token = _make_token_in_manager(
            tm,
            origins=OriginConfig(
                allowed=["https://example.com"],
                allow_paths=["/embed/lights"],
            ),
        )
        # No page_path - path check is skipped, auth proceeds
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=[token.entities[0].entity_id],
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None

    def test_dropped_refs_records_unresolved(self, tm):
        token = _make_token_in_manager(
            tm,
            entities=[EntityAccess(entity_id="light.bedroom", capabilities="read-write")],
            origins=OriginConfig(allow_any=True),
        )
        dropped: list[tuple[str, str]] = []
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["light.bedroom", "light.never_existed"],
            timestamp=None, nonce=None, signature=None,
            dropped_refs=dropped,
        )
        assert err is None
        assert dropped == [("light.never_existed", "unresolved")]

    def test_dropped_refs_records_tier3(self, tm):
        # Token's entity list includes both a Tier 1 and a Tier 3 entity.
        # During auth, the Tier 3 ref is silently dropped.
        # (lock is now Tier 1; alarm_control_panel is Tier 3)
        token = _make_token_in_manager(
            tm,
            entities=[
                EntityAccess(entity_id="light.bedroom", capabilities="read-write"),
                EntityAccess(entity_id="alarm_control_panel.home", capabilities="read-write"),
            ],
            origins=OriginConfig(allow_any=True),
        )
        dropped: list[tuple[str, str]] = []
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["light.bedroom", "alarm_control_panel.home"],
            timestamp=None, nonce=None, signature=None,
            dropped_refs=dropped,
        )
        assert err is None
        assert dropped == [("alarm_control_panel.home", "tier3_blocked")]

    def test_dropped_refs_empty_when_all_valid(self, tm):
        token = _make_token_in_manager(
            tm,
            entities=[EntityAccess(entity_id="light.bedroom", capabilities="read-write")],
            origins=OriginConfig(allow_any=True),
        )
        dropped: list[tuple[str, str]] = []
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["light.bedroom"],
            timestamp=None, nonce=None, signature=None,
            dropped_refs=dropped,
        )
        assert err is None
        assert dropped == []

    def test_dropped_refs_optional_when_omitted(self, tm):
        # Existing callers that pass no dropped_refs argument still work.
        token = _make_token_in_manager(
            tm,
            entities=[EntityAccess(entity_id="light.bedroom", capabilities="read-write")],
            origins=OriginConfig(allow_any=True),
        )
        _, err = tm.validate_auth(
            token_id=token.token_id,
            origin="https://example.com",
            page_path=None,
            source_ip="1.2.3.4",
            entity_refs=["light.bedroom", "light.never_existed"],
            timestamp=None, nonce=None, signature=None,
        )
        assert err is None  # auth still succeeds, drop info just isn't surfaced


# ---------------------------------------------------------------------------
# verify_hmac
# ---------------------------------------------------------------------------

class TestVerifyHmac:
    def test_valid_signature_returns_true(self, tm):
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time())
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is True

    def test_stale_timestamp_returns_false(self, tm):
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time()) - 120  # 2 minutes ago - outside 60s window
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is False

    def test_future_timestamp_beyond_window_returns_false(self, tm):
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time()) + 120  # 2 minutes in the future
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is False

    def test_modest_future_timestamp_beyond_skew_returns_false(self, tm):
        # 30s in the future is within the old abs() window but outside the
        # new directional window (5s future cap).
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time()) + 30
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is False

    def test_small_clock_skew_future_accepted(self, tm):
        # 3s in the future is within the 5s clock-skew tolerance.
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time()) + 3
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is True

    def test_recent_past_timestamp_accepted(self, tm):
        # 55s ago is within the 60s past-window.
        secret = "super_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time()) - 55
        nonce = "nonce_xyz"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(secret, token_id, ts, nonce, sig) is True

    def test_wrong_signature_returns_false(self, tm):
        assert tm.verify_hmac(
            "secret", "hwt_x", int(time.time()), "nonce", "badsig"
        ) is False

    def test_wrong_secret_returns_false(self, tm):
        secret = "correct_secret"
        wrong_secret = "wrong_secret"
        token_id = "hwt_a3F9bC2d114eF5A6b7c8dE"
        ts = int(time.time())
        nonce = "nonce"
        message = f"{token_id}:{ts}:{nonce}".encode()
        sig = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

        assert tm.verify_hmac(wrong_secret, token_id, ts, nonce, sig) is False


# ---------------------------------------------------------------------------
# filter_attributes
# ---------------------------------------------------------------------------

class TestFilterAttributes:
    def _token_with_entity(self, tm, exclude_attributes=None):
        return _make_token_in_manager(
            tm,
            origins=OriginConfig(allow_any=True),
            entities=[
                EntityAccess(
                    entity_id="light.test",
                    capabilities="read-write",
                    exclude_attributes=exclude_attributes or [],
                )
            ],
        )

    def test_denylist_keys_are_removed(self, tm):
        token = self._token_with_entity(tm)
        attrs = {
            "brightness": 255,
            "access_token": "secret_value",
            "color_temp": 4000,
            "api_key": "key123",
        }
        filtered = tm.filter_attributes("light.test", token, attrs)
        assert "brightness" in filtered
        assert "color_temp" in filtered
        assert "access_token" not in filtered
        assert "api_key" not in filtered

    def test_denylist_is_substring_match(self, tm):
        token = self._token_with_entity(tm)
        attrs = {
            "oauth_access_token": "should_be_removed",
            "my_secret_key": "also_removed",
            "brightness": 100,
        }
        filtered = tm.filter_attributes("light.test", token, attrs)
        assert "brightness" in filtered
        assert "oauth_access_token" not in filtered
        assert "my_secret_key" not in filtered

    def test_exclude_attributes_removes_exact_keys(self, tm):
        token = self._token_with_entity(tm, exclude_attributes=["color_mode", "effect"])
        attrs = {
            "brightness": 200,
            "color_mode": "hs",
            "effect": "rainbow",
        }
        filtered = tm.filter_attributes("light.test", token, attrs)
        assert "brightness" in filtered
        assert "color_mode" not in filtered
        assert "effect" not in filtered

    def test_unknown_entity_id_applies_only_denylist(self, tm):
        token = self._token_with_entity(tm, exclude_attributes=["color_mode"])
        attrs = {"brightness": 100, "color_mode": "hs", "access_token": "secret"}
        # Using an entity_id not in the token - exclude_attributes should not apply
        filtered = tm.filter_attributes("light.other", token, attrs)
        assert "brightness" in filtered
        assert "color_mode" in filtered  # not excluded (entity not found)
        assert "access_token" not in filtered  # still denylist-filtered


# ---------------------------------------------------------------------------
# is_schedule_active
# ---------------------------------------------------------------------------

class TestIsScheduleActive:
    def test_no_schedule_always_returns_true(self, tm):
        token = _make_token_in_manager(tm, active_schedule=None)
        assert tm.is_schedule_active(token) is True

    def test_unknown_timezone_returns_false(self, tm):
        schedule = ActiveSchedule(
            timezone="Not/AReal_Timezone",
            windows=[ActiveScheduleWindow(days=["mon", "tue", "wed", "thu", "fri", "sat", "sun"], start="00:00", end="23:59")],
        )
        token = _make_token_in_manager(tm, active_schedule=schedule)
        assert tm.is_schedule_active(token) is False


# ---------------------------------------------------------------------------
# preview tokens
# ---------------------------------------------------------------------------

class TestPreviewTokens:
    async def test_create_preview_returns_preview_status(self, tm):
        preview = await tm.create_preview("light.test", "read-write", "user_1")
        assert preview.status == "preview"
        assert preview.label == "[preview]"

    async def test_create_preview_not_in_get_all(self, tm):
        preview = await tm.create_preview("light.test", "read", "user_1")
        all_tokens = tm.get_all()
        assert preview.token_id not in [t.token_id for t in all_tokens]

    async def test_create_preview_accessible_via_get(self, tm):
        preview = await tm.create_preview("light.test", "read", "user_1")
        assert tm.get(preview.token_id) is preview

    async def test_cleanup_expired_previews_removes_expired(self, tm):
        preview = await tm.create_preview("light.test", "read", "user_1")
        # Backdate expiry
        preview.expires = datetime.now(tz=timezone.utc) - timedelta(seconds=1)

        await tm.cleanup_expired_previews()
        assert tm.get(preview.token_id) is None

    async def test_cleanup_leaves_fresh_previews(self, tm):
        preview = await tm.create_preview("light.test", "read", "user_1")
        await tm.cleanup_expired_previews()
        assert tm.get(preview.token_id) is preview


# ---------------------------------------------------------------------------
# load / save (serialisation round-trip)
# ---------------------------------------------------------------------------

class TestLoadSave:
    async def test_round_trip_preserves_token_fields(self, mock_hass):
        """Create a token, save, reload into a fresh manager, verify fields survive."""
        saved_data: dict = {}

        with patch("custom_components.harvest.token_manager.Store") as MockStore:
            store_instance = AsyncMock()
            store_instance.async_load.return_value = None

            async def fake_save(data):
                saved_data.update(data)

            store_instance.async_save = fake_save
            MockStore.return_value = store_instance

            tm1 = TokenManager(mock_hass, dict(DEFAULTS))
            await tm1.load()

            expires = datetime.now(tz=timezone.utc) + timedelta(days=30)
            token = await tm1.create(
                label="Round Trip Test",
                created_by="user_42",
                origins=OriginConfig(
                    allow_any=False,
                    allowed=["https://example.com"],
                    allow_paths=["/embed"],
                ),
                entities=[
                    EntityAccess("light.bedroom", "read-write", alias="ab12cd34", exclude_attributes=["effect"])
                ],
                expires=expires,
                token_secret="my_secret",
                rate_limits=RateLimitConfig(max_commands_per_minute=10),
                session=SessionConfig(lifetime_minutes=30),
                max_sessions=5,
                active_schedule=None,
                allowed_ips=["192.168.1.0/24"],
            )

        # Now load into a fresh manager using the saved data
        with patch("custom_components.harvest.token_manager.Store") as MockStore2:
            store_instance2 = AsyncMock()
            store_instance2.async_load.return_value = saved_data
            store_instance2.async_save = AsyncMock()
            MockStore2.return_value = store_instance2

            tm2 = TokenManager(mock_hass, dict(DEFAULTS))
            await tm2.load()

        reloaded = tm2.get(token.token_id)
        assert reloaded is not None
        assert reloaded.label == "Round Trip Test"
        assert reloaded.created_by == "user_42"
        assert reloaded.token_secret == "my_secret"
        assert reloaded.origins.allowed == ["https://example.com"]
        assert reloaded.origins.allow_paths == ["/embed"]
        assert reloaded.entities[0].entity_id == "light.bedroom"
        assert reloaded.entities[0].alias == "ab12cd34"
        assert reloaded.entities[0].exclude_attributes == ["effect"]
        assert reloaded.rate_limits.max_commands_per_minute == 10
        assert reloaded.session.lifetime_minutes == 30
        assert reloaded.max_sessions == 5
        assert reloaded.allowed_ips == ["192.168.1.0/24"]
        # expires should survive as an aware datetime
        assert reloaded.expires is not None
        assert reloaded.expires.tzinfo is not None

    async def test_load_marks_expired_token_as_expired(self, mock_hass):
        past = datetime.now(tz=timezone.utc) - timedelta(hours=1)

        stored_token = {
            "token_id": "hwt_expiredtokenaaaaaaaaaaa",
            "token_version": 1,
            "created_at": (past - timedelta(days=1)).isoformat(),
            "created_by": "u",
            "label": "expired",
            "expires": past.isoformat(),
            "token_secret": None,
            "origins": {"allow_any": True, "allowed": [], "allow_paths": []},
            "entities": [],
            "rate_limits": {"max_push_per_second": 1, "max_commands_per_minute": 30, "override_defaults": False},
            "session": {"lifetime_minutes": 60, "max_lifetime_minutes": 1440, "max_renewals": None, "absolute_lifetime_hours": None},
            "max_sessions": None,
            "active_schedule": None,
            "allowed_ips": [],
            "status": "active",  # stored as active, but expires in the past
            "revoked_at": None,
            "revoke_reason": None,
        }

        with patch("custom_components.harvest.token_manager.Store") as MockStore:
            store_instance = AsyncMock()
            store_instance.async_load.return_value = {"tokens": [stored_token]}
            store_instance.async_save = AsyncMock()
            MockStore.return_value = store_instance

            tm = TokenManager(mock_hass, dict(DEFAULTS))
            await tm.load()

        token = tm.get("hwt_expiredtokenaaaaaaaaaaa")
        assert token is not None
        assert token.status == "expired"


# ---------------------------------------------------------------------------
# _normalise_page_path
# ---------------------------------------------------------------------------

class TestNormalisePagePath:
    def test_strips_query_string(self):
        assert _normalise_page_path("/embed?foo=bar") == "/embed"

    def test_strips_fragment(self):
        assert _normalise_page_path("/embed#section") == "/embed"

    def test_root_path(self):
        assert _normalise_page_path("/") == "/"

    def test_deep_path(self):
        assert _normalise_page_path("/a/b/c") == "/a/b/c"

    def test_empty_string_returns_root(self):
        assert _normalise_page_path("") == "/"

    def test_strips_trailing_slash(self):
        # /embed/lights/ should match allow_paths: ["/embed/lights"]
        assert _normalise_page_path("/embed/lights/") == "/embed/lights"

    def test_preserves_root_slash(self):
        # The root "/" must not be stripped to an empty string.
        assert _normalise_page_path("/") == "/"

    def test_strips_trailing_slash_with_query(self):
        # Trailing slash on the path portion is stripped after parsing.
        assert _normalise_page_path("/embed/lights/?ref=x") == "/embed/lights"
