alchemy.requirePlugin('form', false);

if (!alchemy.plugins.form) {
	throw new Error('The alchemy-form plugin has to be loaded BEFORE alchemy-widget');
}

/* Ckeditor 5 available toolbar buttons (from styleboost build)
[
	"blockQuote",
	"bold",
	"code",
	"codeBlock",
	"selectAll",
	"undo",
	"redo",
	"heading",
	"horizontalLine",
	"imageTextAlternative",
	"toggleImageCaption",
	"imageStyle:inline",
	"imageStyle:alignLeft",
	"imageStyle:alignRight",
	"imageStyle:alignCenter",
	"imageStyle:alignBlockLeft",
	"imageStyle:alignBlockRight",
	"imageStyle:block",
	"imageStyle:side",
	"imageStyle:wrapText",
	"imageStyle:breakText",
	"uploadImage",
	"imageUpload",
	"indent",
	"outdent",
	"italic",
	"link",
	"linkImage",
	"numberedList",
	"bulletedList",
	"mediaEmbed",
	"removeFormat",
	"sourceEditing",
	"strikethrough",
	"insertTable",
	"tableColumn",
	"tableRow",
	"mergeTableCells",
	"toggleTableCaption",
	"tableCellProperties",
	"tableProperties",
	"todoList"
]
*/

let options = {
	ckeditor_path: null,
	ckeditor_toolbar: [
		'heading',
		'|',
		'bold', 'italic', 'link', 'bulletedList', 'numberedList',
		'|',
		'indent',
		'outdent',
		'horizontalLine',
		'|',
		'blockQuote',
		'code',
		'codeBlock',
		'|',
		'imageUpload',
		'insertTable',
		'|',
		'undo', 'redo',
	],
};

// Inject the user-overridden options
alchemy.plugins.widget = Object.assign(options, alchemy.plugins.widget);

if (!options.ckeditor_path) {
	if (alchemy.plugins.styleboost) {
		options.ckeditor_path = '/public/ckeditor/5/ckeditor.js';
	} else {
		options.ckeditor_path = 'https://cdn.ckeditor.com/ckeditor5/35.3.2/inline/ckeditor.js';
	}
}

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
	permission : 'alchemy.widgets.save',
});

Router.add({
	name       : 'AlchemyWidgets#uploadImage',
	methods    : 'post',
	paths      : '/api/alchemywidgets/upload',
	policy     : 'logged_in',
	permission : 'alchemy.widgets.image.upload',
});