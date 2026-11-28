import { DATABASE_URL } from '$env/static/private';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { building } from '$app/environment';

let db:NodePgDatabase|null;

async function getDb() {
	if (building) {
		return null; // ou un mock
	}
	if (!db) {
		const pool = new pg.Pool({connectionString: DATABASE_URL});
		await pool.connect();
		db = drizzle(pool);
	}
	return db;
}
db = await getDb();
export default db;