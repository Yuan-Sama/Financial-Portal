<script lang="ts">
	import { AppName } from '$lib';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
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

<form class="space-y-4 md:space-y-6" method="POST">
	<div>
		<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Your email</label
		>
		<input
			type="email"
			name="email"
			id="email"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			placeholder="name@company.com"
			required
		/>
	</div>
	<div>
		<label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Password</label
		>
		<input
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			required
		/>
	</div>
	<div>
		<label
			for="confirmPassword"
			class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Confirm password</label
		>
		<input
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			placeholder="••••••••"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			required
		/>
	</div>

	{#if form?.error}
		<p class="font-semibold text-red-700">{form.error}</p>
	{/if}
	<button
		type="submit"
		class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
		>Create an account</button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Already have an account? <a
			href="/sign-in"
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
		>
	</p>
</form>
