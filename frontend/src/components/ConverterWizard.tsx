/**
 * ConverterWizard.tsx - Convert a Lovelace dashboard into HArvest HTML.
 *
 * Four-step wizard: Select Dashboard, Configure, Generate, Done.
 * Reuses the same overlay/dialog/stepper pattern as Wizard.tsx.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../api";
import { Spinner, ErrorBanner, ConfirmDialog, ThemeStrip, themeIdToUrl, themeUrlToId } from "./Shared";
import { IconSetSelect } from "./IconPicker";
import { Icon } from "./Icon";
import { loadKnownOrigins, addKnownOrigin, validateOriginUrl, displayOriginLabel } from "./originMemory";
import type { ThemeDefinition } from "../types";
import {
  extractView, buildTokenSpecs, getAllEntities, countUnsupported,
  TIER3_DOMAINS,
  type ViewData,
} from "../lovelaceParser";
import { renderPage } from "../lovelaceHtml";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Dashboard", "Configure", "Generate", "Done"];
const TOTAL_STEPS = STEP_LABELS.length;
const TOKEN_LABEL_PREFIX = "Converted: ";

type CapMode = "badge" | "read" | "read-write" | "smart";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardInfo {
  url_path: string | null;
  title: string;
  mode: string;
}

interface ConverterState {
  dashboards: DashboardInfo[] | null;
  selectedDashboard: string | null | undefined; // undefined = not chosen, null = default dashboard
  parsedViews: ViewData[];
  selectedViewIndices: Set<number>;
  capMode: CapMode;
  themeUrl: string;
  iconSet: string | null;
  originMode: "specific" | "any";
  originUrl: string;
  createdTokenIds: string[];
  generatedHtml: string | null;
  generateErrors: string[];
  generateProgress: string;
}

interface ConverterWizardProps {
  onClose: (createdTokenIds?: string[]) => void;
}

// ---------------------------------------------------------------------------
// StepIndicator (shared pattern with Wizard.tsx)
// ---------------------------------------------------------------------------

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="stepper" role="list" aria-label="Converter steps">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum < current ? "done" : stepNum === current ? "active" : "pending";
        return (
          <React.Fragment key={label}>
            <div className="step" data-state={state} role="listitem" aria-current={state === "active" ? "step" : undefined}>
              <span className="step-num" aria-hidden="true">
                {state === "done" ? <Icon name="check" size={11} /> : stepNum}
              </span>
              <span className="step-label">{label}</span>
              <span className="sr-only">{`Step ${stepNum}: ${label}${state === "done" ? " (completed)" : state === "active" ? " (current)" : ""}`}</span>
            </div>
            {i < STEP_LABELS.length - 1 && <div className="step-line" aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Dashboard Selection
// ---------------------------------------------------------------------------

function Step1Dashboard({
  state, onChange, onConfigLoaded, onError,
}: {
  state: ConverterState;
  onChange: (patch: Partial<ConverterState>) => void;
  onConfigLoaded: (views: ViewData[]) => void;
  onError: (msg: string) => void;
}) {
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    if (state.dashboards !== null) return;
    api.lovelace.dashboards().then(dbs => {
      onChange({ dashboards: dbs });
    }).catch(() => {
      onError("Failed to fetch dashboards. Check that Home Assistant is reachable.");
      onChange({ dashboards: [] });
    });
  }, []);

  const selectDashboard = async (urlPath: string | null) => {
    onChange({ selectedDashboard: urlPath });
    setLoadingConfig(true);
    try {
      const config = await api.lovelace.config(urlPath);
      const rawViews = (config.views ?? []) as Record<string, unknown>[];
      if (rawViews.length === 0) {
        onError("This dashboard has no views.");
        setLoadingConfig(false);
        return;
      }
      const parsed = rawViews.map(extractView);
      onConfigLoaded(parsed);
    } catch {
      onError("Failed to load dashboard config.");
    }
    setLoadingConfig(false);
  };

  if (state.dashboards === null) {
    return <div className="center-spinner"><Spinner size={32} /></div>;
  }

  if (state.dashboards.length === 0) {
    return <p className="muted">No dashboards found.</p>;
  }

  return (
    <div className="col gap-12">
      <p className="fs-13">Select a Lovelace dashboard to convert into a standalone HArvest HTML page.</p>
      <div className="converter-dashboard-list">
        {state.dashboards.map(db => {
          const key = db.url_path ?? "__default__";
          const selected = state.selectedDashboard === db.url_path && state.selectedDashboard !== undefined;
          return (
            <button
              key={key}
              className={`choice${selected ? " selected" : ""}`}
              onClick={() => selectDashboard(db.url_path)}
              disabled={loadingConfig}
            >
              <div>
                <strong>{db.title}</strong>
                <span className="fs-11 muted" style={{ marginLeft: 8 }}>{db.mode}</span>
              </div>
            </button>
          );
        })}
      </div>
      {loadingConfig && (
        <div className="row gap-8" style={{ alignItems: "center" }}>
          <Spinner size={16} /> <span className="fs-12 muted">Loading dashboard config...</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Configure
// ---------------------------------------------------------------------------

function Step2Configure({
  state, onChange, themes, maxPerToken, onMaxPerTokenChange,
}: {
  state: ConverterState;
  onChange: (patch: Partial<ConverterState>) => void;
  themes: ThemeDefinition[];
  maxPerToken: number;
  onMaxPerTokenChange: (v: number) => void;
}) {
  const [knownOrigins] = useState(() => loadKnownOrigins());

  const toggleView = (idx: number) => {
    const next = new Set(state.selectedViewIndices);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    onChange({ selectedViewIndices: next });
  };

  const selectedViews = state.parsedViews.filter((_, i) => state.selectedViewIndices.has(i));
  const allEntities = selectedViews.flatMap(getAllEntities);
  const tier3Count = new Set(allEntities.filter(e => TIER3_DOMAINS.has(e.domain)).map(e => e.entity_id)).size;
  const uniqueSupported = new Set(allEntities.filter(e => !TIER3_DOMAINS.has(e.domain)).map(e => e.entity_id)).size;
  const unsupportedCount = selectedViews.reduce((sum, v) => sum + v.sections.reduce((s2, sec) => s2 + countUnsupported(sec.cards), 0), 0);

  const domainCounts: Record<string, number> = {};
  for (const e of allEntities) {
    if (!TIER3_DOMAINS.has(e.domain)) {
      domainCounts[e.domain] = (domainCounts[e.domain] ?? 0) + 1;
    }
  }
  const domainSummary = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([d, c]) => `${d} (${c})`)
    .join(", ");

  const estimatedTokens = selectedViews.reduce((sum, v) => {
    const count = new Set(getAllEntities(v).filter(e => !TIER3_DOMAINS.has(e.domain)).map(e => e.entity_id)).size;
    return sum + Math.max(1, Math.ceil(count / maxPerToken));
  }, 0);

  return (
    <div className="col gap-18">
      {/* View selection */}
      <div className="col gap-6">
        <div className="row gap-8" style={{ alignItems: "baseline" }}>
          <div className="label-strong">Views to convert</div>
          {state.selectedViewIndices.size === 0 && (
            <span className="muted fs-11">(select at least one)</span>
          )}
        </div>
        <div className="col gap-4">
          {state.parsedViews.map((view, i) => {
            const entCount = getAllEntities(view).length;
            return (
              <label key={i} className="converter-view-row">
                <input
                  type="checkbox"
                  checked={state.selectedViewIndices.has(i)}
                  onChange={() => toggleView(i)}
                />
                <span>{view.title}</span>
                <span className="muted fs-11">({entCount} entities)</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Capability mode */}
      <div className="col gap-6">
        <div className="label-strong">Entity capabilities</div>
        <div className="col gap-4">
          {([
            ["smart", "Smart defaults", "Read-only for sensors, read-write for controllable (recommended)"],
            ["read", "Read only", "State display only, no controls"],
            ["read-write", "Control", "Full read-write control"],
            ["badge", "Badge", "Compact pill indicator (icon + state only)"],
          ] as [CapMode, string, string][]).map(([value, label, desc]) => (
            <label key={value} className="choice" data-selected={state.capMode === value}>
              <input
                type="radio"
                name="converter-cap"
                checked={state.capMode === value}
                onChange={() => onChange({ capMode: value })}
                style={{ display: "none" }}
              />
              <div>
                <strong>{label}</strong>
                <div className="fs-11 muted">{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Theme selector */}
      <div className="col" style={{ gap: 4 }}>
        <label className="label-strong">Theme</label>
        <ThemeStrip
          themes={themes}
          selectedId={themeUrlToId(state.themeUrl)}
          onSelect={id => onChange({ themeUrl: themeIdToUrl(id) })}
          ariaLabel="Widget theme"
        />
      </div>

      {/* Global icon set */}
      <div className="col" style={{ gap: 4 }}>
        <label className="label-strong">Icons</label>
        <IconSetSelect
          value={state.iconSet}
          onChange={id => onChange({ iconSet: id })}
          ariaLabel="Icon set"
          themeDefaultSetId={themes.find(t => t.theme_id === themeUrlToId(state.themeUrl))?.icon_set ?? null}
        />
      </div>

      {/* Origin */}
      <div className="col gap-6">
        <div className="label-strong">Origin restriction</div>
        <div className="col gap-4">
          <label className="choice" data-selected={state.originMode === "any"}>
            <input
              type="radio"
              name="converter-origin"
              checked={state.originMode === "any"}
              onChange={() => onChange({ originMode: "any" })}
              style={{ display: "none" }}
            />
            <span>Any website</span>
          </label>
          <label className="choice" data-selected={state.originMode === "specific"}>
            <input
              type="radio"
              name="converter-origin"
              checked={state.originMode === "specific"}
              onChange={() => onChange({ originMode: "specific" })}
              style={{ display: "none" }}
            />
            <span>Specific website</span>
          </label>
        </div>
        {state.originMode === "specific" && (
          <div className="col gap-4" style={{ paddingLeft: 12 }}>
            {knownOrigins.length > 0 && (
              <div className="col gap-2">
                {knownOrigins.map(o => (
                  <button
                    key={o}
                    className="choice"
                    data-selected={state.originUrl === o}
                    onClick={() => onChange({ originUrl: o })}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {displayOriginLabel(o)}
                  </button>
                ))}
              </div>
            )}
            <input
              type="url"
              className="input"
              placeholder="https://example.com"
              value={state.originUrl}
              onChange={e => onChange({ originUrl: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Max cards per group */}
      <div className="col gap-6">
        <div className="label-strong">Max cards per group</div>
        <div className="row gap-10" style={{ alignItems: "center" }}>
          <input
            type="number"
            className="input converter-max-input"
            min={5}
            max={100}
            value={maxPerToken}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onMaxPerTokenChange(Math.max(5, Math.min(100, v)));
            }}
          />
          <input
            type="range"
            className="converter-max-slider"
            min={5}
            max={100}
            value={maxPerToken}
            onChange={e => onMaxPerTokenChange(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="converter-summary">
        <div className="label-strong-13">Summary</div>
        <div className="fs-12">
          <div>{selectedViews.length} view{selectedViews.length !== 1 ? "s" : ""} selected, {uniqueSupported} entities, ~{estimatedTokens} widget{estimatedTokens !== 1 ? "s" : ""}</div>
          {domainSummary && <div className="muted">{domainSummary}</div>}
          {unsupportedCount > 0 && <div className="muted">{unsupportedCount} unsupported card{unsupportedCount !== 1 ? "s" : ""} (placeholders)</div>}
          {tier3Count > 0 && <div className="muted">{tier3Count} blocked (Tier 3) entit{tier3Count !== 1 ? "ies" : "y"}</div>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Generate (processing)
// ---------------------------------------------------------------------------

function Step3Generate({ progress }: { progress: string }) {
  return (
    <div className="col gap-12" style={{ alignItems: "center", justifyContent: "center", minHeight: 200 }}>
      <Spinner size={40} />
      <p className="fs-13">{progress || "Preparing..."}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Done
// ---------------------------------------------------------------------------

function Step4Done({
  html, tokenCount, entityCount, viewCount, errors,
  onDownload, onClose,
}: {
  html: string | null;
  tokenCount: number;
  entityCount: number;
  viewCount: number;
  errors: string[];
  onDownload: () => void;
  onClose: () => void;
}) {
  const sizeKb = html ? (new Blob([html]).size / 1024).toFixed(1) : null;
  const [downloaded, setDownloaded] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  // Shown once on arrival: the generated page only exists in this dialog.
  const [showDownloadAlert, setShowDownloadAlert] = useState(!!html);

  const handleDownloadClick = () => {
    setDownloaded(true);
    onDownload();
  };
  const handleCloseClick = () => {
    if (html && !downloaded) {
      setConfirmLeave(true);
      return;
    }
    onClose();
  };

  return (
    <div className="col gap-18">
      <div className="col gap-6" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32 }}><Icon name={tokenCount > 0 ? "check" : "alert"} size={32} /></div>
        <div className="label-strong-13">{tokenCount > 0 ? "Dashboard converted" : "Conversion failed"}</div>
      </div>

      <div className="converter-summary">
        <div className="fs-12">
          <div>{viewCount} view{viewCount !== 1 ? "s" : ""} converted</div>
          <div>{entityCount} entities embedded</div>
          <div>{tokenCount} widget{tokenCount !== 1 ? "s" : ""} created</div>
          {sizeKb && <div>HTML file: {sizeKb} KB</div>}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="col gap-4">
          <div className="label-strong" style={{ color: "var(--danger)" }}>Errors</div>
          {errors.map((e, i) => <div key={i} className="error-msg">{e}</div>)}
        </div>
      )}

      {showDownloadAlert && (
        <ConfirmDialog
          title="Download your page now"
          message="The generated HTML is not stored anywhere and cannot be retrieved after this dialog closes; only the widgets themselves are saved."
          confirmLabel="Download HTML"
          onConfirm={() => { setShowDownloadAlert(false); handleDownloadClick(); }}
          onCancel={() => setShowDownloadAlert(false)}
        />
      )}

      <div className="col gap-8" style={{ alignItems: "center" }}>
        {html && (
          <button className="btn btn-primary" onClick={handleDownloadClick} style={{ minWidth: 200 }}>
            <Icon name="download" size={14} /> Download HTML
          </button>
        )}
        <button className="btn btn-ghost" onClick={handleCloseClick}>
          {tokenCount > 0 ? "View created widgets" : "Close"}
        </button>
      </div>

      {confirmLeave && (
        <ConfirmDialog
          title="Close without downloading?"
          message="The generated HTML page is not stored and cannot be retrieved later. Your widgets are saved, but the page itself will be lost."
          confirmLabel="Close anyway"
          confirmDestructive
          onConfirm={() => { setConfirmLeave(false); onClose(); }}
          onCancel={() => setConfirmLeave(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ConverterWizard
// ---------------------------------------------------------------------------

export function ConverterWizard({ onClose }: ConverterWizardProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [maxPerToken, setMaxPerToken] = useState(40);
  const [overrideHost, setOverrideHost] = useState("");
  const [widgetScriptUrl, setWidgetScriptUrl] = useState("");
  const [externalPort, setExternalPort] = useState(0);
  const generateLockRef = useRef(false);

  const [state, setState] = useState<ConverterState>({
    dashboards: null,
    selectedDashboard: undefined,
    parsedViews: [],
    selectedViewIndices: new Set(),
    capMode: "smart",
    themeUrl: "",
    iconSet: null,
    originMode: "any",
    originUrl: "",
    createdTokenIds: [],
    generatedHtml: null,
    generateErrors: [],
    generateProgress: "",
  });

  const patchState = useCallback((patch: Partial<ConverterState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    api.themes.list().then(setThemes).catch(() => {});
    api.config.get().then(c => {
      setOverrideHost(c.override_host ?? "");
      setWidgetScriptUrl(c.widget_script_url ?? "");
      setExternalPort(c.external_port ?? 0);
    }).catch(() => {});
  }, []);

  const selectedViews = state.parsedViews.filter((_, i) => state.selectedViewIndices.has(i));

  const canProceed = (): boolean => {
    if (step === 1) return state.parsedViews.length > 0;
    if (step === 2) {
      if (state.selectedViewIndices.size === 0) return false;
      if (state.originMode === "specific" && !validateOriginUrl(state.originUrl)) return false;
      const hasEntities = selectedViews.some(v =>
        getAllEntities(v).some(e => !TIER3_DOMAINS.has(e.domain)),
      );
      return hasEntities;
    }
    return false;
  };

  const handleConfigLoaded = (views: ViewData[]) => {
    patchState({ parsedViews: views, selectedViewIndices: new Set() });
    setError(null);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (generateLockRef.current) return;
    generateLockRef.current = true;
    setLoading(true);
    setError(null);
    setStep(3);

    const themeUrl = state.themeUrl;
    const capMode = state.capMode;
    const originMode = state.originMode;
    const originUrl = state.originUrl;

    const errors: string[] = [];
    const createdIds: string[] = [];

    try {
      const specs = buildTokenSpecs(selectedViews, capMode, maxPerToken);
      if (specs.length === 0) {
        setError("No entities to convert.");
        setStep(2);
        setLoading(false);
        generateLockRef.current = false;
        return;
      }

      const haUrl = overrideHost || window.location.origin;
      const trimmedCustom = widgetScriptUrl.trim();
      const scriptUrl = trimmedCustom
        || (externalPort > 0
          ? (() => { try { const u = new URL(haUrl); return `${u.protocol}//${u.hostname}:${externalPort}/harvest.min.js`; } catch { return `${haUrl.replace(/\/+$/, "")}:${externalPort}/harvest.min.js`; } })()
          : `${haUrl.replace(/\/+$/, "")}/harvest_assets/harvest.min.js`);
      const tokenMap: Record<string, string[]> = {};

      // Fetch existing labels so we can deduplicate like macOS (Fans, Fans (2), ...)
      let existingLabels: Set<string>;
      try {
        const allTokens = await api.tokens.list();
        existingLabels = new Set(allTokens.map(t => t.label));
      } catch {
        existingLabels = new Set();
      }

      for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        patchState({ generateProgress: `Creating widget ${i + 1} of ${specs.length}...` });

        const viewTitle = spec.label.split(" (")[0];
        if (!tokenMap[viewTitle]) tokenMap[viewTitle] = [];

        // Generate aliases
        patchState({ generateProgress: `Generating aliases for widget ${i + 1}...` });
        for (const ent of spec.entities) {
          try {
            const result = await api.tokens.generateAlias(ent.entity_id);
            if (result.alias) (ent as Record<string, unknown>).alias = result.alias;
          } catch { /* alias generation is best-effort */ }
        }

        // Deduplicate label: "Converted: Fans" -> "Converted: Fans (2)" etc.
        let label = TOKEN_LABEL_PREFIX + spec.label;
        if (existingLabels.has(label)) {
          let n = 2;
          while (existingLabels.has(`${TOKEN_LABEL_PREFIX}${spec.label} (${n})`)) n++;
          label = `${TOKEN_LABEL_PREFIX}${spec.label} (${n})`;
        }

        // Create token
        patchState({ generateProgress: `Creating widget ${i + 1} of ${specs.length}...` });
        try {
          const origins = originMode === "specific" && originUrl
            ? { allow_any: false, allowed: [originUrl] }
            : { allow_any: true, allowed: [] as string[] };

          const payload: Record<string, unknown> = {
            label,
            entities: spec.entities,
            embed_mode: "page",
            origins,
            theme_url: themeUrl,
            icon_set: state.iconSet,
          };

          const token = await api.tokens.create(payload);
          const tokenId = token.token_id;
          createdIds.push(tokenId);
          existingLabels.add(label);
          tokenMap[viewTitle].push(tokenId);
        } catch (err) {
          errors.push(`Failed to create widget "${spec.label}": ${err}`);
        }
      }

      // Save origin
      if (originMode === "specific" && originUrl) {
        addKnownOrigin(originUrl);
      }

      // Generate HTML only if at least one token was created
      let html: string | null = null;
      if (createdIds.length > 0) {
        patchState({ generateProgress: "Generating HTML..." });
        html = renderPage(selectedViews, tokenMap, haUrl, scriptUrl, maxPerToken);
      }

      patchState({
        createdTokenIds: createdIds,
        generatedHtml: html,
        generateErrors: errors,
        generateProgress: "",
      });
      setStep(4);
    } catch (err) {
      setError(`Generation failed: ${err}`);
      setStep(2);
    }

    setLoading(false);
    generateLockRef.current = false;
  };

  const handleDownload = () => {
    if (!state.generatedHtml) return;
    const blob = new Blob([state.generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (step === 2) {
      handleGenerate();
      return;
    }
  };

  const handleCloseRequest = () => {
    if (step === 4 || state.parsedViews.length === 0) {
      onClose(state.createdTokenIds.length > 0 ? state.createdTokenIds : undefined);
    } else {
      setConfirmClose(true);
    }
  };

  const isDone = step === 4;

  const entityCount = selectedViews.flatMap(getAllEntities).filter(e => !TIER3_DOMAINS.has(e.domain)).length;

  return (
    <div className="overlay" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Convert Dashboard"
        className="wizard"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="wizard-head">
          <div className="wizard-head-brand">
            <img src="/harvest_assets/icon.png" alt="HArvest" style={{ width: 22, height: 22 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="wizard-head-title">
              {isDone ? "Conversion complete" : "Convert dashboard"}
            </div>
            <div className="wizard-head-sub">
              Step {step} of {TOTAL_STEPS} - {STEP_LABELS[step - 1]}
            </div>
          </div>
          <button
            onClick={handleCloseRequest}
            aria-label="Close"
            className="icon-btn"
            style={{ flexShrink: 0 }}
            disabled={loading}
          >
            <Icon name="close" size={15} />
          </button>
        </div>

        {/* Stepper */}
        {!isDone && (
          <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--divider)", flexShrink: 0, overflowX: "auto" }}>
            <StepIndicator current={step} />
          </div>
        )}

        {error && (
          <div style={{ padding: "0 22px 0" }}>
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Body */}
        <div className="wizard-body">
          {step === 1 && (
            <Step1Dashboard
              state={state}
              onChange={patchState}
              onConfigLoaded={handleConfigLoaded}
              onError={setError}
            />
          )}
          {step === 2 && (
            <Step2Configure
              state={state}
              onChange={patchState}
              themes={themes}
              maxPerToken={maxPerToken}
              onMaxPerTokenChange={setMaxPerToken}
            />
          )}
          {step === 3 && <Step3Generate progress={state.generateProgress} />}
          {isDone && (
            <Step4Done
              html={state.generatedHtml}
              tokenCount={state.createdTokenIds.length}
              entityCount={entityCount}
              viewCount={selectedViews.length}
              errors={state.generateErrors}
              onDownload={handleDownload}
              onClose={() => onClose(state.createdTokenIds)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="wizard-foot">
          {isDone ? (
            <>
              <div className="spacer" />
              <button
                onClick={() => onClose(state.createdTokenIds)}
                className="btn btn-primary"
              >
                Done <Icon name="chevRight" size={14} />
              </button>
            </>
          ) : step === 3 ? null : (
            <>
              <button onClick={handleCloseRequest} className="btn btn-ghost">
                Cancel
              </button>
              <div className="spacer" />
              {step > 1 && (
                <button onClick={() => setStep(s => Math.max(1, s - 1))} className="btn">
                  <Icon name="chevLeft" size={14} /> Back
                </button>
              )}
              {step === 2 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  className="btn btn-primary"
                >
                  Generate
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {confirmClose && (
        <ConfirmDialog
          title="Discard and close?"
          message="Your progress will be lost."
          confirmLabel="Discard"
          confirmDestructive
          onConfirm={() => { setConfirmClose(false); onClose(); }}
          onCancel={() => setConfirmClose(false)}
        />
      )}
    </div>
  );
}
