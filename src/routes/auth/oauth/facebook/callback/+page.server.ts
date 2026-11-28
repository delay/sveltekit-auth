import { redirect } from '@sveltejs/kit';
import { getUserByEmail, createUser, updateUser } from '$lib/server/database/user-model.js';
import { facebookOauth, lucia } from '$lib/server/lucia';
import { OAuth2RequestError } from 'arctic';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { setFlash } from 'sveltekit-flash-message/server';
import { resolve } from '$app/paths';

type FacebookUser = {
	id: string;
	name: string;
	email?: string;
	first_name?: string;
	last_name?: string;
};

export async function load(event) {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('facebook_state') ?? null;

	event.cookies.delete('facebook_state', { path: '/' });

	if (!code || !state || !storedState || state !== storedState) {
		setFlash(
			{ type: 'error', message: 'Connexion Facebook invalide ou expirée. Merci de réessayer.' },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	try {
		const tokens = await facebookOauth.validateAuthorizationCode(code);
		const response = await fetch(
			`https://graph.facebook.com/me?fields=id,name,email,first_name,last_name`,
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			}
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch Facebook user info (${response.status})`);
		}
		const facebookUser = (await response.json()) as FacebookUser;
		const email = facebookUser.email?.toLowerCase();

		if (!email) {
			setFlash(
				{ type: 'error', message: "L'email n'a pas pu être récupéré depuis Facebook." },
				event
			);
			redirect(302, resolve('/auth/sign-in'));
		}

		const existingUser = await getUserByEmail(email);
		const emailVerified = true;

		if (existingUser) {
			if (!existingUser.verified && emailVerified) {
				await updateUser(existingUser.id, { verified: true, updatedAt: new Date() });
			}
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		} else {
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const now = new Date();
			const newFacebookUser = {
				id: id,
				provider: 'facebook',
				providerId: facebookUser.id,
				email: email,
				firstName: facebookUser.first_name || facebookUser.name.split(' ')[0] || '',
				lastName: facebookUser.last_name || facebookUser.name.split(' ').slice(1).join(' ') || '',
				role: 'USER',
				verified: emailVerified,
				receiveEmail: true,
				token: token,
				createdAt: now,
				updatedAt: now
			};
			const newUser = await createUser(newFacebookUser);
			if (newUser) {
				if (!emailVerified) {
					await sendVerificationEmail(newUser.email, token);
				}
				const session = await lucia.createSession(newUser.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '/',
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
			console.error('Facebook OAuth error:', e.message);
		} else {
			console.error('Facebook OAuth callback error:', e);
		}
		setFlash(
			{ type: 'error', message: 'La connexion avec Facebook a échoué. Merci de réessayer.' },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	return { provider: 'facebook' };
}
