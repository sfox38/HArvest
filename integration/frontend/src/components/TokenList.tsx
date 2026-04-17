/**
 * TokenList.tsx - Token list screen.
 *
 * Displays all tokens with search, filter by status, pagination (20 per page),
 * and a separate collapsible archived (expired/revoked) section.
 * Clicking a token card opens the TokenDetail inline view.
 */

import { useState, useEffect, useCallback } from "react";
import type { Token, TokenStatus } from "../types";
import { api } from "../api";
import { StatusBadge, ConfirmDialog, EmptyState, Spinner, ErrorBanner } from "./Shared";
import { TokenDetail } from "./TokenDetail";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TokenListProps {
  onOpenWizard: () => void;
  initialTokenId: string | null;
  onInitialTokenConsumed: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FilterOption = "all" | TokenStatus;

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all",           label: "All"           },
  { value: "active",        label: "Active"        },
  { value: "expiring_soon", label: "Expiring soon" },
  { value: "inactive",      label: "Inactive"      },
  { value: "expired",       label: "Expired"       },
  { value: "revoked",       label: "Revoked"       },
];

const ARCHIVED_STATUSES: TokenStatus[] = ["expired", "revoked"];
const PAGE_SIZE = 20;

function isArchived(t: Token): boolean {
  return ARCHIVED_STATUSES.includes(t.status);
}

function primaryOrigin(t: Token): string {
  if (t.origins.allow_any) return "any website";
  if (t.origins.allowed.length > 0) return t.origins.allowed[0];
  return "no origin set";
}

function expiryLabel(t: Token): string {
  if (t.status === "revoked") return "Revoked";
  if (!t.expires) return "Never expires";
  const d = new Date(t.expires);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (diffDays < 0) return `Expired ${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return "Expires today";
  if (diffDays <= 7) return `Expires in ${diffDays}d`;
  return `Expires ${d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

// ---------------------------------------------------------------------------
// TokenCard
// ---------------------------------------------------------------------------

interface TokenCardProps {
  token: Token;
  onSelect: () => void;
  onRevoke: (t: Token) => void;
  onDelete: (t: Token) => void;
  onDuplicate: (t: Token) => void;
  highlighted: boolean;
}

function TokenCard({ token: t, onSelect, onRevoke, onDelete, onDuplicate, highlighted }: TokenCardProps) {
  const archived = isArchived(t);

  return (
    <div
      className="hrv-token-card"
      style={{
        boxShadow: highlighted
          ? "0 0 0 2px var(--primary-color,#6200ea)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        opacity: archived ? 0.75 : 1,
      }}
    >
      {/* Row 1: label + status */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onSelect(); }}
        aria-label={`Open token ${t.label}`}
      >
        <span style={{ flex: 1, fontWeight: 600, fontSize: 15, color: "var(--primary-text-color,#212121)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {t.label}
        </span>
        <StatusBadge status={t.status} />
      </div>

      {/* Row 2: origin / entity count / sessions */}
      <div style={{ fontSize: 12, color: "var(--secondary-text-color,#616161)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span>{primaryOrigin(t)}</span>
        <span>{t.entities.length} {t.entities.length === 1 ? "entity" : "entities"}</span>
        {!archived && <span>{t.active_sessions} active {t.active_sessions === 1 ? "session" : "sessions"}</span>}
      </div>

      {/* Row 3: expiry + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
        <span style={{ flex: 1, fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)" }}>
          {expiryLabel(t)}
        </span>

        {!archived && (
          <button onClick={onSelect} className="hrv-btn-sm">Edit</button>
        )}
        <button onClick={() => onDuplicate(t)} className="hrv-btn-sm">Duplicate</button>
        {archived ? (
          <button onClick={() => onDelete(t)} className="hrv-btn-sm-danger">Delete</button>
        ) : (
          <button onClick={() => onRevoke(t)} className="hrv-btn-sm-danger">Revoke</button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination controls
// ---------------------------------------------------------------------------

interface PagingProps {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
  label: string;
}

function Paging({ total, page, pageSize, onPage, label }: PagingProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const start = page * pageSize + 1;
  const end = Math.min(total, (page + 1) * pageSize);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
      <span style={{ flex: 1 }}>Showing {start}-{end} of {total} {label}</span>
      <button onClick={() => onPage(page - 1)} disabled={page === 0} className="hrv-btn-sm">Prev</button>
      <span>Page {page + 1} of {totalPages}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages - 1} className="hrv-btn-sm">Next</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TokenList
// ---------------------------------------------------------------------------

export function TokenList({ onOpenWizard, initialTokenId, onInitialTokenConsumed }: TokenListProps) {
  const [tokens,        setTokens]        = useState<Token[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState<FilterOption>("all");
  const [activePage,    setActivePage]    = useState(0);
  const [archivedPage,  setArchivedPage]  = useState(0);
  const [archivedOpen,  setArchivedOpen]  = useState(false);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<Token | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Token | null>(null);

  const load = useCallback(() => {
    api.tokens.list().then(setTokens).catch(e => setError(String(e))).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Handle initialTokenId prop - open the token detail and refresh the list
  // so a newly-created token appears without requiring a manual browser reload.
  useEffect(() => {
    if (initialTokenId) {
      load();
      setSelectedId(initialTokenId);
      onInitialTokenConsumed();
    }
  }, [initialTokenId, onInitialTokenConsumed, load]);

  const filtered = tokens.filter(t => {
    // Search on label only. Token IDs are random base62 and would produce
    // false positives for single-character queries.
    const matchSearch = !search || t.label.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const active   = filtered.filter(t => !isArchived(t));
  const archived = filtered.filter(t => isArchived(t));

  const activePaged   = active.slice(activePage * PAGE_SIZE,   (activePage + 1) * PAGE_SIZE);
  const archivedPaged = archived.slice(archivedPage * PAGE_SIZE, (archivedPage + 1) * PAGE_SIZE);

  const handleRevoke = useCallback(async () => {
    if (!confirmRevoke) return;
    try {
      await api.tokens.revoke(confirmRevoke.token_id);
      setConfirmRevoke(null);
      load();
    } catch (e) { setError(String(e)); }
  }, [confirmRevoke, load]);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return;
    try {
      await api.tokens.delete(confirmDelete.token_id);
      setConfirmDelete(null);
      if (selectedId === confirmDelete.token_id) setSelectedId(null);
      load();
    } catch (e) { setError(String(e)); }
  }, [confirmDelete, load, selectedId]);

  const handleDuplicate = useCallback(async (t: Token) => {
    try {
      const newToken = await api.tokens.create({
        label: `${t.label} (copy)`,
        entities: t.entities,
        origins: t.origins,
        expires: t.expires ?? null,
      });
      load();
      setSelectedId(newToken.token_id);
    } catch (e) { setError(String(e)); }
  }, [load]);

  if (selectedId) {
    return (
      <TokenDetail
        tokenId={selectedId}
        onBack={() => setSelectedId(null)}
        onOpenWizard={onOpenWizard}
        onDeleted={() => { setSelectedId(null); load(); }}
      />
    );
  }

  return (
    <div className="hrv-page-sm">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Search + filter toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="Search tokens..."
          value={search}
          onChange={e => { setSearch(e.target.value); setActivePage(0); }}
          className="hrv-input"
          style={{ flex: "1 1 200px" }}
          aria-label="Search tokens"
        />
        <select
          value={filter}
          onChange={e => { setFilter(e.target.value as FilterOption); setActivePage(0); }}
          className="hrv-select"
          aria-label="Filter by status"
        >
          {FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner size={40} />
        </div>
      ) : active.length === 0 && archived.length === 0 ? (
        <EmptyState
          title="No widgets yet"
          subtitle="Create your first widget to embed live Home Assistant cards on any webpage."
          action={{ label: "+ Create Widget", onClick: onOpenWizard }}
        />
      ) : (
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 80 }}>
          {/* Active tokens */}
          {activePaged.map(t => (
            <TokenCard
              key={t.token_id}
              token={t}
              onSelect={() => setSelectedId(t.token_id)}
              onRevoke={setConfirmRevoke}
              onDelete={setConfirmDelete}
              onDuplicate={handleDuplicate}
              highlighted={t.token_id === initialTokenId}
            />
          ))}

          {active.length === 0 && filter !== "all" && (
            <div style={{ textAlign: "center", padding: 24, color: "var(--secondary-text-color,#616161)", fontSize: 13 }}>
              No tokens match this filter.
            </div>
          )}

          <Paging total={active.length} page={activePage} pageSize={PAGE_SIZE} onPage={setActivePage} label="tokens" />

          {/* Archived section */}
          {archived.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => setArchivedOpen(v => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--secondary-text-color,#616161)",
                  cursor: "pointer",
                  borderTop: "1px solid var(--divider-color,#e0e0e0)",
                }}
                aria-expanded={archivedOpen}
              >
                <span>{archivedOpen ? "v" : ">"}</span>
                Archived tokens ({archived.length})
              </button>
              {archivedOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {archivedPaged.map(t => (
                    <TokenCard
                      key={t.token_id}
                      token={t}
                      onSelect={() => setSelectedId(t.token_id)}
                      onRevoke={setConfirmRevoke}
                      onDelete={setConfirmDelete}
                      onDuplicate={handleDuplicate}
                      highlighted={false}
                    />
                  ))}
                  <Paging total={archived.length} page={archivedPage} pageSize={PAGE_SIZE} onPage={setArchivedPage} label="archived tokens" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm revoke dialog */}
      {confirmRevoke && (
        <ConfirmDialog
          title="Revoke token"
          message={`Revoking "${confirmRevoke.label}" will immediately terminate all active sessions. This cannot be undone.`}
          confirmLabel="Revoke"
          confirmDestructive
          onConfirm={handleRevoke}
          onCancel={() => setConfirmRevoke(null)}
        />
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete token"
          message={`Delete "${confirmDelete.label}" and all its activity log entries permanently?`}
          confirmLabel="Delete"
          confirmDestructive
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
