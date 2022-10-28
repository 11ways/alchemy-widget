/**
 * The Field Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const AlchemyField = Function.inherits('Alchemy.Widget', 'AlchemyField');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.12
 */
AlchemyField.constitute(function prepareSchema() {

	this.setAddChecker(function(widget_element) {
		return false;
	});
});

/**
 * Find the al-form parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.2.0
 */
AlchemyField.enforceProperty(function alchemy_form(new_value) {

	if (!new_value && this.config && this.config.alchemy_form) {
		new_value = this.config.alchemy_form;
	}

	if (!new_value) {

		let parent = this.parent_instance;
		
		while (parent) {

			new_value = parent.alchemy_form;

			if (new_value) {
				break;
			}

			if (parent.element) {
				new_value = parent.element.querySelector('al-form');

				if (new_value) {
					break;
				}
			}
			
			parent = parent.parent_instance;
		}
	}

	return new_value;
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AlchemyField.setMethod(function populateWidget() {

	let config = this.config;

	let alchemy_form = this.alchemy_form;

	let field_el = this.createElement('al-field');

	if (alchemy_form) {
		field_el.alchemy_form = alchemy_form;
	}

	field_el.field_name = config.field;

	field_el.applyOptions(config);

	this.element.append(field_el);
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
AlchemyField.setMethod(function syncConfig() {

	let config = this.config;

	if (!config) {
		config = this.config = {};
	}

	return this.config;
});