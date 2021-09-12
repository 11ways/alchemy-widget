/**
 * The Widget Header class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Header = Function.inherits('Alchemy.Widget', 'Header');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.constitute(function prepareSchema() {

	// The header level (1 - 6)
	this.schema.addField('level', 'Number');

	// The actual HTML contents of the header
	this.schema.addField('content', 'Html');

});

/**
 * Add header actions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.constitute(function addActions() {

	let levels = [1, 2, 3, 4, 5, 6],
	    query = 'h1, h2, h3, h4, h5, h6';

	for (let level of levels) {
		let level_action = this.createAction('make-level-' + level, 'Level ' + level);

		level_action.setHandler(function setLevelAction(widget, toolbar) {

			let content = widget.querySelector(query);

			if (content) {
				widget.instance.config.content = content.innerHTML;
			}

			widget.instance.config.level = level;
			widget.instance.rerender();

			// Rerender the toolbar
			toolbar.showWidgetActions(widget);
		});

		level_action.setIcon({html: '<span class="aw-header-h">H</span><span class="aw-header-level">' + level + '</span>'});

		level_action.setSelectedTester(function testSelected(widget) {

			let content = widget.querySelector(query);

			if (!content) {
				return;
			}

			return content.tagName == 'H' + level;
		});
	}
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Header.setMethod(function syncConfig() {

	let header = this.widget.children[0],
	    content = '',
	    level = 1;

	if (header) {
		content = header.innerHTML;
		level = parseInt(header.tagName[1]);
	}

	this.config.level = level;
	this.config.content = content;

	return this.config;
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
Header.setMethod(function populateWidget() {

	let level = this.config.level || 1;

	let header = this.createElement('h' + level);
	header.innerHTML = this.config.content || 'header level ' + level;

	this.widget.append(header);

	populateWidget.super.call(this);
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.setMethod(function _startEditor() {

	let child = this.widget.children[0];

	if (child) {
		child.setAttribute('contenteditable', true);
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Header.setMethod(function _stopEditor() {

	let child = this.widget.children[0];

	if (child) {
		child.removeAttribute('contenteditable');
	}
});