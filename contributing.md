# Contributing to HArvest

**Status:** Draft
**Applies to:** HArvest v1.6.0+

Thank you for your interest in contributing to HArvest. This document covers how the project is structured, the principles that guide development decisions, and how to get involved.

> **Note:** This document will be expanded significantly once the repository is public and the development environment is established. Sections marked with a stub note are placeholders that will be completed at that time.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [HACS Manifest Files](#hacs-manifest-files)
3. [Development Principles](#development-principles)
4. [Components and Responsibilities](#components-and-responsibilities)
5. [Where to Start](#where-to-start)
6. [Development Setup](#development-setup)
7. [Running Tests](#running-tests)
8. [Submitting Changes](#submitting-changes)
9. [Adding a New Entity Renderer](#adding-a-new-entity-renderer)
10. [Adding a New Language](#adding-a-new-language)
11. [Documentation](#documentation)
12. [Code of Conduct](#code-of-conduct)

---

## 1. Project Structure

HArvest is a monorepo at `sfox38/harvest` with three distinct components. Each has its own technology stack and release cadence.

```
sfox38/
  SPEC.md                    protocol specification
  LICENSE                    MIT
  README.md

  integration/               Python - HACS custom integration
    custom_components/
      harvest/
        __init__.py          entry point, HA setup and teardown
        manifest.json        HACS manifest
        config_flow.py       HA config flow
        const.py             constants, defaults, error codes
        token_manager.py     token lifecycle
        session_manager.py   session lifecycle
        ws_proxy.py          WebSocket handler and message routing
        http_views.py        panel HTTP API views
        rate_limiter.py      per-token and per-IP rate limiting
        entity_definition.py entity_definition message builder
        entity_compatibility.py tier model, ALLOWED_SERVICES
        diagnostic_sensors.py HA sensor entities
        activity_store.py    SQLite activity log
        event_bus.py         HA event bus publishing
        panel.py             sidebar panel registration
        harvest_action.py    virtual harvest_action domain
    hacs.json
    frontend/                TypeScript + React - sidebar panel UI (compiled by Vite)
      src/
        components/
        App.tsx
        main.tsx
      index.html
      vite.config.ts
      dist/
        panel.js             (compiled bundle, committed to repo)

  widget/                    vanilla JS - embeddable widget
    src/
      hrv-card.js
      hrv-group.js
      hrv-mount.js
      harvest-client.js
      theme-loader.js
      state-cache.js
      error-states.js
      icons.js
      i18n.js
      renderers/
        index.js
        base-card.js
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
        generic-card.js
    dist/
    themes/
    i18n/

  docs/                      documentation (Markdown)
    getting-started.md
    theming.md
    security.md
    entity-types.md
    compatibility.md
    diagnostics.md
    contributing.md
    panel-design.md
```

---

## 2. HACS Manifest Files

Two manifest files are required for HACS integration submission. Both live in `integration/`.

### manifest.json

```json
{
  "domain": "harvest",
  "name": "HArvest",
  "version": "1.6.3",
  "documentation": "https://github.com/sfox38/harvest/blob/main/docs/getting-started.md",
  "issue_tracker": "https://github.com/sfox38/harvest/issues",
  "requirements": [],
  "dependencies": [],
  "codeowners": ["@sfox38"],
  "iot_class": "local_push",
  "config_flow": true
}
```

Key fields:

- `domain` must be `"harvest"` - this is the DOMAIN constant in `const.py` and the directory name under `custom_components/`.
- `iot_class` is `"local_push"` - the integration pushes state updates via WebSocket from a local HA instance. It does not poll.
- `config_flow: true` is required because the integration registers via HA's config flow.
- `requirements` is empty - all Python dependencies (`aiosqlite`) are bundled with HA and must not be listed here.
- `version` must be kept in sync with `PLATFORM_VERSION` in `const.py` and the SPEC.md version header.

### hacs.json

```json
{
  "name": "HArvest",
  "render_readme": true,
  "homeassistant": "2024.1.0"
}
```

- `homeassistant` sets the minimum HA version. `2024.1.0` is the floor for the APIs used (see `docs/compatibility.md`).
- `render_readme` displays the root `README.md` on the HACS integration page.

---

## 3. Development Principles

These principles inform every design and implementation decision in HArvest. When making a contribution, consider how your change interacts with each of them.

**Self-hosted first.** HArvest must work completely without any cloud dependency. No telemetry, no external auth service, no required registration. Everything runs inside the contributor's HA instance.

**No external dependencies in the widget.** The embeddable widget is a single vanilla JS file with no npm dependencies at runtime. It uses only Web Components standards and browser APIs. This constraint is intentional - it means the widget can be embedded on any page without a build step or package manager.

**Security by default.** The integration enforces all permissions server-side. The client is never trusted to declare what it is allowed to do. New entity types require explicit addition to `ALLOWED_SERVICES` and the tier model in `entity_compatibility.py`. When in doubt, deny.

**The spec is authoritative.** `SPEC.md` defines the protocol. Code follows the spec, not the other way around. If you find a discrepancy between the spec and the code, the spec is correct unless the spec is demonstrably wrong - in which case update the spec first, then the code.

**Backwards compatibility matters.** The widget is embedded on third-party pages. A breaking change to widget attributes, the WebSocket protocol, or the theme JSON format will silently break widgets on pages the contributor has no access to. All breaking changes require a spec version increment and clear migration notes.

**Minimal panel surface.** The panel is operational tooling for the HA owner, not a product for page visitors. Avoid adding UX chrome that makes it feel like a SaaS dashboard. It should feel like a well-designed HA integration panel.

---

## 4. Components and Responsibilities

Understanding which component is responsible for what prevents both duplication and gaps.

**Integration (`integration/`)** is responsible for:
- All token and session lifecycle management
- WebSocket connection handling and message routing
- Entity permission enforcement and service call validation
- Activity logging and diagnostic sensors
- The HArvest panel (served as static files from `frontend/dist/`)

**Widget (`widget/`)** is responsible for:
- Rendering entity cards on host pages
- Connecting to the integration via WebSocket
- Showing appropriate state and controls based on entity_definition
- Handling offline/stale states gracefully
- Theme application and dark mode

**The panel** (`integration/frontend/`) is the HA sidebar UI. It is a TypeScript + React application compiled by Vite to a single JS bundle, served as static files by the integration. It communicates with the integration via the HTTP views in `http_views.py`. It is not the same as the widget - the panel is only visible to the HA owner inside HA, not to public page visitors. Contributors developing the panel require Node.js and Vite; end users do not.

**Docs** (`docs/`) are the user-facing documentation. They live in the repo and are expected to be kept in sync with the code.

---

## 5. Where to Start

**Good first contributions:**

- Fixing a documentation error or adding clarity to an unclear section
- Adding a missing i18n string (see `widget/i18n/`)
- Improving error messages in the panel or widget
- Adding a missing MDI icon to `widget/src/icons.js`
- Adding a new bundled theme to `widget/themes/`
- Writing tests for an existing module

**Moderate complexity:**

- Adding a new Tier 1 entity renderer (see [Adding a New Entity Renderer](#adding-a-new-entity-renderer))
- Adding a new language (see [Adding a New Language](#adding-a-new-language))
- Improving an existing renderer (e.g. adding RGB colour picker support to LightCard)

**Requires discussion first:**

- Any change to the WebSocket protocol (open an issue and reference SPEC.md)
- Adding a new entity domain to Tier 1 or changing the Tier 3 blocked list
- Changes to the token or session data model
- New global configuration options
- Changes to the panel wizard flow

If you are unsure where your contribution fits, open a discussion issue before writing code.

---

## 6. Development Setup

> **To be documented after repository setup.** This section will cover:
>
> - Prerequisites (Python version, Node.js version, HACS dev setup)
> - Cloning the repo and initial setup commands
> - Running a local HA instance with the integration loaded in development mode
> - Serving the widget from a local development server
> - Hot reload behaviour for panel and widget changes
> - Environment variables and local configuration

---

## 7. Running Tests

> **To be documented after test infrastructure is established.** This section will cover:
>
> - Integration Python tests (pytest, HA test harness)
> - Widget JS tests (test runner TBD)
> - Panel UI tests
> - Running the full test suite
> - Coverage requirements for PRs

---

## 8. Submitting Changes

> **To be documented after repository is public.** This section will cover:
>
> - Fork and PR workflow
> - Branch naming conventions
> - Commit message format
> - PR description template
> - Required checks before review
> - Review process and response time expectations

In the meantime, the key expectations for any contribution are:

- The spec and all affected documentation are updated alongside the code change
- The SPEC.md changelog is updated with the change
- No new external runtime dependencies are introduced in the widget or the integration without prior discussion
- All existing tests pass

---

## 9. Adding a New Entity Renderer

New Tier 1 renderers are the most common meaningful code contribution. Here is the process.

### Step 1: Confirm the domain is eligible

Check that the domain is not in `TIER3_DOMAINS` in `entity_compatibility.py`. If it is, opening an issue to discuss promotion is the right first step.

### Step 2: Add the domain to entity_compatibility.py

Add the domain to `TIER1_DOMAINS` with the renderer class name. Add allowed service calls to `ALLOWED_SERVICES`. If the domain should be companion-eligible, add it to `COMPANION_ALLOWED_DOMAINS`.

### Step 3: Create the renderer file

Create `widget/src/renderers/{domain}-card.js`. Extend `BaseCard`:

```javascript
class MyDomainCard extends BaseCard {
  render(definition, shadowRoot) {
    // Build the shadow DOM once here
  }

  applyState(state, attributes) {
    // Update only what changes on state updates
  }
}
```

Key rules:

- `render()` is called once. Build structure here.
- `applyState()` is called on every `state_update`. Keep it fast - only update what changed.
- All interactive elements must have `part="..."` attributes. See `docs/theming.md` for the naming convention.
- Respect `prefers-reduced-motion` in any CSS animations.
- Use `this.sendCommand(action, data)` to send commands. Never call the WebSocket directly.
- Companions with `"read"` capability must not offer any interactive controls.

### Step 4: Register the renderer

Add an import and registration call in `widget/src/renderers/index.js`.

### Step 5: Add icons

If the renderer uses MDI icons not already in `widget/src/icons.js`, add the SVG strings for them.

### Step 6: Add i18n strings

Any user-visible strings in the renderer must be added to `widget/i18n/en.json` first. Other languages can be left as fallback to English and updated by translators.

### Step 7: Add the domain to entity-types.md

Document the new renderer in `docs/entity-types.md` under the Tier 1 section. Include the supported controls, history graph support, and companion eligibility.

### Step 8: Update the SPEC.md Tier 1 table and changelog

Add the domain to the Tier 1 table in SPEC.md Section 16 and add a changelog entry.

---

## 10. Adding a New Language

HArvest ships with a set of bundled languages in `widget/i18n/`. Adding a new language requires only a JSON translation file - no code changes.

### Step 1: Copy the English base file

```bash
cp widget/i18n/en.json widget/i18n/{language-code}.json
```

Use a BCP 47 language tag as the filename (e.g. `ko.json` for Korean, `nl.json` for Dutch).

### Step 2: Translate all string values

Every key in the file must have a translated value. Do not leave any values as the English original unless the term is a proper noun or technical term with no natural translation.

### Step 3: Add the language to const.py

Add the language code to the `SUPPORTED_LANGUAGES` list in `integration/custom_components/harvest/const.py`.

### Step 4: Update compatibility.md

Add the language to the supported languages table in `docs/compatibility.md`.

> **Note:** Machine-translated submissions are welcome as a starting point but will be reviewed by a native speaker before merging. If you are not a native speaker of the target language, please note this in your PR.

---

## 11. Documentation

Documentation lives in `docs/` alongside the code. It is expected to be updated in the same PR as any code change that affects user-facing behaviour.

**When the spec changes:** update `SPEC.md` with the change and add a changelog entry. If the change affects a doc file, update that file too.

**When a renderer is added or changed:** update `docs/entity-types.md`.

**When a theme variable is added:** update `docs/theming.md`.

**When a new HA or browser version is explicitly tested:** update `docs/compatibility.md`.

Documentation PRs (fixing errors, improving clarity, adding examples) are welcome without any associated code change.

---

## 12. Code of Conduct

HArvest follows the Contributor Covenant Code of Conduct. In short: be respectful, be constructive, and assume good intent.

> **To be linked after repository is public:** the full Code of Conduct will be in `CODE_OF_CONDUCT.md` at the repo root.
