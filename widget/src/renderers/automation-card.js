/**
 * renderers/automation-card.js - Renderer for the "automation" domain.
 *
 * Trigger button plus a state-aware enable/disable toggle.
 * staleOnMount is false: authoritative state required before rendering.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const AUTOMATION_CARD_STYLES = /* css */`
  [part=card-body] {
    margin-top: var(--hrv-spacing-xs);
    display: flex;
    flex-direction: column;
    gap: var(--hrv-spacing-s);
  }

  [part=state-label] {
    display: none;
  }

  [part=card][data-readonly=true] [part=state-label] {
    display: block;
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    text-align: center;
  }

  [part=trigger-button],
  [part=enable-toggle] {
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
    transition: opacity var(--hrv-transition-speed), transform 80ms;
  }
  [part=trigger-button]:hover  { opacity: 0.88; }
  [part=trigger-button]:active { opacity: 0.75; transform: scale(0.98); }
  [part=trigger-button]:disabled { opacity: 0.45; cursor: not-allowed; }

  [part=enable-toggle] {
    background: var(--hrv-color-state-off);
    color: var(--hrv-color-text);
  }
  [part=enable-toggle][aria-pressed=true] {
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
  }
  [part=enable-toggle]:hover  { opacity: 0.88; }
  [part=enable-toggle]:active { opacity: 0.75; transform: scale(0.98); }
  [part=enable-toggle]:disabled { opacity: 0.45; cursor: not-allowed; }

`;

const AUTOMATION_ROW_STYLES = /* css */`
  [part=row-trigger-btn] {
    padding: 2px var(--hrv-spacing-s);
    border: none;
    border-radius: var(--hrv-radius-s);
    font-size: var(--hrv-font-size-xs);
    font-weight: var(--hrv-font-weight-medium);
    font-family: inherit;
    cursor: pointer;
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
    transition: opacity var(--hrv-transition-speed);
  }
  [part=row-trigger-btn]:hover  { opacity: 0.88; }
  [part=row-trigger-btn]:active { opacity: 0.75; }
  [part=row-trigger-btn]:disabled { opacity: 0.4; cursor: not-allowed; }
`;


export class AutomationCard extends BaseCard {
  static staleOnMount = false;

  /** @type {HTMLButtonElement|null} */ #triggerBtn    = null;
  /** @type {HTMLButtonElement|null} */ #rowTriggerBtn = null;
  /** @type {HTMLButtonElement|null} */ #enableToggle  = null;
  /** @type {HTMLElement|null}       */ #stateLabel    = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";
    const triggerLabel = this.i18n.t("action.trigger") !== "action.trigger"
      ? this.i18n.t("action.trigger")
      : "Trigger";

    this.root.innerHTML = /* html */`
      <style>${AUTOMATION_CARD_STYLES}${AUTOMATION_ROW_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          ${isWritable ? `<span part="row-control"><button part="row-trigger-btn" type="button">${_esc(triggerLabel)}</button></span>` : ""}
        </div>
        <div part="card-body">
          ${isWritable ? `<button part="trigger-button" type="button">${_esc(triggerLabel)}</button><button part="enable-toggle" type="button"></button>` : `<span part="state-label"></span>`}
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#triggerBtn    = this.root.querySelector("[part=trigger-button]");
    this.#rowTriggerBtn = this.root.querySelector("[part=row-trigger-btn]");
    this.#enableToggle  = this.root.querySelector("[part=enable-toggle]");
    this.#stateLabel    = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.resolveIcon(this.def.icon, "mdi:robot"), "card-icon");

    const onTrigger = () => {
      const tap = this.config.gestureConfig?.tap;
      if (tap) { this._runAction(tap); return; }
      this.config.card?.sendCommand("trigger", {});
    };
    if (this.#triggerBtn)    this._attachGestureHandlers(this.#triggerBtn, { onTap: onTrigger });
    if (this.#rowTriggerBtn) this._attachGestureHandlers(this.#rowTriggerBtn, { onTap: onTrigger });
    const onEnableToggle = () => {
      const isOn = this.#enableToggle?.getAttribute("aria-pressed") === "true";
      this.config.card?.sendCommand(isOn ? "turn_off" : "turn_on", {});
    };
    if (this.#enableToggle) this._attachGestureHandlers(this.#enableToggle, { onTap: onEnableToggle });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const isUnavailable = state === "unavailable" || state === "unknown";
    const isOn = state === "on";
    if (this.#triggerBtn)    this.#triggerBtn.disabled    = isUnavailable;
    if (this.#rowTriggerBtn) this.#rowTriggerBtn.disabled = isUnavailable;
    if (this.#enableToggle) {
      this.#enableToggle.disabled = isUnavailable;
      this.#enableToggle.textContent = isOn ? "Enabled" : "Disabled";
      this.#enableToggle.setAttribute("aria-pressed", String(isOn));
      this.#enableToggle.setAttribute("aria-label", `${this.def.friendly_name} - ${isOn ? "Disable" : "Enable"}`);
    }

    if (this.#stateLabel) {
      this.#stateLabel.textContent = this.formatStateLabel(state);
    }

    const defaultIcon = state === "on" ? "mdi:robot" : "mdi:robot-off";
    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? defaultIcon;
    this.renderIcon(this.resolveIcon(rawIcon, defaultIcon), "card-icon");

    this.announceState(`${this.def.friendly_name}, ${state === "on" ? "enabled" : "disabled"}`);
  }

  predictState(action, _data) {
    if (action === "turn_on") return { state: "on", attributes: {} };
    if (action === "turn_off") return { state: "off", attributes: {} };
    return null;
  }
}
