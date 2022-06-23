/**
 * The alchemy-widgets element is the base "container" for all other widgets.
 * It should never be nested, though
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let AlchemyWidgets = Function.inherits('Alchemy.Element.Widget', function AlchemyWidgets() {
	AlchemyWidgets.super.call(this);

	// Always create this dummy instance just in case?
	this.instance = new Classes.Alchemy.Widget.Container();
	this.instance.widget = this;
});

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setStatic('custom_element_prefix', 'alchemy-widgets');

/**
 * Don't add the edit event listeners
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setProperty('add_edit_event_listeners', false);

/**
 * Indicate this is a container
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
AlchemyWidgets.setProperty('is_container', true);

/**
 * Context variables
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setAssignedProperty('context_variables', function getContextData(value) {

	if (!value) {
		value = {};
	}

	return value;
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setProperty(function value() {

	let widgets = this.getWidgetsConfig(),
	    result;

	if (this.nodeName == 'ALCHEMY-WIDGETS') {
		result = {widgets};
	} else {
		result = {
			type   : this.instance.constructor.type_name,
			config : {
				widgets : widgets
			}
		};
	}

	return result;

}, function setValue(value) {

	let widgets,
	    config;

	this.clear();

	if (Array.isArray(value)) {
		widgets = value;
	} else if (value) {
		if (Array.isArray(value.widgets)) {
			config = value;
			widgets = value.widgets;
		} else if (value.config && value.config.widgets) {
			config = value.config;
			widgets = value.config.widgets;
		} else if (value.widgets) {
			config = value;
			widgets = value.widgets;
		}
	}

	if (config) {
		if (config.class_names) {
			Hawkejs.addClasses(this, config.class_names);
		}
	}

	if (!this.instance) {
		return;
	}

	this.instance.config = config;
	this.instance.initContainer();

	if (!widgets || !widgets.length) {
		return;
	}

	let widget;

	for (widget of widgets) {
		this.addWidget(widget.type, widget.config);
	}
});

/**
 * Get the widgets config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
AlchemyWidgets.setMethod(function getWidgetsConfig() {

	let widgets = [],
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

	return widgets;
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
 * @version  0.1.3
 *
 * @param    {String}   type
 * @param    {Object}   config
 */
AlchemyWidgets.setMethod(function addWidget(type, config) {

	let instance;

	// Create the instance of the widget
	try {
		instance = this.instance.createChildWidget(type, config);
	} catch (err) {
		config = {
			original_config : config,
			html            : '<pre>' + err.message + '\n' + err.stack + '</pre>',
		};

		instance = this.instance.createChildWidget('html', config);
	}

	// Attach the renderer
	instance.hawkejs_renderer = this.hawkejs_renderer;

	// Get the actual widget HTML element
	let element = instance.element;

	this._appendWidgetElement(element);

	element.value = config;

	if (this.editing) {
		element.startEditor();
	}
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
AlchemyWidgets.setMethod(function _appendWidgetElement(element) {

	let add_area;

	if (this.editing) {
		add_area = this.querySelector(':scope > alchemy-widget-add-area');
	}

	if (add_area) {
		this.insertBefore(element, add_area);
	} else {
		this.append(element);
	}

});

/**
 * Don't add any event listeners here
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyWidgets.setMethod(function initEventListeners() {});

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
