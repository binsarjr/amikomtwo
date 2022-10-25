<script>
	import { page } from '$app/stores';
	import { Block, List, ListItem } from 'konsta/svelte';
</script>

<List strongIos insetIos>
	<ListItem header={$page.data.mahasiswa.Mhs.Npm} title={$page.data.mahasiswa.Mhs.Nama} />
</List>
