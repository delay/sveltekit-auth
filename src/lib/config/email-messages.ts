import sendEmail from '$lib/server/email-send';
import { APP_NAME, BASE_URL } from '$lib/config/constants';
import { PUBLIC_BASE_PATH } from '$env/static/public';

function getBaseUrl() : string {
	let base_path = BASE_URL + PUBLIC_BASE_PATH;
	while (base_path.charAt(base_path.length-1)=='/') {
		base_path = base_path.substring(0,base_path.length-1);
	}
	return base_path;
}

// Send an email to verify the user's address
export const sendVerificationEmail = async (email: string, token: string) => {
	const verifyEmailURL = getBaseUrl() + `/auth/verify/email-`+token;
	const textEmail = `S'il vous plait allez sur le lien ci-dessous pour valider votre compte sur ${APP_NAME}.\n\n  
    	${verifyEmailURL} \n\nSi vous n'avez pas créé de compte vous pouyvez ignorer ce mail.`;
	const htmlEmail = `<p>Clickez sur ce lien <a href="${verifyEmailURL}">${verifyEmailURL}</a> pour vérifier votre email pour votre compte ${APP_NAME}.</p>`;
	const subject = `${APP_NAME} : Confirmez votre email`;
	const resultSend = sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (email: string) => {
	const url = getBaseUrl() + `/auth/sign-in`;
	const textEmail = `Merci d'avoir valider votre compte ${APP_NAME}.\n Vous pouvez maintenant vous connecter avec ce lien \n`+url;
	const htmlEmail = `<p>Merci d'avoir valider votre compte ${APP_NAME}.</p><p>Vous pouvez maintenant vous connecter avec ce lien <a href=`+url+`>sign in</a></p>`;
	const subject = `Welcome to ${APP_NAME}`;
	const resultSend = sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const updatePasswordURL = getBaseUrl() + `/auth/password/update-` + token;
	const textEmail = `S'il vous plait clickez sur le lien ci-dessous pour changer votre mot de passe pour l'application ${APP_NAME}.\n\n  
    ${updatePasswordURL} \n\nSi vous n'avez pas créé de compte vous pouyvez ignorer ce mail.`;
	const htmlEmail = `<p>S'il vous plait clickez sur le lien ci-dessous pour changer votre mot de passe pour l'application <a href="${updatePasswordURL}">${updatePasswordURL}</a> ${APP_NAME}.</p>  
	<p>.</p><p>${updatePasswordURL}</p><p>Si vous n'avez pas créé de compte vous pouyvez ignorer ce mail</p>`;
	const subject = `${APP_NAME} : Changez votre mot de passe`;
	const resultSend = sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	email: string,
	oldEmail: string,
	token: string
) => {
	const verifyEmailURL = getBaseUrl() + `/auth/verify/email-` + token;
	const textEmail = `Veuillez visiter le lien ci-dessous pour vérifier votre adresse email pour votre compte ${APP_NAME}.\n\n  ${verifyEmailURL}`;
	const htmlEmail = `<p>Veuillez cliquer sur ce <a href="${verifyEmailURL}">lien</a> pour vérifier votre adresse email pour votre compte ${APP_NAME}.</p>  <p>Vous pouvez également visiter le lien ci-dessous.</p><p>${verifyEmailURL}</p>`;
	const subject = `Veuillez confirmer votre adresse email pour ${APP_NAME}`;
	sendEmail(email, subject, htmlEmail, textEmail);

	// Envoi d'un email à l'utilisateur concernant le changement d'email
	const url =  getBaseUrl();
	const textEmailChange = `L'adresse email de votre compte ${APP_NAME} a été modifiée de ${oldEmail} à ${email}. Si vous N'AVEZ PAS demandé cette modification, veuillez contacter le support à : `+resolve("/")+` pour annuler les changements.`;
	const htmlEmailChange = `<p>L'adresse email de votre compte ${APP_NAME} a été modifiée de ${oldEmail} à ${email}.</p><p>Si vous N'AVEZ PAS demandé cette modification, veuillez contacter le support à :`
		+` <a href='`+url+`'>`+url+`</a> pour annuler les changements.</p>`;
	const subjectChange = `Votre adresse email pour ${APP_NAME} a été modifiée`;
	sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
