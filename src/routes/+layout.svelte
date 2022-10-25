<script>
	import '../app.css';
	import { App } from 'konsta/svelte';
	import { Toaster } from 'svelte-french-toast';
	// @ts-ignore
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	// NProgress css
	import 'nprogress/nprogress.css';

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
</script>

<!-- See This: https://svelte-french-toast.vercel.app/ -->
<main class="md:w-[465px] mx-auto">
	<Toaster />
	<App theme="ios">
		<slot />
	</App>
</main>
