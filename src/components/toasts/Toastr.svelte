<script module>
	const DEFAULT_MAX_QUEUE_SIZE = 5;

	/**
	 * @type {{ id: NodeJS.Timeout; type: string; content: any }[]}
	 */
	const toasts = $state([]);

	let queueSize = DEFAULT_MAX_QUEUE_SIZE;
	let removeAfterMs = 5000;
	/**
	 * @type {"top" | "bottom"}
	 */
	let pushOrder = 'top';

	/**
	 * @param {any} content
	 */
	function pushAndShiftToast(content, type = 'default') {
		const id = setTimeout(() => {
			toasts.shift();
			clearTimeout(id);
		}, removeAfterMs + 100);

		toasts.push({ id, type, content });

		if (toasts.length > queueSize) {
			const t = toasts.shift();
			clearTimeout(t?.id);
		}
	}

	/**
	 * @param {any} content
	 */
	function unshiftAndPopToast(content, type = 'default') {
		const id = setTimeout(() => {
			toasts.pop();
			clearTimeout(id);
		}, removeAfterMs + 100);

		toasts.unshift({ id, type, content });

		if (toasts.length > queueSize) {
			const t = toasts.pop();
			clearTimeout(t?.id);
		}
	}

	/**
	 * @param {any} content
	 * @param {string} [type]
	 */
	function toast(content, type = 'default') {
		if (pushOrder === 'bottom') return pushAndShiftToast(content, type);
		return unshiftAndPopToast(content);
	}

	/**
	 * @param {any} content
	 */
	function success(content) {
		toast(content, 'success');
	}

	/**
	 * @param {any} content
	 */
	function error(content) {
		toast(content, 'error');
	}

	/**
	 * @param {any} content
	 */
	function warning(content) {
		toast(content, 'warning');
	}

	export const toastr = {
		toast,
		success,
		error,
		warning
	};
</script>

<script>
	import clsx from 'clsx';

	/**
	 * @type {{
	 *  maxQueueSize?: number,
	 *  delayRemoveMs?: number,
	 *  pushFrom?: "top" | "bottom",
	 *  toast: import('svelte').Snippet<[{
	 *      id: string | number | NodeJS.Timeout;
	 *      type: string;
	 *      content: any
	 *   },
	 *      removeFn: (id: string | number | NodeJS.Timeout) => void,
	 * 		pushFrom: string
	 * 	]>
	 * } & import('svelte/elements').SvelteHTMLElements['div']}
	 */
	let { maxQueueSize = 5, pushFrom = 'top', delayRemoveMs = 5000, toast, ...restProps } = $props();

	removeAfterMs = delayRemoveMs;
	queueSize = Math.max(maxQueueSize, DEFAULT_MAX_QUEUE_SIZE);
	pushOrder = pushFrom;

	/**
	 * @param {string | number | NodeJS.Timeout} id
	 */
	function remove(id) {
		const idx = toasts.findIndex((t) => t.id === id);
		if (idx === -1) return;
		toasts.splice(idx, 1);
		clearTimeout(id);
	}
</script>

<div class={clsx('fixed z-9999 max-w-xl space-y-3', restProps.class)} role="alert">
	{#each toasts as t (t)}
		{@render toast(t, remove, pushFrom)}
	{/each}
</div>
