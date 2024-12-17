<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Icon } from '$components/base';
	import { toastr } from '$components/toasts';
	import type { RequestSearchParams } from '$lib/index.svelte';
	import type { Snippet } from 'svelte';

	let {
		action,
		deleteIds,
		type = 'button',
		requestSearchParams,
		totalRecords,
		onsuccess = undefined,
		children = undefined
	}: {
		action: string;
		deleteIds: any[];
		type?: 'button' | 'icon';
		requestSearchParams: RequestSearchParams;
		totalRecords: number;
		onsuccess?: (successResult: {
			type: 'success';
			status: number;
			data?: Record<string, any>;
		}) => Promise<void>;
		children?: Snippet;
	} = $props();
</script>

<!-- TODO: add confirm modal -->
<form
	{action}
	method="POST"
	class="contents"
	use:enhance={({ formData, action }) => {
		const deletedCount = deleteIds.length;
		const newTotalRecords = totalRecords - deletedCount;
		const newTotalPages = Math.ceil(newTotalRecords / requestSearchParams.pageSize);

		if (requestSearchParams.page > newTotalPages) requestSearchParams.page = newTotalPages;

		for (let [key, val] of requestSearchParams.toURLSearchParams().entries()) {
			action.searchParams.set(key, val);
		}

		formData.set('ids', JSON.stringify(deleteIds));

		return async ({ update, result }) => {
			if (result.type === 'failure') {
				toastr.error(result.data?.error);
				return;
			}

			if (result.type === 'success') {
				await onsuccess?.(result);
				return await update();
			}
		};
	}}
>
	{#if type === 'icon'}
		<button class="font-medium text-red-600 dark:text-red-500" title="Delete" type="submit">
			<Icon icon="trash" />
		</button>
	{:else}
		<Button
			color="red"
			outline
			size="sm"
			class="inline-flex items-center justify-center"
			type="submit"
			title="Delete"
		>
			<Icon icon="trash" class="-ml-1 mr-1 h-5 w-5" />{#if children}
				{@render children()}
			{:else}Delete
			{/if}
		</Button>
	{/if}
</form>
