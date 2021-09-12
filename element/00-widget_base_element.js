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
Base.setStylesheetFile('alchemy-widgets');

/**
 * Don't register this as a custom element
 * The `false` argument makes sure child classes don't also set this property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic('is_abstract_class', true, false);

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
 * @version  0.1.0
 */
Base.setProperty('parent_container');

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
 * @version  0.1.0
 */
Base.setMethod(function introduced() {

	if (this.hasAttribute('editing')) {
		this.startEditor();
	}

});