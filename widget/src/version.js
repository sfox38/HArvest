/**
 * version.js - Widget identity constants for the compatibility handshake.
 *
 * The two values below are replaced at build time by esbuild (see
 * widget/build.js). The replacement reads from the integration's const.py
 * so the widget bundle reports the same version the server is running -
 * eliminating widget-vs-server version drift by construction at any
 * given release.
 *
 * The widget sends these values in the auth message's `client` block:
 *   { protocol: PROTOCOL_VERSION, widget: WIDGET_VERSION, source, ... }
 *
 * In the development tree (unbundled, e.g. when running vitest), the
 * placeholders are not replaced. We declare the identifiers here so
 * tests get a sensible default ("0.0.0-dev" and 1) instead of a
 * ReferenceError. The bundled output never executes this fallback;
 * esbuild's define replaces both identifiers before the conditional
 * assignment is evaluated.
 *
 * See SPEC.md Section 12 (Client/Server Compatibility).
 */

// eslint-disable-next-line no-undef -- placeholders defined by esbuild at build time
const _bundledWidget = typeof __HRV_WIDGET_VERSION__ !== "undefined" ? __HRV_WIDGET_VERSION__ : "0.0.0-dev";
// eslint-disable-next-line no-undef
const _bundledProtocol = typeof __HRV_PROTOCOL_VERSION__ !== "undefined" ? __HRV_PROTOCOL_VERSION__ : 1;

export const WIDGET_VERSION = _bundledWidget;
export const PROTOCOL_VERSION = _bundledProtocol;
