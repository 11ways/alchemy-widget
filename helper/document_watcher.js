const DOC_MAP = new Classes.WeakValueMap();

// A list of vibrant colours to choose from
const COLOURS = [
	'#0095e8', // Blue
	'#47be7d', // Green
	'#5014d0', // Purple
	'#f1bc00', // Yellow
	'#d9214e', // Red
	'#00a6a6', // Cyan
	'#ff7f00', // Orange
	'#20c997', // Teal
	'#6610f2', // Indigo
	'#e83e8c', // Pink
	'#6f42c1', // Violet
	'#9c27b0', // Periwinkle
];

/**
 * The syncable DocumentWatcher class:
 * keeps track of how many people are viewing a document
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.3.0
 */
const DocumentWatcher = Function.inherits('Alchemy.Syncable.Specialized', 'Alchemy.Widget', 'DocumentWatcher');

/**
 * Create a watcher for the given document
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {String}   model
 * @param    {*}        pk
 */
DocumentWatcher.setStatic(function create(model, pk) {

	if (typeof model != 'string') {
		model = model.model_name;
	}

	let id = model + ':' + pk,
	    watcher = DOC_MAP.get(id);

	if (!watcher) {
		watcher = new DocumentWatcher();
		watcher.setDocument(model, pk);
		DOC_MAP.set(id, watcher);
	}

	return watcher;
});

if (Blast.isNode) {

	/**
	 * Recreate a watcher after server restart.
	 * Called by Syncable.tryRecreate() when client reconnects.
	 *
	 * @author   Jelle De Loecker   <jelle@elevenways.be>
	 * @since    0.3.0
	 * @version  0.3.0
	 *
	 * @param    {Conduit}   conduit
	 * @param    {Object}    config    Contains type, id, and version from the client
	 *
	 * @return   {DocumentWatcher}
	 */
	DocumentWatcher.setStatic(async function recreate(conduit, config) {

		// The config.id follows the pattern "Model:pk"
		let parts = config.id.split(':');

		if (parts.length < 2) {
			return null;
		}

		let model = parts[0],
		    pk = parts.slice(1).join(':'); // Handle pks with colons

		// Use the existing create method which handles caching
		let watcher = this.create(model, pk);

		if (watcher) {
			// Re-add this conduit as a watcher
			await watcher.addWatcher(conduit);
		}

		return watcher;
	});

	/**
	 * Add a viewer based on the conduit
	 *
	 * @author   Jelle De Loecker   <jelle@elevenways.be>
	 * @since    0.2.7
	 * @version  0.2.7
	 *
	 * @param    {Alchemy.Conduit}   conduit
	 */
	DocumentWatcher.setTypedMethod([Types.Alchemy.Conduit], async function addWatcher(conduit) {

		let user_id = '' + conduit.getUserId(),
		    scene_id = conduit.scene_id;

		// IMPORTANT: await the async addWatcher method!
		await this.addWatcher(user_id, scene_id);

		// Watchers should also be registered as a client
		this.registerClient(conduit);

		let scene = conduit.scene;

		if (scene) {
			scene.on('destroyed', () => {
				this.removeWatcher(user_id, scene_id);
			});
		}
	});

	/**
	 * Remove a viewer based on the conduit
	 *
	 * @author   Jelle De Loecker   <jelle@elevenways.be>
	 * @since    0.2.7
	 * @version  0.2.7
	 *
	 * @param    {Alchemy.Conduit}   conduit
	 */
	DocumentWatcher.setTypedMethod([Types.Alchemy.Conduit], function removeWatcher(conduit) {
		let user_id = '' + conduit.getUserId(),
		    scene_id = conduit.scene_id;

		this.removeWatcher(user_id, scene_id);
	});
}

/**
 * Add the model property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
DocumentWatcher.setStateProperty('model', {allow_client_set: false});

/**
 * Add the pk property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
DocumentWatcher.setStateProperty('pk', {allow_client_set: false});

/**
 * Add the title property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
DocumentWatcher.setStateProperty('title', {allow_client_set: false});

/**
 * Add the viewers property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
DocumentWatcher.setStateProperty('viewers', {
	allow_client_set: false,
	default: () => [],
});

/**
 * Set the model and primary key
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {String}   model
 * @param    {*}        pk
 */
DocumentWatcher.setMethod(function setDocument(model, pk) {
	this.state.model = model;
	this.state.pk = pk;

	if (model && pk) {
		this.id = model + ':' + pk;
	}
});

/**
 * Add a viewer
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {user_id}   user_id
 */
DocumentWatcher.setSyncMethod([Types.String, Types.String], async function addWatcher(user_id, scene_id) {

	let viewers = this.viewers,
	    entry;

	for (entry of viewers) {
		if (entry.user_id == user_id) {
			entry.scenes.push(scene_id);
			this.emitViewers();
			return;
		}
	}

	entry = {
		user_id : user_id,
		scenes  : [scene_id],
		info    : null,
	};

	viewers.push(entry);

	let info = await this.getUserInfo(user_id);
	entry.info = info || false;

	this.emitViewers();
});

/**
 * Emit the viewers property change, if they're all ready
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
DocumentWatcher.setMethod(function emitViewers() {
	this.emitPropertyChange('viewers');
});

/**
 * Remove a viewer
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {user_id}   user_id
 */
DocumentWatcher.setSyncMethod([Types.String, Types.String], async function removeWatcher(user_id, scene_id) {

	let viewers = this.viewers,
	    entry;

	let user_to_remove;

	for (entry of viewers) {
		if (entry.user_id == user_id) {

			let index = entry.scenes.indexOf(scene_id);

			if (index > -1) {
				entry.scenes.splice(index, 1);
			}

			if (entry.scenes.length == 0) {
				user_to_remove = entry;
			}
		}
	}

	if (user_to_remove) {
		let index = viewers.indexOf(user_to_remove);
		viewers.splice(index, 1);
		this.emitViewers();
	}
});

/**
 * Get information about an author
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {String}   user_id
 */
DocumentWatcher.setUpstreamMethod(async function getUserInfo(user_id) {

	if (!user_id) {
		return;
	}

	let document = await Model.get('User').findByPk(user_id);

	if (!document) {
		return;
	}

	// Get a colour from the COLOURS array based on the user's id
	let color = COLOURS[parseInt(user_id.slice(-4), 16) % COLOURS.length];

	let result = {
		pk         : document.$pk,
		first_name : document.first_name || document.firstname,
		last_name  : document.last_name || document.lastname,
		username   : document.username,
		color      : color,
	};

	return result;
});