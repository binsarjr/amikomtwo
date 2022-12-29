import type {
	IBio,
	IHasilSemester,
	IJadwalKuliah,
	IPresence,
	IPresenceDetail,
	ITranskripNilai,
	InitKHS,
	Pengumuman
} from '@binsarjr/apiamikomone/lib/typings/Response'
import moment from 'moment'
import toast from 'svelte-french-toast'
import { get } from 'svelte/store'
import { hasilStudiSemester, pengumuman, transkripNilai } from './stores/akademik'
import { initKhs } from './stores/initKhs'
import { jadwal } from './stores/jadwal'
import { mahasiswa } from './stores/mahasiswa'
import { listBank } from './stores/pembayaran'
import { authUser, preferences } from './stores/preferences'
/**
 * Mendapatkan response dari service dengan menggunakan data dari user yang
 * telah login.
 *
 * @param endpoint - Endpoint yang dipanggil.
 * @param searchParams - Parameter pencarian yang opsional.
 * @returns Response dari service.
 */
const reqService = async (endpoint: string, searchParams = new URLSearchParams()) => {
	const userdata = get(authUser)!;
	const url = new URL(window.location.href);
	url.pathname = endpoint;
	searchParams.set('access_token', encodeURIComponent(userdata.accessToken));
	searchParams.set('api_key', encodeURIComponent(userdata.apiKey));
	url.search = searchParams.toString();
	const r = await fetch(url.toString());
	return r;
};

export const serviceClient = {
	/**
	 * Melakukan refresh pada token akses dan API Key.
	 * Fungsi ini menggunakan fetch untuk mempost data login (nim dan password),
	 * lalu merespon dengan token akses jika proses berhasil.
	 * Jika proses gagal akan menampilkan pesan error.
	 *
	 * @param preferences - data login (nim dan password).
	 * @returns response berupa token akses dan API Key, atau pesan error jika
	 * gagal.
	 */
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
	/**
	 * Mengambil data biodata mahasiswa.
	 * Fungsi ini akan memanggil servis REST untuk mendapatkan (data) biodata
	 * mahasiswa.
	 * Status kode 200 harus diterima untuk mengubah data biodata mahasiswa.
	 *
	 * @returns resp - Objek yang berisi data biodata mahasiswa.
	 */
	bio: async () => {
		const r = await reqService('/onedevice/services/bio');
		const resp: IBio = await r.json();
		if (r.status == 200) mahasiswa.update(() => resp);
	},
	/**
	 * Mengambil data gambar hash dari request service /onedevice/services/ktm.
	 *
	 * @returns sebuah string gambar base64 jika request berhasil, atau null jika
	 * tidak.
	 */
	ktm: async () => {
		const r = await reqService('/onedevice/services/ktm');

		const resp = await r.json();
		return resp.status?.code == 200 ? `data:image/png;base64,${resp?.result?.hash}` : null;
	},
	/**
	 * Memanggil fungsi reqService untuk mengirim permintaan 'onedevice / services /
	 * initkhs' ke server.
	 * Kemudian, baca respons yang diterima sebagai JSON dan disimpan di variabel
	 * 'resp'.
	 * Jika status respons adalah 200, state 'initKhs' akan diperbarui dengan data
	 * yang dimasukkan dari resp.
	 */
	initkhs: async () => {
		const r = await reqService('/onedevice/services/initkhs');

		const resp: InitKHS = await r.json();
		if (r.status == 200) initKhs.update(() => resp);
	},
	/**
	 * Mengambil jadwal kuliah dengan parameter hari tertentu.
	 * Pencarian dilakukan dengan mengirim parameter ke server.
	 *
	 * @param hari - hari yang akan dicari dalam angka.
	 * @returns IJadwalKuliah[] dengan data jadwal kuliah jika berhasil, null jika
	 * gagal.
	 */
	jadwal: async (hari: number) => {
		const searchParams = new URLSearchParams();
		searchParams.set('hari', hari.toString());
		const r = await reqService('/onedevice/services/jadwal', searchParams);
		const resp: IJadwalKuliah[] = await r.json();
		if (r.status == 200) jadwal.update(() => resp);
	},
	/**
	 * Mengambil jadwal kuliah berdasarkan hari.
	 * Fungsi ini menggunakan URLSearchParams untuk mengirimkan parameter hari.
	 *
	 * @param hari - nomor untuk menyatakan hari.
	 * @returns jadwal kuliah untuk hari yang dipilih.
	 */
	jadwalMingguan: async (hari: number) => {
		const searchParams = new URLSearchParams();
		searchParams.set('hari', hari.toString());
		const r = await reqService('/onedevice/services/jadwal', searchParams);
		const resp: IJadwalKuliah[] = await r.json();
		return resp;
	},
	/**
	 * Mengambil data histori presensi berdasarkan semester dan tahun akademik.
	 * Data diambil melalui request ke layanan /onedevice/services/histori-presensi
	 * dengan parameter semester dan tahun_akademik.
	 *
	 * @param semester - semester yang akan dicari
	 * @param tahunAkademik - tahun akademik yang akan dicari
	 * @returns array of IPresence jika request berhasil, array kosong jika
	 * sebaliknya
	 */
	historiPresensi: async (semester: number, tahunAkademik: string) => {
		const searchParams = new URLSearchParams();
		searchParams.set('semester', semester.toString());
		searchParams.set('tahun_akademik', tahunAkademik);
		const r = await reqService('/onedevice/services/histori-presensi', searchParams);
		const resp: IPresence[] = await r.json();
		return r.status == 200 ? resp : [];
	},
	/**
	 * Mengambil detil presensi dari API OneDevice berdasarkan 'krsId'.
	 *
	 * @param krsId - id dari karyawan yang akan diambil presensinya.
	 * @returns array dari objek presensi detil jika berhasil, array kosong jika
	 * gagal.
	 */
	detailPresensi: async (krsId: number) => {
		const r = await reqService(`/onedevice/services/histori-presensi/${krsId}`);
		const resp: IPresenceDetail[] = await r.json();
		let results = r.status == 200 ? resp : [];
		results = results
			.map((d) => {
				// @ts-ignore
				d.TanggalMoment = moment(d.Tanggal);
				return d;
			})
			// @ts-ignore
			.sort((a, b) => b.TanggalMoment.unix() - a.TanggalMoment.unix());
		return results;
	},
	/**
	 * Fungsi yang digunakan untuk memuat dan memperbarui pengumuman.
	 * Fungsi ini melakukan permintaan ke layanan / onedevice / services /
	 * pengumuman
	 * dan mengembalikan respon berupa array Pengumuman jika statusnya adalah 200.
	 *
	 * @returns array Pengumuman jika berhasil, null jika gagal.
	 */
	pengumuman: async () => {
		const r = await reqService('/onedevice/services/pengumuman');
		const resp: Pengumuman[] = await r.json();
		if (r.status == 200) pengumuman.update(() => resp);
	},
	/**
	 * Melakukan request ke endpoint '/onedevice/services/transkrip' untuk
	 * mendapatkan sebuah transkrip nilai.
	 * Berhasil mendapatkan response akan mengupdate state transkripNilai dengan
	 * menggunakan data yang didapatkan.
	 */
	transkrip: async () => {
		const r = await reqService('/onedevice/services/transkrip');

		const resp: ITranskripNilai = await r.json();
		if (r.status == 200) transkripNilai.update(() => resp);
	},
	/**
	 * Mendapatkan data hasil studi untuk suatu semester dan tahun akademik tertentu
	 * dari server.
	 * Fungsi ini menggunakan URLSearchParams untuk membuat permintaan ke server dan
	 * mendapatkan respon yang diperlukan.
	 *
	 * @param semester - semester yang ingin dicari.
	 * @param tahunAkademik - tahun akademik yang ingin dicari.
	 * @returns data hasil studi dalam bentuk IHasilSemester.
	 */
	hasilStudi: async (semester: number, tahunAkademik: string) => {
		const searchParams = new URLSearchParams();
		searchParams.set('semester', semester.toString());
		searchParams.set('tahun_akademik', tahunAkademik);
		const r = await reqService('/onedevice/services/hasil-studi', searchParams);

		const resp: IHasilSemester = await r.json();
		if (r.status == 200) hasilStudiSemester.update(() => resp);
	},
	pembayaran: {
		/**
		 * Mendapatkan daftar bank yang didukung untuk metode pembayaran.
		 * Data diperoleh dari Endpoint ini.
		 * Data yang didapatkan disimpan dalam listBank.
		 * Jika listBank tidak kosong, maka data dari listBank yang akan dikembalikan.
		 * Jika listBank kosong, maka data akan diambil dari Endpoint.
		 *
		 * @returns Daftar nama bank yang didukung untuk metode pembayaran.
		 */
		bank: async () => {
			const getData = async () => {
				const r = await reqService('/onedevice/services/pembayaran/bank');
				const resp: string[] = await r.json();
				if (resp.length) listBank.update(() => resp);
				return resp;
			};
			let bank = get(listBank);
			if (bank.length) {
				getData();
				return bank;
			}
			bank = await getData();
			return bank;
		},
		histori: async () => {
			const getData = async () => {
				const r = await reqService('/onedevice/services/pembayaran/histori');
				const resp: string[] = await r.json();
				return resp;
			};
			console.log(await getData());
		}
	}
};
