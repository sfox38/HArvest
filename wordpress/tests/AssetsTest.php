<?php
/**
 * AssetsTest.php - Tests for Harvest_Assets.
 *
 * The plugin's only widget script source modes are 'ha' (HA-served, default)
 * and 'custom'. The pre-1.9.0 'bundled' mode was removed when the plugin zip
 * stopped shipping assets/harvest.min.js (SPEC.md Section 12). Stored
 * 'bundled' values are migrated to 'ha' transparently in
 * Harvest_Settings::get_widget_source(); see SettingsTest for that coverage.
 */

use PHPUnit\Framework\TestCase;

class AssetsTest extends TestCase {

    private const HA_URL = 'https://ha.example.com';

    protected function setUp(): void {
        parent::setUp();
        // Default test setup: HA-served mode with a valid HA URL. Any test
        // that needs a different state overrides it explicitly.
        $GLOBALS['_harvest_options'] = [
            'harvest_widget_source' => 'ha',
            'harvest_ha_url'        => self::HA_URL,
        ];
        $GLOBALS['_harvest_scripts'] = [];
        $this->resetEnqueuedFlag();
    }

    private function resetEnqueuedFlag(): void {
        $ref = new ReflectionProperty( Harvest_Assets::class, 'enqueued' );
        $ref->setValue( null, false );
    }

    // -----------------------------------------------------------------------
    // enqueue - HA-served mode (default)
    // -----------------------------------------------------------------------

    public function test_enqueue_ha_calls_wp_enqueue_script(): void {
        Harvest_Assets::enqueue();
        $this->assertCount( 1, $GLOBALS['_harvest_scripts'] );
    }

    public function test_enqueue_ha_uses_harvest_widget_handle(): void {
        Harvest_Assets::enqueue();
        $this->assertSame( 'harvest-widget', $GLOBALS['_harvest_scripts'][0]['handle'] );
    }

    public function test_enqueue_ha_uses_ha_url_static_path(): void {
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringStartsWith( self::HA_URL . '/harvest_assets/harvest.min.js', $src );
    }

    public function test_enqueue_ha_preserves_alternate_transport_port(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com:9050';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringStartsWith(
            'https://ha.example.com:9050/harvest_assets/harvest.min.js',
            $src
        );
    }

    public function test_enqueue_ha_appends_wp_marker(): void {
        // The widget reads document.currentScript.src and parses ?wp= so
        // the integration knows the script was loaded by the WP plugin
        // (vs. a raw HTML embed). Without this marker, drift detection
        // can't distinguish WP installs.
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringContainsString( 'wp=' . HARVEST_VERSION, $src );
    }

    public function test_enqueue_ha_strips_trailing_slash_from_ha_url(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = self::HA_URL . '/';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        // Must not produce //harvest_assets - that would 404 on most setups.
        $this->assertStringStartsWith( self::HA_URL . '/harvest_assets/harvest.min.js', $src );
        $this->assertStringNotContainsString( 'com//harvest_assets', $src );
    }

    public function test_enqueue_ha_version_is_null(): void {
        // The HA static path serves with cache_headers=False, so WordPress's
        // own ?ver= query string is unnecessary noise. We pass null.
        Harvest_Assets::enqueue();
        $this->assertNull( $GLOBALS['_harvest_scripts'][0]['ver'] );
    }

    public function test_enqueue_ha_loads_in_footer(): void {
        Harvest_Assets::enqueue();
        $this->assertTrue( $GLOBALS['_harvest_scripts'][0]['in_footer'] );
    }

    public function test_enqueue_ha_without_ha_url_skips_enqueue(): void {
        // The Settings UI disables the HA-served radio when harvest_ha_url
        // is unset, but defend the runtime against direct DB edits or
        // first-install state. Skipping is correct: any other behaviour
        // would emit a broken empty-host URL into the page.
        $GLOBALS['_harvest_options']['harvest_ha_url'] = '';
        Harvest_Assets::enqueue();
        $this->assertCount( 0, $GLOBALS['_harvest_scripts'] );
    }

    // -----------------------------------------------------------------------
    // enqueue - custom URL mode
    // -----------------------------------------------------------------------

    public function test_enqueue_custom_uses_provided_src(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        // The base URL is preserved; ?wp= is appended for the compatibility
        // handshake (SPEC.md Section 12).
        $this->assertStringStartsWith( 'https://example.com/harvest.min.js', $src );
        $this->assertStringContainsString( 'wp=' . HARVEST_VERSION, $src );
    }

    public function test_enqueue_custom_version_is_null(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        Harvest_Assets::enqueue();
        $this->assertNull( $GLOBALS['_harvest_scripts'][0]['ver'] );
    }

    public function test_enqueue_custom_loads_in_footer(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        Harvest_Assets::enqueue();
        $this->assertTrue( $GLOBALS['_harvest_scripts'][0]['in_footer'] );
    }

    public function test_enqueue_custom_without_url_falls_back_to_ha_served(): void {
        // 'custom' selected but no URL saved - degrade to the HA-served
        // default rather than emit nothing.
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = '';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringStartsWith( self::HA_URL . '/harvest_assets/harvest.min.js', $src );
    }

    public function test_enqueue_custom_url_with_existing_query_uses_ampersand(): void {
        // Custom URLs that already have ?foo=bar should get &wp=<ver>
        // not ?wp=<ver> (which would corrupt the URL).
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js?cache=123';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringContainsString( 'cache=123', $src );
        $this->assertStringContainsString( '&wp=' . HARVEST_VERSION, $src );
    }

    public function test_enqueue_preserves_other_query_params(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source']     = 'custom';
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://cdn.example.com/path?a=1&b=2';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringContainsString( 'a=1', $src );
        $this->assertStringContainsString( 'b=2', $src );
        $this->assertStringContainsString( 'wp=' . HARVEST_VERSION, $src );
    }

    // -----------------------------------------------------------------------
    // Legacy 'bundled' value migration (SPEC.md Section 12)
    // -----------------------------------------------------------------------

    public function test_enqueue_with_legacy_bundled_value_uses_ha_served(): void {
        // A pre-1.9.0 install that stored 'bundled' must now load the
        // widget from the HA host instead of the missing plugin zip file.
        // Migration happens in get_widget_source().
        $GLOBALS['_harvest_options']['harvest_widget_source'] = 'bundled';
        Harvest_Assets::enqueue();
        $src = $GLOBALS['_harvest_scripts'][0]['src'];
        $this->assertStringStartsWith( self::HA_URL . '/harvest_assets/harvest.min.js', $src );
    }

    // -----------------------------------------------------------------------
    // enqueue - idempotency
    // -----------------------------------------------------------------------

    public function test_enqueue_called_twice_only_enqueues_once(): void {
        Harvest_Assets::enqueue();
        Harvest_Assets::enqueue();
        $this->assertCount( 1, $GLOBALS['_harvest_scripts'] );
    }

    public function test_enqueue_called_three_times_only_enqueues_once(): void {
        Harvest_Assets::enqueue();
        Harvest_Assets::enqueue();
        Harvest_Assets::enqueue();
        $this->assertCount( 1, $GLOBALS['_harvest_scripts'] );
    }

    // -----------------------------------------------------------------------
    // maybe_inject_preconnect - <link rel="preconnect"> for the HA origin.
    // The browser uses this to start TCP+TLS to HA in parallel with parsing
    // the rest of the page, shaving ~100-300ms off WS open latency.
    // -----------------------------------------------------------------------

    private function setUpSingularPostWithShortcode( string $content ): void {
        $GLOBALS['_harvest_is_singular'] = true;
        $GLOBALS['_harvest_current_post'] = (object) [ 'post_content' => $content ];
    }

    public function test_preconnect_emitted_when_post_contains_harvest_shortcode(): void {
        $this->setUpSingularPostWithShortcode( 'Hello [harvest token="hwt_x" entity="light.a"]' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertStringContainsString( '<link rel="preconnect"', $out );
        $this->assertStringContainsString( 'href="' . self::HA_URL . '"', $out );
        $this->assertStringContainsString( 'crossorigin', $out );
    }

    public function test_preconnect_emitted_for_harvest_group_shortcode(): void {
        $this->setUpSingularPostWithShortcode( '[harvest_group token="hwt_x"][/harvest_group]' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertStringContainsString( '<link rel="preconnect"', $out );
    }

    public function test_preconnect_skipped_when_post_has_no_shortcode(): void {
        $this->setUpSingularPostWithShortcode( 'Plain content with no widgets here.' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertSame( '', $out );
    }

    public function test_preconnect_skipped_on_non_singular_pages(): void {
        // Archive/home pages: don't preconnect even if get_post() returns
        // something with shortcode-like content.
        $GLOBALS['_harvest_is_singular'] = false;
        $GLOBALS['_harvest_current_post'] = (object) [ 'post_content' => '[harvest token="hwt_x" entity="light.a"]' ];
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertSame( '', $out );
    }

    public function test_preconnect_skipped_when_ha_url_unset(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = '';
        $this->setUpSingularPostWithShortcode( '[harvest token="hwt_x" entity="light.a"]' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertSame( '', $out );
    }

    public function test_preconnect_strips_path_to_origin_only(): void {
        // The href on a preconnect must be the origin (scheme://host[:port]).
        // Trailing paths or queries defeat reuse on some browsers.
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com/some/path?q=1';
        $this->setUpSingularPostWithShortcode( '[harvest token="hwt_x" entity="light.a"]' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertStringContainsString( 'href="https://ha.example.com"', $out );
        $this->assertStringNotContainsString( '/some/path', $out );
        $this->assertStringNotContainsString( 'q=1', $out );
    }

    public function test_preconnect_preserves_non_default_port(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com:8123';
        $this->setUpSingularPostWithShortcode( '[harvest token="hwt_x" entity="light.a"]' );
        ob_start();
        Harvest_Assets::maybe_inject_preconnect();
        $out = ob_get_clean();
        $this->assertStringContainsString( 'href="https://ha.example.com:8123"', $out );
    }
}
