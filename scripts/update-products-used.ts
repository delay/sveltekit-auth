/**
 * Script pour mettre à jour le champ 'used' des produits
 * 
 * Ce script appelle la fonction SQL update_products_used() qui:
 * 1. Initialise tous les produits à used = false
 * 2. Marque comme used = true les produits liés à un producteur
 * 3. Marque récursivement tous les parents de ces produits
 * 
 * Usage:
 *   pnpm tsx scripts/update-products-used.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Vérifier que DATABASE_URL est défini
if (!process.env.DATABASE_URL) {
	console.error('❌ DATABASE_URL n\'est pas défini dans .env');
	process.exit(1);
}

// Connexion à la base de données
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { 
	onnotice: (notice) => {
		// Afficher seulement le message des NOTICE, pas tout l'objet
		if (notice.message) {
			console.log(`   ${notice.message}`);
		}
	}
});
const db = drizzle(client);

async function updateProductsUsed() {
	try {
		console.log('🔄 Mise à jour du champ "used" des produits...\n');

		// Appeler la fonction SQL
		await db.execute(sql`SELECT update_products_used()`);

		console.log('\n✅ Fonction exécutée avec succès');

		// Récupérer les statistiques
		const statsResult = await client`
			SELECT 
				COUNT(CASE WHEN used = true THEN 1 END)::int as used_count,
				COUNT(CASE WHEN used = false THEN 1 END)::int as unused_count,
				COUNT(*)::int as total_count
			FROM products
		`;

		if (statsResult && statsResult.length > 0) {
			const { used_count, unused_count, total_count } = statsResult[0];
			
			console.log('\n📊 Statistiques:');
			console.log(`   - Produits utilisés: ${used_count}`);
			console.log(`   - Produits non utilisés: ${unused_count}`);
			console.log(`   - Total: ${total_count}`);
		}

		// Afficher quelques exemples de produits utilisés
		const usedProducts = await client`
			SELECT p.id, p.name, 
				CASE WHEN pp.product_id IS NOT NULL THEN true ELSE false END as linked_to_producer
			FROM products p
			LEFT JOIN producers_products pp ON p.id = pp.product_id
			WHERE p.used = true
			ORDER BY p.id
			LIMIT 10
		`;

		if (usedProducts && usedProducts.length > 0) {
			console.log('\n📦 Exemples de produits marqués comme utilisés:');
			usedProducts.forEach((row) => {
				const indicator = row.linked_to_producer ? '🔗' : '⬆️';
				const type = row.linked_to_producer ? 'lié à un producteur' : 'parent d\'un produit utilisé';
				console.log(`   ${indicator} #${row.id} - ${row.name} (${type})`);
			});
		}

		console.log('\n✨ Terminé!\n');
	} catch (error) {
		console.error('❌ Erreur lors de la mise à jour:', error);
		throw error;
	} finally {
		// Fermer la connexion
		await client.end();
	}
}

// Exécuter le script
updateProductsUsed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

