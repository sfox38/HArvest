/**
 * Source-level contracts for independent renderer packs.
 *
 * Renderer packs intentionally share no runtime library. These checks keep
 * their integration and accessibility requirements consistent.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const rendererSources = {
  minimus: resolve(testDir, "../src/renderers/minimus-renderer.js"),
  shrooms: resolve(testDir, "../src/renderers/shrooms-renderer.js"),
};

const opaqueThemePaths = [
  resolve(testDir, "../themes/default.json"),
  resolve(testDir, "../themes/access.json"),
  resolve(testDir, "../themes/minimus.json"),
  resolve(testDir, "../themes/shrooms.json"),
];

function luminance(hex) {
  const channels = [1, 3, 5]
    .map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe.each(Object.entries(rendererSources))("%s renderer contract", (_name, path) => {
  const source = readFileSync(path, "utf8");

  it("uses the loading script dataset as its renderer identity", () => {
    expect(source).toContain("document.currentScript.dataset.rendererId");
    expect(source).not.toContain("window.__HARVEST_RENDERER_ID__");
  });

  it("includes a reduced-motion override", () => {
    expect(source).toContain("@media (prefers-reduced-motion: reduce)");
  });
});

describe("minimus accessibility contract", () => {
  const source = readFileSync(rendererSources.minimus, "utf8");

  it("makes both custom sliders keyboard operable", () => {
    expect(source.match(/role="slider" tabindex="0"/g)).toHaveLength(2);
    expect(source.match(/#onDialKey\(e\)/g)?.length).toBeGreaterThanOrEqual(2);
  });
});

describe.each(opaqueThemePaths)("opaque theme contrast: %s", (path) => {
  const theme = JSON.parse(readFileSync(path, "utf8"));

  it.each([
    ["light", theme.variables],
    ["dark", { ...theme.variables, ...theme.dark_variables }],
  ])("%s mode passes text-role contrast", (_mode, variables) => {
    const surface = variables["--hrv-card-background"] ?? variables["--hrv-color-surface"];
    expect(contrast(variables["--hrv-color-text"], surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(variables["--hrv-color-text-secondary"], surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(variables["--hrv-color-on-primary"], variables["--hrv-color-primary"])).toBeGreaterThanOrEqual(4.5);
  });
});
