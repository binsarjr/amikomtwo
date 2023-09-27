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

	import type { PageData } from './$types';
	import { networkStatus } from '$lib/components/PWA/store';
	export let data: PageData;
</script>

<Page>
	<Navbar title="Amikom TWO" subtitle={$networkStatus}>
		<NavbarBackLink slot="left" text="Back" href="/onedevice/daak" component="a" />
	</Navbar>

	<BlockTitle>{$page.params.title}</BlockTitle>
	<Block>
		{@html data.content}
	</Block>
	<Block>
		<p>
			SUMBER: <a href="https://daak.amikom.ac.id/page/{$page.params.page}" target="_blank"
				>https://daak.amikom.ac.id/page/{$page.params.page}</a
			>
		</p>
	</Block>
</Page>
