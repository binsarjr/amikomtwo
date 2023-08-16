<script lang="ts">
	import Push from 'push.js';
	import { browser } from '$app/environment';
	import { goto, preloadCode } from '$app/navigation';
	import { page } from '$app/stores';
	import { historiPembayaran } from '$lib/stores/pembayaran';
	import { Page, Navbar, Tabbar, TabbarLink, NavbarBackLink } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	const pages = {
		biaya: '/onedevice/pembayaran/biaya',
		tagihan: '/onedevice/pembayaran/tagihan',
		riwayat: '/onedevice/pembayaran/riwayat',
		tiket: '/onedevice/pembayaran/tiket'
	};
	;
</script>

<Page>
	<Navbar title="Pembayaran">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	<Tabbar labels={true} class="left-0 bottom-0 fixed md:w-[465px] mx-auto right-0">
		<TabbarLink
			href={pages.biaya}
			component="a"
			active={$page.url.pathname === pages.biaya}
			label={'Info Biaya'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
					<path
						fill="currentColor"
						d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3c0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156c0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616c0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769c0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"
					/>
				</svg>
			</svelte:fragment>
		</TabbarLink>
		<TabbarLink
			href={pages.tagihan}
			component="a"
			active={$page.url.pathname === pages.tagihan}
			label={'Info Tagihan'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 576 512"
					><path
						fill="currentColor"
						d="M112 112c0 35.3-28.7 64-64 64v160c35.3 0 64 28.7 64 64h352c0-35.3 28.7-64 64-64V176c-35.3 0-64-28.7-64-64H112zM0 128c0-35.3 28.7-64 64-64h448c35.3 0 64 28.7 64 64v256c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zm176 128a112 112 0 1 1 224 0a112 112 0 1 1-224 0zm80-48c0 8.8 7.2 16 16 16v64h-8c-8.8 0-16 7.2-16 16s7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16h-8v-80c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16z"
					/></svg
				>
			</svelte:fragment>
		</TabbarLink>
		<TabbarLink
			href={pages.riwayat}
			component="a"
			active={$page.url.pathname === pages.riwayat}
			label={'Riwayat'}
		>
			<svelte:fragment slot="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 21q-3.45 0-6.013-2.288T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.038T19 12q0-2.925-2.038-4.963T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924q1.212 1.213 1.925 2.85T21 12q0 1.875-.713 3.513t-1.924 2.85q-1.213 1.212-2.85 1.925T12 21Zm2.8-4.8L11 12.4V7h2v4.6l3.2 3.2l-1.4 1.4Z"
					/>
				</svg>
			</svelte:fragment>
		</TabbarLink>
		<TabbarLink
			href={pages.tiket}
			component="a"
			active={$page.url.pathname === pages.tiket}
			label={'Tiket Pembayaran'}
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
