<script lang="ts">
	import { jadwal, jadwalHariIni } from '$lib/stores/jadwal';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { Block, BlockTitle, List, ListItem } from 'konsta/svelte';
	import PengumumanDetail from '../../lib/components/PengumumanDetail.svelte';
	import { pengumuman } from '../../lib/stores/akademik';
</script>

<List strongIos insetIos>
	<ListItem
		header={$mahasiswa?.Mhs.Npm || '{npm}'}
		title={'Halo, ' + ($mahasiswa?.Mhs.Nama || '{nama}')}
	/>
</List>

<BlockTitle>Jadwal Kuliah Hari Ini</BlockTitle>
<List strongIos insetIos outlineIos>
	{#each $jadwalHariIni as {Keterangan, MataKuliah, JenisKuliah, Waktu, Ruang, EmailDosen,  Kode,NamaDosen}}
		<ListItem
			title={MataKuliah}
			header={JenisKuliah + (!!Keterangan ? ' (' + Keterangan + ')' : '')}
			subtitle={Ruang + ' | ' + Waktu}
			text={EmailDosen}
			after={Kode}
			footer={NamaDosen}
		/>
	{:else}
		<ListItem title="Tidak ada jadwal" />
	{/each}
</List>
<BlockTitle>Menu</BlockTitle>
<List strongIos insetIos outlineIos>
	<ListItem link title="Histori Presensi" href="/onedevice/histori-presensi" />
	<ListItem link title="Hasil Studi" href="/onedevice/hasil-studi" />
	<ListItem link title="Jadwal Kuliah" href="/onedevice/jadwal-kuliah" />
	<ListItem link title="Transkrip" href="/onedevice/transkrip" />
	<ListItem link title="Perpustakaan" />
	<ListItem link title="Pembayaran" />
	<ListItem link title="KTM" href="/onedevice/ktm" />
</List>

<BlockTitle>Pengumuman</BlockTitle>

<Block>
	{#each $pengumuman as item}
		<PengumumanDetail pengumuman={item} />
	{:else}
		<p>Tidak ada pengumuman</p>
	{/each}
</Block>
