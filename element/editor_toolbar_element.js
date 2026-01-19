/**
 * The al-editor-toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
let Toolbar = Function.inherits('Alchemy.Element.Widget.BaseToolbar', 'EditorToolbar');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setTemplateFile('widget/elements/al_editor_toolbar');

/**
 * The start-edit button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.addElementGetter('button_start', 'al-button.start-edit');

/**
 * The stop-edit button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.addElementGetter('button_stop', 'al-button.stop-edit');

/**
 * The stop-and-save button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.addElementGetter('button_stop_and_save', 'al-button.stop-and-save');

/**
 * The save-all button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.addElementGetter('button_save_all', 'al-button.save-all');

/**
 * Get the target widgets - only those matching the toolbar manager's document
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.setMethod(function getTargetWidgets() {

	let manager = this.toolbar_manager;

	if (!manager) {
		return [];
	}

	// Get the document from the manager
	let doc = manager.state?.document_watcher;

	if (!doc) {
		// No document set, return empty
		return [];
	}

	let doc_pk = doc.state?.pk;

	if (!doc_pk) {
		return [];
	}

	// Find all al-widgets elements and filter to those with matching record
	let all_widgets = document.querySelectorAll('al-widgets');
	let result = [];

	for (let widget of all_widgets) {
		if (widget.record && widget.record.$pk == doc_pk) {
			result.push(widget);
		}
	}

	return result;
});

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.3.0
 */
Toolbar.setMethod(async function introduced() {

	this.prepareToolbarManager(this.toolbar_manager);

	// Set up button event listeners
	if (this.button_start) {
		this.button_start.addEventListener('activate', async e => {
			this.startEditing();
		});
	}

	if (this.button_stop) {
		this.button_stop.addEventListener('activate', async e => {
			this.stopEditing();
		});
	}

	if (this.button_save_all) {
		this.button_save_all.addEventListener('activate', e => {
			this.saveAllAndUpdateButtonStates(false);
		});
	}

	if (this.button_stop_and_save) {
		this.button_stop_and_save.addEventListener('activate', async e => {
			let saved = await this.saveAllAndUpdateButtonStates(true);
			if (saved) {
				this.stopEditing();
			}
		});
	}

	// Handle new toolbar manager from server during client-side navigation
	hawkejs.scene.on('rendered', (variables, renderer) => {
		if (variables.toolbar_manager) {
			this.prepareToolbarManager(variables.toolbar_manager, this.toolbar_manager);
		}
	});

	// Handle navigation - stop editing when leaving the page
	hawkejs.scene.on('opening_url', (href, options) => {
		if (options?.history === false) {
			return;
		}
		this.stopEditing();
	});
});
