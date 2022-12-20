import type {
	IBio,
	IJadwalKuliah,
	InitKHS,
	IPresence,
	PageResponse,
	Pengumuman
} from '@binsarjr/apiamikomone/lib/typings/Response';
import toast from 'svelte-french-toast';
import { get } from 'svelte/store';
import { initKhs } from './stores/initKhs';
import { jadwal } from './stores/jadwal';
import { mahasiswa } from './stores/mahasiswa';
import { authUser, preferences } from './stores/preferences';

export const serviceClient = {
	refresh: async () => {
		const formdata = new FormData();
		formdata.set('nim', get(preferences).nim);
		formdata.set('password', get(preferences).password);
		const r = await fetch('/onedevice/services/refresh', {
			method: 'POST',
			body: formdata
		});
		const response = await r.json();
		if (r.status == 200) {
			authUser.update(() => ({
				accessToken: response.access_token,
				apiKey: response.api_key
			}));
		} else {
			toast.error('Gagal Login.');
			authUser.update(() => null);
		}

	},
	bio: async () => {
		const r = await fetch(
			`/onedevice/services/bio?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
		);
		const resp: IBio = await r.json();
		if (r.status == 200) mahasiswa.update(() => resp);
	}, ktm: async () => {
		const r = await fetch(
			`/onedevice/services/ktm?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
		);
		const resp = await r.json();
		return resp.status?.code == 200 ? `data:image/png;base64,${resp?.result?.hash}` : null
	},
	initkhs: async () => {
		const r = await fetch(
			`/onedevice/services/initkhs?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
		);
		const resp: InitKHS = await r.json();
		if (r.status == 200) initKhs.update(() => resp);
	},
	jadwal: async (hari: number) => {
		const r = await fetch(
			`/onedevice/services/jadwal?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}&hari=${hari}`
		);
		const resp: IJadwalKuliah[] = await r.json();
		if (r.status == 200) jadwal.update(() => resp);
	},
	historiPresensi: async (semester: number, tahunAkademik: string) => {
		const r = await fetch(
			`/onedevice/services/histori-presensi?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(
				get(authUser)!.apiKey
			)}&semester=${semester}&tahun_akademik=${tahunAkademik}`
		);
		const resp: IPresence[] = await r.json();
		return (r.status == 200) ? resp : [];
	},
	pengumuman: async () => {
		const r = await fetch(
			`/onedevice/services/pengumuman?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}`
		);
		const resp: PageResponse<Pengumuman> = await r.json();
		return resp.results
	},
};
