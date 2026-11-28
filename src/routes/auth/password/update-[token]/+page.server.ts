import { fail, redirect } from '@sveltejs/kit';
import { getUserByToken, updateUser } from '$lib/server/database/user-model.js';
import { Argon2id } from 'oslo/password';
import { resolve } from '$app/paths'
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		// Validation
		if (!password || !confirmPassword) {
			return fail(400, {
				error: 'Both password fields are required'
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters long'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match'
			});
		}

		try {
			const token = params.token as string;
			console.log('update user password');
			const newToken = crypto.randomUUID();
			
			// Get user from token
			const user = await getUserByToken(token);

			if (!user) {
				return fail(400, {
					error: 'Invalid or expired token. Please request a new password reset.'
				});
			}

			// Hash the new password
			const hashedPassword = await new Argon2id().hash(password);
			
			// Update user with new password and new token
			await updateUser(user.id, { 
				token: newToken, 
				password: hashedPassword 
			});

		} catch (e) {
			console.error(e);
			return fail(500, {
				error: 'There was a problem updating your password. Please contact support if you need further help.'
			});
		}
		
		const token = params.token as string;
		redirect(302, resolve(`/auth/password/update-[token]/success`, {token}));
	}
};
