<script lang="ts">
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import OffCanvasSidebar from '$components/OffCanvasSidebar.svelte';
	import { AppName } from '$lib';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let hide = $state(true);
	let name = $state('');

	async function createNewAccount(
		$event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	): Promise<any> {
		$event.stopPropagation();
		$event.preventDefault();
		const response = await fetch('/api/accounts', {
			method: 'POST',
			body: JSON.stringify({
				name
			})
		});

		const data = await response.json();
		console.log(data);
	}
</script>

<svelte:head>
	<title>{AppName} - Dashboard</title>
</svelte:head>

<Button class="mt-3 bg-primary-600 text-white hover:bg-primary-700" onclick={() => (hide = false)}
	>Add an account</Button
>
<OffCanvasSidebar bind:hide position="right" class="w-full lg:max-w-md">
	<div class="overflow-y-auto px-4 py-7">
		<h5 class="text-center text-xl font-bold text-gray-800 dark:text-gray-200">
			{AppName}
		</h5>
		<p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
			Create a new account to track your transactions.
		</p>
		<form class="mt-5" onsubmit={(e) => createNewAccount(e)}>
			<label for="name" class="block text-base font-bold text-gray-800 dark:text-gray-200"
				>Name</label
			>
			<Input class="mt-3" placeholder="e.g. Cash, Bank, Credit Card" bind:value={name} />
			<Button
				class="mt-5 w-full bg-primary-600 text-center text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
				>Create account</Button
			>
		</form>
	</div>
</OffCanvasSidebar>
