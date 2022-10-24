<script>
	import '../app.css';
	import { App } from 'konsta/svelte';
	import { Toaster } from 'svelte-french-toast';
</script>

<!-- See This: https://svelte-french-toast.vercel.app/ -->
<main class="md:w-[465px] mx-auto">
	<Toaster />
	<App theme="ios">
		<slot />
	</App>
</main>
