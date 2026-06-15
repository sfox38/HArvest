/**
 * Tests for generated widget script and transport URL resolution.
 */

import { describe, expect, it } from "vitest";
import { resolveWidgetConnectionUrls } from "./connectionUrls";

describe("resolveWidgetConnectionUrls", () => {
  it("uses the main HA origin for HA-served widgets", () => {
    expect(resolveWidgetConnectionUrls("https://ha.example:8123/", "", 0)).toEqual({
      haUrl: "https://ha.example:8123",
      scriptUrl: "https://ha.example:8123/harvest_assets/harvest.min.js",
    });
  });

  it("uses the alternate origin for the script and live transport", () => {
    expect(resolveWidgetConnectionUrls("https://ha.example:8123", "", 9050)).toEqual({
      haUrl: "https://ha.example:9050",
      scriptUrl: "https://ha.example:9050/harvest.min.js",
    });
  });

  it("does not redirect transport when a custom script URL is selected", () => {
    expect(resolveWidgetConnectionUrls("https://ha.example:8123", "https://cdn.example/widget.js", 9050)).toEqual({
      haUrl: "https://ha.example:8123",
      scriptUrl: "https://cdn.example/widget.js",
    });
  });
});
