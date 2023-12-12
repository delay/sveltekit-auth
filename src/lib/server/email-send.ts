import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import {
	FROM_EMAIL,
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_REGION,
	AWS_API_VERSION
} from '$env/static/private';
//import { z } from "zod";
export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	const hasAccessKeys = AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;

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

	// create Nodemailer SES transporter
	const transporter = nodemailer.createTransport({
		SES: { ses, aws }
	});

	interface MailConfig {
		recipient: string;
		subject: string;
		htmlMessage: string;
	}

	try {
		if (!bodyText) {
			transporter.sendMail(
				{
					from: FROM_EMAIL,
					to: email,
					subject: subject,
					html: bodyHtml
				},
				(err, info) => {
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
				(err, info) => {
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
				(err, info) => {
					if (err) {
						throw new Error(`Error sending email: ${JSON.stringify(err)}`);
					}
				}
			);
		}
		console.log('E-mail sent successfully!');
		return {
			statusCode: 200,
			message: 'E-mail sent successfully.'
		};
	} catch (error) {
		throw new Error(`Error sending email: ${JSON.stringify(error)}`);
	}
}
