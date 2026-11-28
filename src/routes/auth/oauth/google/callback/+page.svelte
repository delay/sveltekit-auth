<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/dashboard');
	});
</script>

<p>Connexion Google en cours…</p>
