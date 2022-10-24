<script>
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Block, List, ListButton, ListInput, Navbar, Page } from 'konsta/svelte';
	import { myenhance } from '$lib/forms/myenhance';
</script>

<Page>
	<Navbar title="Validasi Pengguna" />
	<form method="post" use:enhance={myenhance}>
		<List strongIos insetIos>
			<ListInput
				outline
				label="NIM"
				type="text"
				name="nim"
				required
				placeholder="Contoh: 12.34.5678"
			/>
			<ListInput
				required
				name="tanggal_lahir"
				outline
				label="Tanggal Lahir"
				type="date"
				placeholder="Silakan Pilih Tanggal Lahir"
			/>
			<ListButton>Validasi NIM & Tanggal Lahir</ListButton>
		</List>
	</form>
</Page>
