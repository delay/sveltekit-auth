<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
	import { resolve } from '$app/paths';
	import signOut from '$lib/components/navigation/sign-out';
	let { data } = $props();
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Confirm Your Email Address
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{#if data.user}
				Veuillez consulter la boîte mail {data.user.email} pour confirmer votre adresse e-mail pour {APP_NAME}.
				Si vous ne l'avez pas reçu, <a href={resolve("/auth/verify/email-[token]", {token: data.user.token}) + '?resend=true'} class="underline">clickez ici</a> pour le renvoyer.
			{/if}
		</p>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Peut-être avez vous fait une erreur lors de la saisie de l'email, dans ce cas, clickez <button onclick={signOut} class="underline">ici</button>
		</p>
	</div>
</section>
