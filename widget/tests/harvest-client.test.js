/**
 * tests/harvest-client.test.js - Tests for harvest-client.js
 *
 * HarvestClient opens a real WebSocket on construction (via the auth debounce
 * timer). Tests mock globalThis.WebSocket so no real network connections are
 * made. The singleton registry and key-format logic are the primary focus.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getOrCreateClient, destroyClient, HarvestClient } from "../src/harvest-client.js";

// ---------------------------------------------------------------------------
// WebSocket mock
// ---------------------------------------------------------------------------

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    MockWebSocket.instances.push(this);
  }

  send() {}
  close() { this.readyState = MockWebSocket.CLOSED; }

  static instances = [];
  static reset() { MockWebSocket.instances = []; }
}

beforeEach(() => {
  MockWebSocket.reset();
  globalThis.WebSocket = MockWebSocket;
  vi.useFakeTimers();
});

afterEach(() => {
  // Clean up any clients created during the test
  vi.clearAllTimers();
  vi.useRealTimers();
  // Access the internal registry to purge (avoids cross-test pollution)
  destroyClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA");
  destroyClient("https://ha.example.com", "hwt_tokenBBBBBBBBBBBBBBBB");
  destroyClient("https://other.example.com", "hwt_tokenAAAAAAAAAAAAAAAA");
});

// ---------------------------------------------------------------------------
// getOrCreateClient - singleton behaviour
// ---------------------------------------------------------------------------

describe("getOrCreateClient", () => {
  it("returns the same instance for the same (haUrl, tokenId)", () => {
    const a = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const b = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(a).toBe(b);
  });

  it("returns different instances for different tokenIds on the same haUrl", () => {
    const a = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const b = getOrCreateClient("https://ha.example.com", "hwt_tokenBBBBBBBBBBBBBBBB", null);
    expect(a).not.toBe(b);
  });

  it("returns different instances for same tokenId on different haUrls", () => {
    const a = getOrCreateClient("https://ha.example.com",    "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const b = getOrCreateClient("https://other.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(a).not.toBe(b);
  });

  it("returns a HarvestClient instance", () => {
    const client = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(client).toBeInstanceOf(HarvestClient);
  });

  it("ignores tokenSecret on subsequent lookups", () => {
    const a = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", "secret1");
    const b = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", "secret2");
    expect(a).toBe(b);
  });
});

// ---------------------------------------------------------------------------
// destroyClient
// ---------------------------------------------------------------------------

describe("destroyClient", () => {
  it("removes client from registry so next call creates a fresh instance", () => {
    const a = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    destroyClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA");
    const b = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(a).not.toBe(b);
  });

  it("is a no-op for an unknown (haUrl, tokenId) pair", () => {
    expect(() =>
      destroyClient("https://nonexistent.example.com", "hwt_tokenAAAAAAAAAAAAAAAA")
    ).not.toThrow();
  });

  it("does not remove a client with a different tokenId", () => {
    const a = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    destroyClient("https://ha.example.com", "hwt_tokenBBBBBBBBBBBBBBBB");
    const a2 = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(a).toBe(a2);
  });
});

// ---------------------------------------------------------------------------
// Singleton key format
// ---------------------------------------------------------------------------

describe("Singleton key format", () => {
  it("two tokens on the same HA instance produce separate clients (key is haUrl|tokenId)", () => {
    // Client keys include both HA URL and token ID.
    const haUrl   = "https://ha.example.com";
    const tokenA  = "hwt_tokenAAAAAAAAAAAAAAAA";
    const tokenB  = "hwt_tokenBBBBBBBBBBBBBBBB";

    const clientA = getOrCreateClient(haUrl, tokenA, null);
    const clientB = getOrCreateClient(haUrl, tokenB, null);

    expect(clientA).not.toBe(clientB);

    // Both should still be reachable as the same instance
    expect(getOrCreateClient(haUrl, tokenA, null)).toBe(clientA);
    expect(getOrCreateClient(haUrl, tokenB, null)).toBe(clientB);
  });
});

// ---------------------------------------------------------------------------
// Card registration
// ---------------------------------------------------------------------------

describe("HarvestClient.registerCard / getCard", () => {
  it("registerCard stores a card and _getCard retrieves it", () => {
    const client = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const fakeCard = { entityId: "light.test", applyState: vi.fn() };

    client.registerCard("light.test", fakeCard);
    expect(client._getCard("light.test")).toBe(fakeCard);
  });

  it("registerCard is last-write-wins", () => {
    const client = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const card1 = { id: 1 };
    const card2 = { id: 2 };

    client.registerCard("light.test", card1);
    client.registerCard("light.test", card2);

    expect(client._getCard("light.test")).toBe(card2);
  });

  it("_getCard returns null for an unknown entityId", () => {
    const client = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    expect(client._getCard("light.nonexistent")).toBeNull();
  });

  it("unregisterCard removes the card", () => {
    const client = getOrCreateClient("https://ha.example.com", "hwt_tokenAAAAAAAAAAAAAAAA", null);
    const card = { id: 1 };

    client.registerCard("light.test", card);
    client.unregisterCard("light.test");

    expect(client._getCard("light.test")).toBeNull();
  });
});
