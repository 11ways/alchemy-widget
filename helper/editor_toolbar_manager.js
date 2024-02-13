const SCENE_MAP = new Map(),
      CLEAR_DOC_ID = Symbol('clear_doc_id');

/**
 * The syncable EditorToolbarManager class:
 * handles a user's toolbar
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
const EditorToolbarManager = Function.inherits('Alchemy.Syncable', 'Alchemy.Widget', function EditorToolbarManager() {
	EditorToolbarManager.super.call(this, 'editor_toolbar_manager');
});

if (Blast.isNode) {
	/**
	 * Create a manager for the given conduit
	 * (It should be linked to a user's tab/scene)
	 *
	 * @author   Jelle De Loecker   <jelle@elevenways.be>
	 * @since    0.2.7
	 * @version  0.2.7
	 *
	 * @param    {Conduit}        conduit
	 *
	 * @return   {EditorToolbarManager}
	 */
	EditorToolbarManager.setStatic(function create(conduit) {

		if (!conduit?.scene_id) {
			return;
		}

		let id = conduit.scene_id,
			ref = SCENE_MAP.get(id),
			manager;
		
		if (ref) {
			manager = ref.deref();
		}

		if (!manager) {
			manager = new EditorToolbarManager();
			manager.id = id;
			manager.registerClient(conduit);
			manager.conduit = conduit;

			ref = new WeakRef(manager);
			SCENE_MAP.set(id, ref);
		}

		if (manager.conduit != conduit) {
			// Don't create a shim like this,
			// all the other important properties will be "frozen"
			//manager = Object.create(manager);
			manager.conduit = conduit;
		}

		return manager;
	});
}

/**
 * Add the document_watcher property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setStateProperty('document_watcher', {allow_client_set: false});

/**
 * Add the model_name property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setStateProperty('model_name', {allow_client_set: false});

/**
 * Add the title property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setStateProperty('title', {allow_client_set: false});

/**
 * Add the scenario property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setStateProperty('scenario');

/**
 * Clear the model fallback
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {String}   model_name
 */
EditorToolbarManager.setMethod(function clearModelFallback() {

	if (!this.fallback_id) {
		this.fallback_id = 0;
	}

	this.fallback_id++;

	return this.fallback_id;
});

/**
 * If a response is sent through the conduit, and no model & document is set,
 * make it clear those values.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {String}   model_name
 */
EditorToolbarManager.setMethod(function queueModelFallback(model_name) {

	let current_id = this.clearModelFallback();

	this.conduit.on('ending', () => {
		if (this.fallback_id == current_id) {
			this.setDocument(null);
			this.setModel(model_name);
		}
	});
});

/**
 * Set the current model
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.3.0
 *
 * @param    {String}   model_name
 */
EditorToolbarManager.setTypedMethod([Types.String.optional().nullable()], function setModel(model_name) {

	this.clearModelFallback();

	let old_model = this.state.model_name;

	this.state.model_name = model_name;

	if (old_model != model_name) {
		this.emitPropertyChange('model_name');
	}

	if (Blast.isNode && model_name) {
		this.addTemplateToRender('buttons', 'chimera/toolbar/create_button', {
			model_name: Blast.parseClassPath(model_name).map(entry => entry.underscore()).join('.'),
		});
	}
});

/**
 * Set the document
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Alchemy.Document}   doc
 *
 * @return   {DocumentWatcher}
 */
EditorToolbarManager.setMethod(function setDocument(doc) {

	this.clearModelFallback();

	this.clearArea('buttons');

	if (!doc) {
		this.setDocumentWatcher(null);
		return;
	}

	let model = doc.$model,
	    model_name = doc.$model_name,
	    pk_val = doc.$pk;

	let document_watcher = Classes.Alchemy.Widget.DocumentWatcher.create(model_name, pk_val);
	document_watcher.setProperty('title', ''+pk_val);

	this.setDocumentWatcher(document_watcher);

	if (this.scenario != 'chimera') {
		this.addTemplateToRender('buttons', 'chimera/toolbar/edit_in_chimera_button', {
			model_name: model_name.underscore(),
			record_pk: pk_val,
		});
	}

	if (model.chimera.record_preview) {
		if (this.scenario == 'chimera') {
			this.addTemplateToRender('buttons', 'chimera/toolbar/preview_button', {
				model_name: model_name.underscore(),
				record_pk: pk_val,
			});
		}
	}

	return document_watcher;
});

/**
 * Clear an area
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setMethod(function clearArea(area) {
	this.clearQueue('render_template');
	this.pushQueue('clear_area', area);
});

/**
 * Add a template to the toolbar
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setMethod(function addTemplateToRender(area, template, variables) {
	this.pushQueue('render_template', area, template, variables);
});

/**
 * Set the document watcher to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Alchemy.Widget.DocumentWatcher}   watcher
 */
EditorToolbarManager.setSyncMethod(function setDocumentWatcher(watcher) {

	if (this[CLEAR_DOC_ID]) {
		clearTimeout(this[CLEAR_DOC_ID]);
	}

	let old_watcher = this.state.document_watcher;

	this.state.document_watcher = watcher;

	if (Blast.isNode) {

		if (old_watcher) {
			old_watcher.removeWatcher(this.conduit);
		}

		if (watcher) {
			watcher.registerClient(this.conduit);
		}
	}

	this.emitPropertyChange('document_watcher');
});

/**
 * Queue clearing the document watcher
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
EditorToolbarManager.setMethod(function queueClearDocumentWatcher(timeout = 500) {

	if (this[CLEAR_DOC_ID]) {
		clearTimeout(this[CLEAR_DOC_ID]);
	}

	this[CLEAR_DOC_ID] = setTimeout(() => {
		if (this.state.document_watcher) {
			this.setDocumentWatcher(null);
		}
	}, timeout);
});