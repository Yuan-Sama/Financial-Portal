<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Icon, Spinner } from '$components';
	import { Input, Label } from '$components/forms';

	let searching = $state(false);

	let {
		id = 'search',
		name = 's',
		placeholder = undefined,
		handleNewData
	}: {
		id?: string;
		name?: string;
		placeholder?: string;
		handleNewData: (newData: any) => void;
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
		<Label for={id} class="sr-only">Search</Label>
		<Input
			{name}
			type="search"
			class="ps-10 pt-2 lg:w-80"
			{placeholder}
			{id}
			disabled={searching}
			onkeypress={async (event) => {
				if (event.key === 'Enter') {
					searching = true;

					const response = await fetch(
						'/api/accounts?' +
							new URLSearchParams({
								p: '1',
								pz: '5',
								s: event.currentTarget.value
							})
					);

					searching = false;

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
				}
			}}
		/>
	</div>
</div>
