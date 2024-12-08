<script lang="ts">
	import type { Snippet } from 'svelte';
	import { expoInOut } from 'svelte/easing';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let {
		class: clazz = '',
		delayMs = 0,
		durationMs = 1000,
		showThreshold = 100,
		easing = expoInOut,
		children = undefined,
		...restProps
	}: {
		class?: string;
		children?: Snippet;
		delayMs?: number;
		durationMs?: number;
		showThreshold?: number;
		easing?: (t: number) => number;
	} & HTMLButtonAttributes = $props();

	let scrollY = $state(0);
	const tweeny = tweened(0);

	async function backToTop(delay: number, duration: number, easing: (t: number) => number) {
		tweeny.set(scrollY, { duration: 0 });

		const unsubscribe = tweeny.subscribe((value) => {
			window.scrollTo(0, value);
		});

		await tweeny.set(0, { delay, duration, easing });

		return unsubscribe();
	}
</script>

<svelte:window bind:scrollY />

<button
	onclick={() => backToTop(delayMs, durationMs, easing)}
	class="leading-0 fixed bottom-4 right-4 z-[996] flex size-10 animate-bounce items-center justify-center bg-primary-500 text-base hover:bg-primary-700 text-white/80{clazz
		? ` ${clazz}`
		: ''}{scrollY <= showThreshold ? ' invisible' : ''}"
	transition:fade={{ duration: 1000 }}
	{...restProps}
>
	{@render children?.()}
</button>
