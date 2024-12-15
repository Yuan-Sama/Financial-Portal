<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Label } from '$components/forms';

	let {
		pageSizeOptions,
		currentPageSize = $bindable(),
		label = 'Show entries',
		handleNewData
	}: {
		pageSizeOptions: number[];
		currentPageSize: number;
		label?: string;
		handleNewData: (newData: any) => void;
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
			const response = await fetch(
				'/api/accounts?' +
					new URLSearchParams({
						p: '1',
						pz: `${event.currentTarget.value}`
					})
			);

			if (response.ok) {
				return handleNewData(await response.json());
			}

			if (response.status === 401) {
				await applyAction({
					type: 'redirect',
					status: 401,
					location: '/sign-in'
				});
			}
		}}
	>
		{#each pageSizeOptions as pageSize}
			<option selected={pageSize === currentPageSize} value={pageSize}>{pageSize}</option>
		{/each}
	</select>
</div>
