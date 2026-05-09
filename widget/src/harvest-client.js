/**
 * harvest-client.js - HarvestClient singleton and WebSocket management.
 *
 * HarvestClient manages a single authenticated WebSocket connection for a
 * given (haUrl, tokenId) pair. All HrvCard elements sharing the same haUrl
 * and tokenId share one instance. Cards with different tokens get separate
 * clients even when the haUrl is the same.
 *
 * Public exports:
 *   getOrCreateClient(haUrl, tokenId, tokenSecret) -> HarvestClient
 *   destroyClient(haUrl, tokenId)
 */

// Reconnect delay sequence in milliseconds.
const RECONNECT_DELAYS = [5000, 10000, 30000, 60000];

// Heartbeat timeout: if no message arrives in this window, reconnect.
const HEARTBEAT_TIMEOUT_MS = 60_000;

// Auth debounce: wait this long after the first card mounts before opening WS.
const AUTH_DEBOUNCE_MS = 50;

// Maximum consecutive re-auth failures before entering permanent HRV_AUTH_FAILED.
const MAX_REAUTH_ATTEMPTS = 3;

// Grace period before showing "Last known state" after disconnect.
// During this window the cached state is displayed normally.
const STALE_GRACE_MS = 30_000;

// Set by beforeunload so WS close during page teardown skips stale UI flash.
// Reset by pageshow in case the user cancels navigation (e.g. "Leave site?" dialog).
let _pageUnloading = false;
window.addEventListener("beforeunload", () => { _pageUnloading = true; });
window.addEventListener("pageshow", () => { _pageUnloading = false; });

// ---------------------------------------------------------------------------
// Singleton registry
// ---------------------------------------------------------------------------

/** @type {Map<string, HarvestClient>} */
const _clients = new Map();

/**
 * Return the existing HarvestClient for (haUrl, tokenId), creating one if
 * none exists. tokenSecret is only used when creating a new instance; it is
 * ignored on subsequent lookups.
 *
 * @param {string} haUrl
 * @param {string} tokenId
 * @param {string|null} tokenSecret
 * @returns {HarvestClient}
 */
export function getOrCreateClient(haUrl, tokenId, tokenSecret) {
  const key = `${haUrl}|${tokenId}`;
  if (!_clients.has(key)) {
    _clients.set(key, new HarvestClient(haUrl, tokenId, tokenSecret));
  }
  return _clients.get(key);
}

export function getClient(haUrl, tokenId) {
  return _clients.get(`${haUrl}|${tokenId}`) ?? null;
}

/**
 * Destroy and remove the client for (haUrl, tokenId) from the registry.
 * After this call the client's WebSocket is closed and the instance is gone.
 *
 * @param {string} haUrl
 * @param {string} tokenId
 */
export function destroyClient(haUrl, tokenId) {
  const key = `${haUrl}|${tokenId}`;
  const client = _clients.get(key);
  if (client) {
    client.destroy();
    _clients.delete(key);
  }
}

// ---------------------------------------------------------------------------
// HarvestClient
// ---------------------------------------------------------------------------

/**
 * Manages a single authenticated WebSocket connection to the HArvest
 * integration for a specific (haUrl, tokenId) combination.
 */
export class HarvestClient {
  /** @type {string} */ #haUrl;
  /** @type {string} */ #tokenId;
  /** @type {string|null} */ #tokenSecret;

  /** @type {WebSocket|null} */ #ws = null;
  /** @type {string|null} */ #sessionId = null;
  /** @type {number} */ #msgIdCounter = 0;

  // entityId -> HrvCard (last-write-wins)
  /** @type {Map<string, object>} */ #cards = new Map();

  // entity IDs collected during the 50ms debounce window
  /** @type {Set<string>} */ #pendingEntityIds = new Set();

  /** @type {ReturnType<typeof setTimeout>|null} */ #authDebounceTimer = null;
  /** @type {ReturnType<typeof setTimeout>|null} */ #reconnectTimer = null;
  /** @type {ReturnType<typeof setTimeout>|null} */ #heartbeatTimer = null;
  /** @type {ReturnType<typeof setTimeout>|null} */ #staleGraceTimer = null;

  /** @type {number} */ #reconnectAttempt = 0;
  /** @type {number} */ #reauthAttempts = 0;

  /** @type {Date|null} */ #absoluteExpiresAt = null;
  /** @type {number} */ #renewalCount = 0;
  // max renewals from the last auth_ok (null = unlimited)
  /** @type {number|null} */ #maxRenewals = null;

  // last_updated timestamps per entity for out-of-order discard
  /** @type {Map<string, {state: string, attributes: object, lastUpdated: Date, lastUpdatedRaw: string}>} */ #entityStates = new Map();

  // Flood protection: track malformed message timestamps
  /** @type {number[]} */ #malformedTimestamps = [];
  static #FLOOD_LIMIT = 10;
  static #FLOOD_WINDOW_MS = 5000;

  /** @type {Array<(entityId: string, state: string, attrs: object) => void>} */
  #stateListeners = [];

  // Permanent shutdown flag - set after MAX_REAUTH_ATTEMPTS failures
  /** @type {boolean} */ #permanentFailure = false;

  /** @type {string|null} */ #activePack = null;
  // Resolves when the in-flight pack script finishes loading. null when idle.
  /** @type {Promise<void>|null} */ #packLoadPromise = null;

  // Buffered messages for entities not yet registered (companion race condition).
  /** @type {Map<string, object>} */ #pendingDefinitions = new Map();
  /** @type {Map<string, object>} */ #pendingStateUpdates = new Map();

  /**
   * @param {string} haUrl   - Base URL of the HA instance (e.g. https://ha.example.com)
   * @param {string} tokenId - HArvest token ID (hwt_...)
   * @param {string|null} tokenSecret - HMAC secret, or null for unsigned auth
   */
  constructor(haUrl, tokenId, tokenSecret) {
    this.#haUrl = haUrl.replace(/\/$/, ""); // strip trailing slash
    this.#tokenId = tokenId;
    this.#tokenSecret = tokenSecret ?? null;
    this.#visibilityHandler = () => this.#onVisibilityChange();
    document.addEventListener("visibilitychange", this.#visibilityHandler);
  }

  /** @type {() => void} */ #visibilityHandler;

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Register an HrvCard for an entity ID. Starts the 50ms auth debounce if
   * this is the first card and the connection has not been opened yet. If the
   * connection is already open, sends a subscribe message immediately.
   *
   * @param {string} entityId
   * @param {object} card - HrvCard instance
   */
  registerCard(entityId, card) {
    this.#cards.set(entityId, card);

    if (this.#ws !== null && this.#ws.readyState === WebSocket.OPEN && this.#sessionId) {
      // Connection already open: subscribe the new entity immediately.
      this.#sendJson({
        type: "subscribe",
        session_id: this.#sessionId,
        entity_ids: [entityId],
        msg_id: this.#nextMsgId(),
      });
    } else {
      // Queue for the initial auth message.
      this.#pendingEntityIds.add(entityId);

      if (this.#ws === null && this.#authDebounceTimer === null && !this.#permanentFailure) {
        this.#authDebounceTimer = setTimeout(() => {
          this.#authDebounceTimer = null;
          this.#openConnection();
        }, AUTH_DEBOUNCE_MS);
      }
    }
  }

  /**
   * Register a card passively (no subscribe message sent). Used for
   * server-auto-subscribed companions. Replays any buffered definition
   * and state_update that arrived before the card was registered.
   *
   * @param {string} entityId
   * @param {object} card
   */
  registerCardPassive(entityId, card) {
    this.#cards.set(entityId, card);
    const bufferedDef = this.#pendingDefinitions.get(entityId);
    if (bufferedDef) {
      this.#pendingDefinitions.delete(entityId);
      card.receiveDefinition?.(bufferedDef);
    }
    const bufferedState = this.#pendingStateUpdates.get(entityId);
    if (bufferedState) {
      this.#pendingStateUpdates.delete(entityId);
      const attrs = bufferedState.attributes ?? {};
      card.receiveStateUpdate?.(bufferedState.state, attrs, bufferedState.last_updated);
    }
  }

  /**
   * Unregister an HrvCard. Sends an unsubscribe message if connected.
   * No server response is expected.
   *
   * @param {string} entityId
   */
  unregisterCard(entityId) {
    this.#cards.delete(entityId);
    this.#pendingEntityIds.delete(entityId);
    this.#entityStates.delete(entityId);

    if (this.#ws !== null && this.#ws.readyState === WebSocket.OPEN && this.#sessionId) {
      this.#sendJson({
        type: "unsubscribe",
        session_id: this.#sessionId,
        entity_ids: [entityId],
        msg_id: this.#nextMsgId(),
      });
      // No response expected - fire and forget.
    }
  }

  /**
   * Send a command message to the integration.
   *
   * @param {string} entityId
   * @param {string} action
   * @param {object} data
   * @param {number} msgId
   */
  sendCommand(entityId, action, data, msgId) {
    if (!this.#sessionId || !this.#ws || this.#ws.readyState !== WebSocket.OPEN) {
      console.warn(
        "[HArvest] sendCommand blocked:",
        !this.#sessionId ? "no sessionId" : "",
        !this.#ws ? "no ws" : "",
        this.#ws && this.#ws.readyState !== WebSocket.OPEN ? `ws state=${this.#ws.readyState}` : "",
        "permanent=" + this.#permanentFailure,
      );
      return;
    }
    this.#sendJson({
      type: "command",
      session_id: this.#sessionId,
      entity_id: entityId,
      action,
      data: data ?? {},
      msg_id: msgId,
    });
  }

  /**
   * Request history data for an entity from the server.
   *
   * @param {string} entityId
   * @param {{ hours?: number, period?: number }} [options]
   */
  requestHistory(entityId, { hours, period } = {}) {
    if (!this.#sessionId || !this.#ws || this.#ws.readyState !== WebSocket.OPEN) return;
    const msg = {
      type: "history_request",
      session_id: this.#sessionId,
      entity_id: entityId,
      msg_id: this.#nextMsgId(),
    };
    if (hours != null) msg.hours = hours;
    if (period != null) msg.period = period;
    this.#sendJson(msg);
  }

  /**
   * Return a new monotonically increasing message ID.
   * @returns {number}
   */
  nextMsgId() {
    return this.#nextMsgId();
  }

  /**
   * Register a listener that is called on every state update for any entity.
   *
   * @param {(entityId: string, state: string, attrs: object) => void} callback
   */
  onAnyState(callback) {
    this.#stateListeners.push(callback);
  }

  /**
   * Return the HrvCard registered for the given entity ID, or null.
   * Used by HArvest.getCard() in the build entry point.
   *
   * @param {string} entityId
   * @returns {object|null}
   */
  _getCard(entityId) {
    return this.#cards.get(entityId) ?? null;
  }

  _getPackRenderer(domain, deviceClass) {
    if (!this.#activePack) return null;
    const pack = window.HArvest?._packs?.[this.#activePack];
    if (!pack) return null;
    const specificKey = deviceClass ? `${domain}.${deviceClass}` : null;
    return (specificKey && pack[specificKey]) || pack[domain] || null;
  }

  /**
   * Permanently close the connection and clear all timers.
   */
  destroy() {
    this.#permanentFailure = true;
    clearTimeout(this.#authDebounceTimer);
    clearTimeout(this.#reconnectTimer);
    clearTimeout(this.#heartbeatTimer);
    clearTimeout(this.#staleGraceTimer);
    this.#authDebounceTimer = null;
    this.#reconnectTimer = null;
    this.#heartbeatTimer = null;
    this.#staleGraceTimer = null;
    document.removeEventListener("visibilitychange", this.#visibilityHandler);
    if (this.#ws) {
      this.#ws.onclose = null; // suppress reconnect on deliberate destroy
      this.#ws.close();
      this.#ws = null;
    }
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** @returns {number} */
  #nextMsgId() {
    return ++this.#msgIdCounter;
  }

  /**
   * Open the WebSocket connection. Called after the auth debounce fires or
   * when a reconnect timer fires.
   */
  #openConnection() {
    if (this.#permanentFailure) return;

    const wsUrl = this.#haUrl
      .replace(/^http:/, "ws:")
      .replace(/^https:/, "wss:")
      + "/api/harvest/ws";

    try {
      this.#ws = new WebSocket(wsUrl);
    } catch (err) {
      console.error("[HArvest] WebSocket construction failed:", err);
      this.#scheduleReconnect();
      return;
    }

    this.#ws.onopen    = () => { this.#onOpen(); };
    this.#ws.onmessage = (event) => this.#onMessage(event);
    this.#ws.onclose   = (event) => this.#onClose(event);
    this.#ws.onerror   = (event) => this.#onError(event);
  }

  async #onOpen() {
    this.#resetHeartbeat();
    try {
      await this.#sendAuth();
    } catch (err) {
      console.error("[HArvest] HMAC signing failed - entering permanent failure:", err);
      this.#permanentFailure = true;
      for (const card of this.#cards.values()) {
        card.setErrorState?.("HRV_AUTH_FAILED");
      }
      this.#ws?.close();
    }
  }

  /**
   * @param {MessageEvent} event
   */
  #onMessage(event) {
    this.#resetHeartbeat();

    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      console.warn("[HArvest] Received malformed JSON:", event.data?.slice?.(0, 200));
      if (this.#trackMalformed()) this.#ws?.close();
      return;
    }

    if (!msg || typeof msg.type !== "string") {
      console.warn("[HArvest] Message missing type field:", msg);
      if (this.#trackMalformed()) this.#ws?.close();
      return;
    }

    this.#routeMessage(msg);
  }

  /**
   * @param {CloseEvent} event
   */
  #onClose(event) {
    clearTimeout(this.#heartbeatTimer);
    this.#heartbeatTimer = null;
    this.#ws = null;
    this.#sessionId = null;

    if (this.#permanentFailure) return;
    if (_pageUnloading) return;

    console.warn(`[HArvest] WS closed (code ${event.code}) - scheduling reconnect`);
    this.#scheduleReconnect();
  }

  /**
   * @param {Event} event
   */
  #onError(event) {
    console.warn("[HArvest] WebSocket error:", event);
    // onClose fires after onerror; reconnect is handled there.
  }

  /**
   * Build and send the auth message. Uses all currently known entity IDs
   * (pending set plus already-registered cards that are not yet subscribed).
   */
  async #sendAuth() {
    // Collect all entity refs currently known to this client. Each entry may
    // be a real entity ID (from a card with `entity=`) or an alias (from a
    // card with `alias=`); SPEC.md Section 5.1 explicitly accepts mixed
    // arrays and the server resolves each ref against the token's entity
    // list with alias-then-real-id lookup. There is no cross-token namespace
    // risk here because clients are singletons keyed by (haUrl, tokenId), so
    // every ref in #cards belongs to the same token's namespace; token swaps
    // mid-element-life are not a supported code path (hrv-card's
    // attributeChangedCallback does not swap the client).
    const entityIds = [...new Set([
      ...this.#pendingEntityIds,
      ...this.#cards.keys(),
    ])];
    this.#pendingEntityIds.clear();

    /** @type {object} */
    const msg = {
      type: "auth",
      token_id: this.#tokenId,
      entity_ids: entityIds,
      page_path: window.location.pathname,
      msg_id: this.#nextMsgId(),
    };

    if (this.#tokenSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = this.#generateNonce();
      const signature = await this.#buildHmacSignature(timestamp, nonce);
      msg.timestamp = timestamp;
      msg.nonce = nonce;
      msg.signature = signature;
    }

    // Re-auth after session expiry: include session_id if we have one.
    // For a fresh connect (reconnect) the session_id is already null.

    this.#sendJson(msg);
  }

  /**
   * Schedule a reconnect attempt with exponential backoff and 20% jitter.
   * Cards keep showing cached state during a grace period. After
   * STALE_GRACE_MS without a successful reconnect, cards are set to
   * HRV_STALE to show the "Last known state" indicator.
   */
  #scheduleReconnect() {
    const baseDelay = RECONNECT_DELAYS[Math.min(this.#reconnectAttempt, RECONNECT_DELAYS.length - 1)];
    const jitter = baseDelay * 0.2 * Math.random();
    const delay = baseDelay + jitter;

    this.#reconnectAttempt++;

    if (!this.#staleGraceTimer) {
      this.#staleGraceTimer = setTimeout(() => {
        this.#staleGraceTimer = null;
        if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) {
          for (const card of this.#cards.values()) {
            card.setErrorState?.("HRV_STALE");
          }
        }
      }, STALE_GRACE_MS);
    }

    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      this.#openConnection();
    }, delay);
  }

  /**
   * Reset the client-side heartbeat watchdog. Called on every inbound message.
   * If no message arrives within HEARTBEAT_TIMEOUT_MS, the WS is closed and
   * a reconnect is triggered.
   */
  #resetHeartbeat() {
    clearTimeout(this.#heartbeatTimer);
    this.#heartbeatTimer = setTimeout(() => {
      console.warn("[HArvest] Heartbeat timeout - reconnecting");
      this.#ws?.close();
    }, HEARTBEAT_TIMEOUT_MS);
  }

  /**
   * Page visibility change handler. When the page becomes visible and the
   * WebSocket is dead, cancel any pending backoff timer and reconnect
   * immediately. Mobile browsers suspend tabs when backgrounded; this
   * ensures the connection is restored as soon as the user returns.
   */
  #onVisibilityChange() {
    if (document.visibilityState !== "visible") return;
    if (this.#permanentFailure) return;
    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) return;

    // Cancel pending backoff reconnect and connect now. Reset both transient
    // counters: visibility wake represents a deliberate "user returned"
    // signal, so previously-accumulated reauth failures (which may be hours
    // old at this point) should not push the next attempt over MAX_REAUTH_
    // ATTEMPTS on a single bad reconnect. Permanent error codes still
    // trip #permanentFailure directly in #handleAuthFailed regardless of
    // this reset.
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
    this.#reconnectAttempt = 0;
    this.#reauthAttempts = 0;
    this.#openConnection();
  }

  /**
   * Dispatch an inbound message to the appropriate handler by type.
   * @param {object} msg
   */
  #routeMessage(msg) {
    switch (msg.type) {
      case "auth_ok":          return this.#handleAuthOk(msg);
      case "auth_failed":      return this.#handleAuthFailed(msg);
      case "entity_definition":return this.#handleEntityDefinition(msg);
      case "state_update":     return this.#handleStateUpdate(msg);
      case "entity_removed":   return this.#handleEntityRemoved(msg);
      case "history_data":     return this.#handleHistoryData(msg);
      case "subscribe_ok":     return this.#handleSubscribeOk(msg);
      case "session_expiring": return this.#handleSessionExpiring(msg);
      case "ack":              return this.#handleAck(msg);
      case "error":            return this.#handleError(msg);
      case "theme":            return this.#handleTheme(msg);
      case "token_config":    return this.#handleTokenConfig(msg);
      case "renderer_pack":   return this.#handleRendererPack(msg);
      case "keepalive":        return; // heartbeat reset already done in #onMessage
      default:
        console.debug("[HArvest] Unknown message type:", msg.type);
    }
  }

  // -------------------------------------------------------------------------
  // Message handlers
  // -------------------------------------------------------------------------

  #handleAuthOk(msg) {
    this.#sessionId = msg.session_id;
    this.#reconnectAttempt = 0;
    this.#reauthAttempts = 0;
    this.#malformedTimestamps = [];
    this.#absoluteExpiresAt = msg.absolute_expires_at ? new Date(msg.absolute_expires_at) : null;
    this.#renewalCount = 0;
    this.#maxRenewals = msg.max_renewals ?? null;

    clearTimeout(this.#staleGraceTimer);
    this.#staleGraceTimer = null;

    console.debug("[HArvest] auth_ok: session=" + msg.session_id);
  }

  #handleAuthFailed(msg) {
    const code = msg.code ?? "HRV_AUTH_FAILED";
    console.warn("[HArvest] Auth failed:", code);

    const permanentCodes = [
      "HRV_TOKEN_INVALID", "HRV_TOKEN_EXPIRED",
      "HRV_TOKEN_REVOKED",
      "HRV_IP_DENIED", "HRV_ORIGIN_DENIED", "HRV_SIGNATURE_INVALID",
      "HRV_ENTITY_NOT_IN_TOKEN", "HRV_ENTITY_INCOMPATIBLE",
    ];

    if (permanentCodes.includes(code)) {
      this.#permanentFailure = true;
      for (const card of this.#cards.values()) {
        card.setErrorState?.("HRV_AUTH_FAILED");
      }
      this.#ws?.close();
      return;
    }

    // Recoverable failures (e.g. HRV_TOKEN_INACTIVE from kill switch)
    // skip the reauth counter so the client keeps retrying via backoff.
    if (code === "HRV_TOKEN_INACTIVE") {
      for (const card of this.#cards.values()) {
        card.setErrorState?.("HRV_AUTH_FAILED");
      }
      this.#ws?.close();
      return;
    }

    this.#reauthAttempts++;
    if (this.#reauthAttempts >= MAX_REAUTH_ATTEMPTS) {
      this.#permanentFailure = true;
      for (const card of this.#cards.values()) {
        card.setErrorState?.("HRV_AUTH_FAILED");
      }
    }
  }

  #handleEntityDefinition(msg, _depth = 0) {
    // Defer until in-flight pack script finishes so the first render uses the
    // pack renderer directly (no flash of built-in renderer).
    //
    // _depth caps the recursive defer in the pathological case where new
    // renderer_pack messages keep arriving before each previous pack finishes
    // loading - each defer would otherwise create a new .then() chain. Server
    // does not spam pack messages in practice; depth > 5 means message
    // ordering has gone sideways and dispatching with the currently-loaded
    // pack (or built-in fallback) is the safer choice.
    if (this.#packLoadPromise && _depth < 5) {
      this.#packLoadPromise.then(() => this.#handleEntityDefinition(msg, _depth + 1));
      return;
    }
    const entityId = msg.entity_id;
    const card = this.#cards.get(entityId);
    if (card) {
      card.receiveDefinition?.(msg);
    } else {
      this.#pendingDefinitions.set(entityId, msg);
    }
  }

  #handleStateUpdate(msg) {
    const entityId = msg.entity_id;
    const incoming = new Date(msg.last_updated);
    const existing = this.#entityStates.get(entityId);

    // Two distinct checks because JS Date has only millisecond precision while
    // HA's last_updated has microsecond precision in ISO form. Two genuine
    // updates within the same millisecond would round to equal Dates, so
    // using `<=` on Dates alone would silently drop the second.
    //   - Byte-equal raw string -> true duplicate (e.g. reconnect resend); drop.
    //   - Parsed Date strictly older -> out-of-order delivery; drop.
    //   - Same parsed Date, different raw string -> distinct sub-millisecond
    //     update; let it through, applied in arrival order.
    if (existing && !msg.initial) {
      if (msg.last_updated === existing.lastUpdatedRaw) {
        return;
      }
      if (incoming < existing.lastUpdated) {
        return;
      }
    }

    // Merge delta attributes if not initial.
    let attributes;
    if (msg.initial || msg.attributes !== undefined) {
      attributes = msg.attributes ?? {};
    } else {
      attributes = { ...(existing?.attributes ?? {}) };
      if (msg.attributes_delta) {
        Object.assign(attributes, msg.attributes_delta.changed ?? {});
        for (const key of (msg.attributes_delta.removed ?? [])) {
          delete attributes[key];
        }
      }
    }

    this.#entityStates.set(entityId, {
      state: msg.state,
      attributes,
      lastUpdated: incoming,
      lastUpdatedRaw: msg.last_updated,
    });

    // Write to state cache (imported lazily to avoid circular deps at load time).
    try {
      StateCache.write(this.#tokenId, entityId, msg.state, attributes);
    } catch {
      // StateCache may not be available in all build configurations.
    }

    const card = this.#cards.get(entityId);
    if (card) {
      card.receiveStateUpdate?.(msg.state, attributes, msg.last_updated);
    } else {
      if (this.#pendingStateUpdates.size >= 200) {
        const oldest = this.#pendingStateUpdates.keys().next().value;
        this.#pendingStateUpdates.delete(oldest);
      }
      this.#pendingStateUpdates.set(entityId, msg);
    }

    for (const listener of this.#stateListeners) {
      try { listener(entityId, msg.state, attributes); } catch { /* ignore */ }
    }
  }

  #handleEntityRemoved(msg) {
    const entityId = msg.entity_id;
    const card = this.#cards.get(entityId);
    card?.setErrorState?.("HRV_ENTITY_REMOVED");
  }

  #handleHistoryData(msg) {
    const entityId = msg.entity_id;
    const card = this.#cards.get(entityId);
    card?.receiveHistoryData?.(msg.points ?? [], msg.hours ?? 24);
  }

  #handleSubscribeOk(_msg) {
    // Subscribe acknowledged - no action needed; entity_definition follows.
    console.debug("[HArvest] subscribe_ok received");
  }

  #handleSessionExpiring(_msg) {
    // The session is about to expire. Attempt renewal unless limits are reached.
    const now = new Date();

    const absoluteExpired = this.#absoluteExpiresAt && now >= this.#absoluteExpiresAt;
    const renewalLimitReached = this.#maxRenewals !== null && this.#renewalCount >= this.#maxRenewals;

    if (absoluteExpired || renewalLimitReached) {
      // Full re-auth required.
      console.debug("[HArvest] Session limit reached - performing full re-auth");
      this.#sessionId = null;
      this.#ws?.close();
      return;
    }

    // Send renew.
    this.#sendJson({
      type: "renew",
      session_id: this.#sessionId,
      token_id: this.#tokenId,
      msg_id: this.#nextMsgId(),
    });
    this.#renewalCount++;
    // Server responds with auth_ok + entity_definition + state_update for all entities.
  }

  #handleAck(msg) {
    // Generic command acknowledgement - cards can hook into this via receiveAck.
    const card = this.#cards.get(msg.entity_id);
    card?.receiveAck?.(msg);
  }

  #handleError(msg) {
    const code = msg.code ?? "HRV_UNKNOWN";
    console.warn("[HArvest] Server error:", code, msg.message ?? "");

    // Route to the affected card if entity_id is present.
    if (msg.entity_id) {
      const card = this.#cards.get(msg.entity_id);
      card?.receiveError?.(code);
    } else {
      // Session-level error: broadcast to all cards.
      for (const card of this.#cards.values()) {
        card.receiveError?.(code);
      }
    }
  }

  #handleTheme(msg) {
    if (!("variables" in msg)) return;
    const isEmpty = !msg.variables || Object.keys(msg.variables).length === 0;
    const theme = isEmpty ? null : { variables: msg.variables, dark_variables: msg.dark_variables ?? {} };
    for (const card of this.#cards.values()) {
      card.receiveTheme?.(theme);
    }
  }

  #handleTokenConfig(msg) {
    const config = {
      lang: msg.lang ?? "auto",
      a11y: msg.a11y ?? "standard",
      colorScheme: msg.color_scheme ?? "auto",
      onOffline: msg.on_offline ?? "last-state",
      onError: msg.on_error ?? "message",
      offlineText: msg.offline_text ?? "",
      errorText: msg.error_text ?? "",
    };
    for (const card of this.#cards.values()) {
      card.receiveTokenConfig?.(config);
    }
  }

  #handleRendererPack(msg) {
    if (!msg.url) {
      this.#activePack = null;
      for (const card of this.#cards.values()) {
        card._reRender?.();
      }
      return;
    }
    // Strip query string before extracting pack ID so ?v=timestamp never breaks the match.
    const urlPath = msg.url.split("?")[0];
    // Validate URL is a relative path (defense-in-depth against malicious server messages).
    if (msg.url && (msg.url.includes("://") || msg.url.startsWith("//"))) {
      console.warn("[HArvest] Rejected renderer_pack with absolute URL:", msg.url);
      return;
    }
    const match = urlPath.match(/\/([^/]+)\.js$/);
    const packId = match ? match[1] : null;
    if (window.HArvest?._packs?.[packId]) {
      this.#activePack = packId;
      for (const card of this.#cards.values()) {
        card._reRender?.();
      }
      return;
    }
    // Pack not yet loaded - set a promise so entity_definition messages wait.
    let resolve;
    this.#packLoadPromise = new Promise(r => { resolve = r; });
    const script = document.createElement("script");
    const sep = msg.url.includes("?") ? "&" : "?";
    script.src = this.#haUrl + msg.url + sep + "_=" + Date.now();
    script.dataset.packId = packId;
    script.onload = () => {
      document.head.removeChild(script);
      this.#activePack = packId;
      this.#packLoadPromise = null;
      resolve();
      for (const card of this.#cards.values()) {
        card._reRender?.();
      }
    };
    script.onerror = () => {
      console.warn("[HArvest] Failed to load renderer pack:", msg.url);
      document.head.removeChild(script);
      this.#packLoadPromise = null;
      // Intentionally NOT clearing #activePack: a failed pack load should
      // leave whatever pack was active before unchanged (or null on first
      // load, in which case the renderer-lookup chain falls back to the
      // built-in registry). _reRender is not fired here for the same reason
      // - cards keep their existing renderers since nothing actually changed.
      resolve();
    };
    document.head.appendChild(script);
  }

  // -------------------------------------------------------------------------
  // Crypto
  // -------------------------------------------------------------------------

  /**
   * Build an HMAC-SHA256 hex signature for the auth payload.
   * Payload format: "{token_id}:{timestamp}:{nonce}"
   *
   * @param {number} timestamp - Unix seconds
   * @param {string} nonce     - Random base62 nonce
   * @returns {Promise<string>} - Lowercase hex string
   */
  async #buildHmacSignature(timestamp, nonce) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.#tokenSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const data = new TextEncoder().encode(`${this.#tokenId}:${timestamp}:${nonce}`);
    const sig = await crypto.subtle.sign("HMAC", key, data);
    return Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Generate a 16-character random base62 nonce.
   * @returns {string}
   */
  #generateNonce() {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let nonce = "";
    for (let i = 0; i < 16; i++) {
      nonce += alphabet[bytes[i] % 62];
    }
    return nonce;
  }

  // -------------------------------------------------------------------------
  // Flood protection
  // -------------------------------------------------------------------------

  /**
   * Record a malformed message timestamp. Returns true if the flood limit is
   * exceeded, signalling that the connection should be closed.
   * @returns {boolean}
   */
  #trackMalformed() {
    const now = Date.now();
    this.#malformedTimestamps.push(now);
    // Purge entries outside the flood window.
    this.#malformedTimestamps = this.#malformedTimestamps.filter(
      (t) => now - t < HarvestClient.#FLOOD_WINDOW_MS,
    );
    if (this.#malformedTimestamps.length >= HarvestClient.#FLOOD_LIMIT) {
      console.warn("[HArvest] Flood protection triggered - closing connection");
      return true;
    }
    return false;
  }

  // -------------------------------------------------------------------------
  // Utility
  // -------------------------------------------------------------------------

  /**
   * Serialise and send a JSON message on the WebSocket.
   * @param {object} payload
   */
  #sendJson(payload) {
    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      try {
        this.#ws.send(JSON.stringify(payload));
      } catch (err) {
        console.warn("[HArvest] Failed to send message:", err);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// StateCache reference - resolved at call time to avoid circular imports.
// The real StateCache class is defined in state-cache.js and imported by the
// build entry point. Accessed here via a module-level lazy getter so that
// tree-shakers do not pull in the import unconditionally.
// ---------------------------------------------------------------------------

/** @type {any} */
let _StateCacheRef = null;

/** @returns {any} */
function _getStateCache() {
  return _StateCacheRef;
}

/**
 * Allow the build entry point to wire up the StateCache after both modules
 * have been evaluated.
 * @param {any} sc
 */
export function setStateCacheRef(sc) {
  _StateCacheRef = sc;
}

// Replace the placeholder used inside #handleStateUpdate with the real ref.
const StateCache = new Proxy(
  {},
  {
    get(_target, prop) {
      return _getStateCache()?.[prop];
    },
  },
);
