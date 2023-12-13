<script lang="ts">
	import '../app.pcss';
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import Navigation from '$lib/components/navigation/navigation.svelte';

	export let data: any;
	let user: Lucia.UserAttributes;
	$: user = data.user;
	const flash = getFlash(page);
	$: console.log('+layout.svelte root flash: ' + $flash);
	/*$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast($flash.message, {
					position: 'bottom-right',
					duration: 5000,
					style: 'background: #000; color: #fff;'
				});
				break;
			case 'error':
				toast.error($flash.message);
				break;
		}
	}*/
</script>

<ModeWatcher />
<div class="relative flex min-h-screen flex-col">
	<Navigation {user} />
	<div class="mt-8 md:mt-12">
		<slot />
	</div>
</div>
