# HArvest

[![Tests](https://github.com/sfox38/HArvest/actions/workflows/tests.yml/badge.svg)](https://github.com/sfox38/HArvest/actions/workflows/tests.yml) [![Validate](https://github.com/sfox38/HArvest/actions/workflows/validate.yml/badge.svg)](https://github.com/sfox38/HArvest/actions/workflows/validate.yml)

Securely share and control your Home Assistant smart home devices on any HTML or WordPress page

![HArvest widget cards embedded on a webpage](https://raw.githubusercontent.com/sfox38/HArvest/main/docs/hero.jpg)
## What it does

HArvest creates a secure bridge between your Home Assistant instance and any webpage. You create a widget token in the HArvest panel, pick the entities you want to expose, paste a snippet into your page, and visitors see live entity states updated in real time. Where you allow it, they can control things too - toggle lights, adjust temperature, play media, and more. Each token has its own access rules, origin restrictions, expiry, and activity log.

## Highlights

- **22 Tier 1 entity domains** - purpose-built cards cover lights, fans, climate, media players, sensors, covers, badges, timers, and more
- **Real-time WebSocket updates** - no polling, no refresh
- **Scoped token access** - each widget exposes only the entities you choose, with origin restrictions, HMAC signing, and instant revocation
- **WordPress plugin** - shortcode-based embedding, no HTML required
- **Custom themes and renderer packs** - full CSS variable control, or replace the default card UI entirely
- **Minimal widget runtime** - compact native Web Components with no external browser dependencies

## Requirements

- Home Assistant 2024.1 or later
- HTTPS remote access to your HA instance
- HACS for the supported installation method

## Installation

Add `https://github.com/sfox38/HArvest` as a custom Integration repository in HACS, download HArvest, and restart Home Assistant. Then go to **Settings > Devices and Services > Add Integration**, search for **HArvest**, and select it. The HArvest panel appears in your sidebar.

## Quick start

Embedding a light card on an HTML page:

```html
<script src="https://ha.example.com/harvest_assets/harvest.min.js"></script>
<script>HArvest.config({ haUrl: "https://ha.example.com", token: "hwt_..." })</script>
<hrv-card entity="light.bedroom_main"></hrv-card>
```

The widget JS is served by the integration itself, so it always matches your running HArvest version. The wizard generates this snippet for you.

For WordPress, install the [HArvest WordPress plugin](https://sfox38.github.io/HArvest/wordpress.html) and use a shortcode:

```
[harvest token="hwt_..." entity="light.bedroom_main"]
```

The HArvest wizard generates the exact snippet you need.

## Documentation

Full documentation: **[sfox38.github.io/HArvest](https://sfox38.github.io/HArvest)**

## Licenses

HArvest is MIT licensed. Bundled icon data carries its own licenses:

- Material Design Icons (`mdi:`) - Apache 2.0, bundled in the widget
- Font Awesome Free solid (`fa:`) - icons CC BY 4.0 (attribution preserved in the generated `icon-sets/fa.js` header)
- Phosphor (`ph:`) - MIT
- Tabler (`tabler:`) - MIT

The Font Awesome, Phosphor, and Tabler subsets are packaged from [Iconify](https://iconify.design) (MIT) icon data.
