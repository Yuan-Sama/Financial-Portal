<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import { AppName } from '$lib';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';
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
		<Input type="email" name="email" id="email" placeholder="name@company.com" required />
	</div>
	<div>
		<label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Password</label
		>
		<Input type="password" name="password" id="password" placeholder="••••••••" required />
	</div>
	<div>
		<label
			for="confirmPassword"
			class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Confirm password</label
		>
		<Input
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			placeholder="••••••••"
			required
		/>
	</div>
	<!-- TODO: enhance error alert -->
	{#if form?.error}
		<p class="font-semibold text-red-700">{form.error}</p>
	{/if}
	<Button
		class="w-full bg-primary-600 text-center font-medium text-white hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
		type="submit">Create an account</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Already have an account? <a
			href={`/sign-in${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
		>
	</p>
</form>
