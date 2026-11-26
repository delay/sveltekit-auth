import { redirect } from '@sveltejs/kit';
import { getUserByEmail, createUser, updateUser } from '$lib/server/database/user-model.js';
import { microsoftOauth, lucia } from '$lib/server/lucia';
import { OAuth2RequestError } from 'arctic';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { setFlash } from 'sveltekit-flash-message/server';
import { resolve } from '$app/paths';

type MicrosoftUser = {
	id: string;
	displayName: string;
	givenName?: string;
	surname?: string;
	mail?: string;
	userPrincipalName: string;
};

export async function load(event) {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('microsoft_state') ?? null;
	const storedCodeVerifier = event.cookies.get('microsoft_code_verifier') ?? null;

	// One-time values: clear them as soon as they are read.
	event.cookies.delete('microsoft_state', { path: '/' });
	event.cookies.delete('microsoft_code_verifier', { path: '/' });

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		setFlash(
			{ type: 'error', message: "Connexion Microsoft invalide ou expirée. Merci de réessayer." },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	try {
		const tokens = await microsoftOauth.validateAuthorizationCode(code, storedCodeVerifier);
		const response = await fetch('https://graph.microsoft.com/v1.0/me', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch Microsoft user info (${response.status})`);
		}
		const microsoftUser = (await response.json()) as MicrosoftUser;
		// Microsoft already verified the email address, so we can trust it and
		// skip our own email verification step.
		const email = (microsoftUser.mail || microsoftUser.userPrincipalName).toLowerCase();
		const emailVerified = true;

		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			// An account created before (e.g. email/password) that was never
			// verified can be trusted now that Microsoft confirmed the email.
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
			const newMicrosoftUser = {
				id: id,
				provider: 'microsoft',
				providerId: microsoftUser.id,
				email: email,
				firstName: microsoftUser.givenName ?? 'Microsoft',
				lastName: microsoftUser.surname ?? 'User',
				role: 'USER',
				verified: emailVerified,
				receiveEmail: true,
				token: token,
				createdAt: now,
				updatedAt: now
			};
			const newUser = await createUser(newMicrosoftUser);
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
			console.error('Microsoft OAuth error:', e.message);
		} else {
			console.error('Microsoft OAuth callback error:', e);
		}
		setFlash(
			{ type: 'error', message: "La connexion avec Microsoft a échoué. Merci de réessayer." },
			event
		);
		redirect(302, resolve('/auth/sign-in'));
	}

	redirect(302, resolve('/dashboard'));
}
