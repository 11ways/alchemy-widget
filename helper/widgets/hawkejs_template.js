/**
 * The Widget Template class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 *
 * @param    {Object}   data
 */
const Template = Function.inherits('Alchemy.Widget.Sourcecode', 'HawkejsTemplate');

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 *
 * @param    {HTMLElement}   widget
 */
Template.setMethod(async function populateWidget() {

	let input = this.config.sourcecode;

	if (input) {
		input = input.trim();
	}

	Hawkejs.removeChildren(this.widget);

	if (input) {

		let hawkejs = this.hawkejs_renderer.hawkejs,
		    hash = Object.checksum(input),
		    name = 'interpret_' + hash,
		    fnc;

		if (hawkejs.templates[name]) {
			fnc = hawkejs.templates[name];
		} else {
			fnc = hawkejs.compile({
				template_name : name,
				template      : input
			});
		}

		let variables = {};
		let placeholder = this.hawkejs_renderer.addSubtemplate(fnc, {print: false}, variables);

		// If the widget is already part of the DOM,
		// it's being edited and we need to manually kickstart the renderer
		if (Blast.isBrowser && document.body.contains(this.widget)) {
			await placeholder.getContent();
		}

		this.widget.append(placeholder);
	}
});