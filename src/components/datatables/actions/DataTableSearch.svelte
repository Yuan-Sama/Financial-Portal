<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Icon, Spinner } from '$components/base';
	import { Input, Label } from '$components/forms';
	import type { RequestSearchParams } from '$lib/index.svelte';

	let searching = $state(false);

	let {
		url,
		requestSearchParams,
		placeholder = undefined,
		onsuccess = undefined
	}: {
		url: string;
		requestSearchParams: RequestSearchParams;
		placeholder?: string;
		onsuccess?: (newData: any) => Promise<void> | void;
	} = $props();
</script>

<div class="relative">
	<div class="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
		{#if searching}
			<Spinner />
		{:else}
			<Icon icon="search" class="size-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
		{/if}
	</div>

	<div class="contents">
		<Label for="SearchBar" class="sr-only">Search</Label>
		<Input
			id="SearchBar"
			type="search"
			class="ps-10 pt-2 lg:w-80"
			{placeholder}
			disabled={searching}
			onkeypress={async (event) => {
				if (event.key === 'Enter') {
					requestSearchParams.page = 1;
					requestSearchParams.search = event.currentTarget.value;
					searching = true;

					const response = await fetch(`${url}?${requestSearchParams.toString()}`);

					searching = false;

					if (response.ok) {
						if (onsuccess) return await onsuccess(await response.json());
					}

					if (response.status === 401) {
						return await applyAction({
							type: 'redirect',
							status: 401,
							location: '/sign-in'
						});
					}
				}
			}}
		/>
	</div>
</div>
