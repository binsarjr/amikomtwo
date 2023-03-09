<script>
	import '../app.css';
	import { App } from 'konsta/svelte';
	import { Toaster } from 'svelte-french-toast';
	// @ts-ignore
	import NProgress from 'nprogress';
	import { navigating, page } from '$app/stores';

	// NProgress css
	import 'nprogress/nprogress.css';
	import { authUser, isIos } from '$lib/stores/preferences';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
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
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
	onMount(() => {
		// @ts-ignore
		$isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	});
</script>

<!-- See This: https://svelte-french-toast.vercel.app/ -->
<main class="md:w-[465px] mx-auto">
	<Toaster />
	<App theme="ios">
		<slot />
	</App>
</main>
