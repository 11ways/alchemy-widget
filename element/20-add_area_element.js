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
 * Show the widget picker dialog
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
AddArea.setMethod(async function showTypes(event) {

	let context_button = document.querySelector('al-widget-context');

	if (context_button) {
		context_button.forceUnselection();
	}

	// Create the widget picker element
	let picker = this.createElement('al-widget-picker');
	picker.target_container = this.parentElement;
	picker.addEventListener('select', (e) => {
		this.parentElement.addWidget(e.detail.type_name);
	});

	// Create the dialog
	let dialog = this.createElement('he-dialog');
	dialog.setAttribute('dialog-title', 'Add Widget');
	dialog.classList.add('widget-picker-dialog');

	// Wrap picker in a slot container
	let slot = document.createElement('div');
	slot.setAttribute('slot', 'main');
	slot.append(picker);
	dialog.append(slot);

	document.body.append(dialog);
});

/**
 * Show the actionbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
AddArea.setMethod(function showActionbar() {

	if (!this.actionbar) {
		this.actionbar = document.createElement('al-widget-actionbar');
		this.append(this.actionbar);
	}

	if (this.actionbar.context_element == this && !this.actionbar.hidden) {
		this.actionbar.close();
		return;
	}

	this.actionbar.hidden = false;
	this.actionbar.context_element = this;
	this.actionbar.showWidgetActions(this.parentElement);

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
		that.showActionbar();
	});
});