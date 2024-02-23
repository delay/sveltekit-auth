<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="Sveltekit Auth Starter - An open source auth starter project utilizing lucia-auth, skeleton ui, prisma and sveltekit."
	/>
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				This is a sveltekit auth starter. It is an <a
					href="https://github.com/delay/sveltekit-auth-starter">open source auth starter project</a
				>
				utilizing
				<a href="https://lucia-auth.com/" class="underline">Lucia</a> for authentication,
				<a href="https://www.shadcn-svelte.com" class="underline">shadcn-svelte</a> for ui elements,
				<a href="https://orm.drizzle.team/" class="underline">Drizzle</a>
				for database connectivity and type safety,
				<a href="https://lucide.dev/" class="underline">Lucide</a>
				for icons, <a href="https://superforms.rocks/" class="underline">Superforms</a>
				for working with forms, <a href="https://zod.dev/" class="underline">Zod</a>
				for typescript schema validation and
				<a href="https://kit.svelte.dev/" class="underline">Sveltekit</a> for the javascript
				framework. It has email verification, password reset, and will send an email out if the user
				changes their email address to re-verify it. It also has a custom logging feature which I
				wrote in depth on
				<a
					href="https://jeffmcmorris.medium.com/awesome-logging-in-sveltekit-6afa29c5892c"
					class="underline">here</a
				>. It is released as open source under an MIT license. The source code is available on
				<a href="https://github.com/delay/sveltekit-auth" class="underline">github</a>.
			</p>
		</div>
		<div class="flex gap-4">
			<Button on:click={() => goto('/auth/sign-in')}>Sign in</Button>
			<Button on:click={() => goto('/auth/sign-up')} variant="outline">Sign up</Button>
		</div>
	</section>
</div>
