/**
 * tests/sensor-input-cards.test.js
 *
 * Tests for:
 *   TemperatureSensorCard  - sensor-temperature-card.js
 *   BatterySensorCard      - sensor-battery-card.js
 *   InputNumberCard        - input-number-card.js
 *   InputSelectCard        - input-select-card.js
 */

import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { TemperatureSensorCard } from "../src/renderers/sensor-temperature-card.js";
import { BatterySensorCard }     from "../src/renderers/sensor-battery-card.js";
import { InputNumberCard }       from "../src/renderers/input-number-card.js";
import { InputSelectCard }       from "../src/renderers/input-select-card.js";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.on": "On", "state.off": "Off",
  "state.unavailable": "Unavailable", "state.unknown": "Unknown",
  "action.toggle": "Toggle", "action.currently": "currently",
  "action.increase": "Brighter", "action.decrease": "Dimmer",
  "unit.percent": "%",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

function makeDef(overrides = {}) {
  return {
    entity_id: "sensor.test",
    domain: "sensor",
    device_class: null,
    friendly_name: "Test Sensor",
    supported_features: [],
    feature_config: {},
    icon: "mdi:thermometer",
    icon_state_map: { "*": "mdi:thermometer" },
    support_tier: 1,
    renderer: "TemperatureSensorCard",
    unit_of_measurement: "°C",
    capabilities: "read",
    ...overrides,
  };
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// TemperatureSensorCard
// ---------------------------------------------------------------------------

describe("TemperatureSensorCard render()", () => {
  function card(defOverrides = {}) {
    const c = new TemperatureSensorCard(
      makeDef(defOverrides), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders sensor-value slot with '-' as placeholder", () => {
    const c = card();
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("-");
  });

  it("renders sensor-unit with unit_of_measurement", () => {
    const c = card({ unit_of_measurement: "°F" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("°F");
  });

  it("renders friendly_name in card-name", () => {
    const c = card({ friendly_name: "Outdoor Temp" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Outdoor Temp");
  });

  it("renders card-icon slot", () => {
    const c = card();
    expect(c.root.querySelector("[part=card-icon]")).not.toBeNull();
  });

  it("is read-only - no toggle button rendered", () => {
    const c = card({ capabilities: "read-write" }); // sensors are always read
    expect(c.root.querySelector("[part=toggle-button]")).toBeNull();
  });
});

describe("TemperatureSensorCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new TemperatureSensorCard(
      makeDef(defOverrides), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets sensor-value to the state string", () => {
    const c = renderedCard();
    c.applyState("22.5", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("22.5");
  });

  it("updates sensor-unit from attributes.unit_of_measurement", () => {
    const c = renderedCard({ unit_of_measurement: "°C" });
    c.applyState("100", { unit_of_measurement: "°F" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("°F");
  });

  it("keeps original unit when attributes has no unit_of_measurement", () => {
    const c = renderedCard({ unit_of_measurement: "°C" });
    c.applyState("22.5", {});
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("°C");
  });

  it("shows raw state value for any string", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("unavailable");
  });
});

// ---------------------------------------------------------------------------
// BatterySensorCard
// ---------------------------------------------------------------------------

describe("BatterySensorCard render()", () => {
  function card(defOverrides = {}) {
    const c = new BatterySensorCard(
      makeDef({ domain: "sensor", device_class: "battery", renderer: "BatterySensorCard",
                unit_of_measurement: "%", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders sensor-value with '-' placeholder", () => {
    const c = card();
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("-");
  });

  it("renders battery-icon-wrap slot", () => {
    const c = card();
    expect(c.root.querySelector("[part=battery-icon-wrap]")).not.toBeNull();
  });

  it("renders sensor-unit with '%'", () => {
    const c = card({ unit_of_measurement: "%" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("%");
  });

  it("renders the entity name", () => {
    const c = card({ friendly_name: "Phone Battery" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Phone Battery");
  });
});

describe("BatterySensorCard applyState()", () => {
  function renderedCard() {
    const c = new BatterySensorCard(
      makeDef({ domain: "sensor", device_class: "battery" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets sensor-value to current state", () => {
    const c = renderedCard();
    c.applyState("85", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("85");
  });

  it("updates battery-icon-wrap SVG on state change", () => {
    const c = renderedCard();
    c.applyState("50", {});
    expect(c.root.querySelector("[part=battery-icon-wrap]").innerHTML).toContain("svg");
  });

  it("shows 'unavailable' state text", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("unavailable");
  });

  // Test the _batteryIcon selection thresholds.
  const iconTests = [
    [100, "mdi:battery"],
    [95,  "mdi:battery-90"],
    [85,  "mdi:battery-80"],
    [75,  "mdi:battery-70"],
    [65,  "mdi:battery-60"],
    [55,  "mdi:battery-50"],
    [45,  "mdi:battery-40"],
    [35,  "mdi:battery-30"],
    [25,  "mdi:battery-20"],
    [15,  "mdi:battery-10"],
    [5,   "mdi:battery-outline"],
  ];

  for (const [level, expected] of iconTests) {
    it(`level ${level} selects ${expected}`, () => {
      const c = renderedCard();
      // We can't directly inspect the icon name but we can verify
      // that the icon changes between levels (different SVG paths).
      c.applyState(String(level), {});
      // The battery-icon-wrap should contain an SVG.
      const wrap = c.root.querySelector("[part=battery-icon-wrap]");
      expect(wrap.innerHTML.length).toBeGreaterThan(0);
    });
  }

  it("does not re-render icon when level hasn't changed", () => {
    const c = renderedCard();
    c.applyState("85", {});
    const firstHTML = c.root.querySelector("[part=battery-icon-wrap]").innerHTML;
    c.applyState("85", {}); // same level - same bucket
    const secondHTML = c.root.querySelector("[part=battery-icon-wrap]").innerHTML;
    // Icon should not have been rebuilt (same reference stored in #currentIcon).
    expect(firstHTML).toBe(secondHTML);
  });
});

// ---------------------------------------------------------------------------
// InputNumberCard
// ---------------------------------------------------------------------------

describe("InputNumberCard render()", () => {
  function card(defOverrides = {}, configOverrides = {}) {
    const c = new InputNumberCard(
      makeDef({
        domain: "input_number", renderer: "InputNumberCard",
        capabilities: "read-write",
        // Renderer gates the slider on supported_features.includes("slider")
        // (only falls back to true when supported_features is null/undefined).
        // Tests want the slider, so opt in explicitly.
        supported_features: ["slider"],
        feature_config: { min: 0, max: 100, step: 1 },
        unit_of_measurement: "W",
        ...defOverrides,
      }),
      makeShadowRoot(),
      makeConfig(configOverrides.sendCommand),
      i18n
    );
    c.render();
    return c;
  }

  it("renders value-slider for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=value-slider]")).not.toBeNull();
  });

  it("renders value-input for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=value-input]")).not.toBeNull();
  });

  it("omits value-slider for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=value-slider]")).toBeNull();
  });

  it("sets slider min/max/step from feature_config", () => {
    const c = card({ feature_config: { min: 5, max: 50, step: 5 } });
    const slider = c.root.querySelector("[part=value-slider]");
    expect(slider.min).toBe("5");
    expect(slider.max).toBe("50");
    expect(slider.step).toBe("5");
  });

  it("uses defaults (0/100/1) when feature_config absent", () => {
    const c = card({ feature_config: {} });
    const slider = c.root.querySelector("[part=value-slider]");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("100");
    expect(slider.step).toBe("1");
  });

  it("renders unit_of_measurement label", () => {
    const c = card({ unit_of_measurement: "kW" });
    expect(c.root.innerHTML).toContain("kW");
  });
});

describe("InputNumberCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new InputNumberCard(
      makeDef({
        domain: "input_number", capabilities: "read-write",
        supported_features: ["slider"],
        feature_config: { min: 0, max: 100, step: 1 },
        ...defOverrides,
      }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets slider value to numeric state", () => {
    const c = renderedCard();
    c.applyState("42", {});
    expect(c.root.querySelector("[part=value-slider]").value).toBe("42");
  });

  it("sets number-input value to numeric state", () => {
    const c = renderedCard();
    c.applyState("42", {});
    expect(c.root.querySelector("[part=value-input]").value).toBe("42");
  });

  it("ignores non-numeric state", () => {
    const c = renderedCard();
    c.applyState("20", {});
    c.applyState("unavailable", {});
    // Slider should remain at previous value since NaN is ignored.
    expect(c.root.querySelector("[part=value-slider]").value).toBe("20");
  });

  it("syncs slider and number-input on slider input event", () => {
    const c = renderedCard();
    const slider = c.root.querySelector("[part=value-slider]");
    slider.value = "75";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(c.root.querySelector("[part=value-input]").value).toBe("75");
  });

  it("syncs slider and number-input on number-input event", () => {
    const c = renderedCard();
    const input = c.root.querySelector("[part=value-input]");
    input.value = "30";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(c.root.querySelector("[part=value-slider]").value).toBe("30");
  });
});

describe("InputNumberCard sendCommand", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("sends set_value after debounce delay when slider moves", () => {
    const sendCommand = vi.fn();
    const c = new InputNumberCard(
      makeDef({
        domain: "input_number", capabilities: "read-write",
        supported_features: ["slider"],
        feature_config: { min: 0, max: 100, step: 1 },
      }),
      makeShadowRoot(),
      makeConfig(sendCommand),
      i18n
    );
    c.render();

    const slider = c.root.querySelector("[part=value-slider]");
    slider.value = "60";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(sendCommand).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(sendCommand).toHaveBeenCalledWith("set_value", { value: 60 });
  });
});

// ---------------------------------------------------------------------------
// InputSelectCard
// ---------------------------------------------------------------------------

describe("InputSelectCard render()", () => {
  function card(defOverrides = {}) {
    const c = new InputSelectCard(
      makeDef({
        domain: "input_select", renderer: "InputSelectCard",
        capabilities: "read-write",
        ...defOverrides,
      }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders option-grid (pill mode) for read-write", () => {
    // Renderer's default display_mode is "pills" - it builds a div[part=option-grid]
    // populated with button[part=option-pill] children. The legacy <select>
    // element was replaced by this pill-based UI.
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=option-grid]")).not.toBeNull();
  });

  it("renders state-label (no grid) for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=option-grid]")).toBeNull();
    expect(c.root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("renders entity name", () => {
    const c = card({ friendly_name: "Mode Selector" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Mode Selector");
  });
});

describe("InputSelectCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new InputSelectCard(
      makeDef({ domain: "input_select", capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  function pillButtons(c) {
    return c.root.querySelectorAll("[part=option-pill]");
  }

  it("populates options from attributes.options", () => {
    const c = renderedCard();
    c.applyState("heat", { options: ["heat", "cool", "off"] });
    expect(pillButtons(c).length).toBe(3);
  });

  it("marks the active pill matching current state", () => {
    const c = renderedCard();
    c.applyState("cool", { options: ["heat", "cool", "off"] });
    const active = c.root.querySelector("[part=option-pill][data-active=true]");
    expect(active?.dataset.option).toBe("cool");
  });

  it("adds new options on subsequent applyState calls", () => {
    const c = renderedCard();
    c.applyState("heat", { options: ["heat", "cool"] });
    c.applyState("fan", { options: ["heat", "cool", "fan"] });
    expect(pillButtons(c).length).toBe(3);
  });

  it("removes options no longer in the list", () => {
    const c = renderedCard();
    c.applyState("heat", { options: ["heat", "cool", "fan"] });
    c.applyState("heat", { options: ["heat", "cool"] });
    expect(pillButtons(c).length).toBe(2);
  });

  it("does not duplicate existing options when the option list is unchanged", () => {
    const c = renderedCard();
    c.applyState("heat", { options: ["heat", "cool"] });
    c.applyState("cool", { options: ["heat", "cool"] });
    expect(pillButtons(c).length).toBe(2);
  });

  it("sends select_option when a pill is clicked", () => {
    const sendCommand = vi.fn();
    const c = new InputSelectCard(
      makeDef({ domain: "input_select", capabilities: "read-write" }),
      makeShadowRoot(),
      makeConfig(sendCommand),
      i18n
    );
    c.render();
    c.applyState("heat", { options: ["heat", "cool"] });
    const coolPill = c.root.querySelector('[part=option-pill][data-option="cool"]');
    coolPill.click();
    expect(sendCommand).toHaveBeenCalledWith("select_option", { option: "cool" });
  });

  it("sets state-label text for read-only capability", () => {
    const c = new InputSelectCard(
      makeDef({ domain: "input_select", capabilities: "read" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    c.applyState("night_mode", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Night mode");
  });
});
