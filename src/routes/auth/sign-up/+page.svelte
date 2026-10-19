<script lang="ts">
	import { enhance } from '$app/forms';
	import { Loader, CircleAlert } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';

	interface Props {
		form?: {
			data: {
				firstName: string;
				lastName: string;
				email: string;
				password: string;
				terms: boolean;
			};
			errors: Record<string, string>;
			valid: boolean;
		};
	}

	let { form }: Props = $props();
	
	// Valeurs dérivées avec accès sécurisé
	const formData = $derived.by(() => ({
		data: form?.data || { firstName: '', lastName: '', email: '', password: '', terms: false },
		errors: form?.errors || {},
		valid: form?.valid ?? true
	}));
	
	let submitting = $state(false);
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="card p-8 w-full max-w-md">
		<header class="card-header text-center mb-6">
			<h1 class="h2 font-bold">Créer un compte</h1>
			<p class="text-surface-600-300-token">
				Déjà un compte ? 
				<a href="{resolve("/auth/sign-in")}" class="anchor">Se connecter ici</a>
			</p>
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
			<div class="grid grid-cols-2 gap-4">
				<label class="label">
					<span>Prénom</span>
					<input 
						class="input {formData.errors.firstName ? 'input-error' : ''}" 
						type="text" 
						name="firstName" 
						placeholder="Jean"
						value={formData.data.firstName}
						required
					/>
					{#if formData.errors.firstName}
						<p class="text-error-500 text-sm mt-1">{formData.errors.firstName}</p>
					{/if}
				</label>

				<label class="label">
					<span>Nom</span>
					<input 
						class="input {formData.errors.lastName ? 'input-error' : ''}" 
						type="text" 
						name="lastName" 
						placeholder="Dupont"
						value={formData.data.lastName}
						required
					/>
					{#if formData.errors.lastName}
						<p class="text-error-500 text-sm mt-1">{formData.errors.lastName}</p>
					{/if}
				</label>
			</div>

			<label class="label">
				<span>Email</span>
				<input 
					class="input {formData.errors.email ? 'input-error' : ''}" 
					type="email" 
					name="email" 
					placeholder="jean.dupont@example.com"
					value={formData.data.email}
					required
				/>
				{#if formData.errors.email}
					<p class="text-error-500 text-sm mt-1">{formData.errors.email}</p>
				{/if}
			</label>

			<label class="label">
				<span>Mot de passe</span>
				<input 
					class="input {formData.errors.password ? 'input-error' : ''}" 
					type="password" 
					name="password"
					placeholder="Au moins 6 caractères"
					value={formData.data.password}
					required
				/>
				{#if formData.errors.password}
					<p class="text-error-500 text-sm mt-1">{formData.errors.password}</p>
				{/if}
			</label>

			<label class="flex items-start space-x-3 p-4 border border-surface-300-600-token rounded-container-token">
				<input 
					type="checkbox" 
					name="terms" 
					class="checkbox {formData.errors.terms ? 'checkbox-error' : ''}"
					checked={formData.data.terms}
					required
				/>
				<div class="space-y-1 leading-none">
					<span class="text-sm font-medium">J'accepte les conditions d'utilisation et la politique de confidentialité</span>
					<p class="text-xs text-surface-600-300-token">
						Vous acceptez les 
						<a href={resolve('/terms')} class="anchor">conditions d'utilisation</a> et la 
						<a href={resolve('/privacy')} class="anchor">politique de confidentialité</a>.
					</p>
				</div>
			</label>
			{#if formData.errors.terms}
				<p class="text-error-500 text-sm">{formData.errors.terms}</p>
			{/if}

			<button 
				type="submit" 
				class="btn variant-filled-primary w-full"
				disabled={submitting}
			>
				{#if submitting}
					<Loader class="w-4 h-4 animate-spin mr-2" />
					Création en cours...
				{:else}
					S'inscrire
				{/if}
			</button>
		</form>

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
			S'inscrire avec Google
		</a>
	</div>
</div>
