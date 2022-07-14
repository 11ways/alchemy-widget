Router.add({
	name       : 'AlchemyWidgets#save',
	methods    : 'post',
	paths      : '/api/alchemywidgets/save',
	policy     : 'logged_in',
});
