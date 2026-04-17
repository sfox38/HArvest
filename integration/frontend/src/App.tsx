/**
 * App.tsx - Root component and navigation for the HArvest panel.
 *
 * Manages top-level screen routing, the floating "Create Widget" button,
 * and the wizard modal overlay.
 */

import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { Dashboard }   from "./components/Dashboard";
import { TokenList }   from "./components/TokenList";
import { ActivityLog } from "./components/ActivityLog";
import { Sessions }    from "./components/Sessions";
import { Settings }    from "./components/Settings";
import { StatsBar }    from "./components/StatsBar";
import { Wizard }      from "./components/Wizard";

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tokens",    label: "Tokens"    },
  { id: "sessions",  label: "Sessions"  },
  { id: "activity",  label: "Activity"  },
  { id: "settings",  label: "Settings"  },
  { id: "help",      label: "Help"      },
];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [screen, setScreen]         = useState<Screen>("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [initialTokenId, setInitialTokenId] = useState<string | null>(null);
  // Increment to reset (remount) the TokenList, e.g. when Tokens nav is clicked
  // while already viewing a token detail.
  const [tokenListKey, setTokenListKey] = useState(0);
  // Activity screen filter preset (set when navigating from stats bar chips).
  const [activityTypeFilter, setActivityTypeFilter] = useState<string | undefined>(undefined);

  const openWizard = useCallback(() => setWizardOpen(true),  []);
  const closeWizard = useCallback((newTokenId?: string) => {
    setWizardOpen(false);
    if (newTokenId) {
      setInitialTokenId(newTokenId);
      setTokenListKey(k => k + 1);
      setScreen("tokens");
    }
  }, []);

  // Navigate to a token's detail page from any screen (e.g. activity log link).
  const goToToken = useCallback((tokenId: string) => {
    setInitialTokenId(tokenId);
    setTokenListKey(k => k + 1);
    setScreen("tokens");
  }, []);

  // Navigate to activity with an optional pre-set type filter (from stats bar chips).
  const goToActivity = useCallback((typeFilter?: string) => {
    setActivityTypeFilter(typeFilter);
    setScreen("activity");
  }, []);

  const showDashboard = screen === "dashboard";

  return (
    <div className="hrv-shell">
      {/* Top navigation bar */}
      <nav className="hrv-nav" aria-label="HArvest navigation">
        <div className="hrv-nav-brand">
          <span aria-hidden="true">&#127807;</span>
          HArvest
        </div>
        <div className="hrv-nav-links" role="tablist">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={screen === id}
              className="hrv-nav-btn"
              style={{
                color:        screen === id ? "#fff" : "rgba(255,255,255,0.75)",
                fontWeight:   screen === id ? 600 : 400,
                borderBottom: screen === id ? "3px solid #fff" : "3px solid transparent",
              }}
              onClick={() => {
                if (id === "tokens") setTokenListKey(k => k + 1);
                if (id === "activity") setActivityTypeFilter(undefined);
                setScreen(id);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Compact stats bar (hidden on Dashboard and wizard) */}
      {!showDashboard && !wizardOpen && (
        <StatsBar onNavigate={setScreen} onNavigateActivity={goToActivity} />
      )}

      {/* Screen content */}
      <main className="hrv-content">
        {screen === "dashboard" && (
          <Dashboard onOpenWizard={openWizard} onNavigate={setScreen} />
        )}
        {screen === "tokens" && (
          <TokenList
            key={tokenListKey}
            onOpenWizard={openWizard}
            initialTokenId={initialTokenId}
            onInitialTokenConsumed={() => setInitialTokenId(null)}
          />
        )}
        {screen === "sessions" && (
          <Sessions onSelectToken={goToToken} />
        )}
        {screen === "activity" && (
          <ActivityLog
            onSelectToken={goToToken}
            initialTypeFilter={activityTypeFilter}
          />
        )}
        {screen === "settings" && (
          <Settings />
        )}
        {screen === "help" && (
          <HelpScreen />
        )}
      </main>

      {/* Floating action button - always visible */}
      {!wizardOpen && (
        <button
          className="hrv-fab"
          onClick={openWizard}
          aria-label="Create widget"
        >
          <span aria-hidden="true">+</span>
          Create Widget
        </button>
      )}

      {/* Wizard modal overlay */}
      {wizardOpen && (
        <Wizard onClose={closeWizard} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Help screen (simple links, minimal)
// ---------------------------------------------------------------------------

function HelpScreen() {
  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      <h2 style={{ marginBottom: 16, color: "var(--primary-text-color)" }}>
        Help and Resources
      </h2>
      <p style={{ marginBottom: 24, color: "var(--secondary-text-color)" }}>
        HArvest embeds live Home Assistant entity cards on any webpage using
        secure, token-scoped WebSocket connections.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { label: "Documentation", href: "https://github.com/sfox38/harvest/wiki" },
          { label: "Getting started guide", href: "https://github.com/sfox38/harvest/blob/main/docs/getting-started.md" },
          { label: "Report an issue", href: "https://github.com/sfox38/harvest/issues" },
          { label: "GitHub repository", href: "https://github.com/sfox38/harvest" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "var(--primary-background-color, #fff)",
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              color: "var(--primary-color, #6200ea)",
              fontWeight: 500,
            }}
          >
            {label} &rarr;
          </a>
        ))}
      </div>
      <p style={{ marginTop: 32, fontSize: 12, color: "var(--secondary-text-color)" }}>
        HArvest v1.6.3 - MIT License
      </p>
    </div>
  );
}
