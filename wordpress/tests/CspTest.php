<?php
/**
 * CspTest.php - Tests for Harvest_Csp.
 */

use PHPUnit\Framework\TestCase;

class CspTest extends TestCase {

    protected function setUp(): void {
        parent::setUp();
        $GLOBALS['_harvest_options'] = [
            'harvest_ha_url' => 'https://ha.example.com',
        ];
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - empty HA URL
    // -----------------------------------------------------------------------

    public function test_empty_ha_url_returns_headers_unchanged(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = '';
        $headers = [ 'X-Frame-Options' => 'SAMEORIGIN' ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertSame( $headers, $result );
    }

    public function test_empty_ha_url_does_not_add_csp_header(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = '';
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertArrayNotHasKey( 'Content-Security-Policy', $result );
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - https to wss conversion
    // -----------------------------------------------------------------------

    public function test_https_url_is_converted_to_wss_in_csp(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com';
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringContainsString( 'wss://ha.example.com', $result['Content-Security-Policy'] );
    }

    public function test_alternate_transport_port_is_preserved_in_csp(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com:9050';
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringContainsString(
            'wss://ha.example.com:9050',
            $result['Content-Security-Policy']
        );
        $this->assertStringContainsString(
            'https://ha.example.com:9050',
            $result['Content-Security-Policy']
        );
    }

    public function test_http_url_is_converted_to_ws_in_csp(): void {
        // http:// HA installs (e.g. local LAN) must produce ws://, not wss://,
        // because the widget itself dials ws:// for http origins. CSP that
        // only allowed wss:// would block the legitimate handshake.
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'http://ha.local';
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringContainsString( 'ws://ha.local', $result['Content-Security-Policy'] );
        $this->assertStringNotContainsString( 'wss://ha.local', $result['Content-Security-Policy'] );
    }

    public function test_connect_src_uses_wss_not_https(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com';
        $result = Harvest_Csp::modify_csp_headers( [] );
        $csp = $result['Content-Security-Policy'];
        // connect-src should contain the wss URL, not the https URL.
        preg_match( '/connect-src\s+([^;]+)/', $csp, $m );
        $connect_src = $m[1] ?? '';
        $this->assertStringContainsString( 'wss://ha.example.com', $connect_src );
        $this->assertStringNotContainsString( 'https://ha.example.com', $connect_src );
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - no existing CSP header
    // -----------------------------------------------------------------------

    public function test_no_existing_csp_creates_connect_src_header(): void {
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertArrayHasKey( 'Content-Security-Policy', $result );
    }

    public function test_no_existing_csp_new_header_contains_connect_src(): void {
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringContainsString( 'connect-src', $result['Content-Security-Policy'] );
    }

    public function test_no_existing_csp_new_header_includes_self(): void {
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringContainsString( "'self'", $result['Content-Security-Policy'] );
    }

    public function test_no_existing_csp_existing_headers_are_preserved(): void {
        $headers = [ 'X-Frame-Options' => 'SAMEORIGIN' ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertArrayHasKey( 'X-Frame-Options', $result );
        $this->assertSame( 'SAMEORIGIN', $result['X-Frame-Options'] );
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - existing CSP without connect-src
    // -----------------------------------------------------------------------

    public function test_existing_csp_without_connect_src_appends_directive(): void {
        $headers = [ 'Content-Security-Policy' => "default-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( 'connect-src', $result['Content-Security-Policy'] );
    }

    public function test_existing_csp_without_connect_src_preserves_existing_directives(): void {
        $headers = [ 'Content-Security-Policy' => "default-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( "default-src 'self'", $result['Content-Security-Policy'] );
    }

    public function test_existing_csp_without_connect_src_adds_wss_url(): void {
        $headers = [ 'Content-Security-Policy' => "default-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( 'wss://ha.example.com', $result['Content-Security-Policy'] );
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - existing CSP with connect-src
    // -----------------------------------------------------------------------

    public function test_existing_connect_src_gets_wss_url_appended(): void {
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; connect-src 'self' https://api.example.com" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( 'wss://ha.example.com', $result['Content-Security-Policy'] );
    }

    public function test_existing_connect_src_keeps_original_values(): void {
        $headers = [ 'Content-Security-Policy' => "connect-src 'self' https://api.example.com" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( 'https://api.example.com', $result['Content-Security-Policy'] );
    }

    // -----------------------------------------------------------------------
    // modify_csp_headers - URL already present (idempotency)
    // -----------------------------------------------------------------------

    public function test_url_already_in_csp_does_not_duplicate_wss(): void {
        $policy  = "connect-src 'self' wss://ha.example.com; script-src 'self' https://ha.example.com";
        $headers = [ 'Content-Security-Policy' => $policy ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $count   = substr_count( $result['Content-Security-Policy'], 'wss://ha.example.com' );
        $this->assertSame( 1, $count );
    }

    public function test_calling_modify_twice_does_not_duplicate_url(): void {
        $headers = [];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $result2 = Harvest_Csp::modify_csp_headers( $result );
        $count1  = substr_count( $result['Content-Security-Policy'], 'wss://ha.example.com' );
        $count2  = substr_count( $result2['Content-Security-Policy'], 'wss://ha.example.com' );
        $this->assertSame( $count1, $count2 );
    }

    // -----------------------------------------------------------------------
    // Directive-name boundary anchoring
    //
    // "script-src" must never match inside "script-src-elem" / "script-src-attr"
    // and similar lookalikes. These tests cover the substring-collision bug
    // where strpos() and unanchored regex would corrupt unrelated directives.
    // -----------------------------------------------------------------------

    public function test_script_src_elem_does_not_satisfy_script_src_check(): void {
        // Site has script-src-elem only, no script-src. HArvest should add a
        // real script-src directive rather than thinking script-src is present.
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; script-src-elem 'self' https://example.com" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        // The policy must now contain a real script-src directive at a boundary.
        $this->assertMatchesRegularExpression(
            '/(^|;\s*)script-src(?![a-zA-Z0-9-])/',
            $result['Content-Security-Policy']
        );
    }

    public function test_script_src_elem_is_not_corrupted_when_adding_script_src(): void {
        // The pre-existing script-src-elem directive must be left intact.
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; script-src-elem 'self' https://example.com" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $csp     = $result['Content-Security-Policy'];
        $this->assertStringContainsString( "script-src-elem 'self' https://example.com", $csp );
    }

    public function test_url_already_in_script_src_elem_does_not_short_circuit_script_src(): void {
        // The HA script origin sitting inside script-src-elem must not fool the
        // already-present check into skipping the script-src addition.
        $policy  = "default-src 'self'; script-src-elem 'self' https://ha.example.com";
        $headers = [ 'Content-Security-Policy' => $policy ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $csp     = $result['Content-Security-Policy'];
        // A real script-src directive must now exist with the HA origin.
        $this->assertMatchesRegularExpression(
            '/(^|;\s*)script-src(?![a-zA-Z0-9-])[^;]*https:\/\/ha\.example\.com/',
            $csp
        );
    }

    public function test_existing_script_src_with_real_directive_gets_url_appended(): void {
        // Sanity: when both script-src and script-src-elem coexist, only the
        // real script-src receives the HA origin.
        $headers = [ 'Content-Security-Policy' => "script-src 'self'; script-src-elem 'self' https://example.com" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $csp     = $result['Content-Security-Policy'];
        // script-src now includes HA origin.
        $this->assertMatchesRegularExpression(
            '/(^|;\s*)script-src(?![a-zA-Z0-9-])[^;]*https:\/\/ha\.example\.com/',
            $csp
        );
        // script-src-elem unchanged: 'self' and example.com only, no ha.example.com.
        preg_match( '/(^|;\s*)script-src-elem\b([^;]*)/', $csp, $m );
        $elem_value = $m[2] ?? '';
        $this->assertStringNotContainsString( 'https://ha.example.com', $elem_value );
    }

    public function test_directive_at_start_of_policy_is_anchored(): void {
        // Without leading `;`, the boundary `(^|;\s*)` must still match.
        $headers = [ 'Content-Security-Policy' => "script-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringContainsString( 'https://ha.example.com', $result['Content-Security-Policy'] );
    }

    public function test_empty_value_directive_receives_url(): void {
        // Pathological but legal: a directive with no value (just `script-src;`).
        // The boundary check must still recognise it and append the URL.
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; script-src; img-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertMatchesRegularExpression(
            '/(^|;\s*)script-src(?![a-zA-Z0-9-])[^;]*https:\/\/ha\.example\.com/',
            $result['Content-Security-Policy']
        );
    }

    public function test_fallback_csp_does_not_emit_unsafe_inline(): void {
        // Earlier revisions emitted 'unsafe-inline' in the no-existing-CSP path
        // under the mistaken belief that renderer packs needed it. They don't:
        // packs load via external <script src="..."> tags, which only need the
        // origin in script-src. Tightening this closes a needless permissive
        // hole on installs that had no prior CSP.
        $result = Harvest_Csp::modify_csp_headers( [] );
        $this->assertStringNotContainsString( "'unsafe-inline'", $result['Content-Security-Policy'] );
    }

    public function test_existing_csp_path_does_not_inject_unsafe_inline(): void {
        // Append-to-existing-policy path must also not introduce 'unsafe-inline'
        // when the site's existing policy didn't already contain it.
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; script-src 'self'" ];
        $result  = Harvest_Csp::modify_csp_headers( $headers );
        $this->assertStringNotContainsString( "'unsafe-inline'", $result['Content-Security-Policy'] );
    }

    public function test_calling_modify_twice_with_script_src_elem_does_not_duplicate(): void {
        // Idempotency under collision conditions: a second pass must be a no-op.
        $headers = [ 'Content-Security-Policy' => "default-src 'self'; script-src-elem 'self' https://other.com" ];
        $result1 = Harvest_Csp::modify_csp_headers( $headers );
        $result2 = Harvest_Csp::modify_csp_headers( $result1 );
        $this->assertSame(
            $result1['Content-Security-Policy'],
            $result2['Content-Security-Policy']
        );
    }

    // -----------------------------------------------------------------------
    // init registers the wp_headers filter
    // -----------------------------------------------------------------------

    public function test_init_registers_wp_headers_filter(): void {
        $GLOBALS['_harvest_filters'] = [];
        Harvest_Csp::init();
        $hooks = array_column( $GLOBALS['_harvest_filters'], 'hook' );
        $this->assertContains( 'wp_headers', $hooks );
    }
}
