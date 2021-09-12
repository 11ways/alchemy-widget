/**
 * The Widget Container class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Container = Function.inherits('Alchemy.Widget', 'Container');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Container.constitute(function prepareSchema() {

	let widgets = this.createSchema();

	widgets.addField('type', 'Enum', {values: alchemy.getClassGroup('widgets')});
	widgets.addField('config', 'Schema', {schema: 'type'});

	this.schema.addField('widgets', widgets, {array: true});
});

/**
 * Initialize the container
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Container.setMethod(function initContainer() {
	this.populateWidget();
});

/**
 * Create an instance of the HTML element representing this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Container.setMethod(function _createWidgetElement() {

	let tag_name = 'alchemy-widgets-' + this.constructor.type_name;

	let element = this.createElement(tag_name);

	// Attach this instance
	element.instance = this;

	return element;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Container.setMethod(function _startEditor() {

	let add_area = this.widget.querySelector(':scope > alchemy-widget-add-area');

	if (!add_area) {
		add_area = this.createElement('alchemy-widget-add-area');
		this.widget.append(add_area);
	}

	let child,
	    i;

	for (i = 0; i < this.widget.children.length; i++) {
		child = this.widget.children[i];

		if (child.is_alchemy_widget) {
			child.startEditor();
		}
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Container.setMethod(function _stopEditor() {

	let add_area = this.widget.querySelector(':scope > alchemy-widget-add-area');

	if (add_area) {
		add_area.remove();
	}

	let child,
	    i;

	for (i = 0; i < this.widget.children.length; i++) {
		child = this.widget.children[i];

		if (child.is_alchemy_widget) {
			child.stopEditor();
		}
	}
});

/**
 * Rerender this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Container.setMethod(function rerender() {

	Hawkejs.removeChildren(this.widget);

	this.initContainer();

	if (this.editing) {
		this.startEditor();
	}
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Container.setMethod(function syncConfig() {

	let widgets = this.widget.getWidgetsConfig();

	this.config = Object.assign(this.config || {}, {widgets});

	return this.config;
});