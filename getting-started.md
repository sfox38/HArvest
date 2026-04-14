# Getting Started with HArvest

**Applies to:** HArvest Integration v1.6.0+

This guide walks you through embedding a live, interactive Home Assistant widget on a webpage from scratch. By the end you will have a working light card on a real page that visitors can use to toggle your light and adjust its brightness.

The guide uses a standard HTML page as the primary example. Where the process differs for WordPress, those steps are called out explicitly.

---

## How HArvest Widgets Work

Before diving into the steps, it helps to understand the three levels at which HArvest configuration works. Each level inherits from the one above it, and any level can override the one above.

```
Page level:      HArvest.config({ haUrl: "...", token: "..." })
                   |
                   v
Group level:     <hrv-group>        <- shares config across a group of cards
                   |
                   v
Card level:      <hrv-card entity="..."> <- one entity, inherits from above
```

**Page level** sets defaults that apply to every widget on the page. You configure your HA URL and token once here and every card picks them up automatically.

**Group level** (`<hrv-group>`) is optional. It groups related cards together so they can share a theme, be styled as a unit, or be laid out together on the page. Any attribute set on the group is inherited by its child cards. A group can also override page-level settings for just those cards - for example, giving one section a different theme from the rest of the page.

**Card level** (`<hrv-card>`) is where you specify which entity to display. It only needs additional attributes when it differs from the levels above it.

This is distinct from companion entities, which are a different concept. A companion is a secondary entity displayed inside a single card alongside the primary entity - for example, a lock status shown next to a light. A companion is not a separate card; it is part of the same card. `<hrv-group>` groups independent cards on a page. Companions group related entities within one card.

---

## Prerequisites

Before you begin, make sure you have the following in place. Each item links to the relevant documentation if you still need to set it up.

**1. Home Assistant is installed and running.**
Any installation method works (Home Assistant OS, Container, Supervised, or Core). See the [HA installation guide](https://www.home-assistant.io/installation/) if you are not there yet.

**2. Your HA instance is accessible from the internet with a valid HTTPS URL.**
HArvest widgets connect from your visitors' browsers to your HA instance, which means HA must be reachable from outside your home network. A URL like `https://myhome.duckdns.org` or `https://ha.yourdomain.com` is what you need. Plain HTTP is not supported.

If you have not set this up yet, the [HA remote access documentation](https://www.home-assistant.io/docs/configuration/remote/) covers the options. The [Nabu Casa](https://www.nabucasa.com) cloud subscription is the simplest path. DuckDNS with Let's Encrypt is a popular free alternative.

**3. You have at least one light entity in HA.**
Any light will do - a smart bulb, a light group, or even a virtual `input_boolean` configured to behave like a light. If your HA installation has any smart lighting, you are ready.

**4. The HArvest integration is installed via HACS.**
Open HACS in your HA sidebar, search for HArvest, and install it. Restart HA after installation. If HACS itself is not installed, see the [HACS installation guide](https://hacs.xyz/docs/setup/download/).

**5. JavaScript is enabled in the browser.**
HArvest widgets are built on JavaScript and Web Components. They will not appear in browsers with JavaScript disabled, or when browser extensions such as NoScript are blocking scripts from the page's domain. This applies to your visitors as well as to you during testing.

**6. (WordPress only) You have a WordPress site where you can add HTML to a page.**
Any page builder or the Classic editor works. You need to be able to paste raw HTML into a page or post. The [HArvest WordPress plugin](https://github.com/sfox38/harvest) is recommended, as it greatly simplifies the process by handling script loading and Content Security Policy automatically - see the WordPress-specific steps below.

---

## Step 1: Open the HArvest Panel

After installing and activating the integration, HArvest appears in your HA sidebar with a leaf icon. Click it.

You will land on the HArvest dashboard. If this is your first time, the token list is empty and a prompt invites you to create your first widget. Click **+ Create Widget** in the bottom right corner. This opens the six-step widget creation wizard.

---

## Step 2: Pick Your Light Entity

The first wizard step is the entity picker.

You will see a searchable list of all your HA entities. Type the name of your light - for example "Bedroom" - to filter the list. Entities are grouped by domain. Look under the **light** group or use the search to find your light quickly.

Each entity in the list shows:
- The entity's icon and friendly name
- The entity ID in smaller text below (e.g. `light.bedroom_main`)
- A small green dot indicating full widget support

Click your light to select it. A checkmark confirms the selection.

**Companion entities (optional):** a companion is a secondary entity displayed inside this card alongside the primary light. For example, you could show a lock status or a motion sensor reading within the same card. Companions are compact - they display an icon and state, not a full card. They are distinct from adding a second independent card to the page. Click "Add companion entities" to select up to 4. The wizard automatically adds companion entity IDs to the token so they are authorised - you do not need to add them separately. If you later choose to obscure entity names in the generated code, companions are also shown as aliases alongside the primary entity. Skip this for now if you just want a simple light card.

Click **Continue**.

---

## Step 3: Set Permissions

This step controls what your visitors can do with the widget.

Select **View and control**. This grants read-write access, which means visitors can toggle the light on and off and adjust brightness. If you later want a display-only version of the same light, you can create a second token with "View only" selected.

Click **Continue**.

---

## Step 4: Set the Origin

This step tells HArvest which website is allowed to use this widget. Restricting access to a specific website means the widget only works when embedded on that site, and not when copied elsewhere.

**If this is your first widget:** the origin dropdown will be empty. Click **+ Add new website** at the bottom of the dropdown. A small form appears:

- **Friendly name:** give it a memorable label, for example "My Blog" or "Home Dashboard"
- **URL:** enter the full URL of your website, for example `https://myblog.com`

The URL you enter here is the website's origin - the scheme and domain, without any path. Port numbers are supported if your site uses a non-standard port (e.g. `https://office.local:8080`).

Click **Save**. The new origin is saved to your Settings for reuse on future tokens, and is now selected in the dropdown.

**"Also allow on any page of this website":** leave this checked if you want the widget to work on any page of your site, not just one specific URL. This is the most convenient option for most users.

**"Any website":** do not select this unless you specifically want the widget to work when embedded on any website on the internet. This is rarely the right choice for a write-capable widget.

Click **Continue**.

---

## Step 5: Set Expiry

Choose when this widget should stop working.

For a widget you plan to keep permanently, select **Never expires**. For a temporary widget (a holiday listing page, a conference demo), choose a date that matches your use case.

The calculated expiry date is shown in brackets next to each option so you know exactly what you are choosing.

The **Advanced** section contains additional options including schedule restrictions, IP restrictions, and enhanced security. These are not needed for a first widget - skip them for now. They are covered in detail in `docs/security.md`.

Click **Continue**.

---

## Step 6: Choose Appearance

Select a visual theme for your widget.

The dropdown shows all available themes. Three themes ship with HArvest:

- **Default** - clean and neutral, works on any background, follows your visitor's dark or light mode preference automatically
- **Glassmorphism** - frosted glass effect, best on pages with a full-bleed background image
- **Accessible** - high contrast, larger touch targets, no animations, meets WCAG AA

A live preview of your actual light entity updates as you switch themes. The preview is fully interactive - toggle the light, try the brightness slider. What you see here is exactly what your visitors will see.

If you have added custom themes in Settings, they appear in the dropdown alongside the bundled themes.

Select a theme and click **Continue**. Skipping this step uses the Default theme.

---

## Step 7: Copy Your Widget Code

The wizard creates the token and displays your ready-to-use code. This is the final step.

You will see two code areas and a live interactive preview of your widget.

### For a standard HTML page

**Code area 1 - Script tag and page config (add once per page, in your `<head>`):**

```html
<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/dist/harvest.min.js"></script>
<script>
  HArvest.config({
    haUrl: "https://myhome.duckdns.org",
    token: "hwt_a3F9bC2d114eF5A6b7c8dE",
  });
</script>
```

The first line loads the HArvest library. The second block sets your HA URL and token as page-level defaults so every card on the page knows where to connect and which token to use. Your actual values will appear here - the examples above are placeholders.

**Code area 2 - Widget card (paste where you want the widget to appear in the page body):**

```html
<hrv-card entity="light.bedroom_main"></hrv-card>
```

The card only needs the entity ID. It picks up the HA URL and token from the page config above.

**"Show as aliases" checkbox:** the wizard includes a checkbox below the code area labelled "Show as aliases". When checked, the snippet switches from `entity="light.bedroom_main"` to `alias="dJ5x3Apd"` format. Both versions work - the token stores the alias alongside the real entity ID and the server accepts either. This is a display preference for the code snippet, not a change to the token itself. Check it if you want entity names hidden from your page source. Companion entity references in the snippet also switch to aliases when checked.

Click anywhere inside either code area to select all and copy it automatically. A "Copied!" confirmation appears briefly.

### For WordPress

Click the **WordPress** tab above the code areas. The output switches to shortcode format.

The WordPress plugin handles script loading and HA URL injection automatically. If the plugin is installed, add the shortcode to any post or page using the Classic editor:

```
[harvest token="hwt_a3F9bC2d114eF5A6b7c8dE" entity="light.bedroom_main"]
```

The HA URL is absent from the shortcode because the plugin reads it from the HArvest settings page (Settings > HArvest in your WordPress admin) and injects it automatically when the page is rendered. You configure the HA URL once in the plugin settings and it applies to every shortcode on every page.

**Without the plugin:** you need to load the HArvest library yourself, via a header injection plugin or by editing your theme's `functions.php`. Add both the script tag and the page config call to the header:

```html
<script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/dist/harvest.min.js"></script>
<script>
  HArvest.config({
    haUrl: "https://myhome.duckdns.org",
    token: "hwt_a3F9bC2d114eF5A6b7c8dE",
  });
</script>
```

Then use the `hrv-mount` div format in any HTML block or code widget:

```html
<div class="hrv-mount" data-entity="light.bedroom_main"></div>
```

If you cannot inject a header script at all, include the HA URL directly on the container div instead:

```html
<div class="hrv-mount"
     data-token="hwt_a3F9bC2d114eF5A6b7c8dE"
     data-ha-url="https://myhome.duckdns.org"
     data-entity="light.bedroom_main">
</div>
```

---

## Step 8: Embed the Widget on Your Page

Open your HTML file or WordPress page and paste the code from Step 7.

**Standard HTML page - minimal working example:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Smart Home</title>
  <script src="https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/dist/harvest.min.js"></script>
  <script>
    HArvest.config({
      haUrl: "https://myhome.duckdns.org",
      token: "hwt_a3F9bC2d114eF5A6b7c8dE",
    });
  </script>
</head>
<body>

  <h1>Bedroom Controls</h1>

  <hrv-card entity="light.bedroom_main"></hrv-card>

</body>
</html>
```

Save the file and open it in a browser. The widget should appear within a second or two and show your light's current state.

**Testing locally before publishing:** serve the file from a local web server rather than opening it directly from disk. Browsers block WebSocket connections from files opened via `file:///`, so the widget will not connect that way. The quickest local server is Python - open a terminal in the folder containing your HTML file and run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/yourfile.html`. The widget connects and works normally. When creating your test token in the HArvest panel, use `http://localhost:8080` as the allowed origin URL.

Note: HArvest normally requires HTTPS, but `localhost` is a special case. Browsers permit plain HTTP WebSocket connections (`ws://`) to localhost for development purposes even when they would block the same on a public URL. This exception applies only to `localhost` - it will not work if you substitute your local IP address (e.g. `192.168.x.x`).

**WordPress:** after pasting the shortcode, save your page and preview it. The widget appears in place of the shortcode.

---

## What You Should See

When everything is working correctly:

- The widget appears with your light's friendly name and icon
- The current state (on or off) is shown immediately
- Clicking the toggle button turns the light on or off and the change is visible in HA
- Any controls your light supports appear automatically. A brightness slider, colour temperature slider, or colour picker will be present if the light hardware supports them, and adjusting any of them changes the light in real time
- The widget updates automatically when the light state changes from another source (the HA app, a voice assistant, a physical switch)

The first connection takes a moment while the widget authenticates with HA. On subsequent page loads, the widget displays the last known state immediately from cache while the live connection is established in the background.

---

## Troubleshooting

**The widget does not appear at all.**
Open your browser's developer console (F12) and look for JavaScript errors. If there are none, check that the `<hrv-card>` element is present in the page source. If JavaScript is being blocked by a browser extension (NoScript, uBlock Origin in strict mode), the widget cannot load.

If you are testing on a live hosted website and see an error mentioning `connect-src` or `Content Security Policy`, your web server is blocking the WebSocket connection. This is a server configuration issue. The easiest way to rule it out during development is to use a local web server for testing (see Step 8 above). For fixing CSP on a live server, see `docs/security.md` Section 2.8.

**The widget shows "Widget unavailable".**
This message means authentication failed. Common causes are a token that has expired, an origin that does not match the allowed list, or a typo in the token ID or HA URL. Open the HArvest panel in HA, check the token's status and allowed origins, and review the activity log for that token - it shows the exact error code.

**The widget shows "Temporarily offline".**
HArvest cannot reach your HA instance. Check that your HA external URL is reachable by opening it directly in a browser. If HA is reachable but the widget is not, check your reverse proxy configuration - specifically that WebSocket upgrade headers are being forwarded correctly. See `docs/security.md` Section 2 for proxy configuration examples.

**The widget connects but the toggle does not work.**
Check that the token was created with "View and control" permission. A read-only token displays the card but blocks all commands. Open the HArvest panel, find the token, and check the capability shown for the entity.

**WordPress: the shortcode appears as plain text on the page.**
The shortcode is not being processed. Make sure you are using the Classic editor or an HTML block, not a visual editor that treats the text literally. Check that the HArvest plugin is activated if you are using the `[harvest]` shortcode. If using the `hrv-mount` div format, make sure it is in an HTML block, not a paragraph block.

**WordPress: the widget loads but the light does not respond to commands.**
Many WordPress security plugins add strict Content Security Policy headers that block WebSocket connections. The HArvest plugin adds the required CSP directive automatically. Without the plugin, add your HA URL to the `connect-src` directive manually in your security plugin's settings. See `docs/security.md` Section 2.8 for the exact directive.

---

## Next Steps

You have a working widget. Here are some directions to explore next.

**Add more entities to the page.** Add more `<hrv-card>` elements with different entity IDs. Each card only needs `entity` - the HA URL and token are already set at page level. All cards on the page share a single WebSocket connection automatically.

**Group cards together.** Wrapping cards in `<hrv-group>` lets related cards share a theme or be styled and laid out as a unit. With HA URL and token set at page level, the group element needs no attributes:

```html
<hrv-group>
  <hrv-card entity="light.bedroom_main"></hrv-card>
  <hrv-card entity="fan.bedroom_ceiling"></hrv-card>
  <hrv-card entity="sensor.bedroom_temperature" show-history="true"></hrv-card>
</hrv-group>
```

It is also possible to set `ha-url` and `token` on the `<hrv-group>` element, or directly on individual cards. You would do this when a specific card or group needs to connect to a different HA instance, use a different token, or display entities under a different level of permission than the rest of the page. The card attribute takes priority over the group, which takes priority over the page-level config.

**Show history on a sensor card.** Add `show-history="true"` to any sensor card to display a graph of recent readings below the card. Use `hours-to-show="48"` to control the window.

**Customise the appearance.** Theme JSON files can be hosted anywhere and referenced by URL. Set a default theme for the whole page via `HArvest.config({ themeUrl: "https://yoursite.com/themes/mytheme.json" })`, or set `theme-url` on an individual `<hrv-card>` or `<hrv-group>` to override it for specific cards. See `docs/theming.md` for the full variable reference and how to create a custom theme.

**Manage your tokens.** The HArvest panel in HA shows all your active tokens, who is connected right now, and a full activity log. You can revoke a token, duplicate it to create a similar one, or view the generated code again at any time from the token detail screen.

**Review the security guide.** Before making a widget public on a high-traffic page, read through `docs/security.md`. It covers the risk model, what HArvest mitigates, and practical hardening steps for your specific situation.
