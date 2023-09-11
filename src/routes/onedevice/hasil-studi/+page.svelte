<script lang="ts">
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import { reqService, serviceClient } from '$lib/serviceClient';
	import { hasilStudiSemester, transkripNilai } from '$lib/stores/akademik';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { initKhs } from '../../../lib/stores/initKhs';
	import PilihSemester from '../../../lib/components/PilihSemester.svelte';
	import { browser } from '$app/environment';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import moment from 'moment';
	import type { IHasilSemester } from '$Amikom/typings/Response';

	let semesterSelected = 0;
	let tahunAkademikSelected = '';

	// digunakan sebagai penanda perbedaan data di hasil studi
	$: identifier = `${semesterSelected}${tahunAkademikSelected}`;

	$: if (!$sinkronisasi?.hasilStudi) $sinkronisasi.hasilStudi = {};
	$: if (!$hasilStudiSemester) $hasilStudiSemester = {};

	let syncNow = false;
	$: if (browser && $sinkronisasi.hasilStudi) {
		syncNow = !$sinkronisasi.hasilStudi[identifier];
		if ($sinkronisasi.hasilStudi[identifier]) {
			// sync setiap 24jam
			syncNow = moment().diff(moment($sinkronisasi.hasilStudi[identifier]), 'hours') >= 24;
		}
	}

	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const searchParams = new URLSearchParams();
		searchParams.set('semester', semesterSelected.toString());
		searchParams.set('tahun_akademik', tahunAkademikSelected.toString());
		const r = await reqService('/onedevice/services/hasil-studi', searchParams);

		const resp: IHasilSemester = await r.json();
		await waitUntilDone;
		if (r.status == 200) {
			$hasilStudiSemester[identifier] = resp;
			$sinkronisasi!.hasilStudi![identifier] = moment().format();
		}

		e.detail.done();
	};

	onMount(() => {
		semesterSelected = $mahasiswa!.PeriodeAkademik.Semester || 0;
		tahunAkademikSelected = $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
	});
</script>

<Page>
	<Navbar title="Hasil Studi">
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

	{#if $hasilStudiSemester[identifier]}
		{@const item = $hasilStudiSemester[identifier]}
		<List strongIos insetIos>
			<ListItem title="IPK" after={item.IpkSem.toString()} />
			<ListItem title="Jumlah SKS" after={item.JmlSks.toString()} />
		</List>
		<BlockTitle>Hasil Studi Semester</BlockTitle>
		<List strongIos insetIos>
			{#each item.Khs as khs}
				<ListItem
					title={khs.NamaMk}
					header={khs.Kode}
					subtitle={khs.JmlSks + ' SKS'}
					after={khs.Nilai || 'Tidak Ada'}
				/>
			{:else}
				<ListItem title="Tidak ada studi" />
			{/each}
		</List>
	{/if}

	<SyncButton
		title="Hasil Studi {semesterSelected} {tahunAkademikSelected}"
		lastUpdate={$sinkronisasi.hasilStudi ? $sinkronisasi.hasilStudi[identifier] || '' : ''}
		on:sync={onSync}
		bind:syncNow
	/>
</Page>
