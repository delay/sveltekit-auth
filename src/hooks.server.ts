import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
/* begin sentry.io */
//import * as SentryNode from '@sentry/node';
import type { HandleServerError } from '@sveltejs/kit';
import { sourceLanguageTag, type AvailableLanguageTag } from "$paraglide/runtime";
import * as m from '$paraglide/messages';

import log from '$lib/server/log';
import { translatePath } from '$lib/i18n-routing';

/*SentryNode.init({
	dsn: 'https://8c3bc4d0fd5c4d64b8e36187fa9150de@o516805.ingest.sentry.io/4505106025545728',

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0
});*/

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.error = error?.toString() || undefined;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.errorStackTrace = error?.stack || undefined;
	event.locals.errorId = errorId;
	log(500, event);

	/*SentryNode.captureException(error, {
		contexts: { sveltekit: { event, errorId } }
	});*/
	return {
		message: m.unexperr(),
		errorId
	};
};
/* end sentry.io */

export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	const lang: AvailableLanguageTag = event.params.lang as AvailableLanguageTag ?? sourceLanguageTag;
	event.locals.lang = lang;

	event.locals.auth = auth.handleRequest(event);
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		const user = session?.user;
		if(user) {
			event.locals.user = user;
		}
		if (event.route.id?.startsWith('/[[lang=lang]]/(protected)')) {
			if (!user) redirect(302, translatePath('/auth/sign-in', lang));
			if (!user.verified) redirect(302, translatePath('/auth/verify/email', lang));
		}
		if (event.route.id?.startsWith('/[[lang=lang]]/(admin)')) {
			if (user?.role !== 'ADMIN') redirect(302, translatePath('/auth/sign-in', lang));
		}
	}
	

	const response = await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace("%lang%", lang);
			}
		},
	});
	log(response.status, event);
	return response;
};

