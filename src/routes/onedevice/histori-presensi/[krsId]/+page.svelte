<script lang="ts">
	import { page } from '$app/stores';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { serviceClient } from '../../../../lib/serviceClient';
	import { ServerTimeout } from '$lib/error';
	import type { IPresenceDetail } from '$Amikom/typings/Response';

	$: namaMatkul = decodeURIComponent($page.url.searchParams.get('matkul') || '');

	const getData = async () => serviceClient.detailPresensi(parseInt($page.params.krsId));
</script>

<Page class="pb-20">
	<Navbar title="Detail Presensi">
		<NavbarBackLink
			slot="left"
			text="Back"
			href="/onedevice/histori-presensi?semester={$page.url.searchParams.get(
				'semester'
			)}&tahun_ajaran={$page.url.searchParams.get('tahun_ajaran')}"
			component="a"
		/>
	</Navbar>
	{#if namaMatkul}
		<BlockTitle>Mata Kuliah {namaMatkul}</BlockTitle>
	{/if}
	{#await getData()}
		<Block>Mohon menunggu...</Block>
	{:then items}
		<List strongIos insetIos>
			{#each items as item}
				<ListItem
					header={item.JenisKuliah}
					footer={item.Kelas}
					title={item.Tanggal}
					after={item.Jam}
				/>
			{/each}
		</List>
	{/await}
</Page>
