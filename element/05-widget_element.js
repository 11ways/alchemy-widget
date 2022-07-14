/**
 * The alchemy-widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let Widget = Function.inherits('Alchemy.Element.Widget.Base', 'Widget');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setStatic('custom_element_prefix', 'alchemy');

/**
 * The type of widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setAttribute('type');

/**
 * Mark this as a widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setProperty('is_alchemy_widget', true);

/**
 * The database record to work with
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Widget.setAssignedProperty('record');

/**
 * The fieldname in the record to work with
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Widget.setAssignedProperty('field');

/**
 * Is this widget being edited?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setProperty(function editing() {

	if (this.instance) {
		return this.instance.editing;
	} else {
		return false;
	}
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.5
 */
Widget.setProperty(function value() {
	return {
		type     : this.type,
		config   : this.instance.syncConfig(),
	}
}, function setValue(value) {
	this.applyValue(value);
});

/**
 * Received a new record
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Widget.setMethod(function onRecordAssignment(new_record, old_val) {
	if (new_record && this.field) {
		let value = new_record[this.field];
		this.applyValue(value);
	}
});

/**
 * Received a new field name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Widget.setMethod(function onFieldAssignment(new_field, old_val) {
	if (new_field && this.record) {
		let value = this.record[new_field];
		this.applyValue(value);
	}
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Widget.setMethod(function applyValue(value) {

	let config,
	    type;

	if (value) {
		if (value.type) {
			type = value.type;
		}

		if (value.config) {
			config = value.config;
		}
	}

	if (type) {
		this.type = type;
	}

	if (!config && !type) {
		config = value;
	}

	if (!config) {
		config = {};
	}

	if (!this.instance && this.type) {
		let WidgetClass = Classes.Alchemy.Widget.Widget.getMember(this.type);
		this.instance = new WidgetClass();
		this.instance.element = this;
	}

	if (!this.instance) {
		throw new Error('Failed to set Widget value: type of widget is not defined');
	}

	this.instance.config = config;
	this.instance.populateWidget();
});

/**
 * Sync the config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function syncConfig() {
	return this.config;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function startEditor() {

	if (!this.instance) {
		throw new Error('Unable to start the editor: this widget element has no accompanying instance');
	}

	this.instance.startEditor();
	this.addEditEventListeners();
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.5
 */
Widget.setMethod(function stopEditor() {

	if (!this.instance) {
		throw new Error('Unable to stop the editor: this widget element has no accompanying instance');
	}

	this.unselectWidget();
	this.instance.stopEditor();
	this.removeEditEventListeners();
});

/**
 * Mouse click
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function onEditClick(e) {

	// Widgets can be nested, propagation needs to be stopped
	// or else only the top widget can be selected
	e.stopPropagation();

	this.selectWidget();
});

/**
 * Create the event listeners
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function addEditEventListeners() {

	if (this.add_edit_event_listeners === false) {
		return;
	}

	this.addEventListener('click', this.onEditClick);

});

/**
 * Remove the event listeners
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function removeEditEventListeners() {

	if (this.add_edit_event_listeners === false) {
		return;
	}

	this.removeEventListener('click', this.onEditClick);

});

/**
 * Get the config button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function getContextButton() {

	let button = document.querySelector('alchemy-widget-context');

	if (!button) {
		button = this.createElement('alchemy-widget-context');
		document.body.append(button);
	}

	return button;
});

/**
 * Show the config button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function showContextButton() {

	let button = this.getContextButton();

	button.moveToWidget(this);

	return button;
});

/**
 * Select this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function selectWidget() {
	this.classList.add('aw-selected');
	this.showContextButton();
});

/**
 * Unselect this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setMethod(function unselectWidget() {
	this.classList.remove('aw-selected');

	let button = this.getContextButton();

	if (button.active_widget == this) {
		button.unselectedWidget(this);
	}

});