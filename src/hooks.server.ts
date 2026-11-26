import { lucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';
import log from '$lib/server/log';
import { resolve as resolveUrl } from '$app/paths';
import { dev } from '$app/environment';

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	// Extraire tous les détails de l'erreur
	const errorDetails = {
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
		name: error instanceof Error ? error.name : 'Unknown Error',
		timestamp: new Date().toISOString(),
		url: event.url.pathname,
		status: status,
		errorId: errorId
	};

	// Logger l'erreur complète côté serveur
	console.error('=== GLOBAL ERROR HANDLER ===');
	console.error('Error ID:', errorId);
	console.error('Status:', status);
	console.error('Message:', errorDetails.message);
	console.error('Name:', errorDetails.name);
	console.error('Timestamp:', errorDetails.timestamp);
	console.error('URL:', errorDetails.url);
	console.error('Stack:', errorDetails.stack);
	console.error('Full error object:', error);
	console.error('Event route:', event.route.id);
	console.error('===========================');

	// Stocker dans locals pour le logging
	event.locals.error = errorDetails.message;
	event.locals.errorStackTrace = errorDetails.stack || '';
	event.locals.errorId = errorId;
	log(status || 500, event);

	// Retourner les détails pour affichage côté client
	// En production, on peut choisir de masquer certains détails
	const showDetails = true; // Mettre à false pour masquer en production
	
	return {
		message: errorDetails.message,
		errorId: errorId,
		...(showDetails && {
			name: errorDetails.name,
			stack: errorDetails.stack,
			timestamp: errorDetails.timestamp,
			url: errorDetails.url,
			status: status
		})
	};
};

export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	// Redirection HTTP vers HTTPS en production
	if (!dev) {
		const proto = event.request.headers.get('x-forwarded-proto');
		const host = event.request.headers.get('host');
		
		if (proto === 'http' && host) {
			const httpsUrl = `https://${host}${event.url.pathname}${event.url.search}`;
			return new Response(null, {
				status: 301,
				headers: {
					location: httpsUrl
				}
			});
		}
	}

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	const { session, user } = sessionId
		? await lucia.validateSession(sessionId)
		: { session: null, user: null };

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	if (event.route.id?.startsWith('/(protected)')) {
		if (!user) {
			console.log('request protected area but not authentificate');
			redirect(302, resolveUrl('/auth/sign-in'));
		}
		if (!user.verified) {
			console.log('request protected area but email is not verified');
			redirect(302, resolveUrl('/auth/verify/email'));
		}
	}
	if (event.route.id?.startsWith('/(admin)')) {
		console.log('request admin area but no right');
		if (user?.role !== 'ADMIN') redirect(302, resolveUrl('/'));
	}

	const response = await resolve(event);
	log(response.status, event);
	return response;
};

