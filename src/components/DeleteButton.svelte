<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Icon } from '$components/base';
	import { toastr } from '$components/base/toasts';
	import type { RequestSearchParams } from '$lib/request.svelte';
	import type { Snippet } from 'svelte';

	let {
		value,
		searchParams = undefined,
		name = 'ids',
		action = '?/delete',
		iconOnly = false,
		success = undefined,
		error = undefined,
		children = undefined,
		beforeSubmitForm = undefined
	}: {
		searchParams?: RequestSearchParams;
		value: any;
		name?: string;
		action?: string;
		iconOnly?: boolean;
		success?: (data: any) => Promise<void> | void;
		error?: (error: any) => Promise<void> | void;
		beforeSubmitForm?: () => void;
		children?: Snippet;
	} = $props();
</script>

<!-- TODO: add confirm modal -->
<form
	{action}
	method="POST"
	class="contents"
	use:enhance={({ formData, action }) => {
		beforeSubmitForm?.();

		searchParams
			?.toURLSearchParams()
			.entries()
			.map(([key, val]) => action.searchParams.set(key, val));

		formData.set(name, JSON.stringify(value));

		return async ({ update, result }) => {
			if (result.type === 'failure') {
				toastr.error(result.data?.error);
				return await error?.(result.data);
			}

			if (result.type === 'success') {
				await success?.(result.data);
				return await update();
			}
		};
	}}
>
	{#if iconOnly}
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
