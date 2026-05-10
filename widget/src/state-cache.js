/**
 * state-cache.js - localStorage state cache for offline grace rendering.
 *
 * Caches the last known state and attributes for each (tokenId, entityId)
 * pair so that cards can render stale-but-useful content while reconnecting.
 *
 * Cache key format: hrv_{djb2(tokenId + "|" + entityId).abs().hex().padStart(8)}
 *
 * The hash provides privacy-by-obscurity: the token ID and entity ID are not
 * directly visible in browser storage. This is not a cryptographic guarantee -
 * it is sufficient because the cache key is not a security boundary.
 *
 * crypto.subtle (async SHA-256) cannot be used here because this module is
 * called from synchronous paths such as connectedCallback. A fast djb2-style
 * integer hash is used instead, consistent with SPEC.md Section 9.
 *
 * Hash collisions: a 32-bit hash makes collisions astronomically unlikely in
 * practice (birthday-bound ~10^-7 at 50 entries) but not zero. Each cached
 * value carries the originating (tokenId, entityId) and read() rejects the
 * entry on mismatch so a colliding key never returns the wrong entity's state.
 * Last-write-wins handles which entity occupies a colliding slot; the loser
 * gets a cache miss and re-fetches from the server on next state_update.
 *
 * All localStorage operations are wrapped in try/catch. Failures are silently
 * ignored so that the cache degrades gracefully in environments where
 * localStorage is unavailable (Safari private browsing, sandboxed iframes).
 */
/**
 * Compute a djb2-style hash of a string. Returns a 32-bit signed integer.
 * @param {string} str
 * @returns {number}
 */
function _djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // keep as 32-bit integer
  }
  return hash;
}

/**
 * Derive the localStorage key for a (tokenId, entityId) pair.
 * @param {string} tokenId
 * @param {string} entityId
 * @returns {string}
 */
function _keyFor(tokenId, entityId) {
  const raw = `${tokenId}|${entityId}`;
  const hash = _djb2(raw);
  return `hrv_${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

/**
 * Derive the localStorage key for a cached entity_definition. Uses a distinct
 * prefix from the state key so a single (tokenId, entityId) pair can have both
 * entries simultaneously without collision.
 * @param {string} tokenId
 * @param {string} entityId
 * @returns {string}
 */
function _defKeyFor(tokenId, entityId) {
  const raw = `${tokenId}|${entityId}|def`;
  const hash = _djb2(raw);
  return `hrvd_${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

/**
 * Thin wrapper around localStorage. Provides write(), read(), and remove()
 * with silent failure semantics.
 */
export class StateCache {
  /**
   * Write a state snapshot to the cache.
   *
   * @param {string} tokenId
   * @param {string} entityId
   * @param {string} state
   * @param {Record<string, unknown>} attributes
   */
  static write(tokenId, entityId, state, attributes) {
    try {
      const key = _keyFor(tokenId, entityId);
      localStorage.setItem(
        key,
        JSON.stringify({
          token_id: tokenId,
          entity_id: entityId,
          state,
          attributes,
          cached_at: new Date().toISOString(),
        }),
      );
    } catch {
      // SecurityError (Safari private browsing), QuotaExceededError, or other
      // access denial. Cache is best-effort; silently ignore all failures.
    }
  }

  /**
   * Read a cached state snapshot. Returns null on cache miss, parse failure,
   * any localStorage error, or hash-collision mismatch (the cached payload's
   * token_id/entity_id must match the requested pair).
   *
   * @param {string} tokenId
   * @param {string} entityId
   * @returns {{ token_id: string, entity_id: string, state: string, attributes: Record<string, unknown>, cached_at: string } | null}
   */
  static read(tokenId, entityId) {
    try {
      const key = _keyFor(tokenId, entityId);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Integrity check: defends against djb2 collisions and pre-fix entries
      // (older entries lack token_id and will fail this check, behaving as a
      // one-time cache flush after upgrade).
      if (parsed?.token_id !== tokenId || parsed?.entity_id !== entityId) {
        return null;
      }
      return parsed;
    } catch {
      // SecurityError, QuotaExceededError, or JSON.parse failure.
      // Return null so the caller renders a loading state instead of crashing.
      return null;
    }
  }

  /**
   * Remove a cached entry. No-op if the entry does not exist.
   *
   * @param {string} tokenId
   * @param {string} entityId
   */
  static remove(tokenId, entityId) {
    try {
      localStorage.removeItem(_keyFor(tokenId, entityId));
    } catch {
      // Ignore.
    }
  }

  /**
   * Cache an entity_definition message so the next page load can render from
   * cache before the WebSocket auth completes. Stored under a distinct key
   * namespace (hrvd_) so it never collides with state entries.
   *
   * @param {string} tokenId
   * @param {string} entityId
   * @param {object} def - Full entity_definition message from the server.
   */
  static writeDef(tokenId, entityId, def) {
    try {
      const key = _defKeyFor(tokenId, entityId);
      localStorage.setItem(
        key,
        JSON.stringify({
          token_id: tokenId,
          entity_id: entityId,
          def,
          cached_at: new Date().toISOString(),
        }),
      );
    } catch {
      // Cache is best-effort; ignore quota/security failures.
    }
  }

  /**
   * Read a cached entity_definition. Returns null on cache miss, parse failure,
   * any localStorage error, or hash-collision mismatch on (tokenId, entityId).
   *
   * @param {string} tokenId
   * @param {string} entityId
   * @returns {object|null}
   */
  static readDef(tokenId, entityId) {
    try {
      const key = _defKeyFor(tokenId, entityId);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.token_id !== tokenId || parsed?.entity_id !== entityId) {
        return null;
      }
      return parsed.def ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Remove a cached entity_definition entry. No-op if absent.
   *
   * @param {string} tokenId
   * @param {string} entityId
   */
  static removeDef(tokenId, entityId) {
    try {
      localStorage.removeItem(_defKeyFor(tokenId, entityId));
    } catch {
      // Ignore.
    }
  }
}
