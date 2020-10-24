/**
 * The alchemy-widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let Widget = Function.inherits('Alchemy.Element.Widget.Base', 'Widget');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setStatic('custom_element_prefix', 'alchemy');

/**
 * The type of widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setAttribute('type');