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
import { Settings }    from "./components/Settings";
import { StatsBar }    from "./components/StatsBar";
import { Wizard }      from "./components/Wizard";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  shell: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    overflow: "hidden",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "var(--app-header-background-color, var(--primary-color, #6200ea))",
    color: "var(--app-header-text-color, #fff)",
    height: 56,
    paddingLeft: 16,
    paddingRight: 16,
    flexShrink: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  navBrand: {
    fontWeight: 600,
    fontSize: 18,
    marginRight: 24,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navLinks: {
    display: "flex",
    gap: 4,
    flex: 1,
  },
  navBtn: (active: boolean) => ({
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.75)",
    fontWeight: active ? 600 : 400,
    fontSize: 14,
    borderBottom: active ? "3px solid #fff" : "3px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "color 150ms",
  }),
  content: {
    flex: 1,
    overflow: "auto",
    position: "relative" as const,
  },
  fab: {
    position: "fixed" as const,
    bottom: 24,
    right: 24,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    background: "var(--primary-color, #6200ea)",
    color: "#fff",
    border: "none",
    borderRadius: 28,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 100,
    transition: "opacity 150ms",
  },
};

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tokens",    label: "Tokens"    },
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

  const openWizard = useCallback(() => setWizardOpen(true),  []);
  const closeWizard = useCallback((newTokenId?: string) => {
    setWizardOpen(false);
    if (newTokenId) {
      setInitialTokenId(newTokenId);
      setScreen("tokens");
    }
  }, []);

  const goToToken = useCallback((tokenId: string) => {
    setInitialTokenId(tokenId);
    setScreen("tokens");
  }, []);

  const showDashboard = screen === "dashboard";

  return (
    <div style={styles.shell}>
      {/* Top navigation bar */}
      <nav style={styles.nav} aria-label="HArvest navigation">
        <div style={styles.navBrand}>
          <span aria-hidden="true">&#127807;</span>
          HArvest
        </div>
        <div style={styles.navLinks} role="tablist">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={screen === id}
              style={styles.navBtn(screen === id)}
              onClick={() => setScreen(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Compact stats bar (hidden on Dashboard and wizard) */}
      {!showDashboard && !wizardOpen && (
        <StatsBar onNavigate={setScreen} />
      )}

      {/* Screen content */}
      <main style={styles.content}>
        {screen === "dashboard" && (
          <Dashboard onOpenWizard={openWizard} onNavigate={setScreen} />
        )}
        {screen === "tokens" && (
          <TokenList
            onOpenWizard={openWizard}
            initialTokenId={initialTokenId}
            onInitialTokenConsumed={() => setInitialTokenId(null)}
          />
        )}
        {screen === "activity" && (
          <ActivityLog />
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
          style={styles.fab}
          onClick={openWizard}
          aria-label="Create widget"
        >
          <span aria-hidden="true">+</span>
          Create Widget
        </button>
      )}

      {/* Wizard modal overlay */}
      {wizardOpen && (
        <Wizard onClose={closeWizard} onGoToToken={goToToken} />
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
