<script lang="ts">
	type Direction = 'left' | 'right';

	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const directions = {
		left: 'left',
		right: 'right'
	};

	let {
		direction = 'left',
		show = $bindable(true),
		outsideclose = false,
		children,
		...restProps
	}: {
		direction?: Direction;
		show?: boolean;
		outsideclose?: boolean;
		children: Snippet;
	} & SvelteHTMLElements['div'] = $props();

	direction = (directions[direction] ?? directions.left) as Direction;

	function onOutsideClose(event: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement }) {
		const target = event.target;
		if (outsideclose && target === event.currentTarget) show = false; // close on click outside
	}
</script>

<div
	{...restProps}
	role="tab"
	class={clsx(
		'fixed top-0 h-screen overflow-y-auto bg-white p-4 transition-transform duration-500 dark:bg-gray-800',
		show && 'z-40 transition-none',
		direction === directions.left && 'left-0',
		!show && direction === directions.left && '-translate-x-full',
		direction === directions.right && 'right-0',
		!show && direction === directions.right && 'translate-x-full',
		restProps.class
	)}
	tabindex="-1"
>
	{@render children()}
</div>
<span
	role="none"
	onmousedown={onOutsideClose}
	class={clsx('inset-0 bg-gray-900/50 dark:bg-gray-900/80', show && 'fixed', !show && 'hidden')}
></span>
