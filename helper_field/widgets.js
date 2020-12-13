/**
 * A widgets field
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const WidgetsField = Function.inherits('Alchemy.Field.Schema', function Widgets(schema, name, options) {

	if (!options) {
		options = {};
	}

	options.schema = Classes.Alchemy.Widget.Container.schema.clone();

	Widgets.super.call(this, schema, name, options);
});