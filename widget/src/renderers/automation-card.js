/**
 * renderers/automation-card.js - Renderer for the "automation" domain.
 *
 * Shows a Trigger button (fires the automation regardless of enabled state)
 * and an enable/disable toggle (turn_on/turn_off). staleOnMount is false
 * because we need the authoritative enabled/disabled state before rendering.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const AUTOMATION_CARD_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    gap: var(--hrv-spacing-xs);
    margin-top: var(--hrv-spacing-xs);
  }

  [part=trigger-button] {
    flex: 1;
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
    padding: var(--hrv-spacing-s) var(--hrv-spacing-m);
    border: 1px solid var(--hrv-color-border);
    border-radius: var(--hrv-radius-m);
    background: transparent;
    color: var(--hrv-color-text-primary);
    font-size: var(--hrv-font-size-s);
    font-family: inherit;
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed);
  }
  [part=enable-toggle]:hover  { opacity: 0.88; }
  [part=enable-toggle]:active { opacity: 0.75; }
  [part=enable-toggle]:disabled { opacity: 0.45; cursor: not-allowed; }
  [part=enable-toggle][aria-pressed=true] {
    background: var(--hrv-color-state-on);
    color: var(--hrv-color-on-primary);
    border-color: transparent;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    margin-top: var(--hrv-spacing-xs);
    display: block;
    text-align: center;
  }
`;

const AUTOMATION_ROW_STYLES = /* css */`
  [part=row-control] {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  [part=row-trigger-btn],
  [part=row-enable-btn] {
    padding: 2px var(--hrv-spacing-s);
    border: none;
    border-radius: var(--hrv-radius-s);
    font-size: var(--hrv-font-size-xs);
    font-weight: var(--hrv-font-weight-medium);
    font-family: inherit;
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed);
  }

  [part=row-trigger-btn] {
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
  }

  [part=row-enable-btn] {
    background: transparent;
    color: var(--hrv-color-text-primary);
    border: 1px solid var(--hrv-color-border);
  }
  [part=row-enable-btn][aria-pressed=true] {
    background: var(--hrv-color-state-on);
    color: var(--hrv-color-on-primary);
    border-color: transparent;
  }

  [part=row-trigger-btn]:hover,
  [part=row-enable-btn]:hover { opacity: 0.88; }
  [part=row-trigger-btn]:disabled,
  [part=row-enable-btn]:disabled { opacity: 0.4; cursor: not-allowed; }
`;


export class AutomationCard extends BaseCard {
  static staleOnMount = false;

  /** @type {HTMLButtonElement|null} */ #triggerBtn    = null;
  /** @type {HTMLButtonElement|null} */ #enableToggle  = null;
  /** @type {HTMLButtonElement|null} */ #rowTriggerBtn = null;
  /** @type {HTMLButtonElement|null} */ #rowEnableBtn  = null;
  /** @type {HTMLElement|null}       */ #stateLabel    = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";

    const triggerLabel = this.i18n.t("action.trigger") !== "action.trigger"
      ? this.i18n.t("action.trigger")
      : "Trigger";
    const enableLabel = this.i18n.t("action.enable") !== "action.enable"
      ? this.i18n.t("action.enable")
      : "On";

    this.root.innerHTML = /* html */`
      <style>${AUTOMATION_CARD_STYLES}${AUTOMATION_ROW_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          ${isWritable ? /* html */`
            <span part="row-control">
              <button part="row-trigger-btn" type="button">${_esc(triggerLabel)}</button>
              <button part="row-enable-btn" type="button" aria-pressed="false">${_esc(enableLabel)}</button>
            </span>
          ` : ""}
        </div>
        <div part="card-body">
          ${isWritable ? /* html */`
            <button part="trigger-button" type="button">${_esc(triggerLabel)}</button>
            <button part="enable-toggle" type="button" aria-pressed="false">${_esc(enableLabel)}</button>
          ` : ""}
        </div>
        <span part="state-label"></span>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#triggerBtn    = this.root.querySelector("[part=trigger-button]");
    this.#enableToggle  = this.root.querySelector("[part=enable-toggle]");
    this.#rowTriggerBtn = this.root.querySelector("[part=row-trigger-btn]");
    this.#rowEnableBtn  = this.root.querySelector("[part=row-enable-btn]");
    this.#stateLabel    = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.def.icon ?? "mdi:robot", "card-icon");

    const onTrigger = () => {
      const tap = this.config.gestureConfig?.tap;
      if (tap) { this._runAction(tap); return; }
      this.config.card?.sendCommand("trigger", {});
    };

    const onToggleEnable = () => {
      const isEnabled = this.#enableToggle?.getAttribute("aria-pressed") === "true";
      this.config.card?.sendCommand(isEnabled ? "turn_off" : "turn_on", {});
    };

    if (this.#triggerBtn)    this._attachGestureHandlers(this.#triggerBtn, { onTap: onTrigger });
    if (this.#enableToggle)  this._attachGestureHandlers(this.#enableToggle, { onTap: onToggleEnable });
    if (this.#rowTriggerBtn) this._attachGestureHandlers(this.#rowTriggerBtn, { onTap: onTrigger });
    if (this.#rowEnableBtn)  this._attachGestureHandlers(this.#rowEnableBtn, { onTap: onToggleEnable });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const isOn          = state === "on";
    const isUnavailable = state === "unavailable" || state === "unknown";

    const enableLabel = isOn
      ? (this.i18n.t("action.disable") !== "action.disable" ? this.i18n.t("action.disable") : "On")
      : (this.i18n.t("action.enable") !== "action.enable"  ? this.i18n.t("action.enable")  : "Off");

    const stateText = isUnavailable ? state : "";
    if (this.#stateLabel) this.#stateLabel.textContent = stateText;

    const setToggle = (btn) => {
      if (!btn) return;
      btn.setAttribute("aria-pressed", String(isOn));
      btn.textContent = enableLabel;
      btn.disabled = isUnavailable;
    };
    setToggle(this.#enableToggle);
    setToggle(this.#rowEnableBtn);

    if (this.#triggerBtn)    this.#triggerBtn.disabled    = isUnavailable;
    if (this.#rowTriggerBtn) this.#rowTriggerBtn.disabled = isUnavailable;

    const iconName = this.def.icon_state_map?.[state]
      ?? this.def.icon
      ?? (isOn ? "mdi:robot" : "mdi:robot-off");
    this.renderIcon(iconName, "card-icon");

    this.announceState(`${this.def.friendly_name}, ${isOn ? "enabled" : "disabled"}`);
  }
}
