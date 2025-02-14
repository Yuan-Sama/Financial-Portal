<script lang="ts">
	import clsx from 'clsx';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Size = 'base' | 'xs' | 'sm' | 'lg' | 'xl';
	type Color = 'primary' | 'red' | 'light';
	type Shape = 'default' | 'pill' | 'round';

	const sizes = {
		xs: 'xs',
		sm: 'sm',
		base: 'base',
		lg: 'lg',
		xl: 'xl'
	};

	const colors = {
		primary: 'primary',
		red: 'red',
		light: 'light'
	};

	const shapes = {
		pill: 'pill',
		default: 'default',
		round: 'round'
	};

	let {
		color = 'primary',
		size = 'base',
		shape = 'default',
		outline = false,
		noborder = false,
		disabled = $bindable(false),
		children,
		...restProps
	}: {
		color?: Color;
		size?: Size;
		shape?: Shape;
		outline?: boolean;
		noborder?: boolean;
		disabled?: boolean;
		children: import('svelte').Snippet;
	} & SvelteHTMLElements['button'] = $props();

	size = (sizes[size] ?? sizes.base) as Size;
	color = (colors[color] ?? colors.primary) as Color;
	shape = (shapes[shape] ?? shapes.default) as Shape;
</script>

<button
	{...restProps}
	{disabled}
	class={clsx(
		'focus:outline-hidden',
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
		!noborder && 'border',
		colors.primary === color && [
			disabled && [
				outline &&
					'border-primary-400 text-primary-400 dark:border-primary-500 dark:text-primary-500',
				!outline && 'bg-primary-400 text-white dark:bg-primary-500'
			],
			!disabled && [
				outline &&
					'border-primary-700 text-primary-700 hover:bg-primary-800 hover:text-white focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:focus:ring-primary-800',
				!outline &&
					'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
			]
		],
		colors.red === color && [
			disabled && [
				outline && 'border-red-400 text-red-400 dark:border-red-500 dark:text-red-500',
				!outline && 'bg-red-400 text-white dark:bg-red-500'
			],
			!disabled && [
				outline &&
					'border-red-700 text-red-700 hover:bg-red-800 hover:text-white focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-800',
				!outline &&
					'bg-red-700 text-white hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
			]
		],
		colors.light === color && [
			disabled && ['bg-gray-200 text-gray-900 dark:bg-gray-500 dark:text-white/75'],
			!disabled && [
				'border-gray-300 bg-white text-gray-900 hover:bg-gray-300 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
			]
		],
		restProps.class
	)}
>
	{@render children()}
</button>
