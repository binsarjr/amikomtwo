import { findJadwalSebelumWaktu } from '../../supports/utils'

addEventListener('message', (event) => {

	let id = '';
	setInterval(() => {
		// ambil jadwal mendatang 30 menit sebelumnya
		const jadwal = findJadwalSebelumWaktu(event.data, 30, 'minutes');
		if (jadwal) {
			if (id == JSON.stringify(jadwal)) return;
			id = JSON.stringify(jadwal);

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
