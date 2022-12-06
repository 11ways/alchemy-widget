alchemy.requirePlugin('form', false);

if (!alchemy.plugins.form) {
	throw new Error('The alchemy-form plugin has to be loaded BEFORE alchemy-widget');
}

/* Ckeditor 5 available toolbar buttons:
	[
		"selectAll",
		"undo",
		"redo",
		"bold",
		"italic",
		"blockQuote",
		"link",
		"ckfinder",
		"uploadImage",
		"imageUpload",
		"heading",
		"imageTextAlternative",
		"toggleImageCaption",
		"imageStyle:inline","imageStyle:alignLeft","imageStyle:alignRight","imageStyle:alignCenter","imageStyle:alignBlockLeft","imageStyle:alignBlockRight","imageStyle:block","imageStyle:side","imageStyle:wrapText","imageStyle:breakText",
		"indent",
		"outdent",
		"numberedList",
		"bulletedList",
		"mediaEmbed",
		"insertTable",
		"tableColumn",
		"tableRow",
		"mergeTableCells"
	]
*/

let options = {
	ckeditor_path: 'https://cdn.ckeditor.com/ckeditor5/35.3.2/inline/ckeditor.js',
	ckeditor_toolbar: [
		'heading',
		'|',
		'bold', 'italic', 'link', 'bulletedList', 'numberedList',
		'|',
		'indent',
		'outdent',
		'|',
		'imageUpload',
		'blockQuote',
		'insertTable',
		'|',
		'undo', 'redo',
	],
};

// Inject the user-overridden options
alchemy.plugins.widget = Object.assign(options, alchemy.plugins.widget);

if (options.ckeditor_path) {
	alchemy.exposeStatic('ckeditor_path', options.ckeditor_path);
}

if (options.ckeditor_toolbar) {
	alchemy.exposeStatic('ckeditor_toolbar', options.ckeditor_toolbar);
}

Router.add({
	name       : 'AlchemyWidgets#save',
	methods    : 'post',
	paths      : '/api/alchemywidgets/save',
	policy     : 'logged_in',
});
