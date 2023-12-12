//import * as SentrySvelte from '@sentry/svelte';
import type { HandleClientError } from '@sveltejs/kit';

/*SentrySvelte.init({
	dsn: 'https://8c3bc4d0fd5c4d64b8e36187fa9150de@o516805.ingest.sentry.io/4505106025545728',
	integrations: [new SentrySvelte.BrowserTracing(), new SentrySvelte.Replay()],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});*/

export const handleError: HandleClientError = ({ error }) => {
    const errorId = crypto.randomUUID();
    console.error(error);
    /*SentrySvelte.captureException(error, {
        contexts: { sveltekit: { event, errorId } }
    });*/
    return {
        message: 'An unexpected error occurred.',
        errorId
    };
};
