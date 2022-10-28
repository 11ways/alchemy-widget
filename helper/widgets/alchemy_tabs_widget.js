/**
 * The Widget Tabs class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Object}   data
 */
const Tabs = Function.inherits('Alchemy.Widget', 'AlchemyTabs');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Tabs.constitute(function prepareSchema() {

	let tab_entry = alchemy.createSchema();

	tab_entry.addField('name', 'String', {
		title                  : 'Tab Name',
		description            : 'Used as the Tab\'s ID',
		widget_config_editable : true,
	});

	tab_entry.addField('title', 'String', {
		title                  : 'Tab Title',
		description            : 'Used in the navigation menu',
		widget_config_editable : true,
	});

	tab_entry.addField('icon', 'String', {
		title                  : 'Tab Icon',
		description            : 'Optional icon to use in the navigation menu',
		widget_config_editable : true,
	});

	tab_entry.addField('contents', 'Widgets', {
		widget_config_editable : false,
	});

	this.schema.addField('tabs', tab_entry, {
		widget_config_editable : true,
		array: true,
	});
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Tabs.setMethod(function syncConfig() {

	const config = this.config || {},
	      tabs = config.tabs || [],
		  widgets = this.getSubWidgets();
	
	for (let tab_config of tabs) {

		if (!tab_config.name) {
			continue;
		}

		let widget = widgets[tab_config.name];

		tab_config.contents = widget?.value;
	}

	return this.config;
});


/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {HTMLElement}   widget
 */
Tabs.setMethod(function populateWidget() {

	const config = this.config || {},
	      tabs = config.tabs || [];
	
	let wrapper = this.createElement('al-tab-context'),
	    tablist = this.createElement('al-tab-list');
	
	wrapper.append(tablist);

	for (let tab_config of tabs) {

		if (!tab_config?.name) {
			continue;
		}

		let tab_button = this.createElement('al-tab-button');
		tab_button.tab_name = tab_config.name;
		tab_button.id = 'tab-' + tab_config.name;

		if (tab_config.icon) {
			let ico = this.createElement('al-icon');
			ico.icon_name = tab_config.icon;
			tab_button.append(ico);
		}

		let span = this.createElement('span');
		span.textContent = tab_config.title;
		tab_button.append(span);

		tablist.append(tab_button);

		let tab_content = this.createElement('al-tab-panel');
		tab_content.tab_name = tab_config.name;
		wrapper.append(tab_content);

		let widgets = this.createElement('al-widgets');
		widgets.value = tab_config.contents;
		widgets.setAttribute('data-tab-name', tab_config.name);

		tab_content.append(widgets);
	}

	Hawkejs.replaceChildren(this.widget, wrapper);

	return populateWidget.super.call(this);
});

/**
 * Get all the sub widgets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Tabs.setMethod(function getSubWidgets() {

	let elements = this.widget.queryAllNotNested('al-widgets[data-tab-name]'),
	    result = {};
	
	for (let element of elements) {
		result[element.dataset.tabName] = element;
	}

	return result;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Tabs.setMethod(function _startEditor() {

	let sub_widgets = this.getSubWidgets();

	for (let name in sub_widgets) {
		let sub_widget = sub_widgets[name];
		sub_widget.startEditor();
	}
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Tabs.setMethod(function _stopEditor() {

	let sub_widgets = this.getSubWidgets();

	for (let name in sub_widgets) {
		let sub_widget = sub_widgets[name];
		sub_widget.stopEditor();
	}

	this.populateWidget();
});
