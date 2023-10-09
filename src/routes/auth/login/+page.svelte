<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { myenhance } from '$lib/forms/myenhance';
	import { authUser, preferences } from '$lib/stores/preferences';
	import { Block, Button, List, ListButton, ListInput, Navbar, Page } from 'konsta/svelte';
	const doLogin = () =>
		myenhance<{
			password: string;
			nim: string;
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
				$preferences.nim = data.nim;
				$preferences.password = data.password;
				$preferences.otp = '';
				invalidate('/onedevice');
			}
		});

	let deviceId = '';
	$preferences.deviceId = deviceId;
</script>

<Page>
	<Navbar title="Login" />
	<form
		action=""
		method="post"
		on:submit={() => {
			$preferences.deviceId = deviceId;
		}}
		use:enhance={doLogin()}
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
			<ListInput
				outline
				label="Device ID"
				type="text"
				name="device_id"
				value={deviceId}
				onInput={(e) => {
					deviceId = e.target.value;
				}}
				placeholder="Device ID (Optional)"
			/>
		</List>
		<Block insertIos>
			<Button largeIos>Masuk</Button>
			<p class="mt-2">Belum verifikasi amikomtwo? <a href="/auth">verifikasi dulu</a></p>
		</Block>
	</form>
</Page>
