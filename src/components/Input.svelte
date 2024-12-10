<script>
	import clsx from 'clsx';

	/**
	 * @type {{
	 * 	disabled?: boolean,
	 * 	error?: boolean,
	 * 	success?: boolean,
	 * } & import('svelte/elements').HTMLInputAttributes }
	 */
	let {
		disabled = $bindable(false),
		error = $bindable(false),
		success = $bindable(false),
		...restProps
	} = $props();
</script>

<input
	{...restProps}
	class={clsx(
		'block rounded-lg border p-2.5 text-sm focus:outline-none focus:ring-[1px]',
		'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
		disabled && 'cursor-not-allowed bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-400',
		success &&
			'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-500 dark:bg-gray-700 dark:text-green-400 dark:placeholder-green-500',
		error &&
			'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500',
		restProps.class
	)}
/>
