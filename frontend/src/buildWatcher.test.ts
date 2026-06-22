/**
 * Tests for decideBuildReload - the loop-safe panel build-version watcher rule.
 */

import { describe, expect, it } from "vitest";
import { decideBuildReload } from "./buildWatcher";

describe("decideBuildReload", () => {
  it("reloads once when the deployed build is newer and no prior attempt", () => {
    expect(decideBuildReload(742, 741, null)).toBe("reload");
  });

  it("reloads when a prior attempt targeted a different (older) version", () => {
    // A newer build appeared after we already reloaded toward 742.
    expect(decideBuildReload(743, 741, "742")).toBe("reload");
  });

  it("skips the reload (breaks the loop) when already attempted this version", () => {
    expect(decideBuildReload(742, 741, "742")).toBe("skip-loop");
  });

  it("reports up-to-date when versions match", () => {
    expect(decideBuildReload(742, 742, null)).toBe("up-to-date");
  });

  it("reports up-to-date even if a stale guard is set", () => {
    expect(decideBuildReload(742, 742, "742")).toBe("up-to-date");
  });

  it("ignores an unparseable deployed version", () => {
    expect(decideBuildReload(NaN, 742, null)).toBe("ignore");
  });
});
