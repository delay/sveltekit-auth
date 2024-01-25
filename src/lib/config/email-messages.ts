import sendEmail from '$lib/server/email-send';
import { BASE_URL, APP_NAME } from '$lib/config/constants';
import { sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
import { translatePath } from '$lib/i18n-routing';
import * as m from '$paraglide/messages';

// Send an email to verify the user's address
export const sendVerificationEmail = async (email: string, token: string, lang: AvailableLanguageTag = sourceLanguageTag, defLang: AvailableLanguageTag = sourceLanguageTag) => {
	const verifyEmailURL = BASE_URL + translatePath(`/auth/verify/email-${token}`, lang, defLang);
	const textEmail = `${m.emailVerifyMsgVisitLink({appbase: APP_NAME})}.\n\n  
    ${verifyEmailURL} \n\n${m.emailVerifyMsgIfNotYou()}`;
	const htmlEmail = `<p>${m.pleaseClickThis()} <a href="${verifyEmailURL}">link</a> ${m.emailVerifyMsgToVerify({app: APP_NAME})}.</p>  <p>${m.emailVerifyMsgAlsoVisit()}</p><p>${verifyEmailURL}</p><p>${m.emailVerifyMsgIfNotYou()}</p>`;
	const subject = `${m.emailVerifyMsgConfirm({app: APP_NAME})}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (email: string, lang: AvailableLanguageTag = sourceLanguageTag, defLang: AvailableLanguageTag = sourceLanguageTag) => {
	const welcomeEmailURL = BASE_URL + translatePath(`/auth/sign-in`, lang, defLang);
	const textEmail = `${m.emailWelcomeThanks({app: APP_NAME})}\n\n${welcomeEmailURL}`;
	const htmlEmail = `<p>${m.emailWelcomeThanksOnly({app: APP_NAME})}</p><p>${m.youCanNow()} <a href="${welcomeEmailURL}">${m.signin()}</a> ${m.toYourAcc()}.</p>`;
	const subject = `${m.emailWelcomeSubject({app: APP_NAME})}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (email: string, token: string, lang: AvailableLanguageTag = sourceLanguageTag, defLang: AvailableLanguageTag = sourceLanguageTag) => {
	const updatePasswordURL = BASE_URL + translatePath(`/auth/password/update-${token}`, lang, defLang);
	const textEmail = `${m.emailPwdResetVisitLink()} ${m.emailPwdResetToChange({app:APP_NAME})}.\n\n  
    ${updatePasswordURL} \n\n${m.emailPwdResetIfNotYou()}`;
	const htmlEmail = `<p>${m.pleaseClickThis()} <a href="${updatePasswordURL}">link</a> ${m.emailPwdResetToChange({app:APP_NAME})}.</p>  
	<p>${m.emailVerifyMsgAlsoVisit()}</p><p>${updatePasswordURL}</p><p>${m.emailPwdResetIfNotYou()}</p>`;
	const subject = `${m.emailPwdResetSubject({app: APP_NAME})}`;
	const resultSend = sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	email: string,
	oldEmail: string,
	token: string,
	lang: AvailableLanguageTag = sourceLanguageTag,
	defLang: AvailableLanguageTag = sourceLanguageTag
) => {
	const verifyEmailURL = BASE_URL + translatePath(`/auth/verify/email-${token}`, lang, defLang);
	const textEmail = `${m.emailVerifyMsgVisitLink({appbase: APP_NAME})}\n\n  ${verifyEmailURL}`;
	const htmlEmail = `<p>${m.pleaseClickThis()} <a href="${verifyEmailURL}">link</a> ${m.emailVerifyMsgToVerify({app: APP_NAME})}.</p>  <p>You can also visit the link below.</p><p>${verifyEmailURL}</p>`;
	const subject = `${m.emailVerifyMsgConfirm({app: APP_NAME})}`;
	sendEmail(email, subject, htmlEmail, textEmail);

	//send email to user about email change.
	const textEmailChange = `${m.emailUpdateChangeEmail({app: APP_NAME, oldEmail, email, appbase: BASE_URL})}`;
	const htmlEmailChange = `${m.emailUpdateChangeEmailHtml({app: APP_NAME, oldEmail, email, appbase: BASE_URL})}`;
	const subjectChange = `${m.emailUpdateChangeSubject({app: APP_NAME})}`;
	sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
