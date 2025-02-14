<script lang="ts">
	type Account = { id: number; name: string };
	type SelectedRows = { [id: number]: Account };

	import type { PageData } from './$types';
	import { RequestSearchParams } from '$lib/request.svelte';
	import { AppName } from '$lib';
	import DeleteButton from '$components/DeleteButton.svelte';
	import { SideBarForm, Table, TableBottom, TableTop } from '$components/accounts';
	import { Input, Label } from '$components/forms';
	import { Button, Icon } from '$components';
	import { toastr } from '$components/toasts';
	import { SortableColumn } from '$components/tables';

	let { data }: { data: PageData } = $props();

	const api = '/api/accounts';
	const headings = [{ name: 'Name' }];
	const accountSearchParams = new RequestSearchParams();

	let showForm = $state(false);
	let accounts = $state(data.data);
	let pagination = $state(data.pagination);
	let editAccount: Account | undefined | null = $state();
	let selectedRows: SelectedRows = $state({});

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

<div class="mx-auto -mt-24 w-full max-w-(--breakpoint-2xl) pb-10">
	<div class="rounded-lg bg-white p-6 shadow-xs drop-shadow-xs dark:bg-gray-800">
		<div
			class="flex flex-col gap-y-2 space-y-1.5 p-6 lg:flex-row lg:items-center lg:justify-between"
		>
			<span class="line-clamp-1 text-xl font-semibold text-gray-900 dark:text-white">
				Your Accounts
			</span>

			<Button
				class="flex items-center justify-center font-medium"
				size="sm"
				onclick={() => (showForm = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="px-6 pb-6">
			<TableTop
				requestSearchParams={accountSearchParams}
				searchUrl={api}
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
					<SortableColumn
						url={api}
						{heading}
						searchParams={accountSearchParams}
						success={updateData}
					/>
				{/snippet}
				{#snippet row(account, _)}
					<td class="px-5 py-3">{account.name}</td>
				{/snippet}
				{#snippet rowActions(account, _)}
					<button
						onclick={() => {
							editAccount = account;
							showForm = true;
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
				pageSizeSelectorUrl={api}
				pageSizeSelectorAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
				bind:pagination
				paginationUrl={api}
				paginationAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
			/>
		</div>
	</div>
</div>

<SideBarForm
	bind:show={showForm}
	bind:editData={editAccount}
	searchParams={accountSearchParams}
	createHeading="New Account"
	createSubHeading="Create a new account to track your transactions."
	editHeading="Edit Account"
	editSubHeading="Edit an existing account."
	submitButtonCreateText="Create account"
	updateData={(newData) => {
		if (editAccount) {
			toastr.success('Account updated');
			editAccount = undefined;
		} else {
			toastr.success('Account created');
		}
		updateData(newData);
	}}
>
	{#snippet formContent(formState)}
		{#if editAccount}
			<input type="number" hidden name="id" value={editAccount.id} />
		{/if}

		<Label for="name" class="mb-2">Name</Label>
		<Input
			class="mt-3 w-full"
			placeholder="e.g. Cash, Bank, Credit Card, etc."
			value={editAccount?.name}
			id="name"
			name="name"
			bind:disabled={formState.submitting}
		/>
	{/snippet}
</SideBarForm>
