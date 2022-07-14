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
 * @version  0.1.5
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
	
		let field_language = widget.field_languages?.[widget.field];
	
		if (field_language) {
			if (!record[widget.field]) {
				record[widget.field] = {};
			}
	
			record[widget.field][field_language] = widget.value;
		} else {
			record[widget.field] = widget.value;
		}
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