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
 * @version  0.2.7
 */
Markdown.setMethod(async function _startEditor() {

	Hawkejs.removeChildren(this.widget);

	if (this.use_toast) {
		this._startToastEditor();
	} else {
		this._startCodeEditor();
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.7
 */
Markdown.setMethod(function _stopEditor() {

	Hawkejs.removeChildren(this.widget);

	if (this.use_toast) {
		this._startToastEditor();
	}

	return this.loadWidget();
});

/**
 * Start the code editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Markdown.setMethod(async function _startCodeEditor() {

	let element = this.createElement('div');
	element.classList.add('markdown-editor-container');
	this.widget.append(element);

	let code_input = this.createElement('al-code-input');
	code_input.show_line_numbers = false;
	element.append(code_input);

	code_input.value = this.config.markdown || '';

	this.code_input = code_input;
});

/**
 * Start the toast editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Markdown.setMethod(async function _startToastEditor() {

	hawkejs.scene.enableStyle('https://uicdn.toast.com/editor/latest/toastui-editor.min.css');
	await hawkejs.require('https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js');

	const Editor = toastui.Editor

	let element = this.createElement('div');
	element.classList.add('markdown-editor-container');
	this.widget.append(element);

	const editor = new Editor({
		el                 : element,
		height             : '600px',
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
 * Stop the toast editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Markdown.setMethod(function _stopToastEditor() {

	if (this.toast_editor) {
		try {
			this.toast_editor.destroy();
		} catch (err) {}
	}

	this.toast_editor = null;
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.7
 *
 * @return   {Object}
 */
Markdown.setMethod(function syncConfig() {

	let value = '';

	if (this.toast_editor) {
		value = this.toast_editor.getMarkdown();
	} else if (this.code_input) {
		value = this.code_input.value;
	}

	this.config.markdown = value;

	return this.config;
});
