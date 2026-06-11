/**
 * EntitiesEditor.tsx - Token detail "Entities" tab.
 *
 * The largest single editor in the panel. Manages the entity list,
 * companions, theme selection, per-entity display hints, exclude_attributes,
 * gesture config, badge mode, and live preview.
 *
 * patchEntities() wraps tokens.update({entities}) with serialize-and-coalesce
 * so two rapid edits don't fire two PATCHes whose full-array payloads each
 * snapshot stale state.
 */

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import type { Token, ThemeDefinition, ThemeCapabilities, HAEntityDetail, ServiceFieldSchema } from "../types";
import { api } from "../api";
import { usePanelDark } from "../panelTheme";
import { ConfirmDialog, Card, Spinner, EntityAutocomplete, ActionPicker, ServiceDataFields, ThemeStrip, themeIdToUrl, themeUrlToId } from "./Shared";
import { Icon, WidgetIcon } from "./Icon";
import { Toggle } from "./Toggle";
import { doCopy, groupEntities } from "./CodeSection";
import { EntityPreview } from "./EntityPreview";
import { loadWidgetScript, loadRendererScript, isRendererLoaded } from "./WidgetPreview";
import { loadEntityCache, getEntityCache, useEntityCache } from "../entityCache";
import { WIDGET_ICONS, WIDGET_ICON_NAMES, resolveEntityIcon } from "../widgetIcons";
import { READ_ONLY_DOMAINS } from "../lovelaceParser";

const PERIOD_OPTIONS = [
  { value: 1440, label: "1 day" },
  { value: 60,   label: "1 hour" },
  { value: 30,   label: "30 minutes" },
  { value: 10,   label: "10 minutes" },
  { value: 5,    label: "5 minutes" },
  { value: 1,    label: "1 minute" },
];

interface EntitiesEditorProps {
  token: Token;
  readonly: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token) => void;
  setError: (e: string) => void;
  setSavedMsg?: (msg: string) => void;
}

const COMPANION_ALLOWED_DOMAINS = new Set([
  "light", "switch", "binary_sensor", "input_boolean", "cover", "remote", "fan", "sensor", "lock",
  "button", "input_button", "number", "input_number", "person", "timer", "weather",
]);
const COMPANION_INTERACTIVE_DOMAINS = new Set([
  "light", "switch", "input_boolean", "fan", "lock", "button", "input_button",
]);
const ENTITIES_BLOCK_DOMAINS = new Set(["light", "switch", "fan", "input_boolean", "binary_sensor", "lock", "cover", "sensor"]);
const HISTORY_DOMAINS = new Set(["sensor", "input_number", "number", "binary_sensor"]);
const NUMERIC_STATE_DOMAINS = new Set(["sensor", "input_number", "counter", "number"]);
const HOURS_OPTIONS = [1, 6, 12, 24, 48, 72, 168];

const ATTR_HINT_MAP: Record<string, Record<string, string>> = {
  light: { show_brightness: "brightness", show_color_temp: "color_temp", show_rgb: "rgb_color" },
  fan: { show_oscillate: "oscillating", show_direction: "direction", show_presets: "preset_mode" },
  climate: { show_hvac_modes: "hvac_modes", show_presets: "preset_modes", show_fan_mode: "fan_modes", show_swing_mode: "swing_modes" },
  cover: { show_position: "current_position", show_tilt: "current_tilt_position" },
  media_player: { show_volume: "volume_level", show_source: "source_list" },
};

function reverseAttrMap(domain: string): Record<string, string> {
  const map = ATTR_HINT_MAP[domain];
  if (!map) return {};
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
}

function hasFeature(cap: ThemeCapabilities | null, domain: string, feature: string): boolean {
  if (!cap) return true;
  const dc = (cap as Record<string, { features?: string[]; display_modes?: string[] }>)[domain];
  if (!dc) return true;
  const list = dc.features ?? dc.display_modes;
  if (!list) return true;
  return list.includes(feature);
}

function ScriptVarsEditor({ entityId, serviceData, onChange, disabled }: {
  entityId: string;
  serviceData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  disabled?: boolean;
}) {
  const [fields, setFields] = useState<Record<string, ServiceFieldSchema> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.entities.getScriptFields(entityId)
      .then(r => { setFields(r.fields); })
      .catch(() => setError("Could not load script variables."))
      .finally(() => setLoading(false));
  }, [entityId]);

  if (loading) return <div className="muted fs-11" style={{ padding: "4px 0" }}><Spinner size={12} /> Loading script variables...</div>;
  if (error) return <div className="muted fs-11" style={{ color: "var(--warning)" }}>{error}</div>;
  if (!fields || Object.keys(fields).length === 0) return null;

  return (
    <ServiceDataFields
      domain="script"
      service={entityId.split(".", 2)[1]}
      data={serviceData}
      onChange={onChange}
      disabled={disabled}
      preloadedFields={fields}
    />
  );
}

function BlockPreviewWidget({ entities, theme, blockLabel, blockIcon, blockShowLabel, blockHighlightRows, blockShowIcons, blockWidgetBorder, colorScheme, perEntityColor }: {
  entities: Token["entities"];
  theme: ThemeDefinition | null;
  blockLabel: string | null;
  blockIcon: string | null;
  blockShowLabel: boolean;
  blockHighlightRows: boolean;
  blockShowIcons: boolean;
  blockWidgetBorder: string | null;
  colorScheme: "auto" | "light" | "dark";
  perEntityColor?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [defs, setDefs] = useState<Record<string, { definition: Record<string, unknown>; state: string; attributes: Record<string, unknown>; _key?: string }>>({});
  const primaries = entities.filter(e => !e.companion_of);
  const haDark = usePanelDark();
  // Pin "auto" to the panel's effective theme (HArvest Theme setting,
  // "auto" following HA) so the preview matches the panel instead of the
  // OS prefers-color-scheme. Explicit light/dark wins.
  const resolveCs = (cs: string | null | undefined): "light" | "dark" =>
    cs === "light" || cs === "dark" ? cs : (haDark ? "dark" : "light");

  const packId = theme?.has_renderer ? theme.theme_id : null;
  useEffect(() => {
    if (packId && !isRendererLoaded(packId)) setReady(false);
    loadWidgetScript()
      .then(() => packId ? loadRendererScript(packId) : Promise.resolve())
      .then(() => setReady(true))
      .catch(() => setLoadError(true));
  }, [packId]);

  const defDepKey = primaries.map(e => {
    const cs = perEntityColor ? e.color_scheme : colorScheme;
    return `${e.entity_id}:${e.capabilities}:${e.name_override}:${e.icon_override}:${cs}`;
  }).join(",");
  useEffect(() => {
    for (const e of primaries) {
      const cs = perEntityColor ? e.color_scheme : colorScheme;
      const cacheKey = `${e.capabilities}:${cs}`;
      const cached = defs[e.entity_id];
      if (cached && cached._key === cacheKey) continue;
      api.entities.getDefinition(e.entity_id, {
        capabilities: e.capabilities,
        name_override: e.name_override ?? undefined,
        icon_override: e.icon_override ?? undefined,
        color_scheme: cs,
      }).then(result => {
        setDefs(prev => ({ ...prev, [e.entity_id]: { ...result, _key: cacheKey } }));
      }).catch(() => {});
    }
  }, [defDepKey]);

  const themeObj = useMemo(() => {
    if (!theme) return { variables: {}, dark_variables: {} };
    return { variables: theme.variables ?? {}, dark_variables: theme.dark_variables ?? {} };
  }, [theme?.theme_id]);

  const cardKey = primaries.map(e => {
    const cs = perEntityColor ? e.color_scheme : colorScheme;
    return `${e.entity_id}:${e.capabilities}:${cs}:${defs[e.entity_id]?.state ?? ""}:${defs[e.entity_id]?._key ?? ""}`;
  }).join("|")
    + `:${theme?.theme_id ?? ""}:${blockLabel}:${blockShowLabel}:${blockHighlightRows}:${blockShowIcons}:${blockIcon}:${blockWidgetBorder}:${colorScheme}:${perEntityColor}:${haDark ? "dark" : "light"}`;

  useLayoutEffect(() => {
    if (!ready || !defsReady || !containerRef.current || !window.HArvest) return;
    const container = containerRef.current;

    // Remove old block only immediately before building a new one so the
    // container never has a gap (which would cause the panel to scroll up).
    if (blockRef.current && blockRef.current.parentNode === container) {
      container.removeChild(blockRef.current);
    }
    blockRef.current = null;
    cardRefs.current = [];

    const block = document.createElement("hrv-entities-block") as HTMLElement & {
      applyPreviewTheme?: (v: Record<string, unknown>) => void;
      setHeader?: (label: string | null, iconSvg: string | null, show: boolean) => void;
    };
    block.style.cssText = "width:100%;max-width:360px";

    // Append block to DOM first so connectedCallback fires and shadow DOM is ready
    container.appendChild(block);
    blockRef.current = block;

    // Set header (icon + label)
    const iconPath = blockIcon && WIDGET_ICONS[blockIcon]
      ? `<svg viewBox="0 0 24 24" width="16" height="16"><path d="${WIDGET_ICONS[blockIcon]}" fill="currentColor"/></svg>`
      : null;
    block.setHeader?.(blockLabel, iconPath, blockShowLabel);

    if (blockHighlightRows) {
      block.setAttribute("data-highlight-rows", "");
    } else {
      block.removeAttribute("data-highlight-rows");
    }

    block.setAttribute("data-border", blockWidgetBorder ?? "outer");

    block.setAttribute("data-color-scheme", resolveCs(colorScheme));

    for (const e of primaries) {
      const def = defs[e.entity_id];
      if (!def) continue;
      const opts: Record<string, unknown> = {};
      if (packId) opts.rendererId = packId;
      const cardCs = resolveCs(perEntityColor ? e.color_scheme : colorScheme);
      const card = window.HArvest!.preview(
        block, { ...def.definition, color_scheme: cardCs }, def.state, def.attributes, themeObj as never, opts,
      );
      if (!blockShowIcons) {
        card.style.setProperty("--hrv-icon-display", "none");
      }
      card.setAttribute("data-color-scheme", cardCs);
      cardRefs.current.push(card);
    }

    block.applyPreviewTheme?.(themeObj);
    // No cleanup return here - the old block is only removed when a new one
    // is about to replace it (above). This prevents the preview from going
    // blank between renders and causing the panel to scroll to top.
  }, [ready, cardKey]);

  // Unmount-only cleanup.
  useLayoutEffect(() => {
    return () => {
      const container = containerRef.current;
      if (blockRef.current && container && blockRef.current.parentNode === container) {
        container.removeChild(blockRef.current);
      }
      blockRef.current = null;
      cardRefs.current = [];
    };
  }, []);

  const themeJson = useMemo(() => JSON.stringify(themeObj), [themeObj]);
  useLayoutEffect(() => {
    const block = blockRef.current as (HTMLElement & { applyPreviewTheme?: (v: Record<string, unknown>) => void }) | null;
    if (block?.applyPreviewTheme) block.applyPreviewTheme(themeObj);
    for (const card of cardRefs.current) {
      const c = card as HTMLElement & { applyPreviewTheme?: (v: Record<string, unknown>) => void };
      if (c.applyPreviewTheme) c.applyPreviewTheme(themeObj);
    }
  }, [themeJson]);

  if (loadError) return <div className="muted" style={{ fontSize: 12, padding: "8px 0" }}>Preview unavailable.</div>;
  const defsReady = primaries.every(e => {
    const cached = defs[e.entity_id];
    const cs = perEntityColor ? e.color_scheme : colorScheme;
    return cached && cached._key === `${e.capabilities}:${cs}`;
  });
  // Always render the container so the DOM ref is live and height is stable.
  // Only show a spinner on the very first load (no block element yet).
  const showSpinner = !ready || (!defsReady && !blockRef.current);
  return (
    <div ref={containerRef} className="theme-preview-widget" role="region" aria-label="Entities block preview"
      style={{ display: "flex", justifyContent: "center", padding: "12px 0", minHeight: 80 }}>
      {showSpinner && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}><Spinner size={20} /></div>}
    </div>
  );
}

export function EntitiesEditor({ token, readonly, saving, setSaving, setToken, setError, setSavedMsg, bare }: EntitiesEditorProps & { bare?: boolean }) {
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [blockExpanded, setBlockExpanded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState("");
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [renderersAgreed, setRenderersAgreed] = useState<boolean | null>(null);
  const [showAgree, setShowAgree] = useState(false);
  const [agreeText, setAgreeText] = useState("");
  const [pendingThemeId, setPendingThemeId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [blockLabelInput, setBlockLabelInput] = useState<string>(token.block_label ?? "Entities");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconFilter, setIconFilter] = useState("");
  const [previewBgGray, setPreviewBgGray] = useState<number | null>(null);
  const [entitySnippetAlias, setEntitySnippetAlias] = useState(false);
  const [showCompanions, setShowCompanions] = useState(false);
  const [attrCache, setAttrCache] = useState<Record<string, string[]>>({});
  const [attrLoading, setAttrLoading] = useState<Set<string>>(new Set());
  const [entityDetail, setEntityDetail] = useState<Record<string, HAEntityDetail>>({});
  const configPanelRef = useRef<HTMLDivElement>(null);

  const agreeDialogRef = useRef<HTMLDivElement>(null);
  const previousDialogFocus = useRef<HTMLElement | null>(null);
  const [localEntities, setLocalEntities] = useState<Token["entities"] | null>(null);
  // Serialize patchEntities so two rapid edits do not produce two concurrent
  // PATCH requests with conflicting full-array payloads. inflightRef gates
  // the in-flight request; pendingRef coalesces subsequent edits to "latest
  // write wins" before the in-flight one returns. See patchEntities below.
  const patchInflightRef = useRef(false);
  const patchPendingRef  = useRef<Token["entities"] | null>(null);
  const [companionInputs, setCompanionInputs] = useState<Record<string, string>>({});
  const entityCacheList = useEntityCache();

  useEffect(() => { if (entityCacheList.length === 0) loadEntityCache(); }, []);
  useEffect(() => { api.themes.list().then(setThemes).catch(() => {}); }, []);
  useEffect(() => { api.renderers.list().then(d => setRenderersAgreed(d.agreed)).catch(() => {}); }, []);
  const [blockedDomains, setBlockedDomains] = useState<Set<string>>(new Set());
  useEffect(() => {
    api.config.get().then(c => {
      const sd = c.sensitive_domains ?? {};
      setBlockedDomains(new Set(Object.keys(sd).filter(k => !sd[k])));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedEntityId && !attrCache[selectedEntityId]) {
      setAttrLoading(prev => new Set(prev).add(selectedEntityId));
      api.ha.entityAttributes(selectedEntityId)
        .then(keys => setAttrCache(prev => ({ ...prev, [selectedEntityId]: keys })))
        .catch(() => {})
        .finally(() => setAttrLoading(prev => {
          const next = new Set(prev);
          next.delete(selectedEntityId);
          return next;
        }));
    }
  }, [selectedEntityId]);

  useEffect(() => {
    if (!selectedEntityId) return;
    api.entities.get(selectedEntityId)
      .then(detail => setEntityDetail(prev => ({ ...prev, [selectedEntityId]: detail })))
      .catch(() => {});
  }, [selectedEntityId]);

  const canEdit = !readonly;
  const entities = localEntities ?? token.entities;
  const existingIds = entities.map(e => e.entity_id);
  const grouped = groupEntities(entities);
  const currentThemeId = themeUrlToId(token.theme_url ?? "");
  const selectedTheme = themes.find(t => t.theme_id === currentThemeId) ?? null;
  const rendererCap = selectedTheme?.capabilities ?? null;
  const rendererSettings = selectedTheme?.renderer_settings ?? [];

  const selectedEntity = selectedEntityId
    ? entities.find(e => e.entity_id === selectedEntityId && !e.companion_of) ?? null
    : null;
  const selectedDomain = selectedEntity ? selectedEntity.entity_id.split(".")[0] : null;
  const selectedGroup = selectedEntity
    ? grouped.find(g => g.primary.entity_id === selectedEntityId) ?? null
    : null;

  const filteredThemes = themeFilter
    ? themes.filter(t => {
        const q = themeFilter.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.theme_id.toLowerCase().includes(q);
      })
    : themes;

  useEffect(() => {
    const haEntity = getEntityCache().find(e => e.entity_id === selectedEntity?.entity_id);
    setNameInput(selectedEntity?.name_override ?? haEntity?.friendly_name ?? "");
    const hasCompanions = selectedEntityId
      ? entities.some(e => e.companion_of === selectedEntityId)
      : false;
    setShowCompanions(hasCompanions);
    setIconPickerOpen(false);
    setIconFilter("");
    if (selectedEntityId === "__block__") {
      setBlockLabelInput(token.block_label ?? "Entities");
    }
  }, [selectedEntityId]);

  useEffect(() => {
    if (selectedEntityId && selectedEntityId !== "__block__" && !entities.some(e => e.entity_id === selectedEntityId && !e.companion_of)) {
      setSelectedEntityId(null);
    }
  }, [entities, selectedEntityId]);

  /**
   * Serialize-and-coalesce wrapper around `tokens.update({ entities })`.
   *
   * The token API expects a full entities array per request. Without
   * serialization, two rapid edits produce two concurrent PATCHes whose
   * full-array payloads each compute against a snapshot of `entities`,
   * letting the later response wipe the earlier change.
   *
   * This wrapper:
   *   - always sets `localEntities` so the UI reflects the user's intent
   *     immediately (optimistic update);
   *   - allows only one PATCH request to be in flight at a time;
   *   - coalesces subsequent calls into `patchPendingRef` (latest-wins) and
   *     fires them sequentially after the in-flight call completes;
   *   - clears the optimistic state at the very end of the chain so the UI
   *     snaps to the server-authoritative state in one move (no flicker).
   *
   * Known limitation, documented for future hardening: callers compute
   * `updated` via `entities.map(...)` from their closure-captured `entities`
   * snapshot. Under standard React click-event cadence the closures are
   * refreshed between user events (the previous render commits before the
   * next handler fires), so each `updated` reflects the previous edits.
   * Under programmatic events, very rapid touch input, or React concurrent
   * mode where renders may not commit between events, the second handler's
   * closure could still hold a stale `entities` snapshot and serialize a
   * payload missing earlier changes. The proper fix is to convert all
   * patchEntities callers to a functional-update form
   * `patchEntities(prev => prev.map(...))` so the patch is computed against
   * the latest known state at send time. Touching ~20 call sites makes that
   * a separate change.
   */
  const patchEntities = async (updated: Token["entities"]): Promise<void> => {
    // Optimistic UI: always reflect the latest desired state.
    setLocalEntities(updated);

    if (patchInflightRef.current) {
      // Another request is in flight. Coalesce: the most recent intent wins,
      // and will be sent as the next request once the current one returns.
      patchPendingRef.current = updated;
      return;
    }

    patchInflightRef.current = true;
    setSaving(true);

    try {
      let next: Token["entities"] | null = updated;
      while (next !== null) {
        const toSend: Token["entities"] = next;
        next = null;
        try {
          const t = await api.tokens.update(token.token_id, { entities: toSend });
          setToken(t);
        } catch (err) {
          setError(String(err));
          // Drop any queued patches; user must reapply against fresh state.
          patchPendingRef.current = null;
          break;
        }
        if (patchPendingRef.current !== null) {
          next = patchPendingRef.current;
          patchPendingRef.current = null;
        }
      }
    } finally {
      setLocalEntities(null);
      setSaving(false);
      patchInflightRef.current = false;
    }
  };

  const addEntity = async (entityId: string) => {
    if (!canEdit || existingIds.includes(entityId)) return;
    setAdding(true);
    let alias: string | null = null;
    try {
      const result = await api.tokens.generateAlias(entityId);
      alias = result.alias;
    } catch { /* alias stays null */ }
    const defaultCap = entities[0]?.capabilities ?? "read";
    const updated = [...entities, {
      entity_id: entityId,
      alias,
      capabilities: defaultCap,
      exclude_attributes: [] as string[],
      companion_of: null,
      gesture_config: {},
      name_override: null,
      icon_override: null,
      color_scheme: "auto" as const,
      display_hints: {},
    }];
    await patchEntities(updated);
    setAdding(false);
    setAddInput("");
  };

  const addCompanion = async (primaryEntityId: string, companionEntityId: string) => {
    if (!canEdit || existingIds.includes(companionEntityId)) return;
    setAdding(true);
    let alias: string | null = null;
    try {
      const result = await api.tokens.generateAlias(companionEntityId);
      alias = result.alias;
    } catch { /* alias stays null */ }
    const updated = [...entities, {
      entity_id: companionEntityId,
      alias,
      capabilities: "read" as const,
      exclude_attributes: [] as string[],
      companion_of: primaryEntityId,
      gesture_config: {},
      name_override: null,
      icon_override: null,
      color_scheme: "auto" as const,
      display_hints: {},
    }];
    await patchEntities(updated);
    setAdding(false);
    setCompanionInputs(prev => { const next = { ...prev }; delete next[primaryEntityId]; return next; });
  };

  const removeEntity = (entityId: string) => {
    if (!canEdit) return;
    patchEntities(entities.filter(e => e.entity_id !== entityId && e.companion_of !== entityId));
    setConfirmRemove(null);
  };

  const removeCompanion = (entityId: string) => {
    if (!canEdit) return;
    patchEntities(entities.filter(e => e.entity_id !== entityId));
  };

  const toggleCap = (entityId: string, newCap: "badge" | "read" | "read-write") => {
    if (!canEdit) return;
    const entity = entities.find(e => e.entity_id === entityId);
    if (!entity) return;
    const wasBadge = entity.capabilities === "badge";
    const toBadge = newCap === "badge";
    let updated = entities.map(en => {
      if (en.entity_id === entityId) {
        const hints = { ...(en.display_hints ?? {}) };
        if (wasBadge && !toBadge) {
          delete hints.badge_show_icon;
          delete hints.badge_show_name;
          delete hints.badge_show_state;
          delete hints.badge_icon_color;
        }
        const result = { ...en, capabilities: newCap, display_hints: hints };
        if (toBadge) result.gesture_config = {};
        return result;
      }
      return en;
    });
    if (toBadge) {
      updated = updated.filter(en => en.companion_of !== entityId);
    } else if (newCap === "read") {
      updated = updated.map(en => en.companion_of === entityId ? { ...en, capabilities: "read" } : en);
    }
    patchEntities(updated);
  };

  const saveNameOverride = () => {
    if (!selectedEntity || !canEdit) return;
    const trimmed = nameInput.trim();
    const haEntity = getEntityCache().find(e => e.entity_id === selectedEntity.entity_id);
    const haName = haEntity?.friendly_name ?? "";
    const val = (trimmed && trimmed !== haName) ? trimmed : null;
    if (val !== selectedEntity.name_override) {
      patchEntities(entities.map(en =>
        en.entity_id === selectedEntity.entity_id ? { ...en, name_override: val } : en
      ));
    }
  };

  const saveIconOverride = (iconKey: string | null) => {
    if (!selectedEntity || !canEdit) return;
    if (iconKey !== selectedEntity.icon_override) {
      patchEntities(entities.map(en =>
        en.entity_id === selectedEntity.entity_id ? { ...en, icon_override: iconKey } : en
      ));
    }
    setIconPickerOpen(false);
    setIconFilter("");
  };

  const updateColorScheme = (entityId: string, value: "auto" | "light" | "dark") => {
    if (!canEdit) return;
    patchEntities(entities.map(en =>
      en.entity_id === entityId ? { ...en, color_scheme: value } : en
    ));
  };

  const updateDisplayHint = (entityId: string, key: string, value: unknown) => {
    if (!canEdit) return;
    const entity = entities.find(e => e.entity_id === entityId);
    if (!entity) return;
    const hints = { ...(entity.display_hints ?? {}) };
    const domain = entityId.split(".")[0];
    const attrMap = ATTR_HINT_MAP[domain];

    if (value === null || value === undefined) {
      delete hints[key];
      if (attrMap?.[key]) {
        const attrName = attrMap[key];
        patchEntities(entities.map(en =>
          en.entity_id === entityId ? { ...en, display_hints: hints, exclude_attributes: en.exclude_attributes.filter(a => a !== attrName) } : en
        ));
        return;
      }
    } else {
      hints[key] = value;
      if (value === false && attrMap?.[key]) {
        const attrName = attrMap[key];
        if (!entity.exclude_attributes.includes(attrName)) {
          patchEntities(entities.map(en =>
            en.entity_id === entityId ? { ...en, display_hints: hints, exclude_attributes: [...en.exclude_attributes, attrName] } : en
          ));
          return;
        }
      }
      if (value === true && attrMap?.[key]) {
        const attrName = attrMap[key];
        patchEntities(entities.map(en =>
          en.entity_id === entityId ? { ...en, display_hints: hints, exclude_attributes: en.exclude_attributes.filter(a => a !== attrName) } : en
        ));
        return;
      }
    }
    patchEntities(entities.map(en =>
      en.entity_id === entityId ? { ...en, display_hints: hints } : en
    ));
  };

  const toggleExcludeAttr = (entityId: string, attrKey: string) => {
    if (!canEdit) return;
    const entity = entities.find(e => e.entity_id === entityId);
    if (!entity) return;
    const excluded = new Set(entity.exclude_attributes);
    const domain = entityId.split(".")[0];
    const rMap = reverseAttrMap(domain);

    if (excluded.has(attrKey)) {
      excluded.delete(attrKey);
      const hintKey = rMap[attrKey];
      if (hintKey) {
        const hints = { ...(entity.display_hints ?? {}) };
        delete hints[hintKey];
        patchEntities(entities.map(e =>
          e.entity_id === entityId ? { ...e, exclude_attributes: [...excluded], display_hints: hints } : e
        ));
        return;
      }
    } else {
      excluded.add(attrKey);
      const hintKey = rMap[attrKey];
      if (hintKey) {
        const hints = { ...(entity.display_hints ?? {}), [hintKey]: false };
        patchEntities(entities.map(e =>
          e.entity_id === entityId ? { ...e, exclude_attributes: [...excluded], display_hints: hints } : e
        ));
        return;
      }
    }
    patchEntities(entities.map(e =>
      e.entity_id === entityId ? { ...e, exclude_attributes: [...excluded] } : e
    ));
  };

  const updateGestureSetting = (entityId: string, gesture: "tap" | "hold" | "double_tap", action: string, targetEntityId?: string, data?: Record<string, unknown>) => {
    if (!canEdit) return;
    patchEntities(entities.map(en => {
      if (en.entity_id !== entityId) return en;
      const gc = { ...(en.gesture_config ?? {}) };
      if (action) {
        const entry: import("../types").GestureAction = { action };
        if (targetEntityId) entry.entity_id = targetEntityId;
        if (data && Object.keys(data).length > 0) entry.data = data;
        gc[gesture] = entry;
      } else {
        delete gc[gesture];
      }
      return { ...en, gesture_config: gc };
    }));
  };

  const applyTheme = async (themeId: string) => {
    setSaving(true);
    try {
      const updated = await api.tokens.update(token.token_id, { theme_url: themeIdToUrl(themeId) });
      setToken(updated);
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const closeAgree = () => {
    setShowAgree(false);
    setAgreeText("");
    setPendingThemeId(null);
  };

  useEffect(() => {
    if (!showAgree || !agreeDialogRef.current) return;
    const dialog = agreeDialogRef.current;
    const selector = 'button:not([disabled]), input:not([disabled])';
    previousDialogFocus.current = document.activeElement as HTMLElement | null;
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAgree();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(selector));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previousDialogFocus.current?.focus();
    };
  }, [showAgree]);

  const changeTheme = (themeId: string) => {
    const target = themes.find(t => t.theme_id === themeId);
    if (target?.has_renderer && !renderersAgreed) {
      setPendingThemeId(themeId);
      setShowAgree(true);
      return;
    }
    applyTheme(themeId);
  };

  const confirmAgree = async () => {
    try {
      await api.renderers.agree(true);
      setRenderersAgreed(true);
      setShowAgree(false);
      setAgreeText("");
      if (pendingThemeId) {
        await applyTheme(pendingThemeId);
        setPendingThemeId(null);
      }
    } catch (e) { setError(String(e)); }
  };

  const entitiesBody = (
    <div className="entities-split">
      <div className="entities-list-panel">
        {canEdit && (
          <div style={{ padding: "8px 10px" }}>
            <EntityAutocomplete
              value={addInput}
              onChange={setAddInput}
              onSelect={addEntity}
              disabled={adding || saving}
              excludeIds={existingIds}
              filterDomains={token.entities_block ? ENTITIES_BLOCK_DOMAINS : undefined}
              excludeDomains={blockedDomains}
              placeholder="Add entity..."
            />
          </div>
        )}
        <div
          className="entities-list-scroll"
          role="listbox"
          aria-label="Entity list"
          onKeyDown={ev => {
            if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
            ev.preventDefault();
            const ids = grouped.map(g => g.primary.entity_id);
            const idx = selectedEntityId ? ids.indexOf(selectedEntityId) : -1;
            const next = ev.key === "ArrowDown"
              ? Math.min(idx + 1, ids.length - 1)
              : Math.max(idx - 1, 0);
            setSelectedEntityId(ids[next]);
            const row = ev.currentTarget.querySelector(`[data-entity-id="${ids[next]}"]`) as HTMLElement | null;
            row?.focus();
          }}
        >
          {token.entities_block && (
            <button
              className={`entity-list-row${selectedEntityId === "__block__" ? " selected" : ""}`}
              onClick={() => {
                const next = selectedEntityId === "__block__" ? null : "__block__";
                setSelectedEntityId(next);
                setBlockExpanded(v => !v);
                if (next && window.innerWidth <= 720) {
                  requestAnimationFrame(() => configPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
                }
              }}
              aria-selected={selectedEntityId === "__block__"}
              aria-expanded={blockExpanded}
              role="option"
              data-entity-id="__block__"
              type="button"
            >
              <div className="widget-thumb" style={{ width: 24, height: 24, background: "var(--accent-weak)" }}>
                <Icon name="list" size={12} />
              </div>
              <div className="entity-list-id">
                <span className="entity-list-name">Entities Block</span>
                <span className="entity-list-eid mono">{grouped.length} entities</span>
              </div>
              <Icon name={blockExpanded ? "chevron-up" : "chevron-down"} size={12} />
            </button>
          )}
          {(!token.entities_block || blockExpanded) && grouped.map(g => {
            const e = g.primary;
            const domain = e.entity_id.split(".")[0];
            const isSelected = selectedEntityId === e.entity_id;
            const cached = getEntityCache().find(c => c.entity_id === e.entity_id);
            const friendly = cached?.friendly_name;
            return (
              <div
                key={e.entity_id}
                className={`entity-list-row${isSelected ? " selected" : ""}${token.entities_block ? " entity-list-row--child" : ""}`}
                onClick={() => {
                  const next = isSelected ? null : e.entity_id;
                  setSelectedEntityId(next);
                  if (next && window.innerWidth <= 720) {
                    requestAnimationFrame(() => configPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
                  }
                }}
                aria-selected={isSelected}
                role="option"
                tabIndex={0}
                onKeyDown={ev => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setSelectedEntityId(isSelected ? null : e.entity_id);
                  }
                }}
                data-entity-id={e.entity_id}
              >
                <div className="widget-thumb" style={{ width: 24, height: 24 }}>
                  <WidgetIcon name={resolveEntityIcon(domain, e.icon_override || cached?.icon)} size={12} />
                </div>
                <div className="entity-list-id">
                  {friendly && friendly !== e.entity_id && <span className="entity-list-name">{friendly}</span>}
                  <span className="entity-list-eid mono">{e.entity_id}</span>
                </div>
                {e.alias && <span className="entity-list-alias mono">{e.alias}</span>}
                {canEdit && (
                  <button
                    type="button"
                    onClick={(ev) => { ev.stopPropagation(); setConfirmRemove(e.entity_id); }}
                    className="entity-list-delete"
                    aria-label={`Remove ${e.entity_id}`}
                  >
                    <Icon name="close" size={10} />
                  </button>
                )}
              </div>
            );
          })}
          {grouped.length === 0 && (!token.entities_block || blockExpanded) && (
            <div className="muted" style={{ padding: "20px 10px", textAlign: "center", fontSize: 12 }}>
              No entities added yet.
            </div>
          )}
        </div>
      </div>

      <div className="entities-config-panel" ref={configPanelRef}>
        <div className="entity-config-section">
          <div className="entity-config-title">Theme</div>
          <input
            type="text"
            className="input"
            value={themeFilter}
            onChange={e => setThemeFilter(e.target.value)}
            placeholder="Filter themes..."
            style={{ marginBottom: 8 }}
          />
          <ThemeStrip
            themes={filteredThemes}
            selectedId={currentThemeId}
            onSelect={changeTheme}
          />
        </div>

        {selectedEntityId === "__block__" && token.entities_block && (() => {
          const blockLabel = token.block_label ?? "Entities";
          const blockIcon = token.block_icon ?? null;
          const blockShowLabel = token.block_show_label !== false;
          const blockHighlightRows = token.block_highlight_rows === true;
          const blockShowIcons = token.block_show_icons !== false;
          return (
          <div className="entity-config-section">
            <div className="entity-config-title">Entities Block</div>

            <div style={{ display: "flex", alignItems: "stretch", gap: 8, marginBottom: 12 }}>
              <div className="entity-preview-stage" style={{
                flex: 1, borderRadius: 8,
                background: previewBgGray == null ? undefined : `rgb(${Math.round(previewBgGray * 2.55)},${Math.round(previewBgGray * 2.55)},${Math.round(previewBgGray * 2.55)})`,
                transition: "background 0.15s",
              }}>
                <BlockPreviewWidget
                  entities={entities}
                  theme={selectedTheme}
                  blockLabel={blockLabel}
                  blockIcon={blockIcon}
                  blockShowLabel={blockShowLabel}
                  blockHighlightRows={blockHighlightRows}
                  blockShowIcons={blockShowIcons}
                  blockWidgetBorder={token.block_widget_border}
                  colorScheme={token.color_scheme}
                  perEntityColor={token.block_color_mode === "per_entity"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 12 }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={previewBgGray ?? 50}
                  onChange={ev => setPreviewBgGray(Number(ev.target.value))}
                  {...{ orient: "vertical" } as React.InputHTMLAttributes<HTMLInputElement>}
                  aria-label="Preview background tone"
                  title="Adjust preview background tone"
                  className="preview-bg-slider"
                />
              </div>
            </div>

            <div className="entity-setting-row">
              <label className="entity-setting-label">Display name</label>
              <div style={{ display: "flex", gap: 6, flex: 1, alignItems: "center", position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <button
                    className="icon-picker-btn"
                    title={blockIcon ? `Icon: ${blockIcon}` : "Pick icon"}
                    disabled={!canEdit}
                    onClick={() => { setIconPickerOpen(v => !v); setIconFilter(""); }}
                    type="button"
                    aria-label="Pick block icon"
                    aria-expanded={iconPickerOpen}
                  >
                    {blockIcon && WIDGET_ICONS[blockIcon] ? (
                      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: "block" }}>
                        <path d={WIDGET_ICONS[blockIcon]} fill="currentColor" />
                      </svg>
                    ) : (
                      <Icon name="tune" size={14} />
                    )}
                  </button>
                  {iconPickerOpen && (
                    <div className="icon-picker-popover" role="dialog" aria-label="Icon picker">
                      <input
                        className="input icon-picker-filter"
                        type="text"
                        placeholder="Filter icons..."
                        value={iconFilter}
                        onChange={ev => setIconFilter(ev.target.value)}
                        autoFocus
                      />
                      {blockIcon && (
                        <button
                          className="icon-picker-clear"
                          type="button"
                          onClick={async () => {
                            setIconPickerOpen(false);
                            setIconFilter("");
                            try {
                              const updated = await api.tokens.update(token.token_id, { block_icon: null });
                              setToken(updated);
                            } catch (e) { setError(String(e)); }
                          }}
                        >
                          <Icon name="close" size={11} /> Reset to default
                        </button>
                      )}
                      <div className="icon-picker-grid" role="listbox" aria-label="Icons">
                        {WIDGET_ICON_NAMES
                          .filter(n => !iconFilter || n.replace("mdi:", "").includes(iconFilter.toLowerCase()))
                          .map(iconKey => (
                            <button
                              key={iconKey}
                              className={"icon-picker-tile" + (blockIcon === iconKey ? " selected" : "")}
                              type="button"
                              role="option"
                              aria-selected={blockIcon === iconKey}
                              title={iconKey}
                              onClick={async () => {
                                setIconPickerOpen(false);
                                setIconFilter("");
                                try {
                                  const updated = await api.tokens.update(token.token_id, { block_icon: iconKey });
                                  setToken(updated);
                                } catch (e) { setError(String(e)); }
                              }}
                            >
                              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                                <path d={WIDGET_ICONS[iconKey]} fill="currentColor" />
                              </svg>
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="input flex-1"
                  value={blockLabelInput}
                  onChange={ev => setBlockLabelInput(ev.target.value)}
                  onBlur={async () => {
                    const val = blockLabelInput.trim() || null;
                    if (val !== (token.block_label ?? null)) {
                      try {
                        const updated = await api.tokens.update(token.token_id, { block_label: val });
                        setToken(updated);
                      } catch (e) { setError(String(e)); }
                    }
                  }}
                  onKeyDown={ev => {
                    if (ev.key === "Enter") (ev.target as HTMLInputElement).blur();
                  }}
                  disabled={!canEdit}
                  placeholder="No header"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="entity-setting-row">
              <label className="entity-setting-label">Access</label>
              <div className="segmented-toggle" role="group" aria-label="Access level" style={{ marginLeft: "auto" }}>
                {([["read", "View only"], ["read-write", "Control"], ["per_entity", "Per entity"]] as const).map(([mode, label]) => {
                  const isActive = mode === "per_entity"
                    ? token.block_access_mode === "per_entity"
                    : token.block_access_mode !== "per_entity" && entities[0]?.capabilities === mode;
                  return (
                    <button
                      key={mode}
                      className={isActive ? "active" : ""}
                      aria-pressed={isActive}
                      onClick={async () => {
                        if (!canEdit) return;
                        if (mode === "per_entity") {
                          try {
                            const updated = await api.tokens.update(token.token_id, { block_access_mode: "per_entity" });
                            setToken(updated);
                          } catch (e) { setError(String(e)); }
                        } else {
                          try {
                            const updated = await api.tokens.update(token.token_id, { block_access_mode: "override" });
                            setToken(updated);
                          } catch (e) { setError(String(e)); }
                          patchEntities(entities.map(en => en.companion_of ? en : { ...en, capabilities: mode }));
                        }
                      }}
                      disabled={!canEdit}
                      type="button"
                    >{label}</button>
                  );
                })}
              </div>
            </div>

            <div className="entity-setting-row">
              <label className="entity-setting-label">Always use</label>
              <div className="segmented-toggle" role="group" aria-label="Color scheme" style={{ marginLeft: "auto" }}>
                {(["auto", "light", "dark", "per_entity"] as const).map(scheme => {
                  const isPerEntity = token.block_color_mode === "per_entity";
                  const isActive = scheme === "per_entity" ? isPerEntity : !isPerEntity && token.color_scheme === scheme;
                  const label = scheme === "per_entity" ? "Per entity" : scheme.charAt(0).toUpperCase() + scheme.slice(1);
                  return (
                    <button
                      key={scheme}
                      className={isActive ? "active" : ""}
                      aria-pressed={isActive}
                      onClick={async () => {
                        if (!canEdit) return;
                        try {
                          if (scheme === "per_entity") {
                            const updated = await api.tokens.update(token.token_id, { color_scheme: "auto", block_color_mode: "per_entity" });
                            setToken(updated);
                          } else {
                            const updated = await api.tokens.update(token.token_id, { color_scheme: scheme, block_color_mode: "override" });
                            setToken(updated);
                          }
                        } catch (e) { setError(String(e)); }
                      }}
                      disabled={!canEdit}
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="entity-setting-group">
              <div className="entity-setting-group-title">Entities block settings</div>
              <div className="settings-toggle-grid">
                <div className="settings-toggle-item">
                  <Toggle
                    checked={blockShowLabel}
                    onChange={async v => {
                      try {
                        const updated = await api.tokens.update(token.token_id, { block_show_label: v });
                        setToken(updated);
                      } catch (e) { setError(String(e)); }
                    }}
                    disabled={!canEdit}
                  />
                  <span>Display header</span>
                </div>
                <div className="settings-toggle-item">
                  <Toggle
                    checked={blockHighlightRows}
                    onChange={async v => {
                      try {
                        const updated = await api.tokens.update(token.token_id, { block_highlight_rows: v });
                        setToken(updated);
                      } catch (e) { setError(String(e)); }
                    }}
                    disabled={!canEdit}
                  />
                  <span>Highlight rows</span>
                </div>
                <div className="settings-toggle-item">
                  <Toggle
                    checked={blockShowIcons}
                    onChange={async v => {
                      try {
                        const updated = await api.tokens.update(token.token_id, { block_show_icons: v });
                        setToken(updated);
                      } catch (e) { setError(String(e)); }
                    }}
                    disabled={!canEdit}
                  />
                  <span>Show entity icons</span>
                </div>
              </div>
              {rendererSettings.includes("widget_border") && (
              <div className="entity-setting-row" style={{ paddingTop: 4 }}>
                <label className="entity-setting-label">Widget border</label>
                <div className="segmented-toggle" role="radiogroup" aria-label="Widget border" style={{ marginLeft: "auto" }}>
                  {(["outer", "none"] as const).map(b => (
                    <button
                      key={b}
                      className={(token.block_widget_border ?? "outer") === b ? "active" : ""}
                      aria-pressed={(token.block_widget_border ?? "outer") === b}
                      onClick={async () => {
                        if (!canEdit) return;
                        try {
                          const updated = await api.tokens.update(token.token_id, { block_widget_border: b === "outer" ? null : b });
                          setToken(updated);
                        } catch (e) { setError(String(e)); }
                      }}
                      disabled={!canEdit}
                      type="button"
                    >
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
          );
        })()}

        {selectedEntity && selectedDomain && (() => {
          const friendlyName = getEntityCache().find(c => c.entity_id === selectedEntity.entity_id)?.friendly_name;
          const entitySnippet = entitySnippetAlias && selectedEntity.alias
            ? `<hrv-card alias="${selectedEntity.alias}"></hrv-card>`
            : `<hrv-card entity="${selectedEntity.entity_id}"></hrv-card>`;
          const copyEntitySnippet = () => {
            doCopy(entitySnippet);
            setSavedMsg?.("Copied to clipboard");
          };
          return (
          <div className="entity-config-section">
            <div className="entity-config-title">
              {friendlyName && friendlyName !== selectedEntity.entity_id
                ? <><span className="entity-config-friendly">{friendlyName}</span> <span className="entity-config-eid">({selectedEntity.entity_id})</span></>
                : selectedEntity.entity_id}
            </div>

            {!token.entities_block && (
            <div className="entity-snippet-row">
              <pre
                className="entity-snippet-code"
                onClick={ev => {
                  copyEntitySnippet();
                  const target = ev.currentTarget;
                  requestAnimationFrame(() => {
                    const sel = window.getSelection();
                    if (sel) { const range = document.createRange(); range.selectNodeContents(target); sel.removeAllRanges(); sel.addRange(range); }
                  });
                }}
                title="Click to copy"
              >{entitySnippet}</pre>
              <div className="entity-snippet-alias">
                <Toggle checked={entitySnippetAlias} onChange={setEntitySnippetAlias} disabled={!selectedEntity.alias} />
                <span>Alias</span>
              </div>
            </div>
            )}

            {!token.entities_block && entityDetail[selectedEntity.entity_id] && (() => {
              const bgColor = previewBgGray == null
                ? undefined
                : `rgb(${Math.round(previewBgGray * 2.55)},${Math.round(previewBgGray * 2.55)},${Math.round(previewBgGray * 2.55)})`;
              return (
                <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
                  <div className="entity-preview-stage" style={{ flex: 1, borderRadius: 8, background: bgColor, transition: "background 0.15s" }}>
                    <EntityPreview
                      entity={entityDetail[selectedEntity.entity_id]}
                      entityAccess={selectedEntity}
                      theme={selectedTheme}
                      companions={selectedGroup?.companions ?? []}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 12 }}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={previewBgGray ?? 50}
                      onChange={ev => setPreviewBgGray(Number(ev.target.value))}
                      {...{ orient: "vertical" } as React.InputHTMLAttributes<HTMLInputElement>}
                      aria-label="Preview background tone"
                      title="Adjust preview background tone"
                      className="preview-bg-slider"
                    />
                  </div>
                </div>
              );
            })()}

            <div className="entity-setting-row">
              <label className="entity-setting-label">Display name</label>
              <div style={{ display: "flex", gap: 6, flex: 1, alignItems: "center", position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <button
                    className="icon-picker-btn"
                    title={selectedEntity.icon_override ? `Icon: ${selectedEntity.icon_override}` : "Pick icon"}
                    disabled={!canEdit}
                    onClick={() => { setIconPickerOpen(v => !v); setIconFilter(""); }}
                    type="button"
                    aria-label="Pick icon"
                    aria-expanded={iconPickerOpen}
                  >
                    {selectedEntity.icon_override && WIDGET_ICONS[selectedEntity.icon_override] ? (
                      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: "block" }}>
                        <path d={WIDGET_ICONS[selectedEntity.icon_override]} fill="currentColor" />
                      </svg>
                    ) : (
                      <Icon name="tune" size={14} />
                    )}
                  </button>
                  {iconPickerOpen && (
                    <div className="icon-picker-popover" role="dialog" aria-label="Icon picker">
                      <input
                        className="input icon-picker-filter"
                        type="text"
                        placeholder="Filter icons..."
                        value={iconFilter}
                        onChange={ev => setIconFilter(ev.target.value)}
                        autoFocus
                      />
                      {selectedEntity.icon_override && (
                        <button
                          className="icon-picker-clear"
                          type="button"
                          onClick={() => saveIconOverride(null)}
                        >
                          <Icon name="close" size={11} /> Reset to default
                        </button>
                      )}
                      <div className="icon-picker-grid" role="listbox" aria-label="Icons">
                        {WIDGET_ICON_NAMES
                          .filter(n => !iconFilter || n.replace("mdi:", "").includes(iconFilter.toLowerCase()))
                          .map(iconKey => (
                            <button
                              key={iconKey}
                              className={"icon-picker-tile" + (selectedEntity.icon_override === iconKey ? " selected" : "")}
                              type="button"
                              role="option"
                              aria-selected={selectedEntity.icon_override === iconKey}
                              title={iconKey}
                              onClick={() => saveIconOverride(iconKey)}
                            >
                              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                                <path d={WIDGET_ICONS[iconKey]} fill="currentColor" />
                              </svg>
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="input flex-1"
                  value={nameInput}
                  onChange={ev => setNameInput(ev.target.value)}
                  onBlur={saveNameOverride}
                  onKeyDown={ev => { if (ev.key === "Enter") saveNameOverride(); }}
                  disabled={!canEdit}
                  placeholder="Use HA friendly name"
                  maxLength={100}
                />
              </div>
            </div>

            {(!token.entities_block || token.block_access_mode === "per_entity") && (
            <div className="entity-setting-row">
              <label className="entity-setting-label">Access</label>
              <div className="segmented-toggle" role="group" aria-label="Access level" style={{ marginLeft: "auto" }}>
                {!token.entities_block && (
                <button
                  className={selectedEntity.capabilities === "badge" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "badge"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "badge")}
                  disabled={!canEdit}
                  type="button"
                >Badge</button>
                )}
                <button
                  className={selectedEntity.capabilities === "read" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "read"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "read")}
                  disabled={!canEdit}
                  type="button"
                >{token.entities_block ? "View only" : "Read only"}</button>
                {!(selectedDomain && READ_ONLY_DOMAINS.has(selectedDomain)) && (
                <button
                  className={selectedEntity.capabilities === "read-write" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "read-write"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "read-write")}
                  disabled={!canEdit}
                  type="button"
                >Control</button>
                )}
              </div>
            </div>
            )}

            {(!token.entities_block || token.block_color_mode === "per_entity") && (
            <div className="entity-setting-row">
              <label className="entity-setting-label">Always use</label>
              <div className="segmented-toggle" role="group" aria-label="Color scheme" style={{ marginLeft: "auto" }}>
                {(["auto", "light", "dark"] as const).map(scheme => (
                  <button
                    key={scheme}
                    className={selectedEntity.color_scheme === scheme ? "active" : ""}
                    aria-pressed={selectedEntity.color_scheme === scheme}
                    onClick={() => updateColorScheme(selectedEntity.entity_id, scheme)}
                    disabled={!canEdit}
                    type="button"
                  >
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            )}

            {NUMERIC_STATE_DOMAINS.has(selectedDomain) && (
            <div className="entity-setting-row">
              <label className="entity-setting-label">Decimal rounding</label>
              <input
                type="number"
                className="input"
                style={{ width: 96, marginLeft: "auto", textAlign: "center" }}
                min={0}
                max={6}
                step={1}
                placeholder="None"
                value={(selectedEntity.display_hints?.decimal_places as number | undefined) ?? ""}
                onChange={ev => {
                  const raw = ev.target.value;
                  if (raw === "") {
                    updateDisplayHint(selectedEntity.entity_id, "decimal_places", null);
                    return;
                  }
                  const v = parseInt(raw, 10);
                  if (isFinite(v) && v >= 0 && v <= 6) {
                    updateDisplayHint(selectedEntity.entity_id, "decimal_places", v);
                  }
                }}
                disabled={!canEdit}
              />
            </div>
            )}

            {selectedEntity.capabilities === "badge" && !token.entities_block && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Badge settings</div>
                <div className="settings-toggle-grid">
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.badge_show_icon !== false}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "badge_show_icon", v ? null : false)}
                      disabled={!canEdit}
                    />
                    <span>Show icon</span>
                  </label>
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.badge_show_name !== false}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "badge_show_name", v ? null : false)}
                      disabled={!canEdit}
                    />
                    <span>Show name</span>
                  </label>
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.badge_show_state !== false}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "badge_show_state", v ? null : false)}
                      disabled={!canEdit}
                    />
                    <span>Show state</span>
                  </label>
                </div>
                {(rendererSettings.length === 0 || rendererSettings.includes("badge_icon_color")) && (
                <div className="entity-setting-row" style={{ paddingTop: 4 }}>
                  <label className="entity-setting-label">Icon color</label>
                  <div className="badge-color-swatches" role="radiogroup" aria-label="Icon color">
                    {([
                      ["red", "#ef4444"], ["orange", "#f97316"], ["amber", "#f59e0b"],
                      ["yellow", "#eab308"], ["green", "#22c55e"], ["teal", "#14b8a6"],
                      ["cyan", "#06b6d4"], ["blue", "#3b82f6"], ["indigo", "#6366f1"],
                      ["purple", "#a855f7"], ["pink", "#ec4899"], ["grey", "#9ca3af"],
                    ] as const).map(([name, hex]) => (
                      <button
                        key={name}
                        type="button"
                        className="badge-color-swatch"
                        style={{ background: hex }}
                        role="radio"
                        aria-checked={selectedEntity.display_hints?.badge_icon_color === name}
                        aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                        onClick={() => updateDisplayHint(selectedEntity.entity_id, "badge_icon_color", name)}
                        disabled={!canEdit}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                    ))}
                    <button
                      type="button"
                      className="badge-color-swatch-auto"
                      role="radio"
                      aria-checked={!selectedEntity.display_hints?.badge_icon_color || selectedEntity.display_hints?.badge_icon_color === "auto"}
                      aria-label="Auto"
                      onClick={() => updateDisplayHint(selectedEntity.entity_id, "badge_icon_color", null)}
                      disabled={!canEdit}
                      title="Auto"
                    >(Auto)</button>
                  </div>
                </div>
                )}
                {rendererSettings.includes("widget_border") && (
                <div className="entity-setting-row" style={{ paddingTop: 4 }}>
                  <label className="entity-setting-label">Widget border</label>
                  <div className="segmented-toggle" role="radiogroup" aria-label="Widget border" style={{ marginLeft: "auto" }}>
                    {(["inner", "outer", "none"] as const).map(b => (
                      <button
                        key={b}
                        className={(selectedEntity.display_hints?.widget_border ?? "outer") === b ? "active" : ""}
                        aria-pressed={(selectedEntity.display_hints?.widget_border ?? "outer") === b}
                        onClick={() => updateDisplayHint(selectedEntity.entity_id, "widget_border", b === "outer" ? null : b)}
                        disabled={!canEdit}
                        type="button"
                      >
                        {b.charAt(0).toUpperCase() + b.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && rendererSettings.includes("layout") && (
            <div className="entity-setting-row">
              <label className="entity-setting-label">Layout</label>
              <div className="segmented-toggle" role="group" aria-label="Card layout" style={{ marginLeft: "auto" }}>
                {(["horizontal", "vertical"] as const).map(l => (
                  <button
                    key={l}
                    className={(selectedEntity.display_hints?.layout ?? "horizontal") === l ? "active" : ""}
                    aria-pressed={(selectedEntity.display_hints?.layout ?? "horizontal") === l}
                    onClick={() => updateDisplayHint(selectedEntity.entity_id, "layout", l === "horizontal" ? null : l)}
                    disabled={!canEdit}
                    type="button"
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && (rendererSettings.includes("show_icon") || rendererSettings.includes("show_name") || rendererSettings.includes("widget_border")) && (
            <div className="entity-setting-group">
              <div className="entity-setting-group-title">Theme settings</div>
              {(rendererSettings.includes("show_icon") || rendererSettings.includes("show_name")) && (
              <div className="settings-toggle-grid">
                {rendererSettings.includes("show_icon") && (
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.show_icon !== false}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_icon", v ? null : false)}
                      disabled={!canEdit}
                    />
                    <span>Show icon</span>
                  </label>
                )}
                {rendererSettings.includes("show_name") && (
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.show_name !== false}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_name", v ? null : false)}
                      disabled={!canEdit}
                    />
                    <span>Show name</span>
                  </label>
                )}
              </div>
              )}
              {rendererSettings.includes("widget_border") && (
              <div className="entity-setting-row" style={{ paddingTop: 4 }}>
                <label className="entity-setting-label">Widget border</label>
                <div className="segmented-toggle" role="radiogroup" aria-label="Widget border" style={{ marginLeft: "auto" }}>
                  {(["inner", "outer", "none"] as const).map(b => (
                    <button
                      key={b}
                      className={(selectedEntity.display_hints?.widget_border ?? "outer") === b ? "active" : ""}
                      aria-pressed={(selectedEntity.display_hints?.widget_border ?? "outer") === b}
                      onClick={() => updateDisplayHint(selectedEntity.entity_id, "widget_border", b === "outer" ? null : b)}
                      disabled={!canEdit}
                      type="button"
                    >
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && (
            <div className="entity-setting-group">
              <button className="entity-setting-group-title" onClick={() => setShowCompanions(!showCompanions)} type="button" aria-expanded={showCompanions}>
                Companions ({selectedGroup?.companions.length ?? 0})
                {" "}<Icon name={showCompanions ? "chevron-up" : "chevron-down"} size={10} />
              </button>
              {showCompanions && (
                <div style={{ paddingTop: 4 }}>
                  {selectedGroup?.companions.map(c => (
                    <div key={c.entity_id} className="chip" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, minWidth: 0 }}>
                      <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }} className="mono" title={c.entity_id}>{c.entity_id}</span>
                      {c.alias && <span className="muted" style={{ fontSize: 10, flexShrink: 0 }}>alias: {c.alias}</span>}
                      {selectedEntity.capabilities === "read-write" && COMPANION_INTERACTIVE_DOMAINS.has(c.entity_id.split(".")[0]) && (
                      <label style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 4 }}>
                        <Toggle
                          checked={c.capabilities === "read"}
                          onChange={v => patchEntities(entities.map(en => en.entity_id === c.entity_id ? { ...en, capabilities: v ? "read" : "read-write" } : en))}
                          disabled={!canEdit}
                          size="small"
                        />
                        <span style={{ fontSize: 10, whiteSpace: "nowrap" }} className="muted">Read only</span>
                      </label>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => removeCompanion(c.entity_id)}
                          className="btn btn-sm btn-ghost"
                          style={{ padding: "1px 4px" }}
                          aria-label={`Remove companion ${c.entity_id}`}
                          type="button"
                        ><Icon name="close" size={10} /></button>
                      )}
                    </div>
                  ))}
                  {canEdit && (
                    <EntityAutocomplete
                      value={companionInputs[selectedEntity.entity_id] ?? ""}
                      onChange={v => setCompanionInputs(prev => ({ ...prev, [selectedEntity.entity_id]: v }))}
                      onSelect={(id) => addCompanion(selectedEntity.entity_id, id)}
                      disabled={adding || saving}
                      excludeIds={existingIds}
                      filterDomains={COMPANION_ALLOWED_DOMAINS}
                      excludeDomains={blockedDomains}
                      placeholder="Add companion..."
                    />
                  )}
                </div>
              )}
            </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "light" && (hasFeature(rendererCap, "light", "brightness") || hasFeature(rendererCap, "light", "color_temp") || hasFeature(rendererCap, "light", "rgb")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Light settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(rendererCap, "light", "brightness") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_brightness !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_brightness", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Brightness</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "light", "color_temp") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_color_temp !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_color_temp", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Color temp</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "light", "rgb") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_rgb !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_rgb", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>RGB color</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "fan" && (() => {
              const fanDetail = entityDetail[selectedEntity.entity_id];
              const fanBits = Number(fanDetail?.attributes?.supported_features ?? 0);
              const fanHasOscillate = !!(fanBits & 2);
              const fanHasDirection = !!(fanBits & 4);
              const fanHasPresets = !!(fanBits & 8);
              return (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Fan settings</div>
                <div className="settings-toggle-grid">
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={!!selectedEntity.display_hints?.animate}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "animate", v || null)}
                      disabled={!canEdit}
                    />
                    <span>Animated</span>
                  </label>
                  {fanHasOscillate && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_oscillate !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_oscillate", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Oscillate</span>
                    </label>
                  )}
                  {fanHasDirection && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_direction !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_direction", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Direction</span>
                    </label>
                  )}
                  {fanHasPresets && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_presets !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_presets", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Presets</span>
                    </label>
                  )}
                </div>
                <div className="entity-setting-row" style={{ paddingTop: 4 }}>
                  <label className="entity-setting-label">Display mode</label>
                  <select
                    value={(selectedEntity.display_hints?.display_mode as string) ?? "auto"}
                    onChange={ev => updateDisplayHint(selectedEntity.entity_id, "display_mode", ev.target.value === "auto" ? null : ev.target.value)}
                    disabled={!canEdit}
                    className="input"
                  >
                    <option value="auto">Auto</option>
                    <option value="on-off">On/Off only</option>
                    {hasFeature(rendererCap, "fan", "continuous") && <option value="continuous">Continuous</option>}
                    {hasFeature(rendererCap, "fan", "stepped") && <option value="stepped">Stepped</option>}
                    {hasFeature(rendererCap, "fan", "cycle") && <option value="cycle">Cycle</option>}
                  </select>
                </div>
              </div>
              );
            })()}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "climate" && (hasFeature(rendererCap, "climate", "hvac_modes") || hasFeature(rendererCap, "climate", "presets") || hasFeature(rendererCap, "climate", "fan_mode") || hasFeature(rendererCap, "climate", "swing_mode")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Climate settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(rendererCap, "climate", "hvac_modes") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_hvac_modes !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_hvac_modes", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>HVAC modes</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "climate", "presets") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_presets !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_presets", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Presets</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "climate", "fan_mode") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_fan_mode !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_fan_mode", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Fan mode</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "climate", "swing_mode") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_swing_mode !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_swing_mode", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Swing mode</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "cover" && (hasFeature(rendererCap, "cover", "position") || hasFeature(rendererCap, "cover", "tilt")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Cover settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(rendererCap, "cover", "position") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_position !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_position", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Position slider</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "cover", "tilt") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_tilt !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_tilt", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Tilt control</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "media_player" && (hasFeature(rendererCap, "media_player", "transport") || hasFeature(rendererCap, "media_player", "volume") || hasFeature(rendererCap, "media_player", "source")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Media player settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(rendererCap, "media_player", "transport") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_transport !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_transport", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Transport</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "media_player", "volume") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_volume !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_volume", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Volume</span>
                    </label>
                  )}
                  {hasFeature(rendererCap, "media_player", "source") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_source !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_source", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Source</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "weather" && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Weather settings</div>
                <div className="settings-toggle-grid">
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.show_forecast === true}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_forecast", v ? true : null)}
                      disabled={!canEdit}
                    />
                    <span>Show forecast</span>
                  </label>
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && HISTORY_DOMAINS.has(selectedDomain) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Graph settings</div>
                <div className="entity-graph-settings">
                  <label className="entity-graph-field">
                    Graph
                    <select
                      value={(selectedEntity.display_hints?.graph as string) ?? ""}
                      onChange={ev => updateDisplayHint(selectedEntity.entity_id, "graph", ev.target.value || null)}
                      disabled={!canEdit}
                      className="input entity-graph-select"
                    >
                      <option value="">None</option>
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      {selectedDomain === "binary_sensor" && <option value="step">Step</option>}
                    </select>
                  </label>
                  <label className="entity-graph-field">
                    Hours
                    <select
                      value={(selectedEntity.display_hints?.hours as number) ?? 24}
                      onChange={ev => updateDisplayHint(selectedEntity.entity_id, "hours", Number(ev.target.value))}
                      disabled={!canEdit || !selectedEntity.display_hints?.graph}
                      className="input entity-graph-select"
                    >
                      {HOURS_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </label>
                  <label className="entity-graph-field">
                    Period
                    <select
                      value={(selectedEntity.display_hints?.period as number) ?? 10}
                      onChange={ev => updateDisplayHint(selectedEntity.entity_id, "period", Number(ev.target.value))}
                      disabled={!canEdit || !selectedEntity.display_hints?.graph}
                      className="input entity-graph-select"
                    >
                      {PERIOD_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && selectedDomain === "input_number" && hasFeature(rendererCap, "input_number", "buttons") && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Display mode</div>
                <div className="segmented-toggle">
                  <button
                    className={(selectedEntity.display_hints?.display_mode ?? "slider") === "slider" ? "active" : ""}
                    onClick={() => updateDisplayHint(selectedEntity.entity_id, "display_mode", null)}
                    disabled={!canEdit}
                    type="button"
                  >Slider</button>
                  <button
                    className={selectedEntity.display_hints?.display_mode === "buttons" ? "active" : ""}
                    onClick={() => updateDisplayHint(selectedEntity.entity_id, "display_mode", "buttons")}
                    disabled={!canEdit}
                    type="button"
                  >Buttons</button>
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && (selectedDomain === "input_select" || selectedDomain === "select") && hasFeature(rendererCap, selectedDomain, "dropdown") && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Select settings</div>
                <div className="settings-toggle-grid">
                  <label className="settings-toggle-item">
                    <Toggle
                      checked={selectedEntity.display_hints?.display_mode === "dropdown"}
                      onChange={v => updateDisplayHint(selectedEntity.entity_id, "display_mode", v ? "dropdown" : null)}
                      disabled={!canEdit}
                    />
                    <span>Show as dropdown</span>
                  </label>
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && (
            <div className="entity-setting-group">
              <div className="entity-setting-group-title">
                Exclude attributes
                {selectedEntity.exclude_attributes.length > 0 && (
                  <span className="muted" style={{ fontWeight: 400 }}> ({selectedEntity.exclude_attributes.length})</span>
                )}
                {selectedEntity.exclude_attributes.length > 0 && canEdit && (
                  <button
                    className="btn-link"
                    style={{ fontSize: 11, marginLeft: 8 }}
                    onClick={() => patchEntities(entities.map(en =>
                      en.entity_id === selectedEntity.entity_id ? { ...en, exclude_attributes: [] } : en
                    ))}
                    type="button"
                  >Clear all</button>
                )}
              </div>
              {attrLoading.has(selectedEntity.entity_id) ? (
                <Spinner size={16} />
              ) : attrCache[selectedEntity.entity_id] ? (
                <div className="attr-filter-grid">
                  {attrCache[selectedEntity.entity_id].map(attr => {
                    const excluded = selectedEntity.exclude_attributes.includes(attr);
                    return (
                      <label key={attr} className={`attr-filter-item${excluded ? " excluded" : ""}`}>
                        <Toggle
                          checked={excluded}
                          onChange={() => toggleExcludeAttr(selectedEntity.entity_id, attr)}
                          disabled={!canEdit}
                        />
                        <span className="mono">{attr}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="muted fs-12">Entity not found in HA.</div>
              )}
            </div>
            )}

            {selectedDomain === "script" && selectedEntity.capabilities === "read-write" && (
            <div className="entity-setting-group">
              <div className="entity-setting-group-title">Script variables</div>
              <ScriptVarsEditor
                entityId={selectedEntity.entity_id}
                serviceData={selectedEntity.service_data ?? {}}
                onChange={data => {
                  patchEntities(entities.map(en =>
                    en.entity_id === selectedEntity.entity_id ? { ...en, service_data: data } : en
                  ));
                }}
                disabled={!canEdit}
              />
            </div>
            )}

            {selectedEntity.capabilities !== "badge" && !token.entities_block && (
            <div className="entity-setting-group">
              <div className="entity-setting-group-title">Gestures</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {(["tap", "hold", "double_tap"] as const).map(gesture => {
                  const label = gesture === "double_tap" ? "Double-tap" : gesture.charAt(0).toUpperCase() + gesture.slice(1);
                  const gc = selectedEntity.gesture_config ?? {};
                  const entry = gc[gesture];
                  const currentAction = entry?.action ?? "";
                  const isCallService = currentAction === "call-service";
                  const svcName = isCallService ? (entry?.data?.service as string ?? "") : "";
                  const svcDataRaw = isCallService ? (entry?.data?.service_data as Record<string, unknown> | undefined) : undefined;
                  const svcDataStr = svcDataRaw ? JSON.stringify(svcDataRaw, null, 2) : "";
                  const [svcDomain, svcAction] = svcName.includes(".") ? svcName.split(".", 2) : ["", ""];
                  const entityDomain = selectedEntity.entity_id.split(".")[0];
                  return (
                    <div key={gesture} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 12, color: "var(--ink-3)", minWidth: 90 }}>{label}</span>
                        <select
                          value={currentAction}
                          onChange={ev => {
                            const val = ev.target.value;
                            if (val === "call-service") {
                              updateGestureSetting(selectedEntity.entity_id, gesture, val, undefined, { service: "" });
                            } else {
                              updateGestureSetting(selectedEntity.entity_id, gesture, val);
                            }
                          }}
                          disabled={!canEdit}
                          className="input entity-graph-select"
                        >
                          <option value="">Default</option>
                          <option value="toggle">Toggle</option>
                          <option value="call-service">Perform action</option>
                          <option value="none">None (disable)</option>
                        </select>
                      </div>
                      {isCallService && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 72 }}>
                          <ActionPicker
                            value={svcName}
                            onChange={newAction => {
                              const d: Record<string, unknown> = { service: newAction };
                              if (newAction !== svcName) {
                                // Clear service_data when action changes
                              } else if (svcDataRaw) {
                                d.service_data = svcDataRaw;
                              }
                              updateGestureSetting(selectedEntity.entity_id, gesture, "call-service", undefined, d);
                            }}
                            disabled={!canEdit}
                            entityDomain={entityDomain}
                          />
                          {svcDomain && svcAction && (
                            <ServiceDataFields
                              domain={svcDomain}
                              service={svcAction}
                              data={svcDataRaw ?? {}}
                              onChange={newData => {
                                const d: Record<string, unknown> = { service: svcName };
                                if (Object.keys(newData).length > 0) d.service_data = newData;
                                updateGestureSetting(selectedEntity.entity_id, gesture, "call-service", undefined, d);
                              }}
                              disabled={!canEdit}
                            />
                          )}
                          <details className="svc-json-fallback">
                            <summary className="muted fs-11" style={{ cursor: "pointer" }}>JSON</summary>
                            <textarea
                              className="input"
                              placeholder='{"brightness": 255}'
                              value={svcDataStr}
                              disabled={!canEdit}
                              rows={2}
                              onChange={ev => {
                                const d: Record<string, unknown> = { service: svcName };
                                const raw = ev.target.value.trim();
                                if (raw) {
                                  try { d.service_data = JSON.parse(raw); } catch { d.service_data = raw; }
                                }
                                updateGestureSetting(selectedEntity.entity_id, gesture, "call-service", undefined, d);
                              }}
                              style={{ fontSize: 12, fontFamily: "var(--mono)", resize: "vertical", marginTop: 4 }}
                            />
                          </details>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </div>
          );
        })()}

        {!selectedEntity && selectedEntityId !== "__block__" && grouped.length > 0 && (
          <div className="entity-config-section" style={{ textAlign: "center", color: "var(--ink-4)" }}>
            <p style={{ fontSize: 13, margin: "20px 0" }}>Select an entity to configure its display settings.</p>
          </div>
        )}
      </div>

      {confirmRemove && (
        <ConfirmDialog
          title="Remove entity"
          message={`Remove ${confirmRemove} and its companions from this widget? Active sessions using this entity will lose access.`}
          confirmLabel="Remove"
          confirmDestructive
          onConfirm={() => removeEntity(confirmRemove)}
          onCancel={() => setConfirmRemove(null)}
        />
      )}

      {showAgree && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="td-renderer-agree-title" onClick={closeAgree}>
          <div ref={agreeDialogRef} className="dialog" onClick={e => e.stopPropagation()}>
            <h3 id="td-renderer-agree-title" className="dialog-title">Renderer Warning</h3>
            <div className="dialog-body">
              <p>
                This theme includes custom renderer JavaScript that executes with the embedding
                page's privileges. It can access the page DOM, browser storage, non-HttpOnly
                cookies, and widget credentials. Only enable renderers you fully trust.
              </p>
              <p style={{ marginTop: 12 }}>
                Type <strong>AGREE</strong> below to confirm.
              </p>
              <input
                type="text"
                className="input"
                value={agreeText}
                onChange={e => setAgreeText(e.target.value)}
                placeholder="Type AGREE"
                autoFocus
                style={{ marginTop: 8 }}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={closeAgree} type="button">
                Cancel
              </button>
              <button className="btn btn-primary" disabled={agreeText !== "AGREE"} onClick={confirmAgree} type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (bare) return entitiesBody;

  return (
    <Card title="Entities" pad={false}>
      {entitiesBody}
    </Card>
  );
}
