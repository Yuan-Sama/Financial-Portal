<script>
	import clsx from 'clsx';

	/**
	 * @typedef Direction
	 * @type {"left" | "right"}
	 */

	const directions = {
		left: 'left',
		right: 'right'
	};

	/**
	 * @type {{
	 *  direction?: Direction,
	 *  show?: boolean,
	 * 	triggerId?: string,
	 *  children: import('svelte').Snippet
	 * }}
	 */
	let { direction = 'left', show = $bindable(true), triggerId = '', children } = $props();

	direction = /** @type {Direction} */ (directions[direction] ?? directions.left);

	/**
	 * @param {HTMLDivElement} node
	 */
	function clickOutsideFn(node) {
		/**
		 * @param {MouseEvent} event
		 */
		function onclick(event) {
			const target = /** @type {HTMLElement} */ (event.target);
			if (!node.contains(target) && !target.closest(triggerId)) {
				show = false;
			}
		}

		document.body.addEventListener('click', onclick, true);

		return {
			destroy() {
				document.body.removeEventListener('click', onclick);
			}
		};
	}
</script>

<div
	use:clickOutsideFn
	class={clsx(
		'fixed top-0 h-screen w-full overflow-y-auto bg-white p-4 transition-transform duration-500 dark:bg-gray-800 lg:max-w-md',
		show && 'z-40 transition-none',
		direction === directions.left && 'left-0',
		!show && direction === directions.left && '-translate-x-full',
		direction === directions.right && 'right-0',
		!show && direction === directions.right && 'translate-x-full'
	)}
	tabindex="-1"
>
	{@render children()}
</div>
<span class={clsx('inset-0 bg-gray-900/50 dark:bg-gray-900/80', show && 'fixed', !show && 'hidden')}
></span>
