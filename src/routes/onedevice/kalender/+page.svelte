<script lang="ts">
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
	import { serviceClient } from '../../../lib/serviceClient';
	import { initKhs } from '../../../lib/stores/initKhs';
	import { ktmDigital } from '../../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	import { pengumuman } from '$lib/stores/akademik';
	import PengumumanDetail from '$lib/components/PengumumanDetail.svelte';
	import type { PageData } from './$types';
	import { networkStatus } from '$lib/components/PWA/store';
	export let data: PageData;
</script>

<Page>
	<Navbar title="Amikom TWO" subtitle={$networkStatus}>
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<BlockTitle>Kalender</BlockTitle>

	<Block>
		{@html data.content}
	</Block>
	<Block>
		<p>
			SUMBER: <a href="https://daak.amikom.ac.id/page/kalender-akademik" target="_blank"
				>https://daak.amikom.ac.id/page/kalender-akademik</a
			>
		</p>
	</Block>
</Page>
