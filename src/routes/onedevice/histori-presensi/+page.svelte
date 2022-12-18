<script lang="ts">
	import type { IBio } from '@binsarjr/apiamikomone/lib/typings/Response';

	import { BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { serviceClient } from '../../../lib/serviceClient';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { historiPresensi } from '../../../lib/stores/presensi';
	onMount(async () => {
		$historiPresensi = await serviceClient.historiPresensi(
			$mahasiswa!.PeriodeAkademik.Semester,
			$mahasiswa!.PeriodeAkademik.TahunAkademik
		);
	});
</script>

<Page class="pb-20">
	<Navbar title="AmikomTWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<BlockTitle
		>{$mahasiswa?.PeriodeAkademik.SemesterFormat || '{semester}'}
		{$mahasiswa?.PeriodeAkademik.TahunAkademik || '{tahun_akademik}'}</BlockTitle
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
