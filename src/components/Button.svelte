<script>
	import clsx from 'clsx';

	/**
	 * @typedef Size
	 * @type {"base" | "xs" | "sm" | "lg" | "xl"}
	 *
	 * @typedef Color
	 * @type {"primary" | "red"}
	 *
	 * @typedef Shape
	 * @type {"default" | "pill" | "round"}
	 */

	const sizes = {
		xs: 'xs',
		sm: 'sm',
		base: 'base',
		lg: 'lg',
		xl: 'xl'
	};

	const colors = {
		primary: 'primary',
		red: 'red'
	};

	const shapes = {
		pill: 'pill',
		default: 'default',
		round: 'round'
	};

	/**
	 * @type {{
	 * 	color?: Color,
	 * 	size?: Size,
	 * 	shape?: Shape,
	 *  outline?: boolean,
	 * 	disabled?: boolean,
	 * 	children: import('svelte').Snippet
	 * } & import('svelte/elements').HTMLButtonAttributes}
	 */
	let {
		color = 'primary',
		size = 'base',
		shape = 'default',
		outline = false,
		disabled = $bindable(false),
		children,
		...restProps
	} = $props();

	size = /** @type {Size} */ (sizes[size] ?? sizes.base);
	color = /** @type {Color} */ (colors[color] ?? colors.primary);
	shape = /** @type {Shape} */ (shapes[shape] ?? shapes.default);
</script>

<button
	{...restProps}
	class={clsx(
		'focus:outline-none',
		!disabled && 'focus:ring-4',
		disabled && 'cursor-not-allowed focus:ring-0',
		sizes.xs === size && 'px-3 py-2 text-xs',
		sizes.sm === size && 'px-3 py-2 text-sm',
		sizes.base === size && 'px-5 py-2.5 text-sm',
		sizes.lg === size && 'px-5 py-3 text-base',
		sizes.xl === size && 'px-6 py-3.5 text-base',
		shapes.default === shape && 'rounded-lg',
		shapes.pill === shape && 'rounded-full',
		shapes.round === shape && 'rounded-[50%]',
		colors.primary === color && [
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
		colors.red === color && [
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
		restProps.class
	)}
>
	{@render children()}
</button>
