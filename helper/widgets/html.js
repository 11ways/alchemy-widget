
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

// Widget metadata
Html.setCategory('advanced');
Html.setIcon('code');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.5
 */
Html.constitute(function prepareSchema() {
	// The actual HTML contents
	this.schema.addField('html', 'Html', {
		title                  : 'HTML',
		description            : 'The HTML sourcecode',
		widget_config_editable : true,
	});
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Html.setMethod(async function _startEditor() {

	if (this.ckeditor) {
		this.ckeditor.destroy();
	}

	let ckeditor_path = hawkejs.scene.exposed.ckeditor_path;

	if (!ckeditor_path) {
		return;
	}

	await hawkejs.require(ckeditor_path);

	const options = {
		toolbar: hawkejs.scene.exposed.ckeditor_toolbar,
		updateSourceElementOnDestroy: true,
		removePlugins: ['Markdown'],
		simpleUpload: {
			uploadUrl: alchemy.routeUrl('AlchemyWidgets#uploadImage'),
			withCredentials: true,
		},
	};

	let editor = await InlineEditor.create(this.widget, options);

	this.ckeditor = editor;
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Html.setMethod(function _stopEditor() {
	if (this.ckeditor) {
		this.ckeditor.destroy();
		this.ckeditor = null;
	}
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.5
 *
 * @param    {HTMLElement}   widget
 */
Html.setMethod(function populateWidget() {

	let html = this.config.html;

	if (html == null) {
		html = '';
	}

	if (this.ckeditor) {
		
		this.ckeditor.setData(html);
	} else {
		this.widget.innerHTML = html;
	}
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
