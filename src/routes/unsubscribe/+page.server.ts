import type { PageServerLoad, Actions } from './$types';
import db from '$lib/server/database/drizzle.js';
import { sql } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';


export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token') || '';
	if (!db) {
		return { results: [], error: 'Database connection failed' };
	}
	console.log("unsubcribe(",token,")");
	let query = sql`Update producers set send_email='ko' where token=${token}`;
	const pgDialect = new PgDialect();
	console.log("SQL", pgDialect.sqlToQuery(query));
	try {
		// Utiliser la fonction PostgreSQL search_products_with_children
		const results = await db?.execute(query);
		return {
			valid: true
		};
	} catch (error) {
		console.error('Fail update token:', error);
		return { valid: false, error: 'Fail update token : '+token };
	}
};
export const actions: Actions = {
	default: async (event) => {
	}
};

