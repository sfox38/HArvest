/**
 * EntityPreview.tsx - Live preview of an entity card inside TokenDetail.
 *
 * Used in the entity-config drawer to show how the chosen entity, capabilities,
 * companions, and theme combine. Builds the entity definition server-side via
 * api.entities.getDefinition() so the preview matches what the widget will
 * render on a real page.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import type { Token, ThemeDefinition, HAEntityDetail } from "../types";
import { api } from "../api";
import { Spinner } from "./Shared";
import { loadWidgetScript, loadPackScript, isPackLoaded, generateMockHistory } from "./WidgetPreview";

const _MOCK_WEATHER_FORECAST_DAILY = [
  { datetime: "2025-06-10T12:00:00", condition: "sunny",        temperature: 27, templow: 18 },
  { datetime: "2025-06-11T12:00:00", condition: "partlycloudy", temperature: 24, templow: 16 },
  { datetime: "2025-06-12T12:00:00", condition: "rainy",        temperature: 19, templow: 13 },
  { datetime: "2025-06-13T12:00:00", condition: "cloudy",       temperature: 21, templow: 14 },
  { datetime: "2025-06-14T12:00:00", condition: "sunny",        temperature: 26, templow: 17 },
];
const _MOCK_WEATHER_FORECAST_HOURLY = [
  { datetime: "2025-06-10T08:00:00", condition: "sunny",        temperature: 20 },
  { datetime: "2025-06-10T09:00:00", condition: "sunny",        temperature: 21 },
  { datetime: "2025-06-10T10:00:00", condition: "partlycloudy", temperature: 23 },
  { datetime: "2025-06-10T11:00:00", condition: "partlycloudy", temperature: 24 },
  { datetime: "2025-06-10T12:00:00", condition: "cloudy",       temperature: 25 },
  { datetime: "2025-06-10T13:00:00", condition: "cloudy",       temperature: 26 },
  { datetime: "2025-06-10T14:00:00", condition: "partlycloudy", temperature: 26 },
  { datetime: "2025-06-10T15:00:00", condition: "sunny",        temperature: 25 },
];

export function EntityPreview({
  entity,
  entityAccess,
  theme,
  companions = [],
}: {
  entity: HAEntityDetail;
  entityAccess: Token["entities"][number];
  theme: ThemeDefinition | null;
  companions?: Token["entities"][number][];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [serverDef, setServerDef] = useState<{ definition: Record<string, unknown>; state: string; attributes: Record<string, unknown> } | null>(null);
  const packId = theme?.renderer_pack ? theme.theme_id : undefined;

  useEffect(() => {
    if (packId && !isPackLoaded(packId)) setReady(false);
    loadWidgetScript()
      .then(() => packId ? loadPackScript(packId) : Promise.resolve())
      .then(() => setReady(true))
      .catch(() => setLoadError(true));
  }, [packId]);

  const entityAccessJson = useMemo(() => JSON.stringify(entityAccess), [entityAccess.capabilities, entityAccess.name_override, entityAccess.icon_override, entityAccess.color_scheme, entityAccess.exclude_attributes, entityAccess.display_hints, entityAccess.gesture_config]);
  const defKey = `${entity.entity_id}:${entityAccessJson}:${companions.map(c => `${c.entity_id}:${c.capabilities}`).join(",")}`;
  useEffect(() => {
    let cancelled = false;
    api.entities.getDefinition(entity.entity_id, {
      capabilities: entityAccess.capabilities,
      name_override: entityAccess.name_override ?? undefined,
      icon_override: entityAccess.icon_override ?? undefined,
      color_scheme: entityAccess.color_scheme ?? undefined,
      exclude_attributes: entityAccess.exclude_attributes ?? undefined,
      display_hints: entityAccess.display_hints ?? undefined,
      gesture_config: (entityAccess.gesture_config ?? undefined) as Record<string, unknown> | undefined,
      companion_ids: companions.map(c => c.entity_id),
    }).then(result => {
      if (!cancelled) setServerDef(result);
    }).catch(() => {
      if (!cancelled) setServerDef(null);
    });
    return () => { cancelled = true; };
  }, [defKey]);

  const themeObj = useMemo(() => {
    if (!theme) return { variables: {}, dark_variables: {} };
    return { variables: theme.variables ?? {}, dark_variables: theme.dark_variables ?? {} };
  }, [theme?.theme_id]);

  const cardKey = `${entity.entity_id}:${entity.state}:${defKey}:${theme?.theme_id ?? ""}`;
  const themeJson = useMemo(() => JSON.stringify(themeObj), [themeObj]);

  useEffect(() => {
    if (!ready || !serverDef || !containerRef.current || !window.HArvest) return;
    const container = containerRef.current;
    container.innerHTML = "";
    cardRef.current = null;
    const domain = entity.entity_id.split(".")[0];
    const entityDef: Record<string, unknown> = { ...serverDef.definition, capabilities: entityAccess.capabilities };

    entityDef.preview_companions = companions.map(c => ({
      entity_id: c.entity_id,
      capabilities: c.capabilities,
      domain: c.entity_id.split(".")[0],
    }));

    let attrs: Record<string, unknown>;
    let previewState = serverDef.state;

    if (domain === "weather") {
      previewState = "partlycloudy";
      const showForecast = entityAccess.display_hints?.show_forecast === true;
      attrs = {
        temperature: 22, temperature_unit: "°C",
        humidity: 65,
        wind_speed: 15, wind_speed_unit: "km/h",
        pressure: 1013, pressure_unit: "hPa",
        ...(showForecast ? {
          forecast_daily: _MOCK_WEATHER_FORECAST_DAILY,
          forecast: _MOCK_WEATHER_FORECAST_DAILY,
          forecast_hourly: _MOCK_WEATHER_FORECAST_HOURLY,
        } : {}),
      };
    } else {
      attrs = serverDef.attributes;
    }

    const graphType = (entityAccess.display_hints?.graph as string) ?? null;
    const opts: Record<string, unknown> = {};
    if (packId) opts.packId = packId;
    if (graphType && graphType !== "none") {
      opts.graph = graphType;
      opts.hours = 24;
      opts.historyData = generateMockHistory(domain, graphType as "line" | "bar" | "step", entity.state);
    }

    const card = window.HArvest!.preview(
      container, entityDef, previewState, attrs, themeObj as any,
      Object.keys(opts).length ? opts as never : undefined,
    );
    cardRef.current = card;

    for (const c of companions) {
      api.entities.getDefinition(c.entity_id, { capabilities: c.capabilities }).then(result => {
        const el = cardRef.current as HTMLElement & { _receiveCompanionDefinition?: (id: string, def: Record<string, unknown>) => void; _receiveCompanionState?: (id: string, s: string, a: Record<string, unknown>) => void } | null;
        if (!el) return;
        el._receiveCompanionDefinition?.(c.entity_id, result.definition);
        el._receiveCompanionState?.(c.entity_id, result.state, result.attributes);
      }).catch(() => {});
    }

    return () => { container.innerHTML = ""; cardRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, cardKey, serverDef, themeJson]);

  if (loadError) return <div className="muted" style={{ fontSize: 12, padding: "8px 0" }}>Preview unavailable.</div>;
  return (
    <>
      {(!ready || !serverDef) && <div style={{ display: "flex", justifyContent: "center", padding: 12 }}><Spinner size={20} /></div>}
      <div ref={containerRef} className="theme-preview-widget" role="region" aria-label="Entity preview" style={{ display: ready && serverDef ? "flex" : "none", justifyContent: "center", alignItems: "center", minHeight: 100, padding: "12px 0", maxWidth: 360, margin: "0 auto" }} />
    </>
  );
}
