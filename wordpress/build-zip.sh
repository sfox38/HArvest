#!/usr/bin/env bash
# Build wordpress/harvest.zip from a strict allowlist of runtime files.
#
# Why this script exists:
#   The shipped zip used to be hand-assembled and accumulated 1,900+ dev-only
#   files inside vendor/ (PHPUnit, sebastian/*, prophecy, etc.) plus
#   composer.{json,lock}, phpunit.xml, tests/, .DS_Store, and similar cruft.
#   This script always produces a clean zip containing only the runtime paths
#   the WordPress plugin actually needs, wrapped inside the canonical
#   `harvest/` top-level directory that WordPress expects.
#
# Layout produced:
#   harvest.zip
#     harvest/
#       harvest.php
#       uninstall.php
#       includes/*.php
#       languages/harvest.pot
#
# Note: as of plugin v1.9.0 the widget bundle is no longer shipped inside the
# plugin zip. The WordPress plugin always loads it from the integration's
# /harvest_assets/harvest.min.js static path (SPEC.md Section 12), so the
# previous assets/harvest.min.js shipment served no real purpose. Dropping
# it removes ~150 KB and one cross-module dependency.

set -euo pipefail

WP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WP_DIR"

ZIP_PATH="$WP_DIR/harvest.zip"

# Stage the runtime files inside a `harvest/` directory so the zip extracts
# to wp-content/plugins/harvest/ when uploaded through WordPress admin.
STAGE="$(mktemp -d -t harvest-zip.XXXXXX)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/harvest"
cp "$WP_DIR/harvest.php"   "$STAGE/harvest/"
cp "$WP_DIR/uninstall.php" "$STAGE/harvest/"
cp -R "$WP_DIR/includes"   "$STAGE/harvest/"
cp -R "$WP_DIR/languages"  "$STAGE/harvest/"

# Build the zip from the staged tree. The excludes are belt-and-braces against
# any cruft that crept into the source dirs (editor backups, OS metadata).
rm -f "$ZIP_PATH"
( cd "$STAGE" && zip -r -X "$ZIP_PATH" harvest \
    --exclude "*/.DS_Store" \
    --exclude "*/__MACOSX/*" \
    --exclude "*/tests/*" \
    --exclude "*/vendor/*" \
    --exclude "*.bak" \
    --exclude "*.swp" \
    --exclude "*.orig" \
    --exclude "*.zip" >/dev/null )

# Sanity report.
SIZE=$(stat -f '%z' "$ZIP_PATH" 2>/dev/null || stat -c '%s' "$ZIP_PATH")
COUNT=$(unzip -l "$ZIP_PATH" | tail -1 | awk '{print $2}')
echo "Built $ZIP_PATH"
echo "  size:  $((SIZE / 1024)) KB"
echo "  files: $COUNT"
echo
echo "Contents:"
unzip -l "$ZIP_PATH" | awk 'NR>3 && $1 ~ /^[0-9]+$/ {printf "  %8s  %s\n", $1, $4}'
