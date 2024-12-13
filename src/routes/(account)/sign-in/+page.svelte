<script lang="ts">
	import { page } from '$app/stores';
	import { Form, Input, Label, SubmitButton } from '$components/forms';
	import { toastr } from '$components/toasts';
	import { AppName } from '$lib';

	const { searchParams } = $page.url;
	const params = searchParams.size ? `?${searchParams}` : '';
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

<Form
	class="space-y-4 md:space-y-6"
	handleRedirect={() => {
		toastr.success('Welcome back');
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
				disabled={formState.submitting}
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
				disabled={formState.submitting}
			/>
		</div>

		<SubmitButton bind:disabled={formState.submitting}>Sign in</SubmitButton>

		<p class="text-sm font-light text-gray-500 dark:text-gray-400">
			Don’t have an account yet? <a
				href={`/sign-up${params}`}
				class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
			>
		</p>
	{/snippet}
</Form>
