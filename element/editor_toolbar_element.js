/**
 * The al-editor-toolbar element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
let Toolbar = Function.inherits('Alchemy.Element.Widget.BaseToolbar', 'EditorToolbar');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setTemplateFile('widget/elements/al_editor_toolbar');

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Toolbar.setMethod(async function introduced() {

	this.prepareToolbarManager(this.toolbar_manager);

});
