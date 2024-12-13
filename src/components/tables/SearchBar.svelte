<script lang="ts">
	import { enhance } from '$app/forms';
	import { Icon, Spinner } from '$components';
	import { Input, Label } from '$components/forms';
	import type { FormEventHandler } from 'svelte/elements';

	let searching = $state(false);

	let {
		id = undefined,
		name = undefined,
		placeholder = undefined,
		handleSuccess = undefined,
		oninput = undefined
	}: {
		id?: string | null;
		name?: string | null;
		placeholder?: string | null;
		oninput?: FormEventHandler<HTMLInputElement> | null | undefined;
		handleSuccess?: (opts: {
			update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
			successResult: { type: 'success'; status: number; data?: Record<string, unknown> };
		}) => Promise<void>;
	} = $props();
</script>

<div class="relative">
	<div class="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
		{#if searching}
			<Spinner />
		{:else}
			<Icon icon="search" class="size-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
		{/if}
	</div>

	<form
		action="?/search"
		method="POST"
		class="contents"
		onsubmit={(e) => e.preventDefault()}
		use:enhance={() => {
			searching = true;

			return async ({ result, update }) => {
				searching = false;
				if (result.type === 'success') {
					await handleSuccess?.({ update, successResult: { ...result } });
				}
			};
		}}
	>
		<Label for={name} class="sr-only">Search</Label>
		<Input
			{name}
			type="search"
			class="ps-10 pt-2 lg:w-80"
			{placeholder}
			{oninput}
			{id}
			disabled={searching}
		/>
	</form>
</div>
