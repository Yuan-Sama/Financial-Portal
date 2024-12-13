<script lang="ts">
	import { Label } from '$components/forms';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		rowsOptions = [5, 10, 15, 20, 25],
		onchange = undefined
	}: {
		rowsOptions?: number[];
		onchange?: ChangeEventHandler<HTMLSelectElement> | null | undefined;
	} = $props();
</script>

<div class="mr-3 inline-flex items-center justify-center">
	<Label
		for="rows-selector"
		class="mb-0 mr-3 whitespace-nowrap text-center align-middle text-sm font-medium"
		>Rows per page</Label
	>
	<select
		id="rows-selector"
		class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		{onchange}
	>
		{#each rowsOptions as rows, idx}
			<!-- content here -->
			<option selected={!idx} value={rows}>{rows}</option>
		{/each}
	</select>
</div>
