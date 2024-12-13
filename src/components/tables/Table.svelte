<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		headings,
		data,
		TopMenu = undefined,
		BeforeColumnLoop = undefined,
		AfterColumnLoop = undefined,
		Row,
		BottomMenu = undefined,
		...restProps
	}: {
		headings: string[];
		data: TData[];
		TopMenu?: Snippet;
		BeforeColumnLoop?: Snippet;
		AfterColumnLoop?: Snippet;
		Row?: Snippet<[data: TData]>;
		BottomMenu?: Snippet;
	} & SvelteHTMLElements['table'] = $props();
</script>

{#if TopMenu}
	<div class="my-7 flex items-center justify-between">
		{@render TopMenu?.()}
	</div>
{/if}

<table
	{...restProps}
	class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-sm"
>
	<thead class="bg-gray-100 dark:bg-gray-800">
		<tr>
			{@render BeforeColumnLoop?.()}
			{#each headings as heading, idx (heading)}
				<th scope="col" class="px-5 py-3 uppercase" data-index={idx}>
					<span class="flex items-center"> {heading} </span>
				</th>
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

{#if BottomMenu}
	<div class="flex-column my-7 flex flex-wrap items-center justify-between md:flex-row">
		{@render BottomMenu()}
	</div>
{/if}
