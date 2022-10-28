alchemy.requirePlugin('form');

if (!alchemy.plugins.form) {
	throw new Error('The alchemy-form plugin has to be loaded BEFORE alchemy-widget');
}

Router.add({
	name       : 'AlchemyWidgets#save',
	methods    : 'post',
	paths      : '/api/alchemywidgets/save',
	policy     : 'logged_in',
});
