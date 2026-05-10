<?php
/**
 * class-harvest-csp.php - Content Security Policy header injection.
 *
 * Adds the HA URL to two CSP directives:
 *
 *   connect-src - the WebSocket URL (wss://) so the widget can open a
 *                 WebSocket connection to the HA instance.
 *
 *   script-src  - the HTTPS origin so renderer pack JS files can be loaded
 *                 from the HA instance. Packs are loaded via external
 *                 `<script src="...">` tags pointing at the HA host, which
 *                 only requires the origin in script-src. No 'unsafe-inline'
 *                 or 'unsafe-eval' is needed - the widget contains no inline
 *                 script evaluation, no eval(), no Function(), and no
 *                 string-form setTimeout/setInterval.
 *
 * The HA URL is converted from https:// to wss:// for connect-src. For
 * example, https://myhome.duckdns.org becomes wss://myhome.duckdns.org.
 * The original https:// URL is used for script-src.
 *
 * Caveat: this filter modifies headers that WordPress itself sets via wp_headers.
 * Security plugins that set CSP headers via a separate mechanism (a different
 * PHP hook, nginx configuration, or .htaccess) may override what WordPress sets,
 * in which case this filter has no effect. The settings page explains this and
 * shows the manual CSP values for those cases.
 */

defined( 'ABSPATH' ) || exit;

class Harvest_Csp {

    public static function init(): void {
        add_filter( 'wp_headers', [ self::class, 'modify_csp_headers' ] );
    }

    /**
     * Add the HA URLs to the connect-src and script-src CSP directives.
     *
     * @param array $headers Associative array of HTTP headers.
     * @return array Modified headers.
     */
    public static function modify_csp_headers( array $headers ): array {
        $ha_url = Harvest_Settings::get_ha_url();

        if ( empty( $ha_url ) ) {
            return $headers;
        }

        // Validate URL structure before injecting into a security header.
        $parsed = wp_parse_url( $ha_url );
        if ( empty( $parsed['host'] ) ) {
            return $headers;
        }

        // Map HA URL scheme to its WebSocket equivalent for the CSP directive.
        // The widget at harvest-client.js maps http -> ws and https -> wss.
        // CSP must mirror that mapping or the WS handshake is blocked on
        // http:// HA installs (e.g. local LAN deployments).
        if ( str_starts_with( $ha_url, 'https://' ) ) {
            $ws_url = 'wss://' . substr( $ha_url, 8 );
        } elseif ( str_starts_with( $ha_url, 'http://' ) ) {
            $ws_url = 'ws://' . substr( $ha_url, 7 );
        } else {
            // Unknown scheme - fall back to the original behavior.
            $ws_url = preg_replace( '/^[a-z]+:\/\//', 'wss://', $ha_url );
        }

        // Normalise the HTTPS origin for script-src (strip trailing slash).
        $script_origin = rtrim( $ha_url, '/' );

        if ( isset( $headers['Content-Security-Policy'] ) ) {
            $headers['Content-Security-Policy'] = self::add_to_directive(
                $headers['Content-Security-Policy'],
                'connect-src',
                $ws_url
            );
            $headers['Content-Security-Policy'] = self::add_to_directive(
                $headers['Content-Security-Policy'],
                'script-src',
                $script_origin
            );
        } else {
            // No existing CSP header from WordPress. Add a minimal baseline
            // that permits the WebSocket connection and external pack loading
            // from the HA host. 'unsafe-inline' is deliberately NOT included:
            // packs are loaded via external <script src="..."> tags pointing
            // at the HA origin, which only needs the origin in script-src.
            // The widget contains no inline script evaluation, no eval(), no
            // Function(), and no string-form setTimeout/setInterval, so there
            // is no legitimate need for 'unsafe-inline' anywhere in this CSP.
            // Apply the same validation as add_to_directive() before interpolation.
            $valid_ws     = ! preg_match( '/[\s;,]/', $ws_url );
            $valid_script = ! preg_match( '/[\s;,]/', $script_origin );

            $connect_part = $valid_ws     ? " {$ws_url}"       : '';
            $script_part  = $valid_script ? " {$script_origin}" : '';

            $headers['Content-Security-Policy'] = "connect-src 'self'{$connect_part}; script-src 'self'{$script_part}";
        }

        return $headers;
    }

    /**
     * Append $url to a named directive in an existing CSP policy string.
     * If the directive does not exist, one is appended to the policy.
     * If $url is already present in the directive, the policy is unchanged.
     *
     * @param string $policy    Existing CSP policy string.
     * @param string $directive Directive name (e.g. "connect-src", "script-src").
     * @param string $url       URL to add (e.g. wss://myhome.duckdns.org).
     * @return string Updated policy string.
     */
    private static function add_to_directive( string $policy, string $directive, string $url ): string {
        // Regex-based CSP parsing is inherently fragile. Acceptable here
        // because both $directive and $url are admin-supplied, validated values.
        // Edge case: if an existing directive contains 'none', appending a URL
        // produces e.g. "'none' wss://..." which browsers treat as 'none' wins.
        // Reject URLs containing characters that could break the CSP header.
        if ( preg_match( '/[\s;,]/', $url ) ) {
            return $policy;
        }

        $escaped_dir = preg_quote( $directive, '/' );
        $escaped_url = preg_quote( $url, '/' );

        // Anchor on directive-name boundaries so e.g. "script-src" never matches
        // inside "script-src-elem" or "script-src-attr". A directive starts at
        // policy beginning or after `;` (with optional whitespace), and its name
        // is not followed by another directive-name character.
        $start    = '(^|;\s*)';
        $boundary = '(?![a-zA-Z0-9-])';

        // Check whether the URL is already in this directive's value.
        if ( preg_match( '/' . $start . $escaped_dir . $boundary . '[^;]*' . $escaped_url . '/', $policy ) ) {
            return $policy;
        }

        if ( preg_match( '/' . $start . $escaped_dir . $boundary . '/', $policy ) ) {
            // Directive exists - append the URL to its value.
            // Capture group 1 = leading separator (start-of-string or `;\s*`),
            // capture group 2 = the directive's existing value (up to next `;`).
            // Limit to 1 replacement in case of malformed duplicate directives.
            $policy = preg_replace(
                '/' . $start . $escaped_dir . $boundary . '([^;]*)/',
                '$1' . $directive . '$2 ' . $url,
                $policy,
                1
            );
        } else {
            // Directive does not exist - append a new one to the end of the policy.
            $policy .= "; {$directive} 'self' {$url}";
        }

        return $policy;
    }
}
