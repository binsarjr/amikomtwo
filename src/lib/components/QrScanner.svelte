<script lang="ts">
	import { onMount } from 'svelte';
	import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import { browser } from '$app/environment';
	import { writable } from 'svelte-local-storage-store';
	import toast from 'svelte-french-toast';
	import { isIos } from '../stores/preferences';

	export let result: string | null;
	export let imageUrl: string | null = null;
	let selectedDeviceId = writable<string | undefined>('cameraDeviceId', undefined);
	const codeReader = new BrowserMultiFormatReader();
	let controls: IScannerControls | null = null;
	let video: HTMLVideoElement;

	let min = 1;
	let max = 10;

	let videoInputDevices: MediaDeviceInfo[] = [];

	const scanImage = async (url: string) => {
		const res = await Promise.any([
			QrScanner.scanImage(url),
			codeReader.decodeFromImageUrl(url).then((res) => res.getText())
		]);
		return res;
	};
	$: if (browser && imageUrl) {
		scanImage(imageUrl).then((res) => {
			result = res;
			imageUrl = null;
		});
	}

	let range = writable('zoom', 1);
	const load = async () => {
		if (controls) {
			controls.stop();
			controls = null;
		}
		await navigator?.mediaDevices
			?.getUserMedia({
				video: {
					deviceId: $selectedDeviceId||undefined,
					facingMode: {
						exact: 'environment'
					}
				}
			})
			.catch(() => toast.error('Kamera tidak tersedia. Pastikan device ada dan telah diizinkan'));

		videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
		if (!videoInputDevices.find((p) => p.deviceId == $selectedDeviceId)) {
			$selectedDeviceId = videoInputDevices[0].deviceId;
		}
		// choose your media device (webcam, frontal camera, back camera, etc.)

		console.log(`Started decode from camera with id ${$selectedDeviceId}`);

		// you can use the controls to stop() the scan or switchTorch() if available
		controls = await codeReader.decodeFromVideoDevice(
			$selectedDeviceId,
			video,
			async (_result, error, controls) => {
				if (!result) {
					result = _result?.toString() || '';
				}
			}
		);

		// @ts-ignore
		let capabilities = controls.streamVideoCapabilitiesGet();
		// @ts-ignore
		min = capabilities?.zoom?.min || 1;
		// @ts-ignore
		max = capabilities?.zoom?.max || 10;
		changeZoomScale();
	};
	$: if ($selectedDeviceId && browser) {
		load();
	}
	onMount(async () => {
		video = document.getElementById('video') as HTMLVideoElement;
		await load();
	});

	const change = async (e: any) => {
		$selectedDeviceId = e.target.value;
		await load();
	};

	const changeZoomScale = async () => {
		if (controls) {
			// @ts-ignore
			controls.streamVideoConstraintsApply({
				advanced: [
					{
						// @ts-ignore
						zoom: $range
					}
				]
			});
			// if ($isIos) {
			// 	await navigator.mediaDevices.getUserMedia({
			// 		video: {
			// 			// @ts-ignore
			// 			zoom: {
			// 				ideal: $range
			// 			}
			// 		}
			// 	});
			// }
		}
	};

	$: if ($range && browser) {
		changeZoomScale();
	}
</script>

<div class="relative">
	{#if $isIos}
		<p>
			Berhubung banyaknya problem yang terjadi di ios seperti tidak bisa scan qrcode dan sebagainya.
			Saya menyarankan menggunakan kode terlebih dahulu
		</p>
	{/if}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="video" class="w-full mx-auto" />
	<div class="absolute bottom-0 w-full flex flex-col items-end">
		{#if $isIos}
			<p class="text-white px-4">Ios Belum support untuk zoom in/out</p>
		{:else}
			<div class="w-full flex justify-around items-center gap-2" id="zoom">
				{#each [1, 2, 4, 6, 8, 10] as targetRange}
					<button
						type="button"
						on:click={() => ($range = targetRange)}
						class="text-white p-4"
						class:active={parseInt($range.toString() || '') == targetRange}
					>
						<span>{targetRange}x</span>
					</button>
				{/each}
			</div>
			<div class="w-full px-4 py-2">
				<input type="range" bind:value={$range} class="w-full" {min} {max} />
			</div>
		{/if}
		<div class="w-full px-4 py-2">
			<select on:change={change} class="w-full px-4 py-2">
				<option disabled selected>-- Pilih Kamera--</option>
				{#each videoInputDevices as videoInputDevice}
					<option
						value={videoInputDevice.deviceId}
						selected={videoInputDevice.deviceId == $selectedDeviceId}
						>{videoInputDevice.label}</option
					>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	#zoom .active span {
		@apply inline-block bg-white text-black rounded-full w-8 h-8 pt-1;
	}
</style>
