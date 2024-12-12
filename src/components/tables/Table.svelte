<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		columns,
		startHeadCol = undefined,
		headCol = undefined,
		endHeadCol = undefined,
		dataCol = undefined,
		data = [],
		...restProps
	}: {
		columns: string[];
		startHeadCol?: Snippet;
		headCol?: Snippet<[column: string]>;
		endHeadCol?: Snippet;
		dataCol?: Snippet<[data: TData]>;
		data: TData[];
	} & SvelteHTMLElements['table'] = $props();
</script>

<table
	{...restProps}
	class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-sm"
>
	<thead class="bg-gray-100 dark:bg-gray-800">
		<tr>
			{@render startHeadCol?.()}
			{#each columns as column (column)}
				{@render headCol?.(column)}
			{/each}
			{@render endHeadCol?.()}
		</tr>
	</thead>
	<tbody>
		{#each data as d (d)}
			<tr
				class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
			>
				{@render dataCol?.(d)}
			</tr>
		{/each}
	</tbody>
</table>
