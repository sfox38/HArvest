<?php
/**
 * SettingsTest.php - Tests for Harvest_Settings.
 */

use PHPUnit\Framework\TestCase;

class SettingsTest extends TestCase {

    protected function setUp(): void {
        parent::setUp();
        $GLOBALS['_harvest_options'] = [];
        $GLOBALS['_harvest_actions'] = [];
    }

    // -----------------------------------------------------------------------
    // sanitize_ha_url
    // -----------------------------------------------------------------------

    public function test_sanitize_ha_url_strips_trailing_slash(): void {
        $result = Harvest_Settings::sanitize_ha_url( 'https://ha.example.com/' );
        $this->assertSame( 'https://ha.example.com', $result );
    }

    public function test_sanitize_ha_url_strips_multiple_trailing_slashes(): void {
        $result = Harvest_Settings::sanitize_ha_url( 'https://ha.example.com///' );
        $this->assertSame( 'https://ha.example.com', $result );
    }

    public function test_sanitize_ha_url_trims_whitespace(): void {
        $result = Harvest_Settings::sanitize_ha_url( '  https://ha.example.com  ' );
        $this->assertSame( 'https://ha.example.com', $result );
    }

    public function test_sanitize_ha_url_passes_clean_url_unchanged(): void {
        $result = Harvest_Settings::sanitize_ha_url( 'https://ha.example.com' );
        $this->assertSame( 'https://ha.example.com', $result );
    }

    public function test_sanitize_ha_url_empty_returns_empty(): void {
        $result = Harvest_Settings::sanitize_ha_url( '' );
        $this->assertSame( '', $result );
    }

    public function test_sanitize_ha_url_preserves_port(): void {
        $result = Harvest_Settings::sanitize_ha_url( 'https://ha.example.com:8123/' );
        $this->assertSame( 'https://ha.example.com:8123', $result );
    }

    // -----------------------------------------------------------------------
    // sanitize_widget_source
    // -----------------------------------------------------------------------

    public function test_sanitize_widget_source_accepts_ha(): void {
        // SPEC.md Section 12: 'ha' (HA-served) is the recommended default.
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'ha' ) );
    }

    public function test_sanitize_widget_source_accepts_custom(): void {
        // 'custom' is only kept when the custom URL field is also set;
        // otherwise it falls back to 'ha'. Cover the happy path here and
        // the fallback paths in their own dedicated tests below.
        $_POST['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        $this->assertSame( 'custom', Harvest_Settings::sanitize_widget_source( 'custom' ) );
        unset( $_POST['harvest_widget_custom_url'] );
    }

    public function test_sanitize_widget_source_migrates_legacy_bundled(): void {
        // Pre-1.9.0 installs that stored 'bundled' are silently migrated to
        // 'ha' on next save. The plugin no longer ships
        // assets/harvest.min.js so honoring 'bundled' would 404 the widget.
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'bundled' ) );
    }

    public function test_sanitize_widget_source_rejects_invalid_returns_ha(): void {
        // Unknown values collapse to the recommended option.
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'remote' ) );
    }

    public function test_sanitize_widget_source_rejects_empty_returns_ha(): void {
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( '' ) );
    }

    public function test_sanitize_widget_source_rejects_cdn_returns_ha(): void {
        // 'cdn' was removed as a valid source option.
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'cdn' ) );
    }

    public function test_sanitize_widget_source_custom_with_blank_url_falls_back_to_ha(): void {
        // Selecting "Use custom URL" but leaving the URL field empty would
        // save a bogus combo (source=custom + custom_url=''). The runtime
        // enqueue silently falls back from this anyway, but persisting it
        // misleads the admin about what their site actually loads. The
        // sanitizer coerces source back to 'ha' so the saved state matches
        // what loads.
        $_POST['harvest_widget_custom_url'] = '';
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'custom' ) );
        unset( $_POST['harvest_widget_custom_url'] );
    }

    public function test_sanitize_widget_source_custom_with_whitespace_url_falls_back_to_ha(): void {
        // Whitespace-only URLs are equivalent to empty.
        $_POST['harvest_widget_custom_url'] = '   ';
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'custom' ) );
        unset( $_POST['harvest_widget_custom_url'] );
    }

    public function test_sanitize_widget_source_custom_with_real_url_stays_custom(): void {
        // Sanity check: a non-empty URL keeps the 'custom' selection.
        $_POST['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        $this->assertSame( 'custom', Harvest_Settings::sanitize_widget_source( 'custom' ) );
        unset( $_POST['harvest_widget_custom_url'] );
    }

    // -----------------------------------------------------------------------
    // sanitize_custom_url
    // -----------------------------------------------------------------------

    public function test_sanitize_custom_url_accepts_full_https_url(): void {
        $this->assertSame(
            'https://example.com/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( 'https://example.com/harvest.min.js' )
        );
    }

    public function test_sanitize_custom_url_accepts_full_http_url(): void {
        $this->assertSame(
            'http://localhost:8000/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( 'http://localhost:8000/harvest.min.js' )
        );
    }

    public function test_sanitize_custom_url_accepts_absolute_path(): void {
        // Loaded relative to the embed page's host.
        $this->assertSame(
            '/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( '/harvest.min.js' )
        );
        $this->assertSame(
            '/assets/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( '/assets/harvest.min.js' )
        );
    }

    public function test_sanitize_custom_url_accepts_bare_filename(): void {
        // For pages that ship harvest.min.js alongside the HTML file (e.g.
        // a static HTML on disk during local dev). The browser resolves
        // this against the page's own URL.
        $this->assertSame(
            'harvest.min.js',
            Harvest_Settings::sanitize_custom_url( 'harvest.min.js' )
        );
    }

    public function test_sanitize_custom_url_accepts_dot_relative_path(): void {
        $this->assertSame(
            './harvest.min.js',
            Harvest_Settings::sanitize_custom_url( './harvest.min.js' )
        );
        $this->assertSame(
            '../js/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( '../js/harvest.min.js' )
        );
    }

    public function test_sanitize_custom_url_trims_whitespace(): void {
        $this->assertSame(
            'https://example.com/harvest.min.js',
            Harvest_Settings::sanitize_custom_url( '  https://example.com/harvest.min.js  ' )
        );
    }

    public function test_sanitize_custom_url_empty_returns_empty(): void {
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( '' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( null ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( '   ' ) );
    }

    public function test_sanitize_custom_url_rejects_javascript_scheme(): void {
        // XSS vector - never allow.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'javascript:alert(1)' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'JAVASCRIPT:alert(1)' ) );
    }

    public function test_sanitize_custom_url_rejects_data_scheme(): void {
        // data:text/javascript,... would inline-execute attacker code.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'data:text/javascript,alert(1)' ) );
    }

    public function test_sanitize_custom_url_rejects_vbscript_scheme(): void {
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'vbscript:msgbox' ) );
    }

    public function test_sanitize_custom_url_rejects_other_url_schemes(): void {
        // file:, ftp:, gopher: etc. - not useful as <script src>, reject.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'file:///etc/passwd' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'ftp://example.com/harvest.min.js' ) );
    }

    public function test_sanitize_custom_url_rejects_quotes_and_brackets(): void {
        // Anything that could break out of the src="" attribute or open a
        // new attribute is unsafe.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'harvest.min.js" onerror="alert(1)' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( "harvest.min.js' onerror='alert(1)" ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'harvest.min.js><script>alert(1)' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'harvest.min.js`oops`' ) );
    }

    public function test_sanitize_custom_url_strips_leading_trailing_whitespace_including_newlines(): void {
        // Trim catches the easy case of paste-with-trailing-newline.
        $this->assertSame( 'harvest.min.js', Harvest_Settings::sanitize_custom_url( "harvest.min.js\n" ) );
        $this->assertSame( 'harvest.min.js', Harvest_Settings::sanitize_custom_url( "\tharvest.min.js" ) );
    }

    public function test_sanitize_custom_url_rejects_internal_control_characters(): void {
        // Control characters embedded INSIDE the URL (not just leading or
        // trailing) are malicious or broken, never legitimate.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( "harv\nest.min.js" ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( "harv\x00est.min.js" ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( "harv\x07est.min.js" ) );
    }

    public function test_sanitize_custom_url_rejects_internal_whitespace(): void {
        // Spaces in URLs to .js files are vanishingly rare and easier to
        // reject than to support correctly. Anyone who needs a URL with a
        // space can URL-encode it.
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'harvest min.js' ) );
        $this->assertSame( '', Harvest_Settings::sanitize_custom_url( 'https://example.com/my dir/harvest.min.js' ) );
    }

    // -----------------------------------------------------------------------
    // sanitize_widget_source - additional fallback tests
    // -----------------------------------------------------------------------

    public function test_sanitize_widget_source_custom_falls_back_to_stored_url_when_post_missing(): void {
        // PATCH of source alone (no $_POST custom_url field): the stored
        // option should be checked instead. If the stored URL is also
        // empty, fall back to 'ha'.
        unset( $_POST['harvest_widget_custom_url'] );
        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = '';
        $this->assertSame( 'ha', Harvest_Settings::sanitize_widget_source( 'custom' ) );

        $GLOBALS['_harvest_options']['harvest_widget_custom_url'] = 'https://example.com/harvest.min.js';
        $this->assertSame( 'custom', Harvest_Settings::sanitize_widget_source( 'custom' ) );
        unset( $GLOBALS['_harvest_options']['harvest_widget_custom_url'] );
    }

    // -----------------------------------------------------------------------
    // get_ha_url
    // -----------------------------------------------------------------------

    public function test_get_ha_url_returns_stored_option(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://myhome.duckdns.org';
        $this->assertSame( 'https://myhome.duckdns.org', Harvest_Settings::get_ha_url() );
    }

    public function test_get_ha_url_returns_empty_string_when_not_set(): void {
        $this->assertSame( '', Harvest_Settings::get_ha_url() );
    }

    // -----------------------------------------------------------------------
    // get_widget_source
    // -----------------------------------------------------------------------

    public function test_get_widget_source_returns_stored_option(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source'] = 'custom';
        $this->assertSame( 'custom', Harvest_Settings::get_widget_source() );
    }

    public function test_get_widget_source_returns_ha_as_default(): void {
        // SPEC.md Section 12: 'ha' is the recommended default for new
        // installs. When no option row exists, get_option's default
        // kicks in.
        $result = Harvest_Settings::get_widget_source();
        $this->assertSame( 'ha', $result );
    }

    public function test_get_widget_source_migrates_stored_bundled_to_ha(): void {
        // Defensive read-time migration. Even if a pre-1.9.0 'bundled'
        // value somehow survived in the DB without going through the
        // sanitizer, the plugin now treats it as 'ha' so the widget URL
        // always works (the bundled file is no longer shipped).
        $GLOBALS['_harvest_options']['harvest_widget_source'] = 'bundled';
        $this->assertSame( 'ha', Harvest_Settings::get_widget_source() );
    }

    // -----------------------------------------------------------------------
    // init registers expected hooks
    // -----------------------------------------------------------------------

    public function test_init_registers_admin_menu_action(): void {
        $GLOBALS['_harvest_actions'] = [];
        Harvest_Settings::init();
        $hooks = array_column( $GLOBALS['_harvest_actions'], 'hook' );
        $this->assertContains( 'admin_menu', $hooks );
    }

    public function test_init_registers_admin_init_action(): void {
        $GLOBALS['_harvest_actions'] = [];
        Harvest_Settings::init();
        $hooks = array_column( $GLOBALS['_harvest_actions'], 'hook' );
        $this->assertContains( 'admin_init', $hooks );
    }
}
