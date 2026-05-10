<?php
/**
 * class-harvest-settings.php - Admin settings page and options management.
 *
 * Registers the HArvest settings page under Settings > HArvest.
 * All plugin options use the harvest_ prefix and are stored via the
 * standard WordPress options API (get_option / update_option).
 *
 * Options managed here:
 *   harvest_ha_url            - External HA URL used by every widget on the site
 *   harvest_widget_source     - "bundled" or "custom"
 *   harvest_widget_custom_url - URL used when source is "custom"
 */

defined( 'ABSPATH' ) || exit;

class Harvest_Settings {

    public static function init(): void {
        add_action( 'admin_menu',                       [ self::class, 'add_settings_page' ] );
        add_action( 'admin_init',                       [ self::class, 'register_settings' ] );
        // AJAX endpoint that probes a URL from the WP server side. Powers
        // the live reachability indicators on the settings page (the
        // browser can't probe foreign URLs directly because of CORS, so
        // the WP server proxies the HEAD request).
        add_action( 'wp_ajax_harvest_check_url',        [ self::class, 'ajax_check_url' ] );
    }

    // ---------------------------------------------------------------------------
    // Admin menu
    // ---------------------------------------------------------------------------

    public static function add_settings_page(): void {
        add_options_page(
            __( 'HArvest Settings', 'harvest' ),
            __( 'HArvest',          'harvest' ),
            'manage_options',
            'harvest-settings',
            [ self::class, 'render_settings_page' ]
        );
    }

    // ---------------------------------------------------------------------------
    // Settings registration
    // ---------------------------------------------------------------------------

    public static function register_settings(): void {
        register_setting( 'harvest_settings_group', 'harvest_ha_url', [
            'type'              => 'string',
            'sanitize_callback' => [ self::class, 'sanitize_ha_url' ],
            'default'           => '',
        ] );

        register_setting( 'harvest_settings_group', 'harvest_widget_source', [
            'type'              => 'string',
            'sanitize_callback' => [ self::class, 'sanitize_widget_source' ],
            // 'ha' (HA-served) is the recommended default for new installs
            // since it always loads a widget bundle that matches the running
            // integration version. SPEC.md Section 12. Old installs that
            // saved 'bundled' continue to work via sanitize_widget_source.
            'default'           => 'ha',
        ] );

        register_setting( 'harvest_settings_group', 'harvest_widget_custom_url', [
            'type'              => 'string',
            'sanitize_callback' => [ self::class, 'sanitize_custom_url' ],
            'default'           => '',
        ] );

    }

    // ---------------------------------------------------------------------------
    // Sanitization callbacks
    // ---------------------------------------------------------------------------

    public static function sanitize_ha_url( ?string $url ): string {
        $url = esc_url_raw( trim( $url ?? '' ), [ 'http', 'https' ] );
        return rtrim( $url, '/' );
    }

    public static function sanitize_widget_source( ?string $source ): string {
        // Only 'ha' (HA-served) and 'custom' are valid. Pre-1.9.0 installs
        // that stored 'bundled' are silently migrated to 'ha' here, since
        // the plugin no longer ships assets/harvest.min.js in the zip
        // (the widget bundle is now ALWAYS loaded from the integration's
        // /harvest_assets/ static path - SPEC.md Section 12). Unknown /
        // blank values also collapse to 'ha'.
        $coerced = in_array( $source, [ 'ha', 'custom' ], true ) ? $source : 'ha';

        // Guard against the "custom selected but no URL provided" save
        // state. Without this, the settings page would persist
        // source='custom' alongside an empty custom URL - a bogus combo
        // that the runtime enqueue silently falls back from but that is
        // confusing to the admin (their selection is effectively
        // overridden at runtime). Coerce back to 'ha' here so the saved
        // state matches what actually loads, and surface a notice so the
        // admin understands the change.
        if ( $coerced === 'custom' ) {
            $custom_raw = isset( $_POST['harvest_widget_custom_url'] )
                ? trim( wp_unslash( (string) $_POST['harvest_widget_custom_url'] ) )
                : (string) get_option( 'harvest_widget_custom_url', '' );
            if ( $custom_raw === '' ) {
                add_settings_error(
                    'harvest_settings_group',
                    'harvest_widget_source_no_custom_url',
                    __( 'Widget JS source set to HA-served because no custom URL was provided.', 'harvest' ),
                    'warning'
                );
                return 'ha';
            }
        }

        return $coerced;
    }

    public static function sanitize_custom_url( ?string $url ): string {
        // The widget script src can legitimately be:
        //   - Full URL:       https://example.com/harvest.min.js
        //   - Absolute path:  /harvest.min.js, /assets/harvest.min.js
        //   - Relative path:  harvest.min.js, ./harvest.min.js, ../js/harvest.min.js
        //
        // The previous esc_url_raw() with a [http,https] protocol whitelist
        // silently stripped everything except full http/https URLs - which
        // surprised admins who legitimately wanted to host harvest.min.js
        // on the same server as the embed page (or even alongside an HTML
        // file on disk). Now we accept any of the three forms above and
        // only strip values that would break out of the script tag's src
        // attribute or inject script execution.
        $url = trim( (string) ( $url ?? '' ) );
        if ( $url === '' ) {
            return '';
        }

        // Reject control characters (including newlines and null bytes)
        // which never belong in a URL and could be used to bypass HTML-
        // attribute escaping in surprising ways.
        if ( preg_match( '/[\x00-\x1F\x7F]/', $url ) ) {
            return '';
        }

        // Reject characters that would close the src="" attribute or
        // open a new attribute. Spaces in JS file URLs are virtually
        // unheard of in practice; anyone who needs one can URL-encode it.
        if ( preg_match( '/[\s"\'<>`]/', $url ) ) {
            return '';
        }

        // Reject obvious XSS vectors. javascript: and data: in a script
        // src would execute attacker-controlled code under the embed
        // page's origin.
        $lower = strtolower( $url );
        if ( str_starts_with( $lower, 'javascript:' ) || str_starts_with( $lower, 'data:' ) || str_starts_with( $lower, 'vbscript:' ) ) {
            return '';
        }

        // For full URLs, gate on http/https only. Other schemes (file:, ftp:)
        // are not useful here.
        if ( preg_match( '#^[a-z][a-z0-9+.\-]*:#i', $url ) ) {
            // Has a scheme. Require http or https.
            if ( ! preg_match( '#^https?://#i', $url ) ) {
                return '';
            }
        }
        // Schemeless values (paths) are accepted as-is at this point.

        return $url;
    }

    // ---------------------------------------------------------------------------
    // AJAX URL reachability probe
    // ---------------------------------------------------------------------------

    /**
     * Probe a URL from the WP server side and report whether a HEAD
     * request succeeds. Used by the settings-page JS to render live
     * reachability indicators next to the Home Assistant URL and Custom
     * URL fields.
     *
     * Why server-side: a browser-side fetch from the WP admin page to a
     * foreign URL fails CORS for any URL that does not explicitly
     * allow the WP origin. Proxying through the WP server bypasses
     * the issue entirely - HTTP requests originating from the server
     * are not subject to CORS.
     *
     * The reported reachability is ADVISORY ONLY. A "not reachable"
     * result does not necessarily mean visitors will fail to load the
     * widget: visitors may be on a different network than the WP
     * server (LAN-only HA, internal corporate proxies, etc.). The JS
     * surfaces this nuance with prose, not a blocking error.
     *
     * Response shape (all fields always present):
     *   {
     *     ok:     bool,    // true when the URL responded with a 2xx status
     *     status: int,     // HTTP status code (0 if no response was received)
     *     reason: string,  // 'reachable' | 'unreachable' | 'relative' | 'invalid'
     *     message: string, // human-readable, suitable for direct display
     *   }
     *
     * Auth: nonce + manage_options capability. Both are required.
     */
    public static function ajax_check_url(): void {
        // Nonce check first - do not even hint at the structure of valid
        // responses to unauthenticated callers.
        if ( ! check_ajax_referer( 'harvest_check_url', 'nonce', false ) ) {
            wp_send_json_error( [ 'message' => __( 'Invalid security token.', 'harvest' ) ], 403 );
        }
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => __( 'Insufficient permissions.', 'harvest' ) ], 403 );
        }

        $raw = isset( $_POST['url'] ) ? trim( wp_unslash( (string) $_POST['url'] ) ) : '';
        if ( $raw === '' ) {
            wp_send_json_success( [
                'ok'      => false,
                'status'  => 0,
                'reason'  => 'invalid',
                'message' => __( 'Empty URL.', 'harvest' ),
            ] );
        }

        // Reuse the same defensive checks as sanitize_custom_url so we
        // never make outbound requests for obviously malformed values
        // (control chars, attribute-breakers, javascript: schemes etc.).
        if ( preg_match( '/[\x00-\x1F\x7F]/', $raw )
            || preg_match( '/[\s"\'<>`]/', $raw ) ) {
            wp_send_json_success( [
                'ok'      => false,
                'status'  => 0,
                'reason'  => 'invalid',
                'message' => __( 'URL contains invalid characters.', 'harvest' ),
            ] );
        }
        $lower = strtolower( $raw );
        if ( str_starts_with( $lower, 'javascript:' )
            || str_starts_with( $lower, 'data:' )
            || str_starts_with( $lower, 'vbscript:' ) ) {
            wp_send_json_success( [
                'ok'      => false,
                'status'  => 0,
                'reason'  => 'invalid',
                'message' => __( 'URL uses a disallowed scheme.', 'harvest' ),
            ] );
        }

        // Detect relative paths (no scheme + ://). These are valid for
        // the embed page but cannot be probed from here - they only
        // resolve in the visitor's browser, against whatever page they
        // happen to be loading.
        if ( ! preg_match( '#^https?://#i', $raw ) ) {
            wp_send_json_success( [
                'ok'      => false,
                'status'  => 0,
                'reason'  => 'relative',
                'message' => __( 'Relative path. Will be resolved against the embed page at runtime; cannot verify from here.', 'harvest' ),
            ] );
        }

        // Probe with HEAD. Short timeout so a hung remote does not lock
        // up the admin page. We use wp_remote_head (NOT wp_safe_remote_head)
        // because the "safe" variant blocks private IP ranges (192.168.x,
        // 10.x, etc.) as SSRF protection - which is overkill for an
        // admin-only diagnostic tool, and would always return red X for
        // anyone testing against a LAN-hosted Home Assistant. The auth
        // gate above (manage_options + nonce) already restricts access
        // to admins, so the SSRF risk is no greater than the admin
        // entering the URL into a browser tab themselves.
        $args = [
            'timeout'     => 4,
            'redirection' => 3,
            'headers'     => [
                // Some hosts return 405 for HEAD without a User-Agent.
                'User-Agent' => 'HArvest/' . HARVEST_VERSION . ' (URL reachability probe)',
            ],
        ];
        $response = wp_remote_head( $raw, $args );

        // HEAD-fallback: if HEAD failed or returned a non-2xx, retry with
        // a small ranged GET. Some static-file servers (notably some
        // reverse-proxy setups) return 405/501 for HEAD even when GET
        // works fine. The Range header keeps the response body trivial
        // so we do not actually download the bundle.
        $status = is_wp_error( $response ) ? 0 : (int) wp_remote_retrieve_response_code( $response );
        if ( $status === 0 || $status >= 400 ) {
            $args_get                       = $args;
            $args_get['headers']['Range']   = 'bytes=0-0';
            $response_get                   = wp_remote_get( $raw, $args_get );
            $status_get                     = is_wp_error( $response_get ) ? 0 : (int) wp_remote_retrieve_response_code( $response_get );
            // Only swap in the GET result if it is actually better; do
            // not let a broken GET overwrite a useful HEAD status code.
            if ( $status_get >= 200 && ( $status === 0 || $status_get < $status || $status_get < 400 ) ) {
                $response = $response_get;
                $status   = $status_get;
            }
        }

        if ( is_wp_error( $response ) && $status === 0 ) {
            wp_send_json_success( [
                'ok'      => false,
                'status'  => 0,
                'reason'  => 'unreachable',
                'message' => sprintf(
                    /* translators: %s: WP_Error message describing the network failure */
                    __( 'Could not reach the URL from this WordPress server (%s). Visitors may still be able to load it; save anyway if you know the URL is correct.', 'harvest' ),
                    $response->get_error_message()
                ),
            ] );
        }

        $ok = $status >= 200 && $status < 300;
        // 206 Partial Content (from the GET fallback's Range request) and
        // 416 Range Not Satisfiable also count as "the file is there".
        if ( $status === 206 || $status === 416 ) {
            $ok = true;
        }
        wp_send_json_success( [
            'ok'      => $ok,
            'status'  => $status,
            'reason'  => $ok ? 'reachable' : 'unreachable',
            'message' => $ok
                ? sprintf(
                    /* translators: %d: HTTP status code */
                    __( 'URL is reachable (HTTP %d).', 'harvest' ),
                    $status
                )
                : sprintf(
                    /* translators: %d: HTTP status code */
                    __( 'WordPress server got HTTP %d when fetching this URL. Visitors may still see different behaviour.', 'harvest' ),
                    $status
                ),
        ] );
    }

    // ---------------------------------------------------------------------------
    // Settings page renderer
    // ---------------------------------------------------------------------------

    public static function render_settings_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $ha_url = self::get_ha_url();
        $ws_url = $ha_url ? preg_replace( '/^https?:\/\//', 'wss://', $ha_url ) : '';
        ?>
        <div class="wrap">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

            <?php settings_errors( 'harvest_settings_group' ); ?>

            <form method="post" action="options.php">
                <?php settings_fields( 'harvest_settings_group' ); ?>

                <table class="form-table" role="presentation">

                    <tr>
                        <th scope="row">
                            <label for="harvest_ha_url">
                                <?php esc_html_e( 'Home Assistant URL', 'harvest' ); ?>
                                <span style="color:#d63638" aria-hidden="true">*</span>
                            </label>
                        </th>
                        <td>
                            <input
                                type="url"
                                id="harvest_ha_url"
                                name="harvest_ha_url"
                                value="<?php echo esc_attr( get_option( 'harvest_ha_url' ) ); ?>"
                                class="regular-text"
                                placeholder="https://myhome.duckdns.org"
                                required
                            >
                            <p class="description">
                                <?php esc_html_e(
                                    'Required. The external URL of your Home Assistant instance. Used by every widget on your site.',
                                    'harvest'
                                ); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <?php esc_html_e( 'Widget JS source', 'harvest' ); ?>
                        </th>
                        <td>
                            <?php
                            // Route through get_widget_source() so legacy
                            // 'bundled' values from pre-1.9.0 installs are
                            // migrated to 'ha' here too. Otherwise neither
                            // radio shows as checked and the page looks
                            // broken on first render after upgrade.
                            $source = self::get_widget_source();
                            ?>
                            <label>
                                <input type="radio"
                                    name="harvest_widget_source"
                                    value="ha"
                                    <?php checked( $source, 'ha' ); ?>>
                                <?php esc_html_e( 'HA-served (recommended)', 'harvest' ); ?>
                            </label>
                            <span id="harvest-ha-preview-wrap"
                                style="<?php echo $source === 'ha' ? 'display:block;margin-left:24px;color:#646970;font-size:12px;font-family:Consolas,Monaco,monospace;word-break:break-all;' : 'display:none;'; ?>">
                                <span id="harvest-ha-preview-text"
                                    data-no-url-msg="<?php echo esc_attr__( 'Set the Home Assistant URL above to enable this option.', 'harvest' ); ?>">
                                    <?php
                                    if ( $ha_url === '' ) {
                                        esc_html_e(
                                            'Set the Home Assistant URL above to enable this option.',
                                            'harvest'
                                        );
                                    } else {
                                        echo esc_html( $ha_url . '/harvest_assets/harvest.min.js' );
                                    }
                                    ?>
                                </span>
                                <span id="harvest-ha-url-indicator" class="harvest-url-indicator" data-status="idle"></span>
                            </span>
                            <br>
                            <label>
                                <input type="radio"
                                    name="harvest_widget_source"
                                    value="custom"
                                    <?php checked( $source, 'custom' ); ?>>
                                <?php esc_html_e( 'Use custom URL', 'harvest' ); ?>
                            </label>
                            <span id="harvest-custom-url-wrap"
                                style="<?php echo $source === 'custom' ? '' : 'display:none;'; ?>">
                                <br>
                                <input
                                    type="text"
                                    id="harvest_widget_custom_url"
                                    name="harvest_widget_custom_url"
                                    value="<?php echo esc_attr( get_option( 'harvest_widget_custom_url' ) ); ?>"
                                    class="regular-text"
                                    placeholder="<?php esc_attr_e( 'https://example.com/harvest.min.js, /harvest.min.js, or harvest.min.js', 'harvest' ); ?>"
                                >
                                <span id="harvest-custom-url-indicator" class="harvest-url-indicator" data-status="idle"></span>
                            </span>
                            <style>
                                /* Reachability-indicator visuals (shared by HA URL and Custom URL fields) */
                                .harvest-url-indicator {
                                    display: inline-block;
                                    margin-left: 8px;
                                    font-size: 16px;
                                    line-height: 1;
                                    vertical-align: middle;
                                    min-width: 16px;
                                }
                                .harvest-url-indicator[data-status="idle"]    { display: none; }
                                .harvest-url-indicator[data-status="checking"]{ color: #646970; }
                                .harvest-url-indicator[data-status="ok"]      { color: #00a32a; }
                                .harvest-url-indicator[data-status="warn"]    { color: #dba617; }
                                .harvest-url-indicator[data-status="error"]   { color: #d63638; }
                                .harvest-url-message {
                                    display: block;
                                    margin-top: 4px;
                                    font-size: 12px;
                                    color: #646970;
                                    line-height: 1.4;
                                    max-width: 640px;
                                }
                                .harvest-url-message[data-status="warn"]      { color: #874e00; }
                                .harvest-url-message[data-status="error"]    { color: #8a0000; }
                                .harvest-url-message:empty                    { display: none; }
                            </style>
                            <script>
                            document.addEventListener('DOMContentLoaded', function(){
                                var radios       = document.querySelectorAll('input[name="harvest_widget_source"]');
                                var customWrap   = document.getElementById('harvest-custom-url-wrap');
                                var haWrap       = document.getElementById('harvest-ha-preview-wrap');
                                var haPreview    = document.getElementById('harvest-ha-preview-text');
                                var haUrlField   = document.getElementById('harvest_ha_url');
                                var noUrlMsg     = haPreview.getAttribute('data-no-url-msg');

                                // Reachability-probe wiring (SPEC.md Section 12).
                                // Use a relative URL so the AJAX request always stays
                                // same-origin even if the WP siteurl canonical URL
                                // differs from the URL the admin actually browsed to
                                // (e.g. www.example.com canonical vs. example.com
                                // browsed). Mismatch makes credentials:'same-origin'
                                // drop the auth cookie, admin-ajax.php sees the user
                                // as logged-out, falls through to wp_ajax_nopriv_*
                                // (unregistered), and returns literal "0" - which
                                // surfaces in our JS as "unexpected response".
                                // Browser resolves "admin-ajax.php" against the
                                // current /wp-admin/ page so it always lands on the
                                // correct host with the correct cookie scope.
                                var ajaxUrl  = 'admin-ajax.php';
                                var nonce    = <?php echo wp_json_encode( wp_create_nonce( 'harvest_check_url' ) ); ?>;
                                var haInd    = document.getElementById('harvest-ha-url-indicator');
                                var customF  = document.getElementById('harvest_widget_custom_url');
                                var customI  = document.getElementById('harvest-custom-url-indicator');

                                // Show/hide the per-option detail rows when
                                // the user clicks a radio.
                                for (var i = 0; i < radios.length; i++) {
                                    radios[i].addEventListener('change', function(){
                                        customWrap.style.display = this.value === 'custom' ? '' : 'none';
                                        haWrap.style.display     = this.value === 'ha'     ? 'block' : 'none';
                                        // Re-probe whichever field is now in scope so the
                                        // indicator is current.
                                        if (this.value === 'custom') { scheduleCheck('custom'); }
                                        else                         { scheduleCheck('ha');     }
                                    });
                                }

                                // Live-update the HA-served preview URL as the
                                // user types in the HA URL field above.
                                function updateHaPreview() {
                                    var raw = (haUrlField.value || '').trim().replace(/\/+$/, '');
                                    if (raw === '') {
                                        haPreview.textContent = noUrlMsg;
                                    } else {
                                        haPreview.textContent = raw + '/harvest_assets/harvest.min.js';
                                    }
                                }

                                // Indicator helpers. Each indicator <span> gets a
                                // sibling .harvest-url-message <div> for the prose
                                // explanation (lazily created on first message).
                                function setIndicator(indicator, status, glyph, msg) {
                                    indicator.setAttribute('data-status', status);
                                    indicator.textContent = glyph;
                                    indicator.setAttribute('title', msg || '');
                                    var msgEl = indicator.parentNode.querySelector('.harvest-url-message');
                                    if (!msgEl) {
                                        msgEl = document.createElement('div');
                                        msgEl.className = 'harvest-url-message';
                                        indicator.parentNode.appendChild(msgEl);
                                    }
                                    msgEl.setAttribute('data-status', status);
                                    msgEl.textContent = (status === 'ok' || status === 'idle' || status === 'checking') ? '' : (msg || '');
                                }

                                function probe(url, indicator) {
                                    var trimmed = (url || '').trim();
                                    if (trimmed === '') {
                                        setIndicator(indicator, 'idle', '', '');
                                        return;
                                    }
                                    setIndicator(indicator, 'checking', '⏳', '');
                                    var body = new URLSearchParams();
                                    body.append('action', 'harvest_check_url');
                                    body.append('nonce',  nonce);
                                    body.append('url',    trimmed);
                                    fetch(ajaxUrl, { method: 'POST', credentials: 'same-origin', body: body })
                                        .then(function(r){
                                            // Capture HTTP status alongside the body so a 403/500 from
                                            // admin-ajax (e.g. expired nonce) is diagnosable rather than
                                            // showing as a generic "URL invalid" red X.
                                            return r.json().then(function(j){ return { httpStatus: r.status, body: j }; });
                                        })
                                        .then(function(parsed){
                                            var j = parsed.body;
                                            var d = (j && j.data) || {};
                                            if (j && j.success === false) {
                                                // Auth/nonce failure - admin-ajax wraps the error message.
                                                console.warn('[HArvest] check_url rejected:', parsed.httpStatus, d);
                                                setIndicator(indicator, 'error', '✗',
                                                    'Couldn\'t check this URL: ' + (d.message || 'request rejected (HTTP ' + parsed.httpStatus + ')') +
                                                    ' Try reloading the page; the security token may have expired.');
                                                return;
                                            }
                                            if (d.reason === 'reachable') {
                                                setIndicator(indicator, 'ok', '✓', d.message || '');
                                            } else if (d.reason === 'relative') {
                                                setIndicator(indicator, 'warn', 'ⓘ', d.message || '');
                                            } else if (d.reason === 'unreachable') {
                                                setIndicator(indicator, 'warn', '⚠', d.message || '');
                                            } else if (d.reason === 'invalid') {
                                                setIndicator(indicator, 'error', '✗', d.message || 'Invalid URL.');
                                            } else {
                                                console.warn('[HArvest] check_url unexpected response:', parsed.httpStatus, j);
                                                setIndicator(indicator, 'error', '✗',
                                                    'Unexpected response from the WordPress server. Open the browser console for details.');
                                            }
                                        })
                                        .catch(function(err){
                                            console.warn('[HArvest] check_url fetch failed:', err);
                                            setIndicator(indicator, 'error', '✗',
                                                'Could not contact the WordPress AJAX endpoint. Open the browser console for details.');
                                        });
                                }

                                // 500ms-debounced trigger plus immediate trigger on blur.
                                var timers = {};
                                function scheduleCheck(which) {
                                    if (timers[which]) { clearTimeout(timers[which]); }
                                    timers[which] = setTimeout(function(){ runCheck(which); }, 500);
                                }
                                function runCheck(which) {
                                    if (which === 'ha') {
                                        var raw = (haUrlField.value || '').trim().replace(/\/+$/, '');
                                        if (raw === '') { setIndicator(haInd, 'idle', '', ''); return; }
                                        probe(raw + '/harvest_assets/harvest.min.js', haInd);
                                    } else if (which === 'custom') {
                                        probe((customF && customF.value) || '', customI);
                                    }
                                }

                                if (haUrlField) {
                                    haUrlField.addEventListener('input',  function(){ updateHaPreview(); scheduleCheck('ha'); });
                                    haUrlField.addEventListener('change', function(){ updateHaPreview(); scheduleCheck('ha'); });
                                    haUrlField.addEventListener('blur',   function(){ runCheck('ha'); });
                                }
                                if (customF) {
                                    customF.addEventListener('input',  function(){ scheduleCheck('custom'); });
                                    customF.addEventListener('change', function(){ scheduleCheck('custom'); });
                                    customF.addEventListener('blur',   function(){ runCheck('custom'); });
                                }

                                // Probe on page load for the currently-selected source so
                                // admins see status immediately, not just after editing.
                                var initialSource = document.querySelector('input[name="harvest_widget_source"]:checked');
                                if (initialSource) { runCheck(initialSource.value === 'custom' ? 'custom' : 'ha'); }
                            });
                            </script>
                            <p class="description">
                                <?php esc_html_e(
                                    'HA-served loads the widget bundle directly from your Home Assistant instance, so it always matches the running integration version. Custom URL is for self-hosted or staging widget builds. The HA-served option requires the Home Assistant URL above to be set; if it is empty, no widget script is enqueued at all.',
                                    'harvest'
                                ); ?>
                            </p>
                        </td>
                    </tr>

                </table>

                <?php submit_button(); ?>
            </form>

            <hr>
            <h2><?php esc_html_e( 'Shortcode usage', 'harvest' ); ?></h2>
            <p><?php esc_html_e(
                'Paste the shortcode below into any post or page using the Classic editor:',
                'harvest'
            ); ?></p>
            <pre style="background:#f0f0f0;padding:12px;border-radius:4px;"
            >[harvest token="hwt_YOUR_TOKEN" entity="light.your_entity"]</pre>

            <h3><?php esc_html_e( 'Available shortcode parameters', 'harvest' ); ?></h3>
            <table class="widefat striped" style="max-width:700px">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Parameter',   'harvest' ); ?></th>
                        <th><?php esc_html_e( 'Required',    'harvest' ); ?></th>
                        <th><?php esc_html_e( 'Description', 'harvest' ); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>token</code></td>
                        <td><?php esc_html_e( 'Yes', 'harvest' ); ?></td>
                        <td><?php esc_html_e( 'Your HArvest widget token ID.', 'harvest' ); ?></td>
                    </tr>
                    <tr>
                        <td><code>entity</code></td>
                        <td><?php esc_html_e( 'Yes*', 'harvest' ); ?></td>
                        <td><?php esc_html_e(
                            'HA entity ID, e.g. light.bedroom_main. Required unless alias is set. If both entity and alias are provided, entity takes priority.',
                            'harvest'
                        ); ?></td>
                    </tr>
                    <tr>
                        <td><code>alias</code></td>
                        <td><?php esc_html_e( 'Yes*', 'harvest' ); ?></td>
                        <td><?php esc_html_e(
                            'Entity alias (8-character random key). Use instead of entity when "Show as aliases" is checked in the wizard. Either entity or alias is required, not both. Companion values should match - use aliases when alias is set, real IDs when entity is set.',
                            'harvest'
                        ); ?></td>
                    </tr>
                    <tr>
                        <td><code>token-secret</code></td>
                        <td><?php esc_html_e( 'No', 'harvest' ); ?></td>
                        <td><?php esc_html_e(
                            'HMAC secret for enhanced security. Set via the token editor in Home Assistant.',
                            'harvest'
                        ); ?></td>
                    </tr>
                </tbody>
            </table>

            <hr>
            <h2><?php esc_html_e( 'Content Security Policy', 'harvest' ); ?></h2>
            <p><?php esc_html_e(
                'HArvest automatically adds your Home Assistant URL to the Content-Security-Policy connect-src directive. This allows the widget to open a WebSocket connection to your Home Assistant instance.',
                'harvest'
            ); ?></p>
            <p><?php esc_html_e(
                'If you use a security plugin that manages CSP headers separately (such as Wordfence or NinjaFirewall), you may need to manually add the following to your connect-src directive:',
                'harvest'
            ); ?></p>
            <?php if ( $ws_url ) : ?>
            <pre style="background:#f0f0f0;padding:8px;border-radius:4px;"><?php echo esc_html( $ws_url ); ?></pre>
            <?php endif; ?>

            <hr>
            <h2><?php esc_html_e( 'Backup note', 'harvest' ); ?></h2>
            <p><?php esc_html_e(
                'HArvest plugin settings (HA URL, widget source, custom URL) are stored in the WordPress database and are included in standard WordPress backups. The plugin itself does not store HMAC token secrets - those live in Home Assistant.',
                'harvest'
            ); ?></p>
            <p><?php esc_html_e(
                'However: if you embed an HMAC token secret directly in a [harvest] shortcode (token-secret="..."), that secret IS stored in the post or page content and is therefore included in WordPress backups, post revisions, and any export of that content. Treat the secret as part of the page, not the plugin.',
                'harvest'
            ); ?></p>
        </div>
        <?php
    }

    // ---------------------------------------------------------------------------
    // Accessors used by other plugin classes
    // ---------------------------------------------------------------------------

    public static function get_ha_url(): string {
        return (string) get_option( 'harvest_ha_url', '' );
    }

    public static function get_widget_source(): string {
        // Default for fresh installs: 'ha' (HA-served, SPEC.md Section 12).
        // Pre-1.9.0 installs that stored 'bundled' are transparently
        // migrated to 'ha' at read time too: the plugin no longer ships
        // assets/harvest.min.js, so honoring 'bundled' would 404 the
        // widget. The sanitizer also coerces this on next save.
        $stored = (string) get_option( 'harvest_widget_source', 'ha' );
        if ( $stored === 'bundled' ) {
            return 'ha';
        }
        return $stored;
    }

    public static function get_widget_custom_url(): string {
        return (string) get_option( 'harvest_widget_custom_url', '' );
    }
}
