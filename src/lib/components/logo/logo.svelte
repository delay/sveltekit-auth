<script lang="ts">
	import MyImage from '$lib/assets/img/logoOpenProduct.png?enhanced';
	import { APP_NAME } from '$lib/config/constants';
	let size = $props();
	// ../../assets/img/logoOpenProduct.png
</script>

<enhanced:img
  class="logo-img"
  src="{MyImage}"
  sizes="min(24px, 100vw)"
  alt="{APP_NAME} logo"
/>
<style>
	img.logo-img {
		width: 24px;
		height: auto;
	}
</style>