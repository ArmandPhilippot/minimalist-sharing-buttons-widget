<?php
/**
 * Provide a public-facing view for the widget
 *
 * This file is used to markup the public-facing aspects of the widget.
 *
 * @package Minimalist_Sharing_Buttons
 * @link    https://github.com/ArmandPhilippot/minimalist-sharing-buttons-widget
 * @since   0.0.1
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$msbwidget_default_title = __( 'Minimalist Sharing Buttons', 'minimalist-sharing-buttons' );
$msbwidget_title         = ! empty( $instance['title'] ) ? $instance['title'] : $msbwidget_default_title;
$msbwidget_title         = apply_filters( 'widget_title', $msbwidget_title, $instance, $this->id_base );

echo wp_kses_post( $args['before_widget'] );
if ( ! empty( $msbwidget_title ) ) {
	echo wp_kses_post( $args['before_title'] ) . esc_html( $msbwidget_title ) . wp_kses_post( $args['after_title'] );
}
?>
<!-- Your widget content here. -->
<?php
echo wp_kses_post( $args['after_widget'] );
