import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/lucia';
import { Argon2id } from 'oslo/password';
import { getUserByEmail } from '$lib/server/database/user-model';
import type { PageServerLoad, Actions } from './$types.js';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}
	return {
		form: {
			data: {
				email: '',
				password: ''
			},
			errors: {},
			valid: true
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		// console.log("sign_in()");
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const errors: Record<string, string> = {};
		if (!email) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address';
		}
		if (!password) {
			errors.password = 'Password is required';
		} else if (password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				form: {
					data: { email, password },
					errors,
					valid: false
				}
			});
		}

		// Authentification
		const emailLower = email.toLowerCase();
		const existingUser = await getUserByEmail(emailLower);
		if (!existingUser) {
			const message = 'The email is unknown.';
			setFlash({ type: 'error', message}, event);
			return fail(400, {
				form: {
					data: { email, password },
					errors: { general: message},
					valid: false
				}
			});
		}

		if (existingUser.password) {
			const validPassword = await new Argon2id().verify(
				existingUser.password,
				password
			);
			if (!validPassword) {
				console.log("Invalid password.")
				const message = 'The password is incorrect.';
				setFlash({ type: 'error', message}, event);
				return fail(400, {
					form: {
						data: { email, password },
						errors: { general: message},
						valid: false
					}
				});
			} else {
				// Mot de passe valide - créer la session
				const session = await lucia.createSession(existingUser.id, {producerId: null});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				console.log("Sign in successful ",existingUser.id,".");
				setFlash({ type: 'success', message: 'Sign in successful.' }, event);
				console.log("Sign in successful ",existingUser.id," : ok.");
				redirect(302, resolve('/dashboard'));
			}
		}

		return {
			form: {
				data: { email, password },
				errors: {},
				valid: true
			}
		};
	}
};
