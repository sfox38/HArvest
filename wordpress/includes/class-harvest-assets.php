<?php
/** Enqueues the HArvest widget script once per page. */

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

        // Inject <link rel="preconnect"> to the HA host as early as possible
        // in <head> when the current post contains a Harvest shortcode. The
        // browser can then start TCP+TLS to the HA origin in parallel with
        // parsing the rest of the page, shaving ~100-300ms off the WebSocket
        // open latency by the time the widget script runs in the footer.
        add_action( 'wp_head', [ self::class, 'maybe_inject_preconnect' ], 1 );
    }

    /**
     * Emit a <link rel="preconnect"> for the configured HA origin if and
     * only if the current request is rendering a singular post that contains
     * a [harvest] or [harvest_group] shortcode. Keeps the preconnect off
     * archive/home pages and off pages that don't actually use the widget.
     */
    public static function maybe_inject_preconnect(): void {
        $ha_url = Harvest_Settings::get_ha_url();
        if ( $ha_url === '' ) {
            return;
        }
        if ( ! self::request_uses_harvest_shortcode() ) {
            return;
        }

        $origin = self::origin_from_url( $ha_url );
        if ( $origin === '' ) {
            return;
        }

        // crossorigin attribute is required for the preconnect to be reused
        // by the WebSocket upgrade (which is a CORS-relevant request from
        // the WP origin to the HA origin).
        printf(
            '<link rel="preconnect" href="%s" crossorigin>' . "\n",
            esc_url( $origin )
        );
    }

    /**
     * Returns true when the current main query resolves to a singular post
     * whose post_content contains a [harvest] or [harvest_group] shortcode.
     * Page-builder content stored outside post_content (Elementor, X Pro,
     * etc.) is not detected; those installs simply won't get the preconnect
     * benefit but the widget itself works the same.
     */
    private static function request_uses_harvest_shortcode(): bool {
        if ( ! function_exists( 'is_singular' ) || ! is_singular() ) {
            return false;
        }
        $post = function_exists( 'get_post' ) ? get_post() : null;
        if ( ! $post || empty( $post->post_content ) ) {
            return false;
        }
        return has_shortcode( $post->post_content, 'harvest' )
            || has_shortcode( $post->post_content, 'harvest_group' );
    }

    /**
     * Reduce a URL to its origin (scheme://host[:port]) so the preconnect
     * link doesn't carry path or query data that would defeat reuse.
     *
     * @param string $url
     * @return string Origin string, or empty if the input was unparseable.
     */
    private static function origin_from_url( string $url ): string {
        $parts = wp_parse_url( $url );
        if ( ! is_array( $parts ) || empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
            return '';
        }
        $origin = $parts['scheme'] . '://' . $parts['host'];
        if ( ! empty( $parts['port'] ) ) {
            $origin .= ':' . (int) $parts['port'];
        }
        return $origin;
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
        $src    = '';
        $ver    = null;

        if ( $source === 'custom' ) {
            $custom_url = Harvest_Settings::get_widget_custom_url();
            if ( $custom_url ) {
                $src = $custom_url;
                // Cache-busting is the URL owner's responsibility.
                $ver = null;
            }
            // If 'custom' was selected but no URL was saved, fall through
            // to the HA-served default below rather than emit nothing.
        }

        if ( $src === '' ) {
            // 'ha' mode (the default), or 'custom' with no URL configured.
            // Load from the integration's static path.
            $ha_url = Harvest_Settings::get_ha_url();
            if ( $ha_url === '' ) {
                // No HA URL configured at all - we can't build any working
                // src. Skip enqueue rather than emit a broken empty-host
                // URL. The Settings UI disables the HA-served radio in
                // this state, so this branch only fires on first install
                // or after a direct DB edit.
                return;
            }
            $src = rtrim( $ha_url, '/' ) . '/harvest_assets/harvest.min.js';
            // The HA static path is registered with cache_headers=False, so
            // a WordPress ?ver= query string adds no cache-busting value.
            $ver = null;
        }

        // Add the WordPress source marker for widget compatibility reporting.
        $src = self::with_wp_query_param( $src );

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
     * Append `wp=<HARVEST_VERSION>` to the script URL's query string,
     * preserving any existing query params (custom URLs may already have
     * their own cache-busters etc.). Idempotent: re-applies cleanly if
     * the param is already present.
     *
     * @param string $url
     * @return string
     */
    private static function with_wp_query_param( string $url ): string {
        // Strip any existing wp= we wrote previously, in case enqueue is
        // somehow re-run on the same URL string within one request.
        $stripped  = preg_replace( '/([?&])wp=[^&]*(&|$)/', '$1', $url );
        $stripped  = rtrim( $stripped, '?&' );
        $separator = ( strpos( $stripped, '?' ) === false ) ? '?' : '&';
        return $stripped . $separator . 'wp=' . rawurlencode( HARVEST_VERSION );
    }

}
