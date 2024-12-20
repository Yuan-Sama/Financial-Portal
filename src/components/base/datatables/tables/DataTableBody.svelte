<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';

	let {
		data,
		colsCount,
		td
	}: { data: TData[]; colsCount: number; td: Snippet<[dataItem: TData]> } = $props();
</script>

<tbody>
	{#if data.length}
		{#each data as row (row)}
			<tr
				class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
			>
				{@render td(row)}
			</tr>
		{/each}
	{:else}
		<tr
			class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
		>
			<td class="px-6 py-3.5 text-center text-base" colspan={colsCount}> No Results. </td>
		</tr>
	{/if}
</tbody>
