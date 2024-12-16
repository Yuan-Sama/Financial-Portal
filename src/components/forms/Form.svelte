<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toastr } from '$components/toasts';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

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
		handleRedirect?: () => void;
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
					await applyAction(result);
					return;
				}

				toastr.error(result.data?.error);
				return;
			}

			if (result.type === 'error') {
				// TODO: handle error here maybe ?
				return await applyAction(result);
			}

			if (result.type === 'redirect') {
				handleRedirect?.();
				return await applyAction(result);
			}

			return await onsuccess?.({
				formData,
				formElement,
				action,
				successResult: { ...result },
				update
			});
		};
	}}
>
	{@render content(formState)}
</form>
