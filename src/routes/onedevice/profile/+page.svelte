<script lang="ts">
	import { goto } from '$app/navigation';
	import { Block, Button, Link, List, ListItem, Navbar, Page } from 'konsta/svelte';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import type { PageData } from './$types';
	let keluar = 'KELUAR';
	const onLogoutClick = () => {
		if (keluar === 'KELUAR') {
			keluar = 'KETUK SEKALI LAGI UNTUK KELUAR';
		} else {
			goto('/onedevice/logout');
		}
	};
</script>

<Block>
	<img src={$mahasiswa?.Mhs.NpmImg} alt="" class="rounded-full w-64 h-64 object-cover mx-auto" />
	<List strongIos outlineIos>
		<ListItem header="Nama" title={$mahasiswa?.Mhs.Nama} />
		<ListItem header="NIM" title={$mahasiswa?.Mhs.Npm} />
		<ListItem header="Email" title={$mahasiswa?.Mhs.EmailAmikom} />
		<ListItem header="Prodi" title={$mahasiswa?.Mhs.Prodi} />
		<ListItem header="Angkatan" title={$mahasiswa?.Mhs.Angkatan} />
		<ListItem header="Tahun Akademik" title={$mahasiswa?.PeriodeAkademik.TahunAkademik} />
		<ListItem header="Semester" title={$mahasiswa?.PeriodeAkademik.SemesterFormat} />
	</List>
	<Button largeIos clearIos class="mb-2" href="/onedevice/import" component="a">IMPORT</Button>
	<span >
		<Button largeIos class="mb-2" href="/onedevice/export" component="a" target="_blank"
			>EXPORT</Button
		>
	</span>
	<Button largeIos outlineIos onClick={onLogoutClick}>{keluar}</Button>
</Block>
