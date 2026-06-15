/**
 * Tests for cards mounted before HArvest.config() supplies page defaults.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { config, getPageConfig } from "../src/page-config.js";
import { destroyClient } from "../src/harvest-client.js";
import "../src/hrv-card.js";

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

  send(data) { this.sent.push(data); }
  close() { this.readyState = MockWebSocket.CLOSED; }
}

const HA_URL = "https://ha.example.com";
const TOKEN = "hwt_lateconfigABCDEFGHI";
const EXPLICIT_HA_URL = "https://explicit.example.com";
const EXPLICIT_TOKEN = "hwt_explicitABCDEFGHIJK";

function clearPageConfig() {
  const pageConfig = getPageConfig();
  for (const key of Object.keys(pageConfig)) delete pageConfig[key];
}

beforeEach(() => {
  MockWebSocket.instances = [];
  globalThis.WebSocket = MockWebSocket;
  vi.useFakeTimers();
  clearPageConfig();
});

afterEach(() => {
  document.body.innerHTML = "";
  destroyClient(HA_URL, TOKEN);
  destroyClient(EXPLICIT_HA_URL, EXPLICIT_TOKEN);
  clearPageConfig();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("late page configuration", () => {
  it("connects a card mounted before page config is set", async () => {
    const card = document.createElement("hrv-card");
    card.setAttribute("entity", "light.late");
    document.body.appendChild(card);

    expect(MockWebSocket.instances).toHaveLength(0);
    expect(card.getAttribute("data-harvest-state")).toBe("HRV_CONNECTING");

    config({ haUrl: HA_URL, token: TOKEN });
    await vi.advanceTimersByTimeAsync(60);

    expect(MockWebSocket.instances).toHaveLength(1);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);

    const auth = JSON.parse(ws.sent[0]);
    expect(auth.type).toBe("auth");
    expect(auth.entity_ids).toEqual(["light.late"]);
  });

  it("waits for both connection values across repeated config calls", async () => {
    const card = document.createElement("hrv-card");
    card.setAttribute("entity", "light.partial");
    document.body.appendChild(card);

    config({ haUrl: HA_URL });
    await vi.advanceTimersByTimeAsync(60);
    expect(MockWebSocket.instances).toHaveLength(0);

    config({ token: TOKEN });
    await vi.advanceTimersByTimeAsync(60);
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it("does not reconnect an explicitly configured active card", async () => {
    const card = document.createElement("hrv-card");
    card.setAttribute("ha-url", EXPLICIT_HA_URL);
    card.setAttribute("token", EXPLICIT_TOKEN);
    card.setAttribute("entity", "light.explicit");
    document.body.appendChild(card);

    await vi.advanceTimersByTimeAsync(1);
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN;
    ws.onopen?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(ws.sent).toHaveLength(1);

    config({ colorScheme: "dark" });
    await vi.advanceTimersByTimeAsync(60);

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(ws.sent).toHaveLength(1);
  });
});
