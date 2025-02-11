<script lang="ts">
	import DeleteButton from '$components/DeleteButton.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import type { RequestSearchParams } from '$lib/request.svelte';

	let {
		searchUrl: url,
		requestSearchParams: searchParams,
		selectedRowsSize,
		deleteValue,
		updateDataAfterSearching = undefined,
		updateDataAfterDeleting = undefined,
		deleteButtonBeforeSubmitForm: beforeSubmitForm = undefined,
		searchPlaceholder: placeholder = 'Search...'
	}: {
		searchUrl: string;
		requestSearchParams: RequestSearchParams;
		selectedRowsSize: number;
		deleteValue: any;
		updateDataAfterSearching?: (newData: any) => Promise<void> | void;
		updateDataAfterDeleting?: (newData: any) => Promise<void> | void;
		deleteButtonBeforeSubmitForm?: () => void;
		searchPlaceholder?: string;
	} = $props();
</script>

<div class="my-7 flex items-center justify-between">
	<div class="bg-white dark:bg-gray-900">
		<SearchBar {url} {placeholder} {searchParams} success={updateDataAfterSearching} />
	</div>

	{#if selectedRowsSize > 0}
		<DeleteButton
			{searchParams}
			{beforeSubmitForm}
			value={deleteValue}
			success={updateDataAfterDeleting}
		>
			Delete ({selectedRowsSize})
		</DeleteButton>
	{/if}
</div>
