<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Block, Button, Link, List, ListItem, Navbar, Page } from 'konsta/svelte';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	let keluar = 'KELUAR';
	const onLogoutClick = () => {
		if (keluar === 'KELUAR') {
			keluar = 'KETUK SEKALI LAGI UNTUK KELUAR';
		} else {
			// goto('/onedevice/logout');
			$authUser = null;
		}
	};

	let exportLink: string | URL = '';

	$: if (browser) {
		exportLink = new URL($page.url.toString());
		exportLink.pathname = '/onedevice/export';
		exportLink.searchParams.set('mahasiswa', encodeURIComponent(JSON.stringify($mahasiswa)));
		exportLink.searchParams.set('password', $preferences.password);
	}
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
	<span>
		<Button largeIos class="mb-2" href={exportLink.toString()} component="a" target="_blank"
			>EXPORT</Button
		>
	</span>
	<Button largeIos outlineIos onClick={onLogoutClick}>{keluar}</Button>
</Block>
