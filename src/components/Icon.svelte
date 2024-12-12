<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Icon = 'trash' | 'plus' | 'search' | 'edit';

	let { icon, ...restProps }: { icon: Icon } & SvelteHTMLElements['svg'] = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...restProps}>
	{#if icon === 'trash'}
		<path
			d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
			fill="currentColor"
		></path><path d="M9 10h2v8H9zm4 0h2v8h-2z" fill="currentColor"></path>
	{:else if icon === 'plus'}
		<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="currentColor"></path>
	{:else if icon === 'search'}
		<path
			d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"
			fill="currentColor"
		></path>
	{:else if icon === 'edit'}
		<path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z" fill="currentColor"
		></path><path
			d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"
			fill="currentColor"
		></path>
	{/if}
</svg>
