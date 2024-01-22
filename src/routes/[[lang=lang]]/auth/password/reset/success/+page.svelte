<script lang="ts">
	import * as m from '$paraglide/messages';
</script>
<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			{m.pwdResetEmailSent()}
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{m.pwdResetCheckEmail()}
		</p>
	</div>
</section>
