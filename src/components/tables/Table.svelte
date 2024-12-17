<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { Icon } from '$components';
	import type { RequestSearchParams } from '$lib/index.svelte';
	import { applyAction } from '$app/forms';

	let {
		url,
		headings,
		data,
		TopMenu = undefined,
		BeforeColumnLoop = undefined,
		AfterColumnLoop = undefined,
		Row,
		BottomMenu = undefined,
		requestSearchParams,
		onsuccess = undefined,
		...restProps
	}: {
		url: string;
		headings: { name: string; sortable?: boolean }[];
		data: TData[];
		requestSearchParams: RequestSearchParams;
		TopMenu?: Snippet;
		BeforeColumnLoop?: Snippet;
		AfterColumnLoop?: Snippet;
		Row?: Snippet<[data: TData]>;
		onsuccess?: (newData: any) => Promise<void>;
		BottomMenu?: Snippet;
	} & SvelteHTMLElements['table'] = $props();

	let disabled = $state(false);

	async function onsort(heading: { name: string }) {
		requestSearchParams.sort = !requestSearchParams.sort
			? heading.name
			: requestSearchParams.sort === heading.name
				? `-${heading.name}`
				: undefined;

		console.log(requestSearchParams.toString());

		disabled = true;
		const response = await fetch(`${url}?${requestSearchParams.toString()}`);
		disabled = false;

		if (response.status === 401) {
			return await applyAction({
				type: 'redirect',
				status: 401,
				location: '/sign-in'
			});
		}

		if (response.ok) {
			return await onsuccess?.(await response.json());
		}
	}
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
					{#if heading.sortable === false}
						<span class="flex items-center"> {heading.name} </span>
					{:else}
						<button onclick={() => onsort({ name: heading.name })} class="flex items-center"
							>{heading.name}{#if requestSearchParams.sort === undefined}
								<Icon icon="no-sort" class="ml-2" />
							{:else if requestSearchParams.sort === heading.name}
								<Icon icon="sort-up" class="ml-2" />
							{:else}
								<Icon icon="sort-down" class="ml-2" />
							{/if}</button
						>
					{/if}
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
