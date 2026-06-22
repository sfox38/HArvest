/*
 * demos.js - navigation for the HArvest demo gallery.
 *
 * Every demo page includes this script and an empty <nav id="demo-nav">.
 * The script finds this page's position in the ordered list below and fills
 * in: wrap-around prev/next links, a row of page dots showing which demo is
 * current and how many there are, and a link to the online docs. Add a new
 * demo by inserting one entry here in the order it should appear; navigation
 * on every page updates itself.
 *
 * Links point at "<slug>/index.html" (not the bare directory) so they work
 * when the pages are opened straight off disk via file://.
 */

const HRV_DEMOS = [
  { slug: "office",        title: "Office" },
  { slug: "public",        title: "Public Board" },
  { slug: "greenhouse",    title: "Greenhouse" },
  { slug: "kitchen-kiosk", title: "Kitchen Kiosk" },
  { slug: "airbnb",        title: "Guest Stay" },
  { slug: "why-harvest",   title: "Why HArvest" },
];

const HRV_DOCS_URL = "https://sfox38.github.io/HArvest";

const HRV_CHEVRON_LEFT =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>';
const HRV_CHEVRON_RIGHT =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>';
const HRV_DOCS_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>';

function _hrvHref(slug) {
  return "../" + slug + "/index.html";
}

function renderDemoNav() {
  const nav = document.getElementById("demo-nav");
  if (!nav) return;

  // Slug = the page's directory name (works for ".../slug/" and ".../slug/index.html").
  const path = location.pathname.replace(/\/(index\.html)?$/, "");
  const slug = path.split("/").pop();
  const i = HRV_DEMOS.findIndex((d) => d.slug === slug);
  if (i === -1) return;

  const n = HRV_DEMOS.length;
  const prev = HRV_DEMOS[(i - 1 + n) % n]; // wraps: first -> last
  const next = HRV_DEMOS[(i + 1) % n];     // wraps: last -> first

  const dots = HRV_DEMOS.map((d, idx) =>
    `<a class="demo-dot${idx === i ? " is-current" : ""}" href="${_hrvHref(d.slug)}"` +
    ` aria-label="${d.title}"${idx === i ? ' aria-current="page"' : ""}></a>`
  ).join("");

  nav.innerHTML =
    '<div class="demo-nav-row">' +
      `<a class="demo-nav-link" href="${_hrvHref(prev.slug)}">${HRV_CHEVRON_LEFT}<span>${prev.title}</span></a>` +
      `<a class="demo-nav-link" href="${_hrvHref(next.slug)}"><span>${next.title}</span>${HRV_CHEVRON_RIGHT}</a>` +
    '</div>' +
    `<div class="demo-dots" aria-label="Demo ${i + 1} of ${n}">${dots}</div>` +
    `<a class="demo-docs" href="${HRV_DOCS_URL}" target="_blank" rel="noopener">${HRV_DOCS_ICON}<span>Documentation</span></a>`;

}

/*
 * Auto-advance ("kiosk slideshow"), simple and predictable:
 *   - A fresh load or reload of any page starts the slideshow from there; it
 *     advances one page every 6s and stops on the last page. Once started it
 *     runs to the end unless the user interrupts it.
 *   - ANY interaction (prev/next/a dot, the demo card widgets, keyboard,
 *     wheel, touch) stops it for good until the next reload. A flag in
 *     sessionStorage carries the stop across the page a nav click loads; a
 *     reload clears it.
 *   - Only fresh loads and reloads arm. Back/forward (bfcache) never
 *     auto-advances, so history navigation stays calm and there is no stale
 *     per-page state to make it stall on a page touched in a previous run.
 * The Kitchen scroll showcase (runKitchenScroll) is fully independent: it
 * plays whenever the Kitchen page is shown and never starts or stops
 * auto-advance. State lives only in sessionStorage (no module-level flag that
 * could survive a bfcache restore).
 */
const AUTO_ADVANCE_MS = 6000;
let _autoTimer = null;
let _scrollRaf = null;
let _scrollTimers = [];

function currentIndex() {
  const path = location.pathname.replace(/\/(index\.html)?$/, "");
  const slug = path.split("/").pop();
  return HRV_DEMOS.findIndex((d) => d.slug === slug);
}

function stopped() {
  try { return sessionStorage.getItem("hrvAutoStopped") === "1"; } catch (e) { return false; }
}
function setStopped(on) {
  try {
    if (on) sessionStorage.setItem("hrvAutoStopped", "1");
    else sessionStorage.removeItem("hrvAutoStopped");
  } catch (e) {}
}

function clearAutoTimer() {
  if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
}
function clearScroll() {
  if (_scrollRaf) { cancelAnimationFrame(_scrollRaf); _scrollRaf = null; }
  _scrollTimers.forEach(clearTimeout);
  _scrollTimers = [];
}

// Any genuine user interaction stops auto-advance until the next reload. It
// never touches the Kitchen scroll. Auto-advance navigation is programmatic
// and the scroll moves scrollTop (which fires "scroll", not "wheel"), so
// neither trips this.
function onInteract() {
  if (stopped()) return;
  setStopped(true);
  clearAutoTimer();
}

function isReload() {
  try {
    const e = performance.getEntriesByType("navigation")[0];
    if (e && e.type) return e.type === "reload";
    return performance.navigation && performance.navigation.type === 1;
  } catch (err) { return false; }
}

function armAutoAdvance() {
  clearAutoTimer();
  if (stopped()) return;
  const i = currentIndex();
  const n = HRV_DEMOS.length;
  if (i === -1 || i >= n - 1) return; // unknown page, or last page = terminus
  const next = HRV_DEMOS[i + 1];
  _autoTimer = setTimeout(() => { location.href = _hrvHref(next.slug); }, AUTO_ADVANCE_MS);
}

// Kitchen only: ease the scroll panel down then back up. Independent of
// auto-advance. Skipped under reduced motion and when nothing overflows.
function runKitchenScroll() {
  clearScroll();
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.querySelector(".kiosk-scroll");
  if (!el || reduce) return;
  el.scrollTop = 0;
  const max = el.scrollHeight - el.clientHeight;
  if (max <= 8) return;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const tween = (from, to, dur, cb) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.scrollTop = from + (to - from) * ease(p);
      if (p < 1) _scrollRaf = requestAnimationFrame(step);
      else if (cb) cb();
    };
    _scrollRaf = requestAnimationFrame(step);
  };
  _scrollTimers.push(setTimeout(() => {
    tween(0, max, 1300, () => {
      _scrollTimers.push(setTimeout(() => tween(max, 0, 1300), 300));
    });
  }, 450));
}

// Fires on the initial show and on bfcache restore. Only non-bfcache shows
// (fresh load / reload / an auto-advance hop, which is a normal navigation)
// arm the slideshow; a reload clears the stop flag to restart it. The Kitchen
// scroll runs on every show, regardless of slideshow state.
function showPage(persisted) {
  clearAutoTimer();
  clearScroll();
  if (!persisted) {
    if (isReload()) setStopped(false);
    armAutoAdvance();
  }
  runKitchenScroll();
}

function initDemoPage() {
  renderDemoNav();
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) =>
    window.addEventListener(t, onInteract, { capture: true, passive: true }));
}

if (document.readyState !== "loading") initDemoPage();
else document.addEventListener("DOMContentLoaded", initDemoPage);

window.addEventListener("pageshow", (e) => showPage(e.persisted));
window.addEventListener("pagehide", () => { clearAutoTimer(); clearScroll(); });
