<script lang="ts" generics="TData">
	import { Form, SubmitButton } from '$components/forms';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/sidebars';
	import type { RequestSearchParams } from '$lib/request.svelte';
	import type { Snippet } from 'svelte';

	let {
		show = $bindable(false),
		editData = $bindable(undefined),
		searchParams,
		formContent,
		createHeading,
		createSubHeading,
		editHeading,
		editSubHeading,
		submitButtonCreateText = 'Create',
		updateData = undefined
	}: {
		show: boolean;
		editData: undefined | null | TData;
		searchParams: RequestSearchParams;
		createHeading: string;
		createSubHeading: string;
		editHeading: string;
		editSubHeading: string;
		formContent: Snippet<
			[
				state: {
					submitting: boolean;
				}
			]
		>;
		submitButtonCreateText?: string;
		updateData?: (newData: any) => Promise<void> | void;
	} = $props();
</script>

<SideBar bind:show outsideclose direction="right" class="w-full lg:max-w-md">
	<SideBarCloseButton
		left
		onclick={() => {
			show = false;
			editData = undefined;
		}}
	/>

	<div class="overflow-y-auto px-3 py-7">
		{#if !editData}
			<SideBarHeading textCenter>{createHeading}</SideBarHeading>
			<SideBarSubHeading>{createSubHeading}</SideBarSubHeading>
		{:else}
			<SideBarHeading textCenter>{editHeading}</SideBarHeading>
			<SideBarSubHeading>{editSubHeading}</SideBarSubHeading>
		{/if}

		<Form
			action={(editData ? '?/edit' : '?/create') + `&${searchParams.toString()}`}
			success={async ({ successResult, update }) => {
				show = false;
				const data = successResult.data!;
				await updateData?.(data);
				await update();
			}}
		>
			{#snippet content(state)}
				{@render formContent(state)}

				<SubmitButton bind:disabled={state.submitting}>
					{editData ? 'Save changes' : submitButtonCreateText}
				</SubmitButton>
			{/snippet}
		</Form>
	</div>
</SideBar>
