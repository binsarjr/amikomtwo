<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
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
	import toast from 'svelte-french-toast';
	import { usersGuest, type UserGuest } from '../../lib/stores/userguest';
	import ListTamu from '../../lib/components/TamuComponent/ListTamu.svelte';
	import ImportTamu from '../../lib/components/ImportTamu.svelte';
	import QrScanner from '../../lib/components/QrScanner.svelte';
	import { sleep } from '../../lib/supports/utils';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let imageUrl:string;
	let code = '';
	let activeUsersGuest: UserGuest[] = $usersGuest;
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
		await sleep(1000)
		qrresult = null;
	};
</script>

<Page>
	<Navbar title="AmikomTWO">
		<NavbarBackLink slot="left" text="Back" onClick={() => history.back()} />
	</Navbar>
	<BlockTitle>Scan QrCode</BlockTitle>
	<Block>
		<QrScanner bind:result={qrresult} bind:imageUrl/>
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
