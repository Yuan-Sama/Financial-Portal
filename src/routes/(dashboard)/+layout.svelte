<script lang="ts">
	import Logo from '$assets/logo.png';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { AppName } from '$lib';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const routes = [
		{
			href: '/',
			label: 'Overview'
		},
		{
			href: '/transactions',
			label: 'Transactions'
		},
		{
			href: '/accounts',
			label: 'Accounts'
		},
		{
			href: '/categories',
			label: 'Categories'
		},
		{
			href: '/settings',
			label: 'Settings'
		}
	];

	let mobileNavHidden = $state(true);
	let userMenuHidden = $state(true);
	let userMenuInstance: HTMLDivElement;

	function onclick($event: MouseEvent & { currentTarget: EventTarget & Document }) {
		if (!userMenuInstance.contains($event.target as Node)) {
			userMenuHidden = true;
		}
	}
</script>

<svelte:document onclick={(e) => onclick(e)} />

<header class="bg-gradient-to-b from-primary-700 to-primary-500 px-4 py-8 pb-36 lg:px-14">
	<div class="mx-auto max-w-screen-2xl">
		<div class="mb-14 flex w-full items-center justify-between">
			<div class="flex items-center lg:gap-x-16">
				<a href="/">
					<div class="hidden items-center lg:flex">
						<img class="h-7 w-7" src={Logo} alt="logo" />
						<span class="ml-2.5 text-2xl font-semibold text-white">
							{AppName}
						</span>
					</div>
				</a>

				<nav class="hidden items-center gap-x-2 overflow-x-auto lg:flex">
					{#each routes as route}
						<a
							class="mb-2 me-2 rounded-lg px-3 py-2 text-center text-sm font-medium text-white outline-none hover:bg-white/20 focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0 transition{$page
								.url.pathname === route.href
								? ' bg-white/10'
								: ''}"
							href={route.href}>{route.label}</a
						>
					{/each}
				</nav>

				<nav
					class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4 lg:hidden"
				>
					<button
						type="button"
						class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-white outline-none hover:bg-white/20 focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
						aria-expanded={!mobileNavHidden}
						onclick={() => (mobileNavHidden = false)}
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</button>
					<div
						class="fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto bg-white p-4 transition-transform duration-500 dark:bg-gray-800 {!mobileNavHidden
							? 'transform-none'
							: '-translate-x-full'}"
						tabindex="-1"
					>
						<h5
							id="drawer-navigation-label"
							class="text-base font-semibold uppercase text-gray-500 dark:text-gray-400"
						>
							{AppName}
						</h5>
						<button
							type="button"
							class="absolute end-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
							onclick={() => (mobileNavHidden = true)}
						>
							<svg
								aria-hidden="true"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								><path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								></path></svg
							>
							<span class="sr-only">Close menu</span>
						</button>
						<div class="overflow-y-auto py-4">
							<ul class="space-y-2 font-medium">
								{#each routes as route}
									<li>
										<a
											href={route.href}
											class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700{$page
												.url.pathname === route.href
												? ' bg-gray-200 dark:bg-gray-600'
												: ''}"
										>
											<span class="ms-3">{route.label}</span>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</div>
					{#if !mobileNavHidden}
						<div class="fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80"></div>
					{/if}
				</nav>
			</div>

			<div class="relative" bind:this={userMenuInstance}>
				<button type="button" onclick={() => (userMenuHidden = !userMenuHidden)}>
					<div
						class="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
					>
						<span class="font-medium text-gray-600 dark:text-gray-300">DE</span>
					</div>
				</button>

				<div
					class="right-0 top-11 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700 {userMenuHidden
						? 'hidden'
						: 'absolute'}"
				>
					<div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
						<div>Demo Example</div>
						<div class="truncate font-medium">{data.user.username}</div>
					</div>
					<!-- <ul
						class="py-2 text-sm text-gray-700 dark:text-gray-200"
						aria-labelledby="avatarButton"
					></ul> -->
					<div class="py-1">
						<form action="/sign-out" method="post">
							<button
								type="submit"
								class="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
								>Sign out</button
							>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-4 space-y-2">
			<h2 class="text-2xl font-medium text-white lg:text-4xl">Welcome Back 👋🏻</h2>
			<p class="text-sm text-[#89b6fd] lg:text-base">This is your financial reports</p>
		</div>
	</div>
</header>
<main class="px-3 dark:text-white lg:px-14">
	{@render children()}
</main>
