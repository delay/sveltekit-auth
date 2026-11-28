<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	
	// Forcer l'affichage des détails même en production
	const showDetails = true; // Changez à false pour masquer en production
</script>

<section class="container mx-auto p-6 max-w-4xl">
	<div class="bg-red-50 border-2 border-red-500 rounded-lg p-6 shadow-lg">
		{#if page.status === 404}
			<h1 class="text-3xl font-extrabold text-red-700 mb-4">
				Page Not Found (404)
			</h1>
			<p class="text-lg text-gray-700 mb-4">
				La page que vous recherchez n'existe pas.
			</p>
			<a href="/" class="text-blue-600 underline hover:text-blue-800">Retour à l'accueil</a>
		{:else}
			<h1 class="text-3xl font-extrabold text-red-700 mb-4">
				Erreur {page.status || 500}
			</h1>
			
			{#if page.error}
				<div class="space-y-4">
					<!-- Message d'erreur -->
					<div class="bg-white p-4 rounded border border-red-300">
						<h2 class="font-bold text-lg mb-2">Message:</h2>
						<p class="text-gray-800 font-mono text-sm whitespace-pre-wrap">
							{page.error.message || 'Une erreur inattendue s\'est produite'}
						</p>
					</div>
					
					<!-- Détails supplémentaires -->
					{#if showDetails}
						<!-- Nom de l'erreur -->
						{#if page.error.name}
							<div class="bg-white p-4 rounded border border-red-300">
								<h2 class="font-bold text-lg mb-2">Type d'erreur:</h2>
								<p class="text-gray-800 font-mono text-sm">{page.error.name}</p>
							</div>
						{/if}
						
						<!-- Timestamp -->
						{#if page.error.timestamp}
							<div class="bg-white p-4 rounded border border-red-300">
								<h2 class="font-bold text-lg mb-2">Timestamp:</h2>
								<p class="text-gray-800 font-mono text-sm">{page.error.timestamp}</p>
							</div>
						{/if}
						
						<!-- URL -->
						{#if page.error.url}
							<div class="bg-white p-4 rounded border border-red-300">
								<h2 class="font-bold text-lg mb-2">URL:</h2>
								<p class="text-gray-800 font-mono text-sm">{page.error.url}</p>
							</div>
						{/if}
						
						<!-- Stack trace -->
						{#if page.error.stack}
							<div class="bg-white p-4 rounded border border-red-300">
								<h2 class="font-bold text-lg mb-2">Stack Trace:</h2>
								<pre class="text-gray-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-gray-100 p-3 rounded">{page.error.stack}</pre>
							</div>
						{/if}
						
						<!-- Error ID -->
						{#if page.error.errorId}
							<div class="bg-white p-4 rounded border border-red-300">
								<h2 class="font-bold text-lg mb-2">Error ID:</h2>
								<p class="text-gray-800 font-mono text-sm">{page.error.errorId}</p>
							</div>
						{/if}
						
						<!-- Objet d'erreur complet (debug) -->
						<details class="bg-white p-4 rounded border border-red-300">
							<summary class="font-bold text-lg cursor-pointer hover:text-red-600">
								Objet d'erreur complet (cliquez pour afficher)
							</summary>
							<pre class="text-gray-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-gray-100 p-3 rounded mt-2">{JSON.stringify(page.error, null, 2)}</pre>
						</details>
					{/if}
				</div>
			{:else}
				<p class="text-lg text-gray-700">Aucun détail d'erreur disponible.</p>
			{/if}
			
			<div class="mt-6">
				<a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
					Retour à l'accueil
				</a>
			</div>
		{/if}
	</div>
	
	<!-- Informations de débogage supplémentaires -->
	{#if showDetails}
		<div class="mt-6 bg-gray-100 p-4 rounded border border-gray-300">
			<h2 class="font-bold text-lg mb-2">Informations de débogage:</h2>
			<ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
				<li>Mode: {dev ? 'Development' : 'Production'}</li>
				<li>Status: {page.status}</li>
				<li>URL actuelle: {page.url.pathname}</li>
			</ul>
		</div>
	{/if}
</section>

<style>
	/* Styles pour améliorer la lisibilité */
	pre {
		max-height: 400px;
		overflow-y: auto;
	}
	
	details summary {
		user-select: none;
	}
</style>

