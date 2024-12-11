<script>
	import { Tween } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';
	import { expoInOut } from 'svelte/easing';

	let scrollY = $state(0);
	let showAtPx = 100;

	const tween = new Tween(0, {
		delay: 0,
		easing: expoInOut
	});

	$effect(() => window.scrollTo(0, tween.current));

	async function scrollToTop() {
		await tween.set(scrollY, { duration: 0 });
		await tween.set(0, { duration: 1000 });
	}
</script>

<svelte:window bind:scrollY />

{#if scrollY > showAtPx}
	<div class="fixed bottom-4 right-4 z-[996]" transition:fade={{ duration: 700 }}>
		<Button
			class="leading-0 flex size-10 animate-bounce items-center justify-center"
			color="primary"
			shape="round"
			outline={true}
			onclick={() => scrollToTop()}
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					style="fill: currentColor;"
					><path d="m12 3.879-7.061 7.06 2.122 2.122L12 8.121l4.939 4.94 2.122-2.122z"></path><path
						d="m4.939 17.939 2.122 2.122L12 15.121l4.939 4.94 2.122-2.122L12 10.879z"
					></path></svg
				>
			</span>
		</Button>
	</div>
{/if}
