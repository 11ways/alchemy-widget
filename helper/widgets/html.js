const EDITOR = Symbol('editor');

/**
 * The Widget HTML class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Html = Function.inherits('Alchemy.Widget', 'Html');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Html.constitute(function prepareSchema() {
	// The actual HTML contents
	this.schema.addField('html', 'Html');
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Html.setMethod(async function _startEditor() {

	if (this[EDITOR]) {
		this[EDITOR].destroy();
	}

	let ckeditor_path = hawkejs.scene.exposed.ckeditor_path;

	if (!ckeditor_path) {
		return;
	}

	await hawkejs.require(ckeditor_path);

	const options = {
		toolbar: hawkejs.scene.exposed.ckeditor_toolbar,
		updateSourceElementOnDestroy: true,
		simpleUpload: {
			uploadUrl: '/api/block/upload',
			withCredentials: true,
		},
	};

	let editor = await InlineEditor.create(this.widget, options);
	this[EDITOR] = editor;
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Html.setMethod(function _stopEditor() {
	if (this[EDITOR]) {
		this[EDITOR].destroy();
		this[EDITOR] = null;
	}
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
Html.setMethod(function populateWidget() {
	this.widget.innerHTML = this.config.html;
	populateWidget.super.call(this);
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
Html.setMethod(function syncConfig() {

	this.config.html = this.widget.innerHTML;

	return this.config;
});
