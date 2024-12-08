<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import { toast } from '$components/Toaster.svelte';
	import { AppName } from '$lib';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';

	let submitting = $state(false);

	const signUp: SubmitFunction = async ({}) => {
		submitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				// TODO: use form validation instead
			} else if (result.type === 'redirect') {
				toast.success('Welcome');
				await applyAction(result);
			}
			submitting = false;
		};
	};
</script>

<svelte:head>
	<title>{AppName} - Sign up</title>
</svelte:head>

<h1
	class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
>
	Create your account
</h1>

<p class="text-center text-base text-gray-400">
	Welcome! Please fill in the details to get started
</p>

<form class="space-y-4 md:space-y-6" method="POST" use:enhance={signUp}>
	<div>
		<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Your email</label
		>
		<Input
			class="w-full"
			type="email"
			name="username"
			id="email"
			placeholder="name@company.com"
			disabled={submitting}
		/>
	</div>
	<div>
		<label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Password</label
		>
		<Input
			class="w-full"
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			required
			disabled={submitting}
		/>
	</div>
	<div>
		<label
			for="confirmPassword"
			class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Confirm password</label
		>
		<Input
			class="w-full"
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			placeholder="••••••••"
			required
			disabled={submitting}
		/>
	</div>
	<Button
		class="w-full bg-primary-600 text-center font-medium text-white hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
		type="submit"
		disabled={submitting}
		>{#if submitting}
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
				<span class="sr-only">Sign up...</span>
			</div>
		{/if}Create an account</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Already have an account? <a
			href={`/sign-in${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
		>
	</p>
</form>
