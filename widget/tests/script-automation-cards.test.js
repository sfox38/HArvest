/**
 * Tests for ScriptCard and AutomationCard renderers.
 */

import { describe, it, expect, afterEach, vi } from "vitest";
import { ScriptCard }     from "../src/renderers/script-card.js";
import { AutomationCard } from "../src/renderers/automation-card.js";

// ---- Shared helpers -------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.on": "On", "state.off": "Off",
  "state.unavailable": "Unavailable", "state.unknown": "Unknown",
  "state.running": "Running",
  "action.run": "Run",
  "action.trigger": "Trigger",
  "action.enable": "On",
  "action.disable": "Off",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

function simulateTap(element) {
  element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---- ScriptCard -----------------------------------------------------------

function makeScriptDef(overrides = {}) {
  return {
    entity_id: "script.morning_lights",
    domain: "script",
    device_class: null,
    friendly_name: "Morning Lights",
    supported_features: [],
    feature_config: {},
    icon: null,
    icon_state_map: null,
    support_tier: 1,
    renderer: "ScriptCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    service_data: {},
    ...overrides,
  };
}

describe("ScriptCard.staleOnMount", () => {
  it("is false", () => {
    expect(ScriptCard.staleOnMount).toBe(false);
  });
});

describe("ScriptCard render()", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new ScriptCard(makeScriptDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return c;
  }

  it("renders run button when writable", () => {
    expect(card().root.querySelector("[part=run-button]")).not.toBeNull();
  });

  it("renders no run button when read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=run-button]")).toBeNull();
  });

  it("renders row-run-btn in card-header when writable", () => {
    expect(card().root.querySelector("[part=row-run-btn]")).not.toBeNull();
  });

  it("renders no row-run-btn when read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=row-run-btn]")).toBeNull();
  });

  it("renders card-name with friendly_name", () => {
    const c = card({ friendly_name: "Night Scene" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Night Scene");
  });

  it("renders state-label slot", () => {
    expect(card().root.querySelector("[part=state-label]")).not.toBeNull();
  });
});

describe("ScriptCard applyState()", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new ScriptCard(makeScriptDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return c;
  }

  it("shows running label when state is on", () => {
    const c = card();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Running");
  });

  it("clears label when state is off", () => {
    const c = card();
    c.applyState("on", {});
    c.applyState("off", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("");
  });

  it("disables run-button while running", () => {
    const c = card();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=run-button]").disabled).toBe(true);
  });

  it("re-enables run-button when idle", () => {
    const c = card();
    c.applyState("on", {});
    c.applyState("off", {});
    expect(c.root.querySelector("[part=run-button]").disabled).toBe(false);
  });

  it("disables run-button when unavailable", () => {
    const c = card();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=run-button]").disabled).toBe(true);
  });

  it("disables row-run-btn while running", () => {
    const c = card();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=row-run-btn]").disabled).toBe(true);
  });

  it("sets data-running=true while running", () => {
    const c = card();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=run-button]").getAttribute("data-running")).toBe("true");
  });

  it("clears data-running when idle", () => {
    const c = card();
    c.applyState("on", {});
    c.applyState("off", {});
    expect(c.root.querySelector("[part=run-button]").getAttribute("data-running")).toBe("false");
  });
});

describe("ScriptCard commands", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new ScriptCard(makeScriptDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return { c, sendCommand };
  }

  it("run-button sends turn_on with service_data", () => {
    const sc = vi.fn();
    const { c } = card({ service_data: { brightness: 80 } }, sc);
    simulateTap(c.root.querySelector("[part=run-button]"));
    expect(sc).toHaveBeenCalledWith("turn_on", { brightness: 80 });
  });

  it("run-button sends turn_on with empty object when no service_data", () => {
    const sc = vi.fn();
    const { c } = card({ service_data: {} }, sc);
    simulateTap(c.root.querySelector("[part=run-button]"));
    expect(sc).toHaveBeenCalledWith("turn_on", {});
  });

  it("row-run-btn sends turn_on with service_data", () => {
    const sc = vi.fn();
    const { c } = card({ service_data: { scene: "night" } }, sc);
    simulateTap(c.root.querySelector("[part=row-run-btn]"));
    expect(sc).toHaveBeenCalledWith("turn_on", { scene: "night" });
  });
});

// ---- AutomationCard -------------------------------------------------------

function makeAutomationDef(overrides = {}) {
  return {
    entity_id: "automation.morning_routine",
    domain: "automation",
    device_class: null,
    friendly_name: "Morning Routine",
    supported_features: [],
    feature_config: {},
    icon: null,
    icon_state_map: null,
    support_tier: 1,
    renderer: "AutomationCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

describe("AutomationCard.staleOnMount", () => {
  it("is false", () => {
    expect(AutomationCard.staleOnMount).toBe(false);
  });
});

describe("AutomationCard render()", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new AutomationCard(makeAutomationDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return c;
  }

  it("renders trigger-button when writable", () => {
    const c = card();
    expect(c.root.querySelector("[part=trigger-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=enable-toggle]")).not.toBeNull();
  });

  it("renders no trigger-button when read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=trigger-button]")).toBeNull();
  });

  it("renders row trigger control when writable", () => {
    const c = card();
    expect(c.root.querySelector("[part=row-trigger-btn]")).not.toBeNull();
  });

  it("renders card-name with friendly_name", () => {
    const c = card({ friendly_name: "Evening Mode" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Evening Mode");
  });
});

describe("AutomationCard applyState()", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new AutomationCard(makeAutomationDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return c;
  }

  it("disables trigger-button and row-trigger-btn when unavailable", () => {
    const c = card();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=trigger-button]").disabled).toBe(true);
    expect(c.root.querySelector("[part=row-trigger-btn]").disabled).toBe(true);
    expect(c.root.querySelector("[part=enable-toggle]").disabled).toBe(true);
  });

  it("re-enables buttons when state is on after unavailable", () => {
    const c = card();
    c.applyState("unavailable", {});
    c.applyState("on", {});
    expect(c.root.querySelector("[part=trigger-button]").disabled).toBe(false);
  });
});

describe("AutomationCard commands", () => {
  function card(defOverrides = {}, sendCommand = vi.fn()) {
    const c = new AutomationCard(makeAutomationDef(defOverrides), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    return { c, sendCommand };
  }

  it("trigger-button sends trigger command", () => {
    const sc = vi.fn();
    const { c } = card({}, sc);
    c.applyState("on", {});
    simulateTap(c.root.querySelector("[part=trigger-button]"));
    expect(sc).toHaveBeenCalledWith("trigger", {});
  });

  it("row-trigger-btn sends trigger command", () => {
    const sc = vi.fn();
    const { c } = card({}, sc);
    c.applyState("on", {});
    simulateTap(c.root.querySelector("[part=row-trigger-btn]"));
    expect(sc).toHaveBeenCalledWith("trigger", {});
  });

  it("enable toggle sends turn_off when automation is enabled", () => {
    const sc = vi.fn();
    const { c } = card({}, sc);
    c.applyState("on", {});
    simulateTap(c.root.querySelector("[part=enable-toggle]"));
    expect(sc).toHaveBeenCalledWith("turn_off", {});
  });

  it("predicts enable and disable state changes", () => {
    const { c } = card();
    expect(c.predictState("turn_on", {})).toEqual({ state: "on", attributes: {} });
    expect(c.predictState("turn_off", {})).toEqual({ state: "off", attributes: {} });
  });

});
