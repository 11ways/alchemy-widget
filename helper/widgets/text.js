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

// Widget metadata
Text.setCategory('text');
Text.setIcon('align-left');

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
 * @version  0.2.1
 *
 * @param    {HTMLElement}   widget
 */
Text.setMethod(function populateWidget() {

	let tag_name;

	if (this.widget.dataset.textElementTag) {
		tag_name = this.widget.dataset.textElementTag;
	}

	if (!tag_name) {
		tag_name = 'p';
	}

	let text_element = this.createElement(tag_name);
	text_element.textContent = this.config.content || '';

	this.widget.append(text_element);
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 */
Text.setMethod(function _startEditor() {

	let child,
	    i;

	for (i = 0; i < this.widget.children.length; i++) {
		child = this.widget.children[i];

		child.setAttribute('contenteditable', true);
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 */
Text.setMethod(function _stopEditor() {

	let child,
	    i;

	for (i = 0; i < this.widget.children.length; i++) {
		child = this.widget.children[i];

		child.removeAttribute('contenteditable');
	}
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 *
 * @return   {Object}
 */
Text.setMethod(function syncConfig() {

	this.config.content = this.widget?.textContent;

	return this.config;
});
