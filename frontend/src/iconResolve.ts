/**
 * iconResolve.ts - Icon resolution for the panel, mirroring the widget's
 * icons.js lookup behaviour. The generated tables live in widgetIcons.ts
 * (do not edit that file); this module holds the hand-written logic:
 * per-domain fallbacks, resolveEntityIcon(), and getIconEntry(), which also
 * consults icon sets registered on window.HArvest (fa, ph, tabler) once
 * their lazy assets have loaded.
 */

import { WIDGET_ICONS, WIDGET_ICON_VIEWBOX } from "./widgetIcons";

export interface IconEntry {
  body: string;
  viewBox: string;
}

interface HarvestIconSet {
  icons: Record<string, IconEntry>;
  aliases: Record<string, string>;
}

/**
 * Renderer fallback icons per domain. Mirrors the widget renderers' defaults
 * (base-card _DOMAIN_FALLBACK plus the per-renderer neutral-state defaults).
 * Used when an entity's resolved icon is not available, so panel lists
 * fall back exactly like the card does.
 */
export const DOMAIN_FALLBACK_ICON: Record<string, string> = {
  light:          "mdi:lightbulb-outline",
  switch:         "mdi:toggle-switch-off-outline",
  input_boolean:  "mdi:toggle-switch-off-outline",
  binary_sensor:  "mdi:radiobox-blank",
  sensor:         "mdi:gauge",
  fan:            "mdi:fan-off",
  climate:        "mdi:thermostat",
  cover:          "mdi:window-shutter",
  media_player:   "mdi:cast",
  input_number:   "mdi:numeric",
  number:         "mdi:numeric",
  input_select:   "mdi:format-list-bulleted",
  select:         "mdi:format-list-bulleted",
  remote:         "mdi:remote",
  timer:          "mdi:timer-outline",
  lock:           "mdi:lock",
  person:         "mdi:account",
  button:         "mdi:gesture-tap-button",
  input_button:   "mdi:gesture-tap-button",
  script:         "mdi:script-text-play",
  automation:     "mdi:robot-off",
  weather:        "mdi:weather-cloudy",
};

/**
 * Resolve an icon name to { body, viewBox } or null. mdi: names come from
 * the generated widget tables; any other prefix is looked up in the icon
 * sets registered on window.HArvest (direct entry first, then one hop
 * through the set's aliases). Mirrors the widget's _lookup().
 */
export function getIconEntry(name: string | null | undefined): IconEntry | null {
  if (!name) return null;
  const d = WIDGET_ICONS[name];
  if (d !== undefined) {
    return {
      body: `<path d="${d}" fill="currentColor"/>`,
      viewBox: WIDGET_ICON_VIEWBOX[name] ?? "0 0 24 24",
    };
  }
  const sep = name.indexOf(":");
  if (sep <= 0) return null;
  const getIconSet = (window as unknown as {
    HArvest?: { getIconSet?: (key: string) => HarvestIconSet | undefined };
  }).HArvest?.getIconSet;
  const set = getIconSet?.(name.slice(0, sep));
  if (!set) return null;
  let entry = set.icons[name];
  if (!entry) {
    const target = set.aliases[name];
    if (target) entry = set.icons[target];
  }
  return entry ?? null;
}

/**
 * Resolve the icon a widget card shows by default for an entity: the
 * server-resolved icon (or per-entity override) when it is available,
 * otherwise the renderer's domain fallback. Mirrors the widget's
 * resolveIcon(), which treats mdi:help-circle (the server's unknown-domain
 * fallback) as unresolved so Tier 2 domains land on GenericCard's mdi:eye
 * default instead of a (?). Prefixed overrides (fa:, ph:, tabler:) resolve
 * once their set's lazy asset has loaded and fall back to the domain icon
 * until then - the same upgrade behaviour as the live card.
 */
export function resolveEntityIcon(domain: string, icon?: string | null): string {
  if (icon && icon !== "mdi:help-circle" && getIconEntry(icon)) return icon;
  return DOMAIN_FALLBACK_ICON[domain] ?? "mdi:eye";
}
