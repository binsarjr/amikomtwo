<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { IJadwalKuliah } from '$Amikom/typings/Response';
	import {
		Block,
		BlockTitle,
		Button,
		Link,
		List,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page
	} from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { jadwal } from '../../../lib/stores/jadwal';
	import HorizontalScrollContent from '../../../lib/components/HorizontalScrollContent.svelte';
	import { fade } from 'svelte/transition';
	import { autofocus } from '../../../lib/actions/focus';
	import MataKuliahCard from '../../../lib/components/cards/MataKuliahCard.svelte';
	import { afterNavigate, beforeNavigate, goto, invalidate } from '$app/navigation';
	import { pageLoader } from '../../../lib/stores/preferences';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import { reqService } from '$lib/serviceClient';
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import moment from 'moment';
	const todayId = new Date().getDay();
	let idHariSelected = $page.url.searchParams.get('id_hari') || todayId.toString();
	let jadwalSelected: IJadwalKuliah[] = [];

	const getJadwal = async () => {
		idHariSelected = $page.url.searchParams.get('id_hari') || todayId.toString();
		let idHari = parseInt(idHariSelected);
		jadwalSelected = $jadwal.filter((jadwal) => jadwal.IdHari == idHari);
	};

	beforeNavigate(({ to }) => {
		$pageLoader = to?.route.id != $page.url.pathname;
	});

	$: if (browser) getJadwal();
	afterNavigate(() => {
		getJadwal();
	});

	$: syncNow = !$sinkronisasi.jadwal;
	$: if (browser && $sinkronisasi.jadwal) {
		// sync setiap 24jam
		syncNow = moment().diff(moment($sinkronisasi.jadwal), 'hours') >= 24;
	}

	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const r = await reqService('/onedevice/services/jadwal');

		const resp: IJadwalKuliah[] = await r.json();
		await waitUntilDone;
		if (r.status == 200) {
			$jadwal = resp;
			$sinkronisasi.jadwal = moment().format();
			getJadwal();
		}

		e.detail.done();
	};
</script>

<Page>
	<Navbar title="Jadwal Kuliah">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		<HorizontalScrollContent wheel>
			<div class="flex overflow-hidden gap-2">
				{#each ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'] as hari, i}
					{@const idHari = i + 1}
					<button
						type="button"
						use:autofocus={idHari.toString() == idHariSelected}
						class="px-8 py-4 rounded-lg border"
						on:click={() => {
							$page.url.searchParams.set('id_hari', idHari.toString());
							goto($page.url.toString());
						}}
						class:bg-white={idHariSelected != idHari.toString()}
						class:bg-primary={idHariSelected == idHari.toString()}
						class:text-white={idHariSelected == idHari.toString()}>{hari}</button
					>
				{/each}
			</div>
		</HorizontalScrollContent>
	</Block>
	<BlockTitle>Jadwal Kuliah</BlockTitle>
	<Block>
		<div class="flex flex-col gap-5">
			{#each jadwalSelected as jadwal}
				<MataKuliahCard item={jadwal} />
			{:else}
				<p>Tidak ada mata kuliah</p>
			{/each}
		</div>
	</Block>
	<!-- <List strongIos insetIos outlineIos>
		{#each jadwalSelected as jadwal}
			<ListItem
				title={jadwal.MataKuliah}
				header={jadwal.JenisKuliah + (!!jadwal.Keterangan ? ' (' + jadwal.Keterangan + ')' : '')}
				subtitle={jadwal.Ruang + ' | ' + jadwal.Waktu}
				text={jadwal.EmailDosen}
				after={jadwal.Kode}
			>
				<svelte:fragment slot="footer">
					<div class="mt-2 mb-4">
						<p>{jadwal.NamaDosen}</p>
						<a href={jadwal.ZoomURL} target="_blank" rel="noreferrer" class="text-blue-600"
							>{jadwal.ZoomURL}</a
						>
					</div>
				</svelte:fragment>
			</ListItem>
		{:else}
			<ListItem title="Tidak ada jadwal" />
		{/each}
	</List> -->

	<SyncButton
		title="Jadwal Kuliah"
		lastUpdate={$sinkronisasi.jadwal}
		on:sync={onSync}
		bind:syncNow
	/>
</Page>
