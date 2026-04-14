# HArvest Diagnostic Sensors

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

HArvest creates a set of HA sensor entities that surface integration metrics directly in Home Assistant. These sensors can be used in HA dashboards, automations, and alerts - for example, alerting when an unexpected surge of commands occurs, or tracking whether the integration is running after an HA restart.

---

## Table of Contents

1. [Global Sensors](#global-sensors)
2. [Per-Token Sensors](#per-token-sensors)
3. [Update Frequency](#update-frequency)
4. [Using Sensors in Automations](#using-sensors-in-automations)
5. [Using Sensors in HA Dashboards](#using-sensors-in-ha-dashboards)

---

## 1. Global Sensors

Global sensors reflect the state of the entire HArvest integration, not any specific token.

### binary_sensor.harvest_running

| Property | Value |
|----------|-------|
| State | `on` (integration running), `off` (stopped or error) |
| Device class | `connectivity` |
| Icon | `mdi:leaf` |

Indicates whether the HArvest integration is active and able to accept WebSocket connections. This sensor is `off` if the integration fails to start, encounters a fatal error, or is reloaded.

Note: `running` is not a valid `BinarySensorDeviceClass` in HA core. `connectivity` is the correct class for this pattern (on = connected/running, off = disconnected/stopped).

Useful for: alerting if HArvest stops unexpectedly after an HA update or restart.

### sensor.harvest_active_sessions

| Property | Value |
|----------|-------|
| State | Integer count of currently open WebSocket sessions |
| Unit | sessions |
| Icon | `mdi:connection` |

The total number of active visitor sessions across all tokens at the moment of last update. A session is counted from the moment `auth_ok` is sent until the WebSocket closes.

Useful for: monitoring live traffic, detecting unusual spikes, and verifying that a token revocation terminated all expected sessions.

### sensor.harvest_active_tokens

| Property | Value |
|----------|-------|
| State | Integer count of currently active tokens |
| Unit | tokens |
| Icon | `mdi:key` |

A token is counted as active if all of these are true: `status == "active"` AND (`expires` is `null` OR `expires > now`) AND (no `active_schedule` set OR the current time is within a schedule window). This is a snapshot count - tokens that are active but have no current sessions are still counted.

### sensor.harvest_commands_today

| Property | Value |
|----------|-------|
| State | Integer count of commands processed since midnight (HA timezone) |
| Unit | commands |
| Icon | `mdi:lightning-bolt` |

Total commands (turn_on, set_brightness, etc.) sent by visitors and accepted by the integration today. Rejected commands (rate-limited, permission-denied) are not counted.

Useful for: spotting unusual activity, tracking widget engagement.

### sensor.harvest_errors_today

| Property | Value |
|----------|-------|
| State | Integer count of auth failures and errors since midnight (HA timezone) |
| Unit | errors |
| Icon | `mdi:alert-circle` |

Total authentication failures and integration errors today. This counts `HRV_TOKEN_INVALID`, `HRV_ORIGIN_DENIED`, `HRV_SIGNATURE_INVALID`, and similar auth rejection codes. Normal connection noise (bots probing the endpoint) will produce a low background count. A sudden spike may indicate a misconfigured widget or a probing attempt.

### sensor.harvest_db_size

| Property | Value |
|----------|-------|
| State | Activity database file size in megabytes (rounded to 2 decimal places) |
| Unit | MB |
| Icon | `mdi:database` |

The current size of the `harvest_activity.db` SQLite file in megabytes. Sourced from `activity_store.get_db_size_bytes()`. Useful for monitoring storage growth on long-running installations. The automatic retention policy (default 30 days) prevents unbounded growth.

---

## 2. Per-Token Sensors

For each token, HArvest creates a set of sensors scoped to that token. Entity IDs are derived from the token's label, slugified:

```
sensor.harvest_{token_label_slug}_{metric}
```

For example, a token labelled "Bedroom Widgets" produces:

```
sensor.harvest_bedroom_widgets_sessions
sensor.harvest_bedroom_widgets_last_seen
sensor.harvest_bedroom_widgets_last_origin
sensor.harvest_bedroom_widgets_commands_today
```

If two tokens produce the same slug, HA appends a numeric suffix to disambiguate.

### sensor.harvest_{label}_sessions

| Property | Value |
|----------|-------|
| State | Integer count of active sessions for this token |
| Unit | sessions |

The number of visitors currently connected using this token.

### sensor.harvest_{label}_last_seen

| Property | Value |
|----------|-------|
| State | ISO 8601 datetime of the most recent successful auth for this token |
| Device class | `timestamp` |

The last time a visitor successfully authenticated with this token. `unknown` if the token has never been used.

### sensor.harvest_{label}_last_origin

| Property | Value |
|----------|-------|
| State | The Origin header value from the most recent successful auth |

The website origin from the most recent successful connection. Useful for verifying that traffic is coming from the expected domain.

### sensor.harvest_{label}_commands_today

| Property | Value |
|----------|-------|
| State | Integer count of commands sent via this token today |
| Unit | commands |

Commands sent by visitors using this specific token since midnight. Useful for per-widget usage tracking.

---

## 3. Update Frequency

Global sensors update every 30 seconds on a fixed schedule. The `binary_sensor.harvest_running` sensor updates immediately on state change.

Per-token sensors update on relevant events:
- `sessions` updates immediately when a session opens or closes
- `last_seen` and `last_origin` update immediately on a successful auth
- `commands_today` updates immediately when a command is processed

This means per-token sensors are always current, while global aggregate sensors may be up to 30 seconds behind.

---

## 4. Using Sensors in Automations

> **Note:** The automation examples below are written against the sensor entity IDs defined above. Verify the exact entity IDs in your HA instance after installation - the slugification of your token labels may differ from the examples.

### Alert when HArvest stops running

```yaml
automation:
  alias: "HArvest stopped"
  trigger:
    - platform: state
      entity_id: binary_sensor.harvest_running
      to: "off"
      for:
        minutes: 2
  action:
    - service: notify.notify
      data:
        title: "HArvest is not running"
        message: >
          HArvest stopped at {{ now().strftime('%H:%M') }}.
          Check the HA logs and reload the integration if needed.
```

### Alert on unusual error count

```yaml
automation:
  alias: "HArvest error spike"
  trigger:
    - platform: numeric_state
      entity_id: sensor.harvest_errors_today
      above: 50
  action:
    - service: notify.notify
      data:
        title: "HArvest: high error count"
        message: >
          {{ states('sensor.harvest_errors_today') }} auth errors today.
          Check the HArvest activity log for details.
```

### Alert on unexpected active sessions for a token

```yaml
automation:
  alias: "HArvest unexpected traffic on bedroom token"
  trigger:
    - platform: numeric_state
      entity_id: sensor.harvest_bedroom_widgets_sessions
      above: 5
  action:
    - service: notify.notify
      data:
        title: "Unexpected HArvest traffic"
        message: >
          {{ states('sensor.harvest_bedroom_widgets_sessions') }} active sessions
          on the Bedroom Widgets token. Last origin:
          {{ states('sensor.harvest_bedroom_widgets_last_origin') }}.
```

> **To be expanded after implementation:** additional automation patterns for schedule-based session monitoring, command rate alerting, and per-token daily summary notifications will be added here once the integration is running and entity IDs are confirmed.

---

## 5. Using Sensors in HA Dashboards

The diagnostic sensors integrate with any standard HA dashboard card.

### Simple status card

A `glance` card showing the key global metrics:

```yaml
type: glance
title: HArvest Status
entities:
  - entity: binary_sensor.harvest_running
    name: Running
  - entity: sensor.harvest_active_sessions
    name: Sessions
  - entity: sensor.harvest_active_tokens
    name: Tokens
  - entity: sensor.harvest_commands_today
    name: Commands today
  - entity: sensor.harvest_errors_today
    name: Errors today
```

### Per-token status card

```yaml
type: entities
title: Bedroom Widgets Token
entities:
  - entity: sensor.harvest_bedroom_widgets_sessions
    name: Active sessions
  - entity: sensor.harvest_bedroom_widgets_last_seen
    name: Last visitor
  - entity: sensor.harvest_bedroom_widgets_last_origin
    name: Last origin
  - entity: sensor.harvest_bedroom_widgets_commands_today
    name: Commands today
```

> **To be expanded after implementation:** history graph examples, Lovelace custom card integration, and entity naming edge cases will be documented here once the integration is running.
