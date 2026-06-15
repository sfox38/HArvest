/**
 * tests/fan-action-cards.test.js
 *
 * Tests for:
 *   FanCard - fan-card.js
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { FanCard }           from "../src/renderers/fan-card.js";

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
  "state.triggered": "Triggered",
  "action.toggle": "Toggle", "action.currently": "currently",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

/**
 * Simulate a tap on an element. The renderer's gesture handler uses
 * pointerdown + pointerup (not click), so a plain `.click()` in jsdom
 * does not trigger onTap.
 */
function simulateTap(element) {
  element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
}

function makeDef(overrides = {}) {
  return {
    entity_id: "fan.test",
    domain: "fan",
    device_class: null,
    friendly_name: "Ceiling Fan",
    supported_features: [],
    feature_config: {},
    icon: "mdi:fan",
    icon_state_map: { on: "mdi:fan", "*": "mdi:fan-off" },
    support_tier: 1,
    renderer: "FanCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// FanCard - render()
// ---------------------------------------------------------------------------

describe("FanCard render()", () => {
  function card(defOverrides = {}) {
    const c = new FanCard(
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

  it("renders speed slider when set_speed in supported_features", () => {
    const c = card({ supported_features: ["set_speed"] });
    expect(c.root.querySelector("[part=speed-slider]")).not.toBeNull();
  });

  it("omits speed slider when set_speed absent", () => {
    const c = card({ supported_features: [] });
    expect(c.root.querySelector("[part=speed-slider]")).toBeNull();
  });

  it("omits speed slider for read-only even if set_speed listed", () => {
    const c = card({ capabilities: "read", supported_features: ["set_speed"] });
    expect(c.root.querySelector("[part=speed-slider]")).toBeNull();
  });

  it("renders the entity name", () => {
    const c = card({ friendly_name: "Bedroom Fan" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Bedroom Fan");
  });

  it("renders state-label slot in read-only mode", () => {
    // state-label only renders when capabilities='read'; in read-write mode
    // the toggle button replaces the textual state display.
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("speed slider has 0-100 range", () => {
    const c = card({ supported_features: ["set_speed"] });
    const slider = c.root.querySelector("[part=speed-slider]");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("100");
  });
});

// ---------------------------------------------------------------------------
// FanCard - applyState()
// ---------------------------------------------------------------------------

describe("FanCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new FanCard(
      makeDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("sets state label text for 'on'", () => {
    // state-label only renders in read-only mode.
    const c = renderedCard({ capabilities: "read" });
    c.applyState("on", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("On");
  });

  it("sets state label text for 'off'", () => {
    const c = renderedCard({ capabilities: "read" });
    c.applyState("off", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Off");
  });

  it("sets button aria-pressed=true when on", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=toggle-button]").getAttribute("aria-pressed")).toBe("true");
  });

  it("sets button aria-pressed=false when off", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.root.querySelector("[part=toggle-button]").getAttribute("aria-pressed")).toBe("false");
  });

  it("disables button when unavailable", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=toggle-button]").disabled).toBe(true);
  });

  it("updates speed slider value from attributes.percentage", () => {
    const c = renderedCard({ supported_features: ["set_speed"] });
    c.applyState("on", { percentage: 75 });
    expect(c.root.querySelector("[part=speed-slider]").value).toBe("75");
  });

  it("updates speed-value display with percentage label", () => {
    const c = renderedCard({ supported_features: ["set_speed"] });
    c.applyState("on", { percentage: 50 });
    expect(c.root.querySelector("[part=speed-value]").textContent).toBe("50%");
  });

  it("falls back to 100% when percentage absent and state is on", () => {
    // The renderer computes percentage = attributes.percentage ?? (isOn ? 100 : 0),
    // so an applyState call with no percentage but state='on' resets the
    // slider to 100. Documents the current behavior.
    const c = renderedCard({ supported_features: ["set_speed"] });
    c.applyState("on", { percentage: 60 });
    c.applyState("on", {});
    expect(c.root.querySelector("[part=speed-slider]").value).toBe("100");
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

  it("toggle tap sends turn_on when fan is currently off", () => {
    // The renderer's tap handler dispatches turn_on/turn_off based on the
    // current isOn state, not a generic toggle command. With no prior
    // applyState, isOn defaults to false, so the tap sends turn_on.
    const sendCommand = vi.fn();
    const c = new FanCard(
      makeDef({ capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    simulateTap(c.root.querySelector("[part=toggle-button]"));
    expect(sendCommand).toHaveBeenCalledWith("turn_on", {});
  });
});

// ---------------------------------------------------------------------------
// FanCard - speed debounce
// ---------------------------------------------------------------------------

describe("FanCard speed debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("sends set_percentage after 300ms delay", () => {
    const sendCommand = vi.fn();
    const c = new FanCard(
      makeDef({ capabilities: "read-write", supported_features: ["set_speed"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();

    const slider = c.root.querySelector("[part=speed-slider]");
    slider.value = "80";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(sendCommand).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(sendCommand).toHaveBeenCalledWith("set_percentage", { percentage: 80 });
  });
});

// ---------------------------------------------------------------------------
// FanCard - predictState()
// ---------------------------------------------------------------------------

describe("FanCard predictState()", () => {
  function renderedCard() {
    const c = new FanCard(
      makeDef({ capabilities: "read-write" }), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("predicts 'on' for turn_on action", () => {
    const c = renderedCard();
    c.applyState("off", {});
    expect(c.predictState("turn_on", {})?.state).toBe("on");
  });

  it("predicts 'off' for turn_off action", () => {
    const c = renderedCard();
    c.applyState("on", {});
    expect(c.predictState("turn_off", {})?.state).toBe("off");
  });

  it("returns null for unknown actions", () => {
    const c = renderedCard();
    expect(c.predictState("not_a_real_action", {})).toBeNull();
  });
});

