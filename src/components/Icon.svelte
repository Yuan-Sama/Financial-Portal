<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Icon =
		| 'trash'
		| 'plus'
		| 'search'
		| 'edit'
		| 'chevrons-left'
		| 'chevrons-right'
		| 'chevron-left'
		| 'chevron-right';

	let { icon, ...restProps }: { icon: Icon } & SvelteHTMLElements['svg'] = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="currentColor"
	{...restProps}
>
	{#if icon === 'trash'}
		<path
			d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
		></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
	{:else if icon === 'plus'}
		<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
	{:else if icon === 'search'}
		<path
			d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"
		></path>
	{:else if icon === 'edit'}
		<path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path
			d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"
		></path>
	{:else if icon === 'chevron-left'}
		<path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
	{:else if icon === 'chevron-right'}
		<path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
	{:else if icon === 'chevrons-left'}
		<path d="m12.707 7.707-1.414-1.414L5.586 12l5.707 5.707 1.414-1.414L8.414 12z"></path><path
			d="M16.293 6.293 10.586 12l5.707 5.707 1.414-1.414L13.414 12l4.293-4.293z"
		></path>
	{:else if icon === 'chevrons-right'}
		<path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path><path
			d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"
		></path>
	{/if}
</svg>
