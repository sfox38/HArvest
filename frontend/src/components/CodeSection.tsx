/**
 * CodeSection.tsx - Embed code panel for the token detail screen.
 *
 * Renders the HTML or WordPress shortcode snippet that customers paste into
 * their site, plus the alias-toggle that controls whether the snippet
 * exposes real entity IDs or aliases. Includes the underlying clipboard
 * helpers (doCopy, useCopy, CopyBtn) since they have no other consumer.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { Token } from "../types";
import { DEFAULT_WIDGET_SCRIPT_URL } from "../types";
import { api } from "../api";
import { Card, Hint } from "./Shared";
import { Toggle } from "./Toggle";

// ---------------------------------------------------------------------------
// Clipboard hook (works in non-secure contexts)
// ---------------------------------------------------------------------------

export function doCopy(text: string) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); } catch { /* ignore */ }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(fallback);
  } else {
    fallback();
  }
}

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = useCallback(() => {
    doCopy(text);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return { copied, copy };
}

export function CopyBtn({ copied, copy, label }: { copied: boolean; copy: () => void; label: string }) {
  return (
    <button
      onClick={copy}
      className={`copy-btn copy-btn-sm${copied ? " copied" : ""}`}
      aria-label={copied ? "Copied to clipboard" : label}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Snippet builders
// ---------------------------------------------------------------------------

export type CardMode = "single" | "group" | "page";

export interface PrimaryWithCompanions {
  primary: Token["entities"][0];
  companions: Token["entities"][0][];
}

export function groupEntities(entities: Token["entities"]): PrimaryWithCompanions[] {
  const primaries = entities.filter(e => !e.companion_of);
  const primaryIds = new Set(primaries.map(p => p.entity_id));
  const companionMap = new Map<string, Token["entities"][0][]>();
  for (const e of entities) {
    if (e.companion_of) {
      if (!primaryIds.has(e.companion_of)) {
        console.warn(`[harvest] orphaned companion ${e.entity_id}: companion_of "${e.companion_of}" not found`);
        continue;
      }
      const list = companionMap.get(e.companion_of) ?? [];
      list.push(e);
      companionMap.set(e.companion_of, list);
    }
  }
  return primaries.map(p => ({ primary: p, companions: companionMap.get(p.entity_id) ?? [] }));
}

function buildCardSnippet(token: Token, useAliases: boolean, mode: CardMode, haUrl: string, hmacSecret: string | null): string {
  const groups = groupEntities(token.entities);
  const secretAttr = hmacSecret ? ` token-secret="${hmacSecret}"` : "";

  function cardLine(g: PrimaryWithCompanions, indent = ""): string {
    const attr = useAliases && g.primary.alias ? `alias="${g.primary.alias}"` : `entity="${g.primary.entity_id}"`;
    return `${indent}<hrv-card ${attr}></hrv-card>`;
  }

  if (mode === "page") {
    return groups.map(g => cardLine(g)).join("\n");
  }

  const groupAttrs = `ha-url="${haUrl}" token="${token.token_id}"${secretAttr}`;
  if (mode === "group") {
    return `<hrv-group ${groupAttrs}>\n${groups.map(g => cardLine(g, "  ")).join("\n")}\n</hrv-group>`;
  }
  const g = groups[0];
  if (!g) return "";
  const entityAttr = useAliases && g.primary.alias ? `alias="${g.primary.alias}"` : `entity="${g.primary.entity_id}"`;
  return `<hrv-card ${groupAttrs} ${entityAttr}></hrv-card>`;
}

function buildWordPressSnippet(token: Token, useAliases: boolean, mode: CardMode, hmacSecret: string | null): string {
  const groups = groupEntities(token.entities);
  const secretAttr = hmacSecret ? ` token-secret="${hmacSecret}"` : "";

  function shortcodeLine(g: PrimaryWithCompanions, indent = ""): string {
    const attr = useAliases && g.primary.alias ? `alias="${g.primary.alias}"` : `entity="${g.primary.entity_id}"`;
    return `${indent}[harvest ${attr}]`;
  }

  if (mode === "page") {
    return groups.map(g => {
      const attr = useAliases && g.primary.alias ? `alias="${g.primary.alias}"` : `entity="${g.primary.entity_id}"`;
      return `[harvest token="${token.token_id}"${secretAttr} ${attr}]`;
    }).join("\n");
  }

  if (mode === "group") {
    return `[harvest_group token="${token.token_id}"${secretAttr}]\n${groups.map(g => shortcodeLine(g, "  ")).join("\n")}\n[/harvest_group]`;
  }

  const g = groups[0];
  if (!g) return "";
  const entityAttr = useAliases && g.primary.alias ? `alias="${g.primary.alias}"` : `entity="${g.primary.entity_id}"`;
  return `[harvest token="${token.token_id}"${secretAttr} ${entityAttr}]`;
}

// ---------------------------------------------------------------------------
// Code section component
// ---------------------------------------------------------------------------

export function CodeSection({ token, setToken, setError, hmacSecret, bare }: { token: Token; setToken: (t: Token) => void; setError: (e: string | null) => void; hmacSecret: string | null; bare?: boolean }) {
  const [useAliases,      setUseAliases]      = useState(() => { try { return localStorage.getItem("hrv_use_aliases") === "true"; } catch { return false; } });
  const [tab,             setTab]             = useState<"web" | "wordpress">(() => { try { return localStorage.getItem("hrv_code_tab") === "wordpress" ? "wordpress" : "web"; } catch { return "web"; } });
  const primaryCount = token.entities.filter(e => !e.companion_of).length;
  const [cardMode,        setCardMode]        = useState<CardMode>(token.embed_mode ?? "single");

  const changeMode = async (mode: CardMode) => {
    setCardMode(mode);
    try {
      const updated = await api.tokens.update(token.token_id, { embed_mode: mode });
      setToken(updated);
    } catch (e) { setError(String(e)); }
  };
  const [overrideHost,    setOverrideHost]    = useState("");
  const [widgetScriptUrl, setWidgetScriptUrl] = useState("");

  useEffect(() => {
    api.config.get().then(c => {
      setOverrideHost(c.override_host || "");
      setWidgetScriptUrl(c.widget_script_url || "");
    }).catch(() => {});
  }, []);

  const haUrl = overrideHost || window.location.origin;
  const isPage = cardMode === "page";
  const scriptUrl = widgetScriptUrl.trim() || DEFAULT_WIDGET_SCRIPT_URL;
  const scriptTag = `<script src="${scriptUrl}"></script>`;
  const pageConfigParts = [`haUrl: "${haUrl}"`, `token: "${token.token_id}"`];
  if (isPage && hmacSecret) pageConfigParts.push(`tokenSecret: "${hmacSecret}"`);
  const setupSnippet = isPage
    ? `${scriptTag}\n<script>HArvest.config({ ${pageConfigParts.join(", ")} });</script>`
    : scriptTag;

  const cardSnippet = tab === "web"
    ? buildCardSnippet(token, useAliases, cardMode, haUrl, hmacSecret)
    : buildWordPressSnippet(token, useAliases, cardMode, hmacSecret);

  const setupCopy = useCopy(setupSnippet);
  const cardCopy = useCopy(cardSnippet);

  const formatToggle = (
    <div className="segmented" role="group" aria-label="Code format">
      <button aria-pressed={tab === "web"} onClick={() => { setTab("web"); localStorage.setItem("hrv_code_tab", "web"); }}>HTML</button>
      <button aria-pressed={tab === "wordpress"} onClick={() => { setTab("wordpress"); localStorage.setItem("hrv_code_tab", "wordpress"); }}>WordPress</button>
    </div>
  );

  const codeBody = (
    <>
      {/* Mode selector */}
      <div className="segmented" role="group" aria-label="Embed mode" style={{ marginBottom: 12 }}>
        <button
          aria-pressed={cardMode === "single"}
          onClick={() => changeMode("single")}
          disabled={primaryCount > 1}
          title={primaryCount > 1 ? "Single card requires exactly one primary entity" : undefined}
        >Single card</button>
        <button aria-pressed={cardMode === "group"} onClick={() => changeMode("group")}>Group</button>
        <button aria-pressed={cardMode === "page"} onClick={() => changeMode("page")}>Page</button>
      </div>

      {/* Step 1 - script (HTML only; WordPress plugin handles it) */}
      {tab === "web" && (
        <div className="code-block-group">
          <div className="code-block-label">
            <span className="step-pill">1</span>
            <div className="flex-1">
              <div className="code-block-title">{isPage ? "Page setup" : "Widget script"}</div>
              <div className="muted fs-12">
                {isPage
                  ? <>Add once to your site's <code>&lt;head&gt;</code>. All widgets inherit these defaults.</>
                  : <>Add once to your site's <code>&lt;head&gt;</code>.</>}
              </div>
            </div>
            <CopyBtn copied={setupCopy.copied} copy={setupCopy.copy} label={isPage ? "Copy setup" : "Copy script"} />
          </div>
          <pre className="code code-full" onClick={setupCopy.copy} title="Click to copy">{setupSnippet}</pre>
        </div>
      )}

      {/* Step 2 (or Step 1 for WordPress) */}
      <div className="code-block-group">
        <div className="code-block-label">
          <span className="step-pill">{tab === "web" ? "2" : "1"}</span>
          <div className="flex-1">
            <div className="code-block-title">{tab === "wordpress" ? "Shortcode" : "Widget markup"}</div>
            <div className="muted fs-12">
              {tab === "wordpress"
                ? "Paste into any post or page. The HArvest plugin loads the widget script automatically."
                : isPage
                  ? "Drop cards anywhere on your page. Group related cards with <hrv-group> if needed."
                  : "Drop wherever this widget should render."}
            </div>
          </div>
          <CopyBtn copied={cardCopy.copied} copy={cardCopy.copy} label={tab === "wordpress" ? "Copy shortcode" : "Copy markup"} />
        </div>
        <pre className="code code-full" onClick={cardCopy.copy} title="Click to copy">{cardSnippet}</pre>
      </div>

      {/* Alias toggle */}
      <div className="row" style={{ gap: 8, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
        <Toggle
          checked={useAliases}
          onChange={v => { setUseAliases(v); localStorage.setItem("hrv_use_aliases", String(v)); }}
          disabled={token.entities.every(e => !e.alias)}
        />
        <span>Show as aliases</span>
        <Hint text="Aliases hide your real entity IDs from the page source. Both formats work against the same token." />
      </div>
    </>
  );

  if (bare) {
    return (
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          {formatToggle}
        </div>
        {codeBody}
      </div>
    );
  }

  return (
    <Card title="Embed code" action={formatToggle}>
      {codeBody}
    </Card>
  );
}
