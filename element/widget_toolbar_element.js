/**
 * The al-widget-toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
let Toolbar = Function.inherits('Alchemy.Element.Widget.Base', function AlWidgetToolbar() {
	AlWidgetToolbar.super.call(this);
	this.hidden = true;
});

/**
 * Show the actions for the given widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.6
 *
 * @param    {HTMLElement}   widget
 */
Toolbar.setMethod(function showWidgetActions(widget) {

	if (!widget || !widget.instance) {
		return;
	}

	const that = this;

	let actions = widget.instance.getToolbarActions();

	// Clear all the old buttons
	Hawkejs.removeChildren(this);

	for (let action of actions) {

		let button = this.createElement('button');
		button.classList.add('aw-toolbar-button');

		let content = action.getButtonContent();

		if (!content) {
			content = action.title;
		}

		if (typeof content == 'string') {
			button.innerText = content;
		} else if (content) {
			if (Array.isArray(content)) {
				for (let entry of content) {
					button.append(entry);
				}
			} else {
				button.append(content);
			}
		}

		button.setAttribute('title', action.title);

		let is_selected = action.isAlreadySelected(widget);

		if (is_selected) {
			button.classList.add('aw-button-selected');
		}

		button.addEventListener('click', function onClick(e) {

			e.preventDefault();

			action.applyOnWidget(widget, that);
		});

		this.append(button);
	}
});

/**
 * Close the toolbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Toolbar.setMethod(function close() {
	this.hidden = true;

	if (this.context_element && this.context_element.active_widget) {
		this.context_element.active_widget.selectWidget();
	}

	this.context_element = null;
});