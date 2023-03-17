import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'
import { findJadwalBerlangsung } from '../../supports/utils'

addEventListener('message', (event) => {
	let id = '';
	setInterval(() => {
		const now = new Date();
		const jadwalHariIni = (event.data as IJadwalKuliah[]).filter(
			(val) => val.IdHari == now.getDay()
		);

		// ambil jadwal mendatang 30 menit sebelumnya
		const jadwal = findJadwalBerlangsung(jadwalHariIni);
		if (jadwal) {
			if (id == JSON.stringify(jadwal)) return;
			id = JSON.stringify(jadwal);
			postMessage({
				id,
				title: `${jadwal.MataKuliah} (Berlangsung)`,
				body: `
${jadwal.JenisKuliah} ${!!jadwal.Keterangan ? '(' + jadwal.Keterangan + ')' : ''} 

Waktu: ${jadwal.Waktu}
Ruang: ${jadwal.Ruang}
Dosen: ${jadwal.NamaDosen}
					`.trim()
			});
		}
	}, 1000);
});
