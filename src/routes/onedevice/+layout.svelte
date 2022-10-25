<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { activeTab } from '$lib/stores/activeTab';
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
	import { onMount } from 'svelte';
	const pages: any = {
		home: '/onedevice',
		presensi: '/onedevice/presensi',
		profile: '/onedevice/profile'
	};
	onMount(() => {
		goto(pages[$activeTab]);
	});
</script>

<Page>
	<Navbar title="Amikom TWO" />

	<Tabbar labels={true} class="left-0 bottom-0 fixed md:w-[465px] mx-auto left-0 right-0">
		<TabbarLink
			href="/onedevice"
			component="a"
			active={$activeTab === 'home'}
			onClick={() => ($activeTab = 'home')}
			label={'Tab 1'}
		/>
		<TabbarLink
			href="/onedevice/presensi"
			component="a"
			active={$activeTab === 'presensi'}
			onClick={() => ($activeTab = 'presensi')}
			label={'Tab 2'}
		/>
		<TabbarLink
			href="/onedevice/profile"
			component="a"
			active={$activeTab === 'profile'}
			onClick={() => ($activeTab = 'profile')}
			label={'Tab 3'}
		/>
	</Tabbar>

	<slot />
</Page>
