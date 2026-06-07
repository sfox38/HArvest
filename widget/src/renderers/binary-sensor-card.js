/**
 * renderers/binary-sensor-card.js - Renderer for binary_sensor entities.
 *
 * Displays on/off state with a coloured indicator. Always read-only -
 * binary_sensor has no entries in ALLOWED_SERVICES.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const BINARY_SENSOR_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--hrv-spacing-xs);
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    text-align: center;
  }
`;


export class BinarySensorCard extends BaseCard {
  static staleOnMount = true;

  /** @type {HTMLElement|null} */ #stateLabel = null;
  /** @type {HTMLElement|null} */ #rowValue   = null;

  render() {
    this.root.innerHTML = /* html */`
      <style>${BINARY_SENSOR_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          <span part="row-control"><span part="row-value"></span></span>
        </div>
        <div part="card-body">
          <span part="state-label" aria-live="polite">-</span>
        </div>
        ${this.renderHistoryZoneHTML()}
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#stateLabel = this.root.querySelector("[part=state-label]");
    this.#rowValue   = this.root.querySelector("[part=row-value]");

    this.renderIcon(
      this.resolveIcon(this.def.icon, "mdi:checkbox-blank-circle-outline"),
      "card-icon",
    );
    this.renderCompanions();
    this._attachGestureHandlers(this.root.querySelector("[part=card]"));
  }

  applyState(state, _attributes) {
    const isOn = state === "on";
    const label = this.formatStateLabel(state);

    if (this.#stateLabel) this.#stateLabel.textContent = label;
    if (this.#rowValue) this.#rowValue.textContent = label;

    const defaultIcon = isOn ? "mdi:checkbox-blank-circle" : "mdi:checkbox-blank-circle-outline";
    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? defaultIcon;
    this.renderIcon(this.resolveIcon(rawIcon, defaultIcon), "card-icon");

    this.announceState(`${this.def.friendly_name}, ${label}`);
  }
}
