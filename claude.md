# HArvest - Claude Code Implementation Guide

This file is the primary reference for Claude Code implementing the HArvest project. Read this first, then consult the referenced documentation files for detail.

---

## Non-Negotiable Rules

These apply to every file, every change, every session.

**Style and formatting:**
- Never use em dashes (—) or en dashes (–) anywhere. Use commas, periods, hyphens, or semicolons instead.
- Never use ASCII arrows (→) unless the character is specifically required by a protocol or format.
- No emojis anywhere in source code, comments, or documentation.
- No forced line breaks in prose paragraphs in Markdown files.

**Code quality:**
- Python 3.11 minimum. Do not use syntax or stdlib features that require 3.12+.
- No external Python dependencies beyond what HA 2024.1+ provides.
- All async functions must be properly awaited. No fire-and-forget unless explicitly documented.
- Never use `==` for token hash comparison. Always use `hmac.compare_digest()`.
- Never log, print, or return a raw ATM token value. Only the hash is ever stored or logged.
- Every new file needs a module-level docstring.

**Before suggesting any change ask yourself:**
- Will this break anything?
- Does this contradict anything in SPEC.md?
- Is this the minimal change needed?

**Agreeability**
- When coding, always ask me questions until you are at least 95% sure you can complete the task successfully.
- Do not make any claims if you are not fully confident.
- Prioritize helping me improve over being agreeable. Be a devil's advocate and challenge me when necessary. 
- If you can solve a task with more information from me, ask for it!

---

## Repository to Create

```
github.com/sfox38/harvest   (monorepo, MIT license)
```

Structure is defined in `SPEC.md` Appendix A. Create the full directory tree before writing any code.

---

## Documentation Index

All design decisions are captured in these files. Do not make architectural decisions that contradict them without flagging the conflict.

| File | What it defines |
|------|----------------|
| `SPEC.md` | Protocol, token model, message formats, security model, entity tiers, panel UI |
| `DESIGN.md` | Visual design spec from Google Stitch. Colour tokens, typography, spacing, component specs, dark mode overrides. Currently a placeholder pending Stitch output. Use makeshift placeholder values for renderers and panel screens during initial development; a design pass will follow. Variable names here are authoritative over any guesses in theming.md once populated. |
| `api-internal.md` | Python module signatures, docstrings, and implementation notes |
| `widget-architecture.md` | JS widget internal structure, HarvestClient, HrvCard, HrvGroup, renderers |
| `panel-design.md` | Panel UI layout, wizard flow, token detail screen, shared components |
| `security.md` | Threat model, hardening guide, event bus behaviour |
| `wordpress-architecture.md` | WordPress plugin PHP implementation |
| `getting-started.md` | End-user guide (informs UX decisions) |
| `theming.md` | CSS variable reference, theme JSON format |
| `entity-types.md` | Tier 1/2/3 domains, ALLOWED_SERVICES, companion eligibility |
| `compatibility.md` | Browser, HA version, PHP requirements |
| `diagnostics.md` | Diagnostic sensor entity IDs and payloads |
| `contributing.md` | Repo structure, renderer contribution process |
| `handoff.md` | Architecture decisions, deferred features, open questions |

---

## Implementation Order

Work in this sequence. Each phase builds on the previous.

### Phase 1: Integration Core (Python)

1. `const.py` - copy exactly from `api-internal.md`. All constants, defaults, error codes.
2. `token_manager.py` - Token and EntityAccess dataclasses, full CRUD, HMAC verify, alias generation, preview tokens. Alias is generated at entity selection time in the wizard UI (not at token creation time) - the panel calls a generate_alias endpoint when each entity is selected, and the alias is stored in wizard session state until Generate is clicked.
3. `session_manager.py` - Session dataclass, create/renew/close, `subscribed_entity_ids` tracking.
4. `entity_compatibility.py` - `TIER1_DOMAINS`, `TIER3_DOMAINS`, `ALLOWED_SERVICES`, `COMPANION_ALLOWED_DOMAINS` exactly as specified. `get_support_tier()`, `validate_action()`, `is_companion_allowed()`.
5. `rate_limiter.py` - per-token and per-IP token bucket rate limiting.
6. `activity_store.py` - SQLite in WAL mode, `aiosqlite`, batched writes, `export_csv()`.
7. `event_bus.py` - all six event methods with payloads exactly as documented in `api-internal.md`.
8. `entity_definition.py` - build `entity_definition` messages from HA state.
9. `ws_proxy.py` - WebSocket handler, auth flow, message loop, alias resolution, fan-out.
10. `http_views.py` - panel API endpoints.
11. `diagnostic_sensors.py` - global and per-token sensor entities.
12. `harvest_action.py` - virtual domain registration and trigger handling.
13. `panel.py` - sidebar panel registration.
14. `__init__.py` - HA setup/teardown, wiring all modules together.
15. `config_flow.py` - HA config flow for initial setup.

### Phase 2: Widget JS

1. `harvest-client.js` - HarvestClient singleton, WebSocket, 50ms debounce, message routing, reconnect backoff (5s/10s/30s/60s with 20% jitter).
2. `state-cache.js` - StateCache with integer hash (not SHA-256 - see `widget-architecture.md` Section 8 for reason).
3. `error-states.js` - all HRV_* error states.
4. `icons.js` - MDI SVG bundle for all Tier 1 renderer icons plus `mdi:help-circle` fallback.
5. `i18n.js` - i18n string lookup with language fallback to English.
6. `theme-loader.js` - theme JSON fetch, dark mode variable injection.
7. `renderers/base-card.js` - BaseCard abstract class, `renderCompanions()`, shadow DOM helpers.
8. `renderers/` - all Tier 1 renderers. Start with `light-card.js` as the reference implementation.
9. `hrv-card.js` - HrvCard custom element, `#resolveConfig()` with three-level inheritance.
10. `hrv-group.js` - HrvGroup context provider.
11. `hrv-mount.js` - MutationObserver, `mountCard()` with parent `.hrv-group` walk.
12. Build configuration - output `dist/harvest.min.js` and `dist/harvest.min.{hash}.js`.

### Phase 3: Panel Frontend (TypeScript + React + Vite)

Source lives in `integration/frontend/src/`. Output is `integration/frontend/dist/panel.js`, committed to the repo.

1. Panel home screen - stats bar, token list, graphs (pure SVG, no charting library).
2. Token detail screen - side-by-side split, Code section, sessions, activity.
3. Wizard - all 6 steps including the "Show as aliases" code format toggle in Step 6. The toggle is Option B: it switches the snippet between `entity=` and `alias=` format without recreating the token. Both formats work. The toggle stays interactive after Generate. Aliases are generated at entity selection time (Step 1), not at Generate time. Live preview uses preview tokens.
4. Settings screen - global config, theme registry, origin registry.
5. Activity log screen - pagination, filters, CSV export.

### Phase 4: WordPress Plugin

1. `class-harvest-settings.php` - settings page, options, bundled/CDN toggle.
2. `class-harvest-shortcode.php` - `[harvest]` and `[harvest_group]` shortcodes with `alias` support.
3. `class-harvest-assets.php` - script enqueuing, idempotency guard.
4. `class-harvest-csp.php` - Content Security Policy header injection.
5. `harvest.php` - plugin entry point, hooks.
6. `uninstall.php` - option cleanup (exactly the four options listed, no others).

### Phase 5: Themes, i18n, Docs Completion

1. `widget/themes/default.json`, `glassmorphism.json`, `accessible.json`.
2. `widget/i18n/en.json` and other bundled languages.
3. Complete stub sections in `entity-types.md`, `theming.md`, `diagnostics.md`, `contributing.md`.

---

## Critical Implementation Rules

These rules must not be violated. They represent explicit decisions made during design.

**Protocol rules:**
- `entity_ids` in auth messages may contain real entity IDs, aliases, or a mix - one per card depending on which attribute the card uses. Companion entity references in the list follow the same convention as the primary entity of their card. The field name stays `entity_ids` regardless.
- Config is resolved lazily at WebSocket connection time, not at card mount time.
- `unsubscribe` sends no server response. The message loop must not wait for an ack.
- After `renew`, the server resends `entity_definition` + `state_update` for all entities in `session.subscribed_entity_ids`. The client does not re-send the entity list.
- `auth_ok` entity_ids uses alias (not real entity_id) for sessions where an alias is set.

**Security rules:**
- `ALLOWED_SERVICES` is a whitelist. Reject any action not in the map before consulting HA.
- `TIER3_DOMAINS` is blocked at token creation time, not just at auth time.
- Token secret (`token_secret`) is stored as **plaintext** in HA's `.storage/harvest_tokens` file. It must be plaintext - HMAC verification is impossible with only a hash. Security claim: the secret is not in public HTML, not that it is never stored on the server.
- HMAC verification must use `hmac.compare_digest()` for constant-time comparison.
- Timestamp must be within 60 seconds of server time. Reject stale auth messages.
- `allow_paths` checks `Referer` header only, never `Origin`. Pass if `Referer` is absent.
- Origin validation is server-side on a spoofable header. Reliable for browser clients; non-browser tools can fake it. Do not claim it is "browser enforced."

**Widget rules:**
- HarvestClient singleton key is `haUrl + "|" + tokenId` - not just `haUrl`. Two different tokens pointing at the same HA instance must get separate clients and separate WebSocket connections.
- `#cards` Map is last-write-wins. `registerCard()` uses `map.set()` which overwrites. `getCard()` returns whatever is currently in the Map - not "the first registered."
- `entity=` takes priority over `alias=` when both are present on the same `<hrv-card>` or `hrv-mount` div. Log `console.warn` when both are present. Never output both on the same element.
- Alias is generated at entity selection time in the wizard (Step 1), stored in wizard state, persisted on Generate. It is random base62, not derived from entity_id.
- Companion values in the `companion=` attribute follow the same entity/alias convention as the card's primary attribute. When `entity=` is set, companions are real entity IDs. When `alias=` is set, companions are aliases.
- The "Show as aliases" toggle in Step 6 and the token detail Code section is a display toggle only - it switches the snippet format without changing the token. Both formats work.
- The cache key uses a fast synchronous integer hash (djb2-style), not `crypto.subtle` (async constraint). See `widget-architecture.md` Section 8.
- `registerRenderer()` is last-write-wins. Log `console.warn` on collision.
- All CSS animations must respect `prefers-reduced-motion`.
- All interactive elements in renderers must carry `part="..."` attributes.
- Companions with `"read"` capability never attempt service calls regardless of domain.

**Data rules:**
- `token.expires` is `ISO 8601 datetime | null`. Never `false`.
- `TOKEN_ID_LENGTH = 22` base62 characters after the `hwt_` prefix.
- `SESSION_ID_LENGTH = 22` base62 characters after the `hrs_` prefix.
- `ALIAS_LENGTH = 8` base62 characters.
- All token IDs in examples must be exactly 22 chars after prefix.
- `PLATFORM_VERSION` in `const.py` must always match the SPEC.md version header. It is the version the integration reports to HA and the panel.
- `binary_sensor.harvest_running` device class is `connectivity`. `running` is not a valid `BinarySensorDeviceClass` in HA core and will fail config validation.
- `SessionConfig.max_renewals = None` means unlimited. `SessionConfig.absolute_lifetime_hours = None` defers to the global `CONF_ABSOLUTE_SESSION_LIFETIME` (72h).
- `RateLimitConfig.override_defaults = False` means merge with global DEFAULTS (token values cap global). `True` means use token values exclusively.

**Architecture rules:**
- No external runtime dependencies in `widget/src/`. Native browser APIs only.
- No external runtime dependencies in the integration beyond HA's bundled packages (`aiosqlite` is bundled with HA).
- The panel (frontend) is TypeScript + React, compiled to a single JS bundle by Vite. The compiled dist is committed to the repo so HACS users need no build toolchain.
- The widget remains vanilla JS Web Components with zero runtime dependencies. No React in the widget.
- dist files must be committed to the repo (jsDelivr serves from GitHub).

---

## Key Constants

The `api-internal.md` version of `const.py` is authoritative and complete. The excerpt below is a reference summary only - always use `api-internal.md` as the source of truth when implementing `const.py`.

```python
TOKEN_PREFIX = "hwt_"
SESSION_PREFIX = "hrs_"
TOKEN_ID_LENGTH = 22
SESSION_ID_LENGTH = 22
ALIAS_LENGTH = 8
BASE62_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

CONF_ABSOLUTE_SESSION_LIFETIME = "absolute_session_lifetime_hours"
DEFAULTS = {
    "auth_timeout_seconds": 10,
    "max_entities_per_token": 50,
    "keepalive_interval_seconds": 30,
    "keepalive_timeout_seconds": 10,
    "heartbeat_timeout_seconds": 60,
    "activity_log_retention_days": 30,
    "absolute_session_lifetime_hours": 72,
    "max_auth_attempts_per_token_per_minute": 10,
    "max_auth_attempts_per_ip_per_minute": 20,
    "default_session": {
        "lifetime_minutes": 60,
        "max_lifetime_minutes": 1440,
    },
    "ha_event_bus": {
        "harvest_token_revoked": True,
        "harvest_suspicious_origin": True,
        "harvest_session_limit_reached": True,
        "harvest_flood_protection": True,
        "harvest_session_connected": False,
        "harvest_auth_failure": False,
    },
}
```

---

## Open Questions Requiring Decisions During Implementation

These were not resolved during the design phase. Make a decision and document it in a comment.

1. **harvest_action storage** - where are `harvest_action` definitions stored? Alongside tokens in HA's `Store` helper, a separate Store key, or in the config entry data? Recommendation: separate `Store` key (`harvest_actions`) parallel to `harvest_tokens`.

2. **Panel HTTP API authentication** - the panel's HTTP endpoints need to verify the requester is an authenticated HA user. Use HA's standard `async_get_current_user()` pattern from `homeassistant.components.http`. Reject with 401 if no valid session.

3. **hrv-mount parent walk** - `mountCard()` in `hrv-mount.js` must walk the DOM to find a parent `.hrv-group` and inherit `data-token`/`data-ha-url` when not set on the mount element. Walk `element.parentElement` until `document.body`, check `classList.contains("hrv-group")` at each step.

4. **JS test runner** - choose before writing widget tests. Recommendation: Vitest (lightest, no config for vanilla JS).

5. **config_flow.py** - the HA config flow should collect no required user input on initial setup. All configuration lives in the panel Settings screen. The config flow just registers the integration entry.

---

## Deferred Features - Do Not Implement

Do not implement these in v1 even if they seem straightforward. They are out of scope by explicit decision.

- WordPress Gutenberg block (plugin v1.1)
- REST polling fallback for WebSocket-blocked environments (v1.1)
- WordPress WP-CLI `wp harvest` commands (plugin v1.1)
- WordPress REST API configuration endpoint (plugin v1.1)
- Media player album art and seek bar
- Per-entity command cooldown (global `max_commands_per_minute` is sufficient for v1)
- Token risk indicator badge (panel v1 polish deferral)
- `harvest_action_triggered` HA event (use `state_changed` via entity state transition)
- History graphs for `input_number`, `cover`, and other non-sensor numeric domains
- `scene` domain (Tier 3, deferred to v2 review)

---

## Testing Expectations

- Integration: pytest, using HA's test harness (`pytest-homeassistant-custom-component`)
- Widget: Vitest (recommended) or Jest
- WordPress plugin: PHPUnit

All three test suites should be runnable independently. The integration tests must not require a live HA instance - use HA's mock infrastructure.

---

## Example Token for Tests

Use this consistent token in all test fixtures and examples:

```
hwt_a3F9bC2d114eF5A6b7c8dE   (22 chars after prefix, mixed case)
hwt_a3f9bc2d114ef5a6b7c8de   (22 chars after prefix, lowercase - for WordPress shortcode examples)
```

Session ID example: `hrs_f9A2b3C4d5e6F7a8b9c0dE` (22 chars after prefix)
