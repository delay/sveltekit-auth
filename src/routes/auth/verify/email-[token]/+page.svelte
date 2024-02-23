<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { Loader2 } from 'lucide-svelte';
	export let data: { heading?: string; message?: string };
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		{#if data.heading}
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{data.heading}
			</h1>
		{/if}
		{#if data.message}
			<p class="max-w-[700px] text-lg text-muted-foreground">{@html data.message}</p>
		{:else}
			<Loader2 class="mr-2 h-12 w-12 animate-spin" />
		{/if}
	</div>
</section>
