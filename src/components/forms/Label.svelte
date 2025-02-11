<script lang="ts">
	import clsx from 'clsx';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		children,
		...restProps
	}: { children: import('svelte').Snippet } & SvelteHTMLElements['label'] = $props();
</script>

<label
	{...restProps}
	class={clsx('mb-2 block text-sm font-medium text-gray-900 dark:text-white', restProps.class)}
	>{@render children()}</label
>
