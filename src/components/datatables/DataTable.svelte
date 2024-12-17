<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		headings
	}: { headings: { name: string; sortable?: boolean }[]; children: Snippet } = $props();
</script>

<table
	class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-sm"
>
	{@render children()}
</table>
