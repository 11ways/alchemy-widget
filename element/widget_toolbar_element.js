/**
 * The al-widget-toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
let Toolbar = Function.inherits('Alchemy.Element.Widget.BaseToolbar', 'WidgetToolbar');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setTemplateFile('widget/elements/al_widget_toolbar');

/**
 * The start-edit button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.addElementGetter('button_start', 'al-button.start-edit');

/**
 * The stop-edit button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.addElementGetter('button_stop', 'al-button.stop-edit');

/**
 * The stop-and-save button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.addElementGetter('button_stop_and_save', 'al-button.stop-and-save');

/**
 * The save-all button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.addElementGetter('button_save_all', 'al-button.save-all');

/**
 * Make sure the toolbar is visible
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Toolbar.setStatic(function show() {

	if (!alchemy.hasPermission('alchemy.widgets.toolbar')) {
		return;
	}

	let toolbar = document.querySelector('al-widget-toolbar');

	if (toolbar) {
		return;
	}

	// Don't show if an al-editor-toolbar exists (e.g., in Chimera)
	if (document.querySelector('al-editor-toolbar')) {
		return;
	}

	toolbar = hawkejs.createElement('al-widget-toolbar');

	hawkejs.scene.bottom_element.append(toolbar);
});

/**
 * Get all the root widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function getAllRootWidgets() {

	let elements = document.body.queryAllNotNested('al-widgets'),
	    result = [],
	    i;

	for (i = 0; i < elements.length; i++) {
		result.push(elements[i]);
	}

	elements = document.body.queryAllNotNested('al-widget');

	for (i = 0; i < elements.length; i++) {

		if (elements[i].is_root_widget) {
			result.push(elements[i]);
		}
	}

	return result;
});

/**
 * Get the target widgets (all root widgets for this toolbar)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.setMethod(function getTargetWidgets() {
	return this.getAllRootWidgets();
});

/**
 * Start editing all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Toolbar.setMethod(function startEditing() {
	Blast.editing = true;
	startEditing.super.call(this);
});

/**
 * Stop editing all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Toolbar.setMethod(function stopEditing() {

	if (!Blast.editing) {
		return;
	}

	Blast.editing = false;
	stopEditing.super.call(this);
});

/**
 * This element has been added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function introduced() {

	let set_manager_id = null;

	const setManager = (manager) => {

		if (set_manager_id) {
			clearTimeout(set_manager_id);
		}

		set_manager_id = setTimeout(() => {
			this.prepareToolbarManager(manager);
		}, 250);
	};

	if (this.toolbar_manager) {
		this.prepareToolbarManager(this.toolbar_manager);
	} else {
		let manager = hawkejs.scene.exposed.toolbar_manager;
		if (manager) {
			this.prepareToolbarManager(manager);
		}
	}

	this.button_start.addEventListener('activate', async e => {
		this.startEditing();
	});

	this.button_stop.addEventListener('activate', async e => {
		this.stopEditing();
	});

	this.button_save_all.addEventListener('activate', e => {
		this.saveAllAndUpdateButtonStates(false);
	});

	this.button_stop_and_save.addEventListener('activate', async e => {
		let saved = await this.saveAllAndUpdateButtonStates(true);

		if (saved) {
			this.stopEditing();
		}
	});

	hawkejs.scene.on('rendered', (variables, renderer) => {
		if (variables.toolbar_manager) {
			setManager(variables.toolbar_manager);
		}
	})

	hawkejs.scene.on('opening_url', (href, options) => {

		// Ignore segments & other renders
		if (options?.history === false) {
			return;
		}

		this.stopEditing();

		if (this.toolbar_manager) {
			this.toolbar_manager.queueClearDocumentWatcher(500);
		}
	});
});

/**
 * The element has been added to the dom
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function connected() {
	let html = document.querySelector('html');
	html.classList.add('with-al-widget-toolbar');
});

/**
 * The element has been removed from the dom
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function disconnected() {
	let html = document.querySelector('html');
	html.classList.remove('with-al-widget-toolbar');
});
