<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { userSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	import * as m from "$paraglide/messages";
	import { defaultLanguage, translatePath } from '$lib/i18n-routing';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { AvailableLanguageTag } from '$paraglide/runtime';

	export let data: PageData;

	let lang = ($page.params.lang || defaultLanguage) as AvailableLanguageTag;

	const profileSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true
	});

	type ProfileSchema = typeof profileSchema;

	export let form: SuperValidated<ProfileSchema>;
	form = data.form;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Form.Root let:submitting let:errors method="POST" {form} schema={profileSchema} let:config>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.profile()}</Card.Title>
				<Card.Description>{m.updateProfileForm()}</Card.Description>
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
						<Form.Input autocomplete="email"/>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="block w-full">
					<Form.Button class="w-full" disabled={submitting}
						>{#if submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{m.pleasewait()}{:else}{m.updateprofile()}{/if}
					</Form.Button>
					<div class="mt-6 text-center text-sm">
						<Button on:click={() => goto(translatePath('/auth/password/reset', lang))} class="w-full" variant="outline"
							>{m.changepassword()}</Button
						>
					</div>
				</div>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
