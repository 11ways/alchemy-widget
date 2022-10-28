/**
 * The Table Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const AlchemyTable = Function.inherits('Alchemy.Widget', 'AlchemyTable');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 */
AlchemyTable.constitute(function prepareSchema() {

	this.setAddChecker(function(widget_element) {
		return false;
	});
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AlchemyTable.setMethod(function populateWidget() {

	let table = this.createElement('al-table'),
	    config = this.config;

	if (config.id) {
		table.id = config.id;
	}

	// Always enable the actions?
	table.has_actions = true;

	if (config.fieldset) {
		table.fieldset = config.fieldset;
	}

	if (config.page_size) {
		table.page_size = config.page_size;
	}

	if (config.show_filters) {
		table.show_filters = config.show_filters;
	}

	if (config.recordsource) {
		table.recordsource = config.recordsource;
	}

	if (config.use_url_pagination) {
		table.use_url_pagination = config.use_url_pagination;
	}

	table.purpose = config.purpose || 'view';
	table.mode = config.mode || 'inline';

	this.element.append(table);
});
