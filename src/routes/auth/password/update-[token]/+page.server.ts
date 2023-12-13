import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userUpdatePasswordSchema } from '$lib/config/zod-schemas';
import { auth } from '$lib/server/lucia';
import prisma from '$lib/config/prisma';

export const load = async (event) => {
	const form = await superValidate(event, userUpdatePasswordSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, userUpdatePasswordSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			const token = event.params.token as string;
			console.log('update user password');
			const newToken = crypto.randomUUID();
			//get email from token
			const user = await prisma.authUser.findUnique({
				where: {
					token: token
				}
			});

			if (user?.email) {
				await auth.updateKeyPassword('email', user.email, form.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await prisma.authUser.update({
					where: {
						token: token
					},
					data: {
						token: newToken
					}
				});
			} else {
				return setError(
					form,
					'Email address not found for this token. Please contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		const token = event.params.token as string;
		throw redirect(302, `/auth/password/update-${token}/success`);
		//		return { form };
	}
};
