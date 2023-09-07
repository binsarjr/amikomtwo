import { requestAmikomOne } from '$Amikom/Supports/request';
import Tokenizer from '../Supports/Tokenizer';
import type { PageResponse, PinjamanBuku } from '../typings/Response';

export default {
	async Katalog(bearerToken: string) {
		const response = await requestAmikomOne
			.get(`https://ds.amikom.ac.id/api/amikomone/perpustakaan/catalog`, {
				headers: {
					Authorization: `Bearer ${bearerToken}`
				}
			})
			.json();
		return response;
	},
	async PinjamanAktif(bearerToken: string) {
		{
			const response = await requestAmikomOne
				.get(
					`https://ds.amikom.ac.id/api/amikomone/perpustakaan/${
						Tokenizer(bearerToken).npm
					}/pinjaman_aktif`,
					{
						headers: {
							Authorization: `Bearer ${bearerToken}`
						}
					}
				)
				.json<PageResponse<PinjamanBuku>>();
			return response;
		}
	},
	async HistoriPinjam(bearerToken: string) {
		const response = await requestAmikomOne
			.get(
				`https://ds.amikom.ac.id/api/amikomone/perpustakaan/${
					Tokenizer(bearerToken).npm
				}/histori_pinjam`,
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`
					}
				}
			)
			.json<PageResponse<PinjamanBuku>>();
		return response;
	}
};
