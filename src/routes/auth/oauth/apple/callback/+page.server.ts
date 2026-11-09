import { redirect } from '@sveltejs/kit';
import { getUserByEmail, createUser, updateUser } from '$lib/server/database/user-model.js';
import { appleOauth, lucia } from '$lib/server/lucia';
import { OAuth2RequestError } from 'arctic';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { setFlash } from 'sveltekit-flash-message/server';
import { resolve } from '$app/paths';

export async function load(event) {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('apple_state') ?? null;

	event.cookies.delete('apple_state', { path: '/' });

	if (!code || !state || !storedState || state !== storedState) {
		setFlash(
			{ type: 'error', message: "Connexion Apple invalide ou expirée. Merci de réessayer." },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	try {
		const tokens = await appleOauth.validateAuthorizationCode(code);
		// Apple returns id_token in tokens (via arctic); we can decode to get sub/email if present.
		let email: string | undefined;
		let sub: string | undefined;
		if (tokens.idToken) {
			try {
				const parts = tokens.idToken.split('.');
				if (parts.length === 3) {
					const payload = JSON.parse(atob(parts[1]));
					email = payload.email;
					sub = payload.sub;
				}
			} catch (e) {
				console.error('Failed to decode Apple id_token', e);
			}
		}

		if (!email || !sub) {
			setFlash(
				{ type: 'error', message: "L'email n'a pas pu être récupéré depuis Apple." },
				event
			);
			redirect(302, resolve('/auth/sign-in'));
		}

		const existingUser = await getUserByEmail(email.toLowerCase());
		const emailVerified = true;

		if (existingUser) {
			if (!existingUser.verified && emailVerified) {
				await updateUser(existingUser.id, { verified: true, updatedAt: new Date() });
			}
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const now = new Date();
			const newAppleUser = {
				id: id,
				provider: 'apple',
				providerId: sub,
				email: email.toLowerCase(),
				firstName: 'Apple',
				lastName: 'User',
				role: 'USER',
				verified: emailVerified,
				receiveEmail: true,
				token: token,
				createdAt: now,
				updatedAt: now
			};
			const newUser = await createUser(newAppleUser);
			if (newUser) {
				if (!emailVerified) {
					await sendVerificationEmail(newUser.email, token);
				}
				const session = await lucia.createSession(newUser.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				setFlash(
					{
						type: 'success',
						message: emailVerified ? 'Account created. Welcome!' : 'Account created. Please check your email to verify your account.'
					},
					event
				);
			}
		}
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			console.error('Apple OAuth error:', e.message);
		} else {
			console.error('Apple OAuth callback error:', e);
		}
		setFlash(
			{ type: 'error', message: "La connexion avec Apple a échoué. Merci de réessayer." },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	redirect(302, resolve('/dashboard'));
}
