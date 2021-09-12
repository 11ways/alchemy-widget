/**
 * A field containing a single widget
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const WidgetField = Function.inherits('Alchemy.Field.Schema', function Widget(schema, name, options) {

	if (!options) {
		options = {};
	}

	if (!options.type) {
		options.type = 'text';
	}

	// A custom schema should NOT be passed to this class, this class uses
	// a fixed schema that should not be altered.
	// But because that's exactly what happens when cloning (like preparing
	// the data to be sent to Hawkejs) we have to allow it anyway
	if (!options.schema) {
		let WidgetClass = Classes.Alchemy.Widget.Widget.getMember(options.type),
		    sub_schema = WidgetClass.schema.clone();

		options.schema = sub_schema;
	}

	Widget.super.call(this, schema, name, options);
});

/**
 * Cast the given value to this field's type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}     value
 * @param    {Boolean}   to_datasource   Is this meant for the datasource?
 *
 * @return   {Mixed}
 */
WidgetField.setMethod(function cast(value, to_datasource) {

	// Ignore the type and directly store the config
	// (The type is a fixed field option)
	if (value && value.config && value.type) {
		value = value.config;
	}

	return value;
});