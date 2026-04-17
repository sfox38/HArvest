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
  useState, useEffect, useCallback, useRef, useMemo,
} from "react";
import type { Token, EntityAccess } from "../types";
import { api } from "../api";
import { CopyablePre, Spinner, ErrorBanner } from "./Shared";
import { getEntityCache, loadEntityCache } from "../entityCache";
import type { HAEntity } from "../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WizardMemory {
  capability: "read" | "read-write";
  expiryOption: string;
  themeUrl: string;
  selectedOriginUrl: string;
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
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 6;
const WIDGET_SCRIPT = `<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/widget/dist/harvest.min.js"></script>`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Split a URL into { origin, path } for storage in OriginConfig.
// The browser Origin header contains only scheme+host+port, never a path.
// The path (if any) goes into allow_paths and is matched against the Referer header.
// Examples:
//   "https://oddtunes.com"              -> { origin: "https://oddtunes.com", path: null }
//   "https://oddtunes.com/harvest.html" -> { origin: "https://oddtunes.com", path: "/harvest.html" }
function splitOriginUrl(url: string): { origin: string; path: string | null } {
  try {
    const u = new URL(url);
    const path = (u.pathname && u.pathname !== "/") ? u.pathname : null;
    return { origin: u.origin, path };
  } catch {
    return { origin: url, path: null };
  }
}

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

// Build the card/group snippet with ha-url and token embedded directly.
// This makes each widget self-contained so multiple widgets with different
// tokens can coexist on the same page without overwriting each other.
function buildCardSnippet(token: Token, useAliases: boolean, haUrl: string): string {
  const attrs = `ha-url="${haUrl}" token="${token.token_id}"`;
  const cards = token.entities.map((e: EntityAccess) => {
    const entityAttr = useAliases && e.alias ? `alias="${e.alias}"` : `entity="${e.entity_id}"`;
    return `  <hrv-card ${entityAttr}></hrv-card>`;
  });
  const isGroup = token.entities.length > 1;
  if (isGroup) return `<hrv-group ${attrs}>\n${cards.join("\n")}\n</hrv-group>`;
  // Single card: inline the attrs on the card itself.
  const entityAttr = useAliases && token.entities[0]?.alias
    ? `alias="${token.entities[0].alias}"`
    : `entity="${token.entities[0]?.entity_id ?? ""}"`;
  return `<hrv-card ${attrs} ${entityAttr}></hrv-card>`;
}

function buildWordPressSnippet(token: Token, useAliases: boolean, haUrl: string): string {
  const groupAttrs = `data-ha-url="${haUrl}" data-token="${token.token_id}"`;
  const cards = token.entities.map((e: EntityAccess) => {
    const attr = useAliases && e.alias ? `data-alias="${e.alias}"` : `data-entity="${e.entity_id}"`;
    return `  <div class="hrv-mount" ${attr}></div>`;
  });
  const isGroup = token.entities.length > 1;
  if (isGroup) return `<div class="hrv-group" ${groupAttrs}>\n${cards.join("\n")}\n</div>`;
  const entityAttr = useAliases && token.entities[0]?.alias
    ? `data-alias="${token.entities[0].alias}"`
    : `data-entity="${token.entities[0]?.entity_id ?? ""}"`;
  return `<div class="hrv-mount" ${groupAttrs} ${entityAttr}></div>`;
}

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Entities", "Permissions", "Origin", "Expiry", "Appearance", "Done"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="hrv-step-indicator">
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
              <div className="hrv-step-connector" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EntityAutocomplete - combobox for entity ID selection in Step 1
// ---------------------------------------------------------------------------

interface EntityAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  onSelect: (entityId: string) => void;
  disabled?: boolean;
}

function EntityAutocomplete({ value, onChange, onSelect, disabled }: EntityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo<HAEntity[]>(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return getEntityCache()
      .filter(e =>
        e.entity_id.toLowerCase().includes(q) ||
        e.friendly_name.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [value]);

  useEffect(() => { setHighlighted(0); }, [matches.length]);

  // Recalculate fixed position whenever the dropdown opens or matches change.
  useEffect(() => {
    if (open && matches.length > 0 && inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setDropdownRect({ top: r.bottom, left: r.left, width: r.width });
    } else {
      setDropdownRect(null);
    }
  }, [open, matches.length]);

  const select = (entityId: string) => {
    onSelect(entityId);
    onChange("");
    setOpen(false);
  };

  return (
    <div style={{ flex: 1 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (!open || matches.length === 0) {
            if (e.key === "Enter" && value.trim().includes(".")) {
              select(value.trim());
              e.preventDefault();
            }
            return;
          }
          if (e.key === "ArrowDown") { setHighlighted(h => Math.min(h + 1, matches.length - 1)); e.preventDefault(); }
          else if (e.key === "ArrowUp") { setHighlighted(h => Math.max(h - 1, 0)); e.preventDefault(); }
          else if (e.key === "Enter") { select(matches[highlighted].entity_id); e.preventDefault(); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
        disabled={disabled}
        placeholder="Search entity ID or friendly name..."
        className="hrv-input"
        style={{ width: "100%", boxSizing: "border-box" }}
      />
      {dropdownRect && (
        <div
          className="hrv-autocomplete-dropdown"
          style={{
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
          }}
        >
          {matches.map((e, i) => (
            <div
              key={e.entity_id}
              onMouseDown={() => select(e.entity_id)}
              onMouseEnter={() => setHighlighted(i)}
              className="hrv-autocomplete-item"
              style={{
                background: i === highlighted ? "var(--secondary-background-color,#f5f5f5)" : "transparent",
                borderBottom: i < matches.length - 1 ? "1px solid var(--divider-color,#f0f0f0)" : "none",
              }}
            >
              <span className="hrv-domain-badge">{e.domain}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.entity_id}
                </div>
                {e.friendly_name !== e.entity_id && (
                  <div style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.friendly_name}
                  </div>
                )}
              </div>
              <span style={{
                fontSize: 11, flexShrink: 0,
                color: e.state === "on" || e.state === "open" ? "#43a047" : "var(--secondary-text-color,#9e9e9e)",
              }}>
                {e.state}
              </span>
            </div>
          ))}
        </div>
      )}
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

  useEffect(() => {
    if (getEntityCache().length === 0) {
      loadEntityCache();
    }
  }, []);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0 }}>
        {(["single", "group"] as const).map(m => (
          <button
            key={m}
            onClick={() => onChange({ mode: m, entities: [] })}
            className={m === "single" ? "hrv-seg-left" : "hrv-seg-right"}
            style={{
              background: state.mode === m ? "var(--primary-color,#6200ea)" : "transparent",
              color: state.mode === m ? "#fff" : "var(--primary-color,#6200ea)",
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

      {/* Entity input with autocomplete */}
      <EntityAutocomplete
        value={entityInput}
        onChange={setEntityInput}
        onSelect={id => { selectEntity(id); setEntityInput(""); }}
        disabled={loadingAlias !== null}
      />

      {/* Selected entities */}
      {state.entities.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)" }}>
            Selected ({state.entities.length}):
          </div>
          {state.entities.map(e => (
            <div key={e.entity_id} className="hrv-inset-sm" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
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
        { value: "read"       as const, label: "View only",       desc: "Visitors can see the current state of your device but cannot control it." },
        { value: "read-write" as const, label: "View and control", desc: "Visitors can see the state and send commands, such as toggling a light or adjusting brightness." },
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

const ORIGIN_CUSTOM = "__custom__";

const HIDDEN_ORIGINS_KEY = "hrv_hidden_origins";

function loadHiddenOrigins(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_ORIGINS_KEY) ?? "[]")); }
  catch { return new Set(); }
}

function saveHiddenOrigins(set: Set<string>) {
  try { localStorage.setItem(HIDDEN_ORIGINS_KEY, JSON.stringify(Array.from(set))); }
  catch { /* ignore */ }
}

function Step3({ state, onChange }: { state: WizardState; onChange: (u: Partial<WizardState>) => void }) {
  const [allOrigins,    setAllOrigins]    = useState<string[]>([]);
  const [hiddenOrigins, setHiddenOrigins] = useState<Set<string>>(loadHiddenOrigins);
  const [usingCustom,   setUsingCustom]   = useState(false);
  const showWarning = state.originMode === "any" && state.capability === "read-write";

  useEffect(() => {
    api.tokens.list().then(tokens => {
      const seen = new Set<string>();
      tokens.forEach(t => {
        if (!t.origins.allow_any) {
          t.origins.allowed.forEach(o => {
            if (t.origins.allow_paths.length > 0) {
              t.origins.allow_paths.forEach(p => seen.add(`${o}${p}`));
            } else {
              seen.add(o);
            }
          });
        }
      });
      const list = Array.from(seen);
      setAllOrigins(list);
      if (state.selectedOriginUrl && !list.includes(state.selectedOriginUrl)) {
        setUsingCustom(true);
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const existingOrigins = allOrigins.filter(o => !hiddenOrigins.has(o));
  const hasExisting = existingOrigins.length > 0;
  const showTextInput = !hasExisting || usingCustom;
  const selectVal = usingCustom ? ORIGIN_CUSTOM : (state.selectedOriginUrl || "");

  // The delete button is only active when a real existing origin is selected.
  const canDelete = !usingCustom && !!state.selectedOriginUrl && state.selectedOriginUrl !== ORIGIN_CUSTOM;

  const handleDeleteOrigin = () => {
    const toHide = state.selectedOriginUrl;
    if (!toHide) return;
    const next = new Set(hiddenOrigins);
    next.add(toHide);
    setHiddenOrigins(next);
    saveHiddenOrigins(next);
    onChange({ selectedOriginUrl: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>
        Where will this widget appear?
      </p>

      {/* Specific website or page */}
      <label style={{ display: "flex", gap: 12, cursor: "pointer" }}>
        <input type="radio" name="originMode" value="specific" checked={state.originMode === "specific"} onChange={() => onChange({ originMode: "specific" })} style={{ marginTop: 2, accentColor: "var(--primary-color,#6200ea)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>A specific website or page</div>
          {state.originMode === "specific" && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {hasExisting && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select
                    value={selectVal}
                    onChange={e => {
                      if (e.target.value === ORIGIN_CUSTOM) {
                        setUsingCustom(true);
                        onChange({ selectedOriginUrl: "" });
                      } else {
                        setUsingCustom(false);
                        onChange({ selectedOriginUrl: e.target.value });
                      }
                    }}
                    className="hrv-select-sm"
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Select an origin --</option>
                    {existingOrigins.map(o => <option key={o} value={o}>{o}</option>)}
                    <option value={ORIGIN_CUSTOM}>Enter a new URL...</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleDeleteOrigin}
                    disabled={!canDelete}
                    title="Remove this URL from the list"
                    style={{
                      padding: "4px 10px", border: "1px solid var(--divider-color,#e0e0e0)",
                      borderRadius: 6, background: "var(--primary-background-color,#fff)",
                      color: canDelete ? "#c62828" : "var(--secondary-text-color,#9e9e9e)",
                      fontSize: 12, cursor: canDelete ? "pointer" : "default",
                      whiteSpace: "nowrap", flexShrink: 0,
                    }}
                  >
                    Delete URL
                  </button>
                </div>
              )}
              {showTextInput && (
                <input
                  value={state.selectedOriginUrl}
                  onChange={e => onChange({ selectedOriginUrl: e.target.value })}
                  placeholder="https://example.com"
                  autoFocus={hasExisting}
                  className="hrv-input-sm"
                />
              )}
              <p style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", margin: 0 }}>
                Site only (e.g. https://example.com) or a specific page (e.g. https://example.com/page.html). A path restricts the widget to that page only.
              </p>
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
        <div className="hrv-alert-warn">
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
    { value: "never",  label: "Never expires" },
    { value: "30d",    label: "30 days"       },
    { value: "90d",    label: "90 days"       },
    { value: "1y",     label: "1 year"        },
    { value: "custom", label: "Custom date"   },
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
              min={new Date().toISOString().split("T")[0]}
              className="hrv-input-sm"
              style={{ padding: "4px 8px" }}
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
          className="hrv-select"
          style={{ width: "100%" }}
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
  originMode: "specific" | "any";
  originUrl: string;
}

function Step6({ token, tokenSecret, originMode, originUrl }: Step6Props) {
  const [useAliases,   setUseAliases]   = useState(false);
  const [tab,          setTab]          = useState<"web" | "wordpress">("web");
  const [acknowledged, setAcknowledged] = useState(!tokenSecret);
  const [widgetName,   setWidgetName]   = useState(token.label);
  const [nameSaving,   setNameSaving]   = useState(false);

  const haUrl = window.location.origin;

  const cardSnippet = tab === "web"
    ? buildCardSnippet(token, useAliases, haUrl)
    : buildWordPressSnippet(token, useAliases, haUrl);

  const hostDisplay = originMode === "any" ? "Anywhere" : (originUrl || haUrl);

  const saveWidgetName = async (name: string) => {
    if (!name.trim() || name === token.label) return;
    setNameSaving(true);
    try {
      await api.tokens.update(token.token_id, { label: name.trim() });
    } catch { /* non-fatal */ }
    finally { setNameSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: "var(--primary-text-color,#212121)" }}>
        Your widget is ready.
      </p>

      {/* HMAC secret acknowledgement */}
      {tokenSecret && (
        <div className="hrv-alert-secret">
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
          {/* Host URL + Widget name */}
          <div style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)", lineHeight: 1.8 }}>
            <div>
              <span style={{ fontWeight: 600, color: "var(--primary-text-color,#212121)" }}>Host URL:</span>{" "}
              {hostDisplay}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", display: "block", marginBottom: 4 }}>
              Widget name
            </label>
            <input
              value={widgetName}
              onChange={e => setWidgetName(e.target.value)}
              onBlur={e => saveWidgetName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
              disabled={nameSaving}
              className="hrv-input-sm"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <p style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", margin: "4px 0 0" }}>
              A label to identify this widget in your token list. Edit and press Enter to save.
            </p>
          </div>

          {/* Step 1: script tag */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
              Step 1: Add to your page &lt;head&gt; once (click to copy)
            </p>
            <CopyablePre text={WIDGET_SCRIPT} label="Copy step 1" />
          </div>

          {/* Step 2: card snippet */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary-text-color,#616161)", marginBottom: 6 }}>
              Step 2: Paste where you want the widget (click to copy)
            </p>
            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              {(["web", "wordpress"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={t === "web" ? "hrv-tab-left" : "hrv-tab-right"}
                  style={{
                    background: tab === t ? "var(--primary-color,#6200ea)" : "var(--primary-background-color,#fff)",
                    color: tab === t ? "#fff" : "var(--primary-text-color,#212121)",
                    fontWeight: tab === t ? 600 : 400,
                  }}
                >
                  {t === "web" ? "Web page" : "WordPress"}
                </button>
              ))}
            </div>
            <CopyablePre text={cardSnippet} label="Copy step 2" />
          </div>

          {/* Alias toggle - below Step 2 */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={useAliases}
              onChange={e => setUseAliases(e.target.checked)}
              disabled={token.entities.every((e: EntityAccess) => !e.alias)}
            />
            Use alias
            <span title="Aliases hide your real entity IDs from the page source. Both formats work against the same token." style={{ fontSize: 11, color: "var(--primary-color,#6200ea)", cursor: "help" }}>[?]</span>
          </label>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

function freshState(): WizardState {
  const mem = loadMemory();
  return {
    mode: "single",
    entities: [],
    capability: mem.capability ?? "read",
    originMode: "specific",
    selectedOriginUrl: mem.selectedOriginUrl ?? "",
    expiryOption: (mem.expiryOption as WizardState["expiryOption"]) ?? "never",
    expiryCustomDate: "",
    themeUrl: mem.themeUrl ?? "",
    useHmac: false,
    tokenSecret: null,
    generatedToken: null,
    previewTokenId: null,
  };
}

export function Wizard({ onClose }: WizardProps) {
  const [step,    setStep]    = useState(1);
  // Lazy initializer: called fresh on every mount so it reads the latest localStorage.
  const [wState,  setWState]  = useState<WizardState>(freshState);
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
    if (step === 3 && wState.originMode === "specific") {
      try {
        const u = new URL(wState.selectedOriginUrl);
        return (u.protocol === "http:" || u.protocol === "https:") && u.host.length > 0;
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (step === 3 && wState.originMode === "specific" && wState.selectedOriginUrl) {
      saveMemory({ selectedOriginUrl: wState.selectedOriginUrl });
    }

    if (step === 5 && !wState.previewTokenId) {
      // Create preview token
      try {
        const preview = await api.tokens.createPreview({
          entity_ids: wState.entities.map(e => e.entity_id),
          capabilities: wState.capability,
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
          capabilities: wState.capability,
          exclude_attributes: [],
        }));
        const { origin: originHost, path: originPath } = splitOriginUrl(wState.selectedOriginUrl);
        const origins = wState.originMode === "any"
          ? { allow_any: true, allowed: [], allow_paths: [] }
          : { allow_any: false, allowed: [originHost], allow_paths: originPath ? [originPath] : [] };
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
    <div className="hrv-wizard-overlay" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create Widget"
        className="hrv-wizard-dialog"
      >
        {/* Modal header */}
        <div className="hrv-wizard-header">
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
        <div className="hrv-wizard-body">
          {step === 1 && <Step1 state={wState} onChange={patchState} />}
          {step === 2 && <Step2 state={wState} onChange={patchState} />}
          {step === 3 && <Step3 state={wState} onChange={patchState} />}
          {step === 4 && <Step4 state={wState} onChange={patchState} />}
          {step === 5 && <Step5 state={wState} onChange={patchState} />}
          {step === 6 && wState.generatedToken && (
            <Step6
              token={wState.generatedToken}
              tokenSecret={wState.tokenSecret}
              originMode={wState.originMode}
              originUrl={wState.selectedOriginUrl}
            />
          )}
        </div>

        {/* Navigation footer */}
        <div className="hrv-wizard-footer">
          {step === 6 && wState.generatedToken ? (
            <button
              onClick={() => onClose(wState.generatedToken!.token_id)}
              style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, background: "var(--primary-color,#6200ea)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="hrv-btn"
                style={{ padding: "9px 20px" }}
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
          className="hrv-wizard-confirm-overlay"
          onClick={() => setConfirmClose(false)}
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
            className="hrv-dialog"
            style={{ maxWidth: 360 }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Discard and close?</h3>
            <p style={{ fontSize: 14, color: "var(--secondary-text-color,#616161)", marginBottom: 24 }}>
              Your progress will be lost. No token has been created yet.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmClose(false)} className="hrv-btn" style={{ padding: "8px 18px" }}>
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
