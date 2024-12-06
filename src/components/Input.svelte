<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: clazz = '',
		value = $bindable(),
		...restProps
	}: { clazz?: string; value?: any } & HTMLInputAttributes = $props();
</script>

<input
	bind:value
	class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-[1px] focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500{clazz?.trim()
		? ` ${clazz}`
		: ''}"
	{...restProps}
/>
