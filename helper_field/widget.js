/**
 * A field containing a single widget
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.6
 */
const WidgetField = Function.inherits('Alchemy.Field.Schema', function Widget(schema, name, options) {

	if (!options) {
		options = {};
	}

	if (!options.type) {
		options.type = 'text';
	}

	// Already set the options (they'll be changed by the super call too though)
	this.options = options;

	// A custom schema should NOT be passed to this class, this class uses
	// a fixed schema that should not be altered.
	// But because that's exactly what happens when cloning (like preparing
	// the data to be sent to Hawkejs) we have to allow it anyway
	if (!options.schema) {
		let WidgetClass = this.widget_class,
		    sub_schema = WidgetClass.schema.clone();

		options.schema = sub_schema;
	}

	Widget.super.call(this, schema, name, options);
});

/**
 * Get the constructor of the widget class
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @type   {Function}
 */
WidgetField.setProperty(function widget_class() {

	if (!this.options?.type) {
		return;
	}

	return Classes.Alchemy.Widget.Widget.getMember(this.options.type)
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

/**
 * Convert to JSON
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.3
 * @version  0.2.3
 *
 * @return   {Object}
 */
WidgetField.setMethod(function toDry() {

	let {schema, ...options} = this.options;

	let value = {
		schema  : this.schema,
		name    : this.name,
		options : options,
	};

	return {value};
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
WidgetField.setMethod(function valueHasContent(value) {

	if (!value) {
		return false;
	}

	let constructor = this.widget_class;

	if (!constructor) {
		return true;
	}

	value = this.cast(value);

	let instance = new constructor();

	return instance.valueHasContent(value);
});