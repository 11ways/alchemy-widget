/**
 * The Widget Header class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Header = Function.inherits('Alchemy.Widget', 'Header');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.constitute(function prepareSchema() {

	// The header level (1 - 6)
	this.schema.addField('level', 'Number');

	// The actual HTML contents of the header
	this.schema.addField('content', 'Html');

});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.setMethod(function populateWidget(widget) {

	let level = this.config.level || 1;

	let header = this.createElement('h' + level);
	header.innerHTML = this.config.content || 'header level ' + level;

	this.widget.append(header);
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.setMethod(function _startEditor() {

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
Header.setMethod(function _stopEditor() {

	let child = this.widget.children[0];

	if (child) {
		child.removeAttribute('contenteditable');
	}
});