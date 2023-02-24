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

/**
 * Get the client-side options
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.2.3
 * @version  0.2.3
 *
 * @return   {Object}
 */
WidgetsField.setMethod(function getOptionsForDrying() {
	let {schema, ...options} = this.options;
	return options;
});

/**
 * See if the given value is considered not-empty for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Mixed}   value
 *
 * @return   {Boolean}
 */
WidgetsField.setMethod(function valueHasContent(value) {

	if (!value) {
		return false;
	}

	if (!value.widgets?.length) {
		return false;
	}

	return true;
});