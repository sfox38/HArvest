/**
 * renderers/climate-card.js - Renderer for the "climate" domain.
 *
 * Renders current temperature, HVAC mode, and target temperature controls.
 * Temperature inputs are debounced at 500ms.
 *
 * feature_config provides: min_temp, max_temp, temp_step (from entity).
 * supported_features drives which controls are shown:
 *   "target_temperature"        - single target temp input
 *   "target_temperature_range"  - low/high target temp inputs
 */

import { BaseCard } from "./base-card.js";

const CLIMATE_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    flex-direction: column;
    gap: var(--hrv-spacing-s);
  }

  .hrv-climate-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--hrv-spacing-s);
  }

  .hrv-climate-label {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
  }

  .hrv-climate-temp {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-bold);
    color: var(--hrv-color-text);
  }

  [part=mode-select] {
    flex: 1;
    padding: var(--hrv-spacing-xs) var(--hrv-spacing-s);
    border: 1px solid var(--hrv-color-border);
    border-radius: var(--hrv-radius-s);
    background: var(--hrv-color-surface);
    color: var(--hrv-color-text);
    font-size: var(--hrv-font-size-s);
    font-family: inherit;
    cursor: pointer;
  }

  [part=target-temp-input],
  [part=target-temp-low-input],
  [part=target-temp-high-input] {
    width: 72px;
    padding: var(--hrv-spacing-xs) var(--hrv-spacing-s);
    border: 1px solid var(--hrv-color-border);
    border-radius: var(--hrv-radius-s);
    background: var(--hrv-color-surface);
    color: var(--hrv-color-text);
    font-size: var(--hrv-font-size-s);
    font-family: inherit;
    text-align: center;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }
`;

const HVAC_MODES = ["off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"];

function _esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export class ClimateCard extends BaseCard {
  /** @type {HTMLSelectElement|null}  */ #modeSelect      = null;
  /** @type {HTMLInputElement|null}   */ #targetTempInput = null;
  /** @type {HTMLInputElement|null}   */ #tempLowInput    = null;
  /** @type {HTMLInputElement|null}   */ #tempHighInput   = null;
  /** @type {HTMLElement|null}        */ #currentTempEl   = null;
  /** @type {HTMLElement|null}        */ #stateLabel      = null;
  /** @type {Function}                */ #tempDebounce;
  /** @type {Function}                */ #tempLowDebounce;
  /** @type {Function}                */ #tempHighDebounce;

  constructor(def, root, config, i18n) {
    super(def, root, config, i18n);
    this.#tempDebounce     = this.debounce(this.#sendTargetTemp.bind(this), 500);
    this.#tempLowDebounce  = this.debounce(this.#sendTempLow.bind(this), 500);
    this.#tempHighDebounce = this.debounce(this.#sendTempHigh.bind(this), 500);
  }

  render() {
    const isWritable  = this.def.capabilities === "read-write";
    const hasTarget   = this.def.supported_features?.includes("target_temperature");
    const hasRange    = this.def.supported_features?.includes("target_temperature_range");
    const minTemp     = this.def.feature_config?.min_temp ?? 7;
    const maxTemp     = this.def.feature_config?.max_temp ?? 35;
    const step        = this.def.feature_config?.temp_step ?? 0.5;

    const modeOptions = HVAC_MODES
      .map((m) => `<option value="${m}">${_esc(this.i18n.t(`climate.${m}`) || m)}</option>`)
      .join("");

    this.root.innerHTML = /* html */`
      <style>${this.getSharedStyles()}${CLIMATE_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">
          <div class="hrv-climate-row">
            <span class="hrv-climate-label">Current</span>
            <span part="current-temp" class="hrv-climate-temp">-</span>
          </div>
          <span part="state-label"></span>
          ${isWritable ? /* html */`
            <div class="hrv-climate-row">
              <span class="hrv-climate-label">Mode</span>
              <select part="mode-select" aria-label="HVAC mode">
                ${modeOptions}
              </select>
            </div>
          ` : ""}
          ${isWritable && hasTarget && !hasRange ? /* html */`
            <div class="hrv-climate-row">
              <span class="hrv-climate-label">Target</span>
              <input part="target-temp-input" type="number"
                min="${minTemp}" max="${maxTemp}" step="${step}"
                aria-label="Target temperature">
            </div>
          ` : ""}
          ${isWritable && hasRange ? /* html */`
            <div class="hrv-climate-row">
              <span class="hrv-climate-label">Low</span>
              <input part="target-temp-low-input" type="number"
                min="${minTemp}" max="${maxTemp}" step="${step}"
                aria-label="Target temperature low">
            </div>
            <div class="hrv-climate-row">
              <span class="hrv-climate-label">High</span>
              <input part="target-temp-high-input" type="number"
                min="${minTemp}" max="${maxTemp}" step="${step}"
                aria-label="Target temperature high">
            </div>
          ` : ""}
        </div>
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#modeSelect      = this.root.querySelector("[part=mode-select]");
    this.#targetTempInput = this.root.querySelector("[part=target-temp-input]");
    this.#tempLowInput    = this.root.querySelector("[part=target-temp-low-input]");
    this.#tempHighInput   = this.root.querySelector("[part=target-temp-high-input]");
    this.#currentTempEl   = this.root.querySelector("[part=current-temp]");
    this.#stateLabel      = this.root.querySelector("[part=state-label]");

    this.renderIcon(this.def.icon ?? "mdi:thermostat", "card-icon");

    this.#modeSelect?.addEventListener("change", (e) => {
      this.config.card?.sendCommand("set_hvac_mode", { hvac_mode: e.target.value });
    });

    this.#targetTempInput?.addEventListener("input", (e) => {
      this.#tempDebounce(parseFloat(e.target.value));
    });

    this.#tempLowInput?.addEventListener("input", (e) => {
      this.#tempLowDebounce(parseFloat(e.target.value));
    });

    this.#tempHighInput?.addEventListener("input", (e) => {
      this.#tempHighDebounce(parseFloat(e.target.value));
    });

    this.renderCompanions();
  }

  applyState(state, attributes) {
    if (this.#currentTempEl && attributes.current_temperature !== undefined) {
      this.#currentTempEl.textContent =
        `${attributes.current_temperature}${attributes.unit_of_measurement ?? ""}`;
    }

    if (this.#stateLabel) {
      const hvacAction = attributes.hvac_action;
      this.#stateLabel.textContent = hvacAction
        ? (this.i18n.t(`state.${hvacAction}`) !== `state.${hvacAction}`
            ? this.i18n.t(`state.${hvacAction}`)
            : hvacAction)
        : state;
    }

    if (this.#modeSelect && attributes.hvac_mode !== undefined) {
      this.#modeSelect.value = attributes.hvac_mode;
    }

    if (this.#targetTempInput && attributes.temperature !== undefined) {
      this.#targetTempInput.value = String(attributes.temperature);
    }

    if (this.#tempLowInput && attributes.target_temp_low !== undefined) {
      this.#tempLowInput.value = String(attributes.target_temp_low);
    }

    if (this.#tempHighInput && attributes.target_temp_high !== undefined) {
      this.#tempHighInput.value = String(attributes.target_temp_high);
    }

    // Icon reflects HVAC action.
    const action   = attributes.hvac_action ?? state;
    const iconName = this.def.icon_state_map?.[action]
      ?? this.def.icon
      ?? _hvacIcon(action);
    this.renderIcon(iconName, "card-icon");
  }

  #sendTargetTemp(value) {
    this.config.card?.sendCommand("set_temperature", { temperature: value });
  }

  #sendTempLow(value) {
    this.config.card?.sendCommand("set_temperature", { target_temp_low: value });
  }

  #sendTempHigh(value) {
    this.config.card?.sendCommand("set_temperature", { target_temp_high: value });
  }
}

function _hvacIcon(action) {
  const map = {
    heating:  "mdi:fire",
    cooling:  "mdi:snowflake",
    fan_only: "mdi:fan",
    drying:   "mdi:air-conditioner",
    idle:     "mdi:thermostat",
    off:      "mdi:thermostat",
  };
  return map[action] ?? "mdi:thermostat";
}
