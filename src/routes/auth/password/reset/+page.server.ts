import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/config/zod-schemas';
import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { getUserByEmail, updateUser } from '$lib/server/database/user-model.js';

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

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const user = await getUserByEmail(form.data.email);
			if (!user) {
				return setError(form, 'The email address does not have an account.');
			}
			console.log('reset user password');
			const token = crypto.randomUUID();
			await updateUser(user.id, { token: token });
			await sendPasswordResetEmail(form.data.email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		redirect(302, '/auth/password/reset/success');
	}
};
