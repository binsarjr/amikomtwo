<script lang="ts">
	import { Block, Link, List, ListItem, Navbar, Page } from 'konsta/svelte';
	import type { PageData } from './$types';
	export let data: PageData;

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
</Block>
