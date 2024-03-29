/**
 * The base widget element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let Base = Function.inherits('Alchemy.Element', 'Alchemy.Element.Widget', 'Base');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStylesheetFile('alchemy_widgets');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Base.setStatic('custom_element_prefix', 'al');

/**
 * Don't register this as a custom element
 * The `false` argument makes sure child classes don't also set this property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Base.makeAbstractClass();

/**
 * The Widget class instance belonging to this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Alchemy.Widget.Widget}
 */
Base.setAssignedProperty('instance');

/**
 * The container this widget is in
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.4
 */
Base.setProperty(function parent_container() {

	let container,
	    current = this.parentElement;
	
	while (current) {
		if (current.is_container) {
			container = current;
			break;
		}

		current = current.parentElement;
	}

	return container;
});

/**
 * The next container across container boundaries
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Base.setProperty(function next_container() {
	return this.getSiblingContainer('next');
});

/**
 * The previous container across container boundaries
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Base.setProperty(function previous_container() {
	return this.getSiblingContainer('previous');
});

/**
 * Is this the root element?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Base.setProperty(function is_root_widget() {
	return !this.parent_container;
});

/**
 * Can this widget be saved?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Base.setProperty(function can_be_saved() {

	if (!this.is_root_widget) {
		return false;
	}

	if (!this.record || !this.field) {
		return false;
	}

	return true;
});

/**
 * Can this widget be removed?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @type    {Boolean}
 */
Base.setProperty(function can_be_removed() {

	// Widgets without a "parent_instance" are mostly
	// hardcoded in some template (like in a Partial widget)
	if (!this.instance?.parent_instance) {
		return false;
	}

	return true;
});

/**
 * Can this widget be moved?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @type    {Boolean}
 */
Base.setProperty(function can_be_moved() {

	// Widgets without a "parent_instance" are mostly
	// hardcoded in some template (like in a Partial widget)
	if (!this.instance?.parent_instance) {
		return false;
	}

	return true;
});

/**
 * Get a sibling container
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Base.setMethod(function getSiblingContainer(type) {
	let property;

	if (type == 'next') {
		property = 'nextElementSibling';
	} else if (type == 'previous') {
		property = 'previousElementSibling';
	} else {
		return false;
	}

	if (!this[property] && !this.parent_container) {
		return;
	}

	let next = this[property];

	if (next) {
		if (next.is_container) {
			return next;
		}

		if (next.tagName != 'AL-WIDGET-ADD-AREA') {
			return false;
		}
	}

	next = this.parent_container[property];

	if (next && next.is_container) {
		return next;
	}

	return false;
});

/**
 * Look for a context variable
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setMethod(function getContextVariable(name) {

	let current = this,
	    result;

	// First try looking through the parentElement chain
	while (current) {
		if (current.context_variables) {
			result = current.context_variables[name];

			if (result != null) {
				break;
			}
		}

		current = current.parentElement;
	}

	if (result != null) {
		return result;
	}

	current = this;

	// Now try through the parent_instance way
	while (current) {

		if (current.context_variables) {
			result = current.context_variables[name];

			if (result != null) {
				break;
			}
		}

		if (!current.instance) {
			current = current.parentElement;
			continue;
		}

		current = current.instance.parent_instance;

		if (current) {
			current = current.widget;
		}
	}

	return result;
});

/**
 * Rerender the contents
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setMethod(function rerender() {
	if (this.instance) {
		return this.instance.rerender();
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 */
Base.setMethod(function introduced() {

	if (this.hasAttribute('editing')) {
		this.startEditor();
	}

	this.addEventListener('click', e => {

		let is_editing = this.instance?.editing;

		if (is_editing) {
			let anchor = e.target.closest('a');

			if (anchor) {
				e.preventDefault();
			}
		}
	});
});

/**
 * Get the configuration used to save data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.6
 */
Base.setMethod(function gatherSaveData() {

	if (!this.is_root_widget) {
		return;
	}

	if (!this.record || !this.field) {
		return;
	}

	let result = {
		model : this.record.$model_name,
		pk    : this.record.$pk,
		field : this.field,
		value : this.value,
		filter_target   : this.filter_target,
		filter_value    : this.filter_value,
		value_path      : this.value_path,
		field_languages : this.record.$hold.translated_fields,
	};

	return result;
});

/**
 * Save the current configuration
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 */
Base.setMethod(async function save() {

	let data = this.gatherSaveData();
	
	if (!data) {
		return;
	}

	let config = {
		href : alchemy.routeUrl('AlchemyWidgets#save'),
		post : {
			widgets: [data]
		}
	};

	let result = await alchemy.fetch(config);
});

/**
 * Copy this widget's configuration to the clipboard
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.5
 */
Base.setMethod(async function copyConfigToClipboard() {

	let value = this.value;
	
	if (!value) {
		return;
	}

	value._altype = 'widget';

	if (this.type) {
		value.type = this.type;
	}

	let dried = JSON.dry(value, null, '\t');

	try {
		await navigator.clipboard.writeText(dried);
	} catch (err) {
		console.error('Failed to copy:', err);
	}

	localStorage._copied_widget_config = dried;
});

/**
 * Get any current configuration from the clipboard
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.5
 */
Base.setMethod(async function getConfigFromClipboard() {

	let result;

	try {
		result = await navigator.clipboard.readText();
	} catch (err) {

		if (!localStorage._copied_widget_config) {
			return false;
		} else {
			result = localStorage._copied_widget_config;
		}
	}

	if (result) {
		result = result.trim();
	}

	if (!result || result[0] != '{') {
		return false;
	}

	try {
		result = JSON.undry(result);
	} catch (err) {
		return false;
	}

	if (result._altype != 'widget') {
		return false;
	}

	return result;
});

/**
 * Get configuration from the clipboard and return it if it's valid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
Base.setMethod(async function getReplaceableConfigFromClipboard() {

	let result = await this.getConfigFromClipboard();

	if (result.type == this.type) {
		return result;
	}

	if (result.type == 'container') {
		return false;
	}

	if (!this.can_be_removed) {
		return false;
	}

	let parent_widget = this.parent_container;

	if (!parent_widget || !parent_widget.editing || !parent_widget.addWidget) {
		return false;
	}

	return result;
});

/**
 * Read the configuration from the clipboard & apply
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.5
 */
Base.setMethod(async function pasteConfigFromClipboard() {

	let result = await this.getReplaceableConfigFromClipboard();

	if (result) {
		this.replaceWithConfig(config);
	}
});

/**
 * Apply the given config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.5
 */
Base.setMethod(async function replaceWithConfig(config) {

	if (!config?.type) {
		throw new Error('Unable to replace, config type is empty');
	}

	if (this.type == config.type) {
		this.value = config;
		return true;
	}

	let parent_widget = this.parent_container;

	// If this isn't in an editable widget, it can't be replaced.
	// (Might be a hard-coded widget type)
	if (!parent_widget || !parent_widget.editing || !parent_widget.addWidget) {
		return false;
	}

	let new_widget = parent_widget.addWidget(config.type, config.config);

	if (new_widget) {
		this.replaceWith(new_widget);
	}
});