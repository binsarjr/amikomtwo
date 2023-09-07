import { json, type RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';
import { makeObjectCache } from '../../../../lib/supports/utils';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const resp = await MikomOneDevice.Mahasiswa.initKhs(access_token, apikey);
	setHeaders(
		makeObjectCache({
			data: resp,
			maxAge: 60 * 60 * 24 * 7
		})
	);
	return json(resp);
};
