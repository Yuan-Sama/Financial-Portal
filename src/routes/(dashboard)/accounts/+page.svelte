<script lang="ts">
	type Account = { id: number; name: string };

	import type { PageData } from './$types';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/base/sidebars';
	import { FormPost, SubmitButton } from '$components/base/forms';
	import { toastr } from '$components/base/toasts';
	import { Button, Icon } from '$components/base';
	import { DataTableHeading } from '$components/base/datatables/tables';
	import { RequestSearchParams } from '$lib/request.svelte';
	import { AppName } from '$lib';
	import DeleteButton from '$components/DeleteButton.svelte';
	import { Table, TableBottom, TableTop } from '$components/accounts';
	import { Input, Label } from '$components/forms';

	let { data }: { data: PageData } = $props();

	const headings = [{ name: 'Name' }];
	const accountSearchParams = new RequestSearchParams();

	let accounts = $state(data.data);
	let pagination = $state(data.pagination);
	let editAccount: Account | undefined = $state();
	let showSideBar = $state(false);
	let selectedRows: { [idx: number]: Account } = $state({});

	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	function updateData(newData: { data: typeof accounts; pagination: typeof pagination }) {
		accounts = newData.data;
		pagination = newData.pagination;
	}

	function beforeSubmitForm() {
		const deletedCount = selectedRowsSize;
		const newTotalRecords = pagination.totalRecords - deletedCount;
		const newTotalPages = Math.ceil(newTotalRecords / accountSearchParams.pageSize);

		if (accountSearchParams.page > newTotalPages) accountSearchParams.page = newTotalPages;
	}
</script>

<svelte:head>
	<title>{AppName} - Accounts</title>
</svelte:head>

<div class="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
	<div class="rounded-lg bg-white p-6 shadow-sm drop-shadow-sm dark:bg-gray-800">
		<div
			class="flex flex-col gap-y-2 space-y-1.5 p-6 lg:flex-row lg:items-center lg:justify-between"
		>
			<span class="line-clamp-1 text-xl font-semibold text-gray-900 dark:text-white">
				Your Accounts
			</span>

			<Button
				class="flex items-center justify-center font-medium"
				size="sm"
				onclick={() => (showSideBar = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="px-6 pb-6">
			<TableTop
				requestSearchParams={accountSearchParams}
				searchUrl="/api/accounts"
				searchPlaceholder="Search for accounts"
				updateDataAfterSearching={updateData}
				deleteButtonBeforeSubmitForm={beforeSubmitForm}
				deleteValue={Object.values(selectedRows).map((a) => a.id)}
				updateDataAfterDeleting={(newData) => {
					updateData(newData);
					selectedRows = {};
					toastr.success('Accounts deleted');
				}}
				{selectedRowsSize}
			/>

			<Table collection={accounts} {headings} bind:selectedRows>
				{#snippet head(heading)}
					<DataTableHeading
						api="/api/accounts"
						{heading}
						requestSearchParams={accountSearchParams}
						onsuccess={updateData}
					/>
				{/snippet}
				{#snippet row(account, _)}
					<td class="px-5 py-3">{account.name}</td>
				{/snippet}
				{#snippet rowActions(account, _)}
					<button
						onclick={() => {
							editAccount = account;
							showSideBar = true;
						}}
						title="Edit"
					>
						<Icon icon="edit" class="font-medium text-blue-600 dark:text-blue-500" />
					</button>
					<DeleteButton
						iconOnly
						{beforeSubmitForm}
						searchParams={accountSearchParams}
						value={[account.id]}
						success={(newData) => {
							updateData(newData);
							selectedRows = {};
							toastr.success('Account deleted');
						}}
					/>
				{/snippet}
			</Table>

			<TableBottom
				{selectedRowsSize}
				searchParams={accountSearchParams}
				collection={accounts}
				pageSizeSelectorUrl="/api/accounts"
				pageSizeSelectorAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
				bind:pagination
				paginationUrl="/api/accounts"
				paginationAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
			/>
		</div>
	</div>
</div>

<SideBar show={showSideBar} outsideclose direction="right" class="w-full lg:max-w-md">
	<SideBarCloseButton
		left
		onclick={() => {
			showSideBar = false;
			editAccount = undefined;
		}}
	/>

	<div class="overflow-y-auto px-3 py-7">
		{#if !editAccount}
			<SideBarHeading textCenter>New Account</SideBarHeading>
			<SideBarSubHeading>Create a new account to track your transactions.</SideBarSubHeading>
		{:else}
			<SideBarHeading textCenter>Edit Account</SideBarHeading>
			<SideBarSubHeading>Edit an existing account.</SideBarSubHeading>
		{/if}

		<FormPost
			action={(editAccount ? '?/edit' : '?/create') + `&${accountSearchParams.toString()}`}
			onsuccess={async ({ successResult, update }) => {
				showSideBar = false;

				const data = successResult.data!;

				if (editAccount) {
					toastr.success('Account updated');
					editAccount = undefined;
				} else {
					toastr.success('Account created');
				}

				accounts = data.data;
				pagination = data.pagination;

				await update();
			}}
		>
			{#snippet content(state)}
				{#if editAccount}
					<input type="number" hidden name="id" value={editAccount.id} />
				{/if}

				<Label for="name">Name</Label>
				<Input
					class="mt-3 w-full"
					placeholder="e.g. Cash, Bank, Credit Card, etc."
					value={editAccount?.name}
					id="name"
					name="name"
					bind:disabled={state.submitting}
				/>

				<SubmitButton bind:disabled={state.submitting}>
					{editAccount ? 'Save changes' : 'Create account'}
				</SubmitButton>
			{/snippet}
		</FormPost>
	</div>
</SideBar>
