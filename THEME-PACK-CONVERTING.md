# THEME-PACK-CONVERTING.md

Guide for converting existing Home Assistant dashboard card designs into HArvest renderer packs. Written for AI agents and developers who may not have access to the HArvest source code.

This document is agnostic, not specific to any theme. It is intended to be used to ease the conversion of any existing Home Assistant Lovelace dashboard theme to a HArvest theme. It is a "living document" and should be updated whenever new information is learned.

---

## What is a renderer pack?

A renderer pack is a single JavaScript file that replaces how HArvest renders entity cards. HArvest ships with built-in "standard" renderers for every supported domain. A pack overrides some or all of those renderers with custom visuals while using the same data pipeline.

Packs are loaded at runtime via `<script>` injection. They have zero build dependencies and zero runtime dependencies beyond the browser and the `window.HArvest` global that the core widget provides.

A theme JSON file accompanies each pack, defining CSS custom properties and linking to the pack ID.

---

## What packs can and cannot do

### Packs CAN

- Replace the visual appearance of any supported domain card (light, switch, fan, climate, cover, media_player, sensor, binary_sensor, input_number, input_select, timer, remote, harvest_action).
- Use any entity attribute that Home Assistant exposes. HArvest forwards all attributes except a small blocklist (`supported_features`, `supported_color_modes`, `friendly_name`, `attribution`, `assumed_state`, `editable`, `id`, `forecast`). Any individual attribute value exceeding 8KB is also dropped.
- Send commands to entities via `this.config.card?.sendCommand(action, data)`.
- Send companion commands via `this.config.card?._sendCompanionCommand(entityId, action, data)`.
- Provide optimistic UI via `predictState(action, data)`.
- Use custom CSS, SVG, canvas, or any browser API inside their shadow DOM.
- Register renderers for specific `domain.device_class` combinations (e.g. `sensor.temperature` gets a different card from `sensor.humidity`).
- Use companion entity data for multi-entity layouts. The companion system is a data pipeline, not a rendering mandate.
- Render history graphs by calling `this.renderHistoryZoneHTML()` in the template. The framework populates it automatically.

### Packs CANNOT

- Import ES modules. Packs are plain IIFE scripts, not ES modules. All code must be self-contained.
- Access the WebSocket directly. All communication goes through `sendCommand()`.
- Access Home Assistant APIs, tokens, or other entities beyond what the entity definition and state updates provide.
- Modify the core widget behavior, message routing, or authentication flow.
- Use npm packages or external runtime dependencies. Browser-native APIs only.
- Render outside their shadow DOM boundary.
- Change which entities are subscribed, or subscribe to new ones.

---

## File structure

A complete renderer pack consists of two files:

```
widget/src/packs/<pack-name>-pack.js    # Source (development)
widget/dist/<pack-name>.min.js          # Minified (production)
widget/themes/<pack-name>.json          # Theme definition
```

User-contributed packs live in a separate directory:

```
User Contributed Themes/<pack-name>/<pack-name>-pack.js   # Source
User Contributed Themes/<pack-name>/<pack-name>.js         # Minified
User Contributed Themes/<pack-name>/<pack-name>.json       # Theme JSON
```

User packs are installed to:

```
custom_components/harvest/packs/user/<pack-name>.js     # Minified pack JS
custom_components/harvest/themes/user/<pack-name>.json   # Theme JSON
```

---

## Pack skeleton

Every pack follows this structure:

```javascript
(function () {
  "use strict";

  const HArvest = window.HArvest;
  if (!HArvest || !HArvest.renderers || !HArvest.renderers.BaseCard) {
    console.warn("[HArvest PackName] HArvest not found - pack not loaded.");
    return;
  }

  const BaseCard = HArvest.renderers.BaseCard;

  // --- Helper functions ---
  // ... (HTML escaping, debounce, etc.)

  // --- Shared styles ---
  // ... (CSS template literals)

  // --- Card classes ---
  // ... (one class per domain, extending BaseCard)

  // --- Registration ---
  HArvest._packs = HArvest._packs || {};
  const _packKey = window.__HARVEST_PACK_ID__ || "pack-name";
  HArvest._packs[_packKey] = {
    "light":          LightCard,
    "switch":         SwitchCard,
    "sensor":         SensorCard,
    "climate":        ClimateCard,
    "fan":            FanCard,
    "cover":          CoverCard,
    "media_player":   MediaPlayerCard,
    "binary_sensor":  BinarySensorCard,
    "input_boolean":  SwitchCard,      // typically reuses SwitchCard
    "input_number":   InputNumberCard,
    "input_select":   InputSelectCard,
    "timer":          TimerCard,
    "remote":         RemoteCard,
    "harvest_action": HarvestActionCard,
    "generic":        GenericCard,      // fallback for unknown domains
  };
})();
```

The pack ID can come from `window.__HARVEST_PACK_ID__` (set by the panel preview) or from `document.currentScript.dataset.packId` (set via a `data-pack-id` attribute on the `<script>` tag). Always fall back to a hardcoded default.

```javascript
const _packKey = (document.currentScript && document.currentScript.dataset.packId)
  || window.__HARVEST_PACK_ID__
  || "pack-name";
```

---

## Pack capability manifest

Each renderer pack can declare a `_capabilities` object alongside its renderer map. This tells the panel's Entity Settings UI which display options the pack actually supports, so only relevant controls are shown to the user.

### Declaration

Add `_capabilities` as a property of the pack registration object, keyed by domain:

```javascript
HArvest._packs[_packKey] = {
  "light":          LightCard,
  "fan":            FanCard,
  // ... other renderers ...
  _capabilities: {
    fan:          { display_modes: ["on-off", "continuous", "stepped", "cycle"] },
    input_number: { display_modes: ["slider", "buttons"] },
    light:        { features: ["brightness", "color_temp", "rgb"] },
    climate:      { features: ["hvac_modes", "presets", "fan_mode", "swing_mode"] },
    cover:        { features: ["position", "tilt"] },
    media_player: { features: ["transport", "volume", "source"] },
  },
};
```

### Property types

| Property | Type | Purpose |
|----------|------|---------|
| `display_modes` | `string[]` | Lists the display mode strings the pack's renderer supports for that domain. The Entity Settings UI only shows these modes in the display mode selector. |
| `features` | `string[]` | Lists the feature toggles the pack's renderer supports for that domain. The Entity Settings UI only shows toggles for these features. |

### Pack-level settings (`pack_settings` in theme JSON)

Domain capabilities cover per-domain options. For card settings that apply across all domains (such as layout orientation), declare them in the theme JSON's top-level `pack_settings` array:

```json
{
  "renderer_pack": true,
  "pack_settings": ["layout"],
  "capabilities": { ... }
}
```

The panel reads `pack_settings` from the active theme and shows or hides universal card controls accordingly. If `pack_settings` is absent or empty, those controls are hidden.

Currently supported values:

| Value | Effect |
|-------|--------|
| `"layout"` | Shows the Layout (Horizontal/Vertical) segmented toggle in Entity Settings |

Add `"layout"` if your pack reads `display_hints.layout` and applies it (e.g. via `:host([data-layout=vertical])` CSS and `_applyLayout(this)` in `render()`). Omit it if your pack has a fixed layout.

### How renderers consume display options

Renderers read selected display options from two sources, merged with a fallback pattern:

```javascript
const hints = this.config.displayHints ?? this.def.display_hints ?? {};
```

`this.config.displayHints` is populated by the panel preview when previewing with overrides. `this.def.display_hints` is the persisted per-entity hints from the token configuration (set in Entity Settings). Always check both with the fallback chain above. The pack does not need to parse `_capabilities` at runtime; it only declares them so the UI knows what to offer.

Common display hint keys used across domains:

| Key | Type | Purpose |
|-----|------|---------|
| `layout` | `"horizontal" \| "vertical"` | Card layout orientation (default: horizontal) |
| `display_mode` | `string` | Domain-specific display variant (e.g. fan: `"continuous"`, `"stepped"`, `"cycle"`) |
| `show_brightness` | `boolean` | Light: show brightness slider (default: true) |
| `show_color_temp` | `boolean` | Light: show color temperature slider (default: true) |
| `show_rgb` | `boolean` | Light: show RGB color slider (default: true) |
| `show_forecast` | `boolean` | Weather: show forecast section |
| `animate` | `boolean` | Fan: animate icon spin |
| `show_hvac_modes` | `boolean` | Climate: show HVAC mode controls (default: true) |
| `show_presets` | `boolean` | Climate: show preset controls (default: true) |
| `show_fan_mode` | `boolean` | Climate: show fan mode controls (default: true) |
| `show_swing_mode` | `boolean` | Climate: show swing mode controls (default: true) |
| `show_position` | `boolean` | Cover: show position slider (default: true) |
| `show_tilt` | `boolean` | Cover: show tilt slider (default: true) |
| `show_transport` | `boolean` | Media player: show transport controls (default: true) |
| `show_volume` | `boolean` | Media player: show volume controls (default: true) |
| `show_source` | `boolean` | Media player: show source selector (default: true) |

Boolean hints default to `true` when absent. Check with `!== false` rather than `=== true` so that missing keys are treated as enabled.

### Backward compatibility

`_capabilities` is optional. If a pack omits it entirely, the Entity Settings UI shows all display options for all domains. This preserves backward compatibility with existing packs that were written before this feature existed.

Domains not listed inside `_capabilities` also default to showing all options. Only domains explicitly listed are filtered.

### Pack switching behavior

When a user switches from one pack to another, display hints that the new pack does not support are hidden in the Entity Settings UI but kept in storage. If the user switches back to the original pack, the previously selected options reappear. This avoids data loss when experimenting with different packs.

---

## BaseCard API

Every card class extends `BaseCard` and receives four constructor arguments:

```javascript
class MyCard extends BaseCard {
  constructor(def, root, config, i18n) {
    super(def, root, config, i18n);
  }
}
```

### Constructor arguments

| Argument | Type | Description |
|----------|------|-------------|
| `def` | `object` | Entity definition from the server (see below) |
| `root` | `ShadowRoot` | The card's shadow DOM root. Write all HTML here. |
| `config` | `object` | Resolved card configuration |
| `i18n` | `object` | Internationalization instance with `t(key)` method |

### Required methods

| Method | Signature | Called when |
|--------|-----------|------------|
| `render()` | `() => void` | Once, when entity definition arrives. Build the full shadow DOM. |
| `applyState(state, attributes)` | `(string, object) => void` | On every state update. Update the DOM to reflect the new state. |

### Optional methods

| Method | Signature | Purpose |
|--------|-----------|---------|
| `predictState(action, data)` | `(string, object) => {state, attributes} or null` | Return predicted state for optimistic UI. If null, no prediction is applied. |
| `updateCompanionState(entityId, state, attributes)` | `(string, string, object) => void` | Override to custom-render companion updates. If not overridden, BaseCard's default companion pill rendering handles it. |
| `destroy()` | `() => void` | Cleanup when card is removed. Clear timers, cancel animations. |

### Inherited helper methods

| Method | Purpose |
|--------|---------|
| `renderIcon(iconName, partName)` | Inject an MDI SVG icon into `[part=<partName>]`. Caches by part name, skips if unchanged. |
| `resolveIcon(name, fallback)` | Returns `name` if it exists in the bundled MDI icon set, otherwise returns `fallback`. Use this to avoid the generic help-circle. |
| `getSharedStyles()` | Returns the CSS string with custom property defaults, card base layout, companion zone, history graph, gesture, and error state styles. Include at the start of your `<style>` tag. |
| `renderCompanionZoneHTML()` | Returns HTML placeholder for companion pills. Include in your template. Returns empty string if no companions. |
| `renderCompanions()` | Populates the companion zone with pills. Call at the end of `render()`. |
| `renderHistoryZoneHTML()` | Returns HTML placeholder for the history graph. Returns empty string if graph is not configured. Include between card body and companion zone. |
| `renderAriaLiveHTML()` | Returns screen reader announcement region HTML. Include in template. |
| `announceState(text)` | Push text to the aria-live region for screen readers. |
| `isFocused(element)` | Returns true if the element has focus in this shadow root. Use to avoid clobbering user input in `applyState()`. |
| `debounce(fn, ms)` | Returns a debounced version of `fn`. |
| `_attachGestureHandlers(element, callbacks, actionConfig)` | Attach gesture-aware pointer event handlers. Supports tap, hold, and double-tap detection. See "Gesture support" section. |
| `_runAction(actionConfig)` | Execute a gesture action (toggle, none, trigger-action, call-service). Called internally by gesture handlers. |

---

## Entity definition object (`this.def`)

The entity definition is sent once per entity when the WebSocket connection is established. It contains static metadata about the entity.

```javascript
{
  entity_id:          "light.bedroom",
  domain:             "light",
  device_class:       "ceiling" | null,
  friendly_name:      "Bedroom Light",
  capabilities:       "read-write" | "read",
  supported_features: ["brightness", "color_temp", "rgb_color"],
  feature_config:     { min_brightness: 0, max_brightness: 255, ... },
  icon:               "mdi:lightbulb",
  icon_state_map:     { on: "mdi:lightbulb", "*": "mdi:lightbulb-outline" },
  unit_of_measurement: "°C" | null,
  graph:              "line" | "bar" | "step" | null,
  hours:              24,
  period:             10,
  animate:            false,
  companions:         [{ entityId: "sensor.temp", capabilities: "read" }, ...],
}
```

### `supported_features` by domain

These are decoded from the HA bitmask server-side and arrive as an array of strings.

**light:** `brightness`, `color_temp`, `effect`, `flash`, `transition`, `rgb_color`, `white_value`

**fan:** `set_speed`, `oscillate`, `direction`, `preset_mode`

**cover:** `set_position`, `set_tilt_position`, `stop`, `buttons` (always present)

**climate:** `target_temperature`, `target_temperature_range`, `fan_mode`, `preset_mode`, `swing_mode`, `aux_heat`

**media_player:** `play_pause`, `next_track`, `previous_track`, `volume_set`, `volume_step`, `turn_on`, `turn_off`

**remote:** `learn_command`, `delete_command`

### `feature_config` by domain

Domain-specific range/option values extracted from HA state attributes.

**light:**
```javascript
{ min_brightness: 0, max_brightness: 255, min_color_temp: 153, max_color_temp: 500 }
```

**fan:**
```javascript
{ percentage_step: 33.33, speed_count: 3, preset_modes: ["normal", "sleep", "auto"] }
```

**climate:**
```javascript
{ min_temp: 7, max_temp: 35, temp_step: 0.5,
  hvac_modes: ["off", "heat", "cool", "auto"],
  fan_modes: ["auto", "low", "medium", "high"],
  preset_modes: ["home", "away", "sleep"],
  swing_modes: ["off", "vertical"] }
```

**input_number:**
```javascript
{ min: 0, max: 100, step: 1 }
```

---

## State attributes (`applyState` second argument)

Attributes arrive on every state update. HArvest uses a blocklist, so almost every attribute HA exposes is available. The key attributes per domain:

### light
| Attribute | Type | Notes |
|-----------|------|-------|
| `brightness` | `number` | 0-255 |
| `color_temp` | `number` | Mireds |
| `color_temp_kelvin` | `number` | Kelvin |
| `rgb_color` | `[r, g, b]` | |
| `rgbw_color` | `[r, g, b, w]` | |
| `rgbww_color` | `[r, g, b, cw, ww]` | |
| `hs_color` | `[hue, sat]` | |
| `xy_color` | `[x, y]` | |
| `effect` | `string` | Current effect name |
| `effect_list` | `string[]` | Available effects |

### fan
| Attribute | Type | Notes |
|-----------|------|-------|
| `percentage` | `number` | 0-100 |
| `oscillating` | `boolean` | |
| `direction` | `string` | `"forward"` or `"reverse"` |
| `preset_mode` | `string` | Active preset |
| `preset_modes` | `string[]` | Also in `feature_config` |

### climate
| Attribute | Type | Notes |
|-----------|------|-------|
| `current_temperature` | `number` | |
| `temperature` | `number` | Target (single setpoint) |
| `target_temp_high` | `number` | Dual setpoint upper |
| `target_temp_low` | `number` | Dual setpoint lower |
| `current_humidity` | `number` | |
| `humidity` | `number` | Target humidity |
| `hvac_action` | `string` | `heating`, `cooling`, `idle`, `drying`, `fan`, `off` |
| `hvac_modes` | `string[]` | Also in `feature_config` |
| `fan_mode` | `string` | Active fan mode |
| `fan_modes` | `string[]` | Also in `feature_config` |
| `preset_mode` | `string` | Active preset |
| `preset_modes` | `string[]` | Also in `feature_config` |
| `swing_mode` | `string` | Active swing mode |

### cover
| Attribute | Type | Notes |
|-----------|------|-------|
| `current_position` | `number` | 0-100 |
| `current_tilt_position` | `number` | 0-100 |
| `device_class` | `string` | `garage`, `door`, `window`, `blind`, `shutter` |

### media_player
| Attribute | Type | Notes |
|-----------|------|-------|
| `media_title` | `string` | |
| `media_artist` | `string` | |
| `media_album_name` | `string` | |
| `media_duration` | `number` | Seconds |
| `media_position` | `number` | Seconds |
| `media_position_updated_at` | `string` | ISO 8601 timestamp |
| `entity_picture` | `string` | URL for album art |
| `app_name` | `string` | Fallback when no media_title |
| `source` | `string` | Active source |
| `source_list` | `string[]` | Available sources |
| `sound_mode` | `string` | Active sound mode |
| `sound_mode_list` | `string[]` | Available sound modes |
| `volume_level` | `number` | 0.0 to 1.0 |
| `is_volume_muted` | `boolean` | |

### sensor
| Attribute | Type | Notes |
|-----------|------|-------|
| `device_class` | `string` | `temperature`, `humidity`, `battery`, etc. |
| `state_class` | `string` | `measurement`, `total_increasing`, etc. |
| `suggested_display_precision` | `number` | Decimal places for display |

### binary_sensor
| Attribute | Type | Notes |
|-----------|------|-------|
| `device_class` | `string` | `motion`, `door`, `window`, `moisture`, etc. |

---

## Sending commands

Commands are sent through the HArvest proxy, not directly to HA. Only services in the `ALLOWED_SERVICES` whitelist are permitted. The proxy maps `sendCommand(action, data)` to the appropriate HA service call for the entity's domain.

### Common commands by domain

**light:**
```javascript
sendCommand("toggle", {})
sendCommand("turn_on", { brightness: 200 })
sendCommand("turn_on", { color_temp: 350 })
sendCommand("turn_on", { rgb_color: [255, 0, 0] })
sendCommand("turn_on", { effect: "colorloop" })
```

**fan:**
```javascript
sendCommand("toggle", {})
sendCommand("set_percentage", { percentage: 50 })
sendCommand("oscillate", { oscillating: true })
sendCommand("set_direction", { direction: "reverse" })
sendCommand("set_preset_mode", { preset_mode: "sleep" })
```

**climate:**
```javascript
sendCommand("set_hvac_mode", { hvac_mode: "heat" })
sendCommand("set_temperature", { temperature: 22.5 })
sendCommand("set_fan_mode", { fan_mode: "auto" })
sendCommand("set_preset_mode", { preset_mode: "away" })
```

**cover:**
```javascript
sendCommand("open_cover", {})
sendCommand("close_cover", {})
sendCommand("stop_cover", {})
sendCommand("set_cover_position", { position: 50 })
sendCommand("set_cover_tilt_position", { tilt_position: 75 })
```

**media_player:**
```javascript
sendCommand("media_play_pause", {})
sendCommand("media_next_track", {})
sendCommand("media_previous_track", {})
sendCommand("volume_set", { volume_level: 0.5 })
sendCommand("volume_mute", { is_volume_muted: true })
sendCommand("select_source", { source: "Spotify" })
```

**switch / input_boolean:**
```javascript
sendCommand("toggle", {})
sendCommand("turn_on", {})
sendCommand("turn_off", {})
```

---

## Card template pattern

Every card's `render()` method should follow this structure:

```javascript
render() {
  const isWritable = this.def.capabilities === "read-write";
  const features = this.def.supported_features ?? [];
  const hasFeatureX = features.includes("feature_name");

  this.root.innerHTML = `
    <style>${this.getSharedStyles()}${MY_CARD_STYLES}</style>
    <div part="card">
      <div part="card-header">
        <span part="card-icon" aria-hidden="true"></span>
        <span part="card-name">${escapeHtml(this.def.friendly_name)}</span>
      </div>
      <div part="card-body">
        ${isWritable ? `
          <!-- writable controls here -->
        ` : `
          <!-- read-only display here -->
        `}
      </div>
      ${this.renderHistoryZoneHTML()}
      ${this.renderAriaLiveHTML()}
      ${this.renderCompanionZoneHTML()}
      <div part="stale-indicator" aria-hidden="true"></div>
    </div>
  `;

  // Query DOM elements
  this.renderIcon(this.resolveIcon(this.def.icon, "mdi:fallback"), "card-icon");

  // Wire event handlers using _attachGestureHandlers (not addEventListener)

  // Render companions last
  this.renderCompanions();

  // Attach gesture handlers after DOM is built
  this._attachGestureHandlers(this.root.querySelector("[part=card]"));
}
```

### Critical rules for render()

1. **Always gate controls on `isWritable`.** Read-only cards must never show buttons, sliders, or other interactive elements.
2. **Always gate controls on `supported_features`.** Do not render a volume slider if the entity does not support `volume_set`. Do not render prev/next buttons without `previous_track`.
3. **Always include `renderHistoryZoneHTML()`, `renderAriaLiveHTML()`, `renderCompanionZoneHTML()`, and `stale-indicator`** in the template. If a feature is not configured, these return empty strings.
4. **Place `renderHistoryZoneHTML()` between card-body and companion-zone.** Graphs appear between the main content and the companion pills.
5. **Call `renderCompanions()` at the end of render().** This populates the companion zone.
6. **Use `part="..."` attributes** on key elements. The framework and themes use these for styling hooks.
7. **Always call `_attachGestureHandlers`** at the end of render, after companions. Use it on the primary interactive element for toggle-type cards, or on `[part=card]` for read-only cards. Never use `addEventListener("click", ...)` for primary card actions.

### Critical rules for applyState()

1. **Guard slider/input updates with `isFocused()`.** If the user is dragging a slider, do not programmatically overwrite its value.
2. **Update icons with `renderIcon()`.** The method caches internally and is a no-op if the icon has not changed.
3. **Call `announceState()` for screen reader support.**

---

## predictState() and optimistic UI

When a user taps a button, there is a round-trip delay before the server confirms the new state. `predictState()` lets the card show the expected result immediately.

```javascript
predictState(action, data) {
  if (action === "toggle") {
    return { state: this.#isOn ? "off" : "on", attributes: this.#lastAttrs };
  }
  if (action === "set_hvac_mode" && data.hvac_mode) {
    return { state: data.hvac_mode, attributes: this.#lastAttrs };
  }
  if (action === "set_fan_mode" && data.fan_mode) {
    return { state: this.#currentState, attributes: { ...this.#lastAttrs, fan_mode: data.fan_mode } };
  }
  return null;
}
```

Every command your card sends should have a corresponding `predictState` entry. Without it, tapping a control produces no visible change until the server responds. In the panel's preview mode (which has no server), controls without predictions appear completely non-functional.

---

## Panel preview integration

The panel includes a live preview system that renders cards without a real HA connection. When building a pack, be aware of how the preview creates entity definitions.

### Preview feature toggles

The preview UI shows toggles per domain that control which features appear in `supported_features`:

| Domain | Toggle | Maps to `supported_features` |
|--------|--------|------------------------------|
| light | Brightness | `brightness` |
| light | Color temperature | `color_temp` |
| light | Color (RGB) | `rgb_color` |
| fan | Speed | `set_speed` |
| fan | Oscillating | `oscillate` |
| fan | Direction | `direction` |
| fan | Preset modes | `preset_mode` |
| climate | Target temperature | `target_temperature` |
| climate | Mode selector | fills `feature_config.hvac_modes` |
| media_player | Transport controls | `play`, `pause`, `previous_track`, `next_track` |
| media_player | Volume slider | `volume_set` |

**Important:** The preview may use slightly different feature names from the server. For example, the preview maps "Transport controls" to `play`, `pause`, `previous_track`, `next_track` as separate entries, while the server's bitmask decodes to `play_pause`, `next_track`, `previous_track`. Your card should check for the features the *server* sends (e.g. `previous_track`, `volume_set`), since that is the real runtime path.

### Preview graph toggles

Domains `sensor`, `input_number`, and `binary_sensor` show a graph type selector (none, line, bar, step). Your card must call `this.renderHistoryZoneHTML()` in its template for this to work. The framework handles the actual graph rendering.

### Preview custom entities

Users can select a real HA entity to preview. When they do, the preview fetches the entity's actual attributes and uses them to build the entity definition. This means your card will receive real `fan_modes`, `preset_modes`, `entity_picture`, etc. from the user's HA instance.

---

## Companion system

Companions are secondary entities attached to a card. The data is available at `this.config.companions`, which is an array of objects:

```javascript
[
  { entityId: "sensor.temp", capabilities: "read" },
  { entityId: "switch.pump", capabilities: "read-write" }
]
```

### Default companion rendering

BaseCard provides a default companion rendering system:
- `renderCompanionZoneHTML()` creates the container
- `renderCompanions()` creates small pills with icon and state text
- `updateCompanionDefinition(entityId, def)` updates a pill's icon when definition arrives
- `updateCompanionState(entityId, state, attributes)` updates a pill's displayed state

### Custom companion rendering

Packs can override `updateCompanionState()` to render companion data however they want. The companion system is a data pipeline: the framework delivers state updates for companion entities, but the pack decides how (or whether) to display them.

Companions with `capabilities: "read"` must never have interactive controls or trigger commands.

---

## Gesture support

HArvest allows admins to configure per-entity gestures (tap, hold, double-tap) in the panel. These gestures override the card's default behavior. For example, an admin can set "tap" to "Do nothing" so the card ignores taps, or set "hold" to trigger a harvest_action entity.

Gesture configuration arrives in the entity definition as `gesture_config` and is stored on the card's config object as `this.config.gestureConfig`. Packs do not need to parse or manage this data directly. Instead, packs must use the inherited `_attachGestureHandlers()` method for all primary interactions. This method handles hold timing, double-tap detection, and dispatching the configured action.

### Why this matters

If a pack uses `addEventListener("click", ...)` or `addEventListener("pointerup", ...)` directly, gesture configuration has no effect. Tapping always fires the hardcoded handler. "Do nothing" still toggles. Double-tap just toggles twice quickly instead of firing the configured action. Hold never fires at all.

This was the single most common bug in early pack development.

### Two patterns

There are two patterns depending on whether the card has a default action (toggle, trigger) or is read-only (sensor, binary_sensor).

**Pattern 1: Cards with a default action (toggle-type cards)**

For cards that have a primary interactive element (toggle button, power button), use `_attachGestureHandlers` with an `onTap` callback that checks for gesture overrides before falling through to the default:

```javascript
this._attachGestureHandlers(this.#toggleBtn, {
  onTap: () => {
    const tap = this.config.gestureConfig?.tap;
    if (tap) { this._runAction(tap); return; }
    this.config.card?.sendCommand("toggle", {});
  },
});
```

This applies to: LightCard, SwitchCard, FanCard, GenericCard (toggle), HarvestActionCard (trigger), RemoteCard (send_command).

The key detail: check `this.config.gestureConfig?.tap` first. If it has a value, call `this._runAction(tap)` and return immediately. Only fall through to the default command if no gesture is configured.

**Pattern 2: Read-only or complex cards**

For cards that display information but have no single primary action (sensors, binary sensors), or cards where interactions are domain-specific (climate mode buttons, cover position sliders, media transport controls), attach gesture handlers to the card container itself with no callbacks:

```javascript
this._attachGestureHandlers(this.root.querySelector("[part=card]"));
```

This enables hold and double-tap gestures on the card surface without interfering with domain-specific controls (sliders, dropdowns, mode buttons). The base card's default tap handler is a no-op when no callbacks are provided, so existing click interactions on child elements continue to work normally via event propagation.

This applies to: SensorCard, BinarySensorCard, ClimateCard, CoverCard, MediaPlayerCard, InputNumberCard, InputSelectCard, TimerCard.

### Where to call it

Call `_attachGestureHandlers` at the end of `render()`, after `renderCompanions()` and any companion tooltip setup. The element must exist in the DOM before attaching handlers.

```javascript
render() {
  this.root.innerHTML = `...`;
  // ... query DOM elements, wire domain-specific handlers ...
  this.renderCompanions();
  _applyCompanionTooltips(this.root);
  this._attachGestureHandlers(this.root.querySelector("[part=card]"));
}
```

### What _runAction supports

The `_runAction` method handles these gesture action types:

| Action type | Behavior |
|-------------|----------|
| `"toggle"` | Sends `sendCommand("toggle", {})` |
| `"none"` | Does nothing (suppresses default behavior) |
| `"trigger-action"` | Sends a trigger command to the specified companion entity |
| `"call-service"` / `"call_service"` | Sends the specified service call with data |

### Common mistake: mixing click listeners and gesture handlers

Do not attach both `addEventListener("click", ...)` and `_attachGestureHandlers` to the same element. The gesture handler uses pointer events internally and manages its own tap detection. A parallel click listener fires independently and bypasses gesture logic. If you need additional behavior on tap beyond what gestures provide, put it inside the `onTap` callback.

---

## Animation patterns

Many Lovelace cards use animations that need to be reimplemented inside the shadow DOM. These patterns come up repeatedly.

### Button press feedback

CSS `:active` pseudo-class fires on mousedown and releases immediately on mouseup, producing a flat, brief flash. For a bouncier feel, use a JS-driven CSS class with a keyframe animation:

```javascript
function triggerBounce(el) {
  if (!el) return;
  el.classList.remove("is-pressing");
  void el.getBoundingClientRect(); // force reflow to restart animation
  el.classList.add("is-pressing");
  el.addEventListener("animationend", () => {
    el.classList.remove("is-pressing");
  }, { once: true });
}
```

```css
@keyframes btn-bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.85); }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
.my-btn.is-pressing {
  animation: btn-bounce 0.35s cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
}
```

Call `triggerBounce(el)` in the click or gesture handler, before sending the command. The `getBoundingClientRect()` call forces a reflow so removing and re-adding the class restarts the animation on rapid presses.

### Controls collapse/expand

Cards that have interactive controls (sliders, buttons, mode selectors) often hide those controls when the entity is off and reveal them with animation when turned on. The pattern uses a wrapper element with a `data-collapsed` attribute and CSS transitions on `max-height`, `margin-top`, and `opacity`:

```html
<div class="controls-shell" data-collapsed="true">
  <!-- sliders, buttons, mode pills, etc. -->
</div>
```

```css
.controls-shell {
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
              margin-top 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
              opacity 0.35s ease;
}
.controls-shell[data-collapsed="true"] {
  max-height: 0 !important;
  margin-top: 0 !important;
  opacity: 0;
  pointer-events: none;
}
.controls-shell[data-collapsed="false"] {
  max-height: 400px;
  margin-top: 14px;
  opacity: 1;
}
```

In `applyState()`, set the attribute based on entity state:

```javascript
const shell = this.root.querySelector(".controls-shell");
if (shell) shell.setAttribute("data-collapsed", String(!isOn));
```

Choose a `max-height` large enough to contain the tallest possible controls layout. The transition will appear instant once the content reaches its natural height.

### Power-up/power-down transitions

To animate the card itself when the entity turns on or off, track the previous state in a private field and compare it in `applyState()`:

```javascript
#wasOn = null;

applyState(state, attributes) {
  const isOn = state !== "off" && state !== "unavailable";
  const card = this.root.querySelector("[part=card]");
  if (card && this.#wasOn !== null && this.#wasOn !== isOn) {
    card.classList.remove("powering-up", "powering-down");
    void card.getBoundingClientRect();
    card.classList.add(isOn ? "powering-up" : "powering-down");
  }
  this.#wasOn = isOn;
  // ... rest of state update
}
```

```css
@keyframes power-up {
  0%   { opacity: 0.6; transform: scale(0.97); }
  50%  { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes power-down {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0.85; transform: scale(0.98); }
}
[part=card].powering-up   { animation: power-up 0.5s ease forwards; }
[part=card].powering-down { animation: power-down 0.35s ease forwards; }
```

Initialize `#wasOn` to `null` so the first `applyState` call does not trigger the animation.

### Staggered entry animations

When rendering a list of items (forecast days, mode pills, option chips), stagger their entry by setting `animation-delay` per item:

```javascript
items.map((item, i) => `
  <div class="my-item" style="animation-delay:${i * 60}ms">...</div>
`).join("")
```

60ms per item is a good starting point. Keep total stagger under 400ms to avoid feeling sluggish.

### Dynamic accent colors from entity state

Light entities expose color data in several formats. To derive an accent color for the card background or glow effect:

```javascript
function lightAccent(state, attributes) {
  if (state !== "on") return null;
  const rgb = attributes.rgb_color;
  if (rgb) return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  const hs = attributes.hs_color;
  if (hs) return `hsl(${hs[0]},${Math.round(hs[1])}%,55%)`;
  const kelvin = attributes.color_temp_kelvin;
  if (kelvin != null) {
    if (kelvin < 3000) return "#f4b55f";
    if (kelvin < 4500) return "#f7d9a0";
    return "#cce5ff";
  }
  return null;
}
```

When non-null, apply it as a CSS variable (e.g. `--card-accent`) and use `color-mix()` to blend it into backgrounds at reduced opacity:

```css
[part=card] {
  background: color-mix(in srgb, var(--card-accent, transparent) 15%, var(--base-gradient));
}
```

This pattern applies to any domain where entity state implies a color. Climate cards can shift by HVAC mode, weather cards by condition.

### Custom slider implementation

The native `<input type="range">` is hard to style consistently across browsers, especially for thick tracks with color fills. A common pack pattern layers three elements:

1. **Outer wrapper** - the pill-shaped container with background and dimensions
2. **Track fill** - an inner `<div>` whose width is set as a percentage to show the current value
3. **Native input** - a transparent `<input type="range">` positioned absolutely on top for pointer interaction, with only the thumb styled

```html
<div class="slider-wrap">
  <div class="slider-track">
    <div class="slider-fill" style="width:50%"></div>
  </div>
  <input type="range" class="slider-input" min="0" max="100" value="50">
</div>
```

```css
.slider-wrap {
  position: relative; width: 100%; height: 56px;
  border-radius: 28px; background: rgba(0,0,0,0.08); overflow: hidden;
}
.slider-track {
  position: absolute; top: 50%; left: 14px; right: 14px;
  height: 16px; transform: translateY(-50%);
  border-radius: 8px; overflow: hidden; pointer-events: none;
}
.slider-fill {
  height: 100%; border-radius: 8px;
  background: linear-gradient(90deg, #accent1, #accent2);
  transition: width 0.15s ease;
}
.slider-input {
  position: absolute; inset: 0; width: 100%; height: 100%;
  -webkit-appearance: none; appearance: none;
  background: transparent; cursor: pointer; margin: 0;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none; width: 28px; height: 28px;
  border-radius: 50%; background: white; border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
```

Update the fill width in the `input` event handler alongside the debounced command send. In `applyState()`, update both the fill width and the input value (guarded by `isFocused()`).

---

## Theme JSON format

Each pack needs a theme file that links to it:

```json
{
  "name": "My Theme",
  "author": "Author name",
  "version": "1.0",
  "harvest_version": 1,
  "renderer_pack": true,
  "variables": {
    "--hrv-color-primary": "#6366f1",
    "--hrv-color-on-primary": "#ffffff",
    "--hrv-color-surface": "#ffffff",
    "--hrv-color-surface-alt": "#f3f4f6",
    "--hrv-color-border": "rgba(0,0,0,0.08)",
    "--hrv-color-text": "#1a1a2e",
    "--hrv-color-text-secondary": "#6b7280",
    "--hrv-color-text-inverse": "#ffffff",
    "--hrv-color-icon": "#374151",
    "--hrv-color-state-on": "#6366f1",
    "--hrv-color-state-off": "#9ca3af",
    "--hrv-color-state-unavailable": "#d1d5db",
    "--hrv-color-warning": "#f59e0b",
    "--hrv-color-error": "#ef4444",
    "--hrv-color-success": "#22c55e",
    "--hrv-card-radius": "12px",
    "--hrv-card-shadow": "0 1px 3px rgba(0,0,0,0.1)",
    "--hrv-card-padding": "16px",
    "--hrv-card-background": "#ffffff",
    "--hrv-card-border": "none",
    "--hrv-card-backdrop-filter": "none",
    "--hrv-icon-size": "24px",
    "--hrv-font-family": "system-ui, -apple-system, sans-serif",
    "--hrv-transition-speed": "150ms"
  },
  "dark_variables": {
    "--hrv-color-surface": "#1a1a2e",
    "--hrv-color-text": "#f0f0ff"
  }
}
```

The `renderer_pack` field is a boolean indicating that this theme has a paired renderer pack. The pack JS file must share the same filename as the theme JSON (e.g. `mytheme.json` pairs with `mytheme.js`). The pack ID used in `HArvest._packs[packId]` registration must match the theme ID. Variables in `dark_variables` override `variables` when the user's color scheme is dark.

Packs may define additional custom CSS variables (prefixed with `--hrv-ex-` or a pack-specific prefix) for pack-internal styling that should be theme-configurable.

### Complete CSS custom property reference

All properties are optional. Missing properties fall back to base-card defaults. Defined in `widget/src/renderers/base-card.js`.

**Colors**

| Property | Default | Purpose |
|----------|---------|---------|
| `--hrv-color-primary` | `#6366f1` | Primary accent for buttons, active controls, sliders |
| `--hrv-color-primary-dim` | `#e0e7ff` | Muted primary for history graphs and tag backgrounds |
| `--hrv-color-on-primary` | `#ffffff` | Text/icon on primary-colored backgrounds |
| `--hrv-color-surface` | `#ffffff` | Base surface color |
| `--hrv-color-surface-alt` | `#f3f4f6` | Alternate surface for inactive buttons, inputs |
| `--hrv-color-border` | `#e5e7eb` | Borders, dividers, input outlines |
| `--hrv-color-text` | `#111827` | Primary text |
| `--hrv-color-text-secondary` | `#6b7280` | Secondary text, state labels, slider labels |
| `--hrv-color-text-inverse` | `#ffffff` | Text on dark overlays |
| `--hrv-color-icon` | `#374151` | Default icon fill (overridden by state colors when active) |
| `--hrv-color-state-on` | `var(--hrv-color-primary)` | Icon/indicator when entity is on |
| `--hrv-color-state-off` | `#9ca3af` | Icon/indicator when entity is off |
| `--hrv-color-state-unavailable` | `#d1d5db` | Unavailable entity indicator |
| `--hrv-color-warning` | `#f59e0b` | Warning state |
| `--hrv-color-error` | `#ef4444` | Error state |
| `--hrv-color-success` | `#22c55e` | Success state |
| `--hrv-color-overlay` | `rgba(0,0,0,0.7)` | Error/stale overlay background |
| `--hrv-color-overlay-text` | `#ffffff` | Text on overlays |

**Card structure**

| Property | Default | Purpose |
|----------|---------|---------|
| `--hrv-card-background` | `var(--hrv-color-surface)` | Card background (supports gradients) |
| `--hrv-card-radius` | `var(--hrv-radius-l)` (12px) | Card corner radius |
| `--hrv-card-shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Card box-shadow |
| `--hrv-card-padding` | `var(--hrv-spacing-m)` (16px) | Card inner padding |
| `--hrv-card-border` | `none` | Card border (e.g. `1px solid rgba(255,255,255,0.4)`) |
| `--hrv-card-backdrop-filter` | `none` | Backdrop filter for glass effects (e.g. `blur(12px) saturate(1.4)`) |

**Typography**

| Property | Default | Purpose |
|----------|---------|---------|
| `--hrv-font-family` | `system-ui, -apple-system, sans-serif` | Card font stack |
| `--hrv-font-size-xs` | `11px` | Extra small text |
| `--hrv-font-size-s` | `13px` | Small text |
| `--hrv-font-size-m` | `15px` | Medium text (body) |
| `--hrv-font-size-l` | `18px` | Large text (headings) |
| `--hrv-font-weight-normal` | `400` | Normal weight |
| `--hrv-font-weight-medium` | `500` | Medium weight |
| `--hrv-font-weight-bold` | `700` | Bold weight |

**Spacing and layout**

| Property | Default | Purpose |
|----------|---------|---------|
| `--hrv-spacing-xs` | `4px` | Extra small gap |
| `--hrv-spacing-s` | `8px` | Small gap |
| `--hrv-spacing-m` | `16px` | Medium gap |
| `--hrv-spacing-l` | `24px` | Large gap |
| `--hrv-radius-s` | `4px` | Small radius (chips, badges) |
| `--hrv-radius-m` | `8px` | Medium radius (buttons, inputs) |
| `--hrv-radius-l` | `12px` | Large radius (cards, panels) |
| `--hrv-icon-size` | `24px` | Primary icon size |
| `--hrv-transition-speed` | `150ms` | Transition duration (set to `0ms` for reduced motion) |

---

## Conversion process: HA card to pack

### Step 1: Audit the source card

For each domain the source card supports, document:

1. **Visual elements**: What does the card show? (gauges, sliders, buttons, labels, icons, album art, progress bars)
2. **Interactive controls**: What can the user tap, drag, or select?
3. **Attributes used**: Which HA state attributes does the card read?
4. **Services called**: Which HA services does the card call?
5. **Animations**: What moves, spins, pulses, or transitions?

### Step 2: Map to HArvest capabilities

For each element from the audit:

| Source card element | HArvest equivalent |
|--------------------|--------------------|
| Entity state | First argument to `applyState(state, attributes)` |
| Entity attribute | Second argument to `applyState(state, attributes)` |
| Feature check | `this.def.supported_features.includes("name")` |
| Config value (min/max/step) | `this.def.feature_config.key` |
| Service call | `this.config.card?.sendCommand(action, data)` |
| Icon | `this.renderIcon(name, partName)` |
| Entity name | `this.def.friendly_name` |
| Read/write mode | `this.def.capabilities === "read-write"` |

### Step 3: Check for gaps

Some HA dashboard card features cannot be replicated:

| Feature | Status | Notes |
|---------|--------|-------|
| Calling arbitrary HA services | Restricted | Only services in `ALLOWED_SERVICES` whitelist |
| Accessing other entities | Not possible | Each card only receives its own entity + companions |
| Camera streams | Not possible | Not a supported domain |
| Map/location display | Not possible | No map rendering infrastructure |
| Markdown/template rendering | Not possible | No Jinja or HA template engine |
| Trigger automations | Limited | `harvest_action` domain only |
| Browser-local storage | Possible but discouraged | Shadow DOM isolation limits usefulness |
| Fetching external URLs | Possible but limited | CORS restrictions, no proxy |
| `entity_picture` (album art) | Works | URL is relative to HA instance; works if HA is accessible |
| History/graphs | Works | Use `renderHistoryZoneHTML()`, framework handles rendering |
| Multiple entities in one card | Works via companions | Use companion data pipeline |

### Step 4: Build per-domain card classes

For each domain, create a class extending BaseCard. Follow these principles:

1. Start from the **read-only** version. Get the display right before adding controls.
2. Add controls one at a time: toggle, then sliders, then mode selectors.
3. Add `predictState()` for every command. Test in the panel preview.
4. Debounce slider inputs (300ms is the standard).
5. Test with the panel preview's feature toggles to verify controls appear and disappear correctly.

### Step 5: CSS considerations

- All CSS lives inside the shadow DOM `<style>` tag. No global stylesheets.
- `getSharedStyles()` provides the base card layout, companion styles, history graph styles, and error state styles. Always include it.
- Packs typically override the base card styles heavily. Use `!important` sparingly.
- By default, respect `prefers-reduced-motion` by wrapping animations in a media query and providing a static fallback. However, if the source card's design identity depends on its animations (spinning fans, bouncing buttons, expanding controls), the pack author may choose to ignore the media query. This is a deliberate design decision, not a bug. Document the choice in a comment near the animation CSS.
- Respect `this.config.animate` for icon spin animations (e.g. fan blades). Only animate when the entity is on AND `config.animate` is `true`. The standard pattern is to set `data-animate` on the icon element and target it in CSS: `[part=card-icon][data-animate=true] svg { animation: spin 1.5s linear infinite; }`.
- The `[part=card]` element has `overflow: hidden` from the base styles. If your design needs visible overflow, override it.
- Use `var(--ndl-fg)` or similar internal variables for foreground colors if your cards have dynamic backgrounds. Do not hardcode colors that cannot adapt.

### Step 6: Test

1. **Preview toggles**: Toggle every feature on and off. Controls must appear and disappear.
2. **Read-only mode**: Switch to Read capability. All interactive controls must vanish.
3. **Custom entity**: Select a real entity from the HA instance. Verify real attributes render correctly.
4. **Graph toggle**: For sensor/binary_sensor/input_number, toggle graph types.
5. **Dark mode**: Switch color modes. Verify readability.
6. **Companion dots**: Add companions to the entity in the token config. Verify they appear.
7. **Click every control**: Every button, slider, and selector must produce visible feedback (via `predictState` in preview, via server response in live mode).
8. **Gesture overrides**: Configure a tap gesture to "Do nothing" on a toggle-type entity. Verify tapping no longer toggles. Configure a hold gesture. Verify holding fires the configured action instead of doing nothing.

### Step 7: Minify and sync

For built-in packs:

```bash
npx esbuild widget/src/packs/<name>-pack.js \
  --bundle=false --minify --format=iife \
  --target=es2020 --charset=utf8 \
  --outfile=widget/dist/<name>.min.js

cp widget/dist/<name>.min.js custom_components/harvest/packs/user/<name>.js
cp widget/themes/<name>.json custom_components/harvest/themes/user/<name>.json
```

For user-contributed packs (source and output live together):

```bash
npx esbuild "User Contributed Themes/<name>/<name>-pack.js" \
  --bundle=false --minify --format=iife \
  --target=es2020 --charset=utf8 \
  --outfile="User Contributed Themes/<name>/<name>.js"
```

---

## Common mistakes

### Using addEventListener instead of _attachGestureHandlers

The most common pack bug. If a toggle button uses `addEventListener("click", ...)`, admin-configured gestures (tap override, hold, double-tap) are completely ignored. The card always toggles on click regardless of gesture configuration. Use `_attachGestureHandlers` for all primary interactions. See the "Gesture support" section for the two patterns (toggle-type and read-only).

### Feature name mismatches

The server, standard renderers, and preview sometimes use different feature names for the same capability. Always check the server's `FEATURE_FLAGS` mapping.

| Domain | Server feature name | Common mistake |
|--------|-------------------|----------------|
| fan | `set_speed` | Using `set_percentage` (that is the command name, not the feature name) |
| fan | `direction` | Using `set_direction` (that is the command name) |
| media_player | `previous_track` | Using `prev` or `previous` |
| media_player | `play_pause` | Using `play` (the preview uses `play` but the server uses `play_pause`) |
| media_player | `volume_set` or `volume_step` | Checking only one. Some entities report `volume_step` instead of `volume_set`. Check for both: `features.includes("volume_set") \|\| features.includes("volume_step")` |

### Writable entities with no domain-specific features

A light entity may support `turn_on`/`turn_off`/`toggle` but have no brightness, color temperature, or color features. If your card only renders controls when domain-specific features are present, the writable fallback path must still include a toggle button. Do not render a read-only display for a writable entity just because it lacks advanced features.

### Missing predictState

If a control sends a command but has no `predictState` entry, clicking it in the panel preview produces no visible change. Users will report the control as "broken" even though the event handler fires correctly.

### Not checking supported_features

Rendering controls unconditionally (gated only on `isWritable`) means the preview's feature toggles have no effect. Controls must check `supported_features` before rendering.

### Forgetting renderHistoryZoneHTML()

Without this call in the template, the graph toggle in the preview does nothing for sensor, binary_sensor, and input_number cards.

### Hardcoded companion limit

There is no per-card companion limit. The total entity count per token is capped at 50 (primaries plus companions combined).

### Not guarding slider updates

If `applyState()` sets a slider's value while the user is dragging it, the slider jumps. Always check `this.isFocused(sliderElement)` before programmatically updating.

### Reading options from feature_config instead of attributes

For `input_select`, the list of available options comes from `attributes.options` in state updates, not from `this.def.feature_config.options`. The same applies to other "list of choices" attributes like `source_list`, `sound_mode_list`, `effect_list`, and `preset_modes`. Always read the current list from the `attributes` argument in `applyState()`, falling back to `feature_config` only as a last resort.

### Static controls for dynamic data

Some controls have a fixed set of choices at render time (e.g. `hvac_modes` from `feature_config`), but others can change at runtime (e.g. `attributes.options`, `attributes.source_list`). For dynamic lists, do not pre-build buttons in `render()`. Instead, create an empty container in `render()` and rebuild its children in `applyState()` when the list changes. Track the previous list (e.g. by joining values into a string key) and only rebuild the DOM when it actually differs.

### Animating without reflow reset

When using a JS-driven CSS class for button press animation, adding the class a second time while the animation is still running (or has completed) does nothing. You must remove the class, force a reflow with `void el.getBoundingClientRect()`, then re-add it. Without the reflow, rapid presses after the first produce no feedback.

### Forgetting pointer-events on collapsed controls

If you hide controls by transitioning `opacity` and `max-height` to zero, the controls are still interactive and can receive clicks on invisible elements. Always add `pointer-events: none` to the collapsed state and restore it when expanded.

### Icon vertical offset inside buttons

When placing an icon `<span>` inside a flex-layout button, the icon may appear offset vertically. This happens because inline elements default to baseline alignment. Apply `display: flex; align-items: center; justify-content: center` to the icon container element to center it properly within the button.

---

## Lessons learned

Practical lessons learned from converting HA custom cards into HArvest renderer packs.

1. **Attribute availability is not the bottleneck.** HArvest forwards all HA attributes except a small blocklist. If an attribute exists in HA, it is available to the pack.

2. **The companion system is a data pipeline.** Packs receive companion state updates but decide how to render them. The default pills are opt-in via `renderCompanions()`, not automatic.

3. **Feature names differ between the feature flag (what the entity supports) and the command (what you send).** `set_speed` is a feature, `set_percentage` is the command. `direction` is a feature, `set_direction` is the command.

4. **The panel preview is the primary testing tool.** Every control must work in preview mode via `predictState`. The preview has no server connection, so commands go nowhere. Visual feedback comes entirely from predictions.

5. **Pack CSS is self-contained.** Packs define their own visual language. They can ignore the theme's `--hrv-*` variables for card internals and define their own internal variables. The theme variables are most useful for the card wrapper (radius, shadow, padding) and companion pills.

6. **Dynamic card backgrounds (gradient per domain/state) need a foreground color strategy.** If the background changes based on entity state, text/icon colors must adapt. Use a CSS variable or compute foreground color from the background.

7. **`device_class` enables sub-domain specialization.** The pack registration supports `domain.device_class` keys (e.g. `sensor.temperature`), allowing different renderers for different device classes within the same domain.

8. **Attribute lists are the source of truth for dynamic choices.** Options, sources, sound modes, and effect lists live in state attributes, not in the entity definition's `feature_config`. The definition tells you what features exist; the attributes tell you what the current choices are.

9. **Rebuild dynamic controls only when the list changes.** Comparing the current list to a cached key (e.g. `options.join("|")`) avoids unnecessary DOM churn on every `applyState` call while still picking up changes.

10. **Icon containers need explicit flex centering.** Inline icon elements inside flex-row buttons inherit baseline alignment. Always set `display: flex; align-items: center; justify-content: center` on icon wrappers to prevent subtle vertical offset.

11. **Check both feature name variants for media_player.** Some entities report `volume_step` instead of `volume_set`, and the preview sends `play` while the server sends `play_pause`. Always check for both variants when gating controls on supported features.

12. **Every writable entity needs at least a toggle.** Even if a domain card is designed around advanced features (brightness sliders, color pickers, mode selectors), the writable fallback path must still include a basic power/toggle button. A writable entity with no domain-specific features should never render as read-only.

13. **Never use `addEventListener("click", ...)` for primary card actions.** Use `this._attachGestureHandlers(element, callbacks)` instead. Direct click listeners bypass the gesture system entirely, which means admin-configured tap/hold/double-tap gestures have no effect. See the "Gesture support" section.

14. **CSS `:active` is not enough for press feedback.** The pseudo-class fires on mousedown and clears on mouseup, producing a barely visible flash. For tactile feedback, use a JS-driven class with a keyframe animation (see the "Button press feedback" section). The reflow trick (`void el.getBoundingClientRect()`) is required to restart the animation on rapid successive presses.

15. **Track previous state to animate transitions.** Power-on/power-off animations, glow effects, and collapse/expand all need to know whether the state *changed*, not just what it is now. Store the previous on/off state in a private field, initialize it to `null` so the first `applyState` call skips the animation, and compare on every update.

16. **Collapse controls when the entity is off.** Many Lovelace cards always show all controls regardless of state. HArvest packs can improve this by wrapping interactive controls in a collapsible container that hides when the entity is off. Use CSS transitions on `max-height`/`opacity` with `overflow: hidden` and `pointer-events: none` when collapsed. This reduces visual clutter and makes the on/off distinction clearer.

17. **Custom sliders beat native styling.** Browser support for `::-webkit-slider-thumb` and `::-moz-range-thumb` is inconsistent. For thick, branded sliders, layer a visible track-fill `<div>` underneath a transparent native `<input type="range">`. The native input handles pointer interaction and accessibility; the divs handle visuals. See the "Custom slider implementation" section.

18. **`color-mix(in srgb, ...)` is the cleanest way to apply dynamic semi-transparent colors.** When a card's background or glow should reflect the entity's color (light RGB, HVAC mode, weather condition), use `color-mix` to blend the accent into the base at a fixed opacity. This avoids string-building `rgba()` values from individual channels.

19. **Stagger list entry animations by 40-80ms per item.** Forecast days, mode pills, and option chips look better when they appear sequentially rather than all at once. Set `animation-delay` inline per item during rendering. Keep total stagger under 400ms.

20. **CSS Grid with `grid-auto-flow: column` creates scrollable horizontal strips.** For forecast cards, source lists, or any horizontally scrollable row of items, `grid-auto-flow: column` with `grid-auto-columns: minmax(Xpx, 1fr)` is more predictable than flexbox. Add `overflow-x: auto`, `scrollbar-width: none`, and `-webkit-overflow-scrolling: touch` for a clean mobile experience.

21. **Non-primary buttons can use direct `addEventListener`.** The `_attachGestureHandlers` requirement applies to primary card actions (toggle, trigger). Domain-specific controls like d-pad buttons on a remote card, temperature increment buttons on a climate card, or transport controls on a media player card can use direct `addEventListener("click", ...)` because they have fixed, non-overridable behavior. Gesture configuration does not apply to these granular controls.

22. **CSS `display` overrides the HTML `hidden` attribute.** If a button has `display: flex` in its CSS rule, setting `el.hidden = true` (which applies `display: none`) has no effect because the explicit CSS rule wins. Add a selector for the hidden state: `.my-btn[hidden] { display: none; }`. This commonly surfaces when toggling visibility of mode buttons (e.g. hiding the active light mode to show only the two alternatives).

23. **Slider "unfilled portion" overlay must use opposite tones per color scheme.** A semi-transparent cover over a slider gradient needs `rgba(255,255,255,...)` (white overlay) in light mode to lighten the unfilled area, and `rgba(0,0,0,...)` (black overlay) in dark mode to darken it. Using the same color for both modes produces inverted contrast in one scheme. Define separate values in `variables` and `dark_variables` in the theme JSON.

24. **Add missing MDI icons to the widget icon bundle before referencing them.** Pack renderers use `this.renderIcon()` which looks up SVG paths from `widget/src/icons.js`. If the icon name is not in the bundle (e.g. `mdi:brightness-4`), the icon silently falls back to `mdi:help-circle`. Always verify the icon exists with `grep` before using it, and add the SVG path data if missing. Rebuild the widget after adding icons.

25. **Cache-busting on initial WebSocket pack URL.** The WebSocket `renderer_pack` message must include a cache-busting query parameter (e.g. `?v={mtime}`) on the pack URL. Without it, browsers may serve a stale cached version of the pack JS even with `Cache-Control: no-store` on the HTTP response. Theme reload and push-to-sessions paths already include this; the initial connection path is easy to miss.

26. **Match the source card's exact colors with a color picker.** Do not guess hex values for slider fills, accent colors, or backgrounds by eyeballing or referencing Material Design palettes. Use a color picker tool (Photoshop eyedropper, browser dev tools, etc.) on a screenshot of the original card to get the exact color value. Small differences in hue or saturation are immediately noticeable side-by-side.

27. **`renderIcon()` only works for `[part=...]` slots, not button content.** The `renderIcon(iconName, partName)` method injects an SVG into a `[part=partName]` element. It cannot inject into arbitrary button innerHTML. For small icons inside buttons (toggle icons, transport controls, stepper arrows), use inline SVG strings directly in the HTML. If the icon is general-purpose (chevrons, cog, volume controls), add it to `widget/src/icons.js` so the path data is available for other packs too. Keep pack-specific icons (custom composites, unique toggle symbols) as inline SVGs only.

28. **Toggle-view cards need `min-height` to prevent layout jumps.** When a card swaps between two views (e.g. slider view vs button view, transport vs volume), the views may have different natural heights. A 42px slider swapping with 36px buttons causes the card to visibly resize. Set `min-height` on the shared container to match the tallest view. This eliminates the jump without affecting either view's internal layout.

29. **Use `:host()` selectors for pack-level layout modes.** To support card-wide display variations (horizontal vs vertical layout), set a `data-` attribute on the host element and use `:host([data-layout=vertical])` CSS selectors to restyle child elements. This keeps the layout logic in CSS and avoids conditional HTML in `render()`. Read the layout choice from `this.def.display_hints` and apply it in a shared helper function called from every card's `render()`.

30. **Shared helper functions reduce per-card boilerplate.** When a cross-cutting concern applies to all cards (layout mode, accent color by domain, icon coloring), define it as a function in the pack's IIFE scope and call it from each card. For example, `_applyLayout(card)` reads `display_hints.layout` and sets the host attribute; `_applyIconColor(iconEl, domain, isOn)` sets background and color using `color-mix`. This is preferable to duplicating the logic in 15 card classes.

31. **Near-white light colors need darkening for slider visibility.** When deriving accent colors from a light entity's `rgb_color`, near-white values (high luminance) produce sliders that are invisible against white card backgrounds. Check luminance (`0.299*R + 0.587*G + 0.114*B`) and darken by multiplying channels by 0.75-0.8 when luminance exceeds ~0.85. Similarly, color temperature values near daylight (5000-6500K) need cooler, more saturated blues to be distinguishable from white.

32. **Use `npx terser` (not esbuild) for user-contributed packs.** While the docs show esbuild for built-in packs, user-contributed packs minify better with terser: `npx terser "source.js" -o "output.js" --compress --mangle`. Terser handles the IIFE wrapper and long CSS template literals more predictably than esbuild's `--bundle=false` mode.

33. **Hide slider shading overlays for non-brightness modes.** Light cards often use a semi-transparent cover overlay to shade the unfilled portion of the brightness slider. When the same slider element is reused for color temperature or hue modes (which have their own gradient backgrounds), the shading overlay must be hidden. Set `cover.style.display = "none"` for color/temp modes and restore it for brightness mode. Otherwise the overlay clashes with the gradient and produces muddy colors.

34. **Drop-down menus need drop-up detection.** For cards that render dropdown menus (input_select, climate mode pickers), check available space below the trigger button using `getBoundingClientRect()` and `window.innerHeight`. If the dropdown would overflow the viewport, position it above the button instead. Set `bottom: calc(100% + 4px)` and `top: auto` for drop-up, or `top: calc(100% + 4px)` and `bottom: auto` for drop-down.
