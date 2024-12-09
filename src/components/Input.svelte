<script>
	import clsx from 'clsx';

	/**
	 * @type { import('svelte/elements').HTMLInputAttributes }
	 */
	let { ...restProps } = $props();
</script>

<input
	{...restProps}
	class={clsx(
		'block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-[1px] focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
		restProps.class,
		{
			'cursor-not-allowed bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-400':
				restProps.disabled
		}
	)}
/>
