<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	aria-hidden="true"
	focusable="false"
>
	<path
		fill="#1877F2"
		d="M24 12.073c0-5.381-4.365-9.745-9.745-9.745-5.381 0-9.745 4.364-9.745 9.745 0 4.846 3.598 8.872 8.284 9.624v-6.668H7.909v-2.956h2.585v-2.036c0-2.514 1.519-3.897 3.846-3.897 1.098 0 2.224.196 2.224.196v2.441h-1.254c-1.234 0-1.618.765-1.618 1.548v1.798h2.757l-.44 2.956h-2.317v6.668c4.686-.752 8.284-4.778 8.284-9.624z"
	/>
</svg>
