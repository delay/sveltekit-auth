import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';

const signInSchema = userSchema.pick({
	email: true,
	password: true
});

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (session) redirect(302, '/dashboard');
	const form = await superValidate(event, signInSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signInSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('sign in user');
			const key = await auth.useKey('email', form.data.email.toLowerCase(), form.data.password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
			setFlash({ type: 'success', message: 'Sign in successful.' }, event);
		} catch (e) {
			//TODO: need to return error message to client
			console.error(e);
			// email already in use
			//const { fieldErrors: errors } = e.flatten();
			setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
			return setError(form, 'The email or password is incorrect.');
			
		}

		return { form };
	}
};
