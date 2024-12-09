<script>
	import clsx from 'clsx';

	/**
	 * @type {{
	 * 	color?: 'default' | 'red' | 'primary',
	 * 	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl',
	 * 	shape?: 'default' | 'pill' | 'round',
	 *  outline?: boolean,
	 * 	disabled?: boolean,
	 * 	children: import('svelte').Snippet
	 * } & import('svelte/elements').HTMLButtonAttributes}
	 */
	let {
		color = 'default',
		size = 'base',
		shape = 'default',
		outline = false,
		disabled = $bindable(false),
		children,
		...restProps
	} = $props();

	const sizes = {
		xs: 'xs',
		sm: 'sm',
		base: 'base',
		lg: 'lg',
		xl: 'xl'
	};

	const colors = {
		primary: 'primary',
		default: 'default',
		red: 'red'
	};

	const shapes = {
		pill: 'pill',
		default: 'default',
		round: 'round'
	};

	/**
	 * @param {{ [x: string]: any }} obj
	 * @param {any} defaultValue
	 * @param {any} value
	 */
	function getCurrentOrDefault(obj, defaultValue, value) {
		if (Object.values(obj).includes(value)) return value;
		return defaultValue;
	}

	/**
	 * @param {any} a
	 * @param {any} b
	 */
	function match(a, b) {
		return a === b;
	}

	size = getCurrentOrDefault(sizes, sizes.base, size);
	color = getCurrentOrDefault(colors, colors.default, color);
	shape = getCurrentOrDefault(shapes, shapes.default, shape);
</script>

<button
	{...restProps}
	class={clsx(
		'focus:outline-none',
		!disabled && 'focus:ring-4',
		disabled && 'cursor-not-allowed focus:ring-0',
		[
			match(size, sizes.xs) && 'px-3 py-2 text-xs',
			match(size, sizes.sm) && 'px-3 py-2 text-sm',
			match(size, sizes.base) && 'px-5 py-2.5 text-sm',
			match(size, sizes.lg) && 'px-5 py-3 text-base',
			match(size, sizes.xl) && 'px-6 py-3.5 text-base'
		],
		[
			match(shape, shapes.default) && 'rounded-lg',
			match(shape, shapes.pill) && 'rounded-full',
			match(shape, shapes.round) && 'rounded-[50%]'
		],
		match(color, colors.primary) && [
			disabled && [
				outline &&
					'border border-primary-400 text-primary-400 dark:border-primary-500 dark:text-primary-500',
				!outline && 'bg-primary-400 text-white dark:bg-primary-500'
			],
			!disabled && [
				outline &&
					'border border-primary-700 text-primary-700 hover:bg-primary-800 hover:text-white focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:focus:ring-primary-800',
				!outline &&
					'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
			]
		],
		match(color, colors.red) && [
			disabled && [
				outline && 'border border-red-400 text-red-400 dark:border-red-500 dark:text-red-500',
				!outline && 'bg-red-400 text-white dark:bg-red-500'
			],
			!disabled && [
				outline &&
					'border border-red-700 text-red-700 hover:bg-red-800 hover:text-white focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-800',
				!outline &&
					'bg-red-700 text-white hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
			]
		],
		match(color, colors.default) && [
			disabled && [
				outline && 'border border-blue-400 text-blue-400 dark:border-blue-500 dark:text-blue-500',
				!outline && 'bg-blue-400 text-white dark:bg-blue-500'
			],
			!disabled && [
				outline &&
					'border border-blue-700 text-blue-700 hover:bg-blue-800 hover:text-white focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800',
				!outline &&
					'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
			]
		],
		restProps.class
	)}
>
	{@render children()}
</button>
