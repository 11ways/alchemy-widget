/**
 * The al-user-avatar-group element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
let UserAvatarGroup = Function.inherits('Alchemy.Element.App', 'Alchemy.Element.Widget', 'UserAvatarGroup');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatarGroup.setStylesheetFile('alchemy_widgets');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatarGroup.setStatic('custom_element_prefix', 'al');

/**
 * Clear all the avatars
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
UserAvatarGroup.setMethod(function clear() {

	let existing_avatars = this.querySelectorAll('al-user-avatar'),
	    avatar;

	for (let i = 0; i < existing_avatars.length; i++) {
		avatar = existing_avatars[i];
		avatar.remove();
	}
});

/**
 * Set all the users to show
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Object[]}   users
 */
UserAvatarGroup.setMethod(function setUsers(users) {

	if (!users || !users.length) {
		this.clear();
		return;
	}

	let existing_avatars = this.querySelectorAll('al-user-avatar'),
	    keep_avatars = [],
	    updated,
	    avatar,
	    user;

	users = [...users];

	for (let i = 0; i < users.length; i++) {
		user = users[i];

		updated = false;

		for (let j = 0; j < existing_avatars.length; j++) {
			avatar = existing_avatars[j];

			if (avatar.pk == user.pk) {
				keep_avatars.push(avatar);
				avatar.setUserInfo(user);
				updated = true;
				break;
			}
		}

		if (updated) {
			continue;
		}

		avatar = this.createElement('al-user-avatar');
		avatar.setUserInfo(user);
		this.appendChild(avatar);
		keep_avatars.push(avatar);
	}

	for (let i = 0; i < existing_avatars.length; i++) {
		avatar = existing_avatars[i];

		if (keep_avatars.indexOf(avatar) == -1) {
			avatar.remove();
		}
	}
});

/**
 * Add a user to the group
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 *
 * @param    {Object}   user
 */
UserAvatarGroup.setMethod(function addUser(user) {

	let existing_avatars = this.querySelectorAll('al-user-avatar'),
	    avatar;

	for (let i = 0; i < existing_avatars.length; i++) {
		avatar = existing_avatars[i];

		if (avatar.pk == user.pk) {
			avatar.setUserInfo(user);
			return;
		}
	}

	avatar = this.createElement('al-user-avatar');
	avatar.setUserInfo(user);
	this.appendChild(avatar);
});