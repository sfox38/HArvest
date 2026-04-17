/**
 * Sessions.tsx - Global active sessions screen.
 *
 * Shows all active sessions across all tokens in a sortable table.
 * Filter bar: token selector, Refresh, Terminate all.
 * Each row is expandable for full session detail.
 * Auto-refreshes every 15 seconds.
 */

import { useState, useEffect, useCallback } from "react";
import type { Session, Token } from "../types";
import { api } from "../api";
import { ConfirmDialog, Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtTimeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

type SortCol = "connected" | "token" | "page" | "ip" | "entities";

// ---------------------------------------------------------------------------
// SessionRow
// ---------------------------------------------------------------------------

interface SessionRowProps {
  session: Session;
  tokenLabel: string;
  expanded: boolean;
  onToggle: () => void;
  onTerminate: () => void;
  onSelectToken: (tokenId: string) => void;
}

function SessionRow({ session: s, tokenLabel, expanded, onToggle, onTerminate, onSelectToken }: SessionRowProps) {
  const pageDisplay = s.referer || s.origin || "-";

  return (
    <>
      <tr onClick={onToggle} className="hrv-activity-row" aria-expanded={expanded}>
        <td className="hrv-activity-expand-cell">
          <span className="hrv-activity-expand-btn">{expanded ? "-" : "+"}</span>
        </td>
        <td className="hrv-activity-td hrv-activity-td-time">
          {fmtTimeAgo(s.issued_at)}
        </td>
        <td className="hrv-activity-td hrv-activity-td-token">
          <button
            className="hrv-activity-token-link"
            onClick={e => { e.stopPropagation(); onSelectToken(s.widget_token_id); }}
          >
            {tokenLabel}
          </button>
        </td>
        <td className="hrv-activity-td" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pageDisplay}
        </td>
        <td className="hrv-activity-td">
          {s.ip_address ?? "-"}
        </td>
        <td className="hrv-activity-td">
          {s.subscribed_entity_ids.length}
        </td>
        <td className="hrv-activity-td" style={{ whiteSpace: "nowrap" }}>
          <button
            onClick={e => { e.stopPropagation(); onTerminate(); }}
            style={{ fontSize: 11, color: "#c62828", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
          >
            Terminate
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: "0 10px 10px" }}>
            <div className="hrv-activity-row-detail">
              <div><strong>Session ID:</strong> {s.session_id}</div>
              <div><strong>Token:</strong> {tokenLabel} ({s.widget_token_id})</div>
              {s.referer  && <div><strong>Page:</strong> {s.referer}</div>}
              {s.origin   && <div><strong>Origin:</strong> {s.origin}</div>}
              {s.ip_address && <div><strong>IP:</strong> {s.ip_address}</div>}
              <div><strong>Connected:</strong> {fmtDateTime(s.issued_at)}</div>
              <div><strong>Expires:</strong> {fmtDateTime(s.expires_at)}</div>
              <div><strong>Renewals:</strong> {s.renewal_count}</div>
              {s.subscribed_entity_ids.length > 0 && (
                <div><strong>Entities:</strong> {s.subscribed_entity_ids.join(", ")}</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// SortableTh
// ---------------------------------------------------------------------------

function SortableTh({ col, label, sortCol, sortDir, onSort }: {
  col: SortCol; label: string;
  sortCol: SortCol | null; sortDir: "asc" | "desc";
  onSort: (c: SortCol) => void;
}) {
  const active = sortCol === col;
  return (
    <th
      className={`hrv-activity-th-sort${active ? " hrv-activity-th-active" : ""}`}
      onClick={() => onSort(col)}
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      {label}
      {active && <span className="hrv-activity-sort-indicator">{sortDir === "asc" ? " ^" : " v"}</span>}
    </th>
  );
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

interface SessionsProps {
  onSelectToken: (tokenId: string) => void;
}

export function Sessions({ onSelectToken }: SessionsProps) {
  const [sessions,    setSessions]    = useState<Session[]>([]);
  const [tokens,      setTokens]      = useState<Token[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [confirmAll,  setConfirmAll]  = useState(false);
  const [tokenFilter, setTokenFilter] = useState<string>("all");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [sortCol,     setSortCol]     = useState<SortCol | null>(null);
  const [sortDir,     setSortDir]     = useState<"asc" | "desc">("desc");

  const load = useCallback(() => {
    Promise.all([api.sessions.list(), api.tokens.list()])
      .then(([s, t]) => { setSessions(s); setTokens(t); })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, [load]);

  const terminate = async (sid: string) => {
    await api.sessions.terminate(sid).catch(e => setError(String(e)));
    load();
  };

  const terminateAll = async () => {
    try {
      await Promise.all(filtered.map(s => api.sessions.terminate(s.session_id)));
    } catch (e) { setError(String(e)); }
    setConfirmAll(false);
    load();
  };

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  function tokenLabel(tokenId: string): string {
    return tokens.find(t => t.token_id === tokenId)?.label ?? tokenId;
  }

  const filtered = tokenFilter === "all"
    ? sessions
    : sessions.filter(s => s.widget_token_id === tokenFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const f = sortDir === "asc" ? 1 : -1;
    if (sortCol === "connected") return (a.issued_at < b.issued_at ? 1 : -1) * f;
    if (sortCol === "token")     return tokenLabel(a.widget_token_id).localeCompare(tokenLabel(b.widget_token_id)) * f;
    if (sortCol === "page")      return ((a.referer || a.origin || "").localeCompare(b.referer || b.origin || "")) * f;
    if (sortCol === "ip")        return ((a.ip_address || "").localeCompare(b.ip_address || "")) * f;
    if (sortCol === "entities")  return (a.subscribed_entity_ids.length - b.subscribed_entity_ids.length) * f;
    return 0;
  });

  return (
    <div className="hrv-page-sm">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Filter bar */}
      <div className="hrv-activity-filters">
        <select
          value={tokenFilter}
          onChange={e => setTokenFilter(e.target.value)}
          className="hrv-select-sm"
          aria-label="Filter by token"
        >
          <option value="all">All tokens</option>
          {tokens.map(t => (
            <option key={t.token_id} value={t.token_id}>{t.label}</option>
          ))}
        </select>

        <button onClick={load} className="hrv-btn-sm">Refresh</button>

        {filtered.length > 0 && (
          <button onClick={() => setConfirmAll(true)} className="hrv-btn-sm-danger">
            Terminate all
          </button>
        )}

        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
          {filtered.length} active session{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Spinner size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--secondary-text-color,#616161)", fontSize: 14 }}>
            No active sessions. Sessions appear when someone opens a page with a widget embedded.
          </div>
        ) : (
          <table className="hrv-activity-table">
            <thead>
              <tr>
                <th style={{ width: 32 }} />
                <SortableTh col="connected" label="Connected" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="token"     label="Token"     sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="page"      label="Page"      sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="ip"        label="IP"        sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="entities"  label="Entities"  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <th />
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => (
                <SessionRow
                  key={s.session_id}
                  session={s}
                  tokenLabel={tokenLabel(s.widget_token_id)}
                  expanded={expanded === s.session_id}
                  onToggle={() => setExpanded(expanded === s.session_id ? null : s.session_id)}
                  onTerminate={() => terminate(s.session_id)}
                  onSelectToken={onSelectToken}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmAll && (
        <ConfirmDialog
          title="Terminate all sessions"
          message={`Terminate all ${filtered.length} active session${filtered.length !== 1 ? "s" : ""} immediately?`}
          confirmLabel="Terminate all"
          confirmDestructive
          onConfirm={terminateAll}
          onCancel={() => setConfirmAll(false)}
        />
      )}
    </div>
  );
}
