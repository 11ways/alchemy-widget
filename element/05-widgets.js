/**
 * The alchemy-widgets element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let AlchemyWidgets = Function.inherits('Alchemy.Element.Widget.Base', 'AlchemyWidgets');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setStatic('custom_element_prefix', 'alchemy-widgets');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setProperty(function value() {

	let widgets = [],
	    result,
	    child,
	    temp,
	    i;

	for (i = 0; i < this.children.length; i++) {
		child = this.children[i];

		if (child instanceof Classes.Alchemy.Element.Widget.Base) {
			temp = child.value;

			if (temp) {
				widgets.push(temp);
			}
		}
	}

	if (this.nodeName == 'ALCHEMY-WIDGETS') {
		result = widgets;
	} else {
		result = {
			type   : this.widget.constructor.type_name,
			config : {
				widgets : widgets
			}
		};
	}

	return result;

}, function setValue(value) {

	let widgets;

	this.clear();

	if (Array.isArray(value)) {
		widgets = value;
	} else if (value) {
		if (value.config && value.config.widgets) {
			widgets = value.config.widgets;
		} else if (value.widgets) {
			widgets = value.widgets;
		}
	}

	if (!widgets || !widgets.length) {
		return;
	}

	let widget;

	for (widget of widgets) {
		this.addWidget(widget.type, widget.config);
	}

});

/**
 * Clear all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setMethod(function clear() {

	let children = Array.cast(this.children),
	    child,
	    i;

	for (i = 0; i < children.length; i++) {
		child = children[i];

		if (child.nodeName == 'ALCHEMY-WIDGET-ADD-AREA') {
			continue;
		}

		child.remove();
	}
});

/**
 * Add a widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   type
 * @param    {Object}   config
 */
AlchemyWidgets.setMethod(function addWidget(type, config) {

	let constructor = Blast.Classes.Alchemy.Widget.Widget.getMember(type);

	if (!type) {
		throw new Error('Unable to find widget "' + type + '"');
	}

	let add_area = this.querySelector(':scope > alchemy-widget-add-area');

	let widget = new constructor(config);

	let element = widget.getWidgetElement();

	if (add_area && element.enableEditor) {
		element.enableEditor();
	}

	if (config) {
		element.value = config;
	}

	if (add_area) {
		this.insertBefore(element, add_area);
	} else {
		this.append(element);
	}
});

/**
 * Enable the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setMethod(function enableEditor() {

	let add_area = this.createElement('alchemy-widget-add-area');

	this.classList.add('editing');
	this.append(add_area);
});

/**
 * The alchemy-widgets-column element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Function.inherits('Alchemy.Element.Widget.AlchemyWidgets', 'Column');

/**
 * The alchemy-widgets-row element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Function.inherits('Alchemy.Element.Widget.AlchemyWidgets', 'Row');
