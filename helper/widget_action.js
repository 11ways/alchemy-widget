/**
 * The Widget Action class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {String}   name
 */
const Action = Function.inherits('Alchemy.Base', 'Alchemy.Widget', function Action(name, title) {

	// The name of this action
	this.name = name;

	// The title of this action
	this.title = title;

	// The handler of this action
	this.handler = null;

	// The test function
	this.tester = null;

	// The function to test if this button is already active
	this.selected_tester = null;

	// The icon to use for this action
	this.icon = null;

	// Close the actionbar after clicking?
	this.close_actionbar = false;
});

/**
 * Set the handler
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Function}   fnc
 */
Action.setMethod(function setHandler(fnc) {
	this.handler = fnc;
});

/**
 * Set the test function
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Function}   fnc
 */
Action.setMethod(function setTester(fnc) {
	this.tester = fnc;
});

/**
 * Set the selected test function
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Function}   fnc
 */
Action.setMethod(function setSelectedTester(fnc) {
	this.selected_tester = fnc;
});

/**
 * Set the icon
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   icon
 */
Action.setMethod(function setIcon(icon) {
	this.icon = icon;
});

/**
 * Apply the action to the given widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {HTMLElement}   widget
 */
Action.setMethod(function applyOnWidget(widget, actionbar) {

	if (!this.handler) {
		throw new Error('Failed to apply action "' + this.name + '" on widget, no handler found');
	}

	let instance = widget.instance,
	    handle = instance.getHandle();

	this.handler(widget, handle, actionbar);

	if (this.close_actionbar) {
		actionbar.close();
	}
});

/**
 * Can this action be used for the given widget?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 *
 * @return   {Boolean|Promise}
 */
Action.setMethod(function test(widget) {

	let result;

	if (this.tester) {
		result = this.tester(widget, widget.instance.getHandle());
	}

	if (result == null) {
		result = true;
	}

	return result;
});

/**
 * Get the icon HTML
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 *
 * @return   {HTMLElement|String}
 */
Action.setMethod(function getButtonContent() {

	let result;

	if (this.icon) {

		let icon = this.icon;

		if (typeof icon == 'string') {
			result = Blast.Classes.Hawkejs.Hawkejs.createElement('al-icon');
			result.setIcon(icon);
		} else if (icon.html) {
			result = Blast.Classes.Hawkejs.parseHTML(icon.html);
		}
	}

	if (!result) {
		result = this.name;
	}

	return result;
});

/**
 * Is this action already selected?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 *
 * @return   {Boolean}
 */
Action.setMethod(function isAlreadySelected(widget) {

	if (!this.selected_tester) {
		return false;
	}

	return this.selected_tester(widget, widget.instance.getHandle());
});