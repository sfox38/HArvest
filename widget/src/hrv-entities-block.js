/**
 * hrv-entities-block.js - Shadow-DOM container for compact entity rows.
 *
 * Wraps child <hrv-card> elements via <slot>, forces them into row layout,
 * and provides shared card appearance (background, border-radius, dividers).
 * Uses ThemeLoader for theme application, identical to <hrv-card>.
 *
 * Usage:
 *   <hrv-entities-block>
 *     <hrv-card entity="light.bedroom"></hrv-card>
 *     <hrv-card entity="switch.hallway"></hrv-card>
 *   </hrv-entities-block>
 */

import { ThemeLoader } from "./theme-loader.js";

const BLOCK_CSS = /* css */`
  :host {
    /* Layout */
    --hrv-spacing-xs:  4px;
    --hrv-spacing-s:   8px;
    --hrv-spacing-m:   16px;
    --hrv-spacing-l:   24px;

    /* Border radius */
    --hrv-radius-s:    4px;
    --hrv-radius-m:    8px;
    --hrv-radius-l:    12px;

    /* Typography */
    --hrv-font-family: system-ui, -apple-system, sans-serif;

    /* Colours - light mode defaults */
    --hrv-color-primary:       #6366f1;
    --hrv-color-on-primary:    #ffffff;
    --hrv-color-surface:       #ffffff;
    --hrv-color-surface-alt:   #f3f4f6;
    --hrv-color-border:        #e5e7eb;
    --hrv-color-text:          #111827;
    --hrv-color-text-secondary:#6b7280;
    --hrv-color-icon:          #374151;

    /* Card */
    --hrv-card-radius:         var(--hrv-radius-l);
    --hrv-card-shadow:         0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);

    /* Icon */
    --hrv-icon-size:           24px;

    display: block;
    width: 100%;
    max-width: 360px;
    box-sizing: border-box;
    font-family: var(--hrv-font-family);
  }

  @media (prefers-color-scheme: dark) {
    :host(:not([data-color-scheme=light])) {
      --hrv-color-surface:       #1f2937;
      --hrv-color-surface-alt:   #374151;
      --hrv-color-border:        #374151;
      --hrv-color-text:          #f9fafb;
      --hrv-color-text-secondary:#9ca3af;
      --hrv-color-icon:          #d1d5db;
      --hrv-card-shadow:         0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
    }
  }

  :host([data-color-scheme=dark]) {
    --hrv-color-surface:       #1f2937;
    --hrv-color-surface-alt:   #374151;
    --hrv-color-border:        #374151;
    --hrv-color-text:          #f9fafb;
    --hrv-color-text-secondary:#9ca3af;
    --hrv-color-icon:          #d1d5db;
    --hrv-card-shadow:         0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  [part=block] {
    background: var(--hrv-color-surface);
    border-radius: var(--hrv-card-radius);
    box-shadow: var(--hrv-card-shadow);
    color: var(--hrv-color-text);
    overflow: hidden;
    padding-bottom: 4px;
  }

  :host([data-border=outer]) [part=block] { box-shadow: var(--hrv-card-shadow); }
  :host([data-border=inner]) [part=block] { box-shadow: var(--hrv-card-shadow-inner, inset 0 2px 4px rgba(0,0,0,0.06)); }
  :host([data-border=none]) [part=block] { box-shadow: none; }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    font-weight: 600;
    font-size: 13px;
    color: var(--hrv-color-text);
    border-bottom: 1px solid var(--hrv-color-border);
    box-shadow: var(--hrv-block-header-shadow, none);
    background: var(--hrv-block-header-bg, transparent);
  }

  .header svg {
    flex-shrink: 0;
    fill: currentColor;
  }

  ::slotted(hrv-card:not(:first-child)),
  .header ~ ::slotted(hrv-card:first-child) {
    border-top: 1px solid var(--hrv-color-border);
  }

  :host([data-highlight-rows]) ::slotted(hrv-card:nth-child(even)) {
    background: var(--hrv-color-surface-alt);
  }
`;

export class HrvEntitiesBlock extends HTMLElement {

  static observedAttributes = ["data-highlight-rows"];

  #theme = null;
  #headerLabel = null;
  #headerIcon = null;
  #showHeader = true;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.#render();
    this.#forceChildRowLayout();
    this._slotObserver = new MutationObserver(() => this.#forceChildRowLayout());
    this._slotObserver.observe(this, { childList: true });
  }

  attributeChangedCallback(name) {
    if (name === "data-highlight-rows") this.#forceChildRowLayout();
  }

  disconnectedCallback() {
    if (this.shadowRoot) ThemeLoader.detach(this.shadowRoot);
    if (this._slotObserver) {
      this._slotObserver.disconnect();
      this._slotObserver = null;
    }
  }

  #render() {
    const sr = this.shadowRoot;
    sr.innerHTML = "";
    const style = document.createElement("style");
    style.textContent = BLOCK_CSS;
    sr.appendChild(style);

    const block = document.createElement("div");
    block.setAttribute("part", "block");

    this.#updateHeader(block);

    const slot = document.createElement("slot");
    block.appendChild(slot);
    sr.appendChild(block);
  }

  #updateHeader(blockEl) {
    const block = blockEl || this.shadowRoot?.querySelector("[part=block]");
    if (!block) return;
    let header = block.querySelector(".header");
    if (!this.#showHeader || !this.#headerLabel) {
      if (header) header.remove();
      return;
    }
    if (!header) {
      header = document.createElement("div");
      header.className = "header";
      block.insertBefore(header, block.firstChild);
    }
    header.innerHTML = "";
    if (this.#headerIcon) {
      const icon = document.createElement("span");
      icon.innerHTML = this.#headerIcon;
      header.appendChild(icon);
    }
    const label = document.createElement("span");
    label.textContent = this.#headerLabel;
    header.appendChild(label);
  }

  setHeader(label, iconSvg, show) {
    this.#headerLabel = label || null;
    this.#headerIcon = iconSvg || null;
    this.#showHeader = show !== false;
    this.#updateHeader();
  }

  #forceChildRowLayout() {
    const highlight = this.hasAttribute("data-highlight-rows");
    let idx = 0;
    for (const child of this.children) {
      if (child.tagName === "HRV-CARD") {
        child.setAttribute("layout", "row");
        if (highlight) {
          child.setAttribute("data-highlight", idx % 2 === 0 ? "odd" : "even");
        } else {
          child.removeAttribute("data-highlight");
        }
        idx++;
      }
    }
  }

  applyPreviewTheme(themeVars) {
    if (!this.shadowRoot) return;
    this.#theme = themeVars;
    ThemeLoader.detach(this.shadowRoot);
    const cs = this.getAttribute("data-color-scheme") || "auto";
    if (themeVars.variables) {
      ThemeLoader.apply(themeVars, this.shadowRoot, cs);
    } else {
      ThemeLoader.apply({ variables: themeVars }, this.shadowRoot, cs);
    }
  }

  setTheme(theme) {
    this.#theme = theme;
    if (this.shadowRoot && theme) {
      ThemeLoader.apply(theme, this.shadowRoot, this.getAttribute("data-color-scheme") || "auto");
    } else if (this.shadowRoot) {
      ThemeLoader.detach(this.shadowRoot);
      ThemeLoader.clear(this.shadowRoot);
    }
  }
}

if (!customElements.get("hrv-entities-block")) {
  customElements.define("hrv-entities-block", HrvEntitiesBlock);
}
