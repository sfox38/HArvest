/**
 * StatsBar.tsx - Compact horizontal stats strip shown on non-dashboard screens.
 *
 * Displays live counts for active sessions, active tokens, commands today,
 * and errors today. Refreshes every 30 seconds. Each stat is a clickable
 * chip that navigates to the relevant screen.
 */

import { useState, useEffect, useCallback } from "react";
import type { Screen, PanelStats } from "../types";
import { api } from "../api";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StatsBarProps {
  onNavigate: (screen: Screen) => void;
  onNavigateActivity: (typeFilter?: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatsBar({ onNavigate, onNavigateActivity }: StatsBarProps) {
  const [stats, setStats] = useState<PanelStats | null>(null);

  const refresh = useCallback(() => {
    api.stats.get().then(setStats).catch(() => {/* silent - bar just stays stale */});
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!stats) return null;

  type Chip = { label: string; value: number; onClick: () => void; warn?: boolean };
  const chips: Chip[] = [
    {
      label: "Sessions",
      value: stats.active_sessions,
      onClick: () => onNavigate("sessions"),
    },
    {
      label: "Active tokens",
      value: stats.active_tokens,
      onClick: () => onNavigate("tokens"),
    },
    {
      label: "Commands today",
      value: stats.commands_today,
      onClick: () => onNavigateActivity("COMMAND"),
    },
    {
      label: "Errors today",
      value: stats.errors_today,
      onClick: () => onNavigateActivity("AUTH_FAIL"),
      warn: stats.errors_today > 0,
    },
  ];

  return (
    <div aria-label="Quick stats" className="hrv-stats-bar">
      {chips.map(({ label, value, onClick, warn }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="hrv-stats-chip"
          style={{ background: warn ? "rgba(255,200,0,0.25)" : "rgba(255,255,255,0.15)" }}
        >
          <strong style={{ fontWeight: 700, fontSize: 13 }}>{value}</strong>
          {label}
        </button>
      ))}

      {!stats.is_running && (
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 12px",
            borderRadius: 12,
            background: "rgba(255,60,60,0.35)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Integration stopped
        </span>
      )}
    </div>
  );
}
