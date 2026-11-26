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
	<rect
		x="0.5"
		y="0.5"
		width="11"
		height="11"
		fill="#F25022"
		rx="2"
	/>
	<rect
		x="12.5"
		y="0.5"
		width="11"
		height="11"
		fill="#7FBA00"
		rx="2"
	/>
	<rect
		x="0.5"
		y="12.5"
		width="11"
		height="11"
		fill="#00A4EF"
		rx="2"
	/>
	<rect
		x="12.5"
		y="12.5"
		width="11"
		height="11"
		fill="#FFB900"
		rx="2"
	/>
</svg>
