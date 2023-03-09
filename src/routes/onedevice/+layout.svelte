<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { historiPembayaran } from '$lib/stores/pembayaran';
	import { Page, Navbar, Tabbar, TabbarLink } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { serviceClient } from '../../lib/serviceClient';
	import { initKhs } from '../../lib/stores/initKhs';
	import { jadwal } from '../../lib/stores/jadwal';
	import { ktmDigital } from '../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../lib/stores/mahasiswa';
	import { authUser } from '../../lib/stores/preferences';
	import { historiPresensi } from '../../lib/stores/presensi';
	$: if (browser && !$authUser?.accessToken) {
		// clean data when user logout
		$mahasiswa = null;
		$jadwal = [];
		$initKhs = null;
		$ktmDigital = null;
		$historiPresensi = [];
		$historiPembayaran = [];
		goto('/');
	}
	onMount(async () => {
		await serviceClient.refresh();
		serviceClient.initkhs();

		// get bio
		serviceClient.bio();
		serviceClient.jadwal();
		serviceClient.pembayaran.bank();
	});
	const pages = {
		home: '/onedevice',
		presensi: '/onedevice/presensi',
		profile: '/onedevice/profile'
	};
</script>

<Page>
	<Navbar title="Amikom TWO" />

	<Tabbar labels={true} class="left-0 bottom-0 fixed md:w-[465px] mx-auto left-0 right-0">
		<TabbarLink
			href={pages.home}
			component="a"
			active={$page.url.pathname === pages.home}
			label={'Home'}
		/>
		<TabbarLink
			href={pages.presensi}
			component="a"
			active={$page.url.pathname === pages.presensi}
			label={'Presensi'}
		/>
		<TabbarLink
			href={pages.profile}
			component="a"
			active={$page.url.pathname === pages.profile}
			label={'Profile'}
		/>
	</Tabbar>

	<main class="mb-20">
		<slot />
	</main>
</Page>
