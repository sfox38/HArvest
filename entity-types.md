# HArvest Entity Types

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

This document describes which Home Assistant entity types HArvest supports, what controls each entity type provides, which entity types can be used as companions, and which entity types are blocked. It is the end-user reference for understanding what a given widget card will look like and do.

---

## Table of Contents

1. [Support Tiers](#support-tiers)
2. [Tier 1 - Fully Supported Entities](#tier-1---fully-supported-entities)
3. [Tier 2 - Generic Support](#tier-2---generic-support)
4. [Tier 3 - Blocked Entities](#tier-3---blocked-entities)
5. [Companion Entities](#companion-entities)
6. [harvest_action Virtual Entity](#harvest_action-virtual-entity)
7. [Allowed Commands by Domain](#allowed-commands-by-domain)

---

## 1. Support Tiers

HArvest divides HA entity domains into three tiers.

**Tier 1 - Fully Supported.** A dedicated card renderer exists for the domain. The card shows the entity's icon and friendly name, displays the current state clearly, and provides appropriate interactive controls. All standard attributes for the domain are surfaced. These domains are explicitly tested with each release.

**Tier 2 - Generic Support.** No dedicated renderer exists. The entity's friendly name, icon, and current state are shown as text. A basic toggle is provided if the entity supports `turn_on` / `turn_off`. The card is functional but not visually tailored to the entity type. Any HA entity domain not in Tier 1 or Tier 3 falls here automatically.

**Tier 3 - Blocked.** The domain is explicitly disallowed. Blocked entities cannot be added to a token at creation time and return `HRV_ENTITY_INCOMPATIBLE` if attempted. The reasons are security or privacy concerns, or scope limitations.

The support tier for a domain appears in the entity picker in the HArvest panel: Tier 1 shows a green dot, Tier 2 shows an amber dot, and Tier 3 entities are greyed out with a tooltip explaining the reason.

---

## 2. Tier 1 - Fully Supported Entities

Each domain below has a dedicated card renderer. For companion eligibility, see the canonical list in [Section 5](#companion-entities). Each domain section notes its companion status briefly but Section 5 is the authoritative reference.

### light

**Widget controls:** on/off toggle, brightness slider (if supported), colour temperature slider (if supported), RGB colour picker (if supported). Controls that the light hardware does not support are hidden automatically.

**History graph:** supported. Add `show-history="true"` to display a graph of on/off state over time.

**Companion:** not supported as a companion. Use as a primary entity.

> **Visual appearance:** to be documented post-implementation with screenshots and layout description.

---

### switch

**Widget controls:** on/off toggle.

**History graph:** supported (on/off timeline).

**Companion:** not supported as a companion. Use as a primary entity.

> **Visual appearance:** to be documented post-implementation.

---

### sensor

Sensor appearance depends on the `device_class` attribute. Device classes with dedicated renderers show a styled value display. All other device classes use the generic sensor layout.

**Dedicated device class renderers:**

| Device class | Display |
|--------------|---------|
| `temperature` | Large numeric value with unit, styled for temperature readings |
| `humidity` | Percentage value with humidity icon |
| `battery` | Battery level icon and percentage |

**Generic sensor layout (all other device classes):** numeric value and unit displayed as text. Friendly name and icon shown. No interactive controls.

**History graph:** supported for all sensor types. Add `show-history="true"` to display a value-over-time graph.

**Companion:** not a companion-eligible domain. Sensors that you want to show alongside a primary entity should be added as companions only if they are in the companion-allowed list. `sensor` is not on that list - use `binary_sensor` for companion status indicators instead.

> **Visual appearance:** to be documented post-implementation.

---

### binary_sensor

Binary sensors display an icon and on/off state. The icon changes based on `device_class`.

**Supported device classes:** motion, door, window, presence, smoke, moisture, occupancy.

**Widget controls:** none. Binary sensors are always read-only.

**History graph:** supported (on/off timeline).

**Companion:** supported. Binary sensors are one of the most useful companion types - for example, showing a motion sensor or door sensor status alongside a light card.

> **Visual appearance:** to be documented post-implementation.

---

### fan

**Widget controls:** on/off toggle, speed percentage slider, oscillate toggle (if supported), direction selector (if supported). The fan icon spins at a rate proportional to the current speed setting.

**History graph:** supported (on/off and speed timeline).

**Companion:** not supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### cover

Covers include blinds, curtains, garage doors, awnings, and similar.

**Widget controls:** open button, close button, stop button, position slider (if supported).

**History graph:** not supported (position values are not currently graphed).

**Companion:** supported as a companion (shows current position and open/close state).

> **Visual appearance:** to be documented post-implementation.

---

### climate

**Widget controls:** HVAC mode selector (heat, cool, auto, off, etc.), target temperature control, fan mode selector (if supported), preset selector (if supported). Current temperature is shown as a read-only display.

**History graph:** not supported in v1.

**Companion:** not supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### input_boolean

`input_boolean` is treated identically to `switch` from the widget's perspective.

**Widget controls:** on/off toggle.

**History graph:** supported (on/off timeline).

**Companion:** supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### input_number

**Widget controls:** slider spanning the entity's configured `min` / `max` range. Current value displayed as text.

**History graph:** supported (value-over-time graph).

**Companion:** not supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### input_select

**Widget controls:** dropdown showing all configured options. Selecting an option sends `select_option` immediately.

**History graph:** not supported.

**Companion:** not supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### media_player

**Widget controls:** power toggle, play/pause, next track, previous track, volume slider, volume up/down. Current track title, artist, and album are displayed as text when available.

Album art and seek bar are not supported in v1.

**History graph:** not supported in v1.

**Companion:** not supported as a companion.

> **Visual appearance:** to be documented post-implementation.

---

### remote

**Widget controls:** power toggle, activity list shown as buttons (if the entity has activities configured), send-command button with a text input.

**History graph:** not supported.

**Companion:** supported as a companion (shows power state only).

> **Visual appearance:** to be documented post-implementation.

---

### harvest_action

`harvest_action` is a virtual entity domain created by the HArvest integration. It exposes a named, safe, pre-approved action as a button without revealing any HA service calls to the public widget.

**Widget controls:** a single button labelled with the action's configured friendly name. Pressing it sends a `trigger` command server-side. The integration executes whatever HA service calls the owner configured when creating the action.

**History graph:** not applicable.

**Companion:** not supported as a companion.

**Why use harvest_action?** Several domains that would naturally map to a button (`script`, `automation`, `button`, `scene`) are blocked in Tier 3 because they represent too broad an attack surface for a public widget. `harvest_action` provides a scoped alternative: the owner defines exactly which HA services are called, the widget only sends `trigger`, and the integration enforces everything else.

> **Visual appearance:** to be documented post-implementation.

---

## 3. Tier 2 - Generic Support

Any HA entity domain not in Tier 1 or Tier 3 falls into Tier 2 and is handled by the `GenericCard` renderer.

**What you get:** entity icon, friendly name, current state as text, and a basic on/off toggle if the entity supports `turn_on` and `turn_off` services.

**What you do not get:** entity-specific controls, attribute display, or a history graph.

Tier 2 is intentional for v1 - it means any HA entity can be shown in a widget, even if the visual treatment is not polished. If you need a richer display for a Tier 2 entity, the `HArvest.registerRenderer()` API allows you to build and register a custom renderer for it.

Examples of Tier 2 domains include: `number`, `select`, `text`, `timer`, `counter`, `weather`, `sun`, `calendar`, `todo`, `image`, `notify`.

---

## 4. Tier 3 - Blocked Entities

These domains cannot be used in HArvest tokens. The reason for each block is documented here.

| Domain | Reason |
|--------|--------|
| `alarm_control_panel` | Security-critical. Exposing alarm control on a public webpage is too high risk regardless of permission level. |
| `lock` | Physical security risk. A public page could expose lock control to unintended audiences. |
| `person` | Exposes real-time location data of named individuals. |
| `device_tracker` | Same privacy concern as `person`. |
| `camera` | Video streaming is architecturally out of scope for v1. |
| `script` | Arbitrary script execution surface is too broad. Use `harvest_action` instead. |
| `automation` | Same concern as `script`. |
| `scene` | Scenes can trigger wide, multi-device effects. Deferred to v2 review. |
| `update` | Triggering firmware updates from a public webpage is too risky. |
| `button` | HA `button` entities can trigger arbitrary service calls. Use `harvest_action` instead for safe, scoped button behaviour. |

Attempting to create a token containing a Tier 3 entity returns `HRV_ENTITY_INCOMPATIBLE`. The panel entity picker shows Tier 3 entities greyed out with a tooltip explaining the reason before the user reaches the token creation step.

If you need button-like behaviour, see the [`harvest_action`](#harvest_action-virtual-entity) section above.

---

## 5. Companion Entities

A companion is a secondary entity displayed inside a primary card as a compact indicator or control. Companions show an icon and state. Some companion types also support a tap action.

Companions must be explicitly added to the token's entity list. The wizard does this automatically when you select companions in the entity picker.

### Companion-eligible domains (canonical list)

This is the single authoritative list of domains that may be used as companions. Any domain not listed here is not companion-eligible. The code constant `COMPANION_ALLOWED_DOMAINS` in `entity_compatibility.py` must match this table exactly.

| Domain | Tap action | Notes |
|--------|-----------|-------|
| `light` | Toggle | Shows on/off icon |
| `switch` | Toggle | Shows on/off icon |
| `lock` | None | Read-only display. `lock` is Tier 3 as a primary entity but permitted as a companion because it is display-only here - no service call is made. |
| `binary_sensor` | None | Read-only. Most useful companion type - motion, door, window, presence, smoke, moisture, occupancy. |
| `input_boolean` | Toggle | Shows on/off icon |
| `cover` | None | Shows open/closed/position state |
| `remote` | None | Shows on/off state |

**Not companion-eligible (notable exclusions):**

| Domain | Reason |
|--------|--------|
| `sensor` | Numeric sensors are too wide for companion display. Use as a primary card instead. |
| `climate` | State is complex (mode + temperature). Not suitable for compact companion display. |
| `media_player` | Too many attributes. Not suitable for compact companion display. |
| `fan` | Not included in v1. May be added in a future version. |
| All Tier 3 domains | Blocked as primary entities. `lock` is the only Tier 3 domain permitted as a companion, specifically because it is display-only. |

Up to 4 companions may be added to a single card.

The position and layout of companion controls within the card is determined by the active theme. Companions are displayed in the `[part=companion-zone]` element - their visual arrangement can be customised via `::part(companion-zone)` in your host page stylesheet.

---

## 6. harvest_action Virtual Entity

`harvest_action` entities are created and managed within the HArvest integration itself, not in HA's entity registry. They appear in the entity picker alongside real HA entities and behave as Tier 1 entities from the widget's perspective.

### Creating a harvest_action

> **To be documented post-implementation:** the UI for creating, naming, and configuring `harvest_action` entities (including which HA services they call) will be documented here once the configuration flow is built. The integration panel is expected to include a dedicated screen for managing harvest_action definitions.

### How it works

When a visitor taps the button on a `harvest_action` card, the widget sends:

```json
{
  "type": "command",
  "entity_id": "harvest_action.welcome_home",
  "action": "trigger",
  "data": {}
}
```

The integration looks up the `harvest_action.welcome_home` definition and executes the configured HA service calls. The widget receives no information about what services were called or what they did. The `harvest_action` entity briefly transitions to `triggered` state then back to `idle` after 200ms - this provides visual feedback that the button was received.

### Rate limiting

`harvest_action` commands are subject to the same `max_commands_per_minute` rate limiting as all other commands.

---

## 7. Allowed Commands by Domain

The integration enforces a strict whitelist of allowed service calls per domain. Commands not in this list are rejected with `HRV_PERMISSION_DENIED` before reaching HA.

| Domain | Allowed actions |
|--------|----------------|
| `light` | `turn_on`, `turn_off`, `toggle` |
| `switch` | `turn_on`, `turn_off`, `toggle` |
| `fan` | `turn_on`, `turn_off`, `toggle`, `set_percentage`, `oscillate`, `set_direction` |
| `cover` | `open_cover`, `close_cover`, `stop_cover`, `set_cover_position` |
| `climate` | `turn_on`, `turn_off`, `set_temperature`, `set_hvac_mode`, `set_fan_mode`, `set_preset_mode` |
| `input_boolean` | `turn_on`, `turn_off`, `toggle` |
| `input_number` | `set_value` |
| `input_select` | `select_option` |
| `media_player` | `media_play_pause`, `media_next_track`, `media_previous_track`, `volume_up`, `volume_down`, `volume_set`, `turn_on`, `turn_off` |
| `remote` | `turn_on`, `turn_off`, `send_command` |
| `harvest_action` | `trigger` |
| `sensor` | none (read-only - no HA services exist for this domain) |
| `binary_sensor` | none (read-only - no HA services exist for this domain) |

`sensor` and `binary_sensor` are listed here for completeness. They are absent from the `ALLOWED_SERVICES` constant in code because they have no services in HA. A widget displaying a sensor never sends a command, so these domains never reach the service check. This is intentional, not an omission. The `binary_sensor` renderer exists to display state; it never attempts to call a service.

Entities with `"read"` capability in the token cannot send any commands regardless of domain. Write capability must be explicitly granted at token creation time.

Unknown keys in `data` payloads are stripped before forwarding to HA. This prevents parameter injection even if a visitor crafts a custom message.
