/**
 * The Markdown HTML class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Markdown = Function.inherits('Alchemy.Widget', 'Markdown');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Markdown.constitute(function prepareSchema() {
	// The actual markdown contents
	this.schema.addField('markdown', 'Text');
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 *
 * @param    {HTMLElement}   widget
 */
Markdown.setMethod(function populateWidget() {

	let source = this.config.markdown || '';

	if (!source) {
		return;
	}

	let markdown = new Classes.Hawkejs.Markdown(source);

	let html = markdown.start();

	this.widget.innerHTML = html;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.6
 */
Markdown.setMethod(async function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	hawkejs.scene.enableStyle('https://uicdn.toast.com/editor/latest/toastui-editor.min.css');
	await hawkejs.require('https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js');

	const Editor = toastui.Editor

	let element = this.createElement('div');
	element.classList.add('markdown-editor-container');
	this.widget.append(element);

	const editor = new Editor({
		el                 : element,
		height             : '900px',
		initialEditType    : 'markdown',
		previewStyle       : 'vertical',
		usageStatistics    : false,
		autofocus          : false,
		previewStyle       : 'global',
		hideModeSwitch     : true,
		initialEditType    : 'markdown',
	});

	this.toast_editor = editor;
	editor.setMarkdown(this.config.markdown || '');
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.6
 */
Markdown.setMethod(function _stopEditor() {

	Hawkejs.removeChildren(this.widget);

	if (this.toast_editor) {
		try {
			this.toast_editor.destroy();
		} catch (err) {}
	}

	this.toast_editor = null;

	return this.loadWidget();
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.6
 *
 * @return   {Object}
 */
Markdown.setMethod(function syncConfig() {

	let value = '';

	if (this.toast_editor) {
		value = this.toast_editor.getMarkdown();
	}

	this.config.markdown = value;

	return this.config;
});
