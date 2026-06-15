/**
 * tests/renderers.test.js - Tests for renderer index and BaseCard helpers,
 * plus render()/applyState() on SwitchCard and GenericCard.
 *
 * jsdom provides full shadow DOM support. Each test builds a real shadow root
 * so the templates are parsed by an actual HTML parser.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  lookupRenderer,
  registerRenderer,
  LightCard,
  SwitchCard,
  FanCard,
  ClimateCard,
  CoverCard,
  MediaPlayerCard,
  GenericCard,
  BinarySensorCard,
  TemperatureSensorCard,
  HumiditySensorCard,
  BatterySensorCard,
  GenericSensorCard,
  InputBooleanCard,
  InputNumberCard,
  InputSelectCard,
} from "../src/renderers/index.js";
import { BaseCard } from "../src/renderers/base-card.js";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Create a real shadow root in jsdom. */
function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

/** Minimal entity definition. */
function makeDef(overrides = {}) {
  return {
    entity_id:  "switch.test",
    domain:     "switch",
    device_class: null,
    friendly_name: "Test Switch",
    supported_features: [],
    feature_config: {},
    icon: "mdi:toggle-switch",
    icon_state_map: { on: "mdi:toggle-switch", "*": "mdi:toggle-switch-off" },
    support_tier: 1,
    renderer: "SwitchCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

/** Minimal i18n mock. */
function makeI18n() {
  const translations = {
    "state.on":          "On",
    "state.off":         "Off",
    "state.unavailable": "Unavailable",
    "state.unknown":     "Unknown",
    "action.toggle":     "Toggle",
    "action.currently":  "currently",
  };
  return {
    t: (key) => translations[key] ?? key,
  };
}

/** Minimal config mock. */
function makeConfig(overrides = {}) {
  return {
    companions: [],
    card: {
      sendCommand: vi.fn(),
    },
    ...overrides,
  };
}

function makeCard(CardClass, defOverrides = {}, configOverrides = {}) {
  const root   = makeShadowRoot();
  const def    = makeDef(defOverrides);
  const config = makeConfig(configOverrides);
  const i18n   = makeI18n();
  return new CardClass(def, root, config, i18n);
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

// Clean up appended host elements after each test.
afterEach(() => {
  for (const host of [...document.body.children]) {
    host.remove();
  }
});

// ---------------------------------------------------------------------------
// lookupRenderer
// ---------------------------------------------------------------------------

describe("lookupRenderer", () => {
  it("returns LightCard for domain 'light'", () => {
    expect(lookupRenderer("light", null)).toBe(LightCard);
  });

  it("returns SwitchCard for domain 'switch'", () => {
    expect(lookupRenderer("switch", null)).toBe(SwitchCard);
  });

  it("returns FanCard for domain 'fan'", () => {
    expect(lookupRenderer("fan", null)).toBe(FanCard);
  });

  it("returns ClimateCard for domain 'climate'", () => {
    expect(lookupRenderer("climate", null)).toBe(ClimateCard);
  });

  it("returns CoverCard for domain 'cover'", () => {
    expect(lookupRenderer("cover", null)).toBe(CoverCard);
  });

  it("returns MediaPlayerCard for domain 'media_player'", () => {
    expect(lookupRenderer("media_player", null)).toBe(MediaPlayerCard);
  });

  it("returns GenericCard for unknown domain", () => {
    expect(lookupRenderer("totally_unknown", null)).toBe(GenericCard);
  });

  it("returns GenericCard when domain is 'generic'", () => {
    expect(lookupRenderer("generic", null)).toBe(GenericCard);
  });

  it("returns TemperatureSensorCard for sensor.temperature", () => {
    expect(lookupRenderer("sensor", "temperature")).toBe(TemperatureSensorCard);
  });

  it("returns HumiditySensorCard for sensor.humidity", () => {
    expect(lookupRenderer("sensor", "humidity")).toBe(HumiditySensorCard);
  });

  it("returns BatterySensorCard for sensor.battery", () => {
    expect(lookupRenderer("sensor", "battery")).toBe(BatterySensorCard);
  });

  it("returns GenericSensorCard for sensor with unknown device_class", () => {
    expect(lookupRenderer("sensor", "illuminance_unknown")).toBe(GenericSensorCard);
  });

  it("returns GenericSensorCard for sensor with null device_class", () => {
    expect(lookupRenderer("sensor", null)).toBe(GenericSensorCard);
  });

  it("returns BinarySensorCard for domain 'binary_sensor'", () => {
    expect(lookupRenderer("binary_sensor", null)).toBe(BinarySensorCard);
  });

  it("returns InputBooleanCard for 'input_boolean'", () => {
    expect(lookupRenderer("input_boolean", null)).toBe(InputBooleanCard);
  });

  it("specific domain.device_class key takes priority over domain key", () => {
    // sensor.temperature should beat "sensor".
    expect(lookupRenderer("sensor", "temperature")).not.toBe(GenericSensorCard);
  });
});

// ---------------------------------------------------------------------------
// registerRenderer
// ---------------------------------------------------------------------------

describe("registerRenderer", () => {
  it("registers a custom renderer and lookupRenderer returns it", () => {
    class MyCustomCard extends BaseCard {
      render() {}
      applyState() {}
    }
    registerRenderer("custom_domain", MyCustomCard);
    expect(lookupRenderer("custom_domain", null)).toBe(MyCustomCard);
  });

  it("last-write-wins on collision", () => {
    class CardV1 extends BaseCard { render() {} applyState() {} }
    class CardV2 extends BaseCard { render() {} applyState() {} }
    registerRenderer("collision_domain", CardV1);
    registerRenderer("collision_domain", CardV2);
    expect(lookupRenderer("collision_domain", null)).toBe(CardV2);
  });

  it("emits a console.warn on collision", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    class CardA extends BaseCard { render() {} applyState() {} }
    class CardB extends BaseCard { render() {} applyState() {} }
    registerRenderer("warn_test_domain", CardA);
    registerRenderer("warn_test_domain", CardB);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("warn_test_domain")
    );
    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// BaseCard - abstract interface
// ---------------------------------------------------------------------------

describe("BaseCard abstract interface", () => {
  class ConcreteCard extends BaseCard {
    render()            { this.root.innerHTML = "<div></div>"; }
    applyState()        {}
  }

  it("render() throws on the base class itself", () => {
    const card = makeCard(ConcreteCard);
    // Verify base class throws by calling super explicitly (unusual but valid test).
    const base = new BaseCard(makeDef(), makeShadowRoot(), makeConfig(), makeI18n());
    expect(() => base.render()).toThrow("must implement render");
  });

  it("applyState() throws on the base class itself", () => {
    const base = new BaseCard(makeDef(), makeShadowRoot(), makeConfig(), makeI18n());
    expect(() => base.applyState("on", {})).toThrow("must implement applyState");
  });

  it("predictState() returns null by default", () => {
    const card = makeCard(ConcreteCard);
    expect(card.predictState("toggle", {})).toBeNull();
  });
});

describe("BaseCard renderer contract", () => {
  it("adds a stable part to interactive elements that omit one", () => {
    class ContractCard extends BaseCard {
      render() {
        this.root.innerHTML = '<button type="button">Action</button><input type="range">';
      }
      applyState() {}
    }
    const card = makeCard(ContractCard);
    card.render();
    card.finalizeRender();

    expect([...card.root.querySelectorAll("button, input")].every((el) => el.getAttribute("part") === "control")).toBe(true);
  });

  it("preserves renderer-specific parts", () => {
    class ContractCard extends BaseCard {
      render() {
        this.root.innerHTML = '<button type="button" part="toggle-button">Action</button>';
      }
      applyState() {}
    }
    const card = makeCard(ContractCard);
    card.render();
    card.finalizeRender();

    expect(card.root.querySelector("button").getAttribute("part")).toBe("toggle-button");
  });
});

describe("BaseCard gesture accessibility", () => {
  class GestureCard extends BaseCard {
    render() {}
    applyState() {}
  }

  it("runs tap actions from Enter and Space", () => {
    const onTap = vi.fn();
    const card = makeCard(GestureCard);
    const target = document.createElement("div");
    card.root.appendChild(target);
    card._attachGestureHandlers(target, { onTap });

    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    target.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(onTap).toHaveBeenCalledTimes(2);
    expect(target.tabIndex).toBe(0);
    expect(target.getAttribute("role")).toBe("button");
  });

  it("does not run a card gesture from descendants of nested controls", () => {
    const onTap = vi.fn();
    const card = makeCard(GestureCard);
    const target = document.createElement("div");
    target.innerHTML = '<button type="button"><span>Child</span></button>';
    card.root.appendChild(target);
    card._attachGestureHandlers(target, { onTap });
    const child = target.querySelector("span");

    child.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    child.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));

    expect(onTap).not.toHaveBeenCalled();
  });

  it("ignores configured gestures in row layout while preserving explicit controls", () => {
    const sendCommand = vi.fn();
    const explicitTap = vi.fn();
    const card = makeCard(GestureCard, {}, {
      layout: "row",
      gestureConfig: { tap: { action: "toggle" } },
      card: { sendCommand },
    });
    const cardTarget = document.createElement("div");
    const controlTarget = document.createElement("button");
    card.root.append(cardTarget, controlTarget);

    card._attachGestureHandlers(cardTarget);
    card._attachGestureHandlers(controlTarget, { onTap: explicitTap });
    simulateTap(cardTarget);
    simulateTap(controlTarget);

    expect(sendCommand).not.toHaveBeenCalled();
    expect(explicitTap).toHaveBeenCalledTimes(1);
    expect(cardTarget.hasAttribute("role")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// BaseCard.setAriaLabel
// ---------------------------------------------------------------------------

describe("BaseCard.setAriaLabel", () => {
  class MinCard extends BaseCard {
    render()     {}
    applyState() {}
  }

  it("sets aria-label on an element", () => {
    const card = makeCard(MinCard);
    const el = document.createElement("button");
    card.setAriaLabel(el, "My Label");
    expect(el.getAttribute("aria-label")).toBe("My Label");
  });

  it("is a no-op when el is null", () => {
    const card = makeCard(MinCard);
    // Should not throw.
    expect(() => card.setAriaLabel(null, "label")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// BaseCard.debounce
// ---------------------------------------------------------------------------

describe("BaseCard.debounce", () => {
  class MinCard extends BaseCard {
    render()     {}
    applyState() {}
  }

  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  it("delays execution by the given ms", () => {
    const card = makeCard(MinCard);
    const fn   = vi.fn();
    const dFn  = card.debounce(fn, 100);

    dFn();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("resets timer on repeated calls", () => {
    const card = makeCard(MinCard);
    const fn   = vi.fn();
    const dFn  = card.debounce(fn, 100);

    dFn();
    vi.advanceTimersByTime(50);
    dFn(); // resets
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("passes arguments to the wrapped function", () => {
    const card = makeCard(MinCard);
    const fn   = vi.fn();
    const dFn  = card.debounce(fn, 10);

    dFn(42, "hello");
    vi.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledWith(42, "hello");
  });
});

// ---------------------------------------------------------------------------
// BaseCard.renderCompanionZoneHTML
// ---------------------------------------------------------------------------

describe("BaseCard.renderCompanionZoneHTML", () => {
  class MinCard extends BaseCard {
    render()     {}
    applyState() {}
  }

  it("returns empty string when no companions configured", () => {
    const card = makeCard(MinCard, {}, { companions: [] });
    expect(card.renderCompanionZoneHTML()).toBe("");
  });

  it("returns HTML with companion-zone part when companions present", () => {
    const card = makeCard(MinCard, {}, {
      companions: [{ entityId: "light.other" }],
    });
    const html = card.renderCompanionZoneHTML();
    expect(html).toContain('part="companion-zone"');
  });
});

describe("BaseCard companion actions", () => {
  class CompanionCard extends BaseCard {
    render() {
      this.root.innerHTML = this.renderCompanionZoneHTML();
      this.renderCompanions();
    }
    applyState() {}
  }

  function companionCard(companion) {
    const send = vi.fn();
    const card = makeCard(CompanionCard, {}, {
      companions: [companion],
      card: { _sendCompanionCommand: send },
    });
    card.render();
    return { card, send };
  }

  it("toggles toggle-capable companions", () => {
    const { card, send } = companionCard({
      entityId: "light.other", domain: "light", capabilities: "read-write",
    });
    simulateTap(card.root.querySelector("[part=companion]"));
    expect(send).toHaveBeenCalledWith("light.other", "toggle", {});
  });

  it("locks or unlocks a lock companion based on its current state", () => {
    const { card, send } = companionCard({
      entityId: "lock.front", domain: "lock", capabilities: "read-write",
    });
    const pill = card.root.querySelector("[part=companion]");
    pill.dataset.state = "locked";
    simulateTap(pill);
    expect(send).toHaveBeenLastCalledWith("lock.front", "unlock", {});

    pill.dataset.state = "unlocked";
    simulateTap(pill);
    expect(send).toHaveBeenLastCalledWith("lock.front", "lock", {});
  });

  it("presses button companions", () => {
    const { card, send } = companionCard({
      entityId: "button.chime", domain: "button", capabilities: "read-write",
    });
    simulateTap(card.root.querySelector("[part=companion]"));
    expect(send).toHaveBeenCalledWith("button.chime", "press", {});
  });

  it("keeps display-only companion domains non-interactive", () => {
    const { card, send } = companionCard({
      entityId: "weather.home", domain: "weather", capabilities: "read-write",
    });
    const pill = card.root.querySelector("[part=companion]");
    expect(pill.tagName).toBe("DIV");
    expect(pill.hasAttribute("data-interactive")).toBe(false);
    simulateTap(pill);
    expect(send).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// SwitchCard.render
// ---------------------------------------------------------------------------

describe("SwitchCard render()", () => {
  it("creates a toggle button for read-write capability", () => {
    const card = makeCard(SwitchCard, { capabilities: "read-write" });
    card.render();
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn).not.toBeNull();
  });

  it("does not create a toggle button for read-only capability", () => {
    const card = makeCard(SwitchCard, { capabilities: "read" });
    card.render();
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn).toBeNull();
  });

  it("renders the entity friendly name", () => {
    const card = makeCard(SwitchCard, { friendly_name: "Porch Light" });
    card.render();
    const nameEl = card.root.querySelector("[part=card-name]");
    expect(nameEl.textContent).toBe("Porch Light");
  });

  it("escapes HTML in friendly_name", () => {
    const card = makeCard(SwitchCard, { friendly_name: "<script>alert(1)</script>" });
    card.render();
    const nameEl = card.root.querySelector("[part=card-name]");
    expect(nameEl.innerHTML).not.toContain("<script>");
  });

  it("renders card-icon slot", () => {
    const card = makeCard(SwitchCard);
    card.render();
    expect(card.root.querySelector("[part=card-icon]")).not.toBeNull();
  });

  it("renders state-label slot in read-only mode", () => {
    // state-label only renders for capabilities='read'; in read-write mode
    // the toggle button replaces the textual state display.
    const card = makeCard(SwitchCard, { capabilities: "read" });
    card.render();
    expect(card.root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("does not render companion zone when no companions", () => {
    const card = makeCard(SwitchCard, {}, { companions: [] });
    card.render();
    expect(card.root.querySelector("[part=companion-zone]")).toBeNull();
  });

  it("renders companion zone when companions present", () => {
    const card = makeCard(SwitchCard, {}, {
      companions: [{ entityId: "light.other" }],
      card: { sendCommand: vi.fn() },
    });
    card.render();
    expect(card.root.querySelector("[part=companion-zone]")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SwitchCard.applyState
// ---------------------------------------------------------------------------

describe("SwitchCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const card = makeCard(SwitchCard, { capabilities: "read-write", ...defOverrides });
    card.render();
    return card;
  }

  it("sets state label text for 'on'", () => {
    // state-label only renders in read-only mode.
    const card = makeCard(SwitchCard, { capabilities: "read" });
    card.render();
    card.applyState("on", {});
    const label = card.root.querySelector("[part=state-label]");
    expect(label.textContent).toBe("On");
  });

  it("sets state label text for 'off'", () => {
    const card = makeCard(SwitchCard, { capabilities: "read" });
    card.render();
    card.applyState("off", {});
    const label = card.root.querySelector("[part=state-label]");
    expect(label.textContent).toBe("Off");
  });

  it("sets aria-pressed=true when state is 'on'", () => {
    const card = renderedCard();
    card.applyState("on", {});
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("sets aria-pressed=false when state is 'off'", () => {
    const card = renderedCard();
    card.applyState("off", {});
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("disables button when state is 'unavailable'", () => {
    const card = renderedCard();
    card.applyState("unavailable", {});
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn.disabled).toBe(true);
  });

  it("disables button when state is 'unknown'", () => {
    const card = renderedCard();
    card.applyState("unknown", {});
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn.disabled).toBe(true);
  });

  it("enables button when state is 'on'", () => {
    const card = renderedCard();
    card.applyState("unavailable", {});
    card.applyState("on", {});
    const btn = card.root.querySelector("[part=toggle-button]");
    expect(btn.disabled).toBe(false);
  });

  it("button tap sends turn_off when state is 'on'", () => {
    // Renderer dispatches turn_on/turn_off based on aria-pressed, not a
    // generic toggle. Tap is delivered via pointerdown+pointerup.
    const sendCommand = vi.fn();
    const card = makeCard(SwitchCard,
      { capabilities: "read-write" },
      { companions: [], card: { sendCommand } }
    );
    card.render();
    card.applyState("on", {});
    simulateTap(card.root.querySelector("[part=toggle-button]"));
    expect(sendCommand).toHaveBeenCalledWith("turn_off", {});
  });
});

// ---------------------------------------------------------------------------
// SwitchCard.predictState
// ---------------------------------------------------------------------------

describe("SwitchCard predictState()", () => {
  function renderedCard() {
    const card = makeCard(SwitchCard, { capabilities: "read-write" });
    card.render();
    return card;
  }

  it("predicts 'off' for turn_off", () => {
    const card = renderedCard();
    card.applyState("on", {});
    const predicted = card.predictState("turn_off", {});
    expect(predicted?.state).toBe("off");
  });

  it("predicts 'on' for turn_on", () => {
    const card = renderedCard();
    card.applyState("off", {});
    const predicted = card.predictState("turn_on", {});
    expect(predicted?.state).toBe("on");
  });

  it("returns null for unknown action", () => {
    const card = renderedCard();
    expect(card.predictState("not_a_real_action", {})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// GenericCard.render
// ---------------------------------------------------------------------------

describe("GenericCard render()", () => {
  it("renders the entity name", () => {
    const card = makeCard(GenericCard, {
      domain: "custom_domain",
      friendly_name: "My Custom Entity",
    });
    card.render();
    const nameEl = card.root.querySelector("[part=card-name]");
    expect(nameEl.textContent).toBe("My Custom Entity");
  });

  it("renders without a domain badge", () => {
    const card = makeCard(GenericCard, { domain: "custom_domain", friendly_name: "test" });
    card.render();
    expect(card.root.innerHTML).not.toContain("custom_domain");
  });

  it("renders state-label with default placeholder '-'", () => {
    const card = makeCard(GenericCard);
    card.render();
    const label = card.root.querySelector("[part=state-label]");
    expect(label.textContent).toBe("-");
  });
});

// ---------------------------------------------------------------------------
// GenericCard.applyState
// ---------------------------------------------------------------------------

describe("GenericCard applyState()", () => {
  it("updates state label for a known state", () => {
    const card = makeCard(GenericCard, { domain: "sensor", friendly_name: "test" });
    card.render();
    card.applyState("on", {});
    const label = card.root.querySelector("[part=state-label]");
    expect(label.textContent).toBe("On");
  });

  it("shows raw state string for unknown state keys", () => {
    const card = makeCard(GenericCard, { domain: "sensor", friendly_name: "test" });
    card.render();
    card.applyState("charging", {});
    const label = card.root.querySelector("[part=state-label]");
    // i18n falls back to the key if not found; raw state shown.
    expect(label.textContent).toBe("charging");
  });
});
