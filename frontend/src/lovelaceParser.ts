/**
 * lovelaceParser.ts - Parse Lovelace dashboard configs into HArvest-compatible structures.
 *
 * Ported from tools/lovelace_convert.py. Pure data transformation, no I/O.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER3_DOMAINS = new Set([
  "alarm_control_panel", "device_tracker", "camera", "scene", "update",
]);

const READ_ONLY_DOMAINS = new Set([
  "sensor", "binary_sensor", "weather", "person",
]);

const SINGLE_ENTITY_CARD_TYPES = new Set([
  "light", "thermostat", "weather-forecast", "media-control",
  "sensor", "gauge", "tile", "humidifier", "fan", "area",
]);

const MULTI_ENTITY_CARD_TYPES = new Set(["entities", "glance"]);

const STACK_CARD_TYPES = new Set(["horizontal-stack", "vertical-stack", "grid"]);

const TEXT_ONLY_CARD_TYPES = new Set([
  "custom:mushroom-title-card",
  "custom:bubble-separator",
  "markdown",
]);

export { TIER3_DOMAINS, READ_ONLY_DOMAINS };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtractedEntity {
  entity_id: string;
  domain: string;
  source_card_type: string;
  display_hints: Record<string, unknown>;
}

export interface ExtractedCard {
  card_type: string;
  entities: ExtractedEntity[];
  children: ExtractedCard[];
  is_supported: boolean;
  raw_config: Record<string, unknown>;
  grid_columns: number;
}

export interface SectionData {
  title: string;
  cards: ExtractedCard[];
}

export interface ViewData {
  title: string;
  path: string;
  sections: SectionData[];
  badges: ExtractedCard[];
}

export interface TokenSpec {
  label: string;
  entities: { entity_id: string; capabilities: string; display_hints?: Record<string, unknown> }[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getAllEntities(view: ViewData): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  for (const badge of view.badges) {
    entities.push(...badge.entities);
  }
  for (const section of view.sections) {
    collectEntities(section.cards, entities);
  }
  return entities;
}

function collectEntities(cards: ExtractedCard[], out: ExtractedEntity[]): void {
  for (const card of cards) {
    out.push(...card.entities);
    collectEntities(card.children, out);
  }
}

function extractEntityId(item: unknown): string | null {
  if (typeof item === "string") {
    return item.includes(".") ? item : null;
  }
  if (item && typeof item === "object" && "entity" in item) {
    return (item as Record<string, unknown>).entity as string ?? null;
  }
  return null;
}

export function extractAllEntityIds(card: Record<string, unknown>): string[] {
  const found: string[] = [];
  for (const [key, val] of Object.entries(card)) {
    if (key === "entity" && typeof val === "string" && val.includes(".")) {
      found.push(val);
    } else if (key === "entities" && Array.isArray(val)) {
      for (const item of val) {
        const eid = extractEntityId(item);
        if (eid) found.push(eid);
      }
    } else if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (item && typeof item === "object" && !Array.isArray(item)) {
            found.push(...extractAllEntityIds(item as Record<string, unknown>));
          }
        }
      } else {
        found.push(...extractAllEntityIds(val as Record<string, unknown>));
      }
    }
  }
  return found;
}

function badgeDisplayHints(config: Record<string, unknown>, isHeading = false): Record<string, unknown> {
  const hints: Record<string, unknown> = {};
  if (isHeading) {
    hints.badge_show_name = false;
    if (config.show_state === false) hints.badge_show_state = false;
    if (config.show_icon === false) hints.badge_show_icon = false;
  } else {
    if (config.show_name === false) hints.badge_show_name = false;
    if (config.show_name === true) hints.badge_show_name = true;
    if (config.show_state === false) hints.badge_show_state = false;
    if (config.show_icon === false) hints.badge_show_icon = false;
  }
  if (config.color) hints.badge_icon_color = config.color;
  return hints;
}

// ---------------------------------------------------------------------------
// Card extraction
// ---------------------------------------------------------------------------

function makeCard(overrides: Partial<ExtractedCard>): ExtractedCard {
  return {
    card_type: "",
    entities: [],
    children: [],
    is_supported: true,
    raw_config: {},
    grid_columns: 0,
    ...overrides,
  };
}

export function extractCard(card: Record<string, unknown>): ExtractedCard {
  const cardType = (card.type as string) ?? "";

  if (cardType === "heading") {
    const entities: ExtractedEntity[] = [];
    const entConfigs: Record<string, Record<string, unknown>> = {};
    const entList = card.entities;
    if (Array.isArray(entList)) {
      for (const item of entList) {
        if (item && typeof item === "object" && (item as Record<string, unknown>).entity) {
          entConfigs[(item as Record<string, unknown>).entity as string] = item as Record<string, unknown>;
        }
      }
    }
    for (const eid of extractAllEntityIds(card)) {
      const domain = eid.split(".")[0];
      const ecfg = entConfigs[eid] ?? {};
      const hints = badgeDisplayHints(ecfg, true);
      entities.push({ entity_id: eid, domain, source_card_type: "badge", display_hints: hints });
    }
    return makeCard({ card_type: "heading", entities, raw_config: card });
  }

  if (TEXT_ONLY_CARD_TYPES.has(cardType)) {
    return makeCard({ card_type: cardType, is_supported: false, raw_config: card });
  }

  if (cardType.startsWith("custom:")) {
    const entities: ExtractedEntity[] = [];
    for (const eid of extractAllEntityIds(card)) {
      const domain = eid.split(".")[0];
      entities.push({ entity_id: eid, domain, source_card_type: cardType, display_hints: {} });
    }
    return makeCard({ card_type: cardType, entities, is_supported: entities.length > 0, raw_config: card });
  }

  if (STACK_CARD_TYPES.has(cardType)) {
    const children = ((card.cards as Record<string, unknown>[]) ?? []).map(extractCard);
    const gridCols = cardType === "grid" ? ((card.columns as number) ?? 3) : 0;
    return makeCard({ card_type: cardType, children, grid_columns: gridCols });
  }

  if (cardType === "conditional") {
    const inner = card.card as Record<string, unknown> | undefined;
    if (inner) return extractCard(inner);
    return makeCard({ card_type: cardType, is_supported: false, raw_config: card });
  }

  if (MULTI_ENTITY_CARD_TYPES.has(cardType)) {
    const entities: ExtractedEntity[] = [];
    const items = card.entities;
    if (Array.isArray(items)) {
      for (const item of items) {
        const eid = extractEntityId(item);
        if (eid) {
          const domain = eid.split(".")[0];
          entities.push({ entity_id: eid, domain, source_card_type: cardType, display_hints: {} });
        }
      }
    }
    return makeCard({ card_type: cardType, entities });
  }

  if (SINGLE_ENTITY_CARD_TYPES.has(cardType) || "entity" in card) {
    const eid = card.entity as string | undefined;
    if (eid && eid.includes(".")) {
      const domain = eid.split(".")[0];
      return makeCard({
        card_type: cardType,
        entities: [{ entity_id: eid, domain, source_card_type: cardType, display_hints: {} }],
      });
    }
  }

  return makeCard({ card_type: cardType, is_supported: false, raw_config: card });
}

// ---------------------------------------------------------------------------
// Badge extraction
// ---------------------------------------------------------------------------

function extractBadges(badgeList: unknown[]): ExtractedCard[] {
  const badges: ExtractedCard[] = [];
  for (const badge of badgeList) {
    if (typeof badge === "string" && badge.includes(".")) {
      const domain = badge.split(".")[0];
      badges.push(makeCard({
        card_type: "badge",
        entities: [{ entity_id: badge, domain, source_card_type: "badge", display_hints: {} }],
      }));
    } else if (badge && typeof badge === "object") {
      const b = badge as Record<string, unknown>;
      const eid = b.entity as string | undefined;
      if (eid && eid.includes(".")) {
        const domain = eid.split(".")[0];
        const hints = badgeDisplayHints(b);
        badges.push(makeCard({
          card_type: "badge",
          entities: [{ entity_id: eid, domain, source_card_type: "badge", display_hints: hints }],
          raw_config: b,
        }));
      }
    }
  }
  return badges;
}

// ---------------------------------------------------------------------------
// View extraction
// ---------------------------------------------------------------------------

export function extractView(view: Record<string, unknown>): ViewData {
  const title = (view.title as string) ?? (view.path as string) ?? "Untitled";
  const path = (view.path as string) ?? "";
  const sections: SectionData[] = [];
  const allBadges: ExtractedCard[] = [];

  if (Array.isArray(view.badges)) {
    allBadges.push(...extractBadges(view.badges));
  }

  const rawSections = view.sections as Record<string, unknown>[] | undefined;
  if (Array.isArray(rawSections) && rawSections.length > 0) {
    for (const sec of rawSections) {
      const secTitle = (sec.title as string) ?? "";
      const cards = ((sec.cards as Record<string, unknown>[]) ?? []).map(extractCard);
      if (Array.isArray(sec.badges)) {
        allBadges.push(...extractBadges(sec.badges));
      }
      sections.push({ title: secTitle, cards });
    }
  } else {
    const cards = ((view.cards as Record<string, unknown>[]) ?? []).map(extractCard);
    if (cards.length > 0) {
      sections.push({ title: "", cards });
    }
  }

  return { title, path, sections, badges: allBadges };
}

// ---------------------------------------------------------------------------
// Token spec building
// ---------------------------------------------------------------------------

type CapMode = "badge" | "read" | "read-write" | "smart";

function capabilityFor(entity: ExtractedEntity, mode: CapMode): string {
  if (entity.source_card_type === "badge") return "badge";
  if (mode === "smart") {
    return READ_ONLY_DOMAINS.has(entity.domain) ? "read" : "read-write";
  }
  return mode;
}

export function buildTokenSpecs(
  views: ViewData[],
  capMode: CapMode,
  maxPerToken = 50,
): TokenSpec[] {
  const specs: TokenSpec[] = [];

  for (const view of views) {
    const allEnts = getAllEntities(view);
    const seen = new Map<string, ExtractedEntity>();
    for (const e of allEnts) {
      if (TIER3_DOMAINS.has(e.domain)) continue;
      if (!seen.has(e.entity_id)) {
        seen.set(e.entity_id, e);
      } else if (seen.get(e.entity_id)!.source_card_type === "badge" && e.source_card_type !== "badge") {
        seen.set(e.entity_id, e);
      }
    }

    const uniqueEntities = Array.from(seen.values());
    if (uniqueEntities.length === 0) continue;

    const entityDicts = uniqueEntities.map(e => {
      const d: TokenSpec["entities"][number] = {
        entity_id: e.entity_id,
        capabilities: capabilityFor(e, capMode),
      };
      if (Object.keys(e.display_hints).length > 0) {
        d.display_hints = e.display_hints;
      }
      return d;
    });

    if (entityDicts.length <= maxPerToken) {
      specs.push({ label: view.title, entities: entityDicts });
    } else {
      const totalChunks = Math.ceil(entityDicts.length / maxPerToken);
      for (let i = 0; i < totalChunks; i++) {
        const chunk = entityDicts.slice(i * maxPerToken, (i + 1) * maxPerToken);
        specs.push({ label: `${view.title} (${i + 1}/${totalChunks})`, entities: chunk });
      }
    }
  }

  return specs;
}

// ---------------------------------------------------------------------------
// Summary helpers
// ---------------------------------------------------------------------------

export function summarizeUnsupported(card: Record<string, unknown>): string {
  const hints: string[] = [];
  const eid = card.entity as string | undefined;
  if (eid) hints.push(`entity: ${eid}`);
  const action = card.tap_action as Record<string, unknown> | undefined;
  if (action && typeof action === "object") {
    const service = (action.action ?? action.service) as string | undefined;
    if (service) hints.push(`action: ${service}`);
    const target = action.target as Record<string, unknown> | undefined;
    if (target && target.entity_id) hints.push(`target: ${target.entity_id}`);
  }
  const name = card.name as string | undefined;
  if (name && !eid) hints.push(`name: ${name}`);
  if (!eid) {
    const deep = extractAllEntityIds(card);
    if (deep.length > 0) {
      hints.push(`entities: ${deep.slice(0, 4).join(", ")}`);
      if (deep.length > 4) hints.push(`...and ${deep.length - 4} more`);
    }
  }
  return hints.join("; ");
}

export function countUnsupported(cards: ExtractedCard[]): number {
  let count = 0;
  for (const card of cards) {
    if (!card.is_supported) count++;
    count += countUnsupported(card.children);
  }
  return count;
}
