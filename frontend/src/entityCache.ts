/**
 * entityCache.ts - Module-level cache of all HA entity states.
 *
 * Loaded once when the panel opens (from main.tsx when hass is set).
 * Re-fetched each time the wizard opens if the cache is empty.
 * Used by Step 1 of the wizard to power the entity autocomplete dropdown.
 *
 * Concurrent callers share a single in-flight Promise so a component (e.g.
 * EntityAutocomplete) that calls loadEntityCache() while main.tsx's bootstrap
 * fetch is still in flight will await the same fetch instead of receiving an
 * immediately-resolved Promise with an empty cache. On failure the cache is
 * left empty and `_inflight` is cleared, so the next caller (typically the
 * next component mount) triggers a fresh fetch.
 */

import { useEffect, useState } from "react";
import { api } from "./api";
import type { HAEntity } from "./types";

let _cache: HAEntity[] = [];
let _inflight: Promise<void> | null = null;
let _version = 0;
const _listeners: Array<() => void> = [];

export function getEntityCache(): HAEntity[] {
  return _cache;
}

export function useEntityCache(): HAEntity[] {
  const [, setV] = useState(_version);
  useEffect(() => {
    const cb = () => setV(v => v + 1);
    _listeners.push(cb);
    return () => {
      const i = _listeners.indexOf(cb);
      if (i >= 0) _listeners.splice(i, 1);
    };
  }, []);
  return _cache;
}

export function loadEntityCache(): Promise<void> {
  // Share the in-flight Promise: concurrent callers all resolve when the
  // single fetch completes, avoiding the "second caller sees empty cache"
  // race that occurred when this used a boolean _loading flag.
  if (_inflight) return _inflight;
  _inflight = (async () => {
    try {
      _cache = await api.entities.list();
      _version++;
      _listeners.forEach(cb => cb());
    } catch {
      // Fail silently - the next caller (e.g. the next component mount that
      // calls loadEntityCache()) will see _inflight=null and trigger a fresh
      // attempt. Components driving the user through the panel naturally
      // produce these retry triggers (Wizard open, TokenDetail open).
    } finally {
      _inflight = null;
    }
  })();
  return _inflight;
}
