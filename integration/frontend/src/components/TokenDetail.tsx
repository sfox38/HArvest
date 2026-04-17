/**
 * TokenDetail.tsx - Token detail split-pane view.
 *
 * Left panel (55%): token info (entities, origins, schedule, security,
 * rate limits) and generated code snippet with alias toggle.
 * Right panel (45%): active sessions and per-token activity log.
 *
 * Edit mode switches left panel fields to editable inputs.
 */

import { useState, useEffect, useCallback } from "react";
import type { Token, Session, ActivityEvent, ActivityPage } from "../types";
import { api } from "../api";
import { StatusBadge, CopyablePre, ConfirmDialog, Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TokenDetailProps {
  tokenId: string;
  onBack: () => void;
  onOpenWizard: () => void;
  onDeleted: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WIDGET_SCRIPT = `<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/dist/harvest.min.js"></script>`;

function buildCardSnippet(token: Token, useAliases: boolean, haUrl: string): string {
  const attrs = `ha-url="${haUrl}" token="${token.token_id}"`;
  const isGroup = token.entities.length > 1;
  const cards = token.entities.map(e => {
    const attr = useAliases && e.alias ? `alias="${e.alias}"` : `entity="${e.entity_id}"`;
    return `  <hrv-card ${attr}></hrv-card>`;
  });
  if (isGroup) return `<hrv-group ${attrs}>\n${cards.join("\n")}\n</hrv-group>`;
  const entityAttr = useAliases && token.entities[0]?.alias
    ? `alias="${token.entities[0].alias}"`
    : `entity="${token.entities[0]?.entity_id ?? ""}"`;
  return `<hrv-card ${attrs} ${entityAttr}></hrv-card>`;
}

function buildWordPressSnippet(token: Token, useAliases: boolean, haUrl: string): string {
  const groupAttrs = `data-ha-url="${haUrl}" data-token="${token.token_id}"`;
  const cards = token.entities.map(e => {
    const attr = useAliases && e.alias ? `data-alias="${e.alias}"` : `data-entity="${e.entity_id}"`;
    return `  <div class="hrv-mount" ${attr}></div>`;
  });
  const isGroup = token.entities.length > 1;
  if (isGroup) return `<div class="hrv-group" ${groupAttrs}>\n${cards.join("\n")}\n</div>`;
  const entityAttr = useAliases && token.entities[0]?.alias
    ? `data-alias="${token.entities[0].alias}"`
    : `data-entity="${token.entities[0]?.entity_id ?? ""}"`;
  return `<div class="hrv-mount" ${groupAttrs} ${entityAttr}></div>`;
}

function fmtDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function fmtTimeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  AUTH_OK: "#43a047", AUTH_FAIL: "#e53935", COMMAND: "#1e88e5",
  SESSION_END: "#757575", TOKEN_REVOKED: "#8e24aa", RENEWAL: "#00897b",
  SUSPICIOUS_ORIGIN: "#fb8c00", FLOOD_PROTECTION: "#e53935", RATE_LIMITED: "#f4511e",
};

// ---------------------------------------------------------------------------
// Code section
// ---------------------------------------------------------------------------

interface CodeSectionProps {
  token: Token;
}

function CodeSection({ token }: CodeSectionProps) {
  const [useAliases, setUseAliases] = useState(false);
  const [tab, setTab]   = useState<"web" | "wordpress">("web");

  const haUrl = window.location.origin;

  const cardSnippet = tab === "web"
    ? buildCardSnippet(token, useAliases, haUrl)
    : buildWordPressSnippet(token, useAliases, haUrl);

  return (
    <section style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 12 }}>
        Your widget code
      </h3>

      {/* Step 1 */}
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
        Step 1: Add to your page &lt;head&gt; once (click to copy)
      </p>
      <div style={{ marginBottom: 16 }}>
        <CopyablePre text={WIDGET_SCRIPT} />
      </div>

      {/* Step 2 tabs */}
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
        Step 2: Paste where you want the widget (click to copy)
      </p>
      <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
        {(["web", "wordpress"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={t === "web" ? "hrv-tab-left" : "hrv-tab-right"}
            style={{
              background: tab === t ? "var(--primary-color,#6200ea)" : "var(--primary-background-color,#fff)",
              color: tab === t ? "#fff" : "var(--primary-text-color,#212121)",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === "web" ? "Web page" : "WordPress"}
          </button>
        ))}
      </div>
      <CopyablePre text={cardSnippet} />

      {/* Alias toggle - below Step 2 */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={useAliases}
          onChange={e => setUseAliases(e.target.checked)}
          disabled={token.entities.every(e => !e.alias)}
        />
        Use alias
        <span
          title="Aliases hide your real entity IDs from the page source. Both formats work against the same token."
          style={{ fontSize: 11, color: "var(--primary-color,#6200ea)", cursor: "help" }}
        >
          [?]
        </span>
      </label>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sessions panel
// ---------------------------------------------------------------------------

interface SessionsPanelProps {
  tokenId: string;
}

function SessionsPanel({ tokenId }: SessionsPanelProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [termAll,  setTermAll]  = useState(false);

  const load = useCallback(() => {
    api.sessions.list(tokenId).then(setSessions).catch(() => {}).finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); const id = setInterval(load, 15_000); return () => clearInterval(id); }, [load]);

  const terminate = async (sid: string) => {
    await api.sessions.terminate(sid).catch(() => {});
    load();
  };

  const terminateAll = async () => {
    await api.sessions.terminateAll(tokenId).catch(() => {});
    setTermAll(false);
    load();
  };

  if (loading) return <Spinner size={24} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
          Active Sessions ({sessions.length})
        </h3>
        {sessions.length > 0 && (
          <button
            onClick={() => setTermAll(true)}
            style={{ fontSize: 12, color: "#c62828", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
          >
            Terminate all
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
          No active sessions. Sessions appear here when someone opens a page with this widget embedded.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map(s => (
            <div key={s.session_id} className="hrv-inset" style={{ fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <code style={{ flex: 1, fontSize: 11, color: "var(--secondary-text-color,#616161)" }}>
                  {s.session_id.slice(0, 16)}...
                </code>
                <button
                  onClick={() => terminate(s.session_id)}
                  style={{ fontSize: 11, color: "#c62828", background: "none", border: "none", cursor: "pointer" }}
                >
                  Terminate
                </button>
              </div>
              <div style={{ color: "var(--secondary-text-color,#616161)", lineHeight: 1.7 }}>
                <div>Origin: {s.origin ?? "unknown"}</div>
                <div>Connected: {fmtTimeAgo(s.issued_at)}</div>
                <div>Entities: {s.subscribed_entity_ids.join(", ") || "none"}</div>
                <div>Renewals: {s.renewal_count}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {termAll && (
        <ConfirmDialog
          title="Terminate all sessions"
          message="All active sessions for this token will be closed immediately."
          confirmLabel="Terminate all"
          confirmDestructive
          onConfirm={terminateAll}
          onCancel={() => setTermAll(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity panel
// ---------------------------------------------------------------------------

const ACTIVITY_TYPE_OPTIONS = [
  "all", "AUTH_OK", "AUTH_FAIL", "COMMAND", "SESSION_END",
  "RENEWAL", "SUSPICIOUS_ORIGIN", "FLOOD_PROTECTION", "RATE_LIMITED",
] as const;

type ActivityTypeFilter = typeof ACTIVITY_TYPE_OPTIONS[number];

type ActivityDateRange = "1h" | "24h" | "7d" | "all";

const ACTIVITY_DATE_OPTIONS: { value: ActivityDateRange; label: string }[] = [
  { value: "1h",  label: "Last hour"  },
  { value: "24h", label: "Last 24h"   },
  { value: "7d",  label: "Last 7 days"},
  { value: "all", label: "All time"   },
];

function sinceForActivityRange(range: ActivityDateRange): string | undefined {
  if (range === "all") return undefined;
  const ms: Record<Exclude<ActivityDateRange, "all">, number> = {
    "1h":  60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d":  7 * 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() - ms[range as Exclude<ActivityDateRange, "all">]).toISOString();
}

interface ActivityPanelProps {
  tokenId: string;
}

function ActivityPanel({ tokenId }: ActivityPanelProps) {
  const [page,       setPage]       = useState<ActivityPage | null>(null);
  const [offset,     setOffset]     = useState(0);
  const [expanded,   setExpanded]   = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>("all");
  const [dateRange,  setDateRange]  = useState<ActivityDateRange>("24h");
  const LIMIT = 20;

  useEffect(() => {
    const params: Parameters<typeof api.activity.list>[0] = { token_id: tokenId, offset, limit: LIMIT };
    if (typeFilter !== "all") params.event_type = typeFilter;
    const since = sinceForActivityRange(dateRange);
    if (since) params.since = since;
    api.activity.list(params).then(p => { setPage(p); setExpanded(null); }).catch(() => {});
  }, [tokenId, offset, typeFilter, dateRange]);

  if (!page) return <Spinner size={24} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", flex: 1 }}>
          Activity
        </h3>
        <select
          value={dateRange}
          onChange={e => { setDateRange(e.target.value as ActivityDateRange); setOffset(0); }}
          className="hrv-select-sm"
          aria-label="Date range"
        >
          {ACTIVITY_DATE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value as ActivityTypeFilter); setOffset(0); }}
          className="hrv-select-sm"
          aria-label="Event type"
        >
          {ACTIVITY_TYPE_OPTIONS.map(t => (
            <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
          ))}
        </select>
      </div>

      {page.events.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>No activity yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {page.events.map(ev => (
            <li key={ev.id}>
              <button
                onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "6px 0",
                  cursor: "pointer",
                  fontSize: 12,
                  borderBottom: "1px solid var(--divider-color,#f5f5f5)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: EVENT_TYPE_COLORS[ev.type] ?? "#9e9e9e", flexShrink: 0 }} />
                <span style={{ fontWeight: 500, color: "var(--primary-text-color,#212121)", minWidth: 110 }}>{ev.type}</span>
                <span style={{ flex: 1, color: "var(--secondary-text-color,#9e9e9e)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.origin ?? ev.entity_id ?? ev.action ?? ""}
                </span>
                <span style={{ color: "var(--secondary-text-color,#9e9e9e)", fontSize: 11, whiteSpace: "nowrap" }}>
                  {fmtTimeAgo(ev.timestamp)}
                </span>
              </button>
              {expanded === ev.id && (
                <div className="hrv-inset-sm" style={{ margin: "2px 0 4px", fontSize: 11, color: "var(--secondary-text-color,#616161)", lineHeight: 1.8 }}>
                  {ev.session_id && <div>Session: {ev.session_id}</div>}
                  {ev.origin     && <div>Origin: {ev.origin}</div>}
                  {ev.entity_id  && <div>Entity: {ev.entity_id}</div>}
                  {ev.action     && <div>Action: {ev.action}</div>}
                  {ev.code       && <div>Code: {ev.code}</div>}
                  {ev.message    && <div>Message: {ev.message}</div>}
                  <div>Time: {new Date(ev.timestamp).toLocaleString()}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {page.total > LIMIT && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, fontSize: 12 }}>
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - LIMIT))} className="hrv-btn-sm">Prev</button>
          <span style={{ flex: 1, textAlign: "center", color: "var(--secondary-text-color,#616161)" }}>{offset + 1}-{Math.min(page.total, offset + LIMIT)} of {page.total}</span>
          <button disabled={offset + LIMIT >= page.total} onClick={() => setOffset(offset + LIMIT)} className="hrv-btn-sm">Next</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// OriginsEditor
// ---------------------------------------------------------------------------

interface OriginsEditorProps {
  token: Token;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token) => void;
  setError: (e: string | null) => void;
}

const ORIGIN_CUSTOM = "__custom__";

function OriginsEditor({ token, saving, setSaving, setToken, setError }: OriginsEditorProps) {
  const [allOrigins,  setAllOrigins]  = useState<string[]>([]);
  const [usingCustom, setUsingCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const readonly = token.status === "revoked" || token.status === "expired";

  const baseOrigin = token.origins.allowed[0] ?? "";
  const paths = token.origins.allow_paths;
  const displayUrls: string[] = token.origins.allow_any
    ? []
    : paths.length > 0
      ? paths.map(p => `${baseOrigin}${p}`)
      : baseOrigin ? [baseOrigin] : [];

  // Load all origins from other tokens for the dropdown.
  useEffect(() => {
    api.tokens.list().then(tokens => {
      const seen = new Set<string>();
      tokens.forEach(t => {
        if (t.token_id === token.token_id) return;
        if (!t.origins.allow_any) {
          t.origins.allowed.forEach(o => {
            if (t.origins.allow_paths.length > 0) {
              t.origins.allow_paths.forEach(p => seen.add(`${o}${p}`));
            } else {
              seen.add(o);
            }
          });
        }
      });
      setAllOrigins(Array.from(seen));
    }).catch(() => {});
  }, [token.token_id]);

  const saveOrigins = async (origins: Token["origins"]) => {
    setSaving(true);
    try {
      const updated = await api.tokens.update(token.token_id, { origins });
      setToken(updated);
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const toggleAllowAny = () => {
    if (readonly || saving) return;
    saveOrigins({ allow_any: !token.origins.allow_any, allowed: token.origins.allowed, allow_paths: token.origins.allow_paths });
  };

  const removeUrl = (displayUrl: string) => {
    if (readonly || saving) return;
    try {
      const u = new URL(displayUrl);
      const path = (u.pathname && u.pathname !== "/") ? u.pathname : null;
      if (path) {
        const newPaths = paths.filter(p => p !== path);
        saveOrigins({ allow_any: false, allowed: newPaths.length > 0 ? [baseOrigin] : [], allow_paths: newPaths });
      } else {
        saveOrigins({ allow_any: false, allowed: [], allow_paths: [] });
      }
    } catch { /* bad URL */ }
  };

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || readonly || saving) return;
    try {
      const u = new URL(trimmed);
      const newOrigin = u.origin;
      const path = (u.pathname && u.pathname !== "/") ? u.pathname : null;
      if (path) {
        const origin = baseOrigin || newOrigin;
        const newPaths = [...paths.filter(p => p !== path), path];
        saveOrigins({ allow_any: false, allowed: [origin], allow_paths: newPaths });
      } else {
        saveOrigins({ allow_any: false, allowed: [newOrigin], allow_paths: paths });
      }
      setUsingCustom(false);
      setCustomInput("");
    } catch { setError("Invalid URL. Enter a full URL including https://"); }
  };

  // Origins from other tokens that aren't already on this token.
  const otherOrigins = allOrigins.filter(o => !displayUrls.includes(o));
  const hasDropdown = otherOrigins.length > 0;

  return (
    <section style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 10 }}>
        Origins
      </h3>

      {!readonly && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={token.origins.allow_any}
            onChange={toggleAllowAny}
            disabled={saving}
            style={{ accentColor: "var(--primary-color,#6200ea)" }}
          />
          Allow from any website
        </label>
      )}

      {token.origins.allow_any ? (
        <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
          {token.entities.some(e => e.capabilities === "read-write") && (
            <div className="hrv-alert-warn-plain" style={{ marginBottom: 4 }}>
              This token allows write access from any website.
            </div>
          )}
          {readonly && <div>Any website</div>}
        </div>
      ) : (
        <>
          {/* Current URLs with Delete button */}
          {displayUrls.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--secondary-text-color,#9e9e9e)", marginBottom: 6 }}>
              No origin set.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
            {displayUrls.map(url => (
              <div key={url} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <span style={{ flex: 1, color: "var(--primary-text-color,#212121)" }}>{url}</span>
                {!readonly && (
                  <button
                    onClick={() => removeUrl(url)}
                    disabled={saving}
                    style={{ fontSize: 11, color: "#c62828", background: "none", border: "1px solid #c62828", borderRadius: 4, cursor: "pointer", padding: "1px 8px" }}
                  >
                    Delete URL
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add new URL - wizard-style select dropdown */}
          {!readonly && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {hasDropdown && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select
                    value={usingCustom ? ORIGIN_CUSTOM : ""}
                    onChange={e => {
                      const v = e.target.value;
                      if (v === ORIGIN_CUSTOM) {
                        setUsingCustom(true);
                      } else if (v) {
                        addUrl(v);
                      }
                    }}
                    disabled={saving}
                    className="hrv-select-sm"
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Add a URL --</option>
                    {otherOrigins.map(o => <option key={o} value={o}>{o}</option>)}
                    <option value={ORIGIN_CUSTOM}>Enter a new URL...</option>
                  </select>
                </div>
              )}
              {(usingCustom || !hasDropdown) && (
                <input
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addUrl(customInput); }}
                  placeholder="https://example.com/page.html"
                  disabled={saving}
                  autoFocus={hasDropdown}
                  className="hrv-input-sm"
                />
              )}
              <p style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", margin: 0 }}>
                Site only (e.g. https://example.com) or a specific page (e.g. https://example.com/page.html).
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// TokenDetail
// ---------------------------------------------------------------------------

export function TokenDetail({ tokenId, onBack, onDeleted }: TokenDetailProps) {
  const [token,         setToken]         = useState<Token | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [editLabel,     setEditLabel]     = useState("");
  const [editExpiry,    setEditExpiry]    = useState("");
  const [saving,        setSaving]        = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(() => {
    api.tokens.get(tokenId)
      .then(t => {
        setToken(t);
        setEditLabel(t.label);
        setEditExpiry(t.expires ? t.expires.slice(0, 16) : "");
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  const saveEdit = async (currentLabel: string) => {
    if (!token || currentLabel === token.label) return;
    setSaving(true);
    const prevCreatedByName = token.created_by_name;
    try {
      const updated = await api.tokens.update(token.token_id, { label: currentLabel });
      setToken({ ...updated, created_by_name: prevCreatedByName });
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const saveExpiry = async (val: string) => {
    if (!token) return;
    // Treat the datetime-local value ("YYYY-MM-DDTHH:MM") as UTC by appending ":00Z".
    // This avoids timezone shifts when the value is round-tripped through toISOString().
    let newExpires: string | null = null;
    if (val) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return; // reject malformed
      newExpires = val + ":00Z";
    }
    const current = token.expires ? token.expires.slice(0, 16) : "";
    if (val === current) return;
    setSaving(true);
    const prevCreatedByName = token.created_by_name;
    try {
      const updated = await api.tokens.update(token.token_id, { expires: newExpires });
      setToken({ ...updated, created_by_name: prevCreatedByName });
      setEditExpiry(updated.expires ? updated.expires.slice(0, 16) : "");
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const doRevoke = async () => {
    if (!token) return;
    try {
      await api.tokens.revoke(token.token_id);
      setConfirmRevoke(false);
      load();
    } catch (e) { setError(String(e)); }
  };

  const doDelete = async () => {
    if (!token) return;
    try {
      await api.tokens.delete(token.token_id);
      setConfirmDelete(false);
      onDeleted();
    } catch (e) { setError(String(e)); }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 32 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: 32 }}>
        {error && <ErrorBanner message={error} />}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Header */}
      <div style={{ padding: "12px 20px 12px", borderBottom: "1px solid var(--divider-color,#e0e0e0)", background: "var(--primary-background-color,#fff)", flexShrink: 0 }}>
        <button
          onClick={onBack}
          className="hrv-btn-link"
          style={{ marginBottom: 8 }}
        >
          Back to tokens
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <StatusBadge status={token.status} />
          <input
            value={editLabel}
            onChange={e => setEditLabel(e.target.value)}
            onBlur={e => saveEdit(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
            disabled={saving || token.status === "revoked" || token.status === "expired"}
            style={{ flex: 1, minWidth: 200, padding: "6px 10px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, fontSize: 16, fontWeight: 600, background: "var(--primary-background-color,#fff)", color: "var(--primary-text-color,#212121)" }}
          />
          {token.status !== "revoked" && (
            <button onClick={() => setConfirmRevoke(true)} className="hrv-btn-danger">
              Revoke
            </button>
          )}
          {(token.status === "revoked" || token.status === "expired") && (
            <button onClick={() => setConfirmDelete(true)} className="hrv-btn-danger">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Split body */}
      <div className="hrv-detail-split">
        {/* Left panel */}
        <div className="hrv-detail-left">

          {/* Created by */}
          <div style={{ marginBottom: 16, fontSize: 12, color: "var(--secondary-text-color,#616161)" }}>
            Created {fmtDateLong(token.created_at)} by {token.created_by_name ?? token.created_by}
          </div>

          {/* Entities */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 10 }}>
              Entities ({token.entities.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {token.entities.map(e => {
                const isRW = e.capabilities === "read-write";
                const canEdit = token.status !== "revoked" && token.status !== "expired" && !saving;
                const toggleCap = async (newCap: "read" | "read-write") => {
                  if (!canEdit) return;
                  const updated = token.entities.map(en =>
                    en.entity_id === e.entity_id ? { ...en, capabilities: newCap } : en
                  );
                  setSaving(true);
                  const prevCreatedByName = token.created_by_name;
                  try {
                    const t = await api.tokens.update(token.token_id, { entities: updated as Token["entities"] });
                    setToken({ ...t, created_by_name: prevCreatedByName });
                  } catch (err) { setError(String(err)); }
                  finally { setSaving(false); }
                };
                return (
                  <div key={e.entity_id} className="hrv-inset-sm" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: "var(--primary-text-color,#212121)" }}>{e.entity_id}</div>
                      {e.alias && (
                        <div style={{ fontSize: 12, color: "var(--secondary-text-color,#616161)", marginTop: 2 }}>alias: {e.alias}</div>
                      )}
                    </div>
                    <select
                      value={e.capabilities}
                      onChange={ev => { if (canEdit) toggleCap(ev.target.value as "read" | "read-write"); }}
                      disabled={!canEdit}
                      className="hrv-select-sm"
                      style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 6px",
                        background: isRW ? "#e3f2fd" : "#f3e5f5",
                        color: isRW ? "#1565c0" : "#6a1b9a",
                        border: `1px solid ${isRW ? "#90caf9" : "#ce93d8"}`,
                        borderRadius: 10,
                      }}
                    >
                      <option value="read">READ</option>
                      <option value="read-write">READ-WRITE</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Origins */}
          <OriginsEditor
            token={token}
            saving={saving}
            setSaving={setSaving}
            setToken={t => setToken({ ...t, created_by_name: token.created_by_name })}
            setError={setError}
          />

          {/* Expiry / schedule */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 6 }}>
              Expiry
            </h3>
            {token.status === "revoked" || token.status === "expired" ? (
              <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
                {token.expires ? new Date(token.expires).toLocaleString() : "No expiry set"}
              </div>
            ) : (() => {
              const expiryFmt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
              const expiryInvalid = editExpiry !== "" && !expiryFmt.test(editExpiry);
              const savedValue = token.expires ? token.expires.slice(0, 16) : "";
              const expiryDirty = editExpiry !== savedValue;
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <input
                      type="datetime-local"
                      value={editExpiry}
                      onChange={e => setEditExpiry(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveExpiry(editExpiry); }}
                      disabled={saving}
                      className="hrv-input"
                      style={{ fontSize: 13, borderColor: expiryInvalid ? "#e53935" : undefined }}
                    />
                    <button
                      onClick={() => saveExpiry(editExpiry)}
                      disabled={saving || expiryInvalid || !expiryDirty}
                      className="hrv-btn-sm"
                    >
                      Apply
                    </button>
                    {editExpiry && (
                      <button
                        onClick={() => saveExpiry("")}
                        disabled={saving}
                        className="hrv-btn-sm"
                        title="Clear expiry (never expires)"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {expiryInvalid && (
                    <div style={{ fontSize: 12, color: "#e53935", marginTop: 4 }}>
                      Invalid date format.
                    </div>
                  )}
                  {!editExpiry && !expiryInvalid && (
                    <div style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)", marginTop: 4 }}>
                      No expiry set - token never expires
                    </div>
                  )}
                  {editExpiry && !expiryInvalid && !expiryDirty && (
                    <div style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)", marginTop: 4 }}>
                      Expires {new Date(editExpiry + ":00Z").toLocaleString()}
                    </div>
                  )}
                </>
              );
            })()}
            {token.active_schedule && (
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
                Schedule: {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].filter((_, i) => token.active_schedule!.days.includes(i)).join(", ")}
                {token.active_schedule.windows.map((w, i) => (
                  <span key={i}> {w.start}-{w.end}</span>
                ))}
              </div>
            )}
          </section>

          {/* Code section - hidden for revoked/expired tokens */}
          {token.status !== "revoked" && token.status !== "expired" && (
            <CodeSection token={token} />
          )}
        </div>

        {/* Right panel */}
        <div className="hrv-detail-right">
          <SessionsPanel tokenId={tokenId} />
          <hr style={{ border: "none", borderTop: "1px solid var(--divider-color,#e0e0e0)" }} />
          <ActivityPanel tokenId={tokenId} />
        </div>
      </div>

      {confirmRevoke && (
        <ConfirmDialog
          title="Revoke token"
          message={`Revoking "${token.label}" will immediately terminate all active sessions.`}
          confirmLabel="Revoke"
          confirmDestructive
          onConfirm={doRevoke}
          onCancel={() => setConfirmRevoke(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete token"
          message={`Delete "${token.label}" and all associated activity log entries permanently?`}
          confirmLabel="Delete"
          confirmDestructive
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
