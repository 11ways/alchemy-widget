const WIDGET_PLUGIN_GROUP = Plugin.getSettingsGroup();

const CKEDITOR = WIDGET_PLUGIN_GROUP.createGroup('ckeditor');

CKEDITOR.addSetting('path', {
	type        : 'string',
	default     : alchemy.plugins.styleboost ? '/public/ckeditor/5/ckeditor.js' : 'https://cdn.ckeditor.com/ckeditor5/35.3.2/inline/ckeditor.js',
	description : 'The location of the ckeditor script',
	action      : (value, value_instance) => {
		alchemy.exposeStatic('ckeditor_path', value);
	},
});

CKEDITOR.addSetting('toolbar', {
	type        : 'string',
	default     : 'heading | bold italic link bulletedList numberedList | indent outdent horizontalLine | blockQuote code codeBlock | imageUpload insertTable | undo redo',
	description : 'The location of the ckeditor script',
	action      : (value, value_instance) => {

		if (value) {
			value = value.split(' ');
		}

		alchemy.exposeStatic('ckeditor_toolbar', value);
	},
});