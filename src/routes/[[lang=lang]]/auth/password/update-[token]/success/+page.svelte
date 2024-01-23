<script lang="ts">
	import { page } from '$app/stores';
	import { translatePath } from '$lib/i18n-routing';
	import * as m from '$paraglide/messages';
	import { sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';

	let lang = ($page.params.lang || sourceLanguageTag) as AvailableLanguageTag;
</script>
<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			{m.pwdUpdateSuccess()}
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{m.pwdUpdatedText()} <a href={translatePath('/auth/sign-in', lang)} class="underline"
				>{m.signin()}</a
			> {m.withNewPwd()}.
		</p>
	</div>
</section>
