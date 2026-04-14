# HArvest Panel UI Design

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

This document specifies the design, layout, and behaviour of the HArvest custom sidebar panel. It is intended as a complete implementation guide for the panel UI, supplementing the protocol specification in SPEC.md.

The panel is built in TypeScript with React, compiled to a single JS bundle by Vite. It is registered as a custom HA frontend panel by `panel.py` and served from the `frontend/dist/` directory. The compiled bundle is committed to the repository; HACS users do not need Node.js or Vite. Contributors developing the panel do.

---

## Table of Contents

1. [Panel Structure](#panel-structure)
2. [Global Layout](#global-layout)
3. [Token List Screen](#token-list-screen)
4. [Token Detail Screen](#token-detail-screen)
5. [Activity Log Screen](#activity-log-screen)
6. [Settings Screen](#settings-screen)
7. [Widget Creation Wizard](#widget-creation-wizard)
8. [Shared Components](#shared-components)
9. [Responsive Behaviour](#responsive-behaviour)
10. [Visual Design](#visual-design)

---

## 1. Panel Structure

The panel registers at the HA sidebar as "HArvest" with the `mdi:leaf` icon. It occupies the full HA content area to the right of the sidebar.

The panel has five top-level screens navigated via a persistent top navigation bar:

| Nav Item | Icon | Screen |
|----------|------|--------|
| Dashboard | `mdi:view-dashboard` | Home screen with global sensor cards (default) |
| Tokens | `mdi:key-variant` | Token list |
| Activity | `mdi:chart-timeline-variant` | Global activity log |
| Settings | `mdi:cog` | Integration configuration |
| Help | `mdi:help-circle-outline` | Links to docs and GitHub |

The Dashboard is the home screen. The panel opens here every time.

The global stats bar is not shown as a separate bar on the Dashboard screen because the Dashboard itself is the expanded version of that information. On all other screens, a compact collapsible stats bar appears at the top.

---

## 2. Global Layout

### Dashboard Home Screen

The Dashboard is the first thing the user sees when they open the HArvest panel. It gives a complete at-a-glance view of the integration's health and activity without navigating into any sub-screen.

```
+------------------------------------------------------------------+
|  [HArvest]  Dashboard  Tokens  Activity  Settings  Help          |
+------------------------------------------------------------------+
|                                                                  |
|  HArvest Dashboard                    [integration: running]     |
|                                                                  |
|  +------------------+  +------------------+  +-----------------+ |
|  |  Active Sessions |  |  Active Tokens   |  |  Commands Today | |
|  |       3          |  |       7          |  |      142        | |
|  |  mdi:connection  |  |  mdi:key         |  |  mdi:lightning-bolt | |
|  +------------------+  +------------------+  +-----------------+ |
|                                                                  |
|  +------------------+  +------------------+                      |
|  |  Errors Today    |  |  DB Size         |                      |
|  |       0          |  |    2.4 MB        |                      |
|  |  mdi:alert-circle|  |  mdi:database    |                      |
|  +------------------+  +------------------+                      |
|                                                                  |
|  Activity (last 24 hours)                                        |
|  Commands/hr   [___|__|___|__|__|__|____|__|___|__|__|__|___|_]  |
|  Sessions      [           .--.      .---.                    ]  |
|  Auth failures [   |                        |                 ]  |
|                                                                  |
|  Recent Activity                              [View all ->]      |
|  +------------------------------------------------------------+  |
|  |  10:23  AUTH_OK     Bedroom widgets   myblog.com           |  |
|  |  10:22  AUTH_FAIL   Bedroom widgets   unknown.site         |  |
|  |  10:21  COMMAND     Office token      office.corp.com      |  |
|  |  10:20  AUTH_OK     Office token      office.corp.com      |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  Tokens Expiring Soon                                            |
|  +------------------------------------------------------------+  |
|  |  Office dashboard          Expires in 5 days  [View]       |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|                                          +------------------+    |
|                                          | + Create Widget  |    |
|                                          +------------------+    |
+------------------------------------------------------------------+
```

**Sensor cards:** each card shows the live value of the corresponding global diagnostic sensor, an icon, and a label. Icons match those defined in `diagnostics.md` for each sensor. Note that the sidebar "Tokens" navigation item uses `mdi:key-variant` (a UI navigation choice) while the `sensor.harvest_active_tokens` card uses `mdi:key` (the sensor's own icon) - these are intentionally different. Clicking a card navigates to the relevant filtered view - clicking "Active Sessions" opens the Activity Log filtered to active sessions; clicking "Errors Today" opens the Activity Log filtered to errors.

**Activity graphs:** three SVG graphs displaying hourly activity over the last 24 hours. All three are rendered in pure SVG with no charting library dependency. Graph data is sourced from `activity_store.query_aggregates()`.

- Commands per hour (bar graph). Each bar represents one hour. Bar height scales to the hourly maximum across the 24-hour window.
- Active sessions over time (line graph). Approximated from session connect and disconnect events in the activity store.
- Auth failures per hour (bar graph). Bars are rendered in amber to signal security attention without being alarming.

Each graph has a small axis label showing the metric name and the peak value for the window. Hovering a bar or point shows a tooltip with the exact value and hour. The graphs update when the page is loaded; they do not poll continuously.

**Recent Activity:** the last 4 activity log entries across all tokens. Clicking "View all" navigates to the Activity Log screen. Clicking any row navigates to the Activity Log with that event expanded.

**Tokens Expiring Soon:** any tokens expiring within 7 days are listed here with a direct link to their token detail screen. If none are expiring soon, this section is hidden.

**Integration status:** the `binary_sensor.harvest_running` state is shown in the top right of the dashboard. Green "running" or red "stopped" with a timestamp of last state change.

### Global Stats Bar (non-Dashboard screens)

On all screens except the Dashboard and the wizard, a compact stats bar appears below the top navigation bar. It is always visible by default and collapsible by clicking a chevron.

```
+------------------------------------------------------------------+
|  Sessions: 3   Tokens: 7   Commands: 142   Errors: 0   [^]      |
+------------------------------------------------------------------+
```

Clicking any value navigates to the relevant filtered view, identical to clicking the Dashboard sensor cards.

### Top Navigation Bar

```
+------------------------------------------------------------------+
|  [HArvest logo/name]  Dashboard  Tokens  Activity  Settings  Help|
+------------------------------------------------------------------+
```

The active tab is underlined. The "Tokens" tab shows a badge with the count of active (non-expired, non-revoked) tokens.

### Floating Action Button

A "Create Widget" button floats in the bottom-right corner of every screen. Clicking it opens the Widget Creation Wizard as a modal overlay. This button is always visible regardless of which screen is active, because creating a widget is the primary action in the panel.

```
                                          +------------------+
                                          | + Create Widget  |
                                          +------------------+
```

---

## 3. Token List Screen

This is the home screen. It displays all tokens belonging to the logged-in HA user.

### Layout

A search/filter bar at the top, followed by a list of token cards. One token card per row.

```
+------------------------------------------------------------------+
| Search tokens...                    [Filter: All v]  [+ Create]  |
+------------------------------------------------------------------+
| +------------------------------------------------------------+   |
| |  [key icon]  Bedroom widgets - myblog.com        [ACTIVE]  |   |
| |  myblog.com  -  3 entities  -  2 active sessions           |   |
| |  Expires: 31 Dec 2026             [Edit] [Duplicate] [...]  |   |
| +------------------------------------------------------------+   |
| +------------------------------------------------------------+   |
| |  [key icon]  Office dashboard                  [INACTIVE]  |   |
| |  office.corp.com  -  8 entities  -  0 sessions             |   |
| |  Outside schedule window (Mon-Fri 09:00-18:00)             |   |
| |  Expires: never                   [Edit] [Duplicate] [...]  |   |
| +------------------------------------------------------------+   |
| +------------------------------------------------------------+   |
| |  [key icon]  Test token                          [EXPIRED]  |   |
| |  allow any  -  1 entity  -  0 sessions                     |   |
| |  Expired: 1 Apr 2026              [Duplicate]    [Delete]   |   |
| +------------------------------------------------------------+   |
+------------------------------------------------------------------+
```

### Token Card

Each token card displays:

- Status badge: `ACTIVE` (green), `INACTIVE` (amber, outside schedule window), `EXPIRING SOON` (amber, within 7 days of expiry), `EXPIRED` (grey), `REVOKED` (red)
- Token label
- Primary origin or "allow any"
- Entity count and active session count
- Expiry date or "never" or schedule note
- Action buttons

**Future improvement - token risk indicator:** a secondary badge derived from the token's capability and security settings, giving the owner an at-a-glance security assessment without opening the token. Proposed states:

| Badge | Condition |
|-------|-----------|
| `READ-ONLY` | All entities read-only |
| `READ-WRITE · PUBLIC` | Write capability, no HMAC |
| `READ-WRITE · HMAC SECURED` | Write capability with HMAC token secret |
| `READ-ONLY · IP RESTRICTED` | Read-only with `allowed_ips` set |
| `READ-WRITE · RESTRICTED` | Write with HMAC, IP, or schedule restriction active |

This badge is deferred from v1. No panel code or API changes are required to add it later since all inputs are already present on the token object.

**Action buttons:**

- `Edit` - opens the token detail screen in edit mode
- `Duplicate` - creates a new token with the same settings, opens the wizard at step 6 (generate) with the duplicated config pre-filled
- `...` (overflow menu) - contains: View sessions, Revoke, Delete

Clicking anywhere on the token card (outside the action buttons) navigates to the token detail screen.

### Filter Options

The filter dropdown supports: All, Active only, Expiring soon, Expired, Revoked.

### Empty State

When no tokens exist, the list shows a centred empty state:

```
+------------------------------------------------------------------+
|                                                                  |
|              [large leaf icon]                                   |
|                                                                  |
|         No widgets yet.                                          |
|                                                                  |
|         Create your first widget to embed live Home              |
|         Assistant cards on any webpage.                          |
|                                                                  |
|                    [ + Create Widget ]                           |
|                                                                  |
+------------------------------------------------------------------+
```

### Pagination

The token list shows 20 tokens per page. Navigation controls appear at the bottom when there are more than 20 tokens.

```
Showing 1-20 of 47 tokens          [< Prev]  Page 1 of 3  [Next >]
```

### Archived Tokens

Expired and revoked tokens are separated from active tokens to prevent clutter. They appear in a collapsible "Archived tokens" section at the bottom of the list, collapsed by default. Archived tokens are paginated separately (20 per page) from active tokens.

```
+------------------------------------------------------------------+
|  [>] Archived tokens (12)                                        |
+------------------------------------------------------------------+
```

Expanding the archived section shows expired and revoked tokens with reduced visual prominence (lighter text, no session count). Duplicate and Delete are the only available actions on archived tokens. Revoked tokens show their revoke reason if one was set.

---

## 4. Token Detail Screen

Opened by clicking a token card in the list. Uses a side-by-side split layout: token information and generated code on the left, live sessions and activity on the right.

### Header (full width, above the split)

```
+------------------------------------------------------------------+
|  [<- Back to tokens]                                             |
|                                                                  |
|  Bedroom widgets - myblog.com                    [ACTIVE]        |
|  hwt_a3f9bc2d114ef5a6b...  [copy]                                  |
|  Created 31 Mar 2026 by admin                    [Edit] [...]    |
+------------------------------------------------------------------+
```

The token ID is truncated to the first 12 characters with a copy button that copies the full ID. The `...` overflow menu contains: Revoke, Duplicate, Delete.

### Left Panel: Token Info and Code

The left panel is approximately 55% of the available width. It scrolls independently of the right panel.

**Entities section**

A list of all entities in the token, each showing:
- Entity icon (from HA)
- Friendly name
- Entity ID (smaller, muted)
- Alias (if set, shown alongside entity ID as `alias: dJ5x3Apd`)
- Capability badge: `READ` or `READ-WRITE`
- Support tier badge: `Tier 1` (green dot), `Tier 2` (amber dot)
- Excluded attributes list if any (collapsed by default)

**Origins section**

Shows allowed origins, allow_paths if set, and whether allow_any is enabled. If allow_any is enabled with read-write capability, a yellow warning banner is shown:

```
+-- Warning ------------------------------------------+
|  This token allows write access from any website.   |
+-----------------------------------------------------+
```

**Schedule, Security, Rate Limits sections**

Shown only when non-default values are set. Each collapses to a single summary line when the values are all defaults, to reduce visual noise for simple tokens.

**Code section**

The generated HTML snippet, always visible at the bottom of the left panel without needing to navigate to a separate tab. The snippet is regenerated from the stored `token_id` on demand. The `token_secret` is never shown here or anywhere in the panel after the initial creation screen - only the `token_id` is used to generate the code.

A "Show as aliases" checkbox (identical to the one in the wizard Step 6) toggles the snippet between `entity=` and `alias=` attribute names. Both formats work against the same token. Companion references in the snippet toggle together with the primary entity. The checkbox defaults to unchecked.

```
Your widget code

[ ] Show as aliases                       [?]

Step 1: Add to your page <head> once
+--------------------------------------------------+
| <script src="...harvest.min.js"></script>         |
| <script>HArvest.config({                          |
|   haUrl: "https://myhome.duckdns.org",           |
|   token: "hwt_a3F9bC2d114eF5A6b7c8dE",            |
| });</script>                                      |
+--------------------------------------------------+
                               [Copy]

Step 2: Paste where you want the widget
+--------------------------------------------------+
| <hrv-card entity="light.bedroom_main"></hrv-card> |
+--------------------------------------------------+
                               [Copy]

[Show WordPress instructions]

Live preview:
+------------------+
|  [live card]     |
+------------------+
```

The live preview renders an actual `<hrv-card>` element connected to HA using this token. If the token has multiple entities, a small dropdown selects which to preview. If the token has companions defined, a toggle shows the card with and without companion controls. The "Show as aliases" checkbox controls the snippet format but does not affect the live preview - the preview always connects using the token's internal entity mapping regardless of which format is shown in the code.

### Right Panel: Sessions and Activity

The right panel is approximately 45% of the available width. It has two vertically stacked sections separated by a divider.

**Sessions section (top half of right panel)**

```
Active Sessions (2)                        [Terminate all]

Session hrs_f9A2b3...
Origin: https://myblog.com/smarthome
Connected: 14 minutes ago
Entities: light.bedroom_main, fan.bedroom_ceiling
Renewals: 0 of unlimited                       [Terminate]

Session hrs_a1B2c3...
Origin: https://myblog.com/about
Connected: 2 minutes ago
Entities: light.bedroom_main
Renewals: 1 of unlimited                       [Terminate]
```

Updates live without page refresh. If no sessions are active, "No active sessions" is shown with a note that sessions appear here when someone opens a page with this widget embedded.

Terminating a session closes the WebSocket connection immediately server-side. The widget on the visitor's page enters `HRV_STALE` and attempts reconnection.

**Activity section (bottom half of right panel)**

A per-token sparkline graph appears at the top of this section, showing session activity for this token over the last 7 days. The sparkline is a compact SVG line graph with no axis labels - it conveys trend at a glance rather than precise values. Hovering shows a tooltip with the exact session count for that day.

Below the sparkline, a filtered activity log shows only events for this token. Includes its own date range picker and event type filter.

```
This token's activity     [Last 7 days v]  [All types v]

Sessions (7 days):  .__.--._.
                    M  T  W  T  F  S  S

10:23  AUTH_OK     myblog.com/smarthome
10:22  AUTH_FAIL   unknown.site            HRV_ORIGIN_DENIED
10:21  COMMAND     light.bedroom_main      turn_on
10:20  SESSION_END myblog.com              normal close
...

[View in full activity log]
```

Clicking any row expands it to show full details. "View in full activity log" navigates to the Activity Log screen pre-filtered to this token.

### Edit Mode

The "Edit" button in the header switches the left panel's read-only display to editable fields. The right panel (sessions and activity) continues to update live during editing.

Changes are saved by clicking "Save changes" which appears at the top of the left panel in edit mode. A "Discard changes" button cancels without saving.

**Fields that cannot be edited after creation:**

- `token_id` (immutable)
- `token_secret` (the plaintext is not retained by the integration after creation; only a hash is stored server-side. The secret cannot be displayed or recovered.)
- `created_at`, `created_by` (audit fields)

**Entity edits:** entities can be added or removed. Removing an entity does not immediately affect active sessions - they continue receiving updates for the removed entity until they next reconnect, at which point it is out of scope. A notice in the edit UI explains this.

### Revoke and Delete

Accessible from the `...` overflow menu in the header.

**Revoke:** marks the token as revoked immediately. All active sessions receive an `auth_failed` close and are terminated within seconds. The token remains in the list with a REVOKED badge and cannot be un-revoked. A reason field is optional.

**Delete:** permanently removes the token and all associated activity log entries. Only available on tokens that are already expired or revoked. Active tokens must be revoked first. A confirmation dialog prevents accidental deletion.

---

## 5. Activity Log Screen

The global activity log. Shows all events across all tokens, with filtering.

### Layout

```
+------------------------------------------------------------------+
|  Activity Log                                                    |
|                                                                  |
|  [Date range: Last 7 days v]  [Token: All v]  [Type: All v]     |
+------------------------------------------------------------------+
|  04 Apr 2026 10:23  AUTH_OK       hwt_a3f9...  myblog.com        |
|  04 Apr 2026 10:22  AUTH_FAIL     hwt_a3f9...  unknown.site      |
|  04 Apr 2026 10:21  COMMAND       hwt_a3f9...  light.bedroom     |
|  04 Apr 2026 10:20  SESSION_END   hwt_a3f9...  myblog.com        |
|  04 Apr 2026 10:18  AUTH_OK       hwt_b4c8...  office.corp.com   |
|  ...                                                             |
+------------------------------------------------------------------+
|  Showing 1-50 of 1,247 events          [< Prev]  [Next >]        |
+------------------------------------------------------------------+
```

### Event Types

| Type | Description |
|------|-------------|
| `AUTH_OK` | Successful authentication |
| `AUTH_FAIL` | Failed authentication (code shown on expand) |
| `COMMAND` | Write command sent |
| `SESSION_END` | Session closed (reason shown on expand) |
| `TOKEN_REVOKED` | Token was revoked |
| `RENEWAL` | Session renewal |
| `SUSPICIOUS_ORIGIN` | Origin mismatch detected |
| `FLOOD_PROTECTION` | Flood protection triggered |
| `RATE_LIMITED` | Rate limit hit |

### Row Expand

Clicking any row expands it to show full details: full token ID, full origin URL, full entity ID, error code for failures, session ID, IP address.

### Pagination

The activity log shows 50 events per page. Navigation controls appear at the bottom.

```
Showing 1-50 of 1,247 events       [< Prev]  Page 1 of 25  [Next >]
```

### Export

A "Export CSV" button downloads the current filtered view as a CSV file for external analysis. The panel calls the HTTP views layer which invokes `activity_store.export_csv()` with the current filter parameters. The response is streamed as `text/csv` with a `Content-Disposition: attachment` header so the browser triggers a file download directly.

---

## 6. Settings Screen

Exposes the global integration configuration defined in SPEC.md Section 19, plus theme management and origin management.

### Auto-save Behaviour

All editable fields in Settings use auto-save rather than an explicit Save button. The save is triggered on blur (field loses focus) with a 300ms debounce on typing to prevent saves on every keystroke. Field states:

- **Typing:** neutral border
- **Saving:** small spinner appears inside the right edge of the field border
- **Saved:** border briefly flashes green, a small checkmark fades in then out over 1.5 seconds
- **Error:** red border with an inline error message below the field, persists until the value is corrected

Destructive changes (removing an allowed origin that is in use by an existing token, reducing a hard cap below the current usage) require an explicit confirmation dialog before auto-saving.

### Layout

```
+------------------------------------------------------------------+
|  Settings                                                        |
+------------------------------------------------------------------+
|                                                                  |
|  [v] Allowed Origins                                             |
|  Reusable origins available to all tokens. Origins created here  |
|  appear in the widget wizard's origin dropdown.                  |
|                                                                  |
|  myblog.com         https://myblog.com          [Edit] [Delete]  |
|  Office intranet    https://office.corp.com:8080  [Edit] [Delete]|
|                                                                  |
|  [ + Add new origin ]                                            |
|                                                                  |
|  [v] Themes                                                      |
|  Themes available in the widget wizard and token detail screens. |
|                                                                  |
|  Default           (bundled)                                     |
|  Glassmorphism     (bundled)                                     |
|  Accessible        (bundled)                                     |
|  My Corporate      https://cdn.corp.com/hrv-theme.json  [Delete] |
|                                                                  |
|  [ + Add theme from URL ]                                        |
|                                                                  |
|  [v] Connection                                                  |
|  Auth timeout              [ 10        ] seconds                 |
|  Keepalive interval        [ 30        ] seconds                 |
|  Keepalive timeout         [ 10        ] seconds                 |
|  Client heartbeat          [ 60        ] seconds                 |
|                                                                  |
|  [v] Tokens                                                      |
|  Max entities per token    [ 50        ]                         |
|  Max entities hard cap     [ 250       ]                         |
|  Max inbound message       [ 4096      ] bytes                   |
|                                                                  |
|  [v] Rate Limiting                                               |
|  Max push per second       [ 1         ]                         |
|  Max commands per minute   [ 30        ]                         |
|  Auth attempts per token   [ 10        ] / min                   |
|  Auth attempts per IP      [ 20        ] / min                   |
|  Max connections / min     [ 100       ]                         |
|                                                                  |
|  [v] Sessions                                                    |
|  Default lifetime          [ 60        ] minutes                 |
|  Max lifetime              [ 1440      ] minutes                 |
|  Absolute lifetime cap     [ 72        ] hours                   |
|                                                                  |
|  [v] Activity Log                                                |
|  Retention                 [ 30        ] days                    |
|  Database file             harvest_activity.db   2.4 MB          |
|  [!] This file is not included in HA's default backup.           |
|                                                                  |
|  [v] HA Event Bus                                                |
|  Token revoked             [ON ]                                 |
|  Suspicious origin         [ON ]                                 |
|  Session limit reached     [ON ]                                 |
|  Flood protection          [ON ]                                 |
|  Session connected         [OFF]                                 |
|  Auth failure              [OFF]                                 |
|                                                                  |
|  [ Reset all to defaults ]                                       |
+------------------------------------------------------------------+
```

### Allowed Origins Section

Each saved origin has a friendly name (user-assigned), a full origin URL (scheme + host + optional port), and optional path restrictions. Adding an origin:

1. User clicks "+ Add new origin"
2. An inline form expands: friendly name field, URL field, optional path field
3. On save, the integration validates the URL format and stores it
4. The origin immediately appears in the wizard's Step 3 dropdown

Editing an existing origin updates all tokens that reference it. A warning is shown if the edit would restrict an origin currently in use by active sessions.

### Themes Section

Bundled themes (Default, Glassmorphism, Accessible) are listed as read-only. Custom themes are added via URL:

1. User clicks "+ Add theme from URL"
2. An inline form expands: friendly name field, URL field
3. The integration fetches the URL, validates it is valid HArvest theme JSON, and stores it with the friendly name
4. The theme immediately appears in the wizard's Step 5 dropdown and the token detail Code section

If the URL returns invalid JSON or a non-theme JSON structure, an inline error is shown and the theme is not saved. Bundled themes cannot be deleted. Custom themes can be deleted; deleting a theme does not affect tokens already using it (the URL is stored on the token, not a reference to the registry entry).

---

## 7. Widget Creation Wizard

The wizard opens as a full-screen modal overlay on top of any panel screen. It can be dismissed at any step using an X button in the top right, with a "Discard and close" confirmation if the user has progressed past step 1.

The wizard is create-only. Editing an existing token uses the token detail edit mode (Section 4).

Progress is shown as a step indicator at the top of the modal.

```
+------------------------------------------------------------------+
|  Create Widget                                               [X] |
|                                                                  |
|  [1] Entities  [2] Permissions  [3] Origin  [4] Expiry          |
|  [5] Appearance  [6] Done                                        |
|                                                                  |
|  [ step content ]                                                |
|                                                                  |
|                    [< Back]          [Continue >]                |
+------------------------------------------------------------------+
```

### Wizard Memory

The wizard stores its last-used values in `localStorage` (panel-scoped). On next open, the following fields are pre-populated with the previous session's choices:

- Selected origin (from the dropdown)
- Selected expiry option
- Selected theme
- Selected permission (read vs read-write)

The entity selection is intentionally never remembered - selecting the right entity is always a deliberate choice and pre-filling it would likely cause mistakes.

### Step 1: Pick Entities

A mode toggle at the top allows switching between single card and group modes.

```
(*) Single card      ( ) Group of cards
```

**Single card mode (default)**

A search input filters the entity list. The list shows all HA entities with icon, friendly name, entity ID, domain badge, and a support tier dot (green for Tier 1, amber for Tier 2). Tier 3 entities are greyed out and not selectable. Hovering or tapping a Tier 3 entity shows a tooltip: "This entity type cannot be embedded publicly. [Learn more]"

The list is grouped by domain by default. A toggle switches to alphabetical order by friendly name. One entity may be selected as the primary entity.

After selecting a primary entity, an "Add companion entities (optional)" section expands. It shows only companion-compatible entities. Up to 4 companions may be selected, each appearing as a removable chip. Attempting to select a 5th shows a tooltip explaining the maximum.

**Alias generation:** when an entity is selected (primary or companion), the integration immediately generates its alias and stores it in wizard session state. The alias is an 8-character random base62 string. It is available for use in the Step 6 code preview from the moment the entity is selected. If the entity selection changes, the old alias is discarded and a new one is generated for the replacement entity. Aliases are persisted to the token when Generate is clicked in Step 6.

**Group mode**

The entity list allows selecting multiple primary entities. Each selected entity becomes a card in the resulting `<hrv-group>`. For each selected entity, a collapsed expand reveals a companion picker for that card. The entity list shows a counter: "3 entities selected".

**Continue button** is disabled until at least one primary entity is selected.

### Step 2: Set Permissions

```
+------------------------------------------------------------------+
|  What can visitors do with this widget?                          |
|                                                                  |
|  ( ) View only                                                   |
|      Visitors can see the current state of your device but       |
|      cannot control it.                                          |
|                                                                  |
|  (*) View and control                                            |
|      Visitors can see the state and send commands, such as       |
|      toggling a light or adjusting brightness.                   |
|                                                                  |
|  [v] Advanced                                                    |
+------------------------------------------------------------------+
```

"View only" maps to `"read"`. "View and control" maps to `"read-write"`. The Advanced expand shows the raw capability value and a link to the spec.

### Step 3: Set Origin

Origins are managed globally in Settings. The wizard presents a dropdown of saved origins rather than a free-text URL field, reducing the setup needed for repeat use.

```
+------------------------------------------------------------------+
|  Where will this widget appear?                                  |
|                                                                  |
|  (*) A specific website                                          |
|      [ Select a website...                              v ]      |
|        myblog.com  (https://myblog.com)                          |
|        Office intranet  (https://office.corp.com:8080)           |
|        ---                                                       |
|        + Add new website...                                      |
|                                                                  |
|      [x] Also allow on any page of this website                  |
|          (removes path restriction if one is set)                |
|                                                                  |
|  ( ) Any website                                                 |
|                                                                  |
+------------------------------------------------------------------+
```

**Radio button behaviour:** the two options are mutually exclusive. Selecting "Any website" disables and visually fades the origin dropdown and the path checkbox. Selecting "A specific website" re-enables them.

**Origin dropdown:** shows the friendly name and origin URL for each saved origin. The last option is always "+ Add new website..." which expands an inline form: friendly name, URL (with port supported - e.g. `https://office.local:8080`), optional path restriction. Saving from this inline form adds the origin to the global Settings list and selects it in the dropdown. No need to leave the wizard.

**Port support:** origins with non-standard ports are fully supported. The URL field in the inline add form accepts the full origin including port. A hint text reads: "Include the port if your site uses a non-standard one, e.g. https://office.local:8080. Standard ports (80 for HTTP, 443 for HTTPS) do not need to be specified."

**"Also allow on any page" checkbox:** shown only when "A specific website" is selected and the chosen origin has a path restriction saved. Checking it removes the path restriction for this token (sets `allow_paths` to empty). The checkbox is hidden if the selected origin has no path restriction.

**"Any website" warning:** when "Any website" is selected AND "View and control" was chosen in Step 2, a prominent inline warning appears immediately below the radio button:

```
+-- Security Warning ----------------------------------------+
|  This allows anyone on the internet to control your device  |
|  from any website. Only proceed if you understand this risk.|
+------------------------------------------------------------+
```

Continue remains available. This is a warning, not a block.

### Step 4: Set Expiry

```
+------------------------------------------------------------------+
|  When should this widget stop working?                           |
|                                                                  |
|  (*) Never expires                                               |
|  ( ) 30 days    (until 4 May 2026)                               |
|  ( ) 90 days    (until 4 Jul 2026)                               |
|  ( ) 1 year     (until 5 Apr 2027)                               |
|  ( ) Custom date  [ ____________ ]                               |
|                                                                  |
|  [v] Advanced: schedule, IP restrictions, session limits         |
|                                                                  |
+------------------------------------------------------------------+
```

The calculated expiry date is shown in parentheses for each option. The Advanced expand contains: active schedule toggle and configuration (timezone, days, start/end times), IP restrictions field (CIDR ranges, one per line), max sessions field, and enhanced security (HMAC) toggle with a warning that the secret is shown once only.

### Step 5: Choose Appearance

```
+------------------------------------------------------------------+
|  How should your widget look?  (optional - skip to use default)  |
|                                                                  |
|  Theme  [ Default                                           v ]  |
|           Default                                                |
|           Glassmorphism                                          |
|           Accessible                                             |
|           My Corporate Theme                                     |
|           ---                                                    |
|           Manage themes in Settings                              |
|                                                                  |
|  Preview:                                                        |
|  +------------------+                                            |
|  |  [live card]     |  <- fully interactive, not read-only       |
|  +------------------+                                            |
|                                                                  |
|  The preview shows your actual entity with live data.            |
|  Interact with it to test the full widget experience.            |
|                                                                  |
+------------------------------------------------------------------+
```

The theme dropdown is populated from the theme registry (bundled themes plus any custom themes added in Settings). A "Manage themes in Settings" link at the bottom of the dropdown opens the Settings screen in a new panel view, preserving wizard state for return.

The live preview renders a real `<hrv-card>` element connected to HA via a short-lived preview token (valid 5 minutes). The preview token has the same capability as the token being created (read-only or read-write). If read-write, the card is fully interactive - the user can toggle the entity, adjust sliders, and see real state changes. This lets the owner test the complete visitor experience before deploying.

If the entity is currently unavailable, the preview shows the appropriate offline state.

This step is entirely optional. Continuing without a selection uses the default theme.

### Step 6: Done

After the user clicks Generate, the wizard creates the token and displays the final output. The step indicator shows all steps completed.

```
+------------------------------------------------------------------+
|  Your widget is ready.                                       [X] |
|                                                                  |
|  [all steps checked]                                             |
|                                                                  |
|  Step 1: Add to your page <head> once                            |
|  +----------------------------------------------------------+    |
|  | <script src="...harvest.min.js"></script>                |    |
|  | <script>HArvest.config({haUrl:"...",token:"..."});</script>    |
|  +----------------------------------------------------------+    |
|  (click or tap inside the box to copy)         [Copied!]         |
|                                                                  |
|  Step 2: Paste where you want the widget                         |
|  [ Web page ]  [ WordPress ]                                     |
|  [ ] Show as aliases                                             |
|  +----------------------------------------------------------+    |
|  | <hrv-card entity="light.bedroom_main"></hrv-card>        |    |
|  +----------------------------------------------------------+    |
|  (click or tap inside the box to copy)                           |
|                                                                  |
|  (when "Show as aliases" is checked:)                            |
|  | <hrv-card alias="dJ5x3Apd"></hrv-card>                   |    |
|                                                                  |
|  Preview:                                                        |
|  +------------------+                                            |
|  |  [live card]     |  <- fully interactive                      |
|  +------------------+                                            |
|                                                                  |
|  [View token details]          [Create another widget]           |
|                                                                  |
+------------------------------------------------------------------+
```

**"Show as aliases" checkbox (default unchecked):** a code format toggle that switches the snippet between `entity=` and `alias=` attribute names. The aliases themselves were generated at entity selection time (Step 1) and are already stored in the token. Both versions of the snippet work correctly against the same token - the server accepts either format. Companion entity references in the snippet also toggle to aliases when checked. The wizard never outputs both `entity=` and `alias=` on the same element.

The checkbox remains interactive after Generate is clicked. It is also present on the token detail Code section, so the owner can switch between formats at any time. When the info icon `[?]` is clicked, a tooltip explains what aliases do and do not protect (see `docs/security.md` Section 3.10).

**Code output tabs:** the Step 2 snippet area uses two tabs:

- **Web page** - the `<hrv-card>` or `<hrv-group>` syntax for standard HTML pages. This is the default tab.
- **WordPress** - the `hrv-mount` div equivalent for CMS environments. Both the script tag and the mount div are shown with separate copy areas. When aliases are enabled, the WordPress output uses `data-alias` instead of `data-entity`.

Additional platform tabs (Squarespace, Ghost, etc.) may be added in future versions without changing the tab structure.

**Group mode output:** if group mode was selected in Step 1, the snippet wraps all cards in `<hrv-group>`. With `HArvest.config()` in the head, the group element itself needs no attributes:

```html
<hrv-group>
  <hrv-card entity="light.bedroom_main" companion="lock.bedroom_door"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
</hrv-group>
```

**Post-wizard actions:**

- "View token details" closes the wizard and navigates to the new token's detail screen.
- "Create another widget" resets the wizard to step 1. Previously selected options are pre-populated from wizard memory (except the entity selection).
- The X button closes the wizard and returns to wherever the user was, with the new token highlighted in the token list if visible.

**HMAC secret display:** if enhanced security was enabled in Step 4, the token secret is shown at the top of Step 6 with a mandatory acknowledgement before the rest of the step is accessible.

```
+-- Save your token secret now ---------------------------------+
|  [ a3f9bc2d114ef5a6b7c8d9e0f1a2b3c4f5e6d7c8b9a0 ] [Copy]   |
|                                                               |
|  This is shown once only and cannot be retrieved again.       |
|  [x] I have saved my token secret                            |
+---------------------------------------------------------------+
```

The rest of Step 6 (alias option, code snippets, preview, action buttons) is shown below the secret box but the X close button is disabled until the acknowledgement checkbox is checked.

---

## 8. Shared Components

### Status Badges

Used throughout the panel to show token and session status.

| Status | Colour | Text |
|--------|--------|------|
| Active | Green | ACTIVE |
| Expiring soon (< 7 days) | Amber | EXPIRING SOON |
| Inactive (outside schedule) | Amber | INACTIVE |
| Expired | Grey | EXPIRED |
| Revoked | Red | REVOKED |

### Entity List Item

Used in the wizard entity picker and the token detail entity list.

```
[icon]  Bedroom Main Light          light.bedroom_main      [Tier 1]
        light  -  read-write
```

### Copy Button and Click-to-Copy Textarea

Two copy mechanisms are used depending on context.

**Copy button:** a standalone button labelled "Copy" adjacent to a code block. Shows "Copied!" for 1.5 seconds after clicking, then returns to "Copy". Used in the token detail Code section where the user may want to copy specific parts of a snippet.

**Click-to-copy textarea:** a `<textarea>` element styled as a code block. Clicking or tapping anywhere inside it selects all content and copies it to the clipboard automatically, showing a "Copied!" label above the textarea for 1.5 seconds. Used in the wizard Step 6 and anywhere the expected action is always "copy everything". A small hint label below the textarea reads "(click to copy)" in muted text. An explicit Copy button is also rendered as a fallback for browsers that block clipboard access without a direct button gesture.

### Confirmation Dialog

A shared modal used for destructive actions (revoke, delete, terminate session). Always requires explicit confirmation text or a checkbox before the action button becomes active. The action button is styled in red for destructive actions.

### Copy Button

Every code snippet copy button shows a brief "Copied!" confirmation state (1.5 seconds) after clicking, then returns to "Copy". Multiple copy buttons on the same page operate independently.

### Live Card Preview

A real `<hrv-card>` element rendered inside the panel UI, connected to the actual HA instance via a short-lived preview token. Used in the wizard Step 5 (appearance) and Step 6 (generate), and on the token detail Code section.

The preview token is created via `token_manager.create_preview()` when the wizard reaches Step 5. It has the same capability as the token being created (read-only or read-write), is scoped to the entity being configured, and expires after 5 minutes. Preview tokens do not appear in the token list and are never persisted to HA storage. They are cleaned up automatically by a scheduled task every 60 seconds. If the wizard is exited before the token expires naturally, the panel revokes it immediately.

The preview is shown in a fixed-size container (300px wide) with a subtle border and a "Live preview" label. If the entity is currently unavailable, the appropriate offline state is shown rather than an error in the panel itself.

---

## 9. Responsive Behaviour

The panel targets the HA frontend environment, which is typically viewed on desktop or tablet. Mobile phone support is secondary but must not be broken.

**Desktop (> 900px):** Full layout as described throughout this document. Token detail uses the side-by-side split at 55/45. Dashboard sensor cards display in a 3-column grid. Dashboard graphs display at full width below the sensor cards.

**Tablet (600-900px):** The global stats bar collapses to a single row of smaller numbers. Token list cards reduce to single-line format. The token detail split stacks vertically: left panel (token info and code) above, right panel (sessions and activity) below. Dashboard sensor cards display in a 2-column grid. Dashboard graphs stack vertically, each taking full width.

**Mobile (< 600px):** The global stats bar is hidden by default (accessible via a tap). The token detail split becomes fully vertical and single-column. Dashboard sensor cards stack into a single column. Dashboard graphs are hidden by default on mobile to reduce scroll length; a "Show activity graphs" toggle reveals them. The wizard steps stack vertically with full-width continue/back buttons.

---

## 10. Visual Design

The panel UI follows HA's own visual conventions to feel native and familiar.

### Colours

The panel uses HA CSS custom properties wherever possible, so it automatically adapts to the user's chosen HA theme (light, dark, or custom):

- `--primary-color` for active states and primary buttons
- `--primary-background-color` for card backgrounds
- `--secondary-background-color` for page backgrounds
- `--primary-text-color` for body text
- `--secondary-text-color` for muted labels
- `--error-color` for error states and destructive actions
- `--warning-color` for warnings and amber badges

Status-specific colours (green for active, red for revoked) are defined as panel-local variables that respect the user's theme contrast preferences.

### Typography

Uses HA's default font stack. No custom fonts are loaded.

### Icons

Uses MDI icons via HA's built-in icon system where possible. Where HA's icon system is not available in panel context, the same MDI SVG subset bundled in the widget is reused.

### Spacing and Sizing

Follows an 8px base grid. Card padding: 16px. Section spacing: 24px. Touch targets: minimum 44x44px for all interactive elements (matching the accessible theme requirement from SPEC.md).

### Code Blocks

Code snippets use a monospace font with a dark background regardless of the panel's overall theme. This makes the HTML snippets easy to read and visually distinct from configuration text. A subtle border and the "Copy" button are right-aligned within the block.

### Loading States

Any operation that requires a server round-trip (saving a token, revoking, fetching the activity log) shows an inline loading spinner next to the triggering button rather than a full-page loading state. The button is disabled during the operation.

### Error States

Server errors during save operations show an inline red error message below the relevant field or button. They do not navigate away from the current screen. A retry option is shown where appropriate.

---

## Appendix: Panel File Structure

```
frontend/
  src/
    App.tsx               root component, routing
    main.tsx              entry point
    components/
      Dashboard.tsx       home screen with sensor cards and recent activity
      TokenList.tsx       token list screen and token card component
      TokenDetail.tsx     token detail split screen (left info, right sessions/activity)
      ActivityLog.tsx     activity log screen and row expand
      Settings.tsx        settings screen
      StatsBar.tsx        compact global stats bar (non-dashboard screens)
      Shared.tsx          status badges, copy button, confirmation dialog, live preview
      Wizard.tsx          wizard modal, all six steps
  index.html
  vite.config.ts
  tsconfig.json
  dist/
    panel.js              compiled bundle, committed to repo - served by panel.py
```
