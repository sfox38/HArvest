/**
 * ActivityLog.tsx - Global activity log screen.
 *
 * Displays all events across all tokens with filtering by date range,
 * token, and event type. Row expand shows full event details.
 * Pagination at 50 events per page. CSV export button.
 */

import { useState, useEffect, useCallback } from "react";
import type { ActivityEvent, ActivityPage, Token, ActivityEventType } from "../types";
import { api } from "../api";
import { Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DateRange = "1h" | "24h" | "7d" | "30d" | "custom";

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "1h",     label: "Last 1 hour"  },
  { value: "24h",    label: "Last 24 hours" },
  { value: "7d",     label: "Last 7 days"  },
  { value: "30d",    label: "Last 30 days" },
  { value: "custom", label: "Custom"       },
];

const EVENT_TYPE_OPTIONS: (ActivityEventType | "all")[] = [
  "all", "AUTH_OK", "AUTH_FAIL", "COMMAND", "SESSION_END",
  "TOKEN_REVOKED", "RENEWAL", "SUSPICIOUS_ORIGIN", "FLOOD_PROTECTION", "RATE_LIMITED",
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  AUTH_OK: "#43a047", AUTH_FAIL: "#e53935", COMMAND: "#1e88e5",
  SESSION_END: "#757575", TOKEN_REVOKED: "#8e24aa", RENEWAL: "#00897b",
  SUSPICIOUS_ORIGIN: "#fb8c00", FLOOD_PROTECTION: "#e53935", RATE_LIMITED: "#f4511e",
};

const PAGE_LIMIT = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sinceForRange(range: DateRange): string | undefined {
  if (range === "custom") return undefined;
  const now = new Date();
  const map: Record<Exclude<DateRange, "custom">, number> = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now.getTime() - map[range as Exclude<DateRange, "custom">]).toISOString();
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// EventRow
// ---------------------------------------------------------------------------

interface EventRowProps {
  event: ActivityEvent;
  expanded: boolean;
  onToggle: () => void;
}

function EventRow({ event: ev, expanded, onToggle }: EventRowProps) {
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: "pointer", borderBottom: "1px solid var(--divider-color,#f0f0f0)" }}
        aria-expanded={expanded}
      >
        <td style={{ padding: "8px 10px", whiteSpace: "nowrap", fontSize: 12, color: "var(--secondary-text-color,#616161)" }}>
          {fmtDateTime(ev.timestamp)}
        </td>
        <td style={{ padding: "8px 6px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: EVENT_TYPE_COLORS[ev.type] ?? "#9e9e9e" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: EVENT_TYPE_COLORS[ev.type] ?? "#9e9e9e", flexShrink: 0 }} />
            {ev.type}
          </span>
        </td>
        <td style={{ padding: "8px 6px", fontSize: 12, color: "var(--secondary-text-color,#616161)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ev.token_label ?? (ev.token_id ? ev.token_id.slice(0, 12) + "..." : "-")}
        </td>
        <td style={{ padding: "8px 6px", fontSize: 12, color: "var(--secondary-text-color,#616161)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ev.origin ?? "-"}
        </td>
        <td style={{ padding: "8px 6px", fontSize: 12, color: "var(--secondary-text-color,#616161)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ev.entity_id ?? "-"}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} style={{ padding: "0 10px 10px" }}>
            <div style={{ background: "var(--secondary-background-color,#f5f5f5)", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "var(--secondary-text-color,#616161)", lineHeight: 1.8 }}>
              {ev.token_id    && <div><strong>Token:</strong> {ev.token_id}</div>}
              {ev.session_id  && <div><strong>Session:</strong> {ev.session_id}</div>}
              {ev.origin      && <div><strong>Origin:</strong> {ev.origin}</div>}
              {ev.entity_id   && <div><strong>Entity:</strong> {ev.entity_id}</div>}
              {ev.action      && <div><strong>Action:</strong> {ev.action}</div>}
              {ev.code        && <div><strong>Code:</strong> {ev.code}</div>}
              {ev.message     && <div><strong>Message:</strong> {ev.message}</div>}
              <div><strong>Time:</strong> {new Date(ev.timestamp).toLocaleString()}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// ActivityLog
// ---------------------------------------------------------------------------

export function ActivityLog() {
  const [page,        setPage]        = useState<ActivityPage | null>(null);
  const [tokens,      setTokens]      = useState<Token[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [offset,      setOffset]      = useState(0);
  const [range,       setRange]       = useState<DateRange>("24h");
  const [customSince, setCustomSince] = useState("");
  const [customUntil, setCustomUntil] = useState("");
  const [tokenFilter, setTokenFilter] = useState<string>("all");
  const [typeFilter,  setTypeFilter]  = useState<ActivityEventType | "all">("all");
  const [expanded,    setExpanded]    = useState<number | null>(null);

  // Load token list for filter dropdown
  useEffect(() => {
    api.tokens.list().then(setTokens).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const params: Parameters<typeof api.activity.list>[0] = {
      offset,
      limit: PAGE_LIMIT,
    };
    const since = range === "custom" ? customSince : sinceForRange(range);
    if (since) params.since = since;
    if (range === "custom" && customUntil) params.until = customUntil;
    if (tokenFilter !== "all") params.token_id = tokenFilter;
    if (typeFilter  !== "all") params.event_type = typeFilter;

    api.activity.list(params)
      .then(setPage)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [offset, range, customSince, customUntil, tokenFilter, typeFilter]);

  useEffect(() => { load(); }, [load]);

  // Reset offset when filters change
  const resetOffset = () => setOffset(0);

  const exportUrl = (() => {
    const p: Record<string, string> = {};
    const since = range === "custom" ? customSince : sinceForRange(range);
    if (since) p.since = since;
    if (range === "custom" && customUntil) p.until = customUntil;
    if (tokenFilter !== "all") p.token_id = tokenFilter;
    if (typeFilter  !== "all") p.event_type = typeFilter;
    return api.activity.exportCsvUrl(p);
  })();

  const totalPages = page ? Math.max(1, Math.ceil(page.total / PAGE_LIMIT)) : 1;
  const currentPage = Math.floor(offset / PAGE_LIMIT);

  const inputStyle: React.CSSProperties = {
    padding: "6px 10px",
    border: "1px solid var(--divider-color,#e0e0e0)",
    borderRadius: 6,
    fontSize: 13,
    background: "var(--primary-background-color,#fff)",
    color: "var(--primary-text-color,#212121)",
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, height: "100%", boxSizing: "border-box" }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={range}
          onChange={e => { setRange(e.target.value as DateRange); resetOffset(); }}
          style={inputStyle}
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
              onChange={e => { setCustomSince(e.target.value); resetOffset(); }}
              style={inputStyle}
              aria-label="From"
            />
            <input
              type="datetime-local"
              value={customUntil}
              onChange={e => { setCustomUntil(e.target.value); resetOffset(); }}
              style={inputStyle}
              aria-label="To"
            />
          </>
        )}

        <select
          value={tokenFilter}
          onChange={e => { setTokenFilter(e.target.value); resetOffset(); }}
          style={inputStyle}
          aria-label="Filter by token"
        >
          <option value="all">All tokens</option>
          {tokens.map(t => (
            <option key={t.token_id} value={t.token_id}>{t.label}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value as ActivityEventType | "all"); resetOffset(); }}
          style={inputStyle}
          aria-label="Filter by event type"
        >
          {EVENT_TYPE_OPTIONS.map(t => (
            <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
          ))}
        </select>

        <a
          href={exportUrl}
          download="harvest_activity.csv"
          style={{
            padding: "6px 14px",
            border: "1px solid var(--divider-color,#e0e0e0)",
            borderRadius: 6,
            fontSize: 13,
            background: "var(--primary-background-color,#fff)",
            color: "var(--primary-text-color,#212121)",
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Export CSV
        </a>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--divider-color,#e0e0e0)" }}>
                {["Time", "Type", "Token", "Origin", "Entity"].map(h => (
                  <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--secondary-text-color,#616161)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.events.map((ev: ActivityEvent) => (
                <EventRow
                  key={ev.id}
                  event={ev}
                  expanded={expanded === ev.id}
                  onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)}
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
            style={{ padding: "5px 12px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13 }}
          >
            Prev
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            disabled={offset + PAGE_LIMIT >= page.total}
            onClick={() => setOffset(offset + PAGE_LIMIT)}
            style={{ padding: "5px 12px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
