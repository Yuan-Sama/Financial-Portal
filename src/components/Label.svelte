<script>
	import clsx from 'clsx';

	/**
	 * @type {{ children: import('svelte').Snippet } & import('svelte/elements').HTMLLabelAttributes }
	 */
	let { children, ...restProps } = $props();
</script>

<label
	{...restProps}
	class={clsx('mb-2 block text-sm font-medium text-gray-900 dark:text-white', restProps.class)}
	>{@render children()}</label
>
