/**
 * The Markdown HTML class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Markdown = Function.inherits('Alchemy.Widget', 'Markdown');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Markdown.constitute(function prepareSchema() {
	// The actual markdown contents
	this.schema.addField('markdown', 'Text');
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
Markdown.setMethod(function populateWidget() {

	populateWidget.super.call(this);

	let source = this.config.markdown || '';

	if (!source) {
		return;
	}

	let markdown = new Classes.Hawkejs.Markdown(source);

	let html = markdown.start();

	this.widget.innerHTML = html;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Markdown.setMethod(function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	let input = this.createElement('al-code-input');
	input.textContent = this.config.markdown || '';
	//area.value = this.config.markdown || '';

	this.widget.append(input);
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Markdown.setMethod(function _stopEditor() {

	Hawkejs.removeChildren(this.widget);

	this.populateWidget();
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Markdown.setMethod(function syncConfig() {

	let input = this.widget.querySelector('al-code-input, textarea');

	if (input) {
		this.config.markdown = input.value;
	}

	return this.config;
});
