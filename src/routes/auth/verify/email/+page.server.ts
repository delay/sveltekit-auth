import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	const user  = session?.user;
	if (!user) redirect(302, '/auth/sign-in');
	return {
		user
	};
};
