/**
 * Tests for the GitHub user-contributed theme helpers (githubList /
 * githubDownload). These fetch the GitHub contents API and raw zip directly
 * from the browser, so they do not go through the HA-authenticated _get/_post.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

const CONTENTS_URL =
  "https://api.github.com/repos/sfox38/HArvest/contents/User%20Contributed%20Themes?ref=main";

function contentsEntry(name: string, extra: Record<string, unknown> = {}) {
  return {
    name,
    type: "file",
    size: 1024,
    download_url: `https://raw.githubusercontent.com/sfox38/HArvest/main/User%20Contributed%20Themes/${name}`,
    ...extra,
  };
}

describe("githubList", () => {
  it("requests the contents API and returns only .zip files, sorted by name", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        contentsEntry("neu.zip"),
        contentsEntry("material-eww.zip"),
        contentsEntry("README.md"),
        { name: "fonts", type: "dir", size: 0, download_url: null },
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.themes.githubList();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(CONTENTS_URL);
    expect(result.map(t => t.name)).toEqual(["material-eww.zip", "neu.zip"]);
    expect(result[0]).toMatchObject({
      name: "material-eww.zip",
      size: 1024,
      download_url: expect.stringContaining("material-eww.zip"),
    });
  });

  it("drops entries missing a download_url", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        contentsEntry("ok.zip"),
        contentsEntry("broken.zip", { download_url: null }),
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.themes.githubList();
    expect(result.map(t => t.name)).toEqual(["ok.zip"]);
  });

  it("throws a rate-limit message on HTTP 403", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(api.themes.githubList()).rejects.toThrow(/rate limit/i);
  });

  it("throws a generic error on other non-ok status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(api.themes.githubList()).rejects.toThrow(/HTTP 500/);
  });

  it("throws a connectivity message when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(api.themes.githubList()).rejects.toThrow(/internet connection/i);
  });

  it("throws when the response is not an array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: "Not Found" }),
    }));
    await expect(api.themes.githubList()).rejects.toThrow(/Unexpected response/i);
  });
});

describe("githubDownload", () => {
  it("downloads the url and wraps it as a File with the given name", async () => {
    const blob = new Blob(["zip-bytes"], { type: "application/zip" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(blob),
    });
    vi.stubGlobal("fetch", fetchMock);

    const file = await api.themes.githubDownload("https://example.com/neu.zip", "neu.zip");

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/neu.zip");
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("neu.zip");
    expect(file.type).toBe("application/zip");
  });

  it("throws on a non-ok download", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(
      api.themes.githubDownload("https://example.com/x.zip", "x.zip"),
    ).rejects.toThrow(/HTTP 404/);
  });

  it("throws a connectivity message when the download rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(
      api.themes.githubDownload("https://example.com/x.zip", "x.zip"),
    ).rejects.toThrow(/internet connection/i);
  });
});
