<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import { AppName } from '$lib';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchParams = $page.url.searchParams;
	let params = searchParams.size ? `?${searchParams}` : '';
</script>

<svelte:head>
	<title>{AppName} - Sign in</title>
</svelte:head>

<h1
	class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
>
	Sign in to {AppName}
</h1>

<p class="text-center text-base text-gray-400">Welcome back! Please sign in to continue</p>

<form class="space-y-4 md:space-y-6" method="post">
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
	<!-- TODO: enhance error alert -->
	{#if form?.error}
		<p class="font-semibold text-red-700">{form.error}</p>
	{/if}
	<Button
		class="w-full bg-primary-600 text-center font-medium text-white hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
		type="submit">Sign in</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Don’t have an account yet? <a
			href={`/sign-up${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
		>
	</p>
</form>
