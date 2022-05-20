<script lang="ts">
	import QRScanner from 'qr-scanner';

	import Line from '../components/Line.svelte';
	import { onMount } from 'svelte';

	import { failure, success } from '../supports/toast-theme';
	import { sleep } from '../supports/promise';
	import { randomNumber } from '../supports/number';
	let nims = [''];

	$: qrcodeResult = '';
	const doPrecense = async () => {
		for (const nim of nims.filter(Boolean)) {
			const resp = await fetch(`/api/qrcode-precense.json?npm=${nim}&data=${btoa(qrcodeResult)}`, {
				method: 'post'
			});
			const response: { status: boolean; message: string } = await resp.json();

			if (response.status) success(`<b>${nim} :</b> ${response.message}`);
			else failure(`<b>${nim} :</b> ${response.message}`);

			await sleep(randomNumber(200, 700));
		}
	};

	onMount(async () => {
		nims = JSON.parse(localStorage.getItem('qrcode-nims') || '[""]') as string[];

		const videoElem = document.querySelector('video')!;

		const qrcode = new QRScanner(videoElem, (result) => {
			qrcodeResult = result;
			doPrecense();
		});

		const fileUpload = document.getElementById('qrcode-upload');
		fileUpload?.addEventListener('change', (event) => {
			// @ts-ignore
			const file = fileUpload?.files[0];
			if (!file) {
				return;
			}
			QRScanner.scanImage(file, { returnDetailedScanResult: true })
				.then((result) => {
					qrcodeResult = result.data;
					doPrecense();
				})
				.catch((e) => {
					qrcodeResult = '';
					alert('QRCode tidak ditemukan.');
				});
		});

		await qrcode.start();
	});

	const saveNimToLocalStorage = () =>
		localStorage.setItem('qrcode-nims', JSON.stringify(nims.filter(Boolean)));
	const addNim = () => {
		nims[nims.length] = '';
		saveNimToLocalStorage();
	};
	const deleteNim = (index: number) => {
		nims = nims.filter((_, i) => i != index);
		saveNimToLocalStorage();
	};
</script>

<section class="flex flex-col justify-content-center mx-auto gap-2 w-full xl:w-1/2">
	<h1>Scan QrCode</h1>
	<video class="rounded-lg w-full">
		<track kind="captions" />
	</video>
	<Line text="Or" />
	<h1>By Document</h1>
	<input type="file" id="qrcode-upload" accept="image/*" />
	<p class="text-sm text-gray-600">
		Masih bingung? cek tutorialnya <a href="/" class="text-blue-500 hover:underline">disini</a>
	</p>

	<section class="my-10">
		<Line />
	</section>
	<button class="flex-auto py-2 px-4 rounded text-white font-bold bg-green-500" on:click={addNim}
		>Tambah NIM +</button
	>
	{#each nims as nim, i}
		<section class="flex flex-row gap-2">
			<input
				type="text"
				bind:value={nim}
				on:change={saveNimToLocalStorage}
				placeholder="NIM"
				class="bg-gray-100 py-2 px-4 rounded-lg flex-auto"
			/>
			<span
				class="py-2 px-4 rounded text-white font-bold bg-red-500 hover:cursor-pointer"
				on:click|preventDefault={() => deleteNim(i)}>-</span
			>
		</section>
	{/each}
</section>

<style>
	video {
		max-height: 300px;
		object-fit: cover;
	}
</style>
