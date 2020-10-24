/**
 * The Widget Row class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Row = Function.inherits('Alchemy.Widget.Container', 'Row');

/**
 * Create an instance of the HTML element representing this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Row.setMethod(function createWidgetElement() {

	let element = this.createElement('alchemy-widgets-row');

	return element;
});