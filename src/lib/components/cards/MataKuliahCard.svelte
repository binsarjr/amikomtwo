<script lang="ts">
	import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response';
	import { autofocus } from '../../actions/focus';
	import { onDestroy, onMount } from 'svelte';

	export let item: IJadwalKuliah;
	export let focusToElement = false;
	let focus = false;

	let id: any;
	onMount(() => {
		if (focusToElement) {
			id = setTimeout(() => {
				focus = focusToElement;
			}, 100);
		}
	});
	onDestroy(() => {
		if (id) clearTimeout(id);
	});

	const convertRuangan = (ruang: string) => {
		if (ruang.toLowerCase().startsWith('vr')) return 'Virtual Room';
		if (ruang.toLowerCase().startsWith('vl')) return 'Virtual Lab';
		if (ruang.toLowerCase().startsWith('l')) {
			ruang = ruang.replace(/^l\s{0,}/i, '');
		}
		const [gedung, lantai, ruangan] = ruang.split('.', 3);
		return `Gedung ${parseInt(gedung)} Lantai ${parseInt(lantai)} Ruang ${parseInt(ruangan)}`;
	};
</script>

<section use:autofocus={focus} {...$$restProps}>
	<div class="relative text-white rounded-xl flex flex-col justify-between font-medium">
		<div class="px-6 py-4 flex-grow">
			<div class="grid grid-cols-[1fr,.20fr] items-center">
				<div class="my-auto">
					{#if item.Keterangan}
						<p class="text-2xs font-medium bg-black bg-opacity-70 inline-block p-2 rounded mb-2">
							{item.Keterangan}
						</p>
					{/if}
					<h3 class="font-bold text-lg">{item.MataKuliah}</h3>
					<div class="mt-4">
						<p class="font-bold">{item.NamaDosen}</p>
						<p class="text-xs">{item.EmailDosen}</p>
					</div>
					<a href={item.ZoomURL} target="_blank" rel="noreferrer" class="inline-block mt-4">
						<p class="font-bold">Zoom:</p>
						<p class="text-blue-500 hover:text-blue-600">{item.ZoomURL}</p>
					</a>
				</div>
				<div>
					<div
						class="label font-bold"
						class:yellow={item.JenisKuliah == 'Praktikum'}
						class:purple={item.JenisKuliah == 'Teori'}
					>
						{item.JenisKuliah}
					</div>
					<!-- <div class="font-bold">
					<p>Kode: {item.Kode}</p>
				</div> -->
				</div>
			</div>
		</div>
		<div
			class="px-6 py-4 bg-black bg-opacity-65 rounded-b-xl font-bold flex justify-between items-center gap-5"
		>
			<div class="flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M12 12q.825 0 1.413-.588T14 10q0-.825-.588-1.413T12 8q-.825 0-1.413.588T10 10q0 .825.588 1.413T12 12Zm0 9.625q-.2 0-.4-.075t-.35-.2Q7.6 18.125 5.8 15.362T4 10.2q0-3.75 2.413-5.975T12 2q3.175 0 5.588 2.225T20 10.2q0 2.4-1.8 5.163t-5.45 5.987q-.15.125-.35.2t-.4.075Z"
					/></svg
				>
				<div class="">
					<div>
						{item.Ruang}
					</div>
					<div class="text-xs">{@html convertRuangan(item.Ruang)}</div>
				</div>
			</div>
			<div class="flex flex-nowrap whitespace-nowrap items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"
					/></svg
				>
				<p>{item.Waktu}</p>
			</div>
		</div>
	</div>
</section>

<style>
	section > div {
		background-image: url(https://i0.wp.com/gushaironfadli.com/handsome/wp-content/uploads/2016/09/lab-apple-multimedia-stmik-amikom-1024x682.jpg?resize=770%2C513);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-blend-mode: multiply;
		background-color: rgba(0, 0, 0, 0.7);
		width: 100%;
		height: 100%;
	}
	.label {
		@apply absolute top-2 right-[-10px] py-1 px-4;
	}

	.label::after {
		content: '';
		@apply absolute bottom-[-10px] right-0;
		z-index: -1;

		width: 20px;
		height: 10px;
		rotate: -55deg;
	}

	.label.yellow {
		@apply bg-yellow-500;
	}
	.label::after.yellow {
		@apply bg-yellow-800;
	}

	.label.purple {
		@apply bg-purple-500;
	}
	.label::after.purple {
		@apply bg-purple-800;
	}
</style>
