// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
//import { pg } from '@lucia-auth/adapter-postgresql';
//import postgres from 'pg';
//import { DATABASE_URL } from '$env/static/private';

import { prisma } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

/*const pool = new postgres.Pool({
	connectionString: DATABASE_URL
});*/

export const auth = lucia({
	adapter: prisma(new PrismaClient(), {
		user: 'authUser',
		key: 'authKey',
		session: 'authSession'
	}),
	//adapter: pg(pool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			userId: data.id,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			role: data.role,
			verified: data.verified,
			receiveEmail: data.receiveEmail,
			token: data.token
		};
	}
});

export type Auth = typeof auth;
