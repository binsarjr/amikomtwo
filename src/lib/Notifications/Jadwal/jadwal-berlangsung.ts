import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'
import { findJadwalBerlangsung } from '../../supports/utils'

addEventListener('message', (event) => {
	setInterval(() => {
		const now = new Date();
		const jadwalHariIni = (event.data as IJadwalKuliah[]).filter(
			(val) => val.IdHari == now.getDay()
		);

		// ambil jadwal mendatang 30 menit sebelumnya
		const jadwal = findJadwalBerlangsung(jadwalHariIni);
		if (jadwal) {
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
