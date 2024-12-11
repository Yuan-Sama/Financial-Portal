<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';

	let { textCenter = false, children }: { textCenter?: boolean; children: Snippet } = $props();
</script>

<h5
	class={clsx(
		'text-base font-semibold uppercase text-gray-500 dark:text-gray-400',
		textCenter && 'text-center'
	)}
>
	{@render children()}
</h5>
