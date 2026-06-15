/**
 * Tests for theme application and host-style isolation.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeLoader } from "../src/theme-loader.js";

function makeRoot() {
  const host = document.createElement("hrv-card");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
  });
});

afterEach(() => {
  document.body.innerHTML = "";
  document.head.querySelectorAll("[data-hrv-font]").forEach((el) => el.remove());
  ThemeLoader._clearCache();
});

describe("ThemeLoader host isolation", () => {
  it("preserves host-page inline styles when applying and replacing themes", () => {
    const root = makeRoot();
    root.host.style.width = "75%";

    ThemeLoader.apply({ variables: { "--hrv-color-primary": "#123456" } }, root);
    ThemeLoader.apply({ variables: { "--hrv-card-radius": "12px" } }, root);

    expect(root.host.style.width).toBe("75%");
    expect(root.host.style.getPropertyValue("--hrv-color-primary")).toBe("");
    expect(root.host.style.getPropertyValue("--hrv-card-radius")).toBe("12px");
  });

  it("clear removes only ThemeLoader-owned variables", () => {
    const root = makeRoot();
    root.host.style.setProperty("--site-owned", "keep");
    root.host.style.setProperty("--hrv-color-primary", "#abcdef");
    ThemeLoader.apply({ variables: { "--hrv-color-primary": "#123456" } }, root);

    ThemeLoader.clear(root);

    expect(root.host.style.getPropertyValue("--site-owned")).toBe("keep");
    expect(root.host.style.getPropertyValue("--hrv-color-primary")).toBe("#abcdef");
  });
});

describe("ThemeLoader automatic color scheme", () => {
  it("re-applies dark variables when the OS preference changes", () => {
    let changeHandler;
    const media = {
      matches: false,
      addEventListener: vi.fn((_event, handler) => { changeHandler = handler; }),
    };
    window.matchMedia = vi.fn().mockReturnValue(media);
    const root = makeRoot();
    const theme = {
      variables: { "--hrv-color-primary": "#111111" },
      dark_variables: { "--hrv-color-primary": "#eeeeee" },
    };
    ThemeLoader.apply(theme, root, "auto");
    expect(root.host.style.getPropertyValue("--hrv-color-primary")).toBe("#111111");

    media.matches = true;
    changeHandler();

    expect(root.host.style.getPropertyValue("--hrv-color-primary")).toBe("#eeeeee");
  });
});

describe("ThemeLoader custom font validation", () => {
  it("rejects descriptors that escape the generated font-face rule", () => {
    const root = makeRoot();

    ThemeLoader.apply({
      variables: {},
      custom_fonts: [{
        family: "Unsafe",
        url: "https://ha.example/unsafe.woff2",
        weight: "400",
        style: "normal;}body{background:red}/*",
      }],
    }, root);

    expect(document.head.querySelector("[data-hrv-font]")).toBeNull();
  });

  it("accepts documented font weight ranges and styles", () => {
    const root = makeRoot();

    ThemeLoader.apply({
      variables: {},
      custom_fonts: [{
        family: "Inter",
        url: "https://ha.example/inter.woff2",
        weight: "200 800",
        style: "italic",
      }],
    }, root);

    const style = document.head.querySelector("[data-hrv-font]");
    expect(style).not.toBeNull();
    expect(style.textContent).toContain("font-weight:200 800");
    expect(style.textContent).toContain("font-style:italic");
  });
});
