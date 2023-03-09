<script>
	import { transkripNilai } from '$lib/stores/akademik';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';
</script>

<Page>
	<Navbar title="Transkrip">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>

	{#if $transkripNilai}
		<List strongIos insetIos>
			<ListItem title="IPK" after={$transkripNilai.Ipk.toString()} />
			<ListItem title="Jumlah SKS" after={$transkripNilai.JmlSks.toString()} />
			<ListItem title="Jumlah SKS Konsentrasi" after={$transkripNilai.SksKonsentrasi.toString()} />
			<ListItem title="Jumlah SKS Pilihan" after={$transkripNilai.SksPilihan.toString()} />
			<ListItem title="Jumlah SKS Wajib" after={$transkripNilai.SksWajib.toString()} />
		</List>
		<BlockTitle>Transkrip Nilai</BlockTitle>
		<List strongIos insetIos class="mb-20">
			{#each $transkripNilai.Transkrip as transkrip}
				<ListItem
					title={transkrip.NamaMk}
					header={transkrip.Kode}
					subtitle={transkrip.NamaSifatMk + ' ' + transkrip.JmlSks + ' SKS'}
					after={transkrip.Nilai}
				/>
			{/each}
		</List>
	{/if}
</Page>
