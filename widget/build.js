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
const PACKS = [
  { entry: resolve(__dirname, "src/packs/minimus-pack.js"), out: resolve(__dirname, "../custom_components/harvest/packs/minimus.js") },
  { entry: resolve(__dirname, "src/packs/shrooms-pack.js"), out: resolve(__dirname, "../custom_components/harvest/packs/shrooms.js") },
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

// Post-build copy destinations for pack files.
const PACK_COPIES = [];

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

  // Build renderer packs
  for (const pack of PACKS) {
    const packResult = await esbuild.build({
      entryPoints: [pack.entry],
      bundle:      false,
      minify:      true,
      format:      "iife",
      target:      ["es2020"],
      charset:     "utf8",
      write:       false,
      logLevel:    "info",
    });

    if (packResult.errors.length > 0) {
      console.error("Pack build failed:", packResult.errors);
      process.exit(1);
    }

    const packBytes = packResult.outputFiles[0].contents;
    writeFileSync(pack.out, packBytes);

    for (const dest of PACK_COPIES) {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(pack.out, dest);
    }

    const name = pack.out.split("/").pop();
    const pkb = (packBytes.byteLength / 1024).toFixed(1);
    console.log(`Pack: ${pkb} KB  packs/${name}`);
  }
}

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await build();
}
