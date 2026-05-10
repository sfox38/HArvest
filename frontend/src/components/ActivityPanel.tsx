/**
 * ActivityPanel.tsx - Token detail panel: per-token activity log with date
 * range filter and pagination.
 */

import { useState, useEffect } from "react";
import type { ActivityPage } from "../types";
import { api } from "../api";
import { Spinner, Card, EventRow } from "./Shared";

type ActivityDateRange = "1h" | "24h" | "7d" | "all";

const DATE_OPTIONS: { value: ActivityDateRange; label: string }[] = [
  { value: "1h",  label: "Last hour"   },
  { value: "24h", label: "Last 24h"    },
  { value: "7d",  label: "Last 7 days" },
  { value: "all", label: "All time"    },
];

function sinceFor(range: ActivityDateRange): string | undefined {
  if (range === "all") return undefined;
  const ms: Record<Exclude<ActivityDateRange, "all">, number> = {
    "1h":  60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d":  7 * 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() - ms[range as Exclude<ActivityDateRange, "all">]).toISOString();
}

export function ActivityPanel({ tokenId }: { tokenId: string }) {
  const [page,      setPage]      = useState<ActivityPage | null>(null);
  const [offset,    setOffset]    = useState(0);
  const [dateRange, setDateRange] = useState<ActivityDateRange>("24h");
  const [error,     setError]     = useState<string | null>(null);
  const LIMIT = 20;

  useEffect(() => {
    let cancelled = false;
    const params: Parameters<typeof api.activity.list>[0] = { token_id: tokenId, offset, limit: LIMIT };
    const since = sinceFor(dateRange);
    if (since) params.since = since;
    api.activity.list(params)
      .then(p => { if (!cancelled) { setPage(p); setError(null); } })
      .catch(e => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, [tokenId, offset, dateRange]);

  if (error && !page) return <p className="muted fs-13">Failed to load activity.</p>;
  if (!page) return <Spinner size={24} />;

  return (
    <Card
      title="Activity"
      pad={page.events.length === 0}
      className="card-info"
      action={
        <select
          value={dateRange}
          onChange={e => { setDateRange(e.target.value as ActivityDateRange); setOffset(0); }}
          className="input"
          style={{ fontSize: 12, padding: "2px 6px" }}
          aria-label="Date range"
        >
          {DATE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      }
    >
      {page.events.length === 0 ? (
        <p className="muted fs-13">No activity in this period.</p>
      ) : (
        <>
          <div>
            {page.events.map(ev => (
              <EventRow key={ev.id} ev={ev} />
            ))}
          </div>
          {page.total > LIMIT && (
            <div className="row" style={{ padding: "8px 0", fontSize: 12 }}>
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                className="btn btn-sm btn-ghost"
              >
                Prev
              </button>
              <span className="muted" style={{ flex: 1, textAlign: "center" }}>
                {offset + 1}-{Math.min(page.total, offset + LIMIT)} of {page.total}
              </span>
              <button
                disabled={offset + LIMIT >= page.total}
                onClick={() => setOffset(offset + LIMIT)}
                className="btn btn-sm btn-ghost"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
