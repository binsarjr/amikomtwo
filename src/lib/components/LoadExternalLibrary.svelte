<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let source: string;
	export { source as src };
	const dispatch = createEventDispatcher();

	let alreadyLoad = false;

	const load = async () => {
		if (alreadyLoad) return;
		alreadyLoad = true;
		await new Promise((resolve) => setTimeout(resolve, 100));

		dispatch('load');
	};

	onMount(() => {
		load();
	});
</script>

<svelte:head>
	<script src={source} on:load={load}></script>
</svelte:head>
