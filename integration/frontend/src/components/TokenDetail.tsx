/**
 * TokenDetail.tsx - Token detail split-pane view.
 *
 * Left panel (55%): token info (entities, origins, schedule, security,
 * rate limits) and generated code snippet with alias toggle.
 * Right panel (45%): active sessions and per-token activity log.
 *
 * Edit mode switches left panel fields to editable inputs.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Token, Session, ActivityEvent, ActivityPage } from "../types";
import { api } from "../api";
import { StatusBadge, CopyButton, ConfirmDialog, Spinner, ErrorBanner } from "./Shared";

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

const HA_URL = window.location.origin;
const WIDGET_SCRIPT = `<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/dist/harvest.min.js"></script>`;

function buildInitScript(token: Token): string {
  return `<script>
HArvest.config({
  haUrl: "${HA_URL}",
  token: "${token.token_id}",
});
</script>`;
}

function buildCardSnippet(token: Token, useAliases: boolean): string {
  const isGroup = token.entities.length > 1;
  const cards = token.entities.map(e => {
    const attr = useAliases && e.alias ? `alias="${e.alias}"` : `entity="${e.entity_id}"`;
    return `  <hrv-card ${attr}></hrv-card>`;
  });
  if (isGroup) {
    return `<hrv-group>\n${cards.join("\n")}\n</hrv-group>`;
  }
  return cards[0]?.trimStart() ?? "";
}

function buildWordPressSnippet(token: Token, useAliases: boolean): string {
  const cards = token.entities.map(e => {
    const attr = useAliases && e.alias ? `data-alias="${e.alias}"` : `data-entity="${e.entity_id}"`;
    return `  <div class="hrv-mount" ${attr}></div>`;
  });
  const inner = token.entities.length > 1
    ? `<div class="hrv-group">\n${cards.join("\n")}\n</div>`
    : cards[0] ?? "";
  return inner;
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
  const [tab, setTab] = useState<"web" | "wordpress">("web");

  const initScript   = buildInitScript(token);
  const cardSnippet  = tab === "web"
    ? buildCardSnippet(token, useAliases)
    : buildWordPressSnippet(token, useAliases);

  const codeStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 13,
    background: "#1e1e2e",
    color: "#cdd6f4",
    padding: "12px 14px",
    borderRadius: 8,
    margin: 0,
    overflowX: "auto",
    whiteSpace: "pre",
    lineHeight: 1.6,
  };

  return (
    <section style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 12 }}>
        Your widget code
      </h3>

      {/* Alias toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 13, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={useAliases}
          onChange={e => setUseAliases(e.target.checked)}
          disabled={token.entities.every(e => !e.alias)}
        />
        Show as aliases
        <span
          title="Aliases hide your real entity IDs from the page source. Both formats work against the same token."
          style={{ fontSize: 11, color: "var(--primary-color,#6200ea)", cursor: "help" }}
        >
          [?]
        </span>
      </label>

      {/* Step 1 */}
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
        Step 1: Add to your page &lt;head&gt; once
      </p>
      <pre style={codeStyle}>{WIDGET_SCRIPT + "\n" + initScript}</pre>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, marginBottom: 16 }}>
        <CopyButton text={WIDGET_SCRIPT + "\n" + initScript} label="Copy step 1" size="sm" />
      </div>

      {/* Step 2 tabs */}
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
        Step 2: Paste where you want the widget
      </p>
      <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
        {(["web", "wordpress"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "5px 14px",
              border: "1px solid var(--divider-color,#e0e0e0)",
              borderRight: t === "web" ? "none" : undefined,
              borderRadius: t === "web" ? "6px 0 0 6px" : "0 6px 6px 0",
              background: tab === t ? "var(--primary-color,#6200ea)" : "var(--primary-background-color,#fff)",
              color: tab === t ? "#fff" : "var(--primary-text-color,#212121)",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {t === "web" ? "Web page" : "WordPress"}
          </button>
        ))}
      </div>
      <pre style={codeStyle}>{cardSnippet}</pre>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <CopyButton text={cardSnippet} label="Copy step 2" size="sm" />
      </div>
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
            <div key={s.session_id} style={{ background: "var(--secondary-background-color,#f5f5f5)", borderRadius: 8, padding: "10px 12px", fontSize: 12 }}>
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

interface ActivityPanelProps {
  tokenId: string;
  onViewAll: () => void;
}

function ActivityPanel({ tokenId, onViewAll }: ActivityPanelProps) {
  const [page, setPage]       = useState<ActivityPage | null>(null);
  const [offset, setOffset]   = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const LIMIT = 20;

  const load = useCallback(() => {
    api.activity.list({ token_id: tokenId, offset, limit: LIMIT })
      .then(setPage).catch(() => {});
  }, [tokenId, offset]);

  useEffect(() => { load(); }, [load]);

  if (!page) return <Spinner size={24} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
          Activity
        </h3>
        <button
          onClick={onViewAll}
          style={{ fontSize: 12, color: "var(--primary-color,#6200ea)", background: "none", border: "none", cursor: "pointer" }}
        >
          View all
        </button>
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
                  {ev.origin ?? ev.entity_id ?? ""}
                </span>
                <span style={{ color: "var(--secondary-text-color,#9e9e9e)", fontSize: 11, whiteSpace: "nowrap" }}>
                  {fmtTimeAgo(ev.timestamp)}
                </span>
              </button>
              {expanded === ev.id && (
                <div style={{ background: "var(--secondary-background-color,#f5f5f5)", borderRadius: 6, padding: "8px 10px", margin: "2px 0 4px", fontSize: 11, color: "var(--secondary-text-color,#616161)", lineHeight: 1.8 }}>
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
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - LIMIT))} style={{ padding: "3px 10px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 4, background: "none", cursor: "pointer" }}>Prev</button>
          <span style={{ flex: 1, textAlign: "center", color: "var(--secondary-text-color,#616161)" }}>{offset + 1}-{Math.min(page.total, offset + LIMIT)} of {page.total}</span>
          <button disabled={offset + LIMIT >= page.total} onClick={() => setOffset(offset + LIMIT)} style={{ padding: "3px 10px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 4, background: "none", cursor: "pointer" }}>Next</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TokenDetail
// ---------------------------------------------------------------------------

export function TokenDetail({ tokenId, onBack, onDeleted }: TokenDetailProps) {
  const [token,         setToken]         = useState<Token | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [editMode,      setEditMode]      = useState(false);
  const [editLabel,     setEditLabel]     = useState("");
  const [saving,        setSaving]        = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(() => {
    api.tokens.get(tokenId)
      .then(t => { setToken(t); setEditLabel(t.label); })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const saveEdit = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.tokens.update(token.token_id, { label: editLabel });
      setToken(updated);
      setEditMode(false);
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
          style={{ background: "none", border: "none", color: "var(--primary-color,#6200ea)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 8, fontWeight: 500 }}
        >
          Back to tokens
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {editMode ? (
            <input
              value={editLabel}
              onChange={e => setEditLabel(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "6px 10px", border: "1px solid var(--primary-color,#6200ea)", borderRadius: 6, fontSize: 16, fontWeight: 600 }}
              autoFocus
            />
          ) : (
            <h2 style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "var(--primary-text-color,#212121)", margin: 0 }}>
              {token.label}
            </h2>
          )}
          <StatusBadge status={token.status} />

          {editMode ? (
            <>
              <button onClick={saveEdit} disabled={saving} style={{ padding: "6px 16px", border: "none", borderRadius: 6, background: "var(--primary-color,#6200ea)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setEditMode(false); setEditLabel(token.label); }} style={{ padding: "6px 16px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", fontWeight: 500, cursor: "pointer", fontSize: 13 }}>
                Discard
              </button>
            </>
          ) : (
            <>
              {token.status !== "revoked" && token.status !== "expired" && (
                <button onClick={() => setEditMode(true)} style={{ padding: "6px 14px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", fontWeight: 500, cursor: "pointer", fontSize: 13 }}>
                  Edit
                </button>
              )}
              <div style={{ position: "relative" }} ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="More actions"
                  style={{ padding: "6px 12px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 14 }}
                >
                  ...
                </button>
                {menuOpen && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--primary-background-color,#fff)", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 200, minWidth: 160, overflow: "hidden" }}>
                    {token.status !== "revoked" && (
                      <button onClick={() => { setConfirmRevoke(true); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", border: "none", background: "none", fontSize: 14, color: "#c62828", cursor: "pointer" }}>
                        Revoke
                      </button>
                    )}
                    {(token.status === "revoked" || token.status === "expired") && (
                      <button onClick={() => { setConfirmDelete(true); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", border: "none", background: "none", fontSize: 14, color: "#c62828", cursor: "pointer" }}>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--secondary-text-color,#616161)" }}>
          <code style={{ fontSize: 12 }}>{token.token_id.slice(0, 18)}...</code>
          <CopyButton text={token.token_id} label="Copy ID" size="sm" />
          <span style={{ marginLeft: 8 }}>Created {fmtDateLong(token.created_at)} by {token.created_by}</span>
        </div>
      </div>

      {/* Split body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ flex: "0 0 55%", overflow: "auto", padding: "20px 20px 20px 20px", borderRight: "1px solid var(--divider-color,#e0e0e0)" }}>

          {/* Entities */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 10 }}>
              Entities ({token.entities.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {token.entities.map(e => (
                <div key={e.entity_id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--secondary-background-color,#f5f5f5)", borderRadius: 6, fontSize: 13 }}>
                  <span style={{ flex: 1, fontWeight: 500, color: "var(--primary-text-color,#212121)" }}>{e.entity_id}</span>
                  {e.alias && (
                    <span style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)" }}>alias: {e.alias}</span>
                  )}
                  <span style={{ padding: "2px 8px", borderRadius: 10, background: e.capability === "read-write" ? "#e3f2fd" : "#f3e5f5", color: e.capability === "read-write" ? "#1565c0" : "#6a1b9a", fontSize: 11, fontWeight: 600 }}>
                    {e.capability === "read-write" ? "READ-WRITE" : "READ"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Origins */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 10 }}>
              Origins
            </h3>
            {token.origins.allow_any && token.entities.some(e => e.capability === "read-write") && (
              <div style={{ padding: "8px 12px", background: "#fff3e0", borderRadius: 6, fontSize: 13, color: "#e65100", marginBottom: 8 }}>
                This token allows write access from any website.
              </div>
            )}
            <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)", lineHeight: 1.7 }}>
              {token.origins.allow_any ? (
                <div>Allow: any website</div>
              ) : (
                token.origins.allowed.map(o => <div key={o}>{o}</div>)
              )}
              {token.origins.allow_paths.length > 0 && (
                <div style={{ marginTop: 4 }}>Paths: {token.origins.allow_paths.join(", ")}</div>
              )}
            </div>
          </section>

          {/* Expiry / schedule */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)", marginBottom: 6 }}>
              Expiry
            </h3>
            <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
              {token.expires ? new Date(token.expires).toLocaleString() : "Never"}
            </div>
            {token.active_schedule && (
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
                Schedule: {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].filter((_, i) => token.active_schedule!.days.includes(i)).join(", ")}
                {token.active_schedule.windows.map((w, i) => (
                  <span key={i}> {w.start}-{w.end}</span>
                ))}
              </div>
            )}
          </section>

          {/* Code section */}
          <CodeSection token={token} />
        </div>

        {/* Right panel */}
        <div style={{ flex: "0 0 45%", overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <SessionsPanel tokenId={tokenId} />
          <hr style={{ border: "none", borderTop: "1px solid var(--divider-color,#e0e0e0)" }} />
          <ActivityPanel tokenId={tokenId} onViewAll={() => {}} />
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
