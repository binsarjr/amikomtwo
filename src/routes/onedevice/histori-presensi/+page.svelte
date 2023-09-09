<script lang="ts">
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import { page } from '$app/stores';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { reqService, serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { historiPresensi } from '../../../lib/stores/presensi';
	import PilihSemester from '../../../lib/components/PilihSemester.svelte';
	import { browser } from '$app/environment';
	import { ServerTimeout } from '$lib/error';
	import type { IPresence } from '$Amikom/typings/Response';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import moment from 'moment';

	let semesterSelected = 0;
	let tahunAkademikSelected = '';

	// digunakan sebagai penanda perbedaan data di hasil studi
	$: identifier = `${semesterSelected}${tahunAkademikSelected}`;

	$: if (!$sinkronisasi?.historiPresensi) $sinkronisasi.historiPresensi = {};
	$: if (!$historiPresensi) $historiPresensi = {};

	let syncNow = false;
	$: if (browser && $sinkronisasi.historiPresensi) {
		syncNow = !$sinkronisasi.historiPresensi[identifier];
		if ($sinkronisasi.historiPresensi[identifier]) {
			// sync setiap 24jam
			syncNow = moment().diff(moment($sinkronisasi.historiPresensi[identifier]), 'hours') >= 24;
		}
	}

	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const searchParams = new URLSearchParams();
		searchParams.set('semester', semesterSelected.toString());
		searchParams.set('tahun_akademik', tahunAkademikSelected.toString());
		const r = await reqService('/onedevice/services/histori-presensi', searchParams);

		const resp: IPresence[] = await r.json();
		await waitUntilDone;
		if (r.status == 200) {
			$historiPresensi[identifier] = resp;
			$sinkronisasi!.historiPresensi![identifier] = moment().format();
		}

		e.detail.done();
	};

	onMount(async () => {
		semesterSelected =
			parseInt($page.url.searchParams.get('semester') || '') ||
			$mahasiswa!.PeriodeAkademik.Semester ||
			0;
		tahunAkademikSelected =
			$page.url.searchParams.get('tahun_ajaran') || $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
	});
</script>

<Page>
	<Navbar title="Histori Presensi">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<Block>
		<PilihSemester bind:kode={semesterSelected} />
		<select
			bind:value={tahunAkademikSelected}
			class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
		>
			{#each $initKhs?.Tahun || [] as { thn_ajaran }}
				<option value={thn_ajaran}>{thn_ajaran}</option>
			{/each}
		</select>
	</Block>
	{#if $historiPresensi[identifier]}
		<List strongIos insetIos>
			{#each $historiPresensi[identifier] as histori}
				<ListItem
					header={histori.Kode + ' | ' + histori.JmlSks + ' SKS'}
					title={histori.NamaMk}
					after={histori.JmlPresensiKuliah.toString()}
					link
					href="/onedevice/histori-presensi/{histori.KrsId}?matkul={encodeURIComponent(
						histori.NamaMk
					)}&semester={semesterSelected}&tahun_ajaran={tahunAkademikSelected}"
				/>
			{:else}
				<p>Tidak memiliki histori</p>
			{/each}
		</List>
	{/if}

	<SyncButton
		title="Histori Presensi {semesterSelected} {tahunAkademikSelected}"
		lastUpdate={$sinkronisasi.historiPresensi
			? $sinkronisasi.historiPresensi[identifier] || ''
			: ''}
		on:sync={onSync}
		bind:syncNow
	/>
</Page>
