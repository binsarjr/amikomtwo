<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import {
		Block,
		BlockTitle,
		Button,
		List,
		ListInput,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page
	} from 'konsta/svelte';
	import { afterNavigate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { usersGuest, type UserGuest } from '../../lib/stores/userguest';
	import ListTamu from '../../lib/components/TamuComponent/ListTamu.svelte';
	import ImportTamu from '../../lib/components/ImportTamu.svelte';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let code = '';
	let activeUsersGuest: UserGuest[] = $usersGuest;
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
				// skip process when qrresult is not yet empty
				if (qrresult != null) return;
				qrresult = res.data;
			},
			{
				highlightScanRegion: true,
				highlightCodeOutline: true,
				calculateScanRegion: (v) => {
					const smallestDimension = Math.min(v.videoWidth, v.videoHeight);

					// Make scan region smaller to match better small qr codes
					const scanRegionSize = Math.round((1 / 4) * smallestDimension);

					let region: QrScanner.ScanRegion = {
						x: Math.round((v.videoWidth - scanRegionSize) / 2),
						y: Math.round((v.videoHeight - scanRegionSize) / 2),
						width: scanRegionSize,
						height: scanRegionSize
					};
					return region;
				}
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

	const guestCodeSubmit = async () => {
		if (activeUsersGuest.length === 0) return;
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
		if (activeUsersGuest.length === 0) return;
		const id = toast.loading('Mohon Menunggu...');
		const formdata = new FormData();
		formdata.set('data', qrresult || '');
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

<Page>
	<Navbar title="AmikomTWO">
		<NavbarBackLink slot="left" text="Back" onClick={() => history.back()} />
	</Navbar>
	<BlockTitle>Scan QrCode</BlockTitle>
	<Block>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video id="qr" class="max-h-[400px] w-full mx-auto" capture="environment" />
	</Block>
	<Block>
		<p>
			Silakan scan langsung menggunakan kamera di atas atau bisa juga dengan mengupload file qrcode
			yang ada di bawah ini
		</p>
	</Block>
	<Block>
		<input
			capture="environment"
			id="qrimage"
			type="file"
			bind:files={qrImages}
			on:change={uploadImage}
		/>
	</Block>

	<BlockTitle>Presensi Manual</BlockTitle>
	<form method="post" id="formqrcode" on:submit|preventDefault={guestQrCodeSubmit}>
		<button class="hidden" />
	</form>
	<form method="post" on:submit|preventDefault={guestCodeSubmit}>
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
	<Block>Presensi akan berbarengan dengan guest tamu yang ada</Block>
	<ImportTamu />
	<ListTamu active bind:activeSources={activeUsersGuest} />
</Page>
