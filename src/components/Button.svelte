<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		class: clazz = '',
		size = 'base',
		pill = false,
		children,
		...restProps
	}: {
		clazz?: string;
		size?: 'xs' | 'small' | 'base' | 'large' | 'xl';
		pill?: boolean;
		children: Snippet;
	} & HTMLButtonAttributes = $props();

	const sizes = {
		xs: 'px-3 py-2 text-xs',
		small: 'px-3 py-2 text-sm',
		base: 'px-5 py-2.5 text-sm',
		large: 'px-5 py-3 text-base',
		xl: 'px-6 py-3.5 text-base'
	};

	clazz = [sizes[size], clazz?.trim() ?? '', pill ? 'rounded-full' : 'rounded-lg'].join(' ');
</script>

<button class="font-medium focus:outline-none focus:ring-4 {clazz}" {...restProps}>
	{@render children()}
</button>
