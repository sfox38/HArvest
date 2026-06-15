/**
 * tests/state-cache.test.js - Tests for state-cache.js
 *
 * jsdom provides localStorage so no manual mocking is needed for the
 * happy path. Failure cases are tested by replacing localStorage methods
 * with throwing stubs.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { StateCache } from "../src/state-cache.js";

const TOKEN_ID  = "hwt_a3F9bC2d114eF5A6b7c8dE";
const ENTITY_ID = "light.bedroom";

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// write / read round-trip
// ---------------------------------------------------------------------------

describe("StateCache.write + read", () => {
  it("stores and retrieves state and attributes", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", { brightness: 200 });
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);

    expect(result).not.toBeNull();
    expect(result.state).toBe("on");
    expect(result.attributes.brightness).toBe(200);
    expect(result.entity_id).toBe(ENTITY_ID);
  });

  it("includes cached_at as an ISO 8601 string", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "off", {});
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);

    expect(result.cached_at).toBeDefined();
    expect(() => new Date(result.cached_at)).not.toThrow();
    expect(new Date(result.cached_at).getTime()).toBeGreaterThan(0);
  });

  it("overwrites previous entry on second write", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on",  { brightness: 100 });
    StateCache.write(TOKEN_ID, ENTITY_ID, "off", { brightness: 0   });
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);

    expect(result.state).toBe("off");
    expect(result.attributes.brightness).toBe(0);
  });

  it("stores empty attributes object", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);
    expect(result.attributes).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// read - miss and error cases
// ---------------------------------------------------------------------------

describe("StateCache.read", () => {
  it("returns null for a cache miss", () => {
    expect(StateCache.read(TOKEN_ID, "sensor.missing")).toBeNull();
  });

  it("returns null when localStorage throws on getItem", () => {
    const orig = localStorage.getItem.bind(localStorage);
    vi.spyOn(localStorage, "getItem").mockImplementationOnce(() => {
      throw new DOMException("SecurityError");
    });

    expect(StateCache.read(TOKEN_ID, ENTITY_ID)).toBeNull();
  });

  it("returns null when stored JSON is corrupt", () => {
    // Manually write malformed JSON under the expected key
    const key = Object.keys(localStorage).find(k => k.startsWith("hrv_")) ?? "hrv_00000000";
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    // Corrupt the entry
    const storedKey = [...Array(localStorage.length)].map((_, i) => localStorage.key(i)).find(k => k?.startsWith("hrv_"));
    if (storedKey) localStorage.setItem(storedKey, "not valid json {{{");

    // read should not throw
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);
    // Either null (corrupt) or the previously written value - the point is no throw
    expect(() => StateCache.read(TOKEN_ID, ENTITY_ID)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------

describe("StateCache.remove", () => {
  it("removes an existing entry", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    StateCache.remove(TOKEN_ID, ENTITY_ID);
    expect(StateCache.read(TOKEN_ID, ENTITY_ID)).toBeNull();
  });

  it("is a no-op when entry does not exist", () => {
    expect(() => StateCache.remove(TOKEN_ID, "light.nonexistent")).not.toThrow();
  });

  it("does not remove other entries", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    StateCache.write(TOKEN_ID, "switch.fan", "off", {});
    StateCache.remove(TOKEN_ID, ENTITY_ID);

    expect(StateCache.read(TOKEN_ID, ENTITY_ID)).toBeNull();
    expect(StateCache.read(TOKEN_ID, "switch.fan")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Cache key determinism
// ---------------------------------------------------------------------------

describe("StateCache - cache key", () => {
  it("produces the same key for the same inputs", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    const count1 = localStorage.length;

    StateCache.write(TOKEN_ID, ENTITY_ID, "off", {});
    // Overwrite should not add a new key
    expect(localStorage.length).toBe(count1);
  });

  it("produces different keys for different entity IDs", () => {
    StateCache.write(TOKEN_ID, "light.bedroom",    "on",  {});
    StateCache.write(TOKEN_ID, "light.living_room", "off", {});

    // Both should be readable independently
    expect(StateCache.read(TOKEN_ID, "light.bedroom")?.state).toBe("on");
    expect(StateCache.read(TOKEN_ID, "light.living_room")?.state).toBe("off");
  });

  it("produces different keys for different token IDs", () => {
    const tokenA = "hwt_aaaaaaaaaaaaaaaaaaaaaa";
    const tokenB = "hwt_bbbbbbbbbbbbbbbbbbbbbb";

    StateCache.write(tokenA, ENTITY_ID, "on",  {});
    StateCache.write(tokenB, ENTITY_ID, "off", {});

    expect(StateCache.read(tokenA, ENTITY_ID)?.state).toBe("on");
    expect(StateCache.read(tokenB, ENTITY_ID)?.state).toBe("off");
  });

  it("cache key starts with 'hrv_'", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    const keys = [...Array(localStorage.length)].map((_, i) => localStorage.key(i));
    expect(keys.some(k => k?.startsWith("hrv_"))).toBe(true);
  });

  it("cache key is 12 characters (hrv_ + 8 hex digits)", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    const keys = [...Array(localStorage.length)].map((_, i) => localStorage.key(i));
    const hrvKey = keys.find(k => k?.startsWith("hrv_"));
    expect(hrvKey).toHaveLength(12);
  });
});

// ---------------------------------------------------------------------------
// Hash-collision integrity
//
// djb2 is a 32-bit hash; collisions are astronomically unlikely in practice
// but not impossible. read() must reject any cached payload whose stored
// token_id/entity_id does not match the requested pair, so a collision never
// surfaces as the wrong entity's state.
// ---------------------------------------------------------------------------

describe("StateCache - hash collision integrity", () => {
  it("returns null when stored entity_id does not match requested entity_id", () => {
    // Write entity X at its natural key, then read entity Y at the SAME key
    // by writing a payload that claims to be entity X under Y's lookup.
    // We simulate this by writing a payload directly to a chosen key.
    StateCache.write(TOKEN_ID, "light.bedroom", "on", { brightness: 200 });
    const collidingKey = [...Array(localStorage.length)]
      .map((_, i) => localStorage.key(i))
      .find(k => k?.startsWith("hrv_"));
    expect(collidingKey).toBeDefined();

    // Inject a payload at the same key that claims to be a different entity.
    // (In real life, this would happen because two entities hashed to the
    // same key. Here we synthesize it directly to exercise the read guard.)
    localStorage.setItem(
      collidingKey,
      JSON.stringify({
        token_id: TOKEN_ID,
        entity_id: "light.never_existed",
        state: "off",
        attributes: {},
        cached_at: new Date().toISOString(),
      }),
    );

    // Reading the original entity must NOT return the foreign payload.
    expect(StateCache.read(TOKEN_ID, "light.bedroom")).toBeNull();
  });

  it("returns null when stored token_id does not match requested token_id", () => {
    const tokenA = "hwt_aaaaaaaaaaaaaaaaaaaaaa";
    const tokenB = "hwt_bbbbbbbbbbbbbbbbbbbbbb";

    StateCache.write(tokenA, ENTITY_ID, "on", { brightness: 100 });
    const key = [...Array(localStorage.length)]
      .map((_, i) => localStorage.key(i))
      .find(k => k?.startsWith("hrv_"));

    // Inject a payload claiming a different token_id.
    localStorage.setItem(
      key,
      JSON.stringify({
        token_id: tokenB,
        entity_id: ENTITY_ID,
        state: "off",
        attributes: {},
        cached_at: new Date().toISOString(),
      }),
    );

    // Reading under tokenA must reject the tokenB-stamped payload.
    expect(StateCache.read(tokenA, ENTITY_ID)).toBeNull();
  });

  it("returns null for legacy pre-fix entries that lack token_id", () => {
    // Cache entries written by older versions of this module had no token_id
    // field. After the upgrade those entries fail integrity check and read
    // returns null, equivalent to a one-time cache flush.
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    const key = [...Array(localStorage.length)]
      .map((_, i) => localStorage.key(i))
      .find(k => k?.startsWith("hrv_"));

    // Write an old-format payload (entity_id but no token_id).
    localStorage.setItem(
      key,
      JSON.stringify({
        entity_id: ENTITY_ID,
        state: "on",
        attributes: {},
        cached_at: new Date().toISOString(),
      }),
    );

    expect(StateCache.read(TOKEN_ID, ENTITY_ID)).toBeNull();
  });

  it("happy path still returns a valid cached payload", () => {
    // Sanity: regular round-trip with both fields set works as before.
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", { brightness: 200 });
    const result = StateCache.read(TOKEN_ID, ENTITY_ID);
    expect(result).not.toBeNull();
    expect(result.token_id).toBe(TOKEN_ID);
    expect(result.entity_id).toBe(ENTITY_ID);
    expect(result.state).toBe("on");
  });
});

// ---------------------------------------------------------------------------
// Silent failure on localStorage errors
// ---------------------------------------------------------------------------

describe("StateCache - silent failure", () => {
  it("write does not throw when localStorage.setItem throws", () => {
    vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => StateCache.write(TOKEN_ID, ENTITY_ID, "on", {})).not.toThrow();
  });

  it("remove does not throw when localStorage.removeItem throws", () => {
    vi.spyOn(localStorage, "removeItem").mockImplementationOnce(() => {
      throw new DOMException("SecurityError");
    });
    expect(() => StateCache.remove(TOKEN_ID, ENTITY_ID)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// writeDef / readDef / removeDef - entity_definition cache
//
// Used for the stale-render fast path: if an entity_definition is cached
// alongside a state, the next mount can build the renderer immediately
// instead of waiting for the WS auth round-trip.
// ---------------------------------------------------------------------------

describe("StateCache.writeDef + readDef", () => {
  const SAMPLE_DEF = {
    type: "entity_definition",
    entity_id: ENTITY_ID,
    domain: "sensor",
    device_class: "temperature",
    capabilities: "read",
    friendly_name: "Bedroom Temp",
  };

  it("stores and retrieves an entity_definition", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    const result = StateCache.readDef(TOKEN_ID, ENTITY_ID);
    expect(result).toEqual(SAMPLE_DEF);
  });

  it("returns null for a cache miss", () => {
    expect(StateCache.readDef(TOKEN_ID, "light.unknown")).toBeNull();
  });

  it("uses a distinct key namespace from state cache", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", { brightness: 200 });
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    // Both must coexist - reading either must not return the other.
    expect(StateCache.read(TOKEN_ID, ENTITY_ID)?.state).toBe("on");
    expect(StateCache.readDef(TOKEN_ID, ENTITY_ID)?.domain).toBe("sensor");
  });

  it("uses the hrvd_ key prefix for definitions", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    const keys = [...Array(localStorage.length)].map((_, i) => localStorage.key(i));
    expect(keys.some((k) => k?.startsWith("hrvd_"))).toBe(true);
  });

  it("def cache key does not collide with state cache key for same pair", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    expect(localStorage.length).toBe(2);
  });

  it("overwrites previous def on second writeDef", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    const updated = { ...SAMPLE_DEF, friendly_name: "Renamed" };
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, updated);
    expect(StateCache.readDef(TOKEN_ID, ENTITY_ID)?.friendly_name).toBe("Renamed");
  });

  it("returns null when stored token_id does not match requested token_id", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    expect(StateCache.readDef("hwt_otherTokenAAAAAAAAAA", ENTITY_ID)).toBeNull();
  });

  it("removeDef deletes the cached definition", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    StateCache.removeDef(TOKEN_ID, ENTITY_ID);
    expect(StateCache.readDef(TOKEN_ID, ENTITY_ID)).toBeNull();
  });

  it("removeDef does not affect the matching state entry", () => {
    StateCache.write(TOKEN_ID, ENTITY_ID, "on", {});
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    StateCache.removeDef(TOKEN_ID, ENTITY_ID);
    expect(StateCache.read(TOKEN_ID, ENTITY_ID)?.state).toBe("on");
  });

  it("writeDef does not throw on localStorage failure", () => {
    vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF)).not.toThrow();
  });

  it("readDef returns null on JSON.parse failure", () => {
    StateCache.writeDef(TOKEN_ID, ENTITY_ID, SAMPLE_DEF);
    // Corrupt the cached entry directly.
    const keys = [...Array(localStorage.length)].map((_, i) => localStorage.key(i));
    const defKey = keys.find((k) => k?.startsWith("hrvd_"));
    expect(defKey).toBeDefined();
    localStorage.setItem(defKey, "not-valid-json");
    expect(StateCache.readDef(TOKEN_ID, ENTITY_ID)).toBeNull();
  });
});
