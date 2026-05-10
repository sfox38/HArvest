/**
 * _utils/esc.js - HTML entity escaping for renderer template strings.
 *
 * Single canonical implementation; previously copy-pasted into 20+ renderer
 * files. Built-in renderers import this directly. Standalone packs (loaded
 * as separate IIFE scripts at runtime) reference it via window.HArvest.esc
 * which is exposed by harvest-entry.js.
 */

export function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
