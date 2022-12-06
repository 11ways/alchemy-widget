/**
 * The Alchemy Widgets Controller class
 *
 * @author     Jelle De Loecker   <jelle@elevenways.be>
 * @since      0.1.5
 * @version    0.1.5
 */
const AlchemyWidgets = Function.inherits('Alchemy.Controller', 'AlchemyWidgets');

/**
 * Aggregate all the records to save
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.6
 *
 * @param    {Object[]}   fields
 *
 * @return   {Document[]}
 */
AlchemyWidgets.setMethod(async function aggregate(widgets) {

	let result = {};

	for (let widget of widgets) {

		if (!widget || !widget.model || !widget.field) {
			throw new Error('Unable to save Widget: no model or field was given');
		}
	
		const model = alchemy.getModel(widget.model);
	
		if (!model) {
			throw new Error('Unable to save Widget: model "' + widget.model + '" not found');
		}
	
		let field = model.getField(widget.field);
	
		if (!field) {
			throw new Error('Unable to save Widget: field "' + widget.field + '" does not exist inside model "' + widget.model + '"');
		}
	
		let record;
	
		if (widget.pk) {

			if (result[widget.pk]) {
				record = result[widget.pk];
			} else {
				record = await model.findByPk(widget.pk);
				result[widget.pk] = record;
			}
		} else {

			if (result[model.name]) {
				record = result[model.name];
			} else {
				record = model.createDocument();
				result[model.name] = record;
			}
		}

		let field_definition;

		if (widget.value_path) {
			field_definition = model.getField(widget.field + '.' + widget.value_path);
		} else {
			field_definition = model.getField(widget.field);
		}

		if (!field_definition) {
			continue;
		}

		// The optional translation key
		let field_language = widget.field_languages?.[widget.field];
		let target_field_value = record[widget.field];
		let target_container;
		let target_key;
		let path_for_language;

		// Do incredibly complicated filter stuff
		if (widget.filter_value) {

			if (!widget.filter_target || !widget.value_path) {
				continue;
			}

			// Create the root field if needed
			if (!target_field_value) {
				target_field_value = [];
				record[widget.field] = target_field_value;
			}

			if (target_field_value && Array.isArray(target_field_value)) {
				target_key = widget.value_path;

				for (let index = 0; index < target_field_value.length; index++) {
					let entry = target_field_value[index];

					if (entry[widget.filter_target] == widget.filter_value) {
						target_container = entry;
						path_for_language = widget.field + '.' + index + '.' + target_key;
						break;
					}
				}

				if (!target_container) {
					target_container = {
						[widget.filter_target] : widget.filter_value,
						[target_key]           : {},
					};

					let new_index = target_field_value.push(target_container) - 1;
					path_for_language = widget.field + '.' + new_index + '.' + target_key;
				}
			}
		} else {
			target_container = record;
			target_key = widget.field;
		}

		if (!field_language && path_for_language) {
			field_language = widget.field_languages?.[path_for_language];
		}

		if (!field_language && field_definition.is_translatable) {
			field_language = this.conduit.active_prefix;

			if (!field_language) {
				continue;
			}
		}

		if (field_language) {
			if (!target_container) {
				target_container = record[widget.field] = {};
			}


			if (!target_container[target_key]) {
				target_container[target_key] = {};
			}

			target_container = target_container[target_key];
			target_key = field_language;
		}

		target_container[target_key] = widget.value;
	}

	return Object.values(result);
});

/**
 * The save action
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.5
 *
 * @param    {Conduit}   conduit
 */
AlchemyWidgets.setAction(async function save(conduit) {

	const body = conduit.body;

	if (!body || !body.widgets?.length) {
		return conduit.error('Unable to save Widgets: no widgets were given');
	}

	let records = await this.aggregate(body.widgets);

	let saved_pks = [];

	for (let record of records) {
		await record.save();
		saved_pks.push(record.$pk);
	}

	let result = {
		saved_pks,
		saved : true,
	};

	conduit.end(result);
});

/**
 * Handle an image upload from within CKeditor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyWidgets.setAction(async function uploadImage(conduit) {

	let file = conduit.files.upload;

	const MediaFile = this.getModel('MediaFile');

	let name = file.name.split('.');

	// Remove the last piece if there are more than 1
	if (name.length > 1) {
		name.pop();
	}

	// Join them again
	name = name.join('.');

	const options = {
		move     : true,
		filename : file.name,
		name     : name,
	};

	MediaFile.addFile(file.path, options, (err, result) => {

		if (err) {
			return conduit.error(err);
		}

		const params = {
			id : result._id,
		};

		let default_path = alchemy.routeUrl('Media::image', params);
		let url = RURL.parse(default_path);

		let path_800 = url.clone();
		path_800.param('width', '800');

		let path_1024 = url.clone();
		path_1024.param('height', '1024');

		let path_1920 = url.clone();
		path_1920.param('width', '1920');

		let response = {
			urls: {
				default : default_path,
				'800'   : path_800+'',
				'1024'  : path_1024+'',
				'1920'  : path_1920+''
			}
		};

		conduit.end(response);
	});
});