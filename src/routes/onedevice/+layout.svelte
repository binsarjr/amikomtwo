<script lang="ts">
	import Push from 'push.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { historiPembayaran } from '$lib/stores/pembayaran';
	import { Page, Navbar, Tabbar, TabbarLink } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { serviceClient } from '../../lib/serviceClient';
	import { initKhs } from '../../lib/stores/initKhs';
	import { jadwal } from '../../lib/stores/jadwal';
	import { ktmDigital } from '../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../lib/stores/mahasiswa';
	import { authUser } from '../../lib/stores/preferences';
	import { historiPresensi } from '../../lib/stores/presensi';
	import JadwalBerlangsungServiceWorker from '../../lib/Notifications/Jadwal/JadwalBerlangsungServiceWorker.svelte';

	import JadwalMendatangServiceWorker from '../../lib/Notifications/Jadwal/JadwalMendatangServiceWorker.svelte';


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
		Push.Permission.request();

		await serviceClient.refresh();
		const id = toast.loading('Sync', { position: 'top-right' });
		try {
			await Promise.all([
				serviceClient.initkhs(),
				serviceClient.ktm(),

				serviceClient.transkrip(),
				serviceClient.pengumuman(),

				serviceClient.bio(),
				serviceClient.jadwal(),
				serviceClient.pembayaran.bank()
			]);
			toast.success('selesai', { id, position: 'top-right' });
		} catch (error) {
			toast.error('gagal sync cek kembali koneksimu atau mungkin server amikom sedang down', {
				id,
				position: 'top-right'
			});
		}
	});
	const pages = {
		home: '/onedevice',
		presensi: '/onedevice/presensi',
		profile: '/onedevice/profile'
	};
</script>
<JadwalBerlangsungServiceWorker />
<JadwalMendatangServiceWorker />

<Page>
	<Navbar title="Amikom TWO" />

	<Tabbar labels={true} class="left-0 bottom-0 fixed md:w-[465px] mx-auto left-0 right-0">
		<TabbarLink
			href={pages.home}
			component="a"
			active={$page.url.pathname === pages.home}
			label={'Home'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
					><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5Z" /></svg
				>
			</svelte:fragment>
		</TabbarLink>
		<TabbarLink
			href={pages.presensi}
			component="a"
			active={$page.url.pathname === pages.presensi}
			label={'Presensi'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M2 2h4V0H2C.9 0 0 .9 0 2v4h2V2m20-2h-4v2h4v4h2V2c0-1.1-.9-2-2-2M2 18H0v4c0 1.1.9 2 2 2h4v-2H2v-4m20 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4M8 6V4h2v2H8m2 8v-2h2v2h-2m6-10h2v2h-2V4m2 2h2v2h-2V6m0 8h2v2h-2v-2m2-2h-4v6h4v2H4V4h2v2h2v4H6v2h2v2h2v2h2v2h2v-2h-2v-2h2v-4h-4V6h2V4h2v4h2v2h4v2M8 18v-2H6v2h2Z"
					/></svg
				>
			</svelte:fragment>
		</TabbarLink>
		<TabbarLink
			href={pages.profile}
			component="a"
			active={$page.url.pathname === pages.profile}
			label={'Profile'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"
					><path
						fill="currentColor"
						d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3h-91.4z"
					/></svg
				>
			</svelte:fragment>
		</TabbarLink>
	</Tabbar>

	<main class="mb-20">
		<slot />
	</main>
</Page>
