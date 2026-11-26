<script lang="ts">
	import type { PageData } from './$types';
	import '../app.pcss';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import { toast } from 'svelte-sonner';
	import Navigation from '$lib/components/navigation/navigation.svelte';

	export let data: any;
	let user: PageData['user'];
	$: user = data.user;
	const flash = getFlash(page);
	//$: console.log('+layout.svelte root flash: ' + JSON.stringify($flash));
	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				//console.log('flash.message.success: ' + $flash.message);
				toast.success($flash.message);
				break;
			case 'error':
				//console.log('flash.message.error: ' + $flash.message);
				toast.error($flash.message);
				break;
		}
	}
</script>

<main style="min-height: 100vh; overflow-y: auto;">
	<div class="card border-surface-100-900 grid grid h-screen w-full grid-cols-[auto_1fr] border-[1px]">
		<Navigation {user} />
		<div class="flex items-center justify-center">
			<slot />
		</div>
	</div>
</main>
