/**
 * The widget picker element
 * A Notion-style dialog for selecting widgets to add
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
const WidgetPicker = Function.inherits('Alchemy.Element.Widget.Base', 'WidgetPicker');

/**
 * The template to use
 */
WidgetPicker.setTemplateFile('widget/elements/widget_picker');

/**
 * The stylesheet to use
 */
WidgetPicker.setStylesheetFile('widget_picker');

/**
 * The container element that will receive the selected widget
 */
WidgetPicker.setAssignedProperty('target_container');

/**
 * Search query attribute
 */
WidgetPicker.setAttribute('search');

/**
 * Currently selected category filter
 */
WidgetPicker.setAttribute('category');

/**
 * Get available widgets that can be added to the target container
 *
 * @return   {Array}   Array of widget info objects
 */
WidgetPicker.setMethod(async function getAvailableWidgets() {

	const Widget = Classes.Alchemy.Widget.Widget;
	const widgets = Object.values(alchemy.getClassGroup('widgets'));
	const container = this.target_container;
	const results = [];

	for (let widget of widgets) {
		// Check if widget can be added to this container
		let canAdd = widget.canBeAdded(container);

		if (Pledge.isThenable(canAdd)) {
			canAdd = await canAdd;
		}

		if (!canAdd) {
			continue;
		}

		results.push({
			type_name: widget.type_name,
			title: widget.title || widget.type_name.titleize(),
			description: widget.description || null,  // Hardcoded description takes precedence
			description_key: 'widget-' + widget.type_name + '-description',
			icon: widget.icon || 'puzzle-piece',
			category: widget.category || 'advanced',
			categoryInfo: Widget.getCategoryInfo(widget.category)
		});
	}

	// Sort by title
	return results.sortByPath(1, 'title');
});

/**
 * Get all categories that have widgets
 *
 * @param    {Array}   widgets   Optional array of widgets (to avoid re-fetching)
 *
 * @return   {Array}   Array of category info objects
 */
WidgetPicker.setMethod(function getUsedCategories(widgets) {

	if (!widgets) {
		widgets = this.available_widgets || [];
	}

	const Widget = Classes.Alchemy.Widget.Widget;
	const categoryMap = new Map();

	for (let widget of widgets) {
		if (!categoryMap.has(widget.category)) {
			categoryMap.set(widget.category, Widget.getCategoryInfo(widget.category));
		}
	}

	// Convert to array and sort by order
	return Array.from(categoryMap.values()).sortByPath(1, 'order');
});

/**
 * Prepare render variables
 */
WidgetPicker.setMethod(async function prepareRenderVariables() {

	const widgets = await this.getAvailableWidgets();
	const categories = this.getUsedCategories(widgets);

	// Group widgets by category
	const widgetsByCategory = {};
	for (let widget of widgets) {
		const cat = widget.category || 'advanced';
		if (!widgetsByCategory[cat]) {
			widgetsByCategory[cat] = [];
		}
		widgetsByCategory[cat].push(widget);
	}

	// Attach widgets directly to each category object
	// This avoids bracket notation issues in templates
	for (let category of categories) {
		category.widgets = widgetsByCategory[category.name] || [];
	}

	return {
		widgets,
		categories
	};
});

/**
 * Filter widgets based on search and category
 */
WidgetPicker.setMethod(function filterWidgets() {

	const search = (this.search || '').toLowerCase().trim();
	const category = this.category;
	const items = this.querySelectorAll('.widget-item');
	const categoryGroups = this.querySelectorAll('.widget-category-group');

	// Track which categories have visible items
	const visibleCategories = new Set();

	items.forEach(item => {
		const title = (item.dataset.title || '').toLowerCase();
		const desc = (item.dataset.description || '').toLowerCase();
		const itemCategory = item.dataset.category;

		const matchesSearch = !search || 
			title.includes(search) || 
			desc.includes(search);
		const matchesCategory = !category || itemCategory === category;

		const visible = matchesSearch && matchesCategory;
		item.hidden = !visible;

		if (visible) {
			visibleCategories.add(itemCategory);
		}
	});

	// Show/hide category groups based on whether they have visible items
	categoryGroups.forEach(group => {
		const groupCategory = group.dataset.category;
		group.hidden = !visibleCategories.has(groupCategory);
	});

	this.updateEmptyState();
});

/**
 * Update the empty state message
 */
WidgetPicker.setMethod(function updateEmptyState() {

	const emptyEl = this.querySelector('.widget-picker-empty');
	const visibleItems = this.querySelectorAll('.widget-item:not([hidden])');

	if (emptyEl) {
		emptyEl.hidden = visibleItems.length > 0;
	}
});

/**
 * Select a widget
 */
WidgetPicker.setMethod(function selectWidget(type_name) {

	// Emit the select event with the widget type name
	this.dispatchEvent(new CustomEvent('select', {
		bubbles: true,
		detail: {type_name}
	}));

	// Close the dialog
	const dialog = this.queryParents('he-dialog');
	if (dialog) {
		dialog.close();
	}
});

/**
 * Set up the search input
 */
WidgetPicker.setMethod(function setupSearch() {

	const input = this.querySelector('.widget-picker-search');

	if (!input) return;

	input.addEventListener('input', (e) => {
		this.search = e.target.value;
		this.filterWidgets();
	});

	// Focus search on open
	requestAnimationFrame(() => input.focus());
});

/**
 * Set up category filter buttons
 */
WidgetPicker.setMethod(function setupCategoryFilters() {

	const buttons = this.querySelectorAll('.category-btn');

	buttons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();

			// Update active state
			buttons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');

			// Set category filter
			this.category = btn.dataset.category || '';
			this.filterWidgets();
		});
	});
});

/**
 * Set up widget item click handlers
 */
WidgetPicker.setMethod(function setupWidgetItems() {

	const items = this.querySelectorAll('.widget-item');

	items.forEach(item => {
		item.addEventListener('click', (e) => {
			e.preventDefault();
			this.selectWidget(item.dataset.type);
		});
	});
});

/**
 * Set up keyboard navigation
 */
WidgetPicker.setMethod(function setupKeyboard() {

	this.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			const dialog = this.queryParents('he-dialog');
			if (dialog) {
				dialog.close();
			}
			return;
		}

		if (e.key === 'Enter') {
			const focused = this.querySelector('.widget-item:focus');
			if (focused) {
				e.preventDefault();
				this.selectWidget(focused.dataset.type);
			}
			return;
		}

		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			this.navigateItems(e.key === 'ArrowDown' ? 1 : -1);
		}
	});
});

/**
 * Navigate through widget items with arrow keys
 */
WidgetPicker.setMethod(function navigateItems(direction) {

	const items = Array.from(this.querySelectorAll('.widget-item:not([hidden])'));
	if (!items.length) return;

	const focused = this.querySelector('.widget-item:focus');
	let index = focused ? items.indexOf(focused) : -1;

	index += direction;

	if (index < 0) index = items.length - 1;
	if (index >= items.length) index = 0;

	items[index].focus();
});

/**
 * Show loading state when element is first connected to the DOM
 */
WidgetPicker.setMethod(function connected() {

	// Guard against re-entry if element is moved in DOM
	if (this._initialized) {
		return;
	}

	this._initialized = true;

	// Show loading state immediately while prepareRenderVariables() runs
	this.innerHTML = '<div class="widget-picker-loading"><div class="spinner"></div><p>Loading widgets...</p></div>';
});

/**
 * Added to the DOM for the first time
 */
WidgetPicker.setMethod(function introduced() {

	introduced.super.call(this);

	this.setupSearch();
	this.setupCategoryFilters();
	this.setupWidgetItems();
	this.setupKeyboard();
});
