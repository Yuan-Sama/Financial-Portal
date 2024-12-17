<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Icon } from '$components/base';
	import type { RequestSearchParams } from '$lib/index.svelte';

	let {
		api,
		heading,
		requestSearchParams,
		onsuccess = undefined
	}: {
		api: string;
		heading: { name: string; sortable?: boolean };
		requestSearchParams: RequestSearchParams;
		onsuccess?: (newData: any) => Promise<void> | void; // TODO:
	} = $props();

	let disabled = $state(false);

	async function onsort(heading: { name: string }) {
		requestSearchParams.sort = !requestSearchParams.sort
			? heading.name
			: requestSearchParams.sort === heading.name
				? `-${heading.name}`
				: undefined;

		console.log(requestSearchParams.toString());

		disabled = true;
		const response = await fetch(`${api}?${requestSearchParams.toString()}`);
		disabled = false;

		if (response.status === 401) {
			return await applyAction({
				type: 'redirect',
				status: 401,
				location: '/sign-in'
			});
		}

		if (response.ok) {
			return await onsuccess?.(await response.json());
		}
	}
</script>

<th scope="col" class="px-5 py-3 uppercase">
	{#if heading.sortable === false}
		<span class="flex items-center"> {heading.name} </span>
	{:else}
		<button onclick={() => onsort?.({ name: heading.name })} class="flex items-center"
			>{heading.name}{#if requestSearchParams.sort === undefined}
				<Icon icon="no-sort" class="ml-2" />
			{:else if requestSearchParams.sort === heading.name}
				<Icon icon="sort-up" class="ml-2" />
			{:else}
				<Icon icon="sort-down" class="ml-2" />
			{/if}</button
		>
	{/if}
</th>
