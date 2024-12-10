<script>
	/**
	 * @type {{ error?: string, success?: string }}
	 */
	let { error = $bindable(undefined), success = $bindable(undefined) } = $props();
</script>

{#if error}
	<p class="mt-2 text-sm text-red-600 dark:text-red-500">
		{error}
	</p>
{:else if success}
	<p class="mt-2 text-sm text-green-600 dark:text-green-500">
		{success}
	</p>
{/if}
