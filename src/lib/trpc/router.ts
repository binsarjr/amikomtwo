import { pembayaranRouter } from '$lib/trpc/routes/pembayaran';
import { presensi } from '$lib/trpc/routes/presensi';
import { t } from '$lib/trpc/t';

export const router = t.router({
	presensi: presensi,
	masterProdi: t.procedure.query(async () => {
		const resp = await fetch('https://mhs.amikom.ac.id/api/support/master_prodi');
		const data = JSON.parse(await resp.text()) as {
			Kode: string;
			Nama: string;
		}[];

		return data;
	}),
	pembayaran: pembayaranRouter
});
