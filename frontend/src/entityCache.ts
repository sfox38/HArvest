/**
 * entityCache.ts - Module-level cache of all HA entity states.
 *
 * Loaded once when the panel opens (from main.tsx when hass is set).
 * Re-fetched each time the wizard opens if the cache is empty.
 * Used by Step 1 of the wizard to power the entity autocomplete dropdown.
 */

import { useEffect, useState } from "react";
import { api } from "./api";
import type { HAEntity } from "./types";

let _cache: HAEntity[] = [];
let _loading = false;
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

export async function loadEntityCache(): Promise<void> {
  if (_loading) return;
  _loading = true;
  try {
    _cache = await api.entities.list();
    _version++;
    _listeners.forEach(cb => cb());
  } catch {
    // Fail silently - autocomplete just shows no suggestions
  } finally {
    _loading = false;
  }
}
