/**
 * generate-widget-icons.js - Regenerates src/widgetIcons.ts from the widget
 * bundle's icon tables (widget/src/icons.js), so the panel can never drift
 * from what the widget actually ships. Runs as part of the frontend prebuild
 * (see package.json); the generated file stays committed so diffs catch
 * drift. Hand-written resolver logic lives in src/iconResolve.ts, not here.
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_JS_URL = new URL("../../widget/src/icons.js", import.meta.url);
const OUT_PATH = resolve(__dirname, "../src/widgetIcons.ts");

const { MDI_ICONS, ICON_VIEWBOXES } = await import(ICONS_JS_URL.href);

if (!MDI_ICONS || Object.keys(MDI_ICONS).length < 100) {
  throw new Error(
    `generate-widget-icons: MDI_ICONS import from ${ICONS_JS_URL} looks wrong ` +
    `(${Object.keys(MDI_ICONS ?? {}).length} entries)`,
  );
}

function tsRecord(obj) {
  const lines = Object.entries(obj).map(
    ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  );
  return `{\n${lines.join("\n")}\n}`;
}

const out =
  `/**\n` +
  ` * widgetIcons.ts - GENERATED FILE, do not edit.\n` +
  ` *\n` +
  ` * Regenerated from widget/src/icons.js by scripts/generate-widget-icons.js\n` +
  ` * during the frontend prebuild. To add or change an icon, edit\n` +
  ` * widget/src/icons.js and run the build. Resolver logic (domain fallbacks,\n` +
  ` * resolveEntityIcon, icon-set lookups) lives in src/iconResolve.ts.\n` +
  ` */\n\n` +
  `/** MDI icon path data bundled in the widget (${Object.keys(MDI_ICONS).length} icons). */\n` +
  `export const WIDGET_ICONS: Record<string, string> = ${tsRecord(MDI_ICONS)};\n\n` +
  `/** Per-icon viewBox overrides; icons absent here use "0 0 24 24". */\n` +
  `export const WIDGET_ICON_VIEWBOX: Record<string, string> = ${tsRecord(ICON_VIEWBOXES)};\n\n` +
  `export const WIDGET_ICON_NAMES = Object.keys(WIDGET_ICONS).sort();\n`;

writeFileSync(OUT_PATH, out);
console.log(
  `generate-widget-icons: wrote ${OUT_PATH.replace(resolve(__dirname, ".."), "frontend")} ` +
  `(${Object.keys(MDI_ICONS).length} icons)`,
);
