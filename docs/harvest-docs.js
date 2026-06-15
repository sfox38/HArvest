/**
 * harvest-docs.js - Shared interactivity for HArvest documentation.
 * Handles: dark/light mode toggle, mobile sidebar, active nav highlighting,
 * basic syntax highlighting for code blocks.
 */

(function () {
  "use strict";

  // ---- Theme ----------------------------------------------------------------
  // Persists via localStorage (HTTP) and URL hash (file:// fallback).

  function getTheme() {
    var hash = location.hash;
    if (hash === "#theme-dark") return "dark";
    if (hash === "#theme-light") return "light";
    try {
      var stored = localStorage.getItem("hrv-docs-theme");
      if (stored) return stored;
    } catch (e) {}
    return "auto";
  }

  function persistTheme(theme) {
    try { localStorage.setItem("hrv-docs-theme", theme); } catch (e) {}
    var hashVal = theme === "auto" ? "" : "#theme-" + theme;
    history.replaceState(null, "", location.pathname + location.search + hashVal);
    updateNavLinks(hashVal);
  }

  function updateNavLinks(hashVal) {
    document.querySelectorAll("a.nav-item, a.nav-card").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      href = href.replace(/#theme-(?:dark|light)$/, "");
      if (hashVal) href += hashVal;
      link.setAttribute("href", href);
    });
  }

  function applyTheme(theme) {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var useDark = theme === "dark" || (theme === "auto" && prefersDark);
    document.documentElement.dataset.theme = useDark ? "dark" : "light";
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = useDark ? "Light mode" : "Dark mode";
      btn.setAttribute("aria-pressed", String(useDark));
      btn.setAttribute("aria-label", useDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function toggleTheme() {
    var current = getTheme();
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next;
    if (current === "auto") {
      next = prefersDark ? "light" : "dark";
    } else if (current === "dark") {
      next = "light";
    } else {
      next = "dark";
    }
    persistTheme(next);
    applyTheme(next);
  }

  applyTheme(getTheme());
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (getTheme() === "auto") applyTheme("auto");
  });

  // ---- Mobile sidebar -------------------------------------------------------

  function setupMobileSidebar() {
    var toggle = document.getElementById("menuToggle");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebarOverlay");
    if (!toggle || !sidebar) return;

    function openSidebar() {
      sidebar.inert = false;
      sidebar.classList.add("open");
      if (overlay) {
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
      }
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
      var firstLink = sidebar.querySelector("a.nav-item");
      if (firstLink) firstLink.focus();
    }

    function closeSidebar(returnFocus) {
      sidebar.classList.remove("open");
      if (overlay) {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
      }
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
      if (window.innerWidth <= 700) sidebar.inert = true;
      if (returnFocus) toggle.focus();
    }

    function syncSidebarState() {
      if (window.innerWidth <= 700 && !sidebar.classList.contains("open")) {
        sidebar.inert = true;
      } else {
        sidebar.inert = false;
      }
    }

    toggle.addEventListener("click", function () {
      sidebar.classList.contains("open") ? closeSidebar(false) : openSidebar();
    });
    window.addEventListener("resize", syncSidebarState);

    if (overlay) {
      overlay.addEventListener("click", function () { closeSidebar(true); });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeSidebar(true);
      }
      if (e.key === "Tab" && sidebar.classList.contains("open")) {
        var focusable = sidebar.querySelectorAll("a[href], button:not([disabled])");
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Close sidebar when a nav link is clicked on mobile
    var navLinks = sidebar.querySelectorAll("a.nav-item");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 700) closeSidebar();
      });
    });
    syncSidebarState();
  }

  // ---- Active nav link ------------------------------------------------------

  function setActiveNav() {
    var page = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll("a.nav-item");
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var linkPage = (href.split("/").pop() || "index.html").split("#")[0];
      if (linkPage === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function improveDocumentSemantics() {
    document.querySelectorAll(".toc").forEach(function (toc) {
      toc.setAttribute("role", "navigation");
      toc.setAttribute("aria-label", "On this page");
    });
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  // ---- Syntax highlighting --------------------------------------------------
  // Single-pass tokenizer for each language. All patterns are combined into
  // one regex so later groups never re-match inside markup inserted by earlier
  // groups, which was the root cause of "tok-keyword" appearing as visible text.

  function tok(cls, content) {
    return '<span class="' + cls + '">' + content + "</span>";
  }

  function enc(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var LANG_LABELS = {
    html: "HTML", javascript: "JavaScript", js: "JavaScript",
    json: "JSON", python: "Python", css: "CSS"
  };

  function highlightBlock(el) {
    var lang = el.className.replace(/language-/, "").trim();
    var text = el.textContent;

    if (!lang || lang === "text" || lang === "none") return;

    var label = LANG_LABELS[lang];
    if (label && el.parentElement) el.parentElement.dataset.lang = label;

    var html;
    var e = enc(text);

    if (lang === "html") {
      // Attribute names matched only when preceded by whitespace (lookbehind)
      // so they never hit class= values inside inserted span markup.
      html = e.replace(
        /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?[\w-]+)|(?<=[ \t\n])([\w:-]+)(?==)|("[^"]*")/g,
        function (m, comment, tag, attr, str) {
          if (comment) return tok("tok-comment", comment);
          if (tag)     return tok("tok-tag", tag);
          if (attr)    return tok("tok-attr", attr);
          if (str)     return tok("tok-string", str);
          return m;
        }
      );
    } else if (lang === "javascript" || lang === "js") {
      // Order: comments first (absorb strings/keywords inside), then strings
      // (absorb keywords inside), then keywords, then numbers.
      html = e.replace(
        /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(class|extends|const|let|var|function|return|if|else|new|this|null|undefined|true|false|for|of|in|async|await|import|export|default)\b|\b(\d+(?:\.\d+)?)\b/g,
        function (m, comment, str, keyword, num) {
          if (comment) return tok("tok-comment", comment);
          if (str)     return tok("tok-string", str);
          if (keyword) return tok("tok-keyword", keyword);
          if (num)     return tok("tok-number", num);
          return m;
        }
      );
    } else if (lang === "json") {
      // Keys: quoted string immediately before a colon (lookahead).
      // Values: any other quoted string (matched after keys so keys win).
      html = e.replace(
        /"((?:[^"\\]|\\.)*)"(?=\s*:)|"((?:[^"\\]|\\.)*)"|:\s*(true|false|null)\b|\b(\d+(?:\.\d+)?)\b/g,
        function (m, key, str, keyword, num) {
          if (key !== undefined) return tok("tok-key", '"' + key + '"');
          if (str !== undefined) return tok("tok-string", '"' + str + '"');
          if (keyword)           return ": " + tok("tok-keyword", keyword);
          if (num !== undefined) return tok("tok-number", num);
          return m;
        }
      );
    } else if (lang === "python") {
      html = e.replace(
        /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|class|return|import|from|if|elif|else|for|in|not|and|or|True|False|None|async|await|self|str|int|bool|list|dict|set)\b|\b(\d+(?:\.\d+)?)\b/g,
        function (m, comment, str, keyword, num) {
          if (comment) return tok("tok-comment", comment);
          if (str)     return tok("tok-string", str);
          if (keyword) return tok("tok-keyword", keyword);
          if (num)     return tok("tok-number", num);
          return m;
        }
      );
    } else if (lang === "css") {
      html = e.replace(
        /(\/\*[\s\S]*?\*\/)|(--[\w-]+)|("[^"]*")|(#[0-9a-fA-F]{3,8})\b/g,
        function (m, comment, attr, str, num) {
          if (comment) return tok("tok-comment", comment);
          if (attr)    return tok("tok-attr", attr);
          if (str)     return tok("tok-string", str);
          if (num)     return tok("tok-number", num);
          return m;
        }
      );
    } else {
      return;
    }

    el.innerHTML = html;
  }

  function highlightAll() {
    document.querySelectorAll("pre code").forEach(highlightBlock);
  }

  // ---- Init -----------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    // Theme toggle button
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
      applyTheme(getTheme()); // re-apply to update button text
    }

    setupMobileSidebar();
    setActiveNav();
    improveDocumentSemantics();
    highlightAll();

    // Stamp nav links with current theme hash so navigation preserves it
    var currentTheme = getTheme();
    if (currentTheme !== "auto") {
      updateNavLinks("#theme-" + currentTheme);
    }
  });

})();
