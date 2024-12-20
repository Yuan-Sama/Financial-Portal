<script lang="ts">
	let {
		error = $bindable(undefined),
		success = $bindable(undefined)
	}: { error?: string; success?: string } = $props();
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
