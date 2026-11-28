<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';

	export let form: ActionData;

	let loading = false;
	let password = '';
	let confirmPassword = '';
	let passwordsMatch = true;

	$: passwordsMatch = password === confirmPassword || confirmPassword === '';
</script>

<svelte:head>
	<title>Change Your Password</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center py-12">
	<div class="card p-8 w-full max-w-md shadow-xl">
		<header class="card-header text-center mb-6">
			<h1 class="h2 mb-2">Change Your Password</h1>
			<p class="text-surface-600-300-token">Choose a new password for your account.</p>
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
					<span class="font-semibold mb-2">New Password</span>
					<input 
						class="input px-4 py-2 rounded-lg" 
						type="password" 
						name="password" 
						bind:value={password}
						placeholder="Enter your new password"
						required 
						minlength="8"
						disabled={loading}
					/>
					<small class="text-surface-500 text-xs mt-1">Minimum 8 characters</small>
				</label>

				<label class="label mb-4">
					<span class="font-semibold mb-2">Confirm New Password</span>
					<input 
						class="input px-4 py-2 rounded-lg {!passwordsMatch ? 'input-error border-error-500' : ''}" 
						type="password" 
						name="confirmPassword" 
						bind:value={confirmPassword}
						placeholder="Confirm your new password"
						required 
						disabled={loading}
					/>
					{#if !passwordsMatch && confirmPassword !== ''}
						<small class="text-error-500 text-sm mt-1">Passwords do not match</small>
					{/if}
				</label>

				<button 
					type="submit" 
					class="btn variant-filled-primary w-full mt-2"
					disabled={loading || !passwordsMatch || password === '' || confirmPassword === ''}
				>
					{#if loading}
						<span class="animate-spin mr-2">⏳</span>
						Please wait...
					{:else}
						Update Password
					{/if}
				</button>
			</form>
		</section>

		<footer class="card-footer text-center mt-6 pt-4 border-t border-surface-300-600-token">
			<p class="text-sm">
				<a href={resolve("/auth/sign-in")} class="anchor text-primary-500 hover:text-primary-600">Back to Sign In</a>
			</p>
		</footer>
	</div>
</div>
