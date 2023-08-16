<script lang="ts">
	import { getIdFromJadwal, jadwal, jadwalHariIni, jadwalMatkulAktif } from '$lib/stores/jadwal';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { Block, BlockTitle, List, ListItem } from 'konsta/svelte';
	import PengumumanDetail from '../../lib/components/PengumumanDetail.svelte';
	import { pengumuman } from '../../lib/stores/akademik';
	import HorizontalScrollContent from '../../lib/components/HorizontalScrollContent.svelte';
	import MataKuliahCard from '../../lib/components/cards/MataKuliahCard.svelte';
	import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	const compareIdJadwal = (item: IJadwalKuliah) => {
		if (!$jadwalMatkulAktif) return false;

		return getIdFromJadwal(item) == getIdFromJadwal($jadwalMatkulAktif as IJadwalKuliah);
	};
</script>

<List strongIos insetIos>
	<ListItem
		header={$mahasiswa?.Mhs.Npm || '{npm}'}
		title={'Halo, ' + ($mahasiswa?.Mhs.Nama || '{nama}')}
	/>
</List>

<BlockTitle>Jadwal Kuliah Hari Ini</BlockTitle>
<Block>
	<HorizontalScrollContent wheel pointer={false}>
		<div class="flex items-stretch h-full">
			{#each $jadwalHariIni as item}
				<MataKuliahCard
					{item}
					focusToElement={compareIdJadwal(item)}
					class="min-w-[400px] scale-[95%] p-0 m-0"
				/>
			{:else}
				<p>Tidak ada jadwal kuliah</p>
			{/each}
		</div>
	</HorizontalScrollContent>
</Block>
<!-- <Lit strongIos insetIos outlineIos>
	{#each $jadwalHariIni as { Keterangan, MataKuliah, JenisKuliah, Waktu, Ruang, EmailDosen, Kode, NamaDosen, ZoomURL }}
		<ListItem
			title={MataKuliah}
			header={JenisKuliah + (!!Keterangan ? ' (' + Keterangan + ')' : '')}
			subtitle={Ruang + ' | ' + Waktu}
			text={EmailDosen}
			after={Kode}
		>
			<svelte:fragment slot="footer">
				<div class="mt-2 mb-4">
					<p>{NamaDosen}</p>
					<a href={ZoomURL} target="_blank" rel="noreferrer" class="text-blue-600">{ZoomURL}</a>
				</div>
			</svelte:fragment>
		</ListItem>
	{:else}
		<ListItem title="Tidak ada jadwal" />
	{/each}
</Lit> -->
<BlockTitle>Menu</BlockTitle>
<List strongIos insetIos outlineIos>
	<ListItem link title="Histori Presensi" href="/onedevice/histori-presensi" />
	<ListItem link title="Hasil Studi" href="/onedevice/hasil-studi" />
	<ListItem link title="Jadwal Kuliah" href="/onedevice/jadwal-kuliah" />
	<ListItem link title="Transkrip" href="/onedevice/transkrip" />
	<ListItem link title="Perpustakaan" />
	<ListItem link title="Pembayaran" href="/onedevice/pembayaran/biaya" />
	<ListItem link title="KTM" href="/onedevice/ktm" />
</List>

<BlockTitle>Lainnya</BlockTitle>
<List strongIos insetIos outlineIos>
	<ListItem link title="Kalender" href="/onedevice/kalender" />
	<ListItem link title="Pengumuman" href="/onedevice/pengumuman" />
</List>

<BlockTitle>Bagan Informasi</BlockTitle>
<List strongIos insetIos outlineIos>
	<ListItem link title="Kemahasiswaan (DAAK)" href="/onedevice/daak" />
	<!-- <ListItem link title="Keuangan (DPK)" href="/onedevice/dpk" /> -->
	<ListItem link title="Tentang Penulis" href="/onedevice/aboutme" />
</List>
