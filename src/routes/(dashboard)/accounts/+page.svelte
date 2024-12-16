<script lang="ts">
	import { AppName, pageSizeOptions, RequestSearchParams } from '$lib/index.svelte';
	import type { PageData } from './$types';
	import { Button, Icon, Pagination } from '$components';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/sidebars';
	import { Form, Input, Label, SubmitButton } from '$components/forms';
	import { toastr } from '$components/toasts';
	import { DeleteAction, DeleteBulk, PageSizeSelector, SearchBar, Table } from '$components/tables';
	import { applyAction } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let pageData = $state({
		accounts: data.data,
		pagination: data.pagination
	});

	const accountSearchParams = new RequestSearchParams();

	let showSideBar = $state(false);

	let editAccount = $state() as
		| {
				id: number;
				name: string;
		  }
		| undefined;
	let selectedRows = $state({}) as { [id: number]: { id: number; name: string } };
	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	$effect(() => {
		if (!showSideBar && editAccount) editAccount = undefined;
	});

	let rowsPerPage = $state(5);
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
			<Table headings={['Name']} data={pageData.accounts}>
				{#snippet TopMenu()}
					<div class="bg-white dark:bg-gray-900">
						<SearchBar
							placeholder="Search for accounts"
							url="/api/accounts"
							requestSearchParams={accountSearchParams}
							onsuccess={(newData) => {
								pageData.accounts = newData.data;
								pageData.pagination = newData.pagination;
							}}
						/>
					</div>

					{#if selectedRowsSize > 0}
						<DeleteBulk
							set={(formData) => formData.set('ids', JSON.stringify(Object.keys(selectedRows)))}
							handleSuccess={async ({ successResult, update }) => {
								const data = successResult.data as any;

								pageData.accounts = data.data;
								pageData.pagination = data.pagination;

								toastr.success('Accounts deleted');
								await update();
							}}
						>
							Delete ({selectedRowsSize})
						</DeleteBulk>
					{/if}
				{/snippet}
				{#snippet BeforeColumnLoop()}
					<th scope="col" class="p-4">
						<div class="flex items-center">
							<Input
								id="check-all"
								type="checkbox"
								checked={selectedRowsSize > 0 && selectedRowsSize === pageData.accounts.length}
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
				{#snippet AfterColumnLoop()}
					<th scope="col">Action</th>
				{/snippet}
				{#snippet Row(account)}
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
							<DeleteAction
								set={(formData) => formData.set('ids', JSON.stringify([account.id]))}
								handleSuccess={async ({ successResult, update }) => {
									const data = successResult.data as any;

									pageData.accounts = data.data;
									pageData.pagination = data.pagination;

									toastr.success('Account deleted');
									await update();
								}}
							/>
						</div>
					</td>
				{/snippet}
				{#snippet BottomMenu()}
					<span
						class="my-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:inline md:w-auto lg:mb-4"
						>{selectedRowsSize} of {pageData.accounts.length} row(s) selected.</span
					>
					<div class="my-4 inline-flex items-center justify-center">
						<PageSizeSelector
							{pageSizeOptions}
							url="/api/accounts"
							requestSearchParams={accountSearchParams}
							onsuccess={(newData) => {
								pageData.accounts = newData.data;
								pageData.pagination = newData.pagination;
							}}
						/>
						<Pagination
							{...pageData.pagination}
							{rowsPerPage}
							onpagechange={async (page) => {
								if (!page) return;

								accountSearchParams.page = page;
								const response = await fetch(`/api/accounts?${accountSearchParams.toString()}`);

								if (response.ok) {
									const data = (await response.json()) as {
										pagination: typeof pageData.pagination;
										data: typeof pageData.accounts;
									};
									pageData.accounts = data.data;
									pageData.pagination = data.pagination;
									return;
								}

								if (response.status === 401) {
									await applyAction({
										type: 'redirect',
										status: 401,
										location: '/sign-in'
									});
								}
							}}
							dataLength={pageData.accounts.length}
						/>
					</div>
				{/snippet}
			</Table>
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
			{#snippet content(formState)}
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
					bind:disabled={formState.submitting}
				/>

				<SubmitButton bind:disabled={formState.submitting}>
					{editAccount ? 'Save changes' : 'Create account'}
				</SubmitButton>
			{/snippet}
		</Form>
	</div>
</SideBar>
