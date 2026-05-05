/**
 * renderers/badge-card.js - Compact pill-shaped badge renderer.
 *
 * Used when entity capabilities === "badge". Renders a minimal
 * inline indicator with optional icon, name, and state text.
 * No companions, history, gestures, or stale indicator.
 */

import { BaseCard } from "./base-card.js";

const _ICON_COLORS = {
  auto: "var(--hrv-color-primary)",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  indigo: "#6366f1",
  purple: "#a855f7",
  pink: "#ec4899",
  grey: "#9ca3af",
};

const _INACTIVE_STATES = new Set([
  "off", "unavailable", "unknown", "idle", "closed", "standby", "not_home",
  "locked", "jammed", "locking", "unlocking",
]);


const _DOMAIN_FALLBACK_ICON = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  input_boolean: "mdi:toggle-switch",
  fan: "mdi:fan",
  sensor: "mdi:gauge",
  binary_sensor: "mdi:radiobox-blank",
  climate: "mdi:thermostat",
  media_player: "mdi:cast",
  cover: "mdi:window-shutter",
  timer: "mdi:timer",
  remote: "mdi:remote",
  input_number: "mdi:numeric",
  input_select: "mdi:format-list-bulleted",
  harvest_action: "mdi:play-circle-outline",
};

const BADGE_STYLES = /* css */`
  :host {
    width: auto !important;
    min-width: unset !important;
    display: inline-block !important;
    contain: none !important;
  }

  [part=badge] {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 8px;
    border-radius: 14px;
    background: var(--hrv-card-background, var(--hrv-color-surface, #fff));
    box-shadow: var(--hrv-card-shadow, 0 1px 3px rgba(0,0,0,0.1));
    border: var(--hrv-card-border, 1px solid var(--hrv-color-border, #e5e7eb));
    font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
    color: var(--hrv-color-text, #111827);
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    cursor: default;
    transition: box-shadow var(--hrv-transition-speed, 150ms);
    -webkit-backdrop-filter: var(--hrv-card-backdrop-filter, none);
    backdrop-filter: var(--hrv-card-backdrop-filter, none);
  }

  [part=badge-icon] {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--hrv-transition-speed, 150ms);
  }

  [part=badge-icon] svg {
    width: 100%;
    height: 100%;
  }

  [part=badge-text] {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  [part=badge-name] {
    font-size: 11px;
    font-weight: var(--hrv-font-weight-medium, 500);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }

  [part=badge-state] {
    font-size: 10px;
    line-height: 1.3;
    color: var(--hrv-color-text-secondary, #6b7280);
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }

  [part=badge-text].single [part=badge-name],
  [part=badge-text].single [part=badge-state] {
    font-size: 12px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    [part=badge], [part=badge-icon] { transition: none; }
  }
`;

function _esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export class BadgeCard extends BaseCard {
  /** @type {HTMLElement|null} */ #iconEl = null;
  /** @type {HTMLElement|null} */ #stateEl = null;
  /** @type {HTMLElement|null} */ #badgeEl = null;

  render() {
    const hints = this.def.display_hints ?? {};
    const showIcon = hints.badge_show_icon !== false;
    const showName = hints.badge_show_name !== false;
    const showState = hints.badge_show_state !== false;
    const nameCls = showName ? "" : " sr-only";
    const stateCls = showState ? "" : " sr-only";
    const singleLine = (showName && !showState) || (!showName && showState);
    const textCls = singleLine ? " single" : "";

    this.root.innerHTML = /* html */`
      <style>${this.getSharedStyles()}${BADGE_STYLES}</style>
      <div part="badge" aria-label="${_esc(this.def.friendly_name)}" title="${_esc(this.def.friendly_name)}">
        ${showIcon ? '<span part="badge-icon" aria-hidden="true"></span>' : ""}
        <span part="badge-text" class="${textCls}">
          <span part="badge-name" class="${nameCls}">${_esc(this.def.friendly_name)}</span>
          <span part="badge-state" class="${stateCls}" aria-live="polite"></span>
        </span>
      </div>
      ${this.renderAriaLiveHTML()}
    `;

    this.#iconEl = this.root.querySelector("[part=badge-icon]");
    this.#stateEl = this.root.querySelector("[part=badge-state]");
    this.#badgeEl = this.root.querySelector("[part=badge]");

    if (showIcon) {
      const fb = _DOMAIN_FALLBACK_ICON[this.def.domain] ?? "mdi:help-circle";
      this.renderIcon(this.resolveIcon(this.def.icon, fb), "badge-icon");
    }

  }

  applyState(state, attributes) {
    const hints = this.def.display_hints ?? {};
    const colorKey = hints.badge_icon_color ?? "auto";
    const isActive = !_INACTIVE_STATES.has(state);

    if (this.#iconEl) {
      const color = isActive
        ? (_ICON_COLORS[colorKey] ?? _ICON_COLORS.auto)
        : "#9ca3af";
      this.#iconEl.style.color = color;

      const fb = _DOMAIN_FALLBACK_ICON[this.def.domain] ?? "mdi:help-circle";
      const rawIcon = this.def.icon_state_map?.[state]
        ?? this.def.icon ?? fb;
      this.renderIcon(this.resolveIcon(rawIcon, fb), "badge-icon");
    }

    const uom = attributes?.unit_of_measurement
      ?? this.def.unit_of_measurement ?? "";

    const label = this.formatStateLabel(state);
    const stateText = uom ? `${label} ${uom}` : label;

    if (this.#stateEl) {
      this.#stateEl.textContent = stateText;
    }

    if (this.#badgeEl) {
      this.#badgeEl.title = `${this.def.friendly_name}: ${stateText}`;
    }

    this.announceState(`${this.def.friendly_name}, ${state}`);
  }
}
