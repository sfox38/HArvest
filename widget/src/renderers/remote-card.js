/**
 * renderers/remote-card.js - Renderer for the "remote" domain.
 *
 * Explicit on/off control plus an activity selector when HA exposes an
 * activity_list. Arbitrary send_command actions remain available through
 * configured gestures and custom renderers.
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

  [part=power-toggle],
  [part=activity-select] {
    width: 100%;
    padding: var(--hrv-spacing-s) var(--hrv-spacing-m);
    border-radius: var(--hrv-radius-m);
    font-size: var(--hrv-font-size-s);
    font-family: inherit;
  }

  [part=power-toggle] {
    border: none;
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
    font-weight: var(--hrv-font-weight-medium);
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed), background var(--hrv-transition-speed);
  }

  [part=power-toggle][aria-pressed=false] {
    background: var(--hrv-color-state-off);
    color: var(--hrv-color-text);
  }

  [part=power-toggle]:hover  { opacity: 0.88; }
  [part=power-toggle]:active { opacity: 0.75; }
  [part=power-toggle]:disabled,
  [part=activity-select]:disabled { opacity: 0.4; cursor: not-allowed; }

  [part=activity-select] {
    border: 1px solid var(--hrv-color-border);
    background: var(--hrv-color-surface-alt);
    color: var(--hrv-color-text);
    cursor: pointer;
  }

  [part=state-label],
  [part=current-activity] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    text-align: center;
  }

  [part=current-activity] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }

  [part=card][data-readonly=true] [part=card-body] {
    justify-content: center;
  }
`;


export class RemoteCard extends BaseCard {
  /** @type {HTMLButtonElement|null} */ #powerToggle = null;
  /** @type {HTMLSelectElement|null} */ #activitySelect = null;
  /** @type {HTMLElement|null}       */ #stateLabel = null;
  /** @type {HTMLElement|null}       */ #currentActivity = null;
  /** @type {string}                 */ #activityListKey = "";

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
            <button part="power-toggle" type="button"></button>
            <select part="activity-select" aria-label="${_esc(this.def.friendly_name)} activity" hidden></select>
          ` : `<span part="state-label"></span><span part="current-activity" hidden></span>`}
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#powerToggle = this.root.querySelector("[part=power-toggle]");
    this.#activitySelect = this.root.querySelector("[part=activity-select]");
    this.#stateLabel = this.root.querySelector("[part=state-label]");
    this.#currentActivity = this.root.querySelector("[part=current-activity]");
    this.#activityListKey = "";

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.resolveIcon(this.def.icon, "mdi:remote"), "card-icon");

    this._attachGestureHandlers(this.#powerToggle, {
      onTap: () => {
        const tap  = this.config.gestureConfig?.tap;
        if (tap) { this._runAction(tap); return; }
        const isOn = this.#powerToggle?.getAttribute("aria-pressed") === "true";
        this.config.card?.sendCommand(isOn ? "turn_off" : "turn_on", {});
      },
    });

    this.#activitySelect?.addEventListener("change", () => {
      const activity = this.#activitySelect?.value;
      if (activity) this.config.card?.sendCommand("turn_on", { activity });
    });

    this.renderCompanions();
  }

  applyState(state, attributes) {
    const isOn = state === "on";
    const isUnavailable = state === "unavailable" || state === "unknown";
    const label = this.i18n.t(`state.${state}`) !== `state.${state}`
      ? this.i18n.t(`state.${state}`)
      : state;
    const activityList = Array.isArray(attributes?.activity_list)
      ? attributes.activity_list.filter(activity => typeof activity === "string")
      : [];
    const currentActivity = typeof attributes?.current_activity === "string"
      ? attributes.current_activity
      : "";

    if (this.#powerToggle) {
      this.#powerToggle.textContent = this.i18n.t(isOn ? "state.on" : "state.off");
      this.#powerToggle.setAttribute("aria-pressed", String(isOn));
      this.#powerToggle.setAttribute(
        "aria-label",
        `${this.def.friendly_name} - ${this.i18n.t("action.toggle")}, ` +
        `${this.i18n.t("action.currently")} ${label}`,
      );
      this.#powerToggle.disabled = isUnavailable;
    }
    if (this.#stateLabel) {
      this.#stateLabel.textContent = label;
    }
    if (this.#currentActivity) {
      this.#currentActivity.textContent = currentActivity;
      this.#currentActivity.hidden = !currentActivity;
    }

    if (this.#activitySelect) {
      const activityListKey = JSON.stringify(activityList);
      if (activityListKey !== this.#activityListKey) {
        this.#activityListKey = activityListKey;
        this.#activitySelect.replaceChildren(
          ...activityList.map(activity => {
            const option = document.createElement("option");
            option.value = activity;
            option.textContent = activity;
            return option;
          }),
        );
      }
      this.#activitySelect.hidden = activityList.length === 0;
      this.#activitySelect.disabled = isUnavailable;
      if (currentActivity && activityList.includes(currentActivity)) {
        this.#activitySelect.value = currentActivity;
      } else if (activityList.length > 0) {
        this.#activitySelect.selectedIndex = -1;
      }
    }

    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? "mdi:remote";
    this.renderIcon(this.resolveIcon(rawIcon, "mdi:remote"), "card-icon");

    this.announceState(
      `${this.def.friendly_name}, ${label}${currentActivity ? `, ${currentActivity}` : ""}`,
    );
  }

  predictState(action, data) {
    if (action === "turn_off") return { state: "off", attributes: {} };
    if (action === "turn_on") {
      const attributes = data?.activity ? { current_activity: data.activity } : {};
      return { state: "on", attributes };
    }
    return null;
  }
}
