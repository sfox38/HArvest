/**
 * Dashboard.tsx - HArvest panel home screen.
 *
 * Stat grid with sparklines, needs-attention section for expiring/paused
 * widgets, activity graph, and recent activity feed.
 */

import { useState, useEffect, useCallback } from "react";
import type { Screen, PanelStats, HourlyBucket, ActivityEvent, Token } from "../types";
import { api } from "../api";
import { Spinner, ErrorBanner, Card, Sparkline, ActivityGraph, StatusBadge, EventRow, fmtRel } from "./Shared";
import { Icon } from "./Icon";
import { DriftBanner } from "./DriftBanner";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DashboardProps {
  onOpenWizard: () => void;
  onNavigate: (screen: Screen) => void;
  onNavigateActivity?: (typeFilter?: string) => void;
  onSelectToken?: (tokenId: string) => void;
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatProps {
  label: string;
  value: number | string;
  spark?: number[];
  sparkColor?: string;
  icon?: string;
}

function Stat({ label, value, spark, sparkColor, icon }: StatProps) {
  return (
    <div className="stat">
      <div className="stat-label">
        {icon && <Icon name={icon} size={13} />}
        {label}
      </div>
      <div className="stat-value">{value}</div>
      {spark && (
        <div className="stat-spark">
          <Sparkline data={spark} color={sparkColor} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export function Dashboard({ onOpenWizard: _onOpenWizard, onNavigate, onNavigateActivity, onSelectToken }: DashboardProps) {
  const [stats,   setStats]   = useState<PanelStats | null>(null);
  const [buckets, setBuckets] = useState<HourlyBucket[]>([]);
  const [events,  setEvents]  = useState<ActivityEvent[]>([]);
  const [tokens,  setTokens]  = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    // allSettled so a single failed sub-fetch does not blank the whole
    // dashboard. Each panel populates from whatever succeeded; failures are
    // logged to console for debugging and a banner is shown.
    Promise.allSettled([
      api.stats.get(),
      api.activity.aggregates(24),
      api.activity.list({ limit: 7, offset: 0 }),
      api.tokens.list(),
    ]).then(([s, b, a, t]) => {
      if (s.status === "fulfilled") setStats(s.value);
      if (b.status === "fulfilled") setBuckets(b.value);
      if (a.status === "fulfilled") setEvents(a.value.events);
      if (t.status === "fulfilled") setTokens(t.value);

      const rejections = [s, b, a, t].filter(r => r.status === "rejected") as PromiseRejectedResult[];
      if (rejections.length === 4) {
        // Total failure - surface the underlying error so the user can see
        // session-expired / network-down messages directly.
        setError(String(rejections[0].reason));
      } else if (rejections.length > 0) {
        for (const r of rejections) console.warn("[HArvest panel] dashboard load:", r.reason);
        setError("Some dashboard data couldn't be loaded.");
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 60_000);
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const needsAttention = tokens.filter(t =>
    t.status === "expiring_soon" || t.status === "inactive"
  );

  if (loading) {
    return (
      <div className="center-spinner">
        <Spinner size={40} label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="content-narrow col" style={{ gap: 22 }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Compatibility-handshake drift banner (SPEC.md Section 12).
          Self-loading; renders nothing if no drift or if dismissed at
          the current PLATFORM_VERSION. */}
      <DriftBanner />

      {/* Stat grid */}
      {stats && (
        <section className="stat-grid" aria-label="Statistics">
          <Stat
            label="Active sessions"
            value={stats.active_sessions}
            spark={buckets.map(b => b.sessions)}
            sparkColor="var(--accent)"
            icon="plug"
          />
          <Stat
            label="Commands today"
            value={stats.commands_today}
            spark={buckets.map(b => b.commands)}
            sparkColor="var(--info)"
            icon="bolt"
          />
          <Stat
            label="Active widgets"
            value={stats.active_tokens}
            icon="grid"
          />
          <Stat
            label="Errors today"
            value={stats.errors_today}
            spark={buckets.map(b => b.auth_failures)}
            sparkColor="var(--danger)"
            icon="alert"
          />
        </section>
      )}

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <Card
          title="Needs attention"
          className="card-info"
          action={
            <span className="muted fs-12">
              {needsAttention.length} item{needsAttention.length === 1 ? "" : "s"}
            </span>
          }
        >
          <div className="col" style={{ gap: 10 }}>
            {needsAttention.map(w => (
              <div key={w.token_id} className="row" style={{ justifyContent: "space-between" }}>
                <div className="row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{w.label}</div>
                    <div className="muted fs-12">
                      {w.expires ? `Expires ${fmtRel(w.expires)}` : "Inactive"}
                    </div>
                  </div>
                </div>
                <div className="row gap-8">
                  <StatusBadge status={w.status} />
                  <button
                    className="btn btn-sm"
                    onClick={() => onNavigate("widgets")}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Activity graph + recent activity */}
      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <Card
          title="Activity - last 24 hours"
          className="card-info"
          action={
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => (onNavigateActivity ? onNavigateActivity() : onNavigate("activity"))}
            >
              View all <Icon name="chevRight" size={12} />
            </button>
          }
        >
          <ActivityGraph buckets={buckets} height={160} />
        </Card>

        <Card
          title="Recent activity"
          pad={false}
          className="card-info"
          action={
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => (onNavigateActivity ? onNavigateActivity() : onNavigate("activity"))}
            >
              View all <Icon name="chevRight" size={12} />
            </button>
          }
        >
          {events.length === 0 ? (
            <div className="card-body muted text-center-13">
              No recent activity
            </div>
          ) : (
            <div>
              {events.map(ev => (
                <EventRow
                  key={ev.id}
                  ev={ev}
                  onSelectToken={id => { onSelectToken ? onSelectToken(id) : onNavigate("widgets"); }}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
