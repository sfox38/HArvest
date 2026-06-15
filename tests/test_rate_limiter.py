"""Tests for rate_limiter.py.

TokenBucket and RateLimiter are pure Python with no HA dependencies.
time.monotonic is patched to control the clock without real sleeps.
"""
from __future__ import annotations

import time
from unittest.mock import patch

import pytest

from custom_components.harvest.rate_limiter import RateLimiter, TokenBucket
from custom_components.harvest.const import DEFAULTS


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _config(**overrides) -> dict:
    """Return a config dict based on DEFAULTS with optional overrides."""
    cfg = dict(DEFAULTS)
    cfg.update(overrides)
    return cfg


# ---------------------------------------------------------------------------
# TokenBucket.consume
# ---------------------------------------------------------------------------

class TestTokenBucketConsume:
    def test_first_consume_succeeds(self):
        """A fresh bucket has full capacity and allows the first consume."""
        bucket = TokenBucket(capacity=5, refill_rate=1.0)
        assert bucket.consume() is True

    def test_consume_depletes_tokens(self):
        """Each consume reduces tokens until the bucket is empty."""
        bucket = TokenBucket(capacity=3, refill_rate=0.0)
        assert bucket.consume() is True
        assert bucket.consume() is True
        assert bucket.consume() is True
        assert bucket.consume() is False

    def test_consume_returns_false_when_empty(self):
        """consume() returns False when no tokens remain."""
        bucket = TokenBucket(capacity=1, refill_rate=0.0)
        bucket.consume()  # drain
        assert bucket.consume() is False

    def test_tokens_refill_over_time(self):
        """After sufficient time passes, tokens refill and consume succeeds again."""
        bucket = TokenBucket(capacity=1, refill_rate=1.0)
        bucket.consume()  # drain to 0

        start = time.monotonic()
        # Advance mock clock by 2 seconds via patching time.monotonic.
        with patch("custom_components.harvest.rate_limiter.time.monotonic",
                   return_value=start + 2.0):
            # Trigger refill by consuming.
            assert bucket.consume() is True

    def test_tokens_do_not_exceed_capacity(self):
        """Refill is capped at capacity even after a long idle period."""
        bucket = TokenBucket(capacity=3, refill_rate=10.0)
        start = time.monotonic()
        with patch("custom_components.harvest.rate_limiter.time.monotonic",
                   return_value=start + 100.0):
            bucket.consume()
            # After the refill, tokens should not have exceeded 3.
            # We consumed 1, so remaining should be 2 (capacity 3 - 1).
            assert bucket.tokens == pytest.approx(2.0, abs=0.1)

    def test_capacity_one_allows_burst_then_blocks(self):
        """A capacity-1 bucket allows exactly one immediate consume then blocks."""
        bucket = TokenBucket(capacity=1, refill_rate=0.5)
        assert bucket.consume() is True
        assert bucket.consume() is False


# ---------------------------------------------------------------------------
# TokenBucket.seconds_until_available
# ---------------------------------------------------------------------------

class TestTokenBucketSecondsUntilAvailable:
    def test_returns_zero_when_tokens_available(self):
        """Returns 0 immediately after a successful consume (tokens still remain)."""
        bucket = TokenBucket(capacity=5, refill_rate=1.0)
        assert bucket.seconds_until_available() == 0

    def test_returns_positive_when_depleted(self):
        """Returns at least 1 when the bucket is empty."""
        bucket = TokenBucket(capacity=1, refill_rate=1.0)
        bucket.consume()
        result = bucket.seconds_until_available()
        assert result >= 1

    def test_slower_refill_means_longer_wait(self):
        """A slower refill rate yields a larger seconds_until_available."""
        slow = TokenBucket(capacity=1, refill_rate=0.1)
        fast = TokenBucket(capacity=1, refill_rate=1.0)
        slow.consume()
        fast.consume()
        assert slow.seconds_until_available() > fast.seconds_until_available()

    def test_minimum_return_is_one(self):
        """Even a tiny deficit returns at least 1, never 0."""
        bucket = TokenBucket(capacity=2, refill_rate=100.0)
        bucket.consume()
        bucket.consume()
        # Almost nothing needed to refill but deficit > 0.
        result = bucket.seconds_until_available()
        assert result >= 1


# ---------------------------------------------------------------------------
# RateLimiter.check_push
# ---------------------------------------------------------------------------

class TestCheckPush:
    def test_first_push_allowed(self):
        rl = RateLimiter(_config())
        assert rl.check_push("ses_1", "light.test", 1) is True

    def test_second_immediate_push_blocked(self):
        """Capacity-1 bucket: second call without time passing is blocked."""
        rl = RateLimiter(_config())
        rl.check_push("ses_1", "light.test", 1)
        assert rl.check_push("ses_1", "light.test", 1) is False

    def test_different_entity_ids_are_independent(self):
        """Each entity_id within the same session has its own bucket."""
        rl = RateLimiter(_config())
        rl.check_push("ses_1", "light.a", 1)  # drain light.a
        assert rl.check_push("ses_1", "light.b", 1) is True

    def test_different_sessions_are_independent(self):
        """The same entity_id on different sessions has separate buckets."""
        rl = RateLimiter(_config())
        rl.check_push("ses_1", "light.test", 1)  # drain ses_1
        assert rl.check_push("ses_2", "light.test", 1) is True

    def test_bucket_is_reused_on_subsequent_calls(self):
        """The same (session_id, entity_id) reuses the same bucket object."""
        rl = RateLimiter(_config())
        rl.check_push("ses_1", "light.test", 1)
        bucket_id = id(rl._push_buckets[("ses_1", "light.test")])
        rl.check_push("ses_1", "light.test", 1)
        assert id(rl._push_buckets[("ses_1", "light.test")]) == bucket_id


# ---------------------------------------------------------------------------
# RateLimiter.check_command
# ---------------------------------------------------------------------------

class TestCheckCommand:
    def test_first_command_allowed(self):
        rl = RateLimiter(_config())
        allowed, retry = rl.check_command("ses_1", 30)
        assert allowed is True
        assert retry == 0

    def test_exhausted_bucket_returns_retry_seconds(self):
        """After exhausting capacity, retry_after_seconds is positive."""
        rl = RateLimiter(_config())
        for _ in range(30):
            rl.check_command("ses_1", 30)
        allowed, retry = rl.check_command("ses_1", 30)
        assert allowed is False
        assert retry >= 1

    def test_capacity_equals_max_per_minute(self):
        """max_per_minute=5 allows exactly 5 consecutive commands."""
        rl = RateLimiter(_config())
        for i in range(5):
            allowed, _ = rl.check_command("ses_1", 5)
            assert allowed is True, f"call {i+1} should be allowed"
        allowed, _ = rl.check_command("ses_1", 5)
        assert allowed is False

    def test_different_sessions_have_separate_buckets(self):
        """Exhausting ses_1 does not affect ses_2."""
        rl = RateLimiter(_config())
        for _ in range(5):
            rl.check_command("ses_1", 5)
        rl.check_command("ses_1", 5)  # exhaust
        allowed, _ = rl.check_command("ses_2", 5)
        assert allowed is True


# ---------------------------------------------------------------------------
# RateLimiter.check_auth_for_token / record_auth_attempt
# ---------------------------------------------------------------------------

class TestAuthTokenRateLimit:
    def test_fresh_token_is_allowed(self):
        rl = RateLimiter(_config())
        assert rl.check_auth_for_token("hwt_tok1") is True

    def test_token_blocked_after_limit_failures(self):
        """After recording `limit` failed attempts the token is blocked."""
        limit = 3
        cfg = _config()
        cfg["max_auth_attempts_per_token_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.record_auth_attempt("hwt_tok1")

        assert rl.check_auth_for_token("hwt_tok1") is False

    def test_token_allowed_when_under_limit(self):
        """Recording fewer than limit failures still allows auth."""
        limit = 5
        cfg = _config()
        cfg["max_auth_attempts_per_token_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit - 1):
            rl.record_auth_attempt("hwt_tok1")

        assert rl.check_auth_for_token("hwt_tok1") is True

    def test_window_expiry_resets_counter(self):
        """After the 60-second window expires, the counter resets."""
        limit = 2
        cfg = _config()
        cfg["max_auth_attempts_per_token_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.record_auth_attempt("hwt_tok1")
        assert rl.check_auth_for_token("hwt_tok1") is False

        # Advance time past the window.
        future = time.monotonic() + 61.0
        with patch("custom_components.harvest.rate_limiter.time.monotonic",
                   return_value=future):
            assert rl.check_auth_for_token("hwt_tok1") is True

    def test_different_token_ids_are_independent(self):
        """Failures on one token do not affect another token's counter."""
        limit = 2
        cfg = _config()
        cfg["max_auth_attempts_per_token_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.record_auth_attempt("hwt_tok1")

        assert rl.check_auth_for_token("hwt_tok2") is True

    def test_record_after_window_expiry_starts_fresh(self):
        """recording an attempt after window expiry starts a new window at count=1."""
        limit = 5
        cfg = _config()
        cfg["max_auth_attempts_per_token_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.record_auth_attempt("hwt_tok1")

        future = time.monotonic() + 61.0
        with patch("custom_components.harvest.rate_limiter.time.monotonic",
                   return_value=future):
            rl.record_auth_attempt("hwt_tok1")
            count, _ = rl._auth_token_counters["hwt_tok1"]
            assert count == 1


# ---------------------------------------------------------------------------
# RateLimiter.check_ip
# ---------------------------------------------------------------------------

class TestCheckIp:
    def test_new_ip_is_allowed(self):
        rl = RateLimiter(_config())
        assert rl.check_ip("1.2.3.4") is True

    def test_ip_blocked_after_limit(self):
        """An IP is blocked after reaching max_connections_per_minute."""
        limit = 3
        cfg = _config()
        cfg["max_connections_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.check_ip("1.2.3.4")

        assert rl.check_ip("1.2.3.4") is False

    def test_different_ips_are_independent(self):
        """Exhausting one IP does not affect another."""
        limit = 2
        cfg = _config()
        cfg["max_connections_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.check_ip("1.2.3.4")
        rl.check_ip("1.2.3.4")  # push over limit

        assert rl.check_ip("5.6.7.8") is True

    def test_window_expiry_resets_ip_counter(self):
        """After 60 seconds the IP counter resets and the IP is allowed again."""
        limit = 2
        cfg = _config()
        cfg["max_connections_per_minute"] = limit
        rl = RateLimiter(cfg)

        for _ in range(limit):
            rl.check_ip("1.2.3.4")
        assert rl.check_ip("1.2.3.4") is False

        future = time.monotonic() + 61.0
        with patch("custom_components.harvest.rate_limiter.time.monotonic",
                   return_value=future):
            assert rl.check_ip("1.2.3.4") is True

    def test_check_ip_increments_counter(self):
        """Each successful check_ip increments the stored counter."""
        rl = RateLimiter(_config())
        rl.check_ip("1.2.3.4")
        rl.check_ip("1.2.3.4")
        count, _ = rl._ip_counters["1.2.3.4"]
        assert count == 2


# ---------------------------------------------------------------------------
# RateLimiter.cleanup_session
# ---------------------------------------------------------------------------

class TestCleanupSession:
    def test_removes_command_bucket(self):
        rl = RateLimiter(_config())
        rl.check_command("ses_1", 30)
        assert "ses_1" in rl._command_buckets
        rl.cleanup_session("ses_1")
        assert "ses_1" not in rl._command_buckets

    def test_removes_all_push_buckets_for_session(self):
        rl = RateLimiter(_config())
        rl.check_push("ses_1", "light.a", 1)
        rl.check_push("ses_1", "light.b", 1)
        rl.check_push("ses_2", "light.a", 1)

        rl.cleanup_session("ses_1")

        assert ("ses_1", "light.a") not in rl._push_buckets
        assert ("ses_1", "light.b") not in rl._push_buckets
        # ses_2's bucket must survive.
        assert ("ses_2", "light.a") in rl._push_buckets

    def test_cleanup_nonexistent_session_is_noop(self):
        rl = RateLimiter(_config())
        # Should not raise.
        rl.cleanup_session("ses_nonexistent")

    def test_cleanup_does_not_affect_ip_or_auth_counters(self):
        """cleanup_session only clears push/command buckets, not IP or auth counters."""
        rl = RateLimiter(_config())
        rl.record_auth_attempt("hwt_tok1")
        rl.check_ip("1.2.3.4")
        rl.check_command("ses_1", 30)

        rl.cleanup_session("ses_1")

        assert "hwt_tok1" in rl._auth_token_counters
        assert "1.2.3.4" in rl._ip_counters


class TestRekeySession:
    def test_moves_command_and_push_buckets(self):
        rl = RateLimiter(_config())
        rl.check_command("ses_old", 30)
        rl.check_push("ses_old", "light.a", 1)

        rl.rekey_session("ses_old", "ses_new")

        assert "ses_old" not in rl._command_buckets
        assert "ses_new" in rl._command_buckets
        assert ("ses_old", "light.a") not in rl._push_buckets
        assert ("ses_new", "light.a") in rl._push_buckets
