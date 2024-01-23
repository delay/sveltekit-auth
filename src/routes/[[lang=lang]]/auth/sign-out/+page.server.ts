import { translatePath } from '$lib/i18n-routing.js';
import { auth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';

import * as m from "$paraglide/messages";


export const actions = {
	default: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			redirect(302, translatePath('/auth/sign-in', event.locals.lang));
		}
		
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.auth.setSession(null); // remove cookie
		const message = { type: 'success', message: m.loggedout() } as const;
		redirect(302, translatePath('/auth/sign-in', event.locals.lang, event.locals.defaultLang), message, event.cookies);
		
	}
};

//toast also doesn't work this way.
/*
import { auth } from '$lib/server/lucia';
import { setFlash } from 'sveltekit-flash-message/server';
import { redirect } from '@sveltejs/kit';
export const actions = {
	default: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			redirect(302, '/auth/sign-in');
		}
		
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.auth.setSession(null); // remove cookie
		setFlash({ type: 'success', message: 'Logged out' }, event);
		redirect(302, '/auth/sign-in');
		
	}
};
*/