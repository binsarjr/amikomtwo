import { json, type RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';
import { makeObjectCache } from '../../../../lib/supports/utils';
// import CryptoJs from 'crypto'

export const GET: RequestHandler = async ({ url, setHeaders, cookies }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const response = await MikomOneDevice.Akademik.HasilStudi(access_token, apikey);

	setHeaders(
		makeObjectCache({
			data: response,
			maxAge: 60 * 60
		})
	);

	return json(response);
};
