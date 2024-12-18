<script lang="ts">
	import { AppName, RequestSearchParams } from '$lib/index.svelte';
	import type { PageData } from './$types';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/sidebars';
	import { Form, Input, Label, SubmitButton } from '$components/forms';
	import { toastr } from '$components/toasts';
	import { Button, Icon } from '$components/base';
	import { DataTable, DataTableBottom, DataTableTop } from '$components/datatables/blocks';
	import { DataTableWrapper } from '$components/datatables';
	import {
		DataTableDeleteButton,
		DataTablePageSizeSelector,
		DataTablePagination,
		DataTableSearch
	} from '$components/datatables/actions';
	import { DataTableBody, DataTableHead, DataTableHeading } from '$components/datatables/tables';

	let { data }: { data: PageData } = $props();

	type Account = { id: number; name: string };

	const headings = [{ name: 'Name', field: 'name' }];
	const pageSizeOptions = [5, 10, 15, 20, 25];

	let pageData = $state({
		accounts: data.data,
		pagination: data.pagination
	});
	let showSideBar = $state(false);
	let editAccount: Account | undefined = $state();
	let selectedRows: { [id: number]: Account } = $state({});
	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	const accountSearchParams = new RequestSearchParams();

	$effect(() => {
		if (!showSideBar && editAccount) editAccount = undefined;
	});
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
				Accounts
			</span>

			<Button
				class="flex items-center justify-center font-medium"
				size="sm"
				onclick={() => (showSideBar = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="px-6 pb-6">
			<DataTableWrapper
				{headings}
				data={pageData.accounts}
				requestSearchParams={accountSearchParams}
				onsuccess={(newData: {
					data: typeof pageData.accounts;
					pagination: typeof pageData.pagination;
				}) => {
					pageData.accounts = newData.data;
					pageData.pagination = newData.pagination;
				}}
			>
				{#snippet content(headings, data, requestSearchParams, onsuccess)}
					<DataTableTop>
						<div class="bg-white dark:bg-gray-900">
							<DataTableSearch
								url="/api/accounts"
								placeholder="Search for accounts"
								{requestSearchParams}
								{onsuccess}
							/>
						</div>

						{#if selectedRowsSize > 0}
							<DataTableDeleteButton
								url="?/delete"
								totalRecords={pageData.pagination.totalRecords}
								requestSearchParams={accountSearchParams}
								deleteIds={Object.keys(selectedRows)}
								onsuccess={async (result) => {
									await onsuccess?.(result.data);
									selectedRows = {};
									toastr.success('Accounts deleted');
								}}
							>
								Delete ({selectedRowsSize})
							</DataTableDeleteButton>
						{/if}
					</DataTableTop>
					<DataTable>
						<DataTableHead {headings}>
							{#snippet before()}
								<th scope="col" class="p-4">
									<div class="flex items-center">
										<Input
											id="check-all"
											type="checkbox"
											checked={selectedRowsSize > 0 &&
												selectedRowsSize === pageData.accounts.length}
											onchange={(e) => {
												if (e.currentTarget.checked)
													selectedRows = pageData.accounts.reduce(
														(obj, a) => Object.assign(obj, { [a.id]: a }),
														{}
													);
												else selectedRows = {};
											}}
											class="size-4 cursor-pointer"
											aria-label="Select all"
										/>
										<Label for="check-all" class="sr-only">checkbox</Label>
									</div>
								</th>
							{/snippet}
							{#snippet th(heading)}
								<DataTableHeading api="/api/accounts" {heading} {requestSearchParams} {onsuccess} />
							{/snippet}
							{#snippet after()}
								<th scope="col">Action</th>
							{/snippet}
						</DataTableHead>
						<DataTableBody {data}>
							{#snippet td(account)}
								<td class="w-4 p-4">
									<div class="flex items-center">
										<Input
											id="checkbox-{account.id}"
											type="checkbox"
											checked={Boolean(selectedRows[account.id])}
											onchange={(e) => {
												if (e.currentTarget.checked) {
													selectedRows[account.id] = account;
												} else if (!e.currentTarget.checked && selectedRows[account.id]) {
													delete selectedRows[account.id];
												}
											}}
											class="size-4 cursor-pointer"
										/>
										<Label for="checkbox-{account.id}" class="sr-only">Select {account.name}</Label>
									</div>
								</td>
								<td class="px-5 py-3">{account.name}</td>
								<td class="w-2/12">
									<div class="flex items-center justify-center gap-x-3 px-6 py-4 text-right">
										<button
											onclick={() => {
												editAccount = account;
												showSideBar = true;
											}}
											title="Edit"
										>
											<Icon icon="edit" class="font-medium text-blue-600 dark:text-blue-500" />
										</button>
										<DataTableDeleteButton
											type="icon"
											url="?/delete"
											totalRecords={pageData.pagination.totalRecords}
											{requestSearchParams}
											deleteIds={[account.id]}
											onsuccess={async (result) => {
												await onsuccess?.(result.data);
												toastr.success('Account deleted');
											}}
										/>
									</div>
								</td>
							{/snippet}
						</DataTableBody>
					</DataTable>
					<DataTableBottom>
						<span
							class="my-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:inline md:w-auto lg:mb-4"
							>{selectedRowsSize} of {pageData.accounts.length} row(s) selected.</span
						>
						<div class="my-4 inline-flex items-center justify-center">
							<DataTablePageSizeSelector
								{pageSizeOptions}
								url="/api/accounts"
								{requestSearchParams}
								{onsuccess}
							/>
							<DataTablePagination
								url="/api/accounts"
								{...pageData.pagination}
								{requestSearchParams}
								{onsuccess}
								dataLength={pageData.accounts.length}
							/>
						</div>
					</DataTableBottom>
				{/snippet}
			</DataTableWrapper>
		</div>
	</div>
</div>

<SideBar bind:show={showSideBar} outsideclose direction="right" class="w-full lg:max-w-md">
	<SideBarCloseButton onclick={() => (showSideBar = false)} left />

	<div class="overflow-y-auto px-3 py-7">
		<SideBarHeading textCenter>{AppName}</SideBarHeading>

		{#if !editAccount}
			<SideBarSubHeading>Create a new account to track your transactions.</SideBarSubHeading>
		{:else}
			<SideBarSubHeading>Edit the existed account.</SideBarSubHeading>
		{/if}

		<Form
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

				pageData.accounts = data.data;
				pageData.pagination = data.pagination;

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
					placeholder="e.g. Cash, Bank, Credit Card"
					value={editAccount?.name}
					id="name"
					name="name"
					bind:disabled={state.submitting}
				/>

				<SubmitButton bind:disabled={state.submitting}>
					{editAccount ? 'Save changes' : 'Create account'}
				</SubmitButton>
			{/snippet}
		</Form>
	</div>
</SideBar>
