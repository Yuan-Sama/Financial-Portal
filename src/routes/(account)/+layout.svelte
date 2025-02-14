<script>
	import Logo from '$assets/logo.png';
	import { AppName } from '$lib';

	/**
	 * @type {{
	 * 	data: import('./$types').LayoutData,
	 *  children: import('svelte').Snippet
	 * }}
	 */
	let { data, children } = $props();
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
		<a href="/" class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="mr-2 h-8 w-8" src={Logo} alt="logo" />
			{AppName}
		</a>
		<div
			class="w-full rounded-lg bg-white shadow-sm dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				{@render children()}
			</div>
		</div>
	</div>
</section>
