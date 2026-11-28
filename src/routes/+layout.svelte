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
	import { afterNavigate } from '$app/navigation';
	import IconMenu from '@lucide/svelte/icons/menu';

	// Off-canvas menu, only used on narrow screens (< md).
	let menuOpen = false;
	let touchStartX = 0;
	let touchStartY = 0;
	const EDGE = 30; // px from the left edge where a swipe can start
	const SWIPE = 60; // min horizontal distance of a swipe

	afterNavigate(() => (menuOpen = false));

	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}
	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy)) return;
		if (dx > 0 && touchStartX <= EDGE) menuOpen = true; // swipe right from the edge
		else if (dx < 0 && menuOpen) menuOpen = false; // swipe left to close
	}

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

<svelte:window on:touchstart={onTouchStart} on:touchend={onTouchEnd} />

<main style="min-height: 100vh; overflow-y: auto;">
	<div class="card border-surface-100-900 grid h-screen w-full grid-cols-1 border-[1px] md:grid-cols-[auto_1fr]">
		<!-- Narrow screens: hover zone on the left edge (mouse) + button (tap) -->
		<div class="fixed inset-y-0 left-0 z-40 w-2 md:hidden" role="presentation" on:mouseenter={() => (menuOpen = true)}></div>
		<button
			type="button"
			class="btn-icon preset-filled fixed top-2 left-2 z-40 md:hidden"
			aria-label="Ouvrir le menu"
			on:click={() => (menuOpen = true)}
		>
			<IconMenu />
		</button>
		{#if menuOpen}
			<button
				type="button"
				class="fixed inset-0 z-40 bg-black/40 md:hidden"
				aria-label="Fermer le menu"
				on:click={() => (menuOpen = false)}
			></button>
		{/if}

		<div
			class="!bg-white dark:!bg-surface-900 fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:static md:z-auto md:translate-x-0 {menuOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
			role="presentation"
			on:mouseleave={() => (menuOpen = false)}
		>
			<Navigation />
		</div>
		<div class="flex min-h-0 min-w-0 items-center justify-center overflow-auto">
			<slot />
		</div>
	</div>
</main>
