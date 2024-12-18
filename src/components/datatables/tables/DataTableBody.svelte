<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';

	let { data, td }: { data: TData[]; td: Snippet<[dataItem: TData]> } = $props();
</script>

<tbody>
	{#each data as row (row)}
		<tr
			class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
		>
			{@render td(row)}
		</tr>
	{/each}
</tbody>
