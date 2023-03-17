import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'
import moment from 'moment'

/**
 * Membuat sebuah fungsi yang dapat membuat pemanggilnya tertunda selama waktu
 * yang telah ditentukan.
 *
 * @param ms - waktu dalam miliseconds untuk berapa lama fungsi ini akan
 * menunggu.
 * @returns Promise yang akan dipanggil setelah waktu selesai.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mengembalikan sebuah bilangan acak yang berada diantara nilai minimum dan
 * maksimum.
 *
 * @param min - Nilai minimum.
 * @param max - Nilai maksimum.
 * @returns Bilangan acak antara min dan max.
 */
export const randomBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);


export const findJadwalBerlangsung = (
	jadwal: IJadwalKuliah[],
) => {
	return jadwal.find((jadwal) => {
		const now = new Date();
		if (jadwal.IdHari != now.getDay()) return false;

		let [mulai, selesai] = jadwal.Waktu.split('-', 2);
		mulai = '10:45';
		selesai = '11:30';

		let timeStart = moment();
		// @ts-ignore
		timeStart.set('hours', mulai.split(':')[0]);
		// @ts-ignore
		timeStart.set('minutes', mulai.split(':')[1]);
		timeStart.set('seconds', 0);

		let timeEnd = moment();
		// @ts-ignore
		timeEnd.set('hours', selesai.split(':')[0]);
		// @ts-ignore
		timeEnd.set('minutes', selesai.split(':')[1]);
		timeEnd.set('seconds', 0);

		if (moment().isBetween(timeStart,timeEnd)) {
			return jadwal;
		}
	});
};

export const findJadwalSebelumWaktu = (
	jadwal: IJadwalKuliah[],
	unit: number,
	type: 'minutes' | 'seconds'
) => {
	return jadwal.find((jadwal) => {
		const now = new Date();
		if (jadwal.IdHari != now.getDay()) return false;

		let [mulai, selesai] = jadwal.Waktu.split('-', 2);
		mulai = '10:45';
		selesai = '11:30';

		let timeStart = moment();
		// @ts-ignore
		timeStart.set('hours', mulai.split(':')[0]);
		// @ts-ignore
		timeStart.set('minutes', mulai.split(':')[1]);
		timeStart.set('seconds', 0);

		let timeEnd = moment();
		// @ts-ignore
		timeEnd.set('hours', selesai.split(':')[0]);
		// @ts-ignore
		timeEnd.set('minutes', selesai.split(':')[1]);
		timeEnd.set('seconds', 0);

		const diff = timeStart.diff(moment(), type);
		if (diff >= unit && diff > 0) {
			return jadwal;
		}
	});
};
