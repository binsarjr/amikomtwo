import { requestAmikomOne } from '$Amikom/Supports/request';
import Tokenizer from '../Supports/Tokenizer';
import type { IBio, IJadwalKuliah, IMataKuliah, InitKHS } from '../typings/Response';
const JadwalKuliah = async (
	bearerToken: string,
	xApiKey: string,
	idHari?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | number
): Promise<IJadwalKuliah[]> => {
	const response: IJadwalKuliah[] = await requestAmikomOne
		.post('https://ds.amikom.ac.id/api/amikomone/academic/personal/jaku', {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'X-Api-Key': xApiKey
			}
		})
		.json();
	if ((idHari || idHari == 0) && !response.some((x) => x.IdHari === idHari)) return [];
	return response.filter((val) => {
		if (idHari) {
			return val.IdHari === idHari;
		}
		return true;
	});
};
const MataKuliah = async (bearerToken: string, xApiKey: string) => {
	const jadwal = await JadwalKuliah(bearerToken, xApiKey);

	const seens: string[] = [];
	const matkul: IMataKuliah[] = [];
	for (const m of jadwal) {
		const seen = m.Kode.toString() + m.IdKuliah.toString();
		if (!seens.includes(seen)) {
			seens.push(seen);
			matkul.push({
				IdKuliah: m.IdKuliah,
				Kode: m.Kode,
				MataKuliah: m.MataKuliah,
				JenisKuliah: m.JenisKuliah,
				Nik: m.Nik,
				NamaDosen: m.NamaDosen,
				Kelas: m.Kelas,
				EmailDosen: m.EmailDosen,
				Jenjang: m.Jenjang,
				ZoomURL: m.ZoomURL,
				IsZoomURL: m.IsZoomURL
			});
		}
	}
	return matkul;
};
const initKhs = async (bearerToken: string, xApiKey: string): Promise<InitKHS> =>
	requestAmikomOne
		.post('https://ds.amikom.ac.id/api/amikomone/academic/krs/prep_khs', {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'X-Api-Key': xApiKey
			}
		})
		.json();
const Bio = async (bearerToken: string, xApiKey: string): Promise<IBio> => {
	const response: IBio = await requestAmikomOne
		.post('https://ds.amikom.ac.id/api/amikomone/academic/personal/bio', {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'X-Api-Key': xApiKey
			}
		})
		.json();
	// @ts-ignore: no type
	delete response.Mhs['PassEmail'];
	const initkhs = await initKhs(bearerToken, xApiKey);
	const findSemester = initkhs.Semester.find((v) => v.Kode == response.PeriodeAkademik.Semester);
	response.PeriodeAkademik.SemesterFormat = findSemester?.Nama || '';

	return response;
};
const KtmDigital = (bearerToken: string, xApiKey: string) =>
	requestAmikomOne
		.get(
			`https://ds.amikom.ac.id/api/amikomone/mahasiswa/${Tokenizer(bearerToken).npm}/ktm_digital`,
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'X-Api-Key': xApiKey
				}
			}
		)
		.json();
export default {
	JadwalKuliah,
	initKhs,
	MataKuliah,
	Bio,
	KtmDigital
};
