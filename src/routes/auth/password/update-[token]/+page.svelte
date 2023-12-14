<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { userUpdatePasswordSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';

	type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

	export let form: SuperValidated<UserUpdatePasswordSchema>;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Form.Root
		let:submitting
		let:errors
		method="POST"
		{form}
		schema={userUpdatePasswordSchema}
		let:config
	>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Change Your Password</Card.Title>
				<Card.Description>Choose a new password for your account.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if errors?._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Change Password Problem</Alert.Title>
						<Alert.Description>
							{#each errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}

				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>New Password</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="confirmPassword">
					<Form.Item>
						<Form.Label>Confirm New Password</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="w-full">
					<Form.Button class="w-full" disabled={submitting}
						>{#if submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait{:else}Update Password{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
