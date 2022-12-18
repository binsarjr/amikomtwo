<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import { Block, BlockTitle, Button, List, ListInput } from 'konsta/svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { navigating } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { authUser } from '../../../lib/stores/preferences';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let code = '';
	$: if (qrresult) {
		//   need time for reactive
		setTimeout(() => {
			document.getElementById('formqrcode')?.querySelector('button')?.click();
		}, 20);
	}
	let qrscanner: any;
	$: {
		if ($navigating) {
			// @ts-ignore
			if (qrscanner) {
				qrscanner.destroy();
				qrscanner.stop();
			}
			qrscanner = null;
		}
	}

	afterNavigate(async () => {
		// @ts-ignore
		qrscanner = new QrScanner(
			// @ts-ignore
			document.getElementById('qr'),
			(res: any) => {
				console.log(res);
				// skip process when qrresult is not yet empty
				if (qrresult != null) return;
				qrresult = res.data;
			},
			{
				highlightScanRegion: true,
				highlightCodeOutline: true
			}
		);
		qrscanner.setInversionMode('both');
		qrscanner.start();
	});

	const uploadImage = async () => {
		// skip process when qrresult is not yet empty
		if (qrresult != null || !qrImages?.length) return;
		try {
			const res = await Promise.any([QrScanner.scanImage(qrImages[0])]);
			if (res) qrresult = res;
		} catch (error) {
			alert('Gagal scan qrcode.cobalah dengan qrcode yang lain');
		}
	};
</script>

<BlockTitle>Scan QrCode</BlockTitle>
<Block>
	<video id="qr" class="max-h-[400px] w-full mx-auto" />
</Block>
<Block>
	<p>
		Silakan scan langsung menggunakan kamera di atas atau bisa juga dengan mengupload file qrcode
		yang ada di bawah ini
	</p>
</Block>
<Block>
	<input id="qrimage" type="file" bind:files={qrImages} on:change={uploadImage} />
</Block>

<BlockTitle>Presensi Manual</BlockTitle>
<form action="?/qrcode" method="post" id="formqrcode" use:enhance={myenhance()}>
	<input type="hidden" name="access_token" value={$authUser?.accessToken} />
	<input type="hidden" name="qrcode" bind:value={qrresult} />
	<button class="hidden" />
</form>
<form action="?/manual" method="post" use:enhance={myenhance()}>
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
