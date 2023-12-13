import prisma from '$lib/config/prisma';
import { fail } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/config/email-messages';

export async function load({ params }) {
	try {
		const token = params.token as string;
		const result = await prisma.authUser
			.findUnique({
				where: {
					token: token
				}
			})
			.then(async (user) => {
				let heading = 'Email Verification Problem';
				let message =
					'Your email could not be verified. Please contact support if you feel this is an error.';
				if (user) {
					sendWelcomeEmail(user.email);
					heading = 'Email Verified';
					message = 'Your email has been verified. You can now <a href="/auth/sign-in" class="underline">sign in</a>';
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
