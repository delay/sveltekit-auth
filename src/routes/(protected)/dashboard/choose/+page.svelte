<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	
	let { data }: { data: PageData } = $props();
	let producers = $derived(data.producers);
</script>

<div class="container mx-auto p-6 max-w-4xl">
	<div class="card bg-white shadow-lg rounded-lg p-8">
		<h1 class="text-3xl font-bold mb-6 text-gray-800">
			Sélectionnez un producteur
		</h1>
		
		<p class="text-gray-600 mb-8">
			Vous avez plusieurs profils de producteur. Veuillez en sélectionner un pour accéder au tableau de bord.
		</p>

		<div class="grid gap-4">
			{#each producers as producer}
				<form method="POST" action="?/select" use:enhance class="w-full">
					<input type="hidden" name="producerId" value={producer.id} />
					
					<button
						type="submit"
						class="w-full text-left p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h2 class="text-xl font-semibold text-gray-800 mb-2">
									{producer.companyName}
								</h2>
								
								{#if producer.shortDescription}
									<p class="text-gray-600 mb-3">
										{producer.shortDescription}
									</p>
								{/if}
								
								<div class="flex flex-wrap gap-4 text-sm text-gray-500">
									{#if producer.city}
										<span class="flex items-center gap-1">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											{producer.city}
											{#if producer.postCode}
												({producer.postCode})
											{/if}
										</span>
									{/if}
									
									{#if producer.category}
										<span class="flex items-center gap-1">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
											</svg>
											{producer.category}
										</span>
									{/if}
								</div>
							</div>
							
							<div class="ml-4">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</div>
					</button>
				</form>
			{/each}
		</div>

		<div class="mt-8 pt-6 border-t border-gray-200">
			<p class="text-sm text-gray-500 text-center">
				Vous pouvez créer un nouveau profil de producteur depuis le tableau de bord.
			</p>
		</div>
	</div>
</div>

<style>
	button:hover svg {
		transform: translateX(4px);
		transition: transform 0.2s;
	}
</style>

