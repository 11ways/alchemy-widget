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
 * Get the entries
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.2.0
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

		let current_level = null,
		    last_entry,
		    elements = wrapper.querySelectorAll(this.elements_selector || 'h1,h2'),
			element,
			title,
			i;

		for (i = 0; i < elements.length; i++) {
			element = elements[i];

			if (!element.id) {

				if (element.hawkejs_id) {
					element.id = element.hawkejs_id;
				}

				if (!element.id) {
					continue;
				}
			}

			let title_element,
			    starts_level,
				ends_level;

			if (this.title_selector) {
				title_element = element.querySelector(this.title_selector);
			}

			if (!title_element) {
				title_element = element;
			}

			if (element.nodeName[0] == 'H' && isFinite(element.nodeName[1])) {
				let heading_level = +element.nodeName[1];

				if (current_level == null) {
					current_level = heading_level;
				} else if (heading_level > current_level) {
					current_level++;
					starts_level = true;
				} else if (heading_level == current_level && last_entry) {
					last_entry.starts_level = false;
				} else if (heading_level < current_level) {
					current_level--;

					if (last_entry) {
						last_entry.ends_level = true;
					}
				}
			}

			title = (title_element.toc_title || title_element.textContent || '').trim();

			title = title.truncate(30);

			// Don't add empty titles
			if (!title) {
				continue;
			}

			last_entry = {
				id           : element.id,
				level        : current_level,
				title        : title,
				element      : element,
				starts_level : starts_level,
				ends_level   : ends_level,
			};

			result.push(last_entry);
		}

		let ended_level = false,
		    entries = result,
		    current_branch,
			current_nodes = [];

		result = current_nodes;
		last_entry = null;

		for (let entry of entries) {

			if (ended_level) {

				while (entry.level >= current_branch.level) {
					current_branch = current_branch.parent;
					current_nodes = current_branch?.children || result;

					if (!current_branch) {
						current_branch = result[result.length - 1];
						break;
					}
				}

				ended_level = false;
			}

			if (!current_branch) {
				current_branch = entry;
			} else {
				entry.parent = current_branch;
			}

			if (entry.starts_level) {

				current_branch = last_entry;

				if (!current_branch.children) {
					current_branch.children = [];
				}

				current_nodes = current_branch.children;
			}
			
			current_nodes.push(entry);

			if (entry.ends_level) {
				ended_level = true;
				current_branch = entry.parent;
				current_nodes = current_branch.children || result;

				if (!current_branch) {
					current_branch = result[result.length - 1];
					break;
				}
			}

			last_entry = entry;
		}
	}

	return result;
});

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
TableOfContents.setMethod(async function introduced() {

	await this.rerender();

	const observer = new IntersectionObserver(entries => {

		let class_name = this.intersection_class || 'visible';

		for (let entry of entries) {
			const id = entry.target.getAttribute('id');

			let query = `a[href="#${id}"]`,
			    element = this.querySelector(query);
			
			if (!element) {
				return;
			}

			if (entry.intersectionRatio > 0) {
				element.classList.add(class_name);
			} else {
				element.classList.remove(class_name);
			}
		};
	});

	for (let entry of this.entries) {
		observer.observe(entry.element);
	}
});