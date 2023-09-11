<script lang="ts">
	import { browser } from '$app/environment';
	import Loader from '$lib/icons/Loader.svelte';

	import { List, ListItem } from 'konsta/svelte';
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let lastUpdate: string | undefined;

	export let loading = false;
	export let title = '';
	export let syncNow = false;
	export let suffixFooter = ' (otomatis setiap 24jam)';

	const dispatch = createEventDispatcher();
	const sync = async () => {
		// prevent when still loading
		if (loading) return;
		loading = true;
		await tick();
		const props = {
			done: () => {
				loading = false;
				syncNow = false;
			}
		};
		dispatch('sync', props);
	};

	$: if (browser && syncNow) sync();
</script>

<List
	strongIos
	insetIos
	class="border bg-primary  left-0 right-0 ios:bottom-13-safe material:bottom-16-safe sticky text-white"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span on:click={sync} in:fade>
		<ListItem
			{title}
			subtitle="Terakhir diperbarui:"
			footer={(lastUpdate || 'belum diperbarui') + suffixFooter}
			colors={{
				menuListItemTextIos: 'text-white',
				menuListItemTextMaterial: 'text-white',
				primaryTextIos: 'text-white',
				primaryTextMaterial: 'text-white',
				secondaryTextIos: 'text-white',
				secondaryTextMaterial: 'text-white'
			}}
			class="cursor-pointer"
		>
			<Loader slot="after" class="{loading ? 'loading-spinner' : ''} w-8 h-8 " />
		</ListItem>
	</span>
</List>
