import db from '$lib/server/database/drizzle.js';
import { sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url, request }) => {
	let searchQuery = url.searchParams.get('q');
	let searchSQLpattern = "";
	let query;
	if (!searchQuery ) {
		searchQuery = '';
		query = sql`SELECT * FROM products
			WHERE hierarchy_level<=3
			LIMIT 20`;
	} else {
		searchSQLpattern = '%'+searchQuery.toLowerCase()+'%';
		query = sql`SELECT * FROM products
			WHERE name like ${searchSQLpattern}
			LIMIT 20`;
	}
	try {
		// Utiliser la fonction PostgreSQL search_products_with_children
		const results = await db?.execute(query);
		return {
			searchResults: results?.rows,
			searchQuery
		};
	} catch (error) {
		console.error('Erreur de recherche:', error);
		return {
			searchResults: [],
			searchQuery,
			error: 'Erreur lors de la recherche'
		};
	}
};
/** @satisfies {import('./$types').Actions} */
export const actions: Actions = {
	search: async ({ request }) => {
		const formData = await request.formData();
		const query = formData.get('query')?.toString() || '';

		if (!query.trim()) {
			return {
				success: false,
				error: 'Veuillez entrer un terme de recherche'
			};
		}

		try {
			const results = await db?.execute(sql`
				SELECT * FROM search_products_with_children(${query})
				ORDER BY is_direct_match DESC, hierarchy_level, name
			`);

			return {
				success: true,
				results: results?.rows
			};
		} catch (error) {
			console.error('Erreur de recherche:', error);
			return {
				success: false,
				error: 'Erreur lors de la recherche'
			};
		}
	},

	getProductTree: async ({ request }) => {
		const formData = await request.formData();
		const productId = parseInt(formData.get('productId')?.toString() || '0');
		console.log("getProductTree(",productId,")");

		if (!productId) {
			return {
				success: false,
				error: 'ID de produit invalide'
			};
		}

		try {
			// Récupérer le produit principal
			const productResult = await db?.execute(
				sql`SELECT * FROM products WHERE id = ${productId}`
			);
			if (productResult?.rows.length === 0) {
				return {
					success: false,
					error: 'Produit non trouvé'
				};
			}
			const product = productResult?.rows[0];
			// Récupérer tous les descendants
			const descendantsResult = await db?.execute(
				sql`SELECT descendant_id as id, name, d.depth
					FROM get_all_descendants(${productId}) d
					ORDER BY depth, name`
			);
			// console.log("descendantsResult?.rows:", descendantsResult?.rows);
			const ascendantsResult = await db?.execute(
				sql`SELECT ancestor_id as id, name, d.depth
					FROM get_all_ancestors(${productId}) d
					ORDER BY depth, name`
			);
			return {
				success: true,
				product,
				descendants: descendantsResult?.rows,
				ascendants: ascendantsResult?.rows
			};
		} catch (error) {
			console.error('Erreur lors de la récupération de l\'arbre:', error);
			return {
				success: false,
				error: 'Erreur lors de la récupération de l\'arbre du produit'
			};
		}
	}
};
