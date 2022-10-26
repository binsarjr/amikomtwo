<script lang="ts">
	import { goto } from '$app/navigation';
	import { Block, Button, Link, List, ListItem, Navbar, Page } from 'konsta/svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let keluar = 'KELUAR';
	const onLogoutClick = () => {
		if(keluar==='KELUAR') {
			keluar = "KETUK SEKALI LAGI UNTUK KELUAR"
		} else {
			goto('/onedevice/logout')
		}
	};
</script>

<Block>
	<img src={data.mahasiswa.Mhs.NpmImg} alt="" />
	<List strongIos outlineIos>
		<ListItem header="Nama" title={data.mahasiswa.Mhs.Nama} />
		<ListItem header="NIM" title={data.mahasiswa.Mhs.Npm} />
		<ListItem header="Email" title={data.mahasiswa.Mhs.EmailAmikom} />
		<ListItem header="Prodi" title={data.mahasiswa.Mhs.Prodi} />
		<ListItem header="Angkatan" title={data.mahasiswa.Mhs.Angkatan} />
		<ListItem header="Tahun Akademik" title={data.mahasiswa.PeriodeAkademik.TahunAkademik} />
		<ListItem header="Semester" title={data.mahasiswa.PeriodeAkademik.SemesterFormat} />
	</List>
	<Button largeIos class="mb-2">EXPORT</Button>
	<Button largeIos outlineIos onClick={onLogoutClick}>{keluar}</Button>
</Block>
