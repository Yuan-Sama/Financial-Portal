<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="my-7 flex items-center justify-between">
	{@render children()}
</div>
