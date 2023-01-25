const RELATED_HEADING = Symbol('related_heading'),
      RELATED_SIBLINGS = Symbol('related_siblings');

/**
 * The table-of-contents element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
const TableOfContents = Function.inherits('Alchemy.Element.App', 'TableOfContents');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setTemplateFile('elements/table_of_contents');

/**
 * Set the actual tag name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TableOfContents.setTagName('AL-TOC');

/**
 * Set the content
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAssignedProperty('content');

/**
 * The role of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setRole('navigation');

/**
 * The parent query
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAttribute('parent-selector');

/**
 * The children query
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAttribute('children-selector');

/**
 * The elements query
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAttribute('elements-selector');

/**
 * The elements query
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAttribute('title-selector');

/**
 * The class to add when intersecting (visible)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setAttribute('intersection-class');

/**
 * Should titles be truncated?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
TableOfContents.setAttribute('truncate-length', {type: 'number'});

/**
 * Get the entries
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.2.4
 */
TableOfContents.setProperty(function entries() {

	let result = [],
		parent = this.parentElement,
		wrapper;

	if (this.parent_selector) {
		parent = this.queryParents(this.parent_selector);
	}

	if (parent) {
		wrapper = parent;
	}

	if (wrapper && this.children_selector) {
		wrapper = wrapper.querySelector(this.children_selector);
	}

	if (wrapper) {

		let heading_level = 0,
		    heading,
		    i;

		let headings = wrapper.querySelectorAll(this.elements_selector || 'h1, h2, h3, h4, h5, h6'),
		    nodes = [];

		for (i = 0; i < headings.length; i++) {
			heading = headings[i];

			if (!heading.id) {

				if (heading.hawkejs_id) {
					heading.id = heading.hawkejs_id;
				}

				if (!heading.id) {
					continue;
				}
			}

			let title_element,
			    title;

			if (this.title_selector) {
				title_element = heading.querySelector(this.title_selector);
			}

			if (!title_element) {
				title_element = heading;
			}

			if (title_element.nodeName[0] == 'H' && isFinite(title_element.nodeName[1])) {
				heading_level = +title_element.nodeName[1];
			} else if (!heading_level) {
				heading_level = 1;
			}

			title = (title_element.toc_title || title_element.textContent || '').trim();

			if (this.truncate_length) {
				title = title.truncate(this.truncate_length);
			}

			// Don't add empty titles
			if (!title) {
				continue;
			}

			let node = {
				id       : heading.id,
				level    : heading_level,
				title    : title,
				element  : heading,
			};

			nodes.push(node);
		}

		result = nodes;
	}

	return result;
});

/**
 * Get the entries tree
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.4
 * @version  0.2.4
 */
TableOfContents.setProperty(function tree() {
	return Blast.listToTree(this.entries);
});

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.2.4
 */
TableOfContents.setMethod(async function introduced() {

	await this.rerender();

	const observer = new IntersectionObserver(entries => {

		let class_name = this.intersection_class || 'visible',
		    first_name = class_name + '-first';

		let intersect_map = new Map();

		for (let entry of entries) {
			const heading = entry.target[RELATED_HEADING] || entry.target;
			const id = heading.getAttribute('id');

			if (!id) {
				continue;
			}

			let query = `a[href="#${id}"]`,
			    element = this.querySelector(query);

			if (!element) {
				continue;
			}

			let value = intersect_map.get(element) || 0;

			if (entry.intersectionRatio > 0) {
				value++;
			} else {
				let siblings = heading[RELATED_SIBLINGS];

				if (siblings?.length) {
					for (let sibling of siblings) {
						if (sibling.isVisible(-150)) {
							value++;
							break;
						}
					}
				}
			}

			intersect_map.set(element, value);
		};

		for (let [element, value] of intersect_map) {

			if (value > 0) {
				element.classList.add(class_name);
			} else {
				element.classList.remove(class_name);
			}
		}

		let is_visible,
		    all_marked = this.querySelectorAll('.' + class_name + ', .' + first_name),
		    element,
			seen = 0,
		    i;
		
		for (i = 0; i < all_marked.length; i++) {
			element = all_marked[i];
			is_visible = element.classList.contains(class_name);

			if (is_visible && seen == 0) {
				element.classList.add(first_name);
			} else {
				element.classList.remove(first_name);
			}

			if (is_visible) {
				seen++;
			}
		}
	});

	let entries = this.entries,
	    elements = [];

	for (let entry of entries) {
		observer.observe(entry.element);
		elements.push(entry.element);
	}

	for (let element of elements) {

		element[RELATED_SIBLINGS] = [];
		let sibling = element.nextElementSibling;

		while (sibling) {

			if (elements.includes(sibling)) {
				break;
			}

			element[RELATED_SIBLINGS].push(sibling);
			sibling[RELATED_HEADING] = element;
			observer.observe(sibling);
			sibling = sibling.nextElementSibling;
		}
	}
});