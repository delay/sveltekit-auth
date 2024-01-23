<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import { defaultLanguage, translatePath } from '$lib/i18n-routing';
	import * as m from "$paraglide/messages";
	import { type AvailableLanguageTag, sourceLanguageTag } from '$paraglide/runtime';
	import { SetIdentityMailFromDomainCommand } from '@aws-sdk/client-ses';
	import { onMount, tick } from 'svelte';

	const setIntro = (lang: AvailableLanguageTag) => {
		return m.intro({}, {languageTag: currlang});
	}
	//let currlang: AvailableLanguageTag;
	$: currlang = ($page.params.lang ?? defaultLanguage) as AvailableLanguageTag;
	let introText = m.loading();

	onMount(() => {
		introText = setIntro(currlang);
	});
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="Sveltekit Auth Starter - An open source auth starter project utilizing lucia-auth, shadcn-svelte ui, prisma and sveltekit."
	/>
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>
			{#key currlang}
			<p class="max-w-[700px] text-lg text-muted-foreground">
				{@html introText}
			</p>
			{/key}
		</div>
		<div class="flex gap-4">
			<Button on:click={() => goto(translatePath('/auth/sign-in', currlang))}>{m.signin()}</Button>
			<Button on:click={() => goto(translatePath('/auth/sign-up', currlang))} variant="outline">{m.signup()}</Button>
		</div>
	</section>
</div>
