/**
 * Tests HMAC signing and duplicate suppression for session renewal.
 */

import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const HA_URL = "https://ha.example.com";
const TOKEN_ID = "hwt_renewalAAAAAAAAAAAA";
const TOKEN_SECRET = "renewal-secret";

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances = [];

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

  send(data) {
    this.sent.push(JSON.parse(data));
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
  }
}

let destroyClient;
let getOrCreateClient;

beforeEach(async () => {
  MockWebSocket.instances = [];
  globalThis.WebSocket = MockWebSocket;
  vi.useFakeTimers();
  vi.resetModules();
  ({ destroyClient, getOrCreateClient } = await import("../src/harvest-client.js"));
});

afterEach(() => {
  destroyClient(HA_URL, TOKEN_ID);
  vi.clearAllTimers();
  vi.useRealTimers();
});

async function connect(tokenSecret) {
  const client = getOrCreateClient(HA_URL, TOKEN_ID, tokenSecret);
  client.registerCard("light.test", { setErrorState: vi.fn() });
  await vi.advanceTimersByTimeAsync(1);

  const ws = MockWebSocket.instances[0];
  ws.readyState = MockWebSocket.OPEN;
  ws.onopen();
  await vi.waitFor(() => {
    expect(ws.sent.some((msg) => msg.type === "auth")).toBe(true);
  });
  ws.onmessage({
    data: JSON.stringify({
      type: "auth_ok",
      session_id: "hrs_initial",
      absolute_expires_at: "2099-01-01T00:00:00Z",
      max_renewals: null,
    }),
  });
  ws.sent = [];
  return ws;
}

function expire(ws) {
  ws.onmessage({
    data: JSON.stringify({
      type: "session_expiring",
      expires_at: "2098-12-31T23:50:00Z",
    }),
  });
}

describe("session renewal signing", () => {
  it("signs renew messages for HMAC-enabled tokens", async () => {
    const ws = await connect(TOKEN_SECRET);

    expire(ws);
    await vi.waitFor(() => {
      expect(ws.sent).toHaveLength(1);
    });
    const renew = ws.sent[0];
    expect(renew.type).toBe("renew");
    expect(renew.session_id).toBe("hrs_initial");
    expect(renew.token_id).toBe(TOKEN_ID);
    expect(typeof renew.timestamp).toBe("number");
    expect(renew.nonce).toMatch(/^[a-zA-Z0-9]{16}$/);
    expect(renew.signature).toBe(
      createHmac("sha256", TOKEN_SECRET)
        .update(`${TOKEN_ID}:${renew.timestamp}:${renew.nonce}`)
        .digest("hex"),
    );
  });

  it("omits signature fields for tokens without HMAC", async () => {
    const ws = await connect(null);

    expire(ws);
    await vi.advanceTimersByTimeAsync(0);

    expect(ws.sent).toHaveLength(1);
    expect(ws.sent[0]).not.toHaveProperty("timestamp");
    expect(ws.sent[0]).not.toHaveProperty("nonce");
    expect(ws.sent[0]).not.toHaveProperty("signature");
  });

  it("allows only one renewal to remain in flight", async () => {
    const ws = await connect(TOKEN_SECRET);

    expire(ws);
    expire(ws);
    expire(ws);
    await vi.waitFor(() => {
      expect(ws.sent).toHaveLength(1);
    });

    ws.onmessage({
      data: JSON.stringify({
        type: "auth_ok",
        session_id: "hrs_renewed",
        absolute_expires_at: "2099-01-01T00:00:00Z",
        max_renewals: null,
      }),
    });
    expire(ws);
    await vi.waitFor(() => {
      expect(ws.sent).toHaveLength(2);
    });
    expect(ws.sent[1].session_id).toBe("hrs_renewed");
  });

  it("queues session actions during renewal and flushes them with the new session ID", async () => {
    const client = getOrCreateClient(HA_URL, TOKEN_ID, null);
    client.registerCard("light.test", { setErrorState: vi.fn() });
    await vi.advanceTimersByTimeAsync(1);

    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen();
    await vi.waitFor(() => {
      expect(ws.sent.some((msg) => msg.type === "auth")).toBe(true);
    });
    ws.onmessage({
      data: JSON.stringify({
        type: "auth_ok",
        session_id: "hrs_initial",
        absolute_expires_at: "2099-01-01T00:00:00Z",
        max_renewals: null,
      }),
    });
    ws.sent = [];

    expire(ws);
    client.sendCommand("light.test", "toggle", {}, 100);
    client.requestHistory("light.test");
    client.registerCard("light.late", { setErrorState: vi.fn() });
    client.unregisterCard("light.test");

    expect(ws.sent.map((msg) => msg.type)).toEqual(["renew"]);

    ws.onmessage({
      data: JSON.stringify({
        type: "auth_ok",
        session_id: "hrs_renewed",
        absolute_expires_at: "2099-01-01T00:00:00Z",
        max_renewals: null,
      }),
    });

    expect(ws.sent.map((msg) => msg.type)).toEqual([
      "renew",
      "command",
      "history_request",
      "subscribe",
      "unsubscribe",
    ]);
    for (const msg of ws.sent.slice(1)) {
      expect(msg.session_id).toBe("hrs_renewed");
    }
  });
});
