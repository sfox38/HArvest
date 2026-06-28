/** Tests widget client metadata and incompatible-protocol handling. */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { getClientInfo, _setClientInfoForTests } from "../src/client-info.js";
import { PROTOCOL_VERSION, WIDGET_VERSION } from "../src/version.js";

describe("getClientInfo()", () => {
  it("returns the build-time PROTOCOL_VERSION", () => {
    const info = getClientInfo();
    expect(info.protocol).toBe(PROTOCOL_VERSION);
    // In the unbundled test environment the placeholder fallback gives us
    // the integer 1; the bundled version replaces it with the real value.
    expect(typeof info.protocol).toBe("number");
  });

  it("returns the build-time WIDGET_VERSION", () => {
    const info = getClientInfo();
    expect(info.widget).toBe(WIDGET_VERSION);
    expect(typeof info.widget).toBe("string");
  });

  it("includes source and source_version fields", () => {
    const info = getClientInfo();
    expect(info).toHaveProperty("source");
    expect(info).toHaveProperty("source_version");
  });
});

describe("_setClientInfoForTests source override", () => {
  it("wp source includes source_version", () => {
    _setClientInfoForTests("wp", "0.9.3");
    const info = getClientInfo();
    expect(info.source).toBe("wp");
    expect(info.source_version).toBe("0.9.3");
  });

  it("html source has null source_version", () => {
    _setClientInfoForTests("html", null);
    const info = getClientInfo();
    expect(info.source).toBe("html");
    expect(info.source_version).toBe(null);
  });

  it("panel source has null source_version", () => {
    _setClientInfoForTests("panel", null);
    const info = getClientInfo();
    expect(info.source).toBe("panel");
    expect(info.source_version).toBe(null);
  });

  it("override is testable knob - reset back to html for other tests", () => {
    _setClientInfoForTests("html", null);
    expect(getClientInfo().source).toBe("html");
  });
});

// ---------------------------------------------------------------------------
// HRV_PROTOCOL_INCOMPATIBLE handling on the widget side
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

describe("HRV_PROTOCOL_INCOMPATIBLE handling", () => {
  beforeEach(() => {
    MockWebSocket.reset();
    globalThis.WebSocket = MockWebSocket;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("auth message includes the client block", async () => {
    // Import lazily so the WebSocket mock is in place before the IIFE
    // captures globalThis.WebSocket.
    const { getOrCreateClient, destroyClient } = await import("../src/harvest-client.js");
    const haUrl = "https://ha.example.com";
    const tokenId = "hwt_compatabcdefghijklm";

    _setClientInfoForTests("wp", "0.9.3");

    const client = getOrCreateClient(haUrl, tokenId, null);
    // Force a card mount so auth fires.
    client.registerCard("light.test", { setErrorState() {}, receiveDefinition() {} });

    // Manually trigger sendAuth (the debounce timer would normally fire).
    // We poke the internal method via the client's WebSocket: trigger onopen.
    // Advance past the auth debounce so the WebSocket actually opens.
    await vi.advanceTimersByTimeAsync(60);
    const ws = MockWebSocket.instances[0];
    expect(ws).toBeDefined();
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    expect(ws.sent.length).toBeGreaterThan(0);
    const authMsg = JSON.parse(ws.sent[0]);
    expect(authMsg.type).toBe("auth");
    expect(authMsg.client).toBeDefined();
    expect(authMsg.client.source).toBe("wp");
    expect(authMsg.client.source_version).toBe("0.9.3");
    expect(authMsg.client.protocol).toBe(PROTOCOL_VERSION);
    expect(authMsg.client.widget).toBe(WIDGET_VERSION);

    destroyClient(haUrl, tokenId);
  });

  it("HRV_PROTOCOL_INCOMPATIBLE sets cards to HRV_INCOMPATIBLE (not HRV_AUTH_FAILED)", async () => {
    // The widget MUST surface the distinct state so the visitor sees the
    // "Update your snippet" message rather than generic "Widget unavailable".
    const { getOrCreateClient, destroyClient } = await import("../src/harvest-client.js");
    const haUrl = "https://ha.example.com";
    const tokenId = "hwt_incompabcdefghijklm";

    const card = { setErrorState: vi.fn(), receiveDefinition: vi.fn() };
    const client = getOrCreateClient(haUrl, tokenId, null);
    client.registerCard("light.test", card);

    await vi.advanceTimersByTimeAsync(60);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    // Server replies with auth_failed + HRV_PROTOCOL_INCOMPATIBLE.
    ws.onmessage?.({
      data: JSON.stringify({
        type: "auth_failed",
        code: "HRV_PROTOCOL_INCOMPATIBLE",
        msg_id: 1,
        server: { protocol: 1, version: "0.9.3", min_client_protocol: 1 },
      }),
    });

    expect(card.setErrorState).toHaveBeenCalledWith("HRV_INCOMPATIBLE");
    // Must NOT also set HRV_AUTH_FAILED on the same card.
    const calls = card.setErrorState.mock.calls.map((c) => c[0]);
    expect(calls).not.toContain("HRV_AUTH_FAILED");

    destroyClient(haUrl, tokenId);
  });

  it("HRV_PROTOCOL_INCOMPATIBLE marks the failure permanent (no reconnect)", async () => {
    // Permanent failure means the WebSocket close handler must NOT schedule
    // a reconnect. We assert via #permanentFailure being true; surfaced
    // here by checking that no NEW MockWebSocket is created after close.
    const { getOrCreateClient, destroyClient } = await import("../src/harvest-client.js");
    const haUrl = "https://ha.example.com";
    const tokenId = "hwt_permaabcdefghijklm";

    const card = { setErrorState: vi.fn(), receiveDefinition: vi.fn() };
    const client = getOrCreateClient(haUrl, tokenId, null);
    client.registerCard("light.test", card);

    await vi.advanceTimersByTimeAsync(60);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    ws.onmessage?.({
      data: JSON.stringify({
        type: "auth_failed",
        code: "HRV_PROTOCOL_INCOMPATIBLE",
        msg_id: 1,
        server: { protocol: 1, version: "0.9.3", min_client_protocol: 1 },
      }),
    });
    // Simulate close fired by the server-side ws.close().
    ws.readyState = MockWebSocket.CLOSED;
    ws.onclose?.({ code: 1000 });

    // Wait past the longest reconnect delay - if reconnect were scheduled,
    // a new MockWebSocket would appear in the instances list.
    await vi.advanceTimersByTimeAsync(70_000);
    expect(MockWebSocket.instances.length).toBe(1);

    destroyClient(haUrl, tokenId);
  });
});
