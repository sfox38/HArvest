/**
 * Tests ordering of initial snapshots and live state updates.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const HA_URL = "https://ha.example.com";
const TOKEN_ID = "hwt_orderingAAAAAAAAAAA";

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances = [];

  constructor() {
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

describe("state update ordering", () => {
  it("does not let an older initial snapshot overwrite a newer live update", async () => {
    const card = { receiveStateUpdate: vi.fn(), setErrorState: vi.fn() };
    const client = getOrCreateClient(HA_URL, TOKEN_ID, null);
    client.registerCard("light.test", card);
    await vi.advanceTimersByTimeAsync(1);

    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen();
    await vi.advanceTimersByTimeAsync(0);

    ws.onmessage({
      data: JSON.stringify({
        type: "state_update",
        entity_id: "light.test",
        state: "on",
        attributes: {},
        last_updated: "2026-01-01T00:00:02+00:00",
        initial: false,
      }),
    });
    ws.onmessage({
      data: JSON.stringify({
        type: "state_update",
        entity_id: "light.test",
        state: "off",
        attributes: {},
        last_updated: "2026-01-01T00:00:01+00:00",
        initial: true,
      }),
    });
    await vi.advanceTimersByTimeAsync(20);

    expect(card.receiveStateUpdate).toHaveBeenCalledOnce();
    expect(card.receiveStateUpdate.mock.calls[0][0]).toBe("on");
  });
});
