/**
 * tests/hrv-mount-entities-block.test.js
 *
 * Tests the interaction between the data-attribute mount mode (hrv-mount.js)
 * and <hrv-entities-block>. A .hrv-mount placed directly inside an entities
 * block must be mounted as a *direct* <hrv-card> child of the block (the
 * wrapper div unwrapped), because the block's row layout and dividers only
 * apply to direct hrv-card children. Outside an entities block the card is
 * appended inside the .hrv-mount wrapper as usual.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

// jsdom does not implement window.matchMedia; stub it for ThemeLoader, which
// hrv-entities-block imports.
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

// Order matters: define the custom element, then start the mount observer.
import "../src/hrv-entities-block.js";
import "../src/hrv-mount.js";

async function waitFor(predicate, timeout = 500) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await new Promise((r) => setTimeout(r, 5));
  }
  throw new Error("waitFor: condition not met within timeout");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("hrv-mount inside hrv-entities-block", () => {
  it("unwraps the .hrv-mount into a direct hrv-card child of the block", async () => {
    const block = document.createElement("hrv-entities-block");
    const mount = document.createElement("div");
    mount.className = "hrv-mount";
    mount.dataset.token = "hwt_a3F9bC2d114eF5A6b7c8dE";
    mount.dataset.haUrl = "http://192.168.1.11:8123";
    mount.dataset.entity = "light.nuca_lamp";
    block.appendChild(mount);
    document.body.appendChild(block);

    await waitFor(() => block.querySelector("hrv-card"));

    const card = block.querySelector("hrv-card");
    expect(card).not.toBeNull();
    // Direct child of the block; wrapper div removed.
    expect(card.parentElement).toBe(block);
    expect(block.querySelector(".hrv-mount")).toBeNull();
    // Attributes carried over from the mount div.
    expect(card.getAttribute("entity")).toBe("light.nuca_lamp");
    expect(card.getAttribute("token")).toBe("hwt_a3F9bC2d114eF5A6b7c8dE");
    expect(card.getAttribute("ha-url")).toBe("http://192.168.1.11:8123");
  });

  it("lets the block apply row layout to the unwrapped card", async () => {
    const block = document.createElement("hrv-entities-block");
    const mount = document.createElement("div");
    mount.className = "hrv-mount";
    mount.dataset.token = "hwt_a3F9bC2d114eF5A6b7c8dE";
    mount.dataset.haUrl = "http://ha";
    mount.dataset.entity = "light.kitchen";
    block.appendChild(mount);
    document.body.appendChild(block);

    await waitFor(
      () => block.querySelector("hrv-card")?.getAttribute("layout") === "row",
    );
    expect(block.querySelector("hrv-card").getAttribute("layout")).toBe("row");
  });

  it("inherits token/ha-url from an ancestor .hrv-group div", async () => {
    const group = document.createElement("div");
    group.className = "hrv-group";
    group.dataset.token = "hwt_groupTok2d114eF5A6b7cd";
    group.dataset.haUrl = "http://ha.group";
    const block = document.createElement("hrv-entities-block");
    const mount = document.createElement("div");
    mount.className = "hrv-mount";
    mount.dataset.entity = "light.inherits";
    block.appendChild(mount);
    group.appendChild(block);
    document.body.appendChild(group);

    await waitFor(() => block.querySelector("hrv-card"));

    const card = block.querySelector("hrv-card");
    expect(card.parentElement).toBe(block);
    expect(card.getAttribute("token")).toBe("hwt_groupTok2d114eF5A6b7cd");
    expect(card.getAttribute("ha-url")).toBe("http://ha.group");
  });

  it("appends the card INSIDE the wrapper when not in an entities block", async () => {
    const mount = document.createElement("div");
    mount.className = "hrv-mount";
    mount.dataset.token = "hwt_a3F9bC2d114eF5A6b7c8dE";
    mount.dataset.haUrl = "http://ha";
    mount.dataset.entity = "light.standalone";
    document.body.appendChild(mount);

    await waitFor(() => mount.querySelector("hrv-card"));

    const card = mount.querySelector("hrv-card");
    expect(card.parentElement).toBe(mount); // wrapper preserved
  });
});
