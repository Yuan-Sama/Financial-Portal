<script module lang="ts">
	const DEFAULT_TOAST_LIMIT = 5;
	let queueLimit = DEFAULT_TOAST_LIMIT;
	let direction: 'top' | 'bottom' = 'top';
	let delayRemoveInMS = 5000;
	const toasts = $state([]) as { id: NodeJS.Timeout; type: string; message: string }[];

	function show(message: string, type = 'default') {
		const id = setTimeout(() => {
			if (direction === 'top') {
				toasts.pop();
			} else {
				toasts.shift();
			}
			clearTimeout(id);
		}, delayRemoveInMS + 100);

		if (direction === 'top') toasts.unshift({ id, type, message });
		else toasts.push({ id, type, message });

		if (toasts.length > queueLimit) {
			let t;
			if (direction === 'top') {
				t = toasts.pop();
			} else {
				t = toasts.shift();
			}
			clearTimeout(t?.id);
		}
	}

	function success(message: string) {
		show(message, 'success');
	}

	function error(message: string) {
		show(message, 'error');
	}

	function warning(message: string) {
		show(message, 'warning');
	}

	export const toast = {
		show,
		success,
		error,
		warning
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let {
		class: clazz = '',
		yPosition = 'top',
		xPosition = 'left',
		maxQueueSize = 5,
		delayRemoveMs = 5000,
		toastInstance = undefined
	}: {
		class?: string;
		yPosition?: 'top' | 'bottom';
		xPosition?: 'left' | 'right';
		maxQueueSize?: number;
		delayRemoveMs?: number;
		toastInstance?: Snippet<
			[{ id: NodeJS.Timeout; type: string; message: string }, (id: NodeJS.Timeout) => void]
		>;
	} = $props();

	delayRemoveInMS = delayRemoveMs;
	direction = yPosition;
	queueLimit = Math.max(maxQueueSize, DEFAULT_TOAST_LIMIT);

	function getStringIf(condition: boolean, trueClause: string, falseClause: string) {
		return condition ? trueClause : falseClause;
	}

	function concat(sep: string, ...strings: string[]) {
		return strings.map((s) => s.trim()).join(sep);
	}

	function remove(id: NodeJS.Timeout) {
		const idx = toasts.findIndex((t) => t.id === id);
		if (idx === -1) return;
		toasts.splice(idx, 1);
		clearTimeout(id);
	}
</script>

<ul
	class="fixed z-[9999] {concat(
		' ',
		getStringIf(yPosition === 'top', 'top-5', 'bottom-5'),
		getStringIf(xPosition === 'left', 'left-5', 'right-5'),
		clazz
	)}"
	role="alert"
>
	{#each toasts as t (t)}
		<li
			in:fly={{ y: 50 * (yPosition === 'top' ? -1 : 1), duration: 1000, easing: cubicInOut }}
			out:fly={{ y: 50 * (yPosition === 'top' ? 1 : -1), duration: 1000, easing: cubicInOut }}
		>
			{@render toastInstance?.(t, remove)}
		</li>
	{/each}
</ul>
