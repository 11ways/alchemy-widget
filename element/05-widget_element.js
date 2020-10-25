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
 * Is this widget being edited?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Widget.setProperty(function editing() {
	return this.instance.editing;
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
 * @version  0.1.0
 */
Widget.setMethod(function stopEditor() {

	if (!this.instance) {
		throw new Error('Unable to stop the editor: this widget element has no accompanying instance');
	}

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