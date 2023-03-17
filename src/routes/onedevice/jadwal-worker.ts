// const idWorker = writable<any>(0);

import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'
import moment from 'moment'

// if (get(idWorker) !== null) {
// 	clearInterval(idWorker as any);
// }

// const id = setInterval(() => {
// 	const jadwalSekarang = get(jadwal)
// 	console.log(jadwalSekarang)
// 	const now = new Date();
// 	if (now.getHours() == 7 && now.getMinutes() == 5 && now.getSeconds() == 0) {
// 		postMessage('');
// 	}
// 	console.log(now, get(idWorker))
// }, 1000);

// idWorker.set(id);

addEventListener('message', (event) => {
	setInterval(() => {
		const now = new Date();
		const jadwalHariIni = (event.data as IJadwalKuliah[]).filter(
			(val) => val.IdHari == now.getDay()
		);
		jadwalHariIni.map((jadwal) => {
			let [mulai, selesai] = jadwal.Waktu.split('-', 2);
			mulai = '10:30';
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

			let sisaWaktu = timeStart.diff(moment(), 'minutes');
			let waktuBerjalan = timeEnd.diff(moment(), 'minutes');
			if (sisaWaktu < 30) {
				if (waktuBerjalan <= 0) return;
				postMessage({
					id: jadwal.IdHari.toString() + jadwal.IdJam.toString() + jadwal.IdKuliah.toString(),
					title: `${jadwal.MataKuliah}`,
					timeout: timeEnd.diff(timeStart, 'milliseconds'),
					silent: sisaWaktu < 0,
					body: `
${jadwal.Ruang} ${!!jadwal.Keterangan ? '(' + jadwal.Keterangan + ')' : ''} 

Waktu: ${jadwal.Waktu}
Ruang: ${jadwal.Ruang}
Dosen: ${jadwal.NamaDosen}
					`.trim()
				});
			}
		});
	}, 1000);
});
