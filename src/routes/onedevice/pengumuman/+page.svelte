<script lang="ts">
	import { sinkronisasi } from '$lib/stores/sinkronisasi';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
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
	import { onMount } from 'svelte';
	import { reqService, serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { ktmDigital } from '../../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	import { pengumuman } from '$lib/stores/akademik';
	import PengumumanDetail from '$lib/components/PengumumanDetail.svelte';
	import moment from 'moment';
	import SyncButton from '$lib/components/SyncButton.svelte';

	$: syncNow = !$sinkronisasi?.pengumuman;
	$: if (browser && $sinkronisasi.pengumuman) {
		// sync setiap 24jam
		syncNow = moment().diff(moment($sinkronisasi.pengumuman), 'hours') >= 24;
	}

	const onSync = async (e: { detail: { done: () => void } }) => {
		const waitUntilDone = new Promise((resolve) => setTimeout(resolve, 2_000));
		const r = await reqService('/onedevice/services/pengumuman');
		const resp = await r.json();

		await waitUntilDone;
		if (r.ok) {
			$pengumuman = resp;
			$sinkronisasi.pengumuman = moment().format();
		}

		e.detail.done();
	};
</script>

<Page>
	<Navbar title="Amikom TWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<BlockTitle>Pengumuman</BlockTitle>

	<Block>
		<div class="flex gap-5 flex-col">
			{#each $pengumuman as item}
				<div>
					<PengumumanDetail pengumuman={item} />
				</div>
			{:else}
				<p>Tidak ada pengumuman</p>
			{/each}
		</div>
	</Block>
	<SyncButton
		title="Pengumuman"
		lastUpdate={$sinkronisasi.pengumuman}
		on:sync={onSync}
		bind:syncNow
	/>
</Page>
