# HArvest Theming Guide

**Status:** Draft
**Applies to:** HArvest Widget v1.6.0+

This guide covers how to customise the appearance of HArvest widgets. It describes the three styling tiers available, the full CSS custom property variable reference, how to create and host a custom theme, and how the three bundled themes are designed.

---

## Table of Contents

1. [Three-Tier Styling Model](#three-tier-styling-model)
2. [Setting a Theme](#setting-a-theme)
3. [Theme JSON Format](#theme-json-format)
4. [CSS Custom Property Reference](#css-custom-property-reference)
5. [Dark Mode and Light Mode](#dark-mode-and-light-mode)
6. [Named Parts Reference](#named-parts-reference)
7. [CSS Animations](#css-animations)
8. [Bundled Themes](#bundled-themes)
9. [Creating a Custom Theme](#creating-a-custom-theme)
10. [Custom Renderers](#custom-renderers)

---

## 1. Three-Tier Styling Model

HArvest provides three independent styling mechanisms. Use the simplest one that meets your needs.

**Tier 1 - CSS Custom Properties.** Set named CSS variables that pierce the Shadow DOM boundary by design. This is the primary theming mechanism and covers the vast majority of use cases. Variables can be set via a theme JSON file, the `theme-url` attribute, or `HArvest.config()`. Recommended for all non-developers and most developers.

**Tier 2 - `::part()` Selectors.** Every meaningful element inside the Shadow DOM carries a `part="..."` attribute. Target these from your host page stylesheet using standard CSS. Useful when you need to change structural properties that are not exposed as CSS variables - for example removing borders entirely, changing flex layout direction, or applying a specific font metric.

```css
hrv-card::part(toggle-button) {
  background: hotpink;
  border-radius: 0;
}
hrv-card::part(brightness-slider) {
  accent-color: coral;
}
```

**Tier 3 - Custom Renderers.** Register a completely custom renderer class for any entity type via `HArvest.registerRenderer()`. Full control over HTML structure, CSS, and behaviour. Existing renderers can be extended:

```javascript
class MyLightCard extends HArvest.renderers.LightCard {
  render(definition, shadowRoot) {
    super.render(definition, shadowRoot);
    // customise further
  }
}
HArvest.registerRenderer("light", MyLightCard);
```

See the [Custom Renderers](#custom-renderers) section for more detail.

---

## 2. Setting a Theme

Themes can be set at three levels, following the same inheritance chain as other widget configuration.

**A note on naming convention:** HArvest config keys use camelCase in JavaScript (`themeUrl`, `haUrl`) and kebab-case as HTML attributes (`theme-url`, `ha-url`). This is standard Web Components convention. The values are identical - only the key format differs based on context. The table below shows both forms for theme-related settings:

| JavaScript (HArvest.config) | HTML attribute | Description |
|-----------------------------|---------------|-------------|
| `themeUrl` | `theme-url` | URL to a theme JSON file |

This same camelCase/kebab-case pattern applies to all HArvest configuration keys.

### Page level (applies to all cards)

```html
<script>
  HArvest.config({
    haUrl: "https://myhome.duckdns.org",
    token: "hwt_a3F9bC2d114eF5A6b7c8dE",
    themeUrl: "https://yoursite.com/themes/midnight-blue.json",
  });
</script>
```

### Group level (applies to cards in that group)

```html
<hrv-group theme-url="https://yoursite.com/themes/compact.json">
  <hrv-card entity="light.bedroom_main"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
</hrv-group>
```

### Card level (applies to one card, overrides everything above)

```html
<hrv-card entity="light.bedroom_main" theme-url="https://yoursite.com/themes/special.json"></hrv-card>
```

### Inline theme (avoid in CMS environments)

For quick testing, a theme object can be inlined as a JSON string in the `theme` attribute. This is not recommended for production because most CMS editors will sanitise or encode it:

```html
<hrv-card entity="light.bedroom_main" theme='{"variables":{"--hrv-card-border-radius":"0px"}}'></hrv-card>
```

---

## 3. Theme JSON Format

A theme is a plain JSON file served from any publicly accessible URL. The widget fetches it once per page load and caches it for the duration of the session.

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
    "--hrv-card-font-size": "14px"
  },
  "dark_variables": {
    "--hrv-card-background-color": "#0d0d1f",
    "--hrv-card-color": "#f0f0ff"
  }
}
```

### Required fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name shown in the panel theme picker |
| `harvest_version` | integer | Must be `1` for this spec version |
| `variables` | object | CSS custom property key-value pairs |

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `author` | string | Theme author name |
| `version` | string | Theme version string |
| `dark_variables` | object | Variable overrides applied when `prefers-color-scheme: dark`. Only the overridden keys need to be included. |

The widget silently ignores unknown variables and unknown top-level fields. Third-party theme authors must only use variables from the published list in Section 4.

### Hosting a theme file

Theme JSON files can be hosted anywhere the browser can fetch them - your own web server, a CDN, a GitHub raw URL, etc. The server must send CORS headers permitting the widget's origin to fetch the file. Most CDNs and static hosts do this by default. If fetching fails, the widget falls back to the Default theme and logs a warning.

```
Access-Control-Allow-Origin: *
```

---

## 4. CSS Custom Property Reference

All HArvest CSS variables are prefixed `--hrv-` and named to mirror their underlying CSS property. The widget applies these variables inside the Shadow DOM.

> **Note:** The table below lists all variables defined in the current spec. Additional renderer-specific variables (for media_player, climate, cover, etc.) will be added here post-implementation as each renderer is built. Variables marked with an asterisk (*) are applied by the base card and available in all renderers.

### Card structure

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-card-background-color` * | color | Card background |
| `--hrv-card-color` * | color | Default text color |
| `--hrv-card-accent-color` * | color | Accent color used for active states, sliders, and highlights |
| `--hrv-card-border-radius` * | length | Card corner radius |
| `--hrv-card-border` * | border shorthand | Card border |
| `--hrv-card-box-shadow` * | shadow | Card box shadow |
| `--hrv-card-padding` * | length | Inner padding |
| `--hrv-card-font-family` * | font-family | Card font. `inherit` uses the host page font |
| `--hrv-card-font-size` * | length | Base font size |
| `--hrv-card-min-width` * | length | Minimum card width |
| `--hrv-card-max-width` * | length | Maximum card width |

### Entity name and icon

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-name-color` * | color | Entity friendly name text color |
| `--hrv-name-font-size` * | length | Entity name font size |
| `--hrv-name-font-weight` * | value | Entity name font weight |
| `--hrv-name-margin-bottom` * | length | Space between name row and controls |
| `--hrv-icon-size` * | length | Primary entity icon size |
| `--hrv-icon-color-on` * | color | Icon color when entity is on |
| `--hrv-icon-color-off` * | color | Icon color when entity is off |

### State label

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-state-on-color` * | color | State text color when on |
| `--hrv-state-off-color` * | color | State text color when off |
| `--hrv-state-unavailable-color` * | color | State text color when unavailable |
| `--hrv-state-font-size` * | length | State label font size |

### Toggle button

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-toggle-background-color-on` | color | Toggle track color when on |
| `--hrv-toggle-background-color-off` | color | Toggle track color when off |
| `--hrv-toggle-border-radius` | length | Toggle pill border radius |
| `--hrv-toggle-width` | length | Toggle width |
| `--hrv-toggle-height` | length | Toggle height |
| `--hrv-toggle-transition-duration` | time | State change animation duration |

### Sliders (brightness, color temperature)

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-slider-track-color` | color | Unfilled portion of slider track |
| `--hrv-slider-fill-color` | color | Filled portion of slider track |
| `--hrv-slider-thumb-color` | color | Slider thumb color |
| `--hrv-slider-thumb-size` | length | Slider thumb diameter |
| `--hrv-slider-height` | length | Track height |
| `--hrv-slider-border-radius` | length | Track and thumb border radius |

### Stale and error states

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-stale-indicator-display` * | display | Set to `none` to hide the stale icon. Default `block` |
| `--hrv-stale-indicator-color` * | color | Stale indicator icon color |
| `--hrv-stale-indicator-size` * | length | Stale indicator icon size |
| `--hrv-stale-overlay-opacity` * | number 0-1 | Opacity of card content when stale |
| `--hrv-error-background-color` * | color | Error state background |
| `--hrv-error-color` * | color | Error state text color |
| `--hrv-error-font-size` * | length | Error state font size |

### Companion entities

| Variable | Type | Description |
|----------|------|-------------|
| `--hrv-companion-icon-size` * | length | Companion icon size |
| `--hrv-companion-gap` * | length | Gap between companion controls |

---

## 5. Dark Mode and Light Mode

Cards follow the OS/browser `prefers-color-scheme` setting automatically with no configuration required. The Default theme includes both light and dark variable sets applied via a media query inside the Shadow DOM:

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

Custom theme JSON files can include a `dark_variables` object with overrides for dark mode. Only the variables that differ between modes need to be listed - the base `variables` values are used for everything else:

```json
{
  "name": "My Theme",
  "harvest_version": 1,
  "variables": {
    "--hrv-card-background-color": "#f5f5f5",
    "--hrv-card-color": "#1a1a1a",
    "--hrv-card-accent-color": "#0066cc"
  },
  "dark_variables": {
    "--hrv-card-background-color": "#1a1a2e",
    "--hrv-card-color": "#e0e0ff"
  }
}
```

If `dark_variables` is omitted, the same variable values are used in both modes. This means a theme that only specifies light-mode colours will look identical in dark mode.

---

## 6. Named Parts Reference

Every renderer exposes a consistent set of named `part` attributes. Target them from your host page stylesheet using `hrv-card::part(name)`.

### Universal parts (all renderers)

| Part name | Element |
|-----------|---------|
| `card` | The outer card container |
| `card-header` | Name and icon row |
| `card-name` | Entity friendly name text element |
| `card-icon` | Primary entity icon (SVG) |
| `card-body` | Controls area below the header |
| `state-label` | Current state text |
| `stale-indicator` | Stale/offline clock icon overlay |
| `error-message` | Error text container |
| `companion-zone` | Container for companion entity controls |
| `companion-icon` | Individual companion entity icon |
| `history-graph` | SVG graph container |

### Light and switch renderer parts

| Part name | Element |
|-----------|---------|
| `toggle-button` | On/off toggle element |
| `brightness-slider` | Brightness range input |
| `color-temp-slider` | Colour temperature range input |

> **To be expanded after implementation:** additional renderer-specific parts for climate, cover, media_player, fan, and other Tier 1 domains will be listed here as each renderer is built.

---

## 7. CSS Animations

State-change animations are CSS-only, driven by custom properties updated in `applyState`. No animation library is included.

The fan renderer uses this pattern for its spinning icon:

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

All built-in animations respect `prefers-reduced-motion`. Theme authors are expected to do the same:

```css
@media (prefers-reduced-motion: reduce) {
  .fan-icon { animation: none; }
}
```

The Accessible bundled theme disables all animations unconditionally via `--hrv-toggle-transition-duration: 0ms` and similar.

---

## 8. Bundled Themes

HArvest ships three themes in `widget/themes/`. They are available by name in the panel theme picker and via their CDN URL.

### Default

**File:** `widget/themes/default.json`
**CDN:** `https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/themes/default.json`

Clean, neutral design that works on any background colour. Follows the visitor's OS dark/light mode preference automatically. Uses system font (`inherit`) so the card matches the host page typography. Subtle border and light shadow. This is the theme applied when no `theme-url` is specified.

### Glassmorphism

**File:** `widget/themes/glassmorphism.json`
**CDN:** `https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/themes/glassmorphism.json`

Frosted-glass aesthetic using `backdrop-filter: blur()` and a semi-transparent background. Designed for pages with a full-bleed background image or gradient. The card appears to float above the background. Note that `backdrop-filter` is not supported in Firefox by default (requires a flag in older versions). On unsupported browsers the card falls back to a solid background.

### Accessible

**File:** `widget/themes/accessible.json`
**CDN:** `https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/themes/accessible.json`

High-contrast design meeting WCAG AA colour contrast requirements. Minimum 44x44px touch targets for all interactive elements. No animations or transitions. Clear visible focus indicators on all interactive elements. Designed for users who rely on high contrast, have motor impairments, or use keyboard navigation. The card is visually unambiguous - state changes are communicated by text and contrast, not colour alone.

---

## 9. Creating a Custom Theme

### Quickstart

Copy one of the bundled themes as a starting point. The Default theme is the best base for most custom work:

```bash
curl -o mytheme.json \
  https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/themes/default.json
```

Edit the variable values, then host the file somewhere with public HTTPS access.

Reference it in your page:

```html
<script>
  HArvest.config({
    haUrl: "https://myhome.duckdns.org",
    token: "hwt_a3F9bC2d114eF5A6b7c8dE",
    themeUrl: "https://yoursite.com/themes/mytheme.json",
  });
</script>
```

### Tips

- Only include variables you want to change. Missing variables fall back to the Default theme values.
- Use `"--hrv-card-font-family": "inherit"` to match the host page font automatically.
- Test both light and dark mode in your browser's developer tools before deploying.
- The panel's theme preview (Step 5 of the wizard) lets you test a custom theme URL before creating a token.
- Validate your JSON before hosting - a syntax error in the theme file causes the widget to fall back silently to Default.

### Adding a custom theme to the panel picker

Custom themes can be registered in the HArvest panel Settings screen under "Theme Registry". Enter the theme URL and a display name. The theme then appears in the wizard dropdown alongside the bundled themes and can be selected as a site default in WordPress plugin settings.

---

## 10. Custom Renderers

A custom renderer replaces the built-in card UI for a specific entity domain. This is Tier 3 styling - full control, full responsibility.

### Extending an existing renderer

The simplest approach is to extend a built-in renderer and override only what you need:

```javascript
class MyLightCard extends HArvest.renderers.LightCard {
  render(definition, shadowRoot) {
    super.render(definition, shadowRoot);
    // Add a custom element after the standard controls
    const label = shadowRoot.createElement("p");
    label.textContent = "Custom footer";
    shadowRoot.querySelector("[part=card-body]").appendChild(label);
  }
}

HArvest.registerRenderer("light", MyLightCard);
```

### Writing a renderer from scratch

Extend `BaseCard` and implement `render()` and `applyState()`:

```javascript
class MinimalLightCard extends HArvest.renderers.BaseCard {
  render(definition, shadowRoot) {
    shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: var(--hrv-card-padding, 16px); }
        button { font-size: 1.5rem; }
      </style>
      <button part="toggle-button">Toggle</button>
    `;
    shadowRoot.querySelector("button")
      .addEventListener("click", () => this.sendCommand("toggle"));
  }

  applyState(state, attributes) {
    const btn = this.root.querySelector("button");
    btn.textContent = state === "on" ? "Turn Off" : "Turn On";
  }
}

HArvest.registerRenderer("light", MinimalLightCard);
```

### Collision behaviour

If `registerRenderer()` is called with a key that is already registered, the new renderer replaces the existing one. A `console.warn` is logged to make the override visible during development. This means the last `registerRenderer()` call for a given key wins.

> **Note:** custom renderers are a client-side display feature only. They cannot bypass server-side entity permission enforcement. A custom renderer for `alarm_control_panel` will not receive data for that entity - the integration blocks it at the protocol level.
