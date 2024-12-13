<script>
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
</script>

<div class="inline-flex items-center justify-center gap-x-2">
	<!-- Buttons -->
	<Button color="light" size="sm" noborder title="First" class="h-8">
		<Icon icon="chevrons-left" class="m-auto size-5" />
	</Button>
	<Button color="light" size="sm" noborder title="Prev" class="h-8">
		<Icon icon="chevron-left" class="m-auto size-5" />
	</Button>
	<span class="text-sm text-gray-700 dark:text-gray-400">
		<span class="font-semibold text-gray-900 dark:text-white">1</span> to
		<span class="font-semibold text-gray-900 dark:text-white">10</span>
		of <span class="font-semibold text-gray-900 dark:text-white">100</span>
	</span>
	<Button color="light" size="sm" noborder title="Next" class="h-8">
		<Icon icon="chevron-right" class="m-auto size-5" />
	</Button>
	<Button color="light" size="sm" noborder title="Last" class="h-8">
		<Icon icon="chevrons-right" class="m-auto size-5" />
	</Button>
</div>