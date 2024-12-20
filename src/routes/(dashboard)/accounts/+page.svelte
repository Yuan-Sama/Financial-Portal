<script lang="ts">
	import type { PageData } from './$types';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/base/sidebars';
	import { FormPost, Input, Label, SubmitButton } from '$components/base/forms';
	import { toastr } from '$components/base/toasts';
	import { Button, Icon } from '$components/base';
	import { DataTable, DataTableBottom, DataTableTop } from '$components/base/datatables/blocks';
	import { DataTableWrapper } from '$components/base/datatables';
	import {
		DataTableDeleteButton,
		DataTablePageSizeSelector,
		DataTablePagination,
		DataTableSearch,
		DataTableSelectRows
	} from '$components/base/datatables/actions';
	import {
		DataTableBody,
		DataTableHead,
		DataTableHeading
	} from '$components/base/datatables/tables';
	import { RequestSearchParams } from '$lib/request.svelte';
	import { AppName } from '$lib';

	let { data }: { data: PageData } = $props();

	type Account = { id: number; name: string };

	const headings = [{ name: 'Select All' }, { name: 'Name' }, { name: 'Action' }];
	const pageSizeOptions = [5, 10, 15, 20, 25];

	let pageData = $state({
		accounts: data.data,
		pagination: data.pagination
	});

	let showSideBar = $state(false);
	let editAccount: Account | undefined = $state();

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
				{#snippet content(headings, data, requestSearchParams, rowsSelector, onsuccess)}
					<DataTableTop>
						<div class="bg-white dark:bg-gray-900">
							<DataTableSearch
								url="/api/accounts"
								placeholder="Search for accounts"
								{requestSearchParams}
								{onsuccess}
							/>
						</div>

						{#if rowsSelector.size > 0}
							<DataTableDeleteButton
								url="?/delete"
								totalRecords={pageData.pagination.totalRecords}
								requestSearchParams={accountSearchParams}
								deleteIds={Object.keys(rowsSelector.rows)}
								onsuccess={async (newData) => {
									await onsuccess?.(newData);
									rowsSelector.rows = {};
									toastr.success('Accounts deleted');
								}}
							>
								Delete ({rowsSelector.size})
							</DataTableDeleteButton>
						{/if}
					</DataTableTop>
					<DataTable>
						<DataTableHead {headings}>
							{#snippet th(heading)}
								{#if heading.name === 'Select All'}
									<th scope="col" class="w-[1%] p-4">
										<DataTableSelectRows
											id="select-all"
											checked={data.length > 0 && rowsSelector.size == data.length}
											screenReader={heading.name}
											onchange={(e) => {
												rowsSelector.rows = !e.currentTarget.checked
													? {}
													: data.reduce((obj, a) => Object.assign(obj, { [a.id]: a }), {});
											}}
										/>
									</th>
								{:else if heading.name === 'Action'}
									<th scope="col">{heading.name}</th>
								{:else}
									<DataTableHeading
										api="/api/accounts"
										{heading}
										{requestSearchParams}
										{onsuccess}
									/>
								{/if}
							{/snippet}
						</DataTableHead>
						<DataTableBody {data} colsCount={headings.length}>
							{#snippet td(account)}
								<td class="w-4 p-4">
									<DataTableSelectRows
										id="select-{account.id}"
										checked={Boolean(rowsSelector.rows[account.id])}
										screenReader="Select account {account.id}"
										onchange={(e) => {
											if (e.currentTarget.checked) {
												rowsSelector.rows[account.id] = account;
											} else if (!e.currentTarget.checked && rowsSelector.rows[account.id]) {
												delete rowsSelector.rows[account.id];
											}
										}}
									/>
								</td>
								<td class="px-5 py-3">{account.name}</td>
								<td class="flex items-center justify-center gap-x-3 px-5 py-3 text-right">
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
										onsuccess={async (newData) => {
											await onsuccess?.(newData);
											toastr.success('Account deleted');
										}}
									/>
								</td>
							{/snippet}
						</DataTableBody>
					</DataTable>
					<DataTableBottom>
						<span
							class="my-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:inline md:w-auto lg:mb-4"
							>{rowsSelector.size} of {data.length} row(s) selected.</span
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
								dataLength={data.length}
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
		</FormPost>
	</div>
</SideBar>
