<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Block, Button, Link, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { serviceClient } from '../../../lib/serviceClient';
	import { ktmDigital } from '../../../lib/stores/ktmDigital';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import { authUser, preferences } from '../../../lib/stores/preferences';
</script>

<Page>
	<Navbar title="Amikom TWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		{#if $ktmDigital}
			<a
				download="ktmdigital.png"
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
</Page>
