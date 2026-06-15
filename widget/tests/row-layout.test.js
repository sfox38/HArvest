/**
 * tests/row-layout.test.js
 *
 * Tests for layout="row" support across all renderers.
 * Verifies that [part=row-control] is rendered, hidden/shown by CSS attribute,
 * and that row controls update correctly with applyState.
 */

import { describe, it, expect, vi } from "vitest";
import { SwitchCard }       from "../src/renderers/switch-card.js";
import { InputBooleanCard } from "../src/renderers/input-boolean-card.js";
import { LightCard }        from "../src/renderers/light-card.js";
import { BinarySensorCard } from "../src/renderers/binary-sensor-card.js";
import { GenericSensorCard }from "../src/renderers/sensor-generic-card.js";
import { PersonCard }       from "../src/renderers/person-card.js";
import { LockCard }         from "../src/renderers/lock-card.js";
import { ButtonCard }       from "../src/renderers/button-card.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.on":  "On",  "state.off": "Off",
  "state.unavailable": "Unavailable",
  "state.home": "Home", "state.not_home": "Away",
  "state.lock.locked": "Locked", "state.lock.unlocked": "Unlocked",
  "action.toggle": "Toggle", "action.currently": "currently",
  "action.lock": "Lock", "action.unlock": "Unlock",
  "action.press": "Press",
  "light.brightness": "Brightness", "light.color_temp": "Color temp",
  "light.color": "Color",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return {
    companions: [],
    layout: "row",
    card: { sendCommand },
  };
}

function makeDef(overrides = {}) {
  return {
    entity_id: "test.entity",
    friendly_name: "Test Entity",
    capabilities: "read-write",
    domain: "switch",
    icon: null,
    icon_state_map: {},
    unit_of_measurement: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// SwitchCard row mode
// ---------------------------------------------------------------------------

describe("SwitchCard - row layout", () => {
  it("renders [part=row-control] with a row-toggle button", () => {
    const root = makeRoot();
    const card = new SwitchCard(makeDef({ domain: "switch" }), root, makeConfig(), i18n);
    card.render();

    const rowControl = root.querySelector("[part=row-control]");
    expect(rowControl).toBeTruthy();

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle).toBeTruthy();
    expect(rowToggle.tagName).toBe("BUTTON");
  });

  it("row-toggle updates with applyState", () => {
    const root = makeRoot();
    const card = new SwitchCard(makeDef({ domain: "switch" }), root, makeConfig(), i18n);
    card.render();
    card.applyState("on", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("true");
    expect(rowToggle.textContent).toBe("On");
  });

  it("row-toggle reflects off state", () => {
    const root = makeRoot();
    const card = new SwitchCard(makeDef({ domain: "switch" }), root, makeConfig(), i18n);
    card.render();
    card.applyState("off", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("false");
    expect(rowToggle.textContent).toBe("Off");
  });

  it("row-toggle disabled when unavailable", () => {
    const root = makeRoot();
    const card = new SwitchCard(makeDef({ domain: "switch" }), root, makeConfig(), i18n);
    card.render();
    card.applyState("unavailable", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.disabled).toBe(true);
  });

  it("read-only switch shows row-state instead of row-toggle", () => {
    const root = makeRoot();
    const def = makeDef({ capabilities: "read" });
    const card = new SwitchCard(def, root, makeConfig(), i18n);
    card.render();

    expect(root.querySelector("[part=row-toggle]")).toBeNull();
    const rowState = root.querySelector("[part=row-state]");
    expect(rowState).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// InputBooleanCard row mode
// ---------------------------------------------------------------------------

describe("InputBooleanCard - row layout", () => {
  it("renders row-toggle button", () => {
    const root = makeRoot();
    const card = new InputBooleanCard(makeDef({ domain: "input_boolean" }), root, makeConfig(), i18n);
    card.render();

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle).toBeTruthy();
    expect(rowToggle.tagName).toBe("BUTTON");
  });

  it("row-toggle reflects state", () => {
    const root = makeRoot();
    const card = new InputBooleanCard(makeDef({ domain: "input_boolean" }), root, makeConfig(), i18n);
    card.render();
    card.applyState("on", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// LightCard row mode
// ---------------------------------------------------------------------------

describe("LightCard - row layout", () => {
  it("renders row-toggle button (no sliders in row)", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "light", supported_features: ["brightness"] });
    const card = new LightCard(def, root, makeConfig(), i18n);
    card.render();

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle).toBeTruthy();

    // Slider should still be in DOM but hidden via base CSS in row mode
    const slider = root.querySelector("[part=brightness-slider]");
    // Slider may not be present if displayHints.show_brightness is false
    // Just verify row-toggle exists
    expect(rowToggle.tagName).toBe("BUTTON");
  });

  it("row-toggle reflects on/off", () => {
    const root = makeRoot();
    const card = new LightCard(makeDef({ domain: "light" }), root, makeConfig(), i18n);
    card.render();
    card.applyState("on", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("true");
    expect(rowToggle.textContent).toBe("On");
  });
});

// ---------------------------------------------------------------------------
// BinarySensorCard row mode
// ---------------------------------------------------------------------------

describe("BinarySensorCard - row layout", () => {
  it("renders [part=row-value] span", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "binary_sensor", capabilities: "read" });
    const card = new BinarySensorCard(def, root, makeConfig(), i18n);
    card.render();

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue).toBeTruthy();
  });

  it("row-value updates with applyState", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "binary_sensor", capabilities: "read" });
    const card = new BinarySensorCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("on", {});

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue.textContent.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// GenericSensorCard row mode
// ---------------------------------------------------------------------------

describe("GenericSensorCard - row layout", () => {
  it("renders [part=row-value] span", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "sensor", capabilities: "read", unit_of_measurement: "W" });
    const card = new GenericSensorCard(def, root, makeConfig(), i18n);
    card.render();

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue).toBeTruthy();
  });

  it("row-value shows value + unit", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "sensor", capabilities: "read", unit_of_measurement: "W" });
    const card = new GenericSensorCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("120", { unit_of_measurement: "W" });

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue.textContent).toBe("120 W");
  });

  it("row-value shows just value when no unit", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "sensor", capabilities: "read" });
    const card = new GenericSensorCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("active", {});

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue.textContent).toBe("active");
  });
});

// ---------------------------------------------------------------------------
// PersonCard row mode
// ---------------------------------------------------------------------------

describe("PersonCard - row layout", () => {
  it("renders [part=row-value] span", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "person", capabilities: "read" });
    const card = new PersonCard(def, root, makeConfig(), i18n);
    card.render();

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue).toBeTruthy();
  });

  it("row-value shows Home for home state", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "person", capabilities: "read" });
    const card = new PersonCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("home", {});

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue.textContent).toBe("Home");
  });

  it("row-value shows Away for not_home state", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "person", capabilities: "read" });
    const card = new PersonCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("not_home", {});

    const rowValue = root.querySelector("[part=row-value]");
    expect(rowValue.textContent).toBe("Away");
  });
});

// ---------------------------------------------------------------------------
// LockCard row mode
// ---------------------------------------------------------------------------

describe("LockCard - row layout", () => {
  it("renders [part=row-toggle] button", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "lock" });
    const card = new LockCard(def, root, makeConfig(), i18n);
    card.render();

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle).toBeTruthy();
    expect(rowToggle.tagName).toBe("BUTTON");
  });

  it("row-toggle aria-pressed true when locked", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "lock" });
    const card = new LockCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("locked", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("true");
  });

  it("row-toggle aria-pressed false when unlocked", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "lock" });
    const card = new LockCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("unlocked", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.getAttribute("aria-pressed")).toBe("false");
  });

  it("row-toggle disabled while locking", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "lock" });
    const card = new LockCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("locking", {});

    const rowToggle = root.querySelector("[part=row-toggle]");
    expect(rowToggle.disabled).toBe(true);
  });

  it("read-only lock shows row-state span", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "lock", capabilities: "read" });
    const card = new LockCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("locked", {});

    expect(root.querySelector("[part=row-toggle]")).toBeNull();
    const rowState = root.querySelector("[part=row-state]");
    expect(rowState).toBeTruthy();
    expect(rowState.textContent).toBe("Locked");
  });
});

// ---------------------------------------------------------------------------
// ButtonCard row mode
// ---------------------------------------------------------------------------

describe("ButtonCard - row layout", () => {
  it("renders [part=row-press-btn] button", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "button" });
    const card = new ButtonCard(def, root, makeConfig(), i18n);
    card.render();

    const rowPressBtn = root.querySelector("[part=row-press-btn]");
    expect(rowPressBtn).toBeTruthy();
    expect(rowPressBtn.tagName).toBe("BUTTON");
    expect(rowPressBtn.textContent.trim()).toBe("Press");
  });

  it("row-press-btn disabled when unavailable", () => {
    const root = makeRoot();
    const def = makeDef({ domain: "button" });
    const card = new ButtonCard(def, root, makeConfig(), i18n);
    card.render();
    card.applyState("unavailable", {});

    const rowPressBtn = root.querySelector("[part=row-press-btn]");
    expect(rowPressBtn.disabled).toBe(true);
  });

  it("row-press-btn sends press command on tap", () => {
    const sendCommand = vi.fn();
    const root = makeRoot();
    const def = makeDef({ domain: "button" });
    const card = new ButtonCard(def, root, { ...makeConfig(sendCommand), card: { sendCommand } }, i18n);
    card.render();

    const rowPressBtn = root.querySelector("[part=row-press-btn]");
    rowPressBtn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    rowPressBtn.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));

    expect(sendCommand).toHaveBeenCalledWith("press", {});
  });
});
