/**
 * The Widget List class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const List = Function.inherits('Alchemy.Widget.Container', 'List');

/**
 * Get a list of elements that could be child widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.3
 * @version  0.2.3
 */
List.setMethod(function getPossibleWidgetChildren() {
	let children = this.widget.querySelectorAll(':scope > ul > li > *');
	return children;
});

/**
 * Dummy populate method
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
List.setMethod(function initContainer() {

	let ul = this.createElement('ul');

	Classes.Alchemy.Element.Widget.AlWidgets.prototype._appendWidgetElement.call(this.widget, ul);

	this.widget.list_element = ul;

	initContainer.super.call(this);
});