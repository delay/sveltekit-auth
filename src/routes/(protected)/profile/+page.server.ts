import { fail } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { userSchema } from '$lib/config/zod-schemas';
import { updateEmailAddressSuccessEmail } from '$lib/config/email-messages';
import { updateUser } from '$lib/server/database/user-model.js';
import type { PageServerLoad, Actions } from './$types.js';
import { zod } from 'sveltekit-superforms/adapters';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true
});

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return fail(400, {
			error: 'You must be signed in to view this page.'
		});
	}

	const form = await superValidate(profileSchema, zod);

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, profileSchema, zod);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('updating profile');
			const user = event.locals.user;
			if (user) {
				await updateUser(user.id, {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email
				});
				setFlash({ type: 'success', message: 'Profile update successful.' }, event);
			}

			if (user?.email !== form.data.email) {
				if (user) {
					await updateUser(user?.userId, {
						verified: false
					});
					await updateEmailAddressSuccessEmail(form.data.email, user?.email, user?.token);
				}
			}
		} catch (e) {
			console.error(e);
			return setError(form, 'There was a problem updating your profile.');
		}
		console.log('profile updated successfully');
		return message(form, 'Profile updated successfully.');
	}
};
