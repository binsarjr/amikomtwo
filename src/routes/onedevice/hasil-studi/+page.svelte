<script lang="ts">
	import { serviceClient } from '$lib/serviceClient';
	import { hasilStudiSemester, transkripNilai } from '$lib/stores/akademik';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { initKhs } from '../../../lib/stores/initKhs';

	let semesterSelected: number = 0;
	let semester: string | null = null;
	let tahunAkademikSelected: string = '';
	const refresh = async () => {
		if ($hasilStudiSemester) {
			serviceClient.hasilStudi(semesterSelected, tahunAkademikSelected);
			return;
		}
		await serviceClient.hasilStudi(semesterSelected, tahunAkademikSelected);
	};
	onMount(() => {
		semesterSelected = $mahasiswa!.PeriodeAkademik.Semester || 0;
		semester = $initKhs?.Semester.find((s) => s.Kode == semesterSelected)?.Nama || null;
		tahunAkademikSelected = $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
		refresh();
	});
</script>

<Page>
	<Navbar title="Hasil Studi">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		<select
			bind:value={semesterSelected}
			on:change={refresh}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			{#each $initKhs?.Semester || [] as semester}
				<option value={semester.Kode}>{semester.Nama}</option>
			{/each}
		</select>
		<select
			bind:value={tahunAkademikSelected}
			on:change={refresh}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			{#each $initKhs?.Tahun || [] as { thn_ajaran }}
				<option value={thn_ajaran}>{thn_ajaran}</option>
			{/each}
		</select>
	</Block>

	{#if $hasilStudiSemester}
		<List strongIos insetIos>
			<ListItem title="IPK" after={$hasilStudiSemester.IpkSem.toString()} />
			<ListItem title="Jumlah SKS" after={$hasilStudiSemester.JmlSks.toString()} />
		</List>
		<BlockTitle>Hasil Studi Semester</BlockTitle>
		<List strongIos insetIos>
			{#each $hasilStudiSemester.Khs as khs}
				<ListItem
					title={khs.NamaMk}
					header={khs.Kode}
					subtitle={khs.JmlSks + ' SKS'}
					after={khs.Nilai || "Tidak Ada"}
				/>
			{/each}
		</List>
	{/if}
</Page>
