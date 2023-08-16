<script lang="ts">
	import { browser } from '$app/environment';
	import { serviceClient } from '$lib/serviceClient';
	import { listBank } from '$lib/stores/pembayaran';
	import { authUser, pageLoader, preferences } from '$lib/stores/preferences';
	import { trpc } from '$lib/trpc/client';
	import type { RouterOutputs } from '$lib/trpc/t';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let items: RouterOutputs['pembayaran']['tagihan'] = [];

	let running = false;
	const getData = async () => {
		if (running) return;
		running = true;
		const id = toast.loading('tunggu sebentar');
		items = await trpc().pembayaran.tagihan.query({
			token: $authUser?.accessToken || '',
			npm: $preferences.nim
		});
		toast.success('selesai', { id });
		running = false;
	};

	onMount(async () => {
		await getData();
	});
	onDestroy(() => {
		toast.remove();
	});
</script>

<div>
	<BlockTitle>Tagihan</BlockTitle>
	<List strongIos insetIos outlineIos>
		{#each items as item}
			<ListItem
				title={item.nama_kwj}
				footer={'TA ' + item.tha + ' - ' + item.semester}
				after={'Rp.' + item.tagihan.toLocaleString('id-ID')}
			/>
		{/each}
	</List>
</div>
