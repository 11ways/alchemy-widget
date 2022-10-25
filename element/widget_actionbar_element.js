/**
 * The al-widget-actionbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
let Actionbar = Function.inherits('Alchemy.Element.Widget.Base', function WidgetActionbar() {
	WidgetActionbar.super.call(this);
	this.hidden = true;
});

/**
 * Show the actions for the given widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {HTMLElement}   widget
 */
Actionbar.setMethod(async function showWidgetActions(widget) {

	if (!widget || !widget.instance) {
		return;
	}

	const that = this;

	let actions = await widget.instance.getActionbarActions();

	// Clear all the old buttons
	Hawkejs.removeChildren(this);

	for (let action of actions) {

		let button = this.createElement('button');
		button.classList.add('aw-actionbar-button');

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
 * Close the actionbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Actionbar.setMethod(function close() {
	this.hidden = true;

	if (this.context_element && this.context_element.active_widget) {
		this.context_element.active_widget.selectWidget();
	}

	this.context_element = null;
});