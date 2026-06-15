/**
 * tests/lock-person-button-cards.test.js
 *
 * Tests for:
 *   LockCard   - lock-card.js
 *   PersonCard - person-card.js
 *   ButtonCard - button-card.js
 */

import { describe, it, expect, afterEach, vi } from "vitest";
import { LockCard }   from "../src/renderers/lock-card.js";
import { PersonCard } from "../src/renderers/person-card.js";
import { ButtonCard } from "../src/renderers/button-card.js";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeShadowRoot() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

const TRANSLATIONS = {
  "state.on": "On", "state.off": "Off",
  "state.unavailable": "Unavailable", "state.unknown": "Unknown",
  "state.home": "Home", "state.not_home": "Away",
  "action.toggle": "Toggle", "action.currently": "currently",
  "action.lock": "Lock", "action.unlock": "Unlock",
  "action.press": "Press",
};
const i18n = { t: (k) => TRANSLATIONS[k] ?? k };

function makeConfig(sendCommand = vi.fn()) {
  return { companions: [], card: { sendCommand } };
}

function simulateTap(element) {
  element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove();
});

// ---------------------------------------------------------------------------
// LockCard - staleOnMount
// ---------------------------------------------------------------------------

describe("LockCard.staleOnMount", () => {
  it("is false - security state must not be stale", () => {
    expect(LockCard.staleOnMount).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// LockCard - render()
// ---------------------------------------------------------------------------

function makeLockDef(overrides = {}) {
  return {
    entity_id: "lock.front_door",
    domain: "lock",
    device_class: null,
    friendly_name: "Front Door",
    supported_features: [],
    feature_config: {},
    icon: null,
    icon_state_map: null,
    support_tier: 1,
    renderer: "LockCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

describe("LockCard render()", () => {
  function card(defOverrides = {}) {
    const c = new LockCard(makeLockDef(defOverrides), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    return c;
  }

  it("renders lock-button for read-write", () => {
    const c = card({ capabilities: "read-write" });
    expect(c.root.querySelector("[part=lock-button]")).not.toBeNull();
  });

  it("omits lock-button for read-only", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=lock-button]")).toBeNull();
  });

  it("renders state-label for read-only, omits it for writable", () => {
    const ro = card({ capabilities: "read" });
    expect(ro.root.querySelector("[part=state-label]")).not.toBeNull();
    const rw = card({ capabilities: "read-write" });
    expect(rw.root.querySelector("[part=state-label]")).toBeNull();
  });

  it("renders card-name with entity friendly_name", () => {
    const c = card({ friendly_name: "Back Gate" });
    expect(c.root.querySelector("[part=card-name]").textContent).toBe("Back Gate");
  });

  it("escapes HTML in friendly_name", () => {
    const c = card({ friendly_name: "<b>xss</b>" });
    expect(c.root.querySelector("[part=card-name]").innerHTML).not.toContain("<b>");
  });

  it("renders card-icon slot", () => {
    const c = card();
    expect(c.root.querySelector("[part=card-icon]")).not.toBeNull();
  });

  it("sets data-readonly on card for read-only capability", () => {
    const c = card({ capabilities: "read" });
    expect(c.root.querySelector("[part=card]")?.getAttribute("data-readonly")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// LockCard - applyState()
// ---------------------------------------------------------------------------

describe("LockCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new LockCard(
      makeLockDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("read-only card state-label shows locked state", () => {
    const c = new LockCard(makeLockDef({ capabilities: "read" }), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    c.applyState("locked", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("locked");
  });

  it("read-only card state-label shows unlocked state", () => {
    const c = new LockCard(makeLockDef({ capabilities: "read" }), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    c.applyState("unlocked", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("unlocked");
  });

  it("button shows 'Unlock' when locked (next action)", () => {
    const c = renderedCard();
    c.applyState("locked", {});
    expect(c.root.querySelector("[part=lock-button]").textContent.trim()).toBe("Unlock");
  });

  it("button shows 'Lock' when unlocked (next action)", () => {
    const c = renderedCard();
    c.applyState("unlocked", {});
    expect(c.root.querySelector("[part=lock-button]").textContent.trim()).toBe("Lock");
  });

  it("button data-action=unlock when locked", () => {
    const c = renderedCard();
    c.applyState("locked", {});
    expect(c.root.querySelector("[part=lock-button]").dataset.action).toBe("unlock");
  });

  it("button data-action=lock when unlocked", () => {
    const c = renderedCard();
    c.applyState("unlocked", {});
    expect(c.root.querySelector("[part=lock-button]").dataset.action).toBe("lock");
  });

  it("disables button while locking (transitioning)", () => {
    const c = renderedCard();
    c.applyState("locking", {});
    expect(c.root.querySelector("[part=lock-button]").disabled).toBe(true);
  });

  it("disables button while unlocking (transitioning)", () => {
    const c = renderedCard();
    c.applyState("unlocking", {});
    expect(c.root.querySelector("[part=lock-button]").disabled).toBe(true);
  });

  it("disables button when jammed", () => {
    const c = renderedCard();
    c.applyState("jammed", {});
    expect(c.root.querySelector("[part=lock-button]").disabled).toBe(true);
  });

  it("disables button when unavailable", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=lock-button]").disabled).toBe(true);
  });

  it("re-enables button after transitioning completes", () => {
    const c = renderedCard();
    c.applyState("locking", {});
    c.applyState("locked", {});
    expect(c.root.querySelector("[part=lock-button]").disabled).toBe(false);
  });

  it("read-only card state-label data-state tracks jammed", () => {
    const c = new LockCard(makeLockDef({ capabilities: "read" }), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    c.applyState("jammed", {});
    expect(c.root.querySelector("[part=state-label]").dataset.state).toBe("jammed");
  });

  it("tap while locked sends unlock command", () => {
    const sendCommand = vi.fn();
    const c = new LockCard(makeLockDef(), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    c.applyState("locked", {});
    simulateTap(c.root.querySelector("[part=lock-button]"));
    expect(sendCommand).toHaveBeenCalledWith("unlock", {});
  });

  it("tap while unlocked sends lock command", () => {
    const sendCommand = vi.fn();
    const c = new LockCard(makeLockDef(), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    c.applyState("unlocked", {});
    simulateTap(c.root.querySelector("[part=lock-button]"));
    expect(sendCommand).toHaveBeenCalledWith("lock", {});
  });
});

// ---------------------------------------------------------------------------
// LockCard - predictState()
// ---------------------------------------------------------------------------

describe("LockCard predictState()", () => {
  function renderedCard() {
    const c = new LockCard(makeLockDef(), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    return c;
  }

  it("predicts 'locking' for lock action", () => {
    expect(renderedCard().predictState("lock", {})?.state).toBe("locking");
  });

  it("predicts 'unlocking' for unlock action", () => {
    expect(renderedCard().predictState("unlock", {})?.state).toBe("unlocking");
  });

  it("returns null for unknown action", () => {
    expect(renderedCard().predictState("open", {})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// PersonCard - staleOnMount
// ---------------------------------------------------------------------------

describe("PersonCard.staleOnMount", () => {
  it("is true - read-only, safe to cache", () => {
    expect(PersonCard.staleOnMount).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PersonCard - render()
// ---------------------------------------------------------------------------

function makePersonDef(overrides = {}) {
  return {
    entity_id: "person.alice",
    domain: "person",
    device_class: null,
    friendly_name: "Alice",
    supported_features: [],
    feature_config: {},
    icon: null,
    icon_state_map: null,
    support_tier: 1,
    renderer: "PersonCard",
    unit_of_measurement: null,
    capabilities: "read",
    ...overrides,
  };
}

describe("PersonCard render()", () => {
  function card(defOverrides = {}) {
    const c = new PersonCard(makePersonDef(defOverrides), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    return c;
  }

  it("renders state-label slot", () => {
    expect(card().root.querySelector("[part=state-label]")).not.toBeNull();
  });

  it("renders card-name with friendly_name", () => {
    expect(card({ friendly_name: "Bob" }).root.querySelector("[part=card-name]").textContent).toBe("Bob");
  });

  it("renders card-icon slot", () => {
    expect(card().root.querySelector("[part=card-icon]")).not.toBeNull();
  });

  it("does not render a control button (read-only domain)", () => {
    expect(card().root.querySelector("button")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// PersonCard - applyState()
// ---------------------------------------------------------------------------

describe("PersonCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new PersonCard(makePersonDef(defOverrides), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    return c;
  }

  it("shows 'Home' for state=home (via i18n)", () => {
    const c = renderedCard();
    c.applyState("home", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Home");
  });

  it("shows 'Away' for state=not_home (via i18n)", () => {
    const c = renderedCard();
    c.applyState("not_home", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Away");
  });

  it("shows zone name verbatim for zone states", () => {
    const c = renderedCard();
    c.applyState("Office", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Office");
  });

  it("sets data-state attribute on state-label", () => {
    const c = renderedCard();
    c.applyState("not_home", {});
    expect(c.root.querySelector("[part=state-label]").dataset.state).toBe("not_home");
  });
});

// ---------------------------------------------------------------------------
// ButtonCard - staleOnMount
// ---------------------------------------------------------------------------

describe("ButtonCard.staleOnMount", () => {
  it("is false - button must be ready to press immediately", () => {
    expect(ButtonCard.staleOnMount).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ButtonCard - render()
// ---------------------------------------------------------------------------

function makeButtonDef(overrides = {}) {
  return {
    entity_id: "button.restart",
    domain: "button",
    device_class: null,
    friendly_name: "Restart Device",
    supported_features: [],
    feature_config: {},
    icon: null,
    icon_state_map: null,
    support_tier: 1,
    renderer: "ButtonCard",
    unit_of_measurement: null,
    capabilities: "read-write",
    ...overrides,
  };
}

describe("ButtonCard render()", () => {
  function card(defOverrides = {}) {
    const c = new ButtonCard(makeButtonDef(defOverrides), makeShadowRoot(), makeConfig(), i18n);
    c.render();
    return c;
  }

  it("renders press-button for read-write", () => {
    expect(card({ capabilities: "read-write" }).root.querySelector("[part=press-button]")).not.toBeNull();
  });

  it("omits press-button for read-only", () => {
    expect(card({ capabilities: "read" }).root.querySelector("[part=press-button]")).toBeNull();
  });

  it("renders card-name with friendly_name", () => {
    expect(card({ friendly_name: "Restart" }).root.querySelector("[part=card-name]").textContent).toBe("Restart");
  });

  it("escapes HTML in friendly_name", () => {
    const c = card({ friendly_name: "<img src=x onerror=alert(1)>" });
    expect(c.root.querySelector("[part=card-name]").innerHTML).not.toContain("<img");
  });

  it("renders card-icon slot", () => {
    expect(card().root.querySelector("[part=card-icon]")).not.toBeNull();
  });

  it("press-button label is 'Press'", () => {
    const c = card();
    expect(c.root.querySelector("[part=press-button]").textContent.trim()).toBe("Press");
  });
});

// ---------------------------------------------------------------------------
// ButtonCard - applyState()
// ---------------------------------------------------------------------------

describe("ButtonCard applyState()", () => {
  function renderedCard(defOverrides = {}) {
    const c = new ButtonCard(
      makeButtonDef({ capabilities: "read-write", ...defOverrides }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    return c;
  }

  it("enables press-button for normal states", () => {
    const c = renderedCard();
    c.applyState("unknown", {});
    c.applyState("idle", {});
    expect(c.root.querySelector("[part=press-button]").disabled).toBe(false);
  });

  it("disables press-button when unavailable", () => {
    const c = renderedCard();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=press-button]").disabled).toBe(true);
  });

  it("disables press-button when state=unknown", () => {
    const c = renderedCard();
    c.applyState("unknown", {});
    expect(c.root.querySelector("[part=press-button]").disabled).toBe(true);
  });

  it("press tap sends 'press' command with empty params", () => {
    const sendCommand = vi.fn();
    const c = new ButtonCard(makeButtonDef(), makeShadowRoot(), makeConfig(sendCommand), i18n);
    c.render();
    simulateTap(c.root.querySelector("[part=press-button]"));
    expect(sendCommand).toHaveBeenCalledWith("press", {});
  });

  it("shows unavailable text in state-label for read-only when unavailable", () => {
    const c = new ButtonCard(
      makeButtonDef({ capabilities: "read" }),
      makeShadowRoot(), makeConfig(), i18n
    );
    c.render();
    c.applyState("unavailable", {});
    expect(c.root.querySelector("[part=state-label]").textContent).toBe("Unavailable");
  });
});
