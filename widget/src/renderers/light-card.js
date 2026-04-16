/**
 * renderers/light-card.js - Renderer for the "light" domain.
 *
 * Renders a card with:
 *   - Entity name and icon (updates icon based on icon_state_map or state)
 *   - Toggle button (read-write capability only)
 *   - State label
 *   - Brightness slider (when supported_features includes "brightness")
 *   - Colour temperature slider (when supported_features includes "color_temp")
 *   - Companion zone
 *
 * Slider inputs are debounced at 300ms to avoid flooding the server with
 * turn_on commands while the user is dragging.
 *
 * predictState() handles the "toggle" action for optimistic UI: it flips
 * the current on/off state immediately while the command is in flight.
 */

import { BaseCard } from "./base-card.js";

// Light-specific CSS
const LIGHT_CARD_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    flex-direction: column;
    gap: var(--hrv-spacing-s);
  }

  [part=toggle-button] {
    width: 100%;
    padding: var(--hrv-spacing-s) var(--hrv-spacing-m);
    border: none;
    border-radius: var(--hrv-radius-m);
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
    font-size: var(--hrv-font-size-s);
    font-weight: var(--hrv-font-weight-medium);
    font-family: inherit;
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed);
  }

  [part=toggle-button]:hover { opacity: 0.88; }
  [part=toggle-button]:active { opacity: 0.75; }

  [part=toggle-button][aria-pressed=true] {
    background: var(--hrv-color-state-on);
  }

  [part=toggle-button][aria-pressed=false] {
    background: var(--hrv-color-state-off);
    color: var(--hrv-color-text);
  }

  [part=brightness-slider],
  [part=color-temp-slider] {
    width: 100%;
    accent-color: var(--hrv-color-primary);
    cursor: pointer;
  }

  .hrv-slider-label {
    display: flex;
    justify-content: space-between;
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    margin-bottom: 2px;
  }

  [part=card-icon] svg {
    transition: color var(--hrv-transition-speed);
  }

  :host([data-harvest-state=live]) [part=card-icon][data-on=true] {
    color: var(--hrv-color-state-on);
  }

  :host([data-harvest-state=live]) [part=card-icon][data-on=false] {
    color: var(--hrv-color-state-off);
  }
`;

export class LightCard extends BaseCard {
  /** @type {HTMLButtonElement|null} */   #toggleBtn         = null;
  /** @type {HTMLInputElement|null}  */   #brightnessSlider  = null;
  /** @type {HTMLInputElement|null}  */   #colorTempSlider   = null;
  /** @type {HTMLElement|null}       */   #stateLabel        = null;
  /** @type {HTMLElement|null}       */   #brightnessValue   = null;
  /** @type {HTMLElement|null}       */   #colorTempValue    = null;
  /** @type {Function}               */   #brightnessDebounce;
  /** @type {Function}               */   #colorTempDebounce;

  constructor(def, root, config, i18n) {
    super(def, root, config, i18n);
    this.#brightnessDebounce = this.debounce(this.#sendBrightness.bind(this), 300);
    this.#colorTempDebounce  = this.debounce(this.#sendColorTemp.bind(this), 300);
  }

  render() {
    const isWritable     = this.def.capabilities === "read-write";
    const hasBrightness  = this.def.supported_features?.includes("brightness");
    const hasColorTemp   = this.def.supported_features?.includes("color_temp");
    const minCt          = this.def.feature_config?.min_color_temp ?? 153;
    const maxCt          = this.def.feature_config?.max_color_temp ?? 500;

    this.root.innerHTML = /* html */`
      <style>${this.getSharedStyles()}${LIGHT_CARD_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">
          ${isWritable ? /* html */`
            <button part="toggle-button" type="button"></button>
          ` : ""}
          <span part="state-label"></span>
          ${isWritable && hasBrightness ? /* html */`
            <div>
              <div class="hrv-slider-label">
                <span>${_esc(this.i18n.t("action.increase"))} / ${_esc(this.i18n.t("action.decrease"))}</span>
                <span part="brightness-value">-</span>
              </div>
              <input part="brightness-slider" type="range" min="0" max="255"
                aria-label="Brightness">
            </div>
          ` : ""}
          ${isWritable && hasColorTemp ? /* html */`
            <div>
              <div class="hrv-slider-label">
                <span>Color temp</span>
                <span part="color-temp-value">-</span>
              </div>
              <input part="color-temp-slider" type="range"
                min="${minCt}" max="${maxCt}"
                aria-label="Colour temperature">
            </div>
          ` : ""}
        </div>
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    // Cache element references.
    this.#toggleBtn        = this.root.querySelector("[part=toggle-button]");
    this.#brightnessSlider = this.root.querySelector("[part=brightness-slider]");
    this.#colorTempSlider  = this.root.querySelector("[part=color-temp-slider]");
    this.#stateLabel       = this.root.querySelector("[part=state-label]");
    this.#brightnessValue  = this.root.querySelector("[part=brightness-value]");
    this.#colorTempValue   = this.root.querySelector("[part=color-temp-value]");

    // Initial icon.
    this.renderIcon(this.def.icon ?? "mdi:lightbulb", "card-icon");

    // Wire up events.
    if (this.#toggleBtn) {
      this.#toggleBtn.addEventListener("click", () => {
        this.config.card?.sendCommand("toggle", {});
      });
    }

    if (this.#brightnessSlider) {
      this.#brightnessSlider.addEventListener("input", (e) => {
        this.#brightnessDebounce(parseInt(e.target.value, 10));
      });
    }

    if (this.#colorTempSlider) {
      this.#colorTempSlider.addEventListener("input", (e) => {
        this.#colorTempDebounce(parseInt(e.target.value, 10));
      });
    }

    this.renderCompanions();
  }

  applyState(state, attributes) {
    const isOn = state === "on";
    const isUnavailable = state === "unavailable" || state === "unknown";

    // Toggle button.
    if (this.#toggleBtn) {
      const label = this.i18n.t(isOn ? "state.on" : "state.off");
      this.#toggleBtn.textContent = label;
      this.#toggleBtn.setAttribute("aria-pressed", String(isOn));
      this.#toggleBtn.setAttribute(
        "aria-label",
        `${this.def.friendly_name} - ${this.i18n.t("action.toggle")}, ` +
        `${this.i18n.t("action.currently")} ${label}`,
      );
      this.#toggleBtn.disabled = isUnavailable;
    }

    // State label (shown for read-only capability).
    if (this.#stateLabel) {
      this.#stateLabel.textContent = this.i18n.t(`state.${state}`) !== `state.${state}`
        ? this.i18n.t(`state.${state}`)
        : state;
    }

    // Brightness slider.
    if (this.#brightnessSlider && attributes.brightness !== undefined) {
      this.#brightnessSlider.value = String(attributes.brightness);
      if (this.#brightnessValue) {
        this.#brightnessValue.textContent =
          `${Math.round((attributes.brightness / 255) * 100)}%`;
      }
    }

    // Colour temperature slider.
    if (this.#colorTempSlider && attributes.color_temp !== undefined) {
      this.#colorTempSlider.value = String(attributes.color_temp);
      if (this.#colorTempValue) {
        this.#colorTempValue.textContent = `${attributes.color_temp} K`;
      }
    }

    // Icon: prefer icon_state_map, fall back to entity icon, then domain default.
    const iconName = this.def.icon_state_map?.[state]
      ?? this.def.icon
      ?? (isOn ? "mdi:lightbulb" : "mdi:lightbulb-outline");
    this.renderIcon(iconName, "card-icon");

    // Colour the icon container for sighted feedback.
    const iconEl = this.root.querySelector("[part=card-icon]");
    if (iconEl) iconEl.setAttribute("data-on", String(isOn));
  }

  predictState(action, _data) {
    if (action !== "toggle") return null;

    const currentPressed = this.#toggleBtn?.getAttribute("aria-pressed");
    const currentlyOn    = currentPressed === "true";
    return { state: currentlyOn ? "off" : "on", attributes: {} };
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  #sendBrightness(value) {
    this.config.card?.sendCommand("turn_on", { brightness: value });
  }

  #sendColorTemp(value) {
    this.config.card?.sendCommand("turn_on", { color_temp: value });
  }
}

// ---------------------------------------------------------------------------
// Utility: escape HTML special characters for safe insertion in innerHTML.
// ---------------------------------------------------------------------------

function _esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
