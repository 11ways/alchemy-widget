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

	// A custom schema should NOT be passed to this class, this class uses
	// a fixed schema that should not be altered.
	// But because that's exactly what happens when cloning (like preparing
	// the data to be sent to Hawkejs) we have to allow it anyway
	if (!options.schema) {
		options.schema = Classes.Alchemy.Widget.Container.schema.clone();
	}

	Widgets.super.call(this, schema, name, options);
});