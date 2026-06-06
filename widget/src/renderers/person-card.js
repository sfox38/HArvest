/**
 * renderers/person-card.js - Renderer for the "person" domain.
 *
 * Read-only. Displays the person's presence state (home, not_home, zone name).
 * staleOnMount is true because this is read-only location data with no
 * security implications of showing a cached value.
 *
 * States: home, not_home, <zone name>
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const PERSON_CARD_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--hrv-spacing-xs) 0;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    text-transform: capitalize;
  }

  [part=state-label][data-state=not_home] {
    color: var(--hrv-color-text-secondary);
  }

  [part=state-label][data-state=unavailable],
  [part=state-label][data-state=unknown] {
    color: var(--hrv-color-state-unavailable);
    font-size: var(--hrv-font-size-s);
  }
`;


export class PersonCard extends BaseCard {
  static staleOnMount = true;

  /** @type {HTMLElement|null} */ #stateLabel = null;
  /** @type {HTMLElement|null} */ #rowValue   = null;

  render() {
    this.root.innerHTML = /* html */`
      <style>${PERSON_CARD_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          <span part="row-control"><span part="row-value"></span></span>
        </div>
        <div part="card-body">
          <span part="state-label"></span>
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#stateLabel = this.root.querySelector("[part=state-label]");
    this.#rowValue   = this.root.querySelector("[part=row-value]");

    this.renderIcon(this.def.icon ?? "mdi:account", "card-icon");
    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const displayState = state === "not_home"
      ? (this.i18n.t("state.not_home") !== "state.not_home" ? this.i18n.t("state.not_home") : "Away")
      : state === "home"
        ? (this.i18n.t("state.home") !== "state.home" ? this.i18n.t("state.home") : "Home")
        : state;

    if (this.#stateLabel) {
      this.#stateLabel.textContent = displayState;
      this.#stateLabel.dataset.state = state;
    }
    if (this.#rowValue) this.#rowValue.textContent = displayState;

    const iconName = this.def.icon_state_map?.[state]
      ?? this.def.icon
      ?? (state === "not_home" ? "mdi:account-off" : "mdi:account");
    this.renderIcon(iconName, "card-icon");

    this.announceState(`${this.def.friendly_name}, ${displayState}`);
  }
}
