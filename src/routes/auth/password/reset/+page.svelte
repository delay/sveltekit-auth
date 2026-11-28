<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types.js';

	export let form: ActionData;

	let loading = false;
</script>

<svelte:head>
	<title>Reset Your Password</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center py-12">
	<div class="card p-8 w-full max-w-md shadow-xl">
		<header class="card-header text-center mb-6">
			<h1 class="h2 mb-2">Reset Your Password</h1>
			<p class="text-surface-600-300-token">Receive email instructions to reset your password.</p>
		</header>

		<section class="card-body">
			{#if form?.error}
				<aside class="alert variant-filled-error mb-4">
					<div class="alert-message">
						<p>{form.error}</p>
					</div>
				</aside>
			{/if}

			<form 
				method="POST" 
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						update();
					};
				}}
			>
				<label class="label mb-4">
					<span class="font-semibold mb-2">Email</span>
					<input 
						class="input px-4 py-2 rounded-lg" 
						type="email" 
						name="email" 
						value={form?.email ?? ''}
						placeholder="Enter your email address"
						required 
						disabled={loading}
					/>
				</label>

				<button 
					type="submit" 
					class="btn variant-filled-primary w-full mt-2"
					disabled={loading}
				>
					{#if loading}
						<span class="animate-spin mr-2">⏳</span>
						Please wait...
					{:else}
						Send Password Reset Email
					{/if}
				</button>
			</form>
		</section>

		<footer class="card-footer text-center mt-6 pt-4 border-t border-surface-300-600-token">
			<p class="text-sm">
				Remember your password? 
				<a href={resolve("/auth/sign-in")} class="anchor text-primary-500 hover:text-primary-600">Sign in</a>
			</p>
		</footer>
	</div>
</div>
