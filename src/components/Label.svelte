<script>
	/**
	 * @type {{ children: import('svelte').Snippet } & import('svelte/elements').HTMLLabelAttributes }
	 */
	let { children, ...restProps } = $props();
</script>

<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" {...restProps}
	>{@render children()}</label
>
