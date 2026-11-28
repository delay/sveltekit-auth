<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/dashboard', { invalidateAll: true });
	});
</script>

<p>Connexion Google en cours…</p>
