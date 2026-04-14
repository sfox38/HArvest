# HArvest Compatibility Reference

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

This document lists the browser, platform, and network requirements for HArvest. It covers the widget (client-side), the integration (server-side), and the WordPress plugin separately since each has different requirements.

---

## Table of Contents

1. [Widget Browser Requirements](#widget-browser-requirements)
2. [Integration Requirements](#integration-requirements)
3. [WordPress Plugin Requirements](#wordpress-plugin-requirements)
4. [Network Requirements](#network-requirements)
5. [Known Limitations](#known-limitations)

---

## 1. Widget Browser Requirements

The HArvest widget uses standard web platform APIs available in all modern browsers. No polyfills are included and none are required for supported browsers.

### Required APIs

| API | Used for |
|-----|----------|
| Custom Elements v1 | `<hrv-card>` and `<hrv-group>` element registration |
| Shadow DOM v1 | Widget style encapsulation |
| CSS Custom Properties | Theme variable injection |
| WebSocket | Live state connection to HA |
| `localStorage` | State cache for offline display |
| `MutationObserver` | Detecting dynamically added widget elements |
| `requestAnimationFrame` | Batched DOM updates |
| `fetch` | Theme JSON file loading |

### Supported Browsers

| Browser | Minimum version | Notes |
|---------|----------------|-------|
| Chrome / Chromium | 67+ | Full support |
| Firefox | 63+ | Full support |
| Safari | 12.1+ | Full support. `ws://` to localhost permitted for local dev |
| Edge (Chromium) | 79+ | Full support |
| Edge (Legacy) | Not supported | Missing Custom Elements v1 |
| Internet Explorer | Not supported | Missing all required APIs |
| Samsung Internet | 9.0+ | Full support |
| Opera | 54+ | Full support |

These version floors are set by Custom Elements v1 and Shadow DOM v1 support, which are the most restrictive requirements. In practice, any browser released after mid-2019 meets all requirements.

### JavaScript Requirement

The widget is entirely JavaScript-based. It will not function when:

- JavaScript is disabled in browser settings
- A browser extension (NoScript, uBlock Origin in strict mode, etc.) blocks scripts from the page domain
- A Content Security Policy on the host page blocks the widget script source

Visitors with JS disabled will see an empty element. No server-side rendering fallback is provided.

### Visitor vs Developer Environment

The browser requirements above apply to both the page author during development and to end visitors. If you are building a widget for a specific known audience (e.g. an internal office dashboard), you can rely on knowing which browser your visitors use. For public-facing pages, assume any modern browser.

---

## 2. Integration Requirements

### Home Assistant

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| Home Assistant Core | 2024.1 | Required for `HomeAssistantView`, `Store`, and `async_listen` API stability |
| Installation method | Any | OS, Container, Supervised, or Core all work |
| HACS | Any current version | Required for installation. Manual installation is possible but unsupported |

The integration uses only stable public HA APIs. It does not rely on any internal or undocumented HA modules. The specific HA APIs used are:

- `homeassistant.helpers.storage.Store` - token persistence
- `homeassistant.components.http.HomeAssistantView` - WebSocket endpoint registration
- `homeassistant.core.HomeAssistant` - event bus, state access, service calls
- `homeassistant.helpers.entity_registry` - entity metadata lookup
- `aiohttp.web.WebSocketResponse` - WebSocket transport (via HA's bundled aiohttp)

### Python

| Requirement | Minimum |
|-------------|---------|
| Python | 3.11 |

Python 3.11 is the minimum because the integration uses `tomllib` (standard library in 3.11+) and relies on `match` statement syntax (3.10+). HA 2024.1 ships with Python 3.12, so in practice the integration always runs on 3.12+.

### SQLite

The activity store uses SQLite via Python's built-in `sqlite3` module in WAL mode. No separate SQLite installation is required. The database file is created automatically in HA's config directory on first run.

---

## 3. WordPress Plugin Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| WordPress | 5.0 | Required for `register_block_type()` API (used in plugin v1.1) |
| PHP | 7.4 | Required for typed properties and arrow functions |
| PHP | 8.0+ | Recommended. 8.1+ enables enums and fibers used in WP core |
| MySQL / MariaDB | WordPress minimum | Plugin uses standard `get_option` / `update_option` only |

The plugin uses only standard WordPress APIs (`add_shortcode`, `wp_enqueue_script`, `get_option`, `update_option`, `register_setting`, `add_settings_section`, `add_settings_field`). It does not use any third-party WordPress libraries or plugins.

### Classic Editor

The `[harvest]` shortcode works in any editor that processes WordPress shortcodes - the Classic editor, any page builder that renders shortcodes, or raw HTML blocks. The Gutenberg block editor is supported via an HTML block using the `hrv-mount` div format. A native Gutenberg block is deferred to plugin v1.1.

---

## 4. Network Requirements

### HA Instance Accessibility

The widget connects directly from the visitor's browser to your HA instance. This means HA must be:

- Reachable from the public internet (or from wherever your visitors are)
- Running on HTTPS with a valid TLS certificate

Plain HTTP is not supported for the widget connection. Browsers block mixed-content WebSocket connections (`ws://`) from HTTPS pages. The only exception is `ws://localhost` which browsers permit for local development.

### TLS Certificate

HA must have a valid, trusted TLS certificate. Self-signed certificates will cause the browser to refuse the WebSocket connection. Valid options include:

- Let's Encrypt via the HA ACME integration or a reverse proxy
- Nabu Casa cloud (certificate is managed automatically)
- Any certificate from a trusted CA installed on the HA instance or reverse proxy

### Reverse Proxy Requirements

If HA is behind a reverse proxy (nginx, Caddy, Traefik, Cloudflare, etc.), the proxy must forward WebSocket upgrade headers. Specifically:

```
Connection: Upgrade
Upgrade: websocket
```

Without these, the WebSocket handshake will fail and the widget will show "Temporarily offline". See `docs/security.md` Section 2 for configuration examples for common reverse proxies.

### Ports

The widget connects to your HA instance on whatever port your HA instance is accessible on (typically 443 for HTTPS). No additional ports need to be opened. The WebSocket connection is established over the same HTTPS connection used for the HA frontend.

### Firewall

No special inbound firewall rules are needed beyond allowing HTTPS traffic to HA's port. The widget initiates all connections outbound from the visitor's browser - there is no inbound connection from the integration to the visitor.

---

## 5. Known Limitations

### Visitors Behind Corporate Firewalls

Some corporate network environments block WebSocket connections or proxy all traffic through an HTTP proxy that does not support WebSocket upgrades. Visitors in such environments may see the widget stuck in "Temporarily offline" state even when their browser otherwise meets the requirements. This is a network environment issue and cannot be worked around at the widget level.

### Browser Extensions

Extensions that block JavaScript, WebSocket connections, or third-party scripts may prevent the widget from loading or connecting. This includes:

- NoScript (blocks JS from unlisted domains)
- uBlock Origin in strict mode
- Privacy Badger in aggressive mode
- Some ad blockers that block WebSocket connections by pattern

There is no reliable detection or graceful degradation for this case. The element will be empty.

### Private Browsing / Incognito Mode

The widget functions normally in private browsing mode with one limitation: `localStorage` is unavailable in some private browsing implementations (particularly older Safari versions). When `localStorage` is unavailable, the widget falls back to showing a loading state on each page load rather than the cached last-known state. All live functionality is unaffected.

### Content Security Policy

Host pages with a strict Content Security Policy must include the HA URL in the `connect-src` directive. See `docs/security.md` Section 2.8 for the exact directive. Pages without a CSP (most simple HTML pages) require no configuration.

### Multiple HA Instances on One Page

A page can display widgets from multiple HA instances. Each unique HA URL gets its own `HarvestClient` instance and WebSocket connection. There is no limit on the number of HA instances per page, but each connection consumes browser resources and counts against the HA instance's connection limits.
