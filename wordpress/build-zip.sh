#!/usr/bin/env bash
# Build wordpress/harvest.zip from a strict allowlist of runtime files.
#
# Why this script exists:
#   The shipped zip used to be hand-assembled and accumulated 1,900+ dev-only
#   files inside vendor/ (PHPUnit, sebastian/*, prophecy, etc.) plus
#   composer.{json,lock}, phpunit.xml, tests/, .DS_Store, and similar cruft.
#   This script always produces a clean zip containing only the eight runtime
#   paths the WordPress plugin actually needs, wrapped inside the canonical
#   `harvest/` top-level directory that WordPress expects.
#
# Layout produced:
#   harvest.zip
#     harvest/
#       harvest.php
#       uninstall.php
#       includes/*.php
#       assets/harvest.min.js
#       languages/harvest.pot
#
# Staleness guard:
#   assets/harvest.min.js must be at least as new as every file under
#   widget/src/. If a source file is newer the script aborts. Run
#   `node widget/build.js` to rebuild the bundle, then re-run this script.

set -euo pipefail

WP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$WP_DIR/.." && pwd)"
cd "$WP_DIR"

BUNDLE="$WP_DIR/assets/harvest.min.js"
ZIP_PATH="$WP_DIR/harvest.zip"

if [ ! -f "$BUNDLE" ]; then
    echo "ERROR: $BUNDLE is missing." >&2
    echo "Run 'node widget/build.js' first to produce the widget bundle." >&2
    exit 1
fi

# Staleness check: any file under widget/src/ that is newer than the bundle
# means the bundle would ship outdated JS. -newer is POSIX-portable.
NEWER=$(find "$REPO_ROOT/widget/src" -type f -name '*.js' -newer "$BUNDLE" 2>/dev/null | head -5)
if [ -n "$NEWER" ]; then
    echo "ERROR: widget bundle is older than source files:" >&2
    echo "$NEWER" | sed 's|^|  |' >&2
    echo "  bundle: $BUNDLE" >&2
    echo "Run 'node widget/build.js' to rebuild, then re-run this script." >&2
    exit 1
fi

# Stage the runtime files inside a `harvest/` directory so the zip extracts
# to wp-content/plugins/harvest/ when uploaded through WordPress admin.
STAGE="$(mktemp -d -t harvest-zip.XXXXXX)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/harvest"
cp "$WP_DIR/harvest.php"   "$STAGE/harvest/"
cp "$WP_DIR/uninstall.php" "$STAGE/harvest/"
cp -R "$WP_DIR/includes"   "$STAGE/harvest/"
cp -R "$WP_DIR/assets"     "$STAGE/harvest/"
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
