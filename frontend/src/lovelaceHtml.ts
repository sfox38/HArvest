/**
 * lovelaceHtml.ts - Generate downloadable HTML from parsed Lovelace structures.
 *
 * Ported from tools/lovelace_convert.py. Produces a complete HTML document
 * with HArvest widget elements, tabs, sections, and layout containers.
 */

import type { ExtractedCard, ExtractedEntity, SectionData, ViewData } from "./lovelaceParser";
import { TIER3_DOMAINS, getAllEntities, summarizeUnsupported } from "./lovelaceParser";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function indent(level: number): string {
  return "  ".repeat(level);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stackLayoutTag(cardType: string): string {
  if (cardType === "horizontal-stack") return "hrv-row";
  if (cardType === "grid") return "hrv-grid";
  return "hrv-col";
}

// ---------------------------------------------------------------------------
// Card rendering
// ---------------------------------------------------------------------------

const TEXT_ONLY_CARD_TYPES = new Set([
  "custom:mushroom-title-card",
  "custom:bubble-separator",
  "markdown",
]);

function renderCardHtml(card: ExtractedCard, indentLevel: number, companionIds: Set<string>): string {
  const ind = indent(indentLevel);
  const lines: string[] = [];

  if (!card.is_supported) {
    if (TEXT_ONLY_CARD_TYPES.has(card.card_type)) {
      const title = (card.raw_config.title ?? card.raw_config.heading ?? "") as string;
      const subtitle = (card.raw_config.subtitle ?? card.raw_config.content ?? "") as string;
      const text = title || subtitle;
      if (text) {
        lines.push(`${ind}<div class="hrv-text-card">${escapeHtml(text)}</div>`);
        return lines.join("\n");
      }
    }
    const summary = Object.keys(card.raw_config).length > 0
      ? summarizeUnsupported(card.raw_config)
      : "";
    const detail = summary ? `\n${ind}  <br>${escapeHtml(summary)}` : "";
    lines.push(`${ind}<!-- Unsupported: ${card.card_type} -->`);
    lines.push(`${ind}<div class="hrv-placeholder">`);
    lines.push(`${ind}  Unsupported card: ${escapeHtml(card.card_type)}${detail}`);
    lines.push(`${ind}</div>`);
    return lines.join("\n");
  }

  if (card.children.length > 0) {
    const tag = stackLayoutTag(card.card_type);
    let style = "";
    if (card.card_type === "grid" && card.grid_columns) {
      style = ` style="grid-template-columns: repeat(${card.grid_columns}, 1fr)"`;
    }
    lines.push(`${ind}<div class="${tag}"${style}>`);
    for (const child of card.children) lines.push(renderCardHtml(child, indentLevel + 1, companionIds));
    lines.push(`${ind}</div>`);
    return lines.join("\n");
  }

  for (const entity of card.entities) {
    if (TIER3_DOMAINS.has(entity.domain)) {
      lines.push(`${ind}<!-- Skipped (Tier 3): ${entity.entity_id} -->`);
    } else if (companionIds.has(entity.entity_id)) {
      continue;
    } else {
      lines.push(`${ind}<hrv-card entity="${entity.entity_id}"></hrv-card>`);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Deduplication rendering
// ---------------------------------------------------------------------------

function renderCardDeduped(
  card: ExtractedCard,
  indentLevel: number,
  rendered: Set<string>,
  companionIds: Set<string>,
): string {
  if (!card.is_supported && card.entities.length === 0) {
    return renderCardHtml(card, indentLevel, companionIds);
  }

  if (card.card_type === "heading") return "";

  if (card.children.length > 0) {
    const ind = indent(indentLevel);
    const childLines: string[] = [];
    for (const child of card.children) {
      const html = renderCardDeduped(child, indentLevel + 1, rendered, companionIds);
      if (html) childLines.push(html);
    }
    if (childLines.length === 0) return "";
    const tag = stackLayoutTag(card.card_type);
    let style = "";
    if (card.card_type === "grid" && card.grid_columns) {
      style = ` style="grid-template-columns: repeat(${card.grid_columns}, 1fr)"`;
    }
    return [`${ind}<div class="${tag}"${style}>`, ...childLines, `${ind}</div>`].join("\n");
  }

  const newEntities = card.entities.filter(e => !rendered.has(e.entity_id) && !companionIds.has(e.entity_id));
  if (newEntities.length === 0) return "";

  const ind = indent(indentLevel);
  const out: string[] = [];
  for (const entity of newEntities) {
    if (TIER3_DOMAINS.has(entity.domain)) {
      out.push(`${ind}<!-- Skipped (Tier 3): ${entity.entity_id} -->`);
    } else {
      rendered.add(entity.entity_id);
      out.push(`${ind}<hrv-card entity="${entity.entity_id}"></hrv-card>`);
    }
  }
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Section rendering
// ---------------------------------------------------------------------------

function renderSectionHtml(
  section: SectionData,
  indentLevel: number,
  rendered: Set<string>,
  companionIds: Set<string>,
): string {
  const ind = indent(indentLevel);
  const lines: string[] = [];
  lines.push(`${ind}<div class="hrv-section">`);
  if (section.title) {
    lines.push(`${ind}  <h3 class="hrv-section-title">${escapeHtml(section.title)}</h3>`);
  }

  const groups: [ExtractedCard | null, ExtractedCard[]][] = [];
  let currentHeading: ExtractedCard | null = null;
  let currentCards: ExtractedCard[] = [];

  for (const card of section.cards) {
    if (card.card_type === "heading") {
      if (currentHeading !== null || currentCards.length > 0) {
        groups.push([currentHeading, currentCards]);
      }
      currentHeading = card;
      currentCards = [];
    } else {
      currentCards.push(card);
    }
  }
  if (currentHeading !== null || currentCards.length > 0) {
    groups.push([currentHeading, currentCards]);
  }

  for (const [heading, cards] of groups) {
    if (heading !== null) {
      lines.push(`${ind}  <div class="hrv-card-group">`);
      lines.push(`${ind}    <div class="hrv-card-group-header">`);
      const headingText = (heading.raw_config.heading ?? "") as string;
      if (headingText) {
        lines.push(`${ind}      <span class="hrv-heading">${escapeHtml(headingText)}</span>`);
      }
      const newEnts = heading.entities.filter(
        e => !rendered.has(e.entity_id) && !TIER3_DOMAINS.has(e.domain),
      );
      if (newEnts.length > 0) {
        lines.push(`${ind}      <div class="hrv-heading-badges">`);
        for (const e of newEnts) {
          rendered.add(e.entity_id);
          lines.push(`${ind}        <hrv-card entity="${e.entity_id}"></hrv-card>`);
        }
        lines.push(`${ind}      </div>`);
      }
      lines.push(`${ind}    </div>`);
      if (cards.length > 0) {
        lines.push(`${ind}    <div class="hrv-card-group-body">`);
        for (const card of cards) {
          const html = renderCardDeduped(card, indentLevel + 3, rendered, companionIds);
          if (html) lines.push(html);
        }
        lines.push(`${ind}    </div>`);
      }
      lines.push(`${ind}  </div>`);
    } else {
      for (const card of cards) {
        const html = renderCardDeduped(card, indentLevel + 1, rendered, companionIds);
        if (html) lines.push(html);
      }
    }
  }

  lines.push(`${ind}</div>`);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Chunk filtering
// ---------------------------------------------------------------------------

function filterSectionsForChunk(sections: SectionData[], chunkIds: Set<string>): SectionData[] {
  const filtered: SectionData[] = [];
  for (const section of sections) {
    const filteredCards = filterCardsForChunk(section.cards, chunkIds);
    if (filteredCards.length > 0) {
      filtered.push({ title: section.title, cards: filteredCards });
    }
  }
  return filtered;
}

function filterCardsForChunk(cards: ExtractedCard[], chunkIds: Set<string>): ExtractedCard[] {
  const filtered: ExtractedCard[] = [];
  for (const card of cards) {
    if (!card.is_supported) {
      filtered.push(card);
      continue;
    }
    if (card.children.length > 0) {
      const childFiltered = filterCardsForChunk(card.children, chunkIds);
      if (childFiltered.length > 0) {
        filtered.push({
          ...card,
          children: childFiltered,
          entities: [],
        });
      }
      continue;
    }
    const cardEnts = card.entities.filter(e => chunkIds.has(e.entity_id));
    if (cardEnts.length > 0) {
      filtered.push({ ...card, entities: cardEnts, children: [] });
    }
  }
  return filtered;
}

// ---------------------------------------------------------------------------
// View rendering
// ---------------------------------------------------------------------------

function renderViewHtml(
  view: ViewData,
  tokenIds: string[],
  haUrl: string,
  maxPerToken: number,
  indentLevel = 2,
): string {
  const ind = indent(indentLevel);
  const lines: string[] = [];

  const companionIds = new Set<string>();
  for (const e of getAllEntities(view)) {
    if (e.companion_of) companionIds.add(e.entity_id);
  }

  for (let i = 0; i < tokenIds.length; i++) {
    lines.push(`${ind}<hrv-group token="${tokenIds[i]}" ha-url="${escapeHtml(haUrl)}">`);

    if (i === 0 && view.badges.length > 0) {
      lines.push(`${ind}  <div class="hrv-badges">`);
      const bind = indent(indentLevel + 2);
      for (const badge of view.badges) {
        for (const entity of badge.entities) {
          if (!TIER3_DOMAINS.has(entity.domain) && !companionIds.has(entity.entity_id)) {
            lines.push(`${bind}<hrv-card entity="${entity.entity_id}"></hrv-card>`);
          }
        }
      }
      lines.push(`${ind}  </div>`);
    }

    let sectionsToRender: SectionData[];
    if (tokenIds.length === 1) {
      sectionsToRender = view.sections;
    } else {
      const allEnts = getAllEntities(view);
      const seen = new Set<string>();
      const unique: ExtractedEntity[] = [];
      for (const e of allEnts) {
        if (!seen.has(e.entity_id) && !TIER3_DOMAINS.has(e.domain)) {
          seen.add(e.entity_id);
          unique.push(e);
        }
      }
      const start = i * maxPerToken;
      const end = start + maxPerToken;
      const chunkIds = new Set(unique.slice(start, end).map(e => e.entity_id));
      sectionsToRender = filterSectionsForChunk(view.sections, chunkIds);
    }

    const rendered = new Set<string>();
    if (sectionsToRender.length > 1) {
      lines.push(`${ind}  <div class="hrv-sections">`);
      for (const section of sectionsToRender) {
        lines.push(renderSectionHtml(section, indentLevel + 2, rendered, companionIds));
      }
      lines.push(`${ind}  </div>`);
    } else if (sectionsToRender.length === 1) {
      const section = sectionsToRender[0];
      if (section.title) {
        lines.push(`${ind}  <h3 class="hrv-section-title">${escapeHtml(section.title)}</h3>`);
      }
      lines.push(`${ind}  <div class="hrv-cards">`);
      for (const card of section.cards) {
        const html = renderCardDeduped(card, indentLevel + 2, rendered, companionIds);
        if (html) lines.push(html);
      }
      lines.push(`${ind}  </div>`);
    }

    lines.push(`${ind}</hrv-group>`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Full page rendering
// ---------------------------------------------------------------------------

const PAGE_CSS = `    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
           padding: 24px; background: #f5f5f5; }
    .hrv-tabs { display: flex; gap: 4px; border-bottom: 2px solid #e0e0e0;
                margin-bottom: 24px; padding: 0; }
    .hrv-tab { padding: 10px 20px; border: none; background: none; cursor: pointer;
               font-size: 0.95rem; font-weight: 500; color: #666;
               border-bottom: 3px solid transparent; margin-bottom: -2px;
               transition: color 0.2s, border-color 0.2s; }
    .hrv-tab:hover { color: #333; }
    .hrv-tab.active { color: #1976d2; border-bottom-color: #1976d2; }
    .hrv-tab-panel { display: none; }
    .hrv-tab-panel.active { display: block; }
    .hrv-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px; align-items: start; }
    .hrv-section { display: flex; flex-direction: column; gap: 12px; }
    .hrv-section-title { font-size: 1rem; font-weight: 600; color: #555;
                         padding-bottom: 6px; border-bottom: 1px solid #e8e8e8; }
    .hrv-badges { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
                  padding-bottom: 20px; }
    .hrv-card-group { border: 1px solid #e0e0e0; border-radius: 10px;
                      background: #fafafa; overflow: hidden; }
    .hrv-card-group-header { display: flex; align-items: center; gap: 12px;
                             padding: 10px 14px; background: #f0f0f0;
                             border-bottom: 1px solid #e0e0e0; flex-wrap: wrap; }
    .hrv-card-group-header .hrv-heading { font-size: 0.9rem; font-weight: 600;
                                          color: #333; }
    .hrv-card-group-body { display: flex; flex-direction: column; gap: 10px;
                           padding: 12px; }
    .hrv-heading-badges { display: flex; flex-wrap: wrap; gap: 6px;
                          align-items: center; }
    .hrv-text-card { background: #f0f0f0; border-radius: 8px; padding: 12px 16px;
                     font-size: 0.875rem; color: #555; }
    .hrv-cards { display: flex; flex-direction: column; gap: 12px; }
    .hrv-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .hrv-col { display: flex; flex-direction: column; gap: 16px; }
    .hrv-grid { display: grid; gap: 16px; }
    .hrv-placeholder { background: #fff3cd; border: 1px dashed #ffc107;
                       border-radius: 8px; padding: 16px; color: #856404;
                       font-size: 0.875rem; }`;

const TAB_JS = `  <script>
    document.querySelectorAll('.hrv-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.hrv-tab').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.hrv-tab-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  </script>`;

export function renderPage(
  views: ViewData[],
  tokenMap: Record<string, string[]>,
  haUrl: string,
  scriptUrl: string,
  maxPerToken = 50,
): string {
  const useTabs = views.length > 1;
  const parts: string[] = [];

  parts.push(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard - HArvest</title>
  <script src="${escapeHtml(scriptUrl)}"></script>
  <style>
${PAGE_CSS}
  </style>
</head>
<body>`);

  parts.push("");

  if (useTabs) {
    const tabLines = ['  <nav class="hrv-tabs">'];
    for (let i = 0; i < views.length; i++) {
      const active = i === 0 ? ' class="hrv-tab active"' : ' class="hrv-tab"';
      tabLines.push(`    <button${active} data-tab="tab-${i}">${escapeHtml(views[i].title)}</button>`);
    }
    tabLines.push("  </nav>");
    parts.push(tabLines.join("\n"));
    parts.push("");

    for (let i = 0; i < views.length; i++) {
      const tokenIds = tokenMap[views[i].title] ?? [];
      if (tokenIds.length === 0) continue;
      const active = i === 0 ? " active" : "";
      parts.push(`  <div class="hrv-tab-panel${active}" id="tab-${i}">`);
      parts.push(renderViewHtml(views[i], tokenIds, haUrl, maxPerToken));
      parts.push("  </div>");
      parts.push("");
    }
  } else {
    for (const view of views) {
      const tokenIds = tokenMap[view.title] ?? [];
      if (tokenIds.length > 0) {
        parts.push(renderViewHtml(view, tokenIds, haUrl, maxPerToken, 1));
        parts.push("");
      }
    }
  }

  if (useTabs) parts.push(TAB_JS);
  parts.push("</body>");
  parts.push("</html>");
  return parts.join("\n");
}
