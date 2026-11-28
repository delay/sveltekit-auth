// src/routes/api/metrics/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/database/drizzle.js';

export const GET: RequestHandler = async () => {
	try {
		const result = await db?.execute(
			`SELECT time, query_name, duration_ms, row_count
			FROM query_metrics 
			WHERE time > NOW() - INTERVAL '24 hours'
			ORDER BY time DESC
			LIMIT 1000`
		);
		return json(result?.rows ?? []);
	} catch (error) {
		console.error('Erreur API metrics:', error);
		return json({ error: 'Erreur de base de données' }, { status: 500 });
	}
};
