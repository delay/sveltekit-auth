import { fail } from '@sveltejs/kit';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { getUserByEmail, updateUser } from '$lib/server/database/user-model';

export async function load({ params }) {
	try {
		const email = decodeURIComponent(params.email) as string;

		const user = await getUserByEmail(email);
		let heading = 'Email Verification Problem';
		let message =
			'A new email could not be sent. Please contact support if you feel this was an error.';

		if (user) {
			heading = 'Email Verification Sent';
			message =
				'A new verification email was sent.  Please check your email for the message. (Check the spam folder if it is not in your inbox)';
			await updateUser(user.id, { verified: false });
			if (user.token) {
				sendVerificationEmail(user.email, user.token);
			}
		}
		return { heading: heading, message: message };
	} catch (e) {
		return fail(500, {
			error: e
		});
	}
}
