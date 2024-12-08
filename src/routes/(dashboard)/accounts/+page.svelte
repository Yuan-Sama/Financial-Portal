<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import OffCanvasSidebar from '$components/OffCanvasSidebar.svelte';
	import { AppName } from '$lib';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { toast } from '$components/Toaster.svelte';

	let { data }: { data: PageData } = $props();
	let accounts = $state(data.accounts.map((a) => Object.assign({ checked: false }, a)));

	let hide = $state(true);
	let submitting = $state(false);

	const submiteCreateAccount: SubmitFunction = ({
		formData,
		action,
		cancel,
		submitter,
		controller,
		formElement
	}) => {
		submitting = true;

		return async ({ update, result }) => {
			if (result.type === 'success') {
				await update();
				accounts = result.data?.accounts;
				hide = true;
				toast.success('Account created');
			} else if (result.type === 'failure') {
				toast.error(result.data?.error);
			}
			submitting = false;
		};
	};

	let checkedAll = $derived(
		accounts.map((a) => a.checked).reduce((pre, cur) => (pre = pre && cur))
	);
	$inspect(accounts);
	$inspect(checkedAll);
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
				class="flex items-center justify-center bg-primary-600 text-white hover:bg-primary-700"
				size="small"
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

		<div class="flex justify-between pb-4">
			<div class="bg-white dark:bg-gray-900">
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative mt-1 ps-1">
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

			{#if accounts.reduce((count, a) => (count += Number(a.checked)), 0) > 0}
				<button
					type="button"
					class="inline-flex items-center rounded-lg border border-red-600 px-3 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
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
					Delete
				</button>
			{/if}
		</div>

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
								checked={checkedAll}
								onchange={($event) => {
									accounts.map((a) => (a.checked = $event.currentTarget.checked));
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
				{#each accounts as acc, idx}
					<tr
						class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
					>
						<td class="w-4 p-4">
							<div class="flex items-center">
								<input
									id="checkbox-table-search-1"
									type="checkbox"
									bind:checked={acc.checked}
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

		<div class="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row">
			<span
				class="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto"
				>{accounts.reduce((count, a) => (count += Number(a.checked)), 0)} of {accounts.length} row(s)
				selected.</span
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
			<label for="name" class="block text-base font-bold text-gray-800 dark:text-gray-200"
				>Name</label
			>
			<Input
				class="mt-3 w-full"
				placeholder="e.g. Cash, Bank, Credit Card"
				id="name"
				name="name"
				disabled={submitting}
			/>
			<Button
				class="mt-5 w-full bg-primary-600 text-center text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
				disabled={submitting}
			>
				{#if submitting}
					<div role="status" class="me-3 inline">
						<svg
							aria-hidden="true"
							class="inline h-4 w-4 animate-spin fill-gray-600 text-white dark:fill-gray-300"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Creating...</span>
					</div>
				{/if}Create account</Button
			>
		</form>
	</div>
</OffCanvasSidebar>
