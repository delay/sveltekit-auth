import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { microsoftOauth } from '$lib/server/lucia';
import { resolve } from '$app/paths';
import { dev } from '$app/environment';

// Microsoft Entra ID OAuth (Azure AD).
// Authorized redirect URI (dev):      http://localhost:5173/auth/oauth/microsoft/callback
// Authorized redirect URI (prod):     https://openproduct.fr/new/auth/oauth/microsoft/callback
export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = microsoftOauth.createAuthorizationURL(state, codeVerifier, ['User.Read']);

	// store state and code verifier as cookies
	event.cookies.set('microsoft_state', state, {
		secure: !dev, // secure cookies are not sent over http://localhost
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 min
	});

	event.cookies.set('microsoft_code_verifier', codeVerifier, {
		secure: !dev, // secure cookies are not sent over http://localhost
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 min
	});

	// `url` is an absolute Microsoft URL: do NOT run it through resolve() (which
	// would prefix it with the app base path and break the redirect).
	redirect(302, url.toString());
};
