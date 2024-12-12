<script lang="ts">
	import { enhance } from '$app/forms';
	import { AppName } from '$lib';
	import type { PageData } from './$types';
	import Table from '$components/tables/Table.svelte';
	import { Button, Icon, Spinner } from '$components';
	import {
		SideBar,
		SideBarCloseButton,
		SideBarHeading,
		SideBarSubHeading
	} from '$components/sidebars';
	import { Input, Label } from '$components/forms';
	import { toastr } from '$components/toasts';
	import DeleteButton from '$components/tables/DeleteButton.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let { data }: { data: PageData } = $props();
	let accounts = $state(data.accounts);

	let show = $state(false);
	let submitting = $state(false);
	let searching = $state(false);
	let editAccount = $state() as
		| {
				id: number;
				name: string;
		  }
		| undefined;
	let editForm = $derived(Boolean(editAccount));

	let selectedRows = $state({}) as { [id: number]: { id: number; name: string } };
	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	$effect(() => {
		if (!show && editAccount) editAccount = undefined;
	});

	async function handleAfterDeletion(opts: {
		update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
		result: ActionResult;
	}) {
		const { result, update } = opts;

		if (result.type === 'success') {
			const deletedAccounts = result.data?.deletedAccounts as number[];
			accounts = accounts.filter((a) => !deletedAccounts.includes(a.id));
			selectedRows = {};
			await update();
			toastr.success('Accounts deleted');
		} else if (result.type === 'failure') {
			toastr.error(result.data?.error);
		}
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
				onclick={() => (show = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="flex items-center justify-between gap-y-2 space-y-1.5 px-6">
			<div class="bg-white dark:bg-gray-900">
				<Label for="search" class="sr-only">Search</Label>

				<div class="relative mt-1">
					<div
						class="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
					>
						{#if searching}
							<Spinner />
						{:else}
							<Icon
								icon="search"
								class="size-5 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
							/>
						{/if}
					</div>

					<form
						action="?/search"
						method="post"
						onsubmit={(e) => e.preventDefault()}
						use:enhance={() => {
							searching = true;
							return async ({ result }) => {
								if (result.type === 'success') {
									accounts = result.data?.accounts as { id: number; name: string }[];
								}
								searching = false;
							};
						}}
					>
						<Input
							name="name"
							type="search"
							class="ps-10 pt-2 lg:w-80"
							placeholder="Search name"
							oninput={(event) => {
								if (!event.currentTarget.value.length) {
									accounts = data.accounts;
									return;
								}
							}}
							id="search"
							disabled={searching}
						/>
					</form>
				</div>
			</div>

			{#if selectedRowsSize > 0}
				<DeleteButton
					action="?/deleteBulk"
					appendToFormData={(formData) => {
						formData.append('ids', JSON.stringify(Object.keys(selectedRows)));
					}}
					handleActionResult={handleAfterDeletion}
				>
					Delete ({selectedRowsSize})
				</DeleteButton>
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
						<div class="flex items-center justify-center space-x-4 px-6 py-4 text-right">
							<div class="flex items-center justify-center">
								<button
									onclick={() => {
										editAccount = account;
										show = true;
									}}
									title="Edit"
								>
									<Icon icon="edit" class="font-medium text-blue-600 dark:text-blue-500" />
								</button>
							</div>
							<div class="flex items-center justify-center">
								<DeleteButton
									type="icon"
									appendToFormData={(formData) => {
										formData.append('id', `${account.id}`);
									}}
									handleActionResult={handleAfterDeletion}
								/>
							</div>
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

<SideBar bind:show outsideclose direction="right" class="w-full lg:max-w-md">
	<SideBarCloseButton onclick={() => (show = false)} left />

	<div class="overflow-y-auto px-3 py-7">
		<SideBarHeading textCenter>{AppName}</SideBarHeading>

		<SideBarSubHeading>Create a new account to track your transactions.</SideBarSubHeading>

		<form
			class="mt-5"
			use:enhance={({}) => {
				submitting = true;

				return async ({ update, result }) => {
					if (result.type === 'success') {
						const updatedAccount = result.data?.updatedAccount as
							| { id: number; name: string }
							| undefined;
						if (updatedAccount) {
							toastr.success('Account updated');
							const currentAccount = accounts.find((a) => a.id === updatedAccount.id);

							if (currentAccount) {
								currentAccount.name = updatedAccount.name;
							}

							editAccount = undefined;
						} else {
							toastr.success('Account created');
							accounts = result.data?.accounts as { id: number; name: string }[];
						}
						await update();
						show = false;
					} else if (result.type === 'failure') {
						toastr.error(result.data?.error);
					}
					submitting = false;
				};
			}}
			method="POST"
			action={editForm ? '?/edit' : '?/create'}
		>
			<Label for="name">Name</Label>
			{#if editAccount}
				<input type="number" hidden name="id" value={editAccount.id} />
				<Input
					class="mt-3 w-full"
					placeholder="e.g. Cash, Bank, Credit Card"
					value={editAccount.name}
					id="name"
					name="name"
					bind:disabled={submitting}
				/>
			{:else}
				<Input
					class="mt-3 w-full"
					placeholder="e.g. Cash, Bank, Credit Card"
					id="name"
					name="name"
					bind:disabled={submitting}
				/>
			{/if}
			<Button class="mt-5 w-full font-medium" bind:disabled={submitting}>
				{#if submitting}
					<div role="status" class="me-2 inline">
						<Spinner ScreenReader="Creating..." inline />
					</div>
				{/if}{editForm ? 'Save changes' : 'Create account'}</Button
			>
		</form>
	</div>
</SideBar>
