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


const reqService = async (endpoint: string, searchParams = new URLSearchParams()) => {
	const userdata = get(authUser)!
	const url = new URL(window.location.href)
	url.pathname = endpoint
	searchParams.set('access_token', encodeURIComponent(userdata.accessToken))
	searchParams.set('api_key', encodeURIComponent(userdata.apiKey))
	url.search = searchParams.toString()
	const r = await fetch(url.toString());
	return r;
}

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
		const r = await reqService('/onedevice/services/bio')
		const resp: IBio = await r.json();
		if (r.status == 200) mahasiswa.update(() => resp);
	}, ktm: async () => {
		const r = await reqService('/onedevice/services/ktm')

		const resp = await r.json();
		return resp.status?.code == 200 ? `data:image/png;base64,${resp?.result?.hash}` : null
	},
	initkhs: async () => {
		const r = await reqService('/onedevice/services/initkhs')

		const resp: InitKHS = await r.json();
		if (r.status == 200) initKhs.update(() => resp);
	},
	jadwal: async (hari: number) => {
		const searchParams = new URLSearchParams()
		searchParams.set('hari', hari.toString())
		const r = await reqService('/onedevice/services/jadwal', searchParams)
		const resp: IJadwalKuliah[] = await r.json();
		if (r.status == 200) jadwal.update(() => resp);
	},
	jadwalMingguan: async (hari: number) => {
		const searchParams = new URLSearchParams()
		searchParams.set('hari', hari.toString())
		const r = await reqService('/onedevice/services/jadwal', searchParams)
		const resp: IJadwalKuliah[] = await r.json();
		return resp
	},
	historiPresensi: async (semester: number, tahunAkademik: string) => {
		const searchParams = new URLSearchParams()
		searchParams.set('semester', semester.toString())
		searchParams.set('tahun_akademik', tahunAkademik)
		const r = await reqService('/onedevice/services/histori-presensi', searchParams)
		const resp: IPresence[] = await r.json();
		return (r.status == 200) ? resp : [];
	},
	pengumuman: async () => {
		const r = await reqService('/onedevice/services/pengumuman')
		const resp: Pengumuman[] = await r.json();
		if (r.status == 200) pengumuman.update(() => resp)
	},
	transkrip: async () => {
		const r = await reqService('/onedevice/services/transkrip')

		const resp: ITranskripNilai = await r.json();
		if (r.status == 200) transkripNilai.update(() => resp);
	},
	hasilStudi: async (semester: number, tahunAkademik: string) => {
		const searchParams = new URLSearchParams()
		searchParams.set('semester', semester.toString())
		searchParams.set('tahun_akademik', tahunAkademik)
		const r = await reqService('/onedevice/services/hasil-studi', searchParams)
		
		const resp: IHasilSemester = await r.json();
		if (r.status == 200) hasilStudiSemester.update(() => resp);
	},
	pembayaran: {
		bank: async () => {
			const getData = async (accessToken: string, apiKey: string) => {
		const r = await reqService('/onedevice/services/pembayaran/bank')
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
