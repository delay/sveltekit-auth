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
	SMTP_USER,
	SMTP_PASS,
	SMTP_SECURE
} from '$env/static/private';

import * as m from '$paraglide/messages';
//import { z } from "zod";
export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	const hasAccessKeys = AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;
	let ses;
	if (hasAccessKeys) {
		ses = new aws.SES({
			apiVersion: AWS_API_VERSION,
			region: AWS_REGION,
			...(hasAccessKeys
				? {
						credentials: {
							accessKeyId: AWS_ACCESS_KEY_ID || '',
							secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
						}
				}
				: {
				})
		});
	}

	// create Nodemailer SES transporter
	const transporter = nodemailer.createTransport(hasAccessKeys ? {
		SES: { ses, aws }
	} : {
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: Number(SMTP_SECURE) === 1, // false means 'use TLS'
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false,
		}, 
	});

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
						throw new Error(`Error sending email: ${JSON.stringify({ err, info})}`);
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
						throw new Error(`Error sending email: ${JSON.stringify({ err, info})}`);
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
						throw new Error(`Error sending email: ${JSON.stringify({ err, info})}`);
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
		throw new Error(`${m.sendmailerr()}: ${JSON.stringify(error)}`);
	}
}
