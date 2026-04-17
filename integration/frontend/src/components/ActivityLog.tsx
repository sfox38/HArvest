/**
 * ActivityLog.tsx - Global activity log screen.
 *
 * Displays all events across all tokens with filtering by date range,
 * token, and event type. Rows are expandable via a [+] toggle. Column
 * headers are clickable to sort the current page. Token IDs link to the
 * token edit page. CSV export uses the authenticated API client.
 * Pagination at 50 events per page.
 */

import { useState, useEffect } from "react";
import type { ActivityEvent, ActivityPage, Token, ActivityEventType } from "../types";
import { api } from "../api";
import { Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DateRange = "1h" | "24h" | "7d" | "30d" | "custom";
type SortCol = "time" | "type" | "token" | "origin" | "entity";

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "1h",     label: "Last 1 hour"  },
  { value: "24h",    label: "Last 24 hours" },
  { value: "7d",     label: "Last 7 days"  },
  { value: "30d",    label: "Last 30 days" },
  { value: "custom", label: "Custom"       },
];

const EVENT_TYPE_OPTIONS: (ActivityEventType | "all")[] = [
  "all", "AUTH_OK", "AUTH_FAIL", "COMMAND", "SESSION_END",
  "TOKEN_CREATED", "TOKEN_REVOKED", "TOKEN_DELETED", "RENEWAL",
  "SUSPICIOUS_ORIGIN", "FLOOD_PROTECTION", "RATE_LIMITED",
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  AUTH_OK:            "#43a047",
  AUTH_FAIL:          "#e53935",
  COMMAND:            "#1e88e5",
  SESSION_END:        "#757575",
  TOKEN_CREATED:      "#00acc1",
  TOKEN_REVOKED:      "#8e24aa",
  TOKEN_DELETED:      "#b71c1c",
  RENEWAL:            "#00897b",
  SUSPICIOUS_ORIGIN:  "#fb8c00",
  FLOOD_PROTECTION:   "#e53935",
  RATE_LIMITED:       "#f4511e",
};

const PAGE_LIMIT = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sinceForRange(range: DateRange): string | undefined {
  if (range === "custom") return undefined;
  const now = new Date();
  const map: Record<Exclude<DateRange, "custom">, number> = {
    "1h":  60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d":  7  * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now.getTime() - map[range as Exclude<DateRange, "custom">]).toISOString();
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// EventRow
// ---------------------------------------------------------------------------

interface EventRowProps {
  event: ActivityEvent;
  expanded: boolean;
  onToggle: () => void;
  onSelectToken: (tokenId: string) => void;
  tokenInfo?: import("../types").Token;
}

function EventRow({ event: ev, expanded, onToggle, onSelectToken, tokenInfo }: EventRowProps) {
  const color = EVENT_TYPE_COLORS[ev.type] ?? "#9e9e9e";
  const tokenDisplay = ev.token_label || ev.token_id;

  // Build widget location string from tokenInfo origins.
  function tokenLocation(t: import("../types").Token): string {
    if (t.origins.allow_any) return "Anywhere";
    if (t.origins.allowed.length === 0) return "No origin set";
    const base = t.origins.allowed[0];
    if (t.origins.allow_paths.length > 0) return `${base}${t.origins.allow_paths[0]}`;
    return base;
  }

  // All entity aliases for this token.
  const aliases = tokenInfo ? tokenInfo.entities.filter(e => e.alias).map(e => e.alias).join(", ") : null;

  return (
    <>
      <tr
        onClick={onToggle}
        className="hrv-activity-row"
        aria-expanded={expanded}
      >
        {/* Expand toggle */}
        <td className="hrv-activity-expand-cell">
          <span className="hrv-activity-expand-btn">{expanded ? "-" : "+"}</span>
        </td>

        {/* Time */}
        <td className="hrv-activity-td hrv-activity-td-time">
          {fmtDateTime(ev.timestamp)}
        </td>

        {/* Type */}
        <td className="hrv-activity-td">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600, color }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {ev.type}
          </span>
        </td>

        {/* Token */}
        <td className="hrv-activity-td hrv-activity-td-token">
          {tokenDisplay ? (
            <button
              className="hrv-activity-token-link"
              onClick={e => { e.stopPropagation(); onSelectToken(ev.token_id!); }}
            >
              {tokenDisplay}
            </button>
          ) : "-"}
        </td>

        {/* Origin / Referer */}
        <td className="hrv-activity-td">
          {ev.referer || ev.origin || "-"}
        </td>

        {/* Entity */}
        <td className="hrv-activity-td">
          {ev.entity_id || "-"}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} style={{ padding: "0 10px 10px" }}>
            <div className="hrv-activity-row-detail">
              {ev.token_id && <div><strong>Token name:</strong> {ev.token_label || "-"}</div>}
              {ev.token_id && <div><strong>Token ID:</strong> {ev.token_id}</div>}
              {aliases     && <div><strong>Aliases:</strong> {aliases}</div>}
              {tokenInfo   && <div><strong>Expires:</strong> {tokenInfo.expires ? new Date(tokenInfo.expires).toLocaleDateString() : "Never"}</div>}
              {tokenInfo   && <div><strong>Widget location:</strong> {tokenLocation(tokenInfo)}</div>}
              {ev.session_id && <div><strong>Session:</strong> {ev.session_id}</div>}
              {ev.referer    && <div><strong>Page:</strong> {ev.referer}</div>}
              {ev.origin     && <div><strong>Origin:</strong> {ev.origin}</div>}
              {ev.entity_id  && <div><strong>Entity:</strong> {ev.entity_id}</div>}
              {ev.action     && <div><strong>Action:</strong> {ev.action}</div>}
              {ev.code       && <div><strong>Code:</strong> {ev.code}</div>}
              {ev.message    && <div><strong>Message:</strong> {ev.message}</div>}
              <div><strong>Time:</strong> {new Date(ev.timestamp).toLocaleString()}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// SortableHeader
// ---------------------------------------------------------------------------

interface SortableThProps {
  col: SortCol;
  label: string;
  sortCol: SortCol | null;
  sortDir: "asc" | "desc";
  onSort: (col: SortCol) => void;
}

function SortableTh({ col, label, sortCol, sortDir, onSort }: SortableThProps) {
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
// ActivityLog
// ---------------------------------------------------------------------------

interface ActivityLogProps {
  onSelectToken: (tokenId: string) => void;
  initialTypeFilter?: string;
}

// datetime-local inputs produce "YYYY-MM-DDTHH:MM" without seconds.
// new Date("YYYY-MM-DDTHH:MM") is ambiguous across browsers (Firefox may
// return Invalid Date). Append ":00" to make it valid ISO 8601 everywhere.
function normalizeDt(val: string): string {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val) ? val + ":00" : val;
}

function isValidDatetime(val: string): boolean {
  if (!val) return false;
  return !isNaN(new Date(normalizeDt(val)).getTime());
}

export function ActivityLog({ onSelectToken, initialTypeFilter }: ActivityLogProps) {
  const [page,        setPage]        = useState<ActivityPage | null>(null);
  const [tokens,      setTokens]      = useState<Token[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [exporting,   setExporting]   = useState(false);
  const [offset,      setOffset]      = useState(0);
  const [range,       setRange]       = useState<DateRange>("24h");
  const [customSince, setCustomSince] = useState("");
  const [customUntil, setCustomUntil] = useState("");
  // appliedSince/Until hold the last values explicitly committed via Apply.
  const [appliedSince, setAppliedSince] = useState("");
  const [appliedUntil, setAppliedUntil] = useState("");
  const [tokenFilter,  setTokenFilter]  = useState<string>("all");
  const [typeFilter,   setTypeFilter]   = useState<ActivityEventType | "all">((initialTypeFilter as ActivityEventType) || "all");
  const [expanded,     setExpanded]     = useState<number | null>(null);
  const [sortCol,      setSortCol]      = useState<SortCol | null>(null);
  const [sortDir,      setSortDir]      = useState<"asc" | "desc">("desc");
  // loadTick increments on every explicit reload request (Refresh button, Apply).
  const [loadTick, setLoadTick] = useState(0);

  // Custom range validation.
  const sinceOk = isValidDatetime(customSince);
  const untilOk = !customUntil || isValidDatetime(customUntil);
  const untilBeforeSince = sinceOk && isValidDatetime(customUntil)
    && new Date(normalizeDt(customUntil)) <= new Date(normalizeDt(customSince));
  const canApplyCustom = sinceOk;

  // On Apply: clear whichever field(s) fail validation, then load if both are ok.
  const applyCustomRange = () => {
    if (!sinceOk)        { setCustomSince(""); return; }
    if (!untilOk)        { setCustomUntil(""); return; }
    if (untilBeforeSince){ setCustomUntil(""); return; }
    setAppliedSince(customSince);
    setAppliedUntil(customUntil);
    setOffset(0);
    setLoadTick(t => t + 1);
  };

  // Sync type filter when navigated here from a stats bar chip.
  useEffect(() => {
    if (initialTypeFilter !== undefined) {
      setTypeFilter((initialTypeFilter as ActivityEventType) || "all");
      setOffset(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTypeFilter]);

  useEffect(() => {
    api.tokens.list().then(setTokens).catch(() => {});
  }, []);

  // Single load effect - all dependencies listed directly; no useCallback chain.
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params: Parameters<typeof api.activity.list>[0] = { offset, limit: PAGE_LIMIT };
    if (range === "custom") {
      if (appliedSince) {
        params.since = new Date(normalizeDt(appliedSince)).toISOString();
        if (appliedUntil) params.until = new Date(normalizeDt(appliedUntil)).toISOString();
      }
    } else {
      const s = sinceForRange(range);
      if (s) params.since = s;
    }
    if (tokenFilter !== "all") params.token_id = tokenFilter;
    if (typeFilter  !== "all") params.event_type = typeFilter;
    api.activity.list(params)
      .then(p => { setPage(p); setExpanded(null); })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  // loadTick ensures Apply and Refresh force a reload even when no other dep changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, range, appliedSince, appliedUntil, tokenFilter, typeFilter, loadTick]);

  const resetOffset = () => setOffset(0);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const p: Record<string, string> = {};
      const since = range === "custom" ? customSince : sinceForRange(range);
      if (since) p.since = since;
      if (range === "custom" && customUntil) p.until = customUntil;
      if (tokenFilter !== "all") p.token_id = tokenFilter;
      if (typeFilter  !== "all") p.event_type = typeFilter;
      await api.activity.exportCsv(p);
    } catch (e) {
      setError(String(e));
    } finally {
      setExporting(false);
    }
  };

  // Client-side sort of the current page
  const sortedEvents: ActivityEvent[] = page ? [...page.events].sort((a, b) => {
    if (!sortCol) return 0;
    const factor = sortDir === "asc" ? 1 : -1;
    let av = "", bv = "";
    if (sortCol === "time")   { av = a.timestamp; bv = b.timestamp; }
    if (sortCol === "type")   { av = a.type; bv = b.type; }
    if (sortCol === "token")  { av = a.token_label || a.token_id || ""; bv = b.token_label || b.token_id || ""; }
    if (sortCol === "origin") { av = a.origin || ""; bv = b.origin || ""; }
    if (sortCol === "entity") { av = a.entity_id || ""; bv = b.entity_id || ""; }
    return av < bv ? -factor : av > bv ? factor : 0;
  }) : [];

  const totalPages = page ? Math.max(1, Math.ceil(page.total / PAGE_LIMIT)) : 1;
  const currentPage = Math.floor(offset / PAGE_LIMIT);

  return (
    <div className="hrv-page-sm">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Filters */}
      <div className="hrv-activity-filters">
        <select
          value={range}
          onChange={e => { setRange(e.target.value as DateRange); resetOffset(); }}
          className="hrv-select-sm"
          aria-label="Date range"
        >
          {DATE_RANGE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {range === "custom" && (
          <>
            <input
              type="datetime-local"
              value={customSince}
              onChange={e => setCustomSince(e.target.value)}
              className="hrv-input-sm"
              style={{ borderColor: customSince && !sinceOk ? "#e53935" : undefined }}
              aria-label="From"
            />
            <input
              type="datetime-local"
              value={customUntil}
              onChange={e => setCustomUntil(e.target.value)}
              className="hrv-input-sm"
              style={{ borderColor: (untilBeforeSince || (customUntil && !untilOk)) ? "#e53935" : undefined }}
              aria-label="To"
            />
            <button
              onClick={applyCustomRange}
              disabled={!canApplyCustom}
              className="hrv-btn-sm"
            >
              Apply
            </button>
            {untilBeforeSince && (
              <span style={{ fontSize: 12, color: "#e53935", fontWeight: 500, alignSelf: "center" }}>
                End must be after start.
              </span>
            )}
          </>
        )}

        {/* TYPE filter before TOKEN filter */}
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value as ActivityEventType | "all"); resetOffset(); }}
          className="hrv-select-sm"
          aria-label="Filter by event type"
        >
          {EVENT_TYPE_OPTIONS.map(t => (
            <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
          ))}
        </select>

        <select
          value={tokenFilter}
          onChange={e => { setTokenFilter(e.target.value); resetOffset(); }}
          className="hrv-select-sm"
          aria-label="Filter by token"
        >
          <option value="all">All tokens</option>
          {tokens.map(t => (
            <option key={t.token_id} value={t.token_id}>{t.label}</option>
          ))}
        </select>

        <button
          onClick={() => setLoadTick(t => t + 1)}
          className="hrv-btn-sm"
          title="Refresh"
        >
          Refresh
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="hrv-btn-sm"
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Spinner size={36} />
          </div>
        ) : !page || page.events.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--secondary-text-color,#616161)", fontSize: 14 }}>
            No events found for the selected filters.
          </div>
        ) : (
          <table className="hrv-activity-table">
            <thead>
              <tr>
                <th style={{ width: 32 }} />
                <SortableTh col="time"   label="Time"   sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="type"   label="Type"   sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="token"  label="Token"  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="origin" label="Origin" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortableTh col="entity" label="Entity" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((ev: ActivityEvent) => (
                <EventRow
                  key={ev.id}
                  event={ev}
                  expanded={expanded === ev.id}
                  onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)}
                  onSelectToken={onSelectToken}
                  tokenInfo={ev.token_id ? tokens.find(t => t.token_id === ev.token_id) : undefined}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {page && page.total > PAGE_LIMIT && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--secondary-text-color,#616161)", flexShrink: 0 }}>
          <span style={{ flex: 1 }}>
            Showing {offset + 1}-{Math.min(page.total, offset + PAGE_LIMIT)} of {page.total} events
          </span>
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_LIMIT))}
            className="hrv-btn-sm"
          >
            Prev
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            disabled={offset + PAGE_LIMIT >= page.total}
            onClick={() => setOffset(offset + PAGE_LIMIT)}
            className="hrv-btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
