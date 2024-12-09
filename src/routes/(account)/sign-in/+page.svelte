<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ButtonLoader from '$components/ButtonLoader.svelte';
	import Input from '$components/Input.svelte';
	import { toastr } from '$components/Toastr.svelte';
	import { AppName } from '$lib';
	import type { SubmitFunction } from '@sveltejs/kit';

	let searchParams = $page.url.searchParams;
	let params = searchParams.size ? `?${searchParams}` : '';

	let submitting = $state(false);

	const signIn: SubmitFunction = async ({}) => {
		submitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				toastr.error(result.data?.error);
			} else if (result.type === 'redirect') {
				toastr.success('Welcome back');
				await applyAction(result);
			}
			submitting = false;
		};
	};
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

<form class="space-y-4 md:space-y-6" method="post" use:enhance={signIn}>
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
			required
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
	<Button color="primary" class="w-full" type="submit" disabled={submitting}
		><ButtonLoader bind:show={submitting} />Sign in</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Don’t have an account yet? <a
			href={`/sign-up${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
		>
	</p>
</form>
