import { redirect } from '@sveltejs/kit';
import db from '$lib/server/database/drizzle.js';
import { producerTable } from '$lib/server/database/drizzle-schemas.js';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types.js';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		console.log('request Dashboard/choose but not authenticated');
		redirect(302, resolve('/auth/sign-in'));
	}
	
	if (!db) {
		throw new Error('No database connection');
	}

	// Récupérer tous les producteurs de cet utilisateur
	const producers = await db
		.select()
		.from(producerTable)
		.where(eq(producerTable.userId, locals.user.id));

	// Si aucun producteur, rediriger vers dashboard pour en créer un
	if (producers.length === 0) {
		redirect(302, resolve('/dashboard'));
	}

	// Si un seul producteur, le sélectionner automatiquement et rediriger
	if (producers.length === 1) {
		redirect(302, resolve(`/dashboard?producerId=${producers[0].id}`));
	}

	return {
		producers,
		user: locals.user
	};
};

export const actions: Actions = {
	select: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, resolve('/auth/sign-in'));
		}

		const formData = await request.formData();
		const producerId = formData.get('producerId')?.toString();

		if (!producerId) {
			return { error: 'No producer selected' };
		}

		// Rediriger vers le dashboard avec le producteur sélectionné
		redirect(302, resolve(`/dashboard?producerId=${producerId}`));
	}
};

