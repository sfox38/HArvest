"""Validation and fail-safe normalization for HArvest global configuration."""
from __future__ import annotations

import ipaddress
import re
from typing import Any
from urllib.parse import urlparse

from .const import DEFAULTS

_INT_RANGES: dict[str, tuple[int, int]] = {
    "auth_timeout_seconds": (1, 60),
    "max_inbound_message_bytes": (1024, 1_048_576),
    "keepalive_interval_seconds": (5, 300),
    "keepalive_timeout_seconds": (1, 60),
    "heartbeat_timeout_seconds": (5, 600),
    "activity_log_retention_days": (1, 365),
    "absolute_session_lifetime_hours": (1, 8760),
    "max_auth_attempts_per_token_per_minute": (1, 10_000),
    "max_auth_attempts_per_ip_per_minute": (1, 10_000),
    "max_connections_per_minute": (1, 100_000),
    "external_port": (0, 65_535),
}
_DEFAULT_RATE_LIMIT_RANGES = {
    "max_push_per_second": (1, 1000),
    "max_commands_per_minute": (1, 10_000),
}
_DEFAULT_SESSION_RANGES = {
    "lifetime_minutes": (1, 1440),
    "max_lifetime_minutes": (1, 43_200),
}
_DISPLAY_ENUMS = {
    "default_a11y": {"standard", "enhanced"},
    "default_on_offline": {"dim", "hide", "message", "last-state"},
    "default_on_error": {"dim", "hide", "message"},
}
_EVENT_NAMES = frozenset(DEFAULTS["ha_event_bus"])
_SENSITIVE_DOMAINS = frozenset({"lock", "script", "automation", "button", "input_button", "cover"})
_DOMAIN_RE = re.compile(r"^[a-z][a-z0-9_]*$")
_SERVICE_RE = re.compile(r"^[a-z][a-z0-9_]*$")
_LANG_RE = re.compile(r"auto|[a-z]{2,3}(-[a-zA-Z0-9]{1,8})*")


def _deep_merge(base: dict, override: dict) -> dict:
    """Recursively merge override into base."""
    result = dict(base)
    for key, value in override.items():
        if isinstance(result.get(key), dict) and isinstance(value, dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def _require_int(value: object, field: str, minimum: int, maximum: int) -> int:
    """Return a bounded integer or raise ValueError."""
    if not isinstance(value, int) or isinstance(value, bool):
        raise ValueError(f"{field} must be an integer.")
    if value < minimum or value > maximum:
        raise ValueError(f"{field} must be between {minimum} and {maximum}.")
    return value


def _validate_bare_origin(value: object) -> str:
    """Return an empty string or normalized bare HTTP(S) origin."""
    if not isinstance(value, str):
        raise ValueError("override_host must be a string.")
    if not value:
        return ""
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("override_host must be a valid http or https origin.")
    if parsed.path not in ("", "/") or parsed.query or parsed.fragment:
        raise ValueError("override_host must be a bare origin with no path, query, or fragment.")
    return f"{parsed.scheme}://{parsed.netloc}"


def _validate_script_url(value: object) -> str:
    """Return a safe script URL or path."""
    if not isinstance(value, str):
        raise ValueError("widget_script_url must be a string.")
    if not value:
        return ""
    if any(ord(char) < 32 or char.isspace() for char in value):
        raise ValueError("widget_script_url must not contain whitespace or control characters.")
    lowered = value.lower()
    if lowered.startswith(("javascript:", "data:", "vbscript:")):
        raise ValueError("widget_script_url uses an unsafe scheme.")
    scheme = re.match(r"^([a-zA-Z][a-zA-Z0-9+.\-]*):", value)
    if scheme:
        if scheme.group(1).lower() not in ("http", "https"):
            raise ValueError("widget_script_url must use http or https.")
        if not urlparse(value).netloc:
            raise ValueError("widget_script_url must include a host.")
    return value


def _validate_trusted_proxies(value: object) -> list[str]:
    """Return canonical trusted proxy IP and CIDR entries."""
    if not isinstance(value, list):
        raise ValueError("trusted_proxies must be a list.")
    normalized: list[str] = []
    seen: set[str] = set()
    for entry in value:
        if not isinstance(entry, str) or not entry.strip():
            raise ValueError("trusted_proxies entries must be non-empty strings.")
        candidate = entry.strip()
        try:
            canonical = (
                ipaddress.ip_network(candidate, strict=False).with_prefixlen
                if "/" in candidate
                else ipaddress.ip_address(candidate).compressed
            )
        except ValueError as exc:
            raise ValueError(f"Invalid trusted proxy IP or CIDR: {candidate}") from exc
        if canonical in seen:
            raise ValueError(f"Duplicate trusted proxy entry: {canonical}")
        seen.add(canonical)
        normalized.append(canonical)
    return normalized


def _validate_bool_map(value: object, field: str, allowed: frozenset[str]) -> dict[str, bool]:
    """Validate a map containing only known boolean keys."""
    if not isinstance(value, dict):
        raise ValueError(f"{field} must be an object.")
    unknown = set(value) - allowed
    if unknown:
        raise ValueError(f"{field} contains unknown keys: {', '.join(sorted(unknown))}.")
    for key, enabled in value.items():
        if not isinstance(enabled, bool):
            raise ValueError(f"{field}.{key} must be a boolean.")
    return dict(value)


def _validate_nested_ints(
    value: object,
    field: str,
    ranges: dict[str, tuple[int, int]],
) -> dict[str, int]:
    """Validate a partial nested bounded-integer object."""
    if not isinstance(value, dict):
        raise ValueError(f"{field} must be an object.")
    unknown = set(value) - set(ranges)
    if unknown:
        raise ValueError(f"{field} contains unknown keys: {', '.join(sorted(unknown))}.")
    return {
        key: _require_int(raw, f"{field}.{key}", *ranges[key])
        for key, raw in value.items()
    }


def _validate_custom_domains(value: object) -> list[dict]:
    """Validate custom-domain service allowlist structure."""
    from .entity_compatibility import TIER1_DOMAINS, TIER3_DOMAINS

    if not isinstance(value, list):
        raise ValueError("custom_domains must be a list.")
    result: list[dict] = []
    seen_domains: set[str] = set()
    for entry in value:
        if not isinstance(entry, dict) or set(entry) - {"domain", "allowed_services"}:
            raise ValueError("Each custom domain must contain only domain and allowed_services.")
        domain = entry.get("domain")
        services = entry.get("allowed_services")
        if not isinstance(domain, str) or not _DOMAIN_RE.fullmatch(domain.strip().lower()):
            raise ValueError("Each custom domain must have a valid domain.")
        domain = domain.strip().lower()
        if domain in TIER1_DOMAINS:
            raise ValueError(f"Domain '{domain}' is already a built-in domain.")
        if domain in TIER3_DOMAINS:
            raise ValueError(f"Domain '{domain}' is blocked and cannot be added.")
        if domain in seen_domains:
            raise ValueError(f"Duplicate domain: {domain}")
        if not isinstance(services, list) or not services:
            raise ValueError(f"Domain '{domain}' must specify at least one allowed service.")
        normalized_services: list[str] = []
        seen_services: set[str] = set()
        for service in services:
            if not isinstance(service, str) or not _SERVICE_RE.fullmatch(service.strip().lower()):
                raise ValueError(f"Invalid service name for domain '{domain}'.")
            service = service.strip().lower()
            if service in seen_services:
                raise ValueError(f"Duplicate service '{service}' for domain '{domain}'.")
            seen_services.add(service)
            normalized_services.append(service)
        seen_domains.add(domain)
        result.append({"domain": domain, "allowed_services": normalized_services})
    return result


def validate_global_config_patch(raw: object) -> dict:
    """Validate and normalize a partial global configuration update."""
    if not isinstance(raw, dict):
        raise ValueError("Config body must be an object.")
    unknown = set(raw) - set(DEFAULTS)
    if unknown:
        raise ValueError(f"Unknown config keys: {', '.join(sorted(unknown))}.")
    result: dict[str, Any] = {}
    for key, value in raw.items():
        if key in _INT_RANGES:
            result[key] = _require_int(value, key, *_INT_RANGES[key])
        elif key in ("kill_switch",):
            if not isinstance(value, bool):
                raise ValueError(f"{key} must be a boolean.")
            result[key] = value
        elif key == "default_rate_limits":
            result[key] = _validate_nested_ints(value, key, _DEFAULT_RATE_LIMIT_RANGES)
        elif key == "default_session":
            nested = _validate_nested_ints(value, key, _DEFAULT_SESSION_RANGES)
            effective = _deep_merge(DEFAULTS["default_session"], nested)
            if effective["max_lifetime_minutes"] < effective["lifetime_minutes"]:
                raise ValueError("default_session.max_lifetime_minutes must be >= lifetime_minutes.")
            result[key] = nested
        elif key == "ha_event_bus":
            result[key] = _validate_bool_map(value, key, _EVENT_NAMES)
        elif key == "sensitive_domains":
            result[key] = _validate_bool_map(value, key, _SENSITIVE_DOMAINS)
        elif key == "trusted_proxies":
            result[key] = _validate_trusted_proxies(value)
        elif key == "custom_domains":
            result[key] = _validate_custom_domains(value)
        elif key == "override_host":
            result[key] = _validate_bare_origin(value)
        elif key == "widget_script_url":
            result[key] = _validate_script_url(value)
        elif key == "default_lang":
            if not isinstance(value, str) or not _LANG_RE.fullmatch(value.strip()):
                raise ValueError("default_lang must be 'auto' or a BCP 47 tag.")
            result[key] = value.strip().lower()
        elif key in _DISPLAY_ENUMS:
            if not isinstance(value, str) or value not in _DISPLAY_ENUMS[key]:
                raise ValueError(f"Invalid value for {key}.")
            result[key] = value
        elif key in ("default_offline_text", "default_error_text"):
            if not isinstance(value, str):
                raise ValueError(f"{key} must be a string.")
            stripped = value.strip()
            if len(stripped) > 200 or any(ord(char) < 32 and char not in "\t\n\r" for char in stripped):
                raise ValueError(f"{key} must be at most 200 characters without control characters.")
            result[key] = stripped
    return result


def normalize_global_config(*sources: object) -> dict:
    """Merge stored config sources and replace malformed values with defaults."""
    normalized = _deep_merge({}, DEFAULTS)
    for source in sources:
        if not isinstance(source, dict):
            continue
        for key, value in source.items():
            if key not in DEFAULTS:
                continue
            try:
                patch = validate_global_config_patch({key: value})
            except ValueError:
                continue
            normalized = _deep_merge(normalized, patch)
    session = normalized["default_session"]
    if session["max_lifetime_minutes"] < session["lifetime_minutes"]:
        normalized["default_session"] = dict(DEFAULTS["default_session"])
    return normalized
