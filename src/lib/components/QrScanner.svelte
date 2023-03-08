<script lang="ts">
	import { onMount } from 'svelte';
	import { BrowserCodeReader, BrowserQRCodeReader } from '@zxing/browser';
	// @ts-ignore
	import QrScanner from 'qr-scanner';
	import { browser } from '$app/environment';

	let selectedDeviceId: string;
	const codeReader = new BrowserQRCodeReader();
	let video: HTMLVideoElement;

	export let result: string|null;
	export let imageUrl: string | null = null;

	const scanImage = async (url: string) => {
		const res = await Promise.any([
			QrScanner.scanImage(url),
			codeReader.decodeFromImageUrl(url).then((res) => res.getText())
		]);
		return res;
	};
	$: if (browser && imageUrl) {
		scanImage(imageUrl).then(res =>{
			result=res
			imageUrl=null
		})
	}

	let range = 1;
	const load = async () => {
		await navigator.mediaDevices.getUserMedia({
			video:true
		})


		// choose your media device (webcam, frontal camera, back camera, etc.)

		console.log(`Started decode from camera with id ${selectedDeviceId}`);

		// you can use the controls to stop() the scan or switchTorch() if available
		await codeReader.decodeFromVideoDevice(selectedDeviceId, video, (_result, error, controls) => {
			if (!result) {
				result = _result?.toString() || '';
			}

			// console.log(result, 'bro');
			// use the result and error values to choose your actions
			// you can also use controls API in this scope like the controls
			// returned from the method.
		});
	};
	$: if (selectedDeviceId && browser) {
		load();
	}
	onMount(async () => {
		video = document.getElementById('video') as HTMLVideoElement;
		await load();
	});

	const change = async (e:any) => {
		selectedDeviceId = e.target.value;
		await load();
		changeZoomScale();
	};

	const changeZoomScale = () => {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					advanced: [
						{
							deviceId: selectedDeviceId
						}
					]
				}
			})
			.then(async function (stream) {
				let track = stream.getVideoTracks()[0];
				let constraints = track.getConstraints();
				// @ts-ignore
				constraints.advanced = [{ zoom: range }];
				await track.applyConstraints(constraints);
				video.srcObject = stream;
			})
			.catch(function (error) {
				console.log('Error accessing camera: ' + error);
			});
	};
	let rangeId: any;

	$: if (range && browser) {
		rangeId && clearTimeout(rangeId);
		rangeId = setTimeout(() => changeZoomScale(), 500);
	}
</script>

<div class="relative">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="video" class="w-full mx-auto" />
	<div class="absolute bottom-0 w-full flex flex-col items-end">
		<div class="w-full flex justify-around items-center gap-2" id="zoom">
			{#each [1, 2, 4, 6, 8, 10] as targetRange}
				<button
					type="button"
					on:click={() => (range = targetRange)}
					class="text-white p-4"
					class:active={range == targetRange}
				>
					<span>{targetRange}x</span>
				</button>
			{/each}
		</div>
		<div class="w-full px-4 py-2">
			<input type="range" bind:value={range} class="w-full" min="1" max="10" />
		</div>
		<div class="w-full px-4 py-2">
		{#await BrowserCodeReader.listVideoInputDevices() then videoInputDevices}
			<select on:change={change} class="w-full px-4 py-2">
				<option disabled selected>-- Pilih Kamera (default: environment)--</option>
				{#each videoInputDevices as videoInputDevice, i}
					<option value={videoInputDevice.deviceId}>{videoInputDevice.label}</option>
				{/each}
			</select>
		{/await}
		</div>
	</div>
</div>

<style>
	#zoom .active span {
		@apply inline-block bg-white text-black rounded-full w-8 h-8 pt-1;
	}
</style>
