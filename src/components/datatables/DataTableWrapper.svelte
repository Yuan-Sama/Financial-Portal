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
				onsuccess?: (newData: any) => Promise<void> | void
			]
		>;
		onsuccess?: (newData: any) => Promise<void> | void;
		requestSearchParams: RequestSearchParams;
	} = $props();
</script>

{@render content(headings, data, requestSearchParams, onsuccess)}
