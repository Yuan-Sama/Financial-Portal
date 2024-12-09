<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ButtonLoader from '$components/ButtonLoader.svelte';
	import Input from '$components/Input.svelte';
	import Label from '$components/Label.svelte';
	import { toastr } from '$components/Toastr.svelte';
	import { AppName } from '$lib';

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';

	let submitting = $state(false);
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

<form
	class="space-y-4 md:space-y-6"
	method="post"
	use:enhance={async () => {
		submitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				toastr.error(result.data?.error);
				submitting = false;
				return;
			}
			toastr.success('Welcome back');
			await applyAction(result);
		};
	}}
>
	<div>
		<Label for="email">Your email</Label>
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
		<Label for="password">Password</Label>
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
	<Button color="primary" class="w-full font-medium" type="submit" bind:disabled={submitting}
		><ButtonLoader bind:show={submitting} />Sign in</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Don’t have an account yet? <a
			href={`/sign-up${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
		>
	</p>
</form>
