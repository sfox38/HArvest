# HArvest WordPress Plugin Architecture

**Status:** Draft
**Plugin slug:** `harvest`
**Applies to:** HArvest Widget v1.6.0+, WordPress 5.0+, PHP 7.4+

This document describes the architecture and implementation of the HArvest WordPress plugin. It is intended as an implementation guide for Claude Code and human contributors.

The v1 plugin supports the Classic editor via a `[harvest]` shortcode. Gutenberg block support is deferred to plugin v1.1. See the Deferred Features section at the end of this document.

Note on version numbering: the WordPress plugin has its own independent version number. Plugin v1 ships alongside HArvest Integration v1.6.x. Plugin v1.1 refers to the next plugin release, which may ship at any point and does not imply a change to the integration or widget spec version.

The plugin lives in the monorepo at `wordpress/` alongside the integration and widget source.

---

## Table of Contents

1. [Plugin Structure](#plugin-structure)
2. [Entry Point and Bootstrap](#entry-point-and-bootstrap)
3. [Settings Page](#settings-page)
4. [Shortcode](#shortcode)
5. [Script and Style Enqueuing](#script-and-style-enqueuing)
6. [Content Security Policy](#content-security-policy)
7. [Theme JSON Upload Support](#theme-json-upload-support)
8. [Multisite Support](#multisite-support)
9. [Compatibility Notes](#compatibility-notes)
10. [Testing Checklist](#testing-checklist)
11. [Deferred Features (Plugin v1.1)](#deferred-features-plugin-v11)

---

## 1. Plugin Structure

```
wordpress/
  harvest/                          plugin root (slug matches directory name)
    harvest.php                     plugin entry point, header comment, bootstrap
    uninstall.php                   cleanup on plugin deletion
    includes/
      class-harvest-settings.php    settings page and options management
      class-harvest-shortcode.php   [harvest] shortcode handler
      class-harvest-assets.php      script/style enqueuing
      class-harvest-csp.php         Content Security Policy header injection
    assets/
      harvest.min.js                bundled widget JS (specific pinned version)
      harvest-plugin.css            minimal plugin-specific styles (none in v1)
    languages/                      i18n .pot file and translations
      harvest.pot
    readme.txt                      WordPress plugin directory readme
    LICENSE                         GPL-2.0 (required for WP plugin directory)
```

The plugin slug is `harvest`. This means:

- Directory: `wp-content/plugins/harvest/`
- Shortcode: `[harvest]`
- Option prefix: `harvest_`
- Text domain: `harvest`
- Action/filter prefix: `harvest_`

---

## 2. Entry Point and Bootstrap

**File:** `harvest.php`

The main plugin file contains the WordPress plugin header comment and bootstraps all plugin classes.

```php
<?php
/**
 * Plugin Name:       HArvest
 * Plugin URI:        https://github.com/sfox38/harvest
 * Description:       Embed live Home Assistant entity widgets on any page or post.
 * Version:           1.0.0
 * Requires at least: 5.0
 * Requires PHP:      7.4
 * Author:            HArvest Contributors
 * Author URI:        https://github.com/sfox38/harvest
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       harvest
 * Domain Path:       /languages
 */

defined('ABSPATH') || exit;

define('HARVEST_VERSION', '1.0.0');
define('HARVEST_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HARVEST_PLUGIN_URL', plugin_dir_url(__FILE__));

function harvest_init(): void {
    require_once HARVEST_PLUGIN_DIR . 'includes/class-harvest-settings.php';
    require_once HARVEST_PLUGIN_DIR . 'includes/class-harvest-shortcode.php';
    require_once HARVEST_PLUGIN_DIR . 'includes/class-harvest-assets.php';
    require_once HARVEST_PLUGIN_DIR . 'includes/class-harvest-csp.php';

    Harvest_Settings::init();
    Harvest_Shortcode::init();
    Harvest_Assets::init();
    Harvest_Csp::init();
}
add_action('plugins_loaded', 'harvest_init');

register_activation_hook(__FILE__, 'harvest_activate');
register_deactivation_hook(__FILE__, 'harvest_deactivate');

function harvest_activate(): void {
    // Set default options if not already present
    if (!get_option('harvest_ha_url')) {
        add_option('harvest_ha_url', '');
    }
    if (!get_option('harvest_widget_source')) {
        add_option('harvest_widget_source', 'bundled');
    }
    if (!get_option('harvest_default_theme')) {
        add_option('harvest_default_theme', '');
    }
}

function harvest_deactivate(): void {
    // Nothing to clean up on deactivation
    // Options are retained so settings survive deactivation/reactivation
}
```

**File:** `uninstall.php`

Called when the plugin is deleted (not just deactivated). Removes all plugin options.

```php
<?php
defined('WP_UNINSTALL_PLUGIN') || exit;

delete_option('harvest_ha_url');
delete_option('harvest_widget_source');
delete_option('harvest_cdn_url');
delete_option('harvest_default_theme');
```

---

## 3. Settings Page

**File:** `includes/class-harvest-settings.php`

Registers a settings page under the WordPress admin Settings menu. All options are stored with `get_option()` / `update_option()` using the `harvest_` prefix.

```php
<?php

class Harvest_Settings {

    public static function init(): void {
        add_action('admin_menu', [self::class, 'add_settings_page']);
        add_action('admin_init', [self::class, 'register_settings']);
    }

    public static function add_settings_page(): void {
        add_options_page(
            __('HArvest Settings', 'harvest'),
            __('HArvest', 'harvest'),
            'manage_options',
            'harvest-settings',
            [self::class, 'render_settings_page']
        );
    }

    public static function register_settings(): void {
        register_setting('harvest_settings_group', 'harvest_ha_url', [
            'type'              => 'string',
            'sanitize_callback' => [self::class, 'sanitize_ha_url'],
            'default'           => '',
        ]);

        register_setting('harvest_settings_group', 'harvest_widget_source', [
            'type'              => 'string',
            'sanitize_callback' => [self::class, 'sanitize_widget_source'],
            'default'           => 'bundled',
        ]);

        register_setting('harvest_settings_group', 'harvest_cdn_url', [
            'type'              => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default'           => '',
        ]);

        register_setting('harvest_settings_group', 'harvest_default_theme', [
            'type'              => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default'           => '',
        ]);
    }

    public static function sanitize_ha_url(string $url): string {
        $url = esc_url_raw(trim($url));
        // Strip trailing slash for consistency
        return rtrim($url, '/');
    }

    public static function sanitize_widget_source(string $source): string {
        return in_array($source, ['bundled', 'cdn'], true) ? $source : 'bundled';
    }

    public static function render_settings_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <?php settings_errors('harvest_settings_group'); ?>

            <form method="post" action="options.php">
                <?php settings_fields('harvest_settings_group'); ?>

                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">
                            <label for="harvest_ha_url">
                                <?php esc_html_e('Home Assistant URL', 'harvest'); ?>
                            </label>
                        </th>
                        <td>
                            <input
                                type="url"
                                id="harvest_ha_url"
                                name="harvest_ha_url"
                                value="<?php echo esc_attr(get_option('harvest_ha_url')); ?>"
                                class="regular-text"
                                placeholder="https://myhome.duckdns.org"
                            >
                            <p class="description">
                                <?php esc_html_e(
                                    'The external URL of your Home Assistant instance. ' .
                                    'This is used by every widget on your site.',
                                    'harvest'
                                ); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <?php esc_html_e('Widget JS source', 'harvest'); ?>
                        </th>
                        <td>
                            <?php $source = get_option('harvest_widget_source', 'bundled'); ?>
                            <label>
                                <input type="radio" name="harvest_widget_source"
                                    value="bundled"
                                    <?php checked($source, 'bundled'); ?>>
                                <?php printf(
                                    /* translators: %s: version number */
                                    esc_html__('Use bundled version (harvest.js v%s)', 'harvest'),
                                    esc_html(HARVEST_VERSION)
                                ); ?>
                            </label>
                            <br>
                            <label>
                                <input type="radio" name="harvest_widget_source"
                                    value="cdn"
                                    <?php checked($source, 'cdn'); ?>>
                                <?php esc_html_e('Use CDN version (always latest)', 'harvest'); ?>
                            </label>
                            <p class="description">
                                <?php esc_html_e(
                                    'Bundled is recommended for stability. CDN always loads ' .
                                    'the latest widget version from jsDelivr.',
                                    'harvest'
                                ); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="harvest_default_theme">
                                <?php esc_html_e('Default theme URL', 'harvest'); ?>
                            </label>
                        </th>
                        <td>
                            <input
                                type="url"
                                id="harvest_default_theme"
                                name="harvest_default_theme"
                                value="<?php echo esc_attr(get_option('harvest_default_theme')); ?>"
                                class="regular-text"
                                placeholder="https://example.com/my-theme.json"
                            >
                            <p class="description">
                                <?php esc_html_e(
                                    'Optional. URL to a HArvest theme JSON file. Applied to all ' .
                                    'widgets that do not specify their own theme. Leave blank to ' .
                                    'use the built-in default theme.',
                                    'harvest'
                                ); ?>
                            </p>
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>

            <hr>
            <h2><?php esc_html_e('Shortcode usage', 'harvest'); ?></h2>
            <p><?php esc_html_e(
                'Paste the shortcode below into any post or page using the Classic editor:',
                'harvest'
            ); ?></p>
            <pre style="background:#f0f0f0;padding:12px;border-radius:4px;"
            >[harvest token="hwt_YOUR_TOKEN" entity="light.your_entity"]</pre>

            <h3><?php esc_html_e('Available shortcode parameters', 'harvest'); ?></h3>
            <table class="widefat striped" style="max-width:700px">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Parameter', 'harvest'); ?></th>
                        <th><?php esc_html_e('Required', 'harvest'); ?></th>
                        <th><?php esc_html_e('Description', 'harvest'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>token</code></td><td>Yes</td>
                        <td><?php esc_html_e('Your HArvest widget token ID', 'harvest'); ?></td></tr>
                    <tr><td><code>entity</code></td><td>Yes*</td>
                        <td><?php esc_html_e(
                            'HA entity ID, e.g. light.bedroom_main. Required unless alias is set. ' .
                            'If both entity and alias are provided, entity takes priority.',
                            'harvest'
                        ); ?></td></tr>
                    <tr><td><code>alias</code></td><td>Yes*</td>
                        <td><?php esc_html_e(
                            'Entity alias (8-character random key). Use instead of entity when ' .
                            '"Show as aliases" is checked in the wizard code output. Either entity ' .
                            'or alias is required, not both. Companion values should match - ' .
                            'use aliases when alias is set, real IDs when entity is set.',
                            'harvest'
                        ); ?></td></tr>
                    <tr><td><code>companion</code></td><td>No</td>
                        <td><?php esc_html_e('Comma-separated companion entity IDs', 'harvest'); ?></td></tr>
                    <tr><td><code>theme</code></td><td>No</td>
                        <td><?php esc_html_e(
                            'URL to a theme JSON file. Overrides the site default.',
                            'harvest'
                        ); ?></td></tr>
                    <tr><td><code>lang</code></td><td>No</td>
                        <td><?php esc_html_e(
                            'Language code, e.g. "de". Defaults to auto-detect.',
                            'harvest'
                        ); ?></td></tr>
                    <tr><td><code>show_history</code></td><td>No</td>
                        <td><?php esc_html_e(
                            'Set to "true" to show a history graph below the card.',
                            'harvest'
                        ); ?></td></tr>
                    <tr><td><code>hours</code></td><td>No</td>
                        <td><?php esc_html_e('History window in hours. Default: 24.', 'harvest'); ?></td></tr>
                    <tr><td><code>graph</code></td><td>No</td>
                        <td><?php esc_html_e(
                            'Graph type: "line" or "bar". Default: line.',
                            'harvest'
                        ); ?></td></tr>
                </tbody>
            </table>

            <hr>
            <h2><?php esc_html_e('Backup note', 'harvest'); ?></h2>
            <p><?php esc_html_e(
                'HArvest plugin settings are stored in the WordPress database and are included ' .
                'in standard WordPress backups. The widget token secrets you create in Home ' .
                'Assistant are stored in HA, not in WordPress.',
                'harvest'
            ); ?></p>
        </div>
        <?php
    }

    public static function get_ha_url(): string {
        return (string) get_option('harvest_ha_url', '');
    }

    public static function get_default_theme(): string {
        return (string) get_option('harvest_default_theme', '');
    }

    public static function get_widget_source(): string {
        return (string) get_option('harvest_widget_source', 'bundled');
    }
}
```

---

## 4. Shortcode

**File:** `includes/class-harvest-shortcode.php`

Registers the `[harvest]` shortcode. The shortcode outputs an `hrv-mount` div that the widget JS initialises. The HA URL comes from the plugin settings rather than the shortcode attributes, so users do not need to repeat it on every widget.

```php
<?php

class Harvest_Shortcode {

    public static function init(): void {
        add_shortcode('harvest', [self::class, 'render']);
    }

    public static function render(array $atts): string {
        $atts = shortcode_atts([
            'token'        => '',
            'entity'       => '',
            'alias'        => '',
            'companion'    => '',
            'theme'        => '',
            'lang'         => 'auto',
            'show_history' => 'false',
            'hours'        => '24',
            'graph'        => 'line',
        ], $atts, 'harvest');

        // Validate required attributes
        if (empty($atts['token'])) {
            return self::render_error(
                __('HArvest: missing required "token" attribute.', 'harvest')
            );
        }

        // Either entity or alias must be present. If both are provided, entity takes
        // priority and alias is ignored (matching hrv-card attribute behaviour).
        if (empty($atts['entity']) && empty($atts['alias'])) {
            return self::render_error(
                __('HArvest: missing required "entity" or "alias" attribute.', 'harvest')
            );
        }

        if (!empty($atts['entity']) && !empty($atts['alias'])) {
            // Both provided: entity wins. Log a PHP notice for debugging.
            trigger_error(
                'HArvest shortcode: both entity and alias attributes are set. ' .
                'entity takes priority. Remove alias to suppress this notice.',
                E_USER_NOTICE
            );
        }

        $ha_url = Harvest_Settings::get_ha_url();

        if (empty($ha_url)) {
            return self::render_error(
                __('HArvest: Home Assistant URL is not configured. ' .
                   'Go to Settings > HArvest to set it up.', 'harvest')
            );
        }

        // Resolve theme: shortcode attr > site default > empty (widget uses its own default)
        $theme_url = !empty($atts['theme'])
            ? $atts['theme']
            : Harvest_Settings::get_default_theme();

        // Build data attributes array, only including non-empty values.
        // entity takes priority over alias when both are present.
        $data_attrs = [
            'data-token'    => $atts['token'],
            'data-ha-url'   => $ha_url,
        ];

        if (!empty($atts['entity'])) {
            $data_attrs['data-entity'] = $atts['entity'];
        } else {
            $data_attrs['data-alias'] = $atts['alias'];
        }

        // Companion values follow the same entity/alias convention as the primary:
        // real entity IDs when entity= is set, aliases when alias= is set.
        if (!empty($atts['companion'])) {
            $data_attrs['data-companion'] = $atts['companion'];
        }

        if (!empty($theme_url)) {
            $data_attrs['data-theme-url'] = $theme_url;
        }

        if ($atts['lang'] !== 'auto') {
            $data_attrs['data-lang'] = $atts['lang'];
        }

        if ($atts['show_history'] === 'true') {
            $data_attrs['data-show-history'] = 'true';
            $data_attrs['data-hours-to-show'] = $atts['hours'];
            $data_attrs['data-graph']          = $atts['graph'];
        }

        // Build the attribute string safely
        $attr_string = '';
        foreach ($data_attrs as $key => $value) {
            $attr_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        // Enqueue the widget script if not already enqueued
        // (handles cases where the shortcode is used outside standard page flow)
        Harvest_Assets::enqueue();

        return sprintf('<div class="hrv-mount"%s></div>', $attr_string);
    }

    private static function render_error(string $message): string {
        // Only show errors to logged-in users with edit capability
        if (!current_user_can('edit_posts')) {
            return '';
        }
        return sprintf(
            '<div style="border:1px solid #c00;padding:8px;color:#c00;font-size:13px;">%s</div>',
            esc_html($message)
        );
    }
}
```

Note on error visibility: configuration errors (missing token, missing HA URL) are shown only to logged-in users with `edit_posts` capability. Public visitors see nothing rather than an error message that could expose configuration details.

### Dashboard Group Shortcode

A second shortcode `[harvest_group]` wraps multiple `[harvest]` shortcodes in an `hrv-group` div, enabling context inheritance (shared token and HA URL across all child cards).

```php
public static function render_group(array $atts, string $content = ''): string {
    $atts = shortcode_atts([
        'token'    => '',
        'theme'    => '',
        'lang'     => 'auto',
    ], $atts, 'harvest_group');

    $ha_url = Harvest_Settings::get_ha_url();

    $data_attrs = [
        'data-token'  => $atts['token'],
        'data-ha-url' => $ha_url,
    ];

    if (!empty($atts['theme'])) {
        $data_attrs['data-theme-url'] = $atts['theme'];
    }

    $attr_string = '';
    foreach ($data_attrs as $key => $value) {
        $attr_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
    }

    // do_shortcode processes nested [harvest] shortcodes inside the dashboard
    return sprintf(
        '<div class="hrv-group"%s>%s</div>',
        $attr_string,
        do_shortcode($content)
    );
}
```

Usage:

```
[harvest_group token="hwt_a3f9bc2d114ef5a6b7c8de"]
  [harvest entity="light.bedroom_main" companion="lock.bedroom_door"]
  [harvest entity="fan.bedroom_ceiling"]
  [harvest entity="sensor.bedroom_temperature" show_history="true"]
[/harvest_group]
```

Register both shortcodes in `init()`:

```php
public static function init(): void {
    add_shortcode('harvest', [self::class, 'render']);
    add_shortcode('harvest_group', [self::class, 'render_group']);
}
```

---

## 5. Script and Style Enqueuing

**File:** `includes/class-harvest-assets.php`

Enqueues the widget JS in the page footer. Uses WordPress's standard `wp_enqueue_script()` system to avoid duplicate loads when multiple shortcodes appear on the same page.

### Bundled vs CDN

The plugin ships with a specific pinned version of `harvest.min.js` in `assets/harvest.min.js`. This file is updated manually as part of each plugin release - when a new plugin version is tagged, the build process copies the appropriate widget version into the assets folder before the plugin zip is generated. WordPress users receive widget updates when they update the plugin through the WordPress plugin directory, not automatically.

The settings page offers a CDN option which loads `harvest.min.js` from jsDelivr at the `@latest` tag. This always pulls the most recent widget build within 12 hours of a new release (jsDelivr's TTL for `@latest`). The CDN option is suitable for users who want to stay current with widget improvements without waiting for a plugin release. The bundled option is suitable for users who prefer predictable, tested combinations of plugin and widget versions.

Neither option requires any user action beyond the initial settings page configuration. Switching between bundled and CDN takes effect on the next page load.

```php
<?php

class Harvest_Assets {

    private static bool $enqueued = false;

    public static function init(): void {
        add_action('wp_footer', [self::class, 'maybe_enqueue_from_footer'], 5);
    }

    public static function enqueue(): void {
        if (self::$enqueued) {
            return; // idempotent - WordPress's wp_enqueue_script also handles this
        }

        $source = Harvest_Settings::get_widget_source();

        if ($source === 'cdn') {
            $src = 'https://cdn.jsdelivr.net/gh/sfox38/harvest@latest/dist/harvest.min.js';
            $ver = null; // CDN manages versioning
        } else {
            $src = HARVEST_PLUGIN_URL . 'assets/harvest.min.js';
            $ver = HARVEST_VERSION;
        }

        wp_enqueue_script(
            'harvest-widget',
            $src,
            [],      // no dependencies
            $ver,
            true     // load in footer
        );

        self::$enqueued = true;
    }

    public static function maybe_enqueue_from_footer(): void {
        // Enqueue early in footer if any harvest shortcode is present on the page.
        // WordPress processes shortcodes during the_content(), which runs before
        // wp_footer, so by this point we know if any shortcode was rendered.
        // self::$enqueued will be true if any shortcode called enqueue() already.
        // This hook is a safety net for edge cases.
        if (self::$enqueued) {
            return;
        }
        // If we reach here, no shortcode was rendered, so do nothing.
    }
}
```

The script is loaded in the footer (`true` as the last argument to `wp_enqueue_script`). This is correct for the widget because the `MutationObserver` in `hrv-mount.js` handles elements added at any point, so the script does not need to be in the `<head>`.

Loading in the footer also avoids render-blocking, which improves page performance scores.

---

## 6. Content Security Policy

**File:** `includes/class-harvest-csp.php`

Many WordPress security plugins (Wordfence, iThemes Security, NinjaFirewall) add strict `Content-Security-Policy` headers. These can silently block the widget's WebSocket connection to the HA instance if `connect-src` does not include the HA URL.

### Directives injected

The plugin injects exactly one directive:

| Directive | Value added | Reason |
|-----------|------------|--------|
| `connect-src` | `wss://{ha_url_host}` | Permits the widget's WebSocket connection to HA |

No other CSP directives are modified. The plugin converts the HA URL from `https://` to `wss://` before injecting. For example, if the HA URL is `https://myhome.duckdns.org`, the injected value is `wss://myhome.duckdns.org`.

The plugin does not inject `script-src` because the widget script is loaded from the page itself (bundled) or from jsDelivr (CDN). If using the CDN option and the site has a strict `script-src`, the page author must add `https://cdn.jsdelivr.net` manually. The plugin settings page includes a note about this.

### Implementation

The HArvest plugin hooks into `wp_headers` to add the HA URL to the `connect-src` directive automatically.

```php
<?php

class Harvest_Csp {

    public static function init(): void {
        add_filter('wp_headers', [self::class, 'modify_csp_headers']);
    }

    public static function modify_csp_headers(array $headers): array {
        $ha_url = Harvest_Settings::get_ha_url();

        if (empty($ha_url)) {
            return $headers;
        }

        // Convert http(s):// URL to wss:// for WebSocket CSP directive
        $ws_url = preg_replace('/^https?:\/\//', 'wss://', $ha_url);

        if (isset($headers['Content-Security-Policy'])) {
            $headers['Content-Security-Policy'] = self::add_to_connect_src(
                $headers['Content-Security-Policy'],
                $ws_url
            );
        } else {
            // No existing CSP header - add a minimal one that permits the connection
            // Use report-only if we have no existing policy, to avoid breaking other things
            // that the site owner has not configured for.
            // Only add connect-src, leave everything else unrestricted.
            $headers['Content-Security-Policy'] = "connect-src 'self' {$ws_url}";
        }

        return $headers;
    }

    private static function add_to_connect_src(string $policy, string $url): string {
        if (str_contains($policy, 'connect-src')) {
            // connect-src directive exists - append the HA URL if not already present
            if (!str_contains($policy, $url)) {
                $policy = preg_replace(
                    '/connect-src([^;]*)/',
                    "connect-src$1 {$url}",
                    $policy
                );
            }
        } else {
            // No connect-src directive - append one
            $policy .= "; connect-src 'self' {$url}";
        }

        return $policy;
    }
}
```

### Important Caveat

The `wp_headers` filter only modifies headers that WordPress itself sets. If a security plugin sets CSP headers via a separate PHP hook or at the server level (nginx config, `.htaccess`), the `wp_headers` filter may not be able to modify them. The plugin settings page includes a note explaining this:

```php
// In the settings page render, after the main settings form:
?>
<hr>
<h2><?php esc_html_e('Content Security Policy', 'harvest'); ?></h2>
<p><?php esc_html_e(
    'HArvest automatically adds your Home Assistant URL to the Content-Security-Policy ' .
    'connect-src directive. This allows the widget to open a WebSocket connection to your ' .
    'Home Assistant instance.',
    'harvest'
); ?></p>
<p><?php esc_html_e(
    'If you use a security plugin that manages CSP headers separately (such as Wordfence ' .
    'or NinjaFirewall), you may need to manually add the following to your connect-src ' .
    'directive:',
    'harvest'
); ?></p>
<?php if (!empty(Harvest_Settings::get_ha_url())): ?>
<pre style="background:#f0f0f0;padding:8px;border-radius:4px;"><?php echo esc_html(
    preg_replace('/^https?:\/\//', 'wss://', Harvest_Settings::get_ha_url())
); ?></pre>
<?php endif; ?>
<?php
```

---

## 7. Theme JSON Upload Support

WordPress's media library does not allow JSON file uploads by default. The plugin adds `application/json` to the list of allowed MIME types so users can upload theme files to the media library and reference them by URL in the shortcode `theme` attribute.

This is added directly in `harvest.php` to keep it simple:

```php
add_filter('upload_mimes', function(array $mimes): array {
    $mimes['json'] = 'application/json';
    return $mimes;
});

// WordPress 4.7.1+ performs additional MIME type verification.
// This filter ensures JSON files pass the check_filetype_and_ext verification.
add_filter('wp_check_filetype_and_ext', function(
    array $data,
    string $file,
    string $filename,
    array $mimes
): array {
    if (empty($data['ext'])) {
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if ($ext === 'json') {
            $data['ext']  = 'json';
            $data['type'] = 'application/json';
        }
    }
    return $data;
}, 10, 4);
```

---

## 8. Multisite Support

On a WordPress multisite network, each site configures its own HArvest settings independently. The plugin uses standard WordPress options (not network options), so settings are per-site.

This is the correct behaviour: each site in the network may embed widgets from a different HA instance, or have a different HA URL, or use a different default theme. Network-wide settings would prevent this flexibility.

No special multisite code is required. WordPress's `get_option()` and `update_option()` are already site-scoped in a multisite context.

The plugin must be network-activated or per-site activated. Both work. Network activation is convenient but not required.

---

## 9. Compatibility Notes

### Minimum Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Classic editor (built-in to WordPress core, or via the Classic Editor plugin)

### WordPress Core Compatibility

The plugin uses only stable WordPress APIs that have existed since WP 5.0:

- `add_shortcode()`, `shortcode_atts()`, `do_shortcode()`
- `wp_enqueue_script()`
- `register_setting()`, `add_settings_section()`, `add_settings_field()`
- `add_options_page()`
- `wp_headers` filter
- `upload_mimes` filter
- `get_option()`, `update_option()`, `delete_option()`

No deprecated APIs are used. No jQuery dependency. No REST API dependency.

### Page Builders

The `[harvest]` shortcode works in any context that processes WordPress shortcodes. This includes:

- Classic editor posts and pages (primary target)
- Elementor HTML widget (shortcodes are processed when the widget contains `[harvest...]`)
- Divi Code module
- Beaver Builder HTML module
- WPBakery shortcode elements

Page builders that use their own rendering pipeline and do not call `do_shortcode()` on custom content may not render the shortcode. In those cases users should use the HTML/Code module rather than a shortcode module.

### Known Conflicts

**WP Rocket and other caching plugins:** Caching plugins may cache pages containing HArvest widgets. Because the widget connects to the live HA instance dynamically in the browser, caching the HTML output is fine - the widget state is always fetched fresh via WebSocket. No conflict expected.

**Autoptimize and script optimisation plugins:** These plugins concatenate and defer scripts, which can affect widget initialisation timing. The `MutationObserver` approach in the widget handles late script loading correctly. If issues occur, the HArvest script handle (`harvest-widget`) should be excluded from concatenation in the optimisation plugin's settings.

**Wordfence and NinjaFirewall:** These may set CSP headers at a level that `wp_headers` cannot modify. See Section 6 for the manual CSP directive that users may need to add.

**WooCommerce:** No known conflicts. WooCommerce does not interfere with shortcode processing or script enqueuing in a way that affects HArvest.

---

## 10. Testing Checklist

Before releasing a plugin version, verify the following manually:

**Shortcode rendering:**
- [ ] `[harvest token="..." entity="..."]` renders an `hrv-mount` div in the page source
- [ ] Missing `token` attribute shows error only to logged-in editors, nothing to visitors
- [ ] Missing `entity` attribute shows error only to logged-in editors, nothing to visitors
- [ ] Missing HA URL in settings shows error only to logged-in editors, nothing to visitors
- [ ] All optional attributes (companion, theme, lang, show_history, hours, graph) appear correctly in the div's data attributes when specified
- [ ] `[harvest_group]` wraps nested `[harvest]` shortcodes in an `hrv-group` div
- [ ] Token and entity attribute values are properly escaped (test with `<script>` in value)

**Script loading:**
- [ ] Widget JS loads once per page even with multiple shortcodes on the same page
- [ ] Widget JS loads in the footer, not the head
- [ ] Bundled source loads the local `assets/harvest.min.js`
- [ ] CDN source loads from `cdn.jsdelivr.net`
- [ ] Switching between bundled and CDN in settings takes effect on next page load

**Settings page:**
- [ ] Settings page is accessible at Settings > HArvest
- [ ] HA URL is saved and sanitised (trailing slashes removed, scheme required)
- [ ] Default theme URL is saved and sanitised
- [ ] All settings are removed on plugin deletion (not deactivation)
- [ ] Shortcode reference table renders correctly

**CSP:**
- [ ] `wss://` version of HA URL is added to `connect-src` in response headers
- [ ] Existing `connect-src` directive is extended, not overwritten
- [ ] If no CSP header exists, a minimal `connect-src` header is added

**Theme JSON uploads:**
- [ ] `.json` files can be uploaded to the media library
- [ ] The uploaded file URL can be used in the shortcode `theme` attribute

**Multisite:**
- [ ] Each site in a network has independent settings
- [ ] Plugin can be activated per-site or network-wide

**Compatibility:**
- [ ] Shortcode works in Elementor HTML widget
- [ ] Shortcode works in Divi Code module
- [ ] No JS errors in browser console on a page with a widget
- [ ] Widget connects to HA and renders correctly when HA URL and token are valid

---

## 11. Deferred Features (Plugin v1.1)

The following features are explicitly out of scope for plugin v1 and documented here for planning purposes. "Plugin v1.1" refers to the next WordPress plugin release and is independent of the HArvest Integration and widget spec version numbering.

### Gutenberg Block Editor Support

A native Gutenberg block provides a visual configuration UI within the block editor, eliminating the need to write shortcode syntax manually. The block would:

- Render a block inspector panel (right sidebar) with fields for token, entity, companion, theme, and language
- Output the same `hrv-mount` div as the shortcode on the frontend
- Show a static placeholder in the editor view (not a live preview, as the editor context cannot connect to HA)
- Be registered using `register_block_type()` with a `block.json` descriptor

The block would be a separate file (`blocks/harvest-card/`) alongside the existing `includes/` directory. The shortcode remains functional alongside the block - they are not mutually exclusive.

Implementation requires:

- `block.json` with block metadata and attributes schema
- `edit.js` for the editor component (React, as required by Gutenberg)
- `render.php` for the server-side frontend output (reuses the same div generation as the shortcode)
- `@wordpress/scripts` as a dev dependency for building the block JS

This is a meaningful increase in plugin complexity, which is why it is deferred. The shortcode serves the majority of power users in v1.

### WP-CLI Support

A `wp harvest` command family for managing plugin settings from the command line. Useful for automated deployments and staging environment setup.

```bash
wp harvest config set ha_url https://myhome.duckdns.org
wp harvest config get ha_url
```

### REST API Endpoint

An optional REST endpoint that returns the plugin's current configuration, useful for headless WordPress setups and theme developers who want to read the HA URL programmatically.
