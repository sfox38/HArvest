/**
 * tests/cover-sensor-cards.test.js
 *
 * Tests for:
 *   CoverCard          - cover-card.js
 *   GenericSensorCard  - sensor-generic-card.js
 *   HumiditySensorCard - sensor-humidity-card.js
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { CoverCard }          from "../src/renderers/cover-card.js";
import { GenericSensorCard }  from "../src/renderers/sensor-generic-card.js";
import { HumiditySensorCard } from "../src/renderers/sensor-humidity-card.js";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.open":    "Open",
  "state.closed":  "Closed",
  "state.opening": "Opening",
  "state.closing": "Closing",
  "state.stopped": "Stopped",
  "cover.open":     "Open",
  "cover.close":    "Close",
  "cover.stop":     "Stop",
  "cover.position": "Position",
  "cover.tilt":     "Tilt",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

function makeDef(overrides = {}) {
  return {
    entity_id: "cover.test",
    domain: "cover",
    device_class: null,
    friendly_name: "Test Cover",
    // Default to ["buttons"] so the open/stop/close buttons render. The
    // CoverCard renderer gates buttons on supported_features.includes("buttons").
    // Tests that need a different feature set (e.g. ["set_position"]) override
    // this and accept that buttons are absent in those cases.
    supported_features: ["buttons"],
    feature_config: {},
    icon: "mdi:window-shutter",
    icon_state_map: {
      open: "mdi:window-shutter-open",
      opening: "mdi:window-shutter-open",
      "*": "mdi:window-shutter",
    },
    support_tier: 1,
    renderer: "CoverCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// CoverCard - render()
// ---------------------------------------------------------------------------

describe("CoverCard render()", () => {
  function card(defOverrides = {}) {
    const c = new CoverCard(
      makeDef(defOverrides), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders open button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=open-button]")).not.toBeNull();
  });

  it("renders stop button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=stop-button]")).not.toBeNull();
  });

  it("renders close button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=close-button]")).not.toBeNull();
  });

  it("omits control buttons for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=open-button]")).toBeNull();
    expect(c.root.querySelector("[part=stop-button]")).toBeNull();
    expect(c.root.querySelector("[part=close-button]")).toBeNull();
  });

  it("renders position slider when set_position in supported_features", () => {
    const c = card({ supported_features: ["set_position"] });
    expect(c.root.querySelector("[part=position-slider]")).not.toBeNull();
  });

  it("omits position slider when feature absent", () => {
    const c = card({ supported_features: [] });
    expect(c.root.querySelector("[part=position-slider]")).toBeNull();
  });

  it("renders tilt slider when set_tilt_position in supported_features", () => {
    const c = card({ supported_features: ["set_tilt_position"] });
    expect(c.root.querySelector("[part=tilt-slider]")).not.toBeNull();
  });

  it("omits tilt slider when show_tilt is false", () => {
    const c = new CoverCard(
      makeDef({ supported_features: ["set_tilt_position"] }),
      makeShadowRoot(), { ...makeConfig(), displayHints: { show_tilt: false } }, i18n
    );
    c.render();
    expect(c.root.querySelector("[part=tilt-slider]")).toBeNull();
  });

  it("renders entity name", () => {
    const c = card({ friendly_name: "Garage Door" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Garage Door");
  });

  it("renders state-label slot in read-only mode", () => {
    // CoverCard renders [part=state-label] only when capabilities='read'.
    // In read-write mode, the buttons replace the textual state display.
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=state-label]")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CoverCard - applyState()
// ---------------------------------------------------------------------------

describe("CoverCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new CoverCard(
      makeDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("shows translated state label for 'open'", () => {
    // state-label only renders in read-only mode.
    const c = renderedCard({ capabilities: "read" });
    c.applyState("open", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Open");
  });

  it("shows translated state label for 'closed'", () => {
    const c = renderedCard({ capabilities: "read" });
    c.applyState("closed", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Closed");
  });

  it("shows raw state for unknown states", () => {
    const c = renderedCard({ capabilities: "read" });
    c.applyState("half_open", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("half_open");
  });

  it("stop button is enabled only while cover is moving (opening)", () => {
    const c = renderedCard();
    c.applyState("opening", {});
    expect(c.root.querySelector("[part=stop-button]").disabled).toBe(false);
  });

  it("stop button is enabled only while cover is moving (closing)", () => {
    const c = renderedCard();
    c.applyState("closing", {});
    expect(c.root.querySelector("[part=stop-button]").disabled).toBe(false);
  });

  it("stop button is disabled when cover is not moving", () => {
    const c = renderedCard();
    c.applyState("open", {});
    expect(c.root.querySelector("[part=stop-button]").disabled).toBe(true);
  });

  it("updates position slider from attributes.current_position", () => {
    const c = renderedCard({ supported_features: ["set_position"] });
    c.applyState("open", { current_position: 75 });
    expect(c.root.querySelector("[part=position-slider]").value).toBe("75");
  });

  it("shows position percentage in position-value", () => {
    const c = renderedCard({ supported_features: ["set_position"] });
    c.applyState("open", { current_position: 50 });
    expect(c.root.querySelector("[part=position-value]").textContent).toBe("50%");
  });

  it("updates tilt slider and value from current_tilt_position", () => {
    const c = renderedCard({ supported_features: ["set_tilt_position"] });
    c.applyState("open", { current_tilt_position: 35 });
    expect(c.root.querySelector("[part=tilt-slider]").value).toBe("35");
    expect(c.root.querySelector("[part=tilt-value]").textContent).toBe("35%");
  });

  it("open button sends open_cover", () => {
    const sendCommand = vi.fn();
    const c = new CoverCard(
      makeDef({ capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.root.querySelector("[part=open-button]").click();
    expect(sendCommand).toHaveBeenCalledWith("open_cover", {});
  });

  it("close button sends close_cover", () => {
    const sendCommand = vi.fn();
    const c = new CoverCard(
      makeDef({ capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.root.querySelector("[part=close-button]").click();
    expect(sendCommand).toHaveBeenCalledWith("close_cover", {});
  });

  it("stop button sends stop_cover", () => {
    const sendCommand = vi.fn();
    const c = new CoverCard(
      makeDef({ capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    // Enable stop by setting state to 'opening'.
    c.applyState("opening", {});
    c.root.querySelector("[part=stop-button]").click();
    expect(sendCommand).toHaveBeenCalledWith("stop_cover", {});
  });
});

// ---------------------------------------------------------------------------
// CoverCard - position debounce
// ---------------------------------------------------------------------------

describe("CoverCard position debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("sends set_cover_position after 300ms", () => {
    const sendCommand = vi.fn();
    const c = new CoverCard(
      makeDef({ capabilities: "read-write", supported_features: ["set_position"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();

    const slider = c.root.querySelector("[part=position-slider]");
    slider.value = "40";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(sendCommand).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(sendCommand).toHaveBeenCalledWith("set_cover_position", { position: 40 });
  });

  it("sends set_cover_tilt_position after 300ms", () => {
    const sendCommand = vi.fn();
    const c = new CoverCard(
      makeDef({ capabilities: "read-write", supported_features: ["set_tilt_position"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();

    const slider = c.root.querySelector("[part=tilt-slider]");
    slider.value = "60";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(sendCommand).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(sendCommand).toHaveBeenCalledWith("set_cover_tilt_position", { tilt_position: 60 });
  });
});

// ---------------------------------------------------------------------------
// GenericSensorCard
// ---------------------------------------------------------------------------

describe("GenericSensorCard render()", () => {
  function card(defOverrides = {}) {
    const c = new GenericSensorCard(
      {
        entity_id: "sensor.test",
        domain: "sensor",
        device_class: null,
        friendly_name: "Power Sensor",
        supported_features: [],
        feature_config: {},
        icon: "mdi:gauge",
        icon_state_map: { "*": "mdi:gauge" },
        support_tier: 2,
        renderer: "GenericSensorCard",
        unit_of_measurement: "W",
        capabilities: "read",
        ...defOverrides,
      },
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders sensor-value with '-' placeholder", () => {
    const c = card();
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("-");
  });

  it("renders sensor-unit with unit", () => {
    const c = card({ unit_of_measurement: "kWh" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("kWh");
  });

  it("renders entity name", () => {
    const c = card({ friendly_name: "Solar Panel" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Solar Panel");
  });

  it("renders empty unit when unit_of_measurement is null", () => {
    const c = card({ unit_of_measurement: null });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("");
  });
});

describe("GenericSensorCard applyState()", () => {
  function renderedCard() {
    const c = new GenericSensorCard(
      {
        entity_id: "sensor.test", domain: "sensor", device_class: null,
        friendly_name: "Test", supported_features: [], feature_config: {},
        icon: "mdi:gauge", icon_state_map: {}, support_tier: 2,
        renderer: "GenericSensorCard", unit_of_measurement: "W", capabilities: "read",
      },
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets sensor-value to state string", () => {
    const c = renderedCard();
    c.applyState("1500", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("1500");
  });

  it("updates sensor-unit from attributes", () => {
    const c = renderedCard();
    c.applyState("100", { unit_of_measurement: "kW" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("kW");
  });

  it("keeps original unit when no unit in attributes", () => {
    const c = renderedCard();
    c.applyState("100", {});
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("W");
  });
});

// ---------------------------------------------------------------------------
// HumiditySensorCard
// ---------------------------------------------------------------------------

describe("HumiditySensorCard", () => {
  function card(defOverrides = {}) {
    const c = new HumiditySensorCard(
      {
        entity_id: "sensor.humidity",
        domain: "sensor",
        device_class: "humidity",
        friendly_name: "Humidity Sensor",
        supported_features: [],
        feature_config: {},
        icon: "mdi:water-percent",
        icon_state_map: { "*": "mdi:water-percent" },
        support_tier: 1,
        renderer: "HumiditySensorCard",
        unit_of_measurement: "%",
        capabilities: "read",
        ...defOverrides,
      },
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders sensor-value with '-' placeholder", () => {
    const c = card();
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("-");
  });

  it("renders sensor-unit", () => {
    const c = card({ unit_of_measurement: "%" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("%");
  });

  it("applyState updates sensor-value", () => {
    const c = card();
    c.applyState("65", {});
    expect(c.root.querySelector("[part=sensor-value]").textContent).toBe("65");
  });

  it("applyState keeps unit fixed from render time (not updated from attributes)", () => {
    // HumiditySensorCard ignores attributes in applyState - unit is render-only.
    const c = card({ unit_of_measurement: "%" });
    c.applyState("65", { unit_of_measurement: "% RH" });
    expect(c.root.querySelector("[part=sensor-unit]").textContent).toBe("%");
  });

  it("renders entity name", () => {
    const c = card({ friendly_name: "Bathroom Humidity" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Bathroom Humidity");
  });
});
