<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, Package, ChevronRight, CircleAlert } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import ProductExplorer from '$lib/components/product_explorer/product_explorer.svelte';

	let { data, form } = $props();
	

	let searchQuery = $state(data.searchQuery || '');
	let searchResults = $state(data.searchResults || []);
	let selectedProduct: any = $state(null);
	let loading = $state(false);

	// Mettre à jour les résultats quand les données changent
	$effect(() => {
		if (data.searchResults) {
			searchResults = data.searchResults;
		}
	});

	// Allow search by URL (At page init)
	function handleSearch(searchPattern: string) {
		if (!searchPattern.trim()) return;
		goto(`/product?q=${encodeURIComponent(searchPattern)}`);
		searchQuery = searchPattern;
	}
	// Search on enter press
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch(searchQuery);
		}
	}

	let productExplorer: ProductExplorer;
	async function viewProductTree(productId: number) {
		if (productExplorer) {
			await productExplorer.setProductTree(productId);
		}
	}
</script>

<svelte:head>
	<title>Recherche de Produits</title>
</svelte:head>

<div class="container mx-auto p-8 min-h-screen">
	<div class="max-w-6xl mx-auto">
		<!-- En-tête -->
		<div class="text-center mb-8">
			<h1 class="h1 mb-2">
				Recherche de Produits
			</h1>
			<p class="text-surface-600-300-token">
				Recherchez un produit et découvrez tous ses sous-produits associés
			</p>
		</div>

		<!-- Barre de recherche -->
		<div class="card p-6 mb-8">
			<form method="GET" action="/product" class="flex gap-4">
				<div class="flex-1 relative">
					<div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
						<Search size={20} />
					</div>
					<input type="text"
						name="q"
						placeholder="Ex: Céramique, Assiette, Cuivre..."
						class="input pl-10 pr-4 py-3"
						bind:value={searchQuery}
						onkeypress={handleKeyPress}
					/>
				</div>
				<button 
					type="submit"
					class="btn variant-filled-primary"
					disabled={loading}
				>
					{loading ? 'Recherche...' : 'Rechercher'}
				</button>
			</form>

			{#if data.error || form?.error}
				<aside class="alert variant-filled-error mt-4">
					<div class="alert-message flex items-center gap-2">
						<CircleAlert size={20} />
						<span>{data.error || form?.error}</span>
					</div>
				</aside>
			{/if}
		</div>

		<!-- Résultats de recherche -->
		{#if searchResults.length > 0}
			<div class="card p-6 mb-8">
				<h2 class="h2 mb-4">
					Résultats ({searchResults.length})
				</h2>
				<div class="grid gap-4">
					{#each searchResults as product (product.id)}
						<button
							type="button"
							class="p-4 border-2 rounded-lg cursor-pointer transition text-left w-full {product.is_direct_match ? 'border-primary-500 bg-primary-50' : 'border-surface-300 hover:border-primary-300'}"
							onclick={() => viewProductTree(product.id)}
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<Package class='text-primary-600' size={24} />
									<div>
										<h3 class="h4">
											{product.name}
											{#if product.is_direct_match}
												<span class="badge variant-filled-primary ml-2">
													Correspondance directe
												</span>
											{/if}
										</h3>
										<div class="flex items-center gap-2 text-sm text-surface-600-300-token mt-1">
											<span>Niveau: {product.depth}</span>
										</div>
									</div>
								</div>
								<ChevronRight class="text-surface-400" size={20} />
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Composant Arbre du produit -->
		<ProductExplorer bind:this={productExplorer}/>

		<!-- Message si pas de recherche -->
		{#if searchResults.length === 0 && !selectedProduct && !data.searchQuery}
			<div class="card p-8 text-center">
				<Package size={64} class="mx-auto text-surface-400 mb-4" />
				<h3 class="h3 mb-2">Recherchez un produit</h3>
				<p class="text-surface-600-300-token">
					Utilisez la barre de recherche ci-dessus pour trouver des produits et leurs sous-produits.
				</p>
			</div>
		{/if}

		<!-- Message si aucun résultat -->
		{#if searchResults.length === 0 && data.searchQuery && !data.error}
			<div class="card p-8 text-center">
				<CircleAlert size={64} class="mx-auto text-warning-500 mb-4" />
				<h3 class="h3 mb-2">Aucun résultat</h3>
				<p class="text-surface-600-300-token">
					Aucun produit trouvé pour "{data.searchQuery}". Essayez avec d'autres termes.
				</p>
			</div>
		{/if}
	</div>
</div>

