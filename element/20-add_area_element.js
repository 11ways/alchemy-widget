/**
 * The alchemy-widgets element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let AddArea = Function.inherits('Alchemy.Element.Widget.Base', function AlchemyWidgetAddArea() {
	AlchemyWidgetAddArea.super.call(this);

	this.innerHTML = `
<div class="main-button">
	<button class="add-button widget-button" title="Add"><i class="gg-math-plus"></i></button>
	<button class="menu-button widget-button" title="Menu"><i class="gg-menu-grid-o"></i></button>
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
 * @version  0.1.0
 */
AddArea.setMethod(function showTypes() {

	let that = this,
	    types_element = this.querySelector('.widget-types'),
	    widgets = alchemy.getClassGroup('widgets');

	let context_button = document.querySelector('alchemy-widget-context');

	if (context_button && context_button.active_widget) {
		context_button.unselectedWidget();
	}

	this.classList.add('show-types');

	Hawkejs.removeChildren(types_element);

	for (let key in widgets) {

		if (key == 'container') {
			continue;
		}

		let widget = widgets[key];

		let button = this.createElement('button');
		button.setAttribute('data-type', key);
		button.textContent = widget.title;

		button.addEventListener('click', function onClick(e) {
			e.preventDefault();
			that.classList.remove('show-types');

			that.parentElement.addWidget(key);
		});

		types_element.append(button);
	}
});

/**
 * Show the toolbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AddArea.setMethod(function showToolbar() {

	if (!this.toolbar) {
		this.toolbar = document.createElement('alchemy-widget-toolbar');
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
		that.showTypes();
	});

	let context_button = this.querySelector('.menu-button');

	context_button.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.showToolbar();
	});
});