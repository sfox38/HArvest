/**
 * neu-pack.js - HArvest Neumorphism renderer pack.
 *
 * Soft-UI controls with dual box-shadows creating extruded (convex) and
 * inset (concave) surfaces. Transitions are deliberately sluggish to
 * simulate the feel of physical switches and dials. Grey-only palette.
 *
 * Loaded at runtime via script injection; references window.HArvest globals.
 */
(function () {
  "use strict";

  const HArvest = window.HArvest;
  if (!HArvest || !HArvest.renderers || !HArvest.renderers.BaseCard) {
    console.warn("[HArvest Neu] HArvest not found - pack not loaded.");
    return;
  }

  const BaseCard = HArvest.renderers.BaseCard;
  const _esc = window.HArvest.esc;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function _debounce(fn, ms) {
    let timer = null;
    let lastCtx = null;
    let lastArgs = null;
    function wrapped(...args) {
      lastCtx = this;
      lastArgs = args;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(lastCtx, lastArgs);
        lastArgs = null;
      }, ms);
    }
    wrapped.flush = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        if (lastArgs) {
          fn.apply(lastCtx, lastArgs);
          lastArgs = null;
        }
      }
    };
    return wrapped;
  }

  function _clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function _capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "";
  }

  function _fmtTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const mm = String(m % 60).padStart(h ? 2 : 1, "0");
    const ss = String(s % 60).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function _t(i18n, key, fallback) {
    if (!i18n || !i18n.t) return fallback;
    const v = i18n.t(key);
    return (v && v !== key) ? v : fallback;
  }

  function _applyHeaderHints(cardEl, config, def) {
    if (!cardEl) return;
    const hints = config.displayHints ?? def?.display_hints ?? {};
    cardEl.dataset.showIcon = String(hints.show_icon !== false);
    cardEl.dataset.showName = String(hints.show_name !== false);
    cardEl.dataset.border = hints.widget_border ?? "outer";
  }

  function _miredToKelvin(mired) {
    return mired > 0 ? Math.round(1000000 / mired) : 4000;
  }

  // ---------------------------------------------------------------------------
  // Shared CSS
  // ---------------------------------------------------------------------------

  const NEU_BASE = /* css */`
    :host {
      background: transparent !important;
      border-radius: var(--hrv-card-radius, 20px) !important;
      overflow: visible !important;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    [part=card] {
      position: relative;
      background: var(--hrv-ex-neu-bg, var(--hrv-card-background));
      border-radius: var(--hrv-card-radius, 20px);
      border: none;
      box-shadow: none !important;
      padding: var(--hrv-card-padding, 18px);
      font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
      color: var(--hrv-color-text, #374151);
      transition: box-shadow 0.3s ease;
    }

    [part=card][data-border="outer"] {
      box-shadow: var(--hrv-ex-neu-convex, 4px 4px 8px #b8bec7, -4px -4px 8px #ffffff) !important;
    }
    [part=card][data-border="inner"] {
      box-shadow: var(--hrv-ex-neu-concave, inset 2px 2px 5px #b8bec7, inset -2px -2px 5px #ffffff) !important;
    }
    [part=card][data-border="none"] {
      box-shadow: none !important;
    }

    [part=card-header] {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    [part=card][data-show-icon="false"] [part=card-icon] {
      display: none;
    }
    [part=card][data-show-name="false"] [part=card-name] {
      display: none;
    }
    [part=card][data-show-icon="false"][data-show-name="false"] [part=card-header] {
      display: none;
    }

    [part=card] [part=card-icon] {
      width: 40px !important;
      height: 40px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
      color: var(--hrv-color-icon, #4b5563);
      flex-shrink: 0;
      transition: color 0.25s ease;
    }
    [part=card] [part=card-icon] svg {
      width: var(--hrv-icon-size, 22px);
      height: var(--hrv-icon-size, 22px);
      fill: currentColor;
    }
    [part=card-icon][data-on="true"] {
      color: var(--hrv-color-text, #374151);
    }
    [part=card-icon][data-on="false"] {
      color: var(--hrv-color-text-secondary, #6b7280);
    }

    [part=card-name] {
      flex: 1;
      min-width: 0;
      font-size: var(--hrv-font-size-m, 15px);
      font-weight: var(--hrv-font-weight-medium, 500);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part=card-body] {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    [part=card-body]:empty {
      display: none;
    }

    [part=state-label] {
      font-size: var(--hrv-font-size-m, 15px);
      color: var(--hrv-color-text-secondary);
      text-align: center;
      padding: 8px 0;
    }

    [part=stale-indicator] {
      display: none;
    }
    :host([stale]) [part=stale-indicator] {
      display: flex;
      position: absolute;
      inset: 0;
      align-items: center;
      justify-content: center;
      background: var(--hrv-color-overlay, rgba(0,0,0,0.6));
      color: var(--hrv-color-overlay-text, #fff);
      font-size: var(--hrv-font-size-s, 13px);
      border-radius: var(--hrv-card-radius, 20px);
      z-index: 10;
    }

    .neu-chip {
      font-size: var(--hrv-font-size-xs, 11px);
      color: var(--hrv-color-text-secondary);
      white-space: nowrap;
      padding: 3px 8px;
      border-radius: 10px;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
    }
    .neu-chip:empty {
      display: none;
    }

    .neu-value-well {
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
      border-radius: 14px;
      padding: 12px 16px;
      text-align: center;
    }

    .neu-slider-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text-secondary);
      margin-bottom: 6px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition-duration: 0ms !important;
        animation-duration: 0ms !important;
      }
    }
  `;

  const NEU_TOGGLE_CSS = /* css */`
    .neu-toggle {
      position: relative;
      width: 60px;
      height: 30px;
      border-radius: 15px;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
      cursor: pointer;
      border: none;
      padding: 0;
      outline: none;
      transition: box-shadow 0.3s ease-out, background 0.3s ease-out;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-toggle::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out;
    }
    .neu-toggle[aria-pressed="true"] {
      box-shadow: var(--hrv-ex-neu-concave);
      background: var(--hrv-ex-neu-shadow-dark);
    }
    .neu-toggle[aria-pressed="true"]::after {
      transform: translateX(30px);
      box-shadow: 1px 1px 3px rgba(0,0,0,0.12);
      background: var(--hrv-ex-neu-shadow-light);
    }
    .neu-toggle:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .neu-toggle:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }
  `;

  const NEU_SLIDER_CSS = /* css */`
    .neu-slider-wrap {
      position: relative;
      width: 100%;
      height: 28px;
    }
    .neu-slider-track {
      position: absolute;
      inset: 4px 0;
      height: 20px;
      border-radius: 10px;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
      overflow: hidden;
    }
    .neu-slider-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: var(--neu-fill, 0%);
      border-radius: 10px;
      background: var(--hrv-color-text-secondary, #6b7280);
      opacity: 0.18;
      transition: width 0.15s ease;
    }
    .neu-slider-wrap input[type="range"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-slider-thumb {
      position: absolute;
      top: 2px;
      left: var(--neu-thumb-offset, -12px);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      transition: left 0.15s ease, box-shadow 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      z-index: 1;
    }
    .neu-slider-wrap input[type="range"]:active ~ .neu-slider-thumb {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      transform: scale(0.9);
    }
    .neu-slider-wrap input[type="range"]:focus-visible ~ .neu-slider-thumb {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }
    .neu-slider-wrap input[type="range"]:disabled {
      cursor: default;
    }
    .neu-slider-wrap[data-disabled="true"] {
      opacity: 0.4;
    }
  `;

  const NEU_BUTTON_CSS = /* css */`
    .neu-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 18px;
      border: none;
      border-radius: var(--hrv-radius-m, 12px);
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      color: var(--hrv-color-text, #374151);
      font-size: var(--hrv-font-size-s, 13px);
      font-weight: var(--hrv-font-weight-medium, 500);
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: box-shadow 0.2s ease, transform 0.15s ease, color 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-btn:active:not(:disabled),
    .neu-btn[data-pressing="true"] {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      transform: scale(0.97);
      transition: box-shadow 0.1s ease-in, transform 0.1s ease-in, color 0.2s ease;
    }
    .neu-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .neu-btn:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }
    .neu-btn[aria-pressed="true"] {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      color: var(--hrv-color-text);
    }
    .neu-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .neu-btn-circle {
      width: 52px;
      height: 52px;
      padding: 0;
      border-radius: 50%;
    }
    .neu-btn-circle svg {
      width: 22px;
      height: 22px;
    }

    .neu-btn-circle-sm {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
    }
    .neu-btn-circle-sm svg {
      width: 18px;
      height: 18px;
    }

    .neu-btn-full {
      width: 100%;
      padding: 12px 18px;
    }

    .neu-btn-momentary {
      width: 56px;
      height: 56px;
      padding: 0;
      border-radius: 50%;
      margin: 4px auto;
      display: flex;
    }
    .neu-btn-momentary svg {
      width: 24px;
      height: 24px;
    }
  `;

  const NEU_SELECT_CSS = /* css */`
    .neu-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .neu-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 14px;
      border: none;
      border-radius: var(--hrv-radius-m, 12px);
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      color: var(--hrv-color-text-secondary);
      font-size: var(--hrv-font-size-s, 13px);
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: box-shadow 0.25s ease, color 0.2s ease, transform 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-pill[aria-pressed="true"],
    .neu-pill[aria-selected="true"],
    .neu-pill.is-active {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      color: var(--hrv-color-text);
      font-weight: var(--hrv-font-weight-medium, 500);
    }
    .neu-pill:active:not(:disabled) {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      transform: scale(0.96);
    }
    .neu-pill:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .neu-pill:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }

    .neu-dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 14px;
      border: none;
      border-radius: var(--hrv-radius-m, 12px);
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      color: var(--hrv-color-text);
      font-size: var(--hrv-font-size-s, 13px);
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: box-shadow 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-dropdown-trigger[data-expanded="true"] {
      box-shadow: var(--hrv-ex-neu-concave-sm);
    }
    .neu-dropdown-trigger:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }
    .neu-dropdown-trigger::after {
      content: "";
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid currentColor;
      opacity: 0.5;
      transition: transform 0.2s ease;
    }
    .neu-dropdown-trigger[data-expanded="true"]::after {
      transform: rotate(180deg);
    }

    .neu-dropdown-menu {
      position: fixed;
      margin: 0;
      inset: unset;
      background: var(--hrv-ex-neu-bg);
      border: 1px solid var(--hrv-color-divider, rgba(0,0,0,0.06));
      box-shadow: var(--hrv-ex-neu-convex);
      border-radius: var(--hrv-radius-m, 12px);
      padding: 6px;
      z-index: 100;
      min-width: 120px;
      max-height: 200px;
      overflow-y: auto;
      color: var(--hrv-color-text);
      font-family: inherit;
    }
    .neu-dropdown-menu:not(:popover-open) {
      display: none;
    }
    .neu-dropdown-item {
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--hrv-color-text);
      font-size: var(--hrv-font-size-s, 13px);
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      outline: none;
      transition: box-shadow 0.15s ease;
    }
    .neu-dropdown-item:hover {
      background: rgba(0,0,0,0.04);
    }
    .neu-dropdown-item[aria-selected="true"] {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      font-weight: var(--hrv-font-weight-medium, 500);
    }
    .neu-dropdown-item:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: -2px;
    }
  `;

  const NEU_ROW_CSS = /* css */`
    [part=row-control] {
      display: none;
    }
    :host([layout=row]) {
      border-radius: var(--hrv-radius-m, 12px) !important;
      overflow: hidden !important;
      margin: 3px 8px !important;
    }
    :host([layout=row]) [part=card-body] { display: none; }
    :host([layout=row]) [part=row-control] { display: flex; align-items: center; }
    :host([layout=row]) [part=card] {
      border-radius: 0;
      background: var(--hrv-ex-neu-bg) !important;
      box-shadow: var(--hrv-ex-neu-convex-sm) !important;
      padding: 8px 16px 8px 12px;
    }
    :host([layout=row][data-highlight="even"]) [part=card] {
      box-shadow: var(--hrv-ex-neu-concave-sm) !important;
    }
    :host([layout=row]) [part=card-header] { margin-bottom: 0; }
    /* Per-entity dark color scheme overrides for row mode */
    :host([layout=row][data-color-scheme=dark]) {
      --hrv-color-surface: #2d2d3a;
      --hrv-color-surface-alt: #2d2d3a;
      --hrv-color-text: #d1d5db;
      --hrv-color-text-secondary: #9ca3af;
      --hrv-color-icon: #9ca3af;
      --hrv-ex-neu-bg: #2d2d3a;
      --hrv-ex-neu-shadow-light: #404050;
      --hrv-ex-neu-shadow-dark: #1a1a24;
      --hrv-ex-neu-convex-sm: 2px 2px 4px #1a1a24, -2px -2px 4px #404050;
      --hrv-ex-neu-concave-sm: inset 1px 1px 3px #1a1a24, inset -1px -1px 3px #404050;
    }
    /* Per-entity light color scheme override (when block is in dark mode) */
    :host([layout=row][data-color-scheme=light]) {
      --hrv-color-surface: #e0e5ec;
      --hrv-color-surface-alt: #e0e5ec;
      --hrv-color-text: #374151;
      --hrv-color-text-secondary: #6b7280;
      --hrv-color-icon: #4b5563;
      --hrv-ex-neu-bg: #e0e5ec;
      --hrv-ex-neu-shadow-light: #ffffff;
      --hrv-ex-neu-shadow-dark: #b8bec7;
      --hrv-ex-neu-convex-sm: 2px 2px 4px #b8bec7, -2px -2px 4px #ffffff;
      --hrv-ex-neu-concave-sm: inset 1px 1px 3px #b8bec7, inset -1px -1px 3px #ffffff;
    }
    :host([layout=row]) [part=card] [part=card-icon] {
      width: 28px !important;
      height: 28px !important;
      box-shadow: var(--hrv-ex-neu-concave-sm);
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
    }
    :host([layout=row]) [part=card] [part=card-icon] svg {
      width: 16px;
      height: 16px;
    }

    .neu-row-toggle {
      position: relative;
      width: 40px;
      height: 22px;
      border-radius: 11px;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-concave-sm);
      cursor: pointer;
      border: none;
      padding: 0;
      outline: none;
      transition: box-shadow 0.3s ease-out, background 0.3s ease-out;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-row-toggle::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      transition: transform 0.3s ease-out, background 0.3s ease-out;
    }
    .neu-row-toggle[aria-pressed="true"] {
      background: var(--hrv-ex-neu-shadow-dark);
    }
    .neu-row-toggle[aria-pressed="true"]::after {
      transform: translateX(18px);
      background: var(--hrv-ex-neu-shadow-light);
    }
    .neu-row-toggle:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .neu-row-toggle:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }

    [part=row-state],
    [part=row-value] {
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text-secondary);
    }

    .neu-row-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      color: var(--hrv-color-text);
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: box-shadow 0.2s ease, transform 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .neu-row-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .neu-row-btn:active:not(:disabled) {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      transform: scale(0.96);
    }
    .neu-row-btn:disabled { opacity: 0.4; cursor: default; }
    .neu-row-btn:focus-visible {
      outline: 2px solid var(--hrv-color-text-secondary);
      outline-offset: 2px;
    }
  `;

  const NEU_COMPANION_CSS = /* css */`
    [part=companion-zone] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--hrv-color-divider);
    }
    [part=companion-zone]:empty {
      display: none;
    }
    .hrv-companion {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 10px;
      background: var(--hrv-ex-neu-bg);
      box-shadow: var(--hrv-ex-neu-convex-sm);
      font-size: var(--hrv-font-size-xs, 11px);
      color: var(--hrv-color-text-secondary);
      cursor: default;
      transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
    }
    .hrv-companion[data-interactive="true"] {
      cursor: pointer;
    }
    .hrv-companion[data-interactive="true"]:active {
      box-shadow: var(--hrv-ex-neu-concave-sm);
      transform: scale(0.97);
      transition: box-shadow 0.1s ease-in, transform 0.1s ease-in;
    }
    [part=companion-icon] {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    [part=companion-icon] svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .hrv-companion__state {
      font-size: var(--hrv-font-size-xs, 11px);
      color: var(--hrv-color-text-secondary);
    }
  `;

  // ---------------------------------------------------------------------------
  // Slider helper: sync thumb position and fill
  // ---------------------------------------------------------------------------

  function _round2(n) {
    return Math.round(n * 100) / 100;
  }

  function _syncSlider(wrap, value, min, max) {
    if (!wrap) return;
    const pct = max > min ? _clamp(((value - min) / (max - min)) * 100, 0, 100) : 0;
    wrap.style.setProperty("--neu-fill", pct + "%");
    wrap.style.setProperty("--neu-thumb-offset", "calc(" + pct + "% - " + _round2(pct * 24 / 100) + "px)");
  }

  // ---------------------------------------------------------------------------
  // Dropdown helper
  // ---------------------------------------------------------------------------

  function _openDropdown(trigger, menu, options, current, onSelect) {
    menu.innerHTML = "";
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.className = "neu-dropdown-item";
      btn.type = "button";
      btn.role = "option";
      btn.textContent = _capitalize(opt);
      btn.setAttribute("aria-selected", opt === current ? "true" : "false");
      btn.addEventListener("click", () => {
        onSelect(opt);
        _closeDropdown(trigger, menu);
      });
      menu.appendChild(btn);
    }
    trigger.dataset.expanded = "true";
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < 210;
    menu.style.left = rect.left + "px";
    menu.style.width = rect.width + "px";
    if (above) {
      menu.style.bottom = (window.innerHeight - rect.top + 4) + "px";
      menu.style.top = "auto";
    } else {
      menu.style.top = (rect.bottom + 4) + "px";
      menu.style.bottom = "auto";
    }
    try { menu.showPopover(); } catch (_) { menu.style.display = "block"; }

    const close = (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        _closeDropdown(trigger, menu);
        document.removeEventListener("pointerdown", close);
      }
    };
    setTimeout(() => document.addEventListener("pointerdown", close), 0);
  }

  function _closeDropdown(trigger, menu) {
    trigger.dataset.expanded = "false";
    try { menu.hidePopover(); } catch (_) { menu.style.display = "none"; }
  }

  // ---------------------------------------------------------------------------
  // Pressing animation helper
  // ---------------------------------------------------------------------------

  function _wirePress(el) {
    if (!el) return;
    let holdTimer = null;
    el.addEventListener("pointerdown", () => {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      el.dataset.pressing = "true";
    });
    const release = () => {
      if (holdTimer) return;
      holdTimer = setTimeout(() => {
        el.dataset.pressing = "false";
        holdTimer = null;
      }, 120);
    };
    el.addEventListener("pointerup", release);
    el.addEventListener("pointerleave", release);
    el.addEventListener("pointercancel", release);
  }


  // =========================================================================
  // SwitchCard - horizontal sliding toggle
  // =========================================================================

  class SwitchCard extends BaseCard {
    #card = null;
    #toggle = null;
    #rowToggle = null;
    #stateLabel = null;
    #isOn = false;

    render() {
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${NEU_BASE}${NEU_TOGGLE_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-toggle" part="row-toggle" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}"></button>`
                : `<span part="row-state"></span>`
              }
            </span>
          </div>
          <div part="card-body">
            ${isWritable
              ? `<button class="neu-toggle" part="toggle-button" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}" style="align-self:center"></button>`
              : `<div class="neu-value-well"><span part="state-label"></span></div>`
            }
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#toggle = this.root.querySelector("[part=toggle-button]");
      this.#rowToggle = this.root.querySelector("[part=row-toggle]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");

      _applyHeaderHints(this.#card, this.config, this.def);

      const defIcon = this.def.domain === "input_boolean" ? "mdi:toggle-switch" : "mdi:toggle-switch";
      this.renderIcon(this.resolveIcon(this.def.icon, defIcon), "card-icon");

      const doToggle = () => {
        this.config.card?.sendCommand(this.#isOn ? "turn_off" : "turn_on", {});
      };
      if (this.#toggle) this._attachGestureHandlers(this.#toggle, { onTap: doToggle });
      if (this.#rowToggle) this._attachGestureHandlers(this.#rowToggle, { onTap: doToggle });

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      const isOn = state === "on";
      this.#isOn = isOn;
      const isUnavailable = state === "unavailable" || state === "unknown";
      const label = this.formatStateLabel(state, this.def.domain);

      if (this.#toggle) {
        this.#toggle.setAttribute("aria-pressed", String(isOn));
        this.#toggle.disabled = isUnavailable;
      }
      if (this.#rowToggle) {
        this.#rowToggle.setAttribute("aria-pressed", String(isOn));
        this.#rowToggle.disabled = isUnavailable;
      }
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      if (this.#stateLabel) this.#stateLabel.textContent = label;

      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(isOn);

      const iconMap = this.def.icon_state_map;
      if (iconMap) {
        const resolved = this.resolveIcon(iconMap[state] ?? iconMap.default);
        if (resolved) this.renderIcon(resolved, "card-icon");
      }

      this.announceState(label);
    }

    predictState(action) {
      if (action === "turn_on") return { state: "on", attributes: {} };
      if (action === "turn_off") return { state: "off", attributes: {} };
      return null;
    }
  }


  // =========================================================================
  // BinarySensorCard
  // =========================================================================

  class BinarySensorCard extends BaseCard {
    static staleOnMount = true;
    #card = null;

    render() {
      this.root.innerHTML = /* html */`
        <style>${NEU_BASE}${NEU_ROW_CSS}${NEU_COMPANION_CSS}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="neu-value-well">
              <span part="state-label"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:radiobox-blank"), "card-icon");
      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      const label = this.formatStateLabel(state, "binary_sensor", attributes?.device_class);
      const stateEl = this.root.querySelector("[part=state-label]");
      if (stateEl) stateEl.textContent = label;
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = label;

      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(state === "on");

      const iconMap = this.def.icon_state_map;
      if (iconMap) {
        const resolved = this.resolveIcon(iconMap[state] ?? iconMap.default);
        if (resolved) this.renderIcon(resolved, "card-icon");
      }
      this.announceState(label);
    }
  }


  // =========================================================================
  // SensorCard - generic, temperature, humidity, battery
  // =========================================================================

  const BATTERY_ICONS = [
    [10, "mdi:battery-10"], [20, "mdi:battery-20"], [30, "mdi:battery-30"],
    [40, "mdi:battery-40"], [50, "mdi:battery-50"], [60, "mdi:battery-60"],
    [70, "mdi:battery-70"], [80, "mdi:battery-80"], [90, "mdi:battery-90"],
    [100, "mdi:battery"],
  ];

  function _batteryIcon(level) {
    const n = Number(level);
    if (!Number.isFinite(n)) return "mdi:battery-unknown";
    for (const [thresh, icon] of BATTERY_ICONS) {
      if (n <= thresh) return icon;
    }
    return "mdi:battery";
  }

  class SensorCard extends BaseCard {
    static staleOnMount = true;
    #card = null;
    #valueEl = null;
    #unitEl = null;
    #currentBatteryIcon = null;

    render() {
      const unit = this.def.unit_of_measurement ?? "";
      const defaultIcon = this.def.device_class === "temperature" ? "mdi:thermometer"
        : this.def.device_class === "humidity" ? "mdi:water-percent"
        : this.def.device_class === "battery" ? "mdi:battery"
        : "mdi:eye";

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-sensor-value {
            font-size: 2rem;
            font-weight: var(--hrv-font-weight-bold, 700);
            line-height: 1;
            color: var(--hrv-color-text);
          }
          .neu-sensor-unit {
            font-size: var(--hrv-font-size-m, 15px);
            color: var(--hrv-color-text-secondary);
            margin-left: 4px;
          }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="neu-value-well">
              <span class="neu-sensor-value" part="sensor-value" aria-live="polite">-</span>
              <span class="neu-sensor-unit" part="sensor-unit">${_esc(unit)}</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#valueEl = this.root.querySelector("[part=sensor-value]");
      this.#unitEl = this.root.querySelector("[part=sensor-unit]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, defaultIcon), "card-icon");
      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      if (this.#valueEl) this.#valueEl.textContent = state ?? "-";
      if (attributes?.unit_of_measurement && this.#unitEl) {
        this.#unitEl.textContent = attributes.unit_of_measurement;
      }
      const display = (state ?? "-") + (this.#unitEl ? " " + this.#unitEl.textContent : "");
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = display;

      if (this.def.device_class === "battery") {
        const newIcon = _batteryIcon(state);
        if (newIcon !== this.#currentBatteryIcon) {
          this.#currentBatteryIcon = newIcon;
          const resolved = this.resolveIcon(newIcon);
          if (resolved) this.renderIcon(resolved, "card-icon");
        }
      }

      this.announceState(display);
    }
  }


  // =========================================================================
  // LightCard
  // =========================================================================

  class LightCard extends BaseCard {
    #card = null;
    #toggle = null;
    #rowToggle = null;
    #stateLabel = null;
    #brightnessWrap = null;
    #brightnessSlider = null;
    #brightnessValue = null;
    #colorTempWrap = null;
    #colorTempSlider = null;
    #colorTempValue = null;
    #colorWrap = null;
    #colorSlider = null;
    #modeBtns = [];
    #activeMode = 0;
    #modeAvail = [false, false, false];

    #isOn = false;
    #brightness = 0;
    #colorTempK = 4000;
    #hue = 0;
    #minCt = 2000;
    #maxCt = 6500;
    #lastAttrs = {};
    #sendBrightness;
    #sendColorTemp;
    #sendColor;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendBrightness = _debounce(this.#doSendBrightness.bind(this), 300);
      this.#sendColorTemp = _debounce(this.#doSendColorTemp.bind(this), 300);
      this.#sendColor = _debounce(this.#doSendColor.bind(this), 300);
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? {};
      const hasBrightness = hints.show_brightness !== false && features.includes("brightness");
      const hasColorTemp = hints.show_color_temp !== false && features.includes("color_temp");
      const hasColor = hints.show_rgb !== false && features.includes("rgb_color");
      this.#minCt = this.def.feature_config?.min_color_temp_kelvin ?? 2000;
      this.#maxCt = this.def.feature_config?.max_color_temp_kelvin ?? 6500;

      this.#modeAvail = [hasBrightness, hasColorTemp, hasColor];
      if (!this.#modeAvail[this.#activeMode]) {
        this.#activeMode = this.#modeAvail.findIndex(Boolean);
        if (this.#activeMode === -1) this.#activeMode = 0;
      }
      const modeCount = this.#modeAvail.filter(Boolean).length;
      const hasAnySlider = isWritable && modeCount > 0;
      const MODES = ["brightness", "temp", "color"];
      const MODE_LABELS = ["Brightness", "Temperature", "Color"];

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_TOGGLE_CSS}${NEU_SLIDER_CSS}${NEU_SELECT_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-light-sliders > div { display: none; }
          .neu-light-sliders > div.is-active { display: block; }
          .neu-light-modes {
            display: flex;
            gap: 8px;
            justify-content: center;
          }
          .neu-color-track {
            background: linear-gradient(to right,
              hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
              hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),
              hsl(360,100%,50%)) !important;
          }
          [part=card-body][data-off="true"] .neu-light-sliders,
          [part=card-body][data-off="true"] .neu-light-modes {
            opacity: 0.35;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-toggle" part="row-toggle" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}"></button>`
                : `<span part="row-state"></span>`
              }
            </span>
          </div>
          <div part="card-body">
            ${isWritable ? /* html */`
              <button class="neu-toggle" part="toggle-button" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}" style="align-self:center"></button>
              ${hasAnySlider ? /* html */`
                <div class="neu-light-sliders">
                  ${hasBrightness ? /* html */`
                    <div data-mode="brightness" class="${this.#activeMode === 0 ? "is-active" : ""}">
                      <div class="neu-slider-label">
                        <span>Brightness</span>
                        <span part="brightness-value">-</span>
                      </div>
                      <div class="neu-slider-wrap" data-slider="brightness">
                        <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                        <input part="brightness-slider" type="range" min="0" max="255" step="1" value="0"
                          aria-label="${_esc(this.def.friendly_name)} brightness">
                        <div class="neu-slider-thumb"></div>
                      </div>
                    </div>
                  ` : ""}
                  ${hasColorTemp ? /* html */`
                    <div data-mode="temp" class="${this.#activeMode === 1 ? "is-active" : ""}">
                      <div class="neu-slider-label">
                        <span>Temperature</span>
                        <span part="color-temp-value">-</span>
                      </div>
                      <div class="neu-slider-wrap" data-slider="temp">
                        <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                        <input part="color-temp-slider" type="range" min="${this.#minCt}" max="${this.#maxCt}" step="1" value="${this.#colorTempK}"
                          aria-label="${_esc(this.def.friendly_name)} color temperature">
                        <div class="neu-slider-thumb"></div>
                      </div>
                    </div>
                  ` : ""}
                  ${hasColor ? /* html */`
                    <div data-mode="color" class="${this.#activeMode === 2 ? "is-active" : ""}">
                      <div class="neu-slider-label">
                        <span>Color</span>
                      </div>
                      <div class="neu-slider-wrap" data-slider="color">
                        <div class="neu-slider-track neu-color-track"><div class="neu-slider-fill" style="opacity:0"></div></div>
                        <input part="color-slider" type="range" min="0" max="360" step="1" value="0"
                          aria-label="${_esc(this.def.friendly_name)} color">
                        <div class="neu-slider-thumb"></div>
                      </div>
                    </div>
                  ` : ""}
                </div>
                ${modeCount > 1 ? /* html */`
                  <div class="neu-light-modes">
                    ${MODES.map((m, i) => this.#modeAvail[i] && i !== this.#activeMode
                      ? `<button class="neu-pill" type="button" data-mode="${i}">${MODE_LABELS[i]}</button>`
                      : ""
                    ).join("")}
                  </div>
                ` : ""}
              ` : ""}
            ` : /* html */`
              <div class="neu-value-well"><span part="state-label"></span></div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#toggle = this.root.querySelector("[part=toggle-button]");
      this.#rowToggle = this.root.querySelector("[part=row-toggle]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");
      this.#brightnessWrap = this.root.querySelector("[data-slider=brightness]");
      this.#brightnessSlider = this.root.querySelector("[part=brightness-slider]");
      this.#brightnessValue = this.root.querySelector("[part=brightness-value]");
      this.#colorTempWrap = this.root.querySelector("[data-slider=temp]");
      this.#colorTempSlider = this.root.querySelector("[part=color-temp-slider]");
      this.#colorTempValue = this.root.querySelector("[part=color-temp-value]");
      this.#colorWrap = this.root.querySelector("[data-slider=color]");
      this.#colorSlider = this.root.querySelector("[part=color-slider]");
      this.#modeBtns = [...this.root.querySelectorAll(".neu-light-modes .neu-pill")];

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:lightbulb"), "card-icon");

      const doToggle = () => {
        this.config.card?.sendCommand(this.#isOn ? "turn_off" : "turn_on", {});
      };
      if (this.#toggle) this._attachGestureHandlers(this.#toggle, { onTap: doToggle });
      if (this.#rowToggle) this._attachGestureHandlers(this.#rowToggle, { onTap: doToggle });

      if (this.#brightnessSlider) {
        this.#brightnessSlider.addEventListener("input", () => {
          this.#brightness = parseInt(this.#brightnessSlider.value, 10);
          _syncSlider(this.#brightnessWrap, this.#brightness, 0, 255);
          if (this.#brightnessValue) this.#brightnessValue.textContent = Math.round((this.#brightness / 255) * 100) + "%";
          this.#sendBrightness();
        });
        this.guardSlider(this.#brightnessSlider, this.#sendBrightness);
      }
      if (this.#colorTempSlider) {
        this.#colorTempSlider.addEventListener("input", () => {
          this.#colorTempK = parseInt(this.#colorTempSlider.value, 10);
          _syncSlider(this.#colorTempWrap, this.#colorTempK, this.#minCt, this.#maxCt);
          if (this.#colorTempValue) this.#colorTempValue.textContent = this.#colorTempK + " K";
          this.#sendColorTemp();
        });
        this.guardSlider(this.#colorTempSlider, this.#sendColorTemp);
      }
      if (this.#colorSlider) {
        this.#colorSlider.addEventListener("input", () => {
          this.#hue = parseInt(this.#colorSlider.value, 10);
          _syncSlider(this.#colorWrap, this.#hue, 0, 360);
          this.#sendColor();
        });
        this.guardSlider(this.#colorSlider, this.#sendColor);
      }

      for (const btn of this.#modeBtns) {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.mode, 10);
          if (idx === this.#activeMode) return;
          this.#activeMode = idx;
          this.#updateModeUI();
        });
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    #updateModeUI() {
      const MODES = ["brightness", "temp", "color"];
      const MODE_LABELS = ["Brightness", "Temperature", "Color"];
      const sliderPanels = this.root.querySelectorAll(".neu-light-sliders > div");
      sliderPanels.forEach((panel) => {
        const mIdx = MODES.indexOf(panel.dataset.mode);
        panel.classList.toggle("is-active", mIdx === this.#activeMode);
      });
      const modesContainer = this.root.querySelector(".neu-light-modes");
      if (modesContainer) {
        modesContainer.innerHTML = MODES.map((m, i) =>
          this.#modeAvail[i] && i !== this.#activeMode
            ? `<button class="neu-pill" type="button" data-mode="${i}">${MODE_LABELS[i]}</button>`
            : ""
        ).join("");
        this.#modeBtns = [...modesContainer.querySelectorAll(".neu-pill")];
        for (const btn of this.#modeBtns) {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.mode, 10);
            if (idx === this.#activeMode) return;
            this.#activeMode = idx;
            this.#updateModeUI();
          });
        }
      }
    }

    #doSendBrightness() {
      this.config.card?.sendCommand("turn_on", { brightness: this.#brightness });
    }
    #doSendColorTemp() {
      this.config.card?.sendCommand("turn_on", { color_temp_kelvin: this.#colorTempK });
    }
    #doSendColor() {
      this.config.card?.sendCommand("turn_on", { hs_color: [this.#hue, 100] });
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      const isOn = state === "on";
      this.#isOn = isOn;
      const isUnavailable = state === "unavailable" || state === "unknown";
      const label = this.formatStateLabel(state, "light");

      if (this.#toggle) {
        this.#toggle.setAttribute("aria-pressed", String(isOn));
        this.#toggle.disabled = isUnavailable;
      }
      if (this.#rowToggle) {
        this.#rowToggle.setAttribute("aria-pressed", String(isOn));
        this.#rowToggle.disabled = isUnavailable;
      }
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      if (this.#stateLabel) this.#stateLabel.textContent = label;

      const body = this.root.querySelector("[part=card-body]");
      if (body) body.dataset.off = String(!isOn);

      if (this.#brightnessSlider && !this.isSliderActive(this.#brightnessSlider)) {
        const b = attributes.brightness ?? 0;
        this.#brightness = b;
        this.#brightnessSlider.value = b;
        _syncSlider(this.#brightnessWrap, b, 0, 255);
        if (this.#brightnessValue) this.#brightnessValue.textContent = Math.round((b / 255) * 100) + "%";
      }

      if (this.#colorTempSlider && !this.isSliderActive(this.#colorTempSlider)) {
        let ct = attributes.color_temp_kelvin;
        if (!ct && attributes.color_temp) ct = _miredToKelvin(attributes.color_temp);
        if (ct) {
          this.#colorTempK = ct;
          this.#colorTempSlider.value = ct;
          _syncSlider(this.#colorTempWrap, ct, this.#minCt, this.#maxCt);
          if (this.#colorTempValue) this.#colorTempValue.textContent = ct + " K";
        }
      }

      if (this.#colorSlider && !this.isSliderActive(this.#colorSlider)) {
        const hs = attributes.hs_color;
        if (hs) {
          this.#hue = Math.round(hs[0]);
          this.#colorSlider.value = this.#hue;
          _syncSlider(this.#colorWrap, this.#hue, 0, 360);
        }
      }

      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(isOn);

      const iconMap = this.def.icon_state_map;
      if (iconMap) {
        const resolved = this.resolveIcon(iconMap[state] ?? iconMap.default);
        if (resolved) this.renderIcon(resolved, "card-icon");
      }

      this.announceState(label);
    }

    predictState(action, data) {
      if (action === "turn_off") return { state: "off", attributes: { ...this.#lastAttrs } };
      if (action === "turn_on") {
        const attrs = { ...this.#lastAttrs };
        if (data?.brightness !== undefined) attrs.brightness = data.brightness;
        if (data?.color_temp_kelvin !== undefined) attrs.color_temp_kelvin = data.color_temp_kelvin;
        if (data?.hs_color !== undefined) attrs.hs_color = data.hs_color;
        return { state: "on", attributes: attrs };
      }
      return null;
    }
  }


  // =========================================================================
  // FanCard
  // =========================================================================

  class FanCard extends BaseCard {
    #card = null;
    #toggle = null;
    #rowToggle = null;
    #stateLabel = null;
    #speedWrap = null;
    #speedSlider = null;
    #speedValue = null;
    #cycleBtn = null;
    #oscillateBtn = null;
    #directionBtns = [];
    #presetBtns = [];
    #isOn = false;
    #lastAttrs = {};
    #sendSpeed;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendSpeed = _debounce(this.#doSendSpeed.bind(this), 300);
    }

    get #percentageStep() {
      const fc = this.def.feature_config;
      if (fc?.percentage_step > 1) return fc.percentage_step;
      if (fc?.speed_count > 1) return 100 / fc.speed_count;
      return 1;
    }

    get #speedSteps() {
      const step = this.#percentageStep;
      const steps = [];
      for (let i = 1; i * step <= 100.001; i++) steps.push(i * step);
      return steps;
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? this.def.display_hints ?? {};
      const supportsSpeed = features.includes("set_speed");
      const displayMode = hints.display_mode ?? "continuous";
      const speedMode = !supportsSpeed ? "off" : (displayMode === "on-off" ? "off" : displayMode);
      const hasSpeed = speedMode !== "off";
      const isCycle = speedMode === "cycle";
      const stepped = speedMode === "stepped";
      const hasOscillate = hints.show_oscillate !== false && features.includes("oscillate");
      const hasDirection = features.includes("set_direction");
      const hasPreset = features.includes("set_preset_mode");
      const presetModes = hints.show_presets !== false ? (this.def.feature_config?.preset_modes ?? []) : [];
      const pctStep = this.#percentageStep;

      let speedMarkup = "";
      if (hasSpeed && speedMode === "continuous") {
        speedMarkup = /* html */`
          <div>
            <div class="neu-slider-label"><span>Speed</span><span part="speed-value">-</span></div>
            <div class="neu-slider-wrap" data-slider="speed">
              <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
              <input part="speed-slider" type="range" min="0" max="100" step="${pctStep}" value="0"
                aria-label="${_esc(this.def.friendly_name)} speed">
              <div class="neu-slider-thumb"></div>
            </div>
          </div>`;
      } else if (hasSpeed && stepped) {
        const steps = this.#speedSteps;
        const labels = steps.map(p => Math.round(p) + "%");
        speedMarkup = /* html */`
          <div class="neu-pills" part="stepped-grid">
            ${steps.map((pct, i) => `<button class="neu-pill" type="button" data-pct="${pct}" aria-pressed="false">${_esc(labels[i])}</button>`).join("")}
          </div>`;
      } else if (hasSpeed && isCycle) {
        speedMarkup = "";
      }

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_TOGGLE_CSS}${NEU_SLIDER_CSS}${NEU_BUTTON_CSS}${NEU_SELECT_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-fan-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: center;
          }
          [part=card-icon][data-on="true"][data-animate="true"] svg {
            animation: neu-fan-spin 2s linear infinite;
            transform-origin: center;
          }
          @keyframes neu-fan-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            [part=card-icon][data-on="true"][data-animate="true"] svg {
              animation: none;
            }
          }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-toggle" part="row-toggle" type="button" role="switch" aria-pressed="false"></button>`
                : `<span part="row-state"></span>`
              }
            </span>
          </div>
          <div part="card-body">
            ${isWritable ? /* html */`
              <button class="neu-toggle" part="toggle-button" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}" style="align-self:center"></button>
              ${speedMarkup}
              <div class="neu-fan-controls">
                ${isCycle ? /* html */`
                  <button class="neu-btn" part="cycle-button" type="button">Speed</button>
                ` : ""}
                ${hasOscillate ? /* html */`
                  <button class="neu-btn" part="oscillate-button" type="button" aria-pressed="false">Oscillate</button>
                ` : ""}
                ${hasDirection ? /* html */`
                  <button class="neu-btn" part="direction-fwd" type="button" data-dir="forward" aria-pressed="true">Forward</button>
                  <button class="neu-btn" part="direction-rev" type="button" data-dir="reverse" aria-pressed="false">Reverse</button>
                ` : ""}
                ${presetModes.length ? /* html */`
                  <button class="neu-btn" part="preset-button" type="button" aria-pressed="false">Preset</button>
                ` : ""}
              </div>
            ` : /* html */`
              <div class="neu-value-well"><span part="state-label"></span></div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#toggle = this.root.querySelector("[part=toggle-button]");
      this.#rowToggle = this.root.querySelector("[part=row-toggle]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");
      this.#speedWrap = this.root.querySelector("[data-slider=speed]");
      this.#speedSlider = this.root.querySelector("[part=speed-slider]");
      this.#speedValue = this.root.querySelector("[part=speed-value]");
      this.#cycleBtn = this.root.querySelector("[part=cycle-button]");
      this.#oscillateBtn = this.root.querySelector("[part=oscillate-button]");
      this.#directionBtns = [...this.root.querySelectorAll("[part^=direction-]")];
      this.#presetBtns = this.root.querySelector("[part=preset-button]") ? [this.root.querySelector("[part=preset-button]")] : [];

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:fan"), "card-icon");

      const doToggle = () => this.config.card?.sendCommand(this.#isOn ? "turn_off" : "turn_on", {});
      if (this.#toggle) this._attachGestureHandlers(this.#toggle, { onTap: doToggle });
      if (this.#rowToggle) this._attachGestureHandlers(this.#rowToggle, { onTap: doToggle });
      if (this.#speedSlider) {
        this.#speedSlider.addEventListener("input", () => {
          const val = Number(this.#speedSlider.value);
          _syncSlider(this.#speedWrap, val, 0, 100);
          if (this.#speedValue) this.#speedValue.textContent = Math.round(val) + "%";
          this.#sendSpeed();
        });
        this.guardSlider(this.#speedSlider, this.#sendSpeed);
      }
      const steppedBtns = this.root.querySelectorAll("[part=stepped-grid] .neu-pill");
      for (const btn of steppedBtns) {
        btn.addEventListener("click", () => {
          const pct = Number(btn.dataset.pct);
          this.config.card?.sendCommand("set_percentage", { percentage: pct });
        });
        _wirePress(btn);
      }
      if (this.#cycleBtn) {
        this.#cycleBtn.addEventListener("click", () => {
          const steps = this.#speedSteps;
          if (!steps.length) return;
          const cur = this.#lastAttrs.percentage ?? 0;
          let next = steps.find(s => s > cur + 0.01);
          if (next === undefined) next = steps[0];
          this.config.card?.sendCommand("set_percentage", { percentage: next });
        });
        _wirePress(this.#cycleBtn);
      }
      if (this.#oscillateBtn) {
        this.#oscillateBtn.addEventListener("click", () => {
          const current = this.#lastAttrs.oscillating ?? false;
          this.config.card?.sendCommand("oscillate", { oscillating: !current });
        });
        _wirePress(this.#oscillateBtn);
      }
      for (const btn of this.#directionBtns) {
        btn.addEventListener("click", () => {
          this.config.card?.sendCommand("set_direction", { direction: btn.dataset.dir });
        });
        _wirePress(btn);
      }
      if (this.#presetBtns[0]) {
        this.#presetBtns[0].addEventListener("click", () => {
          const modes = presetModes.length ? presetModes : (this.def.feature_config?.preset_modes ?? []);
          if (!modes.length) return;
          const cur = this.#lastAttrs.preset_mode;
          const idx = cur ? modes.indexOf(cur) : -1;
          const next = modes[(idx + 1) % modes.length];
          this.config.card?.sendCommand("set_preset_mode", { preset_mode: next });
        });
        _wirePress(this.#presetBtns[0]);
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    #doSendSpeed() {
      this.config.card?.sendCommand("set_percentage", { percentage: Number(this.#speedSlider?.value ?? 0) });
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      const isOn = state === "on";
      this.#isOn = isOn;
      const isUnavailable = state === "unavailable" || state === "unknown";
      const label = this.formatStateLabel(state, "fan");

      if (this.#toggle) {
        this.#toggle.setAttribute("aria-pressed", String(isOn));
        this.#toggle.disabled = isUnavailable;
      }
      if (this.#rowToggle) {
        this.#rowToggle.setAttribute("aria-pressed", String(isOn));
        this.#rowToggle.disabled = isUnavailable;
      }
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      if (this.#stateLabel) this.#stateLabel.textContent = label;

      if (this.#speedSlider && !this.isSliderActive(this.#speedSlider)) {
        const pct = attributes.percentage ?? 0;
        this.#speedSlider.value = _round2(pct);
        _syncSlider(this.#speedWrap, pct, 0, 100);
        if (this.#speedValue) this.#speedValue.textContent = Math.round(pct) + "%";
      }

      const steppedBtns = this.root.querySelectorAll("[part=stepped-grid] .neu-pill");
      if (steppedBtns.length) {
        const curPct = attributes.percentage ?? 0;
        for (const btn of steppedBtns) {
          const pct = Number(btn.dataset.pct);
          const match = Math.abs(curPct - pct) < 0.5;
          btn.setAttribute("aria-pressed", String(match));
          btn.classList.toggle("is-active", match);
        }
      }

      if (this.#oscillateBtn) {
        this.#oscillateBtn.setAttribute("aria-pressed", String(!!attributes.oscillating));
      }
      for (const btn of this.#directionBtns) {
        btn.setAttribute("aria-pressed", String(btn.dataset.dir === (attributes.direction ?? "forward")));
      }
      if (this.#presetBtns[0]) {
        const pm = attributes.preset_mode;
        if (pm) this.#presetBtns[0].textContent = _capitalize(pm);
        else this.#presetBtns[0].textContent = "Preset";
      }

      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) {
        iconEl.dataset.on = String(isOn);
        iconEl.dataset.animate = String(isOn && this.config.displayHints?.animate !== false);
      }

      const fanIcon = isUnavailable ? "mdi:fan-alert"
        : isOn ? "mdi:fan"
        : "mdi:fan-off";
      const iconMap = this.def.icon_state_map;
      const resolved = this.resolveIcon(iconMap?.[state] ?? iconMap?.default ?? fanIcon);
      if (resolved) this.renderIcon(resolved, "card-icon");

      this.announceState(label);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "turn_on") return { state: "on", attributes: attrs };
      if (action === "turn_off") return { state: "off", attributes: attrs };
      if (action === "set_percentage") { attrs.percentage = data?.percentage; return { state: this.#isOn ? "on" : "off", attributes: attrs }; }
      if (action === "oscillate") { attrs.oscillating = data?.oscillating; return { state: this.#isOn ? "on" : "off", attributes: attrs }; }
      if (action === "set_direction") { attrs.direction = data?.direction; return { state: this.#isOn ? "on" : "off", attributes: attrs }; }
      if (action === "set_preset_mode") { attrs.preset_mode = data?.preset_mode; return { state: this.#isOn ? "on" : "off", attributes: attrs }; }
      return null;
    }
  }


  // =========================================================================
  // ClimateCard
  // =========================================================================

  class ClimateCard extends BaseCard {
    #card = null;
    #currentTempEl = null;
    #stateLabel = null;
    #modeSelect = null;
    #modeMenu = null;
    #targetSlider = null;
    #targetWrap = null;
    #targetValue = null;
    #targetLowSlider = null;
    #targetLowWrap = null;
    #targetLowValue = null;
    #targetHighSlider = null;
    #targetHighWrap = null;
    #targetHighValue = null;
    #fanModeSelect = null;
    #fanModeMenu = null;
    #presetSelect = null;
    #presetMenu = null;
    #swingSelect = null;
    #swingMenu = null;
    #lastAttrs = {};
    #pending = {};
    #pendingTimer = null;
    #tempMin = 7;
    #tempMax = 35;
    #tempStep = 0.5;
    #sendTarget;
    #sendTargetLow;
    #sendTargetHigh;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendTarget = _debounce(() => {
        const val = parseFloat(this.#targetSlider?.value);
        if (Number.isFinite(val)) this.config.card?.sendCommand("set_temperature", { temperature: val });
      }, 500);
      this.#sendTargetLow = _debounce(() => {
        const val = parseFloat(this.#targetLowSlider?.value);
        if (Number.isFinite(val)) this.config.card?.sendCommand("set_temperature", { target_temp_low: val });
      }, 500);
      this.#sendTargetHigh = _debounce(() => {
        const val = parseFloat(this.#targetHighSlider?.value);
        if (Number.isFinite(val)) this.config.card?.sendCommand("set_temperature", { target_temp_high: val });
      }, 500);
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hvacModes = this.def.feature_config?.hvac_modes ?? [];
      const hasHvac = hvacModes.length > 0;
      const hasTarget = features.includes("target_temperature");
      const hasRange = features.includes("target_temperature_range");
      const hasFanMode = features.includes("fan_mode");
      const hasPreset = features.includes("preset_mode");
      const hasSwing = features.includes("swing_mode");
      const fc = this.def.feature_config ?? {};
      this.#tempMin = fc.min_temp ?? 7;
      this.#tempMax = fc.max_temp ?? 35;
      this.#tempStep = fc.target_temp_step ?? 0.5;

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_SLIDER_CSS}${NEU_BUTTON_CSS}${NEU_SELECT_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-climate-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }
          .neu-climate-label {
            font-size: var(--hrv-font-size-s, 13px);
            color: var(--hrv-color-text-secondary);
          }
          .neu-climate-temp {
            font-size: var(--hrv-font-size-l, 18px);
            font-weight: var(--hrv-font-weight-bold, 700);
          }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="neu-climate-row">
              <span class="neu-climate-label">Current</span>
              <span part="current-temp" class="neu-climate-temp">-</span>
            </div>
            ${!isWritable ? `<div class="neu-value-well"><span part="state-label"></span></div>` : ""}
            ${hasHvac && isWritable ? /* html */`
              <div class="neu-climate-row">
                <span class="neu-climate-label">Mode</span>
                <button class="neu-dropdown-trigger" part="mode-select" type="button" data-expanded="false">-</button>
                <div class="neu-dropdown-menu" part="mode-menu" popover="manual"></div>
              </div>
            ` : ""}
            ${hasTarget && isWritable ? /* html */`
              <div>
                <div class="neu-slider-label"><span>Target</span><span part="target-value">-</span></div>
                <div class="neu-slider-wrap" data-slider="target">
                  <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                  <input part="target-slider" type="range" min="${this.#tempMin}" max="${this.#tempMax}" step="${this.#tempStep}" value="${this.#tempMin}" aria-label="Target temperature">
                  <div class="neu-slider-thumb"></div>
                </div>
              </div>
            ` : ""}
            ${hasRange && isWritable ? /* html */`
              <div>
                <div class="neu-slider-label"><span>Low</span><span part="target-low-value">-</span></div>
                <div class="neu-slider-wrap" data-slider="target-low">
                  <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                  <input part="target-low-slider" type="range" min="${this.#tempMin}" max="${this.#tempMax}" step="${this.#tempStep}" value="${this.#tempMin}" aria-label="Target low">
                  <div class="neu-slider-thumb"></div>
                </div>
              </div>
              <div>
                <div class="neu-slider-label"><span>High</span><span part="target-high-value">-</span></div>
                <div class="neu-slider-wrap" data-slider="target-high">
                  <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                  <input part="target-high-slider" type="range" min="${this.#tempMin}" max="${this.#tempMax}" step="${this.#tempStep}" value="${this.#tempMax}" aria-label="Target high">
                  <div class="neu-slider-thumb"></div>
                </div>
              </div>
            ` : ""}
            ${hasFanMode && isWritable ? /* html */`
              <div class="neu-climate-row">
                <span class="neu-climate-label">Fan</span>
                <button class="neu-dropdown-trigger" part="fan-mode-select" type="button" data-expanded="false">-</button>
                <div class="neu-dropdown-menu" part="fan-mode-menu" popover="manual"></div>
              </div>
            ` : hasFanMode ? `<div class="neu-climate-row"><span class="neu-climate-label">Fan</span><span part="fan-mode-label" class="neu-climate-label"></span></div>` : ""}
            ${hasPreset && isWritable ? /* html */`
              <div class="neu-climate-row">
                <span class="neu-climate-label">Preset</span>
                <button class="neu-dropdown-trigger" part="preset-select" type="button" data-expanded="false">-</button>
                <div class="neu-dropdown-menu" part="preset-menu" popover="manual"></div>
              </div>
            ` : hasPreset ? `<div class="neu-climate-row"><span class="neu-climate-label">Preset</span><span part="preset-label" class="neu-climate-label"></span></div>` : ""}
            ${hasSwing && isWritable ? /* html */`
              <div class="neu-climate-row">
                <span class="neu-climate-label">Swing</span>
                <button class="neu-dropdown-trigger" part="swing-select" type="button" data-expanded="false">-</button>
                <div class="neu-dropdown-menu" part="swing-menu" popover="manual"></div>
              </div>
            ` : hasSwing ? `<div class="neu-climate-row"><span class="neu-climate-label">Swing</span><span part="swing-label" class="neu-climate-label"></span></div>` : ""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#currentTempEl = this.root.querySelector("[part=current-temp]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");
      this.#modeSelect = this.root.querySelector("[part=mode-select]");
      this.#modeMenu = this.root.querySelector("[part=mode-menu]");
      this.#targetSlider = this.root.querySelector("[part=target-slider]");
      this.#targetWrap = this.root.querySelector("[data-slider=target]");
      this.#targetValue = this.root.querySelector("[part=target-value]");
      this.#targetLowSlider = this.root.querySelector("[part=target-low-slider]");
      this.#targetLowWrap = this.root.querySelector("[data-slider=target-low]");
      this.#targetLowValue = this.root.querySelector("[part=target-low-value]");
      this.#targetHighSlider = this.root.querySelector("[part=target-high-slider]");
      this.#targetHighWrap = this.root.querySelector("[data-slider=target-high]");
      this.#targetHighValue = this.root.querySelector("[part=target-high-value]");
      this.#fanModeSelect = this.root.querySelector("[part=fan-mode-select]");
      this.#fanModeMenu = this.root.querySelector("[part=fan-mode-menu]");
      this.#presetSelect = this.root.querySelector("[part=preset-select]");
      this.#presetMenu = this.root.querySelector("[part=preset-menu]");
      this.#swingSelect = this.root.querySelector("[part=swing-select]");
      this.#swingMenu = this.root.querySelector("[part=swing-menu]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:thermostat"), "card-icon");

      if (this.#modeSelect && this.#modeMenu) {
        this.#modeSelect.addEventListener("click", () => {
          const modes = this.def.feature_config?.hvac_modes ?? [];
          _openDropdown(this.#modeSelect, this.#modeMenu, modes, this.#lastAttrs.hvac_action ?? this.#lastAttrs.state, (mode) => {
            this.#pending.mode = mode;
            this.#resetPendingTimer();
            this.config.card?.sendCommand("set_hvac_mode", { hvac_mode: mode });
          });
        });
      }
      if (this.#targetSlider) {
        this.#targetSlider.addEventListener("input", () => {
          const val = parseFloat(this.#targetSlider.value);
          _syncSlider(this.#targetWrap, val, this.#tempMin, this.#tempMax);
          if (this.#targetValue) this.#targetValue.textContent = val + "°";
          this.#sendTarget();
        });
        this.guardSlider(this.#targetSlider, this.#sendTarget);
      }
      if (this.#targetLowSlider) {
        this.#targetLowSlider.addEventListener("input", () => {
          const val = parseFloat(this.#targetLowSlider.value);
          _syncSlider(this.#targetLowWrap, val, this.#tempMin, this.#tempMax);
          if (this.#targetLowValue) this.#targetLowValue.textContent = val + "°";
          this.#sendTargetLow();
        });
        this.guardSlider(this.#targetLowSlider, this.#sendTargetLow);
      }
      if (this.#targetHighSlider) {
        this.#targetHighSlider.addEventListener("input", () => {
          const val = parseFloat(this.#targetHighSlider.value);
          _syncSlider(this.#targetHighWrap, val, this.#tempMin, this.#tempMax);
          if (this.#targetHighValue) this.#targetHighValue.textContent = val + "°";
          this.#sendTargetHigh();
        });
        this.guardSlider(this.#targetHighSlider, this.#sendTargetHigh);
      }
      if (this.#fanModeSelect && this.#fanModeMenu) {
        this.#fanModeSelect.addEventListener("click", () => {
          _openDropdown(this.#fanModeSelect, this.#fanModeMenu, this.def.feature_config?.fan_modes ?? [], this.#lastAttrs.fan_mode, (m) => {
            this.#pending.fanMode = m; this.#resetPendingTimer();
            this.config.card?.sendCommand("set_fan_mode", { fan_mode: m });
          });
        });
      }
      if (this.#presetSelect && this.#presetMenu) {
        this.#presetSelect.addEventListener("click", () => {
          _openDropdown(this.#presetSelect, this.#presetMenu, this.def.feature_config?.preset_modes ?? [], this.#lastAttrs.preset_mode, (m) => {
            this.#pending.presetMode = m; this.#resetPendingTimer();
            this.config.card?.sendCommand("set_preset_mode", { preset_mode: m });
          });
        });
      }
      if (this.#swingSelect && this.#swingMenu) {
        this.#swingSelect.addEventListener("click", () => {
          _openDropdown(this.#swingSelect, this.#swingMenu, this.def.feature_config?.swing_modes ?? [], this.#lastAttrs.swing_mode, (m) => {
            this.#pending.swingMode = m; this.#resetPendingTimer();
            this.config.card?.sendCommand("set_swing_mode", { swing_mode: m });
          });
        });
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    #resetPendingTimer() {
      clearTimeout(this.#pendingTimer);
      this.#pendingTimer = setTimeout(() => { this.#pending = {}; }, 10000);
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      if (this.#currentTempEl) {
        const ct = attributes.current_temperature;
        this.#currentTempEl.textContent = ct != null ? ct + "°" : "-";
      }
      if (this.#stateLabel) this.#stateLabel.textContent = this.formatStateLabel(state, "climate");
      if (this.#modeSelect && !this.#pending.mode) this.#modeSelect.textContent = _capitalize(state);

      if (this.#targetSlider && !this.isSliderActive(this.#targetSlider) && attributes.temperature != null) {
        this.#targetSlider.value = attributes.temperature;
        _syncSlider(this.#targetWrap, attributes.temperature, this.#tempMin, this.#tempMax);
        if (this.#targetValue) this.#targetValue.textContent = attributes.temperature + "°";
      }
      if (this.#targetLowSlider && !this.isSliderActive(this.#targetLowSlider) && attributes.target_temp_low != null) {
        this.#targetLowSlider.value = attributes.target_temp_low;
        _syncSlider(this.#targetLowWrap, attributes.target_temp_low, this.#tempMin, this.#tempMax);
        if (this.#targetLowValue) this.#targetLowValue.textContent = attributes.target_temp_low + "°";
      }
      if (this.#targetHighSlider && !this.isSliderActive(this.#targetHighSlider) && attributes.target_temp_high != null) {
        this.#targetHighSlider.value = attributes.target_temp_high;
        _syncSlider(this.#targetHighWrap, attributes.target_temp_high, this.#tempMin, this.#tempMax);
        if (this.#targetHighValue) this.#targetHighValue.textContent = attributes.target_temp_high + "°";
      }

      if (this.#fanModeSelect && !this.#pending.fanMode) this.#fanModeSelect.textContent = _capitalize(attributes.fan_mode ?? "-");
      const fanLabel = this.root.querySelector("[part=fan-mode-label]");
      if (fanLabel) fanLabel.textContent = _capitalize(attributes.fan_mode ?? "-");
      if (this.#presetSelect && !this.#pending.presetMode) this.#presetSelect.textContent = _capitalize(attributes.preset_mode ?? "-");
      const presetLabel = this.root.querySelector("[part=preset-label]");
      if (presetLabel) presetLabel.textContent = _capitalize(attributes.preset_mode ?? "-");
      if (this.#swingSelect && !this.#pending.swingMode) this.#swingSelect.textContent = _capitalize(attributes.swing_mode ?? "-");
      const swingLabel = this.root.querySelector("[part=swing-label]");
      if (swingLabel) swingLabel.textContent = _capitalize(attributes.swing_mode ?? "-");

      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(state !== "off" && state !== "unavailable");

      this.announceState(`${_capitalize(state)} ${attributes.current_temperature ?? ""}°`);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "set_hvac_mode") return { state: data?.hvac_mode ?? "off", attributes: attrs };
      if (action === "set_temperature") {
        if (data?.temperature !== undefined) attrs.temperature = data.temperature;
        if (data?.target_temp_low !== undefined) attrs.target_temp_low = data.target_temp_low;
        if (data?.target_temp_high !== undefined) attrs.target_temp_high = data.target_temp_high;
        return { state: this.#lastAttrs.state, attributes: attrs };
      }
      if (action === "set_fan_mode") { attrs.fan_mode = data?.fan_mode; return { state: this.#lastAttrs.state, attributes: attrs }; }
      if (action === "set_preset_mode") { attrs.preset_mode = data?.preset_mode; return { state: this.#lastAttrs.state, attributes: attrs }; }
      if (action === "set_swing_mode") { attrs.swing_mode = data?.swing_mode; return { state: this.#lastAttrs.state, attributes: attrs }; }
      return null;
    }
  }


  // =========================================================================
  // CoverCard
  // =========================================================================

  class CoverCard extends BaseCard {
    #card = null;
    #posWrap = null;
    #posSlider = null;
    #posValue = null;
    #tiltWrap = null;
    #tiltSlider = null;
    #tiltValue = null;
    #stopBtn = null;
    #lastAttrs = {};
    #sendPos;
    #sendTilt;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendPos = _debounce(() => {
        this.config.card?.sendCommand("set_cover_position", { position: parseInt(this.#posSlider?.value ?? 0, 10) });
      }, 300);
      this.#sendTilt = _debounce(() => {
        this.config.card?.sendCommand("set_cover_tilt_position", { tilt_position: parseInt(this.#tiltSlider?.value ?? 0, 10) });
      }, 300);
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? {};
      const hasPos = hints.show_position !== false && features.includes("set_position");
      const hasTilt = hints.show_tilt !== false && features.includes("set_tilt_position");

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_SLIDER_CSS}${NEU_BUTTON_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-cover-controls { display: flex; gap: 8px; }
          .neu-cover-controls .neu-btn { flex: 1; }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-state"></span></span>
          </div>
          <div part="card-body">
            ${!isWritable ? `<div class="neu-value-well"><span part="state-label"></span></div>` : /* html */`
              <div class="neu-cover-controls">
                <button class="neu-btn" part="open-button" type="button">Open</button>
                <button class="neu-btn" part="stop-button" type="button">Stop</button>
                <button class="neu-btn" part="close-button" type="button">Close</button>
              </div>
              ${hasPos ? /* html */`
                <div>
                  <div class="neu-slider-label"><span>Position</span><span part="position-value">-</span></div>
                  <div class="neu-slider-wrap" data-slider="pos">
                    <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                    <input part="position-slider" type="range" min="0" max="100" step="1" value="0" aria-label="${_esc(this.def.friendly_name)} position">
                    <div class="neu-slider-thumb"></div>
                  </div>
                </div>
              ` : ""}
              ${hasTilt ? /* html */`
                <div>
                  <div class="neu-slider-label"><span>Tilt</span><span part="tilt-value">-</span></div>
                  <div class="neu-slider-wrap" data-slider="tilt">
                    <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                    <input part="tilt-slider" type="range" min="0" max="100" step="1" value="0" aria-label="${_esc(this.def.friendly_name)} tilt">
                    <div class="neu-slider-thumb"></div>
                  </div>
                </div>
              ` : ""}
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#posWrap = this.root.querySelector("[data-slider=pos]");
      this.#posSlider = this.root.querySelector("[part=position-slider]");
      this.#posValue = this.root.querySelector("[part=position-value]");
      this.#tiltWrap = this.root.querySelector("[data-slider=tilt]");
      this.#tiltSlider = this.root.querySelector("[part=tilt-slider]");
      this.#tiltValue = this.root.querySelector("[part=tilt-value]");
      this.#stopBtn = this.root.querySelector("[part=stop-button]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:window-shutter"), "card-icon");

      const openBtn = this.root.querySelector("[part=open-button]");
      const closeBtn = this.root.querySelector("[part=close-button]");
      if (openBtn) { openBtn.addEventListener("click", () => this.config.card?.sendCommand("open_cover", {})); _wirePress(openBtn); }
      if (closeBtn) { closeBtn.addEventListener("click", () => this.config.card?.sendCommand("close_cover", {})); _wirePress(closeBtn); }
      if (this.#stopBtn) { this.#stopBtn.addEventListener("click", () => this.config.card?.sendCommand("stop_cover", {})); _wirePress(this.#stopBtn); }
      if (this.#posSlider) {
        this.#posSlider.addEventListener("input", () => {
          const val = parseInt(this.#posSlider.value, 10);
          _syncSlider(this.#posWrap, val, 0, 100);
          if (this.#posValue) this.#posValue.textContent = val + "%";
          this.#sendPos();
        });
        this.guardSlider(this.#posSlider, this.#sendPos);
      }
      if (this.#tiltSlider) {
        this.#tiltSlider.addEventListener("input", () => {
          const val = parseInt(this.#tiltSlider.value, 10);
          _syncSlider(this.#tiltWrap, val, 0, 100);
          if (this.#tiltValue) this.#tiltValue.textContent = val + "%";
          this.#sendTilt();
        });
        this.guardSlider(this.#tiltSlider, this.#sendTilt);
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      const label = this.formatStateLabel(state, "cover");
      const stateLabel = this.root.querySelector("[part=state-label]");
      if (stateLabel) stateLabel.textContent = label;
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      if (this.#stopBtn) this.#stopBtn.disabled = state !== "opening" && state !== "closing";
      if (this.#posSlider && !this.isSliderActive(this.#posSlider)) {
        const pos = attributes.current_position ?? 0;
        this.#posSlider.value = pos;
        _syncSlider(this.#posWrap, pos, 0, 100);
        if (this.#posValue) this.#posValue.textContent = pos + "%";
      }
      if (this.#tiltSlider && !this.isSliderActive(this.#tiltSlider)) {
        const tilt = attributes.current_tilt_position ?? 0;
        this.#tiltSlider.value = tilt;
        _syncSlider(this.#tiltWrap, tilt, 0, 100);
        if (this.#tiltValue) this.#tiltValue.textContent = tilt + "%";
      }
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(state === "open" || (attributes.current_position != null && attributes.current_position > 0));
      this.announceState(label);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "open_cover") return { state: "open", attributes: { ...attrs, current_position: 100 } };
      if (action === "close_cover") return { state: "closed", attributes: { ...attrs, current_position: 0 } };
      if (action === "stop_cover") return { state: this.#lastAttrs.state ?? "open", attributes: attrs };
      if (action === "set_cover_position") { const p = data?.position ?? 0; return { state: p > 0 ? "open" : "closed", attributes: { ...attrs, current_position: p } }; }
      if (action === "set_cover_tilt_position") { const p = data?.tilt_position ?? 0; return { state: this.#lastAttrs.state ?? "open", attributes: { ...attrs, current_tilt_position: p } }; }
      return null;
    }
  }


  // =========================================================================
  // MediaPlayerCard
  // =========================================================================

  class MediaPlayerCard extends BaseCard {
    #card = null;
    #heroEl = null;
    #artEl = null;
    #titleEl = null;
    #artistEl = null;
    #sourceEl = null;
    #playBtn = null;
    #volWrap = null;
    #volSlider = null;
    #muteBtn = null;
    #sourceSelect = null;
    #sourceMenu = null;
    #progWrap = null;
    #progFill = null;
    #progThumb = null;
    #progInput = null;
    #progElapsed = null;
    #progDuration = null;
    #lastAttrs = {};
    #lastArtUrl = "";
    #progTimer = 0;
    #progDragging = false;
    #sendVol;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendVol = _debounce(() => {
        this.config.card?.sendCommand("volume_set", { volume_level: parseFloat(this.#volSlider?.value ?? 0) });
      }, 200);
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hasTransport = features.includes("play_pause");
      const hasPrev = features.includes("previous_track");
      const hasNext = features.includes("next_track");
      const hasVolume = features.includes("volume_set") || features.includes("volume_step");
      const hasMute = hasVolume;
      const hasSource = true;

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_SLIDER_CSS}${NEU_BUTTON_CSS}${NEU_SELECT_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-mp-hero {
            display: flex;
            gap: 14px;
            align-items: center;
            padding: 10px;
            border-radius: var(--hrv-radius-m, 12px);
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
            overflow: hidden;
            max-height: 200px;
            opacity: 1;
            transition: max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease, margin 0.3s ease;
          }
          .neu-mp-hero[hidden] {
            display: flex;
            max-height: 0;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
          }
          .neu-mp-art {
            width: 72px;
            height: 72px;
            flex-shrink: 0;
            border-radius: var(--hrv-radius-s, 6px);
            background: var(--hrv-ex-neu-shadow-dark);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--hrv-color-text-secondary);
          }
          .neu-mp-art img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .neu-mp-art svg {
            width: 28px;
            height: 28px;
            fill: currentColor;
            opacity: 0.4;
          }
          .neu-mp-text {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .neu-mp-title {
            font-size: var(--hrv-font-size-m, 15px);
            font-weight: var(--hrv-font-weight-medium, 500);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .neu-mp-artist {
            font-size: var(--hrv-font-size-s, 13px);
            color: var(--hrv-color-text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .neu-mp-source {
            font-size: var(--hrv-font-size-xs, 11px);
            color: var(--hrv-color-text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            opacity: 0.7;
          }
          .neu-mp-state {
            font-size: var(--hrv-font-size-xs, 11px);
            color: var(--hrv-color-text-secondary);
            text-transform: capitalize;
          }
          .neu-mp-progress {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .neu-mp-progress[hidden] { display: none; }
          .neu-mp-time {
            font-size: var(--hrv-font-size-xs, 11px);
            color: var(--hrv-color-text-secondary);
            min-width: 32px;
            text-align: center;
            font-variant-numeric: tabular-nums;
          }
          .neu-mp-progress .neu-slider-wrap { flex: 1; }
          .neu-transport { display: flex; justify-content: center; align-items: center; gap: 12px; }
          .neu-vol-row { display: flex; align-items: center; gap: 8px; }
          .neu-vol-row .neu-slider-wrap { flex: 1; }
          .neu-source-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
          .neu-source-label { font-size: var(--hrv-font-size-s, 13px); color: var(--hrv-color-text-secondary); }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-state"></span></span>
          </div>
          <div part="card-body">
            <div class="neu-mp-hero">
              <div class="neu-mp-art" part="media-art"></div>
              <div class="neu-mp-text">
                <div class="neu-mp-title" part="media-title"></div>
                <div class="neu-mp-artist" part="media-artist"></div>
                <div class="neu-mp-source" part="media-source-label"></div>
                <div class="neu-mp-state" part="media-state"></div>
              </div>
            </div>
            <div class="neu-mp-progress" part="progress-row" hidden>
              <span class="neu-mp-time" part="progress-elapsed">0:00</span>
              <div class="neu-slider-wrap" data-slider="progress">
                <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                <input part="progress-slider" type="range" min="0" max="1" step="0.001" value="0" aria-label="Seek">
                <div class="neu-slider-thumb"></div>
              </div>
              <span class="neu-mp-time" part="progress-duration">0:00</span>
            </div>
            ${isWritable && hasTransport ? /* html */`
              <div class="neu-transport">
                ${hasPrev ? `<button class="neu-btn neu-btn-circle-sm" part="prev-button" type="button" aria-label="Previous"><span part="prev-icon"></span></button>` : ""}
                <button class="neu-btn neu-btn-circle" part="play-button" type="button" aria-label="Play"><span part="play-icon"></span></button>
                ${hasNext ? `<button class="neu-btn neu-btn-circle-sm" part="next-button" type="button" aria-label="Next"><span part="next-icon"></span></button>` : ""}
              </div>
            ` : ""}
            ${isWritable && hasVolume ? /* html */`
              <div class="neu-vol-row">
                ${hasMute ? `<button class="neu-btn neu-btn-circle-sm" part="mute-button" type="button" aria-label="Mute" aria-pressed="false"><span part="mute-icon"></span></button>` : ""}
                <div class="neu-slider-wrap" data-slider="volume">
                  <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                  <input part="volume-slider" type="range" min="0" max="1" step="0.01" value="0" aria-label="${_esc(this.def.friendly_name)} volume">
                  <div class="neu-slider-thumb"></div>
                </div>
              </div>
            ` : ""}
            ${isWritable && hasSource ? /* html */`
              <div class="neu-source-row">
                <span class="neu-source-label">Source</span>
                <button class="neu-dropdown-trigger" part="source-select" type="button" data-expanded="false">-</button>
                <div class="neu-dropdown-menu" part="source-menu" popover="manual"></div>
              </div>
            ` : ""}
            ${!isWritable ? `<div class="neu-value-well"><span part="state-label"></span></div>` : ""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#heroEl = this.root.querySelector(".neu-mp-hero");
      this.#artEl = this.root.querySelector("[part=media-art]");
      this.#titleEl = this.root.querySelector("[part=media-title]");
      this.#artistEl = this.root.querySelector("[part=media-artist]");
      this.#sourceEl = this.root.querySelector("[part=media-source-label]");
      this.#playBtn = this.root.querySelector("[part=play-button]");
      this.#volWrap = this.root.querySelector("[data-slider=volume]");
      this.#volSlider = this.root.querySelector("[part=volume-slider]");
      this.#muteBtn = this.root.querySelector("[part=mute-button]");
      this.#sourceSelect = this.root.querySelector("[part=source-select]");
      this.#sourceMenu = this.root.querySelector("[part=source-menu]");
      this.#progWrap = this.root.querySelector("[data-slider=progress]");
      this.#progFill = this.#progWrap?.querySelector(".neu-slider-fill");
      this.#progThumb = this.#progWrap?.querySelector(".neu-slider-thumb");
      this.#progInput = this.root.querySelector("[part=progress-slider]");
      this.#progElapsed = this.root.querySelector("[part=progress-elapsed]");
      this.#progDuration = this.root.querySelector("[part=progress-duration]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:cast"), "card-icon");

      const prevBtn = this.root.querySelector("[part=prev-button]");
      const nextBtn = this.root.querySelector("[part=next-button]");
      if (prevBtn) { this.renderIcon("mdi:skip-previous", "prev-icon"); prevBtn.addEventListener("click", () => this.config.card?.sendCommand("media_previous_track", {})); _wirePress(prevBtn); }
      if (this.#playBtn) { this.renderIcon("mdi:play", "play-icon"); this.#playBtn.addEventListener("click", () => this.config.card?.sendCommand("media_play_pause", {})); _wirePress(this.#playBtn); }
      if (nextBtn) { this.renderIcon("mdi:skip-next", "next-icon"); nextBtn.addEventListener("click", () => this.config.card?.sendCommand("media_next_track", {})); _wirePress(nextBtn); }
      if (this.#muteBtn) {
        this.renderIcon("mdi:volume-high", "mute-icon");
        this.#muteBtn.addEventListener("click", () => {
          this.config.card?.sendCommand("volume_mute", { is_volume_muted: !(this.#lastAttrs.is_volume_muted ?? false) });
        });
        _wirePress(this.#muteBtn);
      }
      if (this.#volSlider) {
        this.#volSlider.addEventListener("input", () => { _syncSlider(this.#volWrap, parseFloat(this.#volSlider.value), 0, 1); this.#sendVol(); });
        this.guardSlider(this.#volSlider, this.#sendVol);
      }
      if (this.#progInput) {
        this.#progInput.addEventListener("input", () => {
          this.#progDragging = true;
          const frac = parseFloat(this.#progInput.value);
          _syncSlider(this.#progWrap, frac, 0, 1);
          const dur = this.#lastAttrs.media_duration ?? 0;
          if (this.#progElapsed) this.#progElapsed.textContent = _fmtTime(frac * dur);
        });
        this.#progInput.addEventListener("change", () => {
          this.#progDragging = false;
          const dur = this.#lastAttrs.media_duration ?? 0;
          const pos = parseFloat(this.#progInput.value) * dur;
          this.config.card?.sendCommand("media_seek", { seek_position: pos });
        });
      }
      if (this.#sourceSelect && this.#sourceMenu) {
        this.#sourceSelect.addEventListener("click", () => {
          _openDropdown(this.#sourceSelect, this.#sourceMenu, this.#lastAttrs.source_list ?? [], this.#lastAttrs.source, (src) => {
            this.config.card?.sendCommand("select_source", { source: src });
          });
        });
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    #updateArt(url) {
      if (!this.#artEl || url === this.#lastArtUrl) return;
      this.#lastArtUrl = url || "";
      if (url) {
        this.#artEl.innerHTML = '<img part="media-art-img" alt="Album art">';
        const img = this.#artEl.querySelector("img");
        img.src = url;
        img.onerror = () => { this.#artEl.innerHTML = ""; this.renderIcon("mdi:music", "media-art"); };
      } else {
        this.#artEl.innerHTML = "";
        this.renderIcon("mdi:music", "media-art");
      }
    }

    #startProgressTimer() {
      this.#stopProgressTimer();
      this.#progTimer = setInterval(() => this.#tickProgress(), 1000);
    }

    #stopProgressTimer() {
      if (this.#progTimer) { clearInterval(this.#progTimer); this.#progTimer = 0; }
    }

    #tickProgress() {
      if (this.#progDragging) return;
      const dur = this.#lastAttrs.media_duration;
      const pos = this.#lastAttrs.media_position;
      const updatedAt = this.#lastAttrs.media_position_updated_at;
      if (dur == null || pos == null || !updatedAt) return;
      const elapsed = pos + (Date.now() - new Date(updatedAt).getTime()) / 1000;
      const clamped = Math.max(0, Math.min(elapsed, dur));
      const frac = dur > 0 ? clamped / dur : 0;
      if (this.#progInput) this.#progInput.value = frac;
      _syncSlider(this.#progWrap, frac, 0, 1);
      if (this.#progElapsed) this.#progElapsed.textContent = _fmtTime(clamped);
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      const isPlaying = state === "playing";
      const isActive = isPlaying || state === "paused";
      const label = this.formatStateLabel(state, "media_player");

      if (this.#titleEl) this.#titleEl.textContent = isActive ? (attributes.media_title ?? "") : "";
      if (this.#artistEl) this.#artistEl.textContent = isActive ? (attributes.media_artist ?? "") : "";
      if (this.#sourceEl) {
        const src = attributes.source || attributes.app_name || "";
        this.#sourceEl.textContent = isActive && src ? src : "";
        this.#sourceEl.style.display = isActive && src ? "" : "none";
      }
      const stateEl = this.root.querySelector("[part=media-state]");
      if (stateEl) stateEl.textContent = isActive ? "" : _capitalize(state);

      if (this.#heroEl) this.#heroEl.hidden = !isActive;
      this.#updateArt(isActive ? (attributes.entity_picture ?? "") : "");

      const dur = attributes.media_duration;
      const pos = attributes.media_position;
      const hasProg = isActive && dur != null && dur > 0 && pos != null;
      const progRow = this.root.querySelector("[part=progress-row]");
      if (progRow) progRow.hidden = !hasProg;
      if (hasProg) {
        if (this.#progDuration) this.#progDuration.textContent = _fmtTime(dur);
        this.#tickProgress();
        if (isPlaying) this.#startProgressTimer(); else this.#stopProgressTimer();
      } else {
        this.#stopProgressTimer();
      }

      if (this.#playBtn) {
        const resolved = this.resolveIcon(isPlaying ? "mdi:pause" : "mdi:play");
        if (resolved) this.renderIcon(resolved, "play-icon");
      }
      if (this.#volSlider && !this.isSliderActive(this.#volSlider)) {
        const vol = attributes.volume_level ?? 0;
        this.#volSlider.value = vol;
        _syncSlider(this.#volWrap, vol, 0, 1);
      }
      if (this.#muteBtn) {
        const muted = attributes.is_volume_muted ?? false;
        this.#muteBtn.setAttribute("aria-pressed", String(muted));
        const resolved = this.resolveIcon(muted ? "mdi:volume-off" : "mdi:volume-high");
        if (resolved) this.renderIcon(resolved, "mute-icon");
      }
      if (this.#sourceSelect) {
        this.#sourceSelect.textContent = attributes.source ?? "-";
        const sourceRow = this.#sourceSelect.closest(".neu-source-row");
        if (sourceRow) sourceRow.style.display = (attributes.source_list?.length) ? "" : "none";
      }
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      const stateLabel = this.root.querySelector("[part=state-label]");
      if (stateLabel) stateLabel.textContent = label;
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(isActive);
      this.announceState(label);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "volume_set") { attrs.volume_level = data?.volume_level; return { state: "playing", attributes: attrs }; }
      if (action === "volume_mute") { attrs.is_volume_muted = data?.is_volume_muted; return { state: "playing", attributes: attrs }; }
      if (action === "select_source") { attrs.source = data?.source; return { state: "playing", attributes: attrs }; }
      return null;
    }
  }


  // =========================================================================
  // LockCard
  // =========================================================================

  class LockCard extends BaseCard {
    #card = null;
    #toggle = null;
    #rowToggle = null;
    #stateLabel = null;
    #currentState = "unknown";

    render() {
      const isWritable = this.def.capabilities === "read-write";
      this.root.innerHTML = /* html */`
        <style>${NEU_BASE}${NEU_TOGGLE_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-toggle" part="row-toggle" type="button" role="switch" aria-pressed="false"></button>`
                : `<span part="row-state"></span>`}
            </span>
          </div>
          <div part="card-body">
            ${isWritable
              ? `<button class="neu-toggle" part="toggle-button" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}" style="align-self:center"></button>`
              : `<div class="neu-value-well"><span part="state-label"></span></div>`}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#toggle = this.root.querySelector("[part=toggle-button]");
      this.#rowToggle = this.root.querySelector("[part=row-toggle]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:lock"), "card-icon");

      const doLock = () => {
        this.config.card?.sendCommand(this.#currentState === "locked" ? "unlock" : "lock", {});
      };
      if (this.#toggle) this._attachGestureHandlers(this.#toggle, { onTap: doLock });
      if (this.#rowToggle) this._attachGestureHandlers(this.#rowToggle, { onTap: doLock });

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state) {
      this.#currentState = state;
      const isLocked = state === "locked";
      const isTransitioning = state === "locking" || state === "unlocking";
      const isJammed = state === "jammed";
      const isUnavailable = state === "unavailable" || state === "unknown";
      const label = this.formatStateLabel(state, "lock");

      if (this.#toggle) {
        this.#toggle.setAttribute("aria-pressed", String(isLocked));
        this.#toggle.disabled = isTransitioning || isJammed || isUnavailable;
      }
      if (this.#rowToggle) {
        this.#rowToggle.setAttribute("aria-pressed", String(isLocked));
        this.#rowToggle.disabled = isTransitioning || isJammed || isUnavailable;
      }
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      if (this.#stateLabel) this.#stateLabel.textContent = label;

      const icon = isJammed ? "mdi:lock-alert" : isLocked ? "mdi:lock" : "mdi:lock-open";
      const resolved = this.resolveIcon(icon);
      if (resolved) this.renderIcon(resolved, "card-icon");
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(isLocked);
      this.announceState(label);
    }

    predictState(action) {
      if (action === "lock") return { state: "locking", attributes: {} };
      if (action === "unlock") return { state: "unlocking", attributes: {} };
      return null;
    }
  }


  // =========================================================================
  // PersonCard
  // =========================================================================

  class PersonCard extends BaseCard {
    static staleOnMount = true;
    #card = null;

    render() {
      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-person-state { text-transform: capitalize; }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="neu-value-well">
              <span part="state-label" class="neu-person-state"></span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:account"), "card-icon");
      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state) {
      const label = state === "home" ? "Home"
        : state === "not_home" ? "Away"
        : _capitalize(state);
      const stateEl = this.root.querySelector("[part=state-label]");
      if (stateEl) stateEl.textContent = label;
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = label;
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(state === "home");
      this.announceState(label);
    }
  }


  // =========================================================================
  // MomentaryCard - round push button, with domain-specific secondary controls
  // Used for: remote, button, automation, script, input_button, harvest_action
  // =========================================================================

  class MomentaryCard extends BaseCard {
    #card = null;

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const domain = this.def.domain;
      const defaultIcon = domain === "remote" ? "mdi:remote"
        : domain === "automation" ? "mdi:robot"
        : domain === "script" ? "mdi:script-text"
        : "mdi:gesture-tap-button";
      const command = domain === "automation" ? "trigger"
        : domain === "script" ? "turn_on"
        : "press";
      const rowLabel = domain === "automation" ? "Run"
        : domain === "script" ? "Run"
        : domain === "remote" ? "Power"
        : "Press";

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_BUTTON_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-row-text-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 8px;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-convex-sm);
            color: var(--hrv-color-text);
            font-family: inherit;
            font-size: 11px;
            font-weight: var(--hrv-font-weight-medium, 500);
            padding: 4px 10px;
            cursor: pointer;
            outline: none;
            transition: box-shadow 0.2s ease, transform 0.15s ease;
            -webkit-tap-highlight-color: transparent;
          }
          .neu-row-text-btn:active:not(:disabled) {
            box-shadow: var(--hrv-ex-neu-concave-sm);
            transform: scale(0.96);
          }
          .neu-row-text-btn:disabled { opacity: 0.4; cursor: default; }
          .neu-aux-control {
            width: 100%;
            margin-top: 10px;
            padding: 8px 12px;
            border: none;
            border-radius: 10px;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-convex-sm);
            color: var(--hrv-color-text);
            font: inherit;
          }
          button.neu-aux-control { cursor: pointer; }
          button.neu-aux-control[aria-pressed="true"] { box-shadow: var(--hrv-ex-neu-concave-sm); }
          .neu-aux-control:disabled { opacity: 0.4; cursor: default; }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-text-btn" part="row-press-btn" type="button" aria-label="${_esc(this.def.friendly_name)}">${rowLabel}</button>${domain === "automation" ? '<button class="neu-row-text-btn" part="row-enable-btn" type="button"></button>' : ""}`
                : `<span part="row-state"></span>`}
            </span>
          </div>
          <div part="card-body">
            ${isWritable
              ? `<button class="neu-btn neu-btn-momentary" part="press-button" type="button" aria-label="${_esc(this.def.friendly_name)}"><span part="press-icon"></span></button>${domain === "automation" ? '<button class="neu-aux-control" part="enable-toggle" type="button"></button>' : ""}${domain === "remote" ? `<select class="neu-aux-control" part="activity-select" aria-label="${_esc(this.def.friendly_name)} activity" hidden></select>` : ""}`
              : `<div class="neu-value-well"><span part="state-label"></span></div>`}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, defaultIcon), "card-icon");

      const pressIcon = this.resolveIcon(this.def.icon, defaultIcon);
      if (pressIcon) {
        this.renderIcon(pressIcon, "press-icon");
      }

      const doPress = () => {
        if (domain === "remote") {
          const tap = this.config.gestureConfig?.tap;
          if (tap) { this._runAction(tap); return; }
          const isOn = pressBtn?.getAttribute("aria-pressed") === "true";
          this.config.card?.sendCommand(isOn ? "turn_off" : "turn_on", {});
        } else {
          this.config.card?.sendCommand(command, {});
        }
      };

      const pressBtn = this.root.querySelector("[part=press-button]");
      const rowBtn = this.root.querySelector("[part=row-press-btn]");
      const enableToggle = this.root.querySelector("[part=enable-toggle]");
      const rowEnableBtn = this.root.querySelector("[part=row-enable-btn]");
      const activitySelect = this.root.querySelector("[part=activity-select]");
      if (pressBtn) { this._attachGestureHandlers(pressBtn, { onTap: doPress }); _wirePress(pressBtn); }
      if (rowBtn) { this._attachGestureHandlers(rowBtn, { onTap: doPress }); _wirePress(rowBtn); }
      const toggleAutomation = () => {
        const isOn = (enableToggle ?? rowEnableBtn)?.getAttribute("aria-pressed") === "true";
        this.config.card?.sendCommand(isOn ? "turn_off" : "turn_on", {});
      };
      if (enableToggle) { this._attachGestureHandlers(enableToggle, { onTap: toggleAutomation }); _wirePress(enableToggle); }
      if (rowEnableBtn) { this._attachGestureHandlers(rowEnableBtn, { onTap: toggleAutomation }); _wirePress(rowEnableBtn); }
      activitySelect?.addEventListener("change", () => {
        if (activitySelect.value) this.config.card?.sendCommand("turn_on", { activity: activitySelect.value });
      });

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      const isUnavailable = state === "unavailable" || state === "unknown";
      const pressBtn = this.root.querySelector("[part=press-button]");
      const rowBtn = this.root.querySelector("[part=row-press-btn]");
      if (pressBtn) pressBtn.disabled = isUnavailable;
      if (rowBtn) rowBtn.disabled = isUnavailable;
      if (this.def.domain === "remote") {
        for (const button of [pressBtn, rowBtn]) {
          if (!button) continue;
          button.setAttribute("aria-pressed", String(state === "on"));
          button.setAttribute("aria-label", `${this.def.friendly_name} - ${state === "on" ? "Turn off" : "Turn on"}`);
        }
        const activitySelect = this.root.querySelector("[part=activity-select]");
        if (activitySelect) {
          const activities = Array.isArray(attributes?.activity_list)
            ? attributes.activity_list.filter(activity => typeof activity === "string")
            : [];
          activitySelect.replaceChildren(...activities.map(activity => {
            const option = document.createElement("option");
            option.value = activity;
            option.textContent = activity;
            return option;
          }));
          activitySelect.hidden = activities.length === 0;
          activitySelect.disabled = isUnavailable;
          if (attributes?.current_activity && activities.includes(attributes.current_activity)) {
            activitySelect.value = attributes.current_activity;
          } else if (activities.length > 0) {
            activitySelect.selectedIndex = -1;
          }
        }
      }
      if (this.def.domain === "automation") {
        for (const button of [
          this.root.querySelector("[part=enable-toggle]"),
          this.root.querySelector("[part=row-enable-btn]"),
        ]) {
          if (!button) continue;
          button.disabled = isUnavailable;
          button.textContent = state === "on" ? "Enabled" : "Disabled";
          button.setAttribute("aria-pressed", String(state === "on"));
          button.setAttribute("aria-label", `${this.def.friendly_name} - ${state === "on" ? "Disable" : "Enable"}`);
        }
      }
      const stateLabel = this.root.querySelector("[part=state-label]");
      const displayState = this.def.domain === "remote" && attributes?.current_activity
        ? attributes.current_activity
        : this.formatStateLabel(state);
      if (stateLabel) stateLabel.textContent = displayState;
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = displayState;

      const iconMap = this.def.icon_state_map;
      if (iconMap) {
        const resolved = this.resolveIcon(iconMap[state] ?? iconMap.default);
        if (resolved) this.renderIcon(resolved, "card-icon");
      }
    }

    predictState(action, data) {
      if (action === "turn_off") return { state: "off", attributes: {} };
      if (action === "turn_on") {
        return {
          state: "on",
          attributes: data?.activity ? { current_activity: data.activity } : {},
        };
      }
      return null;
    }
  }


  // =========================================================================
  // InputNumberCard
  // =========================================================================

  class InputNumberCard extends BaseCard {
    #card = null;
    #slider = null;
    #sliderWrap = null;
    #valueEl = null;
    #stateLabel = null;
    #numberInput = null;
    #lastAttrs = {};
    #sendValue;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendValue = _debounce(this.#doSend.bind(this), 300);
    }

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const fc = this.def.feature_config ?? {};
      const min = fc.min ?? 0;
      const max = fc.max ?? 100;
      const step = fc.step ?? 1;
      const hints = this.config.displayHints ?? {};
      const mode = hints.display_mode ?? this.def.display_hints?.display_mode ?? "slider";
      const unit = this.def.unit_of_measurement ?? "";

      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_SLIDER_CSS}${NEU_BUTTON_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-number-buttons {
            display: flex;
            align-items: center;
            gap: 12px;
            justify-content: center;
          }
          .neu-number-well {
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
            border-radius: var(--hrv-radius-m, 12px);
            min-width: 70px;
            text-align: center;
            padding: 6px 10px;
            font-size: var(--hrv-font-size-l, 18px);
            font-weight: var(--hrv-font-weight-bold, 700);
            color: var(--hrv-color-text);
          }
          .neu-number-well input {
            width: 100%;
            text-align: center;
            border: none;
            background: transparent;
            color: inherit;
            font: inherit;
            outline: none;
            padding: 0;
          }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            ${!isWritable ? `<div class="neu-value-well"><span part="state-label"></span></div>` : mode === "slider" ? /* html */`
              <div>
                <div class="neu-number-well" style="margin-bottom:8px"><span part="slider-value">-</span></div>
                <div class="neu-slider-wrap" data-slider="number">
                  <div class="neu-slider-track"><div class="neu-slider-fill"></div></div>
                  <input part="number-slider" type="range" min="${min}" max="${max}" step="${step}" value="${min}" aria-label="${_esc(this.def.friendly_name)}">
                  <div class="neu-slider-thumb"></div>
                </div>
              </div>
            ` : /* html */`
              <div class="neu-number-buttons">
                <button class="neu-btn neu-btn-circle-sm" part="minus-button" type="button" aria-label="Decrease">-</button>
                <div class="neu-number-well">
                  <input part="number-input" type="number" min="${min}" max="${max}" step="${step}" value="${min}" aria-label="${_esc(this.def.friendly_name)}">
                </div>
                <button class="neu-btn neu-btn-circle-sm" part="plus-button" type="button" aria-label="Increase">+</button>
              </div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#slider = this.root.querySelector("[part=number-slider]");
      this.#sliderWrap = this.root.querySelector("[data-slider=number]");
      this.#valueEl = this.root.querySelector("[part=slider-value]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");
      this.#numberInput = this.root.querySelector("[part=number-input]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:ray-vertex"), "card-icon");

      if (this.#slider) {
        this.#slider.addEventListener("input", () => {
          const val = Number(this.#slider.value);
          _syncSlider(this.#sliderWrap, val, min, max);
          if (this.#valueEl) this.#valueEl.textContent = val + (unit ? " " + unit : "");
          this.#sendValue();
        });
        this.guardSlider(this.#slider, this.#sendValue);
      }
      if (this.#numberInput) this.#numberInput.addEventListener("input", () => this.#sendValue());
      const minusBtn = this.root.querySelector("[part=minus-button]");
      const plusBtn = this.root.querySelector("[part=plus-button]");
      if (minusBtn) { minusBtn.addEventListener("click", () => { if (!this.#numberInput) return; this.#numberInput.value = _clamp(Number(this.#numberInput.value) - step, min, max); this.#sendValue(); }); _wirePress(minusBtn); }
      if (plusBtn) { plusBtn.addEventListener("click", () => { if (!this.#numberInput) return; this.#numberInput.value = _clamp(Number(this.#numberInput.value) + step, min, max); this.#sendValue(); }); _wirePress(plusBtn); }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    #doSend() {
      const val = Number(this.#slider?.value ?? this.#numberInput?.value ?? 0);
      this.config.card?.sendCommand("set_value", { value: val });
    }

    applyState(state, attributes) {
      this.#lastAttrs = attributes;
      const val = Number(state);
      const unit = this.def.unit_of_measurement ?? attributes?.unit_of_measurement ?? "";
      const display = Number.isFinite(val) ? _round2(val) + (unit ? " " + unit : "") : state;
      if (this.#stateLabel) this.#stateLabel.textContent = display;
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = display;
      if (this.#slider && !this.isSliderActive(this.#slider)) {
        this.#slider.value = val;
        const fc = this.def.feature_config ?? {};
        _syncSlider(this.#sliderWrap, val, fc.min ?? 0, fc.max ?? 100);
        if (this.#valueEl) this.#valueEl.textContent = display;
      }
      if (this.#numberInput && !this.isFocused(this.#numberInput)) {
        this.#numberInput.value = Number.isFinite(val) ? val : "";
      }
      this.announceState(display);
    }

    predictState(action, data) {
      if (action === "set_value" && data?.value !== undefined) return { state: String(data.value), attributes: { ...this.#lastAttrs } };
      return null;
    }
  }


  // =========================================================================
  // InputSelectCard
  // =========================================================================

  class InputSelectCard extends BaseCard {
    #card = null;
    #pillsContainer = null;
    #dropdownTrigger = null;
    #dropdownMenu = null;
    #stateLabel = null;
    #currentValue = "";
    #options = [];

    render() {
      const isWritable = this.def.capabilities === "read-write";
      const hints = this.config.displayHints ?? {};
      const mode = hints.display_mode ?? this.def.display_hints?.display_mode ?? "pills";

      this.root.innerHTML = /* html */`
        <style>${NEU_BASE}${NEU_SELECT_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            ${!isWritable ? `<div class="neu-value-well"><span part="state-label"></span></div>` : mode === "pills"
              ? `<div class="neu-pills" part="option-grid"></div>`
              : `<button class="neu-dropdown-trigger" part="option-trigger" type="button" data-expanded="false">-</button><div class="neu-dropdown-menu" part="option-menu" popover="manual"></div>`
            }
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#pillsContainer = this.root.querySelector("[part=option-grid]");
      this.#dropdownTrigger = this.root.querySelector("[part=option-trigger]");
      this.#dropdownMenu = this.root.querySelector("[part=option-menu]");
      this.#stateLabel = this.root.querySelector("[part=state-label]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:form-select"), "card-icon");

      if (this.#dropdownTrigger && this.#dropdownMenu) {
        this.#dropdownTrigger.addEventListener("click", () => {
          _openDropdown(this.#dropdownTrigger, this.#dropdownMenu, this.#options, this.#currentValue, (opt) => {
            this.config.card?.sendCommand("select_option", { option: opt });
          });
        });
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      this.#currentValue = state;
      this.#options = attributes?.options ?? this.def.feature_config?.options ?? [];
      const label = _capitalize(state);
      if (this.#stateLabel) this.#stateLabel.textContent = label;
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = label;

      if (this.#pillsContainer) {
        this.#pillsContainer.innerHTML = "";
        for (const opt of this.#options) {
          const btn = document.createElement("button");
          btn.className = "neu-pill";
          btn.type = "button";
          btn.role = "option";
          btn.textContent = _capitalize(opt);
          btn.setAttribute("aria-selected", String(opt === state));
          if (opt === state) btn.classList.add("is-active");
          btn.addEventListener("click", () => this.config.card?.sendCommand("select_option", { option: opt }));
          this.#pillsContainer.appendChild(btn);
        }
      }
      if (this.#dropdownTrigger) this.#dropdownTrigger.textContent = label;
      this.announceState(label);
    }
  }


  // =========================================================================
  // TimerCard
  // =========================================================================

  class TimerCard extends BaseCard {
    #card = null;
    #countdownEl = null;
    #startBtn = null;
    #cancelBtn = null;
    #tickInterval = null;
    #finishesAt = null;
    #duration = 0;

    render() {
      const isWritable = this.def.capabilities === "read-write";
      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_BUTTON_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}
          .neu-timer-display { font-size: 2rem; font-weight: var(--hrv-font-weight-bold, 700); font-variant-numeric: tabular-nums; text-align: center; line-height: 1; }
          .neu-timer-actions { display: flex; gap: 8px; }
          .neu-timer-actions .neu-btn { flex: 1; }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="neu-value-well"><span class="neu-timer-display" part="timer-display">0:00</span></div>
            ${isWritable ? `<div class="neu-timer-actions"><button class="neu-btn" part="start-button" type="button">Start</button><button class="neu-btn" part="cancel-button" type="button">Cancel</button></div>` : ""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#countdownEl = this.root.querySelector("[part=timer-display]");
      this.#startBtn = this.root.querySelector("[part=start-button]");
      this.#cancelBtn = this.root.querySelector("[part=cancel-button]");

      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:timer-outline"), "card-icon");

      if (this.#startBtn) { this.#startBtn.addEventListener("click", () => this.config.card?.sendCommand(this.#finishesAt ? "pause" : "start", {})); _wirePress(this.#startBtn); }
      if (this.#cancelBtn) { this.#cancelBtn.addEventListener("click", () => this.config.card?.sendCommand("cancel", {})); _wirePress(this.#cancelBtn); }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state, attributes) {
      this.#duration = this.#parseDuration(attributes.duration ?? "0:00:00");
      this.#finishesAt = attributes.finishes_at ? new Date(attributes.finishes_at) : null;
      if (this.#tickInterval) { clearInterval(this.#tickInterval); this.#tickInterval = null; }
      if (state === "active" && this.#finishesAt) { this.#tick(); this.#tickInterval = setInterval(() => this.#tick(), 1000); }
      else if (state === "paused") { this.#showTime(attributes.remaining ? this.#parseDuration(attributes.remaining) : this.#duration); }
      else { this.#showTime(this.#duration); }
      if (this.#startBtn) { this.#startBtn.textContent = state === "active" ? "Pause" : "Start"; this.#startBtn.disabled = state === "unavailable"; }
      if (this.#cancelBtn) this.#cancelBtn.disabled = state === "idle" || state === "unavailable";
      const rowVal = this.root.querySelector("[part=row-value]");
      if (rowVal) rowVal.textContent = _capitalize(state);
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(state === "active");
      this.announceState(_capitalize(state));
    }

    #tick() {
      if (!this.#finishesAt) return;
      const remaining = Math.max(0, Math.round((this.#finishesAt.getTime() - Date.now()) / 1000));
      this.#showTime(remaining);
      if (remaining <= 0 && this.#tickInterval) { clearInterval(this.#tickInterval); this.#tickInterval = null; }
    }

    #showTime(seconds) {
      if (!this.#countdownEl) return;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      this.#countdownEl.textContent = h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
    }

    #parseDuration(str) {
      const parts = String(str).split(":").map(Number);
      if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
      if (parts.length === 2) return (parts[0] * 60) + parts[1];
      return parts[0] || 0;
    }
  }


  // =========================================================================
  // WeatherCard - clean redesign
  // =========================================================================

  const WEATHER_ICON_NAMES = {
    "clear-night": "mdi:weather-night", "cloudy": "mdi:weather-cloudy",
    "fog": "mdi:weather-fog", "hail": "mdi:weather-hail",
    "lightning": "mdi:weather-lightning", "lightning-rainy": "mdi:weather-lightning-rainy",
    "partlycloudy": "mdi:weather-partly-cloudy", "pouring": "mdi:weather-pouring",
    "rainy": "mdi:weather-rainy", "snowy": "mdi:weather-snowy",
    "snowy-rainy": "mdi:weather-snowy-rainy", "sunny": "mdi:weather-sunny",
    "windy": "mdi:weather-windy", "windy-variant": "mdi:weather-windy-variant",
    "exceptional": "mdi:alert-circle-outline",
  };

  const _W_PATHS = {
    "sunny":           "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
    "clear-night":     "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
    "partlycloudy":    "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",
    "cloudy":          "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
    "fog":             "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",
    "rainy":           "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",
    "pouring":         "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",
    "snowy":           "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",
    "snowy-rainy":     "M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",
    "hail":            "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",
    "lightning":       "M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",
    "lightning-rainy": "M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",
    "windy":           "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
    "windy-variant":   "M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
    "exceptional":     "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  };
  const _W_DEFAULT = _W_PATHS["cloudy"];

  function _condSvg(condition, size) {
    const d = _W_PATHS[condition] ?? _W_DEFAULT;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true" focusable="false"><path d="' + d + '" fill="currentColor"/></svg>';
  }

  class WeatherCard extends BaseCard {
    static staleOnMount = true;
    #card = null;
    #forecastEl = null;
    #scrollTrackEl = null;
    #scrollThumbEl = null;
    #dragCleanup = null;
    get #forecastMode() { return this.config._forecastMode ?? "daily"; }
    set #forecastMode(v) { this.config._forecastMode = v; }
    #forecastDaily = null;
    #forecastHourly = null;

    render() {
      this.root.innerHTML = /* html */`
        <style>
          ${NEU_BASE}${NEU_BUTTON_CSS}${NEU_COMPANION_CSS}
          .neu-w-main {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .neu-w-icon {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
            flex-shrink: 0;
          }
          .neu-w-icon svg {
            width: 28px;
            height: 28px;
            fill: var(--hrv-color-text);
          }
          .neu-w-temp {
            font-size: 2rem;
            font-weight: var(--hrv-font-weight-bold, 700);
            line-height: 1;
          }
          .neu-w-cond {
            font-size: var(--hrv-font-size-s, 13px);
            color: var(--hrv-color-text-secondary);
            text-transform: capitalize;
            margin-top: 2px;
          }
          .neu-w-stats {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .neu-w-stat {
            padding: 6px 10px;
            border-radius: 10px;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
            font-size: var(--hrv-font-size-xs, 11px);
            color: var(--hrv-color-text-secondary);
            white-space: nowrap;
          }
          .neu-w-forecast {
            width: 100%;
          }
          .neu-w-forecast:empty { display: none; }
          .neu-w-forecast[data-mode=daily] {
            display: flex;
            justify-content: space-between;
            gap: 6px;
          }
          .neu-w-forecast[data-mode=daily] .neu-w-fday {
            flex: 1;
            min-width: 0;
          }
          .neu-w-forecast[data-mode=hourly] {
            display: flex;
            gap: 8px;
            padding: 6px;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            user-select: none;
            -webkit-user-select: none;
            touch-action: pan-x;
            cursor: grab;
            border-radius: var(--hrv-radius-m, 12px);
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
          }
          .neu-w-forecast[data-mode=hourly]:active { cursor: grabbing; }
          .neu-w-forecast[data-mode=hourly]::-webkit-scrollbar { display: none; }
          .neu-w-forecast[data-mode=hourly][data-dragging] .neu-w-fday { pointer-events: none; }
          .neu-w-fday {
            flex: 0 0 auto;
            padding: 8px 8px;
            border-radius: 12px;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-convex-sm);
            text-align: center;
            font-size: var(--hrv-font-size-xs, 11px);
            min-width: 48px;
          }
          .neu-w-fday svg {
            width: 18px;
            height: 18px;
            fill: var(--hrv-color-text-secondary);
            display: block;
            margin: 3px auto;
          }
          .neu-w-fhi { font-weight: var(--hrv-font-weight-medium, 500); }
          .neu-w-flo { color: var(--hrv-color-text-secondary); }
          .neu-w-scroll-track {
            width: 100%;
            height: 4px;
            border-radius: 4px;
            background: var(--hrv-ex-neu-bg);
            box-shadow: var(--hrv-ex-neu-concave-sm);
            position: relative;
            cursor: pointer;
          }
          .neu-w-scroll-track[hidden] { display: none; }
          .neu-w-scroll-thumb {
            position: absolute;
            top: 0;
            height: 100%;
            border-radius: 4px;
            background: var(--hrv-color-text-secondary);
            opacity: 0.5;
            transition: left 80ms linear;
            cursor: grab;
            user-select: none;
          }
          .neu-w-scroll-thumb:active { cursor: grabbing; }
        </style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="neu-w-main">
              <div class="neu-w-icon" part="weather-icon"></div>
              <div>
                <div class="neu-w-temp" part="weather-temp">-</div>
                <div class="neu-w-cond" part="weather-condition">-</div>
              </div>
            </div>
            <div class="neu-w-stats" part="weather-details"></div>
            <div class="neu-w-forecast" data-mode="daily"></div>
            <div class="neu-w-scroll-track" hidden><div class="neu-w-scroll-thumb"></div></div>
            <button class="neu-btn" part="forecast-toggle" type="button" style="align-self:center;display:none">Hourly</button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#forecastEl = this.root.querySelector(".neu-w-forecast");
      this.#scrollTrackEl = this.root.querySelector(".neu-w-scroll-track");
      this.#scrollThumbEl = this.root.querySelector(".neu-w-scroll-thumb");
      _applyHeaderHints(this.#card, this.config, this.def);

      const toggleBtn = this.root.querySelector("[part=forecast-toggle]");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          this.#forecastMode = this.#forecastMode === "daily" ? "hourly" : "daily";
          toggleBtn.textContent = this.#forecastMode === "daily" ? "Hourly" : "5-Day";
          this.#renderForecast();
        });
        _wirePress(toggleBtn);
      }

      if (this.#forecastEl) {
        this.#forecastEl.addEventListener("scroll", () => this.#syncScrollThumb(), { passive: true });
        this.#installDragScroll(this.#forecastEl);
      }
      if (this.#scrollTrackEl) {
        this.#scrollTrackEl.addEventListener("pointerdown", (e) => this.#onTrackPointerDown(e));
      }

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    destroy() {
      this.#dragCleanup?.();
      this.#dragCleanup = null;
    }

    #installDragScroll(strip) {
      const SAMPLE_WINDOW = 80;
      const VELOCITY_BOOST = 1.6;
      const DECAY = 0.96;
      const MIN_VEL = 0.04;

      let pointerId = null;
      let startX = 0;
      let startScroll = 0;
      let velocity = 0;
      let moved = false;
      let momentumRaf = 0;
      const samples = [];

      const stopMomentum = () => {
        if (momentumRaf) { cancelAnimationFrame(momentumRaf); momentumRaf = 0; }
      };

      const computeReleaseVelocity = (now) => {
        while (samples.length && samples[0].t < now - SAMPLE_WINDOW) samples.shift();
        if (samples.length < 2) return 0;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = last.t - first.t;
        if (dt <= 0) return 0;
        return (last.x - first.x) / dt;
      };

      const startMomentum = () => {
        if (Math.abs(velocity) < MIN_VEL) return;
        let prev = performance.now();
        const tick = (now) => {
          const dt = now - prev; prev = now;
          strip.scrollLeft -= velocity * dt;
          velocity *= Math.pow(DECAY, dt / 16);
          if (Math.abs(velocity) < MIN_VEL) { momentumRaf = 0; velocity = 0; return; }
          const max = strip.scrollWidth - strip.clientWidth;
          if (strip.scrollLeft <= 0 || strip.scrollLeft >= max) { momentumRaf = 0; velocity = 0; return; }
          momentumRaf = requestAnimationFrame(tick);
        };
        momentumRaf = requestAnimationFrame(tick);
      };

      const onDown = (e) => {
        if (strip.scrollWidth <= strip.clientWidth) return;
        if (e.pointerType === "touch") return;
        const t = e.target;
        if (t && t !== strip && t.closest?.("button, a")) return;
        stopMomentum();
        pointerId = e.pointerId;
        startX = e.clientX;
        startScroll = strip.scrollLeft;
        velocity = 0;
        moved = false;
        samples.length = 0;
        samples.push({ x: e.clientX, t: e.timeStamp });
        try { strip.setPointerCapture(pointerId); } catch { /* ignore */ }
      };
      const onMove = (e) => {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) { moved = true; strip.dataset.dragging = "true"; }
        strip.scrollLeft = startScroll - dx;
        samples.push({ x: e.clientX, t: e.timeStamp });
        const cutoff = e.timeStamp - SAMPLE_WINDOW;
        while (samples.length > 2 && samples[0].t < cutoff) samples.shift();
      };
      const onUp = (e) => {
        if (e.pointerId !== pointerId) return;
        try { strip.releasePointerCapture(pointerId); } catch { /* ignore */ }
        pointerId = null;
        if (moved) {
          const click = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
          window.addEventListener("click", click, { capture: true, once: true });
          requestAnimationFrame(() => strip.removeAttribute("data-dragging"));
          velocity = computeReleaseVelocity(e.timeStamp) * VELOCITY_BOOST;
          startMomentum();
        }
        samples.length = 0;
      };
      strip.addEventListener("pointerdown", onDown);
      strip.addEventListener("pointermove", onMove);
      strip.addEventListener("pointerup", onUp);
      strip.addEventListener("pointercancel", onUp);
      strip.addEventListener("wheel", stopMomentum, { passive: true });
      strip.addEventListener("touchstart", stopMomentum, { passive: true });

      this.#dragCleanup = () => {
        stopMomentum();
        strip.removeEventListener("pointerdown", onDown);
        strip.removeEventListener("pointermove", onMove);
        strip.removeEventListener("pointerup", onUp);
        strip.removeEventListener("pointercancel", onUp);
        strip.removeEventListener("wheel", stopMomentum);
        strip.removeEventListener("touchstart", stopMomentum);
      };
    }

    #syncScrollThumb() {
      const strip = this.#forecastEl;
      const track = this.#scrollTrackEl;
      const thumb = this.#scrollThumbEl;
      if (!strip || !track || !thumb) return;
      const ratio = strip.scrollWidth > strip.clientWidth
        ? strip.clientWidth / strip.scrollWidth
        : 1;
      if (ratio >= 1) { track.hidden = true; return; }
      track.hidden = false;
      const trackW = track.clientWidth;
      const thumbW = Math.max(24, ratio * trackW);
      const maxLeft = trackW - thumbW;
      const scrollRatio = strip.scrollLeft / (strip.scrollWidth - strip.clientWidth);
      thumb.style.width = `${thumbW}px`;
      thumb.style.left = `${scrollRatio * maxLeft}px`;
    }

    #onTrackPointerDown(e) {
      const strip = this.#forecastEl;
      const track = this.#scrollTrackEl;
      const thumb = this.#scrollThumbEl;
      if (!strip || !track || !thumb) return;
      e.preventDefault();
      const trackRect = track.getBoundingClientRect();
      const thumbW = parseFloat(thumb.style.width) || 24;

      const scrollTo = (clientX) => {
        const relX = clientX - trackRect.left - thumbW / 2;
        const maxLeft = trackRect.width - thumbW;
        const ratio = Math.max(0, Math.min(1, relX / maxLeft));
        strip.scrollLeft = ratio * (strip.scrollWidth - strip.clientWidth);
      };

      scrollTo(e.clientX);

      const onMove = (ev) => scrollTo(ev.clientX);
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    }

    #renderForecast() {
      const strip = this.#forecastEl;
      if (!strip) return;
      const data = this.#forecastMode === "hourly" ? this.#forecastHourly : this.#forecastDaily;
      strip.setAttribute("data-mode", this.#forecastMode);
      if (!Array.isArray(data) || data.length === 0) {
        strip.innerHTML = "";
        if (this.#scrollTrackEl) this.#scrollTrackEl.hidden = true;
        return;
      }
      const items = this.#forecastMode === "daily" ? data.slice(0, 5) : data.slice(0, 24);
      strip.innerHTML = items.map(day => {
        const svg = _condSvg(day.condition || "cloudy", 18);
        let label;
        if (this.#forecastMode === "hourly") {
          label = day.datetime ? new Date(day.datetime).toLocaleTimeString([], { hour: "numeric" }) : "";
        } else {
          label = day.datetime ? new Date(day.datetime).toLocaleDateString(undefined, { weekday: "short" }) : "";
        }
        const hi = (day.temperature ?? day.native_temperature) != null ? Math.round(Number(day.temperature ?? day.native_temperature)) + "°" : "";
        const lo = (day.templow ?? day.native_templow) != null ? Math.round(Number(day.templow ?? day.native_templow)) + "°" : "";
        return `<div class="neu-w-fday"><div>${_esc(label)}</div>${svg}<div class="neu-w-fhi">${_esc(hi)}</div>${lo ? `<div class="neu-w-flo">${_esc(lo)}</div>` : ""}</div>`;
      }).join("");
      requestAnimationFrame(() => this.#syncScrollThumb());
    }

    applyState(state, attributes) {
      const temp = attributes.temperature ?? attributes.native_temperature;
      let unit = String(attributes.temperature_unit ?? attributes.native_temperature_unit ?? this.def.unit_of_measurement ?? "").trim();
      if (unit && !/^°/.test(unit) && unit.length <= 2) unit = "°" + unit;

      const tempEl = this.root.querySelector("[part=weather-temp]");
      if (tempEl) tempEl.textContent = temp != null ? Math.round(Number(temp)) + unit : "-";

      const condition = state || "cloudy";
      const condEl = this.root.querySelector("[part=weather-condition]");
      if (condEl) condEl.textContent = _capitalize(condition.replace(/-/g, " "));

      const iconEl = this.root.querySelector("[part=weather-icon]");
      if (iconEl) {
        iconEl.innerHTML = _condSvg(condition, 28);
      }

      const detailsEl = this.root.querySelector("[part=weather-details]");
      if (detailsEl) {
        const stats = [];
        if (attributes.humidity != null) stats.push("Humidity " + attributes.humidity + "%");
        if (attributes.wind_speed != null) stats.push("Wind " + attributes.wind_speed + " " + (attributes.wind_speed_unit ?? ""));
        if (attributes.pressure != null) stats.push(attributes.pressure + " " + (attributes.pressure_unit ?? ""));
        detailsEl.innerHTML = stats.map(s => `<span class="neu-w-stat">${_esc(s.trim())}</span>`).join("");
      }

      const show = (this.config.displayHints ?? this.def.display_hints ?? {}).show_forecast === true;
      this.#forecastDaily = show ? (attributes.forecast_daily ?? attributes.forecast ?? null) : null;
      this.#forecastHourly = show ? (attributes.forecast_hourly ?? null) : null;
      const hasDaily = Array.isArray(this.#forecastDaily) && this.#forecastDaily.length > 0;
      const hasHourly = Array.isArray(this.#forecastHourly) && this.#forecastHourly.length > 0;

      const toggleBtn = this.root.querySelector("[part=forecast-toggle]");
      if (hasDaily && hasHourly && toggleBtn) {
        toggleBtn.style.display = "";
        toggleBtn.textContent = this.#forecastMode === "daily" ? "Hourly" : "5-Day";
      } else if (toggleBtn) {
        toggleBtn.style.display = "none";
        if (hasDaily) this.#forecastMode = "daily";
        else if (hasHourly) this.#forecastMode = "hourly";
      }

      if (this.#forecastMode === "hourly" && !hasHourly && hasDaily) this.#forecastMode = "daily";
      if (this.#forecastMode === "daily" && !hasDaily && hasHourly) this.#forecastMode = "hourly";

      this.#renderForecast();
      this.announceState(`${_capitalize(condition.replace(/-/g, " "))} ${temp != null ? Math.round(Number(temp)) + unit : ""}`);
    }
  }


  // =========================================================================
  // GenericCard - fallback
  // =========================================================================

  class GenericCard extends BaseCard {
    #card = null;
    #toggle = null;
    #isOn = false;

    render() {
      const isWritable = this.def.capabilities === "read-write";
      this.root.innerHTML = /* html */`
        <style>${NEU_BASE}${NEU_TOGGLE_CSS}${NEU_ROW_CSS}${NEU_COMPANION_CSS}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-icon" aria-hidden="true"></span>
            <span part="card-name">${_esc(this.def.friendly_name)}</span>
            <span part="row-control">
              ${isWritable
                ? `<button class="neu-row-toggle" part="row-toggle" type="button" role="switch" aria-pressed="false"></button>`
                : `<span part="row-state"></span>`}
            </span>
          </div>
          <div part="card-body">
            ${isWritable
              ? `<button class="neu-toggle" part="toggle-button" type="button" role="switch" aria-pressed="false" aria-label="${_esc(this.def.friendly_name)}" style="align-self:center"></button>`
              : `<div class="neu-value-well"><span part="state-label"></span></div>`}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#card = this.root.querySelector("[part=card]");
      this.#toggle = this.root.querySelector("[part=toggle-button]");
      _applyHeaderHints(this.#card, this.config, this.def);
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:help-circle"), "card-icon");

      const doToggle = () => this.config.card?.sendCommand(this.#isOn ? "turn_off" : "turn_on", {});
      if (this.#toggle) this._attachGestureHandlers(this.#toggle, { onTap: doToggle });
      const rowToggle = this.root.querySelector("[part=row-toggle]");
      if (rowToggle) this._attachGestureHandlers(rowToggle, { onTap: doToggle });

      this.renderCompanions();
      this._attachGestureHandlers(this.#card);
      this.finalizeRender();
    }

    applyState(state) {
      this.#isOn = state === "on";
      const label = this.formatStateLabel(state);
      if (this.#toggle) this.#toggle.setAttribute("aria-pressed", String(this.#isOn));
      const rowToggle = this.root.querySelector("[part=row-toggle]");
      if (rowToggle) rowToggle.setAttribute("aria-pressed", String(this.#isOn));
      const rowState = this.root.querySelector("[part=row-state]");
      if (rowState) rowState.textContent = label;
      const stateLabel = this.root.querySelector("[part=state-label]");
      if (stateLabel) stateLabel.textContent = label;
      const iconEl = this.root.querySelector("[part=card-icon]");
      if (iconEl) iconEl.dataset.on = String(this.#isOn);
      this.announceState(label);
    }

    predictState(action) {
      if (action === "turn_on") return { state: "on", attributes: {} };
      if (action === "turn_off") return { state: "off", attributes: {} };
      return null;
    }
  }


  // =========================================================================
  // BadgeCard
  // =========================================================================

  const INFORMATIONAL_DOMAINS = new Set([
    "sensor", "binary_sensor", "input_select", "select", "input_number",
    "weather", "person", "timer",
  ]);

  class BadgeCard extends BaseCard {
    static staleOnMount = true;
    #badge = null;

    render() {
      const hints = this.config.displayHints ?? this.def.display_hints ?? {};
      const showIcon = hints.badge_show_icon !== false;
      const showName = hints.badge_show_name !== false;
      const showState = hints.badge_show_state !== false;
      const singleLine = (showName && !showState) || (!showName && showState);

      this.root.innerHTML = /* html */`
        <style>
          :host {
            width: auto !important;
            min-width: unset !important;
            display: inline-flex !important;
            contain: none !important;
            vertical-align: top !important;
            overflow: visible !important;
            line-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          *, *::before, *::after { box-sizing: border-box; }
          [part=badge] {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px 6px 8px;
            border-radius: 14px;
            background: var(--hrv-ex-neu-bg, var(--hrv-card-background));
            box-shadow: var(--hrv-ex-neu-convex-sm);
            font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
            color: var(--hrv-color-text, #374151);
            white-space: nowrap;
            overflow: hidden;
            cursor: default;
            transition: box-shadow 0.2s ease;
          }
          [part=badge][data-active="true"] { color: var(--hrv-color-text); }
          [part=badge][data-border="outer"] { box-shadow: var(--hrv-ex-neu-convex-sm); }
          [part=badge][data-border="inner"] { box-shadow: var(--hrv-ex-neu-concave-sm); }
          [part=badge][data-border="none"] { box-shadow: none; }
          [part=badge-icon] {
            width: 26px;
            height: 26px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--hrv-ex-neu-bg, var(--hrv-card-background));
            box-shadow: var(--hrv-ex-neu-concave-sm);
            transition: color 0.2s ease;
          }
          [part=badge-icon] svg { width: 14px; height: 14px; fill: currentColor; }
          [part=badge-text] {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
          }
          [part=badge-text].single [part=badge-name],
          [part=badge-text].single [part=badge-state] { font-size: 12px; }
          [part=badge-name] {
            font-size: 11px;
            font-weight: var(--hrv-font-weight-medium, 500);
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 140px;
          }
          [part=badge-state] {
            font-size: 10px;
            line-height: 1.3;
            color: var(--hrv-color-text-secondary);
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 140px;
          }
          .sr-only {
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
          }
          @media (prefers-reduced-motion: reduce) {
            [part=badge], [part=badge-icon] { transition: none; }
          }
        </style>
        <div part="badge" aria-label="${_esc(this.def.friendly_name)}" title="${_esc(this.def.friendly_name)}">
          ${showIcon ? '<span part="badge-icon" aria-hidden="true"></span>' : ""}
          <span part="badge-text" class="${singleLine ? "single" : ""}">
            <span part="badge-name" class="${showName ? "" : "sr-only"}">${_esc(this.def.friendly_name)}</span>
            <span part="badge-state" class="${showState ? "" : "sr-only"}" aria-live="polite">-</span>
          </span>
        </div>
        ${this.renderAriaLiveHTML()}
      `;

      this.#badge = this.root.querySelector("[part=badge]");
      if (this.#badge) this.#badge.dataset.border = hints.widget_border ?? "outer";
      const domainIcons = { sensor: "mdi:gauge", binary_sensor: "mdi:radiobox-blank", switch: "mdi:toggle-switch", light: "mdi:lightbulb", fan: "mdi:fan", climate: "mdi:thermostat", cover: "mdi:window-shutter", lock: "mdi:lock", person: "mdi:account", automation: "mdi:robot", timer: "mdi:timer-outline", weather: "mdi:weather-cloudy", media_player: "mdi:cast" };
      if (showIcon) {
        this.renderIcon(this.resolveIcon(this.def.icon, domainIcons[this.def.domain] ?? "mdi:help-circle"), "badge-icon");
      }
    }

    applyState(state, attributes) {
      const stateEl = this.root.querySelector("[part=badge-state]");
      if (stateEl) {
        const uom = attributes?.unit_of_measurement ?? this.def.unit_of_measurement ?? "";
        const label = this.formatStateLabel(state);
        stateEl.textContent = uom ? label + " " + uom : label;
      }
      if (this.#badge) {
        const isInformational = INFORMATIONAL_DOMAINS.has(this.def.domain);
        const isUnavailable = state === "unavailable" || state === "unknown";
        const active = !isUnavailable
          && (isInformational || (state !== "off" && state !== "idle" && state !== "closed" && state !== "locked"));
        this.#badge.dataset.active = String(active);
        this.#badge.title = this.def.friendly_name + ": " + (stateEl ? stateEl.textContent : state);
      }
      const iconMap = this.def.icon_state_map;
      if (iconMap) {
        const resolved = this.resolveIcon(iconMap[state] ?? iconMap.default);
        if (resolved) this.renderIcon(resolved, "badge-icon");
      }
      this.announceState(this.def.friendly_name + ", " + state);
    }
  }


  // =========================================================================
  // Registration
  // =========================================================================

  HArvest._renderers = HArvest._renderers || {};
  const _rendererKey =
    (document.currentScript && document.currentScript.dataset.rendererId)
    || "neu";

  HArvest._renderers[_rendererKey] = {
    "light":          LightCard,
    "switch":         SwitchCard,
    "input_boolean":  SwitchCard,
    "fan":            FanCard,
    "climate":        ClimateCard,
    "cover":          CoverCard,
    "media_player":   MediaPlayerCard,
    "lock":           LockCard,
    "binary_sensor":  BinarySensorCard,
    "sensor":         SensorCard,
    "input_number":   InputNumberCard,
    "number":         InputNumberCard,
    "input_select":   InputSelectCard,
    "select":         InputSelectCard,
    "timer":          TimerCard,
    "weather":        WeatherCard,
    "person":         PersonCard,
    "remote":         MomentaryCard,
    "button":         MomentaryCard,
    "input_button":   MomentaryCard,
    "script":         MomentaryCard,
    "automation":     MomentaryCard,
    "harvest_action": MomentaryCard,
    "event":          GenericCard,
    "device_tracker": PersonCard,
    "generic":        GenericCard,
    "badge":          BadgeCard,
  };

})();
