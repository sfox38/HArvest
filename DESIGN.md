# HArvest - Visual Design Specification

**Status:** Placeholder - to be completed by Google Stitch before implementation begins.
**Required before:** widget renderers, panel UI, and `widget/themes/default.json` are built.

---

## Purpose

This document is the authoritative visual design reference for Claude Code. It defines the exact colour tokens, typography scale, spacing system, component specifications, and animation rules that all widget renderers and panel screens must implement.

When this document and `theming.md` conflict on variable names or values, this document takes precedence. If Stitch proposes variable names that differ from those in `theming.md`, update `theming.md` to match this document rather than translating between two naming systems.

---

## How to Generate This Document

1. Open Google Stitch and create a new design project named "HArvest".
2. Design the following screens and components (described below as prompts for Stitch).
3. Export the design as a token table and component specification.
4. Replace the placeholder sections below with the Stitch output.
5. Cross-check all CSS variable names against `theming.md` and reconcile any differences.

---

## What Stitch Should Design

### Widget Cards (the embeddable component)

The widget card is the core deliverable. It appears on third-party web pages, so it must look polished in isolation against any background. Design for:

- A single card showing a light entity (on/off toggle, brightness slider, icon, friendly name, state label)
- The same card in dark mode
- The same card with companions (2-3 compact secondary entities along the right edge)
- Error state (dim, faded, "unavailable" label)
- Loading state (skeleton/pulse animation)
- Three theme variants: Default (neutral, adapts to light/dark), Glassmorphism (frosted glass, for full-bleed background pages), Accessible (high contrast, no animation, larger touch targets)

### Panel Screens (the HA sidebar panel)

The panel is only seen by the HA owner. It should feel consistent with Home Assistant's own UI aesthetic. Design for:

- Dashboard home screen (stat cards, activity graphs, token list)
- Token detail screen (split layout - code on left, sessions on right)
- Wizard (6-step flow, step indicator, entity picker, code preview)
- Settings screen (form fields, theme registry, origin registry)

---

## Colour Tokens

> **Replace this section with Stitch output.**

Expected format:

| Token name | Light mode value | Dark mode value | Usage |
|-----------|-----------------|-----------------|-------|
| `--hrv-color-primary` | | | Primary interactive elements |
| `--hrv-color-surface` | | | Card background |
| `--hrv-color-surface-raised` | | | Elevated surfaces |
| `--hrv-color-border` | | | Card borders, dividers |
| `--hrv-color-text-primary` | | | Main text |
| `--hrv-color-text-secondary` | | | Labels, metadata |
| `--hrv-color-text-disabled` | | | Unavailable state text |
| `--hrv-color-state-on` | | | Entity "on" state indicator |
| `--hrv-color-state-off` | | | Entity "off" state indicator |
| `--hrv-color-error` | | | Error states |
| `--hrv-color-warning` | | | Warning states |
| `--hrv-color-success` | | | Success states |

---

## Typography

> **Replace this section with Stitch output.**

Expected format:

| Token name | Value | Usage |
|-----------|-------|-------|
| `--hrv-font-family` | | Base font stack |
| `--hrv-font-size-label` | | State labels, compact text |
| `--hrv-font-size-body` | | Default body text |
| `--hrv-font-size-heading` | | Card headings, entity names |
| `--hrv-font-weight-normal` | | |
| `--hrv-font-weight-medium` | | |
| `--hrv-font-weight-bold` | | |

---

## Spacing and Sizing

> **Replace this section with Stitch output.**

Expected format:

| Token name | Value | Usage |
|-----------|-------|-------|
| `--hrv-radius-card` | | Card corner radius |
| `--hrv-radius-control` | | Button/input corner radius |
| `--hrv-spacing-xs` | | |
| `--hrv-spacing-sm` | | |
| `--hrv-spacing-md` | | |
| `--hrv-spacing-lg` | | |
| `--hrv-icon-size-primary` | | Primary entity icon |
| `--hrv-icon-size-companion` | | Companion entity icon |

---

## Component Specifications

> **Replace this section with Stitch output.**

For each component, Stitch should describe:
- Layout (flex direction, alignment, gap)
- Dimensions (min/max width, height, padding)
- Interactive states (default, hover, active, disabled, focus-visible)
- Icon placement and size
- Typography applied to each text element
- Border and shadow
- Dark mode overrides

### hrv-card (base card)

> To be specified by Stitch.

### Light card renderer

> To be specified by Stitch.

### Sensor card renderer

> To be specified by Stitch.

### Climate card renderer

> To be specified by Stitch.

### Media player card renderer

> To be specified by Stitch.

### Companion zone

> To be specified by Stitch.

### Error and loading states

> To be specified by Stitch.

---

## Animation

> **Replace this section with Stitch output.**

All animations must be wrapped in `@media (prefers-reduced-motion: no-preference)` so they are suppressed for users who prefer reduced motion.

Expected format:

| Token name | Value | Usage |
|-----------|-------|-------|
| `--hrv-transition-fast` | | Button hover, state changes |
| `--hrv-transition-normal` | | Card transitions |
| `--hrv-transition-slow` | | Panel screen transitions |

---

## Glassmorphism Theme Overrides

> **Replace this section with Stitch output.**

The glassmorphism theme overrides only the surface and border tokens. The card background becomes semi-transparent with a backdrop blur. All other tokens inherit from the default theme.

---

## Accessible Theme Overrides

> **Replace this section with Stitch output.**

The accessible theme uses higher contrast ratios (WCAG AA minimum), removes all animations, increases touch target sizes, and uses a larger base font size. It must pass WCAG 2.1 AA colour contrast requirements for all text on background combinations.

---

## Notes for Claude Code

- This document is a placeholder pending Google Stitch output. Implementation may proceed using makeshift placeholder values for testing purposes.
- For any token marked "to be specified by Stitch", use a reasonable placeholder value and leave a `TODO: DESIGN.md` comment so the gap is visible during the design pass.
- The `default.json`, `glassmorphism.json`, and `accessible.json` theme files in `widget/themes/` must ultimately be populated from this document, not from `theming.md`. `theming.md` documents the variable names; this document will provide the values once the Stitch design pass is complete.
- When this document is populated with real values, replace all `TODO: DESIGN.md` placeholder values throughout the codebase before the first public release.
