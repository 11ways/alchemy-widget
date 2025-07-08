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
 * Prepare the schema
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
List.constitute(function prepareSchema() {

	// Classnames for the li elements
	this.schema.addField('li_class_names', 'String', {
		title       : 'Li-element CSS classes',
		description : 'Configure extra CSS classes for the list items', 
		array: true,
	});
});

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

/**
 * Populate the contents of the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
List.setMethod(function finalizePopulatedWidget() {

	const config = this.config;

	if (config?.li_class_names) {
		let li_elements = this.widget.list_element.querySelectorAll(':scope > li');

		if (li_elements.length) {
			let name,
				i;

			let class_names = Array.cast(config.li_class_names);

			for (i = 0; i < class_names.length; i++) {
				name = class_names[i];
				
				for (let li_element of li_elements) {
					li_element.classList.add(name);
				}
			}
		}
	}


	return finalizePopulatedWidget.super.call(this);
});