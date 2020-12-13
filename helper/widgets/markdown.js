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
 * @version  0.1.0
 */
Markdown.setMethod(function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	let area = this.createElement('textarea');
	area.value = this.config.markdown || '';

	this.widget.append(area);
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
 * @version  0.1.0
 *
 * @return   {Object}
 */
Markdown.setMethod(function syncConfig() {

	let area = this.widget.querySelector('textarea');

	if (area) {
		this.config.markdown = area.value;
	}

	return this.config;
});
