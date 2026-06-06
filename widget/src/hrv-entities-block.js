/**
 * hrv-entities-block.js - Container element for compact entity rows.
 *
 * Wraps one or more <hrv-card> elements and forces them into row layout.
 * Provides shared card appearance (background, border-radius, dividers)
 * so embed snippets need no inline <style> blocks.
 *
 * Usage:
 *   <hrv-entities-block>
 *     <hrv-card entity="light.bedroom"></hrv-card>
 *     <hrv-card entity="switch.hallway"></hrv-card>
 *   </hrv-entities-block>
 */

let _styleInjected = false;

function _injectStyles() {
  if (_styleInjected) return;
  _styleInjected = true;
  if (document.head.querySelector("[data-hrv-entities-block]")) return;
  const s = document.createElement("style");
  s.setAttribute("data-hrv-entities-block", "");
  s.textContent = [
    "hrv-entities-block{",
    "display:block;",
    "background:var(--hrv-color-surface,#fff);",
    "border-radius:var(--hrv-border-radius,12px);",
    "box-shadow:0 1px 3px rgba(0,0,0,.08);",
    "overflow:hidden}",
    "hrv-entities-block hrv-card+hrv-card{",
    "border-top:1px solid rgba(0,0,0,.06)}",
  ].join("");
  document.head.appendChild(s);
}

export class HrvEntitiesBlock extends HTMLElement {
  connectedCallback() {
    _injectStyles();
  }
}

if (!customElements.get("hrv-entities-block")) {
  customElements.define("hrv-entities-block", HrvEntitiesBlock);
}
