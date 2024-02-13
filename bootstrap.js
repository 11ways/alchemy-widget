alchemy.requirePlugin('form', false);

if (!alchemy.plugins.form) {
	throw new Error('The alchemy-form plugin has to be loaded BEFORE alchemy-widget');
}
