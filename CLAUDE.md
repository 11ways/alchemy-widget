# Alchemy Widget Development Guide

## Overview

Widget system for AlchemyMVC. Widgets are configurable content blocks with drag-and-drop editing.

## Creating Custom Widgets

Widgets need two files:
- **Widget class** (`app/helper/widgets/`) - Logic and schema
- **Element class** (`app/element/`) - HTML rendering

```javascript
// app/helper/widgets/my_widget.js
const MyWidget = Function.inherits('Alchemy.Widget', function MyWidget(config) {
	MyWidget.super.call(this, config);
});

// Metadata (optional) - category, description, icon, title
MyWidget.setCategory('data');
MyWidget.setDescription('Display custom data');
MyWidget.setIcon('cube');
MyWidget.setTitle('Data Table');  // Override auto-generated title

MyWidget.constitute(function prepareSchema() {
	this.schema.addField('title', 'String');
	this.schema.addField('style', 'Enum', {values: {default: 'Default', compact: 'Compact'}});
	this.schema.addField('css_class', 'String', {widget_config_editable: true});

	// Actions appear in widget toolbar
	let refresh = this.createAction('refresh', 'Refresh');
	refresh.setHandler((widget_el, handle) => widget_el.instance.rerender());
	refresh.setTester(() => true);
	refresh.setIcon('sync');
});

MyWidget.setMethod(function populateWidget() {
	let element = this.createElement('my-widget-element');
	element.title = this.config.title;
	this.widget.append(element);
});
```

```javascript
// app/element/my_widget_element.js
const MyWidgetElement = Function.inherits('Alchemy.Element.App', 'MyWidgetElement');
MyWidgetElement.setTemplateFile('elements/my_widget_element');
MyWidgetElement.setAssignedProperty('title');
```

## Built-in Categories

| Category | Name | Icon | Description |
|----------|------|------|-------------|
| Layout | `layout` | table-columns | Structure and organize content |
| Text & Content | `text` | font | Text, headings, and rich content |
| Media | `media` | image | Images, videos, and embeds |
| Data & Forms | `data` | database | Tables, forms, and dynamic data |
| Navigation | `navigation` | compass | Menus, links, and navigation |
| Interactive | `interactive` | hand-pointer | Buttons, accordions, interactive elements |
| Advanced | `advanced` | code | Custom HTML, embeds, advanced widgets |

Custom categories: `MyWidget.setCategory('my-custom-category')` auto-generates title and uses puzzle-piece icon.

## Registering Custom Categories

Projects can register their own categories using `Widget.registerCategory()`:

```javascript
// In app/config/bootstrap.js or similar
STAGES.getStage('load_app').addPostTask(function registerMyCategories() {
    const Widget = Classes.Alchemy.Widget.Widget;
    
    Widget.registerCategory('MONITORING', {
        name  : 'monitoring',
        icon  : 'chart-line',
        order : 70,  // Lower = earlier in list
    });
});
```

Required fields: `name`, `icon`. Optional: `order` (default: 90).

Category titles are automatically translated using the category name as the microcopy key with `widget=true category=true` filters.

## Toolbar Button Hooks

Plugins can register toolbar buttons without modifying shared code:

```javascript
const EditorToolbarManager = Classes.Alchemy.Widget.EditorToolbarManager;

// Add buttons when a model is set (e.g., "Create" button)
EditorToolbarManager.registerModelButtonProvider((manager, model_name) => {
    if (manager.scenario == 'my-scenario') {
        manager.addTemplateToRender('buttons', 'my/toolbar/button', {model_name});
    }
});

// Add buttons when a document is set (e.g., "Edit", "Preview" buttons)
EditorToolbarManager.registerDocumentButtonProvider((manager, doc, model, model_name, pk_val) => {
    manager.addTemplateToRender('buttons', 'my/toolbar/edit_button', {
        record_pk: pk_val,
    });
});
```

## Widget Groups

The widget add-menu uses `alchemy.getClassGroup('widgets')`. Only widgets in this group appear.

**Direct inheritance (recommended):**
```javascript
const MyWidget = Function.inherits('Alchemy.Widget', function MyWidget(config) {
	MyWidget.super.call(this, config);
});
// → Classes.Alchemy.Widget.MyWidget
```

**Abstract base class:**
```javascript
// 00_myapp_widget.js - DO NOT call startNewGroup()
const MyAppWidget = Function.inherits('Alchemy.Widget', 'MyApp.Widget');
MyAppWidget.makeAbstractClass();
// → Classes.MyApp.Widget.Widget (a new namespace)

// stats_widget.js
const StatsWidget = Function.inherits('MyApp.Widget', function StatsWidget(config) {
	StatsWidget.super.call(this, config);
});
// → Classes.MyApp.Widget.StatsWidget
```

**Common mistake:**
```javascript
// WRONG - widgets won't appear in add menu
MyAppWidget.startNewGroup('myapp_widgets');
```

## Key Methods

- `populateWidget()` - Render content, append to `this.widget`
- `syncConfig()` - Called when editor stops, return updated config
- `_startEditor()` / `_stopEditor()` - Editing mode hooks
- `rerender()` - Re-render widget after config changes

## Built-in Widgets

`container`, `row`, `column`, `text`, `header`, `html`, `markdown`, `partial`, `alchemy_table`, `alchemy_form`, `alchemy_tabs`

## Gotchas

1. **`startNewGroup()` creates separate group** - Widgets won't appear in selector
2. **Widget files in `app/helper/widgets/`** - Not `app/lib/`
3. **`constitute()` doesn't need super** - All constitutes are queued and run in order automatically
4. **Abstract classes need `makeAbstractClass()`** - Otherwise appear in selector
5. **File numbering matters** - `00_base.js` loads before `10_child.js`
6. **Toolbar requires permission** - `'alchemy.widgets.toolbar'`
7. **Metadata before constitute()** - Call `setCategory()`, `setIcon()`, etc. after class definition but they can be anywhere (static methods set class properties)
8. **Default category is 'advanced'** - Widgets without explicit category appear in Advanced section
