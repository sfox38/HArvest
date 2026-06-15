"""Tests for global configuration validation and fail-safe normalization."""
from __future__ import annotations

import pytest

from custom_components.harvest.config_validation import (
    normalize_global_config,
    validate_global_config_patch,
)
from custom_components.harvest.const import DEFAULTS


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("auth_timeout_seconds", True),
        ("auth_timeout_seconds", 0),
        ("max_inbound_message_bytes", 100),
        ("keepalive_interval_seconds", "30"),
        ("activity_log_retention_days", 366),
        ("absolute_session_lifetime_hours", -1),
        ("max_connections_per_minute", 0),
        ("external_port", 65_536),
        ("kill_switch", "false"),
    ],
)
def test_patch_rejects_invalid_scalar_values(field, value):
    with pytest.raises(ValueError):
        validate_global_config_patch({field: value})


@pytest.mark.parametrize(
    "patch",
    [
        {"unknown": True},
        {"default_rate_limits": {"max_push_per_second": 0}},
        {"default_rate_limits": {"unknown": 1}},
        {"default_session": {"lifetime_minutes": 100, "max_lifetime_minutes": 50}},
        {"ha_event_bus": {"harvest_token_revoked": "yes"}},
        {"ha_event_bus": {"unknown_event": True}},
        {"sensitive_domains": {"lock": 1}},
        {"sensitive_domains": {"camera": True}},
        {"trusted_proxies": "10.0.0.1"},
        {"custom_domains": [{"domain": "vacuum", "allowed_services": ["start", "start"]}]},
        {"custom_domains": [{"domain": "light", "allowed_services": ["turn_on"]}]},
        {"custom_domains": [{"domain": "camera", "allowed_services": ["turn_on"]}]},
    ],
)
def test_patch_rejects_invalid_nested_values(patch):
    with pytest.raises(ValueError):
        validate_global_config_patch(patch)


def test_patch_accepts_partial_nested_values():
    result = validate_global_config_patch({
        "default_session": {"lifetime_minutes": 120},
        "ha_event_bus": {"harvest_auth_failure": True},
        "sensitive_domains": {"lock": True, "input_button": True},
    })
    assert result["default_session"] == {"lifetime_minutes": 120}
    assert result["ha_event_bus"] == {"harvest_auth_failure": True}
    assert result["sensitive_domains"] == {"lock": True, "input_button": True}


def test_normalize_uses_valid_options_over_data():
    result = normalize_global_config(
        {"auth_timeout_seconds": 15},
        {"auth_timeout_seconds": 20},
    )
    assert result["auth_timeout_seconds"] == 20


def test_normalize_falls_back_for_malformed_security_values():
    result = normalize_global_config({
        "kill_switch": "false",
        "sensitive_domains": {"lock": "yes"},
        "max_auth_attempts_per_ip_per_minute": 0,
        "trusted_proxies": [{"bad": "value"}],
    })
    assert result["kill_switch"] is DEFAULTS["kill_switch"]
    assert result["sensitive_domains"] == DEFAULTS["sensitive_domains"]
    assert result["max_auth_attempts_per_ip_per_minute"] == DEFAULTS[
        "max_auth_attempts_per_ip_per_minute"
    ]
    assert result["trusted_proxies"] == []


def test_normalize_falls_back_for_malformed_nested_values():
    result = normalize_global_config({
        "default_session": {"lifetime_minutes": "60"},
        "ha_event_bus": {"harvest_token_revoked": "yes"},
    })
    assert result["default_session"] == DEFAULTS["default_session"]
    assert result["ha_event_bus"] == DEFAULTS["ha_event_bus"]


def test_normalize_falls_back_for_invalid_effective_session_config():
    result = normalize_global_config(
        {"default_session": {"lifetime_minutes": 120}},
        {"default_session": {"max_lifetime_minutes": 60}},
    )
    assert result["default_session"] == DEFAULTS["default_session"]


def test_normalize_drops_unknown_keys():
    result = normalize_global_config({"unexpected": "value"})
    assert "unexpected" not in result
