<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		headings,
		data,
		BeforeColumnLoop = undefined,
		Column,
		AfterColumnLoop = undefined,
		Row,
		...restProps
	}: {
		headings: string[];
		data: TData[];
		BeforeColumnLoop?: Snippet;
		Column: Snippet<[{ idx: number; heading: string }]>;
		AfterColumnLoop?: Snippet;
		Row?: Snippet<[data: TData]>;
	} & SvelteHTMLElements['table'] = $props();
</script>

<table
	{...restProps}
	class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-sm"
>
	<thead class="bg-gray-100 dark:bg-gray-800">
		<tr>
			{@render BeforeColumnLoop?.()}
			{#each headings as heading, idx (heading)}
				{@render Column?.({ idx, heading })}
			{/each}
			{@render AfterColumnLoop?.()}
		</tr>
	</thead>
	<tbody>
		{#each data as row (row)}
			<tr
				class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
			>
				{@render Row?.(row)}
			</tr>
		{/each}
	</tbody>
</table>
