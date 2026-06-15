/**
 * tests/auth-debounce.test.js
 *
 * Verifies the auth-debounce optimisations:
 *   1. Single card on a page with no HArvest.config(): the 50ms coalescing
 *      wait is skipped; auth dispatch happens on the next macrotask.
 *   2. Multiple cards registered in the same task: all coalesce into one
 *      auth message after the 50ms debounce.
 *   3. HArvest.config() set: 50ms debounce is preserved (page-level config
 *      implies more cards may follow via static markup or create() calls).
 *   4. prewarm(): opens the WebSocket without sending auth; auth fires
 *      later when the first card registers and its debounce dispatches.
 *   5. prewarm() while WS is still CONNECTING: registerCard during the
 *      handshake window leads to auth being sent on #onOpen automatically.
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

const HA_URL = "https://ha.example.com";
const TOKEN_A = "hwt_debounceAAAAAAAAAA";
const TOKEN_B = "hwt_debounceBBBBBBBBBB";

let getOrCreateClient;
let destroyClient;
let pageConfig;

beforeEach(async () => {
  MockWebSocket.reset();
  globalThis.WebSocket = MockWebSocket;
  vi.useFakeTimers();

  // Reset modules so page-config state doesn't leak across tests.
  vi.resetModules();
  ({ getOrCreateClient, destroyClient } = await import("../src/harvest-client.js"));
  pageConfig = await import("../src/page-config.js");

  // Clear any prior page-level config (resetModules gives us a fresh empty
  // _pageConfig, so this is just defensive).
  const pc = pageConfig.getPageConfig();
  for (const key of Object.keys(pc)) delete pc[key];
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  destroyClient(HA_URL, TOKEN_A);
  destroyClient(HA_URL, TOKEN_B);
});

function makeFakeCard() {
  return {
    setErrorState: vi.fn(),
    receiveDefinition: vi.fn(),
    applyState: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Single-card debounce skip
// ---------------------------------------------------------------------------

describe("registerCard - debounce skip", () => {
  it("skips the 50ms debounce when only one card is pending and no HArvest.config()", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.registerCard("light.solo", makeFakeCard());

    // 0ms probe runs and dispatches immediately because pending=1 and no page config.
    await vi.advanceTimersByTimeAsync(1);
    expect(MockWebSocket.instances.length).toBe(1);
  });

  it("debounces 50ms when two cards register in the same task", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.registerCard("light.a", makeFakeCard());
    client.registerCard("light.b", makeFakeCard());

    // 0ms probe runs but pending=2, so falls through to the 50ms wait.
    await vi.advanceTimersByTimeAsync(1);
    expect(MockWebSocket.instances.length).toBe(0);

    await vi.advanceTimersByTimeAsync(60);
    expect(MockWebSocket.instances.length).toBe(1);

    // Both entities ride in the same auth message.
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    const authMsg = JSON.parse(ws.sent[0]);
    expect(authMsg.type).toBe("auth");
    expect(new Set(authMsg.entity_ids)).toEqual(new Set(["light.a", "light.b"]));
  });

  it("debounces 50ms when HArvest.config() is set, even with a single card", async () => {
    pageConfig.config({ haUrl: HA_URL, token: TOKEN_A });

    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.registerCard("light.solo", makeFakeCard());

    // pageConfig forces the 50ms debounce path.
    await vi.advanceTimersByTimeAsync(1);
    // prewarm is NOT called here because we created the client via
    // getOrCreateClient directly, not via the harvest-entry config wrapper.
    // So no WS exists yet at this point.
    expect(MockWebSocket.instances.length).toBe(0);

    await vi.advanceTimersByTimeAsync(60);
    expect(MockWebSocket.instances.length).toBe(1);
  });

  it("subscribes a card registered while initial auth is in flight", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.registerCard("light.first", makeFakeCard());
    await vi.advanceTimersByTimeAsync(1);

    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(ws.sent).toHaveLength(1);
    expect(JSON.parse(ws.sent[0]).type).toBe("auth");

    client.registerCard("light.late", makeFakeCard());
    await vi.advanceTimersByTimeAsync(1);

    expect(ws.sent).toHaveLength(1);

    ws.onmessage?.({
      data: JSON.stringify({
        type: "auth_ok",
        session_id: "hrs_initial",
        absolute_expires_at: "2099-01-01T00:00:00Z",
        max_renewals: null,
      }),
    });

    expect(ws.sent).toHaveLength(2);
    const subscribe = JSON.parse(ws.sent[1]);
    expect(subscribe.type).toBe("subscribe");
    expect(subscribe.session_id).toBe("hrs_initial");
    expect(subscribe.entity_ids).toEqual(["light.late"]);
  });
});

// ---------------------------------------------------------------------------
// prewarm
// ---------------------------------------------------------------------------

describe("HarvestClient.prewarm", () => {
  it("opens a WebSocket without sending auth", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.prewarm();

    expect(MockWebSocket.instances.length).toBe(1);
    const ws = MockWebSocket.instances[0];

    // Simulate the TLS handshake completing with no cards yet.
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    // No auth message - we have no entity_ids yet.
    expect(ws.sent.length).toBe(0);
  });

  it("is a no-op if WS already exists (idempotent)", () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.prewarm();
    client.prewarm();
    client.prewarm();
    expect(MockWebSocket.instances.length).toBe(1);
  });

  it("auth fires when a card registers after a prewarmed WS is already OPEN", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.prewarm();
    const ws = MockWebSocket.instances[0];

    // Pretend the TLS handshake completed before any card mounted.
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(ws.sent.length).toBe(0);

    // Card registers - debounce dispatch should send auth on the existing WS.
    client.registerCard("light.solo", makeFakeCard());
    await vi.advanceTimersByTimeAsync(1);

    expect(ws.sent.length).toBe(1);
    const msg = JSON.parse(ws.sent[0]);
    expect(msg.type).toBe("auth");
    expect(msg.entity_ids).toEqual(["light.solo"]);
    // Crucially: no SECOND WebSocket was created.
    expect(MockWebSocket.instances.length).toBe(1);
  });

  it("auth fires from #onOpen when a card registers while WS is still CONNECTING", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_A, null);
    client.prewarm();
    const ws = MockWebSocket.instances[0];
    expect(ws.readyState).toBe(MockWebSocket.CONNECTING);

    // Card registers while the handshake is still in progress.
    client.registerCard("light.solo", makeFakeCard());
    await vi.advanceTimersByTimeAsync(1);
    // No auth yet because WS is still CONNECTING.
    expect(ws.sent.length).toBe(0);

    // Handshake completes.
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    // #onOpen sees pending IDs and dispatches auth.
    expect(ws.sent.length).toBe(1);
    const msg = JSON.parse(ws.sent[0]);
    expect(msg.type).toBe("auth");
    expect(msg.entity_ids).toEqual(["light.solo"]);
  });
});
