<script lang="ts">
	import { Search, Package, ChevronRight, CircleAlert } from 'lucide-svelte';

	interface Props {
		error: string;
		valid: boolean;
	}
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Désinscription des communications par mail</title>
</svelte:head>

<div class="container mx-auto p-8 min-h-screen">
	<div class="max-w-6xl mx-auto">
		<div class="card p-8 w-full max-w-md">
			{#if !data.valid}
				<div class="card text-center mb-6">
					<h2 class="h2 font-bold">Une erreur est survenue.</h2>
					<div class="alert-message flex items-center gap-2">
						<span>{data.error}</span>
					</div>
				</div>
			{:else}
				<div class="card text-center mb-6">
					Vous êtes maintenant désinscrit des communications par mail OpenProduct.
				</div>
			{/if}
		</div>
	</div>
</div>

