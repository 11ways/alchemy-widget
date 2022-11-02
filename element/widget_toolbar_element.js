/**
 * The al-widget-toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
let Toolbar = Function.inherits('Alchemy.Element.Form.Stateful', 'Alchemy.Element.Widget', 'WidgetToolbar');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setStylesheetFile('alchemy_widgets');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setStatic('custom_element_prefix', 'al');

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
 * @version  0.2.0
 */
Toolbar.setStatic(function show() {

	if (!alchemy.hasPermission('alchemy.widgets.toolbar')) {
		return;
	}

	let toolbar = document.querySelector('al-widget-toolbar');

	if (toolbar) {
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
 * Start editing all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function startEditing() {

	let i;

	Blast.editing = true;
	document.body.classList.add('editing-blocks');

	let elements = this.getAllRootWidgets();

	for (i = 0; i < elements.length; i++) {
		elements[i].startEditor();
	}

	this.setState('editing');
});

/**
 * Stop editing all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function stopEditing() {

	if (!Blast.editing) {
		return;
	}

	let i;

	Blast.editing = false;
	document.body.classList.remove('editing-blocks');

	let elements = this.getAllRootWidgets();

	for (i = 0; i < elements.length; i++) {
		elements[i].stopEditor();
	}

	this.setState('ready');
});

/**
 * Save all the widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(async function saveAll() {

	if (this._saving) {
		try {
			await this._saving;
		} catch (err) {
			// Ignore;
		}
	}

	this._saving = null;

	let elements = this.getAllRootWidgets();
	let widget_data = [];
	let pledge;

	for (let element of elements) {
		let entry = element.gatherSaveData();

		if (entry) {
			widget_data.push(entry);
		}
	}

	if (widget_data.length) {
		let config = {
			href : alchemy.routeUrl('AlchemyWidgets#save'),
			post : {
				widgets: widget_data
			}
		};

		pledge = alchemy.fetch(config);
		this._saving = pledge;
	}

	return pledge;
});

/**
 * Save all and update the states
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Boolean}   before_stop
 */
Toolbar.setMethod(async function saveAllAndUpdateButtonStates(before_stop) {

	let state = 'saving',
	    button;

	if (before_stop) {
		button = this.button_stop_and_save;
		state += '-before-stop';
	} else {
		button = this.button_save_all;
	}

	this.setState(state);
	button.setState(state);

	let save_error = null;

	let restore_toolbar_state = this.wrapForCurrentState(() => {
		if (save_error) {
			this.setState('error');
		} else {
			this.setState('editing')
		}
	});

	let restore_button_state = button.wrapForCurrentState(() => {

		if (save_error) {
			button.setState('error');
		} else {
			button.setState('saved', 2500, 'ready');
		}
	});

	try {
		await this.saveAll();
	} catch (err) {
		save_error = err;
	}

	restore_toolbar_state();
	restore_button_state();

	if (save_error) {
		return false;
	}

	return true;
});

/**
 * This element has been added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Toolbar.setMethod(function introduced() {

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

	hawkejs.scene.on('opening_url', e => {
		this.stopEditing();
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