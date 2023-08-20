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

	let bankSelectedIndex = 0;
	let items: RouterOutputs['pembayaran']['payment'] = [];

	let running = false;
	const getData = async () => {
		if (running) return;
		running = true;
		const id = toast.loading('tunggu sebentar');
		items = await trpc().pembayaran.payment.query({
			token: $authUser?.accessToken || '',
			bank: $listBank[bankSelectedIndex],
			npm: $preferences.nim
		});
		toast.success('selesai', { id });
		running = false;
	};

	$: if (browser && typeof bankSelectedIndex !== 'undefined') {
		getData();
	}
	onDestroy(() => {
		toast.remove();
	});
</script>

<div>
	<BlockTitle>Info Biaya dan Nomor VA</BlockTitle>
	<Block>
		<select
			bind:value={bankSelectedIndex}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
		>
			{#each $listBank as bank, i}
				<option value={i}>{bank}</option>
			{/each}
		</select>
	</Block>
	<BlockTitle>Pembayaran {$listBank[bankSelectedIndex]}</BlockTitle>
	<List strongIos insetIos outlineIos>
		{#each items as item}
			<ListItem title={item.va} footer={item.nama_kwj}>
				<span slot="after"
					>{item.alias_nominal || 'Rp.' + item.nominal.toLocaleString('id-ID')}</span
				>
			</ListItem>
		{/each}
	</List>
</div>
