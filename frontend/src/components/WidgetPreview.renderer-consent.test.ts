/**
 * Tests for custom renderer consent enforcement in panel previews.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "../api";
import { clearRendererCache, loadRendererScript } from "./WidgetPreview";

afterEach(() => {
  vi.restoreAllMocks();
  document.head.querySelectorAll("script[data-renderer-id]").forEach(script => script.remove());
});

describe("panel preview renderer consent", () => {
  it("does not append a renderer script before global consent", async () => {
    vi.spyOn(api.renderers, "list").mockResolvedValue({
      agreed: false,
      renderers: [],
    });
    clearRendererCache("unapproved");

    await expect(loadRendererScript("unapproved")).rejects.toThrow(
      "Renderer consent is required",
    );

    expect(document.head.querySelector("script[data-renderer-id='unapproved']")).toBeNull();
  });

  it("appends a renderer script after global consent", async () => {
    vi.spyOn(api.renderers, "list").mockResolvedValue({
      agreed: true,
      renderers: [],
    });
    clearRendererCache("approved");
    vi.spyOn(document.head, "appendChild").mockImplementation(node => {
      const result = Node.prototype.appendChild.call(document.head, node);
      (node as HTMLScriptElement).onload?.(new Event("load"));
      return result;
    });

    await loadRendererScript("approved");

    expect(document.head.querySelector("script[data-renderer-id='approved']")).not.toBeNull();
  });
});
