import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
/* begin sentry.io */
//import * as SentryNode from '@sentry/node';
import type { HandleServerError } from '@sveltejs/kit';

import log from '$lib/server/log';

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
		message: 'An unexpected error occurred.',
		errorId
	};
};
/* end sentry.io */

export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	event.locals.auth = auth.handleRequest(event);
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		const user = session?.user;
		if(user) {
			event.locals.user = user;
		}
		if (event.route.id?.startsWith('/(protected)')) {
			if (!user) redirect(302, '/auth/sign-in');
			if (!user.verified) redirect(302, '/auth/verify/email');
		}
		if (event.route.id?.startsWith('/(admin)')) {
			if (user?.role !== 'ADMIN') redirect(302, '/auth/sign-in');
		}
	}

	const response = await resolve(event);
	log(response.status, event);
	return response;
};
