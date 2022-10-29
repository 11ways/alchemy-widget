/**
 * The Widgets helper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {ViewRender}    view
 */
const Widgets = Function.inherits('Alchemy.Helper', 'Widgets');

/**
 * Function to execute on the client side, when the scene is made
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Scene}   scene
 * @param    {Object}  options
 */
Widgets.setStatic(function onScene(scene, options) {
	Blast.setImmediate(() => {
		Classes.Alchemy.Element.Widget.WidgetToolbar.show();
	});
});
