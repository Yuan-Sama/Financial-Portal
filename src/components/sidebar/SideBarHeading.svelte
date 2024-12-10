<script>
	/**
	 * @type {{
	 *  children: import('svelte').Snippet
	 * }}
	 */
	let { children } = $props();
</script>

<h5 class="text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
	{@render children()}
</h5>
