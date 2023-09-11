<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Block, BlockTitle, Button, List, ListInput } from 'konsta/svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { myenhance } from '$lib/forms/myenhance';
	import { navigating, page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { authUser, preferences } from '../../../lib/stores/preferences';
	import { usersGuest, type UserGuest, usersGuestStatus } from '../../../lib/stores/userguest';
	import ListTamu from '../../../lib/components/TamuComponent/ListTamu.svelte';
	import QrScanner from '../../../lib/components/QrScanner.svelte';
	import { sleep } from '../../../lib/supports/utils';
	import { getIdFromJadwal, jadwalHariIni, jadwalMatkulAktif } from '$lib/stores/jadwal';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	import type { RouterInputs } from '$lib/trpc/t';
	import { trpc } from '$lib/trpc/client';
	import { serviceClient } from '$lib/serviceClient';

	let qrImages: FileList | null;
	let qrresult: string | null;
	let imageUrl: string;
	let code = '';
	let guests: UserGuest[] = $usersGuest;
	let except = [$usersGuest.find((guest) => $mahasiswa?.Mhs?.Npm == guest.nim) as UserGuest];
	$: if ($usersGuestStatus) {
		Object.entries($usersGuestStatus).map(([key, value]) => {
			if ($jadwalMatkulAktif) {
				if (key == getIdFromJadwal($jadwalMatkulAktif)) {
					Object.entries(value).map(([nim, isActive]) => {
						const user = $usersGuest.find((guest) => guest.nim === nim);
						if (user) {
							if (isActive) {
								except = except.filter((g) => g.nim != nim);
							} else {
								const index = except.findIndex((guest) => guest?.nim == nim);
								except[except[index] ? index : except.length] = user;
							}
						}
					});
				}
			}
		});
	}

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
			if (except.includes(user)) return;
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
			if (except.includes(user)) return;
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
			toast.error('Gagal Presensi.', { id });
		}

		await sleep(1000);
		qrresult = null;
		submitting = false;
	};

	const deactive = (e: CustomEvent<UserGuest>) => {
		if ($jadwalMatkulAktif) {
			const id = getIdFromJadwal($jadwalMatkulAktif);
			if (!$usersGuestStatus[id]) $usersGuestStatus[id] = {};
			$usersGuestStatus[id][e.detail.nim] = false;

			const index = except.findIndex((g) => g?.nim === e.detail.nim);
			except[except[index] ? index : except.length] = e.detail;
		}
	};

	const active = (e: CustomEvent<UserGuest>) => {
		if ($jadwalMatkulAktif && $mahasiswa?.Mhs?.Npm !== e.detail.nim) {
			const id = getIdFromJadwal($jadwalMatkulAktif);
			if (!$usersGuestStatus[id]) $usersGuestStatus[id] = {};
			$usersGuestStatus[id][e.detail.nim] = true;

			except = except.filter((g) => g.nim !== e.detail.nim);
		}
	};

	onMount(async () => {
		await serviceClient.refresh();
	});

	onDestroy(() => {
		toast.remove();
	});
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
	<input id="qrimage" type="file" bind:files={qrImages} on:change={uploadImage} />
</Block>

<form
	action="?/qrcode"
	method="post"
	id="formqrcode"
	on:submit={guestQrCodeSubmit}
	use:enhance={myenhance()}
>
	<input type="hidden" name="access_token" value={$authUser?.accessToken} />
	<input type="hidden" name="qrcode" bind:value={qrresult} />
	<button class="hidden" />
</form>
<BlockTitle>Presensi Manual</BlockTitle>
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
<ListTamu on:deactive={deactive} on:active={active} active bind:guests bind:except />
