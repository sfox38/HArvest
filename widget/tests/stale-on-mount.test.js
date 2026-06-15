/**
 * tests/stale-on-mount.test.js
 *
 * Verifies the stale-render fast path:
 *   1. BaseCard.staleOnMount default is false (controllable entities never
 *      render from cache).
 *   2. Read-only Tier 1 renderers opt in via static staleOnMount = true.
 *   3. Controllable renderers stay opted out.
 *   4. HarvestClient writes entity_definition messages through to
 *      StateCache.writeDef so the next mount can read them.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { BaseCard }              from "../src/renderers/base-card.js";
import { TemperatureSensorCard } from "../src/renderers/sensor-temperature-card.js";
import { HumiditySensorCard }    from "../src/renderers/sensor-humidity-card.js";
import { GenericSensorCard }     from "../src/renderers/sensor-generic-card.js";
import { BatterySensorCard }     from "../src/renderers/sensor-battery-card.js";
import { BinarySensorCard }      from "../src/renderers/binary-sensor-card.js";
import { WeatherCard }           from "../src/renderers/weather-card.js";
import { BadgeCard }             from "../src/renderers/badge-card.js";
import { PersonCard }            from "../src/renderers/person-card.js";
import { LightCard }             from "../src/renderers/light-card.js";
import { SwitchCard }            from "../src/renderers/switch-card.js";
import { FanCard }               from "../src/renderers/fan-card.js";
import { ClimateCard }           from "../src/renderers/climate-card.js";
import { CoverCard }             from "../src/renderers/cover-card.js";
import { TimerCard }             from "../src/renderers/timer-card.js";
import { LockCard }              from "../src/renderers/lock-card.js";
import { ButtonCard }            from "../src/renderers/button-card.js";
import { ScriptCard }            from "../src/renderers/script-card.js";
import { AutomationCard }        from "../src/renderers/automation-card.js";
import { GenericCard }           from "../src/renderers/generic-card.js";

import { StateCache }            from "../src/state-cache.js";

// ---------------------------------------------------------------------------
// staleOnMount flag values
// ---------------------------------------------------------------------------

describe("staleOnMount renderer flag", () => {
  it("BaseCard default is false", () => {
    expect(BaseCard.staleOnMount).toBe(false);
  });

  it.each([
    ["TemperatureSensorCard", TemperatureSensorCard],
    ["HumiditySensorCard",    HumiditySensorCard],
    ["GenericSensorCard",     GenericSensorCard],
    ["BatterySensorCard",     BatterySensorCard],
    ["BinarySensorCard",      BinarySensorCard],
    ["WeatherCard",           WeatherCard],
    ["BadgeCard",             BadgeCard],
    ["PersonCard",            PersonCard],
  ])("read-only renderer %s opts IN (staleOnMount = true)", (_name, cls) => {
    expect(cls.staleOnMount).toBe(true);
  });

  it.each([
    ["LightCard",   LightCard],
    ["SwitchCard",  SwitchCard],
    ["FanCard",     FanCard],
    ["ClimateCard", ClimateCard],
    ["CoverCard",   CoverCard],
    ["TimerCard",   TimerCard],
    ["LockCard",      LockCard],
    ["ButtonCard",    ButtonCard],
    ["ScriptCard",    ScriptCard],
    ["AutomationCard", AutomationCard],
    ["GenericCard",   GenericCard],
  ])("controllable / time-sensitive renderer %s stays opted OUT (staleOnMount = false)", (_name, cls) => {
    expect(cls.staleOnMount).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// HarvestClient write-through to StateCache.writeDef
// ---------------------------------------------------------------------------

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.sent = [];
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    MockWebSocket.instances.push(this);
  }
  send(data) { this.sent.push(data); }
  close() { this.readyState = MockWebSocket.CLOSED; }
  static instances = [];
  static reset() { MockWebSocket.instances = []; }
}

const HA_URL = "https://ha.example.com";
const TOKEN  = "hwt_cacheflowAAAAAAAAAA";

describe("HarvestClient -> StateCache.writeDef write-through", () => {
  let getOrCreateClient, destroyClient, setStateCacheRef;

  beforeEach(async () => {
    MockWebSocket.reset();
    globalThis.WebSocket = MockWebSocket;
    vi.useFakeTimers();
    localStorage.clear();

    vi.resetModules();
    ({ getOrCreateClient, destroyClient, setStateCacheRef } =
      await import("../src/harvest-client.js"));

    // Wire StateCache to the proxy used inside harvest-client.js.
    setStateCacheRef(StateCache);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    destroyClient(HA_URL, TOKEN);
  });

  it("caches entity_definition when one arrives over the WS", async () => {
    const card = { setErrorState: vi.fn(), receiveDefinition: vi.fn() };
    const client = getOrCreateClient(HA_URL, TOKEN, null);
    client.registerCard("sensor.temp", card);

    // Single-card no-config path fires auth on the next macrotask.
    await vi.advanceTimersByTimeAsync(1);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    const def = {
      type: "entity_definition",
      entity_id: "sensor.temp",
      domain: "sensor",
      device_class: "temperature",
      capabilities: "read",
      friendly_name: "Bedroom Temperature",
    };
    ws.onmessage?.({ data: JSON.stringify(def) });

    // Card receives the def AND it's cached for next mount.
    expect(card.receiveDefinition).toHaveBeenCalledWith(def);
    expect(StateCache.readDef(TOKEN, "sensor.temp")).toEqual(def);
  });

  it("caches definitions even when no card is mounted yet (pending bucket)", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN, null);
    client.registerCard("sensor.temp", { setErrorState: vi.fn(), receiveDefinition: vi.fn() });
    await vi.advanceTimersByTimeAsync(1);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    // A definition arrives for an entity NOT yet registered (e.g. the
    // companion message preceding companion-card registration).
    const def = {
      type: "entity_definition",
      entity_id: "sensor.unmounted",
      domain: "sensor",
      device_class: "humidity",
      capabilities: "read",
    };
    ws.onmessage?.({ data: JSON.stringify(def) });

    // Cached even though no card consumed it yet.
    expect(StateCache.readDef(TOKEN, "sensor.unmounted")).toEqual(def);
  });
});
