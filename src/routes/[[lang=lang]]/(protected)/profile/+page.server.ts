import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { updateEmailAddressSuccessEmail } from '$lib/config/email-messages';
import prisma from '$lib/config/prisma';
import { setFlash } from 'sveltekit-flash-message/server';

import * as m from '$paraglide/messages';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true
});

export const load = async (event) => {
	const form = await superValidate(event, profileSchema);
	const session = await event.locals.auth.validate();
	const user  = session?.user;
	form.data = {
		firstName: user?.firstName,
		lastName: user?.lastName,
		email: user?.email
	};
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, profileSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('updating profile');
			const session = await event.locals.auth.validate();
			const user  = session?.user;

			auth.updateUserAttributes(user?.userId, {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				email: form.data.email
			});
			//await auth.invalidateAllUserSessions(user?.userId);

			if (user?.email !== form.data.email) {
				console.log('user: ' + JSON.stringify(user));
				await prisma.authKey.update({
					where: {
						id: 'email:' + user?.email
					},
					data: {
						id: 'email:' + form.data.email
					}
				});

				auth.updateUserAttributes(user?.userId, {
					verified: false
				});
				//await auth.invalidateAllUserSessions(user?.userId);
				await updateEmailAddressSuccessEmail(form.data.email, user?.email, user?.token, event.locals.lang);
			}
		} catch (e) {
			console.error(e);
			return setError(form, 'There was a problem updating your profile.');
		}
		console.log('profile updated successfully');
		setFlash({ type: 'success', message: m.profileUpdateSuccess() }, event); // message function used from Superforms
		return {form};
	}
};
