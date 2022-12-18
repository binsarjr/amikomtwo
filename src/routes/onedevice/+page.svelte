<script lang="ts">
	import { page } from '$app/stores';
	import { jadwal } from '$lib/stores/jadwal';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { authUser } from '$lib/stores/preferences';
	import { Block, BlockTitle, List, ListItem } from 'konsta/svelte';
	import { onMount } from 'svelte';
</script>

<List strongIos insetIos>
	<ListItem
		header={$mahasiswa?.Mhs.Npm || '{npm}'}
		title={'Halo, ' + ($mahasiswa?.Mhs.Nama || '{nama}')}
	/>
</List>

<BlockTitle>Jadwal Kuliah Hari Ini</BlockTitle>
<List strongIos insetIos outlineIos>
	{#each $jadwal as jadwal}
		<ListItem
			title={jadwal.MataKuliah}
			header={jadwal.JenisKuliah}
			subtitle={jadwal.Ruang + ' | ' + jadwal.Waktu}
			text={jadwal.EmailDosen}
			after={jadwal.Kode}
			footer={jadwal.NamaDosen}
		/>
	{:else}
		<ListItem title="Tidak ada jadwal" />
	{/each}
</List>
<BlockTitle>Menu</BlockTitle>
<List strongIos insetIos outlineIos>
	<ListItem link title="Histori Presensi" href="/onedevice/histori-presensi" />
	<ListItem link title="Hasil Studi" />
	<ListItem link title="Jadwal Kuliah" />
	<ListItem link title="Transkrip" />
	<ListItem link title="Perpustakaan" />
	<ListItem link title="Pembayaran" />
	<ListItem link title="KTM" />
</List>
