/**
 * The al-widgets-list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const List = Function.inherits('Alchemy.Element.Widget.AlWidgets', 'List');

/**
 * Get the list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Element}   element
 */
List.enforceProperty(function list_element(new_value) {

	if (!new_value) {
		new_value = this.querySelector('ul');
	}

	return new_value;
});

/**
 * Append a widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Element}   element
 */
List.setMethod(function _appendWidgetElement(element) {

	let li = this.createElement('li');
	li.append(element);

	this.list_element.append(li);
});

/**
 * Get the handle of the given widget (just its parent li, really)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Element}   element
 */
List.setMethod(function getWidgetHandle(element) {
	return element.parentElement;
});