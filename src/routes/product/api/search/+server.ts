import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/database/drizzle.js';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const searchPattern = url.searchParams.get('q') || '';
	const usedOnly = url.searchParams.get('usedOnly') === 'true';
	
	if (!db) {
		return json({ results: [], error: 'Database connection failed' }, { status: 500 });
	}
	
	let query;
	if (searchPattern=='') {
		if (usedOnly) {
			query = sql`SELECT * FROM products
				WHERE hierarchy_level<=3 AND used = true`;
		} else {
			query = sql`SELECT * FROM products
				WHERE hierarchy_level<=3`;
		}
	} else {
		const searchSQLpattern = '%'+searchPattern.toLowerCase()+'%';
		if (usedOnly) {
			query = sql`SELECT * FROM products
				WHERE name like ${searchSQLpattern} AND used = true
				LIMIT 20`;
		} else {
			query = sql`SELECT * FROM products
				WHERE name like ${searchSQLpattern}
				LIMIT 20`;
		}
	}
	
	try {
		// Utiliser la fonction PostgreSQL search_products_with_children
		const results = await db?.execute(query);
		return json({
			results: results.rows || [],
			query: searchPattern
		});
	} catch (error) {
		console.error('Search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
};


