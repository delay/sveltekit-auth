<script lang="ts">
	import { enhance } from '$app/forms';
	import { Loader, CircleAlert } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import FacebookIcon from '$lib/components/icons/FacebookIcon.svelte';
	import MicrosoftIcon from '$lib/components/icons/MicrosoftIcon.svelte';

	interface Props {
		form?: {
			data: {
				email: string;
				password: string;
			};
			errors: Record<string, string>;
			valid: boolean;
		};
	}

	let { form }: Props = $props();
	
	// Valeurs dérivées avec accès sécurisé
	const formData = $derived.by(() => (
	{
		data: form?.data || { email: '', password: '' },
		errors: form?.errors || {},
		valid: form?.valid ?? true
	}));
	let submitting = $state(false);
	let hide_password = $state(true);
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="card p-8 w-full max-w-md">
		<header class="card-header text-center mb-6">
			<h1 class="h2 font-bold">Connexion</h1>
			<p class="text-surface-600-300-token">Entrez vos identifiants pour vous connecter</p>
		</header>

		{#if formData.errors.general}
			<aside class="alert variant-filled-error mb-4">
				<div class="alert-message">
					<CircleAlert class="w-4 h-4" />
					<p>{formData.errors.general}</p>
				</div>
			</aside>
		{/if}

		<form 
			method="POST" 
			class="space-y-4"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<label class="label">
				<span>Email</span>
				<input 
					class="input {formData.errors.email ? 'input-error' : ''}" 
					type="email" 
				name="email" 
				placeholder="m@example.com"
					value={formData.data.email}
					required
				/>
				{#if formData.errors.email}
					<p class="text-error-500 text-sm mt-1">{formData.errors.email}</p>
				{/if}
			</label>

			<label class="label">
				<span>Mot de passe</span>&nbsp;<button type="button" class="toggle-password" onclick="{() => hide_password = !hide_password}">👁️</button>
				<input 
					class="input {formData.errors.password ? 'input-error' : ''}" 
					type="{hide_password? "password" : "text"}" 
					name="password"
					value={formData.data.password}
					required
				/>
				{#if formData.errors.password}
					<p class="text-error-500 text-sm mt-1">{formData.errors.password}</p>
				{/if}
			</label>

			<button 
				type="submit" 
				class="btn variant-filled-primary w-full"
				disabled={submitting}
			>
				{#if submitting}
					<Loader class="w-4 h-4 animate-spin mr-2" />
					Connexion en cours...
				{:else}
					Se connecter
				{/if}
			</button>
		</form>

		<div class="">
			<p class="text-surface-600-300-token">
				Mot de passe oublié ?
				<a href="{resolve("/auth/password/reset")}" class="anchor">Renvoyer</a>
			</p>
			<p class="text-surface-600-300-token">
				Pas encore de compte ?
				<a href="{resolve("/auth/sign-up")}" class="anchor">S'inscrire</a>
			</p>
		</div>

		<div class="my-6 flex items-center gap-4">
			<span class="h-px flex-1 bg-surface-300-600-token"></span>
			<span class="text-xs uppercase text-surface-600-300-token">ou</span>
			<span class="h-px flex-1 bg-surface-300-600-token"></span>
		</div>

		<a
			href={resolve('/auth/oauth/google')}
			class="btn variant-soft-surface w-full flex items-center justify-center gap-2"
		>
			<GoogleIcon class="h-5 w-5" />
			Continuer avec Google
		</a>
		<a
			href={resolve('/auth/oauth/facebook')}
			class="btn variant-soft-surface w-full flex items-center justify-center gap-2"
		>
			<FacebookIcon class="h-5 w-5" />
			Continuer avec Facebook
		</a>
		<a
			href={resolve('/auth/oauth/microsoft')}
			class="btn variant-soft-surface w-full flex items-center justify-center gap-2"
		>
			<MicrosoftIcon class="h-5 w-5" />
			Continuer avec Microsoft
		</a>
	</div>
</div>
