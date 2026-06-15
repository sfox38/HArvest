/**
 * CodeSection.snippet.test.ts
 *
 * Regression tests for the embed-snippet builders, focused on the
 * entities-block nesting. The group must wrap the entities block, which wraps
 * the cards (group > entities-block > cards) in BOTH the HTML and WordPress
 * output. A previous bug emitted the WordPress shortcodes with the block
 * wrapping the group, which broke the block's row layout.
 */

import { describe, it, expect } from "vitest";
import { buildWordPressSnippet, buildCardSnippet } from "./CodeSection";
import type { Token } from "../types";

function makeToken(): Token {
  return {
    token_id: "hwt_pwI8PwMkUL2iNp8jwCB38b",
    entities: [
      { entity_id: "light.nuca_lamp" },
      { entity_id: "light.led_living_room_ceiling_light" },
    ],
  } as unknown as Token;
}

describe("buildWordPressSnippet - entities block nesting", () => {
  it("nests harvest_group OUTSIDE harvest_entities_block in group mode", () => {
    const out = buildWordPressSnippet(makeToken(), false, "group", null, true);

    const groupOpen = out.indexOf("[harvest_group");
    const blockOpen = out.indexOf("[harvest_entities_block]");
    const blockClose = out.indexOf("[/harvest_entities_block]");
    const groupClose = out.indexOf("[/harvest_group]");

    expect(groupOpen).toBeGreaterThanOrEqual(0);
    expect(blockOpen).toBeGreaterThan(groupOpen); // block opens inside group
    expect(blockClose).toBeGreaterThan(blockOpen);
    expect(groupClose).toBeGreaterThan(blockClose); // group is the outermost
    expect(out).toContain('[harvest entity="light.nuca_lamp"]');
  });

  it("emits a block with no group in page mode", () => {
    const out = buildWordPressSnippet(makeToken(), false, "page", null, true);
    expect(out).toContain("[harvest_entities_block]");
    expect(out).not.toContain("[harvest_group");
  });
});

describe("buildCardSnippet - entities block nesting (HTML parity)", () => {
  it("nests hrv-group OUTSIDE hrv-entities-block in group mode", () => {
    const out = buildCardSnippet(makeToken(), false, "group", "http://ha", null, true);

    const groupOpen = out.indexOf("<hrv-group");
    const blockOpen = out.indexOf("<hrv-entities-block>");
    const blockClose = out.indexOf("</hrv-entities-block>");
    const groupClose = out.indexOf("</hrv-group>");

    expect(groupOpen).toBeGreaterThanOrEqual(0);
    expect(blockOpen).toBeGreaterThan(groupOpen);
    expect(blockClose).toBeGreaterThan(blockOpen);
    expect(groupClose).toBeGreaterThan(blockClose);
  });
});
