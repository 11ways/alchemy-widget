/**
 * The Base Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   config
 */
const Widget = Function.inherits('Alchemy.Base', 'Alchemy.Widget', function Widget(config) {

	// The configuration of this widget
	this.config = config || {};

	// Are we currently editing?
	this.editing = false;

	// Optional renderer
	this.hawkejs_renderer = null;

	// The parent instance
	this.parent_instance = null;
});

/**
 * Make this an abstract class
 */
Widget.makeAbstractClass();

/**
 * This class starts a new group
 */
Widget.startNewGroup('widgets');

/**
 * Return the class-wide schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Schema}
 */
Widget.setProperty(function schema() {
	return this.constructor.schema;
});

/**
 * Get the actual widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {HTMLElement}
 */
Widget.enforceProperty(function widget(new_value, old_value) {

	if (!new_value) {
		console.log('»»» WARNING! widget is missing');
	}

	return new_value;
});

/**
 * A reference to the element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {HTMLElement}
 */
Widget.setProperty(function element() {
	return this.widget;
}, function setElement(element) {
	return this.widget = element;
});

/**
 * Prepare the schema & actions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.constitute(function prepareSchema() {

	// Create the actions
	this.actions = new Deck();

	// Create the schema
	this.schema = this.createSchema();

	// Add the remove action
	let remove = this.createAction('remove', 'Remove');

	remove.close_toolbar = true;

	remove.setHandler(function removeAction(widget_el, handle) {
		handle.remove();
	});

	remove.setIcon('gg-trash');

	// The move-left action
	let move_left = this.createAction('move-left', 'Move left');

	move_left.close_toolbar = true;

	move_left.setHandler(function moveLeftAction(widget_el, handle) {
		// Hawkejs custom element method!
		handle.moveBeforeElement(handle.previousElementSibling);
	});

	move_left.setTester(function moveLeftTest(widget_el, handle) {
		return !!handle.previousElementSibling;
	});

	move_left.setIcon('gg-arrow-left');

	let move_right = this.createAction('move-right', 'Move right');

	move_right.close_toolbar = true;

	move_right.setHandler(function moveRightAction(widget_el, handle) {
		// Hawkejs custom element method!
		handle.moveAfterElement(handle.nextElementSibling);
	});

	move_right.setTester(function moveRightTest(widget_el, handle) {

		let next = handle.nextElementSibling;

		if (!next || next.tagName == 'ALCHEMY-WIDGET-ADD-AREA') {
			return false;
		}

		return true;
	});

	move_right.setIcon('gg-arrow-right');
});

/**
 * Create a schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setStatic(function createSchema() {

	let schema;

	if (Blast.isNode) {
		// Create the schema
		schema = new Classes.Alchemy.Schema();
	} else {
		schema = new Classes.Alchemy.Client.Schema();
	}

	return schema;
});

/**
 * Set an action
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setStatic(function createAction(name) {

	let action = new Classes.Alchemy.Widget.Action(name);

	this.actions.set(name, action);

	return action;
});

/**
 * unDry an object
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   obj
 *
 * @return   {Alchemy.Widget.Widget}
 */
Widget.setStatic(function unDry(obj, custom_method, whenDone) {
	let widget = new this(obj.config);

	whenDone(() => {
		widget.widget = obj.element;
		widget.parent_instance = obj.parent;
	});

	return widget;
});

/**
 * Create a child widget instance
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   type     The typeof widget to create
 * @param    {Object}   config   The optional config object
 *
 * @return   {Widget}
 */
Widget.setMethod(function createChildWidget(type, config) {

	console.log('Getting widget of type:', type);

	let WidgetClass = Widget.getMember(type);

	console.log('... got:', WidgetClass);

	if (!WidgetClass) {
		throw new Error('Unable to find Widget of type "' + type + '"');
	}

	// Create the instance
	let instance = new WidgetClass(config);

	// Set the parent instance!
	instance.parent_instance = this;

	// Create the actual element
	let el = instance._createWidgetElement();

	console.log('»»', type, 'EL', el.instance.constructor.name, instance.constructor.name)

	// And attach it
	instance.element = el;

	return instance;
});

/**
 * Return an object for json-drying this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Widget.setMethod(function toDry() {
	return {
		value: {
			config    : this.config,
			element   : this.widget,
			parent    : this.parent_instance,
		}
	};
});

/**
 * Get an array of toolbar actions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Widget.setMethod(function getToolbarActions() {

	let sorted = this.constructor.actions.getSorted(),
	    result = [],
	    action;

	for (action of sorted) {
		if (action.test(this.widget)) {
			result.push(action);
		}
	}

	return result;
});

/**
 * Create an HTML element of the wanted type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   tag_name
 *
 * @return   {HTMLElement}
 */
Widget.setMethod(function createElement(tag_name) {

	let element;

	if (this.widget) {
		// Use the widget to create an element,
		// it might contain a hawkejs_renderer
		element = this.widget.createElement(tag_name);
	} else if (this.hawkejs_renderer) {
		element = this.hawkejs_renderer.createElement(tag_name);
	} else if (this.parent_instance) {
		return this.parent_instance.createElement(tag_name);
	} else {
		element = Classes.Hawkejs.Hawkejs.createElement(tag_name);
	}

	return element;
});

/**
 * Create an instance of the HTML element representing this widget
 * This will probably be just <alchemy-widget>
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Widget.setMethod(function _createWidgetElement() {

	let element = this.createElement('alchemy-widget');

	// Set the type of the widget to our type
	element.type = this.constructor.type_name;

	// Attach this instance
	element.instance = this;

	return element;
});

/**
 * Get the widget HTML element with assigned data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Widget.setMethod(function _createPopulatedWidgetElement() {

	console.warn('»» _createPopulatedWidgetElement() is deprecated and dangerous! ««');

	// Create the wrapper widget elemend
	let element = this._createWidgetElement();

	// Attach this instance
	element.instance = this;

	this.widget = element;

	// See if it can be populated
	if (typeof this.populateWidget == 'function') {
		this.populateWidget(element);
	}

	return element;
});

/**
 * Dummy populate method
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function populateWidget() {});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function startEditor() {

	// Show this is being edited
	this.editing = true;

	// Add the appropriate class to the current widget wrapper
	this.widget.classList.add('aw-editing');

	if (typeof this._startEditor == 'function') {
		this._startEditor();
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function stopEditor() {

	// Show this is not being edited anymore
	this.editing = false;

	// Remove the editing class
	this.widget.classList.remove('aw-editing');

	this.syncConfig();

	if (typeof this._stopEditor == 'function') {
		this._stopEditor();
	}
});

/**
 * Rerender this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function rerender() {

	Hawkejs.removeChildren(this.widget);

	this.populateWidget();

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
Widget.setMethod(function syncConfig() {
	return this.config;
});

/**
 * Get the handle element of this widget
 * (which is the widget itself by default)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
Widget.setMethod(function getHandle() {

	let element = this.widget;

	if (element.parent_container && typeof element.parent_container.getWidgetHandle == 'function') {
		element = element.parent_container.getWidgetHandle(element);
	}

	return element;
});