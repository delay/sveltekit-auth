<script lang="ts">
	import {
		TERMS_PRIVACY_COMPANY,
		TERMS_PRIVACY_EFFECTIVE_DATE,
		TERMS_PRIVACY_CONTACT_EMAIL,
		TERMS_PRIVACY_APP_NAME,
		TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS,
		TERMS_PRIVACY_COUNTRY
	} from '$lib/config/constants';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Terms and Conditions for {TERMS_PRIVACY_APP_NAME}
		</h1>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Effective Date: {TERMS_PRIVACY_EFFECTIVE_DATE}
		</h4>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Acceptance of Terms
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			By accessing and using {TERMS_PRIVACY_APP_NAME} ("Service"), you accept and agree to be bound by
			the terms and provision of this agreement.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Changes to Terms
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			We reserve the right, at our sole discretion, to amend these Terms of Service at any time and
			will update these Terms of Service in the event of any such amendments.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Account and Access
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			To access and use our Service, you may need to register with us and set up an account with
			your email address and a password. You are solely responsible for maintaining the
			confidentiality of your account and password and for all activities associated with or
			occurring under your account.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Your Responsibilities
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			You are responsible for all content you upload, post, email or otherwise transmit via the
			Service. You agree to comply with all laws and regulations applicable to your use of the
			Service.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Payment and Fees
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS}
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Intellectual Property
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			The Service and its original content, features and functionality are and will remain the
			exclusive property of {TERMS_PRIVACY_COMPANY}. The Service is protected by copyright,
			trademark, and other laws of both the {TERMS_PRIVACY_COUNTRY} and foreign countries.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Termination
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			We may terminate or suspend your access to the Service immediately, without prior notice or
			liability, under our sole discretion, for any reason whatsoever and without limitation,
			including but not limited to a breach of the Terms.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Limitation Of Liability
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			In no event shall {TERMS_PRIVACY_COMPANY}, nor its directors, employees, partners, agents,
			suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or
			punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
			intangible losses, resulting from your access to or use of or inability to access or use the
			Service.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Governing Law
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			These Terms shall be governed and construed in accordance with the laws of {TERMS_PRIVACY_COUNTRY},
			without regard to its conflict of law provisions.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Contact Us
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			If you have any questions about these Terms, please contact us at {TERMS_PRIVACY_CONTACT_EMAIL}.
		</p>
	</div>
</section>
