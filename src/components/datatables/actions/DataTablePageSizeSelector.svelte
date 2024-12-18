<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Label } from '$components/forms';
	import type { RequestSearchParams } from '$lib/index.svelte';

	let {
		pageSizeOptions,
		url,
		requestSearchParams,
		label = 'Show entries',
		onsuccess = undefined
	}: {
		pageSizeOptions: number[];
		url: string;
		requestSearchParams: RequestSearchParams;
		label?: string;
		onsuccess?: (newData: any) => Promise<void> | void;
	} = $props();
</script>

<div class="mr-3 inline-flex items-center justify-center">
	<Label
		for="PageSizeSelector"
		class="mb-0 mr-3 whitespace-nowrap text-center align-middle text-sm font-medium">{label}</Label
	>
	<select
		id="PageSizeSelector"
		class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		name="pz"
		onchange={async (event) => {
			requestSearchParams.page = 1;
			requestSearchParams.pageSize = +event.currentTarget.value;

			const response = await fetch(`${url}?${requestSearchParams.toString()}`);

			if (response.ok) {
				return await onsuccess?.(await response.json());
			}

			if (response.status === 401) {
				return await applyAction({
					type: 'redirect',
					status: 401,
					location: '/sign-in'
				});
			}
		}}
	>
		{#each pageSizeOptions as option}
			<option selected={option === requestSearchParams.pageSize} value={option}>{option}</option>
		{/each}
	</select>
</div>
