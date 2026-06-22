<?php
/**
 * ShortcodeTest.php - Tests for Harvest_Shortcode.
 */

use PHPUnit\Framework\TestCase;

class ShortcodeTest extends TestCase {

    protected function setUp(): void {
        parent::setUp();
        $GLOBALS['_harvest_options']  = [
            'harvest_ha_url'        => 'https://ha.example.com',
            'harvest_widget_source' => 'bundled',
        ];
        $GLOBALS['_harvest_scripts']  = [];
        $GLOBALS['_harvest_user_can'] = true;
        $this->resetAssetsFlag();
    }

    private function resetAssetsFlag(): void {
        $ref = new ReflectionProperty( Harvest_Assets::class, 'enqueued' );
        $ref->setValue( null, false );
    }

    // -----------------------------------------------------------------------
    // [harvest] - validation errors
    // -----------------------------------------------------------------------

    public function test_render_missing_token_returns_error_div_for_editor(): void {
        $output = Harvest_Shortcode::render( [ 'entity' => 'light.bedroom' ] );
        $this->assertStringContainsString( 'missing required', $output );
        $this->assertStringContainsString( 'token', $output );
    }

    public function test_render_missing_token_returns_empty_for_public_visitor(): void {
        $GLOBALS['_harvest_user_can'] = false;
        $output = Harvest_Shortcode::render( [ 'entity' => 'light.bedroom' ] );
        $this->assertSame( '', $output );
    }

    public function test_render_missing_entity_and_alias_returns_error_for_editor(): void {
        $output = Harvest_Shortcode::render( [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ] );
        $this->assertStringContainsString( 'missing required', $output );
        $this->assertStringContainsString( 'entity', $output );
    }

    public function test_render_missing_ha_url_returns_error_for_editor(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = '';
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString( 'Home Assistant URL is not configured', $output );
    }

    // -----------------------------------------------------------------------
    // [harvest] - successful render with entity
    // -----------------------------------------------------------------------

    public function test_render_with_entity_outputs_hrv_mount_div(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString( 'class="hrv-mount"', $output );
    }

    public function test_render_with_entity_sets_data_token(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString( 'data-token="hwt_a3F9bC2d114eF5A6b7c8dE"', $output );
    }

    public function test_render_with_entity_sets_data_ha_url(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString( 'data-ha-url="https://ha.example.com"', $output );
    }

    public function test_render_with_entity_preserves_alternate_transport_port(): void {
        $GLOBALS['_harvest_options']['harvest_ha_url'] = 'https://ha.example.com:9050';
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString(
            'data-ha-url="https://ha.example.com:9050"',
            $output
        );
    }

    public function test_render_with_entity_sets_data_entity(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringContainsString( 'data-entity="light.bedroom"', $output );
    }

    public function test_render_with_entity_does_not_set_data_alias(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringNotContainsString( 'data-alias', $output );
    }

    // -----------------------------------------------------------------------
    // [harvest] - alias mode
    // -----------------------------------------------------------------------

    public function test_render_with_alias_sets_data_alias(): void {
        $output = Harvest_Shortcode::render( [
            'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'alias' => 'a1b2c3d4',
        ] );
        $this->assertStringContainsString( 'data-alias="a1b2c3d4"', $output );
    }

    public function test_render_with_alias_does_not_set_data_entity(): void {
        $output = Harvest_Shortcode::render( [
            'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'alias' => 'a1b2c3d4',
        ] );
        $this->assertStringNotContainsString( 'data-entity', $output );
    }

    public function test_render_entity_takes_priority_over_alias(): void {
        // No error suppression: earlier revisions called _doing_it_wrong()
        // here which fired E_USER_NOTICE under WP_DEBUG. The current code
        // emits an HTML comment breadcrumb instead, no notice raised.
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
            'alias'  => 'a1b2c3d4',
        ] );
        $this->assertStringContainsString( 'data-entity="light.bedroom"', $output );
        $this->assertStringNotContainsString( 'data-alias', $output );
    }

    public function test_render_with_both_entity_and_alias_emits_html_comment_breadcrumb(): void {
        // The breadcrumb is invisible to visitors but discoverable by an
        // editor viewing the page source, so a redundant alias= attribute
        // is not silently swallowed without any signal.
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
            'alias'  => 'a1b2c3d4',
        ] );
        $this->assertStringContainsString( '<!-- HArvest:', $output );
        $this->assertStringContainsString( 'entity takes priority', $output );
    }

    public function test_render_with_only_entity_does_not_emit_double_attr_breadcrumb(): void {
        $output = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $this->assertStringNotContainsString( '<!-- HArvest:', $output );
    }

    public function test_render_with_only_alias_does_not_emit_double_attr_breadcrumb(): void {
        $output = Harvest_Shortcode::render( [
            'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'alias' => 'a1b2c3d4',
        ] );
        $this->assertStringNotContainsString( '<!-- HArvest:', $output );
    }

    // -----------------------------------------------------------------------
    // [harvest] - script enqueuing side effect
    // -----------------------------------------------------------------------

    public function test_render_calls_enqueue_on_success(): void {
        Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $handles = array_column( $GLOBALS['_harvest_scripts'], 'handle' );
        $this->assertContains( 'harvest-widget', $handles );
    }

    // -----------------------------------------------------------------------
    // [harvest_group] shortcode
    // -----------------------------------------------------------------------

    public function test_render_group_outputs_hrv_group_div(): void {
        $output = Harvest_Shortcode::render_group(
            [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ],
            ''
        );
        $this->assertStringContainsString( 'class="hrv-group"', $output );
    }

    public function test_render_group_sets_data_token(): void {
        $output = Harvest_Shortcode::render_group(
            [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ],
            ''
        );
        $this->assertStringContainsString( 'data-token="hwt_a3F9bC2d114eF5A6b7c8dE"', $output );
    }

    public function test_render_group_sets_data_ha_url_from_settings(): void {
        $output = Harvest_Shortcode::render_group(
            [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ],
            ''
        );
        $this->assertStringContainsString( 'data-ha-url="https://ha.example.com"', $output );
    }

    public function test_render_group_wraps_nested_content(): void {
        $output = Harvest_Shortcode::render_group(
            [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ],
            'INNER_CONTENT'
        );
        $this->assertStringContainsString( 'INNER_CONTENT', $output );
    }

    // -----------------------------------------------------------------------
    // [harvest_entities_block] shortcode
    // -----------------------------------------------------------------------

    public function test_render_entities_block_wraps_content_in_custom_element(): void {
        $output = Harvest_Shortcode::render_entities_block( [], 'INNER_CONTENT' );
        $this->assertStringContainsString( '<hrv-entities-block>', $output );
        $this->assertStringContainsString( '</hrv-entities-block>', $output );
        $this->assertStringContainsString( 'INNER_CONTENT', $output );
    }

    public function test_render_entities_block_calls_enqueue(): void {
        Harvest_Shortcode::render_entities_block( [], '' );
        $handles = array_column( $GLOBALS['_harvest_scripts'], 'handle' );
        $this->assertContains( 'harvest-widget', $handles );
    }

    /**
     * The block container must wrap the cards, and a wrapping group must wrap
     * the block: group > entities-block > cards. This is the structure the
     * panel snippet generates and the widget's row layout depends on.
     */
    public function test_entities_block_nests_group_outside_block_outside_cards(): void {
        $card = Harvest_Shortcode::render( [
            'token'  => 'hwt_a3F9bC2d114eF5A6b7c8dE',
            'entity' => 'light.bedroom',
        ] );
        $block = Harvest_Shortcode::render_entities_block( [], $card );
        $group = Harvest_Shortcode::render_group(
            [ 'token' => 'hwt_a3F9bC2d114eF5A6b7c8dE' ],
            $block
        );

        $group_pos       = strpos( $group, 'class="hrv-group"' );
        $block_open_pos  = strpos( $group, '<hrv-entities-block>' );
        $mount_pos       = strpos( $group, 'class="hrv-mount"' );
        $block_close_pos = strpos( $group, '</hrv-entities-block>' );

        $this->assertNotFalse( $group_pos );
        $this->assertNotFalse( $block_open_pos );
        $this->assertNotFalse( $mount_pos );
        $this->assertNotFalse( $block_close_pos );
        // Outer to inner: group, then block, then card.
        $this->assertLessThan( $block_open_pos, $group_pos );
        $this->assertLessThan( $mount_pos, $block_open_pos );
        $this->assertLessThan( $block_close_pos, $mount_pos );
    }

    // -----------------------------------------------------------------------
    // init registers shortcodes
    // -----------------------------------------------------------------------

    public function test_init_registers_harvest_shortcode(): void {
        $GLOBALS['_harvest_shortcodes'] = [];
        Harvest_Shortcode::init();
        $this->assertArrayHasKey( 'harvest', $GLOBALS['_harvest_shortcodes'] );
    }

    public function test_init_registers_harvest_group_shortcode(): void {
        $GLOBALS['_harvest_shortcodes'] = [];
        Harvest_Shortcode::init();
        $this->assertArrayHasKey( 'harvest_group', $GLOBALS['_harvest_shortcodes'] );
    }

    public function test_init_registers_entities_block_shortcode(): void {
        $GLOBALS['_harvest_shortcodes'] = [];
        Harvest_Shortcode::init();
        $this->assertArrayHasKey( 'harvest_entities_block', $GLOBALS['_harvest_shortcodes'] );
    }
}
