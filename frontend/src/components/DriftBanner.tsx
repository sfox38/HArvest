/**
 * DriftBanner.tsx - Home-screen banner for client/server version drift.
 *
 * Aggregates active sessions whose `compatibility !== "ok"` and surfaces
 * a single dismissible banner per (origin, source, source_version,
 * widget_version) tuple. Per SPEC.md Section 12, dismissal is global
 * within a server version: one click hides everything until the next
 * integration release bumps PLATFORM_VERSION (which the GET /warnings
 * endpoint reports), at which point all banners reappear.
 *
 * Loads independently of the rest of Dashboard so a slow / failed
 * /warnings or /sessions request doesn't block the stat grid.
 */

import { useState, useEffect, useCallback } from "react";
import type { Session, WarningsState } from "../types";
import { api } from "../api";
import { Icon } from "./Icon";

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

interface DriftGroup {
  key: string;
  origin: string;
  source: "wp" | "html" | "panel" | "unknown";
  source_version: string | null;
  widget_version: string | null;
  compatibility: "client_outdated" | "server_outdated";
  sessionCount: number;
}

function aggregateDrift(sessions: Session[]): DriftGroup[] {
  const buckets = new Map<string, DriftGroup>();
  for (const s of sessions) {
    if (!s.compatibility || s.compatibility === "ok") continue;
    if (!s.client) continue;
    const origin = s.origin || "(no origin)";
    const source = s.client.source;
    const sourceVer = s.client.source_version;
    const widgetVer = s.client.widget;
    // Group key: same key = same banner row, count of sessions accumulates.
    const key = [origin, source, sourceVer ?? "", widgetVer ?? "", s.compatibility].join("|");
    const existing = buckets.get(key);
    if (existing) {
      existing.sessionCount += 1;
    } else {
      buckets.set(key, {
        key,
        origin,
        source,
        source_version: sourceVer,
        widget_version: widgetVer,
        compatibility: s.compatibility as "client_outdated" | "server_outdated",
        sessionCount: 1,
      });
    }
  }
  // Stable order: alphabetical by origin, so the same set of warnings
  // renders identically across reloads.
  return [...buckets.values()].sort((a, b) => a.origin.localeCompare(b.origin));
}

// ---------------------------------------------------------------------------
// Banner copy
// ---------------------------------------------------------------------------

function describeGroup(g: DriftGroup, currentVersion: string): string {
  const sessions = g.sessionCount === 1 ? "1 session" : `${g.sessionCount} sessions`;

  if (g.source === "wp" && g.compatibility === "client_outdated") {
    return `${g.origin} is running HArvest WordPress plugin ${g.source_version ?? "(unknown)"} (current: ${currentVersion}). Update via Plugins, HArvest, Update.`;
  }
  if (g.source === "wp" && g.compatibility === "server_outdated") {
    return `${g.origin} is running HArvest WordPress plugin ${g.source_version ?? "(unknown)"}, but this Home Assistant instance has ${currentVersion}. Update HArvest via HACS.`;
  }
  if (g.compatibility === "client_outdated") {
    return `${sessions} on ${g.origin} are running widget ${g.widget_version ?? "(unknown)"} (current: ${currentVersion}). Browsers may be caching an old snippet; clear cache or republish the embed snippet.`;
  }
  // server_outdated, non-WP source
  return `${sessions} on ${g.origin} are running widget ${g.widget_version ?? "(unknown)"}, but this Home Assistant instance has ${currentVersion}. Update HArvest via HACS.`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DriftBanner() {
  const [warnings, setWarnings] = useState<WarningsState | null>(null);
  const [groups, setGroups] = useState<DriftGroup[]>([]);
  const [dismissing, setDismissing] = useState(false);

  const load = useCallback(() => {
    Promise.allSettled([
      api.warnings.get(),
      api.sessions.list(),
    ]).then(([w, s]) => {
      if (w.status === "fulfilled") setWarnings(w.value);
      if (s.status === "fulfilled") setGroups(aggregateDrift(s.value));
    });
  }, []);

  useEffect(() => {
    load();
    // Refresh on the same cadence as Dashboard's load(): once a minute
    // when the tab is visible. Drift is slow-changing enough that this
    // is plenty fresh.
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const onDismiss = async () => {
    setDismissing(true);
    try {
      const next = await api.warnings.dismiss();
      setWarnings(next);
    } catch (e) {
      console.warn("[HArvest panel] dismiss failed:", e);
    } finally {
      setDismissing(false);
    }
  };

  // Hide entirely if: no warnings state yet (initial load), no drift
  // groups to surface, or the admin dismissed at the current version.
  if (!warnings) return null;
  if (groups.length === 0) return null;
  if (warnings.dismissed) return null;

  return (
    <div className="drift-banner" role="status" aria-live="polite">
      <div className="drift-banner-header">
        <div className="drift-banner-title">
          <Icon name="alert" size={16} />
          <span>HArvest version drift detected</span>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onDismiss}
          disabled={dismissing}
          aria-label="Dismiss drift warnings until next HArvest release"
          title="Hide until the next HArvest release"
        >
          Dismiss
        </button>
      </div>
      <ul className="drift-banner-list">
        {groups.map(g => (
          <li key={g.key} className="drift-banner-row">
            {describeGroup(g, warnings.current_version)}
          </li>
        ))}
      </ul>
    </div>
  );
}
