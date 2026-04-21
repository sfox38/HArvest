/**
 * error-states.js - Error state management and visual treatment for HrvCard.
 *
 * Provides applyErrorState(), which is called by HrvCard.setErrorState()
 * whenever the connection state changes. It updates the card's data attribute
 * (for CSS targeting), applies skeleton/stale/overlay treatments, and respects
 * the on-offline and on-error configuration attributes.
 *
 * Error state codes (from SPEC.md Section 6):
 *   live              - Connected and receiving live data. Clears all overlays.
 *   HRV_CONNECTING    - Initial connection attempt. Shows skeleton pulse.
 *   HRV_STALE         - Disconnected but cached state is displayed. Shows
 *                       stale indicator banner over the card.
 *   HRV_OFFLINE       - No cached state available while disconnected.
 *   HRV_AUTH_FAILED   - Authentication permanently failed (token invalid,
 *                       expired, revoked, or 3 consecutive re-auth failures).
 *   HRV_ENTITY_MISSING  - Entity not found in HA or not in token scope.
 *   HRV_ENTITY_REMOVED  - Entity was removed from HA while connected.
 */

/**
 * Offline-class states: transient, may recover on reconnect.
 * @type {Set<string>}
 */
const OFFLINE_STATES = new Set(["HRV_OFFLINE", "HRV_STALE", "HRV_CONNECTING"]);

/**
 * Auth/config error states: permanent, require user action to recover.
 * @type {Set<string>}
 */
const AUTH_ERROR_STATES = new Set([
  "HRV_AUTH_FAILED",
  "HRV_ENTITY_MISSING",
  "HRV_ENTITY_REMOVED",
]);

/**
 * Apply an error state to a card. Updates the data attribute for CSS and
 * applies the appropriate visual treatment based on the card's configuration.
 *
 * @param {HTMLElement} cardEl        - The <hrv-card> host element.
 * @param {ShadowRoot}  shadowRoot    - The card's shadow root.
 * @param {string}      code          - Error state code or "live".
 * @param {object}      config        - Resolved CardConfig for this card.
 * @param {object}      i18n          - I18n instance with a t() method.
 */
export function applyErrorState(cardEl, shadowRoot, code, config, i18n) {
  // Update data attribute so external CSS can target specific states.
  cardEl.setAttribute("data-harvest-state", code);

  // ------- live: remove all overlays and restore normal display -------
  if (code === "live") {
    _removeOverlay(shadowRoot);
    _hideStaleIndicator(shadowRoot);
    cardEl.style.removeProperty("display");
    cardEl.style.removeProperty("opacity");
    return;
  }

  // ------- HRV_CONNECTING: skeleton pulse before renderer mounts -------
  if (code === "HRV_CONNECTING") {
    _applySkeletonState(shadowRoot, i18n);
    return;
  }

  // ------- HRV_STALE: stale indicator over existing card content -------
  if (code === "HRV_STALE") {
    _showStaleIndicator(shadowRoot, i18n);
    return;
  }

  // ------- All other states: consult on-offline / on-error config ------
  const isOffline = OFFLINE_STATES.has(code);
  const isAuthError = AUTH_ERROR_STATES.has(code);

  const treatment = isOffline
    ? (config.onOffline ?? "last-state")
    : (config.onError ?? "message");

  if (treatment === "hide") {
    cardEl.style.display = "none";
    return;
  }

  if (treatment === "dim") {
    cardEl.style.opacity = "0.4";
    return;
  }

  // treatment === "message" or "last-state" - show message overlay.
  const defaultMsg = isAuthError
    ? i18n.t("error.auth_failed")
    : i18n.t("error.offline");

  _applyMessageOverlay(shadowRoot, config.errorText ?? defaultMsg);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Inject a skeleton placeholder into the shadow root while the connection is
 * being established for the first time (no renderer exists yet).
 *
 * @param {ShadowRoot} shadowRoot
 * @param {object}     i18n
 */
function _applySkeletonState(shadowRoot, i18n) {
  _removeOverlay(shadowRoot);

  const skeleton = document.createElement("div");
  skeleton.className = "hrv-skeleton hrv-error-overlay";
  skeleton.setAttribute("aria-label", i18n.t("error.connecting"));
  skeleton.setAttribute("role", "status");
  skeleton.innerHTML = `
    <div class="hrv-skeleton__line hrv-skeleton__line--wide" aria-hidden="true"></div>
    <div class="hrv-skeleton__line hrv-skeleton__line--medium" aria-hidden="true"></div>
    <div class="hrv-skeleton__line hrv-skeleton__line--narrow" aria-hidden="true"></div>
  `;
  shadowRoot.appendChild(skeleton);
}

/**
 * Show a text message overlay on top of whatever the shadow root contains.
 *
 * @param {ShadowRoot} shadowRoot
 * @param {string}     message
 */
function _applyMessageOverlay(shadowRoot, message) {
  _removeOverlay(shadowRoot);

  const overlay = document.createElement("div");
  overlay.className = "hrv-message-overlay hrv-error-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");

  const text = document.createElement("span");
  text.className = "hrv-message-overlay__text";
  text.textContent = message;
  overlay.appendChild(text);

  shadowRoot.appendChild(overlay);
}

/**
 * Remove any existing error overlay from the shadow root.
 * @param {ShadowRoot} shadowRoot
 */
function _removeOverlay(shadowRoot) {
  shadowRoot.querySelectorAll(".hrv-error-overlay").forEach((el) => el.remove());
}

/**
 * Show the [part=stale-indicator] element if present.
 * @param {ShadowRoot} shadowRoot
 * @param {object}     i18n
 */
function _showStaleIndicator(shadowRoot, i18n) {
  const indicator = shadowRoot.querySelector("[part=stale-indicator]");
  if (!indicator) return;
  indicator.style.display = "block";
  indicator.setAttribute("aria-label", i18n.t("indicator.stale"));
}

/**
 * Hide the [part=stale-indicator] element if present.
 * @param {ShadowRoot} shadowRoot
 */
function _hideStaleIndicator(shadowRoot) {
  const indicator = shadowRoot.querySelector("[part=stale-indicator]");
  if (indicator) indicator.style.removeProperty("display");
}

// ---------------------------------------------------------------------------
// Shared error-state CSS injected by getErrorStateStyles()
// ---------------------------------------------------------------------------

/**
 * Return the CSS block that every renderer must include in its shadow DOM
 * <style> tag to support skeleton, stale indicator, and message overlay
 * visual treatments. Exported so BaseCard.getSharedStyles() can include it.
 *
 * @returns {string}
 */
export function getErrorStateStyles() {
  return /* css */`
    /* Skeleton pulse */
    .hrv-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--hrv-spacing-s, 8px);
      padding: var(--hrv-spacing-m, 16px);
    }

    .hrv-skeleton__line {
      height: 14px;
      border-radius: var(--hrv-radius-s, 4px);
      background: var(--hrv-color-surface-alt, #e0e0e0);
      animation: hrv-skeleton-pulse 1.4s ease-in-out infinite;
    }

    .hrv-skeleton__line--wide   { width: 100%; }
    .hrv-skeleton__line--medium { width: 70%; }
    .hrv-skeleton__line--narrow { width: 40%; }

    @keyframes hrv-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-skeleton__line { animation: none; opacity: 0.6; }
    }

    /* Stale indicator banner */
    [part=stale-indicator] {
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2px var(--hrv-spacing-s, 8px);
      font-size: var(--hrv-font-size-xs, 11px);
      color: var(--hrv-color-text-inverse, #ffffff);
      background: var(--hrv-color-warning, #f59e0b);
      text-align: center;
      pointer-events: none;
    }

    /* Message overlay */
    .hrv-message-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--hrv-spacing-m, 16px);
      min-height: 60px;
    }

    .hrv-message-overlay__text {
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text-secondary, #6b7280);
      text-align: center;
    }
  `;
}
