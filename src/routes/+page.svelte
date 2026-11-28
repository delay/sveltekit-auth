<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>OpenProduct - Trouvez des producteurs locaux près de chez vous | Made in France</title>
	<meta
		name="description"
		content="Découvrez les producteurs locaux près de chez vous avec OpenProduct. Circuits courts, made in France, produits locaux de qualité. Trouvez facilement les producteurs de votre région."
	/>
	<meta name="keywords" content="producteurs locaux, producteurs près de chez moi, made in France, circuits courts, produits locaux, agriculture locale, artisans locaux, consommer local" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="OpenProduct - Trouvez des producteurs locaux près de chez vous" />
	<meta property="og:description" content="Découvrez les producteurs locaux près de chez vous. Circuits courts, made in France, produits de qualité." />
	<meta property="og:locale" content="fr_FR" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="OpenProduct - Producteurs locaux près de chez vous" />
	<meta name="twitter:description" content="Découvrez les producteurs locaux près de chez vous. Circuits courts, made in France." />
	
	<!-- Geo tags -->
	<meta name="geo.region" content="FR" />
	<meta name="geo.placename" content="France" />
</svelte:head>

<div class="container mx-auto self-start py-8 px-4 min-h-screen">
	<section class="grid items-start gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-4 pb-8">
			<div class="mb-8">
				<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
					Trouvez les producteurs locaux de France
				</h1>
				<p class="text-surface-600-300-token mt-2">
					Soyez témoin de la qualité du made in France.
				</p>
			</div>
			<h2>Qui sommes nous?</h2>
			<p>OpenProduct est une association à but non lucratif (loi 1901) qui souhaite promouvoir les <strong>producteurs locaux</strong> et les <strong>circuits courts</strong> en permettant à tous de trouver facilement les <strong>producteurs près de chez soi</strong> et de les contacter directement. Re-découvrez le <strong>made in France</strong> et soutenez l'agriculture locale de votre région.</p>
			<h2>Que met on en place?</h2>
			<p>On recense tous les producteurs locaux de France que l'on laisse en accès libre (open-source) et sur ce site on les présente sur une carte avec des fonctionnalités de recherches. L'inscription et l'utilisation sont gratuites pour tous les producteurs afin de n'en laisser aucun de côté. Attention : On se limite aux producteurs de biens (pas de services) avec un magasin à destination du grand public (B2C).</p>
			<h2>Pourquoi?</h2>
			<ul>
				<li>Pour disposer, d'un unique point de référence pour les trouver tous (Pas un site diférent par zone géographique ou par catégorie de produits)</li>
				<li>Éviter de passer par des intermédiaires : Des sites ou des marques qui cachent souvent les producteurs pour garder toute la marge en se réfugiant derrière le label Made in France (trop souvent galvaudé). Notre statut associatif et la publication des compte nous préservent de ce biais.</li>
				<li>Pour faire jouer l'effet public : certes je ne vais peut-être pas vérifier personnellement la qualité du producteur mais je sais que d'autres sur OpenProduct ont vérifiés qu'il fabriquait réellement principalement en France.</li>
				<li>Et si en vacances ou en déplacement vous visitiez un producteur?</li>
				<li>Etc...</li>
			</ul>
			<h2>Avec quels financements?</h2>
			<p>Chacun peut donner une cotisation annuelle libre et/ou adhérer à l'association. Celle-ci est mise en avant sur le site <a href={resolve("/about#bienfaiteurs")}>ici</a> de manière à sensibiliser le consommateur aux producteurs qui s'engagent. Au vue du nombre de producteurs et consommateurs, ils nous suffirait d'une toute petite part du gâteau.</p>
			<p>Les consommateurs peuvent aussi faire un don déductible. Si vous voulez faire un don <a href="https://fr.ulule.com/openproduct/" target="_blank">ici</a>, soyez assuré de sa bonne utilisation. Nous vous en remercions. Les documents administratifs et comptes sont publics et disponibles <a href="/documents.html">ici</a> ce qui vous assure qu'il y aura toujours du monde pour vérifier le bon usage de l'argent.</p>
			<p>Nous comptons aussi sur la communauté des utilisateurs pour nous aider à recenser tous les producteurs : Écrivez-nous par email à <a href="mailto:contact@openproduct.fr">contact@openproduct.fr</a> et devenez ambassadeur OpenProduct.</p>
			<h2>L'avenir</h2>
			<p>Nous souhaitons enrichir la base de données et le site surtout pour son utilisation sur smartphone et à terme créer une application mobile mais cela demanderait plus d’argent.</p>
			<p>La priorité c’est aussi de faire connaître OpenProduct en diffusant des tracts aux producteurs et intermédiaires pour qu’ils nous fassent connaître auprès de leurs clients.</p>
			<p>Nous avons le projet de créer un label pour mettre un peu plus en valeur les producteurs qui jouent la carte de la transparence. Il permet au consommateur d'avoir une certaine garantie que la production soit réellement locale. En effet, certains peuvent être tentés d'importer les produits et de ne faire localement qu'une infime partie du travail.</p>
		</div>
		<div class="flex justify-end space-x-4">
			<a href="https://openproduct.fr/wiki/"
					class="btn variant-filled-primary min-w-32">
				En savoir plus
			</a>
		</div>
	</section>
</div>

<style>
	h3 {
		font-weight:bold;
	}
	a {
		color: blue;
	}
	ul {
		list-style-type: disc;
	}
</style>
