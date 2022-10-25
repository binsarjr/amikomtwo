<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Page,
		Navbar,
		NavbarBackLink,
		Tabbar,
		TabbarLink,
		Block,
		Icon,
		List,
		ListItem,
		Toggle
	} from 'konsta/svelte';
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

	<slot />
</Page>
