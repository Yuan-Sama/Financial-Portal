<script lang="ts">
	import { AppName } from '$lib';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{AppName} - Dashboard</title>
</svelte:head>

<header>
	<form action="/sign-out" method="post">
		<button type="submit">Sign out</button>
	</form>
</header>

<h1>Dashboard</h1>
