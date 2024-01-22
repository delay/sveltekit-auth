<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
	import { translatePath } from '$lib/i18n-routing';
	import * as m from '$paraglide/messages';
	export let data;
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			{m.confirmEmailAddress()}
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{m.checkEmail({app: APP_NAME})}. {m.didnotreceiveemil()},
			<a href="{translatePath(`/auth/verify/resend-email-${encodeURIComponent(data.user.email)}`, data.lang)}" class="underline"
				>{m.clickhere()}</a
			> {m.toresendit()}.
		</p>
	</div>
</section>
