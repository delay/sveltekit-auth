<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';

	import * as Alert from '$lib/components/ui/alert';
	import { userSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';

	import * as m from '$paraglide/messages';
	import { translatePath } from '$lib/i18n-routing';
	import { page } from '$app/stores';

	const signUpSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true,
		password: true,
		terms: true
	});

	type SignUpSchema = typeof signUpSchema;

	let lang = $page.params.lang || $page.data.lang;

	export let form: SuperValidated<SignUpSchema>;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Form.Root let:submitting let:errors method="POST" {form} schema={signUpSchema} let:config>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.createacc()}</Card.Title>
				<Card.Description
					>{m.alreadyaccount()} <a href={translatePath("/auth/sign-in", lang)} class="underline">{m.signinhere()}</a
					></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if errors?._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>{m.error()}</Alert.Title>
						<Alert.Description>
							{#each errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}
				<Form.Field {config} name="firstName">
					<Form.Item>
						<Form.Label>{m.firstname()}</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="lastName">
					<Form.Item>
						<Form.Label>{m.lastname()}</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>{m.email()}</Form.Label>
						<Form.Input autocomplete="email" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>{m.password()}</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="terms">
					<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
						<Form.Checkbox />
						<div class="space-y-1 leading-none">
							<Form.Label>{m.acceptterms()}</Form.Label>
							<Form.Description>
								{m.agreeto()} <a href={translatePath("/terms", lang)} class="text-primaryHover underline">{m.toterms()}</a> {m.and()}
								<a href={translatePath("/privacy", lang)} class="text-primaryHover underline">{m.toprivacypolicy()}</a>.
							</Form.Description>
						</div>
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={submitting}
					>{#if submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{m.pleasewait()}{:else}{m.signup()}{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
