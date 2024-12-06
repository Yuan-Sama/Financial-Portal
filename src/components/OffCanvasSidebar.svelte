<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		hide = $bindable(true),
		class: clazz = '',
		position = 'left',
		header,
		children
	}: {
		hide: boolean;
		class?: string;
		position?: 'left' | 'right';
		header?: Snippet;
		children?: Snippet;
	} = $props();

	let dropBackInstance: HTMLDivElement;
	onMount(() => {
		document.addEventListener('click', ($event) => {
			if (dropBackInstance?.contains($event.target as Node)) {
				hide = true;
			}
		});
	});
</script>

<div
	class="fixed {position === 'left'
		? 'left-0'
		: 'right-0'} top-0 z-40 h-screen w-64 overflow-y-auto bg-white p-4 transition-transform duration-500 dark:bg-gray-800 {!hide
		? 'transform-none'
		: position === 'left'
			? '-translate-x-full'
			: 'translate-x-full'}{clazz.trim() ? ` ${clazz}` : ''}"
	tabindex="-1"
>
	{@render header?.()}
	<button
		type="button"
		class="absolute end-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
		onclick={() => (hide = true)}
	>
		<svg
			aria-hidden="true"
			class="h-5 w-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clip-rule="evenodd"
			></path></svg
		>
		<span class="sr-only">Close menu</span>
	</button>
	{@render children?.()}
</div>
<div
	class="inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80 {hide ? 'hidden' : 'fixed'}"
	bind:this={dropBackInstance}
></div>
