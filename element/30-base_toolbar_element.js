const PREPARED = Symbol('prepared');

/**
 * The base toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
let Toolbar = Function.inherits('Alchemy.Element.Form.Stateful', 'Alchemy.Element.Widget', 'BaseToolbar');

/**
 * Don't register this as a custom element
 * The `false` argument makes sure child classes don't also set this property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.makeAbstractClass();

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setStatic('custom_element_prefix', 'al');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setStylesheetFile('alchemy_widgets');

/**
 * The toolbar manager
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setAssignedProperty('toolbar_manager');

/**
 * The optional watchers element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.addElementGetter('watchers_element', '.watchers');

/**
 * A new toolbar manager was assigned
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setMethod(function onToolbarManagerAssignment(manager, old_manager) {
	if (manager != old_manager) {
		this.prepareToolbarManager(manager, old_manager);
	}
});

/**
 * Prepare the toolbar manager
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.8
 */
Toolbar.setMethod(function prepareToolbarManager(manager, old_manager) {

	if (this.toolbar_manager != manager) {
		this.toolbar_manager = manager;
	}

	if (manager && manager[PREPARED]) {
		return;
	}

	if (manager) {
		manager[PREPARED] = true;
	}

	if (old_manager) {
		old_manager.release();
	}

	if (!manager) {
		return;
	}

	let clear_counts = {};

	manager.watchProperty('document_watcher', watcher => {
		this.attachDocumentWatcher(watcher);
	});

	let elements = this.querySelectorAll('[data-toolbar]');

	for (let i = 0; i < elements.length; i++) {
		let element = elements[i],
		    name = element.dataset.toolbar;
		
		if (name) {
			manager.watchProperty(name, value => {
				element.textContent = value;
			});
		}
	}

	manager.watchQueue('render_template', (area, template, variables) => {

		let current_clear_count = clear_counts[area];

		let area_element = this.getAreaElement(area);

		if (area_element) {
			let renderer = hawkejs.renderToElements(template, variables, (err, elements) => {

				if (current_clear_count != clear_counts[area]) {
					// The area has been cleared in the meantime
					return;
				}

				if (err) {
					console.error('Error rendering template', err);
					return;
				}

				for (let i = 0; i < elements.length; i++) {
					area_element.appendChild(elements[i]);
				}

				hawkejs.scene.handleRendererScripts(renderer);
				hawkejs.scene.handleRendererStyles(renderer);
			});
		}
	});

	manager.watchQueue('clear_area', area => {

		if (!clear_counts[area]) {
			clear_counts[area] = 0;
		}
		
		let area_element = this.getAreaElement(area);

		clear_counts[area]++;

		if (area_element) {
			area_element.innerHTML = '';
		}
	});

});

/**
 * Attach to the given watcher
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setMethod(function attachDocumentWatcher(watcher) {

	let old_watcher = this.current_watcher;
	let watchers_element = this.watchers_element;
	this.current_watcher = watcher;

	if (old_watcher && old_watcher != watcher) {
		old_watcher.release();
	}

	if (watchers_element) {
		if (watcher) {

			watcher.watchProperty('viewers', async (viewers) => {

				let users = [];

				if (viewers) {
					let viewer,
					    i;

					for (i = 0; i < viewers.length; i++) {
						viewer = viewers[i];

						if (!viewer.info) {
							// The info isn't always set due to race conditions
							viewer.info = await watcher.getUserInfo(viewer.user_id);
						}

						users.push(viewer.info);
					}
				}

				watchers_element.setUsers(users);
			});
		} else {
			watchers_element.clear();
		}
	}

	if (!watcher) {
		return;
	}
});

/**
 * Get an area element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setMethod(function getAreaElement(area) {

	if (!area) {
		return;
	}

	return this.querySelector('[data-area="' + area + '"]');
});

/**
 * Get the widget containers to edit.
 * Child classes should override this.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @returns  {Array}   Array of widget elements
 */
Toolbar.setMethod(function getTargetWidgets() {
	return [];
});

/**
 * Start editing the target widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.setMethod(function startEditing() {

	let elements = this.getTargetWidgets();

	if (!elements.length) {
		return;
	}

	document.body.classList.add('editing-blocks');

	for (let element of elements) {
		element.startEditor();
	}

	this.setState('editing');
});

/**
 * Stop editing the target widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.setMethod(function stopEditing() {

	let elements = this.getTargetWidgets();

	document.body.classList.remove('editing-blocks');

	for (let element of elements) {
		element.stopEditor();
	}

	this.setState('ready');
});

/**
 * Save all the target widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Toolbar.setMethod(async function saveAll() {

	if (this._saving) {
		try {
			await this._saving;
		} catch (err) {
			// Ignore
		}
	}

	this._saving = null;

	let elements = this.getTargetWidgets();
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
			href: alchemy.routeUrl('AlchemyWidgets#save'),
			post: {
				widgets: widget_data
			}
		};

		pledge = alchemy.fetch(config);
		this._saving = pledge;
	}

	return pledge;
});

/**
 * Save all and update button states
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {Boolean}   before_stop   Whether this is before stopping editing
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

	if (!button) {
		// No button available, just save
		return this.saveAll();
	}

	this.setState(state);
	button.setState(state);

	let save_error = null;

	let restore_toolbar_state = this.wrapForCurrentState(() => {
		if (save_error) {
			this.setState('error');
		} else {
			this.setState('editing');
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
