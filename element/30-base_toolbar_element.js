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
 * @version  0.2.7
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
			hawkejs.renderToElements(template, variables, (err, elements) => {

				if (current_clear_count != clear_counts[area]) {
					// The area has been cleared in the meantime
					return;
				}

				if (err) {
					console.error('Error rendering template', err);
					return;
				}

				area_element.append(...elements);
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
