import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import {
	FROM_EMAIL,
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_REGION,
	AWS_API_VERSION,
	SMTP_HOST,
	SMTP_PORT,
	SMTP_SECURE,
	SMTP_PASS,
	SMTP_USER
} from '$env/static/private';
import { message } from 'sveltekit-superforms/server';

let verified = false;

async function getEmailTransporter() {
	const hasAccessKeys = AWS_ACCESS_KEY_ID!="your_aws_access_key_id"
		&& AWS_SECRET_ACCESS_KEY!="your_aws_secret_access_key";
	let poolConfig = {};
	if (hasAccessKeys) {
		console.log("AWS mail transport");
		const ses = new aws.SES({
			apiVersion: AWS_API_VERSION,
			region: AWS_REGION,
			...(hasAccessKeys
				? {
						credentials: {
							accessKeyId: AWS_ACCESS_KEY_ID || '',
							secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
						}
					}
				: {})
		});
		poolConfig = { SES: { ses, aws } };
	} else {
		console.log("SMTP mail transport");
		const login = {
			type: "login",
			user: SMTP_USER,
			pass: SMTP_PASS,
		};
		const oauth2 = {
			type: "oauth2",
			user: SMTP_USER,
			accessToken: SMTP_PASS,
  			expires: 1984314697598,
		};
		poolConfig = {
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: SMTP_SECURE,
			service: "",
			auth: login
		}
	}

	// create Nodemailer SES transporter
	const transporter = nodemailer.createTransport(poolConfig);

	if (!verified) {
		try {
			await transporter.verify();
			console.log("SMTP Server is ready to take our messages");
		} catch (err) {
			console.error("SMTP Verification failed", err);
		}
		verified = true;
	}
	return transporter;
}
export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	const hasAccessKeys = AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;
	
	try {
		const transporter = await getEmailTransporter();
		if (!bodyText) {
			transporter.sendMail(
				{
					from: FROM_EMAIL,
					to: email,
					subject: subject,
					html: bodyHtml
				},
				(err) => {
					if (err) {
						throw new Error(`Error sending email: ${JSON.stringify(err)}`);
					}
				}
			);
		} else if (!bodyHtml) {
			transporter.sendMail(
				{
					from: FROM_EMAIL,
					to: email,
					subject: subject,
					text: bodyText
				},
				(err) => {
					if (err) {
						throw new Error(`Error sending email: ${JSON.stringify(err)}`);
					}
				}
			);
		} else {
			transporter.sendMail(
				{
					from: FROM_EMAIL,
					to: email,
					subject: subject,
					html: bodyHtml,
					text: bodyText
				},
				(err) => {
					if (err) {
						throw new Error(`Error sending email: ${JSON.stringify(err)}`);
					}
				}
			);
		}
		const message = 'E-mail sent successfully to '+email+'!';
		console.log(message);
		return {
			statusCode: 200,
			message: message
		};
	} catch (error) {
		throw new Error(`Error sending email: ${JSON.stringify(error)}`);
	}
}
