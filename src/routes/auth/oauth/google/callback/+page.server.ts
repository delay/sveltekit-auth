import { redirect } from '@sveltejs/kit';
import { getUserByEmail, createUser, updateUser } from '$lib/server/database/user-model.js';
import { googleOauth, lucia } from '$lib/server/lucia';
import { OAuth2RequestError } from 'arctic';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { setFlash } from 'sveltekit-flash-message/server';
import { resolve } from '$app/paths';

type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};

export async function load(event) {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_state') ?? null;
	const storedCodeVerifier = event.cookies.get('google_code_verifier') ?? null;

	// One-time values: clear them as soon as they are read.
	event.cookies.delete('google_state', { path: '/' });
	event.cookies.delete('google_code_verifier', { path: '/' });

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		setFlash(
			{ type: 'error', message: 'Connexion Google invalide ou expirée. Merci de réessayer.' },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	try {
		const tokens = await googleOauth.validateAuthorizationCode(code, storedCodeVerifier);
		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch Google user info (${response.status})`);
		}
		const googleUser = (await response.json()) as GoogleUser;
		const existingUser = await getUserByEmail(googleUser.email.toLowerCase());
		// Google already verified the email address, so we can trust it and
		// skip our own email verification step.
		const emailVerified = googleUser.email_verified === true;

		if (existingUser) {
			// An account created before (e.g. email/password) that was never
			// verified can be trusted now that Google confirmed the email.
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
			// new user
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const now = new Date();
			const newGoogleUser = {
				id: id,
				provider: 'google',
				providerId: googleUser.sub,
				email: googleUser.email.toLowerCase(),
				firstName: googleUser.given_name,
				lastName: googleUser.family_name,
				role: 'USER',
				verified: emailVerified,
				receiveEmail: true,
				token: token,
				createdAt: now,
				updatedAt: now
			};
			const newUser = await createUser(newGoogleUser);
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
						message: emailVerified
							? 'Account created. Welcome!'
							: 'Account created. Please check your email to verify your account.'
					},
					event
				);
			}
		}
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// invalid code
			console.error('Google OAuth error:', e.message);
		} else {
			console.error('Google OAuth callback error:', e);
		}
		setFlash(
			{ type: 'error', message: 'La connexion avec Google a échoué. Merci de réessayer.' },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	return { provider: 'google' };
}
