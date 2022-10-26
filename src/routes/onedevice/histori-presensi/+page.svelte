<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { IBio } from '@binsarjr/apiamikomone/lib/typings/Response';

	import { BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	export let data: {
		histori: import('@binsarjr/apiamikomone/lib/typings/Response').IPresence[];
		mahasiswa: IBio;
	};
</script>

<Page class="pb-20">
	<Navbar title="AmikomTWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<BlockTitle
		>{data.mahasiswa.PeriodeAkademik.SemesterFormat}
		{data.mahasiswa.PeriodeAkademik.TahunAkademik}</BlockTitle
	>
	<List strongIos insetIos>
		{#each data.histori as histori}
			<ListItem
				header={histori.Kode + ' | ' + histori.JmlSks + ' SKS'}
				title={histori.NamaMk}
				after={histori.JmlPresensiKuliah}
			/>
		{/each}
	</List>
</Page>
