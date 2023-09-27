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
	import type { RouterInputs } from '$lib/trpc/t';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { networkStatus } from '$lib/components/PWA/store';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let imageUrl: string;
	let code = '';
	let guests: UserGuest[] = $usersGuest;
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
			reader.onload = (e) => {
				imageUrl = e.target!.result?.toString() || '';
			};
			reader.readAsDataURL(qrImages[0]);
		} catch (error) {
			alert('Gagal scan qrcode.cobalah dengan qrcode yang lain');
		}
	};

	let submitting = false;
	const guestCodeSubmit = async () => {
		if (submitting) return;
		const id = toast.loading('Mohon Menunggu...');
		submitting = true;
		const query: RouterInputs['presensi']['code'] = {
			code,
			accounts: []
		};
		guests.map((user) => {
			query.accounts.push({
				nim: user.nim,
				password: user?.password || ''
			});
		});

		try {
			const results = await trpc($page).presensi.code.query(query);
			results.map((result) => {
				if (result.success) toast.success(result.message);
				else toast.error(result.message);
			});
			toast.success('Antrian Selesai', { id });
		} catch (error) {
			toast.error('Gagal Presensi', { id });
		}
		submitting = false;
	};
	const guestQrCodeSubmit = async () => {
		if (submitting) return;
		const id = toast.loading('Mohon Menunggu...');
		submitting = true;
		const query: RouterInputs['presensi']['qrcode'] = {
			data: qrresult || '',
			accounts: []
		};
		guests.map((user) => {
			query.accounts.push({
				nim: user.nim,
				password: user?.password || ''
			});
		});

		try {
			const results = await trpc($page).presensi.qrcode.query(query);
			results.map((result) => {
				if (result.success) toast.success(result.message);
				else toast.error(result.message);
			});
			toast.success('Antrian Selesai', { id });
		} catch (error) {
			toast.error('Gagal Presensi', { id });
		}
		await sleep(1000);
		qrresult = null;
		submitting = false;
	};
</script>

<Page>
	<Navbar title="AmikomTWO" subtitle={$networkStatus}>
		<NavbarBackLink slot="left" text="Back" onClick={() => history.back()} />
	</Navbar>
	<BlockTitle>Scan QrCode</BlockTitle>
	<Block>
		<QrScanner bind:result={qrresult} bind:imageUrl />
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
	<ListTamu active bind:guests />
</Page>
