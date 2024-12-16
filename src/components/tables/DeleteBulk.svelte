<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Icon } from '$components';
	import { toastr } from '$components/toasts';
	import type { Snippet } from 'svelte';

	let {
		action = '?/delete',
		set = undefined,
		handleSuccess = undefined,
		children = undefined
	}: {
		action?: string;
		set?: (formData: FormData) => void;
		handleSuccess?: (opts: {
			update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
			successResult: { type: 'success'; status: number; data?: Record<string, unknown> };
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
		set?.(formData);

		return async ({ update, result }) => {
			if (result.type === 'failure') {
				toastr.error(result.data?.error);
				return;
			}

			if (result.type === 'success') {
				await handleSuccess?.({ update, successResult: { ...result } });
				return;
			}
		};
	}}
>
	<Button
		color="red"
		outline
		size="sm"
		class="inline-flex items-center justify-center"
		type="submit"
	>
		<Icon icon="trash" class="-ml-1 mr-1 h-5 w-5" />{#if children}
			{@render children()}
		{:else}Delete
		{/if}
	</Button>
</form>
