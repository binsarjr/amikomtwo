// const idWorker = writable<any>(0);

import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'
import { findJadwalSebelumWaktu } from '../../lib/supports/utils'

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
		// ambil jadwal yang waktunya 30 menit sebelumnya
		const jadwal = findJadwalSebelumWaktu(jadwalHariIni, 30,'minutes')
		if(jadwal)  {
postMessage({
					id: JSON.stringify(jadwal),
					title: `${jadwal.MataKuliah}`,
					body: `
${jadwal.Ruang} ${!!jadwal.Keterangan ? '(' + jadwal.Keterangan + ')' : ''} 

Waktu: ${jadwal.Waktu}
Ruang: ${jadwal.Ruang}
Dosen: ${jadwal.NamaDosen}
					`.trim()
				});
		}
	}, 1000);
});
