import { MikomOneDevice } from '@binsarjr/apiamikomone';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const semester = parseInt(url.searchParams.get('semester')?.toString() || '');
	const tahunAkademik = url.searchParams.get('tahun_akademik')?.toString() || '';
	const response = await MikomOneDevice.Akademik.HasilSemester(
		access_token,
		apikey,
		semester,
		tahunAkademik
	);

	setHeaders({
		'cache-control': 'public,max-age=60'
	});
	return json(response);
};
