/**
 * renderers/base-card.js - Abstract base class for all HArvest card renderers.
 *
 * Every Tier 1 renderer extends BaseCard and must implement:
 *   render()      - Build the initial shadow DOM HTML structure.
 *   applyState()  - Update the DOM to reflect new entity state + attributes.
 *
 * Optionally override:
 *   predictState() - Return an optimistic EntityState for a given command,
 *                    or null to skip optimistic UI for that action.
 *
 * Shared helpers provided:
 *   renderIcon()           - Inject an MDI SVG into a [part] slot.
 *   renderCompanionZoneHTML() - Return the companion zone placeholder HTML.
 *   renderCompanions()     - Populate the companion zone with live data.
 *   getSharedStyles()      - Return the common CSS block every renderer needs.
 *   debounce()             - Create a debounced wrapper around a function.
 *   setAriaLabel()         - Set aria-label on an element.
 */

import { renderIconSVG, resolveIcon as _resolveIcon, MDI_ICONS } from "../icons.js";
import { getErrorStateStyles } from "../error-states.js";

// ---------------------------------------------------------------------------
// Shared CSS custom property defaults
// These values are overridden by the theme system (ThemeLoader.apply()) when
// a theme-url or inline theme is configured. They serve as safe fallbacks
// when no theme is applied, targeting a clean neutral appearance.
// ---------------------------------------------------------------------------

const SHARED_CSS_VARS = /* css */`
  :host {
    /* Layout */
    --hrv-spacing-xs:  4px;
    --hrv-spacing-s:   8px;
    --hrv-spacing-m:   16px;
    --hrv-spacing-l:   24px;

    /* Border radius */
    --hrv-radius-s:    4px;
    --hrv-radius-m:    8px;
    --hrv-radius-l:    12px;

    /* Typography */
    --hrv-font-size-xs: 11px;
    --hrv-font-size-s:  13px;
    --hrv-font-size-m:  15px;
    --hrv-font-size-l:  18px;
    --hrv-font-weight-normal: 400;
    --hrv-font-weight-medium: 500;
    --hrv-font-weight-bold:   700;
    --hrv-font-family: system-ui, -apple-system, sans-serif;

    /* Colours - light mode defaults */
    --hrv-color-primary:       #6366f1;
    --hrv-color-primary-dim:   #e0e7ff;
    --hrv-color-on-primary:    #ffffff;
    --hrv-color-surface:       #ffffff;
    --hrv-color-surface-alt:   #f3f4f6;
    --hrv-color-border:        #e5e7eb;
    --hrv-color-text:          #111827;
    --hrv-color-text-secondary:#6b7280;
    --hrv-color-text-inverse:  #ffffff;
    --hrv-color-warning:       #f59e0b;
    --hrv-color-error:         #ef4444;
    --hrv-color-success:       #22c55e;
    --hrv-color-icon:          #374151;

    /* State colours */
    --hrv-color-state-on:      #f59e0b;
    --hrv-color-state-off:     #9ca3af;
    --hrv-color-state-unavailable: #d1d5db;

    /* Card */
    --hrv-card-padding:        var(--hrv-spacing-m);
    --hrv-card-radius:         var(--hrv-radius-l);
    --hrv-card-shadow:         0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    --hrv-card-background:     var(--hrv-color-surface);

    /* Icon */
    --hrv-icon-size:           24px;

    /* Transition */
    --hrv-transition-speed:    150ms;

    display: block;
    position: relative;
    font-family: var(--hrv-font-family);
  }

  /* Dark mode overrides - applied when no explicit theme is set */
  @media (prefers-color-scheme: dark) {
    :host {
      --hrv-color-surface:       #1f2937;
      --hrv-color-surface-alt:   #374151;
      --hrv-color-border:        #374151;
      --hrv-color-text:          #f9fafb;
      --hrv-color-text-secondary:#9ca3af;
      --hrv-color-icon:          #d1d5db;
      --hrv-color-primary-dim:   #312e81;
    }
  }

  /* Reduced motion: disable all transitions and animations */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const CARD_BASE_CSS = /* css */`
  [part=card] {
    background: var(--hrv-card-background);
    border-radius: var(--hrv-card-radius);
    box-shadow: var(--hrv-card-shadow);
    padding: var(--hrv-card-padding);
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }

  [part=card-header] {
    display: flex;
    align-items: center;
    gap: var(--hrv-spacing-s);
    margin-bottom: var(--hrv-spacing-s);
  }

  [part=card-icon] {
    width: var(--hrv-icon-size);
    height: var(--hrv-icon-size);
    flex-shrink: 0;
    color: var(--hrv-color-icon);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part=card-icon] svg {
    width: 100%;
    height: 100%;
  }

  [part=card-name] {
    font-size: var(--hrv-font-size-m);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }

  [part=companion-zone] {
    margin-top: var(--hrv-spacing-s);
    display: flex;
    flex-wrap: wrap;
    gap: var(--hrv-spacing-xs);
    border-top: 1px solid var(--hrv-color-border);
    padding-top: var(--hrv-spacing-s);
  }

  [part=companion-zone]:empty {
    display: none;
  }

  [part=stale-indicator] {
    display: none;
  }

  /* Unavailable / unknown state overlay */
  :host([data-harvest-avail=unavailable]) [part=card],
  :host([data-harvest-avail=unknown]) [part=card] {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }

  :host([data-harvest-avail=unavailable]) [part=card]::after,
  :host([data-harvest-avail=unknown]) [part=card]::after {
    content: attr(data-avail-label);
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    pointer-events: none;
  }
`;

// ---------------------------------------------------------------------------
// BaseCard
// ---------------------------------------------------------------------------

export class BaseCard {
  /** @type {object} */ def;
  /** @type {ShadowRoot} */ root;
  /** @type {object} */ config;
  /** @type {object} */ i18n;
  /** @type {Map<string,string>} */ #iconCache = new Map();

  /**
   * @param {object}     def    - EntityDefinition from server
   * @param {ShadowRoot} root   - The card's shadow root
   * @param {object}     config - Resolved CardConfig
   * @param {object}     i18n   - I18n instance
   */
  constructor(def, root, config, i18n) {
    this.def    = def;
    this.root   = root;
    this.config = config;
    this.i18n   = i18n;
  }

  // -------------------------------------------------------------------------
  // Abstract interface - subclasses must implement
  // -------------------------------------------------------------------------

  /**
   * Build the initial shadow DOM structure. Called once when the entity
   * definition arrives. Must populate this.root with all required elements.
   */
  render() {
    throw new Error(`${this.constructor.name} must implement render()`);
  }

  /**
   * Update the DOM to reflect new entity state and attributes. Called on
   * every state_update message and after optimistic UI reverts.
   *
   * @param {string} _state
   * @param {object} _attributes
   */
  applyState(_state, _attributes) {
    throw new Error(`${this.constructor.name} must implement applyState()`);
  }

  // -------------------------------------------------------------------------
  // Optional override
  // -------------------------------------------------------------------------

  /**
   * Return a predicted EntityState for the given command so the card can
   * apply an optimistic visual update before the server confirms. Return null
   * to skip optimistic UI for this action.
   *
   * @param {string} _action
   * @param {object} _data
   * @returns {{ state: string, attributes: object } | null}
   */
  predictState(_action, _data) {
    return null;
  }

  // -------------------------------------------------------------------------
  // Shared helpers
  // -------------------------------------------------------------------------

  /**
   * Render an MDI icon SVG into the element identified by [part=partName].
   * Replaces whatever is currently inside that element. No-op if the element
   * is not found in the shadow root.
   *
   * @param {string} iconName  - MDI icon name, e.g. "mdi:lightbulb"
   * @param {string} partName  - value of the part="" attribute on the container
   */
  renderIcon(iconName, partName) {
    if (this.#iconCache.get(partName) === iconName) return;
    this.#iconCache.set(partName, iconName);
    const container = this.root.querySelector(`[part=${partName}]`);
    if (!container) return;
    container.innerHTML = renderIconSVG(iconName, `${partName}-svg`);
  }

  /**
   * Return true if element currently has focus within this card's shadow root.
   * Use this guard before programmatically updating interactive controls in
   * applyState() to avoid dismissing open dropdowns or cancelling user input.
   *
   * @param {HTMLElement|null} element
   * @returns {boolean}
   */
  isFocused(element) {
    return !!element && this.root.activeElement === element;
  }

  /**
   * Return name if it exists in the MDI bundle, otherwise return fallback.
   * Prevents the generic help-circle from showing when a custom HA icon name
   * is not bundled.
   *
   * @param {string} name     - MDI icon name, e.g. "mdi:lightbulb-on-outline"
   * @param {string} fallback - bundled fallback, e.g. "mdi:lightbulb"
   * @returns {string}
   */
  resolveIcon(name, fallback) {
    return _resolveIcon(name, fallback);
  }

  /**
   * Set aria-label on an element. Convenience wrapper.
   *
   * @param {HTMLElement} el
   * @param {string}      label
   */
  setAriaLabel(el, label) {
    if (el) el.setAttribute("aria-label", label);
  }

  /**
   * Return the HTML placeholder for the companion zone. Include this in the
   * template returned by render() so renderCompanions() has somewhere to write.
   *
   * @returns {string}
   */
  renderCompanionZoneHTML() {
    if (!this.config.companions?.length) return "";
    return `<div part="companion-zone" role="group" aria-label="Companion devices"></div>`;
  }

  /**
   * Populate [part=companion-zone] with a compact icon+state widget for each
   * companion entity. Companions with "read" capability never get tap actions.
   * Call this at the end of render().
   */
  renderCompanions() {
    const zone = this.root.querySelector("[part=companion-zone]");
    if (!zone || !this.config.companions?.length) return;

    zone.innerHTML = "";

    for (const companion of this.config.companions) {
      const pill = document.createElement("div");
      pill.className = "hrv-companion";
      pill.setAttribute("part", "companion");
      pill.setAttribute("data-entity", companion.entityId);

      // Icon placeholder - filled when the companion card receives its definition.
      const iconWrap = document.createElement("span");
      iconWrap.setAttribute("part", "companion-icon");
      iconWrap.innerHTML = renderIconSVG("mdi:help-circle", "companion-icon-svg");

      const stateEl = document.createElement("span");
      stateEl.setAttribute("part", "companion-state");
      stateEl.className = "hrv-companion__state";

      pill.appendChild(iconWrap);
      pill.appendChild(stateEl);
      zone.appendChild(pill);
    }
  }

  /**
   * Update a companion's displayed state. Called by HrvCard when a state
   * update arrives for a companion entity ID.
   *
   * @param {string} entityId
   * @param {string} state
   * @param {object} _attributes
   */
  updateCompanionState(entityId, state, _attributes) {
    const pill = this.root.querySelector(`[part=companion][data-entity="${CSS.escape(entityId)}"]`);
    if (!pill) return;
    const stateEl = pill.querySelector("[part=companion-state]");
    if (stateEl) stateEl.textContent = this.i18n.t(`state.${state}`) !== `state.${state}`
      ? this.i18n.t(`state.${state}`)
      : state;
  }

  /**
   * Return the CSS string that every renderer must include in its shadow DOM
   * <style> tag. Contains: CSS custom property defaults, card base layout,
   * companion zone, stale indicator, skeleton, and message overlay styles.
   *
   * @returns {string}
   */
  getSharedStyles() {
    return SHARED_CSS_VARS + CARD_BASE_CSS + getErrorStateStyles() + COMPANION_CSS;
  }

  /**
   * Create a debounced version of fn that delays execution by ms milliseconds.
   * The timer resets on each call. Useful for slider input events.
   *
   * @param {Function} fn
   * @param {number}   ms
   * @returns {Function}
   */
  debounce(fn, ms) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { timer = null; fn(...args); }, ms);
    };
  }
}

// ---------------------------------------------------------------------------
// Companion pill CSS (separate constant for readability)
// ---------------------------------------------------------------------------

const COMPANION_CSS = /* css */`
  .hrv-companion {
    display: inline-flex;
    align-items: center;
    gap: var(--hrv-spacing-xs);
    padding: 2px var(--hrv-spacing-s);
    border-radius: var(--hrv-radius-s);
    background: var(--hrv-color-surface-alt);
    cursor: default;
    transition: background var(--hrv-transition-speed);
  }

  .hrv-companion[data-interactive=true] {
    cursor: pointer;
  }

  .hrv-companion[data-interactive=true]:hover {
    background: var(--hrv-color-primary-dim);
  }

  [part=companion-icon] {
    width: 16px;
    height: 16px;
    color: var(--hrv-color-icon);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part=companion-icon] svg {
    width: 100%;
    height: 100%;
  }

  .hrv-companion__state {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
  }
`;
