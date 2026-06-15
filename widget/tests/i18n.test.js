/**
 * tests/i18n.test.js - Tests for i18n.js
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { I18n } from "../src/i18n.js";

// ---------------------------------------------------------------------------
// Explicit language codes
// ---------------------------------------------------------------------------

describe("I18n - explicit language", () => {
  it("returns English strings for 'en'", () => {
    const i18n = new I18n("en");
    expect(i18n.t("state.on")).toBe("On");
    expect(i18n.t("state.off")).toBe("Off");
  });

  it("returns German strings for 'de'", () => {
    const i18n = new I18n("de");
    expect(i18n.t("state.on")).toBe("An");
    expect(i18n.t("state.off")).toBe("Aus");
  });

  it("returns French strings for 'fr'", () => {
    const i18n = new I18n("fr");
    expect(i18n.t("state.on")).toBe("Allumé");
  });

  it("returns Spanish strings for 'es'", () => {
    const i18n = new I18n("es");
    expect(i18n.t("state.on")).toBe("Encendido");
  });

  it("returns Dutch strings for 'nl'", () => {
    const i18n = new I18n("nl");
    expect(i18n.t("state.on")).toBe("Aan");
  });

  it("is case-insensitive for language codes", () => {
    const lower = new I18n("de");
    const upper = new I18n("DE");
    expect(upper.t("state.on")).toBe(lower.t("state.on"));
  });
});

// ---------------------------------------------------------------------------
// Fallback chain
// ---------------------------------------------------------------------------

describe("I18n - fallback chain", () => {
  it("falls back to English when key is missing from requested language", () => {
    // German de.json does not define every key - e.g. weather.* keys are
    // only in English. Verify the fallback returns the English value.
    const i18n = new I18n("de");
    expect(i18n.t("weather.cloudy")).toBe("Cloudy");
  });

  it("falls back to raw key when missing from both language and English", () => {
    const i18n = new I18n("en");
    expect(i18n.t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("falls back to English for an unknown language code", () => {
    const i18n = new I18n("xx");
    expect(i18n.t("state.on")).toBe("On");
  });

  it("falls back to raw key for unknown language and unknown key", () => {
    const i18n = new I18n("xx");
    expect(i18n.t("totally.unknown")).toBe("totally.unknown");
  });
});

// ---------------------------------------------------------------------------
// "auto" language resolution
// ---------------------------------------------------------------------------

describe("I18n - auto language", () => {
  it("uses navigator.language primary subtag", () => {
    Object.defineProperty(navigator, "language", {
      get: () => "de-DE",
      configurable: true,
    });
    const i18n = new I18n("auto");
    expect(i18n.t("state.on")).toBe("An");
  });

  it("handles simple language tag without region", () => {
    Object.defineProperty(navigator, "language", {
      get: () => "fr",
      configurable: true,
    });
    const i18n = new I18n("auto");
    expect(i18n.t("state.on")).toBe("Allumé");
  });

  it("falls back to English when navigator.language is an unknown language", () => {
    Object.defineProperty(navigator, "language", {
      get: () => "xx-XX",
      configurable: true,
    });
    const i18n = new I18n("auto");
    expect(i18n.t("state.on")).toBe("On");
  });
});

// ---------------------------------------------------------------------------
// All English keys are defined and non-empty
// ---------------------------------------------------------------------------

describe("I18n - English completeness", () => {
  const i18n = new I18n("en");

  const EXPECTED_KEYS = [
    "state.on", "state.off", "state.unavailable", "state.unknown",
    "state.open", "state.closed", "state.locked", "state.unlocked",
    "state.idle", "state.triggered", "state.heating", "state.cooling",
    "state.fan_only", "state.dry", "state.heat_cool", "state.auto",
    "state.playing", "state.paused", "state.standby", "state.buffering",
    "state.opening", "state.closing", "state.stopped", "state.home", "state.not_home",
    "action.toggle", "action.turn_on", "action.turn_off", "action.press",
    "action.currently", "action.open", "action.close", "action.stop",
    "action.play", "action.pause", "action.next", "action.previous",
    "action.mute", "action.unmute", "action.increase", "action.decrease",
    "error.auth_failed", "error.entity_missing", "error.offline", "error.connecting",
    "indicator.stale", "history.unavailable", "history.hours", "unit.percent",
    "climate.heat", "climate.cool", "climate.auto", "climate.off",
    "climate.fan_only", "climate.dry", "climate.heat_cool",
    "cover.open", "cover.close", "cover.stop", "cover.position",
    "media.volume", "media.source",
  ];

  for (const key of EXPECTED_KEYS) {
    it(`defines "${key}"`, () => {
      const val = i18n.t(key);
      expect(val).not.toBe(key);   // should not fall through to raw key
      expect(val.length).toBeGreaterThan(0);
    });
  }
});
