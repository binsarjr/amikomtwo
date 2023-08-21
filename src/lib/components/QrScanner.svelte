<script lang="ts">
	import { onMount } from 'svelte';
	import type { BrowserMultiFormatReader } from '@zxing/library';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import { browser } from '$app/environment';
	import { persisted } from 'svelte-local-storage-store';
	import toast from 'svelte-french-toast';
	import { isIos } from '../stores/preferences';
	import LoadExternalLibrary from '$lib/components/LoadExternalLibrary.svelte';

	export let result: string | null;
	export let imageUrl: string | null = null;
	let selectedDeviceId = persisted<string>('cameraDeviceId', '');
	let codeReader: BrowserMultiFormatReader;

	let video: HTMLVideoElement;

	let isCameraAvailable = true;

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

	let range = 1;
	const load = async () => {
		await navigator?.mediaDevices
			?.getUserMedia({
				video: {
					deviceId: $selectedDeviceId || undefined,
					facingMode: {
						exact: 'environment'
					}
				}
			})
			.catch(() => {
				if (isCameraAvailable) isCameraAvailable = false;
				else return;
				toast.error(
					'Kamera belakang tidak tersedia. Pastikan device ada dan telah diizinkan. Abaikan jika kamu menggunakan kamera depan'
				);
			});
		if (codeReader) {
			codeReader.reset();
		}
		// @ts-ignore: no type
		codeReader = new window.ZXing.BrowserMultiFormatReader();

		videoInputDevices = await codeReader.listVideoInputDevices();
		if (!videoInputDevices.find((p) => p.deviceId == $selectedDeviceId)) {
			$selectedDeviceId = videoInputDevices[0].deviceId || '';
		}
		// choose your media device (webcam, frontal camera, back camera, etc.)

		console.log(`Started decode from camera with id ${$selectedDeviceId}`);

		// you can use the controls to stop() the scan or switchTorch() if available
		codeReader.decodeFromVideoDevice($selectedDeviceId, video, (_result, error) => {
			if (!result && _result) {
				// @ts-ignore: any
				const text = _result?.text || _result.getText();
				result = text;
			}
		});

		// // @ts-ignore
		// let capabilities = controls?.streamVideoCapabilitiesGet();
		// // @ts-ignore
		// min = capabilities?.zoom?.min || 1;
		// // @ts-ignore
		// max = capabilities?.zoom?.max || 10;
		// changeZoomScale();
	};

	const change = async (e: any) => {
		$selectedDeviceId = e.target.value || '';
		await load();
	};

	const changeZoomScale = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: { deviceId: { exact: $selectedDeviceId } }
		});

		const videoTrack = stream.getVideoTracks()[0];
		try {
			await videoTrack.applyConstraints({
				advanced: [
					{
						// @ts-ignore
						zoom: range
					}
				]
			});
		} catch (error) {}

		// if (controls) {
		// 	// @ts-ignore
		// 	controls.streamVideoConstraintsApply({
		// 		advanced: [
		// 			{
		// 				// @ts-ignore
		// 				zoom: $range
		// 			}
		// 		]
		// 	});
		// 	// if ($isIos) {
		// 	// 	await navigator.mediaDevices.getUserMedia({
		// 	// 		video: {
		// 	// 			// @ts-ignore
		// 	// 			zoom: {
		// 	// 				ideal: $range
		// 	// 			}
		// 	// 		}
		// 	// 	});
		// 	// }
		// }
	};

	$: if (range && browser && codeReader?.isVideoPlaying(video)) {
		changeZoomScale();
	}
	onMount(async () => {
		await load();
	});
</script>

<LoadExternalLibrary on:load={load} src="/zxing.min.js" />

<div class="relative">
	{#if $isIos}
		<p>
			Berhubung banyaknya problem yang terjadi di ios seperti tidak bisa scan qrcode dan sebagainya.
			Saya menyarankan menggunakan kode terlebih dahulu
		</p>
	{/if}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="video" bind:this={video} class="w-full mx-auto" />
	<div class="absolute bottom-0 w-full flex flex-col items-end">
		<!-- {#if $isIos}
			<p class="text-white px-4">Ios Belum support untuk zoom in/out</p>
		{:else} -->
		<div class="w-full flex justify-around items-center gap-2" id="zoom">
			{#each [1, 2, 4, 6, 8, 10] as targetRange}
				<button
					type="button"
					on:click={() => (range = targetRange)}
					class="text-white p-4"
					class:active={parseInt(range.toString() || '') == targetRange}
				>
					<span>{targetRange}x</span>
				</button>
			{/each}
		</div>
		<div class="w-full px-4 py-2">
			<input type="range" bind:value={range} class="w-full" {min} {max} />
		</div>
		<!-- {/if} -->
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
