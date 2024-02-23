import type { HandleClientError } from '@sveltejs/kit';

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
