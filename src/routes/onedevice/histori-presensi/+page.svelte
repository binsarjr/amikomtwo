<script lang="ts">
	import { page } from '$app/stores';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { historiPresensi } from '../../../lib/stores/presensi';

	let semesterSelected: number = 0;
	let tahunAkademikSelected: string = '';
	const refresh = async () => {
		const id = toast.loading('sync', { position: 'top-right' });
		const cacheSatuBulan = !(semesterSelected == $mahasiswa?.PeriodeAkademik.Semester && tahunAkademikSelected == $mahasiswa.PeriodeAkademik.TahunAkademik)

		$historiPresensi = await serviceClient.historiPresensi(semesterSelected, tahunAkademikSelected, cacheSatuBulan);
		toast.success('selesai', { id, position: 'top-right' });
	};
	onMount(async () => {
		semesterSelected =
			parseInt($page.url.searchParams.get('semester') || '') ||
			$mahasiswa!.PeriodeAkademik.Semester ||
			0;
		tahunAkademikSelected =
			$page.url.searchParams.get('tahun_ajaran') || $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
		refresh();
	});
	onDestroy(() => {
		toast.remove();
	});
</script>

<Page class="pb-20">
	<Navbar title="Histori Presensi">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<Block>
		<select
			bind:value={semesterSelected}
			on:change={refresh}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			{#each $initKhs?.Semester || [] as semester}
				<option value={semester.Kode}>{semester.Nama}</option>
			{/each}
		</select>
		<select
			bind:value={tahunAkademikSelected}
			on:change={refresh}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			{#each $initKhs?.Tahun || [] as { thn_ajaran }}
				<option value={thn_ajaran}>{thn_ajaran}</option>
			{/each}
		</select>
	</Block>
	<List strongIos insetIos>
		{#each $historiPresensi as histori}
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
</Page>
