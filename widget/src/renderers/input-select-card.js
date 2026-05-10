/**
 * renderers/input-select-card.js - Renderer for input_select / select.
 *
 * Two display modes, chosen by display_hints.display_mode:
 *  - "pills" (default): button row with one pill per option
 *  - "dropdown":         trigger button opens a popover-based listbox
 *
 * The dropdown is rendered with the Popover API (popover="manual") so it
 * lives in the browser's top layer and is never clipped by ancestor
 * stacking contexts or `overflow: hidden`.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const INPUT_SELECT_STYLES = /* css */`
  [part=card-body] {
    margin-top: var(--hrv-spacing-xs);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Pills mode */
  [part=option-grid] {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  [part=option-pill] {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.10));
    background: var(--hrv-color-surface-alt, rgba(0,0,0,0.04));
    color: var(--hrv-color-text, #212121);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  [part=option-pill]:hover {
    background: color-mix(in srgb, var(--hrv-color-text, #212121) 8%, transparent);
  }
  [part=option-pill][data-active=true] {
    background: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 28%, transparent);
    border-color: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 60%, transparent);
  }

  /* Dropdown trigger */
  [part=option-trigger] {
    width: 100%;
    padding: var(--hrv-spacing-s) var(--hrv-spacing-m);
    border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.10));
    border-radius: var(--hrv-radius-m);
    background: var(--hrv-color-surface-alt, rgba(0,0,0,0.04));
    color: var(--hrv-color-text, #212121);
    font-size: var(--hrv-font-size-s);
    font-family: inherit;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  [part=option-trigger]:hover {
    background: color-mix(in srgb, var(--hrv-color-text, #212121) 8%, transparent);
  }
  [part=option-trigger-arrow] {
    font-size: 10px;
    opacity: 0.6;
    transition: transform 200ms ease;
  }
  [part=option-trigger][aria-expanded=true] [part=option-trigger-arrow] {
    transform: rotate(180deg);
  }

  /* Popover dropdown */
  [part=option-menu] {
    position: fixed;
    margin: 0;
    inset: unset;
    background: var(--hrv-card-background, #ffffff);
    border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.10));
    border-radius: var(--hrv-radius-m);
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    max-height: 240px;
    overflow-y: auto;
    scrollbar-width: thin;
    padding: 4px;
    color: var(--hrv-color-text, #212121);
    font-family: inherit;
  }
  [part=option-menu]:not(:popover-open) { display: none; }
  [part=option-menu-item] {
    display: block;
    width: 100%;
    padding: 8px 14px;
    border: none;
    background: transparent;
    color: var(--hrv-color-text, #212121);
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    border-radius: 8px;
    transition: background 150ms;
  }
  [part=option-menu-item]:hover,
  [part=option-menu-item]:focus-visible {
    background: color-mix(in srgb, var(--hrv-color-text, #212121) 8%, transparent);
    outline: none;
  }
  [part=option-menu-item][data-active=true] {
    background: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 18%, transparent);
    font-weight: 600;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
    display: block;
  }

  [part=card][data-readonly=true] [part=card-body] {
    align-items: center;
    justify-content: center;
  }
  [part=card][data-readonly=true] [part=state-label] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    margin-top: 0;
  }
`;


export class InputSelectCard extends BaseCard {
  /** @type {HTMLElement|null}  */ #trigger     = null;
  /** @type {HTMLElement|null}  */ #menu        = null;
  /** @type {HTMLElement|null}  */ #grid        = null;
  /** @type {HTMLElement|null}  */ #stateLabel  = null;
  /** @type {string[]}          */ #options     = [];
  /** @type {string}            */ #lastOptionsKey = "";
  /** @type {boolean}           */ #isOpen      = false;
  /** @type {string}            */ #displayMode = "pills";
  #pillButtons = [];
  #optionEls = [];
  #docClickHandler = null;
  #repositionHandler = null;

  render() {
    const isWritable = this.def.capabilities === "read-write";
    const hint = this.config.displayHints?.display_mode ?? this.def.display_hints?.display_mode ?? "pills";
    this.#displayMode = (hint === "dropdown") ? "dropdown" : "pills";
    this.#options = this.def.feature_config?.options ?? [];

    const bodyHTML = !isWritable
      ? `<span part="state-label">-</span>`
      : this.#displayMode === "dropdown"
        ? /* html */`
          <button part="option-trigger" type="button"
            aria-haspopup="listbox" aria-expanded="false"
            aria-label="${_esc(this.def.friendly_name)}">
            <span part="option-trigger-label">-</span>
            <span part="option-trigger-arrow" aria-hidden="true">&#9660;</span>
          </button>
          <div part="option-menu" role="listbox" popover="manual"></div>`
        : `<div part="option-grid"></div>`;

    this.root.innerHTML = /* html */`
      <style>${INPUT_SELECT_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">${bodyHTML}</div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#trigger    = this.root.querySelector("[part=option-trigger]");
    this.#menu       = this.root.querySelector("[part=option-menu]");
    this.#grid       = this.root.querySelector("[part=option-grid]");
    this.#stateLabel = this.root.querySelector("[part=state-label]");
    this.#pillButtons = [];
    this.#optionEls = [];
    this.#lastOptionsKey = "";

    if (!isWritable) {
      this.root.querySelector("[part=card]")?.setAttribute("data-readonly", "true");
    }

    this.renderIcon(this.def.icon ?? "mdi:format-list-bulleted", "card-icon");

    if (this.#trigger && isWritable) {
      this.#trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.#isOpen) this.#closeDropdown();
        else this.#openDropdown();
      });
      this.#trigger.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !this.#isOpen) {
          e.preventDefault();
          this.#openDropdown();
          this.#optionEls[0]?.focus();
        } else if (e.key === "Escape" && this.#isOpen) {
          this.#closeDropdown();
          this.#trigger.focus();
        }
      });
      this.#docClickHandler = (e) => {
        if (this.#isOpen && !this.root.host.contains(e.target)) this.#closeDropdown();
      };
      document.addEventListener("click", this.#docClickHandler);
    }

    this.renderCompanions();
    this._attachGestureHandlers(this.root.querySelector("[part=card]"));
  }

  #buildPills(options) {
    if (!this.#grid) return;
    this.#grid.innerHTML = "";
    this.#pillButtons = [];
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.setAttribute("part", "option-pill");
      btn.type = "button";
      btn.dataset.option = opt;
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        this.config.card?.sendCommand("select_option", { option: opt });
      });
      this.#grid.appendChild(btn);
      this.#pillButtons.push(btn);
    }
  }

  #buildDropdownOptions(options) {
    if (!this.#menu) return;
    this.#menu.innerHTML = "";
    this.#optionEls = [];
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.setAttribute("part", "option-menu-item");
      btn.type = "button";
      btn.role = "option";
      btn.dataset.option = opt;
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        this.config.card?.sendCommand("select_option", { option: opt });
        this.#closeDropdown();
        this.#trigger?.focus();
      });
      btn.addEventListener("keydown", (e) => {
        const opts = this.#optionEls;
        const idx = opts.indexOf(btn);
        if (e.key === "ArrowDown") { e.preventDefault(); opts[Math.min(idx + 1, opts.length - 1)]?.focus(); }
        else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (idx === 0) this.#trigger?.focus(); else opts[idx - 1]?.focus();
        } else if (e.key === "Escape") { this.#closeDropdown(); this.#trigger?.focus(); }
      });
      this.#menu.appendChild(btn);
      this.#optionEls.push(btn);
    }
  }

  #positionDropdown() {
    if (!this.#menu || !this.#trigger) return;
    const r = this.#trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const dropH = Math.min(this.#menu.scrollHeight || 240, 240);
    this.#menu.style.left = `${Math.round(r.left)}px`;
    this.#menu.style.width = `${Math.round(r.width)}px`;
    if (spaceBelow < dropH + 8 && spaceAbove > spaceBelow) {
      this.#menu.style.top = `${Math.max(8, Math.round(r.top - dropH - 6))}px`;
    } else {
      this.#menu.style.top = `${Math.round(r.bottom + 6)}px`;
    }
  }

  #openDropdown() {
    if (!this.#menu || !this.#options.length) return;
    try { this.#menu.showPopover?.(); } catch { /* ignore */ }
    this.#trigger?.setAttribute("aria-expanded", "true");
    this.#positionDropdown();
    this.#repositionHandler = () => this.#positionDropdown();
    window.addEventListener("scroll", this.#repositionHandler, true);
    window.addEventListener("resize", this.#repositionHandler);
    this.#isOpen = true;
  }

  #closeDropdown() {
    try { this.#menu?.hidePopover?.(); } catch { /* ignore */ }
    this.#trigger?.setAttribute("aria-expanded", "false");
    if (this.#repositionHandler) {
      window.removeEventListener("scroll", this.#repositionHandler, true);
      window.removeEventListener("resize", this.#repositionHandler);
      this.#repositionHandler = null;
    }
    this.#isOpen = false;
  }

  applyState(state, attributes) {
    if (this.#stateLabel) {
      this.#stateLabel.textContent = state;
      return;
    }

    const incoming = attributes?.options;
    const options = (Array.isArray(incoming) && incoming.length) ? incoming : this.#options;
    this.#options = options;

    const optionsKey = options.join("|");
    if (optionsKey !== this.#lastOptionsKey) {
      this.#lastOptionsKey = optionsKey;
      if (this.#displayMode === "dropdown") this.#buildDropdownOptions(options);
      else this.#buildPills(options);
    }

    if (this.#displayMode === "dropdown") {
      const label = this.root.querySelector("[part=option-trigger-label]");
      if (label) label.textContent = state;
      for (const btn of this.#optionEls) {
        btn.setAttribute("data-active", String(btn.dataset.option === state));
      }
    } else {
      for (const btn of this.#pillButtons) {
        btn.setAttribute("data-active", String(btn.dataset.option === state));
      }
    }

    this.announceState(`${this.def.friendly_name}, ${state}`);
  }

  predictState(action, data) {
    if (action === "select_option" && data.option !== undefined) {
      return { state: String(data.option), attributes: { options: this.#options } };
    }
    return null;
  }

  destroy() {
    if (this.#docClickHandler) {
      document.removeEventListener("click", this.#docClickHandler);
      this.#docClickHandler = null;
    }
    if (this.#repositionHandler) {
      window.removeEventListener("scroll", this.#repositionHandler, true);
      window.removeEventListener("resize", this.#repositionHandler);
      this.#repositionHandler = null;
    }
    try { this.#menu?.hidePopover?.(); } catch { /* ignore */ }
  }
}
