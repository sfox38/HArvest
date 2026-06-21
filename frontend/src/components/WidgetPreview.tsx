/**
 * WidgetPreview.tsx - Shared widget preview component.
 *
 * Renders a live preview of a widget card using harvest.min.js in preview mode.
 * Used by the Themes tab, Wizard Step 5, and TokenDetail ThemeEditor.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import type { ThemeDefinition, HAEntityDetail } from "../types";
import { api, getHaDarkMode } from "../api";
import { usePanelDark } from "../panelTheme";
import { Toggle } from "./Toggle";
import { EntityAutocomplete } from "./Shared";
import { Icon } from "./Icon";
import { iconSetAsset } from "./IconPicker";
import { MEDIA_PREVIEW_MOCK_ATTRS, mediaPreviewState, useMediaPreviewPoll } from "./mediaPreview";
import buildVersion from "../buildVersion.json";

// ---------------------------------------------------------------------------
// Domain feature definitions
// ---------------------------------------------------------------------------

interface FeatureOption {
  key: string;
  label: string;
  default: boolean;
}

export const DOMAIN_FEATURES: Record<string, FeatureOption[]> = {
  light: [
    { key: "brightness", label: "Brightness", default: true },
    { key: "color_temp", label: "Color temperature", default: false },
    { key: "rgb_color", label: "Color (RGB)", default: false },
  ],
  fan: [
    { key: "percentage", label: "Speed", default: true },
    { key: "oscillating", label: "Oscillating", default: false },
    { key: "direction", label: "Direction", default: false },
    { key: "preset_mode", label: "Preset modes", default: false },
    { key: "animate", label: "Animate icon", default: false },
  ],
  cover: [
    { key: "current_position", label: "Position slider", default: true },
    { key: "current_tilt_position", label: "Tilt slider", default: true },
    { key: "buttons", label: "Open / Stop / Close", default: true },
  ],
  climate: [
    { key: "temperature", label: "Target temperature", default: true },
    { key: "hvac_modes", label: "Mode selector", default: true },
  ],
  media_player: [
    { key: "transport", label: "Transport controls", default: true },
    { key: "volume", label: "Volume slider", default: true },
  ],
  input_number: [
    { key: "slider", label: "Value slider", default: true },
  ],
  weather: [
    { key: "forecast", label: "Forecast", default: true },
  ],
  number: [
    { key: "slider", label: "Value slider", default: true },
  ],
  automation: [
    { key: "toggle", label: "Enable/disable toggle", default: true },
  ],
};

type GraphType = "none" | "line" | "bar" | "step";

const GRAPH_DOMAINS: Record<string, GraphType[]> = {
  sensor:        ["none", "line", "bar"],
  input_number:  ["none", "line", "bar"],
  number:        ["none", "line", "bar"],
  binary_sensor: ["none", "step"],
};

const DEFAULT_GRAPH: Record<string, GraphType> = {
  sensor: "none",
  input_number: "none",
  number: "none",
  binary_sensor: "none",
};

export function defaultFeatures(domain: string): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const f of DOMAIN_FEATURES[domain] ?? []) out[f.key] = f.default;
  return out;
}

export function detectFeatures(domain: string, attrs: Record<string, unknown>): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const f of DOMAIN_FEATURES[domain] ?? []) out[f.key] = f.key in attrs;

  if (domain === "light") {
    const modes = new Set((attrs.supported_color_modes as string[]) ?? []);
    const dimmable = new Set(["brightness", "color_temp", "hs", "xy", "rgb", "rgbw", "rgbww", "white"]);
    if ([...modes].some(m => dimmable.has(m))) out.brightness = true;
    if (modes.has("color_temp")) out.color_temp = true;
    const colorCapable = new Set(["hs", "xy", "rgb", "rgbw", "rgbww"]);
    if ([...modes].some(m => colorCapable.has(m))) out.rgb_color = true;
  }

  if (domain === "climate" && Array.isArray(attrs.hvac_modes)) {
    out.hvac_modes = true;
  }
  if (domain === "climate" && ("temperature" in attrs || "target_temp_step" in attrs)) {
    out.temperature = true;
  }

  if (domain === "fan") {
    const fanBits = Number(attrs.supported_features ?? 0);
    if (fanBits & 1) out.percentage = true;
    if (fanBits & 2) out.oscillating = true;
    if (fanBits & 4) out.direction = true;
    if (fanBits & 8) out.preset_mode = true;
  }

  if (domain === "cover") {
    out.buttons = true;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Mock entity data for preview
// ---------------------------------------------------------------------------

export interface MockEntity {
  domain: string;
  label: string;
  friendly_name: string;
  state: string;
  unit?: string;
  attributes: Record<string, unknown>;
}

export const MOCK_ENTITIES: Record<string, MockEntity> = {
  light:          { domain: "light",          label: "Light",          friendly_name: "Bedroom Light",    state: "on",       attributes: { brightness: 180, color_temp: 350, min_mireds: 153, max_mireds: 500, rgb_color: [255, 180, 100] } },
  switch:         { domain: "switch",         label: "Switch",         friendly_name: "Pump Motor",       state: "on",       attributes: {} },
  sensor:         { domain: "sensor",         label: "Sensor",         friendly_name: "Temperature",      state: "22.4",     unit: "°C", attributes: { device_class: "temperature", state_class: "measurement" } },
  climate:        { domain: "climate",        label: "Climate",        friendly_name: "Living Room",      state: "heat",     attributes: { current_temperature: 21.5, temperature: 22, hvac_modes: ["off", "heat", "cool", "auto"] } },
  cover:          { domain: "cover",          label: "Cover",          friendly_name: "Blinds",           state: "open",     attributes: { current_position: 65, current_tilt_position: 35 } },
  fan:            { domain: "fan",            label: "Fan",            friendly_name: "Ceiling Fan",      state: "on",       attributes: { percentage: 65, oscillating: false, direction: "forward", preset_mode: "normal", preset_modes: ["normal", "nature", "sleep", "auto"] } },
  binary_sensor:  { domain: "binary_sensor",  label: "Binary Sensor",  friendly_name: "Motion Sensor",    state: "on",       attributes: { device_class: "motion" } },
  input_boolean:  { domain: "input_boolean",  label: "Input Boolean",  friendly_name: "Guest Mode",       state: "on",       attributes: {} },
  input_number:   { domain: "input_number",   label: "Input Number",   friendly_name: "Target Humidity",  state: "42",       unit: "%",  attributes: { min: 0, max: 100, step: 1 } },
  input_select:   { domain: "input_select",   label: "Input Select",   friendly_name: "Scene Mode",       state: "Option B", attributes: { options: ["Option A", "Option B", "Option C"] } },
  media_player:   { domain: "media_player",   label: "Media Player",   friendly_name: "Speaker",          state: "playing",  attributes: { ...MEDIA_PREVIEW_MOCK_ATTRS, media_position_updated_at: new Date().toISOString() } },
  number:         { domain: "number",         label: "Number",         friendly_name: "LED Brightness",   state: "75",       unit: "%",  attributes: { min: 0, max: 100, step: 1 } },
  lock:           { domain: "lock",           label: "Lock",           friendly_name: "Front Door",       state: "locked",   attributes: {} },
  person:         { domain: "person",         label: "Person",         friendly_name: "Alice",            state: "home",     attributes: {} },
  button:         { domain: "button",         label: "Button",         friendly_name: "Restart Server",   state: "unknown",  attributes: {} },
  script:         { domain: "script",         label: "Script",         friendly_name: "Goodnight",        state: "off",      attributes: {} },
  automation:     { domain: "automation",     label: "Automation",     friendly_name: "Motion Lights",    state: "on",       attributes: {} },
  remote:         { domain: "remote",         label: "Remote",         friendly_name: "TV Remote",        state: "on",       attributes: { supported_features: 4, current_activity: "Watch TV", activity_list: ["Watch TV", "Apple TV", "PlayStation 5", "Nintendo Switch", "Listen to Music"] } },
  timer:          { domain: "timer",          label: "Timer",          friendly_name: "Oven Timer",       state: "idle",     attributes: { duration: "0:25:00", remaining: "0:25:00" } },
  weather:        { domain: "weather",        label: "Weather",        friendly_name: "Weather",          state: "sunny",    attributes: { temperature: 24, temperature_unit: "°C", humidity: 45, wind_speed: 12, wind_speed_unit: "km/h", pressure: 1013, pressure_unit: "hPa", forecast_daily: [
    { datetime: "2026-05-02", condition: "partlycloudy", temperature: 22, templow: 14 },
    { datetime: "2026-05-03", condition: "rainy",        temperature: 18, templow: 12 },
    { datetime: "2026-05-04", condition: "cloudy",       temperature: 20, templow: 13 },
    { datetime: "2026-05-05", condition: "sunny",        temperature: 25, templow: 15 },
    { datetime: "2026-05-06", condition: "partlycloudy", temperature: 23, templow: 14 },
  ], forecast_hourly: [
    { datetime: "2026-05-02T08:00:00", condition: "sunny",        temperature: 18 },
    { datetime: "2026-05-02T09:00:00", condition: "sunny",        temperature: 19 },
    { datetime: "2026-05-02T10:00:00", condition: "partlycloudy", temperature: 21 },
    { datetime: "2026-05-02T11:00:00", condition: "partlycloudy", temperature: 22 },
    { datetime: "2026-05-02T12:00:00", condition: "cloudy",       temperature: 23 },
    { datetime: "2026-05-02T13:00:00", condition: "cloudy",       temperature: 24 },
    { datetime: "2026-05-02T14:00:00", condition: "partlycloudy", temperature: 24 },
    { datetime: "2026-05-02T15:00:00", condition: "sunny",        temperature: 23 },
  ] } },
};

const RENDERER_OPTIONS = [
  ...Object.entries(MOCK_ENTITIES)
    .map(([key, m]) => ({ value: key, label: m.label }))
    .sort((a, b) => a.label.localeCompare(b.label)),
  { value: "custom", label: "Custom Entity" },
];

// ---------------------------------------------------------------------------
// Widget script loader and preview helpers
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    HArvest?: {
      preview: (
        container: HTMLElement,
        entityDef: Record<string, unknown>,
        state: string,
        attributes: Record<string, unknown>,
        themeVars?: Record<string, string> | { variables: Record<string, string>; dark_variables?: Record<string, string> },
        options?: { graph?: string; hours?: number; historyData?: Array<{ t: string; s: string }>; rendererId?: string },
      ) => HTMLElement;
      buildEntityDef: (
        rawEntity: { domain: string; state: string; friendly_name: string; attributes: Record<string, unknown>; unit?: string },
        options?: { capabilities?: string; features?: Record<string, boolean>; iconOverride?: string; nameOverride?: string; colorScheme?: string; displayHints?: Record<string, unknown>; gestureConfig?: Record<string, unknown> },
      ) => Record<string, unknown>;
      filterAttributes: (attributes: Record<string, unknown>) => Record<string, unknown>;
      registerIconSet: (
        key: string,
        set: { icons: Record<string, { body: string; viewBox: string }>; aliases?: Record<string, string> },
      ) => void;
      getIconSet: (
        key: string,
      ) => { icons: Record<string, { body: string; viewBox: string }>; aliases: Record<string, string> } | undefined;
    };
  }
}

const _WIDGET_SRC = `/harvest_assets/harvest.min.js?v=${buildVersion.build}`;
let _widgetScriptLoaded = false;
let _widgetScriptLoading: Promise<void> | null = null;

export function loadWidgetScript(): Promise<void> {
  if (_widgetScriptLoaded) return Promise.resolve();
  if (_widgetScriptLoading) return _widgetScriptLoading;
  _widgetScriptLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = _WIDGET_SRC;
    script.onload = () => { _widgetScriptLoaded = true; resolve(); };
    script.onerror = () => { _widgetScriptLoading = null; reject(new Error("Failed to load harvest.min.js")); };
    document.head.appendChild(script);
  });
  return _widgetScriptLoading;
}

const _loadedRenderers = new Set<string>();
const _loadingRenderers = new Map<string, Promise<void>>();
const _rendererCacheBust = new Map<string, string>();

export function isRendererLoaded(rendererId: string): boolean {
  return _loadedRenderers.has(rendererId);
}

export async function loadRendererScript(rendererId: string): Promise<void> {
  if (_loadedRenderers.has(rendererId)) return Promise.resolve();
  const existing = _loadingRenderers.get(rendererId);
  if (existing) return existing;
  const bust = _rendererCacheBust.get(rendererId) || String(buildVersion.build);
  const p = (async () => {
    const renderers = await api.renderers.list();
    if (!renderers.agreed) {
      throw new Error("Renderer consent is required before loading custom renderer JavaScript.");
    }
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/api/harvest/renderers/${encodeURIComponent(rendererId)}.js?v=${bust}`;
      script.dataset.rendererId = rendererId;
      script.onload = () => {
        _loadedRenderers.add(rendererId);
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Failed to load renderer ${rendererId}`));
      };
      document.head.appendChild(script);
    });
  })().finally(() => {
    _loadingRenderers.delete(rendererId);
  });
  _loadingRenderers.set(rendererId, p);
  return p;
}

export function clearRendererCache(rendererId: string): void {
  _loadedRenderers.delete(rendererId);
  _loadingRenderers.delete(rendererId);
  _rendererCacheBust.set(rendererId, String(Date.now()));
}

const _loadingIconSets = new Map<string, Promise<void>>();

/**
 * Load an icon-set asset (icon-sets/<setId>.js) once. Awaits the widget
 * bundle first so window.HArvest.registerIconSet exists when the asset's
 * IIFE runs. Release-busted (?v=) like the widget bundle itself: these are
 * build-generated assets, not admin-edited packs.
 */
export function loadIconSetScript(setId: string): Promise<void> {
  if (window.HArvest?.getIconSet?.(setId)) return Promise.resolve();
  const existing = _loadingIconSets.get(setId);
  if (existing) return existing;
  const p = loadWidgetScript().then(
    () =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `/harvest_assets/icon-sets/${encodeURIComponent(setId)}.js?v=${buildVersion.build}`;
        script.onload = () => resolve();
        script.onerror = () => {
          _loadingIconSets.delete(setId);
          reject(new Error(`Failed to load icon set ${setId}`));
        };
        document.head.appendChild(script);
      }),
  );
  _loadingIconSets.set(setId, p);
  return p;
}

export function resolveVars(
  theme: ThemeDefinition | null,
  editedVars: Record<string, string> | null,
  editedDarkVars: Record<string, string> | null,
  _colorMode: "light" | "dark" | "auto",
): Record<string, string> {
  if (!theme && !editedVars) return {};
  const base = editedVars ?? theme?.variables ?? {};
  const dark = editedDarkVars ?? theme?.dark_variables ?? {};
  const usesDark = _colorMode === "dark" || (_colorMode === "auto" && getHaDarkMode());
  return usesDark ? { ...base, ...dark } : { ...base };
}

export function resolveThemeObj(
  theme: ThemeDefinition | null,
  editedVars: Record<string, string> | null,
  editedDarkVars: Record<string, string> | null,
): { variables: Record<string, string>; dark_variables: Record<string, string> } {
  return {
    variables: editedVars ?? theme?.variables ?? {},
    dark_variables: editedDarkVars ?? theme?.dark_variables ?? {},
  };
}


export function generateMockHistory(domain: string, graphType: GraphType, state: string): Array<{ t: string; s: string }> {
  const now = Date.now();
  const hours = 24;
  const points: Array<{ t: string; s: string }> = [];

  if (graphType === "step" || domain === "binary_sensor") {
    const segments = 8;
    let val = 1;
    for (let i = 0; i < segments; i++) {
      const t = now - hours * 3600_000 + (i / segments) * hours * 3600_000;
      points.push({ t: new Date(t).toISOString(), s: val ? "on" : "off" });
      val = val ? 0 : 1;
    }
    points.push({ t: new Date(now).toISOString(), s: state === "on" ? "on" : "off" });
    return points;
  }

  const numericState = parseFloat(state) || 22;
  const amplitude = numericState * 0.2;
  const count = 24;
  for (let i = 0; i <= count; i++) {
    const t = now - hours * 3600_000 + (i / count) * hours * 3600_000;
    const wave = Math.sin((i / count) * Math.PI * 3) * amplitude;
    const noise = (Math.random() - 0.5) * amplitude * 0.3;
    const val = numericState + wave + noise;
    points.push({ t: new Date(t).toISOString(), s: val.toFixed(1) });
  }
  return points;
}

// ---------------------------------------------------------------------------
// RealWidget - renders a single hrv-card preview
// ---------------------------------------------------------------------------

function RealWidget({ mock, themeObj, capability, features, graphType, rendererId, colorScheme }: {
  mock: MockEntity;
  themeObj: { variables: Record<string, string>; dark_variables: Record<string, string>; icon_set?: string | null };
  capability: "read" | "read-write" | "badge";
  features: Record<string, boolean>;
  graphType: GraphType;
  rendererId?: string;
  colorScheme?: "light" | "dark" | "auto";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const iconSetPrefix = iconSetAsset(themeObj.icon_set);
  useEffect(() => {
    const load = async () => {
      // Gate readiness on the icon-set asset too, or the preview would be
      // created before the set registers and keep showing mdi glyphs.
      if ((rendererId && !_loadedRenderers.has(rendererId))
          || (iconSetPrefix && !window.HArvest?.getIconSet?.(iconSetPrefix))) {
        setReady(false);
      }
      await loadWidgetScript();
      if (rendererId) await loadRendererScript(rendererId).catch(() => {});
      if (iconSetPrefix) await loadIconSetScript(iconSetPrefix).catch(() => {});
      setReady(true);
    };
    load().catch(() => setLoadError(true));
  }, [rendererId, iconSetPrefix]);

  // When a real custom entity is chosen, build the definition server-side
  // (api.entities.getDefinition) exactly like the Wizard and TokenDetail
  // previews, so its controls, tiers, and layout match. Pure mock previews
  // (theme design with no custom entity) keep using the client buildEntityDef.
  const realEntityId = (mock.attributes._entity_id as string | undefined) ?? null;
  const [serverDef, setServerDef] = useState<{ definition: Record<string, unknown>; state: string; attributes: Record<string, unknown> } | null>(null);
  useEffect(() => {
    if (!realEntityId) { setServerDef(null); return; }
    let cancelled = false;
    api.entities.getDefinition(realEntityId, { capabilities: capability })
      .then(r => { if (!cancelled) setServerDef(r); })
      .catch(() => { if (!cancelled) setServerDef(null); });
    return () => { cancelled = true; };
  }, [realEntityId, capability]);
  const usingServer = !!realEntityId && !!serverDef && serverDef.definition?.entity_id === realEntityId;

  const featKey = Object.entries(features).filter(([, v]) => v).map(([k]) => k).sort().join(",");
  const cardKey = `${mock.domain}:${mock.friendly_name}:${capability}:${featKey}:${graphType}:${rendererId ?? ""}:${colorScheme ?? "auto"}:${themeObj.icon_set ?? ""}:${usingServer ? "srv" : "mock"}`;

  useEffect(() => {
    if (!ready || !containerRef.current || !window.HArvest) return;
    // For a real entity, wait for its server definition before rendering.
    if (realEntityId && !usingServer) return;

    const container = containerRef.current;
    container.innerHTML = "";
    cardRef.current = null;

    let entityDef: Record<string, unknown>;
    let previewState = mock.state;
    let attrs: Record<string, unknown>;
    if (usingServer && serverDef) {
      entityDef = { ...serverDef.definition, capabilities: capability, color_scheme: colorScheme ?? "auto" };
      previewState = serverDef.state;
      attrs = serverDef.attributes;
      if (mock.domain === "media_player") {
        const mp = mediaPreviewState(serverDef.state, serverDef.attributes);
        previewState = mp.state;
        attrs = mp.attributes;
      }
    } else {
      entityDef = window.HArvest.buildEntityDef(
        { domain: mock.domain, state: mock.state, friendly_name: mock.friendly_name,
          attributes: mock.attributes, unit: mock.unit },
        { capabilities: capability, features, colorScheme: colorScheme ?? "auto",
          ...(mock.domain === "weather" && features.forecast ? { displayHints: { show_forecast: true } } : {}) },
      );
      attrs = window.HArvest.filterAttributes(mock.attributes);
      // Refresh the demo track position so the seek bar starts mid-track and
      // advances, rather than sitting at a stale module-load timestamp.
      if (mock.domain === "media_player") {
        attrs = { ...attrs, media_position_updated_at: new Date().toISOString() };
      }
    }

    const graphOpts: Record<string, unknown> = {};
    if (graphType !== "none") {
      graphOpts.graph = graphType;
      graphOpts.hours = 24;
      graphOpts.historyData = generateMockHistory(mock.domain, graphType, mock.state);
    }
    if (rendererId) graphOpts.rendererId = rendererId;
    if (features.animate) graphOpts.animate = true;
    const opts = Object.keys(graphOpts).length > 0 ? graphOpts : undefined;

    const card = window.HArvest.preview(container, entityDef, previewState, attrs, themeObj as any, opts as any);
    cardRef.current = card;

    return () => {
      container.innerHTML = "";
      cardRef.current = null;
    };
  }, [ready, cardKey]);

  const themeJson = useMemo(() => JSON.stringify(themeObj), [themeObj]);
  useEffect(() => {
    const card = cardRef.current as (HTMLElement & { applyPreviewTheme?: (v: Record<string, unknown>) => void }) | null;
    if (!card?.applyPreviewTheme) return;
    card.applyPreviewTheme(themeObj);
  }, [themeJson]);

  const stateKey = useMemo(() => `${mock.state}:${JSON.stringify(mock.attributes)}`, [mock.state, mock.attributes]);
  useEffect(() => {
    if (!window.HArvest) return;
    // media_player previews are driven by the initial render + live poll
    // (useMediaPreviewPoll); skip here so a stale fetched-once frame does not
    // overwrite the mock fallback.
    if (mock.domain === "media_player") return;
    const card = cardRef.current as (HTMLElement & { updatePreviewState?: (s: string, a: Record<string, unknown>) => void }) | null;
    if (!card?.updatePreviewState) return;
    const attrs = window.HArvest.filterAttributes(mock.attributes);
    card.updatePreviewState(mock.state, attrs);
  }, [stateKey]);

  // Track a live custom media_player (with mock fallback when nothing plays).
  useMediaPreviewPoll(realEntityId, mock.domain, ready && (!realEntityId || usingServer), cardRef);

  if (loadError) {
    return <div className="muted" style={{ padding: 16, textAlign: "center" }}>Failed to load widget preview.</div>;
  }

  return (
    <div
      ref={containerRef}
      className="theme-preview-widget"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}
    />
  );
}

// ---------------------------------------------------------------------------
// WidgetPreview - full preview with controls
// ---------------------------------------------------------------------------

interface WidgetPreviewProps {
  variables: Record<string, string>;
  darkVariables?: Record<string, string>;
  rendererId?: string;
  /** Theme-level icon set; previews render mdi icons through it like the live card. */
  iconSet?: string | null;
}

const _ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* */ } },
};

export function WidgetPreview({ variables, darkVariables, rendererId, iconSet }: WidgetPreviewProps) {
  const _initRenderer = _ls.get("hrv_preview_renderer") ?? "light";
  const _initEntity   = _ls.get("hrv_preview_entity") ?? "";

  const [renderer, setRenderer] = useState(_initRenderer);
  const [capability, setCapability] = useState<"read" | "read-write" | "badge">(() => {
    const stored = _ls.get("hrv_preview_capability");
    return stored === "read" || stored === "badge" ? stored : "read-write";
  });
  const [colorMode, setColorMode] = useState<"light" | "dark" | "auto">(() => {
    const stored = _ls.get("hrv_preview_color_mode");
    return (stored === "light" || stored === "dark" || stored === "auto") ? stored : "auto";
  });
  const haDark = usePanelDark();
  // "Auto" follows the panel's effective theme (HArvest Theme setting,
  // "auto" following HA), not the OS. Resolve before handing the scheme to
  // the widget, which would otherwise fall back to prefers-color-scheme.
  const effectiveColorMode: "light" | "dark" = colorMode === "auto" ? (haDark ? "dark" : "light") : colorMode;
  const [bgGray, setBgGray] = useState<number | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>(defaultFeatures(_initRenderer));
  const [graphType, setGraphType] = useState<GraphType>(() => {
    const stored = _ls.get("hrv_preview_graph_type") as GraphType | null;
    return stored ?? DEFAULT_GRAPH[_initRenderer] ?? "none";
  });

  const [previewEntity, setPreviewEntity] = useState(_initEntity);
  const [realEntity, setRealEntity] = useState<HAEntityDetail | null>(null);
  const selectingRef = useRef(false);

  // On mount, re-fetch stored custom entity details
  useEffect(() => {
    if (!_initEntity) return;
    api.entities.get(_initEntity).then(detail => {
      setRealEntity(detail);
      const domain = detail.entity_id.split(".")[0];
      setRenderer("custom");
      setFeatures(detectFeatures(domain, detail.attributes));
    }).catch(() => {
      _ls.del("hrv_preview_entity");
      setPreviewEntity("");
      setRenderer(_ls.get("hrv_preview_renderer") ?? "light");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRendererChange = (value: string) => {
    setRenderer(value);
    setPreviewEntity("");
    setRealEntity(null);
    setFeatures(defaultFeatures(value));
    setGraphType(DEFAULT_GRAPH[value] ?? "none");
    _ls.set("hrv_preview_renderer", value);
    _ls.del("hrv_preview_entity");
    _ls.set("hrv_preview_graph_type", DEFAULT_GRAPH[value] ?? "none");
  };

  const handleEntitySelect = async (entityId: string) => {
    selectingRef.current = true;
    setPreviewEntity(entityId);
    _ls.set("hrv_preview_entity", entityId);
    try {
      const detail = await api.entities.get(entityId);
      setRealEntity(detail);
      const domain = detail.entity_id.split(".")[0];
      setRenderer("custom");
      setFeatures(detectFeatures(domain, detail.attributes));
      setGraphType(DEFAULT_GRAPH[domain] ?? "none");
      _ls.set("hrv_preview_renderer", "custom");
      _ls.set("hrv_preview_graph_type", DEFAULT_GRAPH[domain] ?? "none");
    } catch {
      setRenderer("custom");
      _ls.set("hrv_preview_renderer", "custom");
    }
  };

  const handleEntityChange = (v: string) => {
    if (selectingRef.current && v === "") {
      selectingRef.current = false;
      return;
    }
    setPreviewEntity(v);
    setRealEntity(null);
  };

  const handleEntityClear = () => {
    setPreviewEntity("");
    setRealEntity(null);
    setFeatures(defaultFeatures(renderer));
    _ls.del("hrv_preview_entity");
  };

  const realDomain = realEntity ? realEntity.entity_id.split(".")[0] : null;
  const baseMock = MOCK_ENTITIES[renderer] ?? (realDomain ? MOCK_ENTITIES[realDomain] : null) ?? MOCK_ENTITIES.light;
  const previewMock: MockEntity = realEntity ? {
    domain: realDomain!,
    label: baseMock.label,
    friendly_name: (realEntity.attributes.friendly_name as string) ?? realEntity.entity_id,
    state: realEntity.state,
    unit: (realEntity.attributes.unit_of_measurement as string) ?? baseMock.unit,
    attributes: { ...realEntity.attributes, _entity_id: realEntity.entity_id },
  } : baseMock;

  const effectiveDomain = renderer === "custom" ? (realDomain ?? "light") : renderer;
  const domainFeatures = DOMAIN_FEATURES[effectiveDomain] ?? [];
  const graphOptions = GRAPH_DOMAINS[effectiveDomain];

  const themeObj = { variables, dark_variables: darkVariables ?? {}, icon_set: iconSet ?? null };

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
        <select
          className="input"
          value={renderer}
          onChange={e => handleRendererChange(e.target.value)}
          style={{ flex: 1, minWidth: 140 }}
        >
          {RENDERER_OPTIONS.filter(o => o.value !== "custom" || realEntity).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="segmented" role="group" aria-label="Capability">
          <button aria-pressed={capability === "badge"} onClick={() => { setCapability("badge"); _ls.set("hrv_preview_capability", "badge"); }}>Badge</button>
          <button aria-pressed={capability === "read"} onClick={() => { setCapability("read"); _ls.set("hrv_preview_capability", "read"); }}>Read</button>
          <button aria-pressed={capability === "read-write"} onClick={() => { setCapability("read-write"); _ls.set("hrv_preview_capability", "read-write"); }}>Control</button>
        </div>
        <div className="segmented" role="group" aria-label="Color mode">
          <button aria-pressed={colorMode === "auto"} onClick={() => { setColorMode("auto"); _ls.set("hrv_preview_color_mode", "auto"); }}>Auto</button>
          <button aria-pressed={colorMode === "light"} onClick={() => { setColorMode("light"); _ls.set("hrv_preview_color_mode", "light"); }}>Light</button>
          <button aria-pressed={colorMode === "dark"} onClick={() => { setColorMode("dark"); _ls.set("hrv_preview_color_mode", "dark"); }}>Dark</button>
        </div>
      </div>

      {(domainFeatures.length > 0 || graphOptions) && (
        <div className="row" style={{ gap: 12, flexWrap: "wrap", fontSize: 12 }}>
          {domainFeatures.map(f => (
            <div key={f.key} className="row" style={{ gap: 8, alignItems: "center" }}>
              <Toggle
                checked={features[f.key] ?? f.default}
                onChange={v => setFeatures(prev => ({ ...prev, [f.key]: v }))}
              />
              <span>{f.label}</span>
            </div>
          ))}
          {graphOptions && (
            <label className="row" style={{ gap: 4, alignItems: "center" }}>
              Graph:
              <select
                className="input"
                value={graphType}
                onChange={e => { setGraphType(e.target.value as GraphType); _ls.set("hrv_preview_graph_type", e.target.value); }}
                style={{ fontSize: 12, padding: "2px 4px" }}
              >
                {graphOptions.map(g => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      <div style={{ position: "relative" }}>
        <EntityAutocomplete
          value={previewEntity}
          onChange={handleEntityChange}
          onSelect={handleEntitySelect}
          placeholder="Try with your own entity (optional)"
        />
        {previewEntity && (
          <button
            className="entity-clear-btn"
            onClick={handleEntityClear}
            aria-label="Clear entity"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        <div
          className="theme-preview-stage"
          style={{
            flex: 1,
            background: bgGray == null ? undefined : `rgb(${Math.round(bgGray * 2.55)},${Math.round(bgGray * 2.55)},${Math.round(bgGray * 2.55)})`,
          }}
        >
          <RealWidget mock={previewMock} themeObj={themeObj} capability={capability} features={features} graphType={graphType} rendererId={rendererId} colorScheme={effectiveColorMode} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 12 }}>
          <input
            type="range"
            min={0}
            max={100}
            value={bgGray ?? 50}
            onChange={ev => setBgGray(Number(ev.target.value))}
            {...{ orient: "vertical" } as React.InputHTMLAttributes<HTMLInputElement>}
            aria-label="Preview background tone"
            title="Adjust preview background tone"
            className="preview-bg-slider"
          />
        </div>
      </div>
    </div>
  );
}
