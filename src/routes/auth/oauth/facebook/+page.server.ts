import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { facebookOauth } from '$lib/server/lucia';
import { resolve } from '$app/paths';
import { dev } from '$app/environment';

export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const state = generateState();
	const url = facebookOauth.createAuthorizationURL(state, ['email', 'public_profile']);

	event.cookies.set('facebook_state', state, {
		secure: !dev,
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
