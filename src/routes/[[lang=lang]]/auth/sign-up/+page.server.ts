import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { sendVerificationEmail } from '$lib/config/email-messages';
import * as m from "$paraglide/messages";
import { translatePath } from '$lib/i18n-routing.js';

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	terms: true
});

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (session) redirect(302, translatePath('/dashboard', event.locals.lang));
	const form = await superValidate(event, signUpSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		
		const form = await superValidate(event, signUpSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('creating user');
			const token = crypto.randomUUID();

			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: form.data.email.toLowerCase(),
					password: form.data.password
				},
				attributes: {
					email: form.data.email.toLowerCase(),
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					role: 'USER',
					verified: false,
					receiveEmail: true,
					token: token
				}
			});

			await sendVerificationEmail(form.data.email, token, event.locals.lang);
			const session = await auth.createSession({ userId: user.userId, attributes: {} });
			event.locals.auth.setSession(session);
			setFlash({ type: 'success', message: m.acccreated() }, event);
			} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: m.accnotcreated()}, event);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', m.emailexists());
		}

		return { form };
	}
};
