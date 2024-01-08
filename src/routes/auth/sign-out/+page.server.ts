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
