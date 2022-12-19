<script lang="ts">
	import { usersGuest, type UserGuest } from '$lib/stores/userguest';
	import {
		Block,
		BlockTitle,
		Button,
		List,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page
	} from 'konsta/svelte';
	import ImportTamu from '../../../lib/components/ImportTamu.svelte';
	import ListTamu from '../../../lib/components/TamuComponent/ListTamu.svelte';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';

	let excepts = [$mahasiswa?.Mhs.Npm || ''];
</script>

<Page>
	<Navbar title="Amikom TWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice/profile" component="a" />
	</Navbar>
	<BlockTitle>List Tamu</BlockTitle>
	<ImportTamu {excepts} />
	<ListTamu />
</Page>
