<script lang="ts">
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { historiPresensi } from '../../../lib/stores/presensi';

	let semesterSelected: number = 0;
	let semester: string | null = null;
	let tahunAkademikSelected: string = '';
	const refresh = async () => {
		$historiPresensi = await serviceClient.historiPresensi(semesterSelected, tahunAkademikSelected);
	};
	onMount(async () => {
		semesterSelected = $mahasiswa!.PeriodeAkademik.Semester || 0;
		semester = $initKhs?.Semester.find((s) => s.Kode == semesterSelected)?.Nama || null;
		tahunAkademikSelected = $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
		refresh();
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
				after={histori.JmlPresensiKuliah}
			/>
		{:else}
			<p>Tidak memiliki histori</p>
		{/each}
	</List>
</Page>
