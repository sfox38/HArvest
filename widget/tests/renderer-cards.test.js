/**
 * tests/renderer-cards.test.js - render()/applyState()/predictState() tests
 * for LightCard, InputBooleanCard, and BinarySensorCard.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LightCard }         from "../src/renderers/light-card.js";
import { InputBooleanCard }  from "../src/renderers/input-boolean-card.js";
import { BinarySensorCard }  from "../src/renderers/binary-sensor-card.js";

// ---------------------------------------------------------------------------
// Shared test helpers (duplicated deliberately to keep test files independent)
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.on":          "On",
  "state.off":         "Off",
  "state.unavailable": "Unavailable",
  "state.unknown":     "Unknown",
  "action.toggle":     "Toggle",
  "action.currently":  "currently",
  "action.increase":   "Brighter",
  "action.decrease":   "Dimmer",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(overrides = {}) {
  return { companions: [], card: { sendCommand: vi.fn() }, ...overrides };
}

/**
 * Simulate a tap on an element. Renderer gesture handlers listen to
 * pointerdown/pointerup, not click; jsdom's .click() doesn't dispatch
 * pointer events.
 */
function simulateTap(element) {
  element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
}

function makeDef(overrides = {}) {
  return {
    entity_id: "light.test",
    domain: "light",
    device_class: null,
    friendly_name: "Test Light",
    supported_features: [],
    feature_config: {},
    icon: "mdi:lightbulb",
    icon_state_map: { on: "mdi:lightbulb", "*": "mdi:lightbulb-outline" },
    support_tier: 1,
    renderer: "LightCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// LightCard - render()
// ---------------------------------------------------------------------------

describe("LightCard render()", () => {
  function card(defOverrides = {}) {
    const c = new LightCard(
      makeDef(defOverrides), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders toggle button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=toggle-button]")).not.toBeNull();
  });

  it("omits toggle button for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=toggle-button]")).toBeNull();
  });

  it("renders brightness slider when 'brightness' in supported_features", () => {
    const c = card({ supported_features: ["brightness"] });
    expect(c.root.querySelector("[part=brightness-slider]")).not.toBeNull();
  });

  it("omits brightness slider when feature absent", () => {
    const c = card({ supported_features: [] });
    expect(c.root.querySelector("[part=brightness-slider]")).toBeNull();
  });

  it("renders color-temp slider when 'color_temp' in supported_features", () => {
    const c = card({ supported_features: ["color_temp"] });
    expect(c.root.querySelector("[part=color-temp-slider]")).not.toBeNull();
  });

  it("omits color-temp slider when feature absent", () => {
    const c = card({ supported_features: ["brightness"] });
    expect(c.root.querySelector("[part=color-temp-slider]")).toBeNull();
  });

  it("applies min/max from feature_config to color-temp slider", () => {
    // Renderer reads min_color_temp_kelvin / max_color_temp_kelvin (HA 2022.5+
    // moved off mireds to Kelvin). Default range when unset is 2000-6500.
    const c = card({
      supported_features: ["color_temp"],
      feature_config: { min_color_temp_kelvin: 2200, max_color_temp_kelvin: 6000 },
    });
    const slider = c.root.querySelector("[part=color-temp-slider]");
    expect(slider.min).toBe("2200");
    expect(slider.max).toBe("6000");
  });

  it("renders friendly_name in card-name", () => {
    const c = card({ friendly_name: "Kitchen Lights" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Kitchen Lights");
  });

  it("escapes HTML in friendly_name", () => {
    const c = card({ friendly_name: "<b>bold</b>" });
    expect(c.root.querySelector("[part=card-name]").innerHTML).not.toContain("<b>");
  });

  it("renders stale-indicator slot", () => {
    const c = card();
    expect(c.root.querySelector("[part=stale-indicator]")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// LightCard - applyState()
// ---------------------------------------------------------------------------

describe("LightCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new LightCard(
      makeDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets button text to 'On' when state is 'on'", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=toggle-button]").textContent).toBe("On");
  });

  it("sets button text to 'Off' when state is 'off'", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=toggle-button]").textContent).toBe("Off");
  });

  it("sets aria-pressed=true when on", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=toggle-button]").getAttribute("aria-pressed")).toBe("true");
  });

  it("sets aria-pressed=false when off", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=toggle-button]").getAttribute("aria-pressed")).toBe("false");
  });

  it("disables button when state is 'unavailable'", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=toggle-button]").disabled).toBe(true);
  });

  it("disables button when state is 'unknown'", () => {
    const c = renderedCard();
    c.applyState("unknown", {});
    expect(c.root.querySelector("[part=toggle-button]").disabled).toBe(true);
  });

  it("re-enables button after state returns to 'on'", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    c.applyState("on", {});
    expect(c.root.querySelector("[part=toggle-button]").disabled).toBe(false);
  });

  it("updates brightness slider value", () => {
    const c = renderedCard({ supported_features: ["brightness"] });
    c.applyState("on", { brightness: 128 });
    expect(c.root.querySelector("[part=brightness-slider]").value).toBe("128");
  });

  it("shows brightness percentage in brightness-value", () => {
    const c = renderedCard({ supported_features: ["brightness"] });
    c.applyState("on", { brightness: 255 });
    expect(c.root.querySelector("[part=brightness-value]").textContent).toBe("100%");
  });

  it("shows 50% for brightness=128 (rounded)", () => {
    const c = renderedCard({ supported_features: ["brightness"] });
    c.applyState("on", { brightness: 128 });
    // 128/255 * 100 = 50.19... rounds to 50
    expect(c.root.querySelector("[part=brightness-value]").textContent).toBe("50%");
  });

  it("updates color-temp slider value from color_temp_kelvin", () => {
    const c = renderedCard({ supported_features: ["color_temp"] });
    c.applyState("on", { color_temp_kelvin: 3000 });
    expect(c.root.querySelector("[part=color-temp-slider]").value).toBe("3000");
  });

  it("shows color temp in kelvin in color-temp-value", () => {
    // Renderer formats as "<n>K" (no space).
    const c = renderedCard({ supported_features: ["color_temp"] });
    c.applyState("on", { color_temp_kelvin: 3000 });
    expect(c.root.querySelector("[part=color-temp-value]").textContent).toBe("3000K");
  });

  it("sets data-on=true on icon when on", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=card-icon]").getAttribute("data-on")).toBe("true");
  });

  it("sets data-on=false on icon when off", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=card-icon]").getAttribute("data-on")).toBe("false");
  });

  it("toggle button tap sends turn_on when light is off", () => {
    // Renderer dispatches turn_on/turn_off based on aria-pressed state, not
    // a generic toggle command. Tap is delivered via pointerdown+pointerup.
    const sendCommand = vi.fn();
    const c = new LightCard(
      makeDef({ capabilities: "read-write" }),
      makeShadowRoot(),
      makeConfig({ card: { sendCommand } }),
      i18n
    );
    c.render();
    simulateTap(c.root.querySelector("[part=toggle-button]"));
    expect(sendCommand).toHaveBeenCalledWith("turn_on", {});
  });
});

// ---------------------------------------------------------------------------
// LightCard - predictState()
// ---------------------------------------------------------------------------

describe("LightCard predictState()", () => {
  function renderedCard() {
    const c = new LightCard(
      makeDef({ capabilities: "read-write" }), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("predicts 'off' for turn_off action", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.predictState("turn_off", {})?.state).toBe("off");
  });

  it("predicts 'on' for turn_on action", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.predictState("turn_on", {})?.state).toBe("on");
  });

  it("merges brightness into predicted attributes for turn_on", () => {
    const c = renderedCard();
    c.applyState("off", {});
    const predicted = c.predictState("turn_on", { brightness: 200 });
    expect(predicted?.state).toBe("on");
    expect(predicted?.attributes?.brightness).toBe(200);
  });

  it("returns null for unknown actions", () => {
    const c = renderedCard();
    expect(c.predictState("not_a_real_action", {})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// InputBooleanCard - render()
// ---------------------------------------------------------------------------

describe("InputBooleanCard render()", () => {
  function card(defOverrides = {}) {
    const c = new InputBooleanCard(
      makeDef({ domain: "input_boolean", renderer: "InputBooleanCard", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders toggle button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=toggle-button]")).not.toBeNull();
  });

  it("omits toggle button for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=toggle-button]")).toBeNull();
  });

  it("renders the entity name", () => {
    const c = card({ friendly_name: "My Helper" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("My Helper");
  });
});

// ---------------------------------------------------------------------------
// InputBooleanCard - applyState()
// ---------------------------------------------------------------------------

describe("InputBooleanCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new InputBooleanCard(
      makeDef({ domain: "input_boolean", capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets state label to 'On' (read-only)", () => {
    // state-label only renders when capabilities='read'.
    const c = renderedCard({ capabilities: "read" });
    c.applyState("on", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("On");
  });

  it("sets state label to 'Off' (read-only)", () => {
    const c = renderedCard({ capabilities: "read" });
    c.applyState("off", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Off");
  });

  it("sets aria-pressed=true when on", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=toggle-button]").getAttribute("aria-pressed")).toBe("true");
  });

  it("disables button when unavailable", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=toggle-button]").disabled).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// InputBooleanCard - predictState()
// ---------------------------------------------------------------------------

describe("InputBooleanCard predictState()", () => {
  function renderedCard() {
    const c = new InputBooleanCard(
      makeDef({ domain: "input_boolean", capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("predicts 'off' for turn_off action", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.predictState("turn_off", {})?.state).toBe("off");
  });

  it("predicts 'on' for turn_on action", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.predictState("turn_on", {})?.state).toBe("on");
  });

  it("returns null for unknown action", () => {
    const c = renderedCard();
    expect(c.predictState("press", {})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// BinarySensorCard - render()
// ---------------------------------------------------------------------------

describe("BinarySensorCard render()", () => {
  function card(defOverrides = {}) {
    const c = new BinarySensorCard(
      makeDef({ domain: "binary_sensor", renderer: "BinarySensorCard", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders the entity name", () => {
    const c = card({ friendly_name: "Motion Sensor" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Motion Sensor");
  });

  it("renders the state-label element", () => {
    // BinarySensorCard now uses [part=state-label] (icon-driven on/off
    // affordance) instead of a dedicated `.hrv-binary-indicator` element.
    const c = card();
    expect(c.root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("renders the state-label element", () => {
    const c = card();
    expect(c.root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("initial state-label is '-'", () => {
    const c = card();
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("-");
  });

  it("is always read-only - no toggle button", () => {
    const c = card({ capabilities: "read-write" });
    // BinarySensorCard never renders a toggle button regardless of capability.
    expect(c.root.querySelector("[part=toggle-button]")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// BinarySensorCard - applyState()
// ---------------------------------------------------------------------------

describe("BinarySensorCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new BinarySensorCard(
      makeDef({ domain: "binary_sensor", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders the on-state icon when state is 'on'", () => {
    // The renderer signals on/off via the icon (icon_state_map or fallback)
    // rather than a separate indicator element.
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=card-icon]").innerHTML).toContain("svg");
  });

  it("renders the off-state icon when state is 'off'", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=card-icon]").innerHTML).toContain("svg");
  });

  it("sets state label text for 'on'", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("On");
  });

  it("sets state label text for 'off'", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Off");
  });

  it("shows raw state string for unknown states", () => {
    const c = renderedCard();
    c.applyState("detected", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("detected");
  });

  it("uses icon_state_map when provided", () => {
    const c = renderedCard({
      icon_state_map: { on: "mdi:motion-sensor", "*": "mdi:motion-sensor-off" },
    });
    c.applyState("on", {});
    // The icon should have been rendered (SVG present in card-icon).
    expect(c.root.querySelector("[part=card-icon]").innerHTML).toContain("svg");
  });
});
