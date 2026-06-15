/**
 * tests/hrv-entities-block.test.js
 *
 * Tests for the <hrv-entities-block> shadow-DOM custom element.
 * Verifies shadow DOM setup, slot projection, row layout enforcement,
 * theme application via ThemeLoader, and cleanup on disconnect.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HrvEntitiesBlock } from "../src/hrv-entities-block.js";
import { ThemeLoader } from "../src/theme-loader.js";

// jsdom does not implement window.matchMedia; stub it for ThemeLoader.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mount() {
  const el = document.createElement("hrv-entities-block");
  document.body.appendChild(el);
  return el;
}

function unmount(el) {
  el.remove();
}

function makeTheme() {
  return {
    variables: {
      "--hrv-color-surface": "#f0f0f0",
      "--hrv-card-radius": "16px",
      "--hrv-color-border": "#ccc",
      "--hrv-color-text": "#222",
    },
    dark_variables: {
      "--hrv-color-surface": "#1a1a1a",
      "--hrv-color-text": "#eee",
    },
  };
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

describe("HrvEntitiesBlock - registration", () => {
  it("is registered as hrv-entities-block", () => {
    expect(customElements.get("hrv-entities-block")).toBe(HrvEntitiesBlock);
  });
});

// ---------------------------------------------------------------------------
// Shadow DOM structure
// ---------------------------------------------------------------------------

describe("HrvEntitiesBlock - shadow DOM", () => {
  let el;

  beforeEach(() => {
    el = mount();
  });

  it("creates an open shadow root", () => {
    expect(el.shadowRoot).toBeTruthy();
    expect(el.shadowRoot.mode).toBe("open");
  });

  it("contains a <style> and a [part=block] wrapper", () => {
    const style = el.shadowRoot.querySelector("style");
    expect(style).toBeTruthy();
    expect(style.textContent).toContain("--hrv-color-surface");

    const block = el.shadowRoot.querySelector("[part=block]");
    expect(block).toBeTruthy();
  });

  it("has a <slot> inside [part=block] for child projection", () => {
    const block = el.shadowRoot.querySelector("[part=block]");
    const slot = block.querySelector("slot");
    expect(slot).toBeTruthy();
  });

  it("cleanup: removes element without error", () => {
    expect(() => unmount(el)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Row layout enforcement
// ---------------------------------------------------------------------------

describe("HrvEntitiesBlock - row layout", () => {
  it("forces layout='row' on child <hrv-card> elements", async () => {
    const el = mount();
    const card1 = document.createElement("hrv-card");
    const card2 = document.createElement("hrv-card");
    el.appendChild(card1);
    el.appendChild(card2);

    // MutationObserver is async
    await new Promise(r => setTimeout(r, 0));
    expect(card1.getAttribute("layout")).toBe("row");
    expect(card2.getAttribute("layout")).toBe("row");
    unmount(el);
  });

  it("does not set layout on non-hrv-card children", () => {
    const el = mount();
    const div = document.createElement("div");
    el.appendChild(div);

    expect(div.hasAttribute("layout")).toBe(false);
    unmount(el);
  });

  it("forces layout='row' on dynamically added cards", async () => {
    const el = mount();
    const card = document.createElement("hrv-card");
    el.appendChild(card);

    // MutationObserver is async - flush microtasks
    await new Promise(r => setTimeout(r, 0));
    expect(card.getAttribute("layout")).toBe("row");
    unmount(el);
  });
});

// ---------------------------------------------------------------------------
// Theme application
// ---------------------------------------------------------------------------

describe("HrvEntitiesBlock - theme", () => {
  it("applyPreviewTheme sets CSS variables on the host via ThemeLoader", () => {
    const el = mount();
    const spy = vi.spyOn(ThemeLoader, "apply");
    const theme = makeTheme();

    el.applyPreviewTheme(theme);

    expect(spy).toHaveBeenCalledWith(theme, el.shadowRoot, "auto");
    spy.mockRestore();
    unmount(el);
  });

  it("applyPreviewTheme with flat vars wraps in { variables: ... }", () => {
    const el = mount();
    const spy = vi.spyOn(ThemeLoader, "apply");
    const flatVars = { "--hrv-color-surface": "#fff" };

    el.applyPreviewTheme(flatVars);

    expect(spy).toHaveBeenCalledWith(
      { variables: flatVars },
      el.shadowRoot,
      "auto",
    );
    spy.mockRestore();
    unmount(el);
  });

  it("setTheme applies theme via ThemeLoader", () => {
    const el = mount();
    const spy = vi.spyOn(ThemeLoader, "apply");
    const theme = makeTheme();

    el.setTheme(theme);

    expect(spy).toHaveBeenCalledWith(theme, el.shadowRoot, "auto");
    spy.mockRestore();
    unmount(el);
  });

  it("respects data-color-scheme attribute", () => {
    const el = mount();
    el.setAttribute("data-color-scheme", "dark");
    const spy = vi.spyOn(ThemeLoader, "apply");

    el.applyPreviewTheme(makeTheme());

    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      el.shadowRoot,
      "dark",
    );
    spy.mockRestore();
    unmount(el);
  });

  it("detaches ThemeLoader on disconnect", () => {
    const el = mount();
    const spy = vi.spyOn(ThemeLoader, "detach");

    unmount(el);

    expect(spy).toHaveBeenCalledWith(el.shadowRoot);
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// CSS content
// ---------------------------------------------------------------------------

describe("HrvEntitiesBlock - CSS", () => {
  it("includes card styling variables in shadow CSS", () => {
    const el = mount();
    const css = el.shadowRoot.querySelector("style").textContent;

    expect(css).toContain("--hrv-color-surface");
    expect(css).toContain("--hrv-card-radius");
    expect(css).toContain("--hrv-card-shadow");
    expect(css).toContain("--hrv-color-border");
    expect(css).toContain("--hrv-color-text");
    unmount(el);
  });

  it("includes dark mode overrides", () => {
    const el = mount();
    const css = el.shadowRoot.querySelector("style").textContent;

    expect(css).toContain("prefers-color-scheme: dark");
    expect(css).toContain("data-color-scheme=dark");
    unmount(el);
  });

  it("includes reduced motion media query", () => {
    const el = mount();
    const css = el.shadowRoot.querySelector("style").textContent;

    expect(css).toContain("prefers-reduced-motion");
    unmount(el);
  });

  it("[part=block] uses theme variables for background, radius, shadow", () => {
    const el = mount();
    const css = el.shadowRoot.querySelector("style").textContent;

    expect(css).toContain("background: var(--hrv-color-surface)");
    expect(css).toContain("border-radius: var(--hrv-card-radius)");
    expect(css).toContain("box-shadow: var(--hrv-card-shadow)");
    unmount(el);
  });

  it("::slotted divider rule uses --hrv-color-border", () => {
    const el = mount();
    const css = el.shadowRoot.querySelector("style").textContent;

    expect(css).toContain("::slotted");
    expect(css).toContain("--hrv-color-border");
    unmount(el);
  });
});
