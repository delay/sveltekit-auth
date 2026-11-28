import { deserialize } from '$app/forms';
import { resolve } from '$app/paths';

// Voir l'arbre d'un produit
export async function getProductTree(productId: number) {
	try {
		const formData = new FormData();
		formData.append('productId', productId.toString());
		const response = await fetch(resolve('/product')+'?/getProductTree', {
			method: 'POST',
			body: formData
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success' && result.data) {
			const prod = result.data;
			// console.log("getProductTree1() => ", prod);
			return prod;
		} else {
			console.error('getProductTree() : Error with status : ', result.status);
			return null;
		}
	} catch (err) {
		console.error('Erreur:', err);
	}
}