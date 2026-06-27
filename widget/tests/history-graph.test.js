/**
 * tests/history-graph.test.js
 *
 * Covers the history-graph data path end to end:
 *
 *   1. Renderer drawing       - BaseCard.receiveHistoryData() creates SVG in
 *                               [part=history-graph].
 *   2. HrvCard hookup         - receiveDefinition() with display_hints.graph
 *                               builds the history zone and wires config.graph;
 *                               receiveHistoryData() forwards points to the
 *                               renderer so the graph actually draws.
 *   3. Client routing         - a history_data message is delivered to the
 *                               card registered under its entity ref, and
 *                               requestHistory() emits a well-formed request.
 *
 * These exercise the live path from server history_data to card to renderer,
 * which is what makes the graph appear on hosted widgets. The panel preview
 * uses the same renderer drawing with mock points.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GenericSensorCard } from "../src/renderers/sensor-generic-card.js";
import "../src/hrv-card.js";
import { getOrCreateClient, destroyClient } from "../src/harvest-client.js";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const i18n = { t: (k) => k };

function makeConfig(overrides = {}) {
  return { companions: [], card: { sendCommand: vi.fn() }, ...overrides };
}

function makeSensorDef(overrides = {}) {
  return {
    entity_id: "sensor.temp",
    domain: "sensor",
    device_class: null,
    friendly_name: "Temp",
    supported_features: [],
    feature_config: {},
    icon: "mdi:thermometer",
    icon_state_map: { "*": "mdi:thermometer" },
    support_tier: 1,
    renderer: "GenericSensorCard",
    unit_of_measurement: "C",
    capabilities: "read",
    display_hints: {},
    companions: [],
    ...overrides,
  };
}

// Two numeric points an hour apart - the minimum the renderer needs to draw.
function numericPoints(n = 6) {
  const now = Date.now();
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({
      t: new Date(now - (n - i) * 3600_000).toISOString(),
      s: String(20 + i),
    });
  }
  return pts;
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// 1. Renderer drawing
// ---------------------------------------------------------------------------

describe("BaseCard.receiveHistoryData() drawing", () => {
  function renderedCard(configOverrides = {}) {
    const c = new GenericSensorCard(
      makeSensorDef(), makeShadowRoot(), makeConfig({ graph: "line", ...configOverrides }), i18n
    );
    c.render();
    return c;
  }

  it("renders the history zone when config.graph is set", () => {
    const c = renderedCard();
    expect(c.root.querySelector("[part=history-graph]")).not.toBeNull();
  });

  it("omits the history zone when config.graph is falsy", () => {
    const c = new GenericSensorCard(
      makeSensorDef(), makeShadowRoot(), makeConfig({ graph: null }), i18n
    );
    c.render();
    expect(c.root.querySelector("[part=history-graph]")).toBeNull();
  });

  it("draws an SVG into the history zone for a line graph", () => {
    const c = renderedCard();
    c.receiveHistoryData(numericPoints(), 24, "line");
    const zone = c.root.querySelector("[part=history-graph]");
    expect(zone.querySelector("svg")).not.toBeNull();
    expect(zone.querySelector("polyline")).not.toBeNull();
  });

  it("draws bars for a bar graph", () => {
    const c = renderedCard();
    c.receiveHistoryData(numericPoints(), 24, "bar");
    expect(c.root.querySelector("[part=history-graph] rect")).not.toBeNull();
  });

  it("draws a step path for a binary step graph", () => {
    const c = new GenericSensorCard(
      makeSensorDef({ domain: "binary_sensor", device_class: "motion" }),
      makeShadowRoot(), makeConfig({ graph: "step" }), i18n
    );
    c.render();
    const now = Date.now();
    const pts = [
      { t: new Date(now - 3 * 3600_000).toISOString(), s: "on" },
      { t: new Date(now - 2 * 3600_000).toISOString(), s: "off" },
      { t: new Date(now - 1 * 3600_000).toISOString(), s: "on" },
    ];
    c.receiveHistoryData(pts, 24, "step");
    expect(c.root.querySelector("[part=history-graph] svg")).not.toBeNull();
  });

  it("clears the zone when fewer than two usable points arrive", () => {
    const c = renderedCard();
    c.receiveHistoryData([{ t: new Date().toISOString(), s: "20" }], 24, "line");
    expect(c.root.querySelector("[part=history-graph]").innerHTML).toBe("");
  });

  it("ignores non-numeric points when building the series", () => {
    const c = renderedCard();
    const pts = [
      { t: new Date(Date.now() - 2 * 3600_000).toISOString(), s: "unavailable" },
      { t: new Date(Date.now() - 1 * 3600_000).toISOString(), s: "21" },
    ];
    // Only one usable point survives, so there is nothing to draw.
    c.receiveHistoryData(pts, 24, "line");
    expect(c.root.querySelector("[part=history-graph]").innerHTML).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 2. HrvCard hookup (the live card glue)
// ---------------------------------------------------------------------------

describe("HrvCard graph hookup", () => {
  function mountCard(entity = "sensor.temp") {
    const card = document.createElement("hrv-card");
    card.setAttribute("preview", ""); // skip the WebSocket connection
    card.setAttribute("entity", entity);
    document.body.appendChild(card);
    return card;
  }

  it("builds the history zone from display_hints.graph in the definition", () => {
    const card = mountCard();
    card.receiveDefinition(makeSensorDef({ display_hints: { graph: "line" } }));
    expect(card.shadowRoot.querySelector("[part=history-graph]")).not.toBeNull();
  });

  it("does not build a history zone when no graph hint is present", () => {
    const card = mountCard();
    card.receiveDefinition(makeSensorDef({ display_hints: {} }));
    expect(card.shadowRoot.querySelector("[part=history-graph]")).toBeNull();
  });

  it("forwards history_data points to the renderer so the graph draws", () => {
    const card = mountCard();
    card.receiveDefinition(makeSensorDef({ display_hints: { graph: "line" } }));
    card.receiveHistoryData(numericPoints(), 24);
    const zone = card.shadowRoot.querySelector("[part=history-graph]");
    expect(zone.querySelector("svg")).not.toBeNull();
  });

  it("redraws cached history after a re-definition (e.g. renew)", () => {
    const card = mountCard();
    card.receiveDefinition(makeSensorDef({ display_hints: { graph: "line" } }));
    card.receiveHistoryData(numericPoints(), 24);
    // A second, different definition rebuilds the renderer; the cached
    // history must be replayed so the graph survives the rebuild.
    card.receiveDefinition(makeSensorDef({ friendly_name: "Temp 2", display_hints: { graph: "line" } }));
    const zone = card.shadowRoot.querySelector("[part=history-graph]");
    expect(zone.querySelector("svg")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. Client routing
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
    this.sent = [];
    MockWebSocket.instances.push(this);
  }

  send(data) { this.sent.push(data); }
  close() { this.readyState = MockWebSocket.CLOSED; }

  static instances = [];
  static reset() { MockWebSocket.instances = []; }
}

describe("HarvestClient history routing", () => {
  const HA = "https://ha.example.com";
  const TOKEN = "hwt_tokenHISTORYAAAAAAA";

  beforeEach(() => {
    MockWebSocket.reset();
    globalThis.WebSocket = MockWebSocket;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    destroyClient(HA, TOKEN);
  });

  function connectedClient() {
    const client = getOrCreateClient(HA, TOKEN, null);
    // A registered card schedules the auth debounce, which opens the WS.
    client.registerCard("sensor.bootstrap", { receiveHistoryData: vi.fn() });
    vi.runOnlyPendingTimers(); // probe -> dispatchAuth -> #openConnection
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN; // mark open without the HMAC auth path
    return { client, ws };
  }

  it("routes a history_data message to the card registered under its ref", () => {
    const { client, ws } = connectedClient();
    const card = { receiveHistoryData: vi.fn() };
    client.registerCard("sensor.temp", card);

    const points = numericPoints();
    ws.onmessage({ data: JSON.stringify({
      type: "history_data", entity_id: "sensor.temp", hours: 24, points,
    }) });

    expect(card.receiveHistoryData).toHaveBeenCalledWith(points, 24);
  });

  it("routes history_data to an alias-keyed card", () => {
    const { client, ws } = connectedClient();
    const card = { receiveHistoryData: vi.fn() };
    client.registerCard("dJ5x3Apd", card);

    ws.onmessage({ data: JSON.stringify({
      type: "history_data", entity_id: "dJ5x3Apd", hours: 12, points: numericPoints(),
    }) });

    expect(card.receiveHistoryData).toHaveBeenCalledOnce();
    expect(card.receiveHistoryData.mock.calls[0][1]).toBe(12);
  });

  it("requestHistory emits a history_request for the entity ref once authed", () => {
    const { client, ws } = connectedClient();
    // Authenticate so requestHistory passes its session/open guard.
    ws.onmessage({ data: JSON.stringify({
      type: "auth_ok", session_id: "hrs_sessionAAAAAAAAAAAA", expires_at: new Date(Date.now() + 3600_000).toISOString(), entity_ids: [],
    }) });
    ws.sent = [];

    client.requestHistory("sensor.temp");

    const requests = ws.sent.map((s) => JSON.parse(s)).filter((m) => m.type === "history_request");
    expect(requests).toHaveLength(1);
    expect(requests[0].entity_id).toBe("sensor.temp");
  });
});

// ---------------------------------------------------------------------------
// 4. End-to-end live path on a real <hrv-card>
//    server entity_definition with graph, requestHistory, history_data, SVG
// ---------------------------------------------------------------------------

describe("HrvCard live history end-to-end", () => {
  const HA = "https://ha.example.com";
  const TOKEN = "hwt_tokenE2EHISTORYAAA";

  beforeEach(() => {
    MockWebSocket.reset();
    globalThis.WebSocket = MockWebSocket;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    destroyClient(HA, TOKEN);
    for (const child of [...document.body.children]) child.remove();
  });

  function mountLiveCard(entity = "sensor.temp") {
    const card = document.createElement("hrv-card");
    card.setAttribute("ha-url", HA);
    card.setAttribute("token", TOKEN);
    card.setAttribute("entity", entity);
    document.body.appendChild(card); // connectedCallback registers the card
    vi.runOnlyPendingTimers();       // probe -> dispatchAuth -> #openConnection
    const ws = MockWebSocket.instances[0];
    ws.readyState = MockWebSocket.OPEN; // open without the HMAC auth path
    // Authenticate via a server message so requestHistory clears its guard.
    ws.onmessage({ data: JSON.stringify({
      type: "auth_ok",
      session_id: "hrs_sessionE2EAAAAAAAAA",
      expires_at: new Date(Date.now() + 3600_000).toISOString(),
      entity_ids: [entity],
    }) });
    return { card, ws };
  }

  it("requests history when a definition with a graph hint arrives", () => {
    const { ws } = mountLiveCard();
    ws.sent = [];
    ws.onmessage({ data: JSON.stringify({
      ...makeSensorDef({ display_hints: { graph: "line" } }),
      type: "entity_definition",
    }) });

    const requests = ws.sent.map((s) => JSON.parse(s)).filter((m) => m.type === "history_request");
    expect(requests).toHaveLength(1);
    expect(requests[0].entity_id).toBe("sensor.temp");
  });

  it("does not request history when the definition has no graph hint", () => {
    const { ws } = mountLiveCard();
    ws.sent = [];
    ws.onmessage({ data: JSON.stringify({
      ...makeSensorDef({ display_hints: {} }),
      type: "entity_definition",
    }) });

    const requests = ws.sent.map((s) => JSON.parse(s)).filter((m) => m.type === "history_request");
    expect(requests).toHaveLength(0);
  });

  it("draws the graph when the server returns history_data", () => {
    const { card, ws } = mountLiveCard();
    ws.onmessage({ data: JSON.stringify({
      ...makeSensorDef({ display_hints: { graph: "line" } }),
      type: "entity_definition",
    }) });
    ws.onmessage({ data: JSON.stringify({
      type: "history_data",
      entity_id: "sensor.temp",
      hours: 24,
      points: numericPoints(),
    }) });

    const zone = card.shadowRoot.querySelector("[part=history-graph]");
    expect(zone).not.toBeNull();
    expect(zone.querySelector("svg")).not.toBeNull();
  });

  it("re-requests history when an identical definition arrives (warm-cache reload / renew)", () => {
    // Regression: the stale-on-mount fast path renders a cached definition
    // before the WS is open, then the matching server definition hits the
    // dedup short-circuit in receiveDefinition. The graph must still load, so
    // an identical definition must still trigger a history request.
    const { ws } = mountLiveCard();
    const def = { ...makeSensorDef({ display_hints: { graph: "line" } }), type: "entity_definition" };
    ws.onmessage({ data: JSON.stringify(def) });
    ws.sent = [];

    // A byte-identical definition (the dedup path) still requests history.
    ws.onmessage({ data: JSON.stringify(def) });

    const requests = ws.sent.map((s) => JSON.parse(s)).filter((m) => m.type === "history_request");
    expect(requests).toHaveLength(1);
    expect(requests[0].entity_id).toBe("sensor.temp");
  });
});
