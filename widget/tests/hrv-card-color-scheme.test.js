/**
 * Tests for explicit and automatic card color-scheme reflection.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/hrv-card.js";

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.style.colorScheme = "";
  document.head.querySelector('meta[name="color-scheme"]')?.remove();
});

describe("HrvCard color scheme reflection", () => {
  it("leaves true auto mode unforced so media queries remain reactive", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    const card = document.createElement("hrv-card");
    card.setAttribute("preview", "");
    document.body.appendChild(card);

    expect(card.hasAttribute("data-color-scheme")).toBe(false);
  });

  it("reflects a page-forced color scheme", () => {
    document.documentElement.style.colorScheme = "dark";
    const card = document.createElement("hrv-card");
    card.setAttribute("preview", "");
    document.body.appendChild(card);

    expect(card.getAttribute("data-color-scheme")).toBe("dark");
  });
});
