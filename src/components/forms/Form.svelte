<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toastr } from '$components/toasts';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		content,
		handleSuccess = undefined,
		...restProps
	}: {
		content: Snippet<[formState: { submitting: boolean }]>;
		handleSuccess?: (opts: {
			formData: FormData;
			formElement: HTMLFormElement;
			action: URL;
			successResult: { type: 'success'; status: number; data?: Record<string, any> };
			update(options?: { reset?: boolean; invalidateAll?: boolean }): Promise<void>;
		}) => Promise<void>;
	} & SvelteHTMLElements['form'] = $props();

	let submitting = $state(false);
</script>

<form
	{...restProps}
	method="POST"
	use:enhance={() => {
		submitting = true;

		return async (opts) => {
			const { formData, formElement, action, result, update } = opts;

			if (result.type === 'failure') {
				submitting = false;

				if (result.data?.validationErrors) {
					await applyAction(result);
					return;
				}

				toastr.error(result.data?.error);
				return;
			}

			if (result.type === 'redirect' || result.type === 'error') {
				submitting = false;
				await applyAction(result);
				return;
			}

			await handleSuccess?.({
				formData,
				formElement,
				action,
				successResult: { ...result },
				update
			});

			submitting = false;
		};
	}}
>
	{@render content({ submitting })}
</form>
