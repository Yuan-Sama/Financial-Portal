<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Icon, Spinner } from '$components';
	import { toastr } from '$components/toasts';
	import type { RequestSearchParams } from '$lib/request.svelte';
	import { Input, Label } from './forms';

	let searching = $state(false);

	let {
		url,
		searchParams,
		placeholder = undefined,
		success = undefined
	}: {
		url: string;
		searchParams: RequestSearchParams;
		placeholder?: string;
		success?: (data: any) => Promise<void> | void;
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
					searchParams.page = 1;
					searchParams.search = event.currentTarget.value;
					searching = true;

					const response = await fetch(`${url}?${searchParams.toString()}`);

					searching = false;

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
							location: data.location
						});
					}
				}
			}}
		/>
	</div>
</div>
