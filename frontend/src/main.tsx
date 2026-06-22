/**
 * main.tsx - HArvest panel entry point.
 *
 * Defines the <ha-panel-harvest> custom element that HA instantiates when the
 * user navigates to the HArvest sidebar item. The custom element mounts the
 * React application into its shadow DOM so panel styles are fully isolated
 * from HA's own styling while still inheriting HA CSS custom properties from
 * the host document.
 */

import { createRoot } from "react-dom/client";
import { App } from "./App";
import { setHass } from "./api";
import { loadEntityCache } from "./entityCache";
import buildVersion from "./buildVersion.json";
import { decideBuildReload } from "./buildWatcher";
import panelCss from "./panel.css?inline";

// Reload key used to break the version-mismatch reload loop (see below).
const _RELOAD_TARGET_KEY = "harvest_panel_reload_target";

// Check panel_version.txt once at startup. If the deployed build number differs
// from the one baked into this bundle, reload once to pick up the new panel.js.
//
// panel.js is served with no-cache + ETag (see HarvestPanelJsView), so a reload
// revalidates and fetches the rebuilt bundle - no integration reload or HA
// restart needed. The reload-at-most-once guard (decideBuildReload) is a safety
// net: if some layer keeps serving a stale bundle while panel_version.txt has
// advanced, we reload once and then stop instead of looping forever.
function startBuildWatcher(): void {
  setTimeout(async () => {
    try {
      const res = await fetch("/harvest_assets/panel_version.txt", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const latest = parseInt(await res.text(), 10);
      const decision = decideBuildReload(
        latest,
        buildVersion.build,
        sessionStorage.getItem(_RELOAD_TARGET_KEY),
      );
      if (decision === "up-to-date") {
        // Clear any guard left over from an earlier reload.
        sessionStorage.removeItem(_RELOAD_TARGET_KEY);
      } else if (decision === "skip-loop") {
        // Already reloaded for this version and the served bundle is still
        // stale (a caching layer kept serving an old bundle). Don't loop.
        console.warn(
          `[HArvest panel] Deployed build ${latest} differs from the running ` +
          `panel bundle ${buildVersion.build}, but reloading did not pick it ` +
          `up. Reload the HArvest integration (or restart Home Assistant), ` +
          `then refresh this page.`,
        );
      } else if (decision === "reload") {
        sessionStorage.setItem(_RELOAD_TARGET_KEY, String(latest));
        window.location.reload();
      }
    } catch { /* ignore network / storage errors */ }
  }, 2000);
}

// Shape of the hass object HA passes to custom panel elements.
interface HassObject {
  auth: {
    data: { access_token: string; expires?: number };
    refreshAccessToken: () => Promise<void>;
  };
}

class HaPanelHarvest extends HTMLElement {
  private _root: ReturnType<typeof createRoot> | null = null;
  private _mounted = false;

  connectedCallback(): void {
    // Attach shadow DOM for style isolation.
    const shadow = this.attachShadow({ mode: "open" });

    // Mount point inside shadow DOM.
    const container = document.createElement("div");
    container.id = "harvest-panel-root";
    shadow.appendChild(container);

    // Inject CSS reset and panel-level base styles.
    // HA CSS custom properties are accessible inside shadow DOM via inheritance
    // from the host document's :root styles.
    const style = document.createElement("style");
    style.textContent = BASE_STYLES + panelCss;
    shadow.insertBefore(style, container);

    this._root = createRoot(container);
    // Defer first render until HA sets the hass property with the auth token.
  }

  // HA calls this setter every time the hass state updates. The first call
  // provides the auth token we need before any API requests fire.
  set hass(h: HassObject) {
    setHass(h);
    if (!this._mounted && this._root) {
      this._mounted = true;
      loadEntityCache();
      startBuildWatcher();
      this._root.render(<App />);
    }
  }

  disconnectedCallback(): void {
    this._root?.unmount();
    this._root = null;
    this._mounted = false;
  }
}

// Register only once.
if (!customElements.get("ha-panel-harvest")) {
  customElements.define("ha-panel-harvest", HaPanelHarvest);
}

// ---------------------------------------------------------------------------
// Base styles injected into shadow DOM
// ---------------------------------------------------------------------------

const BASE_STYLES = /* css */`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #harvest-panel-root {
    height: 100%;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--ink);
    background: var(--bg);
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  a {
    color: var(--accent);
    text-decoration: none;
  }

  a:hover { text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
