<script lang="ts">
	import {
		TERMS_PRIVACY_COMPANY,
		TERMS_PRIVACY_EFFECTIVE_DATE,
		TERMS_PRIVACY_WEBSITE,
		TERMS_PRIVACY_CONTACT_EMAIL
	} from '$lib/config/constants';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Privacy Policy for {TERMS_PRIVACY_WEBSITE}
		</h1>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Effective Date: {TERMS_PRIVACY_EFFECTIVE_DATE}
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			This privacy policy (the “Policy”) sets out the privacy policies and practices for {TERMS_PRIVACY_COMPANY}
			and its subsidiaries and affiliates (collectively, “we”, “us”, “our”) with respect to how we collect
			personal information. It also describes how we maintain, use, and disclose personal information.
		</p>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Information We Collect
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			We collect and store information that you voluntarily provide to us as well as data related to
			your website visit and usage.
		</p>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			We collect personally identifiable information (including, but not limited to, name, address
			and phone number) that is voluntarily provided to us by you. For example, you voluntarily
			provide personally identifiable information when you send us an email, use certain features of
			the website like the contact us form, or register with our site.
		</p>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			In addition, during your visit we automatically collect certain aggregate information related
			to your website visit. Aggregate information is non-personally identifiable or anonymous
			information about you, including the date and time of your visit, your IP address, your
			computer browser information, the Internet address that you visited prior to and after
			reaching our site, the name of the domain and host you used to access the Internet, and the
			features of our site which you accessed.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Use of Information
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			We use this information in order to serve the needs of our customers. We may use your
			information to meet your requests for our products, programs, and services, to respond to your
			inquiries about our offerings, to offer you other products or services that we believe may be
			of interest to you, to enforce the legal terms that govern your use of our site, and/or for
			the purposes for which you provided the information.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Information Sharing and Disclosure
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			{TERMS_PRIVACY_COMPANY} does not sell or rent your personally identifiable information to anyone.
			We only disclose personally identifiable information about our users when we believe, in good faith,
			that either the law requires it, to protect the rights or property of {TERMS_PRIVACY_COMPANY},
			or we must to provide you with the services or products you requested.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">Cookies</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			We may use cookies to manage our users’ sessions and to store preferences, tracking
			information, and language selection. Cookies may be used whether you register with us or not.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">Security</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			We employ reasonable and current security methods to prevent unauthorized access, maintain
			data accuracy, and ensure correct use of information.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Your Ability to Edit and Delete Your Account Information and Preferences
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			You may request deletion of your email address by sending an e-mail to {TERMS_PRIVACY_CONTACT_EMAIL}.
			However, please note that your identification, billing and contact information will remain on
			our records for some period.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Privacy Policy Updates
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			We may update this policy from time to time. If we make significant changes, we will notify
			you of the changes through our website or through others means, such as email.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			How to Contact Us
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			If you have any questions about this privacy policy, please contact us at {TERMS_PRIVACY_CONTACT_EMAIL}.
		</p>
	</div>
</section>
