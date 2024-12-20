<script>
	import Logo from '$assets/logo.png';
	import { fly } from 'svelte/transition';
	import '../app.css';
	import { cubicInOut } from 'svelte/easing';
	import { Toast, Toastr } from '$components/base/toasts';
	import BackToTop from '$components/BackToTop.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="shortcut icon" href={Logo} type="image/png" />
</svelte:head>

<Toastr class="bottom-5 left-5" maxQueueSize={7} pushFrom="bottom">
	{#snippet toast({ id, type, content }, removeFn, pushFrom)}
		<div
			in:fly={{ y: 50 * (pushFrom === 'top' ? -1 : 1), duration: 1000, easing: cubicInOut }}
			out:fly={{ y: 50 * (pushFrom === 'top' ? 1 : -1), duration: 1000, easing: cubicInOut }}
		>
			<Toast {content} {id} {removeFn} {type} />
		</div>
	{/snippet}
</Toastr>

{@render children()}

<BackToTop />
