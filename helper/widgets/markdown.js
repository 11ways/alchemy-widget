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
 * @version  0.2.1
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
 * @version  0.2.0
 */
Markdown.setMethod(async function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	hawkejs.scene.enableStyle('https://unpkg.com/easymde/dist/easymde.min.css');
	await hawkejs.require('https://unpkg.com/easymde/dist/easymde.min.js');

	let element = this.createElement('textarea');
	this.widget.append(element);
	element.value = this.config.markdown || '';

	const easyMDE = new EasyMDE({element});
	this.easy_mde = easyMDE;
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
	this.easy_mde = null;

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

	let value = '';

	if (this.easy_mde) {
		value = this.easy_mde.value();
	}

	this.config.markdown = value;

	return this.config;
});
