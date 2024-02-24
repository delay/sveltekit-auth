import { redirect } from '@sveltejs/kit';
import { getUserByEmail, createUser } from '$lib/server/database/user-model.js';
import { googleOauth, lucia } from '$lib/server/lucia';
import { OAuth2RequestError } from 'arctic';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { setFlash } from 'sveltekit-flash-message/server';
//import type { RequestEvent } from '@sveltejs/kit';

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
		redirect(302, '/dashboard');
	}
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_state') ?? null;
	const storedCodeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		return {
			status: 400
		};
	}
	try {
		const tokens = await googleOauth.validateAuthorizationCode(code, storedCodeVerifier);
		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser = (await response.json()) as GoogleUser;
		const existingUser = await getUserByEmail(googleUser.email);

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			//new User
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const newGoogleUser = {
				id: id,
				provider: 'google',
				providerId: googleUser.sub,
				email: googleUser.email.toLowerCase(),
				firstName: googleUser.given_name,
				lastName: googleUser.family_name,
				role: 'USER',
				verified: false,
				receiveEmail: true,
				token: token
			};
			const newUser = await createUser(newGoogleUser);
			if (newUser) {
				await sendVerificationEmail(newUser.email, token);
				const session = await lucia.createSession(newUser.id, {});
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
		}
		return redirect(302, '/dashboard');
	} catch (e) {
		if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
			// invalid code
			return {
				status: 400
			};
		}
		return {
			status: 500
		};
	}
}
