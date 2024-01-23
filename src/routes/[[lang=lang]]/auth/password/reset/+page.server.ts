import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/config/zod-schemas';
import { sendPasswordResetEmail } from '$lib/config/email-messages';
import prisma from '$lib/config/prisma';

import * as m from '$paraglide/messages';
import { translatePath } from '$lib/i18n-routing.js';

const resetPasswordSchema = userSchema.pick({ email: true });

export const load = async (event) => {
	const form = await superValidate(event, resetPasswordSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, resetPasswordSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('reset user password');
			const token = crypto.randomUUID();
			await prisma.authUser.update({
				where: {
					email: form.data.email
				},
				data: {
					token: token
				}
			});

			await sendPasswordResetEmail(form.data.email, token, event.locals.lang);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				m.resetPwdProblem()
			);
		}
		redirect(302, translatePath('/auth/password/reset/success', event.locals.lang, event.locals.defaultLang));
		//		return { form };
	}
};
