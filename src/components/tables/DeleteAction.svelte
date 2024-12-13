<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Icon } from '$components';
	import type { ActionResult } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	let {
		action = '?/delete',
		appendToFormData = undefined,
		handleActionResult,
		children = undefined,
		type = 'button'
	}: {
		action?: string;
		appendToFormData?: (formData: FormData) => void;
		handleActionResult: (opts: {
			update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
			result: ActionResult;
		}) => Promise<void>;
		children?: Snippet;
		icon?: boolean;
		type?: 'button' | 'icon';
	} = $props();
</script>

<!-- TODO: add confirm modal -->
<form
	{action}
	method="post"
	class="contents"
	use:enhance={({ formData }) => {
		appendToFormData?.(formData);

		return async ({ update, result }) => await handleActionResult({ update, result });
	}}
>
	{#if type === 'icon'}
		<button
			class="inline-flex items-center justify-center font-medium text-red-600 dark:text-red-500"
			title="Delete"
			type="submit"
		>
			<Icon icon="trash" />
		</button>
	{:else}
		<Button
			color="red"
			outline
			size="sm"
			class="inline-flex items-center justify-center"
			type="submit"
		>
			<Icon icon="trash" class="-ml-1 mr-1 h-5 w-5" />{@render children?.()}
		</Button>
	{/if}
</form>
