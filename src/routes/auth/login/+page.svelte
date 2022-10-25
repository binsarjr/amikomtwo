<script>
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { preferences } from '$lib/stores/preferences';
	import { List, ListButton, ListInput, Navbar, Page } from 'konsta/svelte';
</script>

<Page>
	<Navbar title="Login" />
	<form
		action=""
		method="post"
		use:enhance={myenhance({ loadingMsg: 'Sedang Mencoba untuk login' })}
	>
		<List strongIos insetIos>
			<ListInput
				outline
				value={$preferences.nim}
				label="NIM"
				type="text"
				name="nim"
				required
				placeholder="Contoh: 12.34.5678"
			/>
			<ListInput
				outline
				label="Password"
				type="password"
				name="password"
				required
				placeholder="Password Akun Mahasiswa"
			/>
			<ListButton largeIos>Masuk</ListButton>
		</List>
	</form>
</Page>
