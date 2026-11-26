<script lang="ts">
	import OpenProductMap from './OpenProductMap.svelte';
</script>

<svelte:head>
	<title>Carte des producteurs locaux près de chez vous | OpenProduct</title>
	<meta name="description" content="Trouvez des producteurs locaux près de chez vous sur notre carte interactive. Circuits courts, made in France, produits frais de votre région. Localisez facilement les producteurs autour de vous." />
	<meta name="keywords" content="carte producteurs locaux, producteurs près de moi, trouver producteur local, carte interactive, circuits courts, made in France" />
	
	<!-- Open Graph -->
	<meta property="og:title" content="Carte des producteurs locaux près de chez vous" />
	<meta property="og:description" content="Trouvez des producteurs locaux près de chez vous sur notre carte interactive." />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<OpenProductMap />
	</section>
</div>