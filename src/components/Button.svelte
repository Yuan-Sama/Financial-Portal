<script>
	import clsx from 'clsx';

	/**
	 * @type {{
	 * 	color?: 'default' | 'red' | 'primary',
	 * 	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'none',
	 * 	font?: 'normal' | 'medium',
	 * 	shape?: 'default' | 'pill' | 'round',
	 *  outline?: boolean,
	 * 	children: import('svelte').Snippet
	 * } & import('svelte/elements').HTMLButtonAttributes}
	 */
	let {
		color = 'default',
		size = 'base',
		font = 'medium',
		shape = 'default',
		outline = false,
		children,
		...restProps
	} = $props();

	const sizes = {
		xs: 'xs',
		sm: 'sm',
		base: 'base',
		lg: 'lg',
		xl: 'xl',
		none: 'none'
	};

	/**
	 * @param {string} size
	 */
	function getSize(size) {
		if (Object.values(sizes).includes(size)) return size;
		return sizes.base;
	}

	const fonts = {
		medium: 'medium',
		normal: 'normal'
	};

	/**
	 * @param {string} font
	 */
	function getFont(font) {
		if (Object.values(fonts).includes(font)) return font;
		return fonts.medium;
	}

	const colors = {
		primary: 'primary',
		default: 'default',
		red: 'red'
	};

	/**
	 * @param {string} color
	 */
	function getColor(color) {
		if (Object.values(colors).includes(color)) return color;
		return colors.default;
	}

	const shapes = {
		pill: 'pill',
		default: 'default',
		round: 'round'
	};

	/**
	 * @param {string} shape
	 */
	function getShape(shape) {
		if (Object.values(shapes).includes(shape)) return shape;
		return shapes.default;
	}
</script>

<button
	{...restProps}
	class={clsx(
		'focus:outline-none focus:ring-4',
		{
			'font-medium': getFont(font) === fonts.medium,
			'font-normal': getFont(font) === fonts.normal
		},
		{
			'px-3 py-2 text-xs': getSize(size) === sizes.xs,
			'px-3 py-2 text-sm': getSize(size) === sizes.sm,
			'px-5 py-2.5 text-sm': getSize(size) === sizes.base,
			'px-5 py-3 text-base': getSize(size) === sizes.lg,
			'px-6 py-3.5 text-base': getSize(size) === sizes.xl,
			'': getSize(size) === sizes.none
		},
		{
			'rounded-lg': getShape(shape) === shapes.default,
			'rounded-full': getShape(shape) === shapes.pill,
			'rounded-[50%]': getShape(shape) === shapes.round
		},
		{
			'bg-red-700 text-white hover:bg-red-800 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800':
				getColor(color) === colors.red && !outline,
			'border border-red-700 text-red-700 hover:bg-red-800 hover:text-white focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-800':
				getColor(color) === colors.red && outline,
			'bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800':
				getColor(color) === colors.primary && !outline,
			'border border-primary-700 text-primary-700 hover:bg-primary-800 hover:text-white focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:focus:ring-primary-800':
				getColor(color) === colors.primary && outline,
			'bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
				getColor(color) === colors.default && !outline,
			'border border-blue-700 text-blue-700 hover:bg-blue-800 hover:text-white focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800':
				getColor(color) === colors.default && outline
		},
		restProps.class
	)}
>
	{@render children()}
</button>
