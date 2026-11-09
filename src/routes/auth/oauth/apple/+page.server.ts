import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { appleOauth } from '$lib/server/lucia';
import { resolve } from '$app/paths';
import { dev } from '$app/environment';

export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, resolve('/dashboard'));
	}

	const state = generateState();
	const url = appleOauth.createAuthorizationURL(state, ['email']);

	event.cookies.set('apple_state', state, {
		secure: !dev,
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
