/**
 * tests/icon-sets.test.js - registerIconSet/getIconSet registry behaviour,
 * renderIconSVG/resolveIcon prefixed lookup, and the icon-set-loader's
 * script injection + memoization.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  MDI_ICONS,
  registerIconSet,
  getIconSet,
  renderIconSVG,
  resolveIcon,
  iconNameForSet,
} from "../src/icons.js";
import { ensureIconSet, KNOWN_ICON_SETS } from "../src/icon-set-loader.js";

const FA_BODY = '<path d="M0 0h512v512z" fill="currentColor"/>';
const TABLER_BODY =
  '<path d="M4 4l16 16" fill="none" stroke="currentColor" stroke-width="2"/>';

describe("registerIconSet / getIconSet", () => {
  it("registers a set and resolves entries through renderIconSVG", () => {
    registerIconSet("fa", {
      icons: { "fa:bolt": { body: FA_BODY, viewBox: "0 0 448 512" } },
    });
    const svg = renderIconSVG("fa:bolt", "icon");
    expect(svg).toContain('viewBox="0 0 448 512"');
    expect(svg).toContain("M0 0h512v512z");
  });

  it("renders stroke-based bodies unmodified", () => {
    registerIconSet("tabler", {
      icons: { "tabler:bolt": { body: TABLER_BODY, viewBox: "0 0 24 24" } },
    });
    const svg = renderIconSVG("tabler:bolt", "icon");
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('fill="none"');
  });

  it("resolves one hop through aliases", () => {
    registerIconSet("fa", {
      icons: { "fa:bolt": { body: FA_BODY, viewBox: "0 0 448 512" } },
      aliases: { "mdi:flash": "fa:bolt" },
    });
    const set = getIconSet("fa");
    expect(set.aliases["mdi:flash"]).toBe("fa:bolt");
    // _lookup only consults a set when the prefix matches its key, so the
    // mdi: alias is inert at render time (mdi: routes to the bundle)...
    expect(renderIconSVG("mdi:flash", "icon")).toContain(
      MDI_ICONS["mdi:flash"].slice(0, 20),
    );
    // ...but a same-prefix alias resolves.
    registerIconSet("fa", {
      icons: { "fa:bolt": { body: FA_BODY, viewBox: "0 0 448 512" } },
      aliases: { "fa:zap": "fa:bolt" },
    });
    expect(renderIconSVG("fa:zap", "icon")).toContain("M0 0h512v512z");
  });

  it("warns and overrides on collision (last-write-wins)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerIconSet("dup", {
      icons: { "dup:a": { body: FA_BODY, viewBox: "0 0 24 24" } },
    });
    registerIconSet("dup", {
      icons: { "dup:b": { body: FA_BODY, viewBox: "0 0 24 24" } },
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('overriding existing icon set "dup"'),
    );
    expect(getIconSet("dup").icons["dup:b"]).toBeTruthy();
    expect(getIconSet("dup").icons["dup:a"]).toBeUndefined();
    warn.mockRestore();
  });

  it("ignores invalid sets with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerIconSet("bad", null);
    registerIconSet("bad2", { icons: "nope" });
    expect(getIconSet("bad")).toBeUndefined();
    expect(getIconSet("bad2")).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});

describe("resolveIcon with prefixed names", () => {
  it("falls back for unregistered prefixes and resolves registered ones", () => {
    expect(resolveIcon("zz:nothing", "mdi:lightbulb")).toBe("mdi:lightbulb");
    registerIconSet("zz", {
      icons: { "zz:thing": { body: FA_BODY, viewBox: "0 0 24 24" } },
    });
    expect(resolveIcon("zz:thing", "mdi:lightbulb")).toBe("zz:thing");
    expect(resolveIcon("zz:other", "mdi:lightbulb")).toBe("mdi:lightbulb");
  });

  it("still treats mdi:help-circle as unresolved", () => {
    expect(resolveIcon("mdi:help-circle", "mdi:eye")).toBe("mdi:eye");
  });
});

describe("iconNameForSet (token/theme icon_set translation)", () => {
  const ENTRY = { body: FA_BODY, viewBox: "0 0 256 256" };

  it("translates mdi names through the set aliases, with weight suffixes", () => {
    registerIconSet("ph", {
      icons: {
        "ph:lightbulb": ENTRY,
        "ph:lightbulb-duotone": ENTRY,
      },
      aliases: { "mdi:lightbulb": "ph:lightbulb" },
    });
    expect(iconNameForSet("mdi:lightbulb", "ph")).toBe("ph:lightbulb");
    expect(iconNameForSet("mdi:lightbulb", "ph-duotone")).toBe("ph:lightbulb-duotone");
    // weight variant missing: falls back to the base set name
    expect(iconNameForSet("mdi:lightbulb", "ph-thin")).toBe("ph:lightbulb");
  });

  it("passes through unmapped, non-mdi, unloaded-set, and mdi-set inputs", () => {
    registerIconSet("ph", {
      icons: { "ph:lightbulb": ENTRY },
      aliases: { "mdi:lightbulb": "ph:lightbulb" },
    });
    expect(iconNameForSet("mdi:zigbee-unmapped", "ph")).toBe("mdi:zigbee-unmapped");
    expect(iconNameForSet("fa:bolt", "ph")).toBe("fa:bolt");
    expect(iconNameForSet("mdi:lightbulb", "nope")).toBe("mdi:lightbulb");
    expect(iconNameForSet("mdi:lightbulb", "mdi")).toBe("mdi:lightbulb");
    expect(iconNameForSet("mdi:lightbulb", null)).toBe("mdi:lightbulb");
  });
});

describe("renderIconSVG fallback", () => {
  it("renders the dot fallback for unknown prefixed names", () => {
    const svg = renderIconSVG("nope:missing", "icon");
    expect(svg).toContain(MDI_ICONS["mdi:circle-small"].slice(0, 20));
  });
});

describe("ensureIconSet", () => {
  let appended;
  let origAppend;
  let origRemove;

  beforeEach(() => {
    appended = [];
    origAppend = document.head.appendChild.bind(document.head);
    origRemove = document.head.removeChild.bind(document.head);
    vi.spyOn(document.head, "appendChild").mockImplementation((el) => {
      appended.push(el);
      return el;
    });
    vi.spyOn(document.head, "removeChild").mockImplementation((el) => el);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves false for unknown prefixes without injecting", async () => {
    await expect(ensureIconSet("nope", "https://ha.local")).resolves.toBe(false);
    expect(appended.length).toBe(0);
  });

  it("injects one release-busted script per known prefix and memoizes", async () => {
    expect(KNOWN_ICON_SETS.fa).toBe("/harvest_assets/icon-sets/fa.js");
    const p1 = ensureIconSet("fa", "https://ha.local");
    const p2 = ensureIconSet("fa", "https://ha.local");
    expect(p2).toBe(p1);
    expect(appended.length).toBe(1);
    const script = appended[0];
    expect(script.src).toContain("https://ha.local/harvest_assets/icon-sets/fa.js?v=");
    expect(script.src).not.toContain("_=");
    script.onload();
    await expect(p1).resolves.toBe(true);
  });

  it("resolves false on load error", async () => {
    const p = ensureIconSet("tabler", "https://ha.local");
    expect(appended.length).toBe(1);
    appended[0].onerror();
    await expect(p).resolves.toBe(false);
  });
});
