<script>
	import '../app.css';
	import { App, Block, Button, Page } from 'konsta/svelte';
	import { Toaster } from 'svelte-french-toast';
	// @ts-ignore: no types
	import NProgress from 'nprogress';
	import { navigating, page } from '$app/stores';

	// NProgress css
	import 'nprogress/nprogress.css';
	import { authUser, isIos, pageLoader } from '$lib/stores/preferences';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import NoticeBar from '$lib/components/NoticeBar.svelte';
	$: if ($authUser?.accessToken && browser) {
		if (
			!$page.url.pathname.startsWith('/onedevice') &&
			!$page.url.pathname.startsWith('/presensi')
		) {
			goto('/onedevice');
		}
	}

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16,
		template:
			'<div class="bar" style="height:4px;" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	});

	$: {
		if ($pageLoader) {
			if ($navigating) {
				NProgress.start();
			}
			if (!$navigating) {
				NProgress.done();
			}
		}
	}
	onMount(() => {
		// @ts-ignore: no types
		$isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	});
</script>

<!-- See This: https://svelte-french-toast.vercel.app/ -->
<main class="md:w-[465px] mx-auto">
	<Toaster position="top-right" />
	<App theme="ios">
		<NoticeBar />
		<slot />
	</App>
</main>

<style>
	:global(#nprogress .bar) {
		@apply bg-primary;
	}
	:global(#nprogress .spinner-icon) {
		@apply border-primary;
	}
</style>
