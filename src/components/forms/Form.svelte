<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...restProps }: { children: Snippet } & SvelteHTMLElements['form'] = $props();

	let submitting = $state(false);
</script>

<form
	{...restProps}
	use:enhance={() => {
		submitting = true;
		return async ({ result, update }) => {
            
			submitting = false;
		};
	}}
>
	{@render children()}
</form>
