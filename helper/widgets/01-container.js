/**
 * The Widget Container class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Container = Function.inherits('Alchemy.Widget', 'Container');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Container.constitute(function prepareSchema() {

	let widgets = this.createSchema();

	widgets.addField('type', 'Enum', {values: alchemy.getClassGroup('widgets')});
	widgets.addField('config', 'Schema', {schema: 'type'});

	this.schema.addField('widgets', widgets, {array: true});
});
