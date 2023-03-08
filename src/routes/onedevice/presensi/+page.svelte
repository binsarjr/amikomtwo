<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Block, BlockTitle, Button, List, ListInput } from 'konsta/svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { navigating } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	import { usersGuest, type UserGuest } from '../../../lib/stores/userguest';
	import ListTamu from '../../../lib/components/TamuComponent/ListTamu.svelte';
	import QrScanner from '../../../lib/components/QrScanner.svelte';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let imageUrl:string;
	let code = '';
	let activeUsersGuest: UserGuest[] = $usersGuest;
	let except = [$usersGuest.find((guest) => $preferences.nim == guest.nim) as UserGuest];
	$: if (qrresult) {
		//   need time for reactive
		setTimeout(() => {
			document.getElementById('formqrcode')?.querySelector('button')?.click();
		}, 20);
	}
	

	const uploadImage = async () => {
		// skip process when qrresult is not yet empty
		if (!qrImages?.length) return;
		try {
			let reader = new FileReader();
            reader.onload = e => {
                 imageUrl = e.target!.result?.toString()||''
            };
            reader.readAsDataURL(qrImages[0]);
		} catch (error) {
			alert('Gagal scan qrcode.cobalah dengan qrcode yang lain');
		}
	};



	const guestCodeSubmit = async () => {
		const id = toast.loading('Mohon Menunggu...');
		const formdata = new FormData();
		formdata.set('code', code);
		activeUsersGuest.map((user) => {
			formdata.append('nim', user.nim);
			formdata.append('password', user.password || '');
		});

		const resp = await fetch('/services/presensi/code', {
			method: 'POST',
			body: formdata
		});
		const results: { success: boolean; message: string }[] = await resp.json();
		results.map((result) => {
			if (result.success) toast.success(result.message);
			else toast.error(result.message);
		});
		toast.success('Antrian Selesai', { id });
	};
	const guestQrCodeSubmit = async () => {
		const id = toast.loading('Mohon Menunggu...');
		const formdata = new FormData();
		formdata.set('data', qrresult || '');
		// add current user
		formdata.append('nim', $preferences.nim);
		formdata.append('password', $preferences.password);

		// guest account
		activeUsersGuest.map((user) => {
			formdata.append('nim', user.nim);
			formdata.append('password', user.password || '');
		});

		const resp = await fetch('/services/presensi/qrcode', {
			method: 'POST',
			body: formdata
		});
		const results: { success: boolean; message: string }[] = await resp.json();
		results.map((result) => {
			if (result.success) toast.success(result.message);
			else toast.error(result.message);
		});
		toast.success('Antrian Selesai', { id });
		qrresult = null;
	};
</script>

<BlockTitle>Scan QrCode</BlockTitle>
<Block>
	<QrScanner bind:imageUrl bind:result={qrresult} />
</Block>
<Block>
	<p>
		Silakan scan langsung menggunakan kamera di atas atau bisa juga dengan mengupload file qrcode
		yang ada di bawah ini
	</p>
</Block>
<Block>
	<input
		id="qrimage"
		type="file"
		bind:files={qrImages}
		on:change={uploadImage}
	/>
</Block>

<BlockTitle>Presensi Manual</BlockTitle>
<form action="?/qrcode" method="post" id="formqrcode" on:submit|preventDefault={guestQrCodeSubmit}>
	<input type="hidden" name="access_token" value={$authUser?.accessToken} />
	<input type="hidden" name="qrcode" bind:value={qrresult} />
	<button class="hidden" />
</form>
<form action="?/manual" method="post" on:submit={guestCodeSubmit} use:enhance={myenhance()}>
	<input type="hidden" name="access_token" value={$authUser?.accessToken} />
	<List strongIos insetIos>
		<ListInput
			outline
			name="code"
			label="Code"
			placeholder="Masukkan Kode Presensi"
			value={code}
			onInput={function () {
				code = this.value;
				this.value = code;
			}}
		/>
	</List>
	<Block>
		<Button large>Kirimkan</Button>
	</Block>
</form>

<BlockTitle>Presensi Bareng</BlockTitle>
<Block>saat ini presensi akan berbarengan dengan guest tamu yang ada</Block>
<ListTamu active bind:activeSources={activeUsersGuest} {except} />
