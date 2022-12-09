/**
 * The al-widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let Widget = Function.inherits('Alchemy.Element.Widget.Base', 'Widget');

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
 * The path to the value inside the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Widget.setAssignedProperty('value_path');

/**
 * The path to the field to filter on
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Widget.setAssignedProperty('filter_target');

/**
 * The filter value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Widget.setAssignedProperty('filter_value');

/**
 * CSS classes to put on the direct children
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Widget.setAttribute('child-class');

/**
 * A role to give to each child widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Widget.setAttribute('child-role');

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
 * @version  0.1.6
 */
Widget.setMethod(function onRecordAssignment(new_record, old_val) {
	if (new_record && this.field) {
		let value = this.getValueFromRecord(new_record);
		this.applyValue(value);
	}
});

/**
 * Received a new field name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.6
 */
Widget.setMethod(function onFieldAssignment(new_field, old_val) {
	if (new_field && this.record) {
		let value = this.getValueFromRecord(this.record);
		this.applyValue(value);
	}
});

/**
 * Get the values to work with from the given record
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Widget.setMethod(function getValueFromRecord(record) {

	if (!record) {
		return;
	}

	let value;

	if (this.field) {
		value = record[this.field];
	} else {
		value = record;
	}

	if (!value) {
		return;
	}

	if (this.filter_value) {
		if (!Array.isArray(value) || !this.filter_target) {
			return;
		}

		let inputs = value;
		value = [];

		for (let input of inputs) {
			if (input[this.filter_target] == this.filter_value) {
				value.push(input);
			}
		}
	}

	if (this.value_path) {
		if (!Array.isArray(value)) {
			return;
		}

		let inputs = value;
		value = [];

		for (let input of inputs) {
			if (input[this.value_path]) {
				value.push(input[this.value_path]);
			}
		}
	}

	if (Array.isArray(value)) {
		value = value[0];
	}

	return value;
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.6
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
	let promise = this.instance.populateWidget();

	if (promise) {
		this.delayAssemble(promise);
	}
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
 * @version  0.2.1
 */
Widget.setMethod(function startEditor() {

	this.assertWidgetInstance();

	this.instance.startEditor();
	this.addEditEventListeners();
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 */
Widget.setMethod(function stopEditor() {

	this.assertWidgetInstance();

	this.unselectWidget();
	this.instance.stopEditor();
	this.removeEditEventListeners();
});

/**
 * Make sure there is an instance
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Widget.setMethod(function assertWidgetInstance() {

	if (!this.instance) {
		console.error('Problem with widget element:', this);
		throw new Error('Unable to stop the editor: this ' + this.tagName + ' element has no accompanying instance');
	}

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
 * @version  0.2.0
 */
Widget.setMethod(function getContextButton() {

	let button = document.querySelector('al-widget-context');

	if (!button) {
		button = this.createElement('al-widget-context');
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