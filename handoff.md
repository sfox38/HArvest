# HArvest - Project Handoff

**Date:** 2026-04-07
**Status:** Design and documentation complete. Ready for implementation.
**Author:** sfox38 (@sfox38 on GitHub)
**Repository:** sfox38/harvest (monorepo, not yet created)

---

## What This Project Is

HArvest is an open-source system for embedding live, interactive Home Assistant entity controls on any external webpage. A visitor to a blog, a rental listing, or a home dashboard can see real-time smart home states and optionally control them - without the page owner exposing their HA credentials or full HA access to the internet.

It has two components that ship together:

- **HArvest Integration** - a HACS custom integration (Python) that runs inside HA Core and acts as a permissioned proxy between the public internet and specific HA entities
- **HArvest Widget** - a vanilla JS Web Components library (single file, no dependencies) that page authors embed to display the cards

Both components are MIT licensed and fully self-hosted. There is no cloud dependency, no telemetry, and no external service required.

---

## Key Architecture Decisions and Why

### Monorepo

All code lives in `sfox38/harvest`. The integration, widget, WordPress plugin, panel UI, themes, i18n files, and documentation are all in one repository. This was chosen because the three components have tight coupling - a protocol change affects all three simultaneously - and a monorepo makes coordinated releases and cross-component testing straightforward. It also simplifies the contributor experience: one repo to clone, one issue tracker.

### Vanilla JS Widget, No Dependencies

The widget (`widget/src/`) has zero npm dependencies at runtime. It uses Custom Elements v1, Shadow DOM, and CSS Custom Properties - all native browser APIs. This was a hard constraint chosen for two reasons: the widget is embedded on third-party pages that the author does not control, so any dependency loading failure would break the widget; and a single self-contained file is trivially embeddable anywhere, including CMS platforms that cannot run a build tool. The widget is built via a bundler but the output must be a single file with no external imports.

### WebSocket, Not HTTP Polling

The widget connects via WebSocket, not HTTP polling. This was chosen for real-time state push (entity state changes appear on the widget within milliseconds of happening in HA), connection efficiency (one persistent connection vs repeated HTTP requests), and bidirectionality (commands flow back on the same connection as state updates). HTTP polling is a documented deferred feature for environments that block WebSockets.

### Token-Based, Not Credential-Based

Widget tokens are scoped to specific entities with specific capabilities. They are not HA user accounts or long-lived access tokens. This was a deliberate security decision: a compromised widget token exposes only the entities listed in that token, not the full HA instance. Tokens can be revoked instantly. The HA long-lived access token never leaves the server.

### Integration as Proxy, Not Direct HA WebSocket Forwarding

The integration does not forward messages to HA's own WebSocket API. Instead, it calls HA's Python service layer directly (`hass.services.async_call()`) and reads state via `hass.states.get()`. This was chosen because it allows strict server-side enforcement of the `ALLOWED_SERVICES` whitelist - arbitrary service calls cannot slip through - and because it insulates the widget from HA's internal WebSocket protocol changes across HA versions.

### No Framework in the Panel UI

The panel (frontend) is TypeScript with React, compiled to a single JS bundle by Vite. The compiled bundle is committed to the repository so HACS users need no build toolchain. Contributors developing the panel require Node.js and Vite. The panel is only seen by the HA owner, not by page visitors. The widget remains strictly vanilla JS Web Components with no runtime framework dependencies - these are separate build concerns.

### SQLite for Activity Logging

The activity log uses SQLite via `aiosqlite` in WAL mode rather than HA's own storage helpers. HA's storage helpers use JSON files which are not well-suited to high-frequency append operations or SQL queries. The activity log is write-heavy (every auth, command, and session event) and the panel needs to query and paginate it. SQLite is the right tool.

### Three-Level Configuration Inheritance

Widget configuration (`ha-url`, `token`, `theme-url`, `lang`) resolves via a three-level chain: card attribute > group attribute > `HArvest.config()` page-level default. This was chosen after discovering during documentation writing that requiring `ha-url` and `token` on every `<hrv-card>` element was verbose and error-prone on pages with multiple cards. The `HArvest.config()` call in the page `<head>` sets defaults once; cards only specify what differs. The WordPress plugin already did the equivalent server-side; this makes plain HTML pages equally convenient.

### Entity Aliases for Privacy

The token detail Code section and wizard Step 6 offer a "Show as aliases" toggle that switches the generated HTML snippet between `entity="light.bedroom_main"` and `alias="dJ5x3Apd"` format. Both versions of the snippet work against the same token - the server accepts either format. This is a display preference, not a token configuration.

The alias is generated at entity selection time in the wizard (Step 1), stored in wizard session state, and persisted to the token when Generate is clicked. Aliases are 8-character random base62 strings - not derived from the entity ID. This was a deliberate decision: hash-derived aliases would be reversible by anyone who knows the hash function and has a list of common HA entity IDs (which are highly predictable), defeating the privacy purpose entirely.

`entity=` takes priority over `alias=` when both are present on the same element. This is the intentional semantic - they are not interchangeable. Both the widget JS and the WordPress plugin log a warning when both are present on the same element.

Companion entity references in the `companion=` attribute follow the same convention as the card's primary attribute. When `entity=` is set, companions are real entity IDs. When `alias=` is set, companions are aliases. A card never mixes real IDs and aliases within its `companion` attribute.

The privacy protection is at the HTML source level only. Once a visitor's browser connects, the `entity_definition` message includes the entity's friendly name, which is visible to the visitor. Aliases obscure the HA entity ID naming structure from page source inspection, not from the widget data itself.

---

## Explicitly Deferred Features

These features are documented and understood but intentionally excluded from v1. They are listed here so they are not accidentally implemented and not accidentally forgotten.

### WordPress Gutenberg Block (Plugin v1.1)

The WordPress plugin v1 supports the Classic editor only via the `[harvest]` shortcode. A native Gutenberg block with a visual inspector panel is deferred to plugin v1.1. The shortcode format is fully functional for power users. The block would add a visual configuration UI inside the block editor and would output the same `hrv-mount` div. Architecture is documented in `docs/wordpress-architecture.md` Section 11.

### REST Polling Fallback (v1.1)

Some corporate and institutional network environments block WebSocket connections. A REST polling fallback would allow the widget to fall back to periodic HTTP requests when WebSocket is unavailable. Deferred because it adds significant complexity to both the client and server, and the target audience for v1 (home users embedding on personal or small business sites) rarely encounters WebSocket blocking.

### WordPress WP-CLI Support (Plugin v1.1)

A `wp harvest` command family for managing plugin settings from the command line. Documented in `docs/wordpress-architecture.md` Section 11. Useful for automated deployments but not needed for v1.

### WordPress REST API Endpoint (Plugin v1.1)

An optional endpoint returning plugin configuration for headless WordPress setups. Documented in `docs/wordpress-architecture.md` Section 11.

### Media Player Album Art and Seek Bar

The `media_player` renderer in v1 shows track title, artist, album, and transport controls. Album art display and a seek bar are explicitly excluded from v1 because they require additional protocol work (the integration would need to proxy image URLs or provide seek position as a high-frequency attribute) and are not essential for basic media control.

### Per-Entity Command Cooldown

A per-entity rate limit preventing commands more frequently than a configurable interval (e.g. 500ms between toggles). The global `max_commands_per_minute` rate limit exists but a per-entity cooldown does not. Deferred as a low-priority refinement.

### Token Risk Indicator Badge

A visual badge on each token card in the panel showing the token's risk level at a glance (e.g. `READ-WRITE · PUBLIC`, `READ-WRITE · HMAC SECURED`). Fully designed and documented in `docs/panel-design.md` Section 3. No API or protocol changes needed to add it - the data is already on the token object. Deferred from v1 as a UI polish item.

### harvest_action HA Event Bus Trigger

`harvest_action` entities briefly transition from `idle` to `triggered` and back, which fires HA's `state_changed` event. A more reliable mechanism would be a dedicated `harvest_action_triggered` HA event fired directly rather than relying on the state transition, which may be rate-limited or missed. Deferred because the `state_changed` mechanism works for most automation use cases in v1.

### Scene Domain (Tier 3 Review for v2)

`scene` is currently Tier 3 blocked. It could be reviewed for Tier 2 or Tier 1 support in v2 with appropriate safeguards. Wide multi-device effects are the concern; a scoped scene approach might be acceptable.

### History Graphs for Non-Sensor Numeric Domains

History graphs are supported for sensors. `input_number`, `cover` (position), and other numeric-valued domains do not get history graphs in v1. Straightforward to add post-v1 since the protocol already supports `history_data` messages.

---

## Known Open Questions

These are questions that arose during the design phase that do not have a definitive answer yet. They need resolution during implementation.

### harvest_action Configuration UI

The `harvest_action` virtual domain is fully specified at the protocol level but the panel UI for creating and managing `harvest_action` entities is not yet designed. It is expected to be a dedicated screen in the panel, but the exact flow - whether it is part of the token wizard, a separate management screen, or configuration via HA's config flow - needs to be decided during implementation. See `docs/entity-types.md` Section 6.

### Widget JS Test Runner

The widget has no test framework chosen. Python tests use pytest against HA's test harness. The widget needs a JS test runner. Options are Vitest (lightest, Vite-native), Jest (most familiar), or web-test-runner (closest to real browser). Decision deferred to implementation. See `docs/contributing.md` Section 6.

### hrv-mount Parent Walk Implementation

The `hrv-mount.js` data-attribute mount mode needs to walk the DOM to find a parent `.hrv-group` div and inherit `data-token` and `data-ha-url` from it when the mount element itself does not specify them. The behaviour is specified (a child `.hrv-mount` inherits from its parent `.hrv-group`) but the exact implementation is not shown in `docs/widget-architecture.md`. The `HrvCard` custom element does this walk via `#inheritFromGroup()` in `connectedCallback`; the `hrv-mount.js` code that creates `HrvCard` elements from divs needs to perform the equivalent lookup before setting card attributes.

### harvest_action Entity Storage

`harvest_action` entities are not standard HA entities - they are created and managed by the HArvest integration itself. The storage mechanism for their definitions (label, mapped HA service calls) is not specified. Options are: stored alongside tokens in the HA `Store` helper, stored in a separate `Store` key, or stored as part of the integration config entry. This needs a decision at implementation time.

### Panel Authentication

The HArvest panel is a custom sidebar panel inside HA. It inherits HA's own authentication - only logged-in HA users can reach it. No additional auth layer is needed. However, the panel makes HTTP requests to the integration's `http_views.py` endpoints. These views need to verify that the requester is an authenticated HA user. The standard HA approach is to check the `Authorization` header using HA's auth system. This is standard practice for HA custom integrations but is not explicitly documented in the HArvest docs.

---

## Documentation Completeness

All twelve documentation files exist. Eight are complete. Four are partial placeholders:

| Document | Status | What is missing |
|----------|--------|-----------------|
| `SPEC.md` | Complete | Nothing |
| `api-internal.md` | Complete | Nothing |
| `widget-architecture.md` | Complete | Nothing |
| `panel-design.md` | Complete | Nothing |
| `security.md` | Complete | Nothing |
| `wordpress-architecture.md` | Complete | Nothing |
| `getting-started.md` | Complete | Nothing |
| `compatibility.md` | Complete | Nothing |
| `theming.md` | ~70% | CSS variable table is partial - renderer-specific variables not yet defined |
| `diagnostics.md` | ~65% | Automation examples need real entity IDs from implementation |
| `entity-types.md` | ~60% | Card visual appearance sections need screenshots/description post-implementation |
| `contributing.md` | ~40% | Dev setup, test infrastructure, PR process all need real repo |

---

## What Is Not Documented

A few things are real but not yet fully pinned in the docs:

- **Panel HTTP API:** the endpoints in `http_views.py` that the panel JS calls are described loosely. The exact URL paths, request/response schemas, and authentication mechanism are implementation details that were left to the implementor rather than formally specified.
- **config_flow.py:** the HA config flow for initial integration setup (what questions it asks, what options it sets) is not documented. It should produce the global config documented in SPEC.md Section 19.
- **MDI icon bundle contents:** the specific MDI icons bundled in `widget/src/icons.js` are not enumerated. Implementors should include at minimum the icons used by Tier 1 renderers, with fallback to `mdi:help-circle`.

---

## Contact and Repository

- GitHub: @sfox38
- YouTube: @SecretFriend
- Repository to be created at: `github.com/sfox38/harvest`
- License: MIT
