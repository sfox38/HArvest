# THEME-PACK-CONVERTING.md

Guide for converting existing Home Assistant dashboard card designs into HArvest renderer overrides. Written for AI agents and developers who may not have access to the HArvest source code.

This document is agnostic, not specific to any theme. It is intended to be used to ease the conversion of any existing Home Assistant Lovelace dashboard theme to a HArvest theme. It is a "living document" and should be updated whenever new information is learned.

---

## What is a renderer override?

A renderer override is a single JavaScript file that replaces how HArvest renders entity cards. HArvest ships with built-in "standard" renderers for every supported domain. A renderer override replaces some or all of those renderers with custom visuals while using the same data pipeline.

Renderer overrides are loaded at runtime via `<script>` injection. Their delivered JavaScript is standalone and has zero runtime dependencies beyond the browser and the `window.HArvest` global that the core widget provides.

A theme JSON file accompanies each renderer override, defining CSS custom properties and indicating that the theme has a paired renderer.

Each theme pack is an independent runtime unit. A renderer may use framework APIs exposed through `window.HArvest`, including `BaseCard`, but it must not import or depend on another theme renderer or a shared theme-specific runtime library. Helpers scoped inside the renderer's own IIFE are encouraged when they remove duplication within that renderer. Shared contract tests and build tooling do not compromise runtime independence.

---

## What renderer overrides can and cannot do

### Renderer overrides CAN

- Replace the visual appearance of any supported domain card (light, switch, fan, climate, cover, media_player, sensor, binary_sensor, input_number, input_select, timer, remote, lock, person, button, number, select, script, automation).
- Use any entity attribute that Home Assistant exposes. HArvest forwards all attributes except a small blocklist (`supported_features`, `supported_color_modes`, `friendly_name`, `attribution`, `editable`, `id`, `forecast`). Any individual attribute value exceeding 8KB is also dropped.
- Send commands to entities via `this.config.card?.sendCommand(action, data)`.
- Send companion commands via `this.config.card?._sendCompanionCommand(entityId, action, data)`.
- Provide optimistic UI via `predictState(action, data)`.
- Use custom CSS, SVG, canvas, or any browser API inside their shadow DOM.
- Register renderers for specific `domain.device_class` combinations (e.g. `sensor.temperature` gets a different card from `sensor.humidity`).
- Use companion entity data for multi-entity layouts. The companion system is a data pipeline, not a rendering mandate.
- Render history graphs by calling `this.renderHistoryZoneHTML()` in the template. The framework populates it automatically.

### Renderer overrides CANNOT

- Import ES modules. Renderer overrides are plain IIFE scripts, not ES modules. All code must be self-contained.
- Access the WebSocket directly. All communication goes through `sendCommand()`.
- Access Home Assistant APIs, tokens, or other entities beyond what the entity definition and state updates provide.
- Modify the core widget behavior, message routing, or authentication flow.
- Use npm packages or external runtime dependencies. Browser-native APIs only.
- Render DOM outside their shadow root. Browser top-layer features such as the Popover API are allowed because the element remains owned by the shadow root.
- Change which entities are subscribed, or subscribe to new ones.

---

## File structure

A built-in theme pack with a renderer override has a renderer source file, a compiled integration renderer, and synchronized widget and integration theme definitions:

```
widget/src/renderers/<renderer-name>-renderer.js              # Standalone source
custom_components/harvest/renderers/<renderer-name>.js        # Compiled integration renderer
widget/themes/<renderer-name>.json                            # Widget theme source
custom_components/harvest/themes/<renderer-name>.json         # Integration theme copy
```

User-contributed renderer overrides live in a separate directory:

```
User Contributed Themes/<renderer-name>/renderer.js   # Standalone renderer source
User Contributed Themes/<renderer-name>/theme.json    # Theme definition
```

User renderer overrides are installed to:

```
custom_components/harvest/renderers/user/<renderer-name>.js     # Installed standalone renderer JS
custom_components/harvest/themes/user/<renderer-name>.json      # Theme JSON
```

---

## Renderer override skeleton

Every renderer override follows this structure:

```javascript
(function () {
  "use strict";

  const HArvest = window.HArvest;
  if (!HArvest || !HArvest.renderers || !HArvest.renderers.BaseCard) {
    console.warn("[HArvest RendererName] HArvest not found - renderer not loaded.");
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
  HArvest._renderers = HArvest._renderers || {};
  const _rendererKey =
    (document.currentScript && document.currentScript.dataset.rendererId)
    || "renderer-name";
  HArvest._renderers[_rendererKey] = {
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
    "generic":        GenericCard,      // fallback for unknown domains
    "badge":          BadgeCard,       // compact pill indicator for badge capability
  };
})();
```

The renderer ID comes from `document.currentScript.dataset.rendererId`, set via a `data-renderer-id` attribute on the injected `<script>` element. Always fall back to a hardcoded default for direct loading:

```javascript
const _rendererKey =
  (document.currentScript && document.currentScript.dataset.rendererId)
  || "renderer-name";
```

The panel and hosted widget both assign `script.dataset.rendererId` before appending the script. The dataset belongs to that individual script element, so concurrent renderer loads cannot register under another script's ID. Do not use a shared global renderer ID. A shared global creates a race when multiple scripts load concurrently.

---

## Renderer capability manifest

Each renderer override can declare a `_capabilities` object alongside its renderer map. This tells the panel's Entity Settings UI which display options the renderer override actually supports, so only relevant controls are shown to the user.

### Declaration

Add `_capabilities` as a property of the renderer registration object, keyed by domain:

```javascript
HArvest._renderers[_rendererKey] = {
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
| `display_modes` | `string[]` | Lists the display mode strings the renderer override supports for that domain. The Entity Settings UI only shows these modes in the display mode selector. |
| `features` | `string[]` | Lists the feature toggles the renderer override supports for that domain. The Entity Settings UI only shows toggles for these features. |

### Renderer-level settings (`renderer_settings` in theme JSON)

Domain capabilities cover per-domain options. For card settings that apply across all domains (such as layout orientation), declare them in the theme JSON's top-level `renderer_settings` array:

```json
{
  "has_renderer": true,
  "renderer_settings": ["layout"],
  "capabilities": { ... }
}
```

The panel reads `renderer_settings` from the active theme and shows or hides universal card controls accordingly. If `renderer_settings` is absent or empty, those controls are hidden.

Currently supported values:

| Value | Effect |
|-------|--------|
| `"layout"` | Shows the Layout (Horizontal/Vertical) segmented toggle in Entity Settings |

Add `"layout"` if your renderer override reads `display_hints.layout` and applies it (e.g. via `:host([data-layout=vertical])` CSS and `_applyLayout(this)` in `render()`). Omit it if your renderer override has a fixed layout.

### How renderers consume display options

Renderers read selected display options from two sources, merged with a fallback pattern:

```javascript
const hints = this.config.displayHints ?? this.def.display_hints ?? {};
```

`this.config.displayHints` is populated by the panel preview when previewing with overrides. `this.def.display_hints` is the persisted per-entity hints from the token configuration (set in Entity Settings). Always check both with the fallback chain above. The renderer override does not need to parse `_capabilities` at runtime; it only declares them so the UI knows what to offer.

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
| `show_oscillate` | `boolean` | Fan: show oscillate button (default: true) |
| `show_direction` | `boolean` | Fan: show direction button (default: true) |
| `show_presets` | `boolean` | Fan: show preset mode pills (default: true) |
| `show_hvac_modes` | `boolean` | Climate: show HVAC mode controls (default: true) |
| `show_presets` | `boolean` | Climate: show preset controls (default: true) |
| `show_fan_mode` | `boolean` | Climate: show fan mode controls (default: true) |
| `show_swing_mode` | `boolean` | Climate: show swing mode controls (default: true) |
| `show_position` | `boolean` | Cover: show position slider (default: true) |
| `show_tilt` | `boolean` | Cover: show tilt slider (default: true) |
| `show_transport` | `boolean` | Media player: show transport controls (default: true) |
| `show_volume` | `boolean` | Media player: show volume controls (default: true) |
| `show_source` | `boolean` | Media player: show source selector (default: true) |
| `badge_show_icon` | `boolean` | Badge: show icon in pill (default: true) |
| `badge_show_name` | `boolean` | Badge: show entity name in pill (default: true) |
| `badge_show_state` | `boolean` | Badge: show state text in pill (default: true) |
| `badge_icon_color` | `string` | Badge: icon color when active. Values: `"auto"`, `"red"`, `"orange"`, `"amber"`, `"yellow"`, `"green"`, `"teal"`, `"cyan"`, `"blue"`, `"indigo"`, `"purple"`, `"pink"`, `"grey"`. Default: `"auto"` (uses `--hrv-color-primary`). Inactive states always use grey (`#9ca3af`). |

Boolean hints default to `true` when absent. Check with `!== false` rather than `=== true` so that missing keys are treated as enabled.

### Backward compatibility

`_capabilities` is optional. If a renderer override omits it entirely, the Entity Settings UI shows all display options for all domains. This preserves backward compatibility with existing renderer overrides that were written before this feature existed.

Domains not listed inside `_capabilities` also default to showing all options. Only domains explicitly listed are filtered.

### Renderer switching behavior

When a user switches from one renderer override to another, display hints that the new renderer override does not support are hidden in the Entity Settings UI but kept in storage. If the user switches back to the original renderer override, the previously selected options reappear. This avoids data loss when experimenting with different renderer overrides.

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
| _(no helper)_ | The shared base CSS (custom property defaults, card layout, companion zone, history graph, gesture, error/stale state styles) is adopted into every shadow root automatically by the `BaseCard` constructor via `adoptedStyleSheets`. Renderers only emit their renderer-specific CSS in their `<style>` tag. |
| `renderCompanionZoneHTML()` | Returns HTML placeholder for companion pills. Include in your template. Returns empty string if no companions. |
| `renderCompanions()` | Populates the companion zone with pills. Call at the end of `render()`. |
| `renderHistoryZoneHTML()` | Returns HTML placeholder for the history graph. Returns empty string if graph is not configured. Include between card body and companion zone. |
| `renderAriaLiveHTML()` | Returns screen reader announcement region HTML. Include in template. |
| `announceState(text)` | Push text to the aria-live region for screen readers. |
| `isFocused(element)` | Returns true if the element has focus in this shadow root. Use to avoid clobbering user input in `applyState()`. |
| `isSliderActive(element)` | Returns true while the user is actively dragging a range slider (pointer down or pending un-grace period after release). Use to skip slider value updates from `applyState()` while the user is interacting. |
| `guardSlider(slider, debouncedSend)` | One-call drag-protection wiring for a `<input type="range">`. Adds pointer/keyboard handlers that mark the slider active, and flushes the debounced send on release. Pair with `isSliderActive()` checks in `applyState()`. |
| `formatStateLabel(state, domain, deviceClass)` | Returns the i18n-localised label for a state string, falling back to the raw state if the i18n key is missing. Handles common domain conventions (sensor numeric values, binary_sensor on/off, etc.). |
| `debounce(fn, ms)` | Returns a debounced version of `fn`. |
| `_attachGestureHandlers(element, callbacks, actionConfig)` | Attach gesture-aware pointer event handlers. Supports tap, hold, and double-tap detection. See "Gesture support" section. |
| `_runAction(actionConfig)` | Execute a gesture action (toggle, none, call-service). Called internally by gesture handlers. |

The framework calls `finalizeRender()` after renderer output is created and after state updates that may add controls. It supplies generic missing parts and prefixes existing ARIA labels with entity context. Renderer authors should not call it directly or treat its fallbacks as a replacement for meaningful parts and labels.

---

## Entity definition object (`this.def`)

The entity definition is sent once per entity when the WebSocket connection is established. It contains static metadata about the entity.

```javascript
{
  entity_id:          "light.bedroom",
  domain:             "light",
  device_class:       "ceiling" | null,
  friendly_name:      "Bedroom Light",
  capabilities:       "badge" | "read-write" | "read",
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
| `assumed_state` | `boolean` | `true` for fans whose state HA cannot confirm (RF / Bond / assumed-state platforms). Use to suppress visual reflection of attributes on buttons - see lesson #35. Available on switches, covers, lights, etc. wherever HA flags the entity as assumed. |

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

Badge entities (`def.capabilities === "badge"`) skip the full card template entirely and use the `BadgeCard` renderer registered under the `"badge"` key in the renderer registry. The badge renderer is a separate class that renders a compact pill (icon + name + state). See the built-in `BadgeCard` in `widget/src/renderers/badge-card.js` as a reference implementation. Badges do not support gestures, companions, or history.

Renderer override badge implementations must follow these rules:

- **`:host` overrides:** Set `min-width: unset !important`, `display: inline-block !important`, and `contain: none !important`. The `contain` override is critical; without it the inline-block pill collapses to zero width because the shared base styles set `contain: inline-size`.
- **Icon resolution:** Use `this.resolveIcon(iconName, fallback)` instead of passing icon names directly to `renderIcon`. The entity definition may contain HA registry icons that are not in the widget's MDI bundle. Provide a domain-specific fallback (e.g., `"mdi:lightbulb"` for light) so the badge shows a sensible icon when the bundled set lacks the exact name.
- **Accessibility:** Always render name and state elements in the DOM, even when `badge_show_name` or `badge_show_state` is false. Use a `.sr-only` CSS class to visually hide them while keeping them available to screen readers. Add a `title` attribute on the `[part=badge]` element and update it in `applyState` with the current name and state for hover tooltips.
- **State label i18n:** Try the domain-specific i18n key first (`this.i18n.t(\`${this.def.domain}.${state}\`)`), then fall back to the generic key (`state.${state}`), then the raw state string. Weather states (e.g., `partlycloudy`) use domain-specific keys like `weather.partlycloudy` rather than `state.*`.
- **Uniform height:** Give `[part=badge]` a fixed height (`height: var(--hrv-badge-height, <your height>)`) with horizontal-only padding and `align-items: center`. Badge content varies (icon hidden, one or two text rows), and without a fixed height the pills come out at different heights on the same page. Each theme may pick its own height, but all badges within a theme must match.
- **No gestures:** Do not call `this._attachGestureHandlers()`. The server omits `gesture_config` from badge definitions and the panel hides the gesture settings when badge is selected.

Every non-badge card's `render()` method should follow this structure:

```javascript
render() {
  const isWritable = this.def.capabilities === "read-write";
  const features = this.def.supported_features ?? [];
  const hasFeatureX = features.includes("feature_name");

  this.root.innerHTML = `
    <style>${MY_CARD_STYLES}</style>
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
6. **Use meaningful `part="..."` attributes on every interactive element.** The framework and themes use these as styling and testing hooks. `BaseCard.finalizeRender()` assigns the generic `part="control"` to an interactive element that omits a part, but this is only a safety fallback and not a substitute for a stable, descriptive part name.
7. **Always call `_attachGestureHandlers`** at the end of render, after companions. Use it on the primary interactive element for toggle-type cards, or on `[part=card]` for read-only cards. Never use `addEventListener("click", ...)` for primary card actions.

### Critical rules for applyState()

1. **Guard slider/input updates with `isFocused()`.** If the user is dragging a slider, do not programmatically overwrite its value.
2. **Update icons with `renderIcon()`.** The method caches internally and is a no-op if the icon has not changed.
3. **Call `announceState()` for screen reader support.**

---

## Mandatory accessibility contract

Accessibility compliance is required for every theme and every renderer. A theme's visual identity never overrides these requirements.

### Semantics and accessible names

- Prefer native semantic controls such as `<button>`, `<input>`, and `<select>`. Use a custom ARIA control only when a native control cannot provide the required interaction.
- Give every interactive element a meaningful `part` attribute and an accessible name. Labels should include entity context when several controls could otherwise have the same name, such as "Bedroom light brightness" instead of only "Brightness".
- Use i18n strings where available. Do not rely on a tooltip or icon alone as the accessible name.
- Include `renderAriaLiveHTML()` in every non-badge card and call `announceState()` when an interaction or state update changes information the user needs to know.
- Never remove a focus outline unless an equally visible replacement is provided. Focus indicators must remain visible in light mode, dark mode, high-contrast palettes, and on dynamic backgrounds.

### Keyboard operation

- Every function available with a pointer must also be available with a keyboard.
- Native buttons must respond to Enter and Space through their native behavior. Gesture-enabled non-native primary controls must remain keyboard operable through the framework gesture handler.
- Do not attach a card-level primary action manually to nested controls. `_attachGestureHandlers()` excludes nested interactive descendants so sliders, buttons, selectors, and popovers can handle their own interactions.
- Custom menus and popovers must support Escape, appropriate Arrow-key navigation, Enter or Space selection, and focus restoration when closed.

### Sliders and custom controls

Prefer a transparent native `<input type="range">` layered over custom visuals. The native input supplies keyboard operation, focus behavior, value constraints, and accessibility semantics.

If a native range input cannot implement the design, a custom slider with `role="slider"` must provide:

- `tabindex="0"`
- Correct `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`
- A useful `aria-valuetext` when the numeric value alone is ambiguous
- Arrow-key adjustment
- Home and End handling
- Page Up and Page Down handling
- A visible focus indicator

The units used by `aria-valuenow` must match the units used by `aria-valuemin` and `aria-valuemax`. For example, a color-temperature slider with a Kelvin current value must also expose Kelvin minimum and maximum values, not a zero-to-100 visual percentage range.

### State and capability safety

- Read-only entities and companions with `capabilities: "read"` must never invoke service calls.
- Unavailable and unknown states must remain understandable without relying only on color.
- Dynamic accent colors must not be the only indication of state.
- Test all cards at 200 percent browser zoom and with keyboard-only navigation.

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

The panel includes a live preview system that renders cards without a real HA connection. When building a renderer override, be aware of how the preview creates entity definitions.

### Preview parity contract

The preview is allowed to create controlled presentation conditions so a contributor can inspect a card without depending on the current state of a real entity. It may supply synthetic graph or weather data, force light or dark mode, resize the card or preview background, and force controls into an expanded or otherwise inspectable state.

Outside those intentional fixtures, preview and hosted rendering must use the same renderer registration path, DOM structure, CSS, capability handling, state application, optimistic prediction, and accessibility behavior. Do not detect preview mode and emit an alternate renderer layout. A preview-only condition must be a documented framework fixture, not a branch owned by an individual renderer.

When comparing preview and hosted output, use equivalent width, background, color scheme, capability, and state inputs. Translucent themes in particular can appear different when the preview background does not match the hosting page.

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

Renderer overrides can override `updateCompanionState()` to render companion data however they want. The companion system is a data pipeline: the framework delivers state updates for companion entities, but the renderer override decides how (or whether) to display them.

The server sends companions a minimal payload. A companion's `entity_definition` carries identity and icon fields only (entity_id, domain, device_class, friendly_name, icon, icon_state_map, capabilities), and the `attributes` object passed to `updateCompanionState()` contains at most `unit_of_measurement`. Do not rely on richer companion attributes (brightness, current_temperature, and so on); if a design needs those values, the entity belongs on its own card rather than in a companion slot.

Companions with `capabilities: "read"` must never have interactive controls or trigger commands.

---

## Gesture support

HArvest allows admins to configure per-entity gestures (tap, hold, double-tap) in the panel. These gestures override the card's default behavior. For example, an admin can set "tap" to "Do nothing" so the card ignores taps, or set "hold" to call a specific service.

Gesture configuration arrives in the entity definition as `gesture_config` and is stored on the card's config object as `this.config.gestureConfig`. Packs do not need to parse or manage this data directly. Instead, packs must use the inherited `_attachGestureHandlers()` method for all primary interactions. This method handles hold timing, double-tap detection, and dispatching the configured action.

### Why this matters

If a pack uses `addEventListener("click", ...)` or `addEventListener("pointerup", ...)` directly, gesture configuration has no effect. Tapping always fires the hardcoded handler. "Do nothing" still toggles. Double-tap just toggles twice quickly instead of firing the configured action. Hold never fires at all.

This was the single most common bug in early renderer override development.

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

This applies to: LightCard, SwitchCard, FanCard, GenericCard (toggle), RemoteCard (send_command).

The key detail: check `this.config.gestureConfig?.tap` first. If it has a value, call `this._runAction(tap)` and return immediately. Only fall through to the default command if no gesture is configured.

**Pattern 2: Read-only or complex cards**

For cards that display information but have no single primary action (sensors, binary sensors), or cards where interactions are domain-specific (climate mode buttons, cover position sliders, media transport controls), attach gesture handlers to the card container itself with no callbacks:

```javascript
this._attachGestureHandlers(this.root.querySelector("[part=card]"));
```

This enables hold and double-tap gestures on the card surface without interfering with domain-specific controls such as sliders, dropdowns, and mode buttons. The framework ignores events originating from nested interactive descendants. The base card's default tap handler is a no-op when no callbacks are provided, so domain-specific child controls continue to work normally.

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
| `"call-service"` / `"call_service"` | Sends the specified service call with data |

### Common mistake: mixing click listeners and gesture handlers

Do not attach both `addEventListener("click", ...)` and `_attachGestureHandlers` to the same element. The gesture handler uses pointer events internally and manages its own tap detection. A parallel click listener fires independently and bypasses gesture logic. If you need additional behavior on tap beyond what gestures provide, put it inside the `onTap` callback.

---

## Animation patterns

Many Lovelace cards use animations that need to be reimplemented inside the shadow DOM. These patterns come up repeatedly.

Animation must convey useful state or interaction feedback, not obstruct it. Avoid decorative bounce, prolonged staggering, and motion that shifts surrounding layout. Every renderer containing animation or transition rules must include a reduced-motion override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

This requirement also applies when animation is central to the source card's visual identity. Provide a static state cue instead of ignoring the user's preference.

### Button press feedback

Prefer a short `:active` transform or color change for button press feedback:

```css
.my-btn {
  transition: transform 120ms ease, background-color 120ms ease;
}
.my-btn:active {
  transform: scale(0.97);
}
```

Use a JS-driven class only when feedback must persist beyond the native active state. Keep the effect brief, avoid overshoot, and remove the class on `animationend`.

### Controls collapse/expand

Cards that have interactive controls such as sliders, buttons, and mode selectors may hide those controls when the entity is off. Prefer transforms and opacity when the layout permits. If the content must leave layout flow, a wrapper with a `data-collapsed` attribute can transition `max-height`, `margin-top`, and `opacity`, but this animates layout and should be used sparingly:

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

Choose a `max-height` large enough to contain the tallest possible controls layout. Always set `pointer-events: none` while collapsed, and ensure the reduced-motion override makes the final state immediate.

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

When rendering a short list of items such as forecast days, a subtle stagger can clarify that a group has appeared. Do not stagger controls the user needs immediately, and do not use staggering as decoration:

```javascript
items.map((item, i) => `
  <div class="my-item" style="animation-delay:${i * 60}ms">...</div>
`).join("")
```

Keep the delay small and the total stagger under 200ms. The reduced-motion override must remove it entirely.

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

Each renderer override needs a theme file that links to it:

```json
{
  "name": "My Theme",
  "author": "Author name",
  "version": "1.0",
  "harvest_version": 1,
  "has_renderer": true,
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
    "--hrv-card-min-width": "260px",
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

The `has_renderer` field indicates that a theme has a paired renderer override. Built-in theme and renderer filenames use the theme ID, such as `minimus.json` and `minimus-renderer.js`. A contributed theme pack uses the fixed filenames `theme.json` and optional `renderer.js`; the importer assigns the installed theme ID. The renderer's hardcoded fallback registration ID must match the theme ID. Variables in `dark_variables` override `variables` when the user's color scheme is dark.

Renderer overrides may define additional custom CSS variables (prefixed with `--hrv-ex-` or a renderer-specific prefix) for renderer-internal styling that should be theme-configurable.

### Theme zip format

The theme import endpoint accepts a `.zip` file containing any combination of the following:

```
theme.json                (required)
renderer.js               (optional - custom renderer override)
my-font.woff2             (optional - custom font files)
thumbnail.png             (optional - theme thumbnail, .png or .jpg)
```

All files except `theme.json` are optional. The zip may contain up to 12 files total (4 base + 8 font files). Each file must be under 10 MB; total expanded size must be under 20 MB.

Exporting a theme produces a zip in the same format, including any thumbnail, fonts, and renderer currently associated with it. Re-importing an exported zip with `?overwrite=true` is the supported way to update fonts or thumbnails.

### Custom fonts

A theme can bundle custom web fonts (woff2 format) so cards render with a specific typeface without depending on the user's installed fonts or a CDN.

**Step 1: Add the font file to the zip**

Place the woff2 file alongside `theme.json` in the zip:

```
theme.json
my-font.woff2
```

Variable fonts (single file covering multiple weights) are recommended over separate files per weight. They keep the zip smaller and the `custom_fonts` declaration simpler.

**Step 2: Declare the font in theme.json**

Add a `custom_fonts` array at the top level of your theme.json:

```json
{
  "name": "My Theme",
  "harvest_version": 1,
  "custom_fonts": [
    {
      "family": "My Font",
      "url": "my-font.woff2",
      "weight": "200 800",
      "style": "normal"
    }
  ],
  "variables": {
    "--hrv-font-family": "'My Font', system-ui, sans-serif",
    ...
  }
}
```

Each entry in `custom_fonts`:

| Field | Required | Description |
|-------|----------|-------------|
| `family` | Yes | The CSS font-family name to register |
| `url` | Yes | Filename of the woff2 file in the zip |
| `weight` | No | CSS font-weight descriptor. Use a range for variable fonts, e.g. `"200 800"`. Defaults to `"normal"`. |
| `style` | No | CSS font-style descriptor, e.g. `"normal"` or `"italic"`. Defaults to `"normal"`. |

**Step 3: Reference the font in your variables**

Set `--hrv-font-family` to your font name, quoted, with a fallback stack:

```json
"--hrv-font-family": "'My Font', system-ui, sans-serif"
```

Always include fallbacks. The custom font loads asynchronously with `font-display: swap`, so text renders immediately in the fallback and swaps to the custom font once loaded.

**Finding fonts**

Google Fonts (fonts.google.com) is the easiest source of freely licensed woff2 files. To get the woff2 URL for any Google Font, request the CSS from the API with a browser User-Agent:

```
curl -H "User-Agent: Mozilla/5.0" \
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap"
```

The response contains `@font-face` rules with direct woff2 URLs on `fonts.gstatic.com`. Download the latin subset URL for the weight range you need.

For variable fonts not served as woff2 by Google, download the TTF from the font's GitHub repository and convert with fonttools:

```python
from fontTools.ttLib import TTFont
font = TTFont("MyFont[wght].ttf")
font.flavor = "woff2"
font.save("my-font.woff2")
```

Requires: `pip install fonttools brotli`

**Multiple font files**

If your theme needs separate files (e.g. regular and italic), add multiple entries:

```json
"custom_fonts": [
  { "family": "My Font", "url": "my-font.woff2", "weight": "200 800", "style": "normal" },
  { "family": "My Font", "url": "my-font-italic.woff2", "weight": "200 800", "style": "italic" }
]
```

**Updating fonts on an installed theme**

There is no separate font upload UI. To change fonts on an already-installed theme:

1. Export the theme via the panel (Settings, theme detail, "Export .zip")
2. Replace or add font files in the zip
3. Update the `custom_fonts` array in `theme.json`
4. Re-import the zip with "overwrite" enabled

**Alternative: Google Fonts CSS.** Instead of bundling a font, you can load it from Google Fonts by adding a `<link>` tag to the host page's `<head>`. The `@font-face` rules from Google's stylesheet are global and apply inside shadow DOMs via `font-family` inheritance. No `custom_fonts` array is needed - just set `--hrv-font-family` in your theme variables. This is lighter to distribute but requires an internet connection and per-site setup. See the [theming docs](docs/theming.html#google-fonts) for full instructions.

### Theme application and host isolation

`ThemeLoader` applies `variables` and the applicable `dark_variables` as custom properties on the card host. It tracks the properties it owns and restores any host-page inline values when a theme changes or detaches.

- Renderer code must not write or clear host theme properties directly.
- Never replace or clear `host.style.cssText`. The embedding page may own inline dimensions, display rules, and custom properties on the host element.
- A renderer must not depend on selectors or styles from the hosting page. CSS custom properties, inherited font settings, host dimensions, and the background behind translucent cards are intentional inputs across the Shadow DOM boundary.
- Do not assume the host page provides a particular font. Use a complete fallback stack or provide the font through the supported theme mechanism.
- Add document-level, window-level, scroll, resize, and observer listeners only when needed, and remove them in `destroy()`.

### Color scheme behavior

Keep the raw effective scheme as `"auto"`, `"light"`, or `"dark"` when passing it to the theme system. `"auto"` must remain reactive to later operating-system color-scheme changes. Do not stamp the currently resolved operating-system preference as a fixed `data-color-scheme` value. Only an explicit page, token, or entity override should force light or dark.

### Contrast requirements

Validate every light and dark palette against WCAG 2.1 AA:

- Normal text must have at least `4.5:1` contrast.
- Large text, icons that convey meaning, control boundaries, and focus indicators must have at least `3:1` contrast.
- At minimum, validate primary text against the card background, secondary text against the card background, and on-primary text against the primary color.
- Validate rendered output for gradients, opacity, glass effects, dynamic accents, and state-derived colors. Theme JSON values alone cannot prove the final contrast when the host-page background influences the result.
- Do not use color as the only indication of state, selection, availability, or error.

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
| `--hrv-card-min-width` | `180px` | Preferred minimum card width. BaseCard clamps it to the available host width. |
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

## Responsive embedding contract

Widgets are embedded in arbitrary HTML pages. A hosted card may be significantly narrower than the panel preview and may be resized after initial render.

- Do not assume the preferred value of `--hrv-card-min-width` is always available. BaseCard clamps it to the host width, and the renderer must remain usable at that narrower width.
- Test long entity names, large numeric values, units, translated labels, and controls at narrow widths and 200 percent browser zoom.
- Use flexible layout, wrapping, container queries, or a `ResizeObserver` when a layout needs width-specific behavior. Disconnect observers in `destroy()`.
- Do not allow controls to shrink below a readable and operable size. Reflow, wrap, or change layout instead.
- Test cards after their host container changes size, not only at initial render.

---

## Conversion process: HA card to renderer override

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
| Trigger automations | Supported | `automation.trigger` via the automation renderer |
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

- Each renderer's shadow root receives base CSS (card layout, companion styles, history graph, gesture, error/stale states) automatically via `adoptedStyleSheets` - the BaseCard constructor adopts a single shared `CSSStyleSheet` instance into every renderer. Your renderer's `<style>` tag only needs your renderer-specific overrides.
- Renderer overrides typically override the base card styles heavily. Use `!important` sparingly.
- Respect `prefers-reduced-motion` for every animation and transition. This is mandatory even when motion is central to the source card's visual identity. Provide an equivalent static state cue.
- Respect `this.config.animate` for icon spin animations (e.g. fan blades). Only animate when the entity is on AND `config.animate` is `true`. The standard pattern is to set `data-animate` on the icon element and target it in CSS: `[part=card-icon][data-animate=true] svg { animation: spin 1.5s linear infinite; }`.
- The `[part=card]` element has `overflow: hidden` from the base styles. If your design needs visible overflow, override it.
- Use `var(--ndl-fg)` or similar internal variables for foreground colors if your cards have dynamic backgrounds. Do not hardcode colors that cannot adapt.

### Step 6: Test

Use the shared renderer contract tests where available. Shared tests enforce framework behavior without creating a runtime dependency between themes. Test every renderer independently:

1. **Registration**: Load through a script element with `dataset.rendererId`; verify the renderer registers under that ID and under its fallback ID when loaded directly.
2. **Domains and capabilities**: Exercise every supported domain, feature combination, badge mode, and read-only mode. Verify read-only entities and companions never send commands.
3. **State handling**: Test available, unavailable, unknown, assumed-state, and optimistic states. Verify `predictState()` preserves required dynamic attributes.
4. **Preview parity**: Compare preview and hosted output with equivalent fixtures. Verify intentional fake data, forced scheme, resizing, and expansion do not create a different renderer implementation.
5. **Keyboard and semantics**: Navigate every control using only the keyboard. Verify custom sliders, menus, popovers, accessible names, ARIA live announcements, meaningful parts, and visible focus.
6. **Motion**: Enable reduced motion and verify every animation and transition becomes immediate while state remains understandable.
7. **Themes and contrast**: Test light, dark, and auto modes. Verify auto follows later operating-system changes and validate rendered contrast, including dynamic and translucent backgrounds.
8. **Responsive layout**: Test narrow embeds, long translated text, large values, 200 percent zoom, and resize after mount.
9. **Graphs and companions**: Exercise every graph type and both read-only and writable companions.
10. **Syntax and build**: Syntax-check the standalone renderer source, run its contract tests, and verify the repository build or minification path preserves the IIFE and `document.currentScript` registration.

### Step 7: Minify and sync

For built-in renderer overrides:

```bash
cd widget
npm run build
```

The widget build compiles bundled standalone renderer sources into `custom_components/harvest/renderers/<name>.js`. Keep built-in theme definitions synchronized between `widget/themes/<name>.json` and `custom_components/harvest/themes/<name>.json` when the repository does not automate that copy.

For user-contributed renderer overrides, keep the importable pack source at the conventional paths:

```bash
User Contributed Themes/<name>/theme.json
User Contributed Themes/<name>/renderer.js
```

Use the repository's current build, validation, and import process. The minifier choice is not part of the renderer contract. Whatever process is used must preserve the standalone IIFE, the `document.currentScript.dataset.rendererId` lookup, and the hardcoded fallback ID.

---

## Common mistakes

### Using addEventListener instead of _attachGestureHandlers

The most common renderer override bug. If a toggle button uses `addEventListener("click", ...)`, admin-configured gestures (tap override, hold, double-tap) are completely ignored. The card always toggles on click regardless of gesture configuration. Use `_attachGestureHandlers` for all primary interactions. See the "Gesture support" section for the two patterns (toggle-type and read-only).

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

There is no per-card companion limit. Primaries and companions both count toward HArvest's internal 250-entity safety cap per token.

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

### Clearing host inline styles

Never use `host.style.cssText = ""` or replace the host's entire inline style. This destroys dimensions, display rules, and custom properties owned by the embedding page. ThemeLoader already tracks and restores the properties it applies.

### Incomplete custom ARIA sliders

Adding `role="slider"` does not make a custom control accessible by itself. A custom slider also needs focusability, complete value ARIA, keyboard behavior, visible focus, and matching units across its minimum, maximum, and current values. Prefer a native range input whenever possible.

---

## Lessons learned

Practical lessons learned from converting HA custom cards into HArvest renderer overrides.

1. **Attribute availability is not the bottleneck.** HArvest forwards all HA attributes except a small blocklist. If an attribute exists in HA, it is available to the renderer override.

2. **The companion system is a data pipeline.** Renderer overrides receive companion state updates but decide how to render them. The default pills are opt-in via `renderCompanions()`, not automatic.

3. **Feature names differ between the feature flag (what the entity supports) and the command (what you send).** `set_speed` is a feature, `set_percentage` is the command. `direction` is a feature, `set_direction` is the command.

4. **The panel preview is the primary testing tool.** Every control must work in preview mode via `predictState`. The preview has no server connection, so commands go nowhere. Visual feedback comes entirely from predictions.

5. **Renderer override CSS is self-contained.** Renderer overrides define their own visual language. They can ignore the theme's `--hrv-*` variables for card internals and define their own internal variables. The theme variables are most useful for the card wrapper (radius, shadow, padding) and companion pills.

6. **Dynamic card backgrounds (gradient per domain/state) need a foreground color strategy.** If the background changes based on entity state, text/icon colors must adapt. Use a CSS variable or compute foreground color from the background.

7. **`device_class` enables sub-domain specialization.** The renderer registration supports `domain.device_class` keys (e.g. `sensor.temperature`), allowing different renderers for different device classes within the same domain.

8. **Attribute lists are the source of truth for dynamic choices.** Options, sources, sound modes, and effect lists live in state attributes, not in the entity definition's `feature_config`. The definition tells you what features exist; the attributes tell you what the current choices are.

9. **Rebuild dynamic controls only when the list changes.** Comparing the current list to a cached key (e.g. `options.join("|")`) avoids unnecessary DOM churn on every `applyState` call while still picking up changes.

10. **Icon containers need explicit flex centering.** Inline icon elements inside flex-row buttons inherit baseline alignment. Always set `display: flex; align-items: center; justify-content: center` on icon wrappers to prevent subtle vertical offset.

11. **Check both feature name variants for media_player.** Some entities report `volume_step` instead of `volume_set`, and the preview sends `play` while the server sends `play_pause`. Always check for both variants when gating controls on supported features.

12. **Every writable entity needs at least a toggle.** Even if a domain card is designed around advanced features (brightness sliders, color pickers, mode selectors), the writable fallback path must still include a basic power/toggle button. A writable entity with no domain-specific features should never render as read-only.

13. **Never use `addEventListener("click", ...)` for primary card actions.** Use `this._attachGestureHandlers(element, callbacks)` instead. Direct click listeners bypass the gesture system entirely, which means admin-configured tap/hold/double-tap gestures have no effect. See the "Gesture support" section.

14. **Keep press feedback immediate and restrained.** A short `:active` transform or color change usually provides enough feedback. Use a JS-driven class only when the feedback must persist beyond the native active state, and always disable the motion under `prefers-reduced-motion`.

15. **Track previous state to animate transitions.** Power-on/power-off animations, glow effects, and collapse/expand all need to know whether the state *changed*, not just what it is now. Store the previous on/off state in a private field, initialize it to `null` so the first `applyState` call skips the animation, and compare on every update.

16. **Collapse controls when the entity is off.** Many Lovelace cards always show all controls regardless of state. HArvest packs can improve this by wrapping interactive controls in a collapsible container that hides when the entity is off. Use CSS transitions on `max-height`/`opacity` with `overflow: hidden` and `pointer-events: none` when collapsed. This reduces visual clutter and makes the on/off distinction clearer.

17. **Custom sliders beat native styling.** Browser support for `::-webkit-slider-thumb` and `::-moz-range-thumb` is inconsistent. For thick, branded sliders, layer a visible track-fill `<div>` underneath a transparent native `<input type="range">`. The native input handles pointer interaction and accessibility; the divs handle visuals. See the "Custom slider implementation" section.

18. **`color-mix(in srgb, ...)` is the cleanest way to apply dynamic semi-transparent colors.** When a card's background or glow should reflect the entity's color (light RGB, HVAC mode, weather condition), use `color-mix` to blend the accent into the base at a fixed opacity. This avoids string-building `rgba()` values from individual channels.

19. **Use list-entry staggering only when it clarifies a short group appearing.** Do not stagger controls the user needs immediately. Keep the total delay under 200ms and remove it entirely under `prefers-reduced-motion`.

20. **CSS Grid with `grid-auto-flow: column` creates scrollable horizontal strips.** For forecast cards, source lists, or any horizontally scrollable row of items, `grid-auto-flow: column` with `grid-auto-columns: minmax(Xpx, 1fr)` is more predictable than flexbox. Add `overflow-x: auto`, `scrollbar-width: none`, and `-webkit-overflow-scrolling: touch` for a clean mobile experience.

21. **Non-primary buttons can use direct `addEventListener`.** The `_attachGestureHandlers` requirement applies to primary card actions (toggle, trigger). Domain-specific controls like d-pad buttons on a remote card, temperature increment buttons on a climate card, or transport controls on a media player card can use direct `addEventListener("click", ...)` because they have fixed, non-overridable behavior. Gesture configuration does not apply to these granular controls.

22. **CSS `display` overrides the HTML `hidden` attribute.** If a button has `display: flex` in its CSS rule, setting `el.hidden = true` (which applies `display: none`) has no effect because the explicit CSS rule wins. Add a selector for the hidden state: `.my-btn[hidden] { display: none; }`. This commonly surfaces when toggling visibility of mode buttons (e.g. hiding the active light mode to show only the two alternatives).

23. **Slider "unfilled portion" overlay must use opposite tones per color scheme.** A semi-transparent cover over a slider gradient needs `rgba(255,255,255,...)` (white overlay) in light mode to lighten the unfilled area, and `rgba(0,0,0,...)` (black overlay) in dark mode to darken it. Using the same color for both modes produces inverted contrast in one scheme. Define separate values in `variables` and `dark_variables` in the theme JSON.

24. **Add missing MDI icons to the widget icon bundle before referencing them.** Renderer overrides use `this.renderIcon()` which looks up SVG paths from `widget/src/icons.js`. If the icon name is not in the bundle (e.g. `mdi:brightness-4`), the icon silently falls back to `mdi:help-circle`. Always verify the icon exists with `grep` before using it, and add the SVG path data if missing. Rebuild the widget after adding icons.


25. **Cache-busting on initial WebSocket renderer URL.** The WebSocket `renderer` message must include a cache-busting query parameter (e.g. `?v={mtime}`) on the renderer URL. Without it, browsers may serve a stale cached version of the renderer JS even with `Cache-Control: no-store` on the HTTP response. Theme reload and push-to-sessions paths already include this; the initial connection path is easy to miss.

26. **Match source colors deliberately, then validate their contrast.** A color picker can accurately capture slider fills, accents, and backgrounds from the source card. Treat those values as a visual starting point, not an accessibility exemption. Adjust them when necessary to satisfy the theme contrast requirements in both light and dark modes.

27. **`renderIcon()` only works for `[part=...]` slots, not button content.** The `renderIcon(iconName, partName)` method injects an SVG into a `[part=partName]` element. It cannot inject into arbitrary button innerHTML. For small icons inside buttons (toggle icons, transport controls, stepper arrows), use inline SVG strings directly in the HTML. If the icon is general-purpose (chevrons, cog, volume controls), add it to `widget/src/icons.js` so the path data is available for other packs too. Keep pack-specific icons (custom composites, unique toggle symbols) as inline SVGs only.

28. **Toggle-view cards need `min-height` to prevent layout jumps.** When a card swaps between two views (e.g. slider view vs button view, transport vs volume), the views may have different natural heights. A 42px slider swapping with 36px buttons causes the card to visibly resize. Set `min-height` on the shared container to match the tallest view. This eliminates the jump without affecting either view's internal layout.

29. **Use `:host()` selectors for pack-level layout modes.** To support card-wide display variations (horizontal vs vertical layout), set a `data-` attribute on the host element and use `:host([data-layout=vertical])` CSS selectors to restyle child elements. This keeps the layout logic in CSS and avoids conditional HTML in `render()`. Read the layout choice from `this.def.display_hints` and apply it in a shared helper function called from every card's `render()`.

30. **Helpers inside one pack reduce per-card boilerplate without coupling themes.** When a cross-cutting concern applies to all cards in one renderer, define it in that renderer's IIFE scope and call it from each card. For example, `_applyLayout(card)` reads `display_hints.layout` and sets the host attribute. Do not move theme-specific helpers into a runtime library shared by multiple theme packs.

31. **Near-white light colors need darkening for slider visibility.** When deriving accent colors from a light entity's `rgb_color`, near-white values (high luminance) produce sliders that are invisible against white card backgrounds. Check luminance (`0.299*R + 0.587*G + 0.114*B`) and darken by multiplying channels by 0.75-0.8 when luminance exceeds ~0.85. Similarly, color temperature values near daylight (5000-6500K) need cooler, more saturated blues to be distinguishable from white.

32. **Use the repository build and validation path.** The renderer contract does not require a particular minifier. Syntax-check the standalone source and verify that the chosen build process preserves the IIFE, `document.currentScript.dataset.rendererId`, and the hardcoded fallback ID.

33. **Hide slider shading overlays for non-brightness modes.** Light cards often use a semi-transparent cover overlay to shade the unfilled portion of the brightness slider. When the same slider element is reused for color temperature or hue modes (which have their own gradient backgrounds), the shading overlay must be hidden. Set `cover.style.display = "none"` for color/temp modes and restore it for brightness mode. Otherwise the overlay clashes with the gradient and produces muddy colors.

34. **Drop-down menus need drop-up detection.** For cards that render dropdown menus (input_select, climate mode pickers), check available space below the trigger button using `getBoundingClientRect()` and `window.innerHeight`. If the dropdown would overflow the viewport, position it above the button instead. Set `bottom: calc(100% + 4px)` and `top: auto` for drop-up, or `top: calc(100% + 4px)` and `bottom: auto` for drop-down.

35. **Some fans are stateless - detect via `attributes.assumed_state`.** Not all fans report accurate state. Many RF-controlled devices (ceiling fans with RF remotes, Bond Bridge fans, etc.) provide no real feedback - HA reports default or assumed values for power, speed, oscillation, direction, and preset mode regardless of the actual state. HA flags such entities with `assumed_state: true` in their state attributes. Other fans (smart fans with Wi-Fi, Zigbee, or Z-Wave) omit this flag (or set it to false) and report accurate state for everything. Renderer overrides should branch on `attributes.assumed_state` in `applyState()`: when truthy, treat all commands as fire-and-forget. Buttons should not visually reflect attribute values (no `data-active` from attributes, no colour or text changes based on state). Each click sends the command; the button always looks neutral. This applies to `applyState()` only - click handlers still send the correct command payloads. For fans with real state feedback (`assumed_state` falsy or absent), reflect attributes visually as normal. The same flag applies to `switch`, `cover`, `light` and other domains where HA may report assumed state.

36. **Do not pre-collapse interactive controls in `render()` based on assumed state.** A common pattern is to render with `<div data-collapsed="true">` and rely on `applyState` to expand when the entity is on. This breaks the rare case where the first state update is delayed past the first paint: the card sits looking "off" while the entity is actually on. The user taps to "turn it on", which sends `toggle`, and the entity actually turns off. Initialise the controls in their open/neutral state and let `applyState` collapse them only when the state genuinely arrives as off. The brief flash of expanded controls during the off-state path is preferable to silently lying about state.

37. **`data-state="on"|"off"` attribute on `[part=card]` is cleaner than inline `style.background` for state-driven appearance.** Setting `card.style.background = "linear-gradient(...)"` from JS works but couples the gradient computation to the renderer code, prevents the theme JSON from overriding it, and stops `color-mix(in srgb, ...)` recipes from composing with theme variables. Prefer driving the appearance entirely from CSS: set `card.dataset.state = isOn ? "on" : "off"` and write the visual rules as `[part=card][data-state=on] { ... }` in the pack stylesheet. The gradient now lives in CSS, picks up theme variables, and adapts to dark mode without duplicating logic in JS.

38. **Per-mode CSS progress variables enable mode-swap animations on a single slider DOM.** When a card has several modes that share one `<input type="range">` (e.g. light brightness / temperature / color), do not rebuild DOM on mode swap. Instead set one CSS variable per mode (`--brightness-progress`, `--temp-progress`, `--color-progress`) and put `data-mode="..."` on the slider shell. CSS rules scope the visual treatment by `data-mode` and read the corresponding var: `[data-mode=temp] .thumb { left: calc(var(--temp-progress) * 1%); }`. JS only flips the data attribute and updates the relevant var. The mode-swap animation (e.g. `scaleX` out / in keyframes on the slider container) plays cleanly because the DOM is stable.

39. **Position thumbs with `clamp(min, calc(var(--progress) * 1%), max)`.** A thumb at the extreme ends of a slider track visually overshoots the track unless clamped. Wrap the percentage-based position in `clamp()` with the thumb's half-width as min and `100% - half-width` as max. Pure CSS - no JS positioning code - and the slider self-corrects at any width.

40. **`ResizeObserver` inside shadow DOM works fine for responsive class toggling.** A renderer-level `_layoutObserver(card)` helper that observes `[part=card]` and toggles classes (`ndl-mini` / `ndl-compact`) at width thresholds (e.g. 110px / 150px) gives container-query-like behaviour without container queries. Cards opt in by calling it from `render()` and tear down in `destroy()`. Width-based class targets (`[part=card].ndl-compact .ndl-light-mode-btn`) keep the per-breakpoint styling readable in one place.

41. **When porting an HA-native renderer override, treat HA tokens (`--ha-card-background`, `--primary-text-color`, `--warning-color`) as the *contract*, not the values.** The source code uses these names because that is HA's theming surface. The destination platform (HArvest) uses its own prefix (`--hrv-*`). Map at the theme JSON layer: define `--hrv-color-surface`, `--hrv-color-text`, etc. with the same semantic roles, then mechanically rename in the renderer override CSS. The `color-mix(in srgb, var(--accent) 18%, var(--surface))` recipes carry over unchanged - only the variable names differ.

42. **A circular dial built from a single SVG `<circle>` + `stroke-dasharray` is cleaner than a `<path>` arc.** For thermostat-style controls with a partial circle (e.g. 270 sweep with the bottom 90 hidden), the trick is: one `<circle>` for the track, one for the progress, both share `stroke-dasharray: <visible-length> <hidden-length>` and `transform: rotate(<start-angle>deg)`. The progress circle additionally sets `stroke-dasharray: var(--progress-length) <full-circumference>` to vary how much of the visible arc is filled. Thumb position comes from `cos`/`sin` of the angle, written to CSS variables (`--thumb-left`, `--thumb-top`) and applied via `left/top: var(--thumb-left)`. No JS arc-path math, no SVG path manipulation, just trig in two functions and CSS variables.

43. **Dial drag needs an inner dead zone or the centre buttons stop working.** A circular drag-to-set control where the user can also tap mode buttons in the centre needs an inner radius dead zone in the pointer-to-value function. If the click point is within (e.g.) 42% of the outer radius, return null/the fallback value instead of computing an angle. The pointerdown handler then bails out and lets the click bubble through to the centre button. Without this, every tap on the centre buttons accidentally jerks the temperature to whatever angle the centre happened to fall on.

44. **Auto-detect stateless entities via `attributes.assumed_state`.** Home Assistant flags entities whose state cannot be confirmed (RF / Bond / button-only platforms) with `assumed_state: true`. Renderer overrides should branch on this attribute in `applyState()` and suppress visual reflection of attribute values on buttons (no `data-active` from `attributes.oscillating`, `attributes.preset_mode`, etc.) - each tap fires the command and the button stays neutral. The slider can still update from state echoes (often the only feedback the user has) but should not fight a mid-drag value. This pattern applies cross-domain: fans, switches, covers, lights with assumed-state. **Note for HArvest**: ensure `assumed_state` is NOT in `BLOCKED_ATTRIBUTES` in `entity_definition.py` - the integration must forward it to the widget for this detection to work.

45. **A toggleable disclosure panel can reduce visual weight for secondary controls.** Keep the panel content in stable DOM, expose expansion state with `aria-expanded`, and drive visibility with a boolean data attribute. Prefer opacity and transform where practical. If `max-height` is required, treat it as a layout-animation compromise and make the final state immediate under `prefers-reduced-motion`.

46. **Send EXACT step values, never rounded ones, when an entity has a fractional `percentage_step` or similar.** A 6-speed fan reports `percentage_step: 16.6666666666666664`. HA's range mapping divides 0-100 into N buckets of width `step`, so valid percentages are `[16.6666..., 33.3333..., ..., 100]`. If you build step UI from `Math.round(((i+1)/count) * 100)`, you get `[17, 33, 50, 67, 83, 100]`. Sending 17 falls in the wrong bucket - HA snaps it to a different speed than the user picked. The fix has two parts: (a) compute step values from `feature_config.percentage_step` directly (`(i+1) * step`) so they land exactly on bucket boundaries; (b) round only for display labels (`Math.round(p) + "%"`), never for the value sent in `set_percentage`. The same trap applies to any domain with `step` ranges - climate `target_temp_step`, cover position step, input_number step. Use the entity's exact step in arithmetic; round only for what the user reads.

47. **`parseInt(slider.value, 10)` truncates fractional `step` values - use `Number()` instead.** When an `<input type="range">` has `step="16.6666..."`, the browser snaps `value` to multiples of step (so the user can only land on valid points). Reading the value with `parseInt` then truncates the decimal back to an integer (`16` instead of `16.6666...`), defeating the point of the snap. `Number(slider.value)` preserves the exact float. Use `parseInt` only when you know step is an integer (e.g. light brightness slider with `step="1"`).

48. **`predictState` attributes are passed verbatim to `applyState`, not merged.** HArvest's optimistic UI calls `renderer.applyState(predicted.state, predicted.attributes)` directly - whatever object the renderer returns from `predictState` is the *complete* attributes object the next `applyState` sees. If your `applyState` reads list-typed attributes (`options`, `source_list`, `effect_list`, `preset_modes`, `hvac_modes`, etc.) and your `predictState` returns `{state: x, attributes: {}}` or any object that omits those keys, `attributes.options` (etc.) becomes `undefined` and any code that subsequently rebuilds DOM from that list will rebuild it as empty. The defensive pattern: in `applyState`, treat list attributes as "preserve previous if missing or empty array" - `options = (Array.isArray(attrs?.options) && attrs.options.length) ? attrs.options : this.#cachedOptions`. Either populate the lists in `predictState` (verbose) or guard their use in `applyState` (cleaner). Symptom when missed: card body briefly empties on each user click then refills when the server confirms - looks like a "collapse-and-uncollapse" bounce.

49. **Re-render state-dependent icons inside `applyState`, not just `render`.** The server-side `entity_definition` carries both `def.icon` (a snapshot of the icon for whichever state was active when the definition was built) and `def.icon_state_map` (the full map: e.g. `{"on": "mdi:fan", "*": "mdi:fan-off"}`). Rendering only `def.icon` once at mount means the glyph never updates when state changes - the user sees a fan-off slash that never goes away when they turn the fan on. Pattern: in every `applyState`, do `const icon = def.icon_state_map?.[state] ?? def.icon_state_map?.["*"] ?? def.icon ?? fallback; this.renderIcon(this.resolveIcon(icon, fallback), "card-icon");`. `BaseCard.renderIcon` caches by part name, so repeat calls with the same name are no-ops - it's safe to call on every applyState. The trap is most visible on cards whose only state cue is the icon (cycle-mode fan, switch with no controls visible) but applies to *any* domain whose icon_state_map maps multiple states.

50. **Per-entity `color_scheme` `"auto"` needs the token-level scheme tracked separately.** A card has page-level, token-level, and entity-level scheme sources. When the entity value is `"auto"`, it defers to the token value. Keep token and entity values separate, recompute the effective raw value on every change, and pass `"auto"` through unchanged when it remains effective. Do not replace `"auto"` with a snapshot of the current operating-system preference or stamp that snapshot as `data-color-scheme`, because the card would stop reacting to later preference changes.

51. **`scroll-behavior: smooth` fights drag-scroll and momentum loops.** This CSS property tells the browser to animate every change to `scrollLeft` / `scrollTop` over its native smooth-scroll duration (~300ms in Chrome). When a JS drag handler does `strip.scrollLeft = startScroll - dx` on every `pointermove`, each assignment becomes a fresh ease-toward-target animation - the scroll position trails the cursor by the smooth-scroll duration and feels heavily laggy. A momentum loop's per-frame `scrollLeft` writes get the same treatment, so even the fling decays to nothing visible. Mobile bypasses this (native touch scroll doesn't go through the property) which makes the desktop-only nature of the bug confusing. Don't apply `scroll-behavior: smooth` to a container you intend to drag-scroll. If you want smoothness for programmatic jumps, use `element.scrollTo({ left: x, behavior: "smooth" })` only at the call site.

52. **Popover API (`popover="manual"`) reliably escapes shadow DOM stacking contexts while preserving shadow ownership.** Render the dropdown in the card's shadow root with `popover="manual"`, position it from the trigger's bounding rectangle, and call `showPopover()` or `hidePopover()` to toggle it in the browser top layer. The trigger needs `aria-haspopup` and synchronized `aria-expanded`; the popup and options need appropriate roles. Support Escape, Arrow keys, Enter or Space selection, and focus restoration. Reposition on scroll and resize while open, remove those listeners when closed or destroyed, and feature-detect the API if the supported-browser matrix expands.

53. **Single-pill-with-dropdown beats multi-pill rows for many-to-one attribute selectors.** When a domain has several "pick exactly one" attributes (climate fan_mode / swing_mode / preset_mode; media_player source / sound_mode), rendering each as a row of N chips eats vertical space and looks busier the more options the device exposes. Better: render each attribute as a single labeled pill that shows the current selection (`Fan: Auto`); tap to open a dropdown of the alternatives. Three pills in one row replaces three rows of 3-5 chips. Use the popover pattern from lesson #52 for the dropdown so it never gets clipped. The pill trigger reflects current state in its label, so the user always sees the active value at a glance - the chip-row equivalent buries it inside `data-active`. The dropdown only opens on demand, so unused attributes don't cost any visual weight.
