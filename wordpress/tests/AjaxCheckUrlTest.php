<?php
/**
 * AjaxCheckUrlTest.php - Tests for Harvest_Settings::ajax_check_url().
 *
 * The handler proxies a HEAD request from the WP server to a
 * caller-supplied URL and reports reachability. Used by the settings
 * page's live indicators (HA URL + custom widget URL fields).
 */

use PHPUnit\Framework\TestCase;

class AjaxCheckUrlTest extends TestCase {

    protected function setUp(): void {
        parent::setUp();
        $_POST                             = [];
        $GLOBALS['_harvest_user_can']      = true;   // admin by default
        $GLOBALS['_harvest_nonce_valid']   = true;   // nonce ok by default
        $GLOBALS['_harvest_remote_head']   = null;   // tests configure
        $GLOBALS['_harvest_remote_get']    = null;   // HEAD-fallback also configurable
        $GLOBALS['_harvest_ajax_response'] = null;   // captured response
        $GLOBALS['_harvest_safe_remote_head_calls'] = 0;
        $GLOBALS['_harvest_safe_remote_get_calls'] = 0;
        $GLOBALS['_harvest_unsafe_remote_head_calls'] = 0;
        $GLOBALS['_harvest_unsafe_remote_get_calls'] = 0;
    }

    /**
     * The handler signals completion by throwing JsonResponseException
     * (mirrors WordPress's wp_die-after-send behaviour). Wrap the call
     * so each test can read the resulting JSON via $GLOBALS without
     * caring about the throw.
     */
    private function callHandler(): array {
        try {
            Harvest_Settings::ajax_check_url();
        } catch ( JsonResponseException $e ) {
            // expected
        }
        return $GLOBALS['_harvest_ajax_response'];
    }

    // -----------------------------------------------------------------------
    // Auth gates
    // -----------------------------------------------------------------------

    public function test_rejects_invalid_nonce(): void {
        $GLOBALS['_harvest_nonce_valid'] = false;
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $r = $this->callHandler();
        $this->assertFalse( $r['success'] );
        $this->assertSame( 403, $r['status'] );
    }

    public function test_rejects_non_admin(): void {
        $GLOBALS['_harvest_user_can'] = false;
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $r = $this->callHandler();
        $this->assertFalse( $r['success'] );
        $this->assertSame( 403, $r['status'] );
    }

    public function test_nonce_check_runs_before_capability_check(): void {
        // If both fail, nonce error should win - we never confirm/deny
        // the existence of admin capability for unauthenticated callers.
        $GLOBALS['_harvest_nonce_valid'] = false;
        $GLOBALS['_harvest_user_can']    = false;
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $r = $this->callHandler();
        $this->assertFalse( $r['success'] );
        $this->assertStringContainsString( 'security token', $r['data']['message'] );
    }

    // -----------------------------------------------------------------------
    // Input validation - never makes outbound requests for bad input
    // -----------------------------------------------------------------------

    public function test_empty_url_returns_invalid(): void {
        $_POST['url'] = '';
        $r = $this->callHandler();
        $this->assertTrue( $r['success'] );
        $this->assertSame( 'invalid', $r['data']['reason'] );
        // Defensive: must NOT have hit wp_safe_remote_head.
        $this->assertNull( $GLOBALS['_harvest_remote_head'] );
    }

    public function test_javascript_scheme_returns_invalid(): void {
        $_POST['url'] = 'javascript:alert(1)';
        $r = $this->callHandler();
        $this->assertSame( 'invalid', $r['data']['reason'] );
        $this->assertFalse( $r['data']['ok'] );
    }

    public function test_data_scheme_returns_invalid(): void {
        $_POST['url'] = 'data:text/javascript,alert(1)';
        $r = $this->callHandler();
        $this->assertSame( 'invalid', $r['data']['reason'] );
    }

    public function test_vbscript_scheme_returns_invalid(): void {
        $_POST['url'] = 'vbscript:msgbox';
        $r = $this->callHandler();
        $this->assertSame( 'invalid', $r['data']['reason'] );
    }

    public function test_control_chars_return_invalid(): void {
        $_POST['url'] = "https://example.com/\x00bad.js";
        $r = $this->callHandler();
        $this->assertSame( 'invalid', $r['data']['reason'] );
    }

    public function test_attribute_breaker_chars_return_invalid(): void {
        $_POST['url'] = 'https://example.com/x.js" onerror="alert(1)';
        $r = $this->callHandler();
        $this->assertSame( 'invalid', $r['data']['reason'] );
    }

    // -----------------------------------------------------------------------
    // Relative paths - cannot be probed; reported as such
    // -----------------------------------------------------------------------

    public function test_bare_filename_returns_relative(): void {
        $_POST['url'] = 'harvest.min.js';
        $r = $this->callHandler();
        $this->assertTrue( $r['success'] );
        $this->assertFalse( $r['data']['ok'] );
        $this->assertSame( 'relative', $r['data']['reason'] );
        $this->assertStringContainsString( 'Relative path', $r['data']['message'] );
    }

    public function test_absolute_path_returns_relative(): void {
        // /harvest.min.js is "absolute path" but still resolved relative to
        // the visitor's host - we can't probe it from the WP server side.
        $_POST['url'] = '/harvest.min.js';
        $r = $this->callHandler();
        $this->assertSame( 'relative', $r['data']['reason'] );
    }

    public function test_dot_relative_path_returns_relative(): void {
        $_POST['url'] = './harvest.min.js';
        $r = $this->callHandler();
        $this->assertSame( 'relative', $r['data']['reason'] );
    }

    // -----------------------------------------------------------------------
    // Outbound HEAD - happy and unhappy paths
    // -----------------------------------------------------------------------

    public function test_200_response_returns_reachable_ok_true(): void {
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = [ 'response' => [ 'code' => 200 ] ];
        $r = $this->callHandler();
        $this->assertTrue( $r['data']['ok'] );
        $this->assertSame( 'reachable', $r['data']['reason'] );
        $this->assertSame( 200, $r['data']['status'] );
    }

    public function test_204_response_is_also_reachable(): void {
        // Any 2xx counts. Some CDNs return 204 No Content for HEAD.
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = [ 'response' => [ 'code' => 204 ] ];
        $r = $this->callHandler();
        $this->assertTrue( $r['data']['ok'] );
        $this->assertSame( 'reachable', $r['data']['reason'] );
    }

    public function test_probe_uses_only_ssrf_protected_http_apis(): void {
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = [ 'response' => [ 'code' => 500 ] ];
        $GLOBALS['_harvest_remote_get'] = [ 'response' => [ 'code' => 200 ] ];
        $this->callHandler();

        $this->assertSame( 1, $GLOBALS['_harvest_safe_remote_head_calls'] );
        $this->assertSame( 1, $GLOBALS['_harvest_safe_remote_get_calls'] );
        $this->assertSame( 0, $GLOBALS['_harvest_unsafe_remote_head_calls'] );
        $this->assertSame( 0, $GLOBALS['_harvest_unsafe_remote_get_calls'] );
    }

    public function test_404_response_returns_unreachable(): void {
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = [ 'response' => [ 'code' => 404 ] ];
        $r = $this->callHandler();
        $this->assertFalse( $r['data']['ok'] );
        $this->assertSame( 'unreachable', $r['data']['reason'] );
        $this->assertSame( 404, $r['data']['status'] );
        $this->assertStringContainsString( '404', $r['data']['message'] );
    }

    public function test_500_response_returns_unreachable(): void {
        $_POST['url'] = 'https://example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = [ 'response' => [ 'code' => 500 ] ];
        $r = $this->callHandler();
        $this->assertSame( 'unreachable', $r['data']['reason'] );
    }

    public function test_wp_error_returns_unreachable_with_error_in_message(): void {
        // Mirrors a connection-refused / DNS-fail / timeout scenario.
        $_POST['url'] = 'https://invalid.example.com/harvest.min.js';
        $GLOBALS['_harvest_remote_head'] = new \WP_Error( 'http_request_failed', 'cURL error 6: Could not resolve host' );
        $r = $this->callHandler();
        $this->assertFalse( $r['data']['ok'] );
        $this->assertSame( 'unreachable', $r['data']['reason'] );
        $this->assertSame( 0, $r['data']['status'] );
        $this->assertStringContainsString( 'cURL error 6', $r['data']['message'] );
        // Always advisory - tell the admin visitors might still be ok.
        $this->assertStringContainsString( 'Visitors may still', $r['data']['message'] );
    }

    // -----------------------------------------------------------------------
    // Response shape (every field always present)
    // -----------------------------------------------------------------------

    public function test_response_always_has_all_keys(): void {
        $cases = [
            [ 'url' => '',                                   'remote' => null,                                       ],
            [ 'url' => 'javascript:alert(1)',                'remote' => null,                                       ],
            [ 'url' => 'harvest.min.js',                     'remote' => null,                                       ],
            [ 'url' => 'https://example.com/x.js',           'remote' => [ 'response' => [ 'code' => 200 ] ],        ],
            [ 'url' => 'https://example.com/x.js',           'remote' => [ 'response' => [ 'code' => 404 ] ],        ],
            [ 'url' => 'https://invalid.example.com/x.js',   'remote' => new \WP_Error( 'x', 'fail' ),               ],
        ];
        foreach ( $cases as $c ) {
            $_POST['url'] = $c['url'];
            $GLOBALS['_harvest_remote_head'] = $c['remote'];
            $r = $this->callHandler();
            $this->assertArrayHasKey( 'ok',      $r['data'], 'ok key missing for ' . $c['url'] );
            $this->assertArrayHasKey( 'status',  $r['data'], 'status key missing for ' . $c['url'] );
            $this->assertArrayHasKey( 'reason',  $r['data'], 'reason key missing for ' . $c['url'] );
            $this->assertArrayHasKey( 'message', $r['data'], 'message key missing for ' . $c['url'] );
        }
    }
}
