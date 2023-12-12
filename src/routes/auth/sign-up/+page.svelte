<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { userSchema, type UserSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	const signUpSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true,
		password: true,
		terms: true
	});

	type SignUpSchema = typeof signUpSchema;

	export let form: SuperValidated<SignUpSchema>;

	//export let data;

	/*const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: signUpSchema,
		delayMs: 0
	});*/

	//let termsAccept = false;
	// $: termsValue = $form.terms as Writable<boolean>;
</script>

<Form.Root let:delayed method="POST" {form} schema={signUpSchema} let:config debug={true}>
	<Form.Field {config} name="firstName">
		<Form.Item>
			<Form.Label>First Name</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="lastName">
		<Form.Item>
			<Form.Label>Last Name</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input type="password" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="terms">
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<Form.Checkbox />
			<div class="space-y-1 leading-none">
				<Form.Label>I Accept the terms and privacy policy.</Form.Label>
				<Form.Description>
					You agree to the <a href="/terms" class="text-primaryHover underline">terms</a> and
					<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
				</Form.Description>
			</div>
		</Form.Item>
	</Form.Field>
	<Form.Button disabled={delayed}
		>{#if delayed}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			Please wait{:else}Sign Up{/if}</Form.Button
	>
</Form.Root>

<!--<form method="POST" action="/auth/sign-up" use:enhance>
	
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">First Name</span>
			<input
				id="firstName"
				name="firstName"
				type="text"
				placeholder="First Name"
				autocomplete="given-name"
				data-invalid={$errors.firstName}
				bind:value={$form.firstName}
				class="input"
				class:input-error={$errors.firstName}
			/>
			{#if $errors.firstName}
				<small>{$errors.firstName}</small>
			{/if}
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Last Name</span>
			<input
				id="lastName"
				name="lastName"
				type="text"
				placeholder="Last Name"
				autocomplete="family-name"
				data-invalid={$errors.lastName}
				bind:value={$form.lastName}
				class="input"
				class:input-error={$errors.lastName}
			/>
			{#if $errors.lastName}
				<small>{$errors.lastName}</small>
			{/if}
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Email Address</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Email Address"
				autocomplete="email"
				data-invalid={$errors.email}
				bind:value={$form.email}
				class="input"
				class:input-error={$errors.email}
			/>
			{#if $errors.email}
				<small>{$errors.email}</small>
			{/if}
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Password</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder="Password"
				data-invalid={$errors.password}
				bind:value={$form.password}
				class="input"
				class:input-error={$errors.password}
			/>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
		</label>
	</div>
	<div class="mt-6">
		<label for="terms" class="label">
			<input id="terms" name="terms" type="checkbox" class="checkbox" bind:checked={termsAccept} />
			<span class="ml-2">
				I accept the
				<a href="/terms" class="text-primaryHover underline">terms</a>
				and
				<a href="/privacy" class="text-primaryHover underline">privacy policy</a>
				{#if $errors.terms}
					<small>{$errors.terms}</small>
				{/if}
			</span>
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" disabled={!termsAccept} class="btn variant-filled-primary w-full"
			>{#if $delayed}spinner{:else}Sign Up{/if}</button
		>
	</div>
</form>

<Card.Root>
	<Card.Header class="space-y-1">
		<Card.Title class="text-2xl">Create an account</Card.Title>
		<Card.Description>Enter your email below to create your account</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-4">
		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input id="email" type="email" placeholder="m@example.com" />
		</div>
		<div class="grid gap-2">
			<Label for="password">Password</Label>
			<Input id="password" type="password" />
		</div>
	</Card.Content>
	<Card.Footer>
		<Button class="w-full">Create account</Button>
	</Card.Footer>
</Card.Root>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-1">
				<Label class="sr-only" for="email">Email</Label>
				<Input
					id="email"
					placeholder="name@example.com"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<Button disabled={isLoading}>
				{#if isLoading}
					<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign In with Email
			</Button>
		</div>
	</form>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
		</div>
	</div>
	<Button variant="outline" type="button" disabled={isLoading}>
		{#if isLoading}
			<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<Icons.gitHub class="mr-2 h-4 w-4" />
		{/if}
		{' '}
		Github
	</Button>
</div>-->
