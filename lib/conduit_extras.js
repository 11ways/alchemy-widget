/**
 * Add a method to the conduit class to set the toolbar manager
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Alchemy.Document}   document_or_model
 */
Classes.Alchemy.Conduit.Conduit.setMethod(function setToolbarInfo(document_or_model, scenario = 'frontend') {
	try {
		_setToolbarInfo.call(this, document_or_model, scenario);
	} catch (err) {
		console.error('Error setting toolbar info', err);
	}
});

/**
 * Add a method to the conduit class to set the toolbar manager
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Alchemy.Document}   document_or_model
 */
function _setToolbarInfo(document_or_model, scenario = 'frontend') {

	if (!this.hasPermission('alchemy.widgets.toolbar')) {
		return;
	}

	let manager = Classes.Alchemy.Widget.EditorToolbarManager.create(this);
	manager.scenario = scenario;

	this.set('toolbar_manager', manager);
	this.expose('toolbar_manager', manager);

	let document_watcher,
	    document,
	    model;

	if (document_or_model) {
		if (document_or_model instanceof Classes.Alchemy.Document.Document) {
			document = document_or_model;
		} else {
			model = document_or_model;
		}
	}

	document_watcher = manager.setDocument(document);

	if (document) {
		manager.setModel(document.$model_name);
		document_watcher.addWatcher(this);

		this.set('edit_model_name', document.$model_name);
		this.set('edit_model_pk', document.$pk);
	} else if (model) {
		manager.setModel(model.model_name);
		this.set('edit_model_name', model.model_name);
	} else {
		manager.setModel(null);
	}
};