/**
 * Tests for renderer-bearing theme import confirmation requests.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { api, setHass } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("theme renderer import confirmation", () => {
  it("sends overwrite and one-use renderer confirmation flags", async () => {
    setHass({
      auth: {
        data: { access_token: "test-token" },
        refreshAccessToken: vi.fn(),
      },
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ theme_id: "custom" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const file = new File(["zip"], "custom.zip", { type: "application/zip" });

    await api.themes.importZip(file, true, true);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/harvest/themes/import?overwrite=true&renderer_confirmed=true",
    );
  });
});
