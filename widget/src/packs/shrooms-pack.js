/**
 * shrooms-pack.js - HArvest Shrooms renderer pack.
 *
 * Inspired by Mushroom Cards by Paul Bottein. Horizontal state-item layout,
 * circular colored icon shapes, pill-shaped sliders, collapsible controls.
 *
 * Loaded at runtime via script injection; references window.HArvest globals.
 */
(function () {
  "use strict";

  const _SHROOMS_VERSION = "1.0.0";
  console.info("[HArvest Shrooms] Loading pack v" + _SHROOMS_VERSION);

  const HArvest = window.HArvest;
  if (!HArvest || !HArvest.renderers || !HArvest.renderers.BaseCard) {
    console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");
    return;
  }

  const BaseCard = HArvest.renderers.BaseCard;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function _esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function _debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { timer = null; fn.apply(this, args); }, ms);
    };
  }

  function _capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "";
  }

  function _clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function _setControlsCollapsed(root, collapsed) {
    const shell = root.querySelector(".shroom-controls-shell");
    if (shell) shell.setAttribute("data-collapsed", String(collapsed));
  }

  function _makeAccessibleButton(el, label) {
    if (!el) return;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", label);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  }

  function _applyCompanionTooltips(root) {
    root.querySelectorAll("[part=companion]").forEach((el) => {
      el.title = el.getAttribute("aria-label") ?? "Companion";
    });
  }

  // ---------------------------------------------------------------------------
  // Domain accent colors
  // ---------------------------------------------------------------------------

  const _DOMAIN_ACCENT = {
    light:          "var(--hrv-ex-shroom-light, #ff9800)",
    switch:         "var(--hrv-ex-shroom-switch, #2196f3)",
    input_boolean:  "var(--hrv-ex-shroom-switch, #2196f3)",
    fan:            "var(--hrv-ex-shroom-fan, #4caf50)",
    climate:        "var(--hrv-ex-shroom-climate, #ff5722)",
    cover:          "var(--hrv-ex-shroom-cover, #9c27b0)",
    media_player:   "var(--hrv-ex-shroom-media, #e91e63)",
    sensor:         "var(--hrv-ex-shroom-sensor, #03a9f4)",
    binary_sensor:  "var(--hrv-ex-shroom-binary, #8bc34a)",
    input_number:   "var(--hrv-ex-shroom-input, #00bcd4)",
    input_select:   "var(--hrv-ex-shroom-input, #00bcd4)",
    timer:          "var(--hrv-ex-shroom-timer, #673ab7)",
    remote:         "var(--hrv-ex-shroom-remote, #607d8b)",
    weather:        "var(--hrv-ex-shroom-weather, #ff9800)",
    harvest_action: "var(--hrv-ex-shroom-action, #9c27b0)",
  };

  function _accentFor(domain) {
    return _DOMAIN_ACCENT[domain] ?? "var(--hrv-color-primary, #ff9800)";
  }

  function _applyIconColor(iconEl, domain, isOn) {
    if (!iconEl) return;
    const accent = _accentFor(domain);
    if (isOn) {
      iconEl.style.background = `color-mix(in srgb, ${accent} 20%, transparent)`;
      iconEl.style.color = accent;
    } else {
      iconEl.style.background = "var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))";
      iconEl.style.color = "var(--hrv-color-icon, #757575)";
    }
  }

  function _applyLayout(card) {
    const layout = (card.config.displayHints ?? card.def.display_hints ?? {}).layout ?? null;
    const host = card.root.host;
    if (host) {
      if (layout === "vertical") host.setAttribute("data-layout", "vertical");
      else host.removeAttribute("data-layout");
    }
  }

  function _lightAccent(state, attrs) {
    if (state !== "on") return null;
    if (attrs.rgb_color) {
      const [r, g, b] = attrs.rgb_color;
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (lum > 0.85) return `rgb(${Math.round(r * 0.8)}, ${Math.round(g * 0.8)}, ${Math.round(b * 0.75)})`;
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (attrs.hs_color) {
      return `hsl(${attrs.hs_color[0]}, ${Math.max(attrs.hs_color[1], 50)}%, 55%)`;
    }
    const kelvin = attrs.color_temp_kelvin ?? (attrs.color_temp ? Math.round(1000000 / attrs.color_temp) : null);
    if (kelvin) {
      if (kelvin >= 5200) return "#4ba3e0";
      if (kelvin >= 4500) return "#e0c85a";
      if (kelvin <= 3000) return "#e6a040";
      return "#ddb840";
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Shared CSS - Mushroom state-item row
  // ---------------------------------------------------------------------------

  const SHROOM_STATE_ITEM = /* css */`
    [data-gesture-hold=pending]::before {
      animation: none !important;
      opacity: 0 !important;
    }
    .shroom-state-item {
      display: flex;
      align-items: center;
      gap: var(--hrv-ex-shroom-spacing, 12px);
      cursor: default;
    }
    .shroom-state-item[data-tappable=true] {
      cursor: pointer;
    }
    .shroom-state-item[role=button]:focus-visible {
      outline: 2px solid var(--hrv-color-primary, #6366f1);
      outline-offset: 2px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
    }

    .shroom-icon-shape {
      width: var(--hrv-ex-shroom-icon-size, 42px);
      height: var(--hrv-ex-shroom-icon-size, 42px);
      min-width: var(--hrv-ex-shroom-icon-size, 42px);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 280ms ease-out, color 280ms ease-out;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
    }
    .shroom-icon-shape svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .shroom-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .shroom-primary {
      font-size: 14px;
      font-weight: 400;
      color: var(--hrv-color-text, #212121);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    .shroom-secondary {
      font-size: 12px;
      font-weight: 400;
      color: var(--hrv-color-text-secondary, #757575);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    :host([data-layout=vertical]) .shroom-state-item {
      flex-direction: column;
      text-align: center;
    }
    :host([data-layout=vertical]) .shroom-icon-shape {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 50%;
    }
    :host([data-layout=vertical]) .shroom-icon-shape svg {
      width: 22px;
      height: 22px;
    }
    :host([data-layout=vertical]) .shroom-info {
      align-items: center;
    }
  `;

  // ---------------------------------------------------------------------------
  // Shared CSS - Collapsible controls shell
  // ---------------------------------------------------------------------------

  const SHROOM_CONTROLS = /* css */`
    .shroom-controls-shell {
      overflow: hidden;
      transition: max-height 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
                  margin-top 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
                  opacity 0.35s ease;
    }
    .shroom-controls-shell[data-collapsed=true] {
      max-height: 0 !important;
      margin-top: 0 !important;
      opacity: 0;
      pointer-events: none;
    }
    .shroom-controls-shell[data-collapsed=false] {
      max-height: 400px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      opacity: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-controls-shell { transition: none; }
    }
  `;

  // ---------------------------------------------------------------------------
  // Shared CSS - Mushroom slider (no thumb, flat edge, static gradient)
  // ---------------------------------------------------------------------------

  const SHROOM_SLIDER = /* css */`
    .shroom-slider-wrap {
      position: relative;
      width: 100%;
      height: var(--hrv-ex-shroom-slider-height, 42px);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      overflow: hidden;
    }
    .shroom-slider-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .shroom-slider-cover {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      background: var(--hrv-ex-shroom-slider-track, rgba(0,0,0,0.35));
      pointer-events: none;
      transition: left 180ms ease-in-out;
    }
    .shroom-slider-edge {
      position: absolute;
      top: 4px; bottom: 4px;
      width: 3px;
      border-radius: 1.5px;
      background: rgba(255,255,255,0.8);
      pointer-events: none;
      transition: left 180ms ease-in-out;
      transform: translateX(-50%);
      box-shadow: 0 0 4px rgba(0,0,0,0.15);
    }
    .shroom-slider-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      margin: 0;
      padding: 0;
      opacity: 0;
      z-index: 1;
    }
    .shroom-slider-input:focus-visible ~ .shroom-slider-focus-ring,
    .shroom-slider-wrap:focus-within .shroom-slider-focus-ring {
      box-shadow: inset 0 0 0 2px var(--hrv-color-primary, #6366f1);
    }
    .shroom-slider-focus-ring {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      transition: box-shadow 150ms ease;
    }
  `;

  // ---------------------------------------------------------------------------
  // Shared CSS - Mushroom buttons
  // ---------------------------------------------------------------------------

  const SHROOM_BUTTONS = /* css */`
    .shroom-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: var(--hrv-radius-l, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: var(--hrv-font-size-s, 13px);
      font-weight: var(--hrv-font-weight-medium, 500);
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1;
    }
    .shroom-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-btn:focus-visible {
      outline: 2px solid var(--hrv-color-primary, #6366f1);
      outline-offset: 2px;
    }
    .shroom-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-btn[aria-pressed=true],
    .shroom-btn[data-active=true] {
      background: var(--hrv-color-primary);
      color: var(--hrv-color-on-primary);
    }
    .shroom-btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .shroom-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      padding: 0;
    }
    .shroom-btn-icon svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `;

  // ---------------------------------------------------------------------------
  // Shared CSS - Companion chips
  // ---------------------------------------------------------------------------

  const SHROOM_COMPANIONS = /* css */`
    [part=companion-zone] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      border-top: none;
      padding-top: 0;
    }
    [part=companion-zone]:empty { display: none; }
    [part=companion] {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 16px;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      border: none;
      cursor: default;
      font-size: 11px;
      color: var(--hrv-color-text-secondary);
      transition: background 280ms ease-out;
    }
    [part=companion][data-interactive=true] { cursor: pointer; }
    [part=companion][data-interactive=true]:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    [part=companion][data-on=true] {
      background: var(--hrv-color-primary-dim);
    }
    [part=companion-icon] {
      width: 14px; height: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    [part=companion-icon] svg { width: 100%; height: 100%; fill: currentColor; }
  `;

  // ===========================================================================
  // SwitchCard (also used for input_boolean)
  // ===========================================================================

  const SWITCH_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}
  `;

  class SwitchCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #isOn = false;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${SWITCH_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");

      this.renderIcon(
        this.resolveIcon(this.def.icon, "mdi:toggle-switch-off-outline"),
        "card-icon",
      );

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Toggle`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            this.config.card?.sendCommand("toggle", {});
          },
        });
      }

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, _attributes) {
      this.#isOn = state === "on";
      const domain = this.def.domain ?? "switch";

      _applyIconColor(this.#iconEl, domain, this.#isOn);

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(state);
      }

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (stateItem?.hasAttribute("role")) {
        stateItem.setAttribute("aria-pressed", String(this.#isOn));
      }

      const iconName = this.#isOn
        ? this.resolveIcon(this.def.icon, "mdi:toggle-switch")
        : this.resolveIcon(this.def.icon, "mdi:toggle-switch-off-outline");
      this.renderIcon(iconName, "card-icon");

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }

    predictState(action, _data) {
      if (action === "toggle" || action === "turn_on" || action === "turn_off") {
        const next = action === "toggle" ? (this.#isOn ? "off" : "on")
          : action === "turn_on" ? "on" : "off";
        return { state: next, attributes: {} };
      }
      return null;
    }
  }

  // ===========================================================================
  // LightCard
  // ===========================================================================

  const LIGHT_MODES = ["brightness", "temp", "color"];
  const _LIGHT_MODE_ICONS = {
    brightness: "mdi:brightness-4",
    temp:       "mdi:thermometer",
    color:      "mdi:palette",
  };

  const LIGHT_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_CONTROLS}
    ${SHROOM_SLIDER}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-light-mode-btns {
      display: flex;
      gap: 6px;
    }
    .shroom-light-mode-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-light-mode-btn[hidden] {
      display: none;
    }
    .shroom-light-mode-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-light-mode-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-light-controls-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .shroom-light-controls-row .shroom-slider-wrap {
      flex: 1;
    }
    .shroom-slider-wrap.shroom-light-slider-wrap {
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
    }
    .shroom-slider-bg.shroom-brightness-bg {
      background: var(--shroom-light-accent, var(--hrv-ex-shroom-light, #ff9800));
    }
    .shroom-slider-bg.shroom-ct-bg {
      background: linear-gradient(90deg, #ffb74d 0%, #fff9c4 40%, #bbdefb 70%, #64b5f6 100%);
    }
    .shroom-slider-bg.shroom-hue-bg {
      background: linear-gradient(90deg,
        hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
        hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%)
      );
    }
    .shroom-light-ro {
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text-secondary, #757575);
      margin-top: 4px;
    }
  `;

  class LightCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #slider = null;
    #sliderBg = null;
    #sliderCover = null;
    #sliderEdge = null;
    #modeButtons = [];

    #brightness = 0;
    #colorTempK = 4000;
    #hue = 0;
    #isOn = false;
    #mode = 0;
    #minCt = 2000;
    #maxCt = 6500;
    #lastAttrs = {};
    #sendValue;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendValue = _debounce(this.#doSendValue.bind(this), 300);
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? {};
      const hasBrightness = hints.show_brightness !== false && features.includes("brightness");
      const hasColorTemp = hints.show_color_temp !== false && features.includes("color_temp");
      const hasColor = hints.show_rgb !== false && features.includes("rgb_color");
      const showControls = isWritable && (hasBrightness || hasColorTemp || hasColor);
      const modeCount = [hasBrightness, hasColorTemp, hasColor].filter(Boolean).length;
      this.#minCt = this.def.feature_config?.min_color_temp_kelvin ?? 2000;
      this.#maxCt = this.def.feature_config?.max_color_temp_kelvin ?? 6500;

      const modeAvail = [hasBrightness, hasColorTemp, hasColor];
      if (!modeAvail[this.#mode]) {
        this.#mode = modeAvail.findIndex(Boolean);
        if (this.#mode === -1) this.#mode = 0;
      }

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${LIGHT_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${showControls ? /* html */`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-light-controls-row">
                <div class="shroom-slider-wrap shroom-light-slider-wrap">
                  <div class="shroom-slider-bg shroom-brightness-bg"></div>
                  <div class="shroom-slider-cover" style="left:0%"></div>
                  <div class="shroom-slider-edge" style="left:0%;display:none"></div>
                  <input type="range" class="shroom-slider-input" min="0" max="100"
                    step="1" value="0"
                    aria-label="${_esc(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${modeCount > 1 ? /* html */`
                  <div class="shroom-light-mode-btns">
                    ${hasBrightness ? /* html */`<button class="shroom-light-mode-btn" data-mode="brightness" type="button" aria-label="Brightness"><span part="light-mode-brightness"></span></button>` : ""}
                    ${hasColorTemp ? /* html */`<button class="shroom-light-mode-btn" data-mode="temp" type="button" aria-label="Color temperature"><span part="light-mode-temp"></span></button>` : ""}
                    ${hasColor ? /* html */`<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>` : ""}
                  </div>
                ` : ""}
              </div>
            </div>
          ` : !isWritable ? /* html */`
            <div class="shroom-light-ro">-</div>
          ` : ""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#slider = this.root.querySelector(".shroom-slider-input");
      this.#sliderBg = this.root.querySelector(".shroom-slider-bg");
      this.#sliderCover = this.root.querySelector(".shroom-slider-cover");
      this.#sliderEdge = this.root.querySelector(".shroom-slider-edge");
      this.#modeButtons = [...this.root.querySelectorAll(".shroom-light-mode-btn")];

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:lightbulb"), "card-icon");

      for (const btn of this.#modeButtons) {
        this.renderIcon(_LIGHT_MODE_ICONS[btn.dataset.mode] ?? "mdi:help-circle", `light-mode-${btn.dataset.mode}`);
      }

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Toggle`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            this.config.card?.sendCommand("toggle", {});
          },
        });
      }

      for (const btn of this.#modeButtons) {
        btn.addEventListener("click", () => {
          const newModeName = btn.dataset.mode;
          const newModeIdx = LIGHT_MODES.indexOf(newModeName);
          if (newModeIdx === -1 || newModeIdx === this.#mode) return;
          this.#mode = newModeIdx;
          this.#updateSliderDisplay();
        });
      }

      if (this.#slider) {
        this.#slider.addEventListener("input", () => {
          const val = parseInt(this.#slider.value, 10);
          const mode = LIGHT_MODES[this.#mode] ?? "brightness";
          if (mode === "brightness") {
            this.#brightness = val;
          } else if (mode === "temp") {
            this.#colorTempK = Math.round(this.#minCt + (val / 100) * (this.#maxCt - this.#minCt));
          } else {
            this.#hue = Math.round(val * 3.6);
          }
          this.#updateSliderVisuals();
          this.#sendValue(mode);
        });
      }

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, attributes) {
      this.#isOn = state === "on";
      this.#lastAttrs = attributes;

      _setControlsCollapsed(this.root, !this.#isOn);

      const accent = _lightAccent(state, attributes);
      if (this.#isOn && accent) {
        if (this.#iconEl) {
          this.#iconEl.style.background = `color-mix(in srgb, ${accent} 20%, transparent)`;
          this.#iconEl.style.color = accent;
        }
      } else {
        _applyIconColor(this.#iconEl, "light", this.#isOn);
      }

      this.#brightness = attributes.brightness != null
        ? Math.round((attributes.brightness / 255) * 100) : 0;
      this.#colorTempK = attributes.color_temp_kelvin
        ?? (attributes.color_temp ? Math.round(1000000 / attributes.color_temp) : 4000);
      this.#hue = attributes.hs_color?.[0] ?? 42;

      if (this.#secondaryEl) {
        if (this.#isOn && attributes.brightness != null) {
          this.#secondaryEl.textContent = `${this.#brightness}%`;
        } else {
          this.#secondaryEl.textContent = _capitalize(state);
        }
      }

      const roLabel = this.root.querySelector(".shroom-light-ro");
      if (roLabel) {
        roLabel.textContent = this.#isOn && attributes.brightness != null
          ? `${this.#brightness}%` : _capitalize(state);
      }

      const sliderWrap = this.root.querySelector(".shroom-slider-wrap");
      if (sliderWrap) {
        const accent = _lightAccent("on", attributes);
        sliderWrap.style.setProperty("--shroom-light-accent", accent ?? "var(--hrv-ex-shroom-light, #ff9800)");
      }

      this.#updateSliderDisplay();

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (stateItem?.hasAttribute("role")) {
        stateItem.setAttribute("aria-pressed", String(this.#isOn));
      }

      if (this.#slider) {
        const mode = LIGHT_MODES[this.#mode] ?? "brightness";
        const val = parseInt(this.#slider.value, 10);
        if (mode === "brightness") this.#slider.setAttribute("aria-valuetext", `${val}%`);
        else if (mode === "temp") this.#slider.setAttribute("aria-valuetext", `${val}K`);
        else this.#slider.setAttribute("aria-valuetext", `${val}`);
      }

      const iconName = this.#isOn
        ? this.resolveIcon(this.def.icon, "mdi:lightbulb")
        : this.resolveIcon(this.def.icon, "mdi:lightbulb-off");
      this.renderIcon(iconName, "card-icon");

      this.announceState(`${this.def.friendly_name}, ${state}${this.#isOn ? `, ${this.#brightness}%` : ""}`);
    }

    predictState(action, data) {
      if (action === "toggle") {
        return { state: this.#isOn ? "off" : "on", attributes: this.#lastAttrs };
      }
      if (action === "turn_on") {
        const attrs = { ...this.#lastAttrs };
        if (data.brightness != null) attrs.brightness = data.brightness;
        if (data.color_temp_kelvin != null) attrs.color_temp_kelvin = data.color_temp_kelvin;
        if (data.hs_color != null) attrs.hs_color = data.hs_color;
        return { state: "on", attributes: attrs };
      }
      if (action === "turn_off") {
        return { state: "off", attributes: this.#lastAttrs };
      }
      return null;
    }

    #updateSliderDisplay() {
      const mode = LIGHT_MODES[this.#mode] ?? "brightness";
      const bgEl = this.#sliderBg;

      bgEl?.classList.remove("shroom-brightness-bg", "shroom-ct-bg", "shroom-hue-bg");
      if (mode === "brightness") {
        bgEl?.classList.add("shroom-brightness-bg");
      } else if (mode === "temp") {
        bgEl?.classList.add("shroom-ct-bg");
      } else {
        bgEl?.classList.add("shroom-hue-bg");
      }

      for (const btn of this.#modeButtons) {
        btn.hidden = btn.dataset.mode === mode;
      }

      this.#updateSliderVisuals();
    }

    #updateSliderVisuals() {
      const mode = LIGHT_MODES[this.#mode] ?? "brightness";
      let sliderVal = 0;

      if (mode === "brightness") {
        sliderVal = this.#brightness;
      } else if (mode === "temp") {
        sliderVal = Math.round(((this.#colorTempK - this.#minCt) / (this.#maxCt - this.#minCt)) * 100);
      } else {
        sliderVal = Math.round(this.#hue / 3.6);
      }

      const isBrightness = mode === "brightness";
      if (this.#sliderCover) {
        if (isBrightness) {
          this.#sliderCover.style.display = "";
          this.#sliderCover.style.left = `${sliderVal}%`;
        } else {
          this.#sliderCover.style.display = "none";
        }
      }
      if (this.#sliderEdge) {
        this.#sliderEdge.style.display = isBrightness ? "none" : "";
        if (!isBrightness) this.#sliderEdge.style.left = `${sliderVal}%`;
      }
      if (this.#slider && !this.isFocused(this.#slider)) {
        this.#slider.value = String(sliderVal);
      }
    }

    #doSendValue(mode) {
      if (mode === "brightness") {
        if (this.#brightness <= 0) this.config.card?.sendCommand("turn_off", {});
        else this.config.card?.sendCommand("turn_on", { brightness: Math.round(this.#brightness * 2.55) });
      } else if (mode === "temp") {
        this.config.card?.sendCommand("turn_on", { color_temp_kelvin: this.#colorTempK });
      } else {
        this.config.card?.sendCommand("turn_on", { hs_color: [this.#hue, 100] });
      }
    }
  }

  // ===========================================================================
  // SensorCard (generic, temperature, humidity, battery)
  // ===========================================================================

  const _SENSOR_DC_ACCENT = {
    temperature: "var(--hrv-ex-shroom-climate, #ff5722)",
    humidity:    "var(--hrv-ex-shroom-sensor, #03a9f4)",
    battery:     "var(--hrv-ex-shroom-fan, #4caf50)",
  };

  const _SENSOR_DC_ICON = {
    temperature: "mdi:thermometer",
    humidity:    "mdi:water-percent",
    battery:     "mdi:battery",
  };

  function _batteryIcon(level) {
    if (level == null || isNaN(level)) return "mdi:battery";
    if (level >= 90) return "mdi:battery";
    if (level >= 70) return "mdi:battery-70";
    if (level >= 50) return "mdi:battery-50";
    if (level >= 30) return "mdi:battery-30";
    if (level >= 10) return "mdi:battery-10";
    return "mdi:battery-alert";
  }

  function _batteryAccent(level) {
    if (level == null || isNaN(level)) return "var(--hrv-ex-shroom-fan, #4caf50)";
    if (level <= 10) return "var(--hrv-color-error, #f44336)";
    if (level <= 20) return "var(--hrv-color-warning, #ff9800)";
    return "var(--hrv-ex-shroom-fan, #4caf50)";
  }

  const SENSOR_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}
  `;

  class SensorCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #deviceClass = null;

    render() {
      _applyLayout(this);
      this.#deviceClass = this.def.device_class ?? null;

      const defaultIcon = _SENSOR_DC_ICON[this.#deviceClass] ?? "mdi:gauge";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${SENSOR_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");

      this.renderIcon(this.resolveIcon(this.def.icon, defaultIcon), "card-icon");

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, attributes) {
      const numVal = parseFloat(state);
      const unit = this.def.unit_of_measurement ?? "";
      const isNumeric = !isNaN(numVal);
      const dc = this.#deviceClass;

      if (this.#secondaryEl) {
        if (isNumeric) {
          const precision = attributes.suggested_display_precision;
          const display = precision != null
            ? numVal.toFixed(precision)
            : String(Math.round(numVal * 10) / 10);
          this.#secondaryEl.textContent = unit ? `${display} ${unit}` : display;
        } else {
          this.#secondaryEl.textContent = _capitalize(state);
        }
      }

      if (dc === "battery" && isNumeric) {
        const accent = _batteryAccent(numVal);
        if (this.#iconEl) {
          this.#iconEl.style.background = `color-mix(in srgb, ${accent} 20%, transparent)`;
          this.#iconEl.style.color = accent;
        }
        this.renderIcon(this.resolveIcon(this.def.icon, _batteryIcon(numVal)), "card-icon");
      } else {
        const accent = _SENSOR_DC_ACCENT[dc] ?? _accentFor("sensor");
        if (this.#iconEl) {
          this.#iconEl.style.background = `color-mix(in srgb, ${accent} 20%, transparent)`;
          this.#iconEl.style.color = accent;
        }
      }

      this.announceState(`${this.def.friendly_name}, ${isNumeric ? numVal : state} ${unit}`);
    }
  }

  // ===========================================================================
  // FanCard
  // ===========================================================================

  const FAN_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_CONTROLS}
    ${SHROOM_SLIDER}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    @keyframes shroom-fan-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-icon-shape[data-spinning=true] svg {
        animation: none !important;
      }
    }
    .shroom-icon-shape[data-spinning=true] svg {
      animation: shroom-fan-spin var(--shroom-fan-duration, 1s) linear infinite;
    }

    .shroom-fan-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .shroom-fan-speed-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .shroom-fan-speed-row .shroom-slider-wrap {
      flex: 1;
    }
    .shroom-fan-feat-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }
    .shroom-fan-step-dots {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }
    .shroom-fan-step-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 11px;
      font-weight: var(--hrv-font-weight-medium, 500);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 280ms ease-out, color 280ms ease-out;
    }
    .shroom-fan-step-dot:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-fan-step-dot[data-active=true] {
      background: var(--hrv-ex-shroom-fan, #4caf50);
      color: #fff;
    }
    .shroom-fan-cycle-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-fan-cycle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-fan-cycle-btn svg {
      width: 22px; height: 22px; fill: currentColor;
    }
    .shroom-fan-slider-bg {
      background: var(--hrv-ex-shroom-fan, #4caf50);
    }
  `;

  class FanCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #slider = null;
    #sliderCover = null;
    #oscBtn = null;
    #dirBtn = null;
    #presetBtn = null;

    #isOn = false;
    #percentage = 0;
    #oscillating = false;
    #direction = "forward";
    #presetMode = null;
    #presets = [];
    #sendValue;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendValue = _debounce(this.#doSendSpeed.bind(this), 300);
      this.#presets = def.feature_config?.preset_modes ?? [];
    }

    get #percentageStep() {
      const fc = this.def?.feature_config;
      if (fc?.percentage_step > 1) return fc.percentage_step;
      if (fc?.speed_count > 1) return 100 / fc.speed_count;
      return 1;
    }
    get #isStepped() { return this.#percentageStep > 1; }
    get #speedSteps() {
      const step = this.#percentageStep;
      const steps = [];
      for (let i = 1; i * step <= 100.001; i++) {
        steps.push(Math.floor(i * step * 10) / 10);
      }
      return steps;
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? this.def.display_hints ?? {};
      const displayMode = hints.display_mode ?? null;
      let hasSpeed = features.includes("set_speed");
      const hasOscillate = hints.show_oscillate !== false && features.includes("oscillate");
      const hasDirection = hints.show_direction !== false && features.includes("direction");
      const hasPreset = hints.show_presets !== false && features.includes("preset_mode");

      if (displayMode === "on-off") hasSpeed = false;

      let showSlider = isWritable && hasSpeed;
      let isStepped = showSlider && this.#isStepped;
      let useCycle = false;
      let useStepDots = false;

      if (displayMode === "continuous") { isStepped = false; }
      else if (displayMode === "stepped") { useStepDots = isStepped; }
      else if (displayMode === "cycle") { isStepped = true; useCycle = true; }
      else {
        if (isStepped && this.#presets.length) useCycle = true;
        else if (isStepped) useStepDots = true;
      }

      const showFeats = isWritable && (hasOscillate || hasDirection || hasPreset);

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${FAN_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${showSlider || showFeats ? /* html */`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${showSlider && !isStepped ? /* html */`
                  <div class="shroom-fan-speed-row">
                    <div class="shroom-slider-wrap">
                      <div class="shroom-slider-bg shroom-fan-slider-bg"></div>
                      <div class="shroom-slider-cover" style="left:0%"></div>
                      <input type="range" class="shroom-slider-input" min="0" max="100"
                        step="1" value="0"
                        aria-label="${_esc(this.def.friendly_name)} speed"
                        aria-valuetext="0%">
                      <div class="shroom-slider-focus-ring"></div>
                    </div>
                  </div>
                ` : ""}
                ${showSlider && useStepDots ? /* html */`
                  <div class="shroom-fan-step-dots">
                    ${this.#speedSteps.map((pct, i) => /* html */`
                      <button class="shroom-fan-step-dot" data-pct="${pct}" type="button"
                        data-active="false"
                        aria-label="Speed ${i + 1} (${pct}%)"
                        title="Speed ${i + 1} (${pct}%)">${i + 1}</button>
                    `).join("")}
                  </div>
                ` : ""}
                ${showSlider && useCycle ? /* html */`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                ` : ""}
                ${showFeats ? /* html */`
                  <div class="shroom-fan-feat-row">
                    ${hasOscillate ? /* html */`<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>` : ""}
                    ${hasDirection ? /* html */`<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>` : ""}
                    ${hasPreset ? /* html */`<button class="shroom-btn shroom-fan-feat" data-feat="preset" type="button" aria-label="Preset">Preset</button>` : ""}
                  </div>
                ` : ""}
              </div>
            </div>
          ` : ""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#slider = this.root.querySelector(".shroom-slider-input");
      this.#sliderCover = this.root.querySelector(".shroom-slider-cover");
      this.#oscBtn = this.root.querySelector('[data-feat="oscillate"]');
      this.#dirBtn = this.root.querySelector('[data-feat="direction"]');
      this.#presetBtn = this.root.querySelector('[data-feat="preset"]');

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:fan"), "card-icon");

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Toggle`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            this.config.card?.sendCommand("toggle", {});
          },
        });
      }

      if (this.#slider) {
        this.#slider.addEventListener("input", () => {
          const val = parseInt(this.#slider.value, 10);
          this.#percentage = val;
          this.#slider.setAttribute("aria-valuetext", `${val}%`);
          this.#updateSliderVisuals();
          this.#sendValue();
        });
      }

      this.root.querySelectorAll(".shroom-fan-step-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          const pct = Number(dot.getAttribute("data-pct"));
          this.#percentage = pct;
          this.#isOn = true;
          this.#applyStepDotsState();
          this.config.card?.sendCommand("set_percentage", { percentage: pct });
        });
      });

      const cycleBtn = this.root.querySelector(".shroom-fan-cycle-btn");
      cycleBtn?.addEventListener("click", () => {
        const steps = this.#speedSteps;
        if (!steps.length) return;
        let nextPct;
        if (!this.#isOn || this.#percentage === 0) {
          nextPct = steps[0];
        } else {
          const nextIdx = steps.findIndex(s => s > this.#percentage);
          nextPct = nextIdx === -1 ? steps[0] : steps[nextIdx];
        }
        this.#percentage = nextPct;
        this.#isOn = true;
        this.config.card?.sendCommand("set_percentage", { percentage: nextPct });
      });

      this.#oscBtn?.addEventListener("click", () => {
        this.config.card?.sendCommand("oscillate", { oscillating: !this.#oscillating });
      });
      this.#dirBtn?.addEventListener("click", () => {
        const next = this.#direction === "forward" ? "reverse" : "forward";
        this.#direction = next;
        this.#applyFeatureState();
        this.config.card?.sendCommand("set_direction", { direction: next });
      });
      this.#presetBtn?.addEventListener("click", () => {
        if (!this.#presets.length) return;
        const idx = this.#presetMode ? this.#presets.indexOf(this.#presetMode) : -1;
        const nextIdx = (idx + 1) % this.#presets.length;
        const mode = this.#presets[nextIdx];
        this.#presetMode = mode;
        this.#applyFeatureState();
        this.config.card?.sendCommand("set_preset_mode", { preset_mode: mode });
      });

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, attributes) {
      this.#isOn = state === "on";
      this.#percentage = attributes?.percentage ?? 0;
      this.#oscillating = attributes?.oscillating ?? false;
      this.#direction = attributes?.direction ?? "forward";
      this.#presetMode = attributes?.preset_mode ?? null;
      if (attributes?.preset_modes?.length) this.#presets = attributes.preset_modes;

      _setControlsCollapsed(this.root, !this.#isOn);
      _applyIconColor(this.#iconEl, "fan", this.#isOn);

      if (this.#iconEl) {
        const shouldSpin = this.#isOn && this.#percentage > 0 && this.config.animate !== false;
        if (shouldSpin) {
          const duration = 1 / (1.5 * Math.pow(this.#percentage / 100, 0.5));
          this.#iconEl.setAttribute("data-spinning", "true");
          this.#iconEl.style.setProperty("--shroom-fan-duration", `${duration.toFixed(2)}s`);
        } else {
          this.#iconEl.setAttribute("data-spinning", "false");
        }
      }

      if (this.#secondaryEl) {
        if (this.#isOn && this.#percentage > 0) {
          this.#secondaryEl.textContent = `${this.#percentage}%`;
        } else {
          this.#secondaryEl.textContent = _capitalize(state);
        }
      }

      this.#updateSliderVisuals();
      this.#applyStepDotsState();
      this.#applyFeatureState();

      this.announceState(
        `${this.def.friendly_name}, ${state}` +
        (this.#percentage > 0 ? `, ${this.#percentage}%` : ""),
      );
    }

    predictState(action, data) {
      if (action === "toggle") {
        return { state: this.#isOn ? "off" : "on", attributes: { percentage: this.#percentage } };
      }
      if (action === "set_percentage") {
        return { state: "on", attributes: {
          percentage: data.percentage,
          oscillating: this.#oscillating,
          direction: this.#direction,
          preset_mode: this.#presetMode,
          preset_modes: this.#presets,
        }};
      }
      if (action === "oscillate") {
        return { state: "on", attributes: {
          percentage: this.#percentage,
          oscillating: data.oscillating,
          direction: this.#direction,
        }};
      }
      if (action === "set_direction") {
        return { state: "on", attributes: {
          percentage: this.#percentage,
          oscillating: this.#oscillating,
          direction: data.direction,
        }};
      }
      return null;
    }

    #updateSliderVisuals() {
      if (!this.#slider) return;
      const pct = this.#percentage;
      if (!this.isFocused(this.#slider)) {
        this.#slider.value = String(pct);
      }
      if (this.#sliderCover) this.#sliderCover.style.left = `${pct}%`;
    }

    #applyStepDotsState() {
      const halfStep = this.#percentageStep / 2;
      this.root.querySelectorAll(".shroom-fan-step-dot").forEach((dot) => {
        const dotPct = Number(dot.getAttribute("data-pct"));
        dot.setAttribute("data-active", String(this.#isOn && this.#percentage >= dotPct - halfStep));
      });
    }

    #applyFeatureState() {
      if (this.#oscBtn) {
        this.#oscBtn.setAttribute("aria-pressed", "false");
        this.#oscBtn.textContent = "Oscillate";
      }
      if (this.#dirBtn) {
        this.#dirBtn.textContent = "Direction";
        this.#dirBtn.setAttribute("aria-label", "Direction");
      }
      if (this.#presetBtn) {
        this.#presetBtn.textContent = "Preset";
        this.#presetBtn.setAttribute("data-active", "false");
      }
    }

    #doSendSpeed() {
      if (this.#percentage <= 0) {
        this.config.card?.sendCommand("turn_off", {});
      } else {
        this.config.card?.sendCommand("set_percentage", { percentage: this.#percentage });
      }
    }
  }

  // ===========================================================================
  // BinarySensorCard
  // ===========================================================================

  const BINARY_SENSOR_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}
  `;

  class BinarySensorCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;

    render() {
      _applyLayout(this);
      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${BINARY_SENSOR_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");

      this.renderIcon(
        this.def.icon_state_map?.["off"] ?? this.resolveIcon(this.def.icon, "mdi:radiobox-blank"),
        "card-icon",
      );

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, _attributes) {
      const isOn = state === "on";

      _applyIconColor(this.#iconEl, "binary_sensor", isOn);

      const label = this.formatStateLabel(state);

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = label;
      }

      const iconName = this.def.icon_state_map?.[state]
        ?? this.resolveIcon(this.def.icon, isOn ? "mdi:radiobox-marked" : "mdi:radiobox-blank");
      this.renderIcon(iconName, "card-icon");

      this.announceState(`${this.def.friendly_name}, ${label}`);
    }
  }

  // ===========================================================================
  // GenericCard (Tier 2 fallback)
  // ===========================================================================

  const GENERIC_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}

    .shroom-generic-toggle {
      -webkit-appearance: none;
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: var(--hrv-radius-l, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: var(--hrv-font-size-s, 13px);
      font-weight: var(--hrv-font-weight-medium, 500);
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-generic-toggle:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-generic-toggle[data-on=true] {
      background: var(--hrv-color-primary);
      color: var(--hrv-color-on-primary);
    }
    .shroom-generic-toggle[hidden] { display: none; }
    .shroom-generic-toggle:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-generic-toggle { transition: none; }
    }
  `;

  class GenericCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #toggle = null;
    #isOn = false;
    #hasToggle = false;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      this.#hasToggle = false;

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${GENERIC_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${isWritable ? /* html */`
            <button class="shroom-generic-toggle" type="button" data-on="false"
              title="Toggle" aria-label="${_esc(this.def.friendly_name)} - Toggle"
              hidden>Toggle</button>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#toggle = this.root.querySelector(".shroom-generic-toggle");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:help-circle"), "card-icon");

      if (this.#toggle && isWritable) {
        this._attachGestureHandlers(this.#toggle, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            this.config.card?.sendCommand("toggle", {});
          },
        });
      }

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, _attributes) {
      const isOnOff = state === "on" || state === "off";
      this.#isOn = state === "on";

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(state);
      }

      const domain = this.def.domain ?? "generic";
      _applyIconColor(this.#iconEl, domain, this.#isOn);

      if (this.#toggle) {
        if (isOnOff && !this.#hasToggle) {
          this.#toggle.removeAttribute("hidden");
          this.#hasToggle = true;
        }
        if (this.#hasToggle) {
          this.#toggle.setAttribute("data-on", String(this.#isOn));
          this.#toggle.setAttribute("aria-pressed", String(this.#isOn));
          this.#toggle.textContent = this.#isOn ? "On" : "Off";
          this.#toggle.title = this.#isOn ? "On - click to turn off" : "Off - click to turn on";
        }
      }

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }

    predictState(action, _data) {
      if (action !== "toggle") return null;
      return { state: this.#isOn ? "off" : "on", attributes: {} };
    }
  }

  // ===========================================================================
  // HarvestActionCard
  // ===========================================================================

  const HARVEST_ACTION_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}
  `;

  class HarvestActionCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${HARVEST_ACTION_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");

      this.renderIcon(
        this.def.icon_state_map?.["idle"] ?? this.resolveIcon(this.def.icon, "mdi:play"),
        "card-icon",
      );

      _applyIconColor(this.#iconEl, "harvest_action", false);

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Trigger`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            this.config.card?.sendCommand("trigger", {});
          },
        });
      }

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, _attributes) {
      const isTriggered = state === "triggered";

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(state);
      }

      _applyIconColor(this.#iconEl, "harvest_action", isTriggered);

      const iconName = this.def.icon_state_map?.[state] ?? this.resolveIcon(this.def.icon, "mdi:play");
      this.renderIcon(iconName, "card-icon");

      this.announceState(`${this.def.friendly_name}, ${_capitalize(state)}`);
    }

    predictState(action, _data) {
      if (action !== "trigger") return null;
      return { state: "triggered", attributes: {} };
    }
  }

  // ===========================================================================
  // InputNumberCard
  // ===========================================================================

  const INPUT_NUMBER_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_CONTROLS}
    ${SHROOM_SLIDER}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;

  class InputNumberCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #slider = null;
    #sliderCover = null;
    #value = 0;
    #min = 0;
    #max = 100;
    #step = 1;
    #sendDebounce;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendDebounce = _debounce(this.#doSend.bind(this), 300);
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      this.#min = this.def.feature_config?.min ?? 0;
      this.#max = this.def.feature_config?.max ?? 100;
      this.#step = this.def.feature_config?.step ?? 1;

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${INPUT_NUMBER_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${isWritable ? /* html */`
            <div class="shroom-controls-shell" data-collapsed="false">
              <div class="shroom-slider-wrap">
                <div class="shroom-slider-bg shroom-num-slider-bg"></div>
                <div class="shroom-slider-cover" style="left:0%"></div>
                <input type="range" class="shroom-slider-input"
                  min="${this.#min}" max="${this.#max}" step="${this.#step}" value="${this.#min}"
                  aria-label="${_esc(this.def.friendly_name)} value"
                  aria-valuetext="${this.#min}${this.def.unit_of_measurement ? ` ${_esc(this.def.unit_of_measurement)}` : ""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          ` : ""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#slider = this.root.querySelector(".shroom-slider-input");
      this.#sliderCover = this.root.querySelector(".shroom-slider-cover");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:ray-vertex"), "card-icon");
      _applyIconColor(this.#iconEl, "input_number", true);

      if (this.#slider) {
        const unit = this.def.unit_of_measurement ?? "";
        this.#slider.addEventListener("input", () => {
          this.#value = parseFloat(this.#slider.value);
          this.#slider.setAttribute("aria-valuetext", `${this.#value}${unit ? ` ${unit}` : ""}`);
          this.#syncVisuals();
          this.#sendDebounce();
        });
      }

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    #valToPct(v) {
      const range = this.#max - this.#min;
      if (range === 0) return 0;
      return Math.max(0, Math.min(100, ((v - this.#min) / range) * 100));
    }

    #syncVisuals() {
      const pct = this.#valToPct(this.#value);
      if (this.#sliderCover) this.#sliderCover.style.left = `${pct}%`;
      if (this.#slider && !this.isFocused(this.#slider)) {
        this.#slider.value = String(this.#value);
      }
      const unit = this.def.unit_of_measurement ?? "";
      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = `${this.#value}${unit ? ` ${unit}` : ""}`;
      }
    }

    #doSend() {
      this.config.card?.sendCommand("set_value", { value: this.#value });
    }

    applyState(state, _attributes) {
      const v = parseFloat(state);
      if (isNaN(v)) return;
      this.#value = v;
      this.#syncVisuals();

      const unit = this.def.unit_of_measurement ?? "";
      this.announceState(`${this.def.friendly_name}, ${v}${unit ? ` ${unit}` : ""}`);
    }

    predictState(action, data) {
      if (action === "set_value" && data.value !== undefined) {
        return { state: String(data.value), attributes: {} };
      }
      return null;
    }
  }

  // ===========================================================================
  // InputSelectCard
  // ===========================================================================

  const INPUT_SELECT_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-select-shell {
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      position: relative;
    }
    .shroom-select-current {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 13px;
      font-family: inherit;
      text-align: left;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 280ms ease-out;
    }
    .shroom-select-current:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-select-current:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .shroom-select-arrow { font-size: 10px; opacity: 0.5; }
    .shroom-select-dropdown {
      position: absolute;
      left: 0; right: 0;
      background: var(--hrv-card-background, #ffffff);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      overflow: hidden;
      max-height: 240px;
      overflow-y: auto;
      scrollbar-width: none;
      z-index: 10;
    }
    .shroom-select-dropdown::-webkit-scrollbar { display: none; }
    .shroom-select-option {
      display: block;
      width: 100%;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #212121);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      transition: background 150ms;
    }
    .shroom-select-option + .shroom-select-option {
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-select-option:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-select-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 500;
    }
  `;

  class InputSelectCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #selectedBtn = null;
    #dropdown = null;
    #current = "";
    #options = [];
    #isOpen = false;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${INPUT_SELECT_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${isWritable ? /* html */`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${_esc(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" hidden></div>
            </div>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#selectedBtn = this.root.querySelector(".shroom-select-current");
      this.#dropdown = this.root.querySelector(".shroom-select-dropdown");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:form-select"), "card-icon");
      _applyIconColor(this.#iconEl, "input_select", true);

      if (this.#selectedBtn && isWritable) {
        this.#selectedBtn.addEventListener("click", () => {
          if (this.#isOpen) this.#closeDropdown();
          else this.#openDropdown();
        });
        this.#selectedBtn.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && this.#isOpen) {
            this.#closeDropdown();
            this.#selectedBtn.focus();
          }
        });
        this.root.addEventListener("keydown", (e) => {
          if (!this.#isOpen) return;
          if (e.key === "Escape") {
            this.#closeDropdown();
            this.#selectedBtn.focus();
          } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const opts = [...this.#dropdown.querySelectorAll("[role=option]")];
            const focused = this.root.activeElement;
            let idx = opts.indexOf(focused);
            idx = e.key === "ArrowDown" ? Math.min(idx + 1, opts.length - 1) : Math.max(idx - 1, 0);
            opts[idx]?.focus();
          }
        });
        document.addEventListener("click", (e) => {
          if (this.#isOpen && !this.root.host.contains(e.target)) this.#closeDropdown();
        });
      }

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    #openDropdown() {
      if (!this.#dropdown || !this.#options.length) return;

      this.#dropdown.innerHTML = this.#options.map(opt => /* html */`
        <button class="shroom-select-option" type="button" role="option"
          aria-selected="${opt === this.#current}"
          data-active="${opt === this.#current}">
          ${_esc(opt)}
        </button>
      `).join("");

      this.#dropdown.querySelectorAll(".shroom-select-option").forEach((btn, i) => {
        btn.addEventListener("click", () => {
          this.config.card?.sendCommand("select_option", { option: this.#options[i] });
          this.#closeDropdown();
        });
      });

      const shell = this.root.querySelector(".shroom-select-shell");
      if (shell) shell.style.overflow = "visible";
      const card = this.root.querySelector("[part=card]");
      if (card) card.style.overflow = "visible";
      this.#dropdown.removeAttribute("hidden");
      if (this.#selectedBtn) this.#selectedBtn.setAttribute("aria-expanded", "true");

      const btnRect = this.#selectedBtn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - btnRect.bottom;
      const dropHeight = Math.min(this.#dropdown.scrollHeight, 240);
      if (spaceBelow < dropHeight + 8) {
        this.#dropdown.style.bottom = "calc(100% + 4px)";
        this.#dropdown.style.top = "auto";
      } else {
        this.#dropdown.style.top = "calc(100% + 4px)";
        this.#dropdown.style.bottom = "auto";
      }

      this.#isOpen = true;
    }

    #closeDropdown() {
      this.#dropdown?.setAttribute("hidden", "");
      if (this.#selectedBtn) this.#selectedBtn.setAttribute("aria-expanded", "false");
      const shell = this.root.querySelector(".shroom-select-shell");
      if (shell) shell.style.overflow = "";
      const card = this.root.querySelector("[part=card]");
      if (card) card.style.overflow = "";
      this.#isOpen = false;
    }

    applyState(state, attributes) {
      this.#current = state;
      this.#options = attributes?.options ?? this.#options;

      if (this.#secondaryEl) this.#secondaryEl.textContent = state;

      const label = this.root.querySelector(".shroom-select-label");
      if (label) label.textContent = state;

      if (this.#isOpen) {
        this.#dropdown?.querySelectorAll(".shroom-select-option").forEach((btn, i) => {
          const isActive = String(this.#options[i] === state);
          btn.setAttribute("data-active", isActive);
          btn.setAttribute("aria-selected", isActive);
        });
      }

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }

    predictState(action, data) {
      if (action === "select_option" && data.option !== undefined) {
        return { state: String(data.option), attributes: {} };
      }
      return null;
    }
  }

  // ===========================================================================
  // CoverCard
  // ===========================================================================

  const COVER_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_SLIDER}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-cover-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-cover-slider-view {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 8px;
    }
    .shroom-cover-slider-view[hidden] { display: none; }
    .shroom-cover-slider-view .shroom-slider-wrap { flex: 1; }
    .shroom-cover-btn-view {
      display: flex;
      flex: 1;
      justify-content: center;
      gap: 8px;
    }
    .shroom-cover-btn-view[hidden] { display: none; }
    .shroom-cover-action-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-cover-action-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-cover-action-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-cover-action-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-cover-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-cover-toggle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-cover-toggle-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-cover-slider-bg {
      background: var(--hrv-ex-shroom-cover, #5389ec);
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-cover-action-btn,
      .shroom-cover-toggle-btn { transition: none; }
    }
  `;

  class CoverCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #slider = null;
    #sliderCover = null;
    #sliderView = null;
    #btnView = null;
    #openBtn = null;
    #stopBtn = null;
    #closeBtn = null;
    #position = 0;
    #showingButtons = false;
    #lastState = "closed";
    #lastAttrs = {};
    #sendDebounce;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendDebounce = _debounce(this.#doSendPosition.bind(this), 300);
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      const hints = this.config.displayHints ?? {};
      const hasPosition = hints.show_position !== false && this.def.supported_features?.includes("set_position");
      const hasButtons = !this.def.supported_features || this.def.supported_features.includes("buttons");
      const showControls = isWritable && (hasPosition || hasButtons);

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${COVER_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${showControls ? /* html */`
            <div class="shroom-cover-bar">
              ${hasPosition ? /* html */`
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${_esc(this.def.friendly_name)} position"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              ` : ""}
              ${hasButtons ? /* html */`
                <div class="shroom-cover-btn-view"${hasPosition ? " hidden" : ""}>
                  <button class="shroom-cover-action-btn" data-action="open" type="button"
                    title="Open" aria-label="Open cover">
                    <svg viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg>
                  </button>
                  <button class="shroom-cover-action-btn" data-action="stop" type="button"
                    title="Stop" aria-label="Stop cover">
                    <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  </button>
                  <button class="shroom-cover-action-btn" data-action="close" type="button"
                    title="Close" aria-label="Close cover">
                    <svg viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                  </button>
                </div>
              ` : ""}
              ${hasPosition && hasButtons ? /* html */`
                <button class="shroom-cover-toggle-btn" type="button" title="Controls" aria-label="Toggle cover controls" aria-expanded="false">
                  <svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>
                </button>
              ` : ""}
            </div>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#slider = this.root.querySelector(".shroom-slider-input");
      this.#sliderCover = this.root.querySelector(".shroom-slider-cover");
      this.#sliderView = this.root.querySelector(".shroom-cover-slider-view");
      this.#btnView = this.root.querySelector(".shroom-cover-btn-view");
      this.#openBtn = this.root.querySelector("[data-action=open]");
      this.#stopBtn = this.root.querySelector("[data-action=stop]");
      this.#closeBtn = this.root.querySelector("[data-action=close]");
      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:window-shutter"), "card-icon");

      if (this.#slider) {
        this.#slider.addEventListener("input", () => {
          this.#position = parseInt(this.#slider.value, 10);
          this.#syncSlider();
          this.#sendDebounce();
        });
      }

      [this.#openBtn, this.#stopBtn, this.#closeBtn].forEach(btn => {
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        btn.addEventListener("click", () => {
          this.config.card?.sendCommand(`${action}_cover`, {});
        });
      });

      const toggleBtn = this.root.querySelector(".shroom-cover-toggle-btn");
      toggleBtn?.addEventListener("click", () => {
        this.#showingButtons = !this.#showingButtons;
        toggleBtn.setAttribute("aria-expanded", String(this.#showingButtons));
        toggleBtn.setAttribute("aria-label", this.#showingButtons ? "Show position slider" : "Show cover buttons");
        this.#syncViews();
      });

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    #syncViews() {
      if (this.#sliderView) this.#sliderView.hidden = this.#showingButtons;
      if (this.#btnView) this.#btnView.hidden = !this.#showingButtons;
      const toggleBtn = this.root.querySelector(".shroom-cover-toggle-btn");
      if (toggleBtn) {
        toggleBtn.innerHTML = this.#showingButtons
          ? '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>';
      }
    }

    #syncSlider() {
      if (this.#sliderCover) this.#sliderCover.style.left = `${this.#position}%`;
      const edge = this.root.querySelector(".shroom-slider-edge");
      if (edge) edge.style.left = `${this.#position}%`;
    }

    #doSendPosition() {
      this.config.card?.sendCommand("set_cover_position", { position: this.#position });
    }

    applyState(state, attributes) {
      this.#lastState = state;
      this.#lastAttrs = { ...attributes };

      const isOpen = state === "open" || state === "opening";
      _applyIconColor(this.#iconEl, "cover", isOpen);

      if (this.#secondaryEl) {
        const pos = attributes.current_position;
        const stateLabel = _capitalize(state);
        this.#secondaryEl.textContent = pos !== undefined ? `${stateLabel} - ${pos}%` : stateLabel;
      }

      const isMoving = state === "opening" || state === "closing";
      const pos = attributes.current_position;
      if (this.#openBtn) this.#openBtn.disabled = !isMoving && pos === 100;
      if (this.#stopBtn) this.#stopBtn.disabled = !isMoving;
      if (this.#closeBtn) this.#closeBtn.disabled = !isMoving && state === "closed";

      if (attributes.current_position !== undefined) {
        this.#position = attributes.current_position;
        if (this.#slider && !this.isFocused(this.#slider)) {
          this.#slider.value = String(this.#position);
        }
        this.#syncSlider();
      }

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "open_cover") {
        attrs.current_position = 100;
        return { state: "open", attributes: attrs };
      }
      if (action === "close_cover") {
        attrs.current_position = 0;
        return { state: "closed", attributes: attrs };
      }
      if (action === "stop_cover") {
        return { state: this.#lastState, attributes: attrs };
      }
      if (action === "set_cover_position" && data.position !== undefined) {
        attrs.current_position = data.position;
        return { state: data.position > 0 ? "open" : "closed", attributes: attrs };
      }
      return null;
    }
  }

  // ===========================================================================
  // RemoteCard
  // ===========================================================================

  const REMOTE_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}
  `;

  class RemoteCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${REMOTE_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:remote"), "card-icon");
      _applyIconColor(this.#iconEl, "remote", false);

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Send command`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            const cmd = this.config.tapAction?.data?.command ?? "power";
            const device = this.config.tapAction?.data?.device ?? undefined;
            const data = device ? { command: cmd, device } : { command: cmd };
            this.config.card?.sendCommand("send_command", data);
          },
        });
      }

      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, _attributes) {
      const isOn = state === "on";
      _applyIconColor(this.#iconEl, "remote", isOn);

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(state);
      }

      const iconName = this.def.icon_state_map?.[state]
        ?? this.resolveIcon(this.def.icon, "mdi:remote");
      this.renderIcon(iconName, "card-icon");

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }
  }

  // ===========================================================================
  // TimerCard
  // ===========================================================================

  function _formatTimerTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  function _parseDuration(dur) {
    if (typeof dur === "number") return dur;
    if (typeof dur !== "string") return 0;
    const parts = dur.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  }

  const TIMER_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-timer-display {
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      text-align: center;
      display: block;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      font-variant-numeric: tabular-nums;
    }
    .shroom-timer-display[data-paused=true] {
      opacity: 0.6;
    }
    .shroom-timer-controls {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }
    .shroom-timer-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-timer-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-timer-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .shroom-timer-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-timer-btn { transition: none; }
    }
  `;

  class TimerCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #displayEl = null;
    #playPauseBtn = null;
    #cancelBtn = null;
    #finishBtn = null;
    #tickInterval = null;
    #lastState = "idle";
    #lastAttrs = {};
    #finishesAt = null;
    #remaining = null;

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${TIMER_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span class="shroom-timer-display" title="Time remaining">00:00</span>
          ${isWritable ? /* html */`
            <div class="shroom-timer-controls">
              <button class="shroom-timer-btn" data-action="playpause" type="button"
                title="Start" aria-label="${_esc(this.def.friendly_name)} - Start">
                <span part="playpause-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="cancel" type="button"
                title="Cancel" aria-label="${_esc(this.def.friendly_name)} - Cancel">
                <span part="cancel-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="finish" type="button"
                title="Finish" aria-label="${_esc(this.def.friendly_name)} - Finish">
                <span part="finish-icon" aria-hidden="true"></span>
              </button>
            </div>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#displayEl = this.root.querySelector(".shroom-timer-display");
      this.#playPauseBtn = this.root.querySelector("[data-action=playpause]");
      this.#cancelBtn = this.root.querySelector("[data-action=cancel]");
      this.#finishBtn = this.root.querySelector("[data-action=finish]");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:timer-outline"), "card-icon");
      this.renderIcon("mdi:play", "playpause-icon");
      this.renderIcon("mdi:stop", "cancel-icon");
      this.renderIcon("mdi:check-circle", "finish-icon");
      _applyIconColor(this.#iconEl, "timer", false);

      if (isWritable) {
        this.#playPauseBtn?.addEventListener("click", () => {
          const cmd = this.#lastState === "active" ? "pause" : "start";
          this.config.card?.sendCommand(cmd, {});
        });
        this.#cancelBtn?.addEventListener("click", () => {
          this.config.card?.sendCommand("cancel", {});
        });
        this.#finishBtn?.addEventListener("click", () => {
          this.config.card?.sendCommand("finish", {});
        });
      }

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, attributes) {
      this.#lastState = state;
      this.#lastAttrs = { ...attributes };
      this.#finishesAt = attributes.finishes_at ?? null;
      this.#remaining = attributes.remaining != null ? _parseDuration(attributes.remaining) : null;

      const isActive = state === "active";
      _applyIconColor(this.#iconEl, "timer", isActive || state === "paused");

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(state);
      }

      this.#updateButtons(state);
      this.#updateDisplay(state);

      if (isActive && this.#finishesAt) {
        this.#startTick();
      } else {
        this.#stopTick();
      }

      if (this.#displayEl) {
        this.#displayEl.setAttribute("data-paused", String(state === "paused"));
      }
    }

    predictState(action, _data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "start") return { state: "active", attributes: attrs };
      if (action === "pause") {
        if (this.#finishesAt) {
          attrs.remaining = Math.max(0, (new Date(this.#finishesAt).getTime() - Date.now()) / 1000);
        }
        return { state: "paused", attributes: attrs };
      }
      if (action === "cancel" || action === "finish") return { state: "idle", attributes: attrs };
      return null;
    }

    #updateButtons(state) {
      const isIdle = state === "idle";
      const isActive = state === "active";

      if (this.#playPauseBtn) {
        const icon = isActive ? "mdi:pause" : "mdi:play";
        const label = isActive ? "Pause" : (state === "paused" ? "Resume" : "Start");
        this.renderIcon(icon, "playpause-icon");
        this.#playPauseBtn.title = label;
        this.#playPauseBtn.setAttribute("aria-label", `${this.def.friendly_name} - ${label}`);
      }
      if (this.#cancelBtn) this.#cancelBtn.disabled = isIdle;
      if (this.#finishBtn) this.#finishBtn.disabled = isIdle;

      this.announceState(`${this.def.friendly_name}, ${state}`);
    }

    #updateDisplay(state) {
      if (!this.#displayEl) return;
      if (state === "idle") {
        const dur = this.#lastAttrs.duration;
        this.#displayEl.textContent = dur ? _formatTimerTime(_parseDuration(dur)) : "00:00";
        return;
      }
      if (state === "paused" && this.#remaining != null) {
        this.#displayEl.textContent = _formatTimerTime(this.#remaining);
        return;
      }
      if (state === "active" && this.#finishesAt) {
        const secs = Math.max(0, (new Date(this.#finishesAt).getTime() - Date.now()) / 1000);
        this.#displayEl.textContent = _formatTimerTime(secs);
      }
    }

    #startTick() {
      this.#stopTick();
      this.#tickInterval = setInterval(() => {
        if (!this.#finishesAt || this.#lastState !== "active") {
          this.#stopTick();
          return;
        }
        const secs = Math.max(0, (new Date(this.#finishesAt).getTime() - Date.now()) / 1000);
        if (this.#displayEl) this.#displayEl.textContent = _formatTimerTime(secs);
        if (secs <= 0) this.#stopTick();
      }, 1000);
    }

    #stopTick() {
      if (this.#tickInterval) {
        clearInterval(this.#tickInterval);
        this.#tickInterval = null;
      }
    }
  }

  // ===========================================================================
  // ClimateCard
  // ===========================================================================

  const CLIMATE_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-climate-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-climate-bar[hidden] { display: none; }
    .shroom-climate-temp-view {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 4px;
    }
    .shroom-climate-temp-view[hidden] { display: none; }
    .shroom-climate-step-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 18px;
      font-weight: 400;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-climate-step-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-step-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-climate-temp-display {
      flex: 1;
      text-align: center;
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      line-height: 1;
    }
    .shroom-climate-temp-frac {
      font-size: 16px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-climate-temp-unit {
      font-size: 14px;
      color: var(--hrv-color-text-secondary, #757575);
      margin-left: 2px;
    }
    .shroom-climate-feat-view {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }
    .shroom-climate-feat-view[hidden] { display: none; }
    .shroom-climate-feat-btn {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 12px;
      border: none;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1.2;
    }
    .shroom-climate-feat-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-feat-label {
      font-size: 10px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-climate-feat-value {
      font-weight: 500;
    }
    .shroom-climate-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-climate-toggle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-toggle-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-climate-dropdown {
      background: var(--hrv-card-background, #ffffff);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      overflow: hidden;
      max-height: 200px;
      overflow-y: auto;
      scrollbar-width: none;
      margin-top: 4px;
    }
    .shroom-climate-dropdown::-webkit-scrollbar { display: none; }
    .shroom-climate-dropdown[hidden] { display: none; }
    .shroom-climate-dd-option {
      display: block;
      width: 100%;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #212121);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      transition: background 150ms;
    }
    .shroom-climate-dd-option + .shroom-climate-dd-option {
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-climate-dd-option:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-climate-dd-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 500;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-climate-step-btn,
      .shroom-climate-feat-btn,
      .shroom-climate-toggle-btn { transition: none; }
    }
  `;

  class ClimateCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #climateBarEl = null;
    #tempIntEl = null;
    #tempFracEl = null;
    #minusBtn = null;
    #plusBtn = null;
    #modeBtn = null;
    #fanBtn = null;
    #presetBtn = null;
    #swingBtn = null;
    #dropdown = null;
    #tempView = null;
    #featView = null;
    #toggleBtn = null;
    #activeFeat = null;
    #outsideListener = null;
    #showingFeats = false;
    #targetTemp = 20;
    #currentTemp = null;
    #hvacMode = "off";
    #fanMode = null;
    #presetMode = null;
    #swingMode = null;
    #minTemp = 16;
    #maxTemp = 32;
    #tempStep = 0.5;
    #unit = "°C";
    #hvacModes = [];
    #fanModes = [];
    #presetModes = [];
    #swingModes = [];
    #lastAttrs = {};
    #sendDebounce;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendDebounce = _debounce(this.#doSendTemp.bind(this), 500);
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      const hints = this.config.displayHints ?? {};
      const hasTemp = this.def.supported_features?.includes("target_temperature");
      const hasFan = hints.show_fan_mode !== false && (this.def.supported_features?.includes("fan_mode")
        || (this.def.feature_config?.fan_modes?.length > 0));
      const hasPreset = hints.show_presets !== false && (this.def.supported_features?.includes("preset_mode")
        || (this.def.feature_config?.preset_modes?.length > 0));
      const hasSwing = hints.show_swing_mode !== false && (this.def.supported_features?.includes("swing_mode")
        || (this.def.feature_config?.swing_modes?.length > 0));

      this.#minTemp = this.def.feature_config?.min_temp ?? 16;
      this.#maxTemp = this.def.feature_config?.max_temp ?? 32;
      this.#tempStep = this.def.feature_config?.temp_step ?? 0.5;
      this.#unit = this.def.unit_of_measurement ?? "°C";
      this.#hvacModes = this.def.feature_config?.hvac_modes ?? ["off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"];
      this.#fanModes = this.def.feature_config?.fan_modes ?? [];
      this.#presetModes = this.def.feature_config?.preset_modes ?? [];
      this.#swingModes = this.def.feature_config?.swing_modes ?? [];

      const hasFeats = isWritable && (this.#hvacModes.length || this.#presetModes.length || this.#fanModes.length || this.#swingModes.length);
      const [tInt, tFrac] = this.#targetTemp.toFixed(1).split(".");

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${CLIMATE_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${isWritable}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${hasTemp || hasFeats ? /* html */`
            <div class="shroom-climate-bar">
              ${hasTemp ? /* html */`
                <div class="shroom-climate-temp-view">
                  ${isWritable ? /* html */`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  ` : ""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${_esc(tInt)}</span><span class="shroom-climate-temp-frac">.${_esc(tFrac)}</span>
                    <span class="shroom-climate-temp-unit">${_esc(this.#unit)}</span>
                  </span>
                  ${isWritable ? /* html */`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  ` : ""}
                </div>
              ` : ""}
              ${hasFeats ? /* html */`
                <div class="shroom-climate-feat-view" hidden>
                  ${hints.show_hvac_modes !== false && this.#hvacModes.length ? /* html */`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  ` : ""}
                  ${hasPreset && this.#presetModes.length ? /* html */`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  ` : ""}
                  ${hasFan && this.#fanModes.length ? /* html */`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  ` : ""}
                  ${hasSwing && this.#swingModes.length ? /* html */`
                    <button class="shroom-climate-feat-btn" data-feat="swing" type="button" title="Change swing mode" aria-label="Change swing mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Swing</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  ` : ""}
                </div>
                <button class="shroom-climate-toggle-btn" type="button" title="Settings" aria-label="Toggle climate settings" aria-expanded="false">
                  <svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>
                </button>
              ` : ""}
            </div>
            <div class="shroom-climate-dropdown" role="listbox" hidden></div>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#climateBarEl = this.root.querySelector(".shroom-climate-bar");
      this.#tempIntEl = this.root.querySelector(".shroom-climate-temp-int");
      this.#tempFracEl = this.root.querySelector(".shroom-climate-temp-frac");
      this.#minusBtn = this.root.querySelector("[data-dir='-']");
      this.#plusBtn = this.root.querySelector("[data-dir='+']");
      this.#modeBtn = this.root.querySelector("[data-feat=mode]");
      this.#fanBtn = this.root.querySelector("[data-feat=fan]");
      this.#presetBtn = this.root.querySelector("[data-feat=preset]");
      this.#swingBtn = this.root.querySelector("[data-feat=swing]");
      this.#dropdown = this.root.querySelector(".shroom-climate-dropdown");
      this.#tempView = this.root.querySelector(".shroom-climate-temp-view");
      this.#featView = this.root.querySelector(".shroom-climate-feat-view");
      this.#toggleBtn = this.root.querySelector(".shroom-climate-toggle-btn");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:thermostat"), "card-icon");

      const stateItem = this.root.querySelector(".shroom-state-item");
      if (isWritable) {
        _makeAccessibleButton(stateItem, `${this.def.friendly_name} - Toggle`);
        this._attachGestureHandlers(stateItem, {
          onTap: () => {
            const tap = this.config.gestureConfig?.tap;
            if (tap) { this._runAction(tap); return; }
            const newMode = this.#hvacMode === "off" ? (this.#hvacModes.find(m => m !== "off") ?? "heat") : "off";
            this.config.card?.sendCommand("set_hvac_mode", { hvac_mode: newMode });
          },
        });
      }

      if (this.#minusBtn) {
        this.#minusBtn.addEventListener("click", (e) => { e.stopPropagation(); this.#adjustTemp(-1); });
      }
      if (this.#plusBtn) {
        this.#plusBtn.addEventListener("click", (e) => { e.stopPropagation(); this.#adjustTemp(1); });
      }

      if (this.#toggleBtn) {
        this.#toggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.#showingFeats = !this.#showingFeats;
          this.#toggleBtn.setAttribute("aria-expanded", String(this.#showingFeats));
          this.#syncViews();
        });
      }

      if (isWritable) {
        [this.#modeBtn, this.#fanBtn, this.#presetBtn, this.#swingBtn].forEach(btn => {
          if (!btn) return;
          const feat = btn.getAttribute("data-feat");
          btn.addEventListener("click", (e) => { e.stopPropagation(); this.#toggleDropdown(feat); });
        });
      }

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    #syncViews() {
      if (this.#tempView) this.#tempView.hidden = this.#showingFeats;
      if (this.#featView) this.#featView.hidden = !this.#showingFeats;
      if (this.#toggleBtn) {
        this.#toggleBtn.innerHTML = this.#showingFeats
          ? '<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>';
      }
    }

    #adjustTemp(dir) {
      const next = Math.round((this.#targetTemp + dir * this.#tempStep) * 100) / 100;
      this.#targetTemp = Math.max(this.#minTemp, Math.min(this.#maxTemp, next));
      this.#updateTempDisplay();
      this.#sendDebounce();
    }

    #updateTempDisplay() {
      const [int, frac] = this.#targetTemp.toFixed(1).split(".");
      if (this.#tempIntEl) this.#tempIntEl.textContent = int;
      if (this.#tempFracEl) this.#tempFracEl.textContent = `.${frac}`;
    }

    #doSendTemp() {
      this.config.card?.sendCommand("set_temperature", { temperature: this.#targetTemp });
    }

    #toggleDropdown(feat) {
      if (this.#activeFeat === feat) { this.#closeDropdown(); return; }
      this.#activeFeat = feat;

      let options = [], current = null, command = "", dataKey = "";
      switch (feat) {
        case "mode":   options = this.#hvacModes;   current = this.#hvacMode;   command = "set_hvac_mode";   dataKey = "hvac_mode";   break;
        case "fan":    options = this.#fanModes;    current = this.#fanMode;    command = "set_fan_mode";    dataKey = "fan_mode";    break;
        case "preset": options = this.#presetModes; current = this.#presetMode; command = "set_preset_mode"; dataKey = "preset_mode"; break;
        case "swing":  options = this.#swingModes;  current = this.#swingMode;  command = "set_swing_mode";  dataKey = "swing_mode";  break;
      }
      if (!options.length || !this.#dropdown) return;

      this.#dropdown.innerHTML = options.map(opt => /* html */`
        <button class="shroom-climate-dd-option" data-active="${opt === current}" role="option"
          aria-selected="${opt === current}" type="button">
          ${_esc(_capitalize(opt))}
        </button>
      `).join("");

      this.#dropdown.querySelectorAll(".shroom-climate-dd-option").forEach((btn, i) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.config.card?.sendCommand(command, { [dataKey]: options[i] });
          this.#closeDropdown();
        });
      });

      const featBtn = this.root.querySelector(`[data-feat="${feat}"]`);
      if (featBtn) featBtn.setAttribute("aria-expanded", "true");
      this.#dropdown.removeAttribute("hidden");

      const onOutside = (e) => {
        const path = e.composedPath();
        if (!path.some(el => el === this.root || el === this.root.host)) {
          this.#closeDropdown();
        }
      };
      this.#outsideListener = onOutside;
      document.addEventListener("pointerdown", onOutside, true);
    }

    #closeDropdown() {
      this.#activeFeat = null;
      this.#dropdown?.setAttribute("hidden", "");
      this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(btn => {
        btn.setAttribute("aria-expanded", "false");
      });
      if (this.#outsideListener) {
        document.removeEventListener("pointerdown", this.#outsideListener, true);
        this.#outsideListener = null;
      }
    }

    #updateFeatureButtons() {
      const set = (btn, val) => {
        if (!btn) return;
        const el = btn.querySelector(".shroom-climate-feat-value");
        if (el) el.textContent = _capitalize(val ?? "None");
      };
      set(this.#modeBtn, this.#hvacMode);
      set(this.#fanBtn, this.#fanMode);
      set(this.#presetBtn, this.#presetMode);
      set(this.#swingBtn, this.#swingMode);
    }

    applyState(state, attributes) {
      this.#lastAttrs = { ...attributes };
      this.#hvacMode = state;
      this.#fanMode = attributes.fan_mode ?? null;
      this.#presetMode = attributes.preset_mode ?? null;
      this.#swingMode = attributes.swing_mode ?? null;
      this.#currentTemp = attributes.current_temperature ?? null;

      const isOff = state === "off";
      if (this.#climateBarEl) this.#climateBarEl.hidden = isOff;
      _applyIconColor(this.#iconEl, "climate", !isOff);

      if (attributes.temperature !== undefined) {
        this.#targetTemp = attributes.temperature;
        this.#updateTempDisplay();
      }

      if (this.#secondaryEl) {
        const action = attributes.hvac_action ?? state;
        const tempStr = this.#currentTemp != null ? ` - ${this.#currentTemp} ${this.#unit}` : "";
        this.#secondaryEl.textContent = _capitalize(action) + tempStr;
      }

      this.#updateFeatureButtons();

      const action = attributes.hvac_action ?? state;
      this.announceState(`${this.def.friendly_name}, ${_capitalize(action)}`);
    }

    predictState(action, data) {
      const attrs = { ...this.#lastAttrs };
      if (action === "set_hvac_mode" && data.hvac_mode) {
        return { state: data.hvac_mode, attributes: attrs };
      }
      if (action === "set_temperature" && data.temperature !== undefined) {
        return { state: this.#hvacMode, attributes: { ...attrs, temperature: data.temperature } };
      }
      if (action === "set_fan_mode" && data.fan_mode) {
        return { state: this.#hvacMode, attributes: { ...attrs, fan_mode: data.fan_mode } };
      }
      if (action === "set_preset_mode" && data.preset_mode) {
        return { state: this.#hvacMode, attributes: { ...attrs, preset_mode: data.preset_mode } };
      }
      if (action === "set_swing_mode" && data.swing_mode) {
        return { state: this.#hvacMode, attributes: { ...attrs, swing_mode: data.swing_mode } };
      }
      return null;
    }
  }

  // ===========================================================================
  // MediaPlayerCard
  // ===========================================================================

  const MEDIA_PLAYER_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_SLIDER}
    ${SHROOM_BUTTONS}
    ${SHROOM_COMPANIONS}

    .shroom-mp-bar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-mp-bar[hidden] { display: none; }
    .shroom-mp-transport-view {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-mp-transport-view[hidden] { display: none; }
    .shroom-mp-volume-view {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-mp-volume-view[hidden] { display: none; }
    .shroom-mp-volume-view .shroom-slider-wrap { flex: 1; }
    .shroom-mp-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-mp-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-mp-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .shroom-mp-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-mp-slider-bg {
      background: var(--hrv-ex-shroom-media, #e91e63);
    }
    .shroom-mp-back-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-mp-back-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-mp-back-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-mp-btn,
      .shroom-mp-back-btn { transition: none; }
    }
  `;

  class MediaPlayerCard extends BaseCard {
    #iconEl = null;
    #primaryEl = null;
    #secondaryEl = null;
    #transportView = null;
    #volumeView = null;
    #barEl = null;
    #playBtn = null;
    #prevBtn = null;
    #nextBtn = null;
    #powerBtn = null;
    #volumeBtn = null;
    #slider = null;
    #sliderCover = null;
    #isMuted = false;
    #showingVolume = false;
    #volume = 0;
    #lastState = "idle";
    #lastAttrs = {};
    #sendDebounce;

    constructor(def, root, config, i18n) {
      super(def, root, config, i18n);
      this.#sendDebounce = _debounce(this.#doSendVolume.bind(this), 200);
    }

    render() {
      _applyLayout(this);
      const isWritable = this.def.capabilities === "read-write";
      const features = this.def.supported_features ?? [];
      const hints = this.config.displayHints ?? {};
      const hasPrevNext = features.includes("previous_track");

      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${MEDIA_PLAYER_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${isWritable ? /* html */`
            <div class="shroom-mp-bar" hidden>
              <div class="shroom-mp-transport-view">
                <button class="shroom-mp-btn" data-role="power" type="button" title="Power" aria-label="Power">
                  <span part="power-icon" aria-hidden="true"></span>
                </button>
                ${hasPrevNext ? /* html */`
                  <button class="shroom-mp-btn" data-role="prev" type="button" title="Previous" aria-label="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                ` : ""}
                <button class="shroom-mp-btn" data-role="play" type="button" title="Play" aria-label="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>
                ${hasPrevNext ? /* html */`
                  <button class="shroom-mp-btn" data-role="next" type="button" title="Next" aria-label="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                ` : ""}
                <button class="shroom-mp-btn" data-role="volume" type="button" title="Volume" aria-label="Volume controls">
                  <span part="vol-icon" aria-hidden="true"></span>
                </button>
              </div>
              <div class="shroom-mp-volume-view" hidden>
                  <button class="shroom-mp-btn" data-role="vol-down" type="button" title="Volume down" aria-label="Volume down">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z"/></svg>
                  </button>
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${_esc(this.def.friendly_name)} volume"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                  <button class="shroom-mp-btn" data-role="vol-up" type="button" title="Volume up" aria-label="Volume up">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z"/></svg>
                  </button>
                  <button class="shroom-mp-back-btn" type="button" title="Controls" aria-label="Back to controls">
                    <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                  </button>
                </div>
            </div>
          ` : ""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#primaryEl = this.root.querySelector(".shroom-primary");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#barEl = this.root.querySelector(".shroom-mp-bar");
      this.#transportView = this.root.querySelector(".shroom-mp-transport-view");
      this.#volumeView = this.root.querySelector(".shroom-mp-volume-view");
      this.#playBtn = this.root.querySelector("[data-role=play]");
      this.#prevBtn = this.root.querySelector("[data-role=prev]");
      this.#nextBtn = this.root.querySelector("[data-role=next]");
      this.#powerBtn = this.root.querySelector("[data-role=power]");
      this.#volumeBtn = this.root.querySelector("[data-role=volume]");
      this.#slider = this.root.querySelector(".shroom-slider-input");
      this.#sliderCover = this.root.querySelector(".shroom-slider-cover");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:speaker"), "card-icon");
      this.renderIcon("mdi:play", "play-icon");
      this.renderIcon("mdi:skip-previous", "prev-icon");
      this.renderIcon("mdi:skip-next", "next-icon");
      this.renderIcon("mdi:power", "power-icon");
      this.renderIcon("mdi:volume-high", "vol-icon");

      if (isWritable) {
        this.#playBtn?.addEventListener("click", () => {
          this.config.card?.sendCommand("media_play_pause", {});
        });
        this.#prevBtn?.addEventListener("click", () =>
          this.config.card?.sendCommand("media_previous_track", {}));
        this.#nextBtn?.addEventListener("click", () =>
          this.config.card?.sendCommand("media_next_track", {}));
        this.#powerBtn?.addEventListener("click", () => {
          const isActive = this.#lastState === "playing" || this.#lastState === "paused";
          this.config.card?.sendCommand(isActive ? "turn_off" : "turn_on", {});
        });
        this.#volumeBtn?.addEventListener("click", () => {
          this.#showingVolume = true;
          this.#syncViews();
        });
        const backBtn = this.root.querySelector(".shroom-mp-back-btn");
        backBtn?.addEventListener("click", () => {
          this.#showingVolume = false;
          this.#syncViews();
        });
        const volDown = this.root.querySelector("[data-role=vol-down]");
        volDown?.addEventListener("click", () => {
          this.config.card?.sendCommand("volume_down", {});
        });
        const volUp = this.root.querySelector("[data-role=vol-up]");
        volUp?.addEventListener("click", () => {
          this.config.card?.sendCommand("volume_up", {});
        });
      }

      if (this.#slider) {
        this.#slider.addEventListener("input", () => {
          this.#volume = parseInt(this.#slider.value, 10);
          if (this.#sliderCover) this.#sliderCover.style.left = `${this.#volume}%`;
          this.#sendDebounce();
        });
      }

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    #syncViews() {
      if (this.#transportView) this.#transportView.hidden = this.#showingVolume;
      if (this.#volumeView) this.#volumeView.hidden = !this.#showingVolume;
    }

    #doSendVolume() {
      this.config.card?.sendCommand("volume_set", { volume_level: this.#volume / 100 });
    }

    applyState(state, attributes) {
      this.#lastState = state;
      this.#lastAttrs = attributes;
      const isPlaying = state === "playing";
      const isActive = isPlaying || state === "paused";

      _applyIconColor(this.#iconEl, "media_player", isActive);

      if (this.#barEl) {
        this.#barEl.hidden = !isActive;
      }

      const title = attributes.media_title ?? "";
      const artist = attributes.media_artist ?? "";

      if (this.#primaryEl) {
        this.#primaryEl.textContent = isActive && title ? title : this.def.friendly_name;
      }

      if (this.#secondaryEl) {
        if (isActive) {
          const volStr = this.#volume > 0 ? `${this.#volume}%` : "";
          const parts = [artist, volStr].filter(Boolean);
          this.#secondaryEl.textContent = parts.join(" - ") || _capitalize(state);
        } else {
          this.#secondaryEl.textContent = _capitalize(state);
        }
      }

      if (this.#playBtn) {
        const iconName = isPlaying ? "mdi:pause" : "mdi:play";
        this.renderIcon(iconName, "play-icon");
        const playLabel = isPlaying ? "Pause" : "Play";
        this.#playBtn.title = playLabel;
        this.#playBtn.setAttribute("aria-label", playLabel);
      }

      if (attributes.volume_level !== undefined) {
        this.#volume = Math.round(attributes.volume_level * 100);
        if (this.#slider && !this.isFocused(this.#slider)) {
          this.#slider.value = String(this.#volume);
        }
        if (this.#sliderCover) this.#sliderCover.style.left = `${this.#volume}%`;
      }

      this.#isMuted = !!attributes.is_volume_muted;
      if (this.#volumeBtn) {
        const iconName = this.#isMuted ? "mdi:volume-off" : "mdi:volume-high";
        this.renderIcon(iconName, "vol-icon");
      }

      this.announceState(
        `${this.def.friendly_name}, ${state}${title ? ` - ${title}` : ""}`,
      );
    }

    predictState(action, data) {
      if (action === "media_play_pause") {
        return { state: this.#lastState === "playing" ? "paused" : "playing", attributes: this.#lastAttrs };
      }
      if (action === "volume_mute") {
        return { state: this.#lastState, attributes: { ...this.#lastAttrs, is_volume_muted: !!data.is_volume_muted } };
      }
      if (action === "volume_set") {
        return { state: this.#lastState, attributes: { ...this.#lastAttrs, volume_level: data.volume_level } };
      }
      if (action === "turn_off") {
        return { state: "off", attributes: this.#lastAttrs };
      }
      if (action === "turn_on") {
        return { state: "idle", attributes: this.#lastAttrs };
      }
      return null;
    }
  }

  // ===========================================================================
  // WeatherCard
  // ===========================================================================

  const _COND_PATHS = {
    "sunny":           "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
    "clear-night":     "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
    "partlycloudy":    "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",
    "cloudy":          "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
    "fog":             "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",
    "rainy":           "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",
    "snowy":           "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",
    "lightning":       "M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",
    "windy":           "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
    "exceptional":     "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  };
  const _COND_DEFAULT = _COND_PATHS["cloudy"];
  const _HUMIDITY_PATH = "M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z";
  const _WIND_PATH = "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z";
  const _PRESSURE_PATH = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z";
  const _SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function _condSvg(condition, size) {
    const d = _COND_PATHS[condition] ?? _COND_DEFAULT;
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false"><path d="${d}" fill="currentColor"/></svg>`;
  }

  function _statSvg(path) {
    return `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${path}" fill="currentColor"/></svg>`;
  }

  const WEATHER_STYLES = /* css */`
    ${SHROOM_STATE_ITEM}
    ${SHROOM_COMPANIONS}

    .shroom-weather-body {
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-weather-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .shroom-weather-icon {
      color: var(--hrv-ex-shroom-weather, #ff9800);
      flex-shrink: 0;
      line-height: 0;
    }
    .shroom-weather-temp {
      font-size: 36px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      line-height: 1;
    }
    .shroom-weather-unit {
      font-size: 16px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-weather-stats {
      display: flex;
      justify-content: center;
      gap: 16px;
      width: 100%;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-weather-stat {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-weather-stat svg {
      color: var(--hrv-color-icon, #757575);
      flex-shrink: 0;
    }
    .shroom-forecast-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
      border-radius: 12px;
      background: none;
      font-size: 10px;
      font-weight: 500;
      color: var(--hrv-color-text-secondary, #757575);
      cursor: pointer;
      font-family: inherit;
      margin-top: 8px;
    }
    .shroom-forecast-toggle:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-forecast-toggle:empty { display: none; }
    .shroom-forecast-strip {
      width: 100%;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-forecast-strip:empty { display: none; }
    .shroom-forecast-strip[data-mode=daily] {
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly] {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--hrv-color-border, rgba(0,0,0,0.12)) transparent;
      width: 0;
      min-width: 100%;
      padding-bottom: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar {
      height: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar-track {
      background: transparent;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar-thumb {
      background: var(--hrv-color-border, rgba(0,0,0,0.12));
      border-radius: 2px;
    }
    .shroom-forecast-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
      min-width: 42px;
    }
    .shroom-forecast-strip[data-mode=daily] .shroom-forecast-day {
      flex: 1;
      min-width: 0;
    }
    .shroom-forecast-day-name {
      font-size: 10px;
      color: var(--hrv-color-text-secondary, #757575);
      font-weight: 500;
    }
    .shroom-forecast-day svg {
      color: var(--hrv-color-icon, #757575);
    }
    .shroom-forecast-temps {
      font-size: 10px;
      color: var(--hrv-color-text, #212121);
      white-space: nowrap;
    }
    .shroom-forecast-lo {
      color: var(--hrv-color-text-secondary, #757575);
    }
  `;

  class WeatherCard extends BaseCard {
    #iconEl = null;
    #secondaryEl = null;
    #weatherIconEl = null;
    #tempEl = null;
    #humidityEl = null;
    #windEl = null;
    #pressureEl = null;
    #forecastEl = null;
    #toggleEl = null;
    get #forecastMode() { return this.config._forecastMode ?? "daily"; }
    set #forecastMode(v) { this.config._forecastMode = v; }
    #forecastDaily = null;
    #forecastHourly = null;

    render() {
      _applyLayout(this);
      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${WEATHER_STYLES}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${_esc(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-weather-body">
            <div class="shroom-weather-main">
              <span class="shroom-weather-icon">${_condSvg("cloudy", 36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${_statSvg(_HUMIDITY_PATH)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${_statSvg(_WIND_PATH)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${_statSvg(_PRESSURE_PATH)}
                <span data-value>--</span>
              </span>
            </div>
            <button class="shroom-forecast-toggle" type="button" aria-label="Toggle forecast view"></button>
            <div class="shroom-forecast-strip" data-mode="daily" role="list"></div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `;

      this.#iconEl = this.root.querySelector(".shroom-icon-shape");
      this.#secondaryEl = this.root.querySelector(".shroom-secondary");
      this.#weatherIconEl = this.root.querySelector(".shroom-weather-icon");
      this.#tempEl = this.root.querySelector(".shroom-weather-temp");
      this.#humidityEl = this.root.querySelector("[data-stat=humidity] [data-value]");
      this.#windEl = this.root.querySelector("[data-stat=wind] [data-value]");
      this.#pressureEl = this.root.querySelector("[data-stat=pressure] [data-value]");
      this.#forecastEl = this.root.querySelector(".shroom-forecast-strip");
      this.#toggleEl = this.root.querySelector(".shroom-forecast-toggle");

      this.renderIcon(this.resolveIcon(this.def.icon, "mdi:weather-cloudy"), "card-icon");
      _applyIconColor(this.#iconEl, "weather", true);

      this._attachGestureHandlers(this.root.querySelector("[part=card]"));
      this.renderCompanions();
      _applyCompanionTooltips(this.root);
    }

    applyState(state, attributes) {
      const condition = state || "cloudy";

      if (this.#weatherIconEl) {
        this.#weatherIconEl.innerHTML = _condSvg(condition, 36);
      }

      const condLabel = this.i18n.t(`weather.${condition}`) !== `weather.${condition}`
        ? this.i18n.t(`weather.${condition}`)
        : condition.replace(/-/g, " ");

      if (this.#secondaryEl) {
        this.#secondaryEl.textContent = _capitalize(condLabel);
      }

      const temp = attributes.temperature ?? attributes.native_temperature;
      const tempUnit = attributes.temperature_unit ?? "";
      if (this.#tempEl) {
        const unitEl = this.#tempEl.querySelector(".shroom-weather-unit");
        this.#tempEl.firstChild.textContent = temp != null ? Math.round(Number(temp)) : "--";
        if (unitEl) unitEl.textContent = tempUnit ? ` ${tempUnit}` : "";
      }

      if (this.#humidityEl) {
        const h = attributes.humidity;
        this.#humidityEl.textContent = h != null ? `${h}%` : "--";
      }
      if (this.#windEl) {
        const w = attributes.wind_speed;
        const wu = attributes.wind_speed_unit ?? "";
        this.#windEl.textContent = w != null ? `${w} ${wu}`.trim() : "--";
      }
      if (this.#pressureEl) {
        const p = attributes.pressure;
        const pu = attributes.pressure_unit ?? "";
        this.#pressureEl.textContent = p != null ? `${p} ${pu}`.trim() : "--";
      }

      const show = (this.config.displayHints ?? this.def.display_hints ?? {}).show_forecast === true;
      this.#forecastDaily = show ? (attributes.forecast_daily ?? attributes.forecast ?? null) : null;
      this.#forecastHourly = show ? (attributes.forecast_hourly ?? null) : null;

      this.#buildToggle();
      this.#renderActiveForecast();

      this.announceState(
        `${this.def.friendly_name}, ${condLabel}, ${temp != null ? temp : "--"} ${tempUnit}`,
      );
    }

    #buildToggle() {
      if (!this.#toggleEl) return;
      const hasDaily = Array.isArray(this.#forecastDaily) && this.#forecastDaily.length > 0;
      const hasHourly = Array.isArray(this.#forecastHourly) && this.#forecastHourly.length > 0;

      if (!hasDaily && !hasHourly) {
        this.#toggleEl.textContent = "";
        return;
      }
      if (hasDaily && !hasHourly) this.#forecastMode = "daily";
      if (!hasDaily && hasHourly) this.#forecastMode = "hourly";

      if (hasDaily && hasHourly) {
        this.#toggleEl.textContent = this.#forecastMode === "daily" ? "Hourly" : "5-Day";
        this.#toggleEl.onclick = () => {
          this.#forecastMode = this.#forecastMode === "daily" ? "hourly" : "daily";
          this.#buildToggle();
          this.#renderActiveForecast();
        };
      } else {
        this.#toggleEl.textContent = "";
        this.#toggleEl.onclick = null;
      }
    }

    #renderActiveForecast() {
      if (!this.#forecastEl) return;
      const data = this.#forecastMode === "hourly" ? this.#forecastHourly : this.#forecastDaily;
      this.#forecastEl.setAttribute("data-mode", this.#forecastMode);

      if (!Array.isArray(data) || data.length === 0) {
        this.#forecastEl.innerHTML = "";
        return;
      }

      const items = this.#forecastMode === "daily" ? data.slice(0, 5) : data;
      this.#forecastEl.innerHTML = items.map(day => {
        const dt = new Date(day.datetime);
        let label;
        if (this.#forecastMode === "hourly") {
          label = dt.toLocaleTimeString([], { hour: "numeric" });
        } else {
          label = _SHORT_DAYS[dt.getDay()] ?? "";
        }
        const hi = (day.temperature ?? day.native_temperature) != null
          ? Math.round(day.temperature ?? day.native_temperature) : "--";
        const lo = (day.templow ?? day.native_templow) != null
          ? Math.round(day.templow ?? day.native_templow) : null;

        return /* html */`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${_esc(String(label))}</span>
            ${_condSvg(day.condition || "cloudy", 18)}
            <span class="shroom-forecast-temps">
              ${_esc(String(hi))}${lo != null ? `/<span class="shroom-forecast-lo">${_esc(String(lo))}</span>` : ""}
            </span>
          </div>`;
      }).join("");
    }
  }

  // ===========================================================================
  // Badge card
  // ===========================================================================

  const _BADGE_ICON_COLORS = {
    auto: "var(--hrv-color-primary)",
    red: "#ef4444", orange: "#f97316", amber: "#f59e0b", yellow: "#eab308",
    green: "#22c55e", teal: "#14b8a6", cyan: "#06b6d4", blue: "#3b82f6",
    indigo: "#6366f1", purple: "#a855f7", pink: "#ec4899", grey: "#9ca3af",
  };

  const _BADGE_INACTIVE = new Set([
    "off", "unavailable", "unknown", "idle", "closed", "standby", "not_home",
    "locked", "jammed", "locking", "unlocking",
  ]);

  const _BADGE_DOMAIN_FB = {
    light:"mdi:lightbulb",switch:"mdi:toggle-switch",input_boolean:"mdi:toggle-switch",
    fan:"mdi:fan",sensor:"mdi:gauge",binary_sensor:"mdi:radiobox-blank",
    climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",
    timer:"mdi:timer",remote:"mdi:remote",input_number:"mdi:numeric",
    input_select:"mdi:format-list-bulleted",harvest_action:"mdi:play-circle-outline",
  };

  const BADGE_STYLES = /* css */`
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
    }
    [part=badge] {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px 6px 8px;
      border-radius: 14px;
      background: var(--hrv-card-background, var(--hrv-color-surface, #fff));
      box-shadow: var(--hrv-card-shadow, 0 1px 3px rgba(0,0,0,0.1));
      border: none;
      font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
      color: var(--hrv-color-text, #111827);
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      cursor: default;
      transition: box-shadow var(--hrv-transition-speed, 150ms);
      -webkit-backdrop-filter: var(--hrv-card-backdrop-filter, none);
      backdrop-filter: var(--hrv-card-backdrop-filter, none);
    }
    [part=badge-icon] {
      width: 20px; height: 20px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: color var(--hrv-transition-speed, 150ms);
    }
    [part=badge-icon] svg { width: 100%; height: 100%; }
    [part=badge-text] {
      display: flex; flex-direction: column; gap: 1px; min-width: 0;
    }
    [part=badge-name] {
      font-size: 11px;
      font-weight: var(--hrv-font-weight-medium, 500);
      line-height: 1.3;
      overflow: hidden; text-overflow: ellipsis; max-width: 140px;
    }
    [part=badge-state] {
      font-size: 10px;
      line-height: 1.3;
      color: var(--hrv-color-text-secondary, #6b7280);
      overflow: hidden; text-overflow: ellipsis; max-width: 140px;
    }
    [part=badge-text].single [part=badge-name],
    [part=badge-text].single [part=badge-state] {
      font-size: 12px;
    }
    .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
    @media (prefers-reduced-motion: reduce) {
      [part=badge], [part=badge-icon] { transition: none; }
    }
  `;

  class BadgeCard extends BaseCard {
    /** @type {HTMLElement|null} */ #iconEl = null;
    /** @type {HTMLElement|null} */ #stateEl = null;
    /** @type {HTMLElement|null} */ #badgeEl = null;

    render() {
      const hints = this.def.display_hints ?? {};
      const showIcon = hints.badge_show_icon !== false;
      const showName = hints.badge_show_name !== false;
      const showState = hints.badge_show_state !== false;
      const nameCls = showName ? "" : " sr-only";
      const stateCls = showState ? "" : " sr-only";
      const singleLine = (showName && !showState) || (!showName && showState);
      const textCls = singleLine ? " single" : "";
      this.root.innerHTML = /* html */`
        <style>${this.getSharedStyles()}${BADGE_STYLES}</style>
        <div part="badge" aria-label="${_esc(this.def.friendly_name)}" title="${_esc(this.def.friendly_name)}">
          ${showIcon ? '<span part="badge-icon" aria-hidden="true"></span>' : ""}
          <span part="badge-text" class="${textCls}">
            <span part="badge-name" class="${nameCls}">${_esc(this.def.friendly_name)}</span>
            <span part="badge-state" class="${stateCls}" aria-live="polite"></span>
          </span>
        </div>
        ${this.renderAriaLiveHTML()}
      `;
      this.#iconEl = this.root.querySelector("[part=badge-icon]");
      this.#stateEl = this.root.querySelector("[part=badge-state]");
      this.#badgeEl = this.root.querySelector("[part=badge]");
      if (showIcon) {
        const fb = _BADGE_DOMAIN_FB[this.def.domain] ?? "mdi:help-circle";
        this.renderIcon(this.resolveIcon(this.def.icon, fb), "badge-icon");
      }
    }

    applyState(state, attributes) {
      const hints = this.def.display_hints ?? {};
      const colorKey = hints.badge_icon_color ?? "auto";
      const isActive = !_BADGE_INACTIVE.has(state);
      if (this.#iconEl) {
        this.#iconEl.style.color = isActive
          ? (_BADGE_ICON_COLORS[colorKey] ?? _BADGE_ICON_COLORS.auto) : "#9ca3af";
        const fb = _BADGE_DOMAIN_FB[this.def.domain] ?? "mdi:help-circle";
        const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? fb;
        this.renderIcon(this.resolveIcon(rawIcon, fb), "badge-icon");
      }
      const uom = attributes?.unit_of_measurement ?? this.def.unit_of_measurement ?? "";
      const label = this.formatStateLabel(state);
      const stateText = uom ? `${label} ${uom}` : label;
      if (this.#stateEl) this.#stateEl.textContent = stateText;
      if (this.#badgeEl) this.#badgeEl.title = `${this.def.friendly_name}: ${stateText}`;
      this.announceState(`${this.def.friendly_name}, ${state}`);
    }
  }

  // ===========================================================================
  // Registration
  // ===========================================================================

  const _packKey = window.__HARVEST_PACK_ID__ || "shrooms";
  HArvest._packs = HArvest._packs || {};
  HArvest._packs[_packKey] = {
    "light":                LightCard,
    "switch":               SwitchCard,
    "input_boolean":        SwitchCard,
    "sensor":               SensorCard,
    "sensor.temperature":   SensorCard,
    "sensor.humidity":      SensorCard,
    "sensor.battery":       SensorCard,
    "fan":                  FanCard,
    "binary_sensor":        BinarySensorCard,
    "generic":              GenericCard,
    "harvest_action":       HarvestActionCard,
    "input_number":         InputNumberCard,
    "input_select":         InputSelectCard,
    "cover":                CoverCard,
    "remote":               RemoteCard,
    "timer":                TimerCard,
    "climate":              ClimateCard,
    "media_player":         MediaPlayerCard,
    "weather":              WeatherCard,
    "badge":                BadgeCard,
    _capabilities: {
      fan:          { display_modes: ["on-off", "continuous", "stepped", "cycle"] },
      input_number: { display_modes: ["slider", "buttons"] },
      light:        { features: ["brightness", "color_temp", "rgb"] },
      climate:      { features: ["hvac_modes", "presets", "fan_mode", "swing_mode"] },
      cover:        { features: ["position", "tilt"] },
      media_player: { features: ["transport", "volume", "source"] },
    },
  };
})();
