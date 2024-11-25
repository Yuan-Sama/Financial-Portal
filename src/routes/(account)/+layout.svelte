<script>
	import Logo from '$assets/logo.png';
	import { APP_NAME } from '$lib';

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
			{APP_NAME}
		</a>
		{@render children()}
	</div>
</section>
