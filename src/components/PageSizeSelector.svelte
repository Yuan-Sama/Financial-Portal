<script lang="ts">
	import { applyAction } from '$app/forms';
	import { toastr } from '$components/base/toasts';
	import { Label } from '$components/forms';
	import type { RequestSearchParams } from '$lib/request.svelte';

	let {
        url,
		searchParams,
		pageSizes = [5, 10, 15, 20, 25],
		label = 'Show entries',
		success = undefined
	}: {
        url: string;
		searchParams: RequestSearchParams;
		pageSizes?: number[];
		label?: string;
		success?: (newData: any) => Promise<void> | void;
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
			searchParams.page = 1;
			searchParams.pageSize = +event.currentTarget.value;

			const response = await fetch(`${url}?${searchParams.toString()}`);

			if (response.ok) {
				return await success?.(await response.json());
			}

			if (response.status === 401) {
				const data = await response.json();

				if (data.message) {
					toastr.error(data.message);
				}

				return await applyAction({
					type: 'redirect',
					status: 303,
					location: data.location ?? '/'
				});
			}

			if (response.status === 303) {
				const data = await response.json();

				return await applyAction({
					type: 'redirect',
					status: 303,
					location: data.location ?? '/'
				});
			}
		}}
	>
		{#each pageSizes as option}
			<option selected={option === searchParams.pageSize} value={option}>{option}</option>
		{/each}
	</select>
</div>
