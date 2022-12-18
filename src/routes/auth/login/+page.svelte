<script lang="ts">
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { authUser, preferences } from '$lib/stores/preferences';
	import { List, ListButton, ListInput, Navbar, Page } from 'konsta/svelte';
	const doLogin = () =>
		myenhance<{
			password: string;
			response: {
				access_token: string;
				api_key: string;
				expires: number;
			};
		}>({
			loadingMsg: 'Sedang Mencoba untuk login',
			success: (data) => {
				$authUser = {
					accessToken: data.response.access_token,
					apiKey: data.response.api_key
				};
				$preferences.password = data.password;
				$preferences.otp = '';
			}
		});
</script>

<Page>
	<Navbar title="Login" />
	<form action="" method="post" use:enhance={doLogin()}>
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
