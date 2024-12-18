<script lang="ts" generics="TData">
	import type { RequestSearchParams } from '$lib/index.svelte';
	import type { Snippet } from 'svelte';

	type Heading = { name: string; sortable?: boolean };

	let {
		headings,
		data,
		content,
		onsuccess = undefined,
		requestSearchParams
	}: {
		headings: Heading[];
		data: TData[];
		content: Snippet<
			[
				headings: Heading[],
				data: TData[],
				requestSearchParams: RequestSearchParams,
				rowsSelector: typeof rowsSelector,
				onsuccess?: (newData: any) => Promise<void> | void
			]
		>;
		onsuccess?: (newData: any) => Promise<void> | void;
		requestSearchParams: RequestSearchParams;
	} = $props();

	class RowsSelector {
		rows: { [idx: number]: TData } = $state({});
		size = $derived(Object.keys(this.rows).length);
	}

	const rowsSelector = new RowsSelector();
</script>

{@render content(headings, data, requestSearchParams, rowsSelector, onsuccess)}
