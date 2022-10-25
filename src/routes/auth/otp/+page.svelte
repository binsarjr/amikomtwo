<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { preferences } from '$lib/stores/preferences';
	import { Block, List, Navbar, Page, ListInput, ListButton } from 'konsta/svelte';

	const id = 'form-otp-' + Math.floor(Math.random() * 9999999999);
	$preferences.otp = '';
	$: if ($preferences.otp.length === 6) {
		const form = document.getElementById(id)?.querySelector('button') as HTMLButtonElement;
		form.click();
	}
</script>

<Page>
	<Navbar title="Verifikasi OTP" />
	<form method="post" action="?/verify" use:enhance={myenhance()}>
		<input type="hidden" required value={$preferences.nim} name="nim" />
		<List insetIos strongIos>
			<ListInput
				value={$preferences.otp}
				onInput={function () {
					$preferences.otp = this.value.toString().substr(0, 6);
					this.value = $preferences.otp;
				}}
				outline
				label="OTP"
				type="number"
				name="otp"
				required
				placeholder="Contoh: 123456"
			/>
			<ListButton largeIos {id}>Kirim OTP</ListButton>
		</List>
	</form>
	<form action="?/resend" method="post" use:enhance={myenhance()}>
		<input type="hidden" name="nim" value={$preferences.nim} />
		<input type="hidden" name="tanggal_lahir" value={$preferences.tanggalLahir} />
		<Block insetIos>
			<p>
				Tidak menerima OTP? <button class="text-blue-500 hover:text-blue-800"
					>Kirim Ulang OTP</button
				>
			</p>
		</Block>
	</form>
</Page>
