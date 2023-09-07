<script lang="ts">
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Block, Button, Link, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { reqService, serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { ktmDigital } from '../../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import moment from 'moment';

	$: syncNow = !$sinkronisasi?.ktm;
	$: if (browser && $sinkronisasi.ktm) {
		// sync setiap 24jam
		syncNow = moment().diff(moment($sinkronisasi.ktm), 'hours') >= 24;
	}

	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const r = await reqService('/onedevice/services/ktm');
		const resp = await r.json();

		await waitUntilDone;
		if (r.ok) {
			$ktmDigital = resp.status?.code == 200 ? `data:image/png;base64,${resp?.result?.hash}` : null;
			$sinkronisasi.ktm = moment().format();
		}

		e.detail.done();
	};
</script>

<Page>
	<Navbar title="Amikom TWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		{#if $ktmDigital}
			<a
				download="ktmdigital-{$mahasiswa?.Mhs.Npm}.png"
				href={$ktmDigital}
				title="KTM Digital"
				target="_blank"
				rel="noreferrer"
			>
				<img src={$ktmDigital} alt="" />
			</a>
			<span>Klik Gambar untuk mendownload</span>
		{:else}
			<span>Ktm digital tidak dapat diambil.Mohon pastikan foto profile sudah ada</span>
		{/if}
	</Block>
	<SyncButton title="KTM" lastUpdate={$sinkronisasi.ktm} on:sync={onSync} bind:syncNow />
</Page>
