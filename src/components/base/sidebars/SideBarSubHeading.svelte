<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...restProps }: { children: Snippet } & SvelteHTMLElements['p'] = $props();
</script>

<p
	{...restProps}
	class={clsx('mb-4 mt-2 text-center text-sm text-gray-500 dark:text-gray-400', restProps.class)}
>
	{@render children()}
</p>
