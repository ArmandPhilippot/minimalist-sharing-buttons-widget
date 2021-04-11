<?php
/**
 * Provide an admin-facing view for the widget
 *
 * This file is used to markup the admin-facing aspects of the widget.
 *
 * @package Minimalist_Sharing_Buttons
 * @link    https://github.com/ArmandPhilippot/minimalist-sharing-buttons-widget
 * @since   0.0.1
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$msbwidget_title = ! empty( $instance['title'] ) ? $instance['title'] : '';
?>
<p>
	<label
		for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
		<?php echo esc_html__( 'Title:', 'minimalist-sharing-buttons' ); ?>
	</label>
	<input class="widefat"
		id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
		name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
		type="text" value="<?php echo esc_attr( $msbwidget_title ); ?>" />
</p>
