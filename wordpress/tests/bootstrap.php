<?php
/**
 * bootstrap.php - Test bootstrap for HArvest WordPress plugin tests.
 *
 * Defines all WordPress constants and function stubs needed by the plugin
 * classes. Uses a global option store to simulate get_option/add_option/
 * delete_option without a live WordPress installation.
 */

// ---------------------------------------------------------------------------
// Constants required by the plugin files.
// ---------------------------------------------------------------------------

define( 'ABSPATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'HARVEST_VERSION', '1.0.0' );
define( 'HARVEST_PLUGIN_DIR', dirname( __DIR__ ) . '/' );
define( 'HARVEST_PLUGIN_URL', 'http://example.com/wp-content/plugins/harvest/' );
define( 'WP_UNINSTALL_PLUGIN', true );

// ---------------------------------------------------------------------------
// Global state stores (reset in each test's setUp).
// ---------------------------------------------------------------------------

$GLOBALS['_harvest_options']   = [];
$GLOBALS['_harvest_scripts']   = [];
$GLOBALS['_harvest_actions']   = [];
$GLOBALS['_harvest_filters']   = [];
$GLOBALS['_harvest_shortcodes'] = [];
$GLOBALS['_harvest_user_can']  = true;
$GLOBALS['_harvest_safe_remote_head_calls'] = 0;
$GLOBALS['_harvest_safe_remote_get_calls'] = 0;
$GLOBALS['_harvest_unsafe_remote_head_calls'] = 0;
$GLOBALS['_harvest_unsafe_remote_get_calls'] = 0;

// ---------------------------------------------------------------------------
// WordPress options API stubs.
// ---------------------------------------------------------------------------

function get_option( string $option, $default = false ) {
    return $GLOBALS['_harvest_options'][ $option ] ?? $default;
}

function add_option( string $option, $value = '' ): bool {
    if ( array_key_exists( $option, $GLOBALS['_harvest_options'] ) ) {
        return false;
    }
    $GLOBALS['_harvest_options'][ $option ] = $value;
    return true;
}

function update_option( string $option, $value ): bool {
    $GLOBALS['_harvest_options'][ $option ] = $value;
    return true;
}

function delete_option( string $option ): bool {
    if ( array_key_exists( $option, $GLOBALS['_harvest_options'] ) ) {
        unset( $GLOBALS['_harvest_options'][ $option ] );
        return true;
    }
    return false;
}

function add_settings_error( string $setting, string $code, string $message, string $type = 'error' ): void {
    $GLOBALS['_harvest_settings_errors'][] = [
        'setting' => $setting,
        'code'    => $code,
        'message' => $message,
        'type'    => $type,
    ];
}

function wp_unslash( $value ) {
    if ( is_string( $value ) ) {
        return stripslashes( $value );
    }
    if ( is_array( $value ) ) {
        return array_map( 'wp_unslash', $value );
    }
    return $value;
}

// ---------------------------------------------------------------------------
// WordPress hook stubs.
// ---------------------------------------------------------------------------

function add_action( string $hook, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
    $GLOBALS['_harvest_actions'][] = [
        'hook'     => $hook,
        'callback' => $callback,
        'priority' => $priority,
    ];
    return true;
}

function add_filter( string $hook, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
    $GLOBALS['_harvest_filters'][] = [
        'hook'     => $hook,
        'callback' => $callback,
        'priority' => $priority,
    ];
    return true;
}

function add_shortcode( string $tag, $callback ): void {
    $GLOBALS['_harvest_shortcodes'][ $tag ] = $callback;
}

function do_shortcode( string $content ): string {
    return $content;
}

// ---------------------------------------------------------------------------
// WordPress user capability stub.
// ---------------------------------------------------------------------------

function current_user_can( string $capability ): bool {
    return (bool) ( $GLOBALS['_harvest_user_can'] ?? true );
}

// ---------------------------------------------------------------------------
// WordPress escaping stubs (simplified - encode special HTML chars).
// ---------------------------------------------------------------------------

function esc_attr( string $text ): string {
    return htmlspecialchars( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

function esc_html( string $text ): string {
    return htmlspecialchars( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

function esc_url_raw( string $url ): string {
    return trim( $url );
}

function wp_parse_url( string $url, int $component = -1 ) {
    return $component === -1 ? parse_url( $url ) : parse_url( $url, $component );
}

function esc_url( string $url ): string {
    // Mirror WP behaviour just enough for assertions: strip control chars
    // and double-quote/HTML escape what's left. Tests only check the
    // resulting attribute value matches the input origin.
    $stripped = preg_replace( '/[\x00-\x1F\x7F]/', '', $url );
    return htmlspecialchars( $stripped, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

function is_singular( $post_types = '' ): bool {
    return $GLOBALS['_harvest_is_singular'] ?? false;
}

function get_post( $post = null ) {
    return $GLOBALS['_harvest_current_post'] ?? null;
}

function has_shortcode( string $content, string $tag ): bool {
    if ( $content === '' ) {
        return false;
    }
    return (bool) preg_match( '/\[' . preg_quote( $tag, '/' ) . '(\s|\])/', $content );
}

function _doing_it_wrong( string $function_name, string $message, string $version ): void {}

function esc_html_e( string $text, string $domain = 'default' ): void {
    echo htmlspecialchars( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

// ---------------------------------------------------------------------------
// WordPress translation stubs.
// ---------------------------------------------------------------------------

function __( string $text, string $domain = 'default' ): string {
    return $text;
}

function esc_html__( string $text, string $domain = 'default' ): string {
    return htmlspecialchars( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

// ---------------------------------------------------------------------------
// WordPress script enqueueing stub.
// ---------------------------------------------------------------------------

function wp_enqueue_script(
    string $handle,
    string $src = '',
    array $deps = [],
    $ver = false,
    bool $in_footer = false
): void {
    $GLOBALS['_harvest_scripts'][] = [
        'handle'    => $handle,
        'src'       => $src,
        'deps'      => $deps,
        'ver'       => $ver,
        'in_footer' => $in_footer,
    ];
}

// ---------------------------------------------------------------------------
// WordPress settings/admin stubs.
// ---------------------------------------------------------------------------

function register_setting( string $option_group, string $option_name, array $args = [] ): void {}
function add_options_page( string $page_title, string $menu_title, string $capability, string $menu_slug, $callback = '' ): bool { return true; }
function settings_fields( string $option_group ): void {}
function settings_errors( string $setting = '', bool $sanitize = false, bool $hide_on_update = false ): void {}
function get_admin_page_title(): string { return 'HArvest Settings'; }
function submit_button( ?string $text = null, string $type = 'primary', string $name = 'submit', bool $wrap = true, $other_attributes = null ): void {}

function checked( $checked, $current = true, bool $echo = true ): string {
    $result = ( $checked == $current ) ? ' checked="checked"' : '';
    if ( $echo ) {
        echo $result;
    }
    return $result;
}

// ---------------------------------------------------------------------------
// WordPress shortcode_atts stub - mirrors WP behaviour (no filters).
// ---------------------------------------------------------------------------

function shortcode_atts( array $pairs, $atts, string $shortcode = '' ): array {
    $atts = (array) $atts;
    $out  = [];
    foreach ( $pairs as $name => $default ) {
        $out[ $name ] = array_key_exists( $name, $atts ) ? $atts[ $name ] : $default;
    }
    return $out;
}

// ---------------------------------------------------------------------------
// WordPress plugin lifecycle stubs.
// ---------------------------------------------------------------------------

function register_activation_hook( string $file, $callback ): void {}
function register_deactivation_hook( string $file, $callback ): void {}
function plugin_dir_path( string $file ): string { return dirname( $file ) . DIRECTORY_SEPARATOR; }
function plugin_dir_url( string $file ): string {
    return 'http://example.com/wp-content/plugins/' . basename( dirname( $file ) ) . '/';
}

// ---------------------------------------------------------------------------
// WordPress AJAX / nonce / HTTP-client stubs.
//
// Tests record sent JSON via $GLOBALS['_harvest_ajax_response'] and throw
// a JsonResponseException to simulate WordPress's wp_die-after-send flow,
// so the production handler can just call wp_send_json_success/_error and
// stop without polluting other tests with prior responses.
// ---------------------------------------------------------------------------

class JsonResponseException extends \Exception {}

function wp_send_json_success( $data = null, ?int $status = null ): void {
    $GLOBALS['_harvest_ajax_response'] = [ 'success' => true, 'data' => $data, 'status' => $status ];
    throw new JsonResponseException( 'success' );
}

function wp_send_json_error( $data = null, ?int $status = null ): void {
    $GLOBALS['_harvest_ajax_response'] = [ 'success' => false, 'data' => $data, 'status' => $status ];
    throw new JsonResponseException( 'error' );
}

function check_ajax_referer( string $action, string $query_arg = '_wpnonce', bool $die = true ) {
    return (bool) ( $GLOBALS['_harvest_nonce_valid'] ?? true );
}

function wp_create_nonce( string $action ): string { return 'test-nonce-' . $action; }

function admin_url( string $path = '' ): string { return 'http://example.com/wp-admin/' . ltrim( $path, '/' ); }

function wp_json_encode( $data, int $options = 0 ): string {
    return json_encode( $data, $options );
}

function is_wp_error( $thing ): bool {
    return $thing instanceof \WP_Error;
}

function wp_safe_remote_head( string $url, array $args = [] ) {
    $GLOBALS['_harvest_safe_remote_head_calls']++;
    // Tests configure $GLOBALS['_harvest_remote_head'] as either a
    // WP_Error instance or an array shaped like a WP HTTP API response.
    $configured = $GLOBALS['_harvest_remote_head'] ?? null;
    if ( $configured === null ) {
        return new \WP_Error( 'no_test_response', 'Test did not configure _harvest_remote_head.' );
    }
    return $configured;
}

function wp_remote_head( string $url, array $args = [] ) {
    $GLOBALS['_harvest_unsafe_remote_head_calls']++;
    return $GLOBALS['_harvest_remote_head'] ?? new \WP_Error( 'no_test_response', 'Test did not configure _harvest_remote_head.' );
}

function wp_remote_get( string $url, array $args = [] ) {
    $GLOBALS['_harvest_unsafe_remote_get_calls']++;
    // HEAD-fallback path uses GET when HEAD fails or returns 4xx/5xx.
    // Tests can configure a separate response for the GET retry via
    // $GLOBALS['_harvest_remote_get']; if absent, the fallback returns
    // the same canned response as HEAD (so happy paths only need to
    // configure one global).
    $configured = $GLOBALS['_harvest_remote_get'] ?? $GLOBALS['_harvest_remote_head'] ?? null;
    if ( $configured === null ) {
        return new \WP_Error( 'no_test_response', 'Test did not configure _harvest_remote_get.' );
    }
    return $configured;
}

function wp_safe_remote_get( string $url, array $args = [] ) {
    $GLOBALS['_harvest_safe_remote_get_calls']++;
    $configured = $GLOBALS['_harvest_remote_get'] ?? $GLOBALS['_harvest_remote_head'] ?? null;
    if ( $configured === null ) {
        return new \WP_Error( 'no_test_response', 'Test did not configure _harvest_remote_get.' );
    }
    return $configured;
}

function wp_remote_retrieve_response_code( $response ): int {
    if ( is_wp_error( $response ) ) { return 0; }
    return (int) ( $response['response']['code'] ?? 0 );
}

if ( ! class_exists( 'WP_Error' ) ) {
    class WP_Error {
        private string $code;
        private string $message;
        public function __construct( string $code = '', string $message = '' ) {
            $this->code    = $code;
            $this->message = $message;
        }
        public function get_error_code(): string    { return $this->code; }
        public function get_error_message(): string { return $this->message; }
    }
}

// ---------------------------------------------------------------------------
// Autoloader and plugin class includes.
// ---------------------------------------------------------------------------

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

require_once dirname( __DIR__ ) . '/includes/class-harvest-settings.php';
require_once dirname( __DIR__ ) . '/includes/class-harvest-shortcode.php';
require_once dirname( __DIR__ ) . '/includes/class-harvest-assets.php';
require_once dirname( __DIR__ ) . '/includes/class-harvest-csp.php';
