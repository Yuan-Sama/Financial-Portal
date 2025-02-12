<script lang="ts">
	import { applyAction } from '$app/forms';
	import { Icon } from '$components';
	import { toastr } from '$components/toasts';
	import type { RequestSearchParams } from '$lib/request.svelte';

	let {
		url,
		heading,
		searchParams,
		success = undefined
	}: {
		url: string;
		heading: { name: string; sortable?: boolean };
		searchParams: RequestSearchParams;
		success?: (newData: any) => Promise<void> | void;
	} = $props();

	let disabled = $state(false);

	async function onsort(heading: { name: string }) {
		searchParams.sort = !searchParams.sort
			? heading.name
			: searchParams.sort === heading.name
				? `-${heading.name}`
				: undefined;

		disabled = true;
		const response = await fetch(`${url}?${searchParams.toString()}`);
		disabled = false;

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
</script>

<th scope="col" class="px-5 py-3 uppercase">
	{#if heading.sortable === false}
		<span class="flex items-center"> {heading.name} </span>
	{:else}
		<button onclick={() => onsort?.({ name: heading.name })} class="flex items-center"
			>{heading.name}{#if searchParams.sort === undefined}
				<Icon icon="no-sort" class="ml-2" />
			{:else if searchParams.sort === heading.name}
				<Icon icon="sort-up" class="ml-2" />
			{:else}
				<Icon icon="sort-down" class="ml-2" />
			{/if}</button
		>
	{/if}
</th>
