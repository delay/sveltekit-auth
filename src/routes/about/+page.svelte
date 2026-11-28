<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="OpenProduct, une association des producteurs locaux."
	/>
</svelte:head>

<div class="container mx-auto py-8 px-4 min-h-screen">
	<section class="grid items-start gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-4 pb-8">
			<h3>{APP_NAME}</h3>
			<p>Adresse: 7 le Surget, 22 980 Plélan-le-Petit</p>
			<p>Téléphone: <a href="tel:+33985104873">(+33)9 85 10 48 73</a></p>
			<p>Courriel: <a href="mailto:contact@openproduct.fr">contact@openproduct.fr</a></p>
			<br>
			<p>©️ Tous droits réservés sur le nom OpenProduct, le logo et tout ce qui tourne autour de la marque. Pour le reste, tout est ouvert.</p>
		</div>
		<div class="flex max-w-[980px] flex-col items-start gap-4 pb-8">
			<h3>Bienfaiteurs</h3>
			<p>Voici la liste des personnes (entreprise ou personnes physiques) qui ont données (et acceptées d'apparaitre) au cours des 12 derniers mois.</p>
			<table>
				<caption>
					Liste des Donateurs
				</caption>
				<thead>
					<tr><th>Nom</th><th>Montant</th></tr>
				</thead>
				<tbody>
					<tr><td>Albéric de la Crochais</td><td>350 euros</td></tr>
				</tbody>
				<tfoot>
					<tr><td>Nom</td><td>Montant</td></tr>
				</tfoot>
			</table>
		</div>
	</section>
</div>

<style>
	a {
		color: blue;
	}
	table {
		border-collapse: collapse;
		border: 2px solid rgb(140 140 140);
		font-family: sans-serif;
		font-size: 0.8rem;
		letter-spacing: 1px;
	}

	caption {
		caption-side: bottom;
		padding: 10px;
		font-weight: bold;
	}
	thead, tfoot {
		background-color: rgb(228 240 245);
	}
	th, td {
		border: 1px solid rgb(160 160 160);
		padding: 8px 10px;
	}
	td:last-of-type {
		text-align: center;
	}
	tbody > tr:nth-of-type(even) {
		background-color: rgb(237 238 242);
	}
	tfoot th {
		text-align: right;
	}
	tfoot td {
		font-weight: bold;
	}
</style>