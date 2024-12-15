<script>
	import Marketing from '$assets/marketing.jpg';
	import { AppName } from '$lib/index.svelte';

	/**
	 * @type {{
	 * 	data: import('./$types').PageData
	 * }}
	 */
	let { data } = $props();
</script>

<svelte:head>
	<meta name="title" content="{AppName} - Software solutions help you manage finance" />

	<meta
		name="description"
		content="Managing your finances has never been easy. We are here to help you manage your finances
	online, anywhere, and anytime"
	/>

	<title>{AppName} - Software solutions help you manage finance</title>
</svelte:head>

<div class="min-h-full bg-[#f2ece5]">
	<main
		class="mx-auto grid h-screen max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0"
	>
		<div class="mr-auto place-self-center lg:col-span-6">
			<h1
				class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl"
			>
				Software solutions help you manage finance
			</h1>
			<p class="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl">
				Managing your finances has never been easy. We are here to help you manage your finances
				online, anywhere, and anytime
			</p>
			{#if data.user}
				<a
					href="/"
					class="mr-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
				>
					Dashboard
				</a>
			{:else}
				<a
					href="/sign-in"
					class="mr-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
				>
					Sign in
					<svg
						class="-mr-1 ml-2 h-5 w-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path></svg
					>
				</a>
				<a
					href="/sign-up"
					class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
				>
					Create your account
				</a>
			{/if}
		</div>
		<div class="hidden lg:col-span-6 lg:mt-0 lg:flex">
			<img src={Marketing} alt="mockup" />
		</div>
	</main>
</div>
