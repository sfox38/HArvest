/**
 * client-info.js - Build the `client` block for the auth handshake.
 *
 * Captures `document.currentScript.src` at module load and parses its
 * query string to determine where the widget is being loaded from:
 *
 *   ?wp=<HARVEST_VERSION>   The WordPress plugin enqueued the script.
 *                           source = "wp", source_version = HARVEST_VERSION.
 *   ?panel=1                The HArvest panel preview injected the script.
 *                           source = "panel", source_version = null.
 *   (no query string)       Raw HTML embed (admin pasted snippet).
 *                           source = "html", source_version = null.
 *
 * Capture happens at module load because `document.currentScript` is
 * only valid while the script tag is being executed; by the time the
 * widget actually opens its WebSocket, the value is null. The IIFE
 * bundle runs at top-level synchronously so this import-time capture
 * works.
 *
 * See SPEC.md Section 5.1 (`client` field) and Section 12 for the
 * full compatibility model.
 */
import { PROTOCOL_VERSION, WIDGET_VERSION } from "./version.js";

/** @type {{source: string, source_version: string | null}} */
let _captured;

function _captureFromScriptTag() {
  // document is undefined in non-DOM environments (Node tests). Fall
  // back to "unknown" so unit tests can import this module without a
  // jsdom shim. The bundled output always runs in a browser.
  if (typeof document === "undefined") {
    return { source: "unknown", source_version: null };
  }

  // currentScript is the executing <script>. For the IIFE bundle this
  // is set during top-level execution (when this module is imported as
  // part of harvest-entry.js). After top-level finishes, the value
  // becomes null - that's why we capture eagerly.
  const script = document.currentScript;
  const src = script && typeof script.src === "string" ? script.src : "";
  if (!src) {
    return { source: "html", source_version: null };
  }

  // Parse the query string. URL is widely available in es2020 targets;
  // wrap in try/catch in case the src is somehow not a valid absolute URL.
  let query;
  try {
    query = new URL(src).searchParams;
  } catch {
    return { source: "html", source_version: null };
  }

  const wp = query.get("wp");
  if (wp) {
    return { source: "wp", source_version: wp };
  }
  if (query.get("panel") === "1") {
    return { source: "panel", source_version: null };
  }
  return { source: "html", source_version: null };
}

// Capture eagerly at module load - currentScript is only valid here.
_captured = _captureFromScriptTag();

/**
 * Return the `client` block to include in the auth message.
 * Shape matches SPEC.md Section 5.1.
 */
export function getClientInfo() {
  return {
    protocol: PROTOCOL_VERSION,
    widget: WIDGET_VERSION,
    source: _captured.source,
    source_version: _captured.source_version,
  };
}

/**
 * Test-only override. NOT exposed on the public window.HArvest API.
 * Lets vitest unit tests verify auth-message construction without
 * monkey-patching the module's private state.
 */
export function _setClientInfoForTests(source, source_version) {
  _captured = { source, source_version };
}
