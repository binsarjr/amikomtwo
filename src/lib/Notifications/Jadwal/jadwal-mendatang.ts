import { findJadwalSebelumWaktu } from '../../supports/utils'

addEventListener('message', (event) => {
	setInterval(() => {

		// ambil jadwal mendatang 30 menit sebelumnya
		const jadwal = findJadwalSebelumWaktu(event.data, 30, 'minutes');
		if (jadwal) {
			postMessage({
				id: JSON.stringify(jadwal),
				title: `${jadwal.MataKuliah} (Mendatang)`,
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
