/**
 * The Sourcecode Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Sourcecode = Function.inherits('Alchemy.Widget', 'Sourcecode');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Sourcecode.constitute(function prepareSchema() {
	// The actual sourcecode contents
	this.schema.addField('sourcecode', 'Text');
});

/**
 * The name of the source field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Sourcecode.setProperty('sourcecode_field', 'sourcecode');

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 *
 * @param    {HTMLElement}   widget
 */
Sourcecode.setMethod(function populateWidget() {

	let source = this.config[this.sourcecode_field] || '';

	if (!source) {
		return;
	}

	let code = this.createElement('code'),
	    pre = this.createElement('pre');

	pre.append(code);
	code.innerText = source;

	this.widget.append(pre);
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Sourcecode.setMethod(function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	let input = this.createElement('al-code-input');
	input.textContent = this.config[this.sourcecode_field] || '';

	this.widget.append(input);
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Sourcecode.setMethod(function _stopEditor() {

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
Sourcecode.setMethod(function syncConfig() {

	let input = this.widget.querySelector('al-code-input, textarea');

	if (input) {
		this.config[this.sourcecode_field] = input.value;
	}

	return this.config;
});
