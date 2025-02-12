<script lang="ts">
	import { page } from '$app/stores';
	import { toastr } from '$components/toasts';
	import { Form, Input, Label, SubmitButton, ValidationText } from '$components/forms';
	import { AppName } from '$lib';
	import type { ActionData } from './$types';

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';

	let { form }: { form: ActionData } = $props();
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

<Form
	class="space-y-4 md:space-y-6"
	handleRedirect={() => {
		toastr.success('Welcome');
	}}
>
	{#snippet content(formState)}
		<div>
			<Label for="email">Your email</Label>
			<Input
				class="w-full"
				type="email"
				name="username"
				id="email"
				placeholder="name@company.com"
				required
				error={Boolean(form?.validationErrors?.username)}
				bind:disabled={formState.submitting}
			/>
			<ValidationText error={form?.validationErrors?.username} />
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
				error={Boolean(form?.validationErrors?.password)}
				bind:disabled={formState.submitting}
				autocomplete="off"
			/>
			<ValidationText error={form?.validationErrors?.password} />
		</div>

		<div>
			<Label for="confirmPassword">Confirm password</Label>
			<Input
				class="w-full"
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				placeholder="••••••••"
				required
				error={Boolean(form?.validationErrors?.confirmPassword)}
				bind:disabled={formState.submitting}
				autocomplete="off"
			/>
			<ValidationText error={form?.validationErrors?.confirmPassword} />
		</div>

		<SubmitButton bind:disabled={formState.submitting}>Create an account</SubmitButton>

		<p class="text-sm font-light text-gray-500 dark:text-gray-400">
			Already have an account? <a
				href={`/sign-in${params}`}
				class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a
			>
		</p>
	{/snippet}
</Form>
