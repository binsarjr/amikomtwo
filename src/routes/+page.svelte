<script>
	import { Page, Navbar, Block, Button, List, ListItem, BlockTitle } from 'konsta/svelte';
</script>

<Page>
	<Navbar title="AmikomTWO" />

	<Block strongIos insetIos>
		<p>Terima Kasih sudah mempercayakan AmikomTWO</p>
	</Block>

	<Block insetIos>
		<Button largeIos component="a" href="/auth">Masuk</Button>
	</Block>
	<Block insetIos>
		<Button largeIos outline component="a" href="/presensi">Presensi Sebagai Tamu</Button>
	</Block>
</Page>
