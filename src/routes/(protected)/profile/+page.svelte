<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema } from '$lib/config/zod-schemas';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types.js';

	export let data: PageData;

	const profileSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true
	});

	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validators: zodClient(profileSchema),
		resetForm: false
	});
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center py-12">
	<div class="card p-8 w-full max-w-2xl shadow-xl">
		<header class="card-header text-center mb-6">
			<h1 class="h2 mb-2">Profile</h1>
			<p class="text-surface-600-300-token">Update your profile settings below.</p>
		</header>

		<section class="card-body">
			{#if $message}
				<aside class="alert variant-filled-success mb-4">
					<div class="alert-message">
						<p>{$message}</p>
					</div>
				</aside>
			{/if}

			{#if $errors._errors}
				<aside class="alert variant-filled-error mb-4">
					<div class="alert-message">
						{#each $errors._errors as error}
							<p>{error}</p>
						{/each}
					</div>
				</aside>
			{/if}

			<form method="POST" use:enhance class="space-y-4">
				<label class="label">
					<span class="font-semibold mb-2">First Name</span>
					<input
						class="input px-4 py-2 rounded-lg {$errors.firstName ? 'input-error border-error-500' : ''}"
						type="text"
						name="firstName"
						bind:value={$form.firstName}
						placeholder="Enter your first name"
						required
						disabled={$submitting}
					/>
					{#if $errors.firstName}
						<small class="text-error-500 text-sm mt-1">{$errors.firstName}</small>
					{/if}
				</label>

				<label class="label">
					<span class="font-semibold mb-2">Last Name</span>
					<input
						class="input px-4 py-2 rounded-lg {$errors.lastName ? 'input-error border-error-500' : ''}"
						type="text"
						name="lastName"
						bind:value={$form.lastName}
						placeholder="Enter your last name"
						required
						disabled={$submitting}
					/>
					{#if $errors.lastName}
						<small class="text-error-500 text-sm mt-1">{$errors.lastName}</small>
					{/if}
				</label>

				<label class="label">
					<span class="font-semibold mb-2">Email</span>
					<input
						class="input px-4 py-2 rounded-lg {$errors.email ? 'input-error border-error-500' : ''}"
						type="email"
						name="email"
						bind:value={$form.email}
						placeholder="Enter your email"
						required
						disabled={$submitting}
					/>
					{#if $errors.email}
						<small class="text-error-500 text-sm mt-1">{$errors.email}</small>
					{/if}
				</label>

				<button
					type="submit"
					class="btn variant-filled-primary w-full mt-2"
					disabled={$submitting}
				>
					{#if $submitting}
						<span class="animate-spin mr-2">⏳</span>
						Please wait
					{:else}
						Update profile
					{/if}
				</button>
			</form>
		</section>

		<footer class="card-footer text-center mt-6 pt-4 border-t border-surface-300-600-token">
			<button
				type="button"
				on:click={() => goto('/auth/password/reset')}
				class="btn variant-ghost w-full"
			>
				Change your password
			</button>
		</footer>
	</div>
</div>
