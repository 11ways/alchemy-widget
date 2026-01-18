/**
 * The TOC Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 *
 * @param    {Object}   data
 */
const Toc = Function.inherits('Alchemy.Widget', 'TableOfContents');

// Widget metadata
Toc.setCategory('navigation');
Toc.setIcon('list-ol');

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.2.1
 */
Toc.setMethod(function populateWidget() {

	let toc = this.createElement('al-toc');

	if (this.config.parent_selector) {
		toc.parent_selector = this.config.parent_selector;
	}

	if (this.config.elements_selector) {
		toc.elements_selector = this.config.elements_selector;
	}

	if (this.config.child_selector) {
		toc.child_selector = this.config.child_selector;
	}

	if (this.config.title_selector) {
		toc.title_selector = this.config.title_selector;
	}

	this.widget.append(toc);
});