## 0.2.5 (2023-02-11)

* Add `code_type` field to the `Sourcecode` widget
* Allow setting the source of an `HTML` widget via its config dialog
* Make `paste` widget action only append copied widgets to a container
* Add `replace` widget action to replace a widget with anything in the current clipboard

## 0.2.4 (2023-01-30)

* Fix the tree structure generation of the `al-toc` element
* Make `TableOfContents#entries` return a flat list and `TableOfContents#tree` a tree structure
* Also take siblings of heading elements into account for the `TableOfContents` scrollspy

## 0.2.3 (2023-01-23)

* Fix `List` widgets not having their content saved
* Fix more issues with saving to the database

## 0.2.2 (2022-12-23)

* Fix widgets not being populated properly

## 0.2.1 (2022-12-23)

* Add a `-first` modifier class to the first visible entry of a table-of-contents element
* Make HTML widget editable
* Also store and retrieve copied widget config from localStorage
* Move `Container` widget init logic from the custom-element to the main widget instance
* Disable most `backdrop-filter` properties, they caused too many FPS issues
* Add the ability to hide widgets from the public
* Allow overriding the language (`lang` attribute) of a widget
* Fix config of container widgets not being saved
* Only add minium dimensions when editing
* Add `child-role` attribute & use it to set the default role of child widgets
* Add the `toc-has-content` or `toc-is-empty` class to `al-toc` elements
* Fix issue where `Text` widget would break when edited with LanguageTool extension
* Do not truncate titles in table-of-contents automatically
* Fix nesting levels in `al-toc`
* Only allow text inside header widgets
* Move default `Widget#populateWidget()` code to `Widget#finalizePopulatedWidget()`
* Add `HawkejsTemplate` widget

## 0.2.0 (2022-11-02)

* Use `al-` prefix for all custom elements
* Update to `alchemy-form` v0.2.0
* Add copy & paste actions
* Add nesting levels to `al-toc`
* Add `al-widget-toolbar` element
* Use `easymde` markdown editor for markdown widgets

## 0.1.6 (2022-10-12)

* Allow hiding widgets from the add-menu
* Let actions return their button contents as elements instead of only html
* Cancel clicks on widgets when editing them
* Fix getting the `hawkejs_renderer` instance in a widget
* Use `alchemy-chimera` style for the widget configuration dialog
* Make renders wait for widgets that have to render their content asynchronously
* Allow setting the element to use in a Text widget
* Fix Header-widget level actions
* Load the icon fonts as soon as the editor starts
* Make the `rerender` method async
* Use `child_class` property in the populate method
* Add filter logic to widgets for getting specific values
* Add abstract `Partial` widget class, to easily create a new widget with a pre-defined layout
* Wait for widgets to render their contents before starting editor
* Add `can_be_removed` property to widget elements
* Add `can_be_moved` property to widget elements
* Throw an error if `alchemy-form` is loaded before this plugin

## 0.1.5 (2022-07-14)

* Unselect widgets when stopping the editor
* Add front-end save ability to widgets

## 0.1.4 (2022-06-23)

* Use `he-context-menu` element to show widgets to add
* Add widget actions to move across container boundaries

## 0.1.3 (2022-03-21)

* Catch and print errors when appending a widget to a container

## 0.1.2 (2022-02-20)

* Add `table-of-contents` element and widget

## 0.1.1 (2022-01-28)

* Hide context button when clicking out of widget
* Update context button position on scroll
* Fix row children becoming too wide

## 0.1.0 (2021-09-12)

* Initial release