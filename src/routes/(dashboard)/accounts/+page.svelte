<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import OffCanvasSidebar from '$components/OffCanvasSidebar.svelte';
	import { AppName } from '$lib';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { toastr } from '$components/Toastr.svelte';
	import Spinner from '$components/Spinner.svelte';
	import Label from '$components/Label.svelte';

	let { data }: { data: PageData } = $props();
	let accounts = $state(data.accounts);

	let hide = $state(true);
	let createFormSubmitting = $state(false);

	const submiteCreateAccount: SubmitFunction = ({}) => {
		createFormSubmitting = true;

		return async ({ update, result }) => {
			if (result.type === 'success') {
				toastr.success('Account created');
				accounts = result.data?.accounts;
				await update();
				hide = true;
			} else if (result.type === 'failure') {
				toastr.error(result.data?.error);
			}
			createFormSubmitting = false;
		};
	};

	let selectedRows = $state({}) as { [id: number]: { id: number; name: string } };
	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	$inspect(selectedRows);
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
				onclick={() => (hide = false)}
				><svg
					class="mr-2 size-4"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					style="fill: currentColor;transform: ;msFilter:;"
					><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg
				>Add new</Button
			>
		</div>

		<div class="flex items-center justify-between gap-y-2 space-y-1.5 px-6">
			<div class="bg-white dark:bg-gray-900">
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative mt-1">
					<div
						class="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
					>
						<svg
							class="h-4 w-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<Input type="text" class="ps-10 pt-2 lg:w-80" placeholder="Search for items" />
				</div>
			</div>

			{#if selectedRowsSize > 0}
				<form
					action="?/delete"
					method="post"
					use:enhance={({ formData }) => {
						formData.append('ids', JSON.stringify(Object.keys(selectedRows)));

						return async ({ update, result }) => {
							if (result.type === 'success') {
								const deletedAccounts = result.data?.deletedAccounts as number[];
								accounts = accounts.filter((a) => !deletedAccounts.includes(a.id));
								selectedRows = {};
								await update();
								toastr.success('Accounts deleted');
							} else if (result.type === 'failure') {
								toastr.error(result.data?.error);
							}
						};
					}}
				>
					<Button
						color="red"
						outline
						size="sm"
						class="inline-flex items-center justify-center"
						type="submit"
					>
						<svg
							class="-ml-1 mr-1 h-5 w-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
								clip-rule="evenodd"
							></path></svg
						>
						Delete ({selectedRowsSize})
					</Button>
				</form>
			{/if}
		</div>

		<div class="p-6">
			<table
				class="w-full overflow-x-auto border text-gray-500 shadow-md dark:text-gray-400 sm:rounded-sm"
			>
				<thead class="bg-gray-100 dark:bg-gray-800">
					<tr>
						<th scope="col" class="p-4">
							<div class="flex items-center">
								<input
									id="checkbox-all-search"
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
									class="h-4 w-4 cursor-pointer rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
									aria-label="Select all"
								/>
								<label for="checkbox-all-search" class="sr-only">checkbox</label>
							</div>
						</th>
						{#each ['Name'] as column}
							<th scope="col" class="px-5 py-3 uppercase">
								<span class="flex items-center"> {column} </span>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each accounts as acc}
						<tr
							class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
						>
							<td class="w-4 p-4">
								<div class="flex items-center">
									<!-- TODO: extract to component -->
									<input
										type="checkbox"
										checked={Boolean(selectedRows[acc.id])}
										onchange={(e) => {
											if (e.currentTarget.checked) {
												selectedRows[acc.id] = acc;
											} else if (!e.currentTarget.checked && selectedRows[acc.id]) {
												delete selectedRows[acc.id];
											}
										}}
										class="h-4 w-4 cursor-pointer rounded-lg border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
									/>
									<label for="checkbox-table-search-1" class="sr-only">checkbox</label>
								</div>
							</td>
							<td class="px-5 py-3">{acc.name}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex-column flex flex-wrap items-center justify-between px-6 pt-4 md:flex-row">
			<span
				class="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto"
				>{selectedRowsSize} of {accounts.length} row(s) selected.</span
			>
		</div>
	</div>
</div>

<OffCanvasSidebar bind:hide position="right" class="w-full lg:max-w-md">
	<div class="overflow-y-auto px-4 py-7">
		<h5 class="text-center text-xl font-bold text-gray-800 dark:text-gray-200">
			{AppName}
		</h5>
		<p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
			Create a new account to track your transactions.
		</p>
		<form class="mt-5" use:enhance={submiteCreateAccount} method="POST" action="?/create">
			<Label for="name">Name</Label>
			<Input
				class="mt-3 w-full"
				placeholder="e.g. Cash, Bank, Credit Card"
				id="name"
				name="name"
				bind:disabled={createFormSubmitting}
			/>
			<Button class="mt-5 w-full font-medium" bind:disabled={createFormSubmitting}>
				{#if createFormSubmitting}
					<div role="status" class="me-2 inline">
						<Spinner ScreenReader="Creating..." inline />
					</div>
				{/if}Create account</Button
			>
		</form>
	</div>
</OffCanvasSidebar>
