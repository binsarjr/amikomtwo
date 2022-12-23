import type {
	IBio,
	IHasilSemester,
	IJadwalKuliah,
	InitKHS,
	IPresence,
	ITranskripNilai,
	Pengumuman
} from '@binsarjr/apiamikomone/lib/typings/Response';
import toast from 'svelte-french-toast';
import { get } from 'svelte/store';
import { hasilStudiSemester, pengumuman, transkripNilai } from './stores/akademik';
import { initKhs } from './stores/initKhs';
import { jadwal } from './stores/jadwal';
import { mahasiswa } from './stores/mahasiswa';
import { listBank } from './stores/pembayaran';
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
	}, jadwalMingguan: async (hari: number) => {
		const r = await fetch(
			`/onedevice/services/jadwal?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}&hari=${hari}`
		);
		const resp: IJadwalKuliah[] = await r.json();
		return resp
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
		const resp: Pengumuman[] = await r.json();
		if (r.status == 200) pengumuman.update(() => resp)
	},
	transkrip: async () => {
		const r = await fetch(
			`/onedevice/services/transkrip?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
		);
		const resp: ITranskripNilai = await r.json();
		if (r.status == 200) transkripNilai.update(() => resp);
	},
	hasilStudi: async (semester: number, tahunAkademik: string) => {
		const r = await fetch(
			`/onedevice/services/hasil-studi?access_token=${encodeURIComponent(
				get(authUser)!.accessToken
			)}&api_key=${encodeURIComponent(
				get(authUser)!.apiKey
			)}&semester=${semester}&tahun_akademik=${tahunAkademik}`
		);
		const resp: IHasilSemester = await r.json();
		if (r.status == 200) hasilStudiSemester.update(() => resp);
	},
	pembayaran: {
		bank: async () => {
			const getData = async (accessToken: string, apiKey: string) => {
				const r = await fetch(
					`/onedevice/services/pembayaran/bank?access_token=${encodeURIComponent(accessToken)}&api_key=${encodeURIComponent(apiKey)}`
				);
				const resp: string[] = await r.json();
				if (resp.length) listBank.update(() => resp)
				return resp
			}
			let bank = get(listBank)
			const userdata = get(authUser)!
			if (bank.length) {
				getData(userdata.accessToken, userdata.apiKey)
				return bank
			}
			bank = await getData(userdata.accessToken, userdata.apiKey)
			return bank
		}
	}
};
