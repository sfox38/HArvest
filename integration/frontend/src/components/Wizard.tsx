/**
 * Wizard.tsx - Six-step widget creation wizard.
 *
 * Steps:
 *   1. Pick entities (single or group mode, alias generated on selection)
 *   2. Set permissions (read / read-write)
 *   3. Set origin (saved origins dropdown or new inline)
 *   4. Set expiry (preset or custom, with advanced: schedule, IP, HMAC)
 *   5. Choose appearance (theme selection)
 *   6. Done (generate, show code, alias toggle, web/WordPress tabs)
 *
 * Wizard memory: last-used origin, expiry, theme, capability stored in
 * localStorage under the key "hrv_wizard_memory".
 *
 * Preview tokens are created at Step 5 and revoked on wizard close.
 */

import {
  useState, useEffect, useCallback, useRef,
} from "react";
import type { Token, EntityAccess } from "../types";
import { api } from "../api";
import { CopyButton, Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WizardMemory {
  capability: "read" | "read-write";
  expiryOption: string;
  themeUrl: string;
}

function loadMemory(): WizardMemory {
  try {
    return JSON.parse(localStorage.getItem("hrv_wizard_memory") ?? "{}");
  } catch {
    return {} as WizardMemory;
  }
}

function saveMemory(m: Partial<WizardMemory>) {
  try {
    const existing = loadMemory();
    localStorage.setItem("hrv_wizard_memory", JSON.stringify({ ...existing, ...m }));
  } catch { /* ignore */ }
}

interface SelectedEntity {
  entity_id: string;
  alias: string | null;
  companions: { entity_id: string; alias: string | null }[];
}

interface WizardState {
  mode: "single" | "group";
  entities: SelectedEntity[];  // primary entities selected
  capability: "read" | "read-write";
  originMode: "specific" | "any";
  selectedOriginUrl: string;
  expiryOption: "never" | "30d" | "90d" | "1y" | "custom";
  expiryCustomDate: string;
  themeUrl: string;
  useHmac: boolean;
  tokenSecret: string | null;
  generatedToken: Token | null;
  previewTokenId: string | null;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WizardProps {
  onClose: (newTokenId?: string) => void;
  onGoToToken: (tokenId: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 6;
const HA_URL = window.location.origin;
const WIDGET_SCRIPT = `<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/dist/harvest.min.js"></script>`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function expiresAt(option: string, customDate: string): string | null {
  if (option === "never") return null;
  if (option === "custom") return customDate ? new Date(customDate).toISOString() : null;
  const days = option === "30d" ? 30 : option === "90d" ? 90 : 365;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function fmtExpiry(option: string): string {
  if (option === "never") return "";
  if (option === "custom") return "";
  const days = option === "30d" ? 30 : option === "90d" ? 90 : 365;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `until ${d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
}

function buildInitScript(tokenId: string): string {
  return `<script>
HArvest.config({
  haUrl: "${HA_URL}",
  token: "${tokenId}",
});
</script>`;
}

function buildCardSnippet(token: Token, useAliases: boolean): string {
  const isGroup = token.entities.length > 1;
  const cards = token.entities.map((e: EntityAccess) => {
    const attr = useAliases && e.alias ? `alias="${e.alias}"` : `entity="${e.entity_id}"`;
    return `  <hrv-card ${attr}></hrv-card>`;
  });
  if (isGroup) return `<hrv-group>\n${cards.join("\n")}\n</hrv-group>`;
  return cards[0]?.trimStart() ?? "";
}

function buildWordPressSnippet(token: Token, useAliases: boolean): string {
  const cards = token.entities.map((e: EntityAccess) => {
    const attr = useAliases && e.alias ? `data-alias="${e.alias}"` : `data-entity="${e.entity_id}"`;
    return `  <div class="hrv-mount" ${attr}></div>`;
  });
  const isGroup = token.entities.length > 1;
  if (isGroup) return `<div class="hrv-group">\n${cards.join("\n")}\n</div>`;
  return cards[0] ?? "";
}

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Entities", "Permissions", "Origin", "Expiry", "Appearance", "Done"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", padding: "0 24px", marginBottom: 24, flexWrap: "wrap", rowGap: 8 }}>
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const done    = stepNum < current;
        const active  = stepNum === current;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 8px",
              borderRadius: 16,
              background: active ? "var(--primary-color,#6200ea)" : done ? "#e8f5e9" : "transparent",
              color: active ? "#fff" : done ? "#2e7d32" : "var(--secondary-text-color,#9e9e9e)",
              fontSize: 12, fontWeight: active ? 700 : 500,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: active ? "rgba(255,255,255,0.3)" : done ? "#43a047" : "var(--divider-color,#e0e0e0)",
                color: done ? "#fff" : "inherit", fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {done ? "check" : stepNum}
              </span>
              {label}
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ width: 20, height: 1, background: "var(--divider-color,#e0e0e0)", flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Pick entities
// ---------------------------------------------------------------------------

interface Step1Props {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

function Step1({ state, onChange }: Step1Props) {
  const [entityInput, setEntityInput] = useState("");
  const [loadingAlias, setLoadingAlias] = useState<string | null>(null);

  const selectEntity = async (entityId: string) => {
    if (state.entities.some(e => e.entity_id === entityId)) return;
    setLoadingAlias(entityId);
    let alias: string | null = null;
    try {
      const result = await api.tokens.generateAlias(entityId);
      alias = result.alias;
    } catch { /* alias stays null - harmless */ }
    finally { setLoadingAlias(null); }

    const entry: SelectedEntity = { entity_id: entityId, alias, companions: [] };
    if (state.mode === "single") {
      onChange({ entities: [entry] });
    } else {
      onChange({ entities: [...state.entities, entry] });
    }
  };

  const removeEntity = (entityId: string) => {
    onChange({ entities: state.entities.filter(e => e.entity_id !== entityId) });
  };

  const canAdd = entityInput.trim().length > 0 && entityInput.trim().includes(".");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0 }}>
        {(["single", "group"] as const).map(m => (
          <button
            key={m}
            onClick={() => onChange({ mode: m, entities: [] })}
            style={{
              padding: "7px 18px",
              border: "1px solid var(--primary-color,#6200ea)",
              borderRight: m === "single" ? "none" : undefined,
              borderRadius: m === "single" ? "6px 0 0 6px" : "0 6px 6px 0",
              background: state.mode === m ? "var(--primary-color,#6200ea)" : "transparent",
              color: state.mode === m ? "#fff" : "var(--primary-color,#6200ea)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            {m === "single" ? "Single card" : "Group of cards"}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>
        Enter entity IDs from your Home Assistant instance.
        {state.mode === "group" ? " You can add multiple entities." : ""}
      </p>

      {/* Entity input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={entityInput}
          onChange={e => setEntityInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && canAdd) { selectEntity(entityInput.trim()); setEntityInput(""); } }}
          placeholder="e.g. light.bedroom_main"
          style={{
            flex: 1, padding: "8px 12px", border: "1px solid var(--divider-color,#e0e0e0)",
            borderRadius: 8, fontSize: 14,
            background: "var(--primary-background-color,#fff)",
            color: "var(--primary-text-color,#212121)",
          }}
        />
        <button
          onClick={() => { if (canAdd) { selectEntity(entityInput.trim()); setEntityInput(""); } }}
          disabled={!canAdd || loadingAlias !== null}
          style={{
            padding: "8px 16px", border: "none", borderRadius: 8,
            background: "var(--primary-color,#6200ea)", color: "#fff",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}
        >
          {loadingAlias ? "..." : "Add"}
        </button>
      </div>

      {/* Selected entities */}
      {state.entities.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)" }}>
            Selected ({state.entities.length}):
          </div>
          {state.entities.map(e => (
            <div key={e.entity_id} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
              background: "var(--secondary-background-color,#f5f5f5)", borderRadius: 6, fontSize: 13,
            }}>
              <span style={{ flex: 1, fontWeight: 500 }}>{e.entity_id}</span>
              {e.alias && (
                <span style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)" }}>alias: {e.alias}</span>
              )}
              <button onClick={() => removeEntity(e.entity_id)} style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>x</button>
            </div>
          ))}
        </div>
      )}

      {state.entities.length === 0 && (
        <p style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)" }}>
          No entities selected yet. Add at least one to continue.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Permissions
// ---------------------------------------------------------------------------

function Step2({ state, onChange }: { state: WizardState; onChange: (u: Partial<WizardState>) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
        What can visitors do with this widget?
      </p>
      {([
        { value: "read"       as const, label: "View only",        desc: "Visitors can see the current state of your device but cannot control it." },
        { value: "read-write" as const, label: "View and control",  desc: "Visitors can see the state and send commands, such as toggling a light or adjusting brightness." },
      ]).map(({ value, label, desc }) => (
        <label key={value} style={{ display: "flex", gap: 12, cursor: "pointer", padding: "12px 14px", borderRadius: 8, border: `2px solid ${state.capability === value ? "var(--primary-color,#6200ea)" : "var(--divider-color,#e0e0e0)"}`, background: "var(--primary-background-color,#fff)" }}>
          <input type="radio" name="capability" value={value} checked={state.capability === value} onChange={() => { onChange({ capability: value }); saveMemory({ capability: value }); }} style={{ marginTop: 2, accentColor: "var(--primary-color,#6200ea)" }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--primary-text-color,#212121)" }}>{label}</div>
            <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)", marginTop: 2 }}>{desc}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Origin
// ---------------------------------------------------------------------------

function Step3({ state, onChange }: { state: WizardState; onChange: (u: Partial<WizardState>) => void }) {
  const [newOriginUrl,  setNewOriginUrl]  = useState("");
  const [showNewForm,   setShowNewForm]   = useState(false);

  const showWarning = state.originMode === "any" && state.capability === "read-write";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
        Where will this widget appear?
      </p>

      {/* Specific website */}
      <label style={{ display: "flex", gap: 12, cursor: "pointer" }}>
        <input type="radio" name="originMode" value="specific" checked={state.originMode === "specific"} onChange={() => onChange({ originMode: "specific" })} style={{ marginTop: 2, accentColor: "var(--primary-color,#6200ea)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>A specific website</div>
          {state.originMode === "specific" && (
            <div style={{ marginTop: 8 }}>
              {!showNewForm ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={state.selectedOriginUrl}
                    onChange={e => onChange({ selectedOriginUrl: e.target.value })}
                    placeholder="https://example.com"
                    style={{ flex: 1, padding: "7px 10px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, fontSize: 13, background: "var(--primary-background-color,#fff)", color: "var(--primary-text-color,#212121)" }}
                  />
                  <button onClick={() => setShowNewForm(true)} style={{ padding: "7px 12px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", fontSize: 13, cursor: "pointer" }}>+ New</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input value={newOriginUrl} onChange={e => setNewOriginUrl(e.target.value)} placeholder="https://mysite.com (or with port: https://local:8080)" style={{ padding: "7px 10px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, fontSize: 13, background: "var(--primary-background-color,#fff)", color: "var(--primary-text-color,#212121)" }} />
                  <p style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", margin: 0 }}>Include the port if your site uses a non-standard one, e.g. https://office.local:8080. Standard ports (80, 443) do not need to be specified.</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { onChange({ selectedOriginUrl: newOriginUrl }); setShowNewForm(false); }}
                      disabled={!newOriginUrl.startsWith("http")}
                      style={{ padding: "6px 14px", border: "none", borderRadius: 6, background: "var(--primary-color,#6200ea)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                    >Save</button>
                    <button onClick={() => setShowNewForm(false)} style={{ padding: "6px 14px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, background: "none", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </label>

      {/* Any website */}
      <label style={{ display: "flex", gap: 12, cursor: "pointer" }}>
        <input type="radio" name="originMode" value="any" checked={state.originMode === "any"} onChange={() => onChange({ originMode: "any" })} style={{ marginTop: 2, accentColor: "var(--primary-color,#6200ea)" }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Any website</div>
          <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)", marginTop: 2 }}>The widget will work when embedded on any page.</div>
        </div>
      </label>

      {showWarning && (
        <div style={{ padding: "10px 14px", background: "#fff3e0", borderRadius: 8, border: "1px solid #ffcc02", fontSize: 13, color: "#e65100" }}>
          <strong>Security Warning:</strong> This allows anyone on the internet to control your device from any website. Only proceed if you understand this risk.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Expiry
// ---------------------------------------------------------------------------

function Step4({ state, onChange }: { state: WizardState; onChange: (u: Partial<WizardState>) => void }) {
  const options: { value: WizardState["expiryOption"]; label: string }[] = [
    { value: "never",  label: "Never expires"  },
    { value: "30d",    label: "30 days"        },
    { value: "90d",    label: "90 days"        },
    { value: "1y",     label: "1 year"         },
    { value: "custom", label: "Custom date"    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
        When should this widget stop working?
      </p>
      {options.map(({ value, label }) => (
        <label key={value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="radio" name="expiry" value={value}
            checked={state.expiryOption === value}
            onChange={() => { onChange({ expiryOption: value }); saveMemory({ expiryOption: value }); }}
            style={{ accentColor: "var(--primary-color,#6200ea)" }}
          />
          <span style={{ fontSize: 14 }}>{label}</span>
          {value !== "never" && value !== "custom" && (
            <span style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)" }}>({fmtExpiry(value)})</span>
          )}
          {value === "custom" && state.expiryOption === "custom" && (
            <input
              type="date"
              value={state.expiryCustomDate}
              onChange={e => onChange({ expiryCustomDate: e.target.value })}
              style={{ padding: "4px 8px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 6, fontSize: 13 }}
            />
          )}
        </label>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Appearance
// ---------------------------------------------------------------------------

const BUNDLED_THEMES = [
  { label: "Default",       url: "" },
  { label: "Glassmorphism", url: "bundled:glassmorphism" },
  { label: "Accessible",    url: "bundled:accessible" },
];

function Step5({ state, onChange }: { state: WizardState; onChange: (u: Partial<WizardState>) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 14, color: "var(--secondary-text-color,#616161)" }}>
        How should your widget look? (optional - skip to use the default theme)
      </p>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--primary-text-color,#212121)", display: "block", marginBottom: 6 }}>
          Theme
        </label>
        <select
          value={state.themeUrl}
          onChange={e => { onChange({ themeUrl: e.target.value }); saveMemory({ themeUrl: e.target.value }); }}
          style={{ padding: "8px 12px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, fontSize: 14, width: "100%", background: "var(--primary-background-color,#fff)", color: "var(--primary-text-color,#212121)" }}
        >
          {BUNDLED_THEMES.map(t => (
            <option key={t.url} value={t.url}>{t.label}</option>
          ))}
        </select>
      </div>

      {state.previewTokenId && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 8 }}>
            Live preview
          </div>
          <div style={{ display: "inline-block", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, padding: 8, maxWidth: 320, minWidth: 200, minHeight: 100, background: "var(--primary-background-color,#fff)", fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)", textAlign: "center", paddingTop: 32 }}>
            Preview connects to HA via a 5-minute token.
            <br />
            (Live card rendered here at runtime.)
          </div>
        </div>
      )}

      <p style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)" }}>
        Themes are fully customizable. Manage custom themes in Settings.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 6: Done
// ---------------------------------------------------------------------------

interface Step6Props {
  token: Token;
  tokenSecret: string | null;
}

function Step6({ token, tokenSecret }: Step6Props) {
  const [useAliases,   setUseAliases]   = useState(false);
  const [tab,          setTab]          = useState<"web" | "wordpress">("web");
  const [acknowledged, setAcknowledged] = useState(!tokenSecret);

  const initScript  = buildInitScript(token.token_id);
  const cardSnippet = tab === "web"
    ? buildCardSnippet(token, useAliases)
    : buildWordPressSnippet(token, useAliases);

  const codeStyle: React.CSSProperties = {
    fontFamily: "monospace", fontSize: 13,
    background: "#1e1e2e", color: "#cdd6f4",
    padding: "12px 14px", borderRadius: 8, margin: 0,
    overflowX: "auto", whiteSpace: "pre", lineHeight: 1.6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: "var(--primary-text-color,#212121)" }}>
        Your widget is ready.
      </p>

      {/* HMAC secret acknowledgement */}
      {tokenSecret && (
        <div style={{ padding: "14px 16px", background: "#fce4ec", border: "1px solid #ef9a9a", borderRadius: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#b71c1c", marginBottom: 8 }}>
            Save your token secret now
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <code style={{ flex: 1, fontSize: 12, wordBreak: "break-all", color: "#212121" }}>{tokenSecret}</code>
            <CopyButton text={tokenSecret} label="Copy" size="sm" />
          </div>
          <p style={{ fontSize: 12, color: "#b71c1c", margin: "0 0 10px" }}>
            This is shown once only and cannot be retrieved again.
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
            I have saved my token secret
          </label>
        </div>
      )}

      {acknowledged && (
        <>
          {/* Alias toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={useAliases}
              onChange={e => setUseAliases(e.target.checked)}
              disabled={token.entities.every((e: EntityAccess) => !e.alias)}
            />
            Show as aliases
            <span title="Aliases hide your real entity IDs from the page source. Both formats work against the same token." style={{ fontSize: 11, color: "var(--primary-color,#6200ea)", cursor: "help" }}>[?]</span>
          </label>

          {/* Step 1: script tag */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
              Step 1: Add to your page &lt;head&gt; once
            </p>
            <pre style={codeStyle}>{WIDGET_SCRIPT + "\n" + initScript}</pre>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <CopyButton text={WIDGET_SCRIPT + "\n" + initScript} label="Copy step 1" size="sm" />
            </div>
          </div>

          {/* Step 2: card snippet */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
              Step 2: Paste where you want the widget
            </p>
            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              {(["web", "wordpress"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "5px 14px", border: "1px solid var(--divider-color,#e0e0e0)",
                  borderRight: t === "web" ? "none" : undefined,
                  borderRadius: t === "web" ? "6px 0 0 6px" : "0 6px 6px 0",
                  background: tab === t ? "var(--primary-color,#6200ea)" : "var(--primary-background-color,#fff)",
                  color: tab === t ? "#fff" : "var(--primary-text-color,#212121)",
                  fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
                }}>
                  {t === "web" ? "Web page" : "WordPress"}
                </button>
              ))}
            </div>
            <pre style={codeStyle}>{cardSnippet}</pre>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <CopyButton text={cardSnippet} label="Copy step 2" size="sm" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

const DEFAULT_STATE: WizardState = (() => {
  const mem = loadMemory();
  return {
    mode: "single",
    entities: [],
    capability: mem.capability ?? "read",
    originMode: "specific",
    selectedOriginUrl: "",
    expiryOption: (mem.expiryOption as WizardState["expiryOption"]) ?? "never",
    expiryCustomDate: "",
    themeUrl: mem.themeUrl ?? "",
    useHmac: false,
    tokenSecret: null,
    generatedToken: null,
    previewTokenId: null,
  };
})();

export function Wizard({ onClose, onGoToToken }: WizardProps) {
  const [step,    setStep]    = useState(1);
  const [wState,  setWState]  = useState<WizardState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);

  const previewRevoked = useRef(false);

  // Revoke preview token on unmount if not yet revoked
  useEffect(() => {
    return () => {
      if (wState.previewTokenId && !previewRevoked.current) {
        api.tokens.revoke(wState.previewTokenId).catch(() => {});
      }
    };
  }, [wState.previewTokenId]);

  const patchState = useCallback((updates: Partial<WizardState>) => {
    setWState(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceed = (): boolean => {
    if (step === 1) return wState.entities.length > 0;
    if (step === 3 && wState.originMode === "specific") return wState.selectedOriginUrl.length > 0;
    return true;
  };

  const handleNext = async () => {
    if (step === 5 && !wState.previewTokenId) {
      // Create preview token
      try {
        const preview = await api.tokens.createPreview({
          entity_ids: wState.entities.map(e => e.entity_id),
          capability: wState.capability,
        });
        patchState({ previewTokenId: preview.token_id });
      } catch { /* non-fatal */ }
    }

    if (step === 5) {
      // Generate the real token
      setLoading(true);
      setError(null);
      try {
        const entityPayload = wState.entities.map(e => ({
          entity_id: e.entity_id,
          alias: e.alias,
          capability: wState.capability,
          excluded_attributes: [],
        }));
        const origins = wState.originMode === "any"
          ? { allow_any: true, allowed: [], allow_paths: [] }
          : { allow_any: false, allowed: [wState.selectedOriginUrl], allow_paths: [] };
        const expires = expiresAt(wState.expiryOption, wState.expiryCustomDate);

        const token = await api.tokens.create({
          label: wState.entities.map(e => e.entity_id).join(", "),
          entities: entityPayload as Token["entities"],
          origins,
          expires,
        });

        // Revoke preview token
        if (wState.previewTokenId) {
          api.tokens.revoke(wState.previewTokenId).catch(() => {});
          previewRevoked.current = true;
        }

        patchState({ generatedToken: token });
        setStep(6);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
      return;
    }

    setStep(s => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleCloseRequest = () => {
    if (step > 1 && !wState.generatedToken) {
      setConfirmClose(true);
    } else {
      onClose(wState.generatedToken?.token_id);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center" }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create Widget"
        style={{
          background: "var(--primary-background-color,#fff)",
          borderRadius: 16,
          width: "min(680px, 95vw)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", padding: "18px 24px 0", flexShrink: 0 }}>
          <h2 style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "var(--primary-text-color,#212121)", margin: 0 }}>
            {step === 6 && wState.generatedToken ? "Your widget is ready" : "Create Widget"}
          </h2>
          <button
            onClick={handleCloseRequest}
            disabled={step === 6 && !!wState.tokenSecret && !wState.generatedToken}
            aria-label="Close wizard"
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--secondary-text-color,#616161)", lineHeight: 1, padding: 4 }}
          >
            x
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: "16px 0 0", flexShrink: 0 }}>
          <StepIndicator current={step} />
        </div>

        {error && <div style={{ margin: "0 24px" }}><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

        {/* Step content */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px 16px" }}>
          {step === 1 && <Step1 state={wState} onChange={patchState} />}
          {step === 2 && <Step2 state={wState} onChange={patchState} />}
          {step === 3 && <Step3 state={wState} onChange={patchState} />}
          {step === 4 && <Step4 state={wState} onChange={patchState} />}
          {step === 5 && <Step5 state={wState} onChange={patchState} />}
          {step === 6 && wState.generatedToken && (
            <Step6 token={wState.generatedToken} tokenSecret={wState.tokenSecret} />
          )}
        </div>

        {/* Navigation footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 24px",
          borderTop: "1px solid var(--divider-color,#e0e0e0)",
          flexShrink: 0,
        }}>
          {step === 6 && wState.generatedToken ? (
            <>
              <button
                onClick={() => onGoToToken(wState.generatedToken!.token_id)}
                style={{ flex: 1, padding: "10px 0", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, background: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                View token details
              </button>
              <button
                onClick={() => { setWState({ ...DEFAULT_STATE }); setStep(1); }}
                style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, background: "var(--primary-color,#6200ea)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Create another widget
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={step === 1}
                style={{ padding: "9px 20px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, background: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
              >
                Back
              </button>
              <div style={{ flex: 1 }} />
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                style={{
                  padding: "9px 24px", border: "none", borderRadius: 8,
                  background: canProceed() ? "var(--primary-color,#6200ea)" : "var(--divider-color,#e0e0e0)",
                  color: canProceed() ? "#fff" : "var(--secondary-text-color,#9e9e9e)",
                  fontSize: 14, fontWeight: 600, cursor: canProceed() ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {loading && <Spinner size={16} label="Generating..." />}
                {step === 5 ? "Generate" : "Continue"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm close */}
      {confirmClose && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 6000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setConfirmClose(false)}
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
            style={{ background: "var(--primary-background-color,#fff)", borderRadius: 12, padding: 24, maxWidth: 360, width: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Discard and close?</h3>
            <p style={{ fontSize: 14, color: "var(--secondary-text-color,#616161)", marginBottom: 24 }}>
              Your progress will be lost. No token has been created yet.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmClose(false)} style={{ padding: "8px 18px", border: "1px solid var(--divider-color,#e0e0e0)", borderRadius: 8, background: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Keep editing
              </button>
              <button onClick={() => { setConfirmClose(false); onClose(); }} style={{ padding: "8px 18px", border: "none", borderRadius: 8, background: "#c62828", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
