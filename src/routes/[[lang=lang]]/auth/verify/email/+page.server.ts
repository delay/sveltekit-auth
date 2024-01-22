import { translatePath } from '$lib/i18n-routing.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	const user  = session?.user;
	if (!user) redirect(302, translatePath('/auth/sign-in', event.locals.lang));
	return {
		user
	};
};
