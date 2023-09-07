import type { IJadwalKuliah } from '$Amikom/typings/Response';
import moment from 'moment';

import Cheerio from 'cheerio';
import crypto from 'crypto';

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

export const findJadwalBerlangsung = (jadwal: IJadwalKuliah[]) => {
	return jadwal.find((jadwal) => {
		const now = new Date();
		if (jadwal.IdHari != now.getDay()) return false;

		const [mulai, selesai] = jadwal.Waktu.split('-', 2);

		const timeStart = moment();
		// @ts-ignore:L no types
		timeStart.set('hours', mulai.split(':')[0]);
		// @ts-ignore: no types
		timeStart.set('minutes', mulai.split(':')[1]);
		timeStart.set('seconds', 0);

		const timeEnd = moment();
		// @ts-ignore; no types
		timeEnd.set('hours', selesai.split(':')[0]);
		// @ts-ignore: no types
		timeEnd.set('minutes', selesai.split(':')[1]);
		timeEnd.set('seconds', 0);

		if (moment().isBetween(timeStart, timeEnd)) {
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

		const [mulai, selesai] = jadwal.Waktu.split('-', 2);

		const timeStart = moment();
		// @ts-ignore: no types
		timeStart.set('hours', mulai.split(':')[0]);
		// @ts-ignore: no types
		timeStart.set('minutes', mulai.split(':')[1]);
		timeStart.set('seconds', 0);

		const diff = timeStart.diff(moment(), type);
		if (diff > 0 && diff <= unit) {
			return jadwal;
		}
		return false;
	});
};

export const makeObjectCache = ({
	data,
	lastModified,
	maxAge
}: {
	data?: any;
	lastModified?: Date;
	maxAge: number;
}) => {
	const headers: any = {
		'Cache-Control': `public,max-age=${maxAge},must-revalidate`
	};

	if (data) {
		const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
		headers['ETag'] = etag;
		headers['Content-MD5'] = etag;
	}
	if (lastModified) headers['Last-Modified'] = lastModified.toString();

	return headers;
};

export const getMainContent = async (link: string) => {
	const resp = await fetch(link);
	const body = await resp.text();
	const $ = Cheerio.load(body);
	$(`.main-content a`).each((_, element) => {
		$(element).attr('target', '_blank');
	});

	return $('.main-content').html();
};
