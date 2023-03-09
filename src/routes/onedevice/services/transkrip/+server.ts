import { MikomOneDevice } from '@binsarjr/apiamikomone';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const response = await MikomOneDevice.Akademik.HasilStudi(access_token, apikey);
	setHeaders({
		'cache-control': 'public,max-age=3600'
	});
	return json(response);
};
