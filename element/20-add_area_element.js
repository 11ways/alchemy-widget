/**
 * The al-widgets element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
let AddArea = Function.inherits('Alchemy.Element.Widget.Base', function WidgetAddArea() {
	WidgetAddArea.super.call(this);

	this.innerHTML = `
<div class="main-button">
	<button class="add-button widget-button" title="Add"><al-icon icon-name="plus"></al-icon></button>
	<button class="menu-button widget-button" title="Menu"><al-icon icon-name="grid"></al-icon></button>
</div>
<div class="widget-types">
	TYPES
</div>
`;
});

/**
 * Show the types to add
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AddArea.setMethod(function showTypes(event) {

	let that = this;

	let context_button = document.querySelector('al-widget-context');

	if (context_button && context_button.active_widget) {
		context_button.unselectedWidget();
	}

	let context = this.createElement('he-context-menu');

	let widgets = Object.values(alchemy.getClassGroup('widgets')).sortByPath(1, 'title');

	for (let widget of widgets) {

		if (!widget.canBeAdded(that.parentElement)) {
			continue;
		}

		context.addEntry({
			title : widget.title,
			icon  : null,
		}, e => {
			that.parentElement.addWidget(widget.type_name);
		});
	}

	context.show(event);
});

/**
 * Show the toolbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AddArea.setMethod(function showToolbar() {

	if (!this.toolbar) {
		this.toolbar = document.createElement('al-widget-toolbar');
		this.append(this.toolbar);
	}

	if (this.toolbar.context_element == this && !this.toolbar.hidden) {
		this.toolbar.close();
		return;
	}

	this.toolbar.hidden = false;
	this.toolbar.context_element = this;
	this.toolbar.showWidgetActions(this.parentElement);

});

/**
 * Enable the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AddArea.setMethod(function introduced() {

	introduced.super.call(this);

	const that = this;

	let add_button = this.querySelector('.add-button');

	add_button.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.showTypes(e);
	});

	let context_button = this.querySelector('.menu-button');

	context_button.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.showToolbar();
	});
});