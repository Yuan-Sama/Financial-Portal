<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		headings,
		th
	}: {
		headings: { name: string; sortable?: boolean }[];
		th: Snippet<
			[
				heading: {
					name: string;
					sortable?: boolean;
				}
			]
		>;
	} = $props();
</script>

<thead class="bg-gray-100 dark:bg-gray-800">
	<tr>
		{#each headings as heading (heading)}
			{@render th(heading)}
		{/each}
	</tr>
</thead>
