<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	export let data: any;
	let user: any = data.user;
</script>

<ModeWatcher />
<div class="relative flex min-h-screen flex-col">
	<Navigation {user} />
	<div class="mt-8 md:mt-12">
		<slot />
	</div>
</div>
