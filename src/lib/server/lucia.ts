// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { userTable, sessionTable } from '$lib/server/database/drizzle-schemas';
import db from '$lib/server/database/drizzle';
import { dev } from '$app/environment';
import { Google, Facebook, Apple } from 'arctic';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	APPLE_CLIENT_ID,
	APPLE_TEAM_ID,
	APPLE_KEY_ID,
	APPLE_CERTIFICATE
} from '$env/static/private';
import { resolve } from '$app/paths';
import { BASE_URL } from '$lib/config/constants';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: !dev
		}
	},
	sessionExpiresIn: new TimeSpan(30, 'd'), // no more active/idle
	getUserAttributes: (attributes) => {
		return {
			userId: attributes.id,
			provider: attributes.provider,
			providerId: attributes.providerId,
			email: attributes.email,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			role: attributes.role,
			verified: attributes.verified,
			receiveEmail: attributes.receiveEmail,
			token: attributes.token,
			producerId: attributes.producerId
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		//DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	provider: string;
	providerId: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	verified: boolean;
	receiveEmail: boolean;
	token: string;
	producerId: number
}

/*interface DatabaseSessionAttributes {
	sessionExpiresIn: number;
}*/

const googleRedirectUrl = `${BASE_URL}${resolve('/auth/oauth/google/callback')}`;
const facebookRedirectUrl = `${BASE_URL}${resolve('/auth/oauth/facebook/callback')}`;
const appleRedirectUrl = `${BASE_URL}${resolve('/auth/oauth/apple/callback')}`;

export const googleOauth = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, googleRedirectUrl);
export const facebookOauth = new Facebook(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, facebookRedirectUrl);

// Apple requires the private key (PKCS8) as a Uint8Array
let applePrivateKey: Uint8Array | undefined;
if (APPLE_CERTIFICATE) {
	const cert = APPLE_CERTIFICATE.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
	applePrivateKey = new TextEncoder().encode(cert);
}
export const appleOauth = applePrivateKey
	? new Apple(APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, applePrivateKey, appleRedirectUrl)
	: (null as any);

