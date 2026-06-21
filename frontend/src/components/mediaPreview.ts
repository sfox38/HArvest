/**
 * mediaPreview.ts - Shared media_player preview behaviour.
 *
 * All three preview surfaces (themes-panel WidgetPreview, the token Wizard, and
 * the TokenDetail EntityPreview) use this so a media_player card behaves the
 * same everywhere:
 *
 *   - When a real media player is actively playing/paused with media, the live
 *     attributes drive the card.
 *   - Otherwise the demo "now playing" mock drives it, so the preview always
 *     shows album art, a title, and a progress bar instead of a bare idle icon.
 *   - The live state is polled so the preview tracks the player (song change,
 *     play/pause, seek) without the user touching the card config.
 */

import { useEffect } from "react";
import { api } from "../api";

/**
 * Single source of truth for the demo "now playing" used as the media_player
 * preview fallback. WidgetPreview's MOCK_ENTITIES.media_player reuses these so
 * the mock and the live-fallback never drift apart.
 */
export const MEDIA_PREVIEW_MOCK_ATTRS: Record<string, unknown> = {
  media_title: "Diving in a Sea of Light",
  media_artist: "Secret Friend",
  entity_picture: "/harvest_assets/mock_album_art.jpg",
  volume_level: 0.7,
  source: "Spotify",
  source_list: ["Spotify", "AirPlay", "Bluetooth"],
  media_duration: 237,
  media_position: 42,
};

/** A media player is "active" when it is playing/paused with real media loaded. */
export function isMediaActive(state: string, attrs: Record<string, unknown>): boolean {
  return (state === "playing" || state === "paused")
    && (!!attrs.media_title || !!attrs.entity_picture);
}

/**
 * Resolve the {state, attributes} a media_player preview should render: the
 * live data when the player is active, otherwise the demo mock (with a fresh
 * position timestamp so the progress bar starts mid-track and advances).
 */
export function mediaPreviewState(
  state: string,
  attrs: Record<string, unknown>,
): { state: string; attributes: Record<string, unknown> } {
  if (isMediaActive(state, attrs)) return { state, attributes: attrs };
  return {
    state: "playing",
    attributes: { ...MEDIA_PREVIEW_MOCK_ATTRS, media_position_updated_at: new Date().toISOString() },
  };
}

/**
 * Poll a real media_player's live state every few seconds and push it (or the
 * mock fallback) into an already-rendered preview card via updatePreviewState.
 * No-op for non-media domains or when there is no real entity to poll.
 *
 * @param entityId  real entity id, or null when previewing a pure mock
 * @param domain    entity domain
 * @param ready     whether the card has been created
 * @param cardRef   ref to the rendered <hrv-card>
 */
export function useMediaPreviewPoll(
  entityId: string | null,
  domain: string,
  ready: boolean,
  cardRef: { current: HTMLElement | null },
): void {
  useEffect(() => {
    if (!ready || domain !== "media_player" || !entityId) return;
    let cancelled = false;
    const push = (state: string, attrs: Record<string, unknown>) => {
      const card = cardRef.current as (HTMLElement & {
        updatePreviewState?: (s: string, a: Record<string, unknown>) => void;
      }) | null;
      const HArvest = (window as unknown as { HArvest?: { filterAttributes: (a: Record<string, unknown>) => Record<string, unknown> } }).HArvest;
      if (!card?.updatePreviewState || !HArvest) return;
      const mp = mediaPreviewState(state, attrs);
      card.updatePreviewState(mp.state, HArvest.filterAttributes(mp.attributes));
    };
    const tick = async () => {
      try {
        const detail = await api.entities.get(entityId);
        if (!cancelled) push(detail.state, detail.attributes as Record<string, unknown>);
      } catch { /* keep the last rendered frame */ }
    };
    tick();
    const id = window.setInterval(tick, 2500);
    return () => { cancelled = true; clearInterval(id); };
  }, [entityId, domain, ready, cardRef]);
}
