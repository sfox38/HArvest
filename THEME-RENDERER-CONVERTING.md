# Converting Home Assistant cards to HArvest renderer overrides

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
| `resolveAssetUrl(rawUrl)` | Resolve a possibly-relative HA asset path (e.g. a media_player `entity_picture` like `/api/media_player_proxy/...`) against `config.haUrl` so it loads when the widget is embedded on another origin. Absolute (`http`) URLs pass through; falsy input returns `""`. Use this for album art instead of setting `img.src` to the bare attribute. |
| `formatMediaTime(seconds)` | Format seconds as `m:ss`, or `h:mm:ss` past an hour. For seek/progress labels. |
| `mediaProgress(attributes, playing)` | Returns `{duration, elapsed, fraction}` for a media_player, extrapolating `elapsed` from `media_position_updated_at` while `playing`, or `null` when there is no usable duration/position. |
| `startMediaTicker(cb)` / `stopMediaTicker()` | Start (or restart) / stop a shared 1 Hz ticker so a seek bar advances once per second while playing. Call `stopMediaTicker()` from your `destroy()`. |
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

**media_player:** `play_pause`, `next_track`, `previous_track`, `volume_set`, `volume_step`, `turn_on`, `turn_off`, `seek`

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
| `assumed_state` | `boolean` | `true` for fans whose state HA cannot confirm (RF / Bond / assumed-state platforms). Use to suppress visual reflection of attributes on buttons - see "State detection" under "Pitfalls and lessons". Available on switches, covers, lights, etc. wherever HA flags the entity as assumed. |

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
| `media_duration` | `number` | Seconds. Feed with `media_position` into `mediaProgress()` for a seek/progress bar. |
| `media_position` | `number` | Seconds |
| `media_position_updated_at` | `string` | ISO 8601 timestamp. `mediaProgress()` uses it to extrapolate the live position between updates. |
| `entity_picture` | `string` | Relative HA URL for album art. Pass through `resolveAssetUrl()` before assigning to `img.src` so it resolves against `config.haUrl` off-origin. |
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
sendCommand("media_seek", { seek_position: 42 })  // seconds; pair with mediaProgress()
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
| `entity_picture` (album art) | Works | URL is relative to the HA instance; pass it through `resolveAssetUrl()` so it resolves against `config.haUrl` when the widget is embedded off-origin |
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

## Pitfalls and lessons

Practical issues from converting real HA cards into renderer overrides, grouped by topic. Each item is a rule plus the reason it exists. Detailed mechanics live in the relevant section above; this is the deduplicated checklist.

General: attribute availability is never the bottleneck. HArvest forwards every HA attribute except the small blocklist, so if a value exists in HA it is available to the renderer. The panel preview is the primary testing tool, and it has no server, so all visible feedback comes from `predictState()`.

### Gestures and interaction

- Never use `addEventListener("click", ...)` for a primary card action (toggle, trigger). Direct listeners bypass admin-configured tap/hold/double-tap gestures entirely; this is the single most common renderer bug. Use `_attachGestureHandlers()` (two patterns in "Gesture support").
- Fixed-behavior, non-primary controls (d-pad buttons, steppers, transport, mode pills) may use direct `addEventListener` because gestures do not apply to them.
- Never attach both a click listener and a gesture handler to the same element; the click listener fires independently and bypasses gesture logic.

### Features and capabilities

- A feature-flag name is not a command name. Check the server's `FEATURE_FLAGS`, not command names: fan `set_speed` (feature) vs `set_percentage` (command); fan `direction` vs `set_direction`. For media_player the server sends `play_pause` and `previous_track` while the preview sends `play` and `previous`; check both `volume_set` and `volume_step`.
- Gate controls on `supported_features`, not only on `isWritable`, or the preview feature toggles have no effect.
- Every writable entity needs at least a toggle, even with no advanced features. Never fall back to a read-only display for a writable entity that merely lacks brightness/color/etc.
- Give every command a `predictState` entry, or the control looks broken in the (serverless) preview.
- `predictState` attributes are passed verbatim to `applyState`, not merged. If `applyState` reads list attributes (`options`, `source_list`, `effect_list`, `preset_modes`, `hvac_modes`), either populate them in `predictState` or preserve the previous value when missing/empty; otherwise the card body briefly empties on each click.
- `device_class` registration keys (e.g. `sensor.temperature`) let one renderer specialize per device class within a domain.

### Dynamic choice lists

- Read dynamic lists (`options`, `source_list`, `sound_mode_list`, `effect_list`, `preset_modes`) from the `attributes` argument in `applyState`, not from `feature_config`. Only fixed lists (e.g. `hvac_modes`) come from `feature_config`.
- Build an empty container in `render()` and rebuild its children in `applyState()` only when the list actually changes (compare a cached join key) to avoid DOM churn on every update.

### Sliders and numeric input

- Guard slider/input writes with `isFocused()` / `isSliderActive()` so `applyState` never clobbers a value mid-drag.
- For thick branded sliders, layer a transparent native `<input type="range">` over visual track-fill divs (see "Custom slider implementation"). `role="slider"` alone is not accessible: a custom slider also needs focusability, full value ARIA, keyboard handling, visible focus, and matching units across min/max/now.
- Send EXACT fractional step values, computed from `feature_config` (`(i+1) * percentage_step`, `temp_step`, etc.); round only for display labels. A 6-speed fan's step is `16.666...`; a rounded `17` snaps HA to the wrong bucket.
- Read range values with `Number(slider.value)`, not `parseInt` (which truncates the fractional step the browser snapped to). Use `parseInt` only when the step is an integer.

### Icons

- `renderIcon(name, partName)` only injects into `[part=...]` elements. For icons inside button content use inline SVG strings; if the icon is general-purpose (chevrons, cog, volume), add its path to `widget/src/icons.js` so other packs share it.
- Add any missing MDI icon to `widget/src/icons.js` before referencing it, or it silently falls back to `mdi:help-circle`. Verify with `grep` and rebuild the widget.
- Re-render state-dependent icons in `applyState` from `def.icon_state_map` (`{"on": "...", "*": "..."}`), not just once in `render()`; otherwise an off-state glyph never updates. `renderIcon` caches by part name, so calling it every `applyState` is safe.
- Flex-center icon containers (`display:flex; align-items:center; justify-content:center`) to fix the baseline offset of inline icons inside flex buttons.

### Animation and motion

- A `prefers-reduced-motion` override is mandatory for every animation and transition, even when motion is core to the source card's identity; provide a static cue (see "Animation patterns").
- Keep press feedback immediate and restrained. A short `:active` transform or color change usually suffices; use a JS-driven class only when the feedback must persist beyond the native active state.
- For a JS-driven animation class on repeat presses, remove the class, force a reflow with `void el.getBoundingClientRect()`, then re-add it, or the second trigger does nothing.
- Add `pointer-events: none` to any collapsed/hidden control set; controls hidden only by `opacity`/`max-height: 0` still receive clicks.
- Track the previous on/off state (initialized to `null` so the first `applyState` skips animating) to drive power-up/down, glow, and collapse transitions.
- Collapse controls when the entity is off for clarity, but do NOT pre-collapse in `render()` based on assumed-off. Initialize open and let `applyState` collapse only when a real off-state arrives; otherwise a delayed first update makes the card lie about state.
- Give a toggle-view container a `min-height` matching its tallest view so swapping views (slider vs buttons) does not resize the card.
- Use entry staggering only for a short group appearing; keep the total delay under 200ms and remove it under reduced motion.
- A CSS `display` rule overrides the `hidden` attribute. To hide via `el.hidden`, also add `[hidden] { display: none }`.
- A toggleable disclosure panel can hide secondary controls: keep content in stable DOM, expose state with `aria-expanded`, prefer opacity/transform, and make the final state immediate under reduced motion.

### Color and state-driven appearance

- Use `color-mix(in srgb, var(--accent) X%, var(--base))` for dynamic semi-transparent accents instead of string-building `rgba()` per channel.
- Dynamic backgrounds need a foreground-color strategy (a CSS variable or a computed color) so text and icons stay readable.
- Drive state appearance from data attributes plus CSS (`card.dataset.state = isOn ? "on" : "off"`, then `[part=card][data-state=on] { ... }`), not inline `style.background`. This lets theme JSON and dark mode compose and keeps `color-mix` recipes working.
- For mode-swap on a single slider DOM, set one CSS progress variable per mode (`--brightness-progress`, `--temp-progress`) and `data-mode` on the shell; JS only flips the attribute and updates the relevant variable, so the DOM stays stable.
- Position slider thumbs with `clamp(<half-width>, calc(var(--progress) * 1%), <100% - half-width>)` so they do not overshoot the track ends. No JS positioning needed.
- Darken near-white light colors for slider visibility: check luminance (`0.299*R + 0.587*G + 0.114*B`) and, when above ~0.85, multiply channels by 0.75-0.8. Daylight color temps (5000-6500K) need cooler, more saturated blues to read against white.
- A slider's unfilled-portion overlay needs opposite tones per scheme: a white `rgba` in light mode, a black `rgba` in dark mode. Define both in `variables` and `dark_variables`.
- Hide the brightness shading overlay for non-brightness slider modes (color temp / hue), or it muddies the gradient.
- A color picker captures source colors accurately, but treat them as a visual starting point, not an accessibility exemption. Validate contrast in both modes (see "Contrast requirements").

### State detection

- Stateless entities (RF / Bond / button-only platforms) carry `assumed_state: true`. In `applyState`, treat their commands as fire-and-forget and do not reflect attribute values on buttons; a slider may still follow state echoes but must not fight a mid-drag value. Applies cross-domain (fan, switch, cover, light). HArvest: `assumed_state` must not be in `BLOCKED_ATTRIBUTES` (`entity_definition.py`) or it will not reach the widget.

### Layout and responsiveness

- Use `:host([data-layout=vertical])` selectors plus a shared `_applyLayout(card)` helper (reading `display_hints.layout`) for card-wide layout modes; this keeps logic in CSS. Scope such cross-cutting helpers inside the renderer's own IIFE; never share a runtime library across packs.
- A `ResizeObserver` on `[part=card]` inside shadow DOM gives container-query-like behavior: toggle width-threshold classes and disconnect the observer in `destroy()`.
- For scrollable horizontal strips (forecast rows, source lists), `grid-auto-flow: column` with `grid-auto-columns: minmax(Xpx, 1fr)` is more predictable than flexbox. Add `overflow-x: auto` and hide the scrollbar.
- Do not put `scroll-behavior: smooth` on a container you drag-scroll; it animates every `scrollLeft` write and lags the cursor (desktop only, since native touch scroll bypasses it). Use `element.scrollTo({ behavior: "smooth" })` at programmatic call sites instead.
- For dropdowns, either detect drop-up via `getBoundingClientRect()` and `window.innerHeight`, or use the Popover API (`popover="manual"`) to escape shadow-DOM stacking while keeping shadow ownership. Popovers need `aria-haspopup`/`aria-expanded`, roles, Escape/Arrow/Enter handling, focus restoration, repositioning on scroll/resize, and listener cleanup.
- For several "pick exactly one" attributes (climate fan/swing/preset; media source/sound_mode), a single labeled pill showing the current value plus an on-demand dropdown beats rows of chips: less vertical space and the active value stays visible. Use the Popover pattern so it never clips.

### SVG dials

- Build a circular dial from one `<circle>` track plus one progress circle sharing `stroke-dasharray` and a `rotate` transform; vary fill with `stroke-dasharray: var(--progress-length) <circumference>`. Compute thumb position from `cos`/`sin` into CSS variables (`--thumb-left`/`--thumb-top`). No SVG path math.
- A drag-to-set dial that also has centre buttons needs an inner dead zone: return null from the pointer-to-value function inside ~42% of the outer radius so a centre tap falls through to the button.

### Theming and host isolation

- Never clear the host's inline styles (`host.style.cssText = ""`). That destroys dimensions, display rules, and custom properties owned by the embedding page; `ThemeLoader` already tracks and restores the properties it applies.
- When porting an HA-native renderer, treat HA tokens (`--ha-card-background`, `--primary-text-color`, `--warning-color`) as the contract, not the values. Map them to `--hrv-*` roles at the theme JSON layer and rename mechanically in CSS; `color-mix` recipes carry over unchanged.
- Renderer CSS is self-contained. It may ignore the `--hrv-*` variables for card internals and define its own internal variables; theme variables matter most for the wrapper (radius, shadow, padding) and companion pills.
- `color_scheme: "auto"` must keep reacting to OS changes. Track page/token/entity scheme sources separately, recompute the effective value on change, and pass `"auto"` through unchanged; never stamp the resolved OS preference as a fixed `data-color-scheme`.

### Companions, history, and build

- The companion system is a data pipeline: the framework delivers companion state, the renderer decides how (or whether) to show it. Default pills are opt-in via `renderCompanions()`; override `updateCompanionState()` to customize.
- There is no per-card companion limit. Primaries and companions both count toward the 250-entity safety cap per token.
- Forgetting `renderHistoryZoneHTML()` in the template makes the preview graph toggle do nothing for sensor, binary_sensor, and input_number.
- The initial WebSocket `renderer` URL must carry a cache-buster (`?v={mtime}`); without it browsers may serve a stale renderer even with `Cache-Control: no-store`. The reload and push paths already include it; the initial-connection path is easy to miss.
- Any build or minifier is acceptable, but it must preserve the IIFE, the `document.currentScript.dataset.rendererId` lookup, and the hardcoded fallback ID. Syntax-check the standalone source and run its contract tests.
