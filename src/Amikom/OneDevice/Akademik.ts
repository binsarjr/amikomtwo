import { requestAmikomOne } from '$Amikom/Supports/request';
import type { IHasilSemester, ITranskripNilai } from '../typings/Response';

/**
 * Hasil Studi atau Transkrip Nilai
 * @param bearerToken
 * @param xApiKey
 */
const HasilStudi = async (bearerToken: string, xApiKey: string) => {
	const resp: ITranskripNilai = await requestAmikomOne
		.post(`https://ds.amikom.ac.id/api/amikomone/academic/krs/hasil_studi`, {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'X-Api-Key': xApiKey
			}
		})
		.json();
	return resp;
};

const HasilSemester = async (
	bearerToken: string,
	xApiKey: string,
	semester: number,
	tahunAkademik: string
) => {
	const resp: IHasilSemester = await requestAmikomOne
		.post(`https://ds.amikom.ac.id/api/amikomone/academic/krs/hasil_semester`, {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'X-Api-Key': xApiKey
			},
			form: {
				semester,
				tahun_akademik: tahunAkademik
			}
		})
		.json();
	return resp;
};

export default {
	HasilSemester,
	HasilStudi
};
