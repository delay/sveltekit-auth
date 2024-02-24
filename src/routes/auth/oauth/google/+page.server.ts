import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { googleOauth } from '$lib/server/lucia';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await googleOauth.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});

	// store state verifier as cookie
	event.cookies.set('google_state', state, {
		secure: true, // set to false in localhost
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10 // 10 min
	});

	// store code verifier as cookie
	event.cookies.set('google_code_verifier', codeVerifier, {
		secure: true, // set to false in localhost
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10 // 10 min
	});

	return redirect(302, url);
};
