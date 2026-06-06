/**
 * renderers/button-card.js - Renderer for the "button" domain.
 *
 * A momentary press button. The entity has no meaningful ongoing state -
 * it transitions to "unavailable" only when the device is offline.
 * staleOnMount is false because we want the button to be ready to press
 * rather than showing a potentially stale "unavailable" status.
 *
 * Service: button.press (no parameters)
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const BUTTON_CARD_STYLES = /* css */`
  [part=card-body] {
    margin-top: var(--hrv-spacing-xs);
  }

  [part=press-button] {
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

  [part=press-button]:hover  { opacity: 0.88; }
  [part=press-button]:active { opacity: 0.75; transform: scale(0.98); }
  [part=press-button]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  [part=press-button][data-pressed=true] {
    opacity: 0.55;
  }

  [part=card][data-readonly=true] [part=card-body] {
    display: flex;
    justify-content: center;
  }

  [part=card][data-readonly=true] [part=state-label] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }

  [part=state-label] {
    display: none;
  }

  [part=card][data-readonly=true] [part=state-label] {
    display: block;
  }
`;


const BUTTON_ROW_STYLES = /* css */`
  [part=row-press-btn] {
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
  [part=row-press-btn]:hover  { opacity: 0.88; }
  [part=row-press-btn]:active { opacity: 0.75; }
  [part=row-press-btn]:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export class ButtonCard extends BaseCard {
  static staleOnMount = false;

  /** @type {HTMLButtonElement|null} */ #pressBtn    = null;
  /** @type {HTMLButtonElement|null} */ #rowPressBtn = null;
  /** @type {HTMLElement|null}       */ #stateLabel  = null;
  /** @type {ReturnType<typeof setTimeout>|null} */ #pressTimer = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";
    const label = this.def.friendly_name;
    const pressLabel = this.i18n.t("action.press") !== "action.press" ? this.i18n.t("action.press") : "Press";

    this.root.innerHTML = /* html */`
      <style>${BUTTON_CARD_STYLES}${BUTTON_ROW_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(label)}</span>
          ${isWritable ? `<span part="row-control"><button part="row-press-btn" type="button" aria-label="${_esc(label)}">${_esc(pressLabel)}</button></span>` : ""}
        </div>
        <div part="card-body">
          ${isWritable ? /* html */`
            <button part="press-button" type="button"
              aria-label="${_esc(label)}">
              ${_esc(pressLabel)}
            </button>
          ` : ""}
          <span part="state-label"></span>
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#pressBtn    = this.root.querySelector("[part=press-button]");
    this.#rowPressBtn = this.root.querySelector("[part=row-press-btn]");
    this.#stateLabel  = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.def.icon ?? "mdi:gesture-tap-button", "card-icon");

    const onPress = () => {
      const tap = this.config.gestureConfig?.tap;
      if (tap) { this._runAction(tap); return; }
      this.config.card?.sendCommand("press", {});
    };
    if (this.#pressBtn) this._attachGestureHandlers(this.#pressBtn, { onTap: onPress });
    if (this.#rowPressBtn) this._attachGestureHandlers(this.#rowPressBtn, { onTap: onPress });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const isUnavailable = state === "unavailable" || state === "unknown";

    if (this.#pressBtn) {
      this.#pressBtn.disabled = isUnavailable;
    }
    if (this.#rowPressBtn) {
      this.#rowPressBtn.disabled = isUnavailable;
    }

    if (this.#stateLabel) {
      this.#stateLabel.textContent = isUnavailable
        ? (this.i18n.t(`state.${state}`) !== `state.${state}` ? this.i18n.t(`state.${state}`) : state)
        : "";
    }

    const iconName = this.def.icon_state_map?.[state] ?? this.def.icon ?? "mdi:gesture-tap-button";
    this.renderIcon(iconName, "card-icon");
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this.#pressTimer !== null) {
      clearTimeout(this.#pressTimer);
      this.#pressTimer = null;
    }
  }
}
