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

$msbwidget_title = ! empty( $instance['title'] ) ? $instance['title'] : '';
$msbwidget_title = apply_filters( 'widget_title', $msbwidget_title, $instance, $this->id_base );

$msbwidget_social_networks_list = $this->msbwidget_get_social_networks();
$msbwidget_social_networks      = ! empty( $instance['social_networks'] ) ? $instance['social_networks'] : array();

$msbwidget_post_link    = get_permalink();
$msbwidget_post_title   = get_the_title();
$msbwidget_post_content = get_the_excerpt();
$msbwidget_post_image   = get_the_post_thumbnail();

echo wp_kses_post( $args['before_widget'] );
if ( ! empty( $msbwidget_title ) ) {
	echo wp_kses_post( $args['before_title'] ) . esc_html( $msbwidget_title ) . wp_kses_post( $args['after_title'] );
}
foreach ( $msbwidget_social_networks_list as $msbwidget_social_network ) {
	if ( $msbwidget_social_networks[ $msbwidget_social_network->id ] ) {
		$msbwidget_social_network_class       = 'msbwidget__btn msbwidget__btn--' . $msbwidget_social_network->id;
		$msbwidget_social_network_sharing_url = $msbwidget_social_network->sharing_url;
		$msbwidget_social_network_parameters  = (array) $msbwidget_social_network->parameters;
		$msbwidget_social_network_parameters  = array_filter( $msbwidget_social_network_parameters );

		foreach ( $msbwidget_social_network_parameters as $msbwidget_parameter_name => $msbwidget_parameter_value ) {
			if ( array_key_first( $msbwidget_social_network_parameters ) === $msbwidget_parameter_name ) {
				$msbwidget_social_network_sharing_url .= '?';
			}

			$msbwidget_social_network_sharing_url .= $msbwidget_parameter_value . '=';

			switch ( $msbwidget_parameter_name ) {
				case 'url':
					$msbwidget_social_network_sharing_url .= $msbwidget_post_link;
					break;
				case 'title':
					$msbwidget_social_network_sharing_url .= $msbwidget_post_title;
					break;
				case 'content':
					$msbwidget_social_network_sharing_url .= $msbwidget_post_content;
					break;
				case 'image':
					$msbwidget_social_network_sharing_url .= $msbwidget_post_image;
					break;
				default:
					// code...
					break;
			}

			if ( array_key_last( $msbwidget_social_network_parameters ) !== $msbwidget_parameter_name ) {
				$msbwidget_social_network_sharing_url .= '&';
			}
		}
		?>
		<a href="<?php echo esc_url( $msbwidget_social_network_sharing_url ); ?>" class="<?php echo esc_attr( $msbwidget_social_network_class ); ?>"><?php echo esc_html( $msbwidget_social_network->name ); ?></a>
		<?php
	}
}
echo wp_kses_post( $args['after_widget'] );
