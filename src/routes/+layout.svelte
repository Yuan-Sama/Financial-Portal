<script>
	import Logo from '$assets/logo.png';
	import BackToTop from '$components/BackToTop.svelte';
	import Toaster from '$components/Toaster.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="shortcut icon" href={Logo} type="image/png" />
</svelte:head>

<Toaster class="max-w-xl space-y-3" yPosition="bottom">
	{#snippet toastInstance({ id, type, message }, remove)}
		<div
			class="flex w-96 max-w-sm items-center rounded-lg bg-gray-400 p-4 shadow-lg dark:bg-gray-700 dark:text-gray-200"
			role="alert"
		>
			<div
				class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg {type ===
				'success'
					? 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'
					: type === 'error'
						? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'
						: type === 'warning'
							? 'bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-200'
							: 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200'}"
			>
				{#if type === 'success'}
					<svg
						class="h-5 w-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
						/>
					</svg>
					<span class="sr-only">Check icon</span>
				{:else if type === 'error'}
					<svg
						class="h-5 w-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
						/>
					</svg>
					<span class="sr-only">Error icon</span>
				{:else if type === 'warning'}
					<svg
						class="h-5 w-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
						/>
					</svg>
					<span class="sr-only">Warning icon</span>
				{:else}
					<svg
						class="h-4 w-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 18 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
						/>
					</svg>
					<span class="sr-only">Fire icon</span>
				{/if}
			</div>
			<div class="ms-3 text-sm font-normal">{message}</div>
			<button
				type="button"
				class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-400 p-1.5 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-white"
				aria-label="Close"
				onclick={() => remove(id)}
			>
				<span class="sr-only">Close</span>
				<svg
					class="h-3 w-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
					/>
				</svg>
			</button>
		</div>
	{/snippet}
</Toaster>

{@render children()}

<BackToTop class="rounded-full">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		style="fill: currentColor;transform: ;msFilter:;"
		><path d="m12 3.879-7.061 7.06 2.122 2.122L12 8.121l4.939 4.94 2.122-2.122z"></path><path
			d="m4.939 17.939 2.122 2.122L12 15.121l4.939 4.94 2.122-2.122L12 10.879z"
		></path></svg
	>
</BackToTop>
