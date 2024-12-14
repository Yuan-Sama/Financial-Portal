<script lang="ts">
	import { Button, Icon } from '$components';

	let {
		prevPage,
		currentPage,
		nextPage,
		totalPages,
		onpagechange,
		dataLength,
		totalRecords,
		rowsPerPage
	}: {
		prevPage: null | number;
		currentPage: number;
		nextPage: null | number;
		totalPages: number;
		onpagechange: (page: number | null) => Promise<void>;
		dataLength: number;
		totalRecords: number;
		rowsPerPage: number;
	} = $props();
</script>

<div class="inline-flex items-center justify-center gap-x-2">
	<!-- Buttons -->
	<Button
		color="light"
		size="sm"
		noborder
		title="First"
		class="h-8"
		onclick={() => onpagechange(1)}
		disabled={currentPage <= 1}
	>
		<Icon icon="chevrons-left" class="m-auto size-5" />
	</Button>
	<Button
		color="light"
		size="sm"
		noborder
		title="Prev"
		class="h-8"
		disabled={!prevPage}
		onclick={() => onpagechange(prevPage)}
	>
		<Icon icon="chevron-left" class="m-auto size-5" />
	</Button>
	<span class="text-sm text-gray-700 dark:text-gray-400">
		<span class="font-semibold text-gray-900 dark:text-white"
			>{rowsPerPage * (currentPage - 1) + 1}</span
		>
		to
		<span class="font-semibold text-gray-900 dark:text-white"
			>{rowsPerPage * (currentPage - 1) + Math.min(dataLength, rowsPerPage)}</span
		>
		of <span class="font-semibold text-gray-900 dark:text-white">{totalRecords}</span>
	</span>
	<Button
		color="light"
		size="sm"
		noborder
		title="Next"
		class="h-8"
		onclick={() => onpagechange(nextPage)}
		disabled={!nextPage}
	>
		<Icon icon="chevron-right" class="m-auto size-5" />
	</Button>
	<Button
		color="light"
		size="sm"
		noborder
		title="Last"
		class="h-8"
		onclick={() => onpagechange(totalPages)}
		disabled={currentPage >= totalPages}
	>
		<Icon icon="chevrons-right" class="m-auto size-5" />
	</Button>
</div>
