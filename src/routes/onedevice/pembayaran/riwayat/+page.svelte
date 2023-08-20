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

	let items: {
		tha: string;
		items: {
			semester: string;
			items: RouterOutputs['pembayaran']['histori'];
		}[];
	}[] = [];

	let running = false;
	const getData = async () => {
		if (running) return;
		running = true;
		const id = toast.loading('tunggu sebentar');
		const results = await trpc().pembayaran.histori.query({
			token: $authUser?.accessToken || '',
			npm: $preferences.nim
		});

		items = [];
		results.map((result) => {
			let thaIndex = items.findIndex((item) => item.tha == result.tha);
			if (thaIndex == -1) {
				thaIndex = items.length;
				items[thaIndex] = {
					tha: result.tha,
					items: []
				};
			}

			let semesterIndex = items[thaIndex].items.findIndex(
				(item) => item.semester == result.semester
			);
			if (semesterIndex == -1) {
				semesterIndex = items[thaIndex].items.length;
				items[thaIndex].items[semesterIndex] = {
					semester: result.semester,
					items: []
				};
			}

			const length = items[thaIndex].items[semesterIndex].items.length;
			items[thaIndex].items[semesterIndex].items[length] = result;
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
	<BlockTitle>Riwayat Pembayaran</BlockTitle>
	{#each items as item}
		{#each item.items as { items, semester }}
			<BlockTitle>{item.tha + ' - ' + semester}</BlockTitle>
			<List strongIos insetIos outlineIos>
				{#each items as item}
					<ListItem
						title={item.nama_kwj}
						subtitle={new Date(item.tgl_bayar).toLocaleDateString('id-ID') + ' ' + item.bank}
						text={'TA ' + item.tha + ' - ' + item.semester}
						footer={'Rp.' + item.nominal.toLocaleString('id-ID')}
					/>
				{/each}
			</List>
		{/each}
	{/each}
</div>
