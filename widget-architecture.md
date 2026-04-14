# HArvest Widget Architecture

**Status:** Draft
**Applies to:** HArvest Widget v1.6.0+

This document describes the internal architecture of the HArvest widget JS library. It is intended as an implementation guide for contributors. It supplements the protocol specification in SPEC.md, which defines the WebSocket message formats, and the panel design in panel-design.md, which defines the management UI.

The widget is a single vanilla JS file with no external dependencies. It uses the Web Components standard (Custom Elements v1, Shadow DOM, CSS Custom Properties) natively supported in all modern browsers.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Entry Points and Initialisation](#entry-points-and-initialisation)
3. [HarvestClient Singleton](#harvestclient-singleton)
4. [HrvCard Custom Element](#hrvcard-custom-element)
5. [HrvGroup Custom Element](#hrvgroup-custom-element)
6. [HrvMount Observer](#hrvmount-observer)
7. [Renderer System](#renderer-system)
8. [State Cache](#state-cache)
9. [Theme Loader](#theme-loader)
10. [Internationalisation](#internationalisation)
11. [Error States](#error-states)
12. [Icons](#icons)
13. [Build Output](#build-output)

---

## 1. File Structure

```
widget/src/
  hrv-card.js           Custom element <hrv-card>, entry point for custom element mode
  hrv-group.js          Custom element <hrv-group>, context provider
  hrv-mount.js          MutationObserver, entry point for data-attribute mount mode
  harvest-client.js     HarvestClient singleton, all WebSocket management
  state-cache.js        localStorage cache with hashed keys
  theme-loader.js       Theme JSON fetch, dark mode variable injection
  error-states.js       Error state management, stale indicator
  icons.js              Bundled MDI SVG strings, keyed by mdi: name
  i18n.js               i18n string lookup with language fallback

  renderers/
    index.js            Renderer registry, lookup function, registerRenderer()
    base-card.js        BaseCard abstract class, shared render helpers
    light-card.js       LightCard renderer
    switch-card.js      SwitchCard renderer
    fan-card.js         FanCard renderer
    climate-card.js     ClimateCard renderer
    cover-card.js       CoverCard renderer
    media-player-card.js  MediaPlayerCard renderer
    remote-card.js      RemoteCard renderer
    sensor-temperature-card.js
    sensor-humidity-card.js
    sensor-generic-card.js
    binary-sensor-card.js
    input-boolean-card.js
    input-number-card.js
    input-select-card.js
    harvest-action-card.js
    generic-card.js     GenericCard fallback for Tier 2 entities
```

---

## 2. Entry Points and Initialisation

### Custom Element Mode

`hrv-card.js` and `hrv-group.js` register their custom elements when the script loads:

```javascript
customElements.define("hrv-card", HrvCard);
customElements.define("hrv-group", HrvGroup);
```

The browser automatically instantiates `HrvCard` and `HrvGroup` for matching elements already in the DOM and for any added later. No explicit initialisation call is needed.

### Data Attribute Mount Mode

`hrv-mount.js` runs on `DOMContentLoaded` to scan for existing `.hrv-mount` and `.hrv-group` divs, and starts a `MutationObserver` for elements added later. See Section 6.

### Public JS API

The `HArvest` global object is the public API surface, assembled in the build entry point:

```javascript
window.HArvest = {
  config(options: PageConfig): void,
  create(config: CardConfig): HrvCard,
  getCard(entityId: string): HrvCard | null,
  registerRenderer(key: string, rendererClass: typeof BaseCard): void,
  renderers: { LightCard, SwitchCard, FanCard, ... },
  track: {
    anyState(callback: (entityId: string, state: string, attributes: object) => void): void,
  },
};
```

`HArvest.config()` sets page-level defaults inherited by all `<hrv-card>` and `<hrv-group>` elements. Merges on repeated calls - later values override earlier ones for the same key. Stored in a module-level `_pageConfig` object. Config is read lazily at WebSocket connection time, not at card mount time, so call order relative to element mounting is not a concern.

```javascript
interface PageConfig {
  haUrl?: string;
  token?: string;
  themeUrl?: string;
  lang?: string;
}

// Internal storage
const _pageConfig: PageConfig = {};

function config(options: PageConfig): void {
  Object.assign(_pageConfig, options);
}

function getPageConfig(): PageConfig {
  return _pageConfig;
}
```

`HArvest.create()` creates an `HrvCard` programmatically and mounts it into a target element by ID. `haUrl` and `token` in the config object are optional if `HArvest.config()` has already been called. Returns the element instance.

`HArvest.getCard()` returns the `HrvCard` instance currently registered for a given entity ID in the active client, or `null` if none exists. If multiple cards have subscribed to the same entity ID over time, the Map holds the most recently registered one (last-write-wins, consistent with the Map's `set()` behaviour in `registerCard()`). Duplicate entity registrations on the same page are unusual but not forbidden.

---

## 3. HarvestClient Singleton

**File:** `harvest-client.js`

`HarvestClient` manages the WebSocket connection for a given `haUrl` and `tokenId` combination. It is a singleton per `(haUrl, tokenId)` pair - at most one instance exists per unique combination on the page. All `HrvCard` elements sharing the same `haUrl` and `tokenId` share one instance. Cards with the same `haUrl` but different tokens get separate clients and separate WebSocket connections. This is important for pages that embed widgets from multiple tokens pointing at the same HA instance.

### Class Definition

```javascript
class HarvestClient {
  #haUrl: string;
  #tokenId: string;
  #tokenSecret: string | null;
  #ws: WebSocket | null = null;
  #sessionId: string | null = null;
  #msgIdCounter: number = 0;
  #cards: Map<string, HrvCard> = new Map();       // entityId -> HrvCard (last registered wins)
  #pendingEntityIds: Set<string> = new Set();      // collected during debounce
  #authDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  #reconnectAttempt: number = 0;
  #reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  #heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  #lastMessageAt: number = 0;
  #reauthAttempts: number = 0;
  #absoluteExpiresAt: Date | null = null;
  #renewalCount: number = 0;
  #entityStates: Map<string, EntityState> = new Map();   // last known state per entity
  #stateListeners: Array<(entityId: string, state: string, attrs: object) => void> = [];

  constructor(haUrl: string, tokenId: string, tokenSecret: string | null) {}

  registerCard(entityId: string, card: HrvCard): void {}
  unregisterCard(entityId: string): void {}
  sendCommand(entityId: string, action: string, data: object, msgId: number): void {}
  nextMsgId(): number {}
  onAnyState(callback: (entityId: string, state: string, attrs: object) => void): void {}
  destroy(): void {}

  #openConnection(): void {}
  #onOpen(): void {}
  #onMessage(event: MessageEvent): void {}
  #onClose(event: CloseEvent): void {}
  #onError(event: Event): void {}
  #sendAuth(): void {}
  #scheduleReconnect(): void {}
  #resetHeartbeat(): void {}
  #routeMessage(msg: object): void {}
  #buildHmacSignature(timestamp: number, nonce: string): Promise<string> {}
}
```

### Singleton Registry

```javascript
// Key is haUrl + "|" + tokenId - not just haUrl.
// A page can have multiple tokens pointing at the same HA instance;
// each token needs its own authenticated WebSocket connection.
const clients: Map<string, HarvestClient> = new Map();  // "haUrl|tokenId" -> HarvestClient

function getOrCreateClient(
  haUrl: string,
  tokenId: string,
  tokenSecret: string | null
): HarvestClient {
  const key = `${haUrl}|${tokenId}`;
  if (!clients.has(key)) {
    clients.set(key, new HarvestClient(haUrl, tokenId, tokenSecret));
  }
  return clients.get(key)!;
}
```

### Auth Debounce

When the first card registers for a given `haUrl`, `registerCard()` starts a 50ms timer before opening the WebSocket. During those 50ms, additional `registerCard()` calls add their entity IDs to `#pendingEntityIds`. When the timer fires, `#openConnection()` is called and `#sendAuth()` sends a single `auth` message with all pending entity IDs. This collapses N card mounts into one auth message.

```javascript
registerCard(entityId: string, card: HrvCard): void {
  this.#cards.set(entityId, card);
  this.#pendingEntityIds.add(entityId);

  if (this.#ws === null && this.#authDebounceTimer === null) {
    this.#authDebounceTimer = setTimeout(() => {
      this.#authDebounceTimer = null;
      this.#openConnection();
    }, 50);
  }
}
```

If `registerCard()` is called after the WebSocket is already open (a late-arriving card), it skips the debounce and sends a `subscribe` message immediately.

### Message Routing

`#routeMessage()` dispatches incoming messages by `type` to the correct handler:

```javascript
#routeMessage(msg: object): void {
  switch (msg.type) {
    case "auth_ok":       return this.#handleAuthOk(msg);
    case "auth_failed":   return this.#handleAuthFailed(msg);
    case "entity_definition": return this.#handleEntityDefinition(msg);
    case "state_update":  return this.#handleStateUpdate(msg);
    case "entity_removed": return this.#handleEntityRemoved(msg);
    case "history_data":  return this.#handleHistoryData(msg);
    case "subscribe_ok":  return this.#handleSubscribeOk(msg);
    case "session_expiring": return this.#handleSessionExpiring(msg);
    case "ack":           return this.#handleAck(msg);
    case "error":         return this.#handleError(msg);
    default:
      console.debug("[HArvest] Unknown message type:", msg.type);
  }
}
```

Unknown types are logged at `debug` level and ignored. Malformed messages (JSON parse failure, missing `type`) are logged at `warn` level. Flood protection counts malformed messages and closes the connection if more than 10 arrive within 5 seconds.

Note on `unsubscribe`: the client sends `unsubscribe` and expects no response from the server. The message loop must not wait for an `ack` after sending an unsubscribe. It is fire-and-forget by design. See SPEC.md Section 5.14.

### State Update Handling

The `#handleStateUpdate()` method applies state ordering enforcement before dispatching to the card:

```javascript
#handleStateUpdate(msg: StateUpdateMessage): void {
  const entityId = msg.entity_id;
  const incoming = new Date(msg.last_updated);
  const existing = this.#entityStates.get(entityId);

  if (existing && !msg.initial && incoming <= existing.lastUpdated) {
    return; // discard out-of-order update
  }

  // Merge delta attributes if not initial
  let attributes = msg.attributes ?? existing?.attributes ?? {};
  if (!msg.initial && msg.attributes_delta) {
    attributes = { ...attributes, ...msg.attributes_delta.changed };
    for (const key of (msg.attributes_delta.removed ?? [])) {
      delete attributes[key];
    }
  }

  this.#entityStates.set(entityId, {
    state: msg.state,
    attributes,
    lastUpdated: incoming,
  });

  StateCache.write(this.#tokenId, entityId, msg.state, attributes);

  const card = this.#cards.get(entityId);
  card?.receiveStateUpdate(msg.state, attributes, msg.last_updated);

  for (const listener of this.#stateListeners) {
    listener(entityId, msg.state, attributes);
  }
}
```

### Reconnection and Backoff

On connection close (any reason), `#scheduleReconnect()` is called. It uses exponential backoff with 20% jitter:

```javascript
#scheduleReconnect(): void {
  const delays = [5000, 10000, 30000, 60000];
  const baseDelay = delays[Math.min(this.#reconnectAttempt, delays.length - 1)];
  const jitter = baseDelay * 0.2 * Math.random();
  const delay = baseDelay + jitter;

  this.#reconnectAttempt++;
  this.#reconnectTimer = setTimeout(() => this.#openConnection(), delay);

  for (const card of this.#cards.values()) {
    card.setErrorState("HRV_STALE");
  }
}
```

On successful `auth_ok`, `#reconnectAttempt` is reset to 0. Auth failures do not trigger reconnection.

### Client-Side Heartbeat

`#resetHeartbeat()` is called on every received message. If no message arrives within `heartbeatTimeoutSeconds` (default 60), the connection is treated as dead:

```javascript
#resetHeartbeat(): void {
  clearTimeout(this.#heartbeatTimer);
  this.#heartbeatTimer = setTimeout(() => {
    console.warn("[HArvest] Heartbeat timeout - reconnecting");
    this.#ws?.close();
  }, HEARTBEAT_TIMEOUT_MS);
}
```

### HMAC Signature

When `#tokenSecret` is set, `#buildHmacSignature()` signs the auth payload using `crypto.subtle`:

```javascript
async #buildHmacSignature(timestamp: number, nonce: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(this.#tokenSecret!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = new TextEncoder().encode(`${this.#tokenId}:${timestamp}:${nonce}`);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
```

### Session Renewal

On receipt of `session_expiring`, the client sends a `renew` message. Before sending, it checks whether `#absoluteExpiresAt` has been reached and whether `#renewalCount` has hit any configured maximum. If either limit is reached, the client performs a full re-auth with the original `token_id` instead of renewing.

If re-auth fails 3 consecutive times (`#reauthAttempts >= 3`), all cards are set to permanent `HRV_AUTH_FAILED` state and no further attempts are made.

---

## 4. HrvCard Custom Element

**File:** `hrv-card.js`

`HrvCard` is the main public-facing custom element. It manages a shadow DOM, delegates rendering to a `BaseCard` subclass, and communicates with the `HarvestClient` singleton.

### Class Definition

```javascript
class HrvCard extends HTMLElement {
  #client: HarvestClient | null = null;
  #renderer: BaseCard | null = null;
  #entityId: string = "";
  #companions: CompanionConfig[] = [];
  #config: CardConfig = {};
  #currentState: "HRV_CONNECTING" | "HRV_OFFLINE" | "HRV_STALE" |
                  "HRV_AUTH_FAILED" | "HRV_ENTITY_MISSING" |
                  "HRV_ENTITY_REMOVED" | "live" = "HRV_CONNECTING";
  #optimisticState: EntityState | null = null;
  #optimisticTimer: ReturnType<typeof setTimeout> | null = null;
  #i18n: I18n;

  connectedCallback(): void {}
  disconnectedCallback(): void {}
  attributeChangedCallback(name: string, oldVal: string, newVal: string): void {}

  receiveDefinition(def: EntityDefinition): void {}
  receiveStateUpdate(state: string, attributes: object, lastUpdated: string): void {}
  receiveHistoryData(points: HistoryPoint[]): void {}
  receiveError(code: string): void {}
  setErrorState(code: string): void {}

  sendCommand(action: string, data: object): void {}

  #resolveConfig(): void {}
  #inheritFromDashboard(): void {}
  #attachRenderer(def: EntityDefinition): void {}
  #applyTheme(theme: ThemeObject | null): void {}
}
```

### Observed Attributes

```javascript
static get observedAttributes(): string[] {
  return [
    "token", "ha-url", "entity", "alias", "companion",
    "on-offline", "on-error", "offline-text", "error-text",
    "tap-action", "hold-action", "double-tap-action",
    "show-history", "hours-to-show", "graph",
    "lang", "a11y", "theme-url", "theme",
  ];
}
```

### connectedCallback

Called when the element is inserted into the DOM.

```javascript
connectedCallback(): void {
  this.#resolveConfig();    // read attributes + inherit from hrv-group
  this.#i18n = new I18n(this.#config.lang ?? "auto");
  this.attachShadow({ mode: "open" });

  // Show connecting skeleton immediately
  this.setErrorState("HRV_CONNECTING");

  // Attempt to restore cached state for offline grace
  const cached = StateCache.read(this.#config.tokenId, this.#entityId);
  if (cached) {
    // Renderer not yet available, store for use once definition arrives
    this.#optimisticState = cached;
  }

  // Register with the client singleton (triggers 50ms debounce if first card)
  this.#client = getOrCreateClient(
    this.#config.haUrl,
    this.#config.tokenId,
    this.#config.tokenSecret ?? null
  );
  this.#client.registerCard(this.#entityId, this);

  // Register companion entities
  for (const companion of this.#companions) {
    this.#client.registerCard(companion.entityId, companion.proxyCard);
  }
}
```

### disconnectedCallback

```javascript
disconnectedCallback(): void {
  this.#client?.unregisterCard(this.#entityId);
  for (const companion of this.#companions) {
    this.#client?.unregisterCard(companion.entityId);
  }
}
```

### Config Resolution and Dashboard Inheritance

`#resolveConfig()` reads HTML attributes first, then checks for a parent `<hrv-group>`, then falls back to `HArvest.config()` page-level defaults. Config is resolved lazily inside `connectedCallback` but the actual `haUrl` and `tokenId` values are only consumed when `HarvestClient` opens the WebSocket connection, by which time `HArvest.config()` is guaranteed to have run.

`entity` takes priority over `alias` when both are present on the same element. This is the intentional semantic: `entity=` means a real HA entity ID, `alias=` means an opaque alias - they are not interchangeable and a card that carries both has a configuration error. A console warning is logged to make the conflict visible during development.

```javascript
#resolveConfig(): void {
  const pageConfig = HArvest.getPageConfig();

  const entityAttr = this.getAttribute("entity") ?? "";
  const aliasAttr  = this.getAttribute("alias") ?? null;

  if (entityAttr && aliasAttr) {
    console.warn(
      "[HArvest] Both entity= and alias= are set on the same hrv-card. " +
      "entity= takes priority. Remove alias= to suppress this warning."
    );
  }

  // entity takes priority; alias is only used when entity is absent
  this.#entityId = entityAttr || "";
  this.#alias    = entityAttr ? null : aliasAttr;

  this.#config = {
    // HTML attribute "token" maps to internal field "tokenId" (standard Web Components
    // convention: kebab/user-facing attribute names map to camelCase internal fields).
    // HArvest.config({ token: "..." }) and <hrv-card token="..."> both use "token"
    // at the public interface; CardConfig uses "tokenId" internally throughout.
    tokenId:     this.getAttribute("token") ?? "",
    haUrl:       this.getAttribute("ha-url") ?? "",
    entity:      entityAttr,
    alias:       this.#alias,
    entityRef:   entityAttr || aliasAttr || "",   // what is sent in protocol messages
    tokenSecret: this.getAttribute("token-secret") ?? null,
    lang:        this.getAttribute("lang") ?? "auto",
    themeUrl:    this.getAttribute("theme-url") ?? null,
    // ... all other attributes
  };
  this.#inheritFromGroup();
  this.#applyPageConfigFallbacks(pageConfig);
}

#inheritFromGroup(): void {
  let ancestor = this.parentElement;
  while (ancestor) {
    if (ancestor.tagName.toLowerCase() === "hrv-group") {
      const group = ancestor as HrvGroup;
      if (!this.#config.tokenId) this.#config.tokenId = group.tokenId;
      if (!this.#config.haUrl)   this.#config.haUrl = group.haUrl;
      if (!this.#config.themeUrl) this.#config.themeUrl = group.themeUrl;
      if (this.#config.lang === "auto") this.#config.lang = group.lang;
      break;
    }
    ancestor = ancestor.parentElement;
  }
}

#applyPageConfigFallbacks(pageConfig: PageConfig): void {
  // Only fill gaps not already set by the card attribute or group inheritance
  if (!this.#config.tokenId && pageConfig.token)   this.#config.tokenId = pageConfig.token;
  if (!this.#config.haUrl && pageConfig.haUrl)     this.#config.haUrl = pageConfig.haUrl;
  if (!this.#config.themeUrl && pageConfig.themeUrl) this.#config.themeUrl = pageConfig.themeUrl;
  if (this.#config.lang === "auto" && pageConfig.lang) this.#config.lang = pageConfig.lang;
}
```

The resolution order is explicit: card attribute -> group attribute -> `HArvest.config()`. A missing `haUrl` or `tokenId` after all three levels are checked causes the card to render a configuration error state.

**Companion entity references** in the `companion` attribute follow the same entity/alias convention as the card's primary attribute. When `entity=` is set, companion values are real entity IDs. When `alias=` is set, companion values are aliases. The server resolves both using the same lookup. `CompanionConfig` stores the raw reference string and passes it to the server in the auth message as-is.

### Receiving a Definition

When the `HarvestClient` receives an `entity_definition` for this card's entity ID:

```javascript
receiveDefinition(def: EntityDefinition): void {
  const RendererClass = lookupRenderer(def.domain, def.device_class);
  this.#renderer = new RendererClass(def, this.shadowRoot!, this.#config, this.#i18n);
  this.#renderer.render();

  // Apply theme
  const theme = ThemeLoader.resolve(this.#config);
  if (theme) this.#applyTheme(theme);

  // Apply cached state if available
  if (this.#optimisticState) {
    this.#renderer.applyState(
      this.#optimisticState.state,
      this.#optimisticState.attributes
    );
    this.setErrorState("HRV_STALE"); // show stale indicator
    this.#optimisticState = null;
  }
}
```

### Receiving a State Update

```javascript
receiveStateUpdate(state: string, attributes: object, lastUpdated: string): void {
  // Cancel any pending optimistic revert
  if (this.#optimisticTimer) {
    clearTimeout(this.#optimisticTimer);
    this.#optimisticTimer = null;
  }

  if (this.#renderer) {
    requestAnimationFrame(() => {
      this.#renderer!.applyState(state, attributes);
    });
  }

  // Clear stale/offline indicator once live data arrives
  if (this.#currentState !== "live") {
    this.setErrorState("live");
  }
}
```

### Optimistic UI

```javascript
sendCommand(action: string, data: object): void {
  const msgId = this.#client!.nextMsgId();

  // Apply optimistic state immediately if renderer can predict it
  const predicted = this.#renderer?.predictState(action, data);
  if (predicted) {
    requestAnimationFrame(() => {
      this.#renderer!.applyState(predicted.state, predicted.attributes);
    });

    // Revert after 5 seconds if no ack arrives
    this.#optimisticTimer = setTimeout(() => {
      const cached = StateCache.read(this.#config.tokenId, this.#entityId);
      if (cached && this.#renderer) {
        this.#renderer.applyState(cached.state, cached.attributes);
      }
      this.#optimisticTimer = null;
    }, 5000);
  }

  this.#client!.sendCommand(this.#entityId, action, data, msgId);
}
```

The `predictState()` method is implemented on each renderer to predict the visual result of a command. For a light toggle it returns `{ state: "off" }` if current state is `"on"`, and vice versa. For an unknown action it returns `null` and no optimistic update is applied.

---

## 5. HrvGroup Custom Element

**File:** `hrv-group.js`

`HrvGroup` is a simple context provider. It has no shadow DOM and renders no UI of its own. It stores inherited values that child `HrvCard` elements read during their `connectedCallback`.

```javascript
class HrvGroup extends HTMLElement {
  get tokenId(): string { return this.getAttribute("token") ?? ""; }
  get haUrl(): string   { return this.getAttribute("ha-url") ?? ""; }
  get themeUrl(): string | null { return this.getAttribute("theme-url"); }
  get lang(): string    { return this.getAttribute("lang") ?? "auto"; }

  static get observedAttributes(): string[] {
    return ["token", "ha-url", "theme-url", "lang"];
  }
}

customElements.define("hrv-group", HrvGroup);
```

`HrvGroup` does not proactively push values to children. Children pull from it during their own `connectedCallback`. This is intentional - it avoids any need for the group to track or notify children, keeping the implementation simple.

If group attributes change after children have mounted (rare but possible), affected children are not automatically updated. This is an acceptable limitation for v1.

---

## 6. HrvMount Observer

**File:** `hrv-mount.js`

This module handles the data-attribute mount mode. It runs on `DOMContentLoaded` and also starts a `MutationObserver` to catch elements added after parse time.

```javascript
function initMounts(): void {
  // Handle elements already in the DOM
  document.querySelectorAll<HTMLElement>(".hrv-mount, .hrv-group")
    .forEach(mountElement);

  // Watch for elements added dynamically
  new MutationObserver((mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(".hrv-mount, .hrv-group")) {
          mountElement(node);
        }
        // Check descendants too (e.g. a container div added at once)
        node.querySelectorAll<HTMLElement>(".hrv-mount, .hrv-group")
          .forEach(mountElement);
      }
      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(".hrv-mount")) {
          unmountElement(node);
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function mountElement(el: HTMLElement): void {
  if (el.dataset.harvMounted === "true") return; // idempotent
  el.dataset.harvMounted = "true";

  if (el.classList.contains("hrv-group")) {
    mountDashboard(el);
  } else {
    mountCard(el);
  }
}

function mountCard(el: HTMLElement): void {
  const card = document.createElement("hrv-card") as HrvCard;

  // Transfer data attributes to hrv-card attributes.
  // entity takes priority over alias when both are present.
  if (el.dataset.entity && el.dataset.alias) {
    console.warn(
      "[HArvest] Both data-entity and data-alias are set on the same hrv-mount. " +
      "data-entity takes priority. Remove data-alias to suppress this warning."
    );
  }

  if (el.dataset.token)       card.setAttribute("token", el.dataset.token);
  if (el.dataset.haUrl)       card.setAttribute("ha-url", el.dataset.haUrl);
  if (el.dataset.entity)      card.setAttribute("entity", el.dataset.entity);
  else if (el.dataset.alias)  card.setAttribute("alias", el.dataset.alias);
  if (el.dataset.companion)   card.setAttribute("companion", el.dataset.companion);
  if (el.dataset.themeUrl)    card.setAttribute("theme-url", el.dataset.themeUrl);
  if (el.dataset.lang)        card.setAttribute("lang", el.dataset.lang);
  if (el.dataset.onOffline)   card.setAttribute("on-offline", el.dataset.onOffline);
  if (el.dataset.onError)     card.setAttribute("on-error", el.dataset.onError);
  if (el.dataset.offlineText) card.setAttribute("offline-text", el.dataset.offlineText);
  if (el.dataset.errorText)   card.setAttribute("error-text", el.dataset.errorText);
  if (el.dataset.showHistory) card.setAttribute("show-history", el.dataset.showHistory);
  if (el.dataset.hoursToShow) card.setAttribute("hours-to-show", el.dataset.hoursToShow);
  if (el.dataset.graph)       card.setAttribute("graph", el.dataset.graph);

  el.appendChild(card);
}

function unmountElement(el: HTMLElement): void {
  const card = el.querySelector("hrv-card");
  if (card) card.remove();
  delete el.dataset.harvMounted;
}

// Guard against document.body being null (script loaded in <head> before body)
if (document.body) {
  initMounts();
} else {
  document.addEventListener("DOMContentLoaded", initMounts);
}
```

---

## 7. Renderer System

**File:** `renderers/index.js`, `renderers/base-card.js`, individual renderer files

### BaseCard Abstract Class

All renderers extend `BaseCard`. It provides shared helpers for shadow DOM construction, icon rendering, ARIA labelling, and state application.

```javascript
abstract class BaseCard {
  protected def: EntityDefinition;
  protected root: ShadowRoot;
  protected config: CardConfig;
  protected i18n: I18n;

  constructor(
    def: EntityDefinition,
    root: ShadowRoot,
    config: CardConfig,
    i18n: I18n
  ) {
    this.def = def;
    this.root = root;
    this.config = config;
    this.i18n = i18n;
  }

  abstract render(): void;
  abstract applyState(state: string, attributes: object): void;

  // Optional: return predicted state for optimistic UI. Return null to skip.
  predictState(action: string, data: object): EntityState | null {
    return null;
  }

  // Shared helpers
  protected renderIcon(iconName: string, partName: string): SVGElement {}
  protected setAriaLabel(el: HTMLElement, label: string): void {}
  protected renderCompanions(): void {}
  protected renderHistoryGraph(points: HistoryPoint[]): void {}
  protected debounce(fn: Function, ms: number): Function {}
  protected getSharedStyles(): string {}  // returns the common CSS custom property block
}
```

`getSharedStyles()` returns a CSS string including all `--hrv-*` variable declarations with fallback values, the `prefers-reduced-motion` override block, and the stale indicator styles. Every renderer includes this in its shadow DOM `<style>` tag.

### Renderer Lookup

```javascript
const rendererRegistry: Map<string, typeof BaseCard> = new Map([
  ["light",                    LightCard],
  ["switch",                   SwitchCard],
  ["fan",                      FanCard],
  ["climate",                  ClimateCard],
  ["cover",                    CoverCard],
  ["media_player",             MediaPlayerCard],
  ["remote",                   RemoteCard],
  ["sensor.temperature",       TemperatureSensorCard],
  ["sensor.humidity",          HumiditySensorCard],
  ["sensor.battery",           BatterySensorCard],
  ["sensor.binary",            BinarySensorCard],
  ["sensor",                   GenericSensorCard],
  ["input_boolean",            InputBooleanCard],
  ["input_number",             InputNumberCard],
  ["input_select",             InputSelectCard],
  ["harvest_action",           HarvestActionCard],
  ["generic",                  GenericCard],
]);

function lookupRenderer(domain: string, deviceClass: string | null): typeof BaseCard {
  const specificKey = deviceClass ? `${domain}.${deviceClass}` : null;
  return (
    (specificKey && rendererRegistry.get(specificKey)) ||
    rendererRegistry.get(domain) ||
    rendererRegistry.get("generic")!
  );
}

function registerRenderer(key: string, rendererClass: typeof BaseCard): void {
  // Last-write-wins. If a key is registered more than once, the most recent
  // call takes effect. A console warning is logged on collision so developers
  // are aware their renderer is overriding a built-in or a previously registered one.
  if (rendererRegistry.has(key)) {
    console.warn(`[HArvest] registerRenderer: overriding existing renderer for key "${key}"`);
  }
  rendererRegistry.set(key, rendererClass);
}
```

### Example: LightCard

```javascript
class LightCard extends BaseCard {
  #toggleBtn: HTMLButtonElement | null = null;
  #brightnessSlider: HTMLInputElement | null = null;
  #colorTempSlider: HTMLInputElement | null = null;
  #nameEl: HTMLElement | null = null;
  #iconEl: SVGElement | null = null;
  #brightnessDebounce: Function;
  #colorTempDebounce: Function;

  constructor(def: EntityDefinition, root: ShadowRoot, config: CardConfig, i18n: I18n) {
    super(def, root, config, i18n);
    this.#brightnessDebounce = this.debounce(this.#sendBrightness.bind(this), 300);
    this.#colorTempDebounce = this.debounce(this.#sendColorTemp.bind(this), 300);
  }

  render(): void {
    const isWritable = this.def.capabilities === "read-write";
    const hasBrightness = this.def.supported_features.includes("brightness");
    const hasColorTemp = this.def.supported_features.includes("color_temp");

    this.root.innerHTML = `
      <style>${this.getSharedStyles()}${LIGHT_CARD_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon"></span>
          <span part="card-name">${this.def.friendly_name}</span>
        </div>
        <div part="card-body">
          ${isWritable ? `<button part="toggle-button" type="button"></button>` : ""}
          <span part="state-label"></span>
          ${isWritable && hasBrightness
            ? `<input part="brightness-slider" type="range" min="0" max="255">`
            : ""}
          ${isWritable && hasColorTemp
            ? `<input part="color-temp-slider" type="range"
                min="${this.def.feature_config.min_color_temp}"
                max="${this.def.feature_config.max_color_temp}">`
            : ""}
        </div>
        ${this.renderCompanionZoneHTML()}
      </div>
      <div part="stale-indicator" aria-hidden="true"></div>
    `;

    this.#toggleBtn     = this.root.querySelector("[part=toggle-button]");
    this.#brightnessSlider = this.root.querySelector("[part=brightness-slider]");
    this.#colorTempSlider  = this.root.querySelector("[part=color-temp-slider]");
    this.#nameEl        = this.root.querySelector("[part=card-name]");
    this.#iconEl        = this.root.querySelector("[part=card-icon]");

    if (this.#iconEl) {
      this.renderIcon(this.def.icon ?? "mdi:lightbulb", "card-icon");
    }

    if (this.#toggleBtn) {
      this.#toggleBtn.addEventListener("click", () => {
        this.config.card?.sendCommand("toggle", {});
      });
    }

    if (this.#brightnessSlider) {
      this.#brightnessSlider.addEventListener("input", (e) => {
        this.#brightnessDebounce(parseInt((e.target as HTMLInputElement).value));
      });
    }

    if (this.#colorTempSlider) {
      this.#colorTempSlider.addEventListener("input", (e) => {
        this.#colorTempDebounce(parseInt((e.target as HTMLInputElement).value));
      });
    }

    this.renderCompanions();
  }

  applyState(state: string, attributes: object): void {
    const isOn = state === "on";
    const attrs = attributes as LightAttributes;

    if (this.#toggleBtn) {
      this.#toggleBtn.textContent = this.i18n.t(isOn ? "state.on" : "state.off");
      this.#toggleBtn.setAttribute("aria-pressed", String(isOn));
      this.#toggleBtn.setAttribute(
        "aria-label",
        `${this.def.friendly_name} - ${this.i18n.t("action.toggle")}, ` +
        `${this.i18n.t("action.currently")} ${this.i18n.t(isOn ? "state.on" : "state.off")}`
      );
    }

    if (this.#brightnessSlider && attrs.brightness !== undefined) {
      this.#brightnessSlider.value = String(attrs.brightness);
    }

    if (this.#colorTempSlider && attrs.color_temp !== undefined) {
      this.#colorTempSlider.value = String(attrs.color_temp);
    }

    // Update icon based on state
    const iconName = this.def.icon_state_map?.[state] ?? this.def.icon ?? "mdi:lightbulb";
    this.renderIcon(iconName, "card-icon");

    // CSS animation: fan spin speed (if applicable to domain-specific subclass)
    // For lights: no animation, static icon only
  }

  predictState(action: string, data: object): EntityState | null {
    if (action === "toggle") {
      const current = this.root.querySelector("[part=toggle-button]")
        ?.getAttribute("aria-pressed");
      return { state: current === "true" ? "off" : "on", attributes: {} };
    }
    return null;
  }

  #sendBrightness(value: number): void {
    this.config.card?.sendCommand("turn_on", { brightness: value });
  }

  #sendColorTemp(value: number): void {
    this.config.card?.sendCommand("turn_on", { color_temp: value });
  }
}
```

### Companion Rendering

`BaseCard.renderCompanions()` is called at the end of every renderer's `render()` method. It iterates `config.companions`, fetches their `entity_definition` from the client, and renders each as a compact icon + state button inside `[part=companion-zone]`.

Companions use a reduced version of the entity's renderer - only the icon, state text, and tap action. They share the parent card's shadow DOM rather than having their own.

Companions with `"read"` capability never attempt a service call regardless of domain. A `binary_sensor` companion is always read-only because `binary_sensor` has no entries in `ALLOWED_SERVICES` - this is correct, not an oversight. The companion renders the icon and state only, with no tap interaction. The absence of `binary_sensor` from `ALLOWED_SERVICES` is therefore not a bug for companions; it simply means the companion renders as display-only.

---

## 8. State Cache

**File:** `state-cache.js`

```javascript
class StateCache {
  static #keyFor(tokenId: string, entityId: string): string {
    // Synchronous SHA-256 is not available in crypto.subtle (async only).
    // Use a fast deterministic hash for cache keys instead.
    // This is privacy-by-obscurity, not cryptographic security.
    const raw = `${tokenId}|${entityId}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return `hrv_${Math.abs(hash).toString(16).padStart(8, "0")}`;
  }

  static write(tokenId: string, entityId: string, state: string, attributes: object): void {
    try {
      const key = this.#keyFor(tokenId, entityId);
      localStorage.setItem(key, JSON.stringify({
        entity_id: entityId,
        state,
        attributes,
        cached_at: new Date().toISOString(),
      }));
    } catch {
      // Catches all localStorage failures: SecurityError (Safari private browsing throws
      // DOMException rather than returning null), QuotaExceededError (storage full),
      // and any other access denial. Silently ignored - the cache is best-effort only.
    }
  }

  static read(tokenId: string, entityId: string): CachedState | null {
    try {
      const key = this.#keyFor(tokenId, entityId);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      // Catches SecurityError, QuotaExceededError, and JSON.parse failures.
      // Returns null so the caller renders a loading state instead of crashing.
      return null;
    }
  }
}
```

Note: the spec calls for SHA-256 hashing via `crypto.subtle`, but `crypto.subtle` is asynchronous and cannot be used in `connectedCallback` synchronously. A fast deterministic integer hash is used instead for the cache key. This provides privacy-by-obscurity (the token ID and entity ID are not directly visible in localStorage) without cryptographic guarantees. This is sufficient for the use case since the cache key is not a security boundary.

**Multi-tab behaviour:** `localStorage` is shared across all tabs on the same origin. If a visitor has the same page open in multiple tabs, each tab has its own `HarvestClient` and WebSocket connection, but they all read and write the same cache keys. The last `state_update` received across all tabs wins. This is acceptable - all tabs are connected to the same live HA instance and receiving the same state updates. There is no meaningful race condition since the state is authoritative server-side. A tab that loses a write race simply gets a slightly stale value that will be overwritten on the next state push.

---

## 9. Theme Loader

**File:** `theme-loader.js`

```javascript
class ThemeLoader {
  static #cache: Map<string, ThemeObject> = new Map();

  static async resolve(config: CardConfig): Promise<ThemeObject | null> {
    if (config.theme) return config.theme;
    if (config.themeUrl) return this.fetch(config.themeUrl);
    return null;
  }

  static async fetch(url: string): Promise<ThemeObject | null> {
    if (this.#cache.has(url)) return this.#cache.get(url)!;
    try {
      const res = await globalThis.fetch(url);
      const json: ThemeObject = await res.json();
      this.#cache.set(url, json);
      return json;
    } catch {
      console.warn("[HArvest] Failed to load theme from", url);
      return null;
    }
  }

  static apply(theme: ThemeObject, shadowRoot: ShadowRoot): void {
    const host = shadowRoot.host as HTMLElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const vars = prefersDark && theme.dark_variables
      ? { ...theme.variables, ...theme.dark_variables }
      : theme.variables;

    for (const [key, value] of Object.entries(vars)) {
      host.style.setProperty(key, value);
    }
  }
}
```

The theme is fetched once per URL and cached in memory for the page session. Multiple cards with the same `theme-url` share one fetch. The `dark_variables` object, if present, is merged over `variables` when `prefers-color-scheme: dark` is active.

---

## 10. Internationalisation

**File:** `i18n.js`

```javascript
class I18n {
  #strings: Record<string, string>;

  constructor(lang: string) {
    const resolved = lang === "auto"
      ? navigator.language.split("-")[0]
      : lang;
    this.#strings = STRINGS[resolved] ?? STRINGS["en"];
  }

  t(key: string): string {
    return this.#strings[key] ?? STRINGS["en"][key] ?? key;
  }
}

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    "state.on": "On",
    "state.off": "Off",
    "state.unavailable": "Unavailable",
    "state.unknown": "Unknown",
    "state.open": "Open",
    "state.closed": "Closed",
    "state.idle": "Idle",
    "state.heating": "Heating",
    "state.cooling": "Cooling",
    "state.playing": "Playing",
    "state.paused": "Paused",
    "action.toggle": "toggle",
    "action.currently": "currently",
    "error.auth_failed": "Widget unavailable",
    "error.entity_missing": "Device unavailable",
    "error.offline": "Temporarily offline",
    "error.connecting": "Connecting...",
    "indicator.stale": "Last known state",
    "history.unavailable": "No history available",
  },
  th: {
    "state.on": "เปิด",
    "state.off": "ปิด",
    // ... etc
  },
  // de, fr, es, pt, ja, zh ...
};
```

The `I18n` instance is created once per `HrvCard` and passed to the renderer. Fallback chain: requested language -> English -> raw key string.

---

## 11. Error States

**File:** `error-states.js`

```javascript
function applyErrorState(
  card: HrvCard,
  shadowRoot: ShadowRoot,
  code: string,
  config: CardConfig,
  i18n: I18n
): void {
  // Update data attribute for CSS targeting
  card.setAttribute("data-harvest-state", code);

  // Determine visual treatment
  const onOffline = config.onOffline ?? "last-state";
  const onError   = config.onError ?? "message";

  const isOfflineState = ["HRV_OFFLINE", "HRV_STALE", "HRV_CONNECTING"].includes(code);
  const isAuthError = ["HRV_AUTH_FAILED", "HRV_ENTITY_MISSING",
                       "HRV_ENTITY_REMOVED"].includes(code);

  if (code === "live") {
    // Remove all error overlays
    shadowRoot.querySelector(".hrv-error-overlay")?.remove();
    shadowRoot.querySelector("[part=stale-indicator]")
      ?.setAttribute("style", "display:none");
    return;
  }

  if (code === "HRV_CONNECTING") {
    // Skeleton pulse - renderer not yet mounted, show placeholder
    applySkeletonState(shadowRoot, i18n);
    return;
  }

  if (code === "HRV_STALE") {
    // Show stale indicator over existing card content
    const indicator = shadowRoot.querySelector("[part=stale-indicator]");
    if (indicator) indicator.removeAttribute("style");
    return;
  }

  const treatment = isOfflineState ? onOffline : onError;

  if (treatment === "hide") {
    card.style.display = "none";
  } else if (treatment === "dim") {
    card.style.opacity = "0.4";
  } else {
    // "message" or "last-state" with message overlay
    const visitorMessage = isAuthError
      ? i18n.t("error.auth_failed")
      : i18n.t("error.offline");
    applyMessageOverlay(shadowRoot, config.errorText ?? visitorMessage);
  }
}
```

---

## 12. Icons

**File:** `icons.js`

Icons are stored as a plain object mapping MDI icon names to SVG string content. Only the inner SVG path data is stored, not the full `<svg>` wrapper. The wrapper is generated at render time with the correct size and part attribute.

```javascript
const MDI_ICONS: Record<string, string> = {
  "mdi:lightbulb":
    "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1...",
  "mdi:lightbulb-outline":
    "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1...",
  "mdi:fan":
    "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12...",
  "mdi:fan-off":
    "M3.28,4L2,5.27L6.22,9.5C5.46,10.55 5,11.72 5,13C5,...",
  "mdi:thermometer": "...",
  "mdi:help-circle": "...",   // fallback for unknown icons
  // ... all Tier 1 entity icons, on/off/unavailable variants
};

function renderIconSVG(name: string, partName: string): string {
  const path = MDI_ICONS[name] ?? MDI_ICONS["mdi:help-circle"];
  return `<svg part="${partName}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true" focusable="false">
    <path d="${path}" fill="currentColor"/>
  </svg>`;
}
```

`aria-hidden="true"` and `focusable="false"` on all icons prevents screen readers from announcing the SVG and prevents IE11 from making SVGs keyboard focusable. All semantic meaning is carried by the surrounding element's `aria-label`.

---

## 13. Build Output

The build process (Rollup or esbuild) bundles all source files into two output files:

```
dist/harvest.min.js          stable alias, always latest build
dist/harvest.min.{hash}.js   content-addressed, changes only when content changes
```

Both files are committed to the repository. jsDelivr serves them directly from GitHub. The content-hash file ensures cache-busting without requiring URL changes in existing deployments.

The build process:

1. Concatenates all source files in dependency order
2. Tree-shakes unused renderer code (only renderers actually imported by `index.js` are included)
3. Minifies
4. Generates the content hash
5. Writes both output files
6. Updates `dist/harvest.min.js` to point to the new hash file

No transpilation targets below ES2020 are required. The browser support target is any browser that supports Custom Elements v1 and Shadow DOM, which covers all browsers released after 2018.

### Type Definitions

Key shared types used throughout:

```typescript
interface EntityDefinition {
  type: "entity_definition";
  entity_id: string;
  domain: string;
  device_class: string | null;
  friendly_name: string;
  capabilities: "read" | "read-write";
  supported_features: string[];
  feature_config: Record<string, unknown>;
  icon: string;
  icon_state_map: Record<string, string>;
  support_tier: 1 | 2;
  renderer: string;
  unit_of_measurement: string | null;
  msg_id: null;
}

interface StateUpdateMessage {
  type: "state_update";
  entity_id: string;
  state: string;
  attributes?: Record<string, unknown>;
  attributes_delta?: {
    changed: Record<string, unknown>;
    removed: string[];
  };
  extended_attributes?: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  initial: boolean;
  msg_id: null;
}

interface EntityState {
  state: string;
  attributes: Record<string, unknown>;
  lastUpdated: Date;
}

interface CachedState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  cached_at: string;
}

interface PageConfig {
  haUrl?: string;
  token?: string;
  themeUrl?: string;
  lang?: string;
}

interface CardConfig {
  tokenId: string;
  haUrl: string;
  tokenSecret: string | null;
  entity: string;           // real entity ID (from entity= attribute); empty string if not set
  alias: string | null;     // opaque alias (from alias= attribute); null when entity= is set or neither is set
  entityRef: string;        // resolved entity reference sent in protocol messages: entity if set, otherwise alias
  lang: string;
  themeUrl: string | null;
  theme: ThemeObject | null;
  onOffline: "dim" | "hide" | "message" | "last-state";
  onError: "dim" | "hide" | "message";
  offlineText: string;
  errorText: string;
  tapAction: ActionConfig;
  holdAction: ActionConfig | null;
  doubleTapAction: ActionConfig | null;
  showHistory: boolean;
  hoursToShow: number;
  graph: "line" | "bar";
  a11y: "standard" | "enhanced";
  companions: CompanionConfig[];
  card?: HrvCard;  // back-reference set after construction
}

interface ThemeObject {
  name: string;
  author?: string;
  version?: string;
  harvest_version: number;
  variables: Record<string, string>;
  dark_variables?: Record<string, string>;
}

interface HistoryPoint {
  t: string;  // ISO 8601 timestamp
  s: string;  // state value
}

interface CompanionConfig {
  entityId: string;
  proxyCard: HrvCard;  // minimal HrvCard used only for data routing
}

interface ActionConfig {
  action: string;
  data?: Record<string, unknown>;
}
```
