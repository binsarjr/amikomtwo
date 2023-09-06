<script lang="ts">
	import { serviceClient } from '$lib/serviceClient';
	import { hasilStudiSemester, transkripNilai } from '$lib/stores/akademik';
	import { mahasiswa } from '$lib/stores/mahasiswa';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { initKhs } from '../../../lib/stores/initKhs';
	import PilihSemester from '../../../lib/components/PilihSemester.svelte';
	import { browser } from '$app/environment';
	import { ServerTimeout } from '$lib/error';

	let semesterSelected = 0;
	let tahunAkademikSelected = '';
	const refresh = async () => {
		const cache = !(
			tahunAkademikSelected == $mahasiswa?.PeriodeAkademik.TahunAkademik &&
			semesterSelected == $mahasiswa.PeriodeAkademik.Semester
		);
		if ($hasilStudiSemester) {
			const id = toast.loading('sync');
			Promise.race([
				serviceClient.hasilStudi(semesterSelected, tahunAkademikSelected, cache),
				ServerTimeout()
			])
				.then((_) => {
					toast.success('selesai', { id });
				})
				.catch((_) => {
					toast.error('Server  timeout', { id });
				});
			return;
		}
		const id = toast.loading('sync');
		try {
			await Promise.race([
				serviceClient.hasilStudi(semesterSelected, tahunAkademikSelected, cache),
				ServerTimeout()
			]);
			toast.success('selesai', { id });
		} catch (error) {
			toast.error('Server Timeout', { id });
		}
	};
	$: if (browser && semesterSelected) {
		refresh();
	}
	onMount(() => {
		semesterSelected = $mahasiswa!.PeriodeAkademik.Semester || 0;
		tahunAkademikSelected = $mahasiswa!.PeriodeAkademik.TahunAkademik || '';
		refresh();
	});
	onDestroy(() => {
		toast.remove();
	});
</script>

<Page>
	<Navbar title="Hasil Studi">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		<PilihSemester bind:kode={semesterSelected} />
		<select
			bind:value={tahunAkademikSelected}
			on:change={refresh}
			class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
					after={khs.Nilai || 'Tidak Ada'}
				/>
			{/each}
		</List>
	{/if}
</Page>
