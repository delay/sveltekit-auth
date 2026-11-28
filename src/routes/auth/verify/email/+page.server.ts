import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const load = async (event) => {
	if (!event.locals.user) redirect(302, resolve('/auth/sign-in'));
};
