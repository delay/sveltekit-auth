import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { googleOauth } from '$lib/server/lucia';
import { resolve } from '$app/paths';
import { dev } from '$app/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = googleOauth.createAuthorizationURL(state, codeVerifier, ['profile', 'email']);

	// store state verifier as cookie
	event.cookies.set('google_state', state, {
		secure: !dev, // secure cookies are not sent over http://localhost
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 min
	});

	// store code verifier as cookie
	event.cookies.set('google_code_verifier', codeVerifier, {
		secure: !dev, // secure cookies are not sent over http://localhost
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 min
	});

	// `url` is an absolute Google URL: do NOT run it through resolve() (which
	// would prefix it with the app base path and break the redirect).
	redirect(302, url.toString());
};
