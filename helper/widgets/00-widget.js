/**
 * The Base Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 *
 * @param    {Object}   config
 */
const Widget = Function.inherits('Alchemy.Base', 'Alchemy.Widget', function Widget(config) {

	// The configuration of this widget
	if (config) {
		this.config = config;
	}

	this.originalconfig = this.config;

	// Are we currently editing?
	this.editing = false;

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
 * The config object
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 *
 * @type     {Object}
 */
Widget.enforceProperty(function config(new_value) {

	if (!new_value) {
		new_value = {};
	}

	return new_value;
});

/**
 * A reference to the renderer
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 *
 * @type     {Hawkejs.Renderer}
 */
Widget.enforceProperty(function hawkejs_renderer(new_value) {

	if (!new_value) {
		if (this.parent_instance && this.parent_instance.hawkejs_renderer) {
			new_value = this.parent_instance.hawkejs_renderer;
		} else if (this.widget && this.widget.hawkejs_renderer) {
			new_value = this.widget.hawkejs_renderer;
		} else if (Blast.isBrowser) {
			new_value = hawkejs.scene.general_renderer;
		}
	}

	return new_value;
});

/**
 * Prepare the schema & actions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Widget.constitute(function prepareSchema() {

	// Create the actions
	this.actions = new Deck();

	// Create the schema
	this.schema = this.createSchema();

	// Extra classnames for the wrapper
	this.schema.addField('wrapper_class_names', 'String', {
		title       : 'Wrapper CSS classes',
		description : 'Configure extra CSS classes to the wrapper `al-widget` element', 
		array: true,
		widget_config_editable: true,
	});

	// Classnames for the inserted element (if any)
	this.schema.addField('main_class_names', 'String', {
		title       : 'Main CSS classes',
		description : 'Configure extra CSS classes for the main inserted element', 
		array: true,
	});

	// Add the "copy to clipboard" action
	let copy = this.createAction('copy', 'Copy to clipboard');

	copy.setHandler(function copyAction(widget_el, handle) {
		return widget_el.copyConfigToClipboard();
	});

	copy.setTester(function copyAction(widget_el, handle) {
		return true;
	});

	copy.setIcon('clipboard');
	copy.close_actionbar = true;

	// Add the "paste from clipboard" action
	let paste = this.createAction('paste', 'Replace from clipboard');

	paste.setHandler(function pasteAction(widget_el, handle) {
		return widget_el.pasteConfigFromClipboard();
	});

	paste.setTester(function pasteAction(widget_el, handle) {
		return widget_el.getConfigFromClipboard();
	});

	paste.setIcon('paste');
	paste.close_actionbar = true;

	// Add the "save" action
	let save = this.createAction('save', 'Save');

	save.setHandler(function removeAction(widget_el, handle) {
		return widget_el.save();
	});

	save.setTester(function saveAction(widget_el, handle) {
		return widget_el.can_be_saved;
	});

	save.setIcon('floppy-disk');

	// Add the remove action
	let remove = this.createAction('remove', 'Remove');

	remove.close_actionbar = true;

	remove.setHandler(function removeAction(widget_el, handle) {
		handle.remove();
	});

	remove.setTester(function removeTester(widget_el, handle) {
		return widget_el.can_be_removed;
	});

	remove.setIcon('trash');

	// Add the config action
	let config = this.createAction('config', 'Config');

	config.close_actionbar = true;
	config.setIcon('gears');

	config.setHandler(function configAction(widget_el, handle) {
		widget_el.instance.showConfig();
	});

	// The move-left action
	let move_left = this.createAction('move-left', 'Move left');

	move_left.close_actionbar = true;

	move_left.setHandler(function moveLeftAction(widget_el, handle) {
		// Hawkejs custom element method!
		handle.moveBeforeElement(handle.previousElementSibling);
	});

	move_left.setTester(function moveLeftTest(widget_el, handle) {

		if (!widget_el.can_be_moved) {
			return false;
		}

		return !!handle.previousElementSibling;
	});

	move_left.setIcon('arrow-left');

	let move_right = this.createAction('move-right', 'Move right');

	move_right.close_actionbar = true;

	move_right.setHandler(function moveRightAction(widget_el, handle) {
		// Hawkejs custom element method!
		handle.moveAfterElement(handle.nextElementSibling);
	});

	move_right.setTester(function moveRightTest(widget_el, handle) {

		if (!widget_el.can_be_moved) {
			return false;
		}

		let next = handle.nextElementSibling;

		if (!next || next.tagName == 'AL-WIDGET-ADD-AREA') {
			return false;
		}

		return true;
	});

	move_right.setIcon('arrow-right');

	// The move-in-left action
	let move_in_left = this.createAction('move-in-left', 'Move in left');

	move_in_left.close_actionbar = true;

	move_in_left.setHandler(function moveLeftAction(widget_el, handle) {
		// Hawkejs custom element method!
		let container = handle.previous_container;

		if (container) {
			container.append(handle);
		}
	});

	move_in_left.setTester(function moveLeftTest(widget_el, handle) {

		if (!widget_el.can_be_moved) {
			return false;
		}

		return !!handle.previous_container;
	});

	move_in_left.setIcon('arrow-left');

	// The move-in-right action
	let move_in_right = this.createAction('move-in-right', 'Move in right');

	move_in_right.close_actionbar = true;

	move_in_right.setHandler(function moveRightAction(widget_el, handle) {
		// Hawkejs custom element method!
		let container = handle.next_container;

		if (container) {
			container.prepend(handle);
		}
	});

	move_in_right.setTester(function moveRightTest(widget_el, handle) {

		if (!widget_el.can_be_moved) {
			return false;
		}

		return !!handle.next_container;
	});

	move_in_right.setIcon('arrow-right');

	let css_class = this.createAction('css-class', 'CSS Class');

	css_class.setHandler(function setCssClass(widget_el, handle) {
		widget_el.instance.showConfig(['main_class_names']);
	});

	css_class.setIcon('tags');
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
 * @version  0.1.4
 */
Widget.setStatic(function createAction(name, title) {

	let action = new Classes.Alchemy.Widget.Action(name, title || name.titleize());

	this.actions.set(name, action);

	return action;
});

/**
 * Add a check to see if the widget can be added to the current location
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Boolean|Function}   checker
 */
Widget.setStatic(function setAddChecker(checker) {
	this.add_checker = checker;
});

/**
 * Actually perform the add-check
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Alchemy.Element.Widget.Base}   widget_element
 */
Widget.setStatic(function canBeAdded(widget_element) {

	if (this.add_checker != null) {
		const type = typeof this.add_checker;

		if (type == 'function') {
			return this.add_checker(widget_element);
		} else if (type == 'boolean') {
			return this.add_checker;
		}
	}

	return true;
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

	let WidgetClass = Widget.getMember(type);

	if (!WidgetClass) {
		throw new Error('Unable to find Widget of type "' + type + '"');
	}

	// Create the instance
	let instance = new WidgetClass(config);

	// Set the parent instance!
	instance.parent_instance = this;

	// Create the actual element
	let el = instance._createWidgetElement();

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
 * Get an array of actionbar actions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @return   {Array}
 */
Widget.setMethod(async function getActionbarActions() {

	let sorted = this.constructor.actions.getSorted(),
	    result = [],
	    action;

	for (action of sorted) {

		let tester = action.test(this.widget);

		if (Pledge.isThenable(tester)) {
			tester = await tester;
		}

		if (tester) {
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
 * This will probably be just <al-widget>
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @return   {HTMLElement}
 */
Widget.setMethod(function _createWidgetElement() {

	let element = this.createElement('al-widget');

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
 * Populate the contents of the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 */
Widget.setMethod(function populateWidget() {

	if (this.config && this.config.wrapper_class_names) {
		let name,
		    i;

		let class_names = Array.cast(this.config.wrapper_class_names);

		for (i = 0; i < class_names.length; i++) {
			name = class_names[i];
			this.widget.classList.add(name);
		}
	}

	let child_classes = this.widget.child_class;

	if (child_classes) {
		let children = this.widget.children,
		    i;
		
		for (i = 0; i < children.length; i++) {
			Hawkejs.addClasses(children[i], child_classes);
		}
	}
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 */
Widget.setMethod(async function startEditor() {

	// Show this is being edited
	this.editing = true;

	// Make sure the icon font is loaded
	if (this.hawkejs_renderer?.helpers?.Media) {
		this.hawkejs_renderer.helpers.Media.loadIconFont();
	}

	// Add the appropriate class to the current widget wrapper
	this.widget.classList.add('aw-editing');

	await this.widget.waitForTasks();

	if (typeof this._startEditor == 'function') {
		this._startEditor();
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 */
Widget.setMethod(function stopEditor() {

	// Show this is not being edited anymore
	this.editing = false;

	// Remove the editing class
	this.widget.classList.remove('aw-editing');

	this.syncConfig();

	if (typeof this._stopEditor == 'function') {
		this._stopEditor();

		// Remove the editing class again
		// (some editors will try to restore the original classes)
		this.widget.classList.remove('aw-editing');
	}
});

/**
 * Rerender this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 */
Widget.setMethod(async function rerender() {

	Hawkejs.removeChildren(this.widget);

	await this.populateWidget();

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
 * Show the config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Widget.setMethod(async function showConfig(fields) {

	let field;

	if (!fields) {
		fields = [];

		for (field of this.schema) {
			if (!field.options.widget_config_editable) {
				continue;
			}

			fields.push(field);
		}
	}

	fields = fields.slice(0);

	let i;

	for (i = 0; i < fields.length; i++) {
		field = fields[i];

		if (typeof field == 'string') {
			fields[i] = this.schema.get(field);
		}
	}

	let widget_settings = Object.assign({}, this.syncConfig());

	let variables = {
		title            : this.constructor.title,
		schema           : this.schema,
		widget_settings,
		fields           : fields
	};

	await hawkejs.scene.render('widget/widget_config', variables);

	let dialog_contents = document.querySelector('he-dialog [data-he-template="widget/widget_config"]');

	if (!dialog_contents) {
		return;
	}

	let dialog = dialog_contents.queryParents('he-dialog'),
	    button = dialog_contents.querySelector('.btn-apply');

	dialog_contents.classList.add('default-form-editor');
	hawkejs.scene.enableStyle('chimera/chimera');

	button.addEventListener('click', e => {
		e.preventDefault();

		let form = dialog.querySelector('al-form');

		Object.assign(this.config, form.value);

		this.rerender();

		dialog.remove();
	});
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