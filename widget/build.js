/**
 * build.js - HArvest widget build script.
 *
 * Bundles all widget source files into two output files:
 *   dist/harvest.min.js              - stable alias, always latest build
 *   dist/harvest.min.{hash}.js       - content-addressed, changes only when
 *                                      content changes (for cache-busting)
 *
 * Both files are committed to the repository so HACS users and jsDelivr
 * consumers do not need a build toolchain. Only the current hashed file is
 * kept in the working tree; previous hashed builds are removed at the start
 * of each build to prevent dist/ growing without bound. Anyone needing a
 * specific historical hash retrieves it via git history or jsDelivr's
 * tag/commit resolution (e.g. cdn.jsdelivr.net/gh/sfox38/HArvest@{ref}/...).
 *
 * Build steps:
 *   1. Remove any stale dist/harvest.min.{hash}.js files (keeping the
 *      stable harvest.min.js).
 *   2. Bundle src/harvest-entry.js with esbuild (ESM -> IIFE, minified)
 *   3. Compute a short content hash from the output bytes
 *   4. Write dist/harvest.min.{hash}.js
 *   5. Write dist/harvest.min.js (identical content, stable filename)
 *
 * Run:  node build.js
 * Watch: node build.js --watch
 */

import * as esbuild from "esbuild";
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync, copyFileSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ENTRY = resolve(__dirname, "src/harvest-entry.js");
const DIST_DIR  = resolve(__dirname, "dist");

// Read PLATFORM_VERSION and PROTOCOL_VERSION from the integration's const.py
// so the widget bundle reports the same version the server is running. This
// is what powers the client/server compatibility handshake (SPEC.md Section
// 12) - the widget sends `client.widget` and `client.protocol` in its auth
// payload and the server compares them to its own constants. Reading from
// const.py here guarantees they match at any given release without manual
// version bumping in widget/version.js.
const CONST_PY_PATH = resolve(__dirname, "../custom_components/harvest/const.py");
function readVersionConstants() {
  const text = readFileSync(CONST_PY_PATH, "utf8");
  const platform = text.match(/^PLATFORM_VERSION\s*=\s*"([^"]+)"/m);
  const protocol = text.match(/^PROTOCOL_VERSION\s*=\s*(\d+)/m);
  if (!platform || !protocol) {
    throw new Error(
      `build.js: failed to parse PLATFORM_VERSION / PROTOCOL_VERSION from ${CONST_PY_PATH}. ` +
      `These constants drive the compatibility handshake; the widget cannot be built without them.`
    );
  }
  return { widget: platform[1], protocol: parseInt(protocol[1], 10) };
}
const RENDERERS = [
  { entry: resolve(__dirname, "src/renderers/minimus-renderer.js"), out: resolve(__dirname, "../custom_components/harvest/renderers/minimus.js") },
  { entry: resolve(__dirname, "src/renderers/shrooms-renderer.js"), out: resolve(__dirname, "../custom_components/harvest/renderers/shrooms.js") },
];

// Post-build copy destinations for the widget bundle.
//
// As of plugin v1.9.0 the WordPress plugin no longer ships its own copy of
// harvest.min.js (SPEC.md Section 12, "HA-served" widget script source); the
// plugin loads the bundle from the integration's /harvest_assets/ static
// path instead. So the only consumer of this copy is the integration's panel
// directory, which already serves the bundle at /harvest_assets/.
const WIDGET_COPIES = [
  resolve(__dirname, "../custom_components/harvest/panel/harvest.min.js"),
];

// Post-build copy destinations for renderer files.
const RENDERER_COPIES = [];

// ---------------------------------------------------------------------------
// Icon sets
//
// Each entry builds dist/icon-sets/<prefix>.js (copied into the integration's
// panel/icon-sets/ so /harvest_assets serves it). Only the icons named in the
// committed curated map (widget/icon-maps/<prefix>.json, produced by the
// offline curation tooling) are shipped - a subset of the full set, sized to
// HArvest's bundled MDI icons. Phosphor expands each curated regular-weight
// name into every weight present in the package (Phosphor publishes all
// icons in all weights, so the regular-name curation covers them).
// ---------------------------------------------------------------------------
const PH_WEIGHT_SUFFIXES = ["-thin", "-light", "-bold", "-fill", "-duotone"];
const ICON_SET_BUILDS = [
  { prefix: "fa", pkg: "@iconify-json/fa7-solid", map: "icon-maps/fa.json" },
  { prefix: "ph", pkg: "@iconify-json/ph", map: "icon-maps/ph.json", expandSuffixes: PH_WEIGHT_SUFFIXES },
  { prefix: "tabler", pkg: "@iconify-json/tabler", map: "icon-maps/tabler.json" },
];
const ICON_SET_DIST = resolve(DIST_DIR, "icon-sets");
const ICON_SET_COPY_DIR = resolve(__dirname, "../custom_components/harvest/panel/icon-sets");

const isWatch = process.argv.includes("--watch");

const versions = readVersionConstants();

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  entryPoints: [SRC_ENTRY],
  bundle:      true,
  minify:      true,
  format:      "iife",
  target:      ["es2020"],
  charset:     "utf8",
  // Tree-shake unused renderer exports.
  treeShaking: true,
  write:       false,  // we handle writing ourselves for hash computation
  logLevel:    "info",
  // Build-time constant injection for the compatibility handshake. The
  // identifiers below appear in widget/src/version.js and are replaced
  // verbatim at bundle time (esbuild's `define` works on identifiers, so
  // the placeholders MUST be unique tokens that don't collide with any
  // real variable name).
  define: {
    __HRV_WIDGET_VERSION__: JSON.stringify(versions.widget),
    __HRV_PROTOCOL_VERSION__: String(versions.protocol),
  },
};

/**
 * Remove all dist/harvest.min.{hash}.js files. The stable harvest.min.js is
 * preserved. Pattern matches exactly 8 lowercase hex characters between the
 * dots so we never accidentally delete the stable name.
 */
function cleanStaleHashes() {
  const hashedRe = /^harvest\.min\.[0-9a-f]{8}\.js$/;
  let entries;
  try {
    entries = readdirSync(DIST_DIR);
  } catch {
    return; // dist dir not yet created
  }
  for (const name of entries) {
    if (hashedRe.test(name)) {
      unlinkSync(resolve(DIST_DIR, name));
    }
  }
}

async function build() {
  cleanStaleHashes();

  const result = await esbuild.build(buildOptions);

  if (result.errors.length > 0) {
    console.error("Build failed:", result.errors);
    process.exit(1);
  }

  const outputBytes = result.outputFiles[0].contents;

  // Compute 8-character content hash (first 8 hex chars of SHA-256).
  const hash = createHash("sha256")
    .update(outputBytes)
    .digest("hex")
    .slice(0, 8);

  const hashedPath = resolve(DIST_DIR, `harvest.min.${hash}.js`);
  const stablePath = resolve(DIST_DIR, "harvest.min.js");

  writeFileSync(hashedPath, outputBytes);
  writeFileSync(stablePath, outputBytes);

  for (const dest of WIDGET_COPIES) {
    copyFileSync(stablePath, dest);
  }

  const kb = (outputBytes.byteLength / 1024).toFixed(1);
  console.log(`Built ${kb} KB`);
  console.log(`  dist/harvest.min.${hash}.js`);
  console.log(`  dist/harvest.min.js`);
  for (const dest of WIDGET_COPIES) {
    console.log(`  -> ${dest.replace(resolve(__dirname, ".."), "..")}`);
  }

  // Build renderer overrides
  for (const renderer of RENDERERS) {
    const rendererResult = await esbuild.build({
      entryPoints: [renderer.entry],
      bundle:      false,
      minify:      true,
      format:      "iife",
      target:      ["es2020"],
      charset:     "utf8",
      write:       false,
      logLevel:    "info",
    });

    if (rendererResult.errors.length > 0) {
      console.error("Renderer build failed:", rendererResult.errors);
      process.exit(1);
    }

    const rendererBytes = rendererResult.outputFiles[0].contents;
    writeFileSync(renderer.out, rendererBytes);

    for (const dest of RENDERER_COPIES) {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(renderer.out, dest);
    }

    const name = renderer.out.split("/").pop();
    const rkb = (rendererBytes.byteLength / 1024).toFixed(1);
    console.log(`Renderer: ${rkb} KB  renderers/${name}`);
  }

  await buildIconSets();
}

/**
 * Resolve an Iconify icon entry to { body, viewBox } using the set's
 * default dimensions for icons that do not override them.
 */
function iconifyEntry(data, name) {
  const info = data.icons[name];
  if (!info || info.hidden) return null;
  const left = info.left ?? data.left ?? 0;
  const top = info.top ?? data.top ?? 0;
  const w = info.width ?? data.width ?? 16;
  const h = info.height ?? data.height ?? 16;
  return { body: info.body, viewBox: `${left} ${top} ${w} ${h}` };
}

/**
 * Generate dist/icon-sets/<prefix>.js for every configured set and copy each
 * into the integration's panel/icon-sets/ directory. Hard-fails when a
 * curated map references an icon the pinned package does not contain, so
 * package or map drift breaks the build loudly instead of shipping holes.
 */
async function buildIconSets() {
  // Drift guard input: bundled MDI names should all appear in each map.
  const { MDI_ICONS } = await import("./src/icons.js");
  const bundledNames = Object.keys(MDI_ICONS);

  mkdirSync(ICON_SET_DIST, { recursive: true });
  mkdirSync(ICON_SET_COPY_DIR, { recursive: true });

  for (const setBuild of ICON_SET_BUILDS) {
    const mapPath = resolve(__dirname, setBuild.map);
    const map = JSON.parse(readFileSync(mapPath, "utf8"));
    const data = JSON.parse(readFileSync(
      resolve(__dirname, "node_modules", setBuild.pkg, "icons.json"), "utf8"));
    const pkgMeta = JSON.parse(readFileSync(
      resolve(__dirname, "node_modules", setBuild.pkg, "package.json"), "utf8"));
    const setInfo = JSON.parse(readFileSync(
      resolve(__dirname, "node_modules", setBuild.pkg, "info.json"), "utf8"));

    for (const mdiName of bundledNames) {
      if (!(mdiName in map)) {
        console.warn(
          `Icon set ${setBuild.prefix}: bundled icon "${mdiName}" has no entry in ` +
          `${setBuild.map} (new icon needs a curation pass)`);
      }
    }

    const icons = {};
    const aliases = {};
    for (const [mdiName, target] of Object.entries(map)) {
      if (target === null) continue; // curated no-equivalent; MDI shows instead
      const expectedPrefix = `${setBuild.prefix}:`;
      if (!target.startsWith(expectedPrefix)) {
        throw new Error(
          `Icon set ${setBuild.prefix}: map entry ${mdiName} -> ${target} does not ` +
          `use the "${expectedPrefix}" prefix`);
      }
      const baseName = target.slice(expectedPrefix.length);
      const entry = iconifyEntry(data, baseName);
      if (!entry) {
        throw new Error(
          `Icon set ${setBuild.prefix}: "${baseName}" (mapped from ${mdiName}) is not ` +
          `in ${setBuild.pkg}@${pkgMeta.version}`);
      }
      icons[target] = entry;
      aliases[mdiName] = target;
      for (const suffix of setBuild.expandSuffixes ?? []) {
        const weightName = `${baseName}${suffix}`;
        const weightEntry = iconifyEntry(data, weightName);
        if (weightEntry) {
          icons[`${expectedPrefix}${weightName}`] = weightEntry;
        }
      }
    }

    const license = setInfo.license ?? {};
    const header =
      `/*!\n` +
      ` * HArvest icon set "${setBuild.prefix}" - curated subset of ${setInfo.name}\n` +
      ` * Source: ${setBuild.pkg}@${pkgMeta.version} (packaged via Iconify, https://iconify.design)\n` +
      ` * Icon license: ${license.title ?? "see package"}${license.url ? ` - ${license.url}` : ""}\n` +
      ` * This header is a license attribution notice. Do not remove.\n` +
      ` */\n`;
    const payload = JSON.stringify({ icons, aliases });
    const js =
      header +
      `(function(){` +
      `if(!window.HArvest||!window.HArvest.registerIconSet){` +
      `console.warn("[HArvest] icon set '${setBuild.prefix}' loaded before harvest.min.js; ignored");` +
      `return;}` +
      `window.HArvest.registerIconSet(${JSON.stringify(setBuild.prefix)},${payload});` +
      `})();\n`;

    const distPath = resolve(ICON_SET_DIST, `${setBuild.prefix}.js`);
    const copyPath = resolve(ICON_SET_COPY_DIR, `${setBuild.prefix}.js`);
    writeFileSync(distPath, js);
    copyFileSync(distPath, copyPath);
    const ikb = (Buffer.byteLength(js) / 1024).toFixed(1);
    console.log(
      `Icon set: ${ikb} KB  icon-sets/${setBuild.prefix}.js ` +
      `(${Object.keys(icons).length} icons, ${Object.keys(aliases).length} aliases)`);
  }
}

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await build();
}
