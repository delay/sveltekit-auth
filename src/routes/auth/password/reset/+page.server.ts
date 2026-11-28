import { fail, redirect } from '@sveltejs/kit';
import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { getUserByEmail, updateUser } from '$lib/server/database/user-model.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email) {
			return fail(400, {
				error: 'Email is required',
				email
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email
			});
		}

		try {
			const user = await getUserByEmail(email);
			if (!user) {
				return fail(400, {
					error: 'The email address does not have an account.',
					email
				});
			}
			
			console.log('reset user password');
			const token = crypto.randomUUID();
			await updateUser(user.id, { token: token });
			await sendPasswordResetEmail(email, token);
		} catch (e) {
			console.error(e);
			return fail(500, {
				error: 'There was a problem resetting your password. Please contact support if you need further help.',
				email
			});
		}
		redirect(302, resolve('/auth/password/reset/success'));
	}
};
