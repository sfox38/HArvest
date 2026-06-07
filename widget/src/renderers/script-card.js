/**
 * renderers/script-card.js - Renderer for the "script" domain.
 *
 * Displays a single Run button. When the script is running (state "on"),
 * the button shows a pulsing indicator and is temporarily disabled.
 * Service data pre-configured in the token (def.service_data) is passed
 * with the turn_on command - the widget never prompts the user for values.
 *
 * staleOnMount is false: we do not want a cached running/off state shown
 * before the server confirms current state.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const SCRIPT_CARD_STYLES = /* css */`
  [part=card-body] {
    margin-top: var(--hrv-spacing-xs);
  }

  [part=run-button] {
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

  [part=run-button]:hover  { opacity: 0.88; }
  [part=run-button]:active { opacity: 0.75; transform: scale(0.98); }
  [part=run-button]:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  [part=run-button][data-running=true] {
    background: var(--hrv-color-state-on);
  }

  @keyframes hrv-script-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }

  [part=run-button][data-running=true] {
    animation: hrv-script-pulse 1.2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    [part=run-button][data-running=true] {
      animation: none;
    }
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    margin-top: var(--hrv-spacing-xs);
    display: block;
    text-align: center;
  }

  [part=card][data-readonly=true] [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    margin-top: 0;
  }
`;

const SCRIPT_ROW_STYLES = /* css */`
  [part=row-run-btn] {
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
  [part=row-run-btn]:hover  { opacity: 0.88; }
  [part=row-run-btn]:active { opacity: 0.75; }
  [part=row-run-btn]:disabled { opacity: 0.4; cursor: not-allowed; }
`;


export class ScriptCard extends BaseCard {
  static staleOnMount = false;

  /** @type {HTMLButtonElement|null} */ #runBtn    = null;
  /** @type {HTMLButtonElement|null} */ #rowRunBtn = null;
  /** @type {HTMLElement|null}       */ #stateLabel = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";
    const runLabel = this.i18n.t("action.run") !== "action.run"
      ? this.i18n.t("action.run")
      : "Run";

    this.root.innerHTML = /* html */`
      <style>${SCRIPT_CARD_STYLES}${SCRIPT_ROW_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          ${isWritable ? `<span part="row-control"><button part="row-run-btn" type="button" aria-label="${_esc(this.def.friendly_name)}">${_esc(runLabel)}</button></span>` : ""}
        </div>
        <div part="card-body">
          ${isWritable ? /* html */`
            <button part="run-button" type="button" aria-label="${_esc(this.def.friendly_name)}">
              ${_esc(runLabel)}
            </button>
          ` : ""}
          <span part="state-label"></span>
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#runBtn    = this.root.querySelector("[part=run-button]");
    this.#rowRunBtn = this.root.querySelector("[part=row-run-btn]");
    this.#stateLabel = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.resolveIcon(this.def.icon, "mdi:script-text-play"), "card-icon");

    const onRun = () => {
      const tap = this.config.gestureConfig?.tap;
      if (tap) { this._runAction(tap); return; }
      this.config.card?.sendCommand("turn_on", this.def.service_data ?? {});
    };
    if (this.#runBtn)    this._attachGestureHandlers(this.#runBtn, { onTap: onRun });
    if (this.#rowRunBtn) this._attachGestureHandlers(this.#rowRunBtn, { onTap: onRun });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const isRunning     = state === "on";
    const isUnavailable = state === "unavailable" || state === "unknown";

    const isReadOnly = this.def.capabilities !== "read-write";
    const stateText = isRunning
      ? (this.i18n.t("state.running") !== "state.running" ? this.i18n.t("state.running") : "Running")
      : isUnavailable
        ? (this.i18n.t(`state.${state}`) !== `state.${state}` ? this.i18n.t(`state.${state}`) : state)
        : isReadOnly
          ? this.formatStateLabel(state)
          : "";

    if (this.#stateLabel) this.#stateLabel.textContent = stateText;

    if (this.#runBtn) {
      this.#runBtn.setAttribute("data-running", String(isRunning));
      this.#runBtn.disabled = isRunning || isUnavailable;
    }
    if (this.#rowRunBtn) {
      this.#rowRunBtn.disabled = isRunning || isUnavailable;
    }

    const defaultIcon = isRunning ? "mdi:script-text" : "mdi:script-text-play";
    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? defaultIcon;
    this.renderIcon(this.resolveIcon(rawIcon, defaultIcon), "card-icon");

    this.announceState(`${this.def.friendly_name}, ${stateText || state}`);
  }
}
