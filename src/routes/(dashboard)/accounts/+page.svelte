<script lang="ts">
	import { AppName } from '$lib';
	import type { PageData } from './$types';
	import { Button, Icon } from '$components';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/sidebars';
	import { Form, Input, Label, SubmitButton } from '$components/forms';
	import { toastr } from '$components/toasts';
	import { DeleteAction, DeleteBulk, SearchBar, Table } from '$components/tables';

	let { data }: { data: PageData } = $props();
	let accounts = $state(data.accounts);

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

	async function deleteSelectedAccounts(
		deletedAccounts: number[],
		update: { (options?: { reset?: boolean; invalidateAll?: boolean }): Promise<void>; (): any }
	) {
		if (deletedAccounts.length > 1) toastr.success('Accounts deleted');
		else if (deletedAccounts.length === 1) toastr.success('Account deleted');

		accounts = accounts.filter((a) => !deletedAccounts.includes(a.id));
		selectedRows = {};

		await update();
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
				Accounts
			</span>

			<Button
				class="flex items-center justify-center font-medium"
				size="sm"
				onclick={() => (showSideBar = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="flex items-center justify-between gap-y-2 space-y-1.5 px-6">
			<div class="bg-white dark:bg-gray-900">
				<SearchBar
					id="search"
					name="name"
					placeholder="Search for accounts"
					oninput={(event) => {
						if (!event.currentTarget.value.length) {
							accounts = data.accounts;
							return;
						}
					}}
					handleSuccess={async ({ successResult }) => {
						accounts = successResult.data?.accounts as { id: number; name: string }[];
					}}
				/>
			</div>

			{#if selectedRowsSize > 0}
				<DeleteBulk
					set={(formData) => formData.set('ids', JSON.stringify(Object.keys(selectedRows)))}
					handleSuccess={async ({ successResult, update }) =>
						deleteSelectedAccounts(successResult.data!.deletedAccounts as number[], update)}
				>
					Delete ({selectedRowsSize})
				</DeleteBulk>
			{/if}
		</div>

		<div class="p-6">
			<Table headings={['Name']} data={accounts}>
				{#snippet BeforeColumnLoop()}
					<th scope="col" class="p-4">
						<div class="flex items-center">
							<Input
								id="check-all"
								type="checkbox"
								checked={selectedRowsSize > 0 && selectedRowsSize === accounts.length}
								onchange={(e) => {
									if (e.currentTarget.checked)
										selectedRows = accounts.reduce(
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
				{#snippet Column({ idx, heading })}
					<th scope="col" class="px-5 py-3 uppercase">
						<span class="flex items-center"> {heading} </span>
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
					<td class="w-10/12 px-5 py-3">{account.name}</td>
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
								set={(formData) => formData.set('id', `${account.id}`)}
								handleSuccess={async ({ successResult, update }) =>
									deleteSelectedAccounts(successResult.data!.deletedAccounts as number[], update)}
							/>
						</div>
					</td>
				{/snippet}
			</Table>
		</div>

		<div class="flex-column flex flex-wrap items-center justify-between px-6 pt-4 md:flex-row">
			<span
				class="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto"
				>{selectedRowsSize} of {accounts.length} row(s) selected.</span
			>
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
			action={editAccount ? '?/edit' : '?/create'}
			handleSuccess={async ({ successResult, update }) => {
				showSideBar = false;

				const { data } = successResult;
				const updatedAccount = data?.updatedAccount as { id: number; name: string } | undefined;

				if (updatedAccount) {
					toastr.success('Account updated');
					const currentAccount = accounts.find((a) => a.id === updatedAccount.id);

					if (currentAccount) {
						currentAccount.name = updatedAccount.name;
					}

					editAccount = undefined;
				} else {
					toastr.success('Account created');
					accounts = data?.accounts as { id: number; name: string }[];
				}

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
