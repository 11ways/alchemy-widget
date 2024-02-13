Plugin.addRoute({
	name       : 'AlchemyWidgets#save',
	methods    : 'post',
	paths      : '/api/alchemywidgets/save',
	policy     : 'logged_in',
	permission : 'alchemy.widgets.save',
});

Plugin.addRoute({
	name       : 'AlchemyWidgets#uploadImage',
	methods    : 'post',
	paths      : '/api/alchemywidgets/upload',
	policy     : 'logged_in',
	permission : 'alchemy.widgets.image.upload',
});