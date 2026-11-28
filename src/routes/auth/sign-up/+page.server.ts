import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/lucia';
import { createUser } from '$lib/server/database/user-model';
import { sendVerificationEmail } from '$lib/config/email-messages';
import type { PageServerLoad, Actions } from './$types.js';
import { resolve } from '$app/paths';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}
	return {
		form: {
			data: {
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				terms: false
			},
			errors: {},
			valid: true
		}
	};
};

/** @satisfies {import('./$types').Actions} */
export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const data = {
			firstName: formData.get('firstName')?.toString() || '',
			lastName: formData.get('lastName')?.toString() || '',
			email: formData.get('email')?.toString() || '',
			password: formData.get('password')?.toString() || '',
			terms: formData.get('terms') === 'on'
		};

		// Validation simple
		const errors: Record<string, string> = {};
		
		if (!data.firstName) {
			errors.firstName = 'First name is required';
		}
		
		if (!data.lastName) {
			errors.lastName = 'Last name is required';
		}
		
		if (!data.email) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			errors.email = 'Please enter a valid email address';
		}
		
		if (!data.password) {
			errors.password = 'Password is required';
		} else if (data.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}
		
		if (!data.terms) {
			errors.terms = 'You must accept the terms and privacy policy';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				form: {
					data,
					errors,
					valid: false
				}
			});
		}

		try {
			const password = await new Argon2id().hash(data.password);
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const user = {
				id: id,
				email: data.email.toLowerCase(),
				firstName: data.firstName,
				lastName: data.lastName,
				password: password,
				role: 'USER',
				verified: false,
				receiveEmail: true,
				token: token,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const newUser = await createUser(user);
			if (newUser) {
				await sendVerificationEmail(newUser.email, token);
				const session = await lucia.createSession(newUser.id, {producerId: null});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				setFlash(
					{
						type: 'success',
						message: 'Account created. Please check your email to verify your account.'
					},
					event
				);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Account was not able to be created.' }, event);
			// email already in use
			return fail(400, {
				form: {
					data,
					errors: { email: 'A user with that email already exists.' },
					valid: false
				}
			});
		}
		
		return { 
			form: {
				data,
				errors: {},
				valid: true
			}
		};
	}
};
