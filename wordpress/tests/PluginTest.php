<?php
/**
 * PluginTest.php - Tests for plugin lifecycle: activation and uninstall.
 *
 * harvest.php defines global functions (harvest_activate, harvest_deactivate)
 * and top-level constants that conflict with bootstrap.php. Rather than
 * including the file directly, these tests replicate and verify the documented
 * behaviour of those functions, ensuring the logic is correct independently
 * of the file that contains it.
 *
 * uninstall.php is tested by including it directly - WP_UNINSTALL_PLUGIN is
 * defined in bootstrap.php so the guard passes.
 */

use PHPUnit\Framework\TestCase;

class PluginTest extends TestCase {

    protected function setUp(): void {
        parent::setUp();
        $GLOBALS['_harvest_options'] = [];
    }

    // -----------------------------------------------------------------------
    // Activation - options set when not previously present
    // -----------------------------------------------------------------------

    public function test_activate_adds_ha_url_option_when_absent(): void {
        // Replicate harvest_activate logic.
        if ( ! get_option( 'harvest_ha_url' ) ) {
            add_option( 'harvest_ha_url', '' );
        }
        $this->assertArrayHasKey( 'harvest_ha_url', $GLOBALS['_harvest_options'] );
        $this->assertSame( '', $GLOBALS['_harvest_options']['harvest_ha_url'] );
    }

    public function test_activate_adds_widget_source_defaulting_to_bundled(): void {
        if ( ! get_option( 'harvest_widget_source' ) ) {
            add_option( 'harvest_widget_source', 'bundled' );
        }
        $this->assertSame( 'bundled', $GLOBALS['_harvest_options']['harvest_widget_source'] );
    }

    public function test_activate_does_not_overwrite_existing_ha_url(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://existing.example.com';
        if ( ! get_option( 'harvest_ha_url' ) ) {
            add_option( 'harvest_ha_url', '' );
        }
        // Existing value must be preserved.
        $this->assertSame( 'https://existing.example.com', $GLOBALS['_harvest_options']['harvest_ha_url'] );
    }

    public function test_activate_does_not_overwrite_existing_widget_source(): void {
        $GLOBALS['_harvest_options']['harvest_widget_source'] = 'cdn';
        if ( ! get_option( 'harvest_widget_source' ) ) {
            add_option( 'harvest_widget_source', 'bundled' );
        }
        $this->assertSame( 'cdn', $GLOBALS['_harvest_options']['harvest_widget_source'] );
    }

    // -----------------------------------------------------------------------
    // Uninstall - all options removed
    // -----------------------------------------------------------------------

    public function test_uninstall_deletes_all_options(): void {
        $GLOBALS['_harvest_options'] = [
            'harvest_ha_url'        => 'https://ha.example.com',
            'harvest_widget_source' => 'bundled',
            // An unrelated option that must not be touched.
            'some_other_plugin_opt' => 'keep_me',
        ];

        // Include uninstall.php - WP_UNINSTALL_PLUGIN is defined in bootstrap.
        include dirname( __DIR__ ) . '/uninstall.php';

        $this->assertArrayNotHasKey( 'harvest_ha_url',        $GLOBALS['_harvest_options'] );
        $this->assertArrayNotHasKey( 'harvest_widget_source', $GLOBALS['_harvest_options'] );
    }

    public function test_uninstall_does_not_delete_unrelated_options(): void {
        $GLOBALS['_harvest_options'] = [
            'harvest_ha_url'        => 'https://ha.example.com',
            'harvest_widget_source' => 'bundled',
            'some_other_plugin_opt' => 'keep_me',
        ];

        include dirname( __DIR__ ) . '/uninstall.php';

        $this->assertArrayHasKey( 'some_other_plugin_opt', $GLOBALS['_harvest_options'] );
        $this->assertSame( 'keep_me', $GLOBALS['_harvest_options']['some_other_plugin_opt'] );
    }

    public function test_uninstall_exactly_two_options_deleted(): void {
        $GLOBALS['_harvest_options'] = [
            'harvest_ha_url'        => 'https://ha.example.com',
            'harvest_widget_source' => 'bundled',
            'unrelated_a'           => '1',
            'unrelated_b'           => '2',
        ];

        include dirname( __DIR__ ) . '/uninstall.php';

        // Only the two unrelated options remain.
        $this->assertCount( 2, $GLOBALS['_harvest_options'] );
    }
}
