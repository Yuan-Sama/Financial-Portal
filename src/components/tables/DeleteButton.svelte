<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Icon } from '$components';
	import { toastr } from '$components/toasts';
	import type { Snippet } from 'svelte';

	let {
		action,
		deleteIds,
		type = 'button',
		onsuccess = undefined,
		children = undefined
	}: {
		action: string;
		deleteIds: any[];
		type?: 'button' | 'icon';
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
	use:enhance={({ formData }) => {
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
