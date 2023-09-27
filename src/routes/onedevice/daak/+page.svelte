<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { networkStatus } from '$lib/components/PWA/store';
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

	const layanan = [
		{
			title: 'Surat Keterangan Aktif Kuliah',
			link: '/onedevice/daak/surat-keterangan-aktif-kuliah'
		},
		{
			title: 'Pengisian KRS (Kartu Rencana Studi)',
			link: '/onedevice/daak/pengisian-krs-kartu-rencana-studi'
		},
		{
			title: 'Permohonan Cuti',
			link: '/onedevice/daak/permohonan-cuti'
		}
	];
</script>

<Page>
	<Navbar title="Amikom TWO" subtitle={$networkStatus}>
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<BlockTitle>Download & Link</BlockTitle>
	<List strongIos insetIos outlineIos>
		{#each [{ title: 'Surat & Formulir', page: 'surat-formulir' }, { title: 'Sertifikat Akreditasi', page: 'sertifikat-akreditasi' }, { title: 'Buku Panduan Akademik', page: 'buku-panduan-akademik' }] as { title, page }}
			<ListItem link {title} href="/onedevice/daak/{page}/{title}" />
		{/each}
		<!-- <ListItem link title="Keuangan (DPK)" href="/onedevice/dpk" /> -->
	</List>
	<BlockTitle>Layanan</BlockTitle>
	<List strongIos insetIos outlineIos>
		{#each layanan as { title, link }}
			<ListItem link {title} href="{link}/{title}" />
		{/each}
		<!-- <ListItem link title="Keuangan (DPK)" href="/onedevice/dpk" /> -->
	</List>
</Page>
