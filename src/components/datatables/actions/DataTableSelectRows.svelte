<script lang="ts">
	import { Input, Label } from '$components/forms';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		onchange = undefined,
		checked = undefined,
		id = undefined,
		screenReader = undefined
	}: {
		id?: string | null;
		checked?: boolean | null;
		screenReader?: string | null;
		onchange?: ChangeEventHandler<HTMLInputElement> | null;
	} = $props();
</script>

<div class="flex items-center">
	<Input
		{id}
		type="checkbox"
		{checked}
		{onchange}
		class="size-4 cursor-pointer"
		aria-label={screenReader}
	/>
	<Label for={id} class="sr-only">{screenReader}</Label>
</div>
