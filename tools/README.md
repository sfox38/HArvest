# HArvest Tools

Standalone utilities for HArvest users and developers.

## lovelace_convert.py

Converts an existing Home Assistant Lovelace dashboard into an HTML page with embedded HArvest widgets. Connects to your HA instance via WebSocket, pulls the dashboard config, creates the necessary tokens, and outputs a ready-to-serve HTML file.

### Requirements

- Python 3.10+
- No external dependencies - standard library only
- A running HA instance with HArvest installed
- A long-lived access token (create one in HA under Profile > Security > Long-lived access tokens)

### Usage

```
python lovelace_convert.py [--dry-run]
```

The script walks you through each step interactively:

1. Connect to your HA instance (URL + access token)
2. Pick a dashboard from the list of installed dashboards
3. Choose which tabs/views to convert (skip dev tabs, unsupported content, etc.)
4. Review a summary of entities, domains, and any issues
5. Set capability defaults (badge, read, read-write, or smart auto-detection)
6. Pick an installed HArvest theme or renderer pack
7. Optionally set an origin restriction for the generated tokens
8. Specify the path to your `harvest.min.js` file
9. Tokens are created (one per tab) and the HTML file is written

Use `--dry-run` to preview everything without actually creating tokens. The output HTML will contain placeholder token IDs that you can replace later.

### What it produces

A complete, self-contained HTML file with:

- Tab navigation when the dashboard has multiple views
- HA sections layout preserved as a CSS grid of columns
- Badges rendered as a centered row at the top of each tab
- Heading cards converted to visual card groups (bordered container with header text and inline badge entities)
- `<hrv-group>` elements wrapping each tab's entities (with the token and HA URL)
- `<hrv-card>` elements for every supported entity (deduplicated per view)
- Layout containers (`hrv-row`, `hrv-col`, `hrv-grid`) matching HA's stack/grid cards
- Visible placeholder divs for unsupported cards with contextual info (entity IDs, action names, titles)
- Text-only cards (mushroom-title-card, etc.) rendered as styled text blocks

### Token management

All created tokens are prefixed with `Converted: ` so they are easily identifiable in the HArvest panel. On subsequent runs, the script offers to delete all existing `Converted:` tokens before creating new ones.

Auto-chunking: if a tab exceeds 50 entities, it is split into multiple tokens (e.g. "Converted: Fox House (1/2)", "Converted: Fox House (2/2)").

### Badge visibility

Badge entities respect HA's per-badge visibility settings (`show_name`, `show_state`, `show_icon`). These are passed as `display_hints` in the token creation payload so the HArvest BadgeCard renderer displays them correctly. Heading entities always have `badge_show_name: false`.

### Custom card handling

Custom Lovelace cards (Bubble, Mushroom, etc.) are handled as follows:

- Entity IDs are extracted recursively from the card config at any nesting depth
- If entities are found, they are included as normal `<hrv-card>` elements
- If no entities are found, a placeholder is shown with contextual info (entity, action, name)
- Text-only custom cards (mushroom-title-card, bubble-separator) show their title/subtitle text

### Limitations

- HA `button` card type is treated as unsupported (HArvest uses `harvest_action` instead)
- Tier 3 entities (cameras, locks, scripts, automations, etc.) are excluded
- Companions are not auto-detected; configure them in the HArvest panel after conversion
- Conditional card logic is dropped (the inner card is rendered unconditionally)
- Template-based custom cards (mushroom-template-card, etc.) cannot render dynamic content

---

## THEME-PACK-CONVERTING.md

A comprehensive guide for converting existing Home Assistant Lovelace card designs (like Mushroom, Bubble, etc.) into HArvest renderer packs. Written for both AI agents and human developers.

### When to use this

Use this document when you want to create a new HArvest theme pack that replicates the look-and-feel of an existing HA card set. Feed it to an AI assistant alongside the source CSS/JS of the card you want to replicate, or follow it manually as a developer.

### What it covers

- What renderer packs can and cannot do
- The pack file structure and registration pattern
- How to map HA card features to HArvest's data model (entity definitions, state updates, commands)
- Domain-by-domain conversion guidance with attribute references
- The companion system and how to use it in pack cards
- Testing and debugging workflow
- Common pitfalls and their solutions
