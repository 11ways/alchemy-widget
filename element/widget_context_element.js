/**
 * The alchemy-widget-context element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
let Awc = Function.inherits('Alchemy.Element.Widget.Base', function AlchemyWidgetContext() {
	AlchemyWidgetContext.super.call(this);

	this.innerHTML = `<button class="menu-button widget-button" title="Menu"><i class="gg-menu-grid-o"></i></button>`;
	this.hidden = true;
});

/**
 * Show for a specific widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Awc.setMethod(function moveToWidget(widget) {

	if (this.active_widget && this.active_widget != widget) {
		this.active_widget.unselectWidget();
	}

	// Unhide first so we can get the bounding client rectangle
	this.hidden = false;

	let rect = widget.getBoundingClientRect(),
	    our_rect = this.getBoundingClientRect();

	let left = rect.left + rect.width - our_rect.width - 5,
	    top = rect.top - our_rect.height - 5;

	if (top < 0) {
		top = 0;
	}

	this.style.setProperty('top', top + 'px');
	this.style.setProperty('left', left + 'px');

	this.active_widget = widget;
});

/**
 * Exiting the given widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Awc.setMethod(function unselectedWidget(widget) {

	this.hidden = true;
	this.active_widget = null;

	if (this.toolbar) {
		this.toolbar.hidden = true;
	}
});

/**
 * Show the toolbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Awc.setMethod(function toggleToolbar() {

	if (!this.active_widget) {
		return;
	}

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
	this.toolbar.showWidgetActions(this.active_widget);
});

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Awc.setMethod(function introduced() {

	introduced.super.call(this);

	const that = this;

	let button = this.querySelector('.menu-button');

	button.addEventListener('click', function onClick(e) {

		if (!that.active_widget) {
			return that.exitingWidget();
		}

		that.toggleToolbar();
	});

	document.addEventListener('click', e => {

		if (!this.active_widget) {
			return;
		}

		// Ignore clicks on the context element button itself!
		if (e.target == this || this.contains(e.target)) {
			return;
		}

		// Ignore clicks in the active widget
		if (e.target == this.active_widget || this.active_widget.contains(e.target)) {
			return;
		}

		return this.unselectedWidget();
	});

	let update_scroll = () => {
		animation_request = null;
		this.moveToWidget(this.active_widget);
	}

	let animation_request;

	document.addEventListener('scroll', e => {

		if (!this.active_widget) {
			return;
		}

		if (animation_request != null) {
			cancelAnimationFrame(animation_request);
		}

		animation_request = requestAnimationFrame(update_scroll);
	}, {passive: true});
});