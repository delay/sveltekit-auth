import prisma from '$lib/config/prisma';
import { fail } from '@sveltejs/kit';
import { sendVerificationEmail } from '$lib/config/email-messages';

import * as m from '$paraglide/messages';

export async function load({ params, locals }) {
	try {

		const email =  decodeURIComponent(params.email) as string;

		const result = await prisma.authUser
			.findUnique({
				where: {
					email: email
				}
			})
			.then(async (user) => {
				let heading = m.emailVerifyProblem();
				let message = m.couldNotVerifyEmailMsg({action: 'sent'});
				if (user) {
					heading = m.emailVerifySent();
					message =
						m.emailVerifySentMsg();
					await prisma.authUser.update({
						where: {
							email: user.email
						},
						data: {
							verified: false
						}
					});
					if (user.token) {
						sendVerificationEmail(user.email, user.token, locals.lang);
					}
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
