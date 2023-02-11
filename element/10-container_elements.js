/**
 * The al-widgets element is the base "container" for all other widgets.
 * It should never be nested, though
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let AlchemyWidgets = Function.inherits('Alchemy.Element.Widget', function AlWidgets() {
	AlWidgets.super.call(this);

	// Always create this dummy instance just in case?
	this.instance = new Classes.Alchemy.Widget.Container();
	this.instance.widget = this;
});

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AlchemyWidgets.setStatic('custom_element_prefix', 'al-widgets');

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
 * @version  0.2.1
 */
AlchemyWidgets.setProperty(function value() {

	let config = this.instance.config,
	    widgets = this.getWidgetsConfig(),
	    result;
	
	config = Object.assign({}, config, {widgets});

	if (this.nodeName == 'AL-WIDGETS') {
		result = config;
	} else {
		result = {
			type   : this.instance.constructor.type_name,
			config : config,
		};
	}

	return result;

}, function setValue(value) {
	this.applyValue(value);
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.2.1
 */
AlchemyWidgets.setMethod(function applyValue(value) {

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
	} else {
		config = this.instance?.config || {};
	}

	if (!this.instance) {
		return;
	}

	config.widgets = widgets;

	this.instance.config = config;
	this.instance.initContainer();
});

/**
 * Get the widgets config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.3
 *
 * @return   {Array}
 */
AlchemyWidgets.setMethod(function getWidgetsConfig() {

	let children = this.getPossibleWidgetChildren(),
	    widgets = [],
	    child,
	    temp,
	    i;

	for (i = 0; i < children.length; i++) {
		child = children[i];

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

		if (child.nodeName == 'AL-WIDGET-ADD-AREA') {
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
 *
 * @return   {HTMLElement}
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

	return element;
});

/**
 * Append a widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Element}   element
 */
AlchemyWidgets.setMethod(function _appendWidgetElement(element) {

	let add_area;

	if (this.editing) {
		add_area = this.querySelector(':scope > al-widget-add-area');
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
 * The al-widgets-column element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Function.inherits('Alchemy.Element.Widget.AlWidgets', 'Column');

/**
 * The al-widgets-row element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Function.inherits('Alchemy.Element.Widget.AlWidgets', 'Row');
