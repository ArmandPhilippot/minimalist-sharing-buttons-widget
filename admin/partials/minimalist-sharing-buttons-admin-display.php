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

$msbwidget_social_networks_list = $this->msbwidget_get_social_networks();
$msbwidget_title                = ! empty( $instance['title'] ) ? $instance['title'] : '';
$msbwidget_social_networks      = ! empty( $instance['social_networks'] ) ? $instance['social_networks'] : array();
$msbwidget_mastodon_api_key     = ! empty( $instance['mastodon_api_key'] ) ? $instance['mastodon_api_key'] : '';
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
<fieldset>
	<legend><?php esc_html_e( 'Select the buttons to display.', 'minimalist-sharing-buttons' ); ?></legend>
	<ul class="msbwidget__list">
	<?php
	foreach ( $msbwidget_social_networks_list as $msbwidget_social_network ) {
		?>
		<li class="msbwidget__item">
			<label for="<?php echo esc_attr( $this->get_field_id( $msbwidget_social_network->id ) ); ?>">
				<input
					type="checkbox"
					name="<?php echo esc_attr( $this->get_field_name( 'social_networks' ) . '[' . $msbwidget_social_network->id . ']' ); ?>"
					id="<?php echo esc_attr( $this->get_field_id( $msbwidget_social_network->id ) ); ?>"
					<?php array_key_exists( $msbwidget_social_network->id, $msbwidget_social_networks ) ? checked( $msbwidget_social_networks[ $msbwidget_social_network->id ] ) : ''; ?>
				/>
				<?php echo esc_html( $msbwidget_social_network->name ); ?>
			</label>
		</li>
		<?php
	}
	?>
	</ul>
</fieldset>
<fieldset>
	<legend><?php esc_html_e( 'Mastodon configuration:', 'minimalist-sharing-buttons' ); ?></legend>
	<p>
		<?php
		printf(
			// translators: %s A link.
			esc_html__( 'In order to use the Mastodon button, you need to provide an API key. You can generate one on %s', 'minimalist-sharing-buttons' ),
			'<a href="https://instances.social/api/token">instances.social</a>'
		);
		?>
	</p>
	<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'mastodon-api-key' ) ); ?>"><?php esc_html_e( 'Mastodon API Key:', 'minimalist-sharing-buttons' ); ?></label>
		<input type="text" name="<?php echo esc_attr( $this->get_field_name( 'mastodon_api_key' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'mastodon-api-key' ) ); ?>" value="<?php echo esc_attr( $msbwidget_mastodon_api_key ); ?>">
	</p>
</fieldset>
