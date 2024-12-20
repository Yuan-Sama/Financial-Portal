<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { toastr } from '../toasts';

	let {
		content,
		onsuccess = undefined,
		handleRedirect = undefined,
		...restProps
	}: {
		content: Snippet<[formState: { submitting: boolean }]>;
		onsuccess?: (opts: {
			formData: FormData;
			formElement: HTMLFormElement;
			action: URL;
			successResult: { type: 'success'; status: number; data?: Record<string, any> };
			update(options?: { reset?: boolean; invalidateAll?: boolean }): Promise<void>;
		}) => Promise<void>;
		handleRedirect?: () => void | Promise<void>;
	} & SvelteHTMLElements['form'] = $props();

	class FormState {
		submitting = $state(false);
	}

	const formState = new FormState();
</script>

<form
	{...restProps}
	method="POST"
	use:enhance={() => {
		formState.submitting = true;

		return async (opts) => {
			const { formData, formElement, action, result, update } = opts;

			formState.submitting = false;
			if (result.type === 'failure') {
				if (result.data?.validationErrors) {
					return await applyAction(result);
				}

				toastr.error(result.data?.error);
				return;
			}

			if (result.type === 'error') {
				// TODO: handle error here maybe ?
				return await applyAction(result);
			}

			if (result.type === 'success') {
				return await onsuccess?.({
					formData,
					formElement,
					action,
					successResult: { ...result },
					update
				});
			}
			await handleRedirect?.();
			return await applyAction(result);
		};
	}}
>
	{@render content(formState)}
</form>
