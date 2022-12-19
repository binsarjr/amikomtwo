<script lang="ts">
	import type { IBio } from '@binsarjr/apiamikomone/lib/typings/Response';

	import { BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { historiPresensi } from '../../../lib/stores/presensi';

	let semesterSelected = $mahasiswa!.PeriodeAkademik.Semester;
	let semester = $initKhs?.Semester.find((s) => s.Kode == semesterSelected)?.Nama;
	let tahunAkademikSelected = $mahasiswa!.PeriodeAkademik.TahunAkademik;
	onMount(async () => {
		$historiPresensi = await serviceClient.historiPresensi(semesterSelected, tahunAkademikSelected);
	});
</script>

<Page class="pb-20">
	<Navbar title="AmikomTWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<BlockTitle
		>{semester || '{semester}'}
		{tahunAkademikSelected || '{tahun_akademik}'}</BlockTitle
	>
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
