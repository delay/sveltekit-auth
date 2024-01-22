<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';

	import * as Alert from '$lib/components/ui/alert';
	import { userSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';

	import * as m from '$paraglide/messages';

	const resetPasswordSchema = userSchema.pick({
		email: true
	});

	type ResetPasswordSchema = typeof resetPasswordSchema;

	export let form: SuperValidated<ResetPasswordSchema>;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Form.Root let:submitting let:errors method="POST" {form} schema={resetPasswordSchema} let:config>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.resetPwd()}</Card.Title>
				<Card.Description>{m.receiveInstrResetPwd()}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if errors?._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>{m.resetPwdProblemShort()}</Alert.Title>
						<Alert.Description>
							{#each errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>{m.email()}</Form.Label>
						<Form.Input autocomplete="email"/>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="w-full">
					<Form.Button class="w-full" disabled={submitting}
						>{#if submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{m.pleasewait()}{:else}{m.sendPwdResetEmail()}{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
