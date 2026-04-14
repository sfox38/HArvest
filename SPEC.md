# HArvest Protocol Specification

**Version:** 1.6.3
**Status:** Draft
**License:** MIT

---

## Overview

HArvest is an open source system that allows Home Assistant (HA) entity states to be embedded as live, interactive widgets on any external webpage. It consists of two components:

- **HArvest Integration** - a HACS custom integration (Python) that runs inside HA Core and acts as a secure, permissioned proxy between the public internet and HA entities.
- **HArvest Widget** - a vanilla JS Web Components library (single file, no dependencies) that renders interactive cards on any webpage.

This document defines the data models, WebSocket protocol, and security rules that govern communication between the widget and the integration. Any third-party implementation of either component must conform to this spec. The internal HTTP API between the HArvest panel UI and the integration is intentionally not specified here - it is an implementation detail of the bundled panel, not a public protocol.

---

## Table of Contents

1. [Security Model](#security-model)
2. [Token Data Model](#token-data-model)
3. [Session Data Model](#session-data-model)
4. [WebSocket Protocol](#websocket-protocol)
5. [Message Formats](#message-formats)
6. [Error Codes](#error-codes)
7. [Rate Limiting](#rate-limiting)
8. [Origin and Path Validation](#origin-and-path-validation)
9. [Client-Side State Caching](#client-side-state-caching)
10. [Widget Configuration and Error States](#widget-configuration-and-error-states)
11. [Theme Format and Styling](#theme-format-and-styling)
12. [Versioning and Distribution](#versioning-and-distribution)
13. [Connection Multiplexing](#connection-multiplexing)
14. [Entity Rendering](#entity-rendering)
15. [CMS and WordPress Compatibility](#cms-and-wordpress-compatibility)
16. [Entity Compatibility](#entity-compatibility)
17. [Diagnostic Sensors](#diagnostic-sensors)
18. [Logging and Activity Store](#logging-and-activity-store)
19. [Integration Configuration](#integration-configuration)
20. [Widget Interactions](#widget-interactions)
21. [Internationalisation](#internationalisation)
22. [Panel UI and Widget Creation Wizard](#panel-ui-and-widget-creation-wizard)

---

## 1. Security Model

### Principles

- The real HA long-lived access token is **never exposed** to the client or to the public internet. It stays inside HA Core at all times.
- The widget token embedded in public HTML is a **public routing identifier**, not a secret in the traditional sense. It is analogous to an OAuth `client_id` - visible to anyone, but useless without server-side validation of origin, scope, and optionally HMAC signature. All enforcement happens server-side. Knowing the token ID alone gives an attacker access only to what the token explicitly permits. Without HMAC enabled, the token ID does function as the primary authentication factor; with HMAC enabled, authentication additionally requires the token secret which is not embedded in plain form.
- The integration enforces all permissions. The client is never trusted to declare what it is allowed to do.
- The blast radius of any compromise is limited to the specific entities whitelisted in the token, not the whole HA instance.
- All token operations (creation, use, rejection, revocation) are logged by the integration. See Section 18 for logging architecture.

### Token Hierarchy

```
HA Long-lived Token (secret, never leaves HA)
  -> Widget Token (public ID, embedded in HTML)
      -> Session Token (short-lived, held in memory only, never persisted client-side)
```

### What an Attacker Can and Cannot Do

If a widget token is copied from page source:

- They **cannot** use it from a domain not in the allowed origins list - the integration rejects requests where the `Origin` header does not match. Note: browsers set `Origin` automatically and page JavaScript cannot override it, so this is reliable for browser-based usage. Non-browser tools (curl, Python scripts) can set arbitrary `Origin` headers, so origin validation is not a hard security boundary against determined attackers.
- They **cannot** access any entity not explicitly listed in the token.
- They **cannot** write if the token grants only read.
- They **can** make requests from a non-browser tool faking the Origin header, but only for the whitelisted entities and capabilities of that token.
- Rate limiting, per-IP throttling, and logging will surface unusual usage patterns.
- The token can be revoked instantly by the HA owner.

This is an appropriate security model for a system controlling home devices on a public webpage. It is not appropriate for sensitive or safety-critical systems.

### Optional Enhanced Security: HMAC Token Secret

For higher-security deployments, the token owner may enable HMAC signing. When a `token_secret` is set on a token, the widget must sign every `auth` and `renew` message using HMAC-SHA256 with the secret. The integration verifies the signature server-side before accepting the message.

The `token_secret` is a random 32-byte key generated by the integration at token creation time and displayed once to the owner. The integration stores the plaintext secret in HA's local `.storage/harvest_tokens` file - it must be stored as plaintext because HMAC verification requires the original secret. The secret must be embedded in the page HTML alongside the `token_id` by the page author. Both values are visible in the page source. The secret alone (without the token ID) cannot authenticate anything; both values are required together.

**What HMAC enhanced security protects against:**

- Token IDs leaked via server logs, Referer headers, browser history, or analytics tools. The token ID might appear in such logs (for example if it is ever included in a URL parameter), but the secret would not - so a leaked ID alone cannot be used to authenticate.
- Automated scanning tools that harvest token IDs from the internet (for example by crawling public pages) and attempt to use them programmatically. Without the secret, the ID is useless.

**What HMAC enhanced security does not protect against:**

- An attacker who can read the HTML source of the page the widget is embedded on. The secret is in the page source alongside the ID, so both values are equally visible to page source viewers.
- Replay attacks within the 60-second timestamp window. The nonce is not stored server-side, so an intercepted auth message can technically be replayed within 60 seconds. TLS prevents interception in transit; this is an accepted tradeoff for stateless validation.

The bottom line: HMAC is most valuable when you are concerned about token IDs being discovered through channels other than page source inspection - logs, referrer leakage, and automated scraping. It adds no protection against someone who can view the page source directly. For public-facing widgets where the HTML is always visible to visitors, the primary security model remains origin validation, scope restriction, and rate limiting.

The panel UI refers to this as "Enhanced security mode". See Section 2 for the token field definition and Section 5.1 for the signature format.

---

## 2. Token Data Model

Widget tokens are created and managed by the HArvest integration. They are stored server-side inside HA. The `token_id` is the only value that must appear in public HTML. The `token_secret` is optional and only required when enhanced security mode is enabled.

### Full Token Object

```json
{
  "token_id": "hwt_a3F9bC2d114eF5A6b7c8dE",
  "token_version": 1,
  "created_at": "2026-03-31T10:00:00Z",
  "created_by": "ha_user_id_xyz",
  "label": "Bedroom widgets - myblog.com",

  "expires": "2026-12-31T00:00:00Z",

  "token_secret": null,

  "origins": {
    "allow_any": false,
    "allowed": [
      "https://myblog.com",
      "https://www.myblog.com"
    ],
    "allow_paths": [
      "/smarthome/page.html"
    ]
  },

  "entities": [
    {
      "entity_id": "light.bedroom_main",
      "capabilities": "read-write",
      "alias": null,
      "exclude_attributes": []
    },
    {
      "entity_id": "sensor.bedroom_temperature",
      "capabilities": "read",
      "alias": "dJ5x3Apd",
      "exclude_attributes": []
    },
    {
      "entity_id": "fan.bedroom_ceiling",
      "capabilities": "read-write",
      "exclude_attributes": []
    }
  ],

  "rate_limits": {
    "max_push_per_second": 1,
    "max_commands_per_minute": 30,
    "override_defaults": true
  },

  "session": {
    "lifetime_minutes": 60,
    "max_lifetime_minutes": 1440,
    "max_renewals": null,
    "absolute_lifetime_hours": null
  },

  "max_sessions": null,

  "active_schedule": null,

  "allowed_ips": [],

  "status": "active",
  "revoked_at": null,
  "revoke_reason": null
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `token_id` | string | Unique public identifier. Prefix `hwt_` followed by 22 base62 characters (a-z, A-Z, 0-9), providing 131 bits of entropy. Safe to embed in HTML. |
| `token_version` | integer | Spec version this token was created under. Always `1` for v1 tokens. |
| `created_at` | ISO 8601 datetime | When the token was created. |
| `created_by` | string | HA user ID of the token creator. |
| `label` | string | Human-readable label for the token. Shown in the HArvest panel UI. |
| `expires` | ISO 8601 datetime or `null` | Token expiry. `null` means the token never expires. |
| `token_secret` | string or `null` | Optional 32-byte random key for HMAC signing. `null` disables enhanced security mode. Displayed once at token creation time. Stored as plaintext in HA's local `.storage/harvest_tokens` file (required for HMAC verification). Never appears in public HTML - the page author embeds it manually alongside `token_id`. |
| `origins.allow_any` | boolean | If `true`, requests from any origin are accepted. Overrides `allowed` and `allow_paths`. **Warning: setting this to `true` on a token with `read-write` capability means any website on the internet can send commands to your HA entities. Only use this combination if you fully understand and accept that risk.** |
| `origins.allowed` | array of strings | Full origin strings (`scheme://host`) that are permitted. |
| `origins.allow_paths` | array of strings | Optional. Relative paths (starting with `/`) that restrict access within all allowed origins. Advisory only - see Section 8. |
| `entities` | array | List of entities this token grants access to. Maximum 50 by default, configurable up to 250. See Section 19. |
| `entities[].entity_id` | string | HA entity ID. |
| `entities[].capabilities` | string | Either `"read"` or `"read-write"`. |
| `entities[].alias` | string or `null` | Optional 8-character base62 alias generated by the wizard when "Obscure entity names" is selected. When set, the widget uses the alias in HTML and protocol messages instead of the real entity ID. `null` means the real entity ID is used. |
| `entities[].exclude_attributes` | array of strings | Attribute keys to strip from `state_update` messages for this entity. |
| `rate_limits.max_push_per_second` | integer | Max state update messages pushed per entity per second. |
| `rate_limits.max_commands_per_minute` | integer | Max command messages accepted per minute across all entities in this session. |
| `rate_limits.override_defaults` | boolean | If `false`, integration global defaults apply instead of these values. |
| `session.lifetime_minutes` | integer | How long an issued session token is valid before requiring renewal. Default 60. |
| `session.max_lifetime_minutes` | integer | Upper bound on any single session lifetime including renewals. A renewal cannot extend a session beyond this value. Default 1440 (24 hours). |
| `session.max_renewals` | integer or `null` | Maximum number of times a session may be renewed. `null` means unlimited. |
| `session.absolute_lifetime_hours` | integer or `null` | Hard cap on total cumulative session age across all renewals for this token. After this, a full re-auth with the `token_id` is required regardless of renewals remaining. `null` defers to the global `absolute_session_lifetime_hours` setting (default 72 hours). Note: `max_lifetime_minutes` bounds individual sessions; `absolute_lifetime_hours` bounds the total lifetime of the visitor's authenticated state. |
| `max_sessions` | integer or `null` | Maximum simultaneous active sessions for this token. `null` means no limit. If the limit is reached, new auth attempts return `HRV_SESSION_LIMIT_REACHED`. |
| `active_schedule` | object or `null` | Optional time-based activation window. See Active Schedule below. |
| `allowed_ips` | array of strings | Optional CIDR ranges that restrict connections by source IP. Empty array means all IPs are allowed. See IP Restrictions below. |
| `status` | string | One of `active`, `revoked`, `expired`. |
| `revoked_at` | ISO 8601 datetime or `null` | Set when status becomes `revoked`. |
| `revoke_reason` | string or `null` | Optional human-readable reason for revocation. |

### Token ID Format

Token IDs use the prefix `hwt_` followed by 22 random base62 characters (a-z, A-Z, 0-9), providing 131 bits of entropy. Example: `hwt_a3F9bC2d114eF5A6b7c8dE`

Base62 is case-sensitive. Tokens are always copy-pasted rather than typed by hand, so case sensitivity is not a practical concern. The integration must ensure uniqueness at creation time using `secrets.choice` over the base62 alphabet.

### Active Schedule

An optional field that restricts token activity to defined time windows. Outside the defined windows the token behaves as if expired, returning `HRV_TOKEN_INACTIVE`. Active sessions established during a window are terminated when the window closes.

```json
"active_schedule": {
  "timezone": "Asia/Bangkok",
  "windows": [
    {
      "days": ["mon", "tue", "wed", "thu", "fri"],
      "start": "09:00",
      "end": "18:00"
    }
  ]
}
```

The `timezone` field must be a valid IANA timezone string (e.g. `"Asia/Bangkok"`, `"Europe/London"`, `"UTC"`). Invalid timezone strings are rejected at token save time. The integration performs all time comparisons using DST-aware local time conversion internally.

### IP Restrictions

An optional list of CIDR ranges that restrict connections by source IP. Checked against the incoming WebSocket connection's remote IP address.

```json
"allowed_ips": [
  "203.0.113.0/24",
  "10.0.0.0/8"
]
```

**Reverse proxy support:** when the integration is behind a reverse proxy (nginx, Caddy, Traefik, Cloudflare Tunnel, or similar), the integration sees the proxy's IP rather than the real client IP. IP restrictions are therefore unreliable without additional configuration.

The integration supports a `trusted_proxies` global config option (a list of CIDR ranges for known proxy IPs). When a connection arrives from a trusted proxy IP, the integration reads the real client IP from the `X-Forwarded-For` header. When the connection arrives from any other IP, the connection's remote address is used directly. Reading `X-Forwarded-For` from an untrusted source is not done, as a client could forge that header.

For deployments that do not use IP restrictions, reverse proxies work transparently with no configuration needed. The only requirement is that the proxy forwards WebSocket upgrade headers correctly. Standard proxy configurations for nginx, Caddy, and Traefik are documented in `docs/security.md`.

The integration logs a warning at startup if `allowed_ips` is set on any token but `trusted_proxies` is empty and proxy headers are detected on incoming connections.

### Attribute Denylist and Per-Entity Exclusions

The integration strips a global denylist of attribute key names before sending any `state_update`. Any attribute whose key contains one of the following strings (case-insensitive) is removed: `access_token`, `api_key`, `password`, `token`, `secret`, `credentials`, `private_key`.

Per-entity additional exclusions are defined in `entities[].exclude_attributes`. These supplement the global denylist and are applied before sending.

---

## 3. Session Data Model

Sessions are created by the integration when a widget successfully authenticates. Sessions are stored server-side only. The client receives only the `session_id` string. Sessions are never persisted to disk on the client.

### Full Session Object (server-side)

```json
{
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "widget_token_id": "hwt_a3F9bC2d114eF5A6b7c8dE",
  "token_version": 1,
  "issued_at": "2026-03-31T10:23:00Z",
  "expires_at": "2026-03-31T11:23:00Z",
  "absolute_expires_at": "2026-04-03T10:23:00Z",
  "renewal_count": 0,
  "origin_validated": "https://myblog.com",
  "referer_validated": "https://myblog.com/smarthome/page.html",
  "allowed_entities": [
    {
      "entity_id": "light.bedroom_main",
      "capabilities": "read-write"
    },
    {
      "entity_id": "sensor.bedroom_temperature",
      "capabilities": "read"
    }
  ]
}
```

### Session ID Format

Session IDs use the prefix `hrs_` followed by 22 random base62 characters (a-z, A-Z, 0-9), providing 131 bits of entropy. Example: `hrs_f9A2b3C4d5e6F7a8b`

### Session Lifecycle

1. Created on successful `auth` handshake.
2. All subsequent messages from the client must include the `session_id`.
3. The integration sends a `session_expiring` warning 10 minutes before expiry as a UX convenience. The widget can renew proactively to avoid any visible interruption. This is a polish feature, not a protocol requirement - a widget that does not handle `session_expiring` will still reconnect correctly after expiry via normal re-auth.
4. The widget silently sends a `renew` message. The integration issues a new session ID. `renewal_count` is incremented. If `max_renewals` is set and reached, the renewal is rejected with `HRV_SESSION_LIMIT_REACHED`.
5. If `absolute_expires_at` is reached, no further renewals are accepted. The widget must perform a full re-auth with the original `token_id`.
6. If a session expires without renewal, the next client message returns `HRV_SESSION_EXPIRED`. The widget must immediately clear its stored `session_id` (set to `null`) before attempting re-auth to prevent retry loops. If re-auth fails 3 consecutive times, the widget enters permanent `HRV_AUTH_FAILED` state and stops retrying.

---

## 4. WebSocket Protocol

### Endpoint

```
wss://<ha-host>/api/harvest/ws
```

A REST polling fallback for environments where WebSocket connections are blocked (some corporate proxies, some managed WordPress hosts) is planned for v1.1. See the changelog.

### Auth Timeout

If a client opens a WebSocket connection but does not send an `auth` message within the configured timeout period (default 10 seconds, configurable - see Section 19), the server closes the connection without sending any message. This prevents idle connections from consuming server resources.

### Auth Debounce

The `HarvestClient` singleton implements a 50ms debounce window before sending the initial `auth` message. When the first `<hrv-card>` or `hrv-mount` element registers, a 50ms timer starts rather than immediately opening the WebSocket. During those 50ms, all other cards that mount collect their entity IDs. After the timer fires, the singleton opens the WebSocket and sends a single `auth` message listing all collected entity IDs. This collapses what would otherwise be one `auth` plus N-1 `subscribe` messages into a single `auth` covering all entities.

Cards that mount after the debounce window (genuinely late-arriving cards from dynamic page injection) use the `subscribe` flow as intended.

### Connection and Handshake Sequence

One WebSocket connection is shared by all `<hrv-card>` elements on a page that resolve to the same `ha-url` and `token` combination. Cards sharing the same HA URL but using different tokens get separate connections. The URL and token are resolved via the three-level inheritance chain (card attribute -> group attribute -> `HArvest.config()`). See Section 13 for the full multiplexing architecture.

```
1. Client opens WebSocket connection to the endpoint.
   HTTP headers sent by browser:
     Origin: https://myblog.com
     Referer: https://myblog.com/smarthome/page.html  (may be absent)

2. Client sends auth message after the 50ms debounce window, listing all
   entity_ids required by cards on the page.

3. Server validates token, origin, expiry, IP restrictions, active schedule,
   and entity scope for each entity_id.

4. On success: server sends auth_ok, then sends entity_definition and
   state_update pairs interleaved per entity (definition then state for
   entity 1, definition then state for entity 2, etc.) to allow cards
   to begin rendering as early as possible.

5. On failure: server sends auth_failed and closes the connection.
   The client does not retry auth failures.

6. During normal operation: server pushes state_update messages whenever
   any subscribed entity state changes, subject to per-entity rate limiting.

7. Client sends command messages to control entities.

8. Client may send subscribe or unsubscribe messages to adjust the entity
   list without re-authenticating.

9. Server sends session_expiring 10 minutes before session expiry.

10. Client sends renew. Server responds with a new auth_ok and new session_id,
    then resends entity_definition and state_update pairs for all subscribed
    entities.
```

---

## 5. Message Formats

All messages are JSON objects sent over the WebSocket connection. All messages include a `type` field and a `msg_id` field.

`msg_id` is a client-incremented integer for client-originated messages. Server-originated unsolicited messages (state pushes, warnings) use `null` for `msg_id`. Server responses to client messages echo the client's `msg_id`.

### 5.1 Client -> Server: auth

Sent after the 50ms debounce window. Lists all entity references required by cards currently on the page. Each value in `entity_ids` comes directly from the card's `entity` attribute (a real HA entity ID) or its `alias` attribute (an opaque alias). The field name remains `entity_ids` regardless. A page with some cards using `entity=` and others using `alias=` will produce a mixed array - this is valid. The integration resolves each value against the token's entity list (alias lookup first, then real entity ID lookup) before validation. All references must resolve to entities present in the token's entity list or the server returns `HRV_ENTITY_NOT_IN_TOKEN`.

When enhanced security mode is enabled (`token_secret` is set), the client must include an HMAC-SHA256 signature of the string `{token_id}:{timestamp}:{nonce}` using the `token_secret` as the key, where `timestamp` is the current Unix timestamp in seconds and `nonce` is a random 16-character base62 string. The integration verifies this by computing the same HMAC using the stored plaintext secret and comparing using a constant-time comparison (`hmac.compare_digest`) to prevent timing attacks. Timestamps older than 60 seconds are rejected to prevent replay attacks.

```json
{
  "type": "auth",
  "token_id": "hwt_a3F9bC2d114eF5A6b7c8dE",
  "entity_ids": [
    "light.bedroom_main",
    "sensor.bedroom_temperature",
    "fan.bedroom_ceiling"
  ],
  "timestamp": 1743415380,
  "nonce": "a3f9bc2d114ef5a6",
  "signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "msg_id": 1
}
```

`timestamp`, `nonce`, and `signature` are omitted when `token_secret` is `null`.

### 5.2 Server -> Client: auth_ok

```json
{
  "type": "auth_ok",
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "expires_at": "2026-03-31T11:23:00Z",
  "absolute_expires_at": "2026-04-03T10:23:00Z",
  "entity_ids": [
    "light.bedroom_main",
    "dJ5x3Apd",
    "fan.bedroom_ceiling"
  ],
  "msg_id": 1
}
```

`entity_ids` echoes back the references exactly as the client sent them in the `auth` message. If the client sent an alias (from a card using `alias=`), the server echoes the alias. If the client sent a real entity ID (from a card using `entity=`), the server echoes the real entity ID. A page mixing both formats will receive a mixed array. The widget uses these values to match `entity_definition` and `state_update` messages back to cards, so the echo format must be consistent with what the card uses as its own identifier.

Per-entity capabilities and icons are delivered in the `entity_definition` messages that immediately follow `auth_ok`.

### 5.3 Server -> Client: auth_failed

Sent on any authentication failure. The connection is closed immediately after.

```json
{
  "type": "auth_failed",
  "code": "HRV_TOKEN_EXPIRED",
  "msg_id": 1
}
```

The `code` field contains one of the non-retryable error codes from Section 6. The specific reason is exposed here because this message is only visible to the widget owner's browser, not to a page visitor.

### 5.4 Server -> Client: state_update

Sent once per entity immediately after its `entity_definition` (initial state), and pushed whenever entity state changes, subject to per-entity rate limiting. Also sent to ALL sessions subscribed to an entity when any session sends a command that changes it. State fan-out is one-to-many, not one-to-one.

The initial `state_update` for a newly subscribed entity always includes the full `attributes` and `extended_attributes` objects. Subsequent updates use a delta format: only changed attributes are included in `attributes_delta`. If only `state` changed and no attributes changed, `attributes_delta` is omitted entirely, saving bandwidth significantly for high-frequency sensors.

The integration strips the global attribute denylist and any per-entity `exclude_attributes` before sending. The `last_updated` field is included to allow clients to discard out-of-order updates.

**Initial state_update (full attributes):**

```json
{
  "type": "state_update",
  "entity_id": "light.bedroom_main",
  "state": "on",
  "attributes": {
    "brightness": 200,
    "color_temp": 4000,
    "friendly_name": "Bedroom Main Light",
    "supported_color_modes": ["color_temp"],
    "color_mode": "color_temp"
  },
  "extended_attributes": {
    "manufacturer_effect_list": ["Candle", "Fire", "Storm"]
  },
  "last_changed": "2026-03-31T10:23:05Z",
  "last_updated": "2026-03-31T10:23:05Z",
  "initial": true,
  "msg_id": null
}
```

**Subsequent state_update (delta attributes):**

```json
{
  "type": "state_update",
  "entity_id": "light.bedroom_main",
  "state": "on",
  "attributes_delta": {
    "changed": { "brightness": 180 },
    "removed": []
  },
  "last_changed": "2026-03-31T10:24:00Z",
  "last_updated": "2026-03-31T10:24:00Z",
  "initial": false,
  "msg_id": null
}
```

When `attributes_delta` is absent, the client keeps the last known attributes unchanged and only updates `state`.

### 5.4a Server -> Client: entity_removed

Sent when a subscribed entity is deleted from HA entirely (not merely unavailable). The widget transitions to a permanent error state for that card. No retry is attempted since the entity no longer exists.

```json
{
  "type": "entity_removed",
  "entity_id": "light.bedroom_main",
  "msg_id": null
}
```

When an entity becomes temporarily unavailable (device offline, HA integration error), the integration sends a normal `state_update` with `state: "unavailable"` rather than `entity_removed`. The widget renders the unavailable state and continues watching, since the device may come back online.

### 5.5 Client -> Server: command

The `action` field must be in the `ALLOWED_SERVICES` map for the entity's domain (see Section 16). Unknown actions are rejected with `HRV_PERMISSION_DENIED`. Unknown keys in `data` are stripped before the command is forwarded to HA.

```json
{
  "type": "command",
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "entity_id": "light.bedroom_main",
  "action": "turn_on",
  "data": { "brightness": 200 },
  "msg_id": 42
}
```

### 5.6 Server -> Client: ack

Sent in response to every command message.

```json
{
  "type": "ack",
  "success": true,
  "error_code": null,
  "error_message": null,
  "msg_id": 42
}
```

On failure:

```json
{
  "type": "ack",
  "success": false,
  "error_code": "HRV_PERMISSION_DENIED",
  "error_message": "Write not permitted for entity sensor.bedroom_temperature",
  "msg_id": 42
}
```

### 5.7 Server -> Client: session_expiring

Sent 10 minutes before session expiry as a UX convenience to allow proactive renewal.

```json
{
  "type": "session_expiring",
  "expires_at": "2026-03-31T11:23:00Z",
  "msg_id": null
}
```

### 5.8 Client -> Server: renew

```json
{
  "type": "renew",
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "token_id": "hwt_a3F9bC2d114eF5A6b7c8dE",
  "msg_id": 43
}
```

Server responds with a new `auth_ok` containing a new `session_id`, then resends `entity_definition` and `state_update` pairs for all subscribed entities. The server determines which entities to resend from the session's `subscribed_entity_ids` set, which is maintained throughout the session lifetime including any entities added via `subscribe` messages. The client does not need to re-send the entity list in a `renew` message.

### 5.9 Server -> Client: error

Sent for server-side errors not tied to a specific client message.

```json
{
  "type": "error",
  "code": "HRV_SERVER_ERROR",
  "message": "Internal error relaying state update",
  "msg_id": null
}
```

### 5.10 Server -> Client: entity_definition

Sent once per entity immediately after `auth_ok` (interleaved with the initial `state_update` for that entity), and again after a successful `renew`. Tells the widget which renderer to use, what controls to display, and which icons to render. Sending definitions and state updates interleaved per entity (rather than all definitions then all states) allows each card to begin rendering as soon as its data arrives.

The `capabilities` field reflects what the token permits, not what the entity supports in HA. The `icon` and `icon_state_map` fields are sourced from HA's own entity registry, including any custom icons the user has set. This means the widget automatically reflects the user's HA icon customisations without any hardcoded mapping.

```json
{
  "type": "entity_definition",
  "entity_id": "light.bedroom_main",
  "domain": "light",
  "device_class": null,
  "friendly_name": "Bedroom Main Light",
  "capabilities": "read-write",
  "supported_features": ["brightness", "color_temp"],
  "feature_config": {
    "min_brightness": 0,
    "max_brightness": 255,
    "min_color_temp": 2700,
    "max_color_temp": 6500
  },
  "icon": "mdi:lightbulb",
  "icon_state_map": {
    "on": "mdi:lightbulb",
    "off": "mdi:lightbulb-outline",
    "unavailable": "mdi:lightbulb-off-outline"
  },
  "support_tier": 1,
  "renderer": "LightCard",
  "unit_of_measurement": null,
  "msg_id": null
}
```

Additional examples:

```json
{
  "type": "entity_definition",
  "entity_id": "sensor.bedroom_temperature",
  "domain": "sensor",
  "device_class": "temperature",
  "friendly_name": "Bedroom Temperature",
  "capabilities": "read",
  "supported_features": [],
  "feature_config": {},
  "icon": "mdi:thermometer",
  "icon_state_map": {},
  "support_tier": 1,
  "renderer": "TemperatureSensorCard",
  "unit_of_measurement": "C",
  "msg_id": null
}
```

```json
{
  "type": "entity_definition",
  "entity_id": "fan.bedroom_ceiling",
  "domain": "fan",
  "device_class": null,
  "friendly_name": "Bedroom Ceiling Fan",
  "capabilities": "read-write",
  "supported_features": ["set_speed", "oscillate", "direction"],
  "feature_config": { "speed_count": 4 },
  "icon": "mdi:fan",
  "icon_state_map": {
    "on": "mdi:fan",
    "off": "mdi:fan-off"
  },
  "support_tier": 1,
  "renderer": "FanCard",
  "unit_of_measurement": null,
  "msg_id": null
}
```

The integration translates HA's internal `supported_features` bitmask into a plain string array before sending. The widget never receives raw bitmask values. This insulates the widget from changes to HA internals across HA versions.

### 5.11 Server -> Client: history_data

Sent once after the initial `state_update` when the card has `show-history="true"`. History is fetched from HA's recorder via the `/api/history/period` endpoint. If the recorder is disabled, `points` is empty and the widget renders a "No history available" message.

```json
{
  "type": "history_data",
  "entity_id": "sensor.bedroom_temperature",
  "hours": 24,
  "points": [
    { "t": "2026-04-02T10:00:00Z", "s": "21.2" },
    { "t": "2026-04-02T11:00:00Z", "s": "21.0" },
    { "t": "2026-04-02T12:00:00Z", "s": "22.1" }
  ],
  "msg_id": null
}
```

History is not re-fetched on subsequent updates. The widget appends new state_update points to the graph and drops points older than the requested window. The integration debounces duplicate history requests for the same entity within the same session to avoid unnecessary database queries.

### 5.12 Client -> Server: subscribe

Sent to add entities to the current session without re-authenticating. All entity IDs must be present in the original token's entity list.

```json
{
  "type": "subscribe",
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "entity_ids": ["switch.hallway_light"],
  "msg_id": 15
}
```

### 5.13 Server -> Client: subscribe_ok

```json
{
  "type": "subscribe_ok",
  "entity_ids": ["switch.hallway_light"],
  "msg_id": 15
}
```

Server then sends interleaved `entity_definition` and `state_update` for each newly subscribed entity.

### 5.14 Client -> Server: unsubscribe

Sent to remove entities from the current session. The server stops pushing updates for these entities. No response is sent.

```json
{
  "type": "unsubscribe",
  "session_id": "hrs_f9A2b3C4d5e6F7a8b9c0dE",
  "entity_ids": ["switch.hallway_light"],
  "msg_id": 16
}
```

### 5.15 Message Robustness

Both the server and client must handle unexpected or malformed messages without crashing or disconnecting.

**Client rules (widget):**

- Unparseable JSON: log at `warn` level with the raw string. Ignore. Stay connected.
- Valid JSON, unknown `type`: log at `debug` level (expected during version mismatches). Ignore. Stay connected.
- Valid JSON, known `type`, missing or wrong-type fields: log at `warn` level. Ignore the message. Stay connected.
- Flood protection: if more than 10 malformed messages arrive within 5 seconds, log at `error` level, close the connection, enter `HRV_OFFLINE`, and reconnect via normal backoff.

**Server rules (integration):**

- Unparseable JSON from client: log at `warn` level. Ignore. Keep session open.
- Valid JSON, unknown `type`: log at `debug` level. Ignore. Keep session open.
- Valid JSON, known `type`, missing or malformed fields: log at `warn` level. Send `ack` with `HRV_BAD_REQUEST` if the message had a `msg_id`. Keep session open.
- Exception: a malformed `auth` message closes the connection since authentication cannot proceed.

**Message size limits:**

- Inbound (client to server): 4KB hard limit, enforced at the WebSocket frame level before JSON parsing. The server closes the connection and logs `HRV_MESSAGE_TOO_LARGE`.
- Outbound (server to client): 64KB soft limit. Messages exceeding this are logged as warnings and dropped rather than sent.

**Malformed token_id:** a syntactically malformed `token_id` returns `HRV_TOKEN_INVALID`, the same code as a not-found token. This is intentional: distinguishing format errors from not-found errors would give a probing attacker information about valid token structure.

---

## 6. Error Codes

All error codes are prefixed `HRV_`.

| Code | Description | Retryable | Visible to Visitor |
|------|-------------|-----------|-------------------|
| `HRV_TOKEN_INVALID` | token_id not found, or syntactically malformed (intentionally collapsed) | No | No - show `HRV_AUTH_FAILED` |
| `HRV_TOKEN_EXPIRED` | Token past its expiry date | No | No - show `HRV_AUTH_FAILED` |
| `HRV_TOKEN_REVOKED` | Token was manually revoked | No | No - show `HRV_AUTH_FAILED` |
| `HRV_TOKEN_INACTIVE` | Token outside its active_schedule window | No | No - show `HRV_AUTH_FAILED` |
| `HRV_ORIGIN_DENIED` | Origin not in allowed list | No | No - show `HRV_AUTH_FAILED` |
| `HRV_IP_DENIED` | Source IP not in allowed_ips | No | No - show `HRV_AUTH_FAILED` |
| `HRV_ENTITY_NOT_IN_TOKEN` | entity_id not in token scope | No | No - show `HRV_AUTH_FAILED` |
| `HRV_ENTITY_INCOMPATIBLE` | Entity domain is in the Tier 3 blocked list | No | No - show `HRV_AUTH_FAILED` |
| `HRV_SESSION_LIMIT_REACHED` | Token's max_sessions or max_renewals limit reached | No | No - show `HRV_AUTH_FAILED` |
| `HRV_SIGNATURE_INVALID` | HMAC signature verification failed | No | No - show `HRV_AUTH_FAILED` |
| `HRV_AUTH_FAILED` | Generic auth failure shown to visitor | No | Yes |
| `HRV_ENTITY_MISSING` | Entity not found in HA | No | Yes |
| `HRV_ENTITY_REMOVED` | Entity was deleted from HA post-auth | No | Yes - permanent error state |
| `HRV_PERMISSION_DENIED` | Capability not granted, or action not in ALLOWED_SERVICES | No | No - silently block |
| `HRV_RATE_LIMITED` | Rate limit exceeded | Yes, after Retry-After | No - silently drop |
| `HRV_SESSION_EXPIRED` | Session lifetime exceeded | Yes, re-auth | No |
| `HRV_BAD_REQUEST` | Malformed message with a msg_id | No | No |
| `HRV_MESSAGE_TOO_LARGE` | Inbound message exceeded 4KB limit | No | No - connection closed |
| `HRV_SERVER_ERROR` | Internal HA or integration error | Yes, with backoff | No - show offline |
| `HRV_OFFLINE` | Client-side: cannot reach server | Yes, with backoff | Yes |
| `HRV_STALE` | Client-side: connection lost mid-session | Yes, with backoff | Yes |
| `HRV_CONNECTING` | Client-side: initial connection in progress | N/A | Yes |

### Visitor-Facing Error Display

The widget must never expose internal error codes or token details to the page visitor.

| Internal State | Visitor Sees |
|---------------|-------------|
| Any auth failure | "Widget unavailable" |
| `HRV_ENTITY_MISSING` | "Device unavailable" |
| `HRV_ENTITY_REMOVED` | "Device unavailable" (permanent, no retry) |
| `HRV_OFFLINE` | "Temporarily offline" + last known state |
| `HRV_STALE` | Last known state + stale indicator |
| `HRV_CONNECTING` | Skeleton/pulse animation |

---

## 7. Rate Limiting

Rate limiting is applied at two independent layers.

### Server-side (integration)

- `max_push_per_second` applies per entity, not per session. Each entity has its own independent throttle window. Intermediate states are dropped; only the latest state is sent when the window opens.
- A session covering 50 entities may push up to `50 * max_push_per_second` messages per second in total.
- Commands are counted per session across all entities. If `max_commands_per_minute` is exceeded, the server returns `HRV_RATE_LIMITED` with a `Retry-After` value in seconds in the ack response.
- Per-token auth rate limiting: if a token receives more than `max_auth_attempts_per_token_per_minute` failed auth attempts, it is temporarily blocked from further auth for a backoff period.
- Per-IP auth rate limiting: if more than `max_auth_attempts_per_ip_per_minute` connection attempts arrive from a single IP, new connections from that IP are rejected with HTTP 429 before the WebSocket upgrade is accepted.
- Global connection rate limiting: total new WebSocket connection attempts per minute are capped at a configurable threshold. Protects the HA instance as a whole.

### Client-side (widget)

- The widget debounces DOM re-renders per card to at most once per 200ms.
- When multiple cards receive state updates in the same event loop tick, DOM updates are batched using `requestAnimationFrame` so the browser performs one paint pass rather than one repaint per card.
- The `HarvestClient` processes incoming messages from a queue rather than synchronously, yielding to the browser between batches via `requestAnimationFrame`. This prevents the event loop from blocking on bursts such as the initial load of a large token.
- On reconnection, the `HarvestClient` uses exponential backoff with jitter. All cards recover together via the shared connection.

### Client-side Input Debouncing

Interactive controls that produce continuous input (brightness sliders, volume sliders, number inputs) must debounce commands using a 300ms trailing debounce. The widget applies the visual change immediately (optimistic UI) but waits until the user has stopped adjusting for 300ms before sending the command. This prevents flooding the server with intermediate values.

### Reconnection Backoff Schedule

| Attempt | Delay |
|---------|-------|
| 1 | 5 seconds |
| 2 | 10 seconds |
| 3 | 30 seconds |
| 4+ | 60 seconds (cap) |

Jitter of up to 20% is added to each delay. Backoff resets to zero on successful reconnection. Backoff does not apply to auth failures. Auth failures do not retry.

### Server-Side Keepalive

The integration sends a WebSocket `ping` frame every 30 seconds (configurable). If the client does not respond with a `pong` within 10 seconds (configurable), the server closes the session and removes it from memory. This recovers resources from connections that dropped without a clean TCP close.

Browsers respond to WebSocket ping frames automatically at the protocol level. No widget code is required to support this.

### Client-Side Heartbeat

The widget monitors incoming message activity. If no WebSocket message of any kind (state update, ping, error, or any other) is received for more than `heartbeat_timeout_seconds` (default 60 seconds, configurable), the widget treats the connection as dead, closes it, enters `HRV_STALE`, and begins the reconnection backoff sequence. The heartbeat timer resets on every received message.

---

## 8. Origin and Path Validation

### Origin Validation (authoritative)

The HTTP `Origin` header is set automatically by the browser and cannot be modified by JavaScript running on the page. Origin validation is therefore reliable for browser-based widget usage.

Matching rules:

- Origin comparison is exact: scheme, host, and port must all match.
- Trailing slashes are normalised before comparison.
- Subdomains are not matched unless explicitly listed.
- HTTP and HTTPS are different origins even for the same host.

Example:

```
allowed: ["https://myblog.com"]

https://myblog.com          -> PASS
https://myblog.com/         -> PASS (trailing slash normalised)
https://sub.myblog.com      -> FAIL (subdomain not listed)
http://myblog.com           -> FAIL (different scheme)
https://myblog.com:8080     -> FAIL (different port)
```

Non-browser clients (curl, Python scripts, etc.) can set arbitrary Origin headers. This cannot be prevented. Rate limiting, per-IP throttling, and token revocation are the mitigations.

### Path Validation (advisory)

> **Important:** The `Origin` header, which is the authoritative security control, contains only the scheme, host, and port - never the URL path. Path restrictions in `allow_paths` work by checking the separate `Referer` header, which browsers may suppress. This means `allow_paths` is always advisory and can never provide the same guarantee as origin validation. Do not rely on path restrictions as a hard security boundary.

The HTTP `Referer` header may include the full URL including path, query string, and fragment. Before matching, the integration normalises the Referer value by extracting only the path component - the query string and fragment are stripped entirely. This is intentional: query strings are visitor-controlled and vary per request (UTM parameters, session identifiers, A/B flags); they are not part of the page identity and would make path restrictions impractical if included in matching.

Rules:

- Paths in `allow_paths` are relative (start with `/`) and apply to all origins in `allowed`.
- The Referer header is parsed and the path component extracted. Query string and fragment are discarded before comparison.
- If `allow_paths` is non-empty AND a normalised Referer path is present, it must exactly match one of the entries. A mismatch is rejected.
- If `allow_paths` is non-empty AND no `Referer` header is present (suppressed by browser privacy settings), the request is passed and a warning is logged. Path restrictions cannot penalise legitimate users whose browsers suppress `Referer`.
- Path matching is exact in v1. No wildcard, prefix, or glob matching.

> **Future versions** may support prefix matching (e.g. `/smarthome/*` to allow all pages under a path) and query string patterns. The normalisation step is designed as a discrete function to make this extension straightforward without changing the matching interface.

`allow_paths` is a best-effort control, not a hard security boundary. See `docs/security.md` Section 1.5 Scenario 4 for a full analysis of the threat model around path restrictions.

### Path Sanitisation

All `allow_paths` entries are validated at token save time, not at request time. The integration rejects any path entry that does not start with `/`, contains `..`, contains null bytes, exceeds 512 characters, or contains a query string or fragment (entries must be path-only; query strings in `allow_paths` entries would never match after normalisation and indicate a misconfiguration). A token with an invalid `allow_paths` entry fails to save with a clear error message.

---

## 9. Client-Side State Caching

The widget caches the last known entity state in `localStorage` to provide a graceful offline experience.

### Storage Key Format

The cache key uses a fast synchronous integer hash of the combined `token_id` and `entity_id` to avoid exposing either value in browser storage. `crypto.subtle.digest` (SHA-256) cannot be used here because it is asynchronous and `connectedCallback` is synchronous. The integer hash provides privacy-by-obscurity sufficient for a cache key, which is not a security boundary.

```
hrv_{djb2hash(token_id + "|" + entity_id).abs().hex().padStart(8, "0")}
```

Example: `hrv_a3f9bc2d`

See `widget-architecture.md` Section 8 for the full hash implementation.

### Cached Object Format

```json
{
  "entity_id": "light.bedroom_main",
  "state": "on",
  "attributes": {
    "brightness": 200,
    "friendly_name": "Bedroom Main Light"
  },
  "cached_at": "2026-03-31T10:23:00Z"
}
```

### Rules

- The cache is updated on every received `state_update` message.
- When the widget cannot connect, it reads from the cache and renders last known state with a visible stale indicator.
- When the connection is restored, live state replaces cached state and the stale indicator is removed.
- Cache is scoped to the page's domain in the browser. Different visitors on different machines have independent caches.
- Session tokens are never written to localStorage.

### State Ordering

When a `state_update` arrives, the widget compares `last_updated` against the last applied update timestamp for that entity. If the incoming `last_updated` is not newer than the last applied value, the update is discarded as out-of-order. This prevents network reordering from causing a widget to display stale state permanently.

---

## 10. Widget Configuration and Error States

### Configuration Inheritance

HArvest uses a three-level configuration inheritance chain. Each level only needs to specify what differs from the level above.

```
HArvest.config({ haUrl: "...", token: "..." })   <- page-level default
  <hrv-group ha-url="..." token="...">            <- overrides for a group of cards
    <hrv-card alias="..." or entity="...">        <- one card, overrides for itself
```

`ha-url` and `token` are optional on `<hrv-card>` and `<hrv-group>` if they can be resolved from a higher level. The resolution order for each attribute is: card attribute -> group attribute -> `HArvest.config()` value. If none of these provide a value, the card renders an error state.

Config resolution happens lazily at the moment the `HarvestClient` opens the WebSocket connection, not at element mount time. This guarantees that `HArvest.config()` has always run before it is consulted, regardless of script load order.

### HArvest.config()

Sets page-level defaults inherited by all `<hrv-card>` and `<hrv-group>` elements on the page. Call it once, immediately after the script tag. Must be called before any card connects, but because config is resolved lazily this is guaranteed as long as the call appears before the closing `</body>` tag.

```javascript
HArvest.config({
  haUrl: "https://myhome.duckdns.org",
  token: "hwt_a3F9bC2d114eF5A6b7c8dE",
  themeUrl: "https://myblog.com/themes/midnight-blue.json",
  lang: "auto",
});
```

All fields are optional. Only the fields provided are set as defaults. Calling `HArvest.config()` a second time merges the new values into the existing config rather than replacing it, so multiple calls are safe. The last-written value for any given key wins.

| Config key | Equivalent attribute | Description |
|------------|---------------------|-------------|
| `haUrl` | `ha-url` | External URL of the HA instance |
| `token` | `token` | Default widget token ID |
| `themeUrl` | `theme-url` | Default theme JSON URL |
| `lang` | `lang` | Default display language |

With `HArvest.config()` set, a minimal single-card page requires only two lines in the head and one element in the body:

```html
<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/dist/harvest.min.js"></script>
<script>HArvest.config({ haUrl: "https://myhome.duckdns.org", token: "hwt_a3F9bC2d114eF5A6b7c8dE" });</script>
```

```html
<hrv-card entity="light.bedroom_main"></hrv-card>
```

### hrv-card Attributes

```html
<hrv-card
  token="hwt_a3F9bC2d114eF5A6b7c8dE"
  ha-url="https://myhome.duckdns.org"
  entity="light.bedroom_main"
  companion="light.patio, lock.patio_gate"
  on-offline="dim"
  on-error="message"
  offline-text="Smart home is offline"
  error-text="Widget unavailable"
  tap-action="toggle"
  hold-action='{"action":"set","data":{"brightness":255}}'
  double-tap-action="toggle"
  show-history="true"
  hours-to-show="24"
  graph="line"
  lang="auto"
  a11y="standard"
  theme-url="https://myblog.com/themes/midnight-blue.json"
></hrv-card>
```

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `token` | string | from `HArvest.config()` or group | Widget token ID |
| `ha-url` | string | from `HArvest.config()` or group | External URL of the HA instance |
| `entity` | string | required if no `alias` | Primary entity ID in plain HA format (e.g. `light.bedroom_main`). If both `entity` and `alias` are present, `entity` takes priority and `alias` is ignored with a console warning. |
| `alias` | string | none | Opaque alias for the entity, generated by the wizard when "Obscure entity names" is selected. Used only when `entity` is not set. The real entity ID never appears in the HTML when using this attribute. |
| `companion` | comma-separated entity references | none | Up to 4 secondary entities. Values are real entity IDs when the card uses `entity=`, or aliases when the card uses `alias=`. The server resolves companion values using the same lookup as the primary entity. See Section 14. |
| `on-offline` | `dim`, `hide`, `message`, `last-state` | `last-state` | Behaviour when HA is unreachable |
| `on-error` | `dim`, `hide`, `message` | `message` | Behaviour on auth or entity errors |
| `offline-text` | string | "Temporarily offline" | Message shown when `on-offline` is `message` |
| `error-text` | string | "Widget unavailable" | Message shown when `on-error` is `message` |
| `tap-action` | string or JSON | `"toggle"` | Action on single tap. See Section 20. |
| `hold-action` | string or JSON | none | Action on long press (500ms). See Section 20. |
| `double-tap-action` | string or JSON | none | Action on double tap (within 300ms). See Section 20. |
| `show-history` | boolean | `false` | Show history graph below the card controls |
| `hours-to-show` | integer | `24` | History window in hours |
| `graph` | `line`, `bar` | `line` | Graph type |
| `lang` | BCP 47 language tag or `"auto"` | `"auto"` | Widget display language. `"auto"` uses `navigator.language`. |
| `a11y` | `standard`, `enhanced` | `standard` | `enhanced` adds aria-live region announcements for state changes |
| `theme-url` | URL | none | URL to a theme JSON file |
| `theme` | inline JSON | none | Inline theme object. Avoid in CMS environments. |
| `double-tap-action` | string or JSON | none | Action on double tap (within 300ms). See Section 20. |
| `show-history` | boolean | `false` | Show history graph below the card controls |
| `hours-to-show` | integer | `24` | History window in hours |
| `graph` | `line`, `bar` | `line` | Graph type |
| `lang` | BCP 47 language tag or `"auto"` | `"auto"` | Widget display language. `"auto"` uses `navigator.language`. |
| `a11y` | `standard`, `enhanced` | `standard` | `enhanced` adds aria-live region announcements for state changes |
| `theme-url` | URL | none | URL to a theme JSON file |
| `theme` | inline JSON | none | Inline theme object. Avoid in CMS environments. |

### hrv-group Element

The `<hrv-group>` element provides shared context to child `<hrv-card>` elements. Any attribute set on the group is inherited by all children that do not specify their own value for that attribute. Its purpose is grouping related cards so they share configuration and can be styled or laid out together. It renders as a plain block-level element with no layout opinions of its own - the host page owns layout.

```html
<hrv-group
  token="hwt_a3F9bC2d114eF5A6b7c8dE"
  ha-url="https://myhome.duckdns.org"
  theme-url="https://myblog.com/themes/midnight-blue.json"
  lang="auto"
>
  <hrv-card entity="light.bedroom_main"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
  <hrv-card entity="sensor.bedroom_temperature"></hrv-card>
</hrv-group>
```

If `HArvest.config()` has been called with `haUrl` and `token`, the group does not need those attributes. A minimal group with page-level config requires only:

```html
<hrv-group>
  <hrv-card entity="light.bedroom_main"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
</hrv-group>
```

Child `<hrv-card>` elements resolve `token`, `ha-url`, `theme-url`, and `lang` by first checking their own attributes, then the parent `<hrv-group>`, then `HArvest.config()`. See the Configuration Inheritance section above.

The data-attribute equivalent for CMS environments:

```html
<div class="hrv-group"
     data-token="hwt_a3F9bC2d114eF5A6b7c8dE"
     data-ha-url="https://myhome.duckdns.org">
  <div class="hrv-mount" data-entity="light.bedroom_main"></div>
  <div class="hrv-mount" data-entity="fan.bedroom_ceiling"></div>
</div>
```

### Error State Attribute

The widget exposes its current state via a `data-harvest-state` attribute, allowing CSS-only styling of error states by the page author.

```html
<hrv-card data-harvest-state="HRV_OFFLINE" ...></hrv-card>
```

### JS Callback Configuration

```javascript
// Set page-level defaults once
HArvest.config({
  haUrl: "https://myhome.duckdns.org",
  token: "hwt_a3F9bC2d114eF5A6b7c8dE",
});

// Create a card programmatically (ha-url and token inherited from config above)
HArvest.create({
  entity: "light.bedroom_main",
  target: "my-card-div",
  onOffline: (code) => { },
  onReconnect: () => { },
  onError: (code, message) => { },
  onStateChange: (state, attributes) => { }
});
```

### JS Extended API

```javascript
const card = HArvest.getCard("light.bedroom_main");
card.track.state((newState, oldState) => { });
card.track.attribute("brightness", (newVal, oldVal) => { });
card.sendCommand("turn_on", { brightness: 200 });

HArvest.track.anyState((entityId, newState) => { });
HArvest.registerRenderer("light", MyCustomLightCard);
```

### Optimistic UI

When the user sends a command (toggle a switch, move a slider), the widget applies the expected visual change immediately without waiting for the server `state_update`. If the `ack` returns `success: false`, or if no `ack` is received within 5 seconds, the widget reverts to the last confirmed state. This makes the widget feel local rather than remote, even on connections with latency.

---

## 11. Theme Format and Styling

Themes are plain JSON objects defining CSS custom property values. They are importable, exportable, and shareable as text.

### Three-Tier Styling Model

HArvest provides three independent styling mechanisms, from simplest to most powerful:

**Tier 1 - CSS Custom Properties (the easy path).** Named CSS variables that pierce the shadow DOM boundary by design. Used for theme JSON files, HTML attribute config, and JS config. The recommended path for most users and all non-developers.

**Tier 2 - `::part()` Selectors (the power user path).** Every meaningful DOM element inside the shadow DOM carries a `part="..."` attribute. The host page stylesheet targets these directly using standard CSS:

```css
hrv-card::part(toggle-button) {
  background: hotpink;
  border-radius: 0;
}
hrv-card::part(brightness-slider) {
  accent-color: coral;
}
```

**Tier 3 - Custom Renderer (the developer path).** Register a completely custom renderer class for any entity type via `HArvest.registerRenderer()`. Full control over HTML structure, CSS, and behaviour. Existing renderers can be extended:

```javascript
class MyLightCard extends HArvest.renderers.LightCard {
  render(definition, shadowRoot) {
    super.render(definition, shadowRoot);
  }
}
HArvest.registerRenderer("light", MyLightCard);
```

### Bundled Themes

HArvest ships the following themes in `widget/themes/`:

- `default.json` - clean, neutral, works on any background. Includes both light and dark variable sets.
- `glassmorphism.json` - frosted glass effect, designed for pages with full-bleed background images.
- `accessible.json` - high contrast, minimum 44x44px touch targets, no animations, clear focus indicators. Meets WCAG AA.

### Dark Mode and Light Mode

The default theme defines CSS variable values for both light and dark colour schemes using the `prefers-color-scheme` media query inside the shadow DOM:

```css
:host {
  --hrv-card-background-color: #ffffff;
  --hrv-card-color: #1a1a1a;
}
@media (prefers-color-scheme: dark) {
  :host {
    --hrv-card-background-color: #1e1e2e;
    --hrv-card-color: #e0e0ff;
  }
}
```

Cards follow the OS/browser dark mode setting automatically with no configuration. Theme JSON files may optionally include a `dark_variables` object alongside `variables` to define an explicit dark variant:

```json
{
  "name": "My Theme",
  "variables": { "--hrv-card-background-color": "#ffffff" },
  "dark_variables": { "--hrv-card-background-color": "#1e1e2e" }
}
```

### Theme Object Format

```json
{
  "name": "Midnight Blue",
  "author": "sfox38",
  "version": "1.0",
  "harvest_version": 1,
  "variables": {
    "--hrv-card-background-color": "#1a1a2e",
    "--hrv-card-color": "#e0e0ff",
    "--hrv-card-accent-color": "#4a90d9",
    "--hrv-card-border-radius": "12px",
    "--hrv-card-border": "1px solid #2a2a4e",
    "--hrv-card-box-shadow": "0 2px 8px rgba(0,0,0,0.4)",
    "--hrv-card-padding": "16px",
    "--hrv-card-font-family": "inherit",
    "--hrv-card-font-size": "14px",
    "--hrv-card-min-width": "200px",
    "--hrv-card-max-width": "400px",
    "--hrv-name-color": "#e0e0ff",
    "--hrv-name-font-size": "14px",
    "--hrv-name-font-weight": "600",
    "--hrv-name-margin-bottom": "8px",
    "--hrv-state-on-color": "#4a90d9",
    "--hrv-state-off-color": "#444466",
    "--hrv-state-unavailable-color": "#666666",
    "--hrv-state-font-size": "12px",
    "--hrv-toggle-background-color-on": "#4a90d9",
    "--hrv-toggle-background-color-off": "#444466",
    "--hrv-toggle-border-radius": "999px",
    "--hrv-toggle-width": "48px",
    "--hrv-toggle-height": "26px",
    "--hrv-toggle-transition-duration": "200ms",
    "--hrv-slider-track-color": "#333355",
    "--hrv-slider-fill-color": "#4a90d9",
    "--hrv-slider-thumb-color": "#ffffff",
    "--hrv-slider-thumb-size": "18px",
    "--hrv-slider-height": "6px",
    "--hrv-slider-border-radius": "3px",
    "--hrv-icon-size": "24px",
    "--hrv-icon-color-on": "#4a90d9",
    "--hrv-icon-color-off": "#444466",
    "--hrv-stale-indicator-display": "block",
    "--hrv-stale-indicator-color": "#888888",
    "--hrv-stale-indicator-size": "16px",
    "--hrv-stale-overlay-opacity": "0.6",
    "--hrv-error-background-color": "#2a1a1a",
    "--hrv-error-color": "#ff8888",
    "--hrv-error-font-size": "12px",
    "--hrv-companion-icon-size": "20px",
    "--hrv-companion-gap": "8px"
  }
}
```

All HArvest CSS variables are prefixed `--hrv-` and named to mirror their underlying CSS property. The widget silently ignores unknown variables. Third-party theme authors must only use variables from the published list.

### Stale Indicator

When the widget is in `HRV_STALE` or `HRV_OFFLINE` state and displaying cached data, a stale indicator renders in the top-right corner of the card. The default indicator is a small clock icon rendered as inline SVG with no external dependency. It disappears immediately when live state is restored.

Setting `--hrv-stale-indicator-display: none` hides it entirely. The card content is dimmed to `--hrv-stale-overlay-opacity`. The indicator carries `part="stale-indicator"` for `::part()` targeting.

### CSS Animations

State-change animations are driven by CSS custom properties updated in `applyState`, requiring no animation library. The fan renderer uses this pattern for the spinning icon:

```css
.fan-icon {
  animation: spin var(--hrv-fan-spin-duration, 0s) linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

```javascript
applyState(state, attributes) {
  const speed = attributes.percentage || 0;
  const duration = speed > 0 ? (2 - (speed / 100)) + "s" : "0s";
  this.root.querySelector(".fan-icon")
    .style.setProperty("--hrv-fan-spin-duration", duration);
}
```

All CSS animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .fan-icon { animation: none; }
}
```

### Named Parts Reference

Every renderer exposes a consistent set of named parts. Additional renderer-specific parts are defined in `docs/theming.md`.

| Part name | Element |
|-----------|---------|
| `card` | The outer card container |
| `card-header` | Name and icon row |
| `card-name` | Entity friendly name text |
| `card-icon` | Primary entity icon |
| `card-body` | Controls area |
| `toggle-button` | On/off toggle |
| `brightness-slider` | Brightness range input |
| `color-temp-slider` | Colour temperature range input |
| `state-label` | Current state text |
| `stale-indicator` | Stale/offline icon overlay |
| `error-message` | Error text container |
| `companion-zone` | Container for companion entity controls |
| `companion-icon` | Individual companion entity icon |
| `history-graph` | SVG graph container |

### MDI Icons

HArvest bundles a curated subset of Material Design Icons as inlined SVG strings in `widget/src/icons.js`. This provides zero-dependency icon rendering with no runtime HTTP requests. Icons are referenced by MDI name (e.g. `mdi:lightbulb`) sourced from HA's entity registry via the `entity_definition` message.

If the integration sends an icon name not present in the bundled subset, the widget falls back to `mdi:help-circle`. New icon names required for new renderers are added to `icons.js` as part of the renderer's development.

---

## 12. Versioning and Distribution

### Protocol Versioning

- This document describes HArvest Protocol version `1`.
- The `token_version` field records which spec version a token was created under.
- The integration must handle tokens from all prior versions it has ever issued.
- Breaking changes to the protocol require a version increment.
- Additive changes (new optional fields, new message types, new error codes) do not require a version increment.

### Release and CDN Distribution

The build process generates `dist/harvest.min.{hash}.js` (content-addressed filename) and `dist/harvest.min.js` (stable alias pointing to the latest build). Both files are committed to the repository. This is required for jsDelivr to serve them, since jsDelivr serves files directly from GitHub.

jsDelivr automatically mirrors any public GitHub repository. The moment a tagged release is pushed, it is available at:

```
https://cdn.jsdelivr.net/gh/sfox38/harvest@{version}/dist/harvest.min.js
```

No account, no deployment pipeline, and no configuration is required. The release workflow is: build, tag, push.

Users who want automatic updates use `@latest`. Users who want a pinned version use `@{version}`. The jsDelivr TTL for `@latest` is 12 hours.

Subresource Integrity (SRI) hashes are published in release notes for each version, allowing users to add integrity checking to their script tags for additional security.

### WordPress Plugin Versioning

The WordPress plugin bundles a specific version of `harvest.min.js` in its `assets/` folder. Plugin users receive widget updates when they update the plugin. A setting in the plugin admin page allows advanced users to use the jsDelivr CDN URL instead of the bundled file.

### Backward Compatibility

The HTML attribute interface, WebSocket protocol, and CSS variable names are backward-compatible within a major version. Breaking changes to any of these require a major version bump and a new CDN path. Users on `@1` are unaffected by a v2 release.

### Spec Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-31 | Initial specification |
| 1.1.0 | 2026-04-01 | Added connection multiplexing (Section 13). Added entity rendering model (Section 14). Auth `entity_ids` array. Added `entity_definition`, `subscribe_ok`, `unsubscribe`. Rate limiting per-entity. Renamed `ha-card` to `hrv-card`. |
| 1.2.0 | 2026-04-01 | Added CMS and WordPress compatibility (Section 15). Added `hrv-mount` data attribute mode. Added `MutationObserver`. Added `theme-url`. |
| 1.3.0 | 2026-04-03 | Added entity compatibility tiers (Section 16). Added diagnostic sensors (Section 17). Added logging and activity store (Section 18). Added integration configuration (Section 19). Added auth timeout. Added keepalive. Added message robustness and size limits. Added `entity_removed`. Updated `state_update`. Added `max_sessions`. Added multiple new error codes. Rewrote Section 11 with three-tier styling model. |
| 1.3.1 | 2026-04-03 | Reformatted prose only. No content changes. |
| 1.6.3 | 2026-04-07 | Fixed critical errors identified in review. HMAC secret storage: corrected to store plaintext in HA local storage (hash storage is impossible for HMAC verification). Updated §1 principles, §2 token_secret field reference, §5.1 signature verification description. Fixed misleading "browser enforced" origin claim in §1 - clarified origin validation is server-side on a spoofable header, reliable for browsers but not non-browser tools. Fixed HarvestClient singleton key to haUrl+tokenId pair (was haUrl only - broke multi-token pages). Updated §13 multiplexing description. Corrected session lifetime null semantics (None=unlimited for max_renewals, None=defer-to-global for absolute_lifetime_hours). Documented RateLimitConfig.override_defaults behaviour. Clarified ATTRIBUTE_DENYLIST_SUBSTRINGS is key-level substring matching; exclude_attributes is exact key matching. |
| 1.6.2 | 2026-04-07 | Clarified alias semantics throughout. `entity=` takes priority over `alias=` when both present on same element. Removed duplicate attribute table from Section 10. Companion values follow same entity/alias convention as their card primary attribute. Updated Section 14 companion spec. Updated Section 15 data attribute mapping. Updated Section 22 wizard Step 6: aliases generated at entity selection time; "Obscure entity names" is a code-format toggle (Option B) switching snippet between alias= and entity= without recreating the token; both formats work; checkbox stays interactive after Generate; companions also toggle. Updated Section 5.1 for mixed entity/alias arrays. Fixed all token example lengths to 22 chars. |
| 1.6.1 | 2026-04-07 | Clarified token_secret is stored as a hash server-side; plaintext is never retained after creation. Expanded HMAC signature verification detail in Section 5.1. Added prominent advisory warning to Section 8 path validation. Clarified three-level session lifetime relationship in token field reference. Updated applies-to version across documentation suite to v1.6.0+. |
| 1.6.0 | 2026-04-07 | Renamed `<hrv-dashboard>` to `<hrv-group>` and `class="hrv-dashboard"` to `class="hrv-group"` throughout. Note: the WordPress shortcode `[harvest_group]` was not renamed - it already used that name. `HrvDashboard` class renamed to `HrvGroup`. File `hrv-group.js` replaces `hrv-dashboard.js`. Added entity alias feature: optional `alias` field on `EntityAccess` (8-character base62), `alias` attribute on `<hrv-card>` and `data-alias` on hrv-mount divs. When present, alias takes priority over `entity`/`data-entity`. Alias is generated by the wizard when "Obscure entity names" is checked (default unchecked). Token detail screen shows both alias and real entity ID. Updated Section 2 token data model, Section 10 attribute table, Section 15 data attribute mapping, Section 22 wizard Step 6. Updated Appendix B examples. |
| 1.5.1 | 2026-04-07 | Added `HArvest.config()` page-level default mechanism. `ha-url` and `token` are now optional on `<hrv-card>` and `<hrv-group>` when resolved from `HArvest.config()`. Defined three-level inheritance chain: card attribute -> dashboard attribute -> `HArvest.config()`. Config resolution is lazy (at WebSocket connection time) to guarantee config is available regardless of script order. `HArvest.config()` merges on repeated calls. Updated JS API section with config pattern. Updated `HArvest.create()` to inherit from config. Updated data attribute mapping table. Updated Appendix B examples to show `HArvest.config()` as primary pattern. |
| 1.5.0 | 2026-04-06 | Token and session IDs changed from 32 hex characters to 22 base62 characters (a-z, A-Z, 0-9), providing 131 bits of entropy in a shorter string. Auth message nonce changed to base62. Added `trusted_proxies` CIDR list to global config schema; integration now reads real client IP from `X-Forwarded-For` when connection arrives from a trusted proxy IP. Expanded IP restrictions section with full reverse proxy documentation. WordPress plugin v1 scope locked to Classic editor shortcode only (`[harvest]` and `[harvest_group]`); Gutenberg block explicitly deferred to v1.1. Updated pre-plugin WordPress instructions to remove Gutenberg HTML block reference. Added dashboard graphs to Section 22: three SVG graphs on the dashboard home screen (commands/hour, sessions over time, auth failures/hour) and a per-token sparkline on the token detail screen, all implemented in pure SVG with no charting library. Updated Section 22 to reflect panel-design.md decisions: dashboard home screen, side-by-side token detail split, origin dropdown with registry, wizard memory, click-to-copy textareas, Web page and WordPress tabs, fully interactive live preview. |
| 1.4.0 | 2026-04-05 | Token and session IDs increased to 128 bits. Capabilities simplified to `"read"` / `"read-write"` strings (write-only removed). Added HMAC token secret and enhanced security mode. Added `active_schedule` with named timezone. Added `allowed_ips`. Added per-token and per-IP auth rate limiting. Added global attribute denylist and per-entity `exclude_attributes`. Added action validation via `ALLOWED_SERVICES`. Added `session.max_renewals` and `session.absolute_lifetime_hours`. Added localStorage key hashing. Added `last_updated` to `state_update` for ordering. Added delta attribute format. Added 50ms auth debounce. Added interleaved entity_definition and state_update delivery. Added client-side heartbeat (60s). Added client-side input debounce (300ms). Added optimistic UI spec. Added session ID cleared on expiry. Added re-auth attempt counter. Added `icon` and `icon_state_map` to `entity_definition`. Added `history_data` message. Added `show-history`, `hours-to-show`, `graph` attributes. Added `media_player` and `remote` to Tier 1. Added `harvest_action` virtual domain. Added `hrv-group` grouping element. Added companion entity pattern. Added Section 20 (Widget Interactions). Added Section 21 (Internationalisation). Added Section 22 (Panel UI and Wizard). Added MDI icon bundle. Added CSS animations. Added dark/light mode support. Added glassmorphism and accessible themes. Added WAL mode and crash recovery for SQLite. Added jsDelivr distribution. Added accessibility requirements. Added WordPress plugin notes. Removed write-only capability. Removed confirmation dialog (redundant with standard JS). Removed Lottie (community scope). |

---

## 13. Connection Multiplexing

### Problem

A naive implementation opens one WebSocket connection per `<hrv-card>` element. A page with 50 cards would open 50 concurrent connections to HA, causing browser connection limits, 50 independent auth handshakes, 50 independent rate limit counters, and unnecessary load on HA during reconnection bursts.

### Solution: HarvestClient Singleton

The widget JS maintains a single `HarvestClient` instance per unique `(ha-url, token)` pair on the page. All `<hrv-card>` elements sharing the same `ha-url` and `token` share one WebSocket connection. Cards sharing the same `ha-url` but using different tokens get separate connections - this supports pages that embed widgets from multiple tokens pointing at the same HA instance.

```
[Page with 50 hrv-card elements, all pointing at myhome.duckdns.org]

  hrv-card (light.bedroom_main)       --|
  hrv-card (light.living_room)        --|
  hrv-card (sensor.temperature)       --|--> HarvestClient singleton
  hrv-card (fan.ceiling)              --|     (one WebSocket connection)
  ... 46 more cards ...               --|
```

A page with cards pointing at two different HA instances maintains two singletons and two connections, one per host.

### Singleton Lifecycle

1. The first card to register for a given `ha-url` starts the 50ms auth debounce timer.
2. During those 50ms, all other cards that mount register their entity IDs with the singleton.
3. After 50ms, the singleton opens the WebSocket and sends a single `auth` message listing all collected entity IDs.
4. Incoming `state_update` and `entity_definition` messages are routed by `entity_id` to the correct registered card.
5. If a card is removed from the DOM, it unregisters from the singleton and sends an `unsubscribe` message for its entity if no other card needs it.
6. If all cards are removed, the singleton closes the WebSocket and cleans up.

### Reconnection

When the connection drops, the singleton manages reconnection using exponential backoff with jitter. All registered cards enter `HRV_STALE` state simultaneously, display cached last-known state, and recover together when the connection is restored. Cards do not manage reconnection independently.

### Cards Arriving Late

Cards mounted after the 50ms debounce window register with the existing singleton, which sends a `subscribe` message for the new entity. The server responds with interleaved `entity_definition` and `state_update` for that entity only.

---

## 14. Entity Rendering

### Overview

When an `entity_definition` message is received, the card selects a renderer class based on `domain` and `device_class`. The renderer builds the card's shadow DOM once, then updates only relevant elements as `state_update` messages arrive. Structure and values are separate concerns handled by separate methods.

### Renderer Lookup

```
lookup key = domain + "." + device_class   (if device_class is non-null)
             domain                         (if device_class is null)
             "generic"                      (fallback, always matches)
```

The renderer registry:

```
"light"                -> LightCard
"switch"               -> SwitchCard
"fan"                  -> FanCard
"climate"              -> ClimateCard
"cover"                -> CoverCard
"media_player"         -> MediaPlayerCard
"remote"               -> RemoteCard
"sensor.temperature"   -> TemperatureSensorCard
"sensor.humidity"      -> HumiditySensorCard
"sensor.battery"       -> BatterySensorCard
"sensor.binary"        -> BinarySensorCard
"sensor"               -> GenericSensorCard
"input_boolean"        -> InputBooleanCard
"input_number"         -> InputNumberCard
"input_select"         -> InputSelectCard
"harvest_action"       -> HarvestActionCard
"generic"              -> GenericCard  (fallback)
```

The `GenericCard` fallback renders the entity's `friendly_name` and raw `state` as plain text. It never crashes. Third-party renderers are registered via `HArvest.registerRenderer(key, RendererClass)`.

### Renderer Responsibilities

Each renderer implements two methods:

- `render(definition, shadowRoot)` - called once on entity definition. Builds the full shadow DOM structure including semantic HTML, ARIA attributes, CSS, controls, and icon rendering. Controls are conditionally rendered based on `supported_features`. Uses `<button>` for interactive controls, `<input type="range">` for sliders - never `<div>` for interactive elements.

- `applyState(state, attributes)` - called on every `state_update`. Performs targeted updates to existing DOM elements. Does not rebuild the DOM. Runs inside a `requestAnimationFrame` callback so multiple cards updating in the same tick are batched into one paint. Discards updates where `last_updated` is not newer than the last applied value.

### Capability Gating

If the token grants only `"read"` capability, the renderer must not render interactive controls. The card is display-only. This is enforced both client-side (UX) and server-side (security).

### Companion Entities

A card may display up to 4 companion entities alongside the primary entity. Companions are specified via the `companion` attribute (comma-separated entity references) or the JS `companions` config array. All companion entity references must resolve to entities in the token's entity list.

The values in the `companion` attribute follow the same convention as the card's primary entity reference: when the card uses `entity=`, companion values are real entity IDs; when the card uses `alias=`, companion values are aliases. The server resolves companion references using the same alias lookup as the primary entity - alias first, then real entity ID. A single `companion` attribute never mixes real IDs and aliases.

Companions render in a dedicated `companion-zone`. Each companion shows an icon sourced from its `entity_definition.icon_state_map` and its current state. A single tap on a companion triggers its default tap action.

Companion entities are restricted to domains that can be meaningfully represented in a compact slot: `light`, `switch`, `lock`, `binary_sensor`, `input_boolean`, `cover`, `remote`. Domains requiring rich interaction (`climate`, `fan`, `media_player`, `input_number`, `input_select`) are not permitted as companions and are rejected at render time with a console warning.

Companions with only `"read"` capability render as display-only (icon and state, no tap interaction). Companion entity availability failures are independent of the primary card - a failed companion shows a dimmed icon but does not affect primary card functionality.

### Supported Feature Strings

The integration translates HA's `supported_features` bitmask to string arrays. Defined strings per domain:

**light:** `brightness`, `color_temp`, `rgb_color`, `white_value`, `effect`, `flash`, `transition`
**fan:** `set_speed`, `oscillate`, `direction`
**cover:** `set_position`, `set_tilt_position`, `stop`
**climate:** `target_temperature`, `target_temperature_range`, `fan_mode`, `preset_mode`, `swing_mode`, `aux_heat`
**media_player:** `play_pause`, `next_track`, `previous_track`, `volume_set`, `volume_step`, `turn_on`, `turn_off`
**remote:** `learn_command`, `delete_command`

New strings may be added without a version increment, as they are additive.

### Accessibility Requirements

Every renderer must meet the following requirements regardless of the `a11y` attribute setting:

- Use semantic HTML: `<button>` for interactive controls, `<input>` for sliders and text inputs. Never `<div>` or `<span>` for interactive elements.
- All interactive elements must have a meaningful `aria-label` built from `friendly_name` and current state: e.g. `"Bedroom Light - toggle, currently on"`.
- Toggle buttons must carry `aria-pressed` reflecting current state.
- All cards must be fully keyboard navigable: Tab to focus, Space or Enter to activate buttons, arrow keys for sliders.
- The `prefers-reduced-motion` media query must be respected for all CSS animations.
- The default theme must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).

When `a11y="enhanced"` is set, the renderer additionally maintains an `aria-live="polite"` region that announces meaningful state changes to screen readers without interrupting the user.

### History Graph

When `show-history="true"` is set, the renderer renders an SVG graph below the card controls after receiving the `history_data` message. Graph types `line` (SVG polyline) and `bar` (SVG rects) are supported in v1. The graph is implemented in pure SVG with no charting library dependency. New points from subsequent `state_update` messages are appended and points older than `hours-to-show` are dropped. "No history available" is shown when `points` is empty.

### CSS Isolation

Each renderer's styles are scoped inside the shadow DOM. Host page styles cannot override them directly. The three-tier styling model (CSS custom properties, `::part()` selectors, and custom renderers) provides the designed escape hatches. See Section 11.

---

## 15. CMS and WordPress Compatibility

This section documents behaviour built into the core widget to ensure it works correctly when embedded in WordPress and other CMS platforms. A dedicated WordPress plugin is a planned deliverable.

### The Problem with Custom Elements in CMS Editors

WordPress sanitises HTML entered into its editors. Unknown HTML elements may be stripped on save or wrapped in `<p>` tags; unknown attributes may be removed; and JSON in attributes may have quotes converted to curly/smart quotes, breaking JSON parsing.

### Solution: Data Attribute Mount Mode

```html
<div class="hrv-mount"
     data-token="hwt_a3F9bC2d114eF5A6b7c8dE"
     data-ha-url="https://myhome.duckdns.org"
     data-entity="light.bedroom_main"
     data-companion="light.patio, lock.patio_gate"
     data-on-offline="dim"
     data-theme-url="https://myblog.com/themes/midnight-blue.json">
</div>
```

The `hrv-group` equivalent for CMS:

```html
<div class="hrv-group"
     data-token="hwt_a3F9bC2d114eF5A6b7c8dE"
     data-ha-url="https://myhome.duckdns.org">
  <div class="hrv-mount" data-entity="light.bedroom_main"></div>
  <div class="hrv-mount" data-entity="fan.bedroom_ceiling"></div>
</div>
```

### Data Attribute Mapping

| `<hrv-card>` attribute | `data-` equivalent | Notes |
|------------------------|-------------------|-------|
| `token` | `data-token` | Optional if set via `HArvest.config()` or parent `hrv-group` |
| `ha-url` | `data-ha-url` | Optional if set via `HArvest.config()` or parent `hrv-group` |
| `entity` | `data-entity` | Required if no `alias`. If both `data-entity` and `data-alias` are present, `data-entity` takes priority. |
| `alias` | `data-alias` | Use instead of `data-entity` when entity names are obscured. Ignored if `data-entity` is also present. |
| `companion` | `data-companion` | Comma-separated entity IDs or aliases, matching the convention of the primary entity attribute. |
| `companion` | `data-companion` | Optional |
| `on-offline` | `data-on-offline` | Optional |
| `on-error` | `data-on-error` | Optional |
| `offline-text` | `data-offline-text` | Optional |
| `error-text` | `data-error-text` | Optional |
| `theme-url` | `data-theme-url` | Optional. Always use instead of inline JSON in CMS. |
| `lang` | `data-lang` | Optional |
| `show-history` | `data-show-history` | Optional |
| `hours-to-show` | `data-hours-to-show` | Optional |
| `graph` | `data-graph` | Optional |
| `theme` | Not supported in data mode | Use `data-theme-url` instead. |

### MutationObserver-Based Card Discovery

The data-attribute mount mode uses two div classes with distinct roles:

- **`.hrv-mount`** - the individual widget element. Each `.hrv-mount` div becomes one `<hrv-card>`. It carries the `data-entity` (or `data-alias`), and optionally `data-token`, `data-ha-url`, and other card-level attributes.
- **`.hrv-group`** - the optional container element. A `.hrv-group` div wraps multiple `.hrv-mount` divs and provides shared `data-token` and `data-ha-url` that child mounts inherit if they do not specify their own.

The widget uses a `MutationObserver` to watch the entire document for newly added elements of any of these types: `hrv-card` (custom element), `.hrv-mount` (data attribute widget), `hrv-group` (custom element), and `.hrv-group` (data attribute container). Both `DOMContentLoaded` and `MutationObserver` run in parallel. The widget must not throw if `document.body` is null at execution time and must not rely on globals set by other scripts.

### Content Security Policy Guidance

When a WebSocket connection is blocked by CSP, the widget catches the error, sets state to `HRV_OFFLINE`, and logs a clear console warning:

```
[HArvest] WebSocket connection to wss://myhome.duckdns.org blocked.
If you are using a WordPress security plugin, add the following to your
Content Security Policy connect-src directive:
  wss://myhome.duckdns.org
```

### WordPress Plugin

The WordPress plugin is a planned v1 deliverable that provides Classic editor shortcode support. Gutenberg block support is deferred to v1.1. Many WordPress power users use third-party themes and the Classic editor, making a shortcode-first approach practical and sufficient for the initial release.

The v1 plugin provides:

- `[harvest token="..." entity="..."]` shortcode for Classic editor posts and pages
- `[harvest_group]` wrapping shortcode for grouped cards
- Settings page for global HA URL, default theme URL, and widget JS source (bundled vs CDN)
- Automatic CSP header injection via `wp_headers` hook adding the HA URL to `connect-src`
- Bundled `harvest.min.js` with a CDN override option in settings
- Registration of `application/json` as an allowed upload MIME type for theme files
- Per-site configuration on WordPress multisite networks

The shortcode outputs an `hrv-mount` div. The HA URL comes from the plugin settings page rather than the shortcode, so users do not repeat it on every widget.

Gutenberg block support (v1.1) will add a native block with a visual inspector panel, eliminating the need to write shortcode syntax by hand. The shortcode remains fully functional alongside the block.

### Managed WordPress Hosting

Some managed WordPress hosts (WP Engine, Kinsta, Pressable, etc.) terminate long-lived connections after a timeout (commonly 60 seconds). The widget's existing reconnection and session renewal logic handles this transparently. Plugin documentation notes which hosts have confirmed WebSocket support.

### Recommended User Instructions for WordPress (Pre-Plugin)

1. Use a plugin that allows raw HTML in posts and pages (any HTML/code block plugin or the Classic editor).
2. Add the `<script>` tag to the theme header via a header injection plugin or `functions.php`.
3. Use `<div class="hrv-mount" data-...>` syntax in HTML blocks, not `<hrv-card>`.
4. Upload theme JSON files to the WordPress media library and reference the URL in `data-theme-url`.
5. Add the HA URL to the `connect-src` CSP directive manually until the plugin automates this.

---

## 16. Entity Compatibility

### Three-Tier Model

**Tier 1 - Fully Supported.** A dedicated renderer exists. Polished appearance, all controls present, all standard attributes exposed. Explicitly tested with each release.

**Tier 2 - Generic Support.** The `GenericCard` fallback handles the entity. Friendly name and current state as text, basic toggle if supported. Functional but not visually rich. Works automatically for any HA entity.

**Tier 3 - Explicitly Unsupported.** Blocked at token creation time. Returns `HRV_ENTITY_INCOMPATIBLE` if attempted.

### Tier 1 - Fully Supported Domains (v1)

| Domain | v1 Features |
|--------|-------------|
| `light` | Toggle, brightness, color temp, RGB |
| `switch` | Toggle |
| `sensor` | temperature, humidity, battery, pressure, illuminance, power, energy, voltage, current |
| `binary_sensor` | motion, door, window, presence, smoke, moisture, occupancy |
| `fan` | Toggle, speed, oscillate, direction, spinning CSS animation |
| `cover` | Open, close, stop, position |
| `climate` | Mode, target temp, current temp |
| `input_boolean` | Toggle |
| `input_number` | Slider and value display |
| `input_select` | Dropdown |
| `media_player` | Power, play/pause, next, previous, volume set/step, track title, artist, album |
| `remote` | Power, activity list as buttons, send command |
| `harvest_action` | Named button triggering a server-side predefined action |

### harvest_action Virtual Domain

`harvest_action` is a virtual entity domain created by the HArvest integration itself. It allows the owner to expose a named, safe, pre-approved action without revealing any HA internals to the public widget.

The owner defines a `harvest_action` in the integration, giving it a name and mapping it to one or more HA service calls server-side. The public widget sends only:

```json
{
  "type": "command",
  "entity_id": "harvest_action.welcome_home",
  "action": "trigger",
  "data": {}
}
```

The integration executes the predefined service calls. The widget has no knowledge of what happens. `harvest_action` entities are Tier 1 and use a simple button renderer. Rate limiting and capability checks apply normally.

This is the recommended mechanism for exposing button-like interactions that would otherwise require `script`, `automation`, or `button` domains.

### Tier 3 - Explicitly Unsupported Domains (v1)

| Domain | Reason |
|--------|--------|
| `alarm_control_panel` | Security-critical. Publicly embeddable alarm control is too high risk. |
| `lock` | Physical security risk. |
| `person` | Exposes real-time location data of named individuals. |
| `device_tracker` | Same privacy concern as `person`. |
| `camera` | Video streaming is out of scope. |
| `script` | Arbitrary script execution from a public page is too broad. Use `harvest_action` instead. |
| `automation` | Same concern as `script`. |
| `scene` | Wide device effects. Deferred to v2 review. |
| `update` | Triggering firmware updates from a public page is too risky. |
| `button` | Use `harvest_action` instead for safe, scoped button-like behaviour. |

### Allowed Services by Domain

The integration maintains a hardcoded `ALLOWED_SERVICES` map. Commands with actions not in this map are rejected immediately with `HRV_PERMISSION_DENIED` before consulting HA.

```python
ALLOWED_SERVICES = {
    "light":          {"turn_on", "turn_off", "toggle"},
    "switch":         {"turn_on", "turn_off", "toggle"},
    "fan":            {"turn_on", "turn_off", "toggle", "set_percentage", "oscillate", "set_direction"},
    "cover":          {"open_cover", "close_cover", "stop_cover", "set_cover_position"},
    "climate":        {"turn_on", "turn_off", "set_temperature", "set_hvac_mode", "set_fan_mode", "set_preset_mode"},
    "input_boolean":  {"turn_on", "turn_off", "toggle"},
    "input_number":   {"set_value"},
    "input_select":   {"select_option"},
    "media_player":   {"media_play_pause", "media_next_track", "media_previous_track",
                       "volume_up", "volume_down", "volume_set", "turn_on", "turn_off"},
    "remote":         {"turn_on", "turn_off", "send_command"},
    "harvest_action": {"trigger"},
    # sensor, binary_sensor: intentionally absent - read-only domains with no HA services.
    # A widget displaying a sensor never sends a command, so these domains never reach
    # this check. Absence from the map is correct, not an omission.
}
```

Unknown keys in `data` payloads are stripped before forwarding to HA.

### Compatibility in the Panel UI

Tier 1 entities show their renderer name and a "Fully supported" badge. Tier 2 entities show "Generic support - basic display only". Tier 3 entities are greyed out with a tooltip explaining why they cannot be used.

### Community Renderers

`HArvest.registerRenderer()` is public API. Anyone can build and share a Tier 1 renderer for any domain. `docs/compatibility.md` documents how to build and submit a renderer.

---

## 17. Diagnostic Sensors

The integration automatically creates HA sensor entities on install for monitoring HArvest activity from within HA.

### Global Sensors

| Entity ID | Domain | Description |
|-----------|--------|-------------|
| `sensor.harvest_active_sessions` | sensor | Currently connected sessions |
| `sensor.harvest_active_tokens` | sensor | Non-expired, non-revoked tokens |
| `sensor.harvest_commands_today` | sensor | Commands received today |
| `sensor.harvest_errors_today` | sensor | Auth failures and errors today |
| `binary_sensor.harvest_running` | binary_sensor | Integration health |

### Per-Token Sensors

Created when a token is created. `{label}` is derived from the token label, slugified. Removed when the token is deleted.

| Entity ID | Domain | Description |
|-----------|--------|-------------|
| `sensor.harvest_{label}_sessions` | sensor | Active sessions for this token |
| `sensor.harvest_{label}_last_seen` | sensor | Last activity timestamp |
| `sensor.harvest_{label}_last_origin` | sensor | Most recent connecting origin |
| `sensor.harvest_{label}_commands_today` | sensor | Commands today via this token |

### Use in HA Automations

These are standard HA entities usable in automations. Example: send a mobile notification when `harvest_suspicious_origin` fires on the HA event bus.

---

## 18. Logging and Activity Store

### Architecture

HArvest uses a two-store logging architecture.

**HArvest Activity Store** (`harvest_activity.db`) is a SQLite file in the HA config directory, managed by the integration using `aiosqlite` for async access. It stores all token activity in a structured schema purpose-built for the panel UI and diagnostic sensors. Writes are batched to handle concurrent sessions gracefully. Retention is controlled by `activity_log_retention_days`.

**HA Event Bus:** selected security-relevant events are optionally published to the HA event bus, making them available to HA automations and the standard HA logbook. Configurable per event type in the HArvest panel.

HA's built-in recorder is not used for HArvest activity. High-frequency writes would bloat the recorder database, which HA users carefully manage for performance.

### Database Reliability

The integration opens the SQLite database with WAL (Write-Ahead Logging) mode and `synchronous=NORMAL` for crash safety without sacrificing performance:

```python
await db.execute("PRAGMA journal_mode=WAL")
await db.execute("PRAGMA synchronous=NORMAL")
```

On integration startup, before accepting any connections, the integration runs `PRAGMA integrity_check`. If this returns anything other than `ok`, the corrupt file is renamed to `harvest_activity.corrupt.{timestamp}.db` and a fresh database is created. All security-critical data (tokens, sessions) lives in HA's own storage, so recreation of the activity log is safe.

A graceful shutdown handler flushes any pending batched writes before the process exits. A periodic WAL checkpoint (hourly, `PASSIVE` mode) prevents the WAL file from growing indefinitely.

### Activity Store Schema

| Table | Contents |
|-------|----------|
| `sessions` | token_id, origin, created_at, last_active, closed_at |
| `commands` | session_id, entity_id, action, timestamp, success |
| `errors` | session_id, code, message, timestamp |
| `auth_events` | token_id, origin, result, timestamp |

### HA Event Bus Events

| Event | Default | Description |
|-------|---------|-------------|
| `harvest_token_revoked` | On | A token was manually revoked |
| `harvest_suspicious_origin` | On | Origin mismatch on a non-allow_any token |
| `harvest_session_limit_reached` | On | A token's max_sessions limit was hit |
| `harvest_flood_protection` | On | Flood protection triggered on a session |
| `harvest_session_connected` | Off | New session connected (noisy on busy installs) |
| `harvest_auth_failure` | Off | Auth attempt failed (noisy on busy installs) |

### Backup Note

`harvest_activity.db` is not included in HA's default backup unless the user explicitly includes the config directory in their backup scope. The panel UI notes this clearly.

---

## 19. Integration Configuration

Config flow on install requires no user input beyond confirming the integration is active. All ongoing management is handled via the HArvest custom sidebar panel.

### Global Configuration Schema

```json
{
  "auth_timeout_seconds": 10,
  "max_entities_per_token": 50,
  "max_entities_hard_cap": 250,
  "max_inbound_message_bytes": 4096,
  "keepalive_interval_seconds": 30,
  "keepalive_timeout_seconds": 10,
  "heartbeat_timeout_seconds": 60,
  "activity_log_retention_days": 30,
  "absolute_session_lifetime_hours": 72,
  "max_auth_attempts_per_token_per_minute": 10,
  "max_auth_attempts_per_ip_per_minute": 20,
  "max_connections_per_minute": 100,
  "trusted_proxies": [],
  "default_rate_limits": {
    "max_push_per_second": 1,
    "max_commands_per_minute": 30
  },
  "default_session": {
    "lifetime_minutes": 60,
    "max_lifetime_minutes": 1440
  },
  "ha_event_bus": {
    "harvest_token_revoked": true,
    "harvest_suspicious_origin": true,
    "harvest_session_limit_reached": true,
    "harvest_flood_protection": true,
    "harvest_session_connected": false,
    "harvest_auth_failure": false
  }
}
```

### Field Reference

| Field | Default | Description |
|-------|---------|-------------|
| `auth_timeout_seconds` | 10 | Seconds to wait for `auth` after WebSocket open |
| `max_entities_per_token` | 50 | Soft cap enforced at token creation time |
| `max_entities_hard_cap` | 250 | Absolute maximum, cannot be exceeded by token config |
| `max_inbound_message_bytes` | 4096 | Hard limit on inbound WebSocket message size |
| `keepalive_interval_seconds` | 30 | Server ping frame interval |
| `keepalive_timeout_seconds` | 10 | Time to wait for pong before closing session |
| `heartbeat_timeout_seconds` | 60 | Client-side: reconnect if no message received within this period |
| `activity_log_retention_days` | 30 | SQLite activity log retention |
| `absolute_session_lifetime_hours` | 72 | Global hard cap on session age across all renewals |
| `max_auth_attempts_per_token_per_minute` | 10 | Failed auth attempts per token before temporary block |
| `max_auth_attempts_per_ip_per_minute` | 20 | Connection attempts per IP before HTTP 429 |
| `max_connections_per_minute` | 100 | Total new WebSocket connections per minute (global) |
| `trusted_proxies` | `[]` | CIDR ranges of trusted reverse proxies. When a connection arrives from one of these IPs, the real client IP is read from `X-Forwarded-For`. Empty list disables proxy IP forwarding. |
| `default_rate_limits` | see above | Applied to tokens with `override_defaults: false` |
| `default_session` | see above | Applied to tokens without explicit session config |
| `ha_event_bus` | see above | Per-event toggles for HA event bus publishing |

---

## 20. Widget Interactions

### Tap, Hold, and Double Tap

Every `<hrv-card>` and companion supports three interaction types. Each is configurable independently.

| Interaction | Threshold | Attribute |
|-------------|-----------|-----------|
| Single tap | Immediate on release | `tap-action` |
| Long press | 500ms hold | `hold-action` |
| Double tap | Two taps within 300ms | `double-tap-action` |

Action values can be a simple string for common actions or a JSON object for actions requiring data:

```html
<hrv-card
  entity="light.bedroom_main"
  tap-action="toggle"
  hold-action='{"action":"set","data":{"brightness":255}}'
  double-tap-action="toggle"
></hrv-card>
```

Via JS config:

```javascript
HArvest.create({
  tapAction: { action: "toggle" },
  holdAction: { action: "set", data: { brightness: 255 } },
  doubleTapAction: { action: "toggle" }
});
```

### Action Types

| Action string | Description |
|---------------|-------------|
| `"toggle"` | Toggle the entity on/off |
| `"turn_on"` | Turn on |
| `"turn_off"` | Turn off |
| `{"action":"set","data":{...}}` | Call a service with specific data |
| `"none"` | No action |

### Companion Tap Actions

Companion entities respond to single tap only. The default tap action for a companion is `"toggle"` if the entity supports it, otherwise `"none"`. The companion tap action is not separately configurable in v1 beyond the default.

---

## 21. Internationalisation

### Overview

The widget ships with a small `i18n.json` bundle covering all user-visible strings. The display language is set via the `lang` attribute on `<hrv-card>` or `<hrv-group>`, or via `data-lang` in mount mode. `lang="auto"` (the default) detects the language from `navigator.language` and falls back to English if the detected language is not bundled.

### Bundled Languages (v1)

English (`en`), German (`de`), French (`fr`), Spanish (`es`), Portuguese (`pt`), Japanese (`ja`), Chinese Simplified (`zh`), Thai (`th`).

Community translations are submitted as pull requests adding a new language file. The contribution process is documented in `docs/contributing.md`.

### String Keys

```json
{
  "en": {
    "state.on": "On",
    "state.off": "Off",
    "state.unavailable": "Unavailable",
    "state.unknown": "Unknown",
    "state.open": "Open",
    "state.closed": "Closed",
    "state.idle": "Idle",
    "state.heating": "Heating",
    "state.cooling": "Cooling",
    "state.playing": "Playing",
    "state.paused": "Paused",
    "error.auth_failed": "Widget unavailable",
    "error.entity_missing": "Device unavailable",
    "error.offline": "Temporarily offline",
    "error.connecting": "Connecting...",
    "indicator.stale": "Last known state",
    "history.unavailable": "No history available"
  }
}
```

---

## 22. Panel UI and Widget Creation Wizard

### Overview

The HArvest panel is a custom HA sidebar panel registered by the integration. It is the primary management interface for tokens, sessions, activity, and diagnostics. All ongoing management happens here; config flow handles only the initial install confirmation.

The panel is built in TypeScript with React, compiled to a single JS bundle by Vite. The compiled bundle is committed to the repository. End users installing via HACS do not need Node.js or any build toolchain; contributors developing the frontend require Node.js and Vite. The full panel design including screen layouts, wizard step details, and component specifications is documented in `docs/panel-design.md`.

### Dashboard Home Screen

The panel opens on a dashboard home screen rather than directly on the token list. The dashboard provides an at-a-glance view of integration health and activity without navigating into any sub-screen.

**Global sensor cards** display live values for active sessions, active tokens, commands today, errors today, and database size. Each card is clickable and navigates to the relevant filtered view.

**Dashboard graphs** surface activity trends visually using SVG-based charts with no charting library dependency. Three graphs are shown on the dashboard home screen:

- Commands per hour over the last 24 hours (bar graph)
- Active sessions over the last 24 hours (line graph)
- Auth failures per hour over the last 24 hours (bar graph)

A fourth sparkline graph appears on the token detail screen showing session activity for that specific token over the last 7 days. Graph data is sourced from the activity store via the `query_aggregates()` method. All graphs are implemented in pure SVG with no external library.

**Recent activity** shows the last 4 events across all tokens with a link to the full activity log.

**Tokens expiring soon** lists any tokens expiring within 7 days with direct links to their detail screens.

### Widget Creation Wizard

The wizard is a required feature of the panel, not optional. It is the primary path through which non-developer users create widgets. Its goal is to reduce widget creation to under 2 minutes for any user familiar with their HA setup.

The wizard is create-only. Editing an existing token uses the token detail edit mode. The wizard remembers previous selections in `localStorage` and pre-populates all fields except the entity selection on next use.

**Step 1 - Pick entities.** A searchable entity picker showing friendly names, icons, and current state. A mode toggle selects between single card and dashboard group mode. In single card mode one primary entity is selected plus up to 4 optional companions. In dashboard group mode multiple primary entities are selected, each with its own companion picker. Tier 3 entities are shown greyed out with a tooltip explaining why they cannot be used.

**Step 2 - Set permissions.** Two simple options: "Visitors can view only" (read) or "Visitors can view and control" (read-write).

**Step 3 - Set origin.** A radio button pair: "A specific website" shows a dropdown of saved origins from the global Settings registry, with an inline form to add a new origin without leaving the wizard. Port numbers are supported. "Any website" sets `allow_any: true` with a security warning shown inline when read-write was also selected.

**Step 4 - Set expiry.** Radio buttons: Never, 30 days, 90 days, 1 year, Custom date. An Advanced expand contains schedule, IP restrictions, session limits, and HMAC toggle.

**Step 5 - Choose appearance.** A dropdown populated from the theme registry (bundled themes plus any custom themes added in Settings). A live preview renders a fully interactive card using a short-lived preview token with the same capability as the token being created.

**Step 6 - Generate.** The wizard creates the token and displays the output with click-to-copy textareas. Two tabs show the Web page snippet and the WordPress shortcode equivalent. A live interactive preview is shown. The HMAC token secret, if enabled, is displayed once with a mandatory acknowledgement checkbox before the wizard can be closed.

Step 6 includes a code format toggle:

**Obscure entity names** (checkbox, default unchecked): controls whether the generated code snippet uses `alias=` or `entity=` attribute names. The aliases themselves are generated at entity selection time (Step 1) and are already determined when Step 6 is reached. Checking the box switches the snippet to use `alias="dJ5x3Apd"` format; unchecking switches it back to `entity="light.bedroom_main"` format. Both versions of the snippet work correctly against the same token - the token always stores both the alias and the real entity ID, and the server accepts either format. Companion entity references in the snippet are also shown as aliases or real IDs matching the primary entity format. The checkbox remains interactive after Generate and on the token detail Code section, allowing the owner to copy either format at any time. The wizard never outputs both `entity=` and `alias=` on the same element.

### Panel Features

- Dashboard home screen with global sensor cards and SVG activity graphs
- Token list with status indicators (active, expiring soon, expired, revoked), pagination, and archived token section
- Token detail view: side-by-side split with token info and generated code on the left, live sessions and activity on the right
- Per-token sparkline graph on the token detail right panel
- Session viewer: who is connected right now, from which origin, how long
- Activity log with filtering by token, date range, and event type, with pagination and CSV export
- Settings screen with auto-save on blur, Allowed Origins registry, and Themes registry
- Revoke button per token with optional revoke reason
- One-click token duplication for creating similar tokens

---

## Appendix A - Repository Structure

```
sfox38/                          (monorepo root)
  SPEC.md                           (this document)
  LICENSE                           (MIT)
  README.md
  integration/                      (HACS custom integration - Python)
    custom_components/
      harvest/
        __init__.py
        manifest.json
        config_flow.py
        token_manager.py
        session_manager.py
        ws_proxy.py
        http_views.py
        rate_limiter.py
        entity_definition.py
        entity_compatibility.py
        diagnostic_sensors.py
        activity_store.py           (aiosqlite, WAL mode, crash recovery)
        event_bus.py                (HA event bus publishing)
        panel.py                    (custom sidebar panel registration)
        harvest_action.py           (virtual domain for safe action exposure)
        icons.py                    (MDI icon name validation)
        const.py
    hacs.json
    frontend/                       (custom sidebar panel UI - TypeScript + React, compiled by Vite)
      src/
        components/
        App.tsx
        main.tsx
      index.html
      vite.config.ts
      tsconfig.json
      dist/
        panel.js                    (compiled bundle, committed to repo)
  widget/                           (embeddable JS - vanilla Web Components)
    src/
      hrv-card.js                   (custom element, entry point)
      hrv-group.js                  (grouping element, context inheritance)
      hrv-mount.js                  (data attribute mount mode, MutationObserver)
      harvest-client.js             (HarvestClient singleton, WebSocket, debounce)
      theme-loader.js               (inline JSON, theme-url fetch, dark mode)
      state-cache.js                (localStorage with hashed keys)
      error-states.js
      icons.js                      (bundled MDI SVG subset)
      i18n.js                       (internationalisation)
      renderers/
        index.js                    (registry and lookup)
        base-card.js                (BaseCard abstract class, shared render helpers)
        light-card.js
        switch-card.js
        fan-card.js
        climate-card.js
        cover-card.js
        media-player-card.js
        remote-card.js
        sensor-temperature-card.js
        sensor-humidity-card.js
        sensor-generic-card.js
        binary-sensor-card.js
        input-boolean-card.js
        input-number-card.js
        input-select-card.js
        harvest-action-card.js
        generic-card.js             (GenericCard fallback for Tier 2 entities)
    dist/
      harvest.min.js                (stable alias, committed to repo for jsDelivr)
      harvest.min.{hash}.js         (content-addressed build artifact)
    themes/
      default.json
      glassmorphism.json
      accessible.json
    i18n/
      en.json
      de.json
      fr.json
      es.json
      pt.json
      ja.json
      zh.json
      th.json
    README.md
  docs/
    getting-started.md
    token-management.md
    theming.md
    security.md
    entity-types.md
    compatibility.md
    wordpress.md
    diagnostics.md
    panel-design.md
    contributing.md
    DESIGN.md                       (visual design spec - generated by Google Stitch before implementation)
```

### Documentation Schedule

| Document | Write when |
|----------|-----------|
| `getting-started.md` | Before coding begins. Defines the happy path. If it is hard to write, the UX needs work. |
| `security.md` | Before coding begins. Crystallises the threat model. |
| `compatibility.md` | Before coding begins. Defines v1 commitments. |
| `DESIGN.md` | Before coding begins. Generated by Google Stitch. Defines colour tokens, typography, spacing, component specs, and dark mode overrides. Variable names must align with `theming.md`. Required before widget renderers and panel UI are built. |
| `token-management.md` | Alongside integration code. |
| `theming.md` | Alongside widget code, after DESIGN.md is complete. |
| `panel-design.md` | Alongside panel code. |
| `entity-types.md` | Alongside each renderer as it is built. |
| `wordpress.md` | After the widget is functional. |
| `diagnostics.md` | After diagnostic sensors are built. |
| `contributing.md` | Before first public release. |

---

## Appendix B - Usage Examples

### Minimal single card (with HArvest.config())

The recommended pattern for most pages. Set `haUrl` and `token` once via `HArvest.config()` and every card on the page inherits them automatically.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@1.6.3/dist/harvest.min.js"></script>
  <script>
    HArvest.config({
      haUrl: "https://myhome.duckdns.org",
      token: "hwt_a3F9bC2d114eF5A6b7c8dE",
    });
  </script>
</head>
<body>

  <hrv-card entity="light.bedroom_main"></hrv-card>

</body>
</html>
```

### Multiple cards with hrv-group

Cards sharing the same token and HA URL use a single WebSocket connection automatically. `<hrv-group>` groups them and provides shared context. With `HArvest.config()` set at page level, the dashboard needs no attributes at all:

```html
<hrv-group>
  <hrv-card entity="light.bedroom_main" companion="lock.bedroom_door"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
  <hrv-card entity="sensor.bedroom_temperature" show-history="true" hours-to-show="24"></hrv-card>
</hrv-group>
```

If a card needs a different token or HA URL, set it directly on that card as an override:

```html
<hrv-group>
  <hrv-card entity="light.bedroom_main"></hrv-card>
  <hrv-card entity="light.garden" ha-url="https://myhome2.duckdns.org" token="hwt_b4G8cD3e225fG6B7c9fH2j"></hrv-card>
</hrv-group>
```

### Explicit attributes (no HArvest.config())

`ha-url` and `token` can always be set directly on any element. This is valid for single-card pages or when different cards need different configuration:

```html
<hrv-card
  token="hwt_a3F9bC2d114eF5A6b7c8dE"
  ha-url="https://myhome.duckdns.org"
  entity="light.bedroom_main"
></hrv-card>
```

### Data Attribute Mount Mode (WordPress and CMS safe)

For WordPress without the plugin, use `hrv-mount` divs. If `HArvest.config()` cannot be used (no `<script>` access), set `data-ha-url` and `data-token` on the `hrv-group` div and let child mounts inherit them:

```html
<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@1.6.3/dist/harvest.min.js"></script>

<div class="hrv-group"
     data-token="hwt_a3F9bC2d114eF5A6b7c8dE"
     data-ha-url="https://myhome.duckdns.org">
  <div class="hrv-mount"
       data-entity="light.bedroom_main"
       data-companion="lock.bedroom_door"
       data-theme-url="https://myblog.com/themes/default.json">
  </div>
  <div class="hrv-mount" data-entity="fan.bedroom_ceiling"></div>
</div>
```

When the HArvest WordPress plugin is installed, the HA URL is injected automatically by the plugin and neither `data-ha-url` nor `HArvest.config()` need to appear in any page content.
