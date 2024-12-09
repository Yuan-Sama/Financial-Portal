<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ButtonLoader from '$components/ButtonLoader.svelte';
	import Input from '$components/Input.svelte';
	import Label from '$components/Label.svelte';
	import { toastr } from '$components/Toastr.svelte';
	import { AppName } from '$lib';
	import type { ActionData } from './$types';

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	$inspect(form);
	$inspect(submitting);
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

<form
	class="space-y-4 md:space-y-6"
	method="POST"
	use:enhance={async () => {
		submitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				if (result.data?.validationErrors) {
					submitting = false;
					await applyAction(result);
					return;
				}

				submitting = false;
				toastr.error(result.data?.error);
				return;
			}

			toastr.success('Welcome');
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
			disabled={submitting}
		/>
	</div>
	<div>
		<Label for="confirmPassword">Confirm password</Label>
		<Input
			class="w-full"
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			placeholder="••••••••"
			disabled={submitting}
		/>
	</div>
	<Button class="w-full font-medium" type="submit" bind:disabled={submitting} color="primary"
		><ButtonLoader bind:show={submitting} />Create an account</Button
	>
	<p class="text-sm font-light text-gray-500 dark:text-gray-400">
		Already have an account? <a
			href={`/sign-in${params}`}
			class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
		>
	</p>
</form>
