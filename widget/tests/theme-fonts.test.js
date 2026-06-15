/**
 * tests/theme-fonts.test.js
 *
 * Regression for custom theme fonts on the live (off-HA) widget path.
 *
 * The server's `theme` message carries `custom_fonts` with root-relative URLs
 * (/api/harvest/themes/.../fonts/...). The client must forward them to each
 * card's receiveTheme AND absolutize root-relative URLs against the HA origin,
 * otherwise the embedding page's own origin is used as the base and the font
 * fetch 404s on any page not served from HA itself.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

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

describe("theme custom_fonts forwarding", () => {
  beforeEach(() => {
    MockWebSocket.reset();
    globalThis.WebSocket = MockWebSocket;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  async function openClientWithCard(haUrl, tokenId, card) {
    const { getOrCreateClient, destroyClient } = await import("../src/harvest-client.js");
    const client = getOrCreateClient(haUrl, tokenId, null);
    client.registerCard("light.test", card);
    await vi.advanceTimersByTimeAsync(60);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);
    return { client, ws, destroyClient };
  }

  it("forwards custom_fonts and absolutizes root-relative URLs to the HA origin", async () => {
    const haUrl = "https://ha.example.com";
    const tokenId = "hwt_fontsAAAAAAAAAAAAAA";
    const received = [];
    const card = {
      setErrorState() {},
      receiveDefinition() {},
      receiveTheme(theme) { received.push(theme); },
    };
    const { ws, destroyClient } = await openClientWithCard(haUrl, tokenId, card);

    ws.onmessage?.({
      data: JSON.stringify({
        type: "theme",
        variables: { "--hrv-color-primary": "#fff" },
        dark_variables: {},
        custom_fonts: [
          { family: "Inter", url: "/api/harvest/themes/glass/fonts/Inter.woff2" },
          { family: "Remote", url: "https://cdn.example.com/Remote.woff2" },
        ],
      }),
    });

    expect(received.length).toBe(1);
    const fonts = received[0].custom_fonts;
    expect(fonts).toHaveLength(2);
    // Root-relative URL resolved against the HA origin, not the embedding page.
    expect(fonts[0].url).toBe("https://ha.example.com/api/harvest/themes/glass/fonts/Inter.woff2");
    expect(fonts[0].family).toBe("Inter");
    // Already-absolute URL passes through untouched.
    expect(fonts[1].url).toBe("https://cdn.example.com/Remote.woff2");

    destroyClient(haUrl, tokenId);
  });

  it("omits custom_fonts on the theme object when the message has none", async () => {
    const haUrl = "https://ha.example.com";
    const tokenId = "hwt_fontsBBBBBBBBBBBBBB";
    const received = [];
    const card = {
      setErrorState() {},
      receiveDefinition() {},
      receiveTheme(theme) { received.push(theme); },
    };
    const { ws, destroyClient } = await openClientWithCard(haUrl, tokenId, card);

    ws.onmessage?.({
      data: JSON.stringify({
        type: "theme",
        variables: { "--hrv-color-primary": "#fff" },
        dark_variables: {},
      }),
    });

    expect(received.length).toBe(1);
    expect(received[0].custom_fonts).toBeUndefined();

    destroyClient(haUrl, tokenId);
  });
});
