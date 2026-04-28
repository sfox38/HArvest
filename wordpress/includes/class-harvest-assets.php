<?php
/**
 * class-harvest-assets.php - Widget JS script enqueuing.
 *
 * Enqueues the HArvest widget script in the page footer. Uses WordPress's
 * wp_enqueue_script() system to guarantee the script is loaded only once per
 * page, even when multiple [harvest] shortcodes appear on the same page.
 *
 * Two source modes are supported, selectable in the plugin settings:
 *
 *   bundled - loads assets/harvest.min.js from the plugin directory.
 *             Version-pinned to HARVEST_VERSION for cache-busting.
 *             Recommended for stability and predictable behaviour.
 *
 *   custom  - loads from a URL provided by the site administrator.
 *             Suitable for self-hosted or staged widget builds.
 *
 * The script is loaded in the footer (last argument true to wp_enqueue_script)
 * to avoid render-blocking. The MutationObserver in hrv-mount.js handles
 * elements that exist in the DOM at script evaluation time as well as those
 * added dynamically.
 */

defined( 'ABSPATH' ) || exit;

class Harvest_Assets {

    /**
     * Tracks whether the script has been enqueued in this request.
     * Used as a fast guard before delegating to wp_enqueue_script().
     */
    private static bool $enqueued = false;

    public static function init(): void {
        // Hook early in wp_footer (priority 5) as a safety net for edge cases
        // where a shortcode is rendered outside the standard the_content() flow.
        // By this point, all shortcodes have been processed, so self::$enqueued
        // reflects whether any shortcode called enqueue() during rendering.
        add_action( 'wp_footer', [ self::class, 'maybe_enqueue_from_footer' ], 5 );
    }

    /**
     * Enqueue the widget script. Safe to call multiple times - idempotent.
     * Called directly by Harvest_Shortcode::render() when a shortcode is used.
     */
    public static function enqueue(): void {
        if ( self::$enqueued ) {
            // WordPress's own enqueue system handles the dedup, but we skip
            // even the function call overhead once we know it is done.
            return;
        }

        $source = Harvest_Settings::get_widget_source();

        if ( $source === 'custom' ) {
            $custom_url = Harvest_Settings::get_widget_custom_url();
            if ( $custom_url ) {
                $src = $custom_url;
                // Pass null for $ver to omit the ?ver= query string. Cache-busting
                // is the responsibility of the URL owner.
                $ver = null;
            } else {
                // Custom selected but no URL saved - fall back to bundled.
                $src = HARVEST_PLUGIN_URL . 'assets/harvest.min.js';
                $ver = HARVEST_VERSION;
            }
        } else {
            $src = HARVEST_PLUGIN_URL . 'assets/harvest.min.js';
            $ver = HARVEST_VERSION;
        }

        wp_enqueue_script(
            'harvest-widget', // handle - unique identifier used by WP dedup
            $src,
            [],              // no dependencies
            $ver,
            true             // load in footer
        );

        self::$enqueued = true;
    }

    /**
     * Footer safety-net hook. If a shortcode enqueued the script during
     * content rendering, self::$enqueued is already true and this is a no-op.
     * If no shortcode was rendered (no widgets on this page), we also do
     * nothing - there is no reason to load the script.
     */
    public static function maybe_enqueue_from_footer(): void {
        // No action required here. Any shortcode that rendered this request
        // will have already called self::enqueue() directly. This hook exists
        // only as a documented safety net for future extension points.
    }
}
