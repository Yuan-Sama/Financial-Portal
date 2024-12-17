<script lang="ts">
	import type { RequestSearchParams } from '$lib/index.svelte';
	import type { Snippet } from 'svelte';

	let {
		top = undefined,
		table,
		bottom = undefined,
		onsuccess = undefined,
		requestSearchParams
	}: {
		top?: Snippet<
			[requestSearchParams: RequestSearchParams, onsuccess?: (newData: any) => Promise<void> | void]
		>;
		table: Snippet<
			[requestSearchParams: RequestSearchParams, onsuccess?: (newData: any) => Promise<void> | void]
		>;
		bottom?: Snippet<
			[requestSearchParams: RequestSearchParams, onsuccess?: (newData: any) => Promise<void> | void]
		>;
		onsuccess?: (newData: any) => Promise<void> | void;
		requestSearchParams: RequestSearchParams;
	} = $props();
</script>

{#if top}
	<div class="my-7 flex items-center justify-between">
		{@render top(requestSearchParams, onsuccess)}
	</div>
{/if}

{@render table(requestSearchParams, onsuccess)}

{#if bottom}
	<div class="flex-column my-7 flex flex-wrap items-center justify-between md:flex-row">
		{@render bottom(requestSearchParams, onsuccess)}
	</div>
{/if}
