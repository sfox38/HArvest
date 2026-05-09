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

import { useState, useEffect, useRef } from "react";
import type { Token, ThemeDefinition, ThemeCapabilities, HAEntityDetail } from "../types";
import { api } from "../api";
import { ConfirmDialog, Card, Spinner, EntityAutocomplete, useThemeThumbs, useDragScroll } from "./Shared";
import { Icon } from "./Icon";
import { Toggle } from "./Toggle";
import { doCopy, groupEntities } from "./CodeSection";
import { EntityPreview } from "./EntityPreview";
import { loadEntityCache, getEntityCache, useEntityCache } from "../entityCache";
import { WIDGET_ICONS, WIDGET_ICON_NAMES } from "../widgetIcons";

const PERIOD_OPTIONS = [
  { value: 1440, label: "1 day" },
  { value: 60,   label: "1 hour" },
  { value: 30,   label: "30 minutes" },
  { value: 10,   label: "10 minutes" },
  { value: 5,    label: "5 minutes" },
  { value: 1,    label: "1 minute" },
];

const DOMAIN_ICON: Record<string, string> = {
  light: "lightbulb",
  switch: "power",
  input_boolean: "power",
  binary_sensor: "bolt",
  sensor: "chart-line",
  media_player: "play",
  lock: "lock",
  timer: "clock",
  input_select: "list",
  input_number: "tune",
  fan: "fan",
  climate: "thermostat",
  cover: "chevDown",
  harvest_action: "play",
};

function themeIdToUrl(id: string): string {
  if (id === "default") return "";
  if (id.startsWith("hth_")) return `user:${id}`;
  return `bundled:${id}`;
}

function themeUrlToId(url: string): string {
  if (!url) return "default";
  if (url.startsWith("bundled:")) return url.slice(8);
  if (url.startsWith("user:")) return url.slice(5);
  return url;
}

interface EntitiesEditorProps {
  token: Token;
  readonly: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token) => void;
  setError: (e: string) => void;
  setSavedMsg?: (msg: string) => void;
}

const COMPANION_ALLOWED_DOMAINS = new Set(["light", "switch", "binary_sensor", "input_boolean", "cover", "remote", "fan", "sensor"]);
const HISTORY_DOMAINS = new Set(["sensor", "input_number", "binary_sensor"]);
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

export function EntitiesEditor({ token, readonly, saving, setSaving, setToken, setError, setSavedMsg, bare }: EntitiesEditorProps & { bare?: boolean }) {
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState("");
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [packsAgreed, setPacksAgreed] = useState<boolean | null>(null);
  const [showAgree, setShowAgree] = useState(false);
  const [agreeText, setAgreeText] = useState("");
  const [pendingThemeId, setPendingThemeId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconFilter, setIconFilter] = useState("");
  const [previewBgGray, setPreviewBgGray] = useState<number | null>(null);
  const [entitySnippetAlias, setEntitySnippetAlias] = useState(false);
  const [showCompanions, setShowCompanions] = useState(false);
  const [attrCache, setAttrCache] = useState<Record<string, string[]>>({});
  const [attrLoading, setAttrLoading] = useState<Set<string>>(new Set());
  const [haActionEntities, setHaActionEntities] = useState<import("../types").HAEntity[]>([]);
  const [entityDetail, setEntityDetail] = useState<Record<string, HAEntityDetail>>({});
  const configPanelRef = useRef<HTMLDivElement>(null);
  const [localEntities, setLocalEntities] = useState<Token["entities"] | null>(null);
  // Serialize patchEntities so two rapid edits do not produce two concurrent
  // PATCH requests with conflicting full-array payloads. inflightRef gates
  // the in-flight request; pendingRef coalesces subsequent edits to "latest
  // write wins" before the in-flight one returns. See patchEntities below.
  const patchInflightRef = useRef(false);
  const patchPendingRef  = useRef<Token["entities"] | null>(null);
  const [companionInputs, setCompanionInputs] = useState<Record<string, string>>({});
  const entityCacheList = useEntityCache();
  const themeStripRef = useDragScroll<HTMLDivElement>();

  useEffect(() => { if (entityCacheList.length === 0) loadEntityCache(); }, []);
  useEffect(() => {
    api.entities.list()
      .then(list => setHaActionEntities(list.filter(e => e.domain === "harvest_action")))
      .catch(() => {});
  }, []);
  useEffect(() => { api.themes.list().then(setThemes).catch(() => {}); }, []);
  useEffect(() => { api.packs.list().then(d => setPacksAgreed(d.agreed)).catch(() => {}); }, []);

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
  const thumbUrls = useThemeThumbs(themes);
  const currentThemeId = themeUrlToId(token.theme_url ?? "");
  const selectedTheme = themes.find(t => t.theme_id === currentThemeId) ?? null;
  const packCap = selectedTheme?.capabilities ?? null;
  const packSettings = selectedTheme?.pack_settings ?? [];

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
  }, [selectedEntityId]);

  useEffect(() => {
    if (selectedEntityId && !entities.some(e => e.entity_id === selectedEntityId && !e.companion_of)) {
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

  const updateGestureSetting = (entityId: string, gesture: "tap" | "hold" | "double_tap", action: string, targetEntityId?: string) => {
    if (!canEdit) return;
    patchEntities(entities.map(en => {
      if (en.entity_id !== entityId) return en;
      const gc = { ...(en.gesture_config ?? {}) };
      if (action) {
        const entry: import("../types").GestureAction = { action };
        if (targetEntityId) entry.entity_id = targetEntityId;
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

  const changeTheme = (themeId: string) => {
    const target = themes.find(t => t.theme_id === themeId);
    if (target?.renderer_pack && !packsAgreed) {
      setPendingThemeId(themeId);
      setShowAgree(true);
      return;
    }
    applyTheme(themeId);
  };

  const confirmAgree = async () => {
    try {
      await api.packs.agree(true);
      setPacksAgreed(true);
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
          {grouped.map(g => {
            const e = g.primary;
            const domain = e.entity_id.split(".")[0];
            const isSelected = selectedEntityId === e.entity_id;
            const friendly = getEntityCache().find(c => c.entity_id === e.entity_id)?.friendly_name;
            return (
              <button
                key={e.entity_id}
                className={`entity-list-row${isSelected ? " selected" : ""}`}
                onClick={() => {
                  const next = isSelected ? null : e.entity_id;
                  setSelectedEntityId(next);
                  if (next && window.innerWidth <= 720) {
                    requestAnimationFrame(() => configPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
                  }
                }}
                aria-selected={isSelected}
                role="option"
                data-entity-id={e.entity_id}
                type="button"
              >
                <div className="widget-thumb" style={{ width: 24, height: 24 }}>
                  <Icon name={DOMAIN_ICON[domain] ?? "plug"} size={12} />
                </div>
                <div className="entity-list-id">
                  {friendly && friendly !== e.entity_id && <span className="entity-list-name">{friendly}</span>}
                  <span className="entity-list-eid mono">{e.entity_id}</span>
                </div>
                {e.alias && <span className="entity-list-alias mono">{e.alias}</span>}
                {canEdit && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(ev) => { ev.stopPropagation(); setConfirmRemove(e.entity_id); }}
                    onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.stopPropagation(); setConfirmRemove(e.entity_id); } }}
                    className="entity-list-delete"
                    aria-label={`Remove ${e.entity_id}`}
                  >
                    <Icon name="close" size={10} />
                  </span>
                )}
              </button>
            );
          })}
          {grouped.length === 0 && (
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
          <div ref={themeStripRef} className="theme-strip">
            {filteredThemes.map(t => (
              <button
                key={t.theme_id}
                className={`theme-strip-item${currentThemeId === t.theme_id ? " selected" : ""}`}
                onClick={() => changeTheme(t.theme_id)}
                type="button"
              >
                <div className="theme-thumb-wrap">
                  {thumbUrls[t.theme_id] ? (
                    <img className="theme-strip-thumb" src={thumbUrls[t.theme_id]} alt={t.name} draggable={false} />
                  ) : (
                    <div className="theme-strip-thumb" />
                  )}
                  {t.renderer_pack && (
                    <span className="theme-pack-star" title="Includes renderer pack">&#9733;</span>
                  )}
                </div>
                <span className="theme-strip-name">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

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

            {entityDetail[selectedEntity.entity_id] && (() => {
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

            <div className="entity-setting-row">
              <label className="entity-setting-label">Access</label>
              <div className="segmented-toggle" role="group" aria-label="Access level" style={{ marginLeft: "auto" }}>
                <button
                  className={selectedEntity.capabilities === "badge" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "badge"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "badge")}
                  disabled={!canEdit}
                  type="button"
                >Badge</button>
                <button
                  className={selectedEntity.capabilities === "read" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "read"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "read")}
                  disabled={!canEdit}
                  type="button"
                >Read only</button>
                <button
                  className={selectedEntity.capabilities === "read-write" ? "active" : ""}
                  aria-pressed={selectedEntity.capabilities === "read-write"}
                  onClick={() => toggleCap(selectedEntity.entity_id, "read-write")}
                  disabled={!canEdit}
                  type="button"
                >Control</button>
              </div>
            </div>

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

            {selectedEntity.capabilities === "badge" && (
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
                        aria-pressed={selectedEntity.display_hints?.badge_icon_color === name}
                        onClick={() => updateDisplayHint(selectedEntity.entity_id, "badge_icon_color", name)}
                        disabled={!canEdit}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                    ))}
                    <button
                      type="button"
                      className="badge-color-swatch-auto"
                      aria-pressed={!selectedEntity.display_hints?.badge_icon_color || selectedEntity.display_hints?.badge_icon_color === "auto"}
                      onClick={() => updateDisplayHint(selectedEntity.entity_id, "badge_icon_color", null)}
                      disabled={!canEdit}
                      title="Auto"
                    >(Auto)</button>
                  </div>
                </div>
              </div>
            )}

            {selectedEntity.capabilities !== "badge" && packSettings.includes("layout") && (
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

            {selectedEntity.capabilities !== "badge" && (
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
                      {selectedEntity.capabilities === "read-write" && (
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
                      placeholder="Add companion..."
                    />
                  )}
                </div>
              )}
            </div>
            )}

            {selectedEntity.capabilities !== "badge" && selectedDomain === "light" && (hasFeature(packCap, "light", "brightness") || hasFeature(packCap, "light", "color_temp") || hasFeature(packCap, "light", "rgb")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Light settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(packCap, "light", "brightness") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_brightness !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_brightness", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Brightness</span>
                    </label>
                  )}
                  {hasFeature(packCap, "light", "color_temp") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_color_temp !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_color_temp", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Color temp</span>
                    </label>
                  )}
                  {hasFeature(packCap, "light", "rgb") && (
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

            {selectedEntity.capabilities !== "badge" && selectedDomain === "fan" && (() => {
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
                    {hasFeature(packCap, "fan", "continuous") && <option value="continuous">Continuous</option>}
                    {hasFeature(packCap, "fan", "stepped") && <option value="stepped">Stepped</option>}
                    {hasFeature(packCap, "fan", "cycle") && <option value="cycle">Cycle</option>}
                  </select>
                </div>
              </div>
              );
            })()}

            {selectedEntity.capabilities !== "badge" && selectedDomain === "climate" && (hasFeature(packCap, "climate", "hvac_modes") || hasFeature(packCap, "climate", "presets") || hasFeature(packCap, "climate", "fan_mode") || hasFeature(packCap, "climate", "swing_mode")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Climate settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(packCap, "climate", "hvac_modes") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_hvac_modes !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_hvac_modes", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>HVAC modes</span>
                    </label>
                  )}
                  {hasFeature(packCap, "climate", "presets") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_presets !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_presets", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Presets</span>
                    </label>
                  )}
                  {hasFeature(packCap, "climate", "fan_mode") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_fan_mode !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_fan_mode", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Fan mode</span>
                    </label>
                  )}
                  {hasFeature(packCap, "climate", "swing_mode") && (
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

            {selectedEntity.capabilities !== "badge" && selectedDomain === "cover" && (hasFeature(packCap, "cover", "position") || hasFeature(packCap, "cover", "tilt")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Cover settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(packCap, "cover", "position") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_position !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_position", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Position slider</span>
                    </label>
                  )}
                  {hasFeature(packCap, "cover", "tilt") && (
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

            {selectedEntity.capabilities !== "badge" && selectedDomain === "media_player" && (hasFeature(packCap, "media_player", "transport") || hasFeature(packCap, "media_player", "volume") || hasFeature(packCap, "media_player", "source")) && (
              <div className="entity-setting-group">
                <div className="entity-setting-group-title">Media player settings</div>
                <div className="settings-toggle-grid">
                  {hasFeature(packCap, "media_player", "transport") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_transport !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_transport", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Transport</span>
                    </label>
                  )}
                  {hasFeature(packCap, "media_player", "volume") && (
                    <label className="settings-toggle-item">
                      <Toggle
                        checked={selectedEntity.display_hints?.show_volume !== false}
                        onChange={v => updateDisplayHint(selectedEntity.entity_id, "show_volume", v ? null : false)}
                        disabled={!canEdit}
                      />
                      <span>Volume</span>
                    </label>
                  )}
                  {hasFeature(packCap, "media_player", "source") && (
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

            {selectedEntity.capabilities !== "badge" && selectedDomain === "weather" && (
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

            {selectedEntity.capabilities !== "badge" && HISTORY_DOMAINS.has(selectedDomain) && (
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

            {selectedEntity.capabilities !== "badge" && selectedDomain === "input_number" && hasFeature(packCap, "input_number", "buttons") && (
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

            {selectedEntity.capabilities !== "badge" && (selectedDomain === "input_select" || selectedDomain === "select") && hasFeature(packCap, selectedDomain, "dropdown") && (
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

            {selectedEntity.capabilities !== "badge" && (
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

            {selectedEntity.capabilities !== "badge" && (
            <div className="entity-setting-group">
              <div className="entity-setting-group-title">Gestures</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {(["tap", "hold", "double_tap"] as const).map(gesture => {
                  const label = gesture === "double_tap" ? "Double-tap" : gesture.charAt(0).toUpperCase() + gesture.slice(1);
                  const gc = selectedEntity.gesture_config ?? {};
                  const currentAction = gc[gesture]?.action ?? "";
                  const currentTarget = gc[gesture]?.entity_id ?? "";
                  return (
                    <div key={gesture} style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "var(--ink-3)", minWidth: 68 }}>{label}</span>
                      <select
                        value={currentAction}
                        onChange={ev => {
                          const action = ev.target.value;
                          if (action === "trigger-action" && haActionEntities.length) {
                            updateGestureSetting(selectedEntity.entity_id, gesture, action, haActionEntities[0].entity_id);
                          } else {
                            updateGestureSetting(selectedEntity.entity_id, gesture, action);
                          }
                        }}
                        disabled={!canEdit}
                        className="input entity-graph-select"
                      >
                        <option value="">Default</option>
                        <option value="toggle">Toggle</option>
                        <option value="none">None (disable)</option>
                        {haActionEntities.length > 0 && <option value="trigger-action">Trigger action...</option>}
                      </select>
                      {currentAction === "trigger-action" && haActionEntities.length > 0 && (
                        <select
                          value={currentTarget}
                          onChange={ev => updateGestureSetting(selectedEntity.entity_id, gesture, "trigger-action", ev.target.value)}
                          disabled={!canEdit}
                          className="input entity-graph-select"
                          style={{ minWidth: 120 }}
                        >
                          {haActionEntities.map(ha => (
                            <option key={ha.entity_id} value={ha.entity_id}>
                              {ha.friendly_name || ha.entity_id.replace("harvest_action.", "")}
                            </option>
                          ))}
                        </select>
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

        {!selectedEntity && grouped.length > 0 && (
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
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="td-pack-agree-title" onClick={() => { setShowAgree(false); setAgreeText(""); setPendingThemeId(null); }}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3 id="td-pack-agree-title" className="dialog-title">Renderer Pack Warning</h3>
            <div className="dialog-body">
              <p>
                This theme includes a renderer pack that executes JavaScript from your HA instance
                inside the widget on the embedding page. Only enable themes with packs you trust.
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
              <button className="btn btn-ghost" onClick={() => { setShowAgree(false); setAgreeText(""); setPendingThemeId(null); }} type="button">
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
