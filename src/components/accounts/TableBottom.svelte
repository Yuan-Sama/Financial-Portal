<script lang="ts" generics="TData">
	import PageSizeSelector from '$components/PageSizeSelector.svelte';
	import Pagination from '$components/Pagination.svelte';
	import type { RequestSearchParams } from '$lib/request.svelte';

	let {
		collection,
		selectedRowsSize,
		searchParams,
		pageSizeSelectorUrl,
		pageSizeSelectorAfterSuccess = undefined,
		pageSizes = undefined,
		pagination = $bindable(),
		paginationUrl,
		paginationAfterSuccess = undefined
	}: {
		collection: TData[];
		selectedRowsSize: number;
		searchParams: RequestSearchParams;
		pageSizeSelectorUrl: string;
		pageSizeSelectorAfterSuccess?: (newData: any) => Promise<void> | void;
		pageSizes?: number[];
		paginationUrl: string;
		pagination: {
			prevPage: number | null;
			currentPage: number;
			nextPage: number | null;
			totalPages: number;
			totalRecords: number;
		};
		paginationAfterSuccess?: (newData: any) => Promise<void> | void;
	} = $props();
</script>

<div class="flex-column my-7 flex flex-wrap items-center justify-between md:flex-row">
	<span
		class="my-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:inline md:w-auto lg:mb-4"
		>{selectedRowsSize} of {collection.length} row(s) selected.</span
	>
	<div class="my-4 inline-flex items-center justify-center">
		<PageSizeSelector
			{pageSizes}
			url={pageSizeSelectorUrl}
			{searchParams}
			success={pageSizeSelectorAfterSuccess}
		/>
		<Pagination
			url={paginationUrl}
			{...pagination}
			{searchParams}
			collectionLength={collection.length}
			success={paginationAfterSuccess}
		/>
	</div>
</div>
