/**
 * api.ts - HTTP API client for the HArvest panel.
 *
 * All calls go to the HA HTTP API endpoints registered by http_views.py.
 * Auth uses the bearer token from the hass object HA passes to the panel
 * custom element. Before each request, the token expiry is checked and
 * refreshed proactively if within 60s of expiry; on 401, the token is
 * refreshed and the request retried once.
 */

import type {
  Token,
  TokenUpdate,
  TokenUpdateResponse,
  Session,
  ActivityPage,
  HarvestAction,
  ServiceCallDef,
  IntegrationConfig,
  PanelStats,
  HourlyBucket,
  HAEntity,
  HAEntityDetail,
  ThemeDefinition,
  PacksResponse,
} from "./types";

const BASE = "/api/harvest";

// ---------------------------------------------------------------------------
// Hass instance - set by main.tsx, used for auth token + refresh
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _hass: any = null;

// Readiness gate: _doReq awaits this Promise before any request runs, so any
// caller firing before HA's first hass push (now or in some future code path)
// queues until setHass() lands instead of crashing on `_hass.auth` being null.
let _hassReadyResolve: () => void = () => {};
const _hassReady: Promise<void> = new Promise(r => { _hassReadyResolve = r; });

let _haDarkMode = false;
const _darkModeListeners: Array<(dark: boolean) => void> = [];

export function getHaDarkMode(): boolean { return _haDarkMode; }

export function onHaDarkModeChange(cb: (dark: boolean) => void): () => void {
  _darkModeListeners.push(cb);
  return () => {
    const i = _darkModeListeners.indexOf(cb);
    if (i >= 0) _darkModeListeners.splice(i, 1);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setHass(hass: any): void {
  _hass = hass;
  // Idempotent: subsequent resolve() calls are no-ops on a resolved Promise.
  _hassReadyResolve();
  const dark = hass?.themes?.darkMode ?? false;
  if (dark !== _haDarkMode) {
    _haDarkMode = dark;
    _darkModeListeners.forEach(cb => cb(dark));
  }
}

// ---------------------------------------------------------------------------
// Connectivity state - tracks network reachability of HA
//
// Design note: _recoveryTimer is module-scoped and intentionally outlives
// the panel custom element's mount/unmount cycles. It runs as a single
// self-chaining timeout (bounded backoff capped at 15s, one tiny /stats
// fetch per iteration) and self-terminates the moment HA responds OK.
// If the user navigates away from the panel while HA is offline, the
// background poll continues until HA recovers - this is a deliberate
// trade-off: when the user returns to the panel, connectivity state is
// already accurate. The cost is at most one ~1 KB request every 15s
// during the (uncommon) "offline at navigate-away" window.
// ---------------------------------------------------------------------------

let _offline = false;
let _recoveryTimer: ReturnType<typeof setTimeout> | null = null;
const _connectivityListeners: Array<(offline: boolean) => void> = [];

export function isOffline(): boolean { return _offline; }

export function onConnectivityChange(cb: (offline: boolean) => void): () => void {
  _connectivityListeners.push(cb);
  return () => {
    const i = _connectivityListeners.indexOf(cb);
    if (i >= 0) _connectivityListeners.splice(i, 1);
  };
}

function _setOffline(v: boolean): void {
  if (v === _offline) return;
  _offline = v;
  _connectivityListeners.forEach(cb => cb(v));
  if (v && !_recoveryTimer) _startRecoveryPoll();
  if (!v && _recoveryTimer) { clearTimeout(_recoveryTimer); _recoveryTimer = null; }
}

function _startRecoveryPoll(): void {
  let delay = 3000;
  const poll = () => {
    fetch(`${BASE}/stats`, {
      headers: _hass?.auth?.data?.access_token
        ? { Authorization: `Bearer ${_hass.auth.data.access_token}` }
        : {},
    })
      .then(r => { if (r.ok) _setOffline(false); else throw new Error(); })
      .catch(() => {
        delay = Math.min(delay * 1.5, 15000);
        _recoveryTimer = setTimeout(poll, delay);
      });
  };
  _recoveryTimer = setTimeout(poll, delay);
}

// ---------------------------------------------------------------------------
// Coordinated auth-token refresh
//
// Multiple panel API calls can fire concurrently (Dashboard's allSettled,
// rapid clicks, etc.). Without coordination, each one independently calls
// _hass.auth.refreshAccessToken() when it sees expires-soon or hits 401,
// producing a refresh storm of redundant network round-trips.
//
// _coordinatedRefresh() funnels concurrent callers through a single in-flight
// refresh. Failures set a 5-second cool-down so a persistently-broken refresh
// (real session expiry, network down) does not produce 60s worth of repeated
// attempts on every Dashboard auto-reload tick.
// ---------------------------------------------------------------------------

let _refreshInflight: Promise<void> | null = null;
let _refreshFailedUntil = 0;
const _REFRESH_COOLDOWN_MS = 5_000;

function _coordinatedRefresh(): Promise<void> {
  if (_refreshInflight) return _refreshInflight;
  if (Date.now() < _refreshFailedUntil) {
    return Promise.reject(new Error("auth refresh in cool-down after recent failure"));
  }
  if (!_hass?.auth) {
    return Promise.reject(new Error("hass.auth not available"));
  }
  _refreshInflight = (async () => {
    try {
      await _hass.auth.refreshAccessToken();
      _refreshFailedUntil = 0;
    } catch (err) {
      _refreshFailedUntil = Date.now() + _REFRESH_COOLDOWN_MS;
      throw err;
    } finally {
      _refreshInflight = null;
    }
  })();
  return _refreshInflight;
}

// ---------------------------------------------------------------------------
// Core request helper with proactive token refresh and 401 retry
// ---------------------------------------------------------------------------

async function _doReq<T>(
  method: string,
  path: string,
  body?: unknown,
  retried = false,
  responseType: "json" | "text" = "json",
): Promise<T> {
  // Wait for the first hass push before issuing any request. Today main.tsx
  // already gates _root.render() on the first setHass() call, so this awaits
  // an already-resolved Promise on every normal path. The gate exists to
  // protect future callers (top-level effects, module-init imports, etc.)
  // from racing the panel's bootstrap.
  await _hassReady;

  if (!retried && _hass?.auth) {
    const expires: number | undefined = _hass.auth.data?.expires;
    if (expires !== undefined && Date.now() > expires - 60_000) {
      // Coordinated: concurrent callers all await the same in-flight refresh.
      // Failures throw and propagate to the caller as a fetch error.
      try {
        await _coordinatedRefresh();
      } catch {
        // Fall through; the unrefreshed token may still be valid for one
        // more request, and the 401-retry path below handles the failure
        // case with the friendly "session expired" message.
      }
    }
  }

  const token: string | undefined = _hass?.auth?.data?.access_token;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const opts: RequestInit = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const url = path.startsWith("/api/") ? path : `${BASE}${path}`;

  let res: Response;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    _setOffline(true);
    throw err;
  }

  _setOffline(false);

  // 401 handling: try one refresh, then surface a friendly error rather than
  // the raw 401 body or an internal "Cannot read properties of null" if the
  // refresh path itself throws.
  if (res.status === 401) {
    if (retried || !_hass?.auth) {
      throw new Error("Panel session expired. Reload the page to re-authenticate.");
    }
    try {
      await _coordinatedRefresh();
    } catch {
      throw new Error("Panel session expired. Reload the page to re-authenticate.");
    }
    return _doReq<T>(method, path, body, true, responseType);
  }

  if (!res.ok) {
    const reason = await res.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${res.status}${reason ? ` - ${reason}` : ""}`);
  }

  if (res.status === 204) return undefined as T;
  if (responseType === "text") return res.text() as Promise<T>;
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

function _get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path;
  return _doReq<T>("GET", url);
}

function _post<T>(path: string, body?: unknown): Promise<T> {
  return _doReq<T>("POST", path, body);
}

function _patch<T>(path: string, body: unknown): Promise<T> {
  return _doReq<T>("PATCH", path, body);
}

function _getText(path: string, params?: Record<string, string>): Promise<string> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path;
  return _doReq<string>("GET", url, undefined, false, "text");
}

function _delete(path: string, params?: Record<string, string>): Promise<void> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path;
  return _doReq<void>("DELETE", url);
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export const api = {
  tokens: {
    list: (): Promise<Token[]> =>
      _get<Token[]>("/tokens"),

    get: (tokenId: string): Promise<Token> =>
      _get<Token>(`/tokens/${tokenId}`),

    create: (data: Partial<Token>): Promise<Token> =>
      _post<Token>("/tokens", data),

    createPreview: (data: { entity_id: string; capabilities: "read" | "read-write" }): Promise<{ token_id: string; expires: string | null }> =>
      _post("/tokens/preview", data),

    update: (tokenId: string, data: Partial<Token> | TokenUpdate): Promise<TokenUpdateResponse> =>
      _patch<TokenUpdateResponse>(`/tokens/${tokenId}`, data),

    revoke: (tokenId: string, reason?: string): Promise<void> =>
      _delete(`/tokens/${tokenId}`, { action: "revoke", ...(reason ? { reason } : {}) }),

    delete: (tokenId: string): Promise<void> =>
      _delete(`/tokens/${tokenId}`),

    generateAlias: (entityId: string): Promise<{ entity_id: string; alias: string }> =>
      _post("/alias", { entity_id: entityId }),
  },

  // ---------------------------------------------------------------------------
  // Sessions
  // ---------------------------------------------------------------------------

  sessions: {
    list: (tokenId?: string): Promise<Session[]> =>
      _get<Session[]>("/sessions", tokenId ? { token_id: tokenId } : undefined),

    terminate: (sessionId: string): Promise<void> =>
      _delete(`/sessions/${sessionId}`),

    // Pass tokenId to terminate that token's sessions only; pass nothing to
     // terminate every active session globally (one server-side bulk op,
     // avoiding N parallel DELETEs from the client).
    terminateAll: (tokenId?: string): Promise<void> =>
      _delete(`/sessions`, tokenId ? { token_id: tokenId } : undefined),
  },

  // ---------------------------------------------------------------------------
  // Activity log
  // ---------------------------------------------------------------------------

  activity: {
    list: (params: {
      offset?: number;
      limit?: number;
      token_id?: string;
      event_type?: string;
      since?: string;
      until?: string;
      search?: string;
    }): Promise<ActivityPage> => {
      const p: Record<string, string> = {};
      if (params.offset     !== undefined) p.offset     = String(params.offset);
      if (params.limit      !== undefined) p.limit      = String(params.limit);
      if (params.token_id)   p.token_id   = params.token_id;
      if (params.event_type) p.event_type = params.event_type;
      if (params.since)      p.since      = params.since;
      if (params.until)      p.until      = params.until;
      if (params.search)     p.search     = params.search;
      return _get<ActivityPage>("/activity", p);
    },

    exportCsv: async (params: Record<string, string>): Promise<void> => {
      const csv = await _getText("/activity/export", params);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "harvest_activity.csv";
      a.click();
      URL.revokeObjectURL(url);
    },

    aggregates: (hours = 24): Promise<HourlyBucket[]> =>
      _get<HourlyBucket[]>("/activity/aggregates", { hours: String(hours) }),
  },

  // ---------------------------------------------------------------------------
  // Harvest actions
  // ---------------------------------------------------------------------------

  actions: {
    list: (): Promise<HarvestAction[]> =>
      _get<HarvestAction[]>("/actions"),

    create: (data: { label: string; icon: string; service_calls: ServiceCallDef[] }): Promise<HarvestAction> =>
      _post<HarvestAction>("/actions", data),

    update: (actionId: string, data: Partial<{ label: string; icon: string; service_calls: ServiceCallDef[] }>): Promise<HarvestAction> =>
      _patch<HarvestAction>(`/actions/${actionId}`, data),

    delete: (actionId: string): Promise<void> =>
      _delete(`/actions/${actionId}`),
  },

  // ---------------------------------------------------------------------------
  // Themes
  // ---------------------------------------------------------------------------

  themes: {
    list: (): Promise<ThemeDefinition[]> =>
      _get<ThemeDefinition[]>("/themes"),

    get: (themeId: string): Promise<ThemeDefinition> =>
      _get<ThemeDefinition>(`/themes/${themeId}`),

    create: (data: { name: string; variables: Record<string, string>; dark_variables?: Record<string, string>; author?: string; version?: string; renderer_pack?: boolean; capabilities?: unknown; pack_settings?: string[] }): Promise<ThemeDefinition> =>
      _post<ThemeDefinition>("/themes", data),

    update: (themeId: string, data: Partial<{ name: string; author: string; version: string; variables: Record<string, string>; dark_variables: Record<string, string>; renderer_pack: boolean; capabilities: unknown; pack_settings: string[] }>): Promise<ThemeDefinition> =>
      _patch<ThemeDefinition>(`/themes/${themeId}`, data),

    delete: (themeId: string): Promise<void> =>
      _delete(`/themes/${themeId}`),

    reload: (): Promise<{ status: string; errors?: Record<string, string> }> =>
      _post<{ status: string; errors?: Record<string, string> }>("/themes/reload", {}),

    thumbnailUrl: (themeId: string): string =>
      `${BASE}/themes/${encodeURIComponent(themeId)}/thumbnail`,

    fetchThumbnail: async (themeId: string): Promise<Blob> => {
      const token: string | undefined = (_hass as any)?.auth?.data?.access_token;
      const res = await fetch(`${BASE}/themes/${encodeURIComponent(themeId)}/thumbnail`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.blob();
    },

    uploadThumbnail: async (themeId: string, file: File): Promise<void> => {
      const token: string | undefined = (_hass as any)?.auth?.data?.access_token;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/themes/${encodeURIComponent(themeId)}/thumbnail`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) {
        const reason = await res.text().catch(() => "");
        throw new Error(`Upload failed: ${res.status}${reason ? ` - ${reason}` : ""}`);
      }
    },

    deleteThumbnail: (themeId: string): Promise<void> =>
      _delete(`/themes/${themeId}/thumbnail`),
  },

  // ---------------------------------------------------------------------------
  // Renderer packs
  // ---------------------------------------------------------------------------

  packs: {
    list: (): Promise<PacksResponse> =>
      _get<PacksResponse>("/packs"),

    agree: (agreed: boolean): Promise<{ agreed: boolean }> =>
      _post<{ agreed: boolean }>("/packs/agree", { agreed }),

    getCode: (packId: string): Promise<{ pack_id: string; code: string }> =>
      _get<{ pack_id: string; code: string }>(`/packs/${packId}/code`),

    updateCode: (packId: string, code: string): Promise<{ pack_id: string; status: string }> =>
      _post<{ pack_id: string; status: string }>(`/packs/${packId}/code`, { code }),
  },

  // ---------------------------------------------------------------------------
  // Config (Settings screen)
  // ---------------------------------------------------------------------------

  config: {
    get: (): Promise<IntegrationConfig> =>
      _get<IntegrationConfig>("/config"),

    update: (data: Partial<IntegrationConfig>): Promise<IntegrationConfig> =>
      _patch<IntegrationConfig>("/config", data),
  },

  // ---------------------------------------------------------------------------
  // Stats (Dashboard sensor values)
  // ---------------------------------------------------------------------------

  stats: {
    get: (): Promise<PanelStats> =>
      _get<PanelStats>("/stats"),
  },

  // ---------------------------------------------------------------------------
  // Entities (entity picker cache)
  // ---------------------------------------------------------------------------

  entities: {
    list: (): Promise<HAEntity[]> =>
      _get<HAEntity[]>("/entities"),

    get: (entityId: string): Promise<HAEntityDetail> =>
      _doReq<HAEntityDetail>("GET", `/api/states/${encodeURIComponent(entityId)}`),

    getDefinition: (entityId: string, params?: {
      capabilities?: string;
      name_override?: string;
      icon_override?: string;
      color_scheme?: string;
      exclude_attributes?: string[];
      display_hints?: Record<string, unknown>;
      gesture_config?: Record<string, unknown>;
      companion_ids?: string[];
    }): Promise<{ definition: Record<string, unknown>; state: string; attributes: Record<string, unknown> }> => {
      const p: Record<string, string> = {};
      if (params?.capabilities) p.capabilities = params.capabilities;
      if (params?.name_override) p.name_override = params.name_override;
      if (params?.icon_override) p.icon_override = params.icon_override;
      if (params?.color_scheme) p.color_scheme = params.color_scheme;
      if (params?.exclude_attributes?.length) p.exclude_attributes = params.exclude_attributes.join(",");
      if (params?.display_hints) p.display_hints = JSON.stringify(params.display_hints);
      if (params?.gesture_config) p.gesture_config = JSON.stringify(params.gesture_config);
      if (params?.companion_ids?.length) p.companion_ids = params.companion_ids.join(",");
      return _get(`/preview/definition/${encodeURIComponent(entityId)}`, Object.keys(p).length ? p : undefined);
    },
  },

  // ---------------------------------------------------------------------------
  // HA native states (for picking entities outside the harvest tier filter)
  // ---------------------------------------------------------------------------

  ha: {
    statesByDomain: async (domain: string): Promise<HAEntity[]> => {
      const states = await _doReq<{ entity_id: string; state: string; attributes: Record<string, unknown> }[]>(
        "GET", `/api/states`,
      );
      return states
        .filter(s => s.entity_id.startsWith(domain + "."))
        .map(s => ({
          entity_id: s.entity_id,
          friendly_name: (s.attributes.friendly_name as string) ?? s.entity_id,
          domain,
          state: s.state,
        }));
    },

    entityAttributes: async (entityId: string): Promise<string[]> => {
      const state = await _doReq<{ attributes: Record<string, unknown> }>(
        "GET", `/api/states/${entityId}`,
      );
      return Object.keys(state.attributes).filter(k => k !== "friendly_name").sort();
    },

    availableDomains: (): Promise<import("./types").AvailableDomain[]> =>
      api.config.get().then(c => c.available_domains ?? []),
  },
};
