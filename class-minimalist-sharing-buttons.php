<?php
/**
 * Minimalist_Sharing_Buttons
 *
 * Display sharing buttons as a widget.
 *
 * @package   Minimalist_Sharing_Buttons
 * @link      https://github.com/ArmandPhilippot/minimalist-sharing-buttons-widget
 * @author    Armand Philippot <contact@armandphilippot.com>
 *
 * @copyright 2021 Armand Philippot
 * @license   GPL-2.0-or-later
 * @since     0.0.1
 *
 * @wordpress-plugin
 * Plugin Name:       Minimalist Sharing Buttons
 * Plugin URI:        https://github.com/ArmandPhilippot/minimalist-sharing-buttons-widget
 * Description:       Display sharing buttons as a widget.
 * Version:           1.0.2
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Armand Philippot
 * Author URI:        https://www.armandphilippot.com/
 * License:           GPL v2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       minimalist-sharing-buttons
 * Domain Path:       /languages
 */

namespace MSBWidget;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'MSBWIDGET_VERSION', '1.0.2' );

/**
 * Class used to implement a Minimalist_Sharing_Buttons widget.
 *
 * @since 0.0.1
 *
 * @see WP_Widget
 */
class Minimalist_Sharing_Buttons extends \WP_Widget {
	/**
	 * Set up a new Minimalist_Sharing_Buttons widget instance with id, name & description.
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
		$widget_options = array(
			'classname'   => 'msbwidget',
			'description' => __( 'Display sharing buttons as a widget.', 'minimalist-sharing-buttons' ),
		);

		parent::__construct(
			'msbwidget',
			__( 'Minimalist Sharing Buttons', 'minimalist-sharing-buttons' ),
			$widget_options
		);

		add_action(
			'widgets_init',
			function() {
				register_widget( 'MSBWidget\Minimalist_Sharing_Buttons' );
			}
		);

		add_action( 'plugins_loaded', array( $this, 'msbwidget_load_plugin_textdomain' ) );

		if ( is_active_widget( false, false, $this->id_base ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'msbwidget_enqueue_public_styles' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'msbwidget_enqueue_public_scripts' ) );
		}

		if ( is_admin() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'msbwidget_enqueue_admin_styles' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'msbwidget_enqueue_admin_scripts' ) );
		}
	}

	/**
	 * Load text domain files
	 *
	 * @since 0.0.1
	 */
	public function msbwidget_load_plugin_textdomain() {
		load_plugin_textdomain( 'minimalist-sharing-buttons', false, basename( dirname( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Register and enqueue styles needed by the public view of
	 * Minimalist_Sharing_Buttons widget.
	 *
	 * @since 0.0.1
	 */
	public function msbwidget_enqueue_public_styles() {
		$styles_url  = plugins_url( 'public/css/style.min.css', __FILE__ );
		$styles_path = plugin_dir_path( __FILE__ ) . 'public/css/style.min.css';

		if ( file_exists( $styles_path ) ) {
			wp_register_style( 'msbwidget', $styles_url, array(), MSBWIDGET_VERSION );

			wp_enqueue_style( 'msbwidget' );
			wp_style_add_data( 'msbwidget', 'rtl', 'replace' );
		}
	}

	/**
	 * Register and enqueue scripts needed by the public view of
	 * Minimalist_Sharing_Buttons widget.
	 *
	 * @since 0.0.1
	 */
	public function msbwidget_enqueue_public_scripts() {
		$scripts_url  = plugins_url( 'public/js/scripts.min.js', __FILE__ );
		$scripts_path = plugin_dir_path( __FILE__ ) . 'public/js/scripts.min.js';

		if ( file_exists( $scripts_path ) ) {
			wp_register_script( 'msbwidget-scripts', $scripts_url, array(), MSBWIDGET_VERSION, true );
			wp_enqueue_script( 'msbwidget-scripts' );
		}
	}

	/**
	 * Register and enqueue styles needed by the admin view of
	 * Minimalist_Sharing_Buttons widget.
	 *
	 * @since 0.0.1
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function msbwidget_enqueue_admin_styles( $hook_suffix ) {
		$styles_url  = plugins_url( 'admin/css/style.min.css', __FILE__ );
		$styles_path = plugin_dir_path( __FILE__ ) . 'admin/css/style.min.css';

		if ( file_exists( $styles_path ) && 'widgets.php' === $hook_suffix ) {
			wp_register_style( 'msbwidget', $styles_url, array(), MSBWIDGET_VERSION );

			wp_enqueue_style( 'msbwidget' );
			wp_style_add_data( 'msbwidget', 'rtl', 'replace' );
		}
	}

	/**
	 * Register and enqueue scripts needed by the admin view of
	 * Minimalist_Sharing_Buttons widget.
	 *
	 * @since 0.0.1
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function msbwidget_enqueue_admin_scripts( $hook_suffix ) {
		if ( 'widgets.php' !== $hook_suffix ) {
			return;
		}

		$scripts_url  = plugins_url( 'admin/js/scripts.min.js', __FILE__ );
		$scripts_path = plugin_dir_path( __FILE__ ) . 'admin/js/scripts.min.js';

		if ( file_exists( $scripts_path ) ) {
			wp_register_script( 'msbwidget-scripts', $scripts_url, array(), MSBWIDGET_VERSION, true );
			wp_localize_script(
				'msbwidget-scripts',
				'msbwidgetArgs',
				array(
					'jsonPath' => plugins_url( 'admin/json/social-networks.json', __FILE__ ),
				)
			);
			wp_enqueue_script( 'msbwidget-scripts' );
		}
	}

	/**
	 * Retrieve the social networks list.
	 *
	 * @since 0.0.1
	 *
	 * @return array An array of social networks objects.
	 */
	public function msbwidget_get_social_networks() {
		$social_networks_file     = plugin_dir_url( __FILE__ ) . 'admin/json/social-networks.json';
		$social_networks_response = wp_remote_get( $social_networks_file );

		if ( ! is_wp_error( $social_networks_response ) && isset( $social_networks_response['response']['code'] ) && 200 === $social_networks_response['response']['code'] ) {
			$social_networks_body = wp_remote_retrieve_body( $social_networks_response );
			$social_networks      = json_decode( $social_networks_body );

			return $social_networks;
		} else {
			return array();
		}
	}

	/**
	 * Write the Mastodon API Token in a file to share it with Mastodon Button
	 * Sharing.
	 *
	 * @since 0.0.1
	 *
	 * @param string $api_token The Mastodon API Token.
	 */
	public function msbwidget_set_mastodon_api_token( $api_token ) {
		$mastodon_api_token = ( ! empty( $api_token ) ) ? $api_token : '';
		$file_path          = plugin_dir_path( __FILE__ ) . 'public/cache/api-token.php';

		$handle = fopen( $file_path, 'w' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fopen
		fwrite( $handle, "<?php\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fwrite
		fwrite( $handle, "\$msbwidget_api_token = '" . $mastodon_api_token . "';\n\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fwrite
		fwrite( $handle, 'return $msbwidget_api_token;' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fwrite
		fclose( $handle ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fclose
	}

	/**
	 * Outputs the content for the current Minimalist_Sharing_Buttons widget instance.
	 *
	 * @since 0.0.1
	 *
	 * @param array $args HTML to display the widget title class and widget content class.
	 * @param array $instance Settings for the current widget instance.
	 */
	public function widget( $args, $instance ) {
		include 'public/partials/minimalist-sharing-buttons-public-display.php';
	}

	/**
	 * Outputs the settings form for the Minimalist_Sharing_Buttons widget.
	 *
	 * @since 0.0.1
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		include 'admin/partials/minimalist-sharing-buttons-admin-display.php';
	}

	/**
	 * Handles updating settings for the current Minimalist_Sharing_Buttons widget instance.
	 *
	 * @since 0.0.1
	 *
	 * @param array $new_instance New settings for this instance as input by the user.
	 * @param array $old_instance Old settings for this instance.
	 *
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {
		$social_networks   = $this->msbwidget_get_social_networks();
		$instance          = $old_instance;
		$instance['title'] = sanitize_text_field( $new_instance['title'] );

		foreach ( $social_networks as $social_network ) {
			$instance['social_networks'][ $social_network->id ] = ( ! empty( $new_instance['social_networks'][ $social_network->id ] ) ? 1 : 0 );
		}

		$instance['mastodon_api_token'] = sanitize_text_field( $new_instance['mastodon_api_token'] );
		$this->msbwidget_set_mastodon_api_token( $instance['mastodon_api_token'] );

		return $instance;
	}
}

$msbwidget = new Minimalist_Sharing_Buttons();
