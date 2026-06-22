/**
 * buildWatcher.ts - pure decision logic for the panel build-version watcher.
 *
 * The panel checks panel_version.txt against the build number baked into the
 * running bundle and reloads to pick up a new build. panel.js is served with
 * no-cache + ETag, so a reload normally revalidates and fetches the fresh
 * bundle. decideBuildReload still reloads at most once per target version as a
 * safety net: if some layer (a stale proxy, a half-written deploy) keeps
 * serving an old bundle while panel_version.txt has advanced, we reload once
 * and then stop instead of looping. It is isolated here so it can be
 * unit-tested without main.tsx's side effects.
 */

export type ReloadDecision = "ignore" | "up-to-date" | "reload" | "skip-loop";

/**
 * Decide what the build watcher should do.
 *
 * @param latest      build number from panel_version.txt (NaN if unparseable)
 * @param current     build number baked into the running bundle
 * @param priorTarget version we already reloaded toward this tab session, or null
 */
export function decideBuildReload(
  latest: number,
  current: number,
  priorTarget: string | null,
): ReloadDecision {
  if (Number.isNaN(latest)) return "ignore";
  if (latest === current) return "up-to-date";
  // Already reloaded once for this target and still stale: some caching layer
  // is still serving an old bundle, so reloading again would just loop.
  if (priorTarget === String(latest)) return "skip-loop";
  return "reload";
}
