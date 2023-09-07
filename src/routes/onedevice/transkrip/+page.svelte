<script lang="ts">
	import { transkripNilai } from '$lib/stores/akademik';
	import type { ITranskripNilai } from '$Amikom/typings/Response';
	import {
		Block,
		BlockTitle,
		List,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page,
		Toolbar
	} from 'konsta/svelte';
	import moment from 'moment';
	import Loader from '$lib/icons/Loader.svelte';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import { reqService } from '$lib/serviceClient';
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import { browser } from '$app/environment';

	let transkrips: {
		JmlSks: number;
		Kode: string;
		NamaMk: string;
		NamaMkEn: string;
		NamaSifatMk: string;
		Nilai: string;
		SifatMk: string;
	}[] = [];
	let cari = '';
	$: transkrips =
		$transkripNilai?.Transkrip.filter((transkrip) => {
			if (!cari) return true;
			return JSON.stringify(transkrip).toLowerCase().includes(cari.toLowerCase());
		}) || [];
	$: if ($transkripNilai) {
		transkrips = $transkripNilai.Transkrip;
	}
	$: syncNow = !$sinkronisasi?.transkrip;
	$: if (browser && $sinkronisasi.transkrip) {
		// sync setiap 24jam
		syncNow = moment().diff(moment($sinkronisasi.transkrip), 'hours') >= 24;
	}
	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const r = await reqService('/onedevice/services/transkrip');

		const resp: ITranskripNilai = await r.json();
		await waitUntilDone;
		if (r.status == 200) {
			transkripNilai.update(() => resp);
			$sinkronisasi.transkrip = moment().format();
		}

		e.detail.done();
	};
</script>

<Page>
	<Navbar title="Transkrip">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	{#if $transkripNilai}
		<List strongIos insetIos>
			<ListItem title="IPK" after={$transkripNilai.Ipk.toString()} />
			<ListItem title="Jumlah SKS" after={$transkripNilai.JmlSks.toString()} />
			<ListItem title="Jumlah SKS Konsentrasi" after={$transkripNilai.SksKonsentrasi.toString()} />
			<ListItem title="Jumlah SKS Pilihan" after={$transkripNilai.SksPilihan.toString()} />
			<ListItem title="Jumlah SKS Wajib" after={$transkripNilai.SksWajib.toString()} />
		</List>
		<BlockTitle>Transkrip Nilai</BlockTitle>
		<Block>
			<input
				bind:value={cari}
				type="text"
				placeholder="Cari Mata Kuliah"
				class="p-4 rounded bg-white mx-auto w-full"
			/>
		</Block>
		<List strongIos insetIos class="mb-20">
			{#each transkrips as transkrip}
				<ListItem
					title={transkrip.NamaMk}
					header={transkrip.Kode}
					subtitle={transkrip.NamaSifatMk + ' ' + transkrip.JmlSks + ' SKS'}
					after={transkrip.Nilai}
				/>
			{/each}
		</List>
	{/if}
	<SyncButton
		title="Transkrip"
		lastUpdate={$sinkronisasi?.transkrip}
		on:sync={onSync}
		bind:syncNow
	/>
</Page>
