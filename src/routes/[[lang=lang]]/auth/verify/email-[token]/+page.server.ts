import prisma from '$lib/config/prisma';
import { fail } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/config/email-messages';

import * as m from '$paraglide/messages';
import { translatePath } from '$lib/i18n-routing';

export async function load({ params, locals }) {
	try {
		const token = params.token as string;
		const result = await prisma.authUser
			.findUnique({
				where: {
					token: token
				}
			})
			.then(async (user) => {
				let heading = m.emailVerifyProblem();
				let message = m.couldNotVerifyEmailMsg({action: 'verified'});
				if (user) {
					sendWelcomeEmail(user.email, locals.lang);
					heading = m.emailVerified();
					message = `${m.EmailIsVerified()}<a href="${translatePath('/auth/sign-in', locals.lang)}" class="underline"> ${m.signin()}</a>`;
					await prisma.authUser.update({
						where: {
							token: token
						},
						data: {
							verified: true
						}
					});
				}
				return { heading: heading, message: message };
			});

		return {
			result
		};
	} catch (e) {
		return fail(500, {
			error: e
		});
	}
}
