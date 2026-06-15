/**
 * Tests for the public per-card hrv-state-change DOM event.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/hrv-card.js";

afterEach(() => {
  document.body.innerHTML = "";
});

function mountPreviewCard(entity = "light.test") {
  const card = document.createElement("hrv-card");
  card.setAttribute("preview", "");
  card.setAttribute("entity", entity);
  document.body.appendChild(card);
  return card;
}

describe("HrvCard state events", () => {
  it("dispatches a bubbling event for every confirmed state update", () => {
    const card = mountPreviewCard();
    const cardListener = vi.fn();
    const parentListener = vi.fn();
    card.addEventListener("hrv-state-change", cardListener);
    document.body.addEventListener("hrv-state-change", parentListener, { once: true });

    const attributes = { brightness: 100 };
    card.receiveStateUpdate("on", attributes, "2026-06-09T12:00:00Z");

    expect(cardListener).toHaveBeenCalledOnce();
    expect(parentListener).toHaveBeenCalledOnce();
    expect(cardListener.mock.calls[0][0].detail).toEqual({
      entityId: "light.test",
      state: "on",
      attributes,
      previousState: null,
      previousAttributes: null,
      lastUpdated: "2026-06-09T12:00:00Z",
    });
  });

  it("includes the previous confirmed state and attributes", () => {
    const card = mountPreviewCard("sensor.temperature");
    const listener = vi.fn();
    card.addEventListener("hrv-state-change", listener);

    const firstAttributes = { unit_of_measurement: "C" };
    const secondAttributes = { unit_of_measurement: "C", trend: "up" };
    card.receiveStateUpdate("21", firstAttributes, "2026-06-09T12:00:00Z");
    card.receiveStateUpdate("22", secondAttributes, "2026-06-09T12:01:00Z");

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls[1][0].detail).toEqual({
      entityId: "sensor.temperature",
      state: "22",
      attributes: secondAttributes,
      previousState: "21",
      previousAttributes: firstAttributes,
      lastUpdated: "2026-06-09T12:01:00Z",
    });
  });

  it("reports an alias when the card uses alias configuration", () => {
    const card = mountPreviewCard();
    card.removeAttribute("entity");
    card.setAttribute("alias", "dJ5x3Apd");
    const listener = vi.fn();
    card.addEventListener("hrv-state-change", listener);

    card.receiveStateUpdate("off", {}, "2026-06-09T12:00:00Z");

    expect(listener.mock.calls[0][0].detail.entityId).toBe("dJ5x3Apd");
  });
});
