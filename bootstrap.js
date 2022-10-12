if (alchemy.plugins.form) {
	throw new Error('The alchemy-form plugin has to be loaded AFTER alchemy-widget');
}

Router.add({
	name       : 'AlchemyWidgets#save',
	methods    : 'post',
	paths      : '/api/alchemywidgets/save',
	policy     : 'logged_in',
});
