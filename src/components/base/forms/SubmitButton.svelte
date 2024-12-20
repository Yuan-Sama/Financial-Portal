<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button, Spinner } from '..';

	let {
		disableLoader = $bindable(false),
		disabled = $bindable(false),
		color = undefined,
		children
	}: {
		disableLoader?: boolean;
		disabled?: boolean;
		color?: 'primary' | 'red';
		children: Snippet;
	} = $props();
</script>

<Button {color} class="mt-5 w-full font-medium" bind:disabled type="submit">
	{#if !disableLoader && disabled}
		<div role="status" class="me-2 inline">
			<Spinner inline />
		</div>
	{/if}{@render children()}</Button
>
