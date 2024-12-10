<script lang="ts">
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import Label from '$components/Label.svelte';
	import SideBar from '$components/sidebar/SideBar.svelte';
	import SideBarCloseButton from '$components/sidebar/SideBarCloseButton.svelte';
	import SideBarHeading from '$components/sidebar/SideBarHeading.svelte';
	import { AppName } from '$lib';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let show = $state(false);
</script>

<svelte:head>
	<title>{AppName} - Dashboard</title>
</svelte:head>

<Button id="abc" onclick={() => (show = true)}>Show sidebar</Button>

<SideBar bind:show triggerId="#abc">
	<SideBarCloseButton onclick={() => (show = false)} />
	<div class="overflow-y-auto px-4 py-7">
		<SideBarHeading>{AppName}</SideBarHeading>
		<p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
			Create a new account to track your transactions.
		</p>
		<form class="mt-5" method="POST" action="?/create">
			<Label for="name">Name</Label>
			<Input class="mt-3 w-full" placeholder="e.g. Cash, Bank, Credit Card" id="name" name="name" />
			<Button class="mt-5 w-full font-medium">Create account</Button>
		</form>
	</div>
</SideBar>
