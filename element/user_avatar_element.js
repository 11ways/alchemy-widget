/**
 * The al-symbol-group element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
let UserAvatar = Function.inherits('Alchemy.Element.App', 'Alchemy.Element.Widget', 'UserAvatar');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setStylesheetFile('alchemy_widgets');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setStatic('custom_element_prefix', 'al');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setTemplateFile('widget/elements/al_user_avatar');

/**
 * The user data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setAssignedProperty('user');

/**
 * Get the pk of the user
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setProperty(function pk() {
	
	let result = '';

	if (this.user) {
		result = this.user.$pk || this.user.pk || this.user.id || '';
	}

	return String(result);
});

/**
 * Get the first name of the user
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setProperty(function first_name() {

	let result = '';

	if (this.user) {
		result = this.user.firstname || this.user.first_name || this.user.username || '';
	}

	return result;
});

/**
 * Get the first letter for the user
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setProperty(function first_letter() {

	let result = this.first_name;

	if (result) {
		result = result[0].toUpperCase();
	} else {
		result = '?';
	}

	return result;
});

/**
 * Set (new) user info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setMethod(function setUserInfo(user) {
	this.user = user;
});

/**
 * Received user info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatar.setMethod(function onUserAssignment(user) {

	let bg_color;

	if (user) {
		bg_color = user.color;
	}

	if (!bg_color) {
		this.style.removeProperty('--avatar-bg-color');
	} else {
		this.style.setProperty('--avatar-bg-color', bg_color);
	}

	let first_name = this.first_name;

	this.setAttribute('title', first_name);
});