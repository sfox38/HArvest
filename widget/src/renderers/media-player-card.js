/**
 * renderers/media-player-card.js - Renderer for the "media_player" domain.
 *
 * Renders an album art tile, media title/artist, playback controls
 * (play/pause, previous, next, power), a seek/progress bar, volume slider,
 * and source selector. Album art and the seek bar use the shared BaseCard
 * media helpers (resolveAssetUrl, mediaProgress, formatMediaTime,
 * start/stopMediaTicker). The seek bar is interactive when read-write and
 * display-only when read-only.
 *
 * Volume slider is debounced at 200ms.
 */

import { BaseCard } from "./base-card.js";
import { esc as _esc } from "../_utils/esc.js";

const MEDIA_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    flex-direction: column;
    gap: var(--hrv-spacing-s);
  }

  .hrv-media-hero {
    display: flex;
    align-items: center;
    gap: var(--hrv-spacing-m);
  }

  [part=media-art] {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: var(--hrv-radius-m);
    overflow: hidden;
    background: var(--hrv-color-surface-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--hrv-color-icon);
  }

  [part=media-art] img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  [part=media-art][data-has-art="true"] [part=media-art-icon] { display: none; }
  [part=media-art][data-has-art="false"] img { display: none; }
  [part=media-art-icon] svg { width: 28px; height: 28px; }

  .hrv-media-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  [part=media-artist] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part=media-source] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    opacity: 0.75;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  [part=media-source]:empty { display: none; }

  [part=media-title] {
    font-size: var(--hrv-font-size-s);
    font-weight: var(--hrv-font-weight-medium);
    color: var(--hrv-color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hrv-seek-row {
    display: flex;
    align-items: center;
    gap: var(--hrv-spacing-s);
  }
  .hrv-seek-row[hidden] { display: none; }

  [part=progress-elapsed],
  [part=progress-duration] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    min-width: 34px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  [part=progress-slider] {
    flex: 1;
    accent-color: var(--hrv-color-primary);
    cursor: pointer;
  }
  [part=progress-slider]:disabled { cursor: default; }

  .hrv-media-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--hrv-spacing-s);
  }

  .hrv-media-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: var(--hrv-color-surface-alt);
    color: var(--hrv-color-text);
    cursor: pointer;
    transition: opacity var(--hrv-transition-speed), background var(--hrv-transition-speed);
    padding: 0;
  }

  .hrv-media-btn:hover  { opacity: 0.8; }
  .hrv-media-btn:active { opacity: 0.6; }
  .hrv-media-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  [part=play-button] {
    width: 44px;
    height: 44px;
    background: var(--hrv-color-primary);
    color: var(--hrv-color-on-primary);
  }

  .hrv-media-btn svg { width: 20px; height: 20px; }
  [part=play-button] svg { width: 24px; height: 24px; }

  .hrv-volume-row {
    display: flex;
    align-items: center;
    gap: var(--hrv-spacing-s);
  }

  .hrv-volume-icon {
    width: 20px;
    height: 20px;
    color: var(--hrv-color-icon);
    flex-shrink: 0;
  }

  [part=volume-slider] {
    flex: 1;
    accent-color: var(--hrv-color-primary);
    cursor: pointer;
  }

  [part=source-select] {
    width: 100%;
    padding: var(--hrv-spacing-s) var(--hrv-spacing-m);
    border: none;
    border-radius: var(--hrv-radius-m);
    background: var(--hrv-color-surface-alt);
    color: var(--hrv-color-text);
    font-size: var(--hrv-font-size-xs);
    font-family: inherit;
    cursor: pointer;
  }

  [part=state-label] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
  }
`;

import { renderIconSVG } from "../icons.js";


export class MediaPlayerCard extends BaseCard {
  /** @type {HTMLButtonElement|null}  */ #playBtn      = null;
  /** @type {HTMLButtonElement|null}  */ #prevBtn      = null;
  /** @type {HTMLButtonElement|null}  */ #nextBtn      = null;
  /** @type {HTMLButtonElement|null}  */ #powerBtn     = null;
  /** @type {HTMLButtonElement|null}  */ #muteBtn      = null;
  /** @type {HTMLButtonElement|null}  */ #volumeDownBtn = null;
  /** @type {HTMLButtonElement|null}  */ #volumeUpBtn   = null;
  /** @type {HTMLInputElement|null}   */ #volumeSlider = null;
  /** @type {HTMLSelectElement|null}  */ #sourceSelect = null;
  /** @type {HTMLElement|null}        */ #mediaArtistEl = null;
  /** @type {HTMLElement|null}        */ #mediaSourceEl = null;
  /** @type {HTMLElement|null}        */ #mediaTitleEl  = null;
  /** @type {HTMLElement|null}        */ #stateLabel    = null;
  /** @type {HTMLElement|null}        */ #artEl        = null;
  /** @type {string}                  */ #lastArtUrl   = "";
  /** @type {HTMLElement|null}        */ #progRow      = null;
  /** @type {HTMLInputElement|null}   */ #progSlider   = null;
  /** @type {HTMLElement|null}        */ #progElapsed  = null;
  /** @type {HTMLElement|null}        */ #progDuration = null;
  /** @type {number}                  */ #duration     = 0;
  /** @type {object}                  */ #lastAttrs    = {};
  /** @type {boolean}                 */ #isPlaying    = false;
  /** @type {boolean}                 */ #isMuted      = false;
  /** @type {string}                  */ #lastState    = "";
  /** @type {Function}                */ #volumeDebounce;

  constructor(def, root, config, i18n) {
    super(def, root, config, i18n);
    this.#volumeDebounce = this.debounce(this.#sendVolume.bind(this), 200);
  }

  render() {
    const isWritable  = this.def.capabilities === "read-write";
    const hints       = this.config.displayHints ?? {};
    const features    = this.def.supported_features ?? [];
    const showTransport = hints.show_transport !== false;
    const hasPlay     = showTransport && features.includes("play_pause");
    const hasPrevious = showTransport && features.includes("previous_track");
    const hasNext     = showTransport && features.includes("next_track");
    const hasPower    = showTransport && (features.includes("turn_on") || features.includes("turn_off"));
    const hasTransport = hasPlay || hasPrevious || hasNext || hasPower;
    const showVolume  = hints.show_volume !== false;
    const hasVolumeSet = showVolume && features.includes("volume_set");
    const hasVolumeStep = showVolume && features.includes("volume_step");
    // Mute only appears when the player actually supports volume_mute. A
    // player that exposes volume_set but not volume_mute (HA's own card can't
    // mute it either) must not show a dead mute button.
    const hasMute     = showVolume && features.includes("volume_mute");
    const hasVolume   = hasVolumeSet || hasVolumeStep || hasMute;
    const hasSource   = hints.show_source !== false && features.includes("select_source");

    this.root.innerHTML = /* html */`
      <style>${MEDIA_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">
          <div class="hrv-media-hero">
            <div part="media-art" data-has-art="false">
              <img part="media-art-img" alt="">
              <span part="media-art-icon" aria-hidden="true"></span>
            </div>
            <div class="hrv-media-text">
              <span part="media-title"></span>
              <span part="media-artist"></span>
              <span part="media-source"></span>
              <span part="state-label"></span>
            </div>
          </div>
          <div class="hrv-seek-row" part="progress-row" hidden>
            <span part="progress-elapsed">0:00</span>
            <input part="progress-slider" type="range" min="0" max="1000" value="0"
              ${isWritable ? "" : "disabled"}
              aria-label="${_esc(this.def.friendly_name)} - Seek">
            <span part="progress-duration">0:00</span>
          </div>
          ${isWritable ? /* html */`
            ${hasTransport ? /* html */`
            <div class="hrv-media-controls">
              ${hasPower ? /* html */`
                <button part="power-button" class="hrv-media-btn" type="button"
                  aria-label="${_esc(this.def.friendly_name)} - Power">
                  ${renderIconSVG("mdi:power", "power-icon")}
                </button>
              ` : ""}
              ${hasPrevious ? /* html */`
                <button part="prev-button" class="hrv-media-btn" type="button"
                  aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("action.previous"))}">
                  ${renderIconSVG("mdi:skip-previous", "prev-icon")}
                </button>
              ` : ""}
              ${hasPlay ? /* html */`<button part="play-button" class="hrv-media-btn" type="button"
                aria-pressed="false"
                aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("action.play"))}">
                ${renderIconSVG("mdi:play", "play-icon")}
              </button>` : ""}
              ${hasNext ? /* html */`
                <button part="next-button" class="hrv-media-btn" type="button"
                  aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("action.next"))}">
                  ${renderIconSVG("mdi:skip-next", "next-icon")}
                </button>
              ` : ""}
            </div>
            ` : ""}
            ${hasVolume ? /* html */`
              <div class="hrv-volume-row">
                ${hasMute ? `<button part="mute-button" class="hrv-media-btn" type="button"
                  aria-pressed="false"
                  aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("action.mute"))}">
                  ${renderIconSVG("mdi:volume-high", "mute-icon")}
                </button>` : ""}
                ${hasVolumeStep ? `<button part="volume-down-button" class="hrv-media-btn" type="button"
                  aria-label="${_esc(this.def.friendly_name)} - Volume down">-</button>` : ""}
                ${hasVolumeSet ? `<input part="volume-slider" type="range" min="0" max="100"
                  aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("media.volume"))}">` : ""}
                ${hasVolumeStep ? `<button part="volume-up-button" class="hrv-media-btn" type="button"
                  aria-label="${_esc(this.def.friendly_name)} - Volume up">+</button>` : ""}
              </div>
            ` : ""}
            ${hasSource ? /* html */`
              <select part="source-select"
                aria-label="${_esc(this.def.friendly_name)} - ${_esc(this.i18n.t("media.source"))}">
                <option value="">- ${_esc(this.i18n.t("media.source"))} -</option>
              </select>
            ` : ""}
          ` : ""}
        </div>
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#playBtn      = this.root.querySelector("[part=play-button]");
    this.#prevBtn      = this.root.querySelector("[part=prev-button]");
    this.#nextBtn      = this.root.querySelector("[part=next-button]");
    this.#powerBtn     = this.root.querySelector("[part=power-button]");
    this.#muteBtn      = this.root.querySelector("[part=mute-button]");
    this.#volumeDownBtn = this.root.querySelector("[part=volume-down-button]");
    this.#volumeUpBtn   = this.root.querySelector("[part=volume-up-button]");
    this.#volumeSlider = this.root.querySelector("[part=volume-slider]");
    this.#sourceSelect = this.root.querySelector("[part=source-select]");
    this.#mediaArtistEl = this.root.querySelector("[part=media-artist]");
    this.#mediaSourceEl = this.root.querySelector("[part=media-source]");
    this.#mediaTitleEl  = this.root.querySelector("[part=media-title]");
    this.#stateLabel    = this.root.querySelector("[part=state-label]");
    this.#artEl         = this.root.querySelector("[part=media-art]");
    this.#progRow       = this.root.querySelector("[part=progress-row]");
    this.#progSlider    = this.root.querySelector("[part=progress-slider]");
    this.#progElapsed   = this.root.querySelector("[part=progress-elapsed]");
    this.#progDuration  = this.root.querySelector("[part=progress-duration]");

    this.renderIcon(this.resolveIcon(this.def.icon, "mdi:cast"), "card-icon");
    this.renderIcon("mdi:cast", "media-art-icon");

    this.#playBtn?.addEventListener("click", () => {
      this.config.card?.sendCommand("media_play_pause", {});
    });

    this.#prevBtn?.addEventListener("click", () =>
      this.config.card?.sendCommand("media_previous_track", {}));

    this.#nextBtn?.addEventListener("click", () =>
      this.config.card?.sendCommand("media_next_track", {}));

    this.#powerBtn?.addEventListener("click", () => {
      const isOff = ["off", "unavailable", "unknown"].includes(this.#lastState);
      const action = isOff ? "turn_on" : "turn_off";
      if (features.includes(action)) this.config.card?.sendCommand(action, {});
    });

    this.#muteBtn?.addEventListener("click", () =>
      this.config.card?.sendCommand("volume_mute", { is_volume_muted: !this.#isMuted }));

    this.#volumeDownBtn?.addEventListener("click", () =>
      this.config.card?.sendCommand("volume_down", {}));
    this.#volumeUpBtn?.addEventListener("click", () =>
      this.config.card?.sendCommand("volume_up", {}));

    this.#volumeSlider?.addEventListener("input", (e) =>
      this.#volumeDebounce(parseInt(e.target.value, 10) / 100));
    this.guardSlider(this.#volumeSlider, this.#volumeDebounce);

    this.#sourceSelect?.addEventListener("change", (e) => {
      if (e.target.value) {
        this.config.card?.sendCommand("select_source", { source: e.target.value });
      }
    });

    if (this.#progSlider && isWritable) {
      this.#progSlider.addEventListener("input", () => {
        this.beginMediaSeek();
        const frac = parseInt(this.#progSlider.value, 10) / 1000;
        if (this.#progElapsed) this.#progElapsed.textContent = this.formatMediaTime(frac * this.#duration);
      });
      this.#progSlider.addEventListener("change", () => {
        this.endMediaSeek();
        const frac = parseInt(this.#progSlider.value, 10) / 1000;
        this.config.card?.sendCommand("media_seek", { seek_position: frac * this.#duration });
      });
    }

    this.renderCompanions();
    this._attachGestureHandlers(this.root.querySelector("[part=card]"));
  }

  applyState(state, attributes) {
    this.#lastState = state;
    const isPlaying = state === "playing";

    if (this.#stateLabel) {
      this.#stateLabel.textContent = this.i18n.t(`state.${state}`) !== `state.${state}`
        ? this.i18n.t(`state.${state}`)
        : state;
    }

    if (this.#mediaArtistEl) {
      this.#mediaArtistEl.textContent = attributes.media_artist ?? "";
    }

    if (this.#mediaSourceEl) {
      this.#mediaSourceEl.textContent = this.mediaSourceText(attributes);
    }

    if (this.#mediaTitleEl) {
      this.#mediaTitleEl.textContent =
        attributes.media_title ?? attributes.media_album_name ?? "";
    }

    this.#updateArt(attributes.entity_picture);

    this.#lastAttrs = attributes;
    this.#isPlaying = isPlaying;
    this.#duration = attributes.media_duration ?? 0;
    this.#renderProgress();
    if (isPlaying && this.mediaProgress(attributes, true)) {
      this.startMediaTicker(() => this.#renderProgress());
    } else {
      this.stopMediaTicker();
    }

    if (this.#playBtn) {
      this.#playBtn.setAttribute("aria-pressed", String(isPlaying));
      this.#playBtn.setAttribute("aria-label",
        `${this.def.friendly_name} - ${this.i18n.t(isPlaying ? "action.pause" : "action.play")}`);
      const iconName = isPlaying ? "mdi:pause" : "mdi:play";
      this.#playBtn.innerHTML = renderIconSVG(iconName, "play-icon");
    }

    if (this.#powerBtn) {
      const isOff = ["off", "unavailable", "unknown"].includes(state);
      const action = isOff ? "turn_on" : "turn_off";
      this.#powerBtn.disabled = !this.def.supported_features?.includes(action);
      this.#powerBtn.setAttribute("aria-label", `${this.def.friendly_name} - ${isOff ? "Turn on" : "Turn off"}`);
    }

    if (this.#volumeSlider && !this.isSliderActive(this.#volumeSlider) && attributes.volume_level !== undefined) {
      this.#volumeSlider.value = String(Math.round(attributes.volume_level * 100));
    }

    this.#isMuted = !!attributes.is_volume_muted;
    if (this.#muteBtn) {
      const iconName = this.#isMuted ? "mdi:volume-off" : "mdi:volume-high";
      this.#muteBtn.innerHTML = renderIconSVG(iconName, "mute-icon");
      this.#muteBtn.setAttribute("aria-pressed", String(this.#isMuted));
      this.#muteBtn.setAttribute("aria-label",
        `${this.def.friendly_name} - ${this.i18n.t(this.#isMuted ? "action.unmute" : "action.mute")}`);
    }

    if (this.#sourceSelect && attributes.source_list) {
      const current = attributes.source ?? "";
      const wanted = new Set(attributes.source_list);
      // Remove stale options no longer in source_list.
      for (const opt of [...this.#sourceSelect.options]) {
        if (opt.value && !wanted.has(opt.value)) {
          opt.remove();
        }
      }
      // Add any new sources.
      const existing = new Set(
        [...this.#sourceSelect.options].map((o) => o.value).filter(Boolean),
      );
      for (const src of attributes.source_list) {
        if (!existing.has(src)) {
          const opt = document.createElement("option");
          opt.value = src;
          opt.textContent = src;
          this.#sourceSelect.appendChild(opt);
        }
      }
      if (!this.isFocused(this.#sourceSelect)) this.#sourceSelect.value = current;
    }

    const defaultIcon = isPlaying ? "mdi:cast-connected" : "mdi:cast";
    const rawIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? defaultIcon;
    this.renderIcon(this.resolveIcon(rawIcon, defaultIcon), "card-icon");

    const stateLabel = this.i18n.t(`state.${state}`) !== `state.${state}`
      ? this.i18n.t(`state.${state}`) : state;
    const title = attributes.media_title ?? "";
    this.announceState(
      `${this.def.friendly_name}, ${stateLabel}${title ? ` - ${title}` : ""}`,
    );
  }

  #sendVolume(fraction) {
    this.config.card?.sendCommand("volume_set", { volume_level: fraction });
  }

  // Album art. entity_picture is a relative HA path (e.g. /api/media_player_proxy/...)
  // so it must be resolved against the configured HA base URL when the widget is
  // embedded on a different origin. data-has-art toggles the fallback cast icon.
  #updateArt(rawUrl) {
    if (!this.#artEl) return;
    const url = this.resolveAssetUrl(rawUrl);
    if (url === this.#lastArtUrl) return;
    this.#lastArtUrl = url;
    const img = this.#artEl.querySelector("[part=media-art-img]");
    if (url && img) {
      img.onerror = () => {
        this.#lastArtUrl = "";
        this.#artEl.setAttribute("data-has-art", "false");
      };
      img.src = url;
      this.#artEl.setAttribute("data-has-art", "true");
    } else {
      if (img) img.removeAttribute("src");
      this.#artEl.setAttribute("data-has-art", "false");
    }
  }

  // Render the seek row from the latest attributes. Called on each state
  // update and once per second by the shared media ticker while playing.
  #renderProgress() {
    const p = this.mediaProgress(this.#lastAttrs, this.#isPlaying);
    if (this.#progRow) this.#progRow.hidden = !p;
    if (!p) return;
    if (this.#progDuration) this.#progDuration.textContent = this.formatMediaTime(p.duration);
    if (this.isMediaSeekActive() || this.isFocused(this.#progSlider)) return;
    if (this.#progSlider) {
      this.#progSlider.value = String(Math.round(p.fraction * 1000));
    }
    if (this.#progElapsed) this.#progElapsed.textContent = this.formatMediaTime(p.elapsed);
  }

  destroy() {
    this.stopMediaTicker();
  }

  // Optimistic UI: flip the play/pause and mute icons immediately on tap so the
  // card responds even before the server confirms (and so it gives feedback in
  // preview mode, where no real command is sent).
  predictState(action, data) {
    if (action === "media_play_pause") {
      return { state: this.#lastState === "playing" ? "paused" : "playing", attributes: this.#lastAttrs };
    }
    if (action === "volume_mute") {
      return { state: this.#lastState, attributes: { ...this.#lastAttrs, is_volume_muted: !!data.is_volume_muted } };
    }
    if (action === "volume_set") {
      return { state: this.#lastState, attributes: { ...this.#lastAttrs, volume_level: data.volume_level } };
    }
    return null;
  }
}
