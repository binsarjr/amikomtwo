<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response';
	import {
		Block,
		BlockTitle,
		Button,
		Link,
		List,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page
	} from 'konsta/svelte';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { serviceClient } from '../../../lib/serviceClient';
	import { jadwalMingguan } from '../../../lib/stores/jadwal';
	import { ktmDigital } from '../../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	const todayId = new Date().getDay();
	let idHariSelected = todayId.toString();
	let jadwalSelected: IJadwalKuliah[] = [];
	const getJadwal = async () => {
		toast.loading('sync', { position: 'top-right' });
		let idHari = parseInt(idHariSelected);
		if ($jadwalMingguan[idHari]) {
			jadwalSelected = $jadwalMingguan[idHari];
			serviceClient.jadwalMingguan(idHari).then((jadwal) => {
				$jadwalMingguan[idHari] = jadwal;
				toast.remove();
			});
			return;
		}
		jadwalSelected = await serviceClient.jadwalMingguan(idHari);
		$jadwalMingguan[idHari] = jadwalSelected;
		toast.remove();
	};
	onMount(() => {
		getJadwal();
	});
	onDestroy(() => {
		toast.remove();
	});
</script>

<Page>
	<Navbar title="Jadwal Kuliah">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		<select
			bind:value={idHariSelected}
			on:change={getJadwal}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			<option value="1">Senin</option>
			<option value="2">Selasa</option>
			<option value="3">Rabu</option>
			<option value="4">Kamis</option>
			<option value="5">Jum'at</option>
			<option value="6">Sabtu</option>
			<option value="7">Minggu</option>
		</select>
	</Block>
	<BlockTitle>Jadwal Kuliah</BlockTitle>
	<List strongIos insetIos outlineIos>
		{#each jadwalSelected as jadwal}
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
</Page>
