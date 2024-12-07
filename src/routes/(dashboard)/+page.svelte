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
				hide = true;
				toast.success('Account created');
			} else if (result.type === 'failure') {
				toast.error(result.data?.error);
			}
			submitting = false;
		};
	};
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
		<form class="mt-5" use:enhance={submiteCreateAccount} method="POST" action="?/createAccount">
			<label for="name" class="block text-base font-bold text-gray-800 dark:text-gray-200"
				>Name</label
			>
			<Input
				class="mt-3"
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
