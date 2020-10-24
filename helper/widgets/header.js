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