<script lang="ts" generics="TData">
	import { RowSelector, RowsSelector } from '$components/tables';
	import type { Snippet } from 'svelte';

	let {
		headings,
		collection,
		head,
		row,
		rowActions,
		selectedRows = $bindable()
	}: {
		headings: {
			name: string;
			sortable?: boolean;
		}[];
		selectedRows: { [id: number | string]: TData };
		head: Snippet<[heading: { name: string; sortable?: boolean }]>;
		row: Snippet<[data: TData, idx: number]>;
		rowActions: Snippet<[data: TData, idx: number]>;
		collection: TData[];
	} = $props();
</script>

<table
	class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-xs"
>
	<thead class="bg-gray-100 dark:bg-gray-800">
		<tr>
			<RowsSelector bind:selectedRows {collection} />
			{#each headings as heading}
				{@render head(heading)}
			{/each}
			<th scope="col">Actions</th>
		</tr>
	</thead>

	<tbody>
		{#if collection.length}
			{#each collection as data, idx (data)}
				<tr
					class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
				>
					<RowSelector key={idx} bind:selectedRows {data} />
					{@render row(data, idx)}
					<td class="flex items-center justify-center gap-x-3 px-5 py-3 text-right">
						{@render rowActions(data, idx)}
					</td>
				</tr>
			{/each}
		{:else}
			<tr
				class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
			>
				<td class="px-6 py-3.5 text-center text-base" colspan={headings.length + 2}>
					No Results.
				</td>
			</tr>
		{/if}
	</tbody>
</table>
