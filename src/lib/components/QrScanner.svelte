<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BrowserCodeReader,
		BrowserMultiFormatReader,
		BrowserQRCodeReader,
		type IScannerControls
	} from '@zxing/browser';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import { browser } from '$app/environment';
	import { writable } from 'svelte-local-storage-store';

	export let result: string | null;
	export let imageUrl: string | null = null;
	let selectedDeviceId = writable<string | undefined>('cameraDeviceId', undefined);
	const codeReader = new BrowserMultiFormatReader();
	let controls: IScannerControls | null = null;
	let video: HTMLVideoElement;

	let err: string;

	let isZoomSupport = false;
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
				// if(error) err="Dari zxing coder "+error?.toString()

				// console.log(result, 'bro');
				// use the result and error values to choose your actions
				// you can also use controls API in this scope like the controls
				// returned from the method.
			}
		);

		// @ts-ignore
		let capabilities = controls.streamVideoCapabilitiesGet();
		// @ts-ignore
		min = capabilities?.zoom?.min || 1;
		// @ts-ignore
		max = capabilities?.zoom?.max || 1;
		// @ts-ignore
		isZoomSupport = !!capabilities?.zoom;
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
		}
	};

	$: if ($range && browser) {
		changeZoomScale();
	}
</script>

<div class="relative">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="video" class="w-full mx-auto" />
	<div class="absolute bottom-0 w-full flex flex-col items-end">
		{#if isZoomSupport}
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
		{:else}
			<div class="w-full px-4 py-2">
				<p class="text-white">Zoom is not supported by your device selection</p>
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
{#if err}
	<div>Jika menemukan pesan ini mohon screenshot dan laporkan keadmin: {err}</div>
{/if}

<style>
	#zoom .active span {
		@apply inline-block bg-white text-black rounded-full w-8 h-8 pt-1;
	}
</style>
