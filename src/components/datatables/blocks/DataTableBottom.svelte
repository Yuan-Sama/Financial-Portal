<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex-column my-7 flex flex-wrap items-center justify-between md:flex-row">
	{@render children()}
</div>
