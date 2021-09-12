/**
 * The Widget Text class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Text = Function.inherits('Alchemy.Widget', 'Text');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Text.constitute(function prepareSchema() {
	// The actual text contents
	this.schema.addField('content', 'Text');
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
Text.setMethod(function populateWidget() {

	populateWidget.super.call(this);

	let paragraph = this.createElement('p');
	paragraph.textContent = this.config.content || '';

	this.widget.append(paragraph);
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Text.setMethod(function _startEditor() {

	let child = this.widget.children[0];

	if (child) {
		child.setAttribute('contenteditable', true);
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Text.setMethod(function _stopEditor() {

	let child = this.widget.children[0];

	if (child) {
		child.removeAttribute('contenteditable');
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
Text.setMethod(function syncConfig() {

	let child = this.widget.children[0];

	if (child) {
		this.config.content = child.textContent;
	}

	return this.config;
});
