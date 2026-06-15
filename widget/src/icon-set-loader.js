/**
 * icon-set-loader.js - Lazy loader for additional icon-set assets.
 *
 * MDI is bundled in harvest.min.js; every other icon set (fa, ph, tabler)
 * ships as a build-generated IIFE asset under /harvest_assets/icon-sets/
 * that calls window.HArvest.registerIconSet() when it runs. Sets load on
 * demand: HarvestClient calls ensureIconSet() the first time an entity
 * definition references a prefixed icon name, and cards re-render once the
 * set registers. Until then resolveIcon() falls back to the domain icon,
 * so first paint is never blocked.
 */

import { WIDGET_VERSION } from "./version.js";

/**
 * Icon-set prefixes the integration serves, mapped to their asset paths
 * (relative to the HA base URL).
 * @type {Record<string, string>}
 */
export const KNOWN_ICON_SETS = {
  fa: "/harvest_assets/icon-sets/fa.js",
  ph: "/harvest_assets/icon-sets/ph.js",
  tabler: "/harvest_assets/icon-sets/tabler.js",
};

/** Memoized per-prefix load promises. @type {Map<string, Promise<boolean>>} */
const _loads = new Map();

/**
 * Load an icon-set asset once. Resolves true when the set script has run
 * (and registered itself), false for unknown prefixes or load failures.
 * Never rejects.
 *
 * @param {string} prefix - Icon-set prefix, e.g. "fa"
 * @param {string} haUrl  - HA base URL the widget is connected to
 * @returns {Promise<boolean>}
 */
export function ensureIconSet(prefix, haUrl) {
  const path = KNOWN_ICON_SETS[prefix];
  if (!path) return Promise.resolve(false);
  let promise = _loads.get(prefix);
  if (promise) return promise;
  promise = new Promise((resolve) => {
    const script = document.createElement("script");
    // Stable release-busted URL (?v=) rather than the renderer packs'
    // ?_=Date.now() pattern: packs are admin-edited at runtime, while these
    // assets are release-generated and should hit the browser cache.
    script.src = haUrl + path + "?v=" + encodeURIComponent(WIDGET_VERSION);
    script.onload = () => {
      document.head.removeChild(script);
      resolve(true);
    };
    script.onerror = () => {
      console.warn("[HArvest] Failed to load icon set:", prefix);
      document.head.removeChild(script);
      resolve(false);
    };
    document.head.appendChild(script);
  });
  _loads.set(prefix, promise);
  return promise;
}
