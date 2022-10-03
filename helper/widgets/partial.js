/**
 * The Partial Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Object}   data
 */
const Partial = Function.inherits('Alchemy.Widget', 'Partial');

/**
 * Make this an abstract class
 */
Partial.makeAbstractClass();

/**
 * Get the type name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Partial.setStatic(function createClassTypeName() {
	return 'partial_' + this.name.underscore();
});

/**
 * Set the template to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Partial.setStatic(function setTemplateFile(name) {
	this.constitute(function _setTemplateFile() {
		this.template_file = name;
	});
});

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Partial.constitute(function prepareSchema() {

	this.schema.addField('view', 'String', {
		title       : 'Partial View',
		description : 'The actual HWK template to use for rendering this widget',
	});

	let contents = this.createSchema();

	contents.addField('name', 'String');
	contents.addField('content', 'Widgets');

	this.schema.addField('contents', contents, {array: true});
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {HTMLElement}   widget
 */
Partial.setMethod(async function populateWidget() {

	let view = this.constructor.template_file || this.config.view;

	if (view) {

		let options = {
			print : false,
		};

		let variables = {};

		await this.addVariablesForRender(variables);

		if (this.config?.contents?.length) {
			for (let entry of this.config.contents) {
				variables[entry.name] = entry.contents;
			}
		}

		variables.config = this.config;

		let placeholder = this.hawkejs_renderer.addSubtemplate(view, options, variables);

		// If the widget is already part of the DOM,
		// it's being edited and we need to manually kickstart the renderer
		if (Blast.isBrowser && document.body.contains(this.widget)) {
			await placeholder.getContent();
		}

		Hawkejs.removeChildren(this.widget);

		this.widget.append(placeholder);
	}

	populateWidget.super.call(this);
});

/**
 * Allow adding variables for rendering the partial
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.
 * @version  0.1.
 */
Partial.setMethod(function addVariablesForRender(variables) {
	// To be optionally implemented by child widgets
});

/**
 * Get all the sub widgets by their name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @return   {Object}
 */
Partial.setMethod(function getSubWidgets() {

	let elements = this.widget.queryAllNotNested('[data-section-name]'),
	    result = {};
	
	for (let element of elements) {
		result[element.dataset.sectionName] = element;
	}

	return result;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Partial.setMethod(function _startEditor() {

	let sub_widgets = this.getSubWidgets();

	for (let name in sub_widgets) {
		let sub_widget = sub_widgets[name];
		sub_widget.startEditor();
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Partial.setMethod(function _stopEditor() {

	let sub_widgets = this.getSubWidgets();

	for (let name in sub_widgets) {
		let sub_widget = sub_widgets[name];
		sub_widget.stopEditor();
	}

	this.populateWidget();
});

/**
 * Update the config values
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @return   {Object}
 */
Partial.setMethod(function syncConfig() {

	let sub_widgets = this.getSubWidgets(),
	    contents = this.config.contents;

	if (!contents) {
		contents = [];
		this.config.contents = contents;
	}

	for (let name in sub_widgets) {
		let sub_widget = sub_widgets[name];
		let widget_config = contents.findByPath('name', name);

		if (!widget_config) {
			widget_config = {
				name,
			};

			contents.push(widget_config);
		}

		widget_config.contents = sub_widget.value;
	}

	return this.config;
});