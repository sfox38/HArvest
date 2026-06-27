/**
 * Apply theme CSS variables to a card shadow host.
 *
 * apply() sets CSS custom properties on the shadow host element so they
 * cascade into the shadow DOM via the :host selector. Dark-mode overrides
 * are merged at apply time using window.matchMedia("prefers-color-scheme").
 * A MediaQueryList listener is attached to re-apply when the system theme
 * changes while the card is visible.
 */

/**
 * Shared dark-mode listener. All themed cards register a callback here
 * instead of each attaching its own matchMedia listener.
 * @type {Set<() => void>}
 */
const _darkCallbacks = new Set();
let _darkMq = null;

// ---------------------------------------------------------------------------
// ThemeLoader
// ---------------------------------------------------------------------------

export class ThemeLoader {

  /**
   * Apply a theme object to a shadow root by setting CSS custom properties on
   * the :host element. Merges dark_variables when prefers-color-scheme:dark
   * is active.
   *
   * Also attaches a MediaQueryList change listener (stored on the host element
   * as _harvThemeCleanup) so that toggling system dark mode re-applies the
   * correct variable set without a page reload. Call detach() to remove it.
   *
   * @param {object}      theme       - ThemeObject
   * @param {ShadowRoot}  shadowRoot
   * @param {"light"|"dark"|"auto"} [colorScheme="auto"] - Force light or dark regardless of OS
   */
  static apply(theme, shadowRoot, colorScheme = "auto") {
    const host = /** @type {HTMLElement} */ (shadowRoot.host);

    // Remove any previous listener before attaching a new one.
    ThemeLoader.detach(shadowRoot);

    if (!_darkMq) {
      _darkMq = window.matchMedia("(prefers-color-scheme: dark)");
      _darkMq.addEventListener("change", () => {
        for (const cb of _darkCallbacks) cb();
      });
    }

    const applyVars = () => {
      let isDark;
      if (colorScheme === "dark") {
        isDark = true;
      } else if (colorScheme === "light") {
        isDark = false;
      } else {
        const meta = document.querySelector('meta[name="color-scheme"]');
        const metaVal = meta?.getAttribute("content")?.trim().toLowerCase() || "";
        if (metaVal === "light" || metaVal === "only light") isDark = false;
        else if (metaVal === "dark" || metaVal === "only dark") isDark = true;
        else {
          const htmlCS = document.documentElement.style.colorScheme || "";
          if (htmlCS === "light") isDark = false;
          else if (htmlCS === "dark") isDark = true;
          else {
            const computed = getComputedStyle(document.documentElement).colorScheme || "";
            if (computed === "light") isDark = false;
            else if (computed === "dark") isDark = true;
            else isDark = _darkMq.matches;
          }
        }
      }
      const vars = (isDark && theme.dark_variables)
        ? { ...theme.variables, ...theme.dark_variables }
        : theme.variables;

      // Remove only variables previously applied by ThemeLoader. The host page
      // owns every other inline style on the custom element.
      ThemeLoader.clear(shadowRoot);

      const _dangerousValueRe = /url\s*\(|expression\s*\(|@import/i;
      const appliedKeys = new Map();
      for (const [key, value] of Object.entries(vars ?? {})) {
        if (!key.startsWith("--")) continue;
        const cssValue = String(value);
        if (_dangerousValueRe.test(cssValue)) continue;
        appliedKeys.set(key, {
          existed: [...host.style].includes(key),
          value: host.style.getPropertyValue(key),
          priority: host.style.getPropertyPriority(key),
        });
        host.style.setProperty(key, cssValue);
      }
      host[_APPLIED_KEYS] = appliedKeys;
    };

    applyVars();

    // Inject custom fonts declared by the theme. @font-face rules in
    // document.head are global - they apply inside shadow DOM via the
    // font-family property even though class selectors do not cross shadow
    // boundaries. Idempotent: keyed by sanitised family name + weight.
    const baseUrl = theme._sourceUrl || null;
    if (Array.isArray(theme.custom_fonts)) {
      for (const face of theme.custom_fonts) {
        if (face.family && face.url) {
          _injectFontFace(face.family, _resolveFontUrl(face.url, baseUrl), face.weight, face.style);
        }
      }
    }

    // Only register OS-change listener when not forced to a specific scheme.
    if (colorScheme === "auto") {
      _darkCallbacks.add(applyVars);
      host[_CLEANUP_KEY] = () => _darkCallbacks.delete(applyVars);
    }
  }

  /**
   * Remove the dark-mode change listener attached by apply(), if any.
   * Call this from disconnectedCallback to avoid listener leaks.
   *
   * @param {ShadowRoot} shadowRoot
   */
  static detach(shadowRoot) {
    const host = /** @type {any} */ (shadowRoot.host);
    if (typeof host[_CLEANUP_KEY] === "function") {
      host[_CLEANUP_KEY]();
      delete host[_CLEANUP_KEY];
    }
  }

  /**
   * Remove variables previously applied by ThemeLoader without disturbing
   * inline styles owned by the embedding page.
   *
   * @param {ShadowRoot} shadowRoot
   */
  static clear(shadowRoot) {
    const host = /** @type {any} */ (shadowRoot.host);
    for (const [key, original] of host[_APPLIED_KEYS] ?? []) {
      if (original.existed) {
        host.style.setProperty(key, original.value, original.priority);
      } else {
        host.style.removeProperty(key);
      }
    }
    delete host[_APPLIED_KEYS];
  }

  /**
   * Reset shared dark-mode state. Intended for testing only.
   */
  static _clearCache() {
    _darkCallbacks.clear();
    _darkMq = null;
  }
}

// Private symbol used to store the MediaQueryList cleanup function on the
// host element without polluting its public interface.
const _CLEANUP_KEY = Symbol("harvThemeCleanup");
const _APPLIED_KEYS = Symbol("harvThemeAppliedKeys");

/**
 * Resolve a font URL relative to the theme's source URL. Absolute URLs
 * and data URIs pass through unchanged. Relative paths are resolved
 * against the directory containing the theme JSON.
 *
 * @param {string} fontUrl
 * @param {string|null} themeBaseUrl
 * @returns {string}
 */
function _resolveFontUrl(fontUrl, themeBaseUrl) {
  if (!themeBaseUrl || /^(https?:|data:|blob:)/i.test(fontUrl)) return fontUrl;
  try {
    const base = themeBaseUrl.substring(0, themeBaseUrl.lastIndexOf("/") + 1);
    return new URL(fontUrl, base).href;
  } catch {
    return fontUrl;
  }
}

/**
 * Inject a @font-face rule into document.head.
 * Idempotent: the data-hrv-font attribute is keyed by the sanitised family
 * name plus weight so multiple weights of the same family each get one rule.
 *
 * @param {string} family  - Font family name, e.g. "Inter"
 * @param {string} url     - URL to the woff2 file
 * @param {string} [weight="normal"] - CSS font-weight value, e.g. "400" or "100 900"
 * @param {string} [fontStyle="normal"] - CSS font-style value
 */
function _injectFontFace(family, url, weight, fontStyle) {
  if (typeof family !== "string" || typeof url !== "string") return;
  const w = String(weight || "normal").trim().toLowerCase();
  const s = String(fontStyle || "normal").trim().toLowerCase();
  const validWeight = /^(?:normal|bold|(?:[1-9]\d{0,2}|1000)(?: (?:[1-9]\d{0,2}|1000))?)$/;
  if (!validWeight.test(w) || !["normal", "italic", "oblique"].includes(s)) return;
  const key = `${family.toLowerCase().replace(/\s+/g, "-")}-${w}-${s}`;
  if ([...document.head.querySelectorAll("[data-hrv-font]")]
    .some((element) => element.getAttribute("data-hrv-font") === key)) return;
  const style = document.createElement("style");
  style.setAttribute("data-hrv-font", key);
  style.textContent = `@font-face{font-family:${JSON.stringify(family)};src:url(${JSON.stringify(url)}) format("woff2");font-weight:${w};font-style:${s};font-display:swap}`;
  document.head.appendChild(style);
}
