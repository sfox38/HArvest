/**
 * renderers/lock-card.js - Renderer for the "lock" domain.
 *
 * Security state must always be fresh. staleOnMount is false so cached state
 * is never shown without a live server confirmation.
 *
 * States: locked, unlocked, locking, unlocking, jammed
 * Buttons: Lock / Unlock (disabled while transitioning or jammed)
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const LOCK_CARD_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--hrv-spacing-s);
  }

  [part=lock-button] {
    padding: var(--hrv-spacing-xs) var(--hrv-spacing-m);
    border: none;
    border-radius: var(--hrv-radius-m);
    font-size: var(--hrv-font-size-s);
    font-weight: var(--hrv-font-weight-medium);
    font-family: inherit;
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed), background var(--hrv-transition-speed);
    min-width: 72px;
  }

  [part=lock-button][data-action=lock] {
    background: var(--hrv-color-state-on);
    color: var(--hrv-color-text-inverse);
  }

  [part=lock-button][data-action=unlock] {
    background: var(--hrv-color-state-off);
    color: var(--hrv-color-text);
  }

  [part=lock-button]:hover  { opacity: 0.88; }
  [part=lock-button]:active { opacity: 0.75; }
  [part=lock-button]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }

  [part=state-label][data-state=jammed] {
    color: var(--hrv-color-error);
    font-weight: var(--hrv-font-weight-medium);
  }

  [part=card][data-readonly=true] [part=card-body] {
    justify-content: center;
  }

  [part=card][data-readonly=true] [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
  }
`;

const LOCK_ROW_STYLES = /* css */`
  [part=row-lock-btn] {
    padding: 2px var(--hrv-spacing-s);
    border: none;
    border-radius: var(--hrv-radius-s);
    font-size: var(--hrv-font-size-xs);
    font-weight: var(--hrv-font-weight-medium);
    font-family: inherit;
    cursor: pointer;
    min-width: 52px;
    transition: opacity var(--hrv-transition-speed), background var(--hrv-transition-speed);
  }
  [part=row-lock-btn][data-action=lock]   { background: var(--hrv-color-state-on); color: var(--hrv-color-text-inverse); }
  [part=row-lock-btn][data-action=unlock] { background: var(--hrv-color-state-off); color: var(--hrv-color-text); }
  [part=row-lock-btn]:disabled { opacity: 0.4; cursor: not-allowed; }
  [part=row-lock-state] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
  }
`;

const _TRANSITIONING = new Set(["locking", "unlocking"]);

export class LockCard extends BaseCard {
  static staleOnMount = false;

  /** @type {HTMLButtonElement|null} */ #lockBtn      = null;
  /** @type {HTMLButtonElement|null} */ #rowLockBtn   = null;
  /** @type {HTMLElement|null}       */ #stateLabel   = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";

    this.root.innerHTML = /* html */`
      <style>${LOCK_CARD_STYLES}${LOCK_ROW_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
          ${isWritable ? `<span part="row-control"><button part="row-lock-btn" type="button"></button></span>` : `<span part="row-control"><span part="row-lock-state"></span></span>`}
        </div>
        <div part="card-body">
          <span part="state-label"></span>
          ${isWritable ? `<button part="lock-button" type="button"></button>` : ""}
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#lockBtn    = this.root.querySelector("[part=lock-button]");
    this.#rowLockBtn = this.root.querySelector("[part=row-lock-btn]");
    this.#stateLabel = this.root.querySelector("[part=state-label]");

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.def.icon ?? "mdi:lock", "card-icon");

    const onLockTap = () => {
      const tap = this.config.gestureConfig?.tap;
      if (tap) { this._runAction(tap); return; }
      const isLocked = this.#stateLabel?.dataset.state === "locked";
      this.config.card?.sendCommand(isLocked ? "unlock" : "lock", {});
    };
    if (this.#lockBtn) this._attachGestureHandlers(this.#lockBtn, { onTap: onLockTap });
    if (this.#rowLockBtn) this._attachGestureHandlers(this.#rowLockBtn, { onTap: onLockTap });

    this.renderCompanions();
  }

  applyState(state, _attributes) {
    const isLocked       = state === "locked";
    const isTransitioning = _TRANSITIONING.has(state);
    const isJammed       = state === "jammed";
    const isUnavailable  = state === "unavailable" || state === "unknown";
    const isWritable     = this.def.capabilities === "read-write";

    const label = this.i18n.t(`state.lock.${state}`) !== `state.lock.${state}`
      ? this.i18n.t(`state.lock.${state}`)
      : this.i18n.t(`state.${state}`) !== `state.${state}`
        ? this.i18n.t(`state.${state}`)
        : state;

    if (this.#stateLabel) {
      this.#stateLabel.textContent = label;
      this.#stateLabel.dataset.state = state;
    }

    const nextAction = isLocked ? "unlock" : "lock";
    const nextLabel = this.i18n.t(`action.${nextAction}`) !== `action.${nextAction}`
      ? this.i18n.t(`action.${nextAction}`)
      : nextAction.charAt(0).toUpperCase() + nextAction.slice(1);
    const isDisabled = isTransitioning || isJammed || isUnavailable;

    if (this.#lockBtn && isWritable) {
      this.#lockBtn.textContent = nextLabel;
      this.#lockBtn.dataset.action = nextAction;
      this.#lockBtn.setAttribute(
        "aria-label",
        `${this.def.friendly_name} - ${nextLabel}, ${this.i18n.t("action.currently")} ${label}`,
      );
      this.#lockBtn.disabled = isDisabled;
    }

    if (this.#rowLockBtn && isWritable) {
      this.#rowLockBtn.textContent = nextLabel;
      this.#rowLockBtn.dataset.action = nextAction;
      this.#rowLockBtn.disabled = isDisabled;
    }

    const rowLockStateEl = this.root.querySelector("[part=row-lock-state]");
    if (rowLockStateEl) rowLockStateEl.textContent = label;

    const iconName = this.def.icon_state_map?.[state]
      ?? this.def.icon
      ?? (isJammed ? "mdi:lock-alert" : isLocked ? "mdi:lock" : "mdi:lock-open");
    this.renderIcon(iconName, "card-icon");

    this.announceState(`${this.def.friendly_name}, ${label}`);
  }

  predictState(action, _data) {
    if (action === "lock")   return { state: "locking",   attributes: {} };
    if (action === "unlock") return { state: "unlocking", attributes: {} };
    return null;
  }
}
