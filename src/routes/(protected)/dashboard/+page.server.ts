import { error, fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/database/drizzle.js';
import { producerTable } from '$lib/server/database/drizzle-schemas.js';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types.js';
import { resolve } from '$app/paths';
import { producerSchema } from '$lib/config/zod-schemas.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { sql, DrizzleQueryError } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';

const ADMIN_ROLE = 'ADMIN';

async function getProducts(producer_id: number | null) {
	// console.log("getProducts(",producer_id,")");
	if(producer_id == null) {
		return null;
	}
	const productResult = await db?.execute(
		sql`SELECT p.id, p.name
			FROM producers_products pp 
			INNER JOIN products p on p.id=pp.product_id
			WHERE pp.producer_id = ${producer_id}`
	);
	const rows = productResult?.rows;
	// console.log("getProducts(",producer_id,") => ",rows);
	return rows;
}

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user) {
		console.log('request Dashboard but not authenticated');
		redirect(302, resolve('/auth/sign-in'));
	}
	if (!db) {
		return fail(400, {error: 'No database connection.'});
	}

	// Vérifier si l'utilisateur est admin
	const isAdmin = locals.user.role === ADMIN_ROLE;
	
	// Récupérer le producerId depuis l'URL si présent
	const producerIdParam = url.searchParams.get('producerId');
	
	// Récupérer tous les producteurs de cet utilisateur (ou tous si admin)
	let allProducers;
	if (isAdmin && producerIdParam) {
		// Admin avec producerId: charger seulement ce producteur
		allProducers = await db
			.select()
			.from(producerTable)
			.where(eq(producerTable.id, parseInt(producerIdParam)));
	} else {
		// Utilisateur normal: charger ses producteurs
		allProducers = await db
			.select()
			.from(producerTable)
			.where(eq(producerTable.userId, locals.user.id));
	}
	
	// Si plusieurs producteurs et aucun n'est sélectionné, rediriger vers /dashboard/choose (sauf admin)
	if (allProducers.length > 1) {
		redirect(302, resolve('/dashboard/choose'));
	}

	// Déterminer quel producteur utiliser
	let producer = null;
	if (producerIdParam) {
		// Utiliser le producteur spécifié dans l'URL
		const producerIdNum = parseInt(producerIdParam);
		producer = allProducers.find(p => p.id === producerIdNum) || null;
		
		// Si le producteur spécifié n'appartient pas à l'utilisateur, erreur (sauf admin)
		if (!producer && !isAdmin) {
			throw error(403, 'Producer not found or access denied');
		}
	} else if (allProducers.length === 1) {
		// Un seul producteur, l'utiliser automatiquement
		producer = allProducers[0];
	}

	// Initialiser le formulaire avec superValidate
	const formData = producer ? {
		companyName: producer.companyName,
		firstName: producer.firstName || '',
		lastName: producer.lastName || '',
		shortDescription: producer.shortDescription || '',
		description: producer.description || '',
		postCode: producer.postCode || 0,
		city: producer.city || '',
		address: producer.address || '',
		category: producer.category || '',
		phoneNumber1: producer.phoneNumber1 || '',
		phoneNumber2: producer.phoneNumber2 || '',
		siretNumber: producer.siretNumber || '',
		website1: producer.website1 || '',
		website2: producer.website2 || '',
		website3: producer.website3 || ''
	} : undefined;
	
	const form = await superValidate(formData, zod4(producerSchema));
	
	// Mettre à jour le producerId dans locals.user si un producteur est sélectionné
	if (locals.session && producer?.id != null) {
		locals.user.producerId = producer.id;
	}
	
	const products = await getProducts(locals.user.producerId);
	return {
		form,
		producer,
		products: products,
		user: locals.user,
		allProducers: allProducers,
		isAdmin: isAdmin
	};
};

async function getXYFromAddress(address: string) {
	const url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURI(address);
	console.log("Call API : ", url);
	const response = await fetch(url);
	const res = await response.json();
	if (res.features.length == 0) return null;
	const feature = res.features[0];
	const coordinates = feature.geometry.coordinates;
	let addr = feature.properties;
	addr.latitude = coordinates[1];
	addr.longitude = coordinates[0];
	return addr;
}

export const actions: Actions = {
	update: async ({ request, locals, url }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}
		if (!db) {
			return fail(401, { message: 'Fail connect to database' });
		}
    	const form = await superValidate(request, zod4(producerSchema));

		const data = form.data;
		const isAdmin = locals.user.role === ADMIN_ROLE;
		const producerIdParam = url.searchParams.get('producerId');
		
		try {
			// Vérifier si un profil producteur existe déjà
			let existingProducer;
			if (isAdmin && producerIdParam) {
				// Admin: charger le producteur spécifié
				existingProducer = await db
					.select()
					.from(producerTable)
					.where(eq(producerTable.id, parseInt(producerIdParam)))
					.limit(1);
			} else {
				// Utilisateur normal: charger son producteur
				existingProducer = await db
					.select()
					.from(producerTable)
					.where(eq(producerTable.userId, locals.user.id))
					.limit(1);
			}

			const address = data.address || null;
			const postCode = data.postCode || null;
			const city = data.city || null;
			const addr = await getXYFromAddress(address + ", " + postCode + " " + city)
			let latitude = 0.0;
			let longitude = 0.0;
			if (addr) {
				latitude = addr.latitude;
				longitude = addr.longitude;
			}

			const producerData = {
				userId: locals.user.id,
				companyName: data.companyName,
				firstName: data.firstName || null,
				lastName: data.lastName || null,
				shortDescription: data.shortDescription || null,
				description: data.description || null,
				postCode: data.postCode || 0,
				city: data.city,
				address: data.address,
				category: data.category || null,
				phoneNumber1: data.phoneNumber1 || null,
				phoneNumber2: data.phoneNumber2 || null,
				siretNumber: data.siretNumber || null,
				website1: data.website1 || null,
				website2: data.website2 || null,
				website3: data.website3 || null,
				updatedAt: new Date(),
				latitude: latitude,
				longitude: longitude,
			};
			if (existingProducer.length > 0) {
				// Mettre à jour le profil existant
				if (isAdmin && producerIdParam) {
					// Admin: mettre à jour par ID de producteur
					await db
						.update(producerTable)
						.set(producerData)
						.where(eq(producerTable.id, parseInt(producerIdParam)));
				} else {
					// Utilisateur normal: mettre à jour par userId
					await db
						.update(producerTable)
						.set(producerData)
						.where(eq(producerTable.userId, locals.user.id));
				}
			} else {
				// Créer un nouveau profil - l'ID sera auto-généré par SERIAL
				await db
					.insert(producerTable)
					.values({
						...producerData,
						createdAt: new Date()
					});
			}
			return { form };
		} catch (error) {
			let message = 'Une erreur s\'est produite lors de la sauvegarde de votre profil.';
			if (error instanceof DrizzleQueryError) {
				message += " : "+error.cause?.detail+". Tentez de coriger le problème si vous pouvez.";
			}
			message += " Si le problème persiste signalez le par mail : contact@openproduct.fr."
			console.error('Error saving producer profile:', error);
			form.errors.general = [message];
			return fail(500, { form });
		}
	},
	removeProduct: async ({ request, locals, url }) => {
		// console.log("removeProduct");
		const formData = await request.formData();
		const product_id = formData.get('id')?.toString();
		let producerId = +(url.searchParams.get('producerId') || 0);
		if (!locals.user) return [];
		const isAdmin = locals.user.role === ADMIN_ROLE;
		if (!isAdmin || !producerId) {
			producerId = locals.user.producerId;
		}
		const query = sql`DELETE FROM producers_products
				WHERE producer_id = ${producerId} AND product_id=${product_id}`;
		const pgDialect = new PgDialect();
		console.log("SQL: ", pgDialect.sqlToQuery(query), locals.user);
		const result = await db?.execute(query);
		if (!result) {
			console.log("SQL Errors ")
		}
		return getProducts(producerId);
	},
	addProducts: async ({ request, locals, url }) => {
		// console.log("addProducts");
		const formData = await request.formData();
		const productIdsJson = formData.get('productIds')?.toString();
		if (!productIdsJson) {
			return fail(400, { message: 'No products selected' });
		}
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}
		let producerId = +(url.searchParams.get('producerId') || 0);
		const isAdmin = locals.user.role === ADMIN_ROLE;
		if (!isAdmin || producerId==0) {
			producerId = locals.user.producerId;
		}
		console.log("addProducts for producer=", producerId);
		if (!producerId) {
			return fail(401, { message: 'Unauthorized' });
		}
		try {
			const productIds = JSON.parse(productIdsJson);
			// Insérer les nouvelles relations (ignorer les doublons)
			for (const productId of productIds) {
				const query = sql`
					INSERT INTO producers_products (producer_id, product_id)
					VALUES (${producerId}, ${productId})
					ON CONFLICT (producer_id, product_id) DO NOTHING`;
				await db?.execute(query);
			}
			return getProducts(producerId);
		} catch (error) {
			console.error('Error adding products:', error);
			return fail(500, { message: 'Failed to add products' });
		}
	}
};

