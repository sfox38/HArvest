/**
 * tests/climate-media-cards.test.js
 *
 * Tests for:
 *   ClimateCard     - climate-card.js
 *   (MediaPlayerCard and RemoteCard - structural smoke tests)
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { ClimateCard }     from "../src/renderers/climate-card.js";
import { MediaPlayerCard } from "../src/renderers/media-player-card.js";
import { RemoteCard }      from "../src/renderers/remote-card.js";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.heating":  "Heating",
  "state.cooling":  "Cooling",
  "state.idle":     "Idle",
  "state.off":      "Off",
  "state.on":       "On",
  "state.playing":  "Playing",
  "state.paused":   "Paused",
  "state.standby":  "Standby",
  "climate.heat":   "Heat",
  "climate.cool":   "Cool",
  "climate.off":    "Off",
  "climate.auto":   "Auto",
  "climate.dry":    "Dry",
  "climate.fan_only": "Fan Only",
  "climate.heat_cool": "Heat/Cool",
  "action.play":    "Play",
  "action.pause":   "Pause",
  "action.next":    "Next",
  "action.previous": "Previous",
  "action.mute":    "Mute",
  "action.unmute":  "Unmute",
  "action.press":   "Press",
  "media.volume":   "Volume",
  "media.source":   "Source",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

function simulateTap(element) {
  element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
}

function makeClimateDef(overrides = {}) {
  return {
    entity_id: "climate.test",
    domain: "climate",
    device_class: null,
    friendly_name: "Thermostat",
    supported_features: [],
    feature_config: { min_temp: 16, max_temp: 30, temp_step: 0.5 },
    icon: "mdi:thermostat",
    icon_state_map: {},
    support_tier: 1,
    renderer: "ClimateCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// ClimateCard - render()
// ---------------------------------------------------------------------------

describe("ClimateCard render()", () => {
  function card(defOverrides = {}) {
    const c = new ClimateCard(
      makeClimateDef(defOverrides), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("renders current-temp slot with '-' placeholder", () => {
    const c = card();
    expect(c.root.querySelector("[part=current-temp]").textContent).toBe("-");
  });

  it("renders mode-select for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=mode-select]")).not.toBeNull();
  });

  it("omits mode-select for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=mode-select]")).toBeNull();
  });

  it("mode-select has all HVAC mode options", () => {
    const c = card({ capabilities: "read-write" });
    const select = c.root.querySelector("[part=mode-select]");
    const values = [...select.options].map((o) => o.value);
    expect(values).toContain("heat");
    expect(values).toContain("cool");
    expect(values).toContain("off");
    expect(values).toContain("auto");
  });

  it("renders target-temp-input when target_temperature in supported_features", () => {
    const c = card({ supported_features: ["target_temperature"] });
    expect(c.root.querySelector("[part=target-temp-input]")).not.toBeNull();
  });

  it("omits target-temp-input when feature absent", () => {
    const c = card({ supported_features: [] });
    expect(c.root.querySelector("[part=target-temp-input]")).toBeNull();
  });

  it("renders low/high inputs when target_temperature_range in supported_features", () => {
    const c = card({ supported_features: ["target_temperature_range"] });
    expect(c.root.querySelector("[part=target-temp-low-input]")).not.toBeNull();
    expect(c.root.querySelector("[part=target-temp-high-input]")).not.toBeNull();
  });

  it("does not render single target-temp-input when range is present", () => {
    const c = card({ supported_features: ["target_temperature_range"] });
    expect(c.root.querySelector("[part=target-temp-input]")).toBeNull();
  });

  it("applies min/max/step from feature_config to target-temp-input", () => {
    const c = card({
      supported_features: ["target_temperature"],
      feature_config: { min_temp: 10, max_temp: 40, temp_step: 1 },
    });
    const input = c.root.querySelector("[part=target-temp-input]");
    expect(input.min).toBe("10");
    expect(input.max).toBe("40");
    expect(input.step).toBe("1");
  });

  it("renders entity name", () => {
    const c = card({ friendly_name: "Living Room Thermostat" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Living Room Thermostat");
  });
});

// ---------------------------------------------------------------------------
// ClimateCard - applyState()
// ---------------------------------------------------------------------------

describe("ClimateCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new ClimateCard(
      makeClimateDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("updates current-temp from attributes.current_temperature", () => {
    // Renderer always appends a unit (def.unit_of_measurement or fallback '°').
    const c = renderedCard();
    c.applyState("heat", { current_temperature: 21.5 });
    expect(c.root.querySelector("[part=current-temp]").textContent).toBe("21.5°");
  });

  it("appends unit to current-temp when provided on def", () => {
    // The renderer reads unit_of_measurement from the entity def, not from
    // the state attributes (which is consistent with HA: unit is a property
    // of the entity, not the state).
    const c = renderedCard({ unit_of_measurement: "°C" });
    c.applyState("heat", { current_temperature: 21.5 });
    expect(c.root.querySelector("[part=current-temp]").textContent).toBe("21.5°C");
  });

  it("shows hvac_action in state-label when present (read-only)", () => {
    // state-label only renders for capabilities='read'.
    const c = renderedCard({ capabilities: "read" });
    c.applyState("heat", { hvac_action: "heating" });
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Heating");
  });

  it("shows raw state in state-label when hvac_action absent (read-only)", () => {
    const c = renderedCard({ capabilities: "read" });
    c.applyState("heat", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("heat");
  });

  it("sets mode-select value to current state", () => {
    // The renderer sets mode-select.value = state (the climate state IS the
    // hvac_mode in HA's model). Pass hvac_modes in feature_config so the
    // <option> elements exist.
    const c = renderedCard({
      feature_config: { min_temp: 16, max_temp: 30, temp_step: 0.5, hvac_modes: ["heat", "cool", "off"] },
    });
    c.applyState("heat", {});
    expect(c.root.querySelector("[part=mode-select]").value).toBe("heat");
  });

  it("sets target-temp-input from attributes.temperature", () => {
    const c = renderedCard({ supported_features: ["target_temperature"] });
    c.applyState("heat", { temperature: 22 });
    expect(c.root.querySelector("[part=target-temp-input]").value).toBe("22");
  });

  it("sets low/high inputs from attributes", () => {
    const c = renderedCard({ supported_features: ["target_temperature_range"] });
    c.applyState("heat_cool", { target_temp_low: 18, target_temp_high: 26 });
    expect(c.root.querySelector("[part=target-temp-low-input]").value).toBe("18");
    expect(c.root.querySelector("[part=target-temp-high-input]").value).toBe("26");
  });

  it("mode-select change sends set_hvac_mode command", () => {
    const sendCommand = vi.fn();
    const c = new ClimateCard(
      makeClimateDef({ capabilities: "read-write" }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();

    const select = c.root.querySelector("[part=mode-select]");
    select.value = "cool";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(sendCommand).toHaveBeenCalledWith("set_hvac_mode", { hvac_mode: "cool" });
  });
});

// ---------------------------------------------------------------------------
// ClimateCard - temperature debounce
// ---------------------------------------------------------------------------

describe("ClimateCard temperature debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("sends set_temperature after 500ms for target-temp-input", () => {
    const sendCommand = vi.fn();
    const c = new ClimateCard(
      makeClimateDef({ capabilities: "read-write", supported_features: ["target_temperature"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();

    const input = c.root.querySelector("[part=target-temp-input]");
    input.value = "22";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(sendCommand).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(sendCommand).toHaveBeenCalledWith("set_temperature", { temperature: 22 });
  });
});

// ---------------------------------------------------------------------------
// MediaPlayerCard - structural smoke tests
// ---------------------------------------------------------------------------

describe("MediaPlayerCard render() smoke tests", () => {
  function makeMediaDef(overrides = {}) {
    return {
      entity_id: "media_player.test",
      domain: "media_player",
      device_class: null,
      friendly_name: "Living Room Speaker",
      supported_features: [],
      feature_config: {},
      icon: "mdi:cast",
      icon_state_map: { playing: "mdi:cast-connected", "*": "mdi:cast" },
      support_tier: 1,
      renderer: "MediaPlayerCard",
      unit_of_measurement: null,
      capabilities: "read-write",
      ...overrides,
    };
  }

  it("renders without throwing", () => {
    const c = new MediaPlayerCard(
      makeMediaDef(), makeShadowRoot(), makeConfig(), i18n
    );
    expect(() => c.render()).not.toThrow();
  });

  it("renders card-name", () => {
    const c = new MediaPlayerCard(
      makeMediaDef({ friendly_name: "Bedroom Speaker" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Bedroom Speaker");
  });

  it("renders media controls only for their independent supported features", () => {
    const c = new MediaPlayerCard(
      makeMediaDef({ supported_features: ["play_pause", "next_track", "volume_mute", "select_source"] }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();

    expect(c.root.querySelector("[part=play-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=prev-button]")).toBeNull();
    expect(c.root.querySelector("[part=next-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=mute-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=volume-slider]")).toBeNull();
    expect(c.root.querySelector("[part=source-select]")).not.toBeNull();
  });

  it("renders volume step buttons without a volume slider", () => {
    const c = new MediaPlayerCard(
      makeMediaDef({ supported_features: ["volume_step"] }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();

    expect(c.root.querySelector("[part=volume-down-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=volume-up-button]")).not.toBeNull();
    expect(c.root.querySelector("[part=volume-slider]")).toBeNull();
    expect(c.root.querySelector("[part=mute-button]")).toBeNull();
  });

  it("sends power and volume step commands", () => {
    const sendCommand = vi.fn();
    const c = new MediaPlayerCard(
      makeMediaDef({ supported_features: ["turn_on", "turn_off", "volume_step"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.applyState("off", {});

    c.root.querySelector("[part=power-button]").click();
    c.root.querySelector("[part=volume-down-button]").click();
    c.root.querySelector("[part=volume-up-button]").click();

    expect(sendCommand).toHaveBeenCalledWith("turn_on", {});
    expect(sendCommand).toHaveBeenCalledWith("volume_down", {});
    expect(sendCommand).toHaveBeenCalledWith("volume_up", {});
  });

  it("applyState updates state without throwing", () => {
    const c = new MediaPlayerCard(
      makeMediaDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(() => c.applyState("playing", { media_title: "Test Song", volume_level: 0.5 })).not.toThrow();
  });

  it("applyState 'paused' does not throw", () => {
    const c = new MediaPlayerCard(
      makeMediaDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(() => c.applyState("paused", {})).not.toThrow();
  });

  it("applyState 'off' does not throw", () => {
    const c = new MediaPlayerCard(
      makeMediaDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(() => c.applyState("off", {})).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// RemoteCard - structural smoke tests
// ---------------------------------------------------------------------------

describe("RemoteCard render() smoke tests", () => {
  function makeRemoteDef(overrides = {}) {
    return {
      entity_id: "remote.test",
      domain: "remote",
      device_class: null,
      friendly_name: "TV Remote",
      supported_features: [],
      feature_config: {},
      icon: "mdi:remote",
      icon_state_map: { on: "mdi:remote", "*": "mdi:remote-off" },
      support_tier: 1,
      renderer: "RemoteCard",
      unit_of_measurement: null,
      capabilities: "read-write",
      ...overrides,
    };
  }

  it("renders without throwing", () => {
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(), i18n
    );
    expect(() => c.render()).not.toThrow();
  });

  it("renders card-name", () => {
    const c = new RemoteCard(
      makeRemoteDef({ friendly_name: "Apple TV Remote" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Apple TV Remote");
  });

  it("applyState 'on' does not throw", () => {
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(() => c.applyState("on", {})).not.toThrow();
  });

  it("applyState 'off' does not throw", () => {
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    expect(() => c.applyState("off", {})).not.toThrow();
  });

  it("power toggle sends explicit turn_off when remote is on", () => {
    const sendCommand = vi.fn();
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.applyState("on", {});
    simulateTap(c.root.querySelector("[part=power-toggle]"));
    expect(sendCommand).toHaveBeenCalledWith("turn_off", {});
  });

  it("power toggle sends explicit turn_on when remote is off", () => {
    const sendCommand = vi.fn();
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.applyState("off", {});
    simulateTap(c.root.querySelector("[part=power-toggle]"));
    expect(sendCommand).toHaveBeenCalledWith("turn_on", {});
  });

  it("shows activities and sends turn_on with the selected activity", () => {
    const sendCommand = vi.fn();
    const c = new RemoteCard(
      makeRemoteDef({ supported_features: ["activity"] }),
      makeShadowRoot(), makeConfig(sendCommand), i18n
    );
    c.render();
    c.applyState("on", {
      activity_list: ["Watch TV", "Play Games"],
      current_activity: "Watch TV",
    });
    const select = c.root.querySelector("[part=activity-select]");
    expect(select.hidden).toBe(false);
    expect([...select.options].map(option => option.value)).toEqual(["Watch TV", "Play Games"]);
    expect(select.value).toBe("Watch TV");
    select.value = "Play Games";
    select.dispatchEvent(new Event("change"));
    expect(sendCommand).toHaveBeenCalledWith("turn_on", { activity: "Play Games" });
  });

  it("hides the activity selector when no activity_list is exposed", () => {
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    c.applyState("on", {});
    expect(c.root.querySelector("[part=activity-select]").hidden).toBe(true);
  });

  it("read-only remote shows current activity without controls", () => {
    const c = new RemoteCard(
      makeRemoteDef({ capabilities: "read" }), makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    c.applyState("on", { current_activity: "Watch TV" });
    expect(c.root.querySelector("[part=power-toggle]")).toBeNull();
    expect(c.root.querySelector("[part=activity-select]")).toBeNull();
    expect(c.root.querySelector("[part=current-activity]").textContent).toBe("Watch TV");
  });

  it("predicts power and activity state changes", () => {
    const c = new RemoteCard(
      makeRemoteDef(), makeShadowRoot(), makeConfig(), i18n
    );
    expect(c.predictState("turn_off", {})).toEqual({ state: "off", attributes: {} });
    expect(c.predictState("turn_on", { activity: "Watch TV" })).toEqual({
      state: "on",
      attributes: { current_activity: "Watch TV" },
    });
  });
});
