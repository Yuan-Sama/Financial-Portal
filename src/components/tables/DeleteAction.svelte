<script lang="ts">
	import { enhance } from '$app/forms';
	import { Icon } from '$components';
	import { toastr } from '$components/toasts';

	let {
		action = '?/delete',
		set = undefined,
		handleSuccess = undefined
	}: {
		action?: string;
		set?: (formData: FormData) => void;
		handleSuccess?: (opts: {
			update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
			successResult: { type: 'success'; status: number; data?: Record<string, unknown> };
		}) => Promise<void>;
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
	<button class="font-medium text-red-600 dark:text-red-500" title="Delete" type="submit">
		<Icon icon="trash" />
	</button>
</form>
