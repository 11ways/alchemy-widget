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
 * @author   Jelle De Loecker <jelle@develry.be>
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
Base.setAssignedProperty('widget');