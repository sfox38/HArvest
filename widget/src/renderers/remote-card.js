/**
 * renderers/remote-card.js - Renderer for the "remote" domain.
 *
 * Single full-width button. Button label shows the current state.
 * Tapping fires send_command with the configured command (default "power").
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const REMOTE_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--hrv-spacing-s);
  }

  [part=command-button] {
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

  [part=command-button]:hover  { opacity: 0.88; }
  [part=command-button]:active { opacity: 0.75; }
  [part=command-button]:disabled { opacity: 0.4; cursor: not-allowed; }

  [part=card] [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    text-align: center;
  }

  [part=card][data-readonly=true] [part=card-body] {
    justify-content: center;
  }
`;


export class RemoteCard extends BaseCard {
  /** @type {HTMLButtonElement|null} */ #commandBtn = null;
  /** @type {HTMLElement|null}       */ #stateLabel = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";

    this.root.innerHTML = /* html */`
      <style>${REMOTE_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">
          ${isWritable ? /* html */`
            <button part="command-button" type="button"
              aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("action.send") !== "action.send" ? this.i18n.t("action.send") : "Send")}">
            </button>
          ` : `<span part="state-label"></span>`}
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#commandBtn = this.root.querySelector("[part=command-button]");
    this.#stateLabel = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.resolveIcon(this.def.icon, "mdi:remote"), "card-icon");

    this._attachGestureHandlers(this.#commandBtn, {
      onTap: () => {
        const tap  = this.config.gestureConfig?.tap;
        if (tap) { this._runAction(tap); return; }
        const cmd    = this.config.tapAction?.data?.command ?? "power";
        const device = this.config.tapAction?.data?.device;
        const data   = device ? { command: cmd, device } : { command: cmd };
        this.config.card?.sendCommand("send_command", data);
      },
    });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const label = this.i18n.t(`state.${state}`) !== `state.${state}`
      ? this.i18n.t(`state.${state}`)
      : state;

    if (this.#commandBtn) {
      this.#commandBtn.textContent = label;
      this.#commandBtn.disabled = state === "unavailable" || state === "unknown";
    }
    if (this.#stateLabel) {
      this.#stateLabel.textContent = label;
    }

    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? "mdi:remote";
    this.renderIcon(this.resolveIcon(rawIcon, "mdi:remote"), "card-icon");

    this.announceState(`${this.def.friendly_name}, ${label}`);
  }
}
