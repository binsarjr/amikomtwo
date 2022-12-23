<script>
	import { serviceClient } from '$lib/serviceClient';
	import { listBank } from '$lib/stores/pembayaran';
	import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from 'konsta/svelte';

	let bankSelectedIndex = 0;
</script>

<Page>
	<Navbar title="Pembayaran">
		<NavbarBackLink slot="left" text="Back" href="/onedevice" component="a" />
	</Navbar>
	<Block>
		<select
			bind:value={bankSelectedIndex}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
		>
			{#each $listBank as bank, i}
				<option value={i}>{bank}</option>
			{/each}
		</select>
	</Block>
	<BlockTitle>Pembayaran {$listBank[bankSelectedIndex]}</BlockTitle>
	<List strongIos insetIos outlineIos>
			<ListItem
				
			/>
		
	</List>
</Page>
