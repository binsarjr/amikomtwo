<script>
	import { page } from '$app/stores';
	import { Block, BlockTitle, List, ListItem } from 'konsta/svelte';
</script>

<List strongIos insetIos>
	<ListItem
		header={$page.data.mahasiswa.Mhs.Npm}
		title={'Halo, ' + $page.data.mahasiswa.Mhs.Nama}
	/>
</List>

<BlockTitle>Jadwal Kuliah</BlockTitle>
<List strongIos insetIos outlineIos>
	{#each $page.data.jadwal as jadwal}
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
	<ListItem link title="Hasil Studi" />
	<ListItem link title="Jadwal Kuliah" />
	<ListItem link title="Transkrip" />
	<ListItem link title="Perpustakaan" />
	<ListItem link title="Pembayaran" />
	<ListItem link title="KTM" />
</List>
